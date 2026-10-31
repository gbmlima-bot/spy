// Real browser checks for the supported rifle foreground, optical view and touch framing.
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), http = require('http'), express = require('express'), L = require('./lib');
const OUT = path.join(__dirname, 'out/sniper'); fs.mkdirSync(OUT, { recursive: true });
const report = { complete: false, checks: [], resources: [], errors: [] };
const pass = text => { report.checks.push(text); console.log('PASS', text); };
(async () => {
  const site = http.createServer(express.static(path.join(__dirname, '../..'))); let browser;
  try {
    await new Promise(r => site.listen(0, '127.0.0.1', r));
    const url = 'http://127.0.0.1:' + site.address().port + '/'; browser = await L.launch();
    const setup = async options => {
      const ctx = await browser.newContext({ locale: 'pt-BR', ...options });
      await ctx.addInitScript(() => { window.__noIntro = true; window.__benchmarkSeed = 714025; localStorage.setItem('mira-quality', 'low'); });
      const p = await L.page(ctx, url, { preload: false }); p.on('pageerror', e => report.errors.push(e.message)); return p;
    };
    const start = async (p, map, role = 's') => {
      await p.selectOption('#mapSel', map); await p.click(role === 's' ? '#btnSoloS' : '#btnSoloA');
      await p.waitForFunction(role => { const M = __mira; return M.G.sim && M.G.seed === M.G.sim.seed && M.G.role === role; }, role, { timeout: 180000 });
      await p.evaluate(() => { __mira.G.sim.t = .01; __mira.G.sim._st = null; });
      await p.waitForFunction(() => __mira.st?.ph === 'play');
    };
    const menu = async p => { await p.evaluate(() => { __mira.G.sim.ph = 'reveal'; __mira.G.sim._st = null; }); await p.locator('#btnMenu').waitFor({ state: 'visible', timeout: 30000 }); await p.click('#btnMenu'); };
    const framing = p => p.evaluate(() => {
      const M = __mira, V = M.SNIPER_VIEW; V.updateWorldMatrix(true, true); M.wide.updateMatrixWorld();
      const optic = new THREE.Vector3(0, .30, .29).applyMatrix4(M.NEST_FX.rifle.matrixWorld).project(M.wide);
      let meshes = 0, triangles = 0, casters = 0; V.traverse(o => { if (o.isMesh) { meshes++; triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3; casters += +o.castShadow; } });
      return { visible: V.visible, optic: optic.toArray(), meshes, triangles, casters, resources: { ...M.renderer.info.memory } };
    });
    const inFrame = r => { assert.ok(r.visible); assert.ok(r.optic[0] > 0 && r.optic[0] < 1, 'optic must remain inside the right edge'); assert.ok(r.optic[1] < .1 && r.optic[1] > -.95, 'optic stays in the lower-right foreground'); assert.ok(r.optic[2] > -1 && r.optic[2] < 1, 'optic is not near-clipped'); assert.equal(r.casters, 0); assert.ok(r.meshes <= 7 && r.triangles < 20000); };
    const desktop = await setup({ viewport: { width: 1280, height: 720 } }); await start(desktop, 'n');
    inFrame(await framing(desktop));
    await desktop.screenshot({ path: path.join(OUT, 'desktop-noite.png'), timeout: 180000 });
    pass('complete rifle, support and hands remain in frame without extra shadow casters');
    await desktop.keyboard.press('Space');
    await desktop.waitForFunction(() => __mira.snip.scoped && !__mira.SNIPER_VIEW.visible && __mira.composer.passes[0].camera === __mira.scopeCam);
    const rays = await desktop.evaluate(() => {
      const M = __mira; let found = 0, marked = false;
      for (const c of M.CHARS()) { const v = c.position.clone(); v.y += 1.2; M.scopeCam.lookAt(v); M.scopeCam.updateMatrixWorld(); const h = M.crosshairHit(); if (h && h.eid >= 0) { found++; if (!marked) { dispatchEvent(new KeyboardEvent('keydown', { key: 'f' })); dispatchEvent(new KeyboardEvent('keyup', { key: 'f' })); marked = M.snip.marks.includes(h.eid); } } }
      return { found, marked };
    }); assert.ok(rays.found > 0, 'real character targets remain hittable through the scope'); assert.ok(rays.marked, 'the suspect notebook remains functional');
    await desktop.screenshot({ path: path.join(OUT, 'luneta.png'), timeout: 180000 }); pass('keyboard scope preserves raycasts and the suspect notebook');
    await desktop.keyboard.press('Space'); await desktop.waitForFunction(() => !__mira.snip.scoped && __mira.SNIPER_VIEW.visible);
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const quality of ['high', 'balanced', 'low']) { await desktop.locator('#qualityControl summary').click(); await desktop.selectOption('#qualitySel', quality); await desktop.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); inFrame(await framing(desktop)); }
      report.resources.push((await framing(desktop)).resources);
    }
    for (const r of report.resources.slice(1)) { assert.ok(r.geometries <= report.resources[0].geometries + 2); assert.equal(r.textures, report.resources[0].textures); }
    pass('quality changes preserve framing and stabilize graphic resources');
    for (const map of ['1', '9', '10']) {
      await menu(desktop); await start(desktop, map); inFrame(await framing(desktop));
    }
    pass('foreground remains readable with different map camera positions and FOVs');
    await menu(desktop); await start(desktop, '0', 'a');
    await desktop.waitForFunction(() => !__mira.SNIPER_VIEW.visible); pass('agent view never renders the sniper foreground');
    await desktop.context().close();
    const mobile = await setup({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); await start(mobile, 'n'); inFrame(await framing(mobile));
    assert.ok(await mobile.locator('#roleCard').evaluate(e => e.classList.contains('min')), 'portrait starts with a compact notebook');
    await mobile.tap('#roleCard > .eyebrow'); assert.ok(await mobile.locator('#notebook').isVisible());
    await mobile.tap('#roleCard > .eyebrow');
    await mobile.screenshot({ path: path.join(OUT, 'celular-retrato.png'), timeout: 180000 });
    await mobile.tap('#scopeBtn'); await mobile.waitForFunction(() => __mira.snip.scoped && !__mira.SNIPER_VIEW.visible);
    await mobile.tap('#scopeBtn'); await mobile.waitForFunction(() => !__mira.snip.scoped && __mira.SNIPER_VIEW.visible);
    await mobile.setViewportSize({ width: 844, height: 390 }); await mobile.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); inFrame(await framing(mobile));
    await mobile.screenshot({ path: path.join(OUT, 'celular-paisagem.png'), timeout: 180000 }); pass('touch scope and both phone orientations preserve the composition');
    assert.deepEqual(report.errors, []); report.complete = true;
  } catch (e) { report.errors.push(e.stack || String(e)); throw e; }
  finally { fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify(report, null, 2)); if (browser) await browser.close(); await new Promise(r => site.close(r)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
