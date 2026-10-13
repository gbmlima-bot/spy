# Mira na Cobertura fora do claude.ai

O `index.html` da raiz do repositório é o mesmo jogo de `../mira.html` (versão 11), com uma troca: o multijogador,
que no claude.ai usa a capacidade `room`, aqui roda ponto a ponto entre os navegadores
(WebRTC, biblioteca PeerJS). Não há servidor do jogo: o navegador do anfitrião continua
rodando a partida, como no artefato.

- `rede-p2p.js`: a camada de rede. Imita a parte de `room` que o jogo usa (presença,
  salas por código e saída). Cada sala tem um "centro" que retransmite a presença; se quem
  segura o centro sai, outro navegador o assume e a migração de anfitrião do jogo segue igual.
- `montar.js`: gera o `index.html` da raiz a partir de `../mira.html` (da raiz: `node fonte/web/montar.js`
  ou `npm run build`). Rodar de novo sempre que `mira.html` mudar; `mira.html` não é alterado.
- `teste-rede.js`: partida de 3 navegadores com servidor de sinalização local (ver o topo do arquivo).

## Publicar

Qualquer hospedagem de arquivos estáticos serve; basta o `index.html`.

- GitHub Pages: repositório público com `index.html` na raiz, Settings > Pages > Deploy from
  branch (main, /root). Endereço: `https://<usuário>.github.io/<repositório>/`.
- Netlify Drop: arrastar esta pasta em https://app.netlify.com/drop (com conta gratuita, para o
  site não expirar).

## Dependências externas

- Sinalização: servidor público gratuito do PeerJS (0.peerjs.com), só para os navegadores se
  encontrarem; o jogo em si passa direto entre eles. Para usar um próprio, preencher
  `window.MIRA_NET` no topo de `index.html` (ou em `montar.js`).
- Redes muito fechadas: o PeerJS já inclui servidores de retransmissão (TURN) públicos.
- three.js e fontes vêm de CDNs, como no artefato.
