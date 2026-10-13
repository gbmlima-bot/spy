// 3 players: a teleporting agent and a forged shot are refused by the host; a fair shot still counts; host leaving still works
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/test-new.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 800, height: 520 } });
  const P = [];
  for (const n of ['Ana', 'Bia', 'Caio']) { const p = await L.page(ctx, U); await p.evaluate(n => { document.querySelector('#nome').value = n; }, n); P.push(p); }
  await P[0].evaluate(() => document.querySelector('#btnCreate').click());
  await P[0].waitForFunction(() => /^[A-Z]{4}$/.test(document.querySelector('#lobbyCode').textContent));
  const code = await P[0].evaluate(() => document.querySelector('#lobbyCode').textContent);
  for (const p of P.slice(1)) { await p.evaluate(c => { document.querySelector('#codeIn').value = c; document.querySelector('#btnJoin').click(); }, code); await L.sleep(1500); }
  await P[0].waitForFunction(() => !document.querySelector('#btnStart').disabled && document.querySelectorAll('#players li').length === 3, null, { timeout: 30000 });
  const host = P[0];
  const round = async () => {
    for (const p of P) await p.waitForFunction(() => window.__mira.G.role && window.__mira.G.screen === 'game' && window.__mira.G.hostState !== undefined, null, { timeout: 240000 }).catch(() => {});
    await host.evaluate(() => { window.__mira.G.sim.t = 0.01; }); await L.sleep(5000);
    const roles = []; for (const p of P) roles.push(await p.evaluate(() => window.__mira.G.role)); return roles;
  };
  await host.evaluate(() => document.querySelector('#btnStart').click());
  let roles = await round(); console.log('round 1 roles', roles);
  const ap = P[roles.indexOf('a')];
  const info = await host.evaluate(() => { const M = window.__mira, S = M.G.sim, o = S.ms[0]; let pr = null; for (const p of M.PROPS) if (p.ms.includes(o)) pr = p; const e = S.ents[S.agentId]; return { o, s: pr.s, lv: pr.lv, y: M.LVY(pr.lv), from: [e.x, e.z, e.y], ph: S.ph }; });
  const far = Math.hypot(info.s[0] - info.from[0], info.s[1] - info.from[1]); console.log('mission', info.o, 'distance', far.toFixed(1), 'ph', info.ph);
  await ap.evaluate(({ info }) => { const M = window.__mira, c = M.ctrl; c.path = []; c.x = info.s[0]; c.z = info.s[1]; c.y = info.y; c.lv = info.lv; c.actSeq++; c.actDone = { o: info.o, s: c.actSeq, rd: M.G.hostState.rd }; }, { info });
  await L.sleep(8000);
  console.log('teleport act -> dn', await host.evaluate(() => window.__mira.G.sim.dn), 'agent pos on host', await host.evaluate(() => { const S = window.__mira.G.sim, e = S.ents[S.agentId]; return [e.x.toFixed(1), e.z.toFixed(1), (e.y || 0).toFixed(1)]; }));
  // fair: the host already has the agent standing there (as if it walked), then the act counts
  await host.evaluate(({ info }) => { const S = window.__mira.G.sim, e = S.ents[S.agentId]; e.x = info.s[0]; e.z = info.s[1]; e.y = info.y; e.lv = info.lv; }, { info });
  await ap.evaluate(({ info }) => { const M = window.__mira, c = M.ctrl; c.actSeq++; c.actDone = { o: info.o, s: c.actSeq, rd: M.G.hostState.rd }; }, { info });
  await L.sleep(8000);
  console.log('fair act -> dn', await host.evaluate(() => window.__mira.G.sim.dn));
  // round 2: the sniper is Bia (not the host)
  await host.evaluate(() => { const S = window.__mira.G.sim; S.end('g', 'time'); }); await L.sleep(4000);
  await host.evaluate(() => document.querySelector('#btnNext').click());
  await L.sleep(3000); roles = await round(); console.log('round 2 roles', roles);
  const sp = P[roles.indexOf('s')];
  const ag = await host.evaluate(() => { const S = window.__mira.G.sim, e = S.ents[S.agentId]; return { id: S.agentId, x: e.x, y: e.y || 0, z: e.z }; });
  // forged: shoots the agent by id while the scope points somewhere else
  await sp.evaluate(({ ag }) => { const M = window.__mira; M.snip.aim.set(ag.x + 15, 0, ag.z - 10); M.Net.set({ shot: { rd: M.G.hostState.rd, e: ag.id }, aim: [Math.round((ag.x + 15) * 20), 0, Math.round((ag.z - 10) * 20)] }); }, { ag });
  await L.sleep(8000);
  console.log('forged shot -> host ph', await host.evaluate(() => window.__mira.G.sim.ph));
  // fair: aim on a visible guest, then shoot him
  const tgt = await host.evaluate(() => { const M = window.__mira, S = M.G.sim; const T = THREE; const rc = new T.Raycaster();
    for (const e of S.ents) { if (e.dead || e.kind !== 'npc' || e.lv !== 0) continue; const tg = new T.Vector3(e.x, (e.y || 0) + 1.2, e.z), d = tg.clone().sub(M.SNIPER_POS); const dist = d.length(); rc.set(M.SNIPER_POS, d.normalize()); rc.far = dist; const h = rc.intersectObjects(window.__mira.SCEN.id ? [] : [], true)[0]; e.st = 'idle'; e.timer = 999; e.path = []; return { id: e.id, x: e.x, y: e.y || 0, z: e.z }; } });
  await sp.evaluate(({ t }) => { const M = window.__mira; const d = new THREE.Vector3(t.x, t.y + 1.2, t.z).sub(M.SNIPER_POS).normalize(); M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.scoped = true; M.snip.hold = true; }, { t: tgt });
  await L.sleep(6000);
  console.log('sniper sees', await sp.evaluate(() => window.__mira.crosshairHit()), 'target', tgt.id);
  await sp.evaluate(({ t }) => { const M = window.__mira; M.Net.set({ shot: { rd: M.G.hostState.rd, e: t.id } }); }, { t: tgt });
  await L.sleep(8000);
  console.log('fair shot -> ', await host.evaluate(() => { const S = window.__mira.G.sim; return { ph: S.ph, why: S.why, sc: S.sc }; }));
  await b.close();
})();
