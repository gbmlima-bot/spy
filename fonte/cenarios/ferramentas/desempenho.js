// Carga e quadros por segundo de cada mapa, na partida de treino do sniper (vista larga).
//  carga = do clique em começar até a partida estar na tela (monta cenário, grade, personagens, juntar malhas)
//  montar = só o cenário (SCEN.tBuild) e a grade (SCEN.tNav); fps = quadros em 5 s; chamadas = draw calls de um quadro
// node desempenho.js <url> [mapas] [rotulo]   (headless com swiftshader: compare versões na mesma máquina, não valores absolutos)
const L = require('../../testes/lib');
const U = process.argv[2] || 'http://localhost:8765/mira.html';
const MAPS = (process.argv[3] || '0,1,2,3,4,5,6,7,8,9,10').split(',').map(Number);
const TAG = process.argv[4] || '';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
  const p = await L.page(ctx, U);
  const out = [];
  for (const id of MAPS) {
    const t0 = Date.now();
    await p.evaluate((id) => { document.querySelector('#mapSel').value = id; document.querySelector('#btnSoloS').click(); }, id);
    await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.screen === 'game', null, { timeout: 180000, polling: 50 });
    const carga = Date.now() - t0;
    await L.sleep(2000);
    const r = await p.evaluate(() => new Promise(res => {
      const M = window.__mira, ri = M.renderer.info; let n = 0; const t0 = performance.now();
      const f = () => { n++; if (performance.now() - t0 < 5000) requestAnimationFrame(f); else {
        ri.autoReset = false; ri.reset(); requestAnimationFrame(() => { const calls = ri.render.calls, tris = ri.render.triangles; ri.autoReset = true;
          res({ fps: n / ((performance.now() - t0) / 1000), calls, tris, build: M.SCEN.id ? M.SCEN.tBuild : null, nav: M.SCEN.id ? M.SCEN.tNav : null, geos: ri.memory.geometries, texs: ri.memory.textures }); }); } };
      requestAnimationFrame(f);
    }));
    out.push(Object.assign({ id, carga }, r));
    console.log(`${TAG} mapa ${id}: carga ${carga} ms (cenário ${r.build ?? '-'} ms, grade ${r.nav ?? '-'} ms), ${r.fps.toFixed(1)} fps, ${r.calls} chamadas, ${(r.tris / 1000).toFixed(0)} mil triângulos, ${r.texs} texturas`);
    await p.evaluate(() => { const M = window.__mira; M.G.sim.ph = 'reveal'; document.querySelector('#btnMenu').click(); }); await L.sleep(1500);
  }
  if (process.env.JSON_OUT) require('fs').writeFileSync(process.env.JSON_OUT, JSON.stringify(out));
  await b.close();
})();
