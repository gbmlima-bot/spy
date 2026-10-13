// mock of window.claude.use('room') across tabs of the same origin via BroadcastChannel
(() => {
  const me = 'p' + Math.random().toString(36).slice(2, 8);
  const ch = new BroadcastChannel('mockroom');
  const rooms = {};
  function Room(name) {
    const peers = new Map(); let mine = null; const cbs = new Set();
    const fire = () => cbs.forEach(f => { try { f(); } catch (e) { console.error(e); } });
    ch.addEventListener('message', ev => { const m = ev.data; if (m.room !== name) return;
      if (m.t === 'pres') { peers.set(m.peer, m.p); fire(); }
      else if (m.t === 'leave') { peers.delete(m.peer); fire(); }
      else if (m.t === 'hello' && mine) ch.postMessage({ room: name, t: 'pres', peer: me, p: mine }); });
    addEventListener('pagehide', () => ch.postMessage({ room: name, t: 'leave', peer: me }));
    const r = {
      async presence(patch) { mine = Object.assign({}, mine || {}, patch); ch.postMessage({ room: name, t: 'pres', peer: me, p: mine }); fire(); },
      peers() { const out = [...peers].map(([peer, p]) => ({ peer, presence: p, sameTab: false })); if (mine) out.push({ peer: me, presence: mine, sameTab: true }); return out; },
      onPeers(f) { cbs.add(f); return () => cbs.delete(f); },
      async leave() { mine = null; ch.postMessage({ room: name, t: 'leave', peer: me }); },
    };
    ch.postMessage({ room: name, t: 'hello' });
    return r;
  }
  window.__mockLeave = () => { for (const k in rooms) rooms[k].leave(); ch.close(); };
  window.claude = { use: async (cap) => ({ join: async (n) => (rooms[n] = rooms[n] || Room(n)) }) };
})();
