// Convite em um toque: quem cria a sala no site publicado (MIRA_WEB) vê "Chamar amigos" e "Copiar link", o endereço passa
// a ter ?sala=ABCD, e quem abre esse link entra direto na sala (com nome guardado) ou vê o convite com um botão só (sem nome).
// node fonte/testes/t24.js http://localhost:8765/mira-pub.html
const L = require('./lib');
const [U] = process.argv.slice(2);
const t0 = Date.now(), ok = (c, m) => { console.log((c ? 'ok   ' : 'FALHA') + ' ' + m + ' (' + ((Date.now() - t0) / 1000 | 0) + ' s)'); if (!c) process.exitCode = 1; };
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1000, height: 700 } });
  await ctx.addInitScript(() => { window.MIRA_WEB = true; });
  const a = await L.page(ctx, U);
  await a.waitForFunction(() => !document.querySelector('#multiBox').hidden, null, { timeout: 60000, polling: 500 });
  await a.evaluate(() => { document.querySelector('#nome').value = 'Ana'; document.querySelector('#btnCreate').click(); });
  await a.waitForFunction(() => !document.querySelector('#lobby').hidden && /^\?sala=[A-Z]{4}$/.test(location.search), null, { timeout: 60000, polling: 500 });
  const code = await a.$eval('#lobbyCode', e => e.textContent);
  ok(await a.$eval('#shareRow', e => !e.hidden), 'botões de convite aparecem na sala');
  ok(await a.$eval('#btnShare', e => e.classList.contains('primary')), 'sozinho na sala, "Chamar amigos" é o botão principal');
  ok(await a.evaluate(() => location.search) === '?sala=' + code, 'endereço tem ?sala=' + code);
  // convidado com nome guardado: entra sem tocar em nada
  // (o nome já ficou guardado por quem criou a sala, no mesmo navegador; o menu some logo, então espera só o jogo carregar)
  const b2 = await L.page(ctx, U + '?sala=' + code, { until: () => !!window.__mira });
  await b2.waitForFunction(() => !document.querySelector('#lobby').hidden, null, { timeout: 60000, polling: 500 }).catch(() => { });
  ok(await b2.$eval('#lobby', e => !e.hidden), 'link com nome guardado entra direto na sala');
  await a.waitForFunction(() => document.querySelectorAll('#players li').length === 2, null, { timeout: 60000, polling: 500 }).catch(() => { });
  ok(await a.$$eval('#players li', l => l.length) === 2, 'anfitrião vê 2 na sala');
  ok(await a.$eval('#btnShare', e => !e.classList.contains('primary')), 'com 2, "Começar rodada" volta a ser o principal');
  await a.screenshot({ path: __dirname + '/out/t24-sala.png' });
  // voltar ao menu tira a sala do endereço
  await b2.evaluate(() => document.querySelector('#btnLeave').click());
  ok(await b2.evaluate(() => location.search) === '', 'sair da sala limpa o endereço');
  await b2.close(); await a.close();
  // convidado sem nome: convite com um botão só
  const ctx2 = await b.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
  await ctx2.addInitScript(() => { window.MIRA_WEB = true; });
  const c = await L.page(ctx2, U + '?sala=' + code);
  await c.waitForFunction(() => !document.querySelector('#invite').hidden, null, { timeout: 60000, polling: 500 }).catch(() => { });
  ok(await c.$eval('#invite', e => !e.hidden) && await c.$eval('#btnInvite', e => !e.hidden && e.textContent.includes(e.ownerDocument.querySelector('#inviteCode').textContent)), 'sem nome: convite com "Entrar na sala ' + code + '"');
  ok(await c.$eval('#lobby', e => e.hidden), 'sem nome: ainda não entrou');
  await c.screenshot({ path: __dirname + '/out/t24-convite.png' });
  await b.close();
})();
