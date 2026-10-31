// Compare static navigation, mission targets and seeded population against a legacy build.
// node fonte/testes/paridade.js <before-url> <after-url>
const L=require('./lib'),fs=require('fs'),assert=require('assert/strict'),path=require('path');
const urls=process.argv.slice(2),out=path.join(__dirname,'out/performance/parity.json');
(async()=>{
 if(urls.length!==2)throw Error('Provide before and after URLs');
 const report={complete:false,urls,worlds:[]};let b;
 try{
  b=await L.launch();
  for(const url of urls){
   const ctx=await b.newContext({viewport:{width:320,height:180}});
   // No animation/render loop: this check compares world data, not GPU throughput.
   await ctx.addInitScript(()=>{window.requestAnimationFrame=()=>0;window.__noIntro=true});
   const p=await L.page(ctx,url,{until:()=>!!window.__mira});const worlds=[];
   for(let id=0;id<=10;id++){
    worlds.push(await p.evaluate(async id=>{
     const M=__mira;M.loadMap(id);
     const hash=async data=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data))).map(x=>x.toString(16).padStart(2,'0')).join('');
     const nav=[];for(const n of M.NAV.lv)nav.push({x0:n.x0,z0:n.z0,nx:n.nx,nz:n.nz,g:await hash(n.g),raw:await hash(n.raw)});
     const S=new M.Sim({seed:714025,round:1,map:id,guests:[{bot:true,role:'a'},{bot:true,role:'c'},{bot:true,role:'c'}],sniper:{peer:'local',name:'Audit'}});
     return{id,nav,cols:M.COLS,missions:M.MISSIONS.map(m=>({label:m.label,where:m.where,s:m.s,l:m.l,p:m.p,lv:m.lv})),population:S.ents.map(e=>({id:e.id,x:e.x,z:e.z,y:e.y,lv:e.lv,kind:e.kind,role:e.role}))};
    },id));
   }
   report.worlds.push(worlds);await ctx.close();
  }
  assert.deepEqual(report.worlds[1],report.worlds[0]);report.complete=true;
  console.log('PASS identical navigation hashes, collisions, mission targets and seeded population in all 11 maps');
 }catch(e){report.error=e.stack;throw e;}
 finally{if(b)await b.close();fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2));}
})().catch(e=>{console.error(e);process.exitCode=1});
