// Gera o index.html da raiz do repositório a partir de fonte/mira.html (sem alterá-lo): mesmo jogo,
// com a rede ponto a ponto no lugar da capacidade room do claude.ai.
// Uso (da raiz do repositório): node fonte/web/montar.js [saida.html]
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'mira.html'), 'utf8');
const rede = fs.readFileSync(path.join(__dirname, 'rede-p2p.js'), 'utf8');
const anchor = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>';
if (!src.includes(anchor)) throw new Error('ponto de inserção não encontrado em mira.html');
const head = '<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n';
const net = '<script src="https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"></script>\n' +
  '<script>\n// Para usar um servidor de sinalização próprio, descomente e ajuste:\n// window.MIRA_NET = { host: "seu-servidor.exemplo", port: 443, path: "/", secure: true };\n</script>\n' +
  '<script>\n' + rede + '</script>\n';
const out = head + src.replace(anchor, net + anchor) + '\n</html>\n';
const dest = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'index.html'));
fs.writeFileSync(dest, out);
console.log(path.relative(process.cwd(), dest) || dest, (out.length / 1024 / 1024).toFixed(2), 'MB');
