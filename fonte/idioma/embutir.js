// Copia o inglês para dentro de fonte/mira.html: um <script> marcado por "// ---- idioma.js" com o dicionário (en.tsv,
// uma linha "português<TAB>inglês"; {1}, {2} marcam partes que variam) e a camada que traduz a tela (idioma.js).
// Edite en.tsv ou idioma.js e rode isto (o `npm run build` já roda); --checar só confere.
// Uso (da raiz do repositório): node fonte/idioma/embutir.js [--checar]
const fs = require('fs'), path = require('path');
const MIRA = path.join(__dirname, '..', 'mira.html'), check = process.argv.includes('--checar');
const dict = {};
for (const line of fs.readFileSync(path.join(__dirname, 'en.tsv'), 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [pt, en] = line.split('\t'); if (!en) continue;
  if (pt === en && !/\{\d+\}/.test(pt)) delete dict[pt]; else dict[pt] = en; // a later line wins: "x<TAB>x" keeps x in Portuguese
}
const body = ('window.MIRA_EN = ' + JSON.stringify(dict).replace(/","/g, '",\n"') + ';\n' + fs.readFileSync(path.join(__dirname, 'idioma.js'), 'utf8').replace(/^\/\/ ---- idioma\.js\n/, ''))
  .replace(/\n*$/, '\n').replace(/<\/script/gi, '<\\/script');
let html = fs.readFileSync(MIRA, 'utf8');
const tag = '<script>\n// ---- idioma.js\n', anchor = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>';
let i = html.indexOf(tag);
if (i < 0) { const a = html.indexOf(anchor); if (a < 0) throw new Error('âncora do three.js não encontrada'); html = html.slice(0, a) + tag + '</script>\n' + html.slice(a); i = a; }
const j = html.indexOf('</script>', i + tag.length), same = html.slice(i + tag.length, j) === body;
if (check) { if (!same) { console.error('mira.html desatualizado no idioma (rode node fonte/idioma/embutir.js)'); process.exit(1); } console.log('idioma em dia,', Object.keys(dict).length, 'textos'); }
else { if (!same) fs.writeFileSync(MIRA, html.slice(0, i + tag.length) + body + html.slice(j)); console.log(same ? 'idioma: nada a mudar' : 'idioma: atualizado, ' + Object.keys(dict).length + ' textos'); }
