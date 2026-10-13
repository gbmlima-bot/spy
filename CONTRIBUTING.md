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
- Rede: `node fonte/web/teste-rede.js` (3 navegadores, anfitrião sai, outro assume). Usa o
  `index.html` da raiz e precisa de `npm i peer express@4` (servidor de sinalização local).
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
