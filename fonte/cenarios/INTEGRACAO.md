# Integração dos 10 cenários no mira.html

Prévia jogável: https://claude.ai/artifact/EKAFhGNDXwxEantPAMM4Nq (fonte: `previa.html`, montada por `ferramentas/build.js`).
Nada aqui mexe no `mira.html`. Os cenários são dados + uma função `build(K)` que monta a cena num `THREE.Group`.

## Arquivos
- `src/kit.js`: `MIRA_KIT(THREE, root, seed)` devolve o kit `K` (geometria, materiais, colisão, vagas, tells, animações). Independe do jogo.
- `src/personagens.js`: `MIRA_VESTIR(T, o, B, m, mat, glow, headG)` desenha chapéus, máscaras, capas, aventais e 30 objetos de mão.
- `src/01-veneza.js` … `src/10-expresso.js`: cada um faz `MIRA_CENARIOS.push({...})`.
- `src/motor.js`: o motor da prévia. Serve de referência para a navegação (A* em grade), multidão temática e escadas retas.
- `src/rig-base.js`: cópia do rig/makeChar do mira.html (2026-10-10) com o gancho abaixo.
- `ferramentas/testar.js <id> <pasta>`: teste headless (alcance de vagas/missões, tells, capturas).

## Mapeamento para os globais do jogo
| Jogo (mira.html) | Cenário |
|---|---|
| `LEVELS` | `sc.niveis` (`{nome, y, x0, x1, z0, z1}`; o jogo hoje fixa x em ±14.5) |
| `LINKS` (escadas em caracol) | `sc.escadas` (`{de, para, a:[x,z], b:[x,z]}`: rampa reta de a até b; a geometria já está no cenário) |
| `MISSIONS` | `sc.missoes` (mesmos campos `k, label, where, s, l, lv`) |
| `STATICS` | `sc.elenco` (`x, z, lv, rot, anim, outfit`, mais `y` de altura extra e `fala`) |
| `SLOTS` / `addSlot` | `K.slots` (`{x, z, rot, type, lv}`, mesmos tipos) |
| `COLS` | `K.cols` (`{x0, z0, x1, z1, lv}`) |
| `applyTell` / `resetProps` | `K.tells[k].tell(live)` / `K.tells[k].reset()` |
| `stepFX` | `K.update(dt, t)` |
| `outfitFor` (convidados) | `sc.guardaRoupa` (ver `crowdOutfit` em motor.js) |
| `SNIPER_POS` | `sc.sniper.pos` |
| céu, neblina, luzes, exposição, bloom | `sc.ambiente` (ver `load()` em motor.js) |

Os cliques do jogo usam a superfície visível do objeto, os objetos/materiais nomeados nos efeitos e os pontos
dos itens deixados acima do chão. `sc.missoes[].hitRadius` permite ajustar o raio de clique ao redor de `l`
para peças largas (padrão 1; a bandeira do iate usa 1,4). Isso não muda o alcance da ação, o ponto `s` nem a colisão.

## Passos sugeridos
1. Incluir kit.js, personagens.js e os 10 cenários antes do script principal.
2. Em `makeChar`, logo antes de `root.userData = {...}`: `if (window.MIRA_VESTIR) MIRA_VESTIR(T, o, B, m, mat, glow, headG);`
3. Envolver a construção atual da cobertura num grupo (`MAPA_ORIGINAL`) para poder escondê-la quando outro cenário for escolhido.
4. Carregar um cenário: `root = new THREE.Group(); scene.add(root); K = MIRA_KIT(THREE, root, seed); sc.build(K);` e trocar os globais da tabela acima.
5. O id do cenário vai no estado da sala (o anfitrião escolhe; os outros recebem no sync e montam o mesmo).
6. Missões da rodada: sortear 6 das 8–9 do cenário.
7. Navegação: os cenários têm muitos obstáculos; o `route` atual (linha reta + portas) prende convidados. Portar `buildGrid/astar/route` de motor.js.

## Limites conhecidos
- Testado só em WebGL por software (headless); não verificado em GPU real nem no celular.
- Convidados de vestido longo sentados mostram as pernas sob a saia (limitação do rig).
- 368 a 1808 meshes por cenário, mais ~37 personagens.
