// Reproducible benchmark. A fresh HTTP context per map/repetition, then cold/warm pages.
// All camera views share the page and immutable map assets, avoiding redundant rebuilds.
// node desempenho.js <url> [0,n,1,...,10] [label]
const L = require('../../testes/lib'), fs = require('fs'), path = require('path');
const url = process.argv[2] || 'http://127.0.0.1:8874/';
const maps = (process.argv[3] || '0,n,1,2,3,4,5,6,7,8,9,10').split(',');
const views = (process.env.VIEWS || 'agent,sniper,scope').split(',');
const repeats = +(process.env.REPEATS || 3), samples = +(process.env.SAMPLES || 180);
const viewport = { width: +(process.env.WIDTH || 1280), height: +(process.env.HEIGHT || 720) };
const quality = process.env.QUALITY || 'high', seed = 714025;
const host = { platform: process.platform, arch: process.arch, node: process.version, cpu: require('os').cpus()[0]?.model, device: process.env.DEVICE || null };
const report = { version: 2, label: process.argv[4] || '', url, seed, quality, viewport, repeats, samples, host,
  cacheMeasurement: process.env.BENCH_NATIVE === '1' ? 'native-http' : 'routing-disables-http-cache',
  startedAt: new Date().toISOString(), rows: [], errors: [], complete: false };
const quantile = (a,q) => a.slice().sort((x,y)=>x-y)[Math.min(a.length-1,Math.ceil(a.length*q)-1)];
async function measure(p) {
  return p.evaluate(samples=>new Promise((resolve,reject)=>{
    const M=__mira,r=M.renderer,rows=[];let last=null;
    const timer=setTimeout(()=>{r.info.autoReset=true;reject(Error('Measurement timed out'))},300000);
    r.info.autoReset=false;r.info.reset();
    const tick=now=>{
      if(last===null){last=now;r.info.reset();return requestAnimationFrame(tick);}
      rows.push({ms:now-last,calls:r.info.render.calls,triangles:r.info.render.triangles,stages:M.perf?{...M.perf.last}:null});last=now;r.info.reset();
      if(rows.length<samples)return requestAnimationFrame(tick);
      clearTimeout(timer);r.info.autoReset=true;
      const gl=r.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
      resolve({frames:rows,buildVersion:window.MIRA_MANIFEST?.version||'legacy',build:M.SCEN.tBuild||0,nav:M.SCEN.tNav||0,
        geometries:r.info.memory.geometries,textures:r.info.memory.textures,camera:M.composer?.passes[0].camera===M.scopeCam?'scope':M.composer?.passes[0].camera===M.wide?'sniper':'agent',
        renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),quality:M.quality?M.quality.snapshot():null,
        assets:performance.getEntriesByType('resource').filter(x=>x.name.includes('/assets/')||x.name.includes('/vendor/')).map(x=>({name:x.name,transferSize:x.transferSize,encodedBodySize:x.encodedBodySize}))});
    };requestAnimationFrame(tick);
  }),samples);
}
(async()=>{
 let browser;
 try{
  if(!['high','balanced','low'].includes(quality))throw Error('Benchmark quality must be fixed');
  if(!Number.isInteger(repeats)||repeats<1||!Number.isInteger(samples)||samples<3)throw Error('Invalid sample/repeat count');
  if(maps.some(m=>!/^(n|[0-9]|10)$/.test(m))||views.some(v=>!['agent','sniper','scope'].includes(v)))throw Error('Invalid map/view');
  browser=await L.launch();report.browser=browser.version();
  for(let run=0;run<repeats;run++)for(const map of maps){
    const ctx=await browser.newContext({viewport,deviceScaleFactor:1});
    await ctx.addInitScript(({seed,quality})=>{
      let n=seed;Math.random=()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
      window.__benchmarkSeed=seed;window.__noIntro=true;window.__noOrbit=true;
      localStorage.setItem('mira-quality',quality);
    },{seed,quality});
    try{
      for(const cache of ['cold','warm']){
        const start=Date.now();
        const p=await L.page(ctx,url,{preload:false,nativeResources:process.env.BENCH_NATIVE==='1'});
        const menuMs=Date.now()-start;
        try{
          await p.evaluate(quality=>{
            const M=__mira;
            if(M.quality){if(M.quality.mode!==quality)M.quality.set(quality);}
            else{if(quality!=='high')throw Error('Legacy baseline only supports high');M.FPS.t=-1e9;}
            if(M.perf)M.perf.enabled=true;
          },quality);
          let firstLoad=null;
          for(const [viewIndex,view]of views.entries()){
            const switched=Date.now();
            await p.evaluate(({map,view})=>{
              const M=__mira;M.setScope?.(false);M.resetProps();Object.assign(M.G,{sim:null,screen:'menu',seed:null,roundNo:0});
              document.querySelector('#mapSel').value=map;
              document.querySelector(view==='agent'?'#btnSoloA':'#btnSoloS').click();
            },{map,view});
            await p.waitForFunction(()=>__mira.G.screen==='game'&&__mira.G.sim&&__mira.G.seed===__mira.G.sim.seed&&__mira.CHARS().length>10,null,{timeout:300000,polling:100});
            const viewSwitchMs=Date.now()-switched;
            if(!firstLoad)firstLoad={menuMs,roundMs:viewSwitchMs,loadMs:Date.now()-start};
            await p.evaluate(view=>{
              const M=__mira;M.G.sim.ph='play';M.G.sim.t=240;M.G.sim._st=null;M.G.lastPh=null;
              if(view==='scope'){
                const e=M.G.sim.ents.find(e=>e.kind!=='static'),d=new THREE.Vector3(e.x,(e.y||0)+1.3,e.z).sub(M.SNIPER_POS).normalize();
                M.snip.scoped=true;M.snip.zoom=5;M.snip.yaw=Math.atan2(d.x,-d.z);M.snip.pitch=Math.asin(d.y);
              }
            },view);
            await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
            const data=await measure(p),times=data.frames.map(f=>f.ms);
            if(data.camera!==view)throw Error('Expected '+view+' camera, got '+data.camera);
            const row={run,cache,map,view,initialView:viewIndex===0,...firstLoad,viewSwitchMs,...data,
              medianMs:quantile(times,.5),p95Ms:quantile(times,.95),stalls:times.filter(t=>t>50).length,
              medianCalls:quantile(data.frames.map(f=>f.calls),.5),medianTriangles:quantile(data.frames.map(f=>f.triangles),.5)};
            report.rows.push(row);console.log(JSON.stringify({...row,frames:undefined,assets:undefined}));
            if(process.env.SHOTS&&run===0){fs.mkdirSync(process.env.SHOTS,{recursive:true});await p.screenshot({path:path.join(process.env.SHOTS,`${cache}-${map}-${view}.png`),timeout:300000});}
          }
        }finally{await p.close();}
      }
    }finally{await ctx.close();}
  }
  report.complete=report.rows.length===repeats*2*maps.length*views.length;
  if(!report.complete)throw Error('Incomplete measurement');
 }catch(e){report.errors.push(e.stack||String(e));process.exitCode=1;console.error(e);}
 finally{
  if(browser)await browser.close();report.finishedAt=new Date().toISOString();
  if(process.env.JSON_OUT){fs.mkdirSync(path.dirname(process.env.JSON_OUT),{recursive:true});fs.writeFileSync(process.env.JSON_OUT,JSON.stringify(report,null,2));}
 }
})();
