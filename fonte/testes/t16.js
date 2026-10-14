// How long an efficient agent needs for 4 missions, per map: walking routes at a player's speed (stairs included), the
// mini-challenge of each act solved at a person's pace (botActTime), a moment for a guest to make way at each object, and
// the parcel of the two-step mission picked up first. "best" plans the best 4 of the 6 in the best order; "greedy" always
// heads for the nearest pending mission, like a person who does not plan. The sniper is left out.
// node t16.js <url> [rounds per map] [maps, e.g. 0,3,7]
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
const N = +(process.argv[3] || 40), MAPS = (process.argv[4] || '0,1,2,3,4,5,6,7,8,9,10').split(',').map(Number);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  const p = await L.page(ctx, U);
  const rows = [];
  for (const id of MAPS) {
    const r = await p.evaluate(({ id, N }) => {
      const M = window.__mira; M.loadMap(id);
      const SPEED = 1.5, CLIMB = SPEED * 1.35, YIELD = 1.5;
      const guests = [{ bot: true, role: 'a' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }];
      const walkT = (a, b) => { if (a.k === b.k) return 0; let t = 0, x = a.x, z = a.z;
        for (const w of M.route(a.x, a.z, a.lv, b.x, b.z, b.lv)) {
          if (w.link) { const Lk = M.LINKS[w.li]; t += ((Lk && Lk.len) || M.LINK_LEN) / CLIMB; const e = w.link > 0 ? Lk.top : Lk.base; x = e[0]; z = e[1]; continue; }
          t += Math.hypot(w[0] - x, w[1] - z) / SPEED; x = w[0]; z = w[1]; }
        return t; };
      const best = [], greedy = [], walkShare = [];
      for (let k = 0; k < N; k++) {
        const S = new M.Sim({ seed: 3000 + k * 7919 + id, guests, sniper: { ai: true }, map: id });
        const a = S.ents[S.agentId], rng = S.rng;
        const at = pi => { const s = S.slots[S.propSlot[pi]]; return s ? { k: 'p' + pi, x: s.x, z: s.z, lv: s.lv } : { k: 'p' + pi, x: M.PROPS[pi].s[0], z: M.PROPS[pi].s[1], lv: M.PROPS[pi].lv }; };
        const start = { k: 'start', x: a.x, z: a.z, lv: a.lv };
        // each mission is a list of stops: the parcel first for the delivery of the two-step one
        const stops = o => (S.ts && o === S.ts[0] ? [[S.ts[1], M.PROPS[S.ts[1]].ms[0]]] : []).concat([[M.MISSIONS[o].p, o]]);
        const memo = new Map(); const wt = (u, v) => { const key = u.k + '>' + v.k; if (!memo.has(key)) memo.set(key, walkT(u, v)); return memo.get(key); };
        const actT = {}; for (const o of S.ms) for (const [, m] of stops(o)) actT[m] = M.botActTime(m, S.round, rng) + YIELD;
        const cost = (order) => { let t = 0, w = 0, here = start; for (const o of order) for (const [pi, m] of stops(o)) { const d = wt(here, at(pi)); w += d; t += d + actT[m]; here = at(pi); } return [t, w]; };
        let bt = 1e9, bw = 0;
        const perm = (left, pre) => { if (pre.length === 4) { const [t, w] = cost(pre); if (t < bt) { bt = t; bw = w; } return; } for (const o of left) perm(left.filter(x => x !== o), pre.concat(o)); };
        perm(S.ms.slice(), []);
        best.push(bt); walkShare.push(bw / bt);
        let here = start, left = S.ms.slice(), order = [];
        while (order.length < 4) { const o = left.slice().sort((x, y) => wt(here, at(stops(x)[0][0])) - wt(here, at(stops(y)[0][0])))[0]; order.push(o); left = left.filter(x => x !== o); here = at(M.MISSIONS[o].p); }
        greedy.push(cost(order)[0]);
      }
      const q = (v, f) => { const s = v.slice().sort((x, y) => x - y); return Math.round(s[Math.min(s.length - 1, Math.floor(s.length * f))]); };
      return { map: id, best: { med: q(best, 0.5), p90: q(best, 0.9), max: q(best, 1) }, greedy: { med: q(greedy, 0.5), p90: q(greedy, 0.9), max: q(greedy, 1), over210: greedy.filter(t => t > 210).length }, walkPct: Math.round(walkShare.reduce((x, y) => x + y, 0) / N * 100) };
    }, { id, N });
    console.log(JSON.stringify(r)); rows.push(r);
  }
  await b.close();
})();
