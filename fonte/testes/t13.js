// Missions of the ten extra scenarios: each object has its own visible change, two acts that leave something on the object
// itself (on its surface when it has one in reach) and one left on the floor. Checks the acts, where the items land, that
// every item shows up, and how long each map takes to build. Captures one scenario with all the items out.
const L = require('./lib'); const OUT = __dirname + '/out/'; require('fs').mkdirSync(OUT, { recursive: true });
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1100, height: 640 } });
  const p = await L.page(ctx, U);
  let ok = true;
  for (let id = 1; id <= 10; id++) {
    const r = await p.evaluate(id => {
      const M = window.__mira, t0 = performance.now(); M.loadMap(id); const ms = Math.round(performance.now() - t0);
      const sc = M.SCEN.sc, own = M.SCEN_ACTS[sc.id] || {}, bad = [], gest = {}; let onSurf = 0, items = 0;
      M.PROPS.forEach(P => {
        const want = (own[P.key] || []).map(a => a[0]);
        if (P.acts.length !== 4) bad.push(P.key + ': ' + P.acts.length + ' atos');
        for (const w of want) if (!P.acts.some(a => a[0] === w)) bad.push(P.key + ': falta ' + w);
        P.acts.slice(1).forEach(([label, fx]) => {
          const d = Math.hypot(fx.at[0] - P.l[0], fx.at[2] - P.l[1]); items++;
          if (fx.at[1] > 0.2) onSurf++;
          if (want.includes(label) && fx.at[1] > 0.2 && d > 0.75) bad.push(P.key + ': item longe do objeto (' + d.toFixed(2) + ' m) ' + label);
          if (fx.at[1] < 0 || fx.at[1] > 1.6) bad.push(P.key + ': altura ' + fx.at[1].toFixed(2));
        });
      });
      for (const m of M.MISSIONS) gest[m.g] = (gest[m.g] || 0) + 1;
      // every item appears where it should
      M.MISSIONS.forEach((m, i) => { if (m.fx.k === 'spawn') M.applyTell(i, false); });
      const shown = Object.values(M.SPAWNED).filter(o => o.visible).length;
      const own2 = M.PROPS.flatMap(P => P.acts.filter(a => (own[P.key] || []).some(o => o[0] === a[0]))); const ownSurf = own2.filter(a => a[1].at[1] > 0.2).length;
      return { id: sc.id, ownSurf: ownSurf + '/' + own2.length, ms, props: M.PROPS.length, missions: M.MISSIONS.length, onSurf, items, shown, gest, bad };
    }, id);
    if (r.bad.length || r.shown < r.items) ok = false;
    console.log(JSON.stringify(r));
    if (id === 2 || id === 9) { await p.screenshot({ path: OUT + 'cenario-atos-' + id + '.png', timeout: 180000 }); }
  }
  console.log(ok ? 'OK' : 'FALHOU');
  await b.close();
})();
