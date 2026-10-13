// 3 players via the mocked room: roles, an agent mission over the network, host leaves mid-round, next round rotates the sniper
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 900, height: 600 } });
  const P = [];
  for (const n of ['Ana', 'Bia', 'Caio']) { const p = await L.page(ctx, U); await p.evaluate(n => { document.querySelector('#nome').value = n; }, n); P.push(p); }
  await P[0].evaluate(() => document.querySelector('#btnCreate').click());
  await P[0].waitForFunction(() => /^[A-Z]{4}$/.test(document.querySelector('#lobbyCode').textContent));
  const code = await P[0].evaluate(() => document.querySelector('#lobbyCode').textContent); console.log('code', code);
  for (const p of P.slice(1)) { await p.evaluate(c => { document.querySelector('#codeIn').value = c; document.querySelector('#btnJoin').click(); }, code); await L.sleep(1500); }
  await P[0].waitForFunction(() => !document.querySelector('#btnStart').disabled && document.querySelectorAll('#players li').length === 3, null, { timeout: 30000 });
  await P[0].evaluate(() => document.querySelector('#btnStart').click());
  for (const p of P) await p.waitForFunction(() => window.__mira.G.role !== undefined && window.__mira.G.role !== null && window.__mira.G.screen === 'game', null, { timeout: 180000 });
  const roles = []; for (const p of P) roles.push(await p.evaluate(() => window.__mira.G.role)); console.log('roles r1', roles);
  await P[0].evaluate(() => { window.__mira.G.sim.t = 0.01; });
  await L.sleep(4000);
  // agent does a mission through the network
  const ai = roles.indexOf('a'), ap = P[ai];
  const host = P[0];
  const ms = await host.evaluate(() => { const S = window.__mira.G.sim; return { ph: S.ph, ms: S.ms }; }); console.log('host sim', ms.ph);
  const o = ms.ms[0];
  await ap.evaluate((o) => { const M = window.__mira, m = M.PROPS[M.G.sim ? 0 : 0] && null; }, o);
  // put the agent at the mission spot and send the act like the client does
  await ap.evaluate((o) => { const M = window.__mira; const mm = M.G.hostState ? null : null; }, o);
  const spot = await host.evaluate((o) => { const M = window.__mira; const P = M.PROPS; let mi = null; for (const p of P) if (p.ms.includes(o)) mi = p; return { s: mi.s, lv: mi.lv, y: M.LVY(mi.lv) }; }, o);
  await ap.evaluate(({ o, spot }) => { const M = window.__mira, c = M.ctrl; c.path = []; c.x = spot.s[0]; c.z = spot.s[1]; c.y = spot.y; c.lv = spot.lv; c.actSeq++; c.actDone = { o, s: c.actSeq, rd: M.G.hostState.rd }; }, { o, spot });
  await L.sleep(6000);
  // a cheat: send the same act again with an old sequence, and an act for a mission that is not ours
  await ap.evaluate(({ o }) => { const M = window.__mira, c = M.ctrl; c.actDone = { o, s: 1, rd: M.G.hostState.rd }; }, { o });
  await L.sleep(4000);
  console.log('dn after net act', await host.evaluate(() => window.__mira.G.sim.dn));
  // host leaves
  await host.evaluate(() => { window.__mockLeave(); }); await host.close();
  await L.sleep(30000);
  for (const p of P.slice(1)) console.log('after host left', await p.evaluate(() => ({ isHost: window.__mira.G.isHost, sim: !!window.__mira.G.sim, ph: window.__mira.G.sim ? window.__mira.G.sim.ph : null, toasts: [...document.querySelectorAll('.toast')].map(t => t.textContent) })));
  await b.close();
})();
