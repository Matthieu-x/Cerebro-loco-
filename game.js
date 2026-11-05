(async()=>{
'use strict';

// ==========================================
// INTEGRACIÓN DE PLAYGAMA ADS
// ==========================================
window.pgAdsCallbacks = window.pgAdsCallbacks || [];
window.pgAdsCallbacks.push(async () => {
    await window.pgAds.init();
    console.log("Playgama SDK listo");
});

async function mostrarInterstitial() {
    try {
        const banner = await window.pgAds.requestOutOfPageAd("interstitial");
        if (banner.state === 'ready') {
            banner.show();
        } else {
            banner.addEventListener('ready', () => banner.show());
        }
    } catch (e) {
        console.log("Interstitial no disponible", e);
    }
}

async function mostrarRecompensado() {
    try {
        const banner = await window.pgAds.requestOutOfPageAd("rewarded");
        if (banner.state === 'ready') {
            banner.show();
        } else {
            banner.addEventListener('ready', () => banner.show());
        }
        
        // Este evento SOLO se dispara si el usuario ve el anuncio completo
        banner.addEventListener('rewarded', () => {
            state.coins += 25;
            save();
            updateCoins();
            toast('¡+25 focos añadidos!');
        });
    } catch (e) { 
        console.log("Rewarded no disponible", e); 
        toast('No hay anuncios disponibles ahora.');
    }
}
// ==========================================

// Evita zoom por pellizco y desplazamiento de la página completa en móviles.
document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
document.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
const $=id=>document.getElementById(id);
const CONTENT_KEY='cerebroLoco_content_v1';
const CONTENT_VERSION_KEY='cerebroLoco_contentVersion_v1';
let pendingContentManifest=null;
async function readJson(url){
 const response=await fetch(url,{cache:'no-store'});
 if(!response.ok)throw new Error('No se pudo descargar '+url+' ('+response.status+')');
 return response.json();
}
function validLevels(data){return Array.isArray(data)&&data.length>0&&data.every(x=>x&&typeof x.q==='string'&&typeof x.type==='string');}
async function loadGameContent(){
 let cached=null;let localVersion=0;
 try{cached=JSON.parse(localStorage.getItem(CONTENT_KEY)||'null');localVersion=Number(localStorage.getItem(CONTENT_VERSION_KEY)||0)}catch(e){}
 try{
  const manifest=await readJson(new URL('./manifest.json',document.baseURI).href);
  if(!manifest||!Number.isFinite(Number(manifest.contentVersion))||!manifest.levelsFile)throw new Error('Manifiesto inválido');
  if(cached&&validLevels(cached)){
   if(Number(manifest.contentVersion)>localVersion)pendingContentManifest=manifest;
   return cached;
  }
  const fresh=await readJson(new URL('./'+manifest.levelsFile,document.baseURI).href);
  if(!validLevels(fresh))throw new Error('Contenido inicial inválido');
  localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));
  localStorage.setItem(CONTENT_VERSION_KEY,String(manifest.contentVersion));
  return fresh;
 }catch(error){
  if(cached&&validLevels(cached))return cached;
  throw error;
 }
}
async function applyContentUpdate(){
 const button=$('applyContentUpdate');button.disabled=true;button.textContent='DESCARGANDO…';
 try{
  const manifest=pendingContentManifest||await readJson(new URL('./manifest.json',document.baseURI).href);
  const fresh=await readJson(new URL('./'+manifest.levelsFile,document.baseURI).href);
  if(!validLevels(fresh))throw new Error('El archivo de niveles no es válido');
  localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));
  localStorage.setItem(CONTENT_VERSION_KEY,String(manifest.contentVersion));
  location.reload();
 }catch(error){
  button.disabled=false;button.textContent='INTENTAR DE NUEVO';
  $('updateMessage').textContent='No se pudo completar la actualización. Revisa tu conexión e inténtalo de nuevo.';
 }
}

const KEY='cerebroLocoDeluxe_v1';
let state={unlocked:1,coins:120,done:[],hints:[]};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved)state={...state,...saved}}catch(e){}
let current=0,finished=false,lightState=[],sequence=[],seqPos=0,seqReady=false,toastTimer;
let adsCounter = 0; // Contador para los anuncios intersticiales

const levels=await loadGameContent();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),1900)}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id))}
function updateCoins(){['coinsHome','coinsLevels','coinsGame'].forEach(id=>$(id).textContent=state.coins);$('homeProgress').textContent=Math.min(state.unlocked,levels.length);$('homeStars').textContent=state.done.length}
function renderMap(){const grid=$('levelGrid');grid.innerHTML='';levels.forEach((l,i)=>{const completed=state.done.includes(i);const b=document.createElement('button');b.className='level'+(completed?' done':'');b.disabled=false;b.setAttribute('aria-label','Repetir nivel '+(i+1)+(completed?', completado':''));b.innerHTML=(completed?'✓':i+1)+(completed?'<small>↻</small>':'');b.onclick=()=>start(i);grid.appendChild(b)});$('mapProgress').style.width=(state.done.length/levels.length*100)+'%';updateCoins()}
function renderMilo(i){const scenes=[
 {name:'SALA DE INGENIO',a:'#263c67',b:'#426d91',mood:'MILO ESTÁ CONCENTRADO',line:'Piensa con calma. Cada pista cuenta.',eyes:'<ellipse cx=65 cy=83 rx=11 ry=15 fill=white/><ellipse cx=115 cy=83 rx=11 ry=15 fill=white/><circle cx=68 cy=86 r=6 fill=#34264d/><circle cx=112 cy=86 r=6 fill=#34264d/>',mouth:'<path d="M78 111q12 7 24 0" fill=none stroke=#713d72 stroke-width=5 stroke-linecap=round/>'},
 {name:'ARCHIVO DE MISTERIOS',a:'#49305f',b:'#87517c',mood:'MILO SOSPECHA ALGO',line:'Mmm… aquí hay un detalle escondido.',eyes:'<ellipse cx=65 cy=83 rx=11 ry=15 fill=white/><ellipse cx=115 cy=83 rx=11 ry=15 fill=white/><circle cx=69 cy=84 r=6 fill=#34264d/><circle cx=119 cy=84 r=6 fill=#34264d/><path d="M52 62l18-4m40 4 18-4" class=brow/>',mouth:'<ellipse cx=90 cy=113 rx=7 ry=9 fill=#713d72/>'},
 {name:'LABORATORIO DE IDEAS',a:'#23545a',b:'#397c79',mood:'MILO TUVO UNA IDEA',line:'¡Eso! Prueba una solución diferente.',eyes:'<path d="M54 82q11-17 22 0m28 0q11-17 22 0" fill=none stroke=#713d72 stroke-width=5 stroke-linecap=round/>',mouth:'<path d="M76 108q14 20 28 0" fill=none stroke=#713d72 stroke-width=5 stroke-linecap=round/>'},
 {name:'ZONA DE MEMORIA',a:'#59416b',b:'#87639a',mood:'MILO ESTÁ RECORDANDO',line:'Observa bien y guarda la secuencia.',eyes:'<ellipse cx=65 cy=83 rx=11 ry=15 fill=white/><ellipse cx=115 cy=83 rx=11 ry=15 fill=white/><circle cx=65 cy=87 r=5 fill=#34264d/><circle cx=115 cy=87 r=5 fill=#34264d/><path d="M53 65q12-8 22 0" class=brow/>',mouth:'<path d="M78 112q12-8 24 0" fill=none stroke=#713d72 stroke-width=5 stroke-linecap=round/>'},
 {name:'CÁMARA DE LUCES',a:'#34375e',b:'#6a6093',mood:'MILO ESTÁ SORPRENDIDO',line:'¡Enciende todo el tablero!',eyes:'<circle cx=65 cy=83 r=14 fill=white/><circle cx=115 cy=83 r=14 fill=white/><circle cx=65 cy=84 r=6 fill=#34264d/><circle cx=115 cy=84 r=6 fill=#34264d/>',mouth:'<ellipse cx=90 cy=113 rx=9 ry=11 fill=#713d72/>'}
 ];const sc=scenes[Math.floor(i/4)%scenes.length];$('sceneTag').children[1].textContent=sc.name;const panel=$('companionScene');panel.style.setProperty('--scene-a',sc.a);panel.style.setProperty('--scene-b',sc.b);$('miloMood').textContent=sc.mood;$('miloLine').textContent=sc.line;$('sceneArt').innerHTML='<svg viewBox="0 0 180 180" aria-label="Milo"><path d="M90 20c-17-17-43-5-43 16-23 2-34 28-20 45-15 23-1 48 21 49 8 25 34 30 49 13 18 17 45 8 48-15 23-7 29-33 15-49 13-22-1-44-23-45-7-22-32-29-47-14Z" fill="#f49ac0" stroke="#713d72" stroke-width="7"/><path d="M89 24v112M54 47q20 5 24 24M125 47q-20 5-24 24M45 91q20-2 31 14M133 91q-20-2-31 14" fill="none" stroke="#c95791" stroke-width="5" stroke-linecap="round"/>'+sc.eyes+sc.mouth+'<circle cx=45 cy=105 r=8 fill="#ff8eae" opacity=".7"/><circle cx=135 cy=105 r=8 fill="#ff8eae" opacity=".7"/></svg>'}
function start(i){current=i;finished=false;$('game').classList.toggle('visual-mode',[1,8,11,23].includes(i));show('game');$('levelLabel').textContent='NIVEL '+(i+1)+' / '+levels.length;renderMilo(i);$('question').textContent=levels[i].q;$('hintline').textContent='';$('feedback').textContent='';$('playArea').innerHTML='';updateCoins();renderLevel(levels[i])}
function win(){if(finished)return;finished=true;const firstWin=!state.done.includes(current);if(firstWin){state.done.push(current);state.coins+=10}$('winReward').textContent=firstWin?'+10 focos':'MISIÓN YA SUPERADA';state.unlocked=Math.max(state.unlocked,Math.min(levels.length,current+2));save();updateCoins();$('winText').textContent=(levels[current].explain||'¡Buen trabajo!')+' Tu progreso quedó guardado.';$('nextBtn').textContent=current<levels.length-1?'SIGUIENTE NIVEL　➜':'¡TERMINAR!';$('winModal').classList.add('show')}
function fail(msg){$('feedback').textContent=msg||'Casi… inténtalo otra vez.';const a=$('playArea');a.classList.remove('shake');void a.offsetWidth;a.classList.add('shake');if(navigator.vibrate)navigator.vibrate(45)}
function answerButtons(l){const area=$('playArea');if(l.display){const d=document.createElement('div');d.className='boardtext';d.textContent=l.display;area.appendChild(d)}const wrap=document.createElement('div');wrap.className='answers';l.opts.forEach((opt,i)=>{const b=document.createElement('button');b.className='answer';b.textContent=opt;b.onclick=()=>{if(finished)return;if(i===l.answer){b.classList.add('correct');setTimeout(win,220)}else{b.classList.add('wrong');fail('Esa no era. ¡Vuelve a pensar!')}};wrap.appendChild(b)});area.appendChild(wrap)}
function renderQuestionVisual(index){const area=$('playArea');let svg='',caption='';
 if(index===1){caption='';svg=`<svg viewBox="0 0 360 220" role="img" aria-label="Bolsa de algodón y bloque de hierro, cada uno con un kilogramo"><defs><linearGradient id="bag" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffdf7"/><stop offset="1" stop-color="#d9e6f3"/></linearGradient><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b8c9dc"/><stop offset=".5" stop-color="#7188a4"/><stop offset="1" stop-color="#40536e"/></linearGradient><linearGradient id="tag" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e8eff9"/></linearGradient><filter id="soft" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#263653" flood-opacity=".18"/></filter></defs><ellipse cx="91" cy="190" rx="67" ry="9" fill="#536987" opacity=".13"/><ellipse cx="269" cy="190" rx="67" ry="9" fill="#536987" opacity=".13"/><g filter="url(#soft)"><path d="M48 76q-15-20 5-34q-2-22 20-25q14-20 34-5q22-10 31 13q22 7 17 31l-9 83q-42 25-91 0Z" fill="url(#bag)" stroke="#9aabc1" stroke-width="3"/><path d="M70 29q18 13 38 0M53 59q38 18 85 0M49 91q43 17 89 0M56 121q35 15 75 0" fill="none" stroke="#c3d2e3" stroke-width="4" stroke-linecap="round"/><path d="M76 18q12-14 26-4q13-13 25 1" fill="none" stroke="#8ea3bd" stroke-width="3" stroke-linecap="round"/><path d="M218 53l49-20 48 20v91l-49 22-48-22Z" fill="url(#metal)" stroke="#354a67" stroke-width="3" stroke-linejoin="round"/><path d="M218 53l48 22 49-22M266 75v91" fill="none" stroke="#dce7f3" stroke-width="3" opacity=".75"/><path d="M236 59l31-13 30 13-31 14Z" fill="#e6edf5" opacity=".35"/><path d="M228 128l35 16 0 10-35-16Z" fill="#263b58" opacity=".18"/></g><g font-family="system-ui,Arial,sans-serif" text-anchor="middle"><rect x="35" y="171" width="112" height="35" rx="12" fill="url(#tag)" stroke="#b8c7d9"/><rect x="213" y="171" width="112" height="35" rx="12" fill="url(#tag)" stroke="#b8c7d9"/><text x="91" y="185" font-size="9" font-weight="900" fill="#71839c" letter-spacing="1.2">ALGODÓN</text><text x="91" y="199" font-size="13" font-weight="950" fill="#263653">1 KILOGRAMO</text><text x="269" y="185" font-size="9" font-weight="900" fill="#71839c" letter-spacing="1.2">HIERRO</text><text x="269" y="199" font-size="13" font-weight="950" fill="#263653">1 KILOGRAMO</text></g></svg>`;}
 if(index===23){caption='Compara las figuras: cuenta sus lados';svg='<svg viewBox="0 0 340 150" role="img" aria-label="Pentágono, hexágono, octágono y cuadrado"><g fill="#dce5ff" stroke="#59648f" stroke-width="4" stroke-linejoin="round"><polygon points="42,17 68,36 58,68 26,68 16,36"/><polygon points="121,17 148,32 148,62 121,77 94,62 94,32"/><polygon points="215,12 239,22 249,46 239,70 215,80 191,70 181,46 191,22"/><rect x="282" y="24" width="48" height="48" rx="2"/></g><g fill="#26334b" font-family="Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle"><text x="42" y="104">5 lados</text><text x="121" y="104">6 lados</text><text x="215" y="104">8 lados</text><text x="306" y="104">4 lados</text><text x="42" y="125">PENTÁGONO</text><text x="121" y="125">HEXÁGONO</text><text x="215" y="125">OCTÁGONO</text><text x="306" y="125">CUADRADO</text></g></svg>';}
 if(index===11){caption='Cuenta los triángulos pequeños y el grande';svg='<svg viewBox="0 0 300 170" role="img" aria-label="Triángulo grande dividido en cuatro triángulos pequeños"><path d="M150 12 L25 150 L275 150 Z M150 12 V150 M87.5 81 L212.5 81" fill="#b9c8ff" stroke="#4d4c86" stroke-width="5" stroke-linejoin="round"/><path d="M87.5 81 L150 150 L212.5 81" fill="#f5c6e1" stroke="#4d4c86" stroke-width="4"/></svg>';}
 if(index===8){caption='Observa las cuatro figuras';svg='<svg viewBox="0 0 320 120" role="img" aria-label="Tres frutas y una bicicleta"><g stroke="#4d4c86" stroke-width="3"><circle cx="42" cy="57" r="22" fill="#ef6578"/><path d="M42 34q-2-13 9-16q2 13-9 16" fill="#63b77d"/><path d="M113 35q-18 8-17 28q2 23 21 21q17-3 18-23q1-20-22-26Z" fill="#9dce78"/><path d="M109 34q0-12 10-14" fill="none"/><path d="M188 35q-18 20-3 48q18 18 35-1q14-18-4-45q-14-14-28-2Z" fill="#ffd15c"/><path d="M203 29q-4-12 6-17" fill="none"/><circle cx="258" cy="80" r="19" fill="none"/><circle cx="303" cy="80" r="19" fill="none"/><path d="M258 80l17-30 28 30h-45l17-30 12 0" fill="none"/></g></svg>';}
 if(!svg)return;const box=document.createElement('div');box.className='question-visual';box.innerHTML=svg+'<div class="visual-caption">'+caption+'</div>';area.appendChild(box);}
function renderLevel(l){const area=$('playArea');renderQuestionVisual(current);
 if(l.type==='choice'){answerButtons(l);return}
 if(l.type==='lights'){
  lightState=Array(9).fill(1);const presses=[0,2,4,6];presses.forEach(toggleLight);if(lightState.every(Boolean))toggleLight(4);
  drawLights();return;
 }
 if(l.type==='order'){
  const nums=[4,1,6,3,5,2],positions=[[10,12],[60,7],[34,38],[72,53],[8,66],[48,72]];let next=1;
  const stage=document.createElement('div');stage.style.cssText='position:relative;width:min(88vw,340px);height:300px';
  nums.forEach((n,i)=>{const b=document.createElement('button');b.className='answer';b.textContent=n;b.style.cssText=`position:absolute;width:58px;height:58px;min-height:0;border-radius:50%;left:${positions[i][0]}%;top:${positions[i][1]}%`;b.onclick=()=>{if(finished)return;if(n===next){b.style.visibility='hidden';next++;if(next===7)win()}else{next=1;stage.querySelectorAll('button').forEach(x=>x.style.visibility='visible');fail('¡Empieza otra vez desde el 1!')}};stage.appendChild(b)});area.appendChild(stage);return;
 }
 if(l.type==='sequence'){
  const colors=['#ff607d','#5ca8ff','#5bd59b','#ffd45c'];sequence=Array.from({length:5},()=>Math.floor(Math.random()*4));seqPos=0;seqReady=false;
  const label=document.createElement('div');label.className='boardtext';label.textContent='Observa…';area.appendChild(label);
  const pads=document.createElement('div');pads.className='sequence';colors.forEach((c,i)=>{const b=document.createElement('button');b.className='pad';b.style.background=c;b.onclick=()=>{if(!seqReady||finished)return;flash(b);if(i===sequence[seqPos]){seqPos++;if(seqPos===sequence.length)win()}else{seqReady=false;fail('Secuencia incorrecta. Mira otra vez.');setTimeout(play,700)}};pads.appendChild(b)});area.appendChild(pads);
  function flash(b){b.classList.add('active');setTimeout(()=>b.classList.remove('active'),350)}
  function play(){seqPos=0;seqReady=false;label.textContent='Observa…';sequence.forEach((v,k)=>setTimeout(()=>flash(pads.children[v]),650+k*650));setTimeout(()=>{seqReady=true;label.textContent='¡Tu turno!'},650+sequence.length*650)}
  setTimeout(play,300);return;
 }
 if(l.type==='wait'){
  const b=document.createElement('button');b.className='tap-target';b.textContent='NO TOCAR';area.appendChild(b);let count=5;$('feedback').textContent='Espera '+count+' segundos…';const timer=setInterval(()=>{count--;$('feedback').textContent=count>0?'Espera '+count+' segundos…':'¡Muy bien!';if(count<=0){clearInterval(timer);win()}},1000);return;
 }
}
function toggleLight(i){const x=i%3,y=Math.floor(i/3);[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const a=x+dx,b=y+dy;if(a>=0&&a<3&&b>=0&&b<3)lightState[b*3+a]^=1})}
function drawLights(){const area=$('playArea');area.innerHTML='';const board=document.createElement('div');board.className='light-board';lightState.forEach((v,i)=>{const b=document.createElement('button');b.className='light'+(v?' on':'');b.setAttribute('aria-label','Luz '+(i+1)+(v?' encendida':' apagada'));b.innerHTML=`<svg class="bulb" viewBox="0 0 60 80" aria-hidden="true"><path d="M30 6a20 20 0 0 0-11 36v10h22V42A20 20 0 0 0 30 6z" fill="${v?'#ffe45c':'#777e94'}" stroke="#17152f" stroke-width="4" stroke-linejoin="round"/><rect x="20" y="54" width="20" height="8" rx="3" fill="#b5b9c9" stroke="#17152f" stroke-width="3"/><rect x="23" y="64" width="14" height="7" rx="3" fill="#858ba0" stroke="#17152f" stroke-width="3"/>${v?'<path d="M22 20q4-8 12-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>':''}</svg>`;b.onclick=()=>{if(finished)return;toggleLight(i);drawLights();if(lightState.every(Boolean))win()};board.appendChild(b)});area.appendChild(board)}
$('playBtn').onclick=()=>{const next=levels.findIndex((_,i)=>!state.done.includes(i));start(next<0?0:next)};
$('levelsBtn').onclick=()=>{renderMap();show('levels')};
$('backHome').onclick=()=>show('home');$('backLevels').onclick=()=>{renderMap();show('levels')};
$('hintBtn').onclick=()=>{if(finished)return;if(state.hints.includes(current)){$('hintline').textContent=levels[current].hint;return}if(state.coins<25){toast('No tienes focos suficientes');return}state.coins-=25;state.hints.push(current);save();updateCoins();$('hintline').textContent=levels[current].hint};
$('skipBtn').onclick=()=>{if(finished)return;if(state.coins<75){toast('Necesitas 75 focos para saltar');return}state.coins-=75;state.unlocked=Math.max(state.unlocked,current+2);if(!state.done.includes(current))state.done.push(current);save();$('winReward').textContent='−75 focos';$('winText').textContent='Has usado tus focos para superar este reto. La siguiente misión ya está disponible.';$('winModal').classList.add('show');$('nextBtn').textContent=current<levels.length-1?'SIGUIENTE NIVEL　➜':'¡TERMINAR!';updateCoins()};

// BOTÓN DE SIGUIENTE NIVEL (CON ANUNCIO CADA 2 NIVELES)
$('nextBtn').onclick = async () => {
    $('winModal').classList.remove('show');
    if(current < levels.length - 1) {
        adsCounter++;
        if(adsCounter % 2 === 0) {
            await mostrarInterstitial();
        }
        start(current + 1);
    } else {
        renderMap();
        show('levels');
    }
};

// BOTÓN DE VER ANUNCIO PARA GANAR FOCOS
$('rewardAdBtn').onclick = async () => {
    const btn = $('rewardAdBtn');
    btn.disabled = true;
    btn.textContent = "CARGANDO...";
    await mostrarRecompensado();
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "VER ANUNCIO · +25 FOCOS";
    }, 2000);
};

$('mapBtn').onclick=()=>{$('winModal').classList.remove('show');renderMap();show('levels')};
updateCoins();
if(pendingContentManifest){
 $('updateVersion').textContent='Versión '+pendingContentManifest.contentVersion;
 $('updateChangelog').innerHTML=(pendingContentManifest.changelog||['Hay contenido nuevo disponible.']).map(x=>'<li>'+String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))+'</li>').join('');
 $('contentUpdateModal').classList.add('show');
}
$('applyContentUpdate').onclick=applyContentUpdate;
$('laterContentUpdate').onclick=()=>$('contentUpdateModal').classList.remove('show');
})();