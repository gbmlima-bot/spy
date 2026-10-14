# Como contribuir

## Onde fica o quê

- **Fonte do jogo:** `fonte/mira.html` (arquivo único). É aqui que se edita o jogo.
- **`index.html` da raiz:** gerado, é o que o GitHub Pages publica. **Nunca editar à mão.**
  Depois de mudar `fonte/mira.html` (ou `fonte/web/rede-p2p.js`), regenerar e commitar junto:

  ```sh
  node fonte/web/montar.js   # ou: npm run build
  ```

- `fonte/web/`: camada de rede ponto a ponto (`rede-p2p.js`), o montador (`montar.js`) e o teste de rede.
- `fonte/cenarios/`: os 10 cenários (`src/`), ferramentas de prévia e teste (`ferramentas/`) e o guia
  `INTEGRACAO.md`. O `mira.html` leva uma cópia de `src/kit.js`, `src/personagens.js` e de cada cenário: edite o
  arquivo em `src/` e rode `npm run cenarios` (`node fonte/cenarios/ferramentas/embutir.js`) para copiar para o
  `mira.html`; `npm run build` já faz isso antes de montar. Não edite esses blocos direto no `mira.html`. A prévia (`previa.html`) é gerada por `node fonte/cenarios/ferramentas/build.js`
  e não vai para o repositório.
- `fonte/testes/`: testes headless (Playwright) do jogo.

## Fluxo de trabalho

1. Crie um branch a partir de `main` (ex.: `sniper/recuo-da-luneta`).
2. Faça PRs pequenos e focados: um assunto por PR.
3. Antes de mergear, faça rebase em `main` (`git fetch origin && git rebase origin/main`), rode
   `node fonte/web/montar.js` de novo e confira que o `index.html` gerado está no commit.
   Em conflito no `index.html`, não resolva à mão: resolva o `fonte/mira.html` e regenere.
4. Rode os testes que tocam no que você mudou (abaixo) e diga no PR quais rodou.

## Áreas

Para evitar conflitos entre quem trabalha em paralelo, cada PR deve ficar, de preferência, numa área:

- **personagens** (rig, roupas, animações; ver também `fonte/cenarios/src/personagens.js`)
- **microinterações das missões** (tells, feedback das missões dos agentes)
- **sniper** (luneta, mira, tiro, marcação)
- **cenários** (`fonte/cenarios/` e a integração deles no `mira.html`)

## Testes

- Jogo: `fonte/testes/t1.js` … `t8.js` (com `lib.js` e `mock.js`, que imita a sala multijogador).
  Cada teste recebe a URL da página como 1º argumento, por exemplo
  `node fonte/testes/t1.js http://localhost:8765/mira-pub.html`, com um servidor estático local
  servindo uma cópia de `fonte/mira.html`. As capturas vão para `fonte/testes/out/`.
- Equilíbrio: `node fonte/testes/t10.js <url> [rodadas] [mapas]` joga rodadas inteiras só com o
  computador (agente e 3 cúmplices robôs contra o sniper de IA), sem desenhar, e mostra por mapa a
  vitória do agente (`agentWinPct`), missões por rodada, por que a rodada acabou (`why`) e quantos
  convidados fazem gestos de missão por minuto (`coverPerMin`). Mapas: 0 é a cobertura, 1 a 10 os
  cenários extras. Exemplo, 30 rodadas em cada cenário extra:
  `node fonte/testes/t10.js http://localhost:8765/mira-pub.html 30 1,2,3,4,5,6,7,8,9,10`.
  Rode antes e depois de mudar o sniper de IA, as missões ou os convidados e ponha os números no PR.
- Missões: `t11.js` confere gesto, duração e conclusão das missões do agente; `rotulos.js <url> <arquivo>`
  lista os rótulos das missões de todos os mapas.
- Tempo das missões: `node fonte/testes/t16.js <url> [rodadas] [mapas]` calcula, por mapa, quanto um agente
  eficiente leva para fazer 4 missões (caminho com escadas na velocidade do jogador, minidesafio no ritmo de uma
  pessoa, a encomenda antes da entrega, sem o sniper). `best` planeja a melhor ordem e `greedy` vai sempre à mais
  próxima. O combinado é caber em 3,5 minutos (210 s) com folga; rode ao mudar o sorteio das missões ou os desafios.
- Visibilidade dos pontos de missão: `node fonte/testes/t12.js <url> [mapas]`. Um ponto é válido se, do olho
  do sniper, há linha livre até a cabeça (1,6 m) ou o peito (1,2 m) de quem está no ponto de pé, sem nada que
  bloqueie o tiro (a lista que o anfitrião confere) nem nada opaco que tape a visão. Sai com código 1 se algum
  ponto for inválido. Rode ao mexer em cenário, objeto de missão ou posição do sniper.
- Rede: `node fonte/web/teste-rede.js` (3 navegadores, anfitrião sai, outro assume). Usa o
  `index.html` da raiz e precisa de `npm i peer express@4` (servidor de sinalização local).
- Ninhos temáticos (`sc.ninho`): `node fonte/cenarios/ferramentas/ninhos.js <url> [mapas]` confere a interface
  do ninho (superfície em -0,79, visão livre, laterais) e que nada dele tapa a cabeça de quem anda em qualquer
  célula livre. Sai com código 1 se algo falhar.
- Cenários: `node fonte/cenarios/ferramentas/testar.js <id> <pasta-de-saida> [--rapido]`
  (three.js de `fonte/testes/cdn/`, ou de um pacote three@0.128 apontado por `THREE_LIB`).

### Notas para testar headless (contêiner)

- Os CDNs são bloqueados no contêiner. Os testes interceptam as requisições e servem os arquivos
  de `cdn/` (`cdn/index.txt`: uma linha `arquivo url` por arquivo), em `fonte/testes/cdn/` e
  `fonte/web/cdn/`. Essas pastas não vão para o repositório.
- O three.js r128 se baixa de `raw.githubusercontent.com` (ex.:
  `https://raw.githubusercontent.com/mrdoob/three.js/r128/build/three.min.js`), que não é bloqueado.
- Cópias de teste do `mira.html` precisam de `<meta charset="utf-8">` no início; sem isso o texto
  com acentos quebra quando servido sem charset.
- WebGL roda por software (SwiftShader): os testes são lentos e usam timeouts longos.
