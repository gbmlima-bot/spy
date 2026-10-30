// Exhaustive catalog regression. Real input handlers and completion logic; the clock and player placement are
// controlled so every mission/challenge can be covered. Navigation is checked separately from those placements.
const L = require('./lib'), fs = require('fs'), assert = require('assert/strict');
const U = process.argv[2] || 'http://127.0.0.1:8874/';
const OUT = __dirname + '/out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await L.launch(), rows = [], errors = [];
  try {
    for (const touch of [false, true]) {
      const ctx = await b.newContext({ viewport: touch ? { width: 390, height: 780 } : { width: 1280, height: 800 }, isMobile: touch, hasTouch: touch });
      const p = await L.page(ctx, U); p.on('pageerror', e => errors.push(e.message));
      await p.locator('#btnSoloA').click();
      await p.waitForFunction(() => window.__mira.G.sim, null, { polling: 100 });
      for (let id = 0; id <= 10; id++) {
        const row = await p.evaluate(({ id, touch }) => {
          const M = window.__mira, G = M.G, c = M.ctrl;
          M.loadMap(id);
          const S = new M.Sim({ seed: 12345, round: 1, guests: [{ peer: 'local', name: 'Audit', role: 'a' }], sniper: { peer: 'observer', name: 'Observer' }, map: id });
          Object.assign(G, { sim: S, solo: 'a', multi: false, isHost: true, screen: 'game', role: 'a', myEid: S.pm.local });
          const e = S.ents[G.myEid], spawn = { x: e.x, z: e.z, lv: e.lv };
          for (const q of S.ents) if (q !== e) { q.timer = 1e9; q.path = []; q.st = 'idle'; q.todo = []; }
          S.yieldT = 1e9;
          const bad = [], nav = [], routeSamples = [], click = [], cases = [], inventory = [], types = {};
          const check = (ok, msg) => { if (!ok) bad.push(msg); };
          const key = k => { window.dispatchEvent(new KeyboardEvent('keydown', { key: k })); window.dispatchEvent(new KeyboardEvent('keyup', { key: k })); };
          const state = () => { S._st = null; return S.state(); };
          const frame = (dt = .05) => M.updateLocal(dt, state());
          const place = pi => {
            const P = M.PROPS[pi];
            Object.assign(c, { act: null, pose: null, lk: null, settle: null, path: [], goal: null, vx: 0, vz: 0, x: P.s[0], z: P.s[1], y: M.LVY(P.lv), lv: P.lv });
            Object.assign(e, { x: c.x, z: c.z, y: c.y, lv: c.lv, dead: false, anim: 0 });
            frame(0);
          };
          const reset = (o, rd, role = 'a') => {
            S.round = rd; S.ms = [o]; S.dn = []; S.tells = []; S.tq = []; S.lg = []; S.ts = null; S.got = false;
            S.ph = 'play'; S.t = 300; S.ru = null; S.dz = []; G.role = role; e.role = role === 'a' ? 'agent' : 'acc';
            c.dzArm = false; M.resetProps(); place(M.MISSIONS[o].p);
          };
          const start = () => touch ? document.querySelector('#actBtn').click() : key('e');
          const input = (k, d) => {
            if (!touch) return key(k);
            const b = document.querySelector(d === undefined ? '#actBtn' : '#mini button[data-d="' + d + '"]');
            check(!!b && !b.hidden, 'missing touch input ' + k); if (b) b.click();
          };
          const solve = () => {
            const a = c.act; if (!a) return;
            const ch = a.ch;
            frame(0); // draw the controls before sending inputs
            if (ch.k === 'seq') for (const d of ch.keys) { input(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][d], d); frame(0); }
            if (ch.k === 'girar') for (let i = 0; i < ch.n; i++) { const d = i % 2 ? 2 : 0; input(d ? 'ArrowRight' : 'ArrowLeft', d); frame(0); }
            // Advance the challenge clock to successive valid needle/beat windows. Hits still go through input handlers.
            if (ch.k === 'ponto') for (let i = 0; i < ch.need && c.act; i++) {
              const base = Math.asin(2 * ch.c - 1), k = Math.floor((a.t * ch.sp + ch.ph - base) / (Math.PI * 2) + 1e-6) + 1;
              a.t = (base + Math.PI * 2 * k - ch.ph) / ch.sp; input('e');
            }
            if (ch.k === 'pulso') for (let i = 0; i < ch.need && c.act; i++) {
              a.t = (Math.floor(a.t / ch.per + ch.ph + 1e-6) + 1 - ch.ph) * ch.per; input('e');
            }
            for (let i = 0; c.act && i < 1000; i++) frame(.05);
          };
          S.ph = 'play';
          M.PROPS.forEach((P, pi) => {
            check(P.ms.length > 0, 'empty prop ' + pi);
            if (M.blocked(...P.s, .28, P.lv)) nav.push({ pi, key: P.key, reason: 'blocked stand', s: P.s });
            let x = spawn.x, z = spawn.z, lv = spawn.lv, collisions = 0;
            for (const w of M.route(x, z, lv, ...P.s, P.lv)) {
              if (w.link) { const q = M.LINKS[w.li]; lv = w.link > 0 ? q.lo + 1 : q.lo; [x, z] = w.link > 0 ? q.top : q.base; continue; }
              const n = Math.ceil(Math.hypot(w[0] - x, w[1] - z) / .1);
              for (let j = 1; j <= n; j++) if (M.blocked(x + (w[0] - x) * j / n, z + (w[1] - z) * j / n, .28, lv)) collisions++;
              [x, z] = w;
            }
            if (collisions) routeSamples.push({ pi, key: P.key, collisions });
            reset(P.ms[0], 1);
            // Walk the route with the real local movement/collision/stair controller. Exclude other guests' temporary
            // occupancy for this geometry check; those guests remain present for the interaction/completion checks.
            Object.assign(c, { x: spawn.x, z: spawn.z, lv: spawn.lv, y: M.LVY(spawn.lv), tlv: P.lv, stuck: 0, lastD: 1e9, detours: 0,
              path: M.route(spawn.x, spawn.z, spawn.lv, ...P.s, P.lv), goal: { k: 'mission', x: P.s[0], z: P.s[1], dl: .9 } });
            let steps = 0;
            while (!c.act && (c.path.length || c.lk) && steps++ < 6000) { const st = state(); M.updateLocal(.05, { ...st, ents: st.ents.filter(q => q.id === e.id) }); }
            if (!c.act || c.act.o !== P.ms[0]) nav.push({ pi, key: P.key, reason: 'walk did not start mission', steps, at: [c.x, c.z, c.lv], target: P.s, act: c.act && c.act.o });
            reset(P.ms[0], 1);
            for (const [at, q] of [['object', P.l], ['stand', P.s]]) {
              const it = M.interactAt(...q, P.lv, state());
              if (!it || it.k !== 'mission' || Math.hypot(it.x - P.s[0], it.z - P.s[1]) > .01) click.push({ pi, key: P.key, at, got: it });
            }
          });
          M.MISSIONS.forEach((m, o) => {
            check(m.p >= 0 && M.PROPS[m.p].ms.includes(o), 'prop mapping ' + o);
            check(m.label && m.where && m.s.every(Number.isFinite) && m.l.every(Number.isFinite), 'invalid target ' + o);
            const rounds = new Map();
            for (let rd = 1; rd <= 80; rd++) { const ch = M.makeChallenge(o, rd); if (!rounds.has(ch.k)) rounds.set(ch.k, rd); }
            inventory.push({ o, label: m.label, where: m.where, prop: m.p, key: M.PROPS[m.p].key, gesture: m.g, challenges: [...rounds.keys()] });
            for (const [kind, rd] of rounds) {
              reset(o, rd); const seq = c.actSeq; start();
              const actual = c.act && { o: c.act.o, kind: c.act.ch.k };
              check(actual && actual.o === o && actual.kind === kind, 'start ' + o + '/' + kind + ': ' + JSON.stringify(actual));
              if (!actual || actual.o !== o || actual.kind !== kind) continue;
              solve();
              check(!c.act && c.actSeq === seq + 1 && S.dn.includes(o), 'completion ' + o + '/' + kind);
              check(S.tq.some(q => q.obj === o), 'missing tell ' + o + '/' + kind);
              check(S.lg.some(q => q[2] === o && q[3] === 1), 'missing real log ' + o + '/' + kind);
              cases.push({ o, kind, rd, done: S.dn.includes(o) }); types[kind] = (types[kind] || 0) + 1;
            }
            const effect = fx => {
              if (Array.isArray(fx)) return fx.forEach(effect);
              check(!!fx && !!fx.k, 'missing effect ' + o); if (!fx) return;
              if (fx.h) check(M.resolveH(fx.h).length > 0, 'unresolved effect target ' + o + ': ' + fx.h);
              if (fx.k === 'scen') check(!!M.SCEN.K.tells[fx.key], 'missing scenario effect ' + o + ': ' + fx.key);
              if (fx.k === 'spawn') check(fx.at.every(Number.isFinite) && !!fx.item, 'invalid spawned item ' + o);
            };
            effect(m.fx); M.resetProps(); M.applyTell(o, false);
            if (m.fx.k === 'spawn') check(Object.entries(M.SPAWNED).some(([k, q]) => k.endsWith('#' + o) && q.visible && q.children.length > 0), 'item not displayed ' + o);
          });
          // Every prop also offers a completeable decoy and a one-use distraction for the accomplice.
          let decoys = 0;
          M.PROPS.forEach((P, pi) => {
            reset(P.ms[0], 2, 'c'); c.dzArm = true;
            const offered = M.missionAtProp(pi, state()); start(); solve();
            check(!c.act && S.dn.length === 0 && S.lg.some(q => q[2] === offered || q[3] === 3), 'decoy ' + pi);
            check(S.dz.includes(e.id), 'distraction ' + pi); decoys++;
          });
          // Parcel cannot be delivered before collection, and completion must count only the delivery.
          reset(M.PROPS[1].ms[0], 3); const delivery = S.ms[0], pickup = 0;
          S.ts = [delivery, pickup]; place(M.MISSIONS[delivery].p);
          check(M.missionAtProp(M.MISSIONS[delivery].p, state()) !== delivery, 'delivery offered before pickup');
          place(pickup); start(); check(c.act && c.act.fetch, 'pickup label'); solve();
          check(S.got && S.dn.length === 0, 'pickup progress');
          place(M.MISSIONS[delivery].p); start(); solve(); check(S.dn.includes(delivery), 'delivery completion');
          if (id === 10) {
            const signs = []; M.SCEN.root.traverse(q => { if (q.userData.tableNumber) signs.push(q); });
            check(signs.length === 4 && signs.map(q => q.userData.tableNumber).sort().join() === '1,2,3,4', 'four numbered tables');
            for (const q of signs) check(q.material.map && q.geometry.parameters.width >= .3, 'legible table sign ' + q.name);
            const P = M.PROPS.find(q => q.key === 'abajur'), sign = signs.find(q => q.userData.tableNumber === 3);
            check(P.where.endsWith('mesa 3') && sign && Math.abs(sign.position.x - P.l[0]) < .01, 'table 3 mission matches sign');
          }
          return { id, touch, props: M.PROPS.length, missions: M.MISSIONS.length, cases, types, decoys, bad, nav, routeSamples, click, inventory };
        }, { id, touch });
        rows.push(row);
        console.log(JSON.stringify({ ...row, cases: row.cases.length, inventory: undefined }));
      }
      await ctx.close();
    }
    fs.writeFileSync(OUT + '/missoes.json', JSON.stringify({ rows, errors }, null, 2));
    assert.equal(errors.length, 0, JSON.stringify(errors));
    const bad = rows.flatMap(r => [...r.bad, ...r.nav, ...r.click].map(b => ({ map: r.id, touch: r.touch, error: b })));
    assert.equal(bad.length, 0, JSON.stringify(bad, null, 2));
    console.log('PASS all mission targets, routes, desktop/touch challenges, decoys and parcel flows');
  } finally { await b.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
