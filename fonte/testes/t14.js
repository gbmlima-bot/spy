// Two-step mission: one of the agent's missions only counts after the parcel is fetched from another object. Delivering
// first does not count, fetching leaves no trace for the sniper, then the delivery counts; robots fetch first too.
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 800, height: 500 } });
  const p = await L.page(ctx, U);
  await p.evaluate(() => document.querySelector('#btnSoloA').click());
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 60000 });
  const brief = await p.evaluate(() => document.querySelector('#brief').innerText);
  await p.evaluate(() => { const S = window.__mira.G.sim; S.t = 0.01; if (S.ai) S.ai.update = () => {}; });
  await p.waitForFunction(() => window.__mira.G.sim.ph === 'play', null, { timeout: 60000 });
  // stand at a prop, press E, solve whatever challenge comes up, wait for the act to end
  const doAct = pi => p.evaluate(async pi => {
    const M = window.__mira, S = M.G.sim, c = M.ctrl, pr = M.PROPS[pi], e = S.ents[M.G.myEid];
    const key = q => { window.dispatchEvent(new KeyboardEvent('keydown', { key: q })); window.dispatchEvent(new KeyboardEvent('keyup', { key: q })); };
    const frame = () => new Promise(r => requestAnimationFrame(() => r()));
    const seen = []; const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => seen.push(n.textContent)))); mo.observe(document.querySelector('#toasts'), { childList: true });
    c.act = null; c.path = []; c.goal = null; c.pose = null; c.x = e.x = pr.s[0]; c.z = e.z = pr.s[1]; c.y = e.y = M.LVY(pr.lv); c.lv = e.lv = pr.lv;
    await new Promise(r => setTimeout(r, 300));
    const it = M.nearInteraction(M.G.sim.state()); key('e'); await frame(); await frame();
    const a = c.act; if (!a) return { err: 'no act', it };
    const ch = a.ch; a.t = 10;
    if (ch.k === 'seq') for (const d of ch.keys) key(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][d]);
    if (ch.k === 'ponto') { const t1 = performance.now(); while (c.act && performance.now() - t1 < 90000) { await frame(); if (!c.act) break; if (Math.abs(0.5 + 0.5 * Math.sin(ch.ph + c.act.t * ch.sp) - ch.c) < ch.w * 0.35 && ch.miss <= 0) { key('e'); if (c.act) c.act.t += 0.5; } } }
    if (ch.k === 'calma') ch.p = 0.99;
    const t0 = performance.now(); while (c.act && performance.now() - t0 < 90000) await new Promise(r => setTimeout(r, 100));
    await frame(); await frame(); mo.disconnect();
    return { label: it && it.label, o: a.o, dn: S.dn.slice(), got: S.got, tells: S.tq.length + S.tells.length, toast: seen.join(' | '), note: (document.querySelector('#tsNote') || {}).textContent || '' };
  }, pi);
  const info = await p.evaluate(() => { const M = window.__mira, S = M.G.sim; return { ts: S.ts, pickWhere: S.ts && M.PROPS[S.ts[1]].where, deliver: S.ts && M.MISSIONS[S.ts[0]].label, dProp: S.ts && M.MISSIONS[S.ts[0]].p, note: (document.querySelector('#tsNote') || {}).textContent }; });
  console.log('brief menciona a encomenda:', /pegue a encomenda/.test(brief), JSON.stringify(info));
  const r1 = await doAct(info.dProp); console.log('entregar antes de pegar', JSON.stringify(r1));
  const r2 = await doAct(info.ts[1]); console.log('pegar', JSON.stringify(r2));
  const r3 = await doAct(info.dProp); console.log('entregar', JSON.stringify(r3));
  const lg = await p.evaluate(() => window.__mira.G.sim.lg);
  // robots: an all-robot round on the rooftop, the robot agent must fetch before it delivers
  const bots = await p.evaluate(() => { const M = window.__mira, out = { rounds: 0, fetchedFirst: 0, delivered: 0, deliveredBeforeFetch: 0 };
    for (let k = 0; k < 15; k++) { const S = new M.Sim({ seed: 77 + k * 31, guests: [{ bot: true, role: 'a' }, { bot: true, role: 'c' }], sniper: { ai: true }, map: M.SCEN.id }); S.ph = 'play'; S.t = M.ROUND_T; S.ai.update = () => {};
      let tFetch = -1, tDel = -1; while (S.ph === 'play') { S.tick(0.1); if (S.got && tFetch < 0) tFetch = S.time; if (S.ts && S.dn.includes(S.ts[0]) && tDel < 0) tDel = S.time; }
      out.rounds++; if (tFetch >= 0) out.fetchedFirst++; if (tDel >= 0) { out.delivered++; if (tFetch < 0 || tDel < tFetch) out.deliveredBeforeFetch++; } }
    return out; });
  console.log('robôs', JSON.stringify(bots));
  const ok = /pegue a encomenda/.test(brief) && info.ts && !r1.dn.includes(info.ts[0]) && !r1.got && /Pegue a encomenda antes/.test(r1.toast) && r2.label === 'Pegar a encomenda' && r2.got && r2.tells === r1.tells && /Encomenda na mão/.test(r2.toast) && /encomenda na mão/.test(r2.note)
    && r3.dn.includes(info.ts[0]) && lg.some(l => l[3] === 2) && bots.deliveredBeforeFetch === 0 && bots.fetchedFirst > 0;
  if (!ok) console.log('detalhe', JSON.stringify({ r1, r1got: r1.got, r2: [r2.label, r2.got, r2.tells, r1.tells, r2.toast, r2.note], r3: r3.dn, lg2: lg.some(l => l[3] === 2), bots }));
  console.log(ok ? 'OK' : 'FALHOU');
  await b.close();
})();
