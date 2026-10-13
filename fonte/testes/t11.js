// The agent's missions use the gesture of the act (phone for a photo, glass for a toast...) and a span that is not always 4 s
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 800, height: 500 } });
  const p = await L.page(ctx, U);
  await p.evaluate(() => document.querySelector('#btnSoloA').click());
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 60000 });
  await p.evaluate(() => { const S = window.__mira.G.sim; S.t = 0.01; if (S.ai) S.ai.update = () => {}; });
  await p.waitForFunction(() => window.__mira.G.sim.ph === 'play', null, { timeout: 60000 });
  const M0 = await p.evaluate(() => { const M = window.__mira, S = M.G.sim; return S.ms.map(o => ({ o, g: M.MISSIONS[o].g, ga: M.MISSIONS[o].ga, label: M.MISSIONS[o].label })); });
  console.log('missions', JSON.stringify(M0));
  const res = [];
  for (const m of M0.slice(0, 4)) {
    const r = await p.evaluate(async (o) => {
      const M = window.__mira, S = M.G.sim, c = M.ctrl, mm = M.MISSIONS[o], pr = M.PROPS[mm.p];
      const e = S.ents[M.G.myEid]; c.path = []; c.goal = null; c.lk = null; c.pose = null; c.x = e.x = pr.s[0]; c.z = e.z = pr.s[1]; c.y = e.y = M.LVY(pr.lv); c.lv = e.lv = pr.lv;
      await new Promise(r => setTimeout(r, 300));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', code: 'KeyE' }));
      await new Promise(r => setTimeout(r, 400));
      const act = c.act && { o: c.act.o, d: +c.act.d.toFixed(2) }, anim = c.anim;
      // software rendering runs a few frames a second: skip most of the wait, the last frames still finish the act
      if (c.act) c.act.t = Math.max(c.act.t, c.act.d - 0.1);
      const t0 = performance.now(); while (c.act && performance.now() - t0 < 60000) await new Promise(r => setTimeout(r, 100));
      return { act, anim, done: S.dn.includes(o), dn: S.dn.length };
    }, m.o);
    res.push(r); console.log(m.label, '|', m.g, 'anim', m.ga, '->', JSON.stringify(r));
  }
  const ok = res.every((r, i) => r.act && r.act.o === M0[i].o && r.anim === M0[i].ga && r.done) && new Set(res.map(r => r.act.d)).size > 1;
  console.log(ok ? 'OK' : 'FALHOU');
  await b.close();
})();
