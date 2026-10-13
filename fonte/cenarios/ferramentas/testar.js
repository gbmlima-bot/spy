// Testa um cenário em Chromium headless: node testar.js <id> <pasta-de-saida> [--rapido]
// Gera capturas (visão geral, outro ângulo, closes do elenco, luneta) e checa caminhos, colisões e erros.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { chromium } = require(fs.existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright');
const id = process.argv[2], outDir = path.resolve(process.argv[3] || '.'), fast = process.argv.includes('--rapido');
// three.js: THREE_LIB aponta para um pacote three@0.128 (build/ e examples/js/); sem ela, usa fonte/testes/cdn (ver CONTRIBUTING.md)
const LIB = process.env.THREE_LIB, CDN = {};
if (!LIB) { const dir = path.join(__dirname, '..', '..', 'testes', 'cdn'); for (const l of fs.readFileSync(path.join(dir, 'index.txt'), 'utf8').trim().split('\n')) { const [n, u] = l.split(' '); CDN[u.replace(/.*three(\.js\/r128|@0\.128\.0)\//, '')] = path.join(dir, n); } }
const libFile = (rel) => LIB ? path.join(LIB, rel) : CDN[rel] || CDN[rel.replace(/^build\//, '')];
fs.mkdirSync(outDir, { recursive: true });
const html = path.join(outDir, `_teste-${id}.html`);
cp.execFileSync('node', [path.join(__dirname, 'build.js'), html, '--so', id], { stdio: 'inherit' });
// no máximo 3 testes ao mesmo tempo (a máquina tem poucos núcleos e o WebGL é por software)
async function lock() {
  const dir = '/tmp/mira-test-locks'; fs.mkdirSync(dir, { recursive: true });
  for (;;) {
    for (let k = 0; k < 3; k++) { const f = dir + '/' + k; try { const st = fs.statSync(f); if (Date.now() - st.mtimeMs > 12 * 60e3) fs.unlinkSync(f); } catch (e) { } try { fs.writeFileSync(f, String(process.pid), { flag: 'wx' }); process.on('exit', () => { try { fs.unlinkSync(f); } catch (e) { } }); return; } catch (e) { } }
    await new Promise(r => setTimeout(r, 3000));
  }
}
(async () => {
  await lock();
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await br.newPage({ viewport: { width: 1280, height: 800 } });
  pg.setDefaultTimeout(240000); pg.setDefaultNavigationTimeout(240000);
  const errs = [];
  pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await pg.route('**/*', r => {
    const u = r.request().url();
    if (u.includes('three.min.js')) return r.fulfill({ path: libFile('build/three.min.js'), contentType: 'text/javascript' });
    const m = u.match(/examples\/js\/(.*\.js)$/); if (m) return r.fulfill({ path: libFile('examples/js/' + m[1]), contentType: 'text/javascript' });
    if (u.startsWith('file:')) return r.continue();
    return r.fulfill({ body: '', contentType: 'text/css' });
  });
  await pg.goto('file://' + html + '?shot=1&c=' + id);
  await pg.waitForFunction(() => window.__previa && window.__previa.W.sc, null, { timeout: 120000 }).catch(() => { });
  const ok = await pg.evaluate(() => !!(window.__previa && window.__previa.W.sc));
  if (!ok) { console.log('FALHOU AO CARREGAR\n' + errs.join('\n')); await br.close(); process.exit(1); }
  // checagens
  const rep = await pg.evaluate(() => {
    const P = window.__previa, W = P.W, sc = W.sc, out = { nome: sc.nome, stats: window.__stats, problemas: [], avisos: [] };
    const me = W.me;
    const reach = (x, z, lv) => !!P.route({ x: me.x, z: me.z, lv: me.lv }, x, z, lv);
    W.slots.forEach((s, k) => { if (P.blocked(s.x, s.z, 0.2, s.lv)) out.avisos.push(`vaga ${k} (${s.type}) em ${s.x.toFixed(1)},${s.z.toFixed(1)} lv${s.lv} dentro de colisão (ok para assento, ruim para resto)`); if (!reach(s.x, s.z, s.lv)) out.problemas.push(`vaga ${k} (${s.type}) em ${s.x.toFixed(1)},${s.z.toFixed(1)} lv${s.lv} inalcançável`); });
    (sc.missoes || []).forEach(m => { if (P.blocked(m.s[0], m.s[1], 0.25, m.lv || 0)) out.problemas.push(`missão ${m.k}: ponto s dentro de colisão`); if (!reach(m.s[0], m.s[1], m.lv || 0)) out.problemas.push(`missão ${m.k}: inalcançável`); if (!W.K.tells[m.k]) out.problemas.push(`missão ${m.k}: sem K.tell`); });
    if ((sc.missoes || []).length < 8) out.problemas.push('menos de 8 missões');
    if ((sc.elenco || []).length < 5) out.problemas.push('elenco com menos de 5 personagens');
    const tv = W.slots.filter(s => s.type !== 'obj').length; if (tv < 40) out.avisos.push(`só ${tv} vagas (ideal 45+)`);
    out.vagasPorTipo = W.slots.reduce((a, s) => (a[s.type] = (a[s.type] || 0) + 1, a), {});
    // aplica todos os tells (estado final) para checar que não quebram
    try { for (const k in W.K.tells) { W.K.tells[k].tell(false); W.K.tells[k].reset(); } } catch (e) { out.problemas.push('tell/reset quebrou: ' + e.message); }
    return out;
  });
  console.log(JSON.stringify(rep, null, 1));
  const shot = async (name, fn) => { await pg.evaluate(fn); await pg.evaluate(() => { window.__previa.step(4); window.__previa.render(); }); await pg.waitForTimeout(300); await pg.screenshot({ path: path.join(outDir, `${id}-${name}.png`) }); console.log('captura', name); };
  await pg.evaluate(() => { const P = window.__previa; P.step(90); P.free(); document.getElementById('hud').style.display = 'none'; });
  const L0 = `const P=window.__previa, L=P.W.sc.niveis[0];`;
  await shot('geral', new Function(L0 + `P.isoState.tx=(L.x0+L.x1)/2;P.isoState.tz=(L.z0+L.z1)/2;P.isoState.ty=0;P.isoState.zoom=Math.max(L.x1-L.x0,L.z1-L.z0)*0.62;P.isoState.az=-0.55;`));
  if (!fast) {
    await shot('angulo2', new Function(L0 + `P.isoState.az=0.75;P.isoState.zoom*=0.75;`));
    const cast = await pg.evaluate(() => window.__previa.W.ents.filter(e => e.kind === 'static').map(e => e.id));
    for (const [k, eid] of cast.slice(0, 8).entries()) await shot('elenco' + (k + 1), new Function(`const P=window.__previa,e=P.W.ents[${eid}];P.isoState.tx=e.x;P.isoState.tz=e.z;P.isoState.ty=e.y+0.7;P.isoState.zoom=2.6;P.isoState.az=-0.55+e.rot*0;`));
    const lvs = await pg.evaluate(() => window.__previa.W.sc.niveis.length);
    for (let lv = 1; lv < lvs; lv++) await shot('nivel' + lv, new Function(`const P=window.__previa,L=P.W.sc.niveis[${lv}];P.isoState.tx=(L.x0+L.x1)/2;P.isoState.tz=(L.z0+L.z1)/2;P.isoState.ty=L.y;P.isoState.zoom=Math.max(L.x1-L.x0,L.z1-L.z0)*0.6;P.isoState.az=-0.55;`));
    await shot('luneta', new Function(L0 + `P.setScope(true);P.aimScopeAt((L.x0+L.x1)/2,0,(L.z0+L.z1)/2);P.scopeState.fov=24;`));
    await shot('luneta-zoom', new Function(L0 + `const e=P.W.ents.find(e=>e.kind==='npc');P.aimScopeAt(e.x,e.y+1.3,e.z);P.scopeState.fov=5;`));
    await shot('missoes-feitas', new Function(L0 + `P.setScope(false);for(const k in P.W.K.tells)P.W.K.tells[k].tell(false);P.isoState.tx=(L.x0+L.x1)/2;P.isoState.tz=(L.z0+L.z1)/2;P.isoState.ty=0;P.isoState.zoom=Math.max(L.x1-L.x0,L.z1-L.z0)*0.62;P.isoState.az=-0.55;`));
  }
  if (errs.length) console.log('ERROS/AVISOS DO CONSOLE:\n' + [...new Set(errs)].slice(0, 30).join('\n'));
  await br.close();
  fs.unlinkSync(html);
})();
