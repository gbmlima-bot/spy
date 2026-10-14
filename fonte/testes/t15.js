// A guest of the computer at a mission object makes way when a player comes close: finishes the gesture and leaves in a
// few seconds. Far from players, the guest keeps the object for its own time.
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  const p = await L.page(ctx, U);
  const r = await p.evaluate(() => {
    const M = window.__mira, out = [];
    for (const near of [true, false]) {
      const S = new M.Sim({ seed: 5, guests: [{ peer: 'pX', role: 'c', name: 'X' }], map: M.SCEN.id }); S.ph = 'play'; S.t = M.ROUND_T;
      const pl = S.ents.find(e => e.kind === 'player'), g = S.ents.find(e => e.kind === 'npc');
      const pi = 3, si = S.propSlot[pi], sl = S.slots[si], m = M.PROPS[pi];
      if (g.slot >= 0) S.slots[g.slot].busy = -1;
      Object.assign(g, { x: sl.x, z: sl.z, lv: m.lv, y: M.LVY(m.lv), slot: si, st: 'act', obj: m.ms[0], timer: 30, path: [] }); sl.busy = g.id;
      const far = near ? 1.0 : 9;
      Object.assign(pl, { x: sl.x + far, z: sl.z, y: M.LVY(m.lv), lv: m.lv });
      let left = -1; for (let t = 0; t < 12; t += 0.1) { S.tick(0.1); pl.x = sl.x + far; pl.z = sl.z; if (sl.busy !== g.id && left < 0) left = +t.toFixed(1); }
      out.push({ near, left, gSt: g.st });
    }
    return out;
  });
  console.log(JSON.stringify(r));
  const ok = r[0].left > 0 && r[0].left < 8 && r[1].left < 0;
  console.log(ok ? 'OK' : 'FALHOU');
  await b.close();
})();
