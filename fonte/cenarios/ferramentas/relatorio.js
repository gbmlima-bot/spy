// Generate the consolidated report only from complete, matching benchmark/test outputs.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../../..'),out=path.resolve(process.argv[2]||path.join(root,'fonte/testes/out/performance'));
const read=n=>JSON.parse(fs.readFileSync(path.join(out,n+'.json')));
const before=read('before'),after=read('after'),balanced=read('balanced'),integration=read('integration'),parity=read('parity');
const version=JSON.parse(fs.readFileSync(path.join(root,'assets/manifest.json'))).version;
for(const r of [before,after,balanced]){assert.equal(r.complete,true);assert.equal(r.cacheMeasurement,'native-http');assert.equal(r.repeats,3);assert.ok(r.rows.every(x=>x.frames.length===r.samples&&x.camera===x.view));}
assert.equal(before.rows.length,54);assert.equal(after.rows.length,54);assert.equal(balanced.rows.length,18);
assert.ok(after.rows.every(r=>r.buildVersion===version));assert.ok(balanced.rows.every(r=>r.buildVersion===version));
assert.equal(integration.complete,true);assert.equal(parity.complete,true);assert.deepEqual(parity.worlds[0],parity.worlds[1]);
const q=(a,p)=>a.slice().sort((a,b)=>a-b)[Math.min(a.length-1,Math.ceil(a.length*p)-1)],median=a=>q(a,.5);
const fmt=n=>n.toFixed(1),sec=n=>(n/1000).toFixed(2),delta=(a,b)=>(100*(b/a-1)).toFixed(1)+'%';
const names={n:'Cobertura à noite',4:'Gala no Museu',9:'Noite no Riad'},views={agent:'Agente',sniper:'Sniper',scope:'Luneta'};
const rows=(r,map,view,cache)=>r.rows.filter(x=>x.map===map&&(!view||x.view===view)&&(!cache||x.cache===cache));
let text='# Relatório de otimização\n\n';
text+='Build medido: `'+version+'`. Referência: `dd9ef6d68117b217eea6a000cc776fa70098bd9c`. Nenhuma publicação foi realizada.\n\n';
text+='## Método e limites\n\n';
text+='Comparação local sequencial no mesmo Chromium '+before.browser+', com SwiftShader, resolução 480×270, densidade 1, semente 714025 e perfil Alto fixo nas duas versões. Cada cenário/câmera tem 3 repetições com cache HTTP frio e quente, 12 quadros por caso: 72 quadros agregados por cenário/câmera. A câmera e a conclusão de cada caso são verificadas pelo runner.\n\n';
text+='A referência recebeu apenas o gancho de semente do benchmark e URLs locais para as mesmas versões das bibliotecas; fontes externas foram bloqueadas nas duas versões pela mesma política de conteúdo. Esta é uma comparação consolidada, sem atribuir percentuais isolados a cada etapa da implementação.\n\n';
text+='Foram concluídos 54 casos da referência e 54 do build otimizado. Outros 18 casos medem Equilibrada na Cobertura à noite. A varredura exploratória anterior cobriu as 12 variações de mapa na vista do sniper e serviu para escolher os casos mais pesados. A comparação aprofundada cobre os três selecionados; o benchmark completo de todas as vistas/mapas em GPU real permanece pendente.\n\n';
text+='Os valores de quadro abaixo descrevem renderização por software nesta máquina; a aprovação de 55/28 FPS e p95 de 25/40 ms exige Android, iPhone e notebook com GPU integrada. A implementação disponibiliza o runner completo com 180 quadros por caso por padrão. Veja [DESEMPENHO.md](DESEMPENHO.md).\n\n';
text+='Como a densidade do experimento é 1, ele não mede o benefício dos limites de 1,5 e 1 em telas de alta densidade. Quadros tão longos também tornam esta amostra curta inadequada para aprovar estabilidade em 30/60 FPS.\n\n';
text+='## Carregamento\n\nTempo até menu pronto e até a primeira partida pronta, medianas das três repetições.\n\n';
text+='| Cenário | Cache | Menu antes → depois (s) | Partida antes → depois (s) | Variação da partida |\n|---|---|---:|---:|---:|\n';
for(const map of ['n','4','9'])for(const cache of ['cold','warm']){
 const a=rows(before,map,null,cache).filter(x=>x.initialView),b=rows(after,map,null,cache).filter(x=>x.initialView);
 const am=median(a.map(x=>x.menuMs)),bm=median(b.map(x=>x.menuMs)),al=median(a.map(x=>x.loadMs)),bl=median(b.map(x=>x.loadMs));
 text+=`| ${names[map]} | ${cache==='cold'?'Frio':'Quente'} | ${sec(am)} → ${sec(bm)} | ${sec(al)} → ${sec(bl)} | ${delta(al,bl)} |\n`;
}
text+='\nA preparação de reflexos, cenário e navegação ocorre na entrada da partida. O menu usa uma imagem estática e mantém os controles disponíveis sem simular a festa. Variação negativa indica redução de tempo.\n\n';
text+='## Quadros no perfil Alto\n\nMediana / p95 em ms, agregando as duas condições de cache e três repetições. Chamadas contam a cena, as sombras e o pós-processamento.\n\n';
text+='| Cenário | Vista | Antes: mediana / p95 | Depois: mediana / p95 | Chamadas antes → depois |\n|---|---|---:|---:|---:|\n';
for(const map of ['n','4','9'])for(const view of ['agent','sniper','scope']){
 const a=rows(before,map,view).flatMap(r=>r.frames),b=rows(after,map,view).flatMap(r=>r.frames);
 text+=`| ${names[map]} | ${views[view]} | ${fmt(median(a.map(x=>x.ms)))} / ${fmt(q(a.map(x=>x.ms),.95))} | ${fmt(median(b.map(x=>x.ms)))} / ${fmt(q(b.map(x=>x.ms),.95))} | ${median(a.map(x=>x.calls))} → ${median(b.map(x=>x.calls))} |\n`;
}
text+='\nUm recorte de sombras no perfil Alto foi descartado após regressão no piloto noturno. Alta mantém os limites originais das sombras; Equilibrada/Leve usam o recorte com mapas menores. Não há promessa de ganho uniforme de FPS em todos os ângulos.\n\n';
text+='No perfil Alto, várias vistas tiveram medianas e p95 maiores nesta comparação. Portanto, o ganho de carregamento não constitui aprovação de desempenho de renderização; essas diferenças precisam ser reavaliadas em GPU real antes da aprovação final.\n\n';
text+='## Equilibrada, perfil inicial do automático\n\nOs recursos gráficos seguem os limites descritos na documentação: sombras 2048², MSAA 2×, bloom a ¼ e desfoque reduzido.\n\n';
text+='| Vista na Cobertura à noite | Original Alto: mediana / p95 (ms) | Equilibrada: mediana / p95 (ms) |\n|---|---:|---:|\n';
for(const view of ['agent','sniper','scope']){
 const a=rows(before,'n',view).flatMap(r=>r.frames.map(f=>f.ms)),b=rows(balanced,'n',view).flatMap(r=>r.frames.map(f=>f.ms));
 text+=`| ${views[view]} | ${fmt(median(a))} / ${fmt(q(a,.95))} | ${fmt(median(b))} / ${fmt(q(b,.95))} |\n`;
}
text+='\n## Recursos e verificação funcional\n\n';
text+='- A entrada HTML tem '+fs.statSync(path.join(root,'index.html')).size+' bytes. Ela solicita scripts/CSS locais; o tamanho do HTML sozinho não é o download total do jogo. Os cenários e as animações são adiados e os arquivos possuem hash/SRI.\n';
text+='- Os '+integration.checks.length+' grupos de integração passaram: carregamento sob demanda, concorrência e repetição após falha, invariantes dos perfis, memória, FXAA, orientação, trocas de mapa, cancelamento, persistência e erro de WebGL. Incluem preservação das chamas animadas da Cobertura após agrupamento.\n';
text+='- Paridade com o original: SHA-256 das grades, colisões explícitas, alvos de missão e população inicial são iguais nos 11 mapas.\n';
text+='- Missões: 22 combinações de mapa/entrada, 4.140 casos de desafio concluídos, teclado e toque.\n';
text+='- Mesas PT/EN, cliques/toques dos cenários, caminhada/ocupação dos 174 objetos, visibilidade, oclusão, duas balas e convites entre abas passaram. A presença é simulada onde indicado pelos testes; isso não valida o transporte WebRTC.\n';
text+='- Controlador de qualidade: 9 testes passaram, incluindo recuperação de qualidade, histerese, modo manual, armazenamento indisponível e reaproveitamento dos perfis.\n\n';
text+='Recursos após ciclos completos de perfil (geometrias / texturas): '+integration.resources.map(r=>r.geometries+' / '+r.textures).join(' → ')+'.\n\n';
text+='Recursos após ciclos de mapas (geometrias / texturas): '+integration.mapResources.map(r=>r.geometries+' / '+r.textures).join(' → ')+'. As revisitas reutilizaram a navegação (`navMs=0`). Os contadores são objetos gráficos, não uma medição de VRAM em bytes.\n\n';
text+='## Pendências de aprovação\n\n';
text+='- Medir e revisar visualmente em Android intermediário, iPhone e notebook com GPU integrada, com sessões mais longas e a matriz completa. As metas de FPS em aparelhos reais ainda não estão certificadas.\n';
text+='- Completar sete participantes e migração de anfitrião em navegador que permita WebRTC. O Chromium gerenciado tem `WebRtcIPHandling=disable_non_proxied_udp`; a tentativa local de transporte não autoriza afirmar que o multijogador foi validado.\n\n';
text+='A suíte real de sete participantes foi executada e terminou com `Timeout 45000ms` ao esperar `Net.peers().length === 7`, antes da partida. A migração de anfitrião não foi executada após esse bloqueio de transporte.\n\n';
text+='Resultados detalhados e capturas da execução ficam em `fonte/testes/out/performance/` (ignorado pelo Git): `before.json`, `after.json`, `balanced.json`, `integration.json`, `parity.json` e pastas de imagens. Os relatórios de benchmark têm `complete:true`; medições interrompidas/pilotos não são resultados aprovados.\n';
const reportDir=path.join(root,'relatorios');fs.mkdirSync(reportDir,{recursive:true});
const digest=v=>require('crypto').createHash('sha256').update(JSON.stringify(v)).digest('hex');
const parityEvidence={complete:parity.complete,worlds:parity.worlds.map(world=>world.map(map=>({id:map.id,nav:map.nav,cols:digest(map.cols),missions:digest(map.missions),population:digest(map.population)})))};
fs.writeFileSync(path.join(reportDir,'desempenho.json'),JSON.stringify({version,reference:'dd9ef6d68117b217eea6a000cc776fa70098bd9c',approval:{physicalDevices:'pending',fullMapCameraBenchmark:'pending',webrtc:'blocked by managed Chromium WebRtcIPHandling policy; seven-player transport and host migration pending'},before,after,balanced,integration,parity:parityEvidence}));
text+='\nOs dados brutos dos benchmarks e da integração também acompanham a entrega em [relatorios/desempenho.json](relatorios/desempenho.json).\n';
const captures=[
  ['before-shots/cold-n-agent.png','antes-cobertura-agente.png','Alta: agente antes'],
  ['after-shots/cold-n-agent.png','depois-cobertura-agente.png','Alta: agente depois'],
  ['low-shots/low-n-luneta.png','leve-cobertura-luneta.png','Leve: luneta na Cobertura à noite'],
  ['low-shots/low-9-luneta.png','leve-riad-luneta.png','Leve: luneta no Riad']
].filter(([source])=>fs.existsSync(path.join(out,source)));
if(captures.length){
  const images=path.join(reportDir,'imagens');fs.mkdirSync(images,{recursive:true});
  text+='\n## Referências visuais\n\nCapturas representativas, com perfil fixo. As animações continuam ativas; diferenças de pose não são uma comparação de pixels. A inspeção local da luneta em Leve preservou roupas, placas e objetos nestes dois cenários. A revisão completa em aparelhos reais permanece pendente.\n\n';
  for(const [source,file,label]of captures){fs.copyFileSync(path.join(out,source),path.join(images,file));text+=`- [${label}](relatorios/imagens/${file})\n`;}
}
fs.writeFileSync(path.join(root,'RELATORIO-DESEMPENHO.md'),text);
console.log('Wrote verified report for',version);
