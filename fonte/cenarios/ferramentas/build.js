// Monta a prévia num HTML único: node build.js [saida.html] [--so id-do-cenario]
// Cada arquivo vai num <script> próprio, então um erro num cenário não derruba os outros.
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', 'src');
const args = process.argv.slice(2), so = args.includes('--so') ? args[args.indexOf('--so') + 1] : null;
const out = args.find(a => a.endsWith('.html')) || path.join(__dirname, '..', 'previa.html');
const rd = f => fs.readFileSync(path.join(SRC, f), 'utf8');
let cen = fs.readdirSync(SRC).filter(f => /^\d\d-.*\.js$/.test(f)).sort();
if (so) cen = cen.filter(f => f.includes(so));
const motor = rd('motor.js').replace('//@@CHARS@@', () => rd('rig-base.js'));
const blocks = [rd('kit.js'), rd('personagens.js'), ...cen.map(f => `// ===== ${f}\n` + rd(f)), motor];
const html = rd('previa.template.html').replace('<script>\n//@@SCRIPTS@@\n</script>', () => blocks.map(b => '<script>\n' + b.replace(/<\/script/gi, '<\\/script') + '\n</script>').join('\n'));
fs.writeFileSync(out, html);
console.log('ok', out, (html.length / 1024).toFixed(0) + ' KB', cen.length + ' cenário(s)');
