(async()=>{
'use strict';
const ENGINE_VERSION=3;
const $=id=>document.getElementById(id);
const canvas=$('gameCanvas'),ctx=canvas.getContext('2d'),homeCanvas=$('homeCanvas'),hctx=homeCanvas.getContext('2d');
let w=0,h=0,frame=0,gameState='choice',mascotMood='idle',finished=false,current=0,lightState=[],seqPattern=[],seqCurrentStep=0,seqIsPlayback=false,seqPlaybackIndex=0,orderNext=1,orderValues=[],toastTimer,adsCounter=0,waitTimer=null;
function fit(c,x){const r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(c.width!==Math.round(r.width*d)||c.height!==Math.round(r.height*d)){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}x.setTransform(d,0,0,d,0,0);return [r.width,r.height]}
function rounded(c,x,y,a,b,r){c.beginPath();c.roundRect(x,y,a,b,r)}
function drawMilo(c,x,y,s,mood,t){
 c.save();c.translate(x,y+Math.sin(t*.045)*4);c.scale(s,s);
 // shadow + floating body
 c.fillStyle='#080d1b66';c.beginPath();c.ellipse(0,63,48,10,0,0,Math.PI*2);c.fill();
 const body=c.createLinearGradient(-35,-30,38,60);body.addColorStop(0,'#b7a8ff');body.addColorStop(.55,'#8274e8');body.addColorStop(1,'#5149a6');
 c.fillStyle=body;c.strokeStyle='#d0c7ff';c.lineWidth=2;
 rounded(c,-39,-31,78,87,29);c.fill();c.stroke();
 // brain cap
 c.fillStyle='#f3a5c8';c.strokeStyle='#ffd4e6';c.lineWidth=2.5;c.beginPath();
 c.moveTo(-32,-22);c.bezierCurveTo(-47,-49,-20,-64,-8,-47);c.bezierCurveTo(4,-68,27,-54,24,-39);c.bezierCurveTo(45,-35,43,-12,27,-8);c.lineTo(-27,-8);c.closePath();c.fill();c.stroke();
 c.strokeStyle='#c96d9d';c.lineWidth=2;c.beginPath();c.moveTo(-10,-46);c.bezierCurveTo(-19,-36,-5,-32,-10,-20);c.moveTo(11,-48);c.bezierCurveTo(25,-37,6,-33,15,-20);c.stroke();
 // eyes
 c.fillStyle='#fff';c.beginPath();c.ellipse(-15,9,10,13,0,0,Math.PI*2);c.ellipse(15,9,10,13,0,0,Math.PI*2);c.fill();
 c.fillStyle='#282447';if(mood==='happy'){c.beginPath();c.arc(-15,11,5,Math.PI,0);c.arc(15,11,5,Math.PI,0);c.fill()}else{c.beginPath();c.arc(-15,10,5,0,Math.PI*2);c.arc(15,10,5,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(-17,8,1.7,0,7);c.arc(13,8,1.7,0,7);c.fill()}
 c.strokeStyle='#473b79';c.lineWidth=2.8;c.lineCap='round';c.beginPath();if(mood==='happy')c.arc(0,24,8,0,Math.PI);else if(mood==='sad')c.arc(0,34,7,Math.PI,0);else c.moveTo(-5,25),c.lineTo(5,25);c.stroke();
 // cheek dots + side antenna
 c.fillStyle='#f68eb5';c.beginPath();c.ellipse(-27,22,5,3,0,0,7);c.ellipse(27,22,5,3,0,0,7);c.fill();
 c.strokeStyle='#a99cff';c.lineWidth=3;c.beginPath();c.moveTo(0,-57);c.lineTo(0,-68);c.stroke();c.fillStyle='#ffe18d';c.beginPath();c.arc(0,-72,5,0,7);c.fill();
 // little boots
 c.fillStyle='#343d65';rounded(c,-29,49,23,12,6);c.fill();rounded(c,6,49,23,12,6);c.fill();
 c.restore()
}
function bg(c,W,H,t){const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#252e4a');g.addColorStop(1,'#111a2c');c.fillStyle=g;c.fillRect(0,0,W,H);
 for(let i=0;i<26;i++){const x=(Math.sin(t*.009+i*13)*.5+.5)*W,y=(Math.cos(t*.012+i*7)*.5+.5)*H;c.fillStyle=i%3===0?'#b5a9ff55':'#ffffff22';c.beginPath();c.arc(x,y,i%4===0?2:1,0,7);c.fill()}
 // horizon glow
 const glow=c.createRadialGradient(W*.5,H*.85,2,W*.5,H*.85,W*.65);glow.addColorStop(0,'#8a78ff26');glow.addColorStop(1,'#8a78ff00');c.fillStyle=glow;c.fillRect(0,0,W,H)
}
function drawGame(){
 const [W,H]=fit(canvas,ctx);w=W;h=H;frame++;bg(ctx,W,H,frame);
 if(gameState==='lights')drawLights();else if(gameState==='sequence')drawSequence();else if(gameState==='order')drawOrder();else{
  // illustrated room / puzzle scene
  ctx.fillStyle='#ffffff09';rounded(ctx,W*.08,H*.12,W*.84,H*.7,22);ctx.fill();
  ctx.fillStyle='#ffffff0b';ctx.beginPath();ctx.ellipse(W*.5,H*.79,W*.3,12,0,0,7);ctx.fill();
  drawMilo(ctx,W*.5,H*.63,Math.min(1.1,W/390),mascotMood,frame);
  if(gameState==='wait'){ctx.fillStyle='#b9adff';ctx.font='700 12px "DM Sans"';ctx.textAlign='center';ctx.fillText('OBSERVA CON ATENCIÓN',W/2,H*.18)}
 }
}
function drawHome(){const [W,H]=fit(homeCanvas,hctx);bg(hctx,W,H,frame*.65);hctx.fillStyle='#ffffff0b';hctx.beginPath();hctx.ellipse(W*.48,H*.88,90,10,0,0,7);hctx.fill();drawMilo(hctx,W*.47,H*.63,1.13,'happy',frame*.7)}
function drawLights(){const size=Math.min(w*.75,h*.78),cell=size/3,sx=(w-size)/2,sy=(h-size)/2;for(let i=0;i<9;i++){const x=sx+(i%3)*cell,y=sy+Math.floor(i/3)*cell,on=!!lightState[i];ctx.save();ctx.shadowColor=on?'#6ee7c2':'transparent';ctx.shadowBlur=on?18:0;ctx.fillStyle=on?'#6ee7c2':'#293651';rounded(ctx,x+5,y+5,cell-10,cell-10,13);ctx.fill();ctx.strokeStyle=on?'#b9ffea':'#455575';ctx.lineWidth=1.5;ctx.stroke();ctx.restore()}}
const seqColors=['#ff7199','#7f9cff','#65dfb7','#ffd477'];
function drawSequence(){const size=Math.min(w*.42,h*.43),sx=(w-size*2)/2,sy=(h-size*2)/2;for(let i=0;i<4;i++){const x=sx+(i%2)*size,y=sy+Math.floor(i/2)*size,active=seqIsPlayback&&seqPattern[seqPlaybackIndex]===i;ctx.save();ctx.globalAlpha=active?1:.65;ctx.shadowColor=seqColors[i];ctx.shadowBlur=active?27:0;ctx.fillStyle=seqColors[i];rounded(ctx,x+7,y+7,size-14,size-14,18);ctx.fill();ctx.restore()}}
function drawOrder(){const cols=3,size=Math.min(w*.25,h*.26),gap=9,total=size*3+gap*2,sx=(w-total)/2,sy=(h-total)/2;orderValues.forEach((v,i)=>{const x=sx+(i%3)*(size+gap),y=sy+Math.floor(i/3)*(size+gap);ctx.fillStyle=v<orderNext?'#277c6a':'#35435f';rounded(ctx,x,y,size,size,14);ctx.fill();ctx.strokeStyle=v<orderNext?'#6ee7c2':'#596987';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#fff';ctx.font='700 24px "Space Grotesk"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(v,x+size/2,y+size/2)})}
function loop(){drawGame();drawHome();requestAnimationFrame(loop)}
function resize(){fit(canvas,ctx);fit(homeCanvas,hctx)}window.addEventListener('resize',resize);window.addEventListener('orientationchange',()=>setTimeout(resize,150));
window.pgAdsCallbacks=window.pgAdsCallbacks||[];window.pgAdsCallbacks.push(async()=>{try{await window.pgAds.init()}catch(e){}});
async function mostrarInterstitial(){try{const b=await window.pgAds.requestOutOfPageAd('interstitial');if(b.state==='ready')b.show();else b.addEventListener('ready',()=>b.show())}catch(e){}}
async function mostrarRecompensado(){try{const b=await window.pgAds.requestOutOfPageAd('rewarded');if(b.state==='ready')b.show();else b.addEventListener('ready',()=>b.show());b.addEventListener('rewarded',()=>{state.coins+=25;save();updateCoins();toast('¡25 focos añadidos!')})}catch(e){toast('No hay anuncios disponibles')}}
const CONTENT_KEY='cerebroLoco_content_v2',CONTENT_VERSION_KEY='cerebroLoco_contentVersion_v2';let pendingContentManifest=null;
async function readJson(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('No se pudo cargar');return r.json()}
function validLevels(d){return Array.isArray(d)&&d.length>0&&d.every(x=>x&&typeof x.q==='string'&&typeof x.type==='string')}
async function loadGameContent(){let cached=null,localVersion=0;try{cached=JSON.parse(localStorage.getItem(CONTENT_KEY)||'null');localVersion=Number(localStorage.getItem(CONTENT_VERSION_KEY)||0)}catch(e){}
 try{const m=await readJson(new URL('./manifest.json',document.baseURI).href);if(m.minimumEngineVersion&&m.minimumEngineVersion>ENGINE_VERSION){setTimeout(()=>location.replace(location.href.split('?')[0]+'?update='+Date.now()),500);return cached||[]}
 if(cached&&validLevels(cached)){if(Number(m.contentVersion)>localVersion)pendingContentManifest=m;return cached}
 const fresh=await readJson(new URL('./'+m.levelsFile,document.baseURI).href);localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));localStorage.setItem(CONTENT_VERSION_KEY,String(m.contentVersion));return fresh
 }catch(e){if(cached&&validLevels(cached))return cached;throw e}}
async function applyContentUpdate(){const b=$('applyContentUpdate');b.disabled=true;b.textContent='DESCARGANDO…';try{const m=pendingContentManifest||await readJson('./manifest.json'),fresh=await readJson('./'+m.levelsFile);if(!validLevels(fresh))throw Error();localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));localStorage.setItem(CONTENT_VERSION_KEY,String(m.contentVersion));location.reload()}catch(e){b.disabled=false;b.textContent='INTENTAR DE NUEVO';toast('No se pudo actualizar. Comprueba tu conexión.')}}
const KEY='cerebroLocoSave_v2';let state={unlocked:1,coins:120,done:[],hints:[],name:'',age:0};try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)state={...state,...s}}catch(e){}
let levels=await loadGameContent();if(!validLevels(levels))levels=[{q:'¿Cuánto es 2 + 2?',type:'choice',opts:['3','4','5','6'],answer:1,hint:'Suma dos y dos.',explain:'Dos más dos son cuatro.'}];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function toast(m){$('toast').textContent=m;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2100)}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));if(id==='game')setTimeout(resize,60);if(id==='home')setTimeout(resize,60)}
function updateCoins(){['coinsHome','coinsLevels','coinsGame'].forEach(id=>$(id).textContent=state.coins);$('homeProgress').textContent=Math.min(state.unlocked,levels.length);$('homeStars').textContent=state.done.length}
let age=Number(state.age)||15;$('ageSlider').value=age;$('ageValue').textContent=age;
function setAge(v){age=Math.max(5,Math.min(99,Number(v)));$('ageSlider').value=age;$('ageValue').textContent=age}
$('ageSlider').oninput=e=>setAge(e.target.value);$('ageDown').onclick=()=>setAge(age-1);$('ageUp').onclick=()=>setAge(age+1);
if(state.name&&state.age){$('onboarding-age').classList.remove('active');$('onboarding-name').classList.remove('active');$('home').classList.add('active');$('userGreeting').textContent='HOLA, '+state.name.toUpperCase()}else if(state.age){$('onboarding-age').classList.remove('active');$('onboarding-name').classList.add('active')}else{$('onboarding-age').classList.add('active')}
$('nextToNameBtn').onclick=()=>{state.age=age;save();$('onboarding-age').classList.remove('active');$('onboarding-name').classList.add('active');setTimeout(()=>$('inputName').focus({preventScroll:true}),250)};
$('backToAge').onclick=()=>{ $('onboarding-name').classList.remove('active');$('onboarding-age').classList.add('active')};
$('saveProfileBtn').onclick=()=>{const n=$('inputName').value.trim();if(!n){toast('Escribe tu nombre para continuar');$('inputName').focus();return}state.name=n;save();$('userGreeting').textContent='HOLA, '+n.toUpperCase();show('home')};
$('inputName').addEventListener('keydown',e=>{if(e.key==='Enter')$('saveProfileBtn').click()});
function renderMap(){const grid=$('levelGrid');grid.innerHTML='';levels.forEach((l,i)=>{const done=state.done.includes(i),b=document.createElement('button');b.className='level'+(done?' done':'');b.textContent=done?'✓':String(i+1).padStart(2,'0');b.setAttribute('aria-label','Nivel '+(i+1));b.onclick=()=>start(i);grid.appendChild(b)});$('mapProgress').style.width=(state.done.length/levels.length*100)+'%';updateCoins()}
function start(i){if(waitTimer){clearInterval(waitTimer);waitTimer=null}current=i;finished=false;show('game');$('levelLabel').textContent='RETO '+String(i+1).padStart(2,'0')+' / '+levels.length;$('question').textContent=levels[i].q;$('hintline').textContent='';$('feedback').textContent='';$('playArea').innerHTML='';updateCoins();gameState=levels[i].type;mascotMood='idle';
 if(gameState==='choice'){if(levels[i].display){const d=document.createElement('div');d.className='boardtext';d.textContent=levels[i].display;$('playArea').appendChild(d)}const wrap=document.createElement('div');wrap.className='answers';(levels[i].opts||[]).forEach((opt,idx)=>{const b=document.createElement('button');b.className='answer';b.textContent=opt;b.onclick=()=>{if(finished)return;if(idx===levels[i].answer){b.classList.add('correct');mascotMood='happy';setTimeout(win,260)}else{b.classList.add('wrong');mascotMood='sad';fail('Esa no era. ¡Mira con otros ojos!')}};wrap.appendChild(b)});$('playArea').appendChild(wrap)}
 else if(gameState==='lights'){lightState=Array(9).fill(1);[0,2,4,6].forEach(toggleLight);if(lightState.every(Boolean))toggleLight(4)}
 else if(gameState==='sequence'){const len=levels[i].length||5;seqPattern=Array.from({length:len},()=>Math.floor(Math.random()*4));seqCurrentStep=0;seqIsPlayback=true;seqPlaybackIndex=0;playSequence()}
 else if(gameState==='wait'){const b=document.createElement('div');b.className='boardtext';b.textContent='MILO TE PIDE PACIENCIA';$('playArea').appendChild(b);let count=5;$('feedback').textContent='Espera '+count+' segundos…';waitTimer=setInterval(()=>{count--;$('feedback').textContent=count>0?'Espera '+count+' segundos…':'¡Muy bien!';if(count<=0){clearInterval(waitTimer);waitTimer=null;win()}},1000)}
 else if(gameState==='order'){orderValues=[1,2,3,4,5,6].sort(()=>Math.random()-.5);orderNext=1;$('hintline').textContent='Toca cada número en orden ascendente';}
 resize()}
function win(){if(finished)return;finished=true;mascotMood='happy';const first=!state.done.includes(current);if(first){state.done.push(current);state.coins+=10} $('winReward').textContent=first?'+10 focos':'RETO YA SUPERADO';state.unlocked=Math.max(state.unlocked,Math.min(levels.length,current+2));save();updateCoins();$('winText').textContent=(levels[current].explain||'¡Buen trabajo!')+' Tu progreso quedó guardado.';$('winModal').classList.add('show')}
function fail(m){$('feedback').textContent=m||'Casi… inténtalo otra vez.';if(navigator.vibrate)navigator.vibrate(45);mascotMood='sad';setTimeout(()=>{if(!finished)mascotMood='idle'},1000)}
function toggleLight(i){const x=i%3,y=Math.floor(i/3);[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const a=x+dx,b=y+dy;if(a>=0&&a<3&&b>=0&&b<3)lightState[b*3+a]^=1})}
function playSequence(){if(seqPlaybackIndex<seqPattern.length)setTimeout(()=>{seqPlaybackIndex++;if(seqPlaybackIndex<seqPattern.length)playSequence();else{seqIsPlayback=false;seqPlaybackIndex=0;$('hintline').textContent='¡Tu turno! Repite la secuencia.'}},650)}
function handleSeqInput(i){if(i===seqPattern[seqCurrentStep]){seqCurrentStep++;if(seqCurrentStep===seqPattern.length)win()}else{fail('Secuencia incorrecta. Observa de nuevo.');seqCurrentStep=0;seqIsPlayback=true;seqPlaybackIndex=0;setTimeout(playSequence,850)}}
canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(finished)return;
 if(gameState==='lights'){const size=Math.min(w*.75,h*.78),cell=size/3,sx=(w-size)/2,sy=(h-size)/2;for(let i=0;i<9;i++){const cx=sx+(i%3)*cell,cy=sy+Math.floor(i/3)*cell;if(x>cx&&x<cx+cell&&y>cy&&y<cy+cell){toggleLight(i);if(lightState.every(Boolean))win();break}}}
 else if(gameState==='sequence'&&!seqIsPlayback){const size=Math.min(w*.42,h*.43),sx=(w-size*2)/2,sy=(h-size*2)/2;for(let i=0;i<4;i++){const cx=sx+(i%2)*size,cy=sy+Math.floor(i/2)*size;if(x>cx&&x<cx+size&&y>cy&&y<cy+size){handleSeqInput(i);break}}}
 else if(gameState==='order'){const size=Math.min(w*.25,h*.26),gap=9,total=size*3+gap*2,sx=(w-total)/2,sy=(h-total)/2;for(let i=0;i<orderValues.length;i++){const cx=sx+(i%3)*(size+gap),cy=sy+Math.floor(i/3)*(size+gap);if(x>cx&&x<cx+size&&y>cy&&y<cy+size){const v=orderValues[i];if(v===orderNext){orderNext++;if(orderNext>6)win()}else fail('Busca el '+orderNext+', no te adelantes.');break}}}});
$('playBtn').onclick=()=>{const n=levels.findIndex((_,i)=>!state.done.includes(i));start(n<0?0:n)};$('levelsBtn').onclick=()=>{renderMap();show('levels')};$('backHome').onclick=()=>show('home');$('backLevels').onclick=()=>{renderMap();show('levels')};
$('hintBtn').onclick=()=>{if(finished)return;if(state.hints.includes(current)){$('hintline').textContent=levels[current].hint||'Piensa con calma.';return}if(state.coins<25){toast('No tienes focos suficientes');return}state.coins-=25;state.hints.push(current);save();updateCoins();$('hintline').textContent=levels[current].hint||'Observa todos los detalles.'};
$('skipBtn').onclick=()=>{if(finished)return;if(state.coins<75){toast('Necesitas 75 focos para saltar');return}state.coins-=75;state.unlocked=Math.max(state.unlocked,current+2);if(!state.done.includes(current))state.done.push(current);save();$('winReward').textContent='−75 focos';$('winText').textContent='Has usado tus focos para superar este reto.';$('winModal').classList.add('show');updateCoins()};
$('nextBtn').onclick=async()=>{$('winModal').classList.remove('show');if(current<levels.length-1){adsCounter++;if(adsCounter%3===0)await mostrarInterstitial();start(current+1)}else{renderMap();show('levels')}};
$('rewardAdBtn').onclick=async()=>{const b=$('rewardAdBtn');b.disabled=true;b.textContent='CARGANDO…';await mostrarRecompensado();setTimeout(()=>{b.disabled=false;b.textContent='✦ Ver anuncio · +25 focos'},2200)};
$('mapBtn').onclick=()=>{$('winModal').classList.remove('show');renderMap();show('levels')};
if(pendingContentManifest){$('updateVersion').textContent='Versión '+pendingContentManifest.contentVersion;$('updateChangelog').innerHTML=(pendingContentManifest.changelog||['Nuevos desafíos disponibles.']).map(x=>{const li=document.createElement('li');li.textContent=x;return li.outerHTML}).join('');$('contentUpdateModal').classList.add('show')}
$('applyContentUpdate').onclick=applyContentUpdate;$('laterContentUpdate').onclick=()=>$('contentUpdateModal').classList.remove('show');
resize();updateCoins();loop();
})();