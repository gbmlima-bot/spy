// Seven independent browser contexts with real PeerJS/WebRTC and isolated local signaling.
// Player placement and challenge clock are controlled; mission completion must travel through the real network.
const assert = require('assert/strict'), fs = require('fs'), http = require('http'), express = require('express');
const { ExpressPeerServer } = require('peer'), L = require('./lib'), CDN = require('./assets')(__dirname);
const OUT = __dirname + '/out'; fs.mkdirSync(OUT, { recursive: true });
const listen = s => new Promise(r => s.listen(0, '127.0.0.1', () => r(s.address().port)));
const close = s => new Promise(r => s.close(r));
(async () => {
  const site = http.createServer(express.static(require('path').join(__dirname, '../..')));
  const app = express(), signal = http.createServer(app), errors = [], report = { transport: 'real PeerJS/WebRTC, local signaling, 7 independent browser contexts', agent: [], accomplices: [] };
  let b;
  try {
    const port = await listen(site), sp = await listen(signal); app.use('/', ExpressPeerServer(signal, { path: '/' }));
    b = await L.launch(); const pages = [];
    for (const name of ['Ana', 'Bia', 'Caio', 'Dani', 'Eva', 'Fabi', 'Gui']) {
      const ctx = await b.newContext({ viewport: { width: 960, height: 800 } });
      await ctx.addInitScript(cfg => {
        window.MIRA_NET = cfg; window.__noIntro = true;
        const raf = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = f => setTimeout(() => raf(f), window.__mira?.G.screen === 'game' ? 60 : 150);
      }, { host: '127.0.0.1', port: sp, path: '/', secure: false, config: { iceServers: [] } });
      await ctx.route('**/*', r => {
        const u = r.request().url(); if (CDN[u]) return r.fulfill({ body: CDN[u], contentType: 'application/javascript' });
        if (u.startsWith('https://fonts.googleapis.com/')) return r.fulfill({ body: '', contentType: 'text/css' });
        return u.startsWith('http://127.0.0.1') ? r.continue() : r.abort();
      });
      const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message));
      await p.goto('http://127.0.0.1:' + port); await p.waitForFunction(() => window.__mira && !document.querySelector('#menu').hidden);
      await p.fill('#nome', name); pages.push(p);
    }
    const h = pages[0]; await h.selectOption('#mapSel', '10'); await h.click('#btnCreate');
    await h.waitForSelector('#lobby:not([hidden])'); await h.selectOption('#ruleSel', '0'); const code = await h.locator('#lobbyCode').innerText();
    for (const p of pages.slice(1)) { await p.fill('#codeIn', code); await p.click('#btnJoin'); await p.waitForSelector('#lobby:not([hidden])'); }
    await Promise.all(pages.map(p => p.waitForFunction(() => window.__mira.Net.peers().length === 7, null, { timeout: 45000 })));
    await h.setViewportSize({ width: 640, height: 480 }); await h.locator('#btnStart').scrollIntoViewIfNeeded();
    const startBox = await h.locator('#btnStart').boundingBox(); assert.ok(startBox.y >= 0 && startBox.y + startBox.height <= 480);
    report.shortWindowStart = startBox; await h.screenshot({ path: OUT + '/sala-sete-640x480.png' });
    await h.setViewportSize({ width: 960, height: 800 });
    await h.click('#btnStart');
    await Promise.all(pages.map(p => p.waitForFunction(() => window.__mira.G.screen === 'game' && !!window.__mira.G.role, null, { timeout: 60000 })));
    const roles = await Promise.all(pages.map(p => p.evaluate(() => ({ role: __mira.G.role, eid: __mira.G.myEid }))));
    assert.deepEqual(roles.map(q => q.role).sort(), ['a', 'c', 'c', 'c', 'c', 'c', 's']); report.roles = roles;
    await h.evaluate(() => { const S = __mira.G.sim; S.t = .01; for (const e of S.ents) if (e.kind === 'npc') e.timer = 1e9; });
    await Promise.all(pages.map(p => p.waitForFunction(() => __mira.st.ph === 'play', null, { timeout: 45000 })));
    const ai = roles.findIndex(q => q.role === 'a'), agent = pages[ai];
    const kinds = await agent.evaluate(() => {
      const M = __mira, out = {}; M.MISSIONS.forEach((m, o) => { const k = M.makeChallenge(o, M.st.rd).k; if (!(k in out)) out[k] = o; }); return out;
    });
    assert.equal(Object.keys(kinds).length, 6, 'all six challenges represented');
    const position = async (p, eid, o, agentCase) => {
      await h.evaluate(({ eid, o, agentCase }) => {
        const M = __mira, S = M.G.sim, P = M.PROPS[M.MISSIONS[o].p];
        if (agentCase) { S.ms = [o]; S.dn = []; S.ts = null; S.got = false; }
        S.t = 290; S.setPlayer(eid, P.s[0], P.s[1], 0, 0, M.LVY(P.lv)); S._st = null;
      }, { eid, o, agentCase });
      if (agentCase) await p.waitForFunction(o => __mira.st.ms.includes(o) && !__mira.st.dn.includes(o), o, { timeout: 15000 });
      await p.evaluate(o => {
        const M = __mira, c = M.ctrl, P = M.PROPS[M.MISSIONS[o].p];
        Object.assign(c, { x: P.s[0], z: P.s[1], y: M.LVY(P.lv), lv: P.lv, act: null, path: [], goal: null, pose: null, settle: null, lk: null, vx: 0, vz: 0 });
        M.G.lastPh = null;
      }, o);
      await L.sleep(500);
    };
    const solve = async p => p.evaluate(() => {
      const M = __mira, c = M.ctrl, a = c.act; if (!a) throw Error('action did not start');
      const ch = a.ch, key = k => { dispatchEvent(new KeyboardEvent('keydown', { key: k })); dispatchEvent(new KeyboardEvent('keyup', { key: k })); };
      if (ch.k === 'seq') for (const d of ch.keys) key(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][d]);
      if (ch.k === 'girar') for (let i = 0; i < ch.n; i++) key(i % 2 ? 'ArrowRight' : 'ArrowLeft');
      if (ch.k === 'ponto') for (let i = 0; i < ch.need; i++) {
        const base = Math.asin(2 * ch.c - 1), k = Math.floor((a.t * ch.sp + ch.ph - base) / (Math.PI * 2) + 1e-6) + 1;
        a.t = (base + Math.PI * 2 * k - ch.ph) / ch.sp; key('e');
      }
      if (ch.k === 'pulso') for (let i = 0; i < ch.need; i++) { a.t = (Math.floor(a.t / ch.per + ch.ph + 1e-6) + 1 - ch.ph) * ch.per; key('e'); }
      for (let i = 0; c.act && i < 1000; i++) M.updateLocal(.05, M.st);
      if (c.act) throw Error('challenge did not finish'); return { o: a.o, kind: ch.k, seq: c.actDone.s };
    });
    for (const [kind, o] of Object.entries(kinds)) {
      await position(agent, roles[ai].eid, o, true); await agent.keyboard.press('e'); const result = await solve(agent);
      assert.equal(result.kind, kind);
      await h.waitForFunction(o => __mira.G.sim.dn.includes(o), o, { timeout: 15000 });
      await Promise.all(pages.map(p => p.waitForFunction(o => __mira.st.dn.includes(o), o, { timeout: 15000 })));
      await Promise.all(pages.map(p => p.waitForFunction(o => __mira.st.tells.includes(o), o, { timeout: 15000 })));
      report.agent.push(result); console.log('PASS shared mission: ' + kind);
    }
    const lamp = await agent.evaluate(() => __mira.PROPS.find(q => q.key === 'abajur').ms[0]);
    await position(agent, roles[ai].eid, lamp, true);
    const xy = await agent.evaluate(() => {
      const M = __mira; Object.assign(M.isoState, { zoom: 6, az: -.55 }); M.placeIso(0, true); M.iso.updateMatrixWorld(true);
      const v = new THREE.Vector3(-.8, 1.1, -11.86).project(M.iso); return { x: (v.x + 1) * innerWidth / 2, y: (1 - v.y) * innerHeight / 2 };
    });
    await agent.mouse.click(xy.x, xy.y); await agent.waitForFunction(o => __mira.ctrl.act?.o === o, lamp, { timeout: 10000 });
    const clicked = await solve(agent); assert.equal(clicked.o, lamp); report.agent.push({ ...clicked, via: 'rendered lamp click' });
    await Promise.all(pages.map(p => p.waitForFunction(o => __mira.st.dn.includes(o) && __mira.st.tells.includes(o), lamp, { timeout: 15000 })));
    await Promise.all(pages.map(p => p.waitForFunction(() => {
      let green = false; __mira.SCEN.root.traverse(q => { if (q.isMesh && Math.abs(q.position.x + .8) < .001 && Math.abs(q.position.y - 1.1) < .001 && Math.abs(q.position.z + 11.86) < .001 && q.material?.color?.g > 2) green = true; }); return green;
    }, null, { timeout: 15000 })));
    console.log('PASS rendered lamp click, completion and visible clue on all seven clients');
    for (let i = 0; i < pages.length; i++) if (roles[i].role === 'c') {
      const p = pages[i], o = await p.evaluate(i => __mira.PROPS[i + 2].ms[0], report.accomplices.length);
      await position(p, roles[i].eid, o, false); await p.keyboard.press('g');
      assert.equal(await p.evaluate(() => __mira.ctrl.dzArm), true);
      await p.keyboard.press('e'); const result = await solve(p);
      await h.waitForFunction(eid => __mira.G.sim.dz.includes(eid), roles[i].eid, { timeout: 15000 });
      await Promise.all(pages.map(q => q.waitForFunction(eid => __mira.st.dz.includes(eid), roles[i].eid, { timeout: 15000 })));
      report.accomplices.push({ player: i, ...result }); console.log('PASS accomplice completion and distraction: ' + i);
    }
    report.realLogs = await h.evaluate(() => __mira.G.sim.lg.filter(q => q[3] === 1).length);
    assert.equal(report.realLogs, 7); assert.deepEqual(errors, []); report.errors = errors;
    console.log('PASS seven-player mission synchronization');
  } finally {
    fs.writeFileSync(OUT + '/multijogador-missoes.json', JSON.stringify(report, null, 2));
    if (b) await b.close(); await Promise.all([close(site), close(signal)]);
  }
})().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
