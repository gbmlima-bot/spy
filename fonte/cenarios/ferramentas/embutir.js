// Copia os cenários de fonte/cenarios/src para dentro de fonte/mira.html, que leva uma cópia de cada um num <script>
// marcado por "// ---- arquivo.js". Edite sempre o arquivo em src/ e rode isto (ou `npm run cenarios`); --checar só confere.
// Uso (da raiz do repositório): node fonte/cenarios/ferramentas/embutir.js [--checar]
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', 'src'), MIRA = path.join(__dirname, '..', '..', 'mira.html');
const check = process.argv.includes('--checar');
let html = fs.readFileSync(MIRA, 'utf8');
const files = ['kit.js', 'personagens.js', ...fs.readdirSync(SRC).filter(f => /^\d\d-.*\.js$/.test(f)).sort()];
const stale = [];
for (const f of files) {
  const body = fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\n*$/, '\n').replace(/<\/script/gi, '<\\/script');
  const tag = `<script>\n// ---- ${f}\n`, i = html.indexOf(tag);
  if (i < 0) { console.error(`${f}: bloco não encontrado no mira.html (inclua um <script> com a linha "// ---- ${f}")`); process.exit(1); }
  const j = html.indexOf('</script>', i + tag.length);
  if (html.slice(i + tag.length, j) === body) continue;
  stale.push(f); html = html.slice(0, i + tag.length) + body + html.slice(j);
}
if (check) { if (stale.length) { console.error('mira.html desatualizado em: ' + stale.join(', ') + ' (rode node fonte/cenarios/ferramentas/embutir.js)'); process.exit(1); } console.log('mira.html em dia com', files.length, 'arquivos'); }
else { if (stale.length) fs.writeFileSync(MIRA, html); console.log(stale.length ? 'atualizado: ' + stale.join(', ') : 'nada a mudar'); }
