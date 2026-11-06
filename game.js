(async()=>{
'use strict';

// 👇 CADA VEZ QUE CAMBIES EL game.js O EL game.css, SÚBELE EL NÚMERO AQUÍ 👇
const ENGINE_VERSION = 2; 

/* =========================================
   SISTEMA GRÁFICO EN CANVAS
   ========================================= */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let w, h;

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    w = rect.width;
    h = rect.height;
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);

let animFrame = 0;
let mascotMood = 'idle';
let gameState = 'choice';
let lightBoard = [];
let seqColors = ['#ff607d', '#5ca8ff', '#5bd59b', '#ffd45c'];
let seqPattern = [];
let seqCurrentStep = 0;
let seqIsPlayback = false;
let seqPlaybackIndex = 0;

function renderLoop() {
    ctx.clearRect(0, 0, w, h);
    animFrame++;
    drawBackground();
    if (gameState === 'choice' || gameState === 'wait') {
        drawMascot(w / 2, h - 60, 1.2, mascotMood);
    } else if (gameState === 'lights') {
        drawLightsGame();
    } else if (gameState === 'sequence') {
        drawSequenceGame();
    }
    requestAnimationFrame(renderLoop);
}

function drawBackground() {
    let grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a1226');
    grad.addColorStop(1, '#050812');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for(let i=0; i<20; i++) {
        let sx = (Math.sin(animFrame*0.01 + i) * 0.5 + 0.5) * w;
        let sy = (Math.cos(animFrame*0.015 + i) * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI*2);
        ctx.fill();
    }
}

function drawMascot(x, y, scale, mood) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    let floatY = Math.sin(animFrame * 0.05) * 5;
    ctx.translate(0, floatY);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.ellipse(0, 25, 30, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e66fa8';
    ctx.strokeStyle = '#713d72';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-15, 0, 18, 0, Math.PI*2);
    ctx.arc(15, 0, 18, 0, Math.PI*2);
    ctx.arc(0, -10, 22, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, -5); ctx.quadraticCurveTo(0, -15, 10, -5);
    ctx.moveTo(-20, 5); ctx.quadraticCurveTo(-10, 15, 0, 5);
    ctx.moveTo(20, 5); ctx.quadraticCurveTo(10, 15, 0, 5);
    ctx.strokeStyle = '#c95791';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-12, 2, 8, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(12, 2, 8, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#34264d';
    if (mood === 'happy') {
        ctx.beginPath(); ctx.arc(-12, 2, 5, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.arc(12, 2, 5, Math.PI, 0); ctx.fill();
    } else if (mood === 'sad') {
        ctx.beginPath(); ctx.arc(-12, 6, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(12, 6, 3, 0, Math.PI*2); ctx.fill();
    } else {
        ctx.beginPath(); ctx.arc(-12, 2, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(12, 2, 4, 0, Math.PI*2); ctx.fill();
    }
    ctx.strokeStyle = '#713d72';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (mood === 'happy') { ctx.arc(0, 15, 8, 0, Math.PI); }
    else if (mood === 'sad') { ctx.arc(0, 22, 8, Math.PI, 0); }
    else { ctx.moveTo(-5, 15); ctx.lineTo(5, 15); }
    ctx.stroke();
    ctx.restore();
}

function drawLightsGame() {
    const boardSize = Math.min(w, h) * 0.7;
    const startX = (w - boardSize) / 2;
    const startY = (h - boardSize) / 2;
    const cellSize = boardSize / 3;
    for (let i = 0; i < 9; i++) {
        let x = startX + (i % 3) * cellSize;
        let y = startY + Math.floor(i / 3) * cellSize;
        ctx.fillStyle = lightBoard[i] ? '#d4af37' : '#1a2542';
        ctx.fillRect(x + 5, y + 5, cellSize - 10, cellSize - 10);
        if (lightBoard[i]) {
            ctx.shadowColor = '#d4af37';
            ctx.shadowBlur = 15;
            ctx.fillRect(x + 5, y + 5, cellSize - 10, cellSize - 10);
            ctx.shadowBlur = 0;
        }
    }
}

function drawSequenceGame() {
    const padSize = Math.min(w, h) * 0.35;
    const startX = (w - padSize * 2) / 2;
    const startY = (h - padSize * 2) / 2;
    for (let i = 0; i < 4; i++) {
        let x = startX + (i % 2) * padSize;
        let y = startY + Math.floor(i / 2) * padSize;
        ctx.fillStyle = seqColors[i];
        ctx.globalAlpha = 0.3;
        if (seqIsPlayback && seqPattern[seqPlaybackIndex] === i) {
            ctx.globalAlpha = 1;
            ctx.shadowColor = seqColors[i];
            ctx.shadowBlur = 30;
        }
        ctx.beginPath();
        ctx.roundRect(x + 10, y + 10, padSize - 20, padSize - 20, 15);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (gameState === 'lights') {
        const boardSize = Math.min(w, h) * 0.7;
        const startX = (w - boardSize) / 2;
        const startY = (h - boardSize) / 2;
        const cellSize = boardSize / 3;
        for (let i = 0; i < 9; i++) {
            let cx = startX + (i % 3) * cellSize;
            let cy = startY + Math.floor(i / 3) * cellSize;
            if (x > cx && x < cx + cellSize && y > cy && y < cy + cellSize) {
                if (!finished) { toggleLight(i); if (lightState.every(Boolean)) win(); }
                break;
            }
        }
    } 
    else if (gameState === 'sequence' && !seqIsPlayback && !finished) {
        const padSize = Math.min(w, h) * 0.35;
        const startX = (w - padSize * 2) / 2;
        const startY = (h - padSize * 2) / 2;
        for (let i = 0; i < 4; i++) {
            let cx = startX + (i % 2) * padSize;
            let cy = startY + Math.floor(i / 2) * padSize;
            if (x > cx && x < cx + padSize && y > cy && y < cy + padSize) {
                handleSeqInput(i);
                break;
            }
        }
    }
});

/* =========================================
   PLAYGAMA
   ========================================= */
window.pgAdsCallbacks = window.pgAdsCallbacks || [];
window.pgAdsCallbacks.push(async () => { await window.pgAds.init(); });

async function mostrarInterstitial() {
    try { const b = await window.pgAds.requestOutOfPageAd("interstitial"); if(b.state==='ready') b.show(); else b.addEventListener('ready',()=>b.show()); } catch(e){}
}
async function mostrarRecompensado() {
    try { 
        const b = await window.pgAds.requestOutOfPageAd("rewarded"); 
        if(b.state==='ready') b.show(); else b.addEventListener('ready',()=>b.show());
        b.addEventListener('rewarded', () => { state.coins += 25; save(); updateCoins(); toast('¡+25 focos añadidos!'); });
    } catch(e){ toast('No hay anuncios disponibles.'); }
}

const $=id=>document.getElementById(id);
const CONTENT_KEY='cerebroLoco_content_v2';
const CONTENT_VERSION_KEY='cerebroLoco_contentVersion_v2';
let pendingContentManifest=null;

async function readJson(url){ const r = await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error(); return r.json(); }
function validLevels(d){ return Array.isArray(d)&&d.length>0&&d.every(x=>x&&typeof x.q==='string'&&typeof x.type==='string'); }

async function loadGameContent(){
 let cached=null, localVersion=0;
 try{ cached=JSON.parse(localStorage.getItem(CONTENT_KEY)||'null'); localVersion=Number(localStorage.getItem(CONTENT_VERSION_KEY)||0); }catch(e){}
 try{
  const m=await readJson(new URL('./manifest.json',document.baseURI).href);
  
  if (m.minimumEngineVersion && m.minimumEngineVersion > ENGINE_VERSION) {
      toast('Actualizando motor...');
      setTimeout(() => {
          window.location.href = window.location.href.split('?')[0] + '?update=' + Date.now();
      }, 1500);
      return cached; 
  }

  if(cached&&validLevels(cached)){ if(Number(m.contentVersion)>localVersion) pendingContentManifest=m; return cached; }
  const fresh=await readJson(new URL('./'+m.levelsFile,document.baseURI).href);
  localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));
  localStorage.setItem(CONTENT_VERSION_KEY,String(m.contentVersion));
  return fresh;
 }catch(error){ if(cached&&validLevels(cached)) return cached; throw error; }
}

async function applyContentUpdate(){
 const btn=$('applyContentUpdate'); btn.disabled=true; btn.textContent='DESCARGANDO…';
 try{
  const m=pendingContentManifest||await readJson(new URL('./manifest.json',document.baseURI).href);
  const fresh=await readJson(new URL('./'+m.levelsFile,document.baseURI).href);
  localStorage.setItem(CONTENT_KEY,JSON.stringify(fresh));
  localStorage.setItem(CONTENT_VERSION_KEY,String(m.contentVersion));
  
  if (m.minimumEngineVersion && m.minimumEngineVersion > ENGINE_VERSION) {
      window.location.href = window.location.href.split('?')[0] + '?update=' + Date.now();
  } else {
      location.reload();
  }
 }catch(e){ btn.disabled=false; btn.textContent='INTENTAR DE NUEVO'; }
}

const KEY='cerebroLocoSave_v2';
let state={unlocked:1,coins:120,done:[],hints:[],name:'',age:0};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)state={...state,...s}}catch(e){}

let current=0, finished=false, lightState=[], toastTimer, adsCounter = 0;
const levels=await loadGameContent();

function save(){ try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){} }
function toast(msg){ $('toast').textContent=msg; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2000); }
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id)); if(id==='game') setTimeout(resizeCanvas, 50); }
function updateCoins(){ ['coinsHome','coinsLevels','coinsGame'].forEach(id=>$(id).textContent=state.coins); $('homeProgress').textContent=Math.min(state.unlocked,levels.length); $('homeStars').textContent=state.done.length; }

// LÓGICA DE REGISTRO PASO A PASO
if(state.name && state.age) {
    $('onboarding-age').classList.remove('active');
    $('onboarding-name').classList.remove('active');
    $('home').classList.add('active');
    $('userGreeting').textContent = 'HOLA, ' + state.name.toUpperCase();
} else if (state.age) {
    $('onboarding-age').classList.remove('active');
    $('onboarding-name').classList.add('active');
} else {
    $('onboarding-age').classList.add('active');
}

$('nextToNameBtn').onclick = () => {
    const age = $('inputAge').value;
    if(!age || age < 5 || age > 99) { alert("Por favor, ingresa una edad válida (entre 5 y 99)."); return; }
    state.age = age;
    $('onboarding-age').classList.remove('active');
    $('onboarding-name').classList.add('active');
    $('inputName').focus();
};

$('saveProfileBtn').onclick = () => {
    const name = $('inputName').value.trim();
    if(!name) { alert("Por favor, ingresa tu nombre."); return; }
    state.name = name; 
    save();
    $('userGreeting').textContent = 'HOLA, ' + name.toUpperCase();
    $('onboarding-name').classList.remove('active'); 
    $('home').classList.add('active');
};

function renderMap(){
    const grid=$('levelGrid'); grid.innerHTML='';
    levels.forEach((l,i)=>{
        const completed=state.done.includes(i);
        const b=document.createElement('button');
        b.className='level'+(completed?' done':'');
        b.textContent=(completed?'✓':i+1);
        b.onclick=()=>start(i);
        grid.appendChild(b);
    });
    $('mapProgress').style.width=(state.done.length/levels.length*100)+'%';
    updateCoins();
}

function start(i){
    current=i; finished=false;
    show('game');
    $('levelLabel').textContent='NIVEL '+(i+1)+' / '+levels.length;
    $('question').textContent=levels[i].q;
    $('hintline').textContent=''; $('feedback').textContent=''; $('playArea').innerHTML='';
    updateCoins(); 
    gameState = levels[i].type;
    mascotMood = 'idle';
    
    if (gameState === 'choice') {
        if(levels[i].display){
            const d=document.createElement('div'); d.className='boardtext'; d.textContent=levels[i].display; $('playArea').appendChild(d);
        }
        const wrap=document.createElement('div'); wrap.className='answers';
        levels[i].opts.forEach((opt,idx)=>{
            const b=document.createElement('button'); b.className='answer'; b.textContent=opt;
            b.onclick=()=>{
                if(finished)return;
                if(idx===levels[i].answer){ b.classList.add('correct'); mascotMood='happy'; setTimeout(win,300); }
                else { b.classList.add('wrong'); mascotMood='sad'; setTimeout(()=>mascotMood='idle', 1000); fail('Esa no era. ¡Vuelve a pensar!'); }
            };
            wrap.appendChild(b);
        });
        $('playArea').appendChild(wrap);
    } 
    else if (gameState === 'lights') {
        lightState=Array(9).fill(1); const presses=[0,2,4,6]; presses.forEach(toggleLight); if(lightState.every(Boolean))toggleLight(4);
        lightBoard = lightState;
    }
    else if (gameState === 'sequence') {
        const len = levels[i].length || 5;
        seqPattern = Array.from({length: len}, () => Math.floor(Math.random()*4));
        seqCurrentStep = 0; seqIsPlayback = true; seqPlaybackIndex = 0;
        playSequence();
    }
    else if (gameState === 'wait') {
        const b=document.createElement('button'); b.className='tap-target'; b.textContent='NO TOCAR'; $('playArea').appendChild(b);
        let count=5; $('feedback').textContent='Espera '+count+' segundos…';
        const timer=setInterval(()=>{
            count--; $('feedback').textContent=count>0?'Espera '+count+' segundos…':'¡Muy bien!';
            if(count<=0){ clearInterval(timer); win(); }
        },1000);
    }
}

function win(){
    if(finished)return; finished=true;
    mascotMood = 'happy';
    const firstWin=!state.done.includes(current);
    if(firstWin){ state.done.push(current); state.coins+=10; }
    $('winReward').textContent=firstWin?'+10 focos':'MISIÓN YA SUPERADA';
    state.unlocked=Math.max(state.unlocked,Math.min(levels.length,current+2));
    save(); updateCoins();
    $('winText').textContent=(levels[current].explain||'¡Buen trabajo!')+' Tu progreso quedó guardado.';
    $('winModal').classList.add('show');
}

function fail(msg){
    $('feedback').textContent=msg||'Casi… inténtalo otra vez.';
    if(navigator.vibrate)navigator.vibrate(50);
    mascotMood = 'sad';
    setTimeout(()=>{ if(!finished) mascotMood = 'idle'; }, 1500);
}

function toggleLight(i){
    const x=i%3, y=Math.floor(i/3);
    [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
        const a=x+dx, b=y+dy;
        if(a>=0&&a<3&&b>=0&&b<3)lightState[b*3+a]^=1;
    });
    lightBoard = lightState;
}

function playSequence() {
    if(seqPlaybackIndex < seqPattern.length) {
        setTimeout(() => {
            seqPlaybackIndex++;
            if(seqPlaybackIndex < seqPattern.length) playSequence();
            else { seqIsPlayback = false; seqPlaybackIndex = 0; }
        }, 800);
    }
}

function handleSeqInput(colorIndex) {
    if(colorIndex === seqPattern[seqCurrentStep]) {
        seqCurrentStep++;
        if(seqCurrentStep === seqPattern.length) win();
    } else {
        fail('Secuencia incorrecta. Mira otra vez.');
        seqCurrentStep = 0; seqIsPlayback = true; seqPlaybackIndex = 0;
        setTimeout(playSequence, 1000);
    }
}

$('playBtn').onclick=()=>{ const next=levels.findIndex((_,i)=>!state.done.includes(i)); start(next<0?0:next); };
$('levelsBtn').onclick=()=>{ renderMap(); show('levels'); };
$('backHome').onclick=()=>show('home');
$('backLevels').onclick=()=>{ renderMap(); show('levels'); };

$('hintBtn').onclick=()=>{
    if(finished)return;
    if(state.hints.includes(current)){ $('hintline').textContent=levels[current].hint; return; }
    if(state.coins<25){ toast('No tienes focos suficientes'); return; }
    state.coins-=25; state.hints.push(current); save(); updateCoins(); $('hintline').textContent=levels[current].hint;
};
$('skipBtn').onclick=()=>{
    if(finished)return;
    if(state.coins<75){ toast('Necesitas 75 focos para saltar'); return; }
    state.coins-=75; state.unlocked=Math.max(state.unlocked,current+2);
    if(!state.done.includes(current))state.done.push(current);
    save(); $('winReward').textContent='−75 focos';
    $('winText').textContent='Has usado tus focos para superar este reto.';
    $('winModal').classList.add('show'); updateCoins();
};

$('nextBtn').onclick = async () => {
    $('winModal').classList.remove('show');
    if(current < levels.length - 1) {
        adsCounter++;
        if(adsCounter % 2 === 0) { await mostrarInterstitial(); }
        start(current + 1);
    } else { renderMap(); show('levels'); }
};

$('rewardAdBtn').onclick = async () => {
    const btn = $('rewardAdBtn'); btn.disabled = true; btn.textContent = "CARGANDO...";
    await mostrarRecompensado();
    setTimeout(() => { btn.disabled = false; btn.textContent = "VER ANUNCIO · +25 FOCOS"; }, 2000);
};

$('mapBtn').onclick=()=>{ $('winModal').classList.remove('show'); renderMap(); show('levels'); };

resizeCanvas();
renderLoop();
updateCoins();

if(pendingContentManifest){
    $('updateVersion').textContent='Versión '+pendingContentManifest.contentVersion;
    $('updateChangelog').innerHTML=(pendingContentManifest.changelog||['Nuevo contenido disponible.']).map(x=>'<li>'+x+'</li>').join('');
    $('contentUpdateModal').classList.add('show');
}
$('applyContentUpdate').onclick=applyContentUpdate;
$('laterContentUpdate').onclick=()=>$('contentUpdateModal').classList.remove('show');
})();