// The place's version of the challenges in the ten extra scenarios: every row of THEMES finds acts on its map, the acts
// it matches get its challenge (with its title) in about three rounds of four and the gesture's usual one otherwise,
// the parameters stay playable, and robots still finish them in a person's time.
// node t18.js <url>
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  const p = await L.page(ctx, U);
  const bad = [];
  for (let id = 1; id <= 10; id++) {
    const r = await p.evaluate(id => {
      const M = window.__mira; M.loadMap(id); const sc = M.SCEN.sc.id, rows = M.THEMES[sc] || [], out = { id: sc, rows: rows.length, dead: [], acts: 0, themed: 0, draws: 0, kinds: {}, slow: 0, odd: [] };
      rows.forEach(t => { if (!M.MISSIONS.some(m => t[0].test(m.label))) out.dead.push(t[2]); });
      M.MISSIONS.forEach((m, o) => { const th = rows.find(t => t[0].test(m.label)); if (!th) return; out.acts++;
        for (let rd = 1; rd <= 40; rd++) { const ch = M.makeChallenge(o, rd); out.draws++;
          if (ch.tt) { out.themed++; out.kinds[ch.k] = (out.kinds[ch.k] || 0) + 1; if (ch.k !== th[1] || ch.tt !== th[2]) out.odd.push(m.label); }
          if ((ch.keys && ch.keys.length > 6) || (ch.n && ch.n > 12) || (ch.per && ch.per < 0.65) || (ch.w && ch.w < 0.14)) out.odd.push(m.label + ' (difícil demais)');
          const rng = (() => { let s = rd * 97 + o; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
          if (M.botActTime(o, rd, rng) > 25) out.slow++; } });
      out.share = out.draws ? +(out.themed / out.draws).toFixed(2) : 0; return out; }, id);
    console.log(JSON.stringify(r));
    if (r.rows < 6) bad.push(r.id + ': poucos temas');
    if (r.dead.length) bad.push(r.id + ': temas sem ato ' + r.dead.join(', '));
    if (r.share < 0.6 || r.share > 0.9) bad.push(r.id + ': proporção ' + r.share);
    if (r.odd.length) bad.push(r.id + ': ' + [...new Set(r.odd)].slice(0, 3).join(', '));
    if (r.slow > r.draws * 0.02) bad.push(r.id + ': robôs lentos ' + r.slow);
    if (Object.keys(r.kinds).length < 3) bad.push(r.id + ': só ' + Object.keys(r.kinds).join('/'));
  }
  console.log(bad.length ? 'FALHOU ' + bad.join('; ') : 'OK');
  await b.close();
})();
