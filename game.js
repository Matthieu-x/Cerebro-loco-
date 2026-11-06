(()=>{'use strict';
const $=id=>document.getElementById(id),SAVE='cerebroLocoSave_v3';
let state={coins:150,done:[],hints:[],name:'',age:0};try{state={...state,...JSON.parse(localStorage.getItem(SAVE)||'{}')}}catch(e){}
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(state))}catch(e){}};
const R=(a,b,c,d)=>[a/16.72,b/9.41,(c-a)/16.72,(d-b)/9.41],P=(x,y)=>[x/16.72,y/9.41];
const KEY='<svg viewBox="0 0 80 40"><g fill="none" stroke="#ffd66f" stroke-width="7" stroke-linecap="round"><circle cx="14" cy="20" r="10"/><path d="M24 20h46M58 20v10M68 20v8"/></g></svg>';
const PHONE='<svg viewBox="0 0 40 70"><rect x="3" y="3" width="34" height="64" rx="7" fill="#263943" stroke="#9fe3ff" stroke-width="3"/><rect x="8" y="10" width="24" height="46" rx="3" fill="#a8e4e4"/><circle cx="20" cy="62" r="2.5" fill="#9fe3ff"/></svg>';
const L=[
{img:'scene-01.webp',n:'Encuentra el teléfono oculto',coin:P(1360,60),win:'¡Estaba debajo de los libros!',
 hot:[{r:R(440,590,720,720),s:'Shhh… el gato duerme 😴'},{r:R(730,570,915,695),s:'Solo un cojín con un gato.'},{r:R(1180,385,1525,590),s:'La tele está apagada.'},{r:R(1000,380,1150,600),s:'Nada bajo la lámpara.'},{r:R(800,735,905,825),s:'Una taza vacía.'},{r:R(925,620,1100,760),s:'Solo tierra y hojas.'},{r:R(1060,750,1225,815),k:'books'}]},
{img:'scene-02.webp',n:'Encuentra la llave',coin:P(1338,58),win:'¡Puerta abierta con la llave del bolsillo!',
 hot:[{r:R(435,610,690,720),s:'El gato no la tiene.'},{r:R(1500,478,1660,620),s:'El pez te mira… sin pistas.'},{r:R(1485,175,1655,440),s:'Un cuadro bonito. Nada más.'},{r:R(870,600,1100,830),s:'Solo una planta.'},{r:R(740,240,935,490),s:'Un póster de videojuegos.'},{r:R(1175,150,1440,820),k:'door'},{r:R(945,310,1085,540),k:'hoodie'}]},
{img:'scene-03.webp',n:'Encuentra el código del cofre',coin:P(1320,62),win:'¡Cofre abierto! Brújula + calendario = 259.',
 hot:[{r:R(835,600,975,830),s:'La linterna alumbra, nada más.'},{r:R(1045,775,1265,865),s:'Un libro de coronas… sin código.'},{r:R(1390,140,1520,290),s:'Un gatito de peluche.'},{r:R(580,815,945,905),k:'map'},{r:R(1470,360,1640,530),k:'cal'},{r:R(1110,500,1195,620),k:'lock'}]}];
let cur=0,done=false,flags={},sayT,toastT;
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}
function say(m){const s=$('say');s.textContent=m;s.classList.add('on');clearTimeout(sayT);sayT=setTimeout(()=>s.classList.remove('on'),2600)}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id))}
function coins(){['coinsHome','coinsLevels'].forEach(i=>$(i).textContent=state.coins);$('coinNum').textContent=state.coins}
const css=r=>`left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%`;
function card(h){const c=$('card');c.innerHTML=h;c.classList.add('on');c.onclick=e=>{if(e.target===c)c.classList.remove('on')}}
function start(i){cur=i;done=false;flags={};const l=L[i];show('game');$('bg').src=l.img;$('card').classList.remove('on');$('say').classList.remove('on');
 const c=$('coinNum');c.style.left=l.coin[0]+'%';c.style.top=l.coin[1]+'%';coins();
 const h=$('hots');h.innerHTML='';l.hot.forEach((o,k)=>{const b=document.createElement('button');b.className='hot';b.style.cssText=css(o.r);b.dataset.k=o.k||'';b.onclick=()=>tap(o);h.appendChild(b)})}
function tap(o){if(done)return;const k=o.k;
 if(!k)return say(o.s);
 if(k==='books'){reveal(PHONE,P(1140,770),4);return finish()}
 if(k==='hoodie'){if(flags.key)return say('Ya sacaste la llave.');flags.key=1;const e=reveal(KEY,P(1015,540),9);e.id='key';drag(e);return say('¡Una llave en el bolsillo! Arrástrala a la puerta.')}
 if(k==='door')return say(flags.key?'Arrastra la llave hasta la cerradura.':'Está cerrada con llave 🔒');
 if(k==='map'){flags.map=1;return card('<div class="paper">🧭 Brújula del mapa<br>Norte · Centro · Sureste</div><small>Toca para cerrar</small>')}
 if(k==='cal'){flags.cal=1;return card('<div class="grid3">'+[1,2,3,4,5,6,7,8,9].map(n=>'<b>'+n+'</b>').join('')+'</div><small>Toca para cerrar</small>')}
 if(k==='lock')return keypad()}
function reveal(svg,p,w){const e=document.createElement('div');e.className='item';e.style.cssText=`left:${p[0]}%;top:${p[1]}%;width:${w}%`;e.innerHTML=svg;$('hots').appendChild(e);return e}
function drag(e){const st=$('stage');e.onpointerdown=ev=>{e.setPointerCapture(ev.pointerId);e.style.animation='none';e.onpointermove=m=>{const r=st.getBoundingClientRect();e.style.left=(m.clientX-r.left)/r.width*100+'%';e.style.top=(m.clientY-r.top)/r.height*100+'%'};
 e.onpointerup=u=>{e.onpointermove=e.onpointerup=null;const r=st.getBoundingClientRect(),x=(u.clientX-r.left)/r.width*100,y=(u.clientY-r.top)/r.height*100,t=P(1378,525);
 if(Math.hypot(x-t[0],(y-t[1])*.5625)<7){e.style.left=t[0]+'%';e.style.top=t[1]+'%';finish()}else{say('Ahí no. ¿Dónde va una llave?');e.style.animation=''}}}}
function keypad(){let v='';const draw=()=>{$('dsp').textContent=v.padEnd(3,'·')};
 card('<div class="disp" id="dsp">···</div><div class="grid3">'+[1,2,3,4,5,6,7,8,9].map(n=>'<button data-n="'+n+'">'+n+'</button>').join('')+'</div>');
 $('card').querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();if(v.length<3)v+=b.dataset.n;draw();if(v.length===3){if(v==='259'){$('card').classList.remove('on');finish()}else{$('dsp').classList.add('shake');v='';setTimeout(()=>{draw();$('dsp').classList.remove('shake')},350);say('Código incorrecto. Busca la brújula.')}}})}
function finish(){if(done)return;done=true;const f=!state.done.includes(cur);if(f){state.done.push(cur);state.coins+=10}save();coins();$('winReward').textContent=f?'+10 focos':'Misión completada';$('winText').textContent=L[cur].win;setTimeout(()=>$('winModal').classList.add('show'),600)}
function hint(){if(done)return;const first=!state.hints.includes(cur+'-'+(flags.key||flags.map||flags.cal||0));if(state.coins<25)return toast('Necesitas 25 focos');state.coins-=25;save();coins();
 const t=cur===0?'books':cur===1?(flags.key?'door':'hoodie'):(!flags.map?'map':!flags.cal?'cal':'lock');
 document.querySelectorAll('.hot').forEach(b=>b.classList.toggle('glow',b.dataset.k===t));
 say(cur===0?'Mira donde algo pesado tapa algo pequeño.':cur===1?(flags.key?'Arrastra la llave a la cerradura.':'Revisa la ropa colgada.'):(!flags.map?'Empieza por el mapa de la mesa.':!flags.cal?'Los números están en la pared.':'Ahora el candado del cofre.'))}
async function ad(kind){try{if(!window.pgAds)return toast('Anuncios no disponibles');const a=await window.pgAds.requestOutOfPageAd(kind);const go=()=>a.show();a.state==='ready'?go():a.addEventListener('ready',go);if(kind==='rewarded')a.addEventListener('rewarded',()=>{state.coins+=25;save();coins();toast('¡+25 focos!')})}catch(e){toast('No hay anuncios disponibles')}}
window.pgAdsCallbacks=window.pgAdsCallbacks||[];window.pgAdsCallbacks.push(async()=>{try{await window.pgAds.init()}catch(e){}});
function map(){const g=$('levelGrid');g.innerHTML='';L.forEach((l,i)=>{const b=document.createElement('button');b.className='level'+(state.done.includes(i)?' done':'');b.style.backgroundImage='url('+l.img+')';b.innerHTML='<span>'+(i+1)+'. '+l.n+'</span>';b.onclick=()=>go(i);g.appendChild(b)});$('mapCount').textContent=state.done.length+' de '+L.length+' completadas';coins()}
function go(i){try{document.documentElement.requestFullscreen?.()}catch(e){}start(i)}
let n=0;
$('hintBtn').onclick=hint;$('pauseBtn').onclick=()=>$('pauseModal').classList.add('show');$('giftBtn').onclick=$('focosBtn').onclick=()=>ad('rewarded');$('rewardAdBtn').onclick=()=>ad('rewarded');
$('resumeBtn').onclick=()=>$('pauseModal').classList.remove('show');$('retryBtn').onclick=()=>{$('pauseModal').classList.remove('show');start(cur)};$('exitBtn').onclick=()=>{$('pauseModal').classList.remove('show');map();show('levels')};
$('nextBtn').onclick=async()=>{$('winModal').classList.remove('show');if(cur<L.length-1){if(++n%2===0)await ad('interstitial');start(cur+1)}else{map();show('levels')}};
$('mapBtn').onclick=()=>{$('winModal').classList.remove('show');map();show('levels')};
$('playBtn').onclick=()=>{const i=L.findIndex((_,k)=>!state.done.includes(k));go(i<0?0:i)};$('levelsBtn').onclick=()=>{map();show('levels')};$('backHome').onclick=()=>show('home');
let age=Number(state.age)||15;const setAge=v=>{age=Math.max(5,Math.min(99,+v));$('ageSlider').value=age;$('ageValue').textContent=age};setAge(age);
$('ageSlider').oninput=e=>setAge(e.target.value);$('ageDown').onclick=()=>setAge(age-1);$('ageUp').onclick=()=>setAge(age+1);
$('nextToNameBtn').onclick=()=>{state.age=age;save();show('onboarding-name')};$('backToAge').onclick=()=>show('onboarding-age');
$('saveProfileBtn').onclick=()=>{const v=$('inputName').value.trim();if(!v)return toast('Escribe tu nombre');state.name=v;save();$('userGreeting').textContent='HOLA, '+v.toUpperCase();show('home')};
if(state.name&&state.age){$('userGreeting').textContent='HOLA, '+state.name.toUpperCase();show('home')}else if(state.age)show('onboarding-name');
L.forEach(l=>{const i=new Image();i.src=l.img});coins();map();
})();
