# Desempenho e qualidade visual

O jogo mantém os mesmos personagens, regras, missões, colisões e mensagens de rede em todos os perfis. O objetivo é 60 FPS em celulares intermediários e notebooks com vídeo integrado, com piso de 30 FPS em aparelhos mais fracos. Esses números precisam de validação física; SwiftShader não representa uma GPU de celular.

## Como funciona

- **Automática** começa em Equilibrada. Após aquecimento, duas janelas de 3 segundos abaixo de 45 FPS reduzem um nível; 15 segundos acima de 57 FPS recuperam qualidade. Há intervalo mínimo de 10 segundos entre mudanças. O relógio usa RAF real, sem o limite do passo da simulação. Carregamentos e abas ocultas não entram na decisão.
- **Alta:** densidade até 2, sombras 4096², MSAA 4×, bloom em meia resolução e desfoque completo.
- **Equilibrada:** densidade até 1,5, sombras 2048², MSAA 2×, bloom a ¼ e desfoque em resolução reduzida.
- **Leve:** densidade até 1, sombras 1024², FXAA, sem bloom/desfoque. Materiais emissivos e correção de cor permanecem. No automático, a resolução interna pode cair até 75%; o HUD continua na resolução CSS original.
- Perfis manuais ficam salvos e não se alteram sozinhos. MSAA indisponível usa FXAA. A opção fica no controle recolhível de qualidade, sem mudar os controles de ação.
- O LOD é conservador: ajusta suavemente partículas decorativas por tamanho projetado e reduz somente suas atualizações para 20/30 Hz. A luneta restaura imediatamente o detalhe completo. Personagens, gestos, objetos que escondem pessoas e pistas não desaparecem nem têm a geometria de acerto simplificada.
- Em Equilibrada/Leve, as sombras cobrem a área jogável de cada mapa e acompanham a iluminação noturna. Alta mantém o enquadramento original: recortar o mapa 4096² piorou o tempo de quadro no teste noturno. Geometrias primitivas imutáveis são compartilhadas; `K.mutable(mesh)` ou `{mutable:true}` cria uma cópia antes de editar vértices. Não transforme diretamente uma primitiva compartilhada.
- Grades de navegação são reutilizadas por ID e versão do build; uma atualização dos arquivos requer rebuild e recarga, que criam uma versão/cache novos. A grade é calculada antes do agrupamento de malhas. A ocupação dos convidados continua dinâmica.

## Build e hospedagem

Execute `npm ci` e `npm run build`. Publique **index.html e a pasta assets/** juntos, além dos arquivos estáticos já existentes. O endereço e os links `?sala=ABCD` permanecem iguais. Não há servidor de jogo adicional, service worker ou troca de engine.

O montador existente gera arquivos com hash SHA-256, integridade SRI e manifesto. Bibliotecas vêm dos pacotes fixados no lockfile; seus avisos/licenças acompanham o build. Os caminhos são relativos e funcionam em `/spy/`. Os scripts de cenário e as animações são solicitados somente antes da primeira partida que os utiliza. Falhas não ficam gravadas no cache de promessas e permitem outra tentativa.

O menu usa uma imagem estática do jogo; não monta a Cobertura, uma simulação de fundo ou os reflexos 3D. A iluminação de ambiente é preparada uma vez ao entrar na partida, e os buffers temporários são liberados. A geometria original da Cobertura fica em `fonte/web/cobertura.js`, criada somente quando esse mapa é necessário. O restante da lógica permanece em `fonte/mira.html`. `ensureMapAssets(id)` prepara os scripts; `loadMap(id)` continua síncrono para ferramentas após essa preparação. Os fluxos de partida usam preparação em etapas, com progresso entre iluminação, construção, navegação e agrupamento. `readyMapId` só muda para o mapa concluído no fim da preparação. Cancelamentos não podem invalidar uma preparação posterior; a detecção de peças animadas roda no contexto correto de cada cenário.

## Medir

```sh
python3 -m http.server 8874 --bind 127.0.0.1
# Em outro terminal, na raiz:
GPU=1 BENCH_NATIVE=1 QUALITY=high DEVICE='modelo e navegador' \
  JSON_OUT=fonte/testes/out/performance/medicao.json \
  node fonte/cenarios/ferramentas/desempenho.js http://127.0.0.1:8874/ 0,n,1,2,3,4,5,6,7,8,9,10
```

O padrão mede 3 repetições, cache frio/quente, agente/sniper/luneta, 1280×720 e 180 quadros por caso. `WIDTH`, `HEIGHT`, `SAMPLES`, `VIEWS`, `REPEATS` e `SHOTS` permitem recortes. `CHROMIUM_PATH` seleciona explicitamente um executável de navegador; sem `GPU=1`, o helper usa SwiftShader.

`BENCH_NATIVE=1` é necessário para medir cache HTTP real: interceptação de requisições do Playwright desativa esse cache. Use os mesmos arquivos de bibliotecas, fontes, resolução, semente, navegador e aparelho nas duas versões. O runner cria um contexto novo por cenário/repetição e mede a segunda navegação nesse mesmo contexto como cache quente. As câmeras compartilham a página e os arquivos do cenário; `initialView` identifica a primeira vista e o tempo de carga compartilhado, enquanto `viewSwitchMs` mede cada troca. A ferramenta espera a semente e a câmera corretas antes de aceitar os quadros. Ele registra o modo de cache e os tamanhos transferidos; cache frio aqui significa HTTP, não uma GPU reiniciada.

O JSON inclui tempo até menu e partida, construção, navegação, criação/atualização de personagens, simulação, interface, efeitos e submissão de renderização, mediana/p95 dos quadros, travamentos acima de 50 ms, chamadas, triângulos e recursos gráficos. Tempos de submissão não são medições diretas do tempo na GPU. Instrumentação de etapas fica desligada fora de `?perf` ou do benchmark. Falhas produzem relatório `complete:false` e saída 1.

A comparação desta entrega está em [RELATORIO-DESEMPENHO.md](RELATORIO-DESEMPENHO.md), com dados em `relatorios/desempenho.json`. Para regenerá-la a partir dos arquivos completos `before.json`, `after.json`, `balanced.json`, `integration.json` e `parity.json`, execute `npm run report:performance -- <pasta-dos-resultados>`. O gerador exige as contagens, câmeras e versão corretas; resultados interrompidos são rejeitados.

Para imagens comparáveis, fixe o perfil; não compare screenshots produzidas com adaptação automática. A ferramenta `fonte/testes/qualidade.js` cobre vista larga, luneta e agente, fixa `QUALITY=high` por padrão e aceita `n` para a Cobertura à noite. `AB=1` captura FXAA e MSAA 4× separadamente. Para aprovação final, registre Android intermediário, iPhone e notebook com vídeo integrado: mediana ≥55 FPS e p95 ≤25 ms nos intermediários; ≥28 FPS e p95 ≤40 ms no aparelho mais fraco.

## Verificar

```sh
npm run test:qualidade
npm run test:performance
npm run test:missoes
npm run test:mesas
npm run test:cenarios
node fonte/testes/t12.js http://127.0.0.1:8874/
node fonte/cenarios/ferramentas/oclusores.js http://127.0.0.1:8874/
node fonte/testes/t21.js http://127.0.0.1:8874/
node fonte/testes/t24.js http://127.0.0.1:8874/
# Para comparar dados com uma versão anterior servida em outra URL:
node fonte/testes/paridade.js <url-anterior> <url-atual>
npm run test:multijogador
node fonte/web/teste-rede.js
```

Execute suítes de navegador sequencialmente. A integração de performance verifica hospedagem sob `/spy/`, carregamento sob demanda, downloads concorrentes/repetidos após falha, qualidade sem alterar as regras, estabilidade de recursos após trocas de perfil, persistência e falha de WebGL. Os testes antigos que trocam mapas diretamente preparam os scripts sem construir todas as cenas.

As suítes de rede agora servem os arquivos estáticos completos, não somente o HTML. O Chromium gerenciado desta nuvem restringe WebRTC (`WebRtcIPHandling=disable_non_proxied_udp`); resultados de presença simulada não validam o transporte. Conexão real, sete participantes e migração de anfitrião precisam passar em navegador/ambiente que ofereça esse transporte antes da aprovação do multijogador. Nenhuma publicação é automática.
