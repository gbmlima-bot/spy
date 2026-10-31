// Integration checks: lazy chunks, retries, quality invariants, GPU resource lifecycle and subpath hosting.
const assert = require('node:assert/strict'), fs = require('fs'), path = require('path');
const express = require('express'), L = require('./lib');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(__dirname,'out/performance');
fs.mkdirSync(OUT,{recursive:true});
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT,'assets/manifest.json')));
for(const file of manifest.files) {
  const data=fs.readFileSync(path.join(ROOT,'assets',file));
  const hash=require('crypto').createHash('sha256').update(data).digest('hex').slice(0,16);
  assert.ok(file.includes('.'+hash+'.'),'content hash '+file);
}
(async()=>{
 const app=express();app.use('/spy',express.static(ROOT));const server=app.listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));const url='http://127.0.0.1:'+server.address().port+'/spy/';
 let browser;const report={checks:[],resources:[],mapResources:[],errors:[],complete:false};
 try{
  browser=await L.launch();
  const context=await browser.newContext({viewport:{width:480,height:320},deviceScaleFactor:2});
  await context.addInitScript(()=>{window.__noIntro=true;window.__benchmarkSeed=714025;localStorage.setItem('mira-quality','low')});
  const p=await L.page(context,url,{preload:false});p.on('pageerror',e=>report.errors.push(e.message));
  const initial=await p.evaluate(()=>({map:__mira.SCEN.id,scene:__mira.renderer.info.memory.geometries,loaded:performance.getEntriesByType('resource').map(x=>x.name)}));
  assert.equal(initial.map,-1);assert.ok(initial.scene<50);assert.ok(initial.loaded.every(x=>!x.includes('/mapa-')));report.checks.push('menu has no built/downloaded map');
  // Shared concurrent failures must not poison a later retry.
  let failed=false;
  await p.route('**/'+path.basename(manifest.maps[1][0].url),r=>{if(!failed){failed=true;return r.abort();}return r.continue()});
  const failedLoad=await p.evaluate(async()=>{
    const a=__mira.ensureMapAssets(1),b=__mira.ensureMapAssets(1);const same=a===b;
    const outcomes=await Promise.allSettled([a,b]);return{same,states:outcomes.map(x=>x.status)};
  });
  assert.equal(failedLoad.same,true);assert.deepEqual(failedLoad.states,['rejected','rejected']);
  await p.evaluate(()=>__mira.ensureMapAssets(1));
  assert.equal(await p.evaluate(()=>MIRA_ASSETS.ready(1)),true);report.checks.push('concurrent download failure and retry');
  assert.equal(await p.evaluate(()=>__mira.ensureMapAssets(99).then(()=>false,()=>true)),true);
  await p.selectOption('#mapSel','1');await p.click('#btnSoloA');
  await p.waitForFunction(()=>__mira.G.sim&&__mira.G.role==='a'&&__mira.CHARS().length>10,null,{timeout:180000,polling:100});
  assert.equal(await p.evaluate(()=>!!__mira.composer),true,'post-processing must not silently fall back');
  await p.evaluate(() => { const S=__mira.G.sim; S.ph='play'; S.t=240; S._st=null; S.ai.update=()=>{}; __mira.G.lastPh=null; });
  const snapshot=()=>p.evaluate(()=>{const M=__mira;return JSON.stringify({npc:M.G.sim.ents.length,missions:M.MISSIONS.map(m=>[m.label,m.p,m.s,m.l]),cols:M.COLS,nav:M.NAV.lv.map(n=>Array.from(n.g)),occluders:M.SCEN.occ.map(o=>o.uuid)})});
  const before=await snapshot();
  for(const mode of ['high','balanced','low']){
    await p.evaluate(mode=>__mira.quality.set(mode),mode);
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const settings=await p.evaluate(()=>({q:__mira.quality.snapshot(),ms:__mira.postMS,pixel:__mira.renderer.getPixelRatio(),shadow:__mira.sun.shadow.mapSize.x,post:!!__mira.composer,passes:__mira.composer.passes.map(p=>p.enabled)}));
    assert.equal(settings.post,true);assert.equal(settings.shadow,{high:4096,balanced:2048,low:1024}[mode]);assert.equal(settings.pixel,{high:2,balanced:1.5,low:1}[mode]);
    assert.equal(await snapshot(),before,'quality must not change game or occluders');
    if(mode==='low')assert.equal(settings.ms,0);
    await p.evaluate(()=>document.querySelector('#hud').style.visibility='hidden');
    await p.screenshot({path:path.join(OUT,'quality-'+mode+'.png'),timeout:180000});
    await p.evaluate(()=>document.querySelector('#hud').style.visibility='');
  }
  report.checks.push('profiles preserve missions, population, navigation and occluders');
  // Render each profile before disposal: this tests uploaded GPU resources, not just JS object creation.
  for(let cycle=0;cycle<3;cycle++){
    for(const mode of ['high','balanced','low']){
      await p.evaluate(mode=>__mira.quality.set(mode),mode);
      await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    }
    report.resources.push(await p.evaluate(()=>({...__mira.renderer.info.memory,programs:__mira.renderer.info.programs.length})));
  }
  assert.ok(report.resources[2].textures<=report.resources[0].textures+2,'post textures must stabilize');
  assert.ok(report.resources[2].geometries<=report.resources[0].geometries+2,'post geometries must stabilize');
  report.checks.push('repeated quality swaps stabilize GPU resources');
  await p.evaluate(() => { const C=THREE.WebGLMultisampleRenderTarget; try { THREE.WebGLMultisampleRenderTarget=undefined; __mira.quality.set('high'); if(__mira.postMS!==0||!__mira.composer.passes.some(p=>p.uniforms?.resolution))throw Error('FXAA fallback missing'); } finally { THREE.WebGLMultisampleRenderTarget=C; __mira.quality.set('low'); } });
  report.checks.push('FXAA fallback when multisampling is unavailable');
  await p.setViewportSize({width:390,height:780});
  const size=await p.evaluate(()=>({w:__mira.renderer.domElement.width,h:__mira.renderer.domElement.height,ratio:__mira.renderer.getPixelRatio(),vw:innerWidth,vh:innerHeight}));
  assert.equal(size.w,Math.floor(size.vw*size.ratio));assert.equal(size.h,Math.floor(size.vh*size.ratio));report.checks.push('portrait resize keeps the canvas and CSS viewport in sync');
  await p.setViewportSize({width:480,height:320});
  for(let cycle=0;cycle<3;cycle++){
    for(const id of [0,10,1]){
      await p.evaluate(async id=>{
        const M=__mira;await M.prepareMap(id);
        M.G.sim=new M.Sim({seed:714025,round:1,guests:[{peer:'local',name:'Audit',role:'a'}],sniper:{peer:'observer',name:'Observer'},map:id});
        M.G.sim.ph='play';M.G.sim.t=240;Object.assign(M.G,{screen:'game',solo:'a',multi:false,isHost:true,seed:null});
      },id);
      await p.waitForFunction(id=>__mira.readyMapId===id&&__mira.G.seed===714025,id,{polling:100});
      if(id===0)assert.equal(await p.evaluate(()=>__mira.H.FIRE.every(f=>!!f.parent)),true,'animated rooftop flames must not be merged into static scenery');
      await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    }
    report.mapResources.push(await p.evaluate(()=>({...__mira.renderer.info.memory,navMs:__mira.SCEN.tNav})));
  }
  assert.equal(report.mapResources.at(-1).navMs,0,'revisited map must reuse static navigation');
  assert.ok(report.mapResources[2].textures<=report.mapResources[1].textures+2,'map textures must stabilize after warmup');
  assert.ok(report.mapResources[2].geometries<=report.mapResources[1].geometries+2,'map geometries must stabilize after warmup');
  report.checks.push('map swaps stabilize resources and reuse navigation');
  let release, requested;
  const gate=new Promise(r=>release=r), hit=new Promise(r=>requested=r);
  await p.route('**/'+path.basename(manifest.maps[3][0].url),async r=>{requested();await gate;await r.abort()});
  await p.evaluate(()=>{window.__cancelledPreparation=__mira.prepareMap(3)});await hit;
  await p.evaluate(()=>document.querySelector('#btnMenu').click());
  assert.equal(await p.evaluate(()=>__mira.prepareMap(1)),true);
  release();assert.equal(await p.evaluate(()=>window.__cancelledPreparation),false);
  assert.equal(await p.evaluate(()=>__mira.readyMapId),1,'stale failure must not invalidate a newer prepared world');
  report.checks.push('cancelled download cannot corrupt a later map');
  await context.close();
  const persisted=await browser.newContext({viewport:{width:480,height:320}});
  const pp=await L.page(persisted,url,{preload:false});await pp.locator('#qualityControl summary').click();await pp.selectOption('#qualitySel','balanced');
  await pp.reload({waitUntil:'domcontentloaded'});await pp.waitForFunction(()=>window.__mira);
  assert.equal(await pp.evaluate(()=>__mira.quality.mode),'balanced');report.checks.push('manual choice survives reload');await persisted.close();
  const denied=await browser.newContext();
  await denied.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /^webgl|experimental-webgl/.test(type)?null:get.call(this,type,...args)}});
  const bad=await denied.newPage();await bad.goto(url,{waitUntil:'domcontentloaded'});await bad.waitForFunction(()=>!!window.MIRA_BOOT_ERROR,null,{timeout:60000});
  assert.ok(await bad.locator('#loading button').isVisible());report.checks.push('WebGL unavailable shows reload action');await denied.close();
  assert.deepEqual(report.errors,[]);
  report.complete=true;console.log('PASS '+report.checks.join('; '));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(path.join(OUT,'integration.json'),JSON.stringify(report,null,2));}
})().catch(e=>{console.error(e);process.exitCode=1});
