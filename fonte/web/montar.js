// Gera o index.html da raiz do repositório a partir de fonte/mira.html (sem alterá-lo): mesmo jogo,
// com a rede ponto a ponto no lugar da capacidade room do claude.ai.
// Uso (da raiz do repositório): node fonte/web/montar.js [saida.html]
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'mira.html'), 'utf8');
const rede = fs.readFileSync(path.join(__dirname, 'rede-p2p.js'), 'utf8');
const anchor = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>';
if (!src.includes(anchor)) throw new Error('ponto de inserção não encontrado em mira.html');
// endereço público (GitHub Pages): a prévia do link (WhatsApp, redes) precisa da imagem com endereço completo
const SITE = process.env.MIRA_SITE || 'https://gbmlima-bot.github.io/spy/';
const DESC = 'Jogo de festa no navegador: um agente infiltrado cumpre missões no meio da festa e um sniper tem um único tiro para descobrir quem é. Entre na sala pelo link, sem instalar nada.';
const og = [
  ['name', 'description', DESC], ['name', 'theme-color', '#0c0f14'],
  ['property', 'og:type', 'website'], ['property', 'og:site_name', 'Mira na Cobertura'], ['property', 'og:locale', 'pt_BR'],
  ['property', 'og:title', 'Mira na Cobertura: quem é o agente infiltrado?'], ['property', 'og:description', DESC],
  ['property', 'og:url', SITE], ['property', 'og:image', SITE + 'og.jpg'], ['property', 'og:image:type', 'image/jpeg'],
  ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'], ['property', 'og:image:alt', 'A festa na cobertura vista do prédio do sniper'],
  ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:image', SITE + 'og.jpg'],
].map(([k, n, v]) => `<meta ${k}="${n}" content="${v.replace(/"/g, '&quot;')}">`).join('\n');
const head = '<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
  og + '\n<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Ccircle cx=%2216%22 cy=%2216%22 r=%2212%22 fill=%22none%22 stroke=%22%23d9a441%22 stroke-width=%223%22/%3E%3Cpath d=%22M16 2v9M16 21v9M2 16h9M21 16h9%22 stroke=%22%23d9a441%22 stroke-width=%223%22/%3E%3Ccircle cx=%2216%22 cy=%2216%22 r=%222.5%22 fill=%22%23ff4134%22/%3E%3C/svg%3E">\n';
// The entry is intentionally small; generated assets have content-addressed names.
const crypto = require('crypto'), vm = require('vm');
const dest = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'index.html'));
const dir = path.join(path.dirname(dest), 'assets'); fs.mkdirSync(dir, { recursive: true });
const previous = path.join(dir, 'manifest.json');
let oldFiles = [];
if (fs.existsSync(previous)) { const old = JSON.parse(fs.readFileSync(previous)); oldFiles = old.files || []; }
const files = [], write = (label, body, ext = 'js') => {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const hash = crypto.createHash('sha256').update(bytes).digest();
  const name = label + '.' + hash.toString('hex').slice(0, 16) + '.' + ext;
  fs.writeFileSync(path.join(dir, name), bytes); files.push(name);
  return { url: 'assets/' + name, integrity: 'sha256-' + hash.toString('base64') };
};
const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const block = name => { const b = blocks.find(b => b.includes('// ---- ' + name + '\n')); if (!b) throw Error('Missing embedded source: ' + name); return b; };
let core = blocks.find(b => b.includes("const T = THREE;")); if (!core) throw Error('Missing game core');
const three = path.dirname(require.resolve('three/package.json'));
const peer = path.dirname(require.resolve('peerjs/package.json'));
const dependencies = [write('three', fs.readFileSync(path.join(three, 'build/three.min.js')))];
for (const f of ['shaders/CopyShader.js', 'shaders/FXAAShader.js', 'shaders/LuminosityHighPassShader.js', 'postprocessing/EffectComposer.js', 'postprocessing/RenderPass.js', 'postprocessing/ShaderPass.js', 'postprocessing/UnrealBloomPass.js', 'environments/RoomEnvironment.js']) {
  dependencies.push(write(path.basename(f, '.js'), fs.readFileSync(path.join(three, 'examples/js', f))));
}
dependencies.push(write('peerjs', fs.readFileSync(path.join(peer, 'dist/peerjs.min.js'))), write('rede', rede));
for (const name of ['kit.js', 'personagens.js']) dependencies.push(write(path.basename(name, '.js'), block(name)));
dependencies.push(write('qualidade', fs.readFileSync(path.join(__dirname, 'qualidade.js'))));
const maps = { 0: [write('mapa-0-detalhes', block('00-cobertura.js')), write('mapa-0', fs.readFileSync(path.join(__dirname, 'cobertura.js')))] }, scenarios = [];
const scenarioFiles = fs.readdirSync(path.join(__dirname, '../cenarios/src')).filter(f => /^\d\d-/.test(f) && !f.startsWith('00-')).sort();
for (let i = 0; i < scenarioFiles.length; i++) {
  const body = block(scenarioFiles[i]), registry = [];
  vm.runInNewContext(body, { MIRA_CENARIOS: registry, window: { MIRA_CENARIOS: registry } }, { timeout: 1000 });
  if (registry.length !== 1) throw Error('Expected one scenario: ' + scenarioFiles[i]);
  const sc = registry[0]; scenarios.push({ id: sc.id, nome: sc.nome, lugar: sc.lugar });
  if (!body.includes('MIRA_CENARIOS.push({')) throw Error('Unknown registration form');
  maps[i + 1] = [write('mapa-' + (i + 1), body.replace('MIRA_CENARIOS.push({', 'Object.assign(MIRA_CENARIOS[' + i + '], {'))];
}
const locale = write('idioma', block('idioma.js'));
const loader = write('carregar', fs.readFileSync(path.join(__dirname, 'carregar.js')));
const rigMatch = core.match(/const RIG = ([^\n]+);/); if (!rigMatch) throw Error('Missing character rig');
const rig = JSON.parse(rigMatch[1]);
const common = [write('animacoes', 'Object.assign(window.MIRA_RIG_CLIPS, ' + JSON.stringify(rig.clips) + ');')];
core = core.replace(rigMatch[0], 'const RIG = ' + JSON.stringify({ bones: rig.bones }) + '; RIG.clips = window.MIRA_RIG_CLIPS = {};');
const game = write('jogo', core);
const poster = write('fundo-menu', fs.readFileSync(path.join(__dirname, '../../og.jpg')), 'jpg');
const css = write('estilo', src.match(/<style>([\s\S]*?)<\/style>/)[1].replace("url('../og.jpg')", "url('" + path.basename(poster.url) + "')"), 'css');
write('three-LICENSE', fs.readFileSync(path.join(three, 'LICENSE')), 'txt');
write('peerjs-LICENSE', fs.readFileSync(path.join(peer, 'LICENSE')), 'txt');
const manifest = { version: crypto.createHash('sha256').update(JSON.stringify({ maps, common, dependencies, game, css, locale, loader, scenarios })).digest('hex').slice(0, 16), scenarios, maps, common, dependencies, locale, loader, game, css, files };
const tag = a => `<script defer src="${a.url}" integrity="${a.integrity}" onerror="window.MIRA_ASSET_ERROR?.('Asset load error')"></script>`;
// Keep title/fonts/body markup, but extract all scripts and styles.
let shell = src.slice(0, src.indexOf('<script>')).replace(/<style>[\s\S]*?<\/style>/, `<link rel="stylesheet" href="${css.url}" integrity="${css.integrity}">`);
const config = '<script>window.MIRA_WEB=true;window.MIRA_MANIFEST=' + JSON.stringify(manifest).replace(/</g, '\\u003c') + ';</script>';
const out = head + shell + config + [locale, loader, ...dependencies, game].map(tag).join('\n') + '\n</html>\n';
fs.writeFileSync(dest, out); fs.writeFileSync(previous, JSON.stringify(manifest, null, 2));
// Remove only files explicitly owned by the previous generated manifest.
for (const f of oldFiles) if (!files.includes(f) && /^[A-Za-z0-9_-]+\.[a-f0-9]{16}\.(js|css|txt|jpg)$/.test(f)) fs.rmSync(path.join(dir, f), { force: true });
console.log(path.relative(process.cwd(), dest), (Buffer.byteLength(out) / 1024).toFixed(1) + ' KB entry;', files.length, 'local assets; version', manifest.version);
