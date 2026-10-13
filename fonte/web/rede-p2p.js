// Mira na Cobertura fora do claude.ai: substitui window.claude.use('room') por uma rede
// ponto a ponto (WebRTC via PeerJS). O jogo só usa presença: join(nome) -> sala com
// presence(patch), peers(), onPeers(fn) e leave(). Cada sala tem um "centro" (hub) com
// identificador fixo derivado do código; o primeiro navegador que o reserva passa a
// retransmitir a presença de todos. Se o centro cai, outro navegador o reserva.
// Servidor de sinalização: o público do PeerJS, ou o definido em window.MIRA_NET.
(() => {
  if (window.claude && window.claude.use) return; // dentro do claude.ai, usa o original
  const CFG = Object.assign({ prefix: 'miracob11', debug: 0 }, window.MIRA_NET || {});
  const peerOpts = () => { const o = { debug: CFG.debug }; for (const k of ['host', 'port', 'path', 'secure', 'key', 'config']) if (CFG[k] !== undefined) o[k] = CFG[k]; return o; };
  const HB = 1000, DEAD = 12000, TICK = 50;
  const log = (...a) => { (window.__netlog = window.__netlog || []).push(((performance.now() / 1000) | 0) + 's ' + a.join(' ')); if (window.__netlog.length > 200) window.__netlog.shift(); };
  const safe = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

  let mePromise = null;
  function myPeer() {
    if (mePromise) return mePromise;
    mePromise = new Promise((res, rej) => {
      if (!window.Peer) return rej(new Error('peerjs ausente'));
      const p = new window.Peer(CFG.prefix + 'u' + Math.random().toString(36).slice(2, 10), peerOpts());
      p.on('open', () => res(p));
      p.on('error', e => { if (e.type === 'unavailable-id' || e.type === 'invalid-id' || e.type === 'peer-unavailable') return; if (!p.open) rej(e); });
      p.on('disconnected', () => { try { if (!p.destroyed) p.reconnect(); } catch (e) { } });
      addEventListener('pagehide', () => { try { p.destroy(); } catch (e) { } });
    });
    return mePromise;
  }

  function Room(name, me) {
    const myId = me.id, base = CFG.prefix + 'h' + safe(name);
    const map = new Map();           // peer id -> presence (o que o centro anunciou)
    let mine = {}, joined = false, left = false;
    const cbs = new Set();
    const fire = () => cbs.forEach(f => { try { f(); } catch (e) { console.error(e); } });

    // ---- papel de centro
    let hub = null, hubConns = new Map(), hubPres = new Map(), hubSeen = new Map(), hubTimer = 0, hubIdx = 0;
    // a presença é estado (vale o último valor), então o que sai é juntado e enviado em lotes
    // curtos; se uma conexão está lenta, os lotes dela crescem em vez de formar fila
    const outq = new Map();          // conexão -> { m: {id: patch}, x: Set }
    const q = c => { let o = outq.get(c); if (!o) outq.set(c, o = { m: {}, x: new Set() }); return o; };
    function hubQueue(id, patch) { for (const c of hubConns.values()) if (c.peer !== id) { const o = q(c); o.m[id] = Object.assign(o.m[id] || {}, patch); } }
    function hubQueueDrop(id) { for (const c of hubConns.values()) { const o = q(c); delete o.m[id]; o.x.add(id); } }
    function hubFlush(hb) {
      for (const c of hubConns.values()) {
        if (!c.open) continue; const o = outq.get(c), busy = c.dataChannel && c.dataChannel.bufferedAmount > 65536;
        if (o && !busy && (o.x.size || Object.keys(o.m).length)) { try { const msg = { t: 'U', m: o.m, x: [...o.x] }; if (CFG.debug) { const st = window.__netstat = window.__netstat || { sent: 0, max: 0, busy: 0 }; const n = JSON.stringify(msg).length; st.sent += n; st.max = Math.max(st.max, n); } c.send(msg); } catch (e) { } outq.delete(c); }
        else if (busy && CFG.debug) { const st = window.__netstat = window.__netstat || { sent: 0, max: 0, busy: 0 }; st.busy++; }
        else if (hb && !busy) try { c.send({ t: 'hb' }); } catch (e) { }
      }
    }
    function hubUpdate(id, patch) {
      const cur = Object.assign({}, hubPres.get(id) || {}, patch); hubPres.set(id, cur);
      hubQueue(id, patch);
      if (id !== myId) { map.set(id, Object.assign({}, map.get(id) || {}, patch)); fire(); }
    }
    function hubDrop(id, why) {
      log('centro remove', id.slice(-4), why || '');
      const c = hubConns.get(id); hubConns.delete(id); hubSeen.delete(id);
      try { if (c) c.close(); } catch (e) { } if (c) outq.delete(c);
      if (hubPres.delete(id)) { hubQueueDrop(id); map.delete(id); fire(); }
    }
    function becomeHub(p, idx) {
      log('sou o centro'); hub = p; hubIdx = idx; mode = 'hub'; clearTimeout(connTimer);
      // quem o centro já conhecia continua na lista até reconectar ou expirar
      hubPres = new Map([[myId, mine]]); hubSeen = new Map();
      const now = Date.now(); for (const [id, pr] of map) { hubPres.set(id, pr); hubSeen.set(id, now - DEAD / 2); }
      p.on('connection', c => {
        c.on('open', () => {
          const old = hubConns.get(c.peer); if (old && old !== c) try { old.close(); } catch (e) { }
          hubConns.set(c.peer, c); hubSeen.set(c.peer, Date.now()); outq.delete(c);
          c.send({ t: 'all', hub: myId, m: Object.fromEntries(hubPres) });
        });
        c.on('data', d => {
          if (!d || typeof d !== 'object') return; hubSeen.set(c.peer, Date.now());
          if (d.t === 'p' && d.p && typeof d.p === 'object') { if (d.full) { hubPres.set(c.peer, {}); } hubUpdate(c.peer, d.p); }
          else if (d.t === 'bye') hubDrop(c.peer, 'saiu');
        });
        c.on('close', () => { if (hubConns.get(c.peer) === c) hubDrop(c.peer, 'fechou'); });
        c.on('error', () => { });
      });
      p.on('disconnected', () => { try { if (!p.destroyed) p.reconnect(); } catch (e) { } });
      clearInterval(hubTimer);
      let tick = 0;
      hubTimer = setInterval(() => {
        const hb = ++tick % (HB / TICK) === 0; hubFlush(hb);
        if (hb) { const now = Date.now(); for (const [id, at] of hubSeen) if (now - at > DEAD) hubDrop(id, 'silêncio'); }
      }, TICK);
      fire();
    }

    // ---- papel de participante
    let mode = 'idle', conn = null, lastHub = 0, connTimer = 0, hbTimer = 0, hubHolder = null;
    let up = null, upFull = false;
    function sendUp(msg) {
      if (mode === 'hub') { if (msg.t === 'p') hubUpdate(myId, msg.p); return; }
      if (msg.t === 'p') { up = Object.assign(up || {}, msg.p); return; }
      if (conn && conn.open) try { conn.send(msg); } catch (e) { }
    }
    function flushUp() {
      if (mode !== 'client' || !up || !conn || !conn.open) return;
      if (conn.dataChannel && conn.dataChannel.bufferedAmount > 65536) return;
      try { conn.send(upFull ? { t: 'p', p: up, full: 1 } : { t: 'p', p: up }); up = null; upFull = false; } catch (e) { }
    }

    function connect(idx) {
      if (left) return;
      const id = base + 'x' + idx;
      const h = new window.Peer(id, peerOpts());
      let settled = false;
      h.on('open', () => { settled = true; becomeHub(h, idx); });
      h.on('error', e => {
        if (settled) return; settled = true; try { h.destroy(); } catch (x) { }
        if (e.type === 'unavailable-id') asClient(idx); else setTimeout(() => connect(idx), 1500);
      });
    }
    function asClient(idx) {
      if (left) return;
      mode = 'client'; log('cliente de', idx);
      const c = me.connect(base + 'x' + idx, { reliable: true, serialization: 'json' });
      conn = c; let ok = false;
      clearTimeout(connTimer);
      connTimer = setTimeout(() => { if (!ok && conn === c) { try { c.close(); } catch (e) { } conn = null; connect(0); } }, 8000);
      c.on('open', () => { log('conectado ao centro'); ok = true; clearTimeout(connTimer); lastHub = Date.now(); up = Object.assign({}, mine); upFull = true; flushUp(); });
      c.on('data', d => {
        if (!d || typeof d !== 'object') return; lastHub = Date.now();
        if (d.t === 'all') { hubHolder = d.hub; map.clear(); for (const [id, pr] of Object.entries(d.m || {})) if (id !== myId) map.set(id, pr); fire(); }
        else if (d.t === 'U') {
          for (const id of d.x || []) map.delete(id);
          for (const [id, p] of Object.entries(d.m || {})) if (id !== myId) map.set(id, Object.assign({}, map.get(id) || {}, p));
          fire();
        }
      });
      const lost = why => {
        if (conn !== c || left) return; log('perdi o centro', why); conn = null; clearTimeout(connTimer);
        // quem segurava o centro saiu; os demais disputam o mesmo identificador
        if (hubHolder && map.delete(hubHolder)) fire();
        hubHolder = null; setTimeout(() => connect(0), 300 + Math.random() * 900);
      };
      c.on('close', () => lost('fechou')); c.on('error', e => lost('erro ' + (e && e.type)));
      c.__lost = lost;
    }
    let ctick = 0;
    hbTimer = setInterval(() => {
      flushUp();
      if (++ctick % (HB / TICK) === 0 && mode === 'client' && conn && conn.open) { if (!up) sendUp({ t: 'hb' }); if (Date.now() - lastHub > DEAD) conn.__lost('silêncio'); }
    }, TICK);

    const room = {
      async presence(patch) {
        if (left || !patch || typeof patch !== 'object') return;
        mine = Object.assign({}, mine, patch);
        if (!joined) { joined = true; connect(0); }
        sendUp({ t: 'p', p: patch });
        fire();
      },
      peers() {
        const out = [];
        for (const [peer, presence] of map) out.push({ peer, presence, sameTab: false, isMe: false, kind: 'viewer', guest: false, by: null });
        if (joined && !left) out.push({ peer: myId, presence: mine, sameTab: true, isMe: true, kind: 'viewer', guest: false, by: null });
        return out;
      },
      onPeers(f) { cbs.add(f); return () => cbs.delete(f); },
      connected() { return mode === 'hub' || !!(conn && conn.open); },
      async leave() {
        if (left) return; left = true;
        try { sendUp({ t: 'bye' }); } catch (e) { }
        clearInterval(hbTimer); clearInterval(hubTimer); clearTimeout(connTimer);
        setTimeout(() => { try { if (conn) conn.close(); } catch (e) { } try { if (hub) hub.destroy(); } catch (e) { } }, 150);
        map.clear(); cbs.clear(); delete rooms[name];
      },
    };
    addEventListener('pagehide', () => { if (!left) { try { sendUp({ t: 'bye' }); } catch (e) { } try { if (hub) hub.destroy(); } catch (e) { } } });
    return room;
  }

  const rooms = {};
  const lobby = {
    async join(name) { const me = await myPeer(); return rooms[name] || (rooms[name] = Room(name, me)); },
    // o jogo só usa o saguão para entrar em salas; isto cobre o caminho de reserva dele
    async presence() { }, peers() { return []; }, onPeers() { return () => { }; }, async leave() { },
  };
  window.claude = {
    async use(cap) {
      if (cap !== 'room') return null;
      // espera a sinalização por até 20 s; se ainda estiver só lenta, entra assim mesmo (join aguarda)
      try { await Promise.race([myPeer(), new Promise(r => setTimeout(r, 20000))]); return lobby; }
      catch (e) { console.warn('multijogador indisponível:', e); return null; }
    },
  };
})();
