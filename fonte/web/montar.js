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
const net = '<script src="https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"></script>\n' +
  '<script>window.MIRA_WEB = true; // site publicado: link de convite (?sala=ABCD) e botão de chamar amigos</script>\n' +
  '<script>\n// Para usar um servidor de sinalização próprio, descomente e ajuste:\n// window.MIRA_NET = { host: "seu-servidor.exemplo", port: 443, path: "/", secure: true };\n</script>\n' +
  '<script>\n' + rede + '</script>\n';
const out = head + src.replace(anchor, net + anchor) + '\n</html>\n';
const dest = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'index.html'));
fs.writeFileSync(dest, out);
console.log(path.relative(process.cwd(), dest) || dest, (out.length / 1024 / 1024).toFixed(2), 'MB');
