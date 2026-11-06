(()=>{'use strict';
const $=id=>document.getElementById(id),SAVE='cerebroLocoSave_v3';
let state={coins:150,done:[],hints:[],name:'',age:0};try{state={...state,...JSON.parse(localStorage.getItem(SAVE)||'{}')}}catch(e){}
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(state))}catch(e){}};
const R=(a,b,c,d)=>[a/16.72,b/9.41,(c-a)/16.72,(d-b)/9.41],P=(x,y)=>[x/16.72,y/9.41];
const KEY='<svg viewBox="0 0 80 40"><g fill="none" stroke="#ffd66f" stroke-width="7" stroke-linecap="round"><circle cx="14" cy="20" r="10"/><path d="M24 20h46M58 20v10M68 20v8"/></g></svg>';
const PHONE='<svg viewBox="0 0 40 70"><rect x="3" y="3" width="34" height="64" rx="7" fill="#263943" stroke="#9fe3ff" stroke-width="3"/><rect x="8" y="10" width="24" height="46" rx="3" fill="#a8e4e4"/><circle cx="20" cy="62" r="2.5" fill="#9fe3ff"/></svg>';
const HAT='<svg viewBox="0 0 80 50"><ellipse cx="40" cy="38" rx="38" ry="9" fill="#e8c36a"/><path d="M16 36q2-26 24-26t24 26z" fill="#f2d17c"/><rect x="16" y="29" width="48" height="7" fill="#d93b3b"/></svg>',DUCK='<svg viewBox="0 0 60 60"><ellipse cx="28" cy="40" rx="22" ry="14" fill="#ffd23c"/><circle cx="38" cy="20" r="12" fill="#ffd23c"/><path d="M46 20l12 3-12 4z" fill="#ff8a2a"/><circle cx="41" cy="17" r="2" fill="#222"/></svg>';
const T=(r,s)=>({r,s});
const L=[
{img:'scene-01.webp',n:'Encuentra el teléfono oculto',coin:P(1360,60),win:'¡Estaba debajo de los libros!',h:['Mira donde algo pesado tapa algo pequeño.'],
 hot:[T(R(440,590,720,720),'Shhh… el gato duerme 😴'),T(R(730,570,915,695),'Solo un cojín con un gato.'),T(R(1180,385,1525,590),'La tele está apagada.'),T(R(1000,380,1150,600),'Nada bajo la lámpara.'),T(R(800,735,905,825),'Una taza vacía.'),T(R(925,620,1100,760),'Solo tierra y hojas.'),{r:R(1060,750,1225,815),k:'found',svg:PHONE,at:P(1140,770),w:4}]},
{img:'scene-02.webp',n:'Encuentra la llave',coin:P(1338,58),lock:P(1378,525),lockMsg:'Arrastra la llave hasta la cerradura.',win:'¡Puerta abierta con la llave del bolsillo!',h:['Revisa la ropa colgada.','Arrastra la llave a la cerradura.'],
 hot:[T(R(435,610,690,720),'El gato no la tiene.'),T(R(1500,478,1660,620),'El pez te mira… sin pistas.'),T(R(1485,175,1655,440),'Un cuadro bonito. Nada más.'),T(R(870,600,1100,830),'Solo una planta.'),T(R(740,240,935,490),'Un póster de videojuegos.'),{r:R(1175,150,1440,820),k:'door'},{r:R(945,310,1085,540),k:'keysrc',at:P(1015,540)}]},
{img:'scene-03.webp',n:'Encuentra el código del cofre',coin:P(1320,62),win:'¡Cofre abierto! Brújula + calendario = 259.',h:[],
 hot:[T(R(835,600,975,830),'La linterna alumbra, nada más.'),T(R(1045,775,1265,865),'Un libro de coronas… sin código.'),T(R(1390,140,1520,290),'Un gatito de peluche.'),{r:R(580,815,945,905),k:'map'},{r:R(1470,360,1640,530),k:'cal'},{r:R(1110,500,1195,620),k:'lock'}]},
{img:'scene-04.webp',n:'Encuentra el teléfono escondido',coin:P(1328,62),win:'¡Estaba bajo el cojín rosa!',h:['Algo suave puede tapar algo plano.'],
 hot:[T(R(520,580,780,700),'El gato duerme… no lo molestes.'),T(R(1160,615,1230,815),'Una botella rosa. Solo agua.'),T(R(735,800,985,880),'Un libro con coronas.'),T(R(1195,380,1485,570),'El monitor está apagado.'),T(R(1460,480,1580,600),'Unos audífonos.'),T(R(945,315,1015,425),'Un peluche con moño.'),T(R(1000,730,1120,830),'Una maceta gatito. Solo planta.'),{r:R(775,575,975,700),k:'found',svg:PHONE,at:P(880,650),w:4}]},
{img:'scene-05.webp',n:'Abre el cofre del campamento',coin:P(1327,60),lock:P(1273,555),lockMsg:'Arrastra la llave hasta el candado.',win:'¡Candado abierto! La llave estaba en la mochila.',h:['Las mochilas guardan cosas.','Arrastra la llave al candado del cofre.'],
 hot:[T(R(520,520,820,665),'El gatito duerme feliz.'),T(R(565,730,680,830),'Una taza de montaña, vacía.'),T(R(672,795,838,860),'Una linterna. No abre candados.'),T(R(1035,520,1115,670),'Una lámpara roja encendida.'),T(R(1275,765,1385,870),'Un saco de dormir enrollado.'),T(R(1040,120,1500,430),'La cabaña está muy lejos.'),{r:R(1235,500,1315,610),k:'door'},{r:R(1385,650,1640,800),k:'keysrc',at:P(1470,730)}]},
{img:'scene-06.webp',n:'Encuentra el sombrero del parque',coin:P(1327,60),win:'¡El sombrero estaba en la casita de pájaros!',h:['Los pájaros tienen casa en el árbol.'],
 hot:[T(R(490,270,835,600),'La fuente: solo agua.'),T(R(915,505,1070,760),'Un patineta. Sin sombrero.'),T(R(795,665,890,750),'Un balón de fútbol.'),T(R(1125,550,1260,775),'Basura reciclable. Nada de sombreros.'),T(R(1265,615,1405,750),'Una mochila roja.'),T(R(1410,665,1595,760),'El gato duerme en la banca.'),T(R(585,730,720,895),'Un café. No es sombrero.'),T(R(885,845,1040,905),'Unas gafas de sol.'),T(R(710,860,880,920),'Un celular, no un sombrero.'),T(R(1040,100,1600,560),'La glorieta está vacía.'),{r:R(90,130,205,255),k:'found',svg:HAT,at:P(150,215),w:5}]},
{img:'scene-07.webp',n:'Encuentra el objeto escondido',coin:P(1322,60),win:'¡El patito de goma! Estaba en el estante.',h:['Mira el estante alto de la derecha.'],
 hot:[T(R(545,580,830,670),'Un panda dormilón.'),T(R(990,805,1190,905),'Una consola. Nada escondido.'),T(R(1170,760,1255,840),'Un cubo de Rubik.'),T(R(735,800,968,895),'Unos libros.'),T(R(1100,400,1395,590),'El monitor brilla, nada más.'),T(R(1410,515,1480,650),'Un termo.'),T(R(1505,430,1650,650),'La torre del PC.'),T(R(400,140,490,250),'Un muñequito con sombrero.'),T(R(895,275,1015,505),'Un póster de GAME ON.'),{r:R(1480,215,1590,335),k:'found',svg:null}]},
{img:'scene-08.webp',n:'Encuentra a tu amigo en el bosque',coin:P(1328,62),win:'¡Tu amigo se escondía tras los arbustos!',h:['Busca un sombrero de paja entre las plantas.'],
 hot:[T(R(1305,655,1590,775),'Un lobito blanco durmiendo.'),T(R(1260,560,1460,760),'Un barril de madera.'),T(R(975,720,1190,810),'Un baúl cerrado.'),T(R(450,515,590,655),'Una mochila de campamento.'),T(R(420,300,880,640),'La carpa está vacía.'),T(R(1440,210,1515,360),'Una linterna colgada.'),T(R(1420,395,1640,500),'Un letrero de montaña.'),T(R(1170,860,1265,941),'Una pokébola.'),T(R(640,560,960,780),'La fogata. Nadie.'),{r:R(1240,455,1375,525),k:'found',svg:null}]}];
let cur=0,done=false,flags={},sayT,toastT;
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}
function say(m){const s=$('say');s.textContent=m;s.classList.add('on');clearTimeout(sayT);sayT=setTimeout(()=>s.classList.remove('on'),2600)}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id))}
function coins(){['coinsHome','coinsLevels'].forEach(i=>$(i).textContent=state.coins);$('coinNum').textContent=state.coins}
const css=r=>`left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%`;
function card(h){const c=$('card');c.innerHTML=h;c.classList.add('on');c.onclick=e=>{if(e.target===c)c.classList.remove('on')}}
function start(i){cur=i;done=false;flags={};const l=L[i];show('game');$('bg').src=l.img;$('card').classList.remove('on');$('say').classList.remove('on');
 const c=$('coinNum');c.style.left=l.coin[0]+'%';c.style.top=l.coin[1]+'%';coins();
 const h=$('hots');h.innerHTML='';l.hot.forEach((o,k)=>{const b=document.createElement('button');b.className='hot';b.style.cssText=css(o.r);b.dataset.k=o.k||'';if(o.k==='found'||o.k==='keysrc')b.dataset.g='src';b.onclick=()=>tap(o);h.appendChild(b)})}
function tap(o){if(done)return;const k=o.k,l=L[cur];
 if(!k)return say(o.s);
 if(k==='found'){if(o.svg)reveal(o.svg,o.at,o.w);return finish()}
 if(k==='keysrc'){if(flags.key)return say('Ya sacaste la llave.');flags.key=1;const e=reveal(KEY,o.at,9);drag(e);return say('¡Encontraste una llave! Arrástrala a su lugar.')}
 if(k==='door')return say(flags.key?l.lockMsg:'Está cerrado con llave 🔒');
 if(k==='map'){flags.map=1;return card('<div class="paper">🧭 Brújula del mapa<br>Norte · Centro · Sureste</div><small>Toca para cerrar</small>')}
 if(k==='cal'){flags.cal=1;return card('<div class="grid3">'+[1,2,3,4,5,6,7,8,9].map(n=>'<b>'+n+'</b>').join('')+'</div><small>Toca para cerrar</small>')}
 if(k==='lock')return keypad()}
function reveal(svg,p,w){const e=document.createElement('div');e.className='item';e.style.cssText=`left:${p[0]}%;top:${p[1]}%;width:${w}%`;e.innerHTML=svg;$('hots').appendChild(e);return e}
function drag(e){const st=$('stage');e.onpointerdown=ev=>{e.setPointerCapture(ev.pointerId);e.style.animation='none';e.onpointermove=m=>{const r=st.getBoundingClientRect();e.style.left=(m.clientX-r.left)/r.width*100+'%';e.style.top=(m.clientY-r.top)/r.height*100+'%'};
 e.onpointerup=u=>{e.onpointermove=e.onpointerup=null;const r=st.getBoundingClientRect(),x=(u.clientX-r.left)/r.width*100,y=(u.clientY-r.top)/r.height*100,t=L[cur].lock;
 if(Math.hypot(x-t[0],(y-t[1])*.5625)<7){e.style.left=t[0]+'%';e.style.top=t[1]+'%';finish()}else{say('Ahí no. ¿Dónde va una llave?');e.style.animation=''}}}}
function keypad(){let v='';const draw=()=>{$('dsp').textContent=v.padEnd(3,'·')};
 card('<div class="disp" id="dsp">···</div><div class="grid3">'+[1,2,3,4,5,6,7,8,9].map(n=>'<button data-n="'+n+'">'+n+'</button>').join('')+'</div>');
 $('card').querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();if(v.length<3)v+=b.dataset.n;draw();if(v.length===3){if(v==='259'){$('card').classList.remove('on');finish()}else{$('dsp').classList.add('shake');v='';setTimeout(()=>{draw();$('dsp').classList.remove('shake')},350);say('Código incorrecto. Busca la brújula.')}}})}
function finish(){if(done)return;done=true;const f=!state.done.includes(cur);if(f){state.done.push(cur);state.coins+=10}save();coins();$('winReward').textContent=f?'+10 focos':'Misión completada';$('winText').textContent=L[cur].win;setTimeout(()=>$('winModal').classList.add('show'),600)}
function hint(){if(done)return;if(state.coins<25)return toast('Necesitas 25 focos');state.coins-=25;save();coins();const l=L[cur];let t,m;
 if(cur===2){t=!flags.map?'map':!flags.cal?'cal':'lock';m=!flags.map?'Empieza por el mapa de la mesa.':!flags.cal?'Los números están en la pared.':'Ahora el candado del cofre.'}
 else if(l.lock){t=flags.key?'door':'src';m=l.h[flags.key?1:0]}else{t='src';m=l.h[0]}
 document.querySelectorAll('.hot').forEach(b=>b.classList.toggle('glow',t==='src'?b.dataset.g==='src':b.dataset.k===t));say(m)}
async function ad(kind){try{if(!window.pgAds)return toast('Anuncios no disponibles');const a=await window.pgAds.requestOutOfPageAd(kind);const go=()=>a.show();a.state==='ready'?go():a.addEventListener('ready',go);if(kind==='rewarded')a.addEventListener('rewarded',()=>{state.coins+=25;save();coins();toast('¡+25 focos!')})}catch(e){toast('No hay anuncios disponibles')}}
window.pgAdsCallbacks=window.pgAdsCallbacks||[];window.pgAdsCallbacks.push(async()=>{try{await window.pgAds.init()}catch(e){}});
function map(){const g=$('levelGrid');g.innerHTML='';L.forEach((l,i)=>{const b=document.createElement('button');b.className='level'+(state.done.includes(i)?' done':'');b.style.backgroundImage='url('+l.img+')';b.innerHTML='<span>'+(i+1)+'. '+l.n+'</span>';b.onclick=()=>go(i);g.appendChild(b)});$('mapCount').textContent=state.done.length+' de '+L.length+' completadas';coins()}
function go(i){try{document.documentElement.requestFullscreen?.()}catch(e){}start(i)}

let ac,mg,mt,nx=0,stp=0;const CH=[[220,261.6,329.6,440],[174.6,220,261.6,349.2],[261.6,329.6,392,523.3],[196,246.9,293.7,392]],PT=[0,1,2,3,2,1,2,1];
function tone(f,t,d,ty,v){const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}
function sched(){while(nx<ac.currentTime+.3){const c=CH[(stp>>3)%4],i=stp%8;tone(c[PT[i]]*(i%4==3?2:1),nx,.5,'triangle',.35);if(i===0){tone(c[0]/2,nx,2.4,'sine',.6);tone(c[2],nx,2.4,'sine',.15)}nx+=.34;stp++}}
function music(){if(state.music===false){if(mt){clearInterval(mt);mt=0}if(ac)ac.suspend();return}
 try{if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=.12;mg.connect(ac.destination)}ac.resume();if(!mt){nx=ac.currentTime+.1;mt=setInterval(sched,100)}}catch(e){}}
function mlabel(){const t=state.music===false?'🔇 Música: no':'🎵 Música: sí';$('musicBtn').textContent=t;$('musicBtn2').textContent=t}
function toggleMusic(){state.music=state.music===false;save();mlabel();music()}
$('musicBtn').onclick=$('musicBtn2').onclick=toggleMusic;document.addEventListener('visibilitychange',()=>{if(document.hidden){if(ac)ac.suspend()}else music()});
document.addEventListener('pointerdown',music,{once:true});mlabel();
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
