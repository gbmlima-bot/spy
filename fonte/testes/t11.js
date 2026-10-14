// The agent's missions use the gesture of the act (phone for a photo, glass for a toast...), a span that is not always 4 s,
// and the challenge of the act (arrow sequence, needle, steady hand) has to be solved before the act counts
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 800, height: 500 } });
  const p = await L.page(ctx, U);
  await p.evaluate(() => document.querySelector('#btnSoloA').click());
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 60000 });
  await p.evaluate(() => { const S = window.__mira.G.sim; S.t = 0.01; if (S.ai) S.ai.update = () => {}; });
  await p.waitForFunction(() => window.__mira.G.sim.ph === 'play', null, { timeout: 60000 });
  const M0 = await p.evaluate(() => { const M = window.__mira, S = M.G.sim; return S.ms.filter(o => !(S.ts && o === S.ts[0])).map(o => ({ o, g: M.MISSIONS[o].g, ga: M.MISSIONS[o].ga, label: M.MISSIONS[o].label })); });
  console.log('missions', JSON.stringify(M0));
  const res = [];
  for (const m of M0.slice(0, 3)) {
    const r = await p.evaluate(async (o) => {
      const M = window.__mira, S = M.G.sim, c = M.ctrl, mm = M.MISSIONS[o], pr = M.PROPS[mm.p];
      const e = S.ents[M.G.myEid]; c.path = []; c.goal = null; c.lk = null; c.pose = null; c.x = e.x = pr.s[0]; c.z = e.z = pr.s[1]; c.y = e.y = M.LVY(pr.lv); c.lv = e.lv = pr.lv;
      await new Promise(r => setTimeout(r, 300));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', code: 'KeyE' }));
      await new Promise(r => setTimeout(r, 400));
      const act = c.act && { o: c.act.o, d: +c.act.d.toFixed(2) }, anim = c.anim;
      const ch = c.act && c.act.ch, kind = ch && ch.k;
      const key = k => { window.dispatchEvent(new KeyboardEvent('keydown', { key: k })); window.dispatchEvent(new KeyboardEvent('keyup', { key: k })); };
      const frame = () => new Promise(r => requestAnimationFrame(() => r()));
      // software rendering runs a few frames a second: skip the minimum time, then solve the challenge like a player
      if (c.act) c.act.t = Math.max(c.act.t, M.GESTURES[mm.g].d[1]);
      let wrong = null;
      if (kind === 'seq') {
        // one wrong arrow first: it must undo a step, not finish anything
        const bad = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][(ch.keys[0] + 1) % 4]; key(bad); wrong = ch.i;
        for (const d of ch.keys) key(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][d]);
      } else if (kind === 'ponto') {
        const t1 = performance.now();
        while (c.act && performance.now() - t1 < 90000) { await frame(); if (!c.act) break; const x = 0.5 + 0.5 * Math.sin(ch.ph + c.act.t * ch.sp); if (Math.abs(x - ch.c) < ch.w * 0.35 && ch.miss <= 0) { key('e'); c.act && (c.act.t += 0.5); } }
      } else if (kind === 'calma') ch.p = 0.99;
      else if (kind === 'girar') for (let i = 0; i < ch.n; i++) key(i % 2 ? 'ArrowRight' : 'ArrowLeft');
      else if (kind === 'pulso') for (let h = 0; h < ch.need && c.act; h++) { c.act.t = (Math.floor(c.act.t / ch.per + ch.ph) + 1 - ch.ph) * ch.per; key('e'); }
      const mini = document.querySelector('#mini').innerHTML.slice(0, 80);
      const t0 = performance.now(); while (c.act && performance.now() - t0 < 90000) await new Promise(r => setTimeout(r, 100));
      return { act, anim, kind, wrong, mini, done: S.dn.includes(o), dn: S.dn.length };
    }, m.o);
    res.push(r); console.log(m.label, '|', m.g, 'anim', m.ga, '->', JSON.stringify(r));
  }
  // every kind of challenge, on decoy acts (props that are not the agent's): find one prop per kind for this round
  const kinds = await p.evaluate(() => { const M = window.__mira, st = M.G.sim.snapshot ? M.G.sim.snapshot() : null, rd = M.G.sim.round, S = M.G.sim, out = {};
    M.PROPS.forEach((P, pi) => { if (P.ms.some(o => S.ms.includes(o)) || (S.ts && pi === S.ts[1])) return; const o = M.missionAtProp(pi, { ms: S.ms, dn: S.dn, rd }); const k = M.makeChallenge(o, rd).k; if (!(k in out)) out[k] = { pi, o }; }); return out; });
  console.log('kinds', JSON.stringify(kinds));
  for (const k of ['seq', 'ponto', 'calma', 'girar', 'pulso']) {
    if (!kinds[k]) { console.log('sem', k); continue; }
    const r = await p.evaluate(async ({ pi, o, k }) => {
      const M = window.__mira, S = M.G.sim, c = M.ctrl, pr = M.PROPS[pi], e = S.ents[M.G.myEid];
      const key = q => { window.dispatchEvent(new KeyboardEvent('keydown', { key: q })); window.dispatchEvent(new KeyboardEvent('keyup', { key: q })); };
      const frame = () => new Promise(r => requestAnimationFrame(() => r()));
      c.path = []; c.goal = null; c.pose = null; c.x = e.x = pr.s[0]; c.z = e.z = pr.s[1]; c.y = e.y = M.LVY(pr.lv); c.lv = e.lv = pr.lv;
      await new Promise(r => setTimeout(r, 300)); key('e'); await frame(); await frame();
      const ch = c.act && c.act.ch; if (!ch) return { err: 'no act' };
      const seq0 = c.actSeq, res = { o: c.act.o, k: ch.k };
      c.act.t = 10; // past the minimum time
      await frame(); await frame(); res.notYet = !!c.act; // the challenge is not solved yet, so the act goes on
      res.mini = document.querySelector('#mini').hidden ? '' : document.querySelector('#mini').textContent.slice(0, 60);
      if (k === 'seq') { key(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][(ch.keys[0] + 1) % 4]); res.afterWrong = ch.i; for (const d of ch.keys) key(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][d]); }
      if (k === 'ponto') { const t1 = performance.now(); while (c.act && performance.now() - t1 < 90000) { await frame(); if (!c.act) break; if (Math.abs(0.5 + 0.5 * Math.sin(ch.ph + c.act.t * ch.sp) - ch.c) < ch.w * 0.35 && ch.miss <= 0) { key('e'); if (c.act) c.act.t += 0.5; } } }
      if (k === 'girar') { key('ArrowLeft'); key('ArrowLeft'); res.afterSame = ch.i; for (let i = 1; i < ch.n; i++) key(i % 2 ? 'ArrowRight' : 'ArrowLeft'); }
      if (k === 'pulso') { // off the beat breaks the streak; then three on the beat
        c.act.t = (Math.floor(c.act.t / ch.per + ch.ph) + 0.5 - ch.ph) * ch.per; key('e'); res.offBeat = ch.hits + (ch.miss > 0 ? 'm' : ''); ch.miss = 0;
        for (let h = 0; h < ch.need && c.act; h++) { c.act.t = (Math.floor(c.act.t / ch.per + ch.ph) + 1 - ch.ph) * ch.per; key('e'); } }
      if (k === 'calma') { // laser on the player: no progress; laser away: it fills
        S.ai && (S.ai.aim.set(c.x, c.y + 1.4, c.z)); for (let i = 0; i < 6; i++) await frame(); res.nearP = +ch.p.toFixed(2); res.near = ch.near;
        S.ai && S.ai.aim.set(c.x + 30, c.y, c.z + 30); ch.p = Math.max(ch.p, 0.98); }
      const t0 = performance.now(); while (c.act && performance.now() - t0 < 90000) await new Promise(r => setTimeout(r, 100));
      res.finished = c.actSeq === seq0 + 1; return res;
    }, { ...kinds[k], k });
    console.log('desafio', k, JSON.stringify(r)); res.push({ ch: r });
  }
  const base = res.filter(r => !r.ch), chs = res.filter(r => r.ch).map(r => r.ch);
  const ok = base.every((r, i) => r.act && r.act.o === M0[i].o && r.anim === M0[i].ga && r.done) && base.every(r => r.wrong === null || r.wrong === 0)
    && chs.length === 5 && chs.every(c => c.notYet && c.finished) && chs.every(c => c.k !== 'girar' || c.afterSame === 1) && chs.every(c => c.k !== 'pulso' || c.offBeat === '0m') && chs.every(c => c.k !== 'seq' || c.afterWrong === 0) && chs.every(c => c.k !== 'calma' || (c.near && c.nearP < 0.05)) && new Set(base.map(r => r.act.d)).size > 1;
  console.log(ok ? 'OK' : 'FALHOU');
  await b.close();
})();
