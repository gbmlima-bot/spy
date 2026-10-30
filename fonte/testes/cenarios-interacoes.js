// Regressions beyond solving a minigame: clicks on rendered objects, map-specific prompts, occupied targets,
// mission clues, short-window lobby access and rule instructions. Network transport has its own seven-client test.
const L = require('./lib'), fs = require('fs'), assert = require('assert/strict');
const U = process.argv[2] || 'http://127.0.0.1:8874/';
const OUT = process.argv[3] || __dirname + '/out/revisao-cenarios'; fs.mkdirSync(OUT, { recursive: true });
// Points on the actual geometry: world height, not a projection onto the walking plane.
const CLICKS = [
  [0, 'quadro', [11.8, 1.8, -9.88]], [0, 'luminaria', [-13.9, 1.65, 2.1]],
  [0, 'telescopio', [12.2, 4.62, -10.7]],
  [0, 'cavalete', [-11.54, 19.6, -56.37]],
  [1, 'poco', [0, 1.925, -2]], [2, 'sushi', [4.58, 1.14, -5.95]],
  [2, 'jetski', [-8.6, -1.2, 12.9]],
  [3, 'pomba', [13.27, 1.254, -7.298]], [4, 'gema', [-11.6, 1.3, -6.6]],
  [4, 'rastreador', [3.55, 3.97, 1.62]], [5, 'omamori', [-7, 2.904, -8.55]],
  [6, 'estandarte', [.9, 2.3, -2.55]], [7, 'jacuzzi', [9.849, 1.32, -6.521]],
  [8, 'spot', [3.47, 1.262, 5.451]], [9, 'lanterna', [0, 1.691, -8.78]],
  [10, 'sinal', [14, 2.6, -7.28]], [10, 'abajur', [-.8, 1.1, -11.86]],
];
(async () => {
  const b = await L.launch(), bad = [], errors = [], report = { clicks: [], contexts: [], crowd: [], briefings: [], lobby: [] };
  const check = (ok, msg) => { if (!ok) bad.push(msg); };
  try {
    // Real mouse/tap delivery to the canvas, then the real walk-to-use controller (clock advanced deliberately).
    for (const touch of [false, true]) {
      const ctx = await b.newContext({ viewport: touch ? { width: 390, height: 780 } : { width: 1280, height: 800 }, hasTouch: touch, isMobile: touch });
      await ctx.addInitScript(() => { window.__noIntro = true; });
      const p = await L.page(ctx, U); p.on('pageerror', e => errors.push(e.message));
      for (const config of [{ id: 0, night: true }, ...Array.from({ length: 11 }, (_, id) => ({ id, night: false }))]) {
        const { id, night } = config;
        await p.evaluate(({ id, night }) => {
          const M = __mira; M.loadMap(id);
          const S = new M.Sim({ seed: 50501 + id + (night ? 100 : 0), guests: [{ peer: 'local', role: 'a' }], sniper: { peer: 'watcher' }, map: id, night }); S.ph = 'play';
          Object.assign(M.G, { screen: 'game', solo: 'audit', multi: false, isHost: true, sim: S, seed: null }); document.querySelector('#menu').hidden = true;
        }, config);
        await p.waitForFunction(() => __mira.G.role === 'a' && __mira.G.seed === __mira.G.sim.seed, null, { polling: 100 });
        check(await p.evaluate(() => !!__mira.st.nt) === night, 'day/night state mismatch');
        for (const [, key, point] of CLICKS.filter(q => q[0] === id)) {
          const xy = await p.evaluate(({ key, point }) => {
            const M = __mira, S = M.G.sim, c = M.ctrl, P = M.PROPS.find(q => q.key === key);
            S.ms = [P.ms[0]]; S.dn = []; S.ts = null; S._st = null; S.t = 290; M.G.lastPh = null;
            Object.assign(c, { x: P.s[0], z: P.s[1], y: M.LVY(P.lv), lv: P.lv, act: null, pose: null, lk: null, path: [], goal: null, settle: null, vx: 0, vz: 0 });
            S.setPlayer(M.G.myEid, c.x, c.z, 0, 0, c.y); M.updateLocal(0, S.state());
            Object.assign(M.isoState, { zoom: 6, az: -.55 }); M.placeIso(0, true); M.iso.updateMatrixWorld(true); M.scene.updateMatrixWorld(true);
            const v = new THREE.Vector3().fromArray(point).project(M.iso);
            return { x: (v.x + 1) * innerWidth / 2, y: (1 - v.y) * innerHeight / 2, o: P.ms[0] };
          }, { key, point });
          await L.sleep(120);
          const top = await p.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.id, xy);
          check(top === 'c' || (touch && top === 'actBtn'), `click obscured by UI: ${id}/${key}/${touch}: ${top}`);
          if (top === 'c' || (touch && top === 'actBtn')) {
            if (touch) await p.touchscreen.tap(xy.x, xy.y); else await p.mouse.click(xy.x, xy.y);
          }
          const actual = await p.evaluate(() => {
            const M = __mira; for (let i = 0; !M.ctrl.act && i < 100; i++) { M.G.sim._st = null; M.updateLocal(.05, M.G.sim.state()); }
            return { o: M.ctrl.act?.o ?? null, goal: M.ctrl.goal, path: M.ctrl.path };
          });
          check(actual.o === xy.o, `rendered click did not start target: ${id}/${key}/${touch}: ${JSON.stringify(actual)}`);
          report.clicks.push({ id, night, key, touch, via: top, expected: xy.o, actual: actual.o });
          if (!touch && (key === 'abajur' || key === 'rastreador')) await p.screenshot({ path: OUT + '/clique-' + key + '.png' });
          await p.keyboard.press('Escape');
          // Escape is a desktop input; tapping the next target also cancels any outstanding touch action.
        }
      }
      await ctx.close();
    }
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }), p = await L.page(ctx, U);
    p.on('pageerror', e => errors.push(e.message));
    for (let id = 0; id <= 10; id++) {
      const r = await p.evaluate(id => {
        const M = __mira, c = M.ctrl; M.loadMap(id);
        const S = new M.Sim({ seed: 601, guests: [{ peer: 'local', role: 'a' }], sniper: { peer: 'watcher' }, map: id });
        S.ph = 'play'; Object.assign(M.G, { screen: 'menu', sim: null, myEid: S.pm.local, role: 'a' });
        const bad = [], actions = {}, danceSlots = M.SLOTS.filter(s => s.type === 'dance');
        for (let lv = 0; lv < M.LEVELS.length; lv++) {
          const L = M.LEVELS[lv];
          for (let x = Math.ceil(L.x0); x < L.x1; x++) for (let z = Math.ceil(L.z0); z < L.z1; z++) {
            if (M.blocked(x, z, .28, lv)) continue;
            Object.assign(c, { x, z, lv, y: M.LVY(lv) }); const it = M.nearInteraction(S.state()), click = M.interactAt(x, z, lv, S.state());
            if (it) actions[it.label] = (actions[it.label] || 0) + 1;
            if (!id) continue;
            const atBar = M.BAR_ZONES.some(q => q.lv === lv && Math.hypot(q.x - x, q.z - z) < q.r);
            if ((it?.label === 'Pedir um drinque' || click?.k === 'bar') && !atBar) bad.push({ x, z, lv, what: 'bar outside bar zone' });
            if (it?.label === 'Esquentar as mãos') bad.push({ x, z, lv, what: 'rooftop fire leaked to scenario' });
            if (it?.label === 'Dançar' && !danceSlots.some(q => q.lv === lv && Math.hypot(q.x - x, q.z - z) < 1.3)) bad.push({ x, z, lv, what: 'dance outside dance area' });
          }
        }
        // Ground/ring targets that are visible in the scenery must keep selecting their own floor and object.
        // Dispatch to the actual canvas handler; the mouse/tap cases above separately cover DOM hit testing.
        const ground = [], rc = new THREE.Raycaster(), shown = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
        const solid = (id ? M.SCEN.occ : M.OCCLUDERS).filter(q => shown(q) && !M.FLOORS.includes(q));
        Object.assign(M.G, { sim: S, screen: 'game', solo: 'audit', multi: false, isHost: true });
        for (let pi = 0; pi < M.PROPS.length; pi++) {
          const P = M.PROPS[pi]; S.ms = [P.ms[0]]; S.ts = null; S.dn = []; S._st = null;
          Object.assign(c, { x: P.s[0], z: P.s[1], lv: P.lv, y: M.LVY(P.lv), act: null, pose: null, path: [], goal: null, lk: null });
          Object.assign(M.isoState, { tx: c.x, tz: c.z, ty: c.y, zoom: 6, az: -.55 }); M.placeIso(0, true); M.iso.updateMatrixWorld(true); M.scene.updateMatrixWorld(true);
          const target = new THREE.Vector3(c.x, c.y + .02, c.z), projected = target.clone().project(M.iso);
          rc.setFromCamera(new THREE.Vector2(projected.x, projected.y), M.iso); const hit = rc.intersectObjects(solid, false)[0];
          if (!hit || hit.point.distanceTo(target) > .15) continue; // scenery covers this ground pixel
          document.querySelector('#c').dispatchEvent(new PointerEvent('pointerdown', { clientX: (projected.x + 1) * innerWidth / 2, clientY: (1 - projected.y) * innerHeight / 2, button: 0, pointerType: 'mouse' }));
          const ok = c.goal?.k === 'mission' && Math.hypot(c.goal.x - P.s[0], c.goal.z - P.s[1]) < .05;
          ground.push({ pi, key: P.key, ok }); if (!ok) bad.push({ what: 'ground click selected wrong object/floor', key: P.key, goal: c.goal });
        }
        M.G.sim = null; M.G.screen = 'menu';
        // The chalk mark must lie on the visible face of the painting, inside its canvas.
        let chalk = null, signature = null;
        if (!id) {
          M.resetProps(); const o = M.MISSIONS.findIndex(m => m.label === 'Marcar o quadro com giz'); M.applyTell(o, false); M.scene.updateMatrixWorld(true);
          const item = Object.entries(M.SPAWNED).find(([k, q]) => k.endsWith('#' + o) && q.visible)?.[1], pic = M.resolveH('pic')[0];
          const pos = pic.worldToLocal(item.position.clone()), size = M.MISSIONS[o].fx.s;
          chalk = { pos: pos.toArray(), size, width: pic.geometry.parameters.width, height: pic.geometry.parameters.height };
          if (!(Math.abs(pos.x) + size / 2 <= chalk.width / 2 && Math.abs(pos.y) + size / 2 <= chalk.height / 2 && pos.z > 0 && pos.z < .03)) bad.push({ what: 'chalk mark outside canvas or behind painting', chalk });
          M.resetProps();
          const sign = M.MISSIONS.findIndex(m => m.label === 'Assinar a tela do cavalete'); M.applyTell(sign, false); M.scene.updateMatrixWorld(true);
          const cv = M.resolveH('canvas')[0], item2 = Object.entries(M.SPAWNED).find(([k, q]) => k.endsWith('#' + sign) && q.visible)?.[1];
          const local = cv.worldToLocal(item2.position.clone()), s = M.MISSIONS[sign].fx.s;
          const normal = new THREE.Vector3(0, 0, 1).transformDirection(cv.matrixWorld), center = cv.getWorldPosition(new THREE.Vector3());
          const facing = normal.dot(M.SNIPER_POS.clone().sub(center).normalize());
          signature = { local: local.toArray(), facing };
          if (!(Math.abs(local.x) + s / 2 <= .33 && Math.abs(local.y) + s / 2 <= .25 && local.z > 0 && local.z < .03 && facing > 0)) bad.push({ what: 'easel clue is outside canvas or faces away from sniper', signature });
          M.resetProps();
        }
        return { id, bad, actions, danceSlots: danceSlots.length, chalk, signature, ground };
      }, id);
      check(r.bad.length === 0, 'context/clue ' + JSON.stringify(r)); report.contexts.push(r);
    }
    await ctx.close();
    // Crowd occupancy: every mission NPC must make way for a nearby player, but keep its normal act when far away.
    const cc = await b.newContext(), cp = await L.page(cc, U);
    for (let id = 0; id <= 10; id++) {
      const r = await cp.evaluate(id => {
        const M = __mira; M.loadMap(id); const rows = [];
        for (let pi = 0; pi < M.PROPS.length; pi++) for (const near of [true, false]) {
          const S = new M.Sim({ seed: 7000 + pi, guests: [{ peer: 'local', role: 'a' }], map: id }); S.ph = 'play'; S.t = 300; S.ts = null;
          for (const q of S.ents) q.timer = 1e9;
          const pl = S.ents[S.pm.local], g = S.ents.find(q => q.kind === 'npc'), si = S.propSlot[pi], sl = S.slots[si], P = M.PROPS[pi];
          if (g.slot >= 0) S.slots[g.slot].busy = -1;
          Object.assign(g, { x: sl.x, z: sl.z, y: M.LVY(P.lv), lv: P.lv, slot: si, st: 'act', obj: P.ms[0], timer: 30, path: [] }); sl.busy = g.id;
          Object.assign(pl, { x: sl.x + (near ? 1 : 9), z: sl.z, y: M.LVY(P.lv), lv: P.lv });
          let left = -1;
          for (let t = 0; t < 12; t += .1) { S.tick(.1); if (sl.busy !== g.id && left < 0) left = +t.toFixed(1); }
          rows.push({ pi, key: P.key, near, left, ok: near ? left > 0 && left < 8 : left < 0 });
        }
        return { id, rows };
      }, id);
      report.crowd.push(r); check(r.rows.every(q => q.ok), 'crowd ' + JSON.stringify({ id, bad: r.rows.filter(q => !q.ok) }));
    }
    await cc.close();
    for (const lang of ['pt', 'en']) {
      const lc = await b.newContext(), lp = await L.page(lc, U + (U.includes('?') ? '&' : '?') + 'lang=' + lang);
      await lp.evaluate(() => {
        const M = __mira; M.loadMap(10);
        M.G.sim = new M.Sim({ seed: 8851, guests: [{ peer: 'local', role: 'c' }, { bot: true, role: 'a' }], sniper: { peer: 'watcher' }, rule: 'duas', map: 10 });
        Object.assign(M.G, { screen: 'game', solo: 'audit', multi: false, seed: null }); document.querySelector('#menu').hidden = true;
      });
      await lp.waitForSelector('#brief:not([hidden])'); await L.sleep(150);
      const text = await lp.locator('#brief').innerText();
      check(lang === 'pt' ? /último tiro em você/.test(text) && !/Se o sniper atirar em você, os convidados vencem/.test(text) : /last shot on you/.test(text) && !/Se o sniper/.test(text), 'two-bullet accomplice instruction: ' + lang);
      report.briefings.push({ lang, text }); await lc.close();
    }
    // Presence is mocked only for this layout check; start still goes through the actual button and room flow.
    for (const size of [{ width: 640, height: 480 }, { width: 390, height: 600 }]) {
      const lc = await b.newContext({ viewport: size }), lp = await L.page(lc, U);
      const within = box => box && box.x >= 0 && box.y >= 0 && box.x + box.width <= size.width && box.y + box.height <= size.height;
      const menu = await lp.locator('#menu').boundingBox(); check(within(menu), 'menu exceeds viewport ' + JSON.stringify(size));
      await lp.fill('#nome', 'Ana'); await lp.click('#btnCreate'); await lp.waitForSelector('#lobby:not([hidden])');
      await lp.evaluate(() => {
        const M = __mira, peers = M.Net.peers(), own = peers.find(q => q.sameTab);
        M.Net.peers = () => [own, ...Array.from({ length: 6 }, (_, i) => ({ peer: 'friend-' + i, sameTab: false, presence: { n: 'Jogador ' + (i + 2), j: Date.now() + i + 1 } }))];
        M.Net.set({ n: 'Ana' });
      });
      await lp.waitForFunction(() => document.querySelectorAll('#players li').length === 7);
      const box = await lp.locator('#lobby').boundingBox(); check(within(box), 'lobby exceeds viewport ' + JSON.stringify(size));
      await lp.locator('#btnStart').scrollIntoViewIfNeeded(); const btn = await lp.locator('#btnStart').boundingBox();
      const visible = btn.y >= 0 && btn.y + btn.height <= size.height; check(visible, 'start clipped ' + JSON.stringify(size));
      await lp.screenshot({ path: OUT + '/sala-' + size.width + 'x' + size.height + '.png' });
      let brief = null, reveal = null;
      if (visible) {
        await lp.click('#btnStart'); await lp.waitForFunction(() => __mira.G.sim?.ph === 'brief');
        await lp.waitForSelector('#brief:not([hidden])');
        brief = await lp.locator('#brief').boundingBox(); check(within(brief), 'briefing exceeds viewport ' + JSON.stringify(size));
        await lp.evaluate(() => { __mira.G.sim.end('g', 'missions'); }); await lp.waitForSelector('#reveal:not([hidden])');
        reveal = await lp.locator('#reveal').boundingBox(); check(within(reveal), 'reveal exceeds viewport ' + JSON.stringify(size));
        await lp.locator('#btnMenu').scrollIntoViewIfNeeded(); await lp.click('#btnMenu'); await lp.waitForSelector('#lobby:not([hidden])');
      }
      report.lobby.push({ size, menu, box, btn, brief, reveal, startReachable: visible }); await lc.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(bad, []);
    console.log('PASS rendered object clicks, scenario contexts, 174 occupied targets, chalk clue, PT/EN briefing and seven-person lobby');
  } finally { report.errors = errors; report.bad = bad; fs.writeFileSync(OUT + '/interacoes.json', JSON.stringify(report, null, 2)); await b.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
