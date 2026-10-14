// Accomplices: points of their own for the laser on them and for being in the sniper's notebook (capped per round, added to
// the score at the end), one distraction per round that the radio hears like a real mission (a change no mission of the
// agent's makes), all kept across the network state and a change of host; robot accomplices use theirs; a person playing
// an accomplice arms it with G and it goes off on the next fake mission, with its own row in the moments of the round.
// node t19.js <url>
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
const bad = [];
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 900, height: 560 } });
  const p = await L.page(ctx, U);
  // 1. the rules, straight on the simulation
  const r1 = await p.evaluate(() => {
    const M = window.__mira; M.loadMap(0);
    const S = new M.Sim({ seed: 4242, guests: [{ peer: 'pa', role: 'a' }, { peer: 'pc', role: 'c' }, { peer: 'pd', role: 'c' }, { peer: 'pe', role: 'c' }], sniper: { peer: 'ps' }, map: 0 });
    S.ph = 'play'; S.t = M.ROUND_T; const id = S.pm.pc, e = S.ents[id];
    for (let i = 0; i < 260; i++) { S.laser = { x: e.x + 0.3, y: e.y + 1.3, z: e.z }; S.tick(0.1); } // 26 s with the laser on them
    const afterLaser = S.lu[id].slice();
    S.laser = { x: e.x + 5, y: e.y + 1.3, z: e.z }; S.mk = [id]; for (let i = 0; i < 210; i++) S.tick(0.1); // 21 s marked, laser away
    const afterMark = S.lu[id].slice();
    // a distraction at an object of the accomplice's level
    const pi = M.PROPS.findIndex(P => P.ms.length > 1), P = M.PROPS[pi];
    e.x = P.s[0]; e.z = P.s[1]; e.y = M.LVY(P.lv); e.lv = P.lv;
    const tq0 = S.tq.length, t0 = S.tells.length;
    S.completeAct(id, P.ms[0], true); const q = S.tq[S.tq.length - 1];
    const again = (S.completeAct(id, P.ms[0], true), S.tq.length);
    for (let i = 0; i < 70; i++) S.tick(0.1);
    const heard = S.tells.slice(t0);
    // over the network and to a new host
    const st = S.state(), g = JSON.parse(JSON.stringify(M.encodeState(st))), d = M.decodeState(g);
    const A = M.adoptSim(d);
    S.end('g', 'time');
    return { pts: M.lurePts(S.lu[id]), afterLaser, afterMark, sc: S.sc, tqGrew: S.tq.length >= 0 && q && q.obj, fakeIsMission: S.ms.includes(q && q.obj), once: again === tq0 + 1, heard, dz: S.dz, lg: S.lg.filter(r => r[1] === id), net: { lu: d.lu[id], dz: d.dz }, adopted: A && { lu: A.lu[id], dz: A.dz } };
  });
  console.log('regras', JSON.stringify(r1));
  if (!(r1.afterLaser[0] > 25 && r1.afterLaser[1] === 0)) bad.push('laser não contou');
  if (!(r1.afterMark[1] > 20 && r1.afterMark[0] < 27)) bad.push('caderno não contou');
  if (r1.pts !== 2) bad.push('teto de 2 pontos');
  if (r1.sc.pc !== 3 || r1.sc.pa !== 1 || r1.sc.pd !== 1 || r1.sc.ps) bad.push('placar no fim: ' + JSON.stringify(r1.sc));
  if (r1.fakeIsMission) bad.push('despiste usou missão do agente');
  if (!r1.once) bad.push('despiste mais de uma vez');
  if (!r1.heard.includes(r1.tqGrew)) bad.push('rádio não ouviu o despiste');
  if (!r1.lg.some(r => r[3] === 3)) bad.push('momento do despiste não registrado');
  if (!r1.net.lu || r1.net.lu[0] !== Math.floor(r1.afterMark[0]) || !r1.net.dz.length) bad.push('estado de rede sem isca');
  if (!r1.adopted || r1.adopted.lu[0] !== r1.net.lu[0] || r1.adopted.dz.length !== r1.net.dz.length) bad.push('troca de anfitrião perde isca');
  // 2. robot accomplices use theirs, against the computer sniper, over whole rounds
  const r2 = await p.evaluate(() => {
    const M = window.__mira; let used = 0, rounds = 0, fakeHeard = 0;
    for (let k = 0; k < 6; k++) {
      M.loadMap(k % 3); const S = new M.Sim({ seed: 900 + k * 31, guests: [{ bot: true, role: 'a' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }], sniper: { ai: true }, map: k % 3 });
      S.ph = 'play'; S.t = M.ROUND_T; for (let i = 0; i < 3000 && S.ph === 'play'; i++) S.tick(0.1);
      rounds++; used += S.dz.length; fakeHeard += S.tells.filter(o => !S.ms.includes(o)).length;
    }
    M.loadMap(0); return { rounds, used, fakeHeard };
  });
  console.log('robôs', JSON.stringify(r2));
  if (!r2.used) bad.push('robôs nunca despistam');
  // 3. a person playing an accomplice: G arms it, the next fake mission sets it off
  const r3 = await p.evaluate(async () => {
    const M = window.__mira, G = M.G, c = M.ctrl;
    const key = q => { window.dispatchEvent(new KeyboardEvent('keydown', { key: q })); window.dispatchEvent(new KeyboardEvent('keyup', { key: q })); };
    const frame = () => new Promise(r => requestAnimationFrame(() => r()));
    const seen = []; const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => seen.push(n.textContent)))); mo.observe(document.querySelector('#toasts'), { childList: true });
    Object.assign(G, { multi: false, solo: 'cumplice', isHost: true, screen: 'game' }); document.querySelector('#menu').hidden = true; M.loadMap(0);
    G.sim = new M.Sim({ seed: 777, round: 1, guests: [{ peer: 'local', name: 'Eu', role: 'c' }, { bot: true, role: 'a' }, { bot: true, role: 'c' }], sniper: { ai: true }, map: 0 });
    G.sim.ph = 'play'; G.sim.t = M.ROUND_T; if (G.sim.ai) G.sim.ai.update = () => {};
    for (let i = 0; i < 20; i++) await frame();
    const S = G.sim, e = S.ents[G.myEid], card = document.querySelector('#roleCard').innerText;
    key('g'); await frame(); const armed = c.dzArm, cardArmed = (document.querySelector('#lureCardBtn') || {}).textContent;
    const pi = M.PROPS.findIndex(P => P.lv === 0 && P.ms.length > 1 && !P.ms.some(o => S.ms.includes(o))), P = M.PROPS[pi];
    c.act = null; c.path = []; c.goal = null; c.pose = null; c.x = e.x = P.s[0]; c.z = e.z = P.s[1]; c.y = e.y = M.LVY(P.lv); c.lv = e.lv = P.lv;
    await new Promise(r => setTimeout(r, 300));
    key('e'); await frame(); await frame();
    const a = c.act; if (!a) return { err: 'no act', role: G.role };
    const ch = a.ch; a.t = 10;
    if (ch.k === 'seq') for (const d of ch.keys) key(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][d]);
    if (ch.k === 'ponto') for (let h = 0; h < ch.need && c.act; h++) { const b = Math.asin(2 * ch.c - 1), now = c.act.t * ch.sp + ch.ph; const k = Math.floor((now - b) / (2 * Math.PI) + 1e-6) + 1; c.act.t = (b + 2 * Math.PI * k - ch.ph) / ch.sp; key('e'); }
    if (ch.k === 'calma') { if (S.ai) S.ai.aim.set(c.x + 30, c.y, c.z + 30); ch.p = 0.99; }
    if (ch.k === 'girar') for (let i = 0; i < ch.n; i++) key(i % 2 ? 'ArrowRight' : 'ArrowLeft');
    if (ch.k === 'pulso') for (let h = 0; h < ch.need && c.act; h++) { c.act.t = (Math.floor(c.act.t / ch.per + ch.ph + 1e-6) + 1 - ch.ph) * ch.per; key('e'); }
    const t0 = performance.now(); while (c.act && performance.now() - t0 < 60000) await new Promise(r => setTimeout(r, 100));
    for (let i = 0; i < 5; i++) await frame();
    const dz = S.dz.slice(), tq = S.tq.map(q => q.obj), usedBtn = (document.querySelector('#lureCardBtn') || {}).textContent;
    key('g'); await frame(); const reArm = c.dzArm;
    S.end('g', 'time'); for (let i = 0; i < 10; i++) await frame();
    mo.disconnect();
    return { role: G.role, card, armed, cardArmed, ch: ch.k, dz, me: G.myEid, tq, usedBtn, reArm, toasts: seen.join(' | '), moments: (document.querySelector('#moments') || {}).innerText || '' };
  });
  console.log('jogador', JSON.stringify(r3));
  if (r3.role !== 'c' || !/pontos de isca/i.test(r3.card)) bad.push('cartão do cúmplice sem isca');
  if (!r3.armed || !/armado/i.test(r3.cardArmed || '')) bad.push('G não armou');
  if (!r3.dz || !r3.dz.includes(r3.me)) bad.push('despiste do jogador não aconteceu');
  if (!/Despiste feito/.test(r3.toasts)) bad.push('sem aviso de despiste');
  if (!/usado/i.test(r3.usedBtn || '') || r3.reArm) bad.push('despiste rearmável');
  if (!/despiste/i.test(r3.moments)) bad.push('momentos sem despiste');
  console.log(bad.length ? 'FALHOU: ' + bad.join('; ') : 'OK');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
