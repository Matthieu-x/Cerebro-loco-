(async()=>{
'use strict';
const $=id=>document.getElementById(id);
const canvas=$('gameCanvas'),ctx=canvas.getContext('2d'),homeCanvas=$('homeCanvas'),hctx=homeCanvas.getContext('2d');
const ENGINE_VERSION=6, APP_VERSION='8.0', CONTENT_KEY='cerebroLoco_content_v3', CONTENT_VERSION_KEY='cerebroLoco_contentVersion_v3', SAVE_KEY='cerebroLocoSave_v2';
let levels=[],current=0,finished=false,frame=0,mascotMood='idle',toastTimer=null,pendingManifest=null,sceneSolved=false,dragging=false,dragPos=null,adsCounter=0;
let state={unlocked:1,coins:120,done:[],hints:[],name:'',age:0};
try{state={...state,...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}}catch(e){}
const sceneImages={};
const scenes={
 scene1:{target:[.605,.66],itemStart:[.605,.66],draw:(c,W,H)=>drawIllustratedScene(c,W,H,'scene-01.webp','phone')},
 scene2:{target:[.696,.49],itemStart:[.488,.59],draw:(c,W,H)=>drawIllustratedScene(c,W,H,'scene-02.webp','key')},
 scene3:{target:[.715,.47],itemStart:[.546,.72],draw:(c,W,H)=>drawIllustratedScene(c,W,H,'scene-03.webp','key')}
};
function fit(c,x){const r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(c.width!==Math.round(r.width*d)||c.height!==Math.round(r.height*d)){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}x.setTransform(d,0,0,d,0,0);return[r.width,r.height]}
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke()}}
function circ(c,x,y,r,fill,stroke){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke()}}
function line(c,x1,y1,x2,y2,color,width=3){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke()}
function ellipse(c,x,y,rx,ry,fill,stroke){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke()}}
function sceneBase(c,W,H,t){
 const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f8e8c9');g.addColorStop(1,'#e7d4b3');c.fillStyle=g;c.fillRect(0,0,W,H);
 // paper-like soft decorative backdrop
 circ(c,W*.12,H*.18,26,'#fff5df');circ(c,W*.88,H*.16,18,'#fff5df');
 c.fillStyle='#d7c39f';c.fillRect(0,H*.82,W,H*.18);
 line(c,0,H*.82,W,H*.82,'#c4ad85',2);
 for(let i=0;i<6;i++){circ(c,(i*91+30)%W,H*.9+(i%2)*13,2,'#bda77f')}
}
function drawCat(c,W,H){
 sceneBase(c,W,H,frame);
 // sofa
 rr(c,W*.08,H*.48,W*.5,H*.28,18,'#d97757','#a94e3a');rr(c,W*.1,H*.45,W*.46,H*.12,14,'#ed9870');
 // cat
 ellipse(c,W*.29,H*.65,W*.105,H*.12,'#f4a84f','#9b6235');circ(c,W*.22,H*.52,W*.07,'#f4a84f','#9b6235');
 c.beginPath();c.moveTo(W*.17,H*.48);c.lineTo(W*.18,H*.39);c.lineTo(W*.24,H*.46);c.fillStyle='#f4a84f';c.fill();c.beginPath();c.moveTo(W*.24,H*.46);c.lineTo(W*.29,H*.39);c.lineTo(W*.3,H*.49);c.fill();
 circ(c,W*.2,H*.52,3,'#342d28');circ(c,W*.245,H*.52,3,'#342d28');line(c,W*.21,H*.56,W*.24,H*.56,'#75432d',2);
 // fish plate and fish
 ellipse(c,W*.78,H*.76,W*.13,H*.045,'#8fb8bd','#527e82');ellipse(c,W*.78,H*.72,W*.09,H*.035,'#fff4d8','#527e82');
 fish(c,W*.78,H*.69,1);
}
function fish(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);ellipse(c,0,0,24,13,'#63b7c5','#347d8b');c.beginPath();c.moveTo(-21,0);c.lineTo(-37,-12);c.lineTo(-37,12);c.closePath();c.fillStyle='#e99b57';c.fill();circ(c,12,-3,2.5,'#263c42');c.restore()}
function drawRoom(c,W,H){
 sceneBase(c,W,H);rr(c,W*.1,H*.12,W*.8,H*.7,8,'#f1dfbd','#bda77f');
 rr(c,W*.18,H*.2,W*.28,H*.28,8,'#b8d8dc','#fff1d2');line(c,W*.32,H*.2,W*.32,H*.48,'#fff1d2',5);line(c,W*.18,H*.34,W*.46,H*.34,'#fff1d2',5);
 rr(c,W*.66,H*.2,W*.18,H*.22,8,'#d5a35c','#9d7545');line(c,W*.75,H*.2,W*.75,H*.08,'#8b6844',5);
 // lamp
 line(c,W*.75,H*.2,W*.75,H*.34,'#75583c',5);c.beginPath();c.moveTo(W*.68,H*.34);c.lineTo(W*.82,H*.34);c.lineTo(W*.79,H*.25);c.lineTo(W*.71,H*.25);c.closePath();c.fillStyle='#f2b94f';c.fill();circ(c,W*.78,H*.49,12,'#e9bd63','#aa8243');
 // wall switch is target
 rr(c,W*.82,H*.43,23,35,6,'#fff0d1','#9b8060');rr(c,W*.827,H*.45,12,15,4,'#e8a34e');
}
function drawPlant(c,W,H){
 sceneBase(c,W,H);rr(c,W*.12,H*.18,W*.76,H*.55,14,'#f7e8c9','#d3bd98');
 // pot and soil
 c.beginPath();c.moveTo(W*.4,H*.65);c.lineTo(W*.61,H*.65);c.lineTo(W*.57,H*.83);c.lineTo(W*.44,H*.83);c.closePath();c.fillStyle='#d77c59';c.fill();ellipse(c,W*.505,H*.65,W*.105,H*.025,'#80553e');
 line(c,W*.5,H*.65,W*.5,H*.36,'#568b59',6);ellipse(c,W*.42,H*.47,W*.1,H*.045,'#72a96a');ellipse(c,W*.59,H*.4,W*.1,H*.045,'#72a96a');
 // watering can
 rr(c,W*.72,H*.55,W*.15,H*.12,12,'#68aeb2','#397d82');ellipse(c,W*.72,H*.61,W*.06,H*.09,null,'#397d82');line(c,W*.85,H*.57,W*.92,H*.51,'#397d82',6);circ(c,W*.92,H*.51,4,'#68aeb2');
}
function drawDog(c,W,H){
 sceneBase(c,W,H);rr(c,W*.1,H*.19,W*.8,H*.58,16,'#e8d3aa','#c3aa7d');
 // dog
 ellipse(c,W*.34,H*.65,W*.16,H*.14,'#bd8154','#805538');circ(c,W*.34,H*.49,W*.12,'#c58a5c','#805538');
 ellipse(c,W*.23,H*.5,W*.055,H*.12,'#875638');ellipse(c,W*.45,H*.5,W*.055,H*.12,'#875638');circ(c,W*.3,H*.48,4,'#282a29');circ(c,W*.38,H*.48,4,'#282a29');ellipse(c,W*.34,H*.54,7,5,'#382d29');
 // bone
 c.save();c.translate(dragPos?dragPos.x:W*.72,dragPos?dragPos.y:H*.72);c.rotate(-.3);line(c,-23,0,23,0,'#f8f0d8',12);circ(c,-24,-5,8,'#f8f0d8');circ(c,-24,5,8,'#f8f0d8');circ(c,24,-5,8,'#f8f0d8');circ(c,24,5,8,'#f8f0d8');c.restore();
}
function drawTreasure(c,W,H){
 sceneBase(c,W,H);for(let i=0;i<5;i++)circ(c,W*(.14+i*.17),H*.25,3,'#c99c55');
 for(let i=0;i<3;i++){const x=W*(.2+i*.3);rr(c,x,H*.52,W*.2,H*.22,12,i===2?'#e8b75c':'#a96b43','#74472f');rr(c,x,H*.48,W*.2,H*.08,8,i===2?'#f3cf79':'#c58a56','#74472f');rr(c,x+W*.08,H*.56,W*.04,H*.12,4,'#f6d77e');}
 circ(c,W*.8,H*.38,18,'#f5d77c');}
function drawBalloon(c,W,H){
 sceneBase(c,W,H);line(c,W*.35,H*.16,W*.35,H*.81,'#98734d',8);line(c,W*.35,H*.29,W*.52,H*.29,'#98734d',5);
 ellipse(c,W*.35,H*.28,W*.13,H*.17,'#ed7c73','#b34c4c');line(c,W*.35,H*.45,W*.35,H*.68,'#8d755b',2);line(c,W*.35,H*.68,W*.35,H*.75,'#8d755b',2);
 ellipse(c,W*.72,H*.28,W*.12,H*.16,'#74b7d0','#477e9b');line(c,W*.72,H*.44,W*.67,H*.6,'#8d755b',2);rr(c,W*.29,H*.72,W*.12,H*.08,5,'#bc8c5e','#805b3b');
}
function drawFishbowl(c,W,H){
 sceneBase(c,W,H);ellipse(c,W*.5,H*.62,W*.28,H*.2,'#9bd2d4','#4b969b');ellipse(c,W*.5,H*.62,W*.26,H*.17,'#d7f0df');ellipse(c,W*.5,H*.46,W*.27,H*.05,'#75b9c4','#4b969b');
 fish(c,W*.48,H*.61,.9);for(let i=0;i<3;i++)circ(c,W*(.38+i*.1),H*.72,4,'#9bd2d4');
 rr(c,W*.24,H*.4,W*.52,H*.06,8,'#d58c58','#9c603c');
}
function drawMonster(c,W,H){
 sceneBase(c,W,H);rr(c,W*.12,H*.12,W*.76,H*.7,12,'#667c8d','#496171');
 // bed + monster
 rr(c,W*.16,H*.62,W*.65,H*.15,18,'#d6a66e','#91683f');ellipse(c,W*.48,H*.56,W*.16,H*.17,'#83a88b','#456f57');circ(c,W*.43,H*.53,5,'#263a37');circ(c,W*.53,H*.53,5,'#263a37');ellipse(c,W*.48,H*.61,12,5,'#36534b');
 rr(c,W*.79,H*.39,23,35,6,'#f8e9cc','#8c7c64');rr(c,W*.797,H*.42,10,13,4,'#e99c55');
}
function drawMouse(c,W,H){
 sceneBase(c,W,H);rr(c,W*.1,H*.2,W*.8,H*.58,12,'#f1dfbd','#c5ad83');
 // mouse hole and cheese
 circ(c,W*.23,H*.68,33,'#6d594b');circ(c,W*.23,H*.68,26,'#3f3833');
 c.beginPath();c.moveTo(W*.69,H*.55);c.lineTo(W*.87,H*.62);c.lineTo(W*.7,H*.75);c.closePath();c.fillStyle='#f2c94e';c.fill();circ(c,W*.75,H*.63,4,'#d7a52f');circ(c,W*.79,H*.68,3,'#d7a52f');
 // movable box
 rr(c,dragPos?dragPos.x-W*.08:W*.4,dragPos?dragPos.y-H*.08:H*.6,W*.16,H*.16,7,'#b47b4c','#805537');
}
function drawRocket(c,W,H){
 sceneBase(c,W,H);rr(c,W*.12,H*.12,W*.76,H*.7,12,'#d5e0df','#9db2af');
 // rocket
 c.save();c.translate(W*.38,H*.53);c.rotate(-.25);c.beginPath();c.moveTo(0,-75);c.quadraticCurveTo(50,-25,34,45);c.lineTo(-34,45);c.quadraticCurveTo(-50,-25,0,-75);c.fillStyle='#f5f0e3';c.fill();c.strokeStyle='#9b9d9a';c.lineWidth=3;c.stroke();circ(c,0,-12,13,'#73b8c9','#477e8c');c.beginPath();c.moveTo(-32,25);c.lineTo(-55,58);c.lineTo(-24,48);c.fillStyle='#df795c';c.fill();c.beginPath();c.moveTo(32,25);c.lineTo(55,58);c.lineTo(24,48);c.fill();c.restore();
 rr(c,W*.7,H*.4,45,45,10,'#f1e8d2','#9b927c');circ(c,W*.755,H*.51,9,'#6dbd83','#43865a');
}
function drawMilo(c,x,y,s,mood,t){
 c.save();c.translate(x,y+Math.sin(t*.04)*3);c.scale(s,s);
 ellipse(c,0,45,37,8,'#8c7a60');rr(c,-30,-25,60,70,22,'#5b9c91','#386d68');
 circ(c,0,-36,31,'#edbd8b','#a66f50');c.beginPath();c.moveTo(-28,-43);c.quadraticCurveTo(-22,-78,2,-65);c.quadraticCurveTo(28,-76,29,-42);c.fillStyle='#6d594b';c.fill();
 const blink=(t%210)>202;if(blink){line(c,-15,-36,-6,-36,'#283c3b',2.5);line(c,6,-36,15,-36,'#283c3b',2.5)}else{ellipse(c,-10,-36,3.4,4.6,'#283c3b');ellipse(c,10,-36,3.4,4.6,'#283c3b')}
 ellipse(c,0,-23,8,4,'#a65c55');rr(c,-24,31,19,11,5,'#e4a75c');rr(c,5,31,19,11,5,'#e4a75c');c.restore();
}
function sceneImageRect(W,H,file){
 const im=sceneImages[file];if(!im||!im.naturalWidth)return{x:0,y:0,w:W,h:H};
 const scale=Math.min(W/im.width,H/im.height),w=im.width*scale,h=im.height*scale;
 return{x:(W-w)/2,y:(H-h)/2,w,h};
}
function scenePoint(norm,W,H,file){const r=sceneImageRect(W,H,file);return{x:r.x+norm[0]*r.w,y:r.y+norm[1]*r.h}}
function drawIllustratedScene(c,W,H,file,item){
 if(!sceneImages[file]){sceneImages[file]=new Image();sceneImages[file].decoding='async';sceneImages[file].src='./'+file+'?v=8'}
 const im=sceneImages[file];c.fillStyle='#233a43';c.fillRect(0,0,W,H);
 if(im.complete&&im.naturalWidth){
  const cover=Math.max(W/im.width,H/im.height),bw=im.width*cover,bh=im.height*cover;
  c.save();c.filter='blur(22px) saturate(.82) brightness(.62)';c.drawImage(im,(W-bw)/2,(H-bh)/2,bw,bh);c.restore();
  const r=sceneImageRect(W,H,file),sway=Math.sin(frame*.012)*1.5,zoom=1+Math.sin(frame*.009)*.002;
  c.save();c.translate(W/2+sway,H/2);c.scale(zoom,zoom);c.drawImage(im,-r.w/2,-r.h/2,r.w,r.h);c.restore();
 }else{
  c.fillStyle='#fff4e5';c.font='700 18px Nunito';c.textAlign='center';c.fillText('Preparando ilustración…',W/2,H/2);
 }
 // Polvo luminoso y pequeños destellos para dar vida a la escena sin tapar la ilustración.
 for(let i=0;i<13;i++){
  const px=((i*83+frame*(.12+(i%3)*.035))%(W+30))-15,py=(H*.12+(i*47+Math.sin(frame*.025+i)*13)%(H*.78));
  c.globalAlpha=.12+((Math.sin(frame*.035+i)+1)*.11);circ(c,px,py,1.2+(i%3)*.45,'#fff0b9');
 }
 c.globalAlpha=1;
 const level=levels[current],scene=scenes[level.scene],pos=dragPos||scenePoint(scene.itemStart,W,H,file);
 if(item==='phone'){
  c.save();const p=scenePoint(scene.target,W,H,file);c.translate(p.x,p.y+Math.sin(frame*.08)*3);c.rotate(-.14+Math.sin(frame*.025)*.025);c.shadowColor='#111a20aa';c.shadowBlur=15+Math.sin(frame*.06)*4;rr(c,-13,-24,26,48,6,'#263943','#111d24');rr(c,-9,-19,18,37,3,'#a8e4e4','#4d8790');rr(c,-6,-15,12,28,2,'#f8f1df');circ(c,0,17,2,'#35515a');c.restore();
 }
 if(item==='key'){
  c.save();c.translate(pos.x,pos.y+Math.sin(frame*.08)*3);c.rotate(-.35+Math.sin(frame*.02)*.035);c.shadowColor='#f4c65c';c.shadowBlur=15+Math.sin(frame*.07)*5;c.strokeStyle='#ffd66f';c.lineWidth=7;c.lineCap='round';c.beginPath();c.arc(-8,0,9,0,Math.PI*2);c.moveTo(1,0);c.lineTo(31,0);c.lineTo(31,8);c.moveTo(20,0);c.lineTo(20,7);c.stroke();c.shadowBlur=0;c.strokeStyle='#fff1b9';c.lineWidth=2;c.beginPath();c.arc(-8,0,5,0,Math.PI*2);c.stroke();c.restore();
 }
 if(dragging&&item==='key'){c.save();c.strokeStyle='#fff4c8';c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();c.arc(pos.x,pos.y,24+Math.sin(frame*.12)*3,0,Math.PI*2);c.stroke();c.restore()}
}
async function preloadSceneImages(){
 const files=['scene-01.webp','scene-02.webp','scene-03.webp'];
 await Promise.allSettled(files.map(file=>new Promise(resolve=>{
  const im=new Image();im.decoding='async';im.onload=()=>{sceneImages[file]=im;resolve()};im.onerror=resolve;im.src='./'+file+'?v=8';
  if(im.complete&&im.naturalWidth){sceneImages[file]=im;resolve()}
 })));
}

function drawGame(){const [W,H]=fit(canvas,ctx);ctx.clearRect(0,0,W,H);const level=levels[current];if(level&&scenes[level.scene])scenes[level.scene].draw(ctx,W,H)}
function drawHome(){const [W,H]=fit(homeCanvas,hctx);hctx.clearRect(0,0,W,H);const g=hctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#f8e9cf');g.addColorStop(1,'#e8d5b6');hctx.fillStyle=g;hctx.fillRect(0,0,W,H);for(let i=0;i<9;i++)circ(hctx,(i*79+25)%W,30+(i%3)*43,3,'#d2b98d');drawMilo(hctx,W*.48,H*.62,1.1,'happy',frame)}
function loop(){frame++;if($('game').classList.contains('active'))drawGame();if($('home').classList.contains('active'))drawHome();requestAnimationFrame(loop)}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch(e){}}
function toast(m){$('toast').textContent=m;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400)}
window.pgAdsCallbacks=window.pgAdsCallbacks||[];window.pgAdsCallbacks.push(async()=>{try{await window.pgAds.init()}catch(e){}});
async function mostrarInterstitial(){try{if(!window.pgAds)return;const ad=await window.pgAds.requestOutOfPageAd('interstitial');if(ad.state==='ready')ad.show();else ad.addEventListener('ready',()=>ad.show())}catch(e){}}
async function mostrarRecompensado(){try{if(!window.pgAds){toast('Anuncios no disponibles en este momento');return}const ad=await window.pgAds.requestOutOfPageAd('rewarded');if(ad.state==='ready')ad.show();else ad.addEventListener('ready',()=>ad.show());ad.addEventListener('rewarded',()=>{state.coins+=25;save();updateCoins();toast('¡25 focos añadidos!')})}catch(e){toast('No hay anuncios disponibles')}}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));if(id==='game'||id==='home')setTimeout(()=>{drawGame();drawHome()},50)}
function updateCoins(){['coinsHome','coinsLevels','coinsGame'].forEach(id=>$(id).textContent=state.coins);$('homeProgress').textContent=Math.min(state.unlocked,levels.length);$('homeStars').textContent=state.done.length}
function validLevels(d){return Array.isArray(d)&&d.length>0&&d.length<=3&&d.every(x=>x&&typeof x.q==='string'&&x.type==='scene'&&scenes[x.scene]&&typeof x.target==='string'&&x.explain)}
async function fetchJSON(url){const u=new URL(url,document.baseURI);u.searchParams.set('_',Date.now());const r=await fetch(u.href,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
async function loadContent(){
 let cached=null,localVersion=0;try{cached=JSON.parse(localStorage.getItem(CONTENT_KEY)||'null');localVersion=Number(localStorage.getItem(CONTENT_VERSION_KEY)||0)}catch(e){}
 try{
  const m=await fetchJSON('./manifest.json');
  if(m.minimumEngineVersion>ENGINE_VERSION)throw Error('Esta versión del juego necesita una actualización de la aplicación.');
  if(cached&&validLevels(cached)){if(Number(m.contentVersion)>localVersion)pendingManifest=m;return cached}
  const fresh=await fetchJSON('./'+m.levelsFile);if(!validLevels(fresh))throw Error('El contenido recibido no es válido.');
  localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));localStorage.setItem(CONTENT_VERSION_KEY,String(m.contentVersion));return fresh;
 }catch(e){if(cached&&validLevels(cached)){toast('Sin conexión: se cargó la última versión guardada.');return cached}throw e}
}
async function applyUpdate(){
 const cameFromUpdates=$('updates').classList.contains('active');
 const b=$('applyContentUpdate'),install=$('installUpdateBtn');b.disabled=true;install.disabled=true;b.textContent='DESCARGANDO…';install.textContent='DESCARGANDO…';
 try{
  const m=await fetchJSON('./manifest.json');if(m.minimumEngineVersion>ENGINE_VERSION)throw Error('Los archivos de la aplicación también necesitan actualizarse.');const fresh=await fetchJSON('./'+m.levelsFile);
  if(!validLevels(fresh))throw Error('Contenido inválido');
  localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));localStorage.setItem(CONTENT_VERSION_KEY,String(m.contentVersion));
  pendingManifest=null;levels=fresh;renderMap();$('contentUpdateModal').classList.remove('show');toast('Contenido actualizado correctamente.');$('updateStatus').textContent='Actualización instalada correctamente. Versión '+m.contentVersion+'.';$('installUpdateBtn').hidden=true;if(cameFromUpdates){show('updates')}else{start(Math.min(current,levels.length-1))}
 }catch(e){b.disabled=false;install.disabled=false;b.textContent='INTENTAR DE NUEVO';install.textContent='INTENTAR DE NUEVO';$('updateStatus').textContent='Falló la descarga: '+(e.message||'error de conexión')+'. Comprueba que el hosting publique el manifiesto y el JSON.';toast('No se pudo actualizar. Revisa el servidor.')}
}
async function checkForUpdates(){
 const b=$('checkUpdatesBtn'),status=$('updateStatus');b.disabled=true;b.textContent='BUSCANDO…';status.textContent='Conectando con el servidor de contenido…';
 try{
  const m=await fetchJSON('./manifest.json');
  if(!m||!Number.isFinite(Number(m.contentVersion)))throw Error('El manifiesto recibido no es válido.');
  $('installedVersion').textContent='v'+APP_VERSION;
  if(Number(m.minimumEngineVersion)>ENGINE_VERSION){status.textContent='Hay una actualización del motor. Debes publicar el ZIP nuevo en tu hosting para instalarla.';$('installUpdateBtn').hidden=true;return}
  const remote=await fetchJSON('./'+m.levelsFile);if(!validLevels(remote))throw Error('El archivo de niveles no es válido.');
  const local=Number(localStorage.getItem(CONTENT_VERSION_KEY)||0);
  if(Number(m.contentVersion)>local){pendingManifest=m;$('updateVersion').textContent='Versión de contenido '+m.contentVersion;$('updateChangelog').innerHTML='';(m.changelog||[]).forEach(t=>{const li=document.createElement('li');li.textContent=t;$('updateChangelog').appendChild(li)});$('installUpdateBtn').hidden=false;status.textContent='Hay contenido nuevo disponible. Pulsa descargar actualización.';}
  else{$('installUpdateBtn').hidden=true;status.textContent='Tu contenido está actualizado. Versión '+m.contentVersion+'.'}
 }catch(e){status.textContent='No se pudo comprobar: '+(e.message||'error de conexión')+'. Verifica que manifest.json y levels-v2.json estén publicados junto al juego.'}
 finally{b.disabled=false;b.textContent='COMPROBAR ACTUALIZACIONES ↻'}
}
function renderMap(){const grid=$('levelGrid');grid.innerHTML='';levels.forEach((l,i)=>{const b=document.createElement('button'),num=document.createElement('span'),desc=document.createElement('small');b.className='level'+(state.done.includes(i)?' done':'');num.textContent=state.done.includes(i)?'✓':'0'+(i+1);desc.textContent=l.q;b.append(num,desc);b.setAttribute('aria-label','Escena '+(i+1)+': '+l.q);b.onclick=()=>start(i);grid.appendChild(b)});$('mapProgress').style.width=(state.done.length/levels.length*100)+'%';$('mapCount').textContent=state.done.length+' de '+levels.length+' escenas completadas';updateCoins()}
function start(i){
 current=i;finished=false;sceneSolved=false;dragging=false;dragPos=null;mascotMood='idle';const l=levels[i];show('game');$('levelLabel').textContent='ESCENA '+String(i+1).padStart(2,'0')+' / '+levels.length;$('question').textContent=l.q;$('hintline').textContent='';$('feedback').textContent='';$('playArea').innerHTML='';$('sceneTip').textContent=l.action==='drag'?'Arrastra la llave hasta la cerradura.':'Toca el teléfono que está oculto en la escena.';updateCoins();drawGame();
}
function win(){if(finished)return;finished=true;mascotMood='happy';const first=!state.done.includes(current);if(first){state.done.push(current);state.coins+=10}state.unlocked=Math.max(state.unlocked,Math.min(levels.length,current+2));save();updateCoins();$('winReward').textContent=first?'+10 focos':'ESCENA COMPLETADA';$('winText').textContent=levels[current].explain+' Tu progreso quedó guardado.';$('winModal').classList.add('show')}
function fail(){if(finished)return;$('feedback').textContent='Todavía no. Observa bien la escena.';if(navigator.vibrate)navigator.vibrate(35)}
function hitTarget(x,y){const r=canvas.getBoundingClientRect(),l=levels[current],scene=scenes[l.scene],file='scene-0'+(current+1)+'.webp',p=scenePoint(scene.target,r.width,r.height,file);if(l.action==='drag')return false;return Math.hypot(x-p.x,y-p.y)<Math.min(r.width,r.height)*.12}
canvas.addEventListener('pointerdown',e=>{
 if(finished)return;const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,l=levels[current],scene=scenes[l.scene];
 if(l.action==='drag'){const start=scenePoint(scene.itemStart,r.width,r.height,'scene-0'+(current+1)+'.webp'),ix=start.x,iy=start.y;if(Math.hypot(x-ix,y-iy)>Math.max(34,Math.min(r.width,r.height)*.13)){fail();return}dragging=true;dragPos={x,y};canvas.setPointerCapture(e.pointerId);drawGame();return}
 if(hitTarget(x,y)){win()}else fail();
});
canvas.addEventListener('pointermove',e=>{if(!dragging)return;const r=canvas.getBoundingClientRect();dragPos={x:e.clientX-r.left,y:e.clientY-r.top};drawGame()});
canvas.addEventListener('pointerup',e=>{
 if(!dragging)return;dragging=false;const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;dragPos=null;
 const scene=scenes[levels[current].scene],target=scenePoint(levels[current].targetPoint||scene.target,r.width,r.height,'scene-0'+(current+1)+'.webp');const near=Math.hypot(x-target.x,y-target.y)<Math.min(r.width,r.height)*.22;if(near)win();else{fail();drawGame()}
});
function setupProfile(){
 let age=Number(state.age)||15;$('ageSlider').value=age;$('ageValue').textContent=age;
 function setAge(v){age=Math.max(5,Math.min(99,Number(v)));$('ageSlider').value=age;$('ageValue').textContent=age}
 $('ageSlider').oninput=e=>setAge(e.target.value);$('ageDown').onclick=()=>setAge(age-1);$('ageUp').onclick=()=>setAge(age+1);
 if(state.name&&state.age){$('onboarding-age').classList.remove('active');$('onboarding-name').classList.remove('active');$('home').classList.add('active');$('userGreeting').textContent='HOLA, '+state.name.toUpperCase()}
 else if(state.age){$('onboarding-age').classList.remove('active');$('onboarding-name').classList.add('active')}else $('onboarding-age').classList.add('active');
 $('nextToNameBtn').onclick=()=>{state.age=age;save();$('onboarding-age').classList.remove('active');$('onboarding-name').classList.add('active')};
 $('backToAge').onclick=()=>{$('onboarding-name').classList.remove('active');$('onboarding-age').classList.add('active')};
 $('saveProfileBtn').onclick=()=>{const n=$('inputName').value.trim();if(!n){toast('Escribe tu nombre para continuar');return}state.name=n;save();$('userGreeting').textContent='HOLA, '+n.toUpperCase();show('home')};
 $('inputName').addEventListener('keydown',e=>{if(e.key==='Enter')$('saveProfileBtn').click()});
}
$('playBtn').onclick=()=>{const n=levels.findIndex((_,i)=>!state.done.includes(i));start(n<0?0:n)};
$('levelsBtn').onclick=()=>{renderMap();show('levels')};$('backHome').onclick=()=>show('home');$('backLevels').onclick=()=>{renderMap();show('levels')};
$('hintBtn').onclick=()=>{if(finished)return;if(state.hints.includes(current)){$('hintline').textContent=levels[current].hint;return}if(state.coins<25){toast('No tienes focos suficientes');return}state.coins-=25;state.hints.push(current);save();updateCoins();$('hintline').textContent=levels[current].hint||'Observa los detalles de la escena.';if(levels[current].action==='drag')$('sceneTip').textContent='La llave está marcada. Arrástrala hasta el candado.'};
$('skipBtn').onclick=()=>{if(finished)return;if(state.coins<75){toast('Necesitas 75 focos para saltar');return}state.coins-=75;if(!state.done.includes(current))state.done.push(current);state.unlocked=Math.max(state.unlocked,current+2);save();$('winReward').textContent='−75 focos';$('winText').textContent='Has usado tus focos para superar esta escena.';$('winModal').classList.add('show');updateCoins()};
$('nextBtn').onclick=async()=>{$('winModal').classList.remove('show');if(current<levels.length-1){adsCounter++;if(adsCounter%3===0)await mostrarInterstitial();start(current+1)}else{renderMap();show('levels')}};
$('rewardAdBtn').onclick=async()=>{const b=$('rewardAdBtn');b.disabled=true;b.textContent='CARGANDO…';await mostrarRecompensado();setTimeout(()=>{b.disabled=false;b.textContent='✦ Ver anuncio · +25 focos'},2200)};
$('mapBtn').onclick=()=>{$('winModal').classList.remove('show');renderMap();show('levels')};
$('applyContentUpdate').onclick=applyUpdate;$('laterContentUpdate').onclick=()=>$('contentUpdateModal').classList.remove('show');$('updatesBtn').onclick=()=>{show('updates');checkForUpdates()};$('backUpdates').onclick=()=>show('home');$('checkUpdatesBtn').onclick=checkForUpdates;$('installUpdateBtn').onclick=applyUpdate;
async function removeOldWorker(){try{if('serviceWorker'in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.filter(r=>new URL(r.active?.scriptURL||r.installing?.scriptURL||r.waiting?.scriptURL||location.href).origin===location.origin).map(r=>r.unregister()))}}catch(e){}}
await removeOldWorker();
$('installedVersion').textContent='v'+APP_VERSION;
await preloadSceneImages();
try{levels=await loadContent()}catch(e){levels=[];toast('No se pudo cargar el contenido. Comprueba que el juego esté publicado correctamente.')}
if(!validLevels(levels)){levels=[{q:'Encuentra el interruptor de la habitación.',hint:'Está en la pared, junto a la lámpara.',type:'scene',scene:'room',target:'switch',explain:'Encendiste la habitación.'}]}
setupProfile();updateCoins();renderMap();
if(pendingManifest){$('updateVersion').textContent='Versión '+pendingManifest.contentVersion;$('updateChangelog').innerHTML='';(pendingManifest.changelog||['Nuevas escenas ilustradas.']).forEach(t=>{const li=document.createElement('li');li.textContent=t;$('updateChangelog').appendChild(li)});$('contentUpdateModal').classList.add('show')}
drawHome();drawGame();requestAnimationFrame(loop);
})();