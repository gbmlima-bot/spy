// Provador: convidados montados pelo makeChar do jogo, isolados em fundo cinza (frente, 3/4, lado, costas).
// node fonte/testes/provador.js URL saida.png [anims csv] [semente] [n] [cenário]  (ELENCO=1: elenco fixo do cenário)
// node provador.js URL out.png [anim] [seed] [n] [mapId]
const L = require('./lib');
const [U, OUT, ANIM = '0', SEED = '7', N = '6', MAP = '0'] = process.argv.slice(2);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  if (process.env.NOBATCH) await ctx.addInitScript(() => { window.__noBatch = true; });
  if (process.env.ELENCO) await ctx.addInitScript(() => { window.__ELENCO = true; });
  const p = await L.page(ctx, U);
  if (MAP !== '0') { await p.evaluate(m => window.__mira.loadMap(+m), MAP); await L.sleep(1500); }
  const url = await p.evaluate(({ ANIM, SEED, N }) => {
    const M = window.__mira, T = THREE, anims = ANIM.split(',').map(Number);
    const sc = new T.Scene(); sc.background = new T.Color(0x8a8f99);
    sc.add(new T.HemisphereLight(0xdfe6ff, 0x554433, 0.9)); const d = new T.DirectionalLight(0xffffff, 1.1); d.position.set(2, 4, 3); sc.add(d);
    const cam = new T.PerspectiveCamera(30, 0.6, 0.05, 50);
    const W = 180, H = 300, angs = [0, 0.8, 1.57, 3.14], n = +N;
    const out = document.createElement('canvas'); out.width = W * angs.length * anims.length; out.height = H * n; const g = out.getContext('2d');
    const r = M.renderer, old = r.getSize(new T.Vector2()); r.setSize(W, H, false); const env = r.toneMappingExposure;
    for (let i = 0; i < n; i++) {
      anims.forEach((an, ai) => {
        const o = window.__ELENCO ? M.outfitFor(+SEED, i, { sx: M.STATICS.map((_, k) => k) }) : M.outfitFor(+SEED, i, null); const c = M.makeChar(o, 1000 + i); sc.add(c);
        for (let f = 0; f < 40; f++) M.animChar(c, an, 1 + f / 30, false, 1 / 30);
        c.updateMatrixWorld(true);
        angs.forEach((a, k) => { cam.position.set(Math.sin(a) * 3.4, 1.15, Math.cos(a) * 3.4); cam.lookAt(0, 0.95, 0); cam.updateMatrixWorld(); r.render(sc, cam); g.drawImage(r.domElement, 0, 0, r.domElement.width, r.domElement.height, (ai * angs.length + k) * W, i * H, W, H); });
        sc.remove(c);
      });
    }
    r.setSize(old.x, old.y, false);
    return out.toDataURL('image/png');
  }, { ANIM, SEED, N });
  require('fs').writeFileSync(OUT, Buffer.from(url.split(',')[1], 'base64'));
  await b.close();
})();
