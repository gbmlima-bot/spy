# Relatório de otimização

Build medido: `74584abea48fc37a`. Referência: `dd9ef6d68117b217eea6a000cc776fa70098bd9c`. Nenhuma publicação foi realizada.

## Método e limites

Comparação local sequencial no mesmo Chromium 154.0.8037.57, com SwiftShader, resolução 480×270, densidade 1, semente 714025 e perfil Alto fixo nas duas versões. Cada cenário/câmera tem 3 repetições com cache HTTP frio e quente, 12 quadros por caso: 72 quadros agregados por cenário/câmera. A câmera e a conclusão de cada caso são verificadas pelo runner.

A referência recebeu apenas o gancho de semente do benchmark e URLs locais para as mesmas versões das bibliotecas; fontes externas foram bloqueadas nas duas versões pela mesma política de conteúdo. Esta é uma comparação consolidada, sem atribuir percentuais isolados a cada etapa da implementação.

Foram concluídos 54 casos da referência e 54 do build otimizado. Outros 18 casos medem Equilibrada na Cobertura à noite. A varredura exploratória anterior cobriu as 12 variações de mapa na vista do sniper e serviu para escolher os casos mais pesados. A comparação aprofundada cobre os três selecionados; o benchmark completo de todas as vistas/mapas em GPU real permanece pendente.

Os valores de quadro abaixo descrevem renderização por software nesta máquina; a aprovação de 55/28 FPS e p95 de 25/40 ms exige Android, iPhone e notebook com GPU integrada. A implementação disponibiliza o runner completo com 180 quadros por caso por padrão. Veja [DESEMPENHO.md](DESEMPENHO.md).

Como a densidade do experimento é 1, ele não mede o benefício dos limites de 1,5 e 1 em telas de alta densidade. Quadros tão longos também tornam esta amostra curta inadequada para aprovar estabilidade em 30/60 FPS.

## Carregamento

Tempo até menu pronto e até a primeira partida pronta, medianas das três repetições.

| Cenário | Cache | Menu antes → depois (s) | Partida antes → depois (s) | Variação da partida |
|---|---|---:|---:|---:|
| Cobertura à noite | Frio | 11.80 → 0.41 | 17.93 → 11.31 | -36.9% |
| Cobertura à noite | Quente | 13.38 → 1.48 | 19.21 → 12.04 | -37.3% |
| Gala no Museu | Frio | 11.91 → 0.40 | 17.19 → 6.00 | -65.1% |
| Gala no Museu | Quente | 12.80 → 1.14 | 17.66 → 6.59 | -62.7% |
| Noite no Riad | Frio | 13.17 → 0.38 | 17.23 → 5.04 | -70.7% |
| Noite no Riad | Quente | 13.42 → 1.06 | 17.43 → 5.72 | -67.2% |

A preparação de reflexos, cenário e navegação ocorre na entrada da partida. O menu usa uma imagem estática e mantém os controles disponíveis sem simular a festa. Variação negativa indica redução de tempo.

## Quadros no perfil Alto

Mediana / p95 em ms, agregando as duas condições de cache e três repetições. Chamadas contam a cena, as sombras e o pós-processamento.

| Cenário | Vista | Antes: mediana / p95 | Depois: mediana / p95 | Chamadas antes → depois |
|---|---|---:|---:|---:|
| Cobertura à noite | Agente | 800.0 / 1016.6 | 800.1 / 1016.7 | 953 → 952 |
| Cobertura à noite | Sniper | 1000.0 / 1166.6 | 1066.6 / 1183.4 | 2299 → 2299 |
| Cobertura à noite | Luneta | 533.3 / 683.2 | 566.5 / 700.0 | 636 → 636 |
| Gala no Museu | Agente | 600.0 / 700.0 | 616.6 / 733.3 | 1192 → 1189 |
| Gala no Museu | Sniper | 700.0 / 833.3 | 733.3 / 916.8 | 1476 → 1475 |
| Gala no Museu | Luneta | 400.0 / 533.4 | 433.3 / 499.9 | 693 → 693 |
| Noite no Riad | Agente | 483.2 / 533.3 | 483.3 / 566.6 | 1448 → 1448 |
| Noite no Riad | Sniper | 633.3 / 733.4 | 666.7 / 766.6 | 2244 → 2244 |
| Noite no Riad | Luneta | 333.3 / 383.3 | 350.0 / 400.0 | 775 → 775 |

Um recorte de sombras no perfil Alto foi descartado após regressão no piloto noturno. Alta mantém os limites originais das sombras; Equilibrada/Leve usam o recorte com mapas menores. Não há promessa de ganho uniforme de FPS em todos os ângulos.

No perfil Alto, várias vistas tiveram medianas e p95 maiores nesta comparação. Portanto, o ganho de carregamento não constitui aprovação de desempenho de renderização; essas diferenças precisam ser reavaliadas em GPU real antes da aprovação final.

## Equilibrada, perfil inicial do automático

Os recursos gráficos seguem os limites descritos na documentação: sombras 2048², MSAA 2×, bloom a ¼ e desfoque reduzido.

| Vista na Cobertura à noite | Original Alto: mediana / p95 (ms) | Equilibrada: mediana / p95 (ms) |
|---|---:|---:|
| Agente | 800.0 / 1016.6 | 800.0 / 999.9 |
| Sniper | 1000.0 / 1166.6 | 1050.0 / 1216.7 |
| Luneta | 533.3 / 683.2 | 583.2 / 733.3 |

## Recursos e verificação funcional

- A entrada HTML tem 17373 bytes. Ela solicita scripts/CSS locais; o tamanho do HTML sozinho não é o download total do jogo. Os cenários e as animações são adiados e os arquivos possuem hash/SRI.
- Os 10 grupos de integração passaram: carregamento sob demanda, concorrência e repetição após falha, invariantes dos perfis, memória, FXAA, orientação, trocas de mapa, cancelamento, persistência e erro de WebGL. Incluem preservação das chamas animadas da Cobertura após agrupamento.
- Paridade com o original: SHA-256 das grades, colisões explícitas, alvos de missão e população inicial são iguais nos 11 mapas.
- Missões: 22 combinações de mapa/entrada, 4.140 casos de desafio concluídos, teclado e toque.
- Mesas PT/EN, cliques/toques dos cenários, caminhada/ocupação dos 174 objetos, visibilidade, oclusão, duas balas e convites entre abas passaram. A presença é simulada onde indicado pelos testes; isso não valida o transporte WebRTC.
- Controlador de qualidade: 9 testes passaram, incluindo recuperação de qualidade, histerese, modo manual, armazenamento indisponível e reaproveitamento dos perfis.

Recursos após ciclos completos de perfil (geometrias / texturas): 790 / 64 → 791 / 64 → 791 / 64.

Recursos após ciclos de mapas (geometrias / texturas): 1202 / 98 → 1197 / 98 → 1195 / 98. As revisitas reutilizaram a navegação (`navMs=0`). Os contadores são objetos gráficos, não uma medição de VRAM em bytes.

## Pendências de aprovação

- Medir e revisar visualmente em Android intermediário, iPhone e notebook com GPU integrada, com sessões mais longas e a matriz completa. As metas de FPS em aparelhos reais ainda não estão certificadas.
- Completar sete participantes e migração de anfitrião em navegador que permita WebRTC. O Chromium gerenciado tem `WebRtcIPHandling=disable_non_proxied_udp`; a tentativa local de transporte não autoriza afirmar que o multijogador foi validado.

A suíte real de sete participantes foi executada e terminou com `Timeout 45000ms` ao esperar `Net.peers().length === 7`, antes da partida. A migração de anfitrião não foi executada após esse bloqueio de transporte.

Resultados detalhados e capturas da execução ficam em `fonte/testes/out/performance/` (ignorado pelo Git): `before.json`, `after.json`, `balanced.json`, `integration.json`, `parity.json` e pastas de imagens. Os relatórios de benchmark têm `complete:true`; medições interrompidas/pilotos não são resultados aprovados.

Os dados brutos dos benchmarks e da integração também acompanham a entrega em [relatorios/desempenho.json](relatorios/desempenho.json).

## Referências visuais

Capturas representativas, com perfil fixo. As animações continuam ativas; diferenças de pose não são uma comparação de pixels. A inspeção local da luneta em Leve preservou roupas, placas e objetos nestes dois cenários. A revisão completa em aparelhos reais permanece pendente.

- [Alta: agente antes](relatorios/imagens/antes-cobertura-agente.png)
- [Alta: agente depois](relatorios/imagens/depois-cobertura-agente.png)
- [Leve: luneta na Cobertura à noite](relatorios/imagens/leve-cobertura-luneta.png)
- [Leve: luneta no Riad](relatorios/imagens/leve-riad-luneta.png)
