// Mission balance: whole rounds played by the computer (robot agent, 3 robot accomplices, AI sniper), simulated without
// drawing. Reports, per map, how often the agent wins, how many missions it completes, how long the missions take and how
// many people of the computer do mission gestures at objects per minute (the cover the agent hides in).
// node t10.js <url> [rounds per map] [maps, e.g. 0,3,7]
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
const N = +(process.argv[3] || 30), MAPS = (process.argv[4] || '0,1,5,9').split(',').map(Number);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  const p = await L.page(ctx, U);
  const all = [];
  for (const id of MAPS) {
    const r = await p.evaluate(({ id, N }) => {
      const M = window.__mira; M.loadMap(id);
      const out = { map: id, rounds: N, agentWins: 0, why: {}, done: 0, cover: 0, gestures: {}, durs: [], minutes: 0 };
      for (let k = 0; k < N; k++) {
        const guests = [{ bot: true, role: 'a' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }];
        const S = new M.Sim({ seed: 1000 + k * 7919 + id, guests, sniper: { ai: true }, map: id });
        S.ph = 'play'; S.t = M.ROUND_T;
        const dt = 0.1; let seen = new Set(), el = 0;
        while (S.ph === 'play') {
          S.tick(dt); el += dt;
          for (const e of S.ents) if (e.st === 'act' && e.kind !== 'static' && e.id !== S.agentId) { const key = e.id + ':' + e.obj; if (!seen.has(key)) { seen.add(key); out.cover++; } }
          if (S.ents.every(e => e.st !== 'act')) seen = new Set(); // a new visit counts again
        }
        out.minutes += el / 60; out.shotAt = (out.shotAt || 0) + (S.sh ? el : 0) / N;
        if (S.w === 'g') out.agentWins++;
        out.why[S.why] = (out.why[S.why] || 0) + 1; out.done += S.dn.length;
      }
      for (const m of M.MISSIONS) out.gestures[m.g] = (out.gestures[m.g] || 0) + 1;
      return out;
    }, { id, N });
    r.agentWinPct = Math.round(r.agentWins / N * 100); r.missionsPerRound = +(r.done / N).toFixed(2); r.coverPerMin = +(r.cover / r.minutes).toFixed(2); r.minutes = +r.minutes.toFixed(1); r.shotAt = Math.round(r.shotAt);
    delete r.durs; console.log(JSON.stringify(r)); all.push(r);
  }
  await b.close();
})();
