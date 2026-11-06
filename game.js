(()=>{'use strict';
const $=id=>document.getElementById(id),SAVE='cerebroLocoSave_v4',VER='16';
try{Object.keys(localStorage).forEach(k=>{if(/^cerebroloco/i.test(k)&&k!==SAVE)localStorage.removeItem(k)})}catch(e){}
let state={coins:150,done:[],hints:[],name:'',age:0};try{state={...state,...JSON.parse(localStorage.getItem(SAVE)||'{}')}}catch(e){}
const save=()=>{try{localStorage.setItem(SAVE,JSON.stringify(state))}catch(e){}};
const I={play:'<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z" fill="#fff"/></svg>',re:'<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.5-5.8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M20 3v6h-6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
skip:'<svg viewBox="0 0 24 24"><rect x="4" y="3" width="11" height="18" rx="2" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M12 12h9m-3-3l3 3-3 3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
pin:'<svg viewBox="0 0 24 24"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="12" cy="10" r="2.6" fill="#fff"/></svg>',
star:'<svg class="wst" viewBox="0 0 64 64"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe45c"/><stop offset="1" stop-color="#ff9a1a"/></linearGradient></defs><path d="M32 4l8.5 18 19.5 2.5-14.5 13.5 4 19.5L32 48 14.500 57.500l4-19.500L4 24.500 23.500 22z" fill="url(#sg)" stroke="#a24b00" stroke-width="3" stroke-linejoin="round"/></svg>',
back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
ok:'<svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7" fill="none" stroke="#fff" stroke-width="3.500" stroke-linecap="round" stroke-linejoin="round"/></svg>',
clip:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="18" rx="3" fill="#efe6ff"/><rect x="8" y="2" width="8" height="5" rx="2" fill="#b98cff" stroke="#efe6ff" stroke-width="1.500"/><path d="M8 14l3 3 5-6" fill="none" stroke="#5a2fc0" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
const S={"pm": ["#8121fb", "#590ed9"], "wt": ["#3a2286", "#381f83"], "cn": ["#170e3e", "#180d40"], "ct": ["#1f1237", "#190f34"], "ck": [["#22174e", "#130d3d"], ["#201849", "#140e3d"], ["#25194f", "#140e3e"], ["#20184c", "#140e3f"], ["#21174c", "#140e3e"], ["#23194e", "#140e3e"], ["#23184f", "#140e3d"], ["#21164d", "#140e3e"]]};
const pc=b=>{const w=b[2]-b[0],h=b[3]-b[1];return r=>`left:${(r[0]-b[0])/w*100}%;top:${(r[1]-b[1])/h*100}%;width:${(r[2]-r[0])/w*100}%;height:${(r[3]-r[1])/h*100}%`};
const hb=(id,st)=>`<button class="hb" id="${id}" style="${st}"></button>`,gr=c=>`background:linear-gradient(${c[0]},${c[1]})`;
const pp=pc([500,105,1172,850]),wp=pc([495,122,1177,820]);
const PAUSE=`<div class="modal" id="pauseModal"><div class="ac" style="aspect-ratio:672/745;background-image:url(ui-pause.webp)">${hb('resumeBtn',pp([548,232,1125,335]))}${hb('retryBtn',pp([548,355,1125,462]))}${hb('musicBtn2',pp([548,480,1125,578]))}<i class="pt" id="muT" style="${pp([740,503,1105,560])};${gr(S.pm)}"></i>${hb('skipBtn',pp([548,595,1125,692]))}${hb('exitBtn',pp([548,708,1125,806]))}</div></div>`;
const WIN=`<div class="modal" id="winModal"><div class="ac" style="aspect-ratio:682/698;background-image:url(ui-win.webp)">${hb('nextBtn',wp([537,543,1135,648]))}${hb('mapBtn',wp([537,668,1137,778]))}<i class="pt" id="winText" style="${wp([560,472,1115,520])};${gr(S.wt)}"></i><span id="winReward" hidden></span></div></div>`;
const MODALS=`
${PAUSE}${WIN}
<div class="modal" id="coinsModal"><div class="nf"><button class="nfx" id="coinsX" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/></svg></button><svg class="nfb1" viewBox="0 0 64 64"><path d="M32 4a18 18 0 0 0-10 33v8h20v-8A18 18 0 0 0 32 4z" fill="#ffd23c" stroke="#d98a00" stroke-width="2.5"/><rect x="23" y="47" width="18" height="7" rx="2" fill="#bfe3ff" stroke="#3b7bd8" stroke-width="2"/><path d="M52 8l5-4M56 18l6-1M10 8L5 4" stroke="#ffd23c" stroke-width="3.5" stroke-linecap="round"/></svg><div class="nft">¡Sin focos!</div><p>Mira un anuncio para obtener <b>25</b> focos</p><div class="nfr"><button class="nb1" id="coinsClose">Cerrar</button><button class="nb2" id="coinsAd">${I.play}Ver Anuncio</button></div></div></div>
<div class="modal" id="setModal"><div class="pm"><div class="pmt">Ajustes</div><button class="pb b-purple" id="musicBtn"></button><button class="pb b-purple" id="renameBtn">Cambiar nombre</button><button class="pb b-blue" id="setClose">Cerrar</button><div class="ver">Creado por Nadie · v${VER}</div></div></div>
<div class="modal" id="statModal"><div class="pm"><div class="pmt">Tu progreso</div><div class="wd" id="statText"></div><button class="pb b-blue" id="statClose">Cerrar</button></div></div>
<div class="modal" id="introModal"><div class="pm im"><div class="pmt">¡Bienvenido a Cerebro Loco!</div><div class="by">Creado por <b>Nadie</b></div><p>Un juego de acertijos y objetos escondidos. Entra a cada escena, toca lo que parezca sospechoso y descubre cómo salir.</p><div class="ir"><b>8 misiones</b><span>Teléfonos, llaves, cofres y hasta amigos escondidos.</span></div><div class="ir"><b>Pistas con focos</b><span>Una pista cuesta 25 focos. Si se acaban, mira un anuncio y gana más.</span></div><div class="ir"><b>Piensa distinto</b><span>Nada es lo que parece. Toca, arrastra y prueba.</span></div><button class="pb b-blue" id="introGo">¡A jugar!</button></div></div>`;
['pauseModal','winModal','coinsModal','setModal','statModal','introModal'].forEach(i=>{const o=document.getElementById(i);if(o)o.remove()});
document.body.insertAdjacentHTML('beforeend',MODALS);

const R=(a,b,c,d)=>[a/16.72,b/9.41,(c-a)/16.72,(d-b)/9.41],P=(x,y)=>[x/16.72,y/9.41];
const KEY='<svg viewBox="0 0 80 40"><g fill="none" stroke="#ffd66f" stroke-width="7" stroke-linecap="round"><circle cx="14" cy="20" r="10"/><path d="M24 20h46M58 20v10M68 20v8"/></g></svg>';
const PHONE='<svg viewBox="0 0 40 70"><rect x="3" y="3" width="34" height="64" rx="7" fill="#263943" stroke="#9fe3ff" stroke-width="3"/><rect x="8" y="10" width="24" height="46" rx="3" fill="#a8e4e4"/><circle cx="20" cy="62" r="2.5" fill="#9fe3ff"/></svg>';
const HAT='<svg viewBox="0 0 80 50"><ellipse cx="40" cy="38" rx="38" ry="9" fill="#e8c36a"/><path d="M16 36q2-26 24-26t24 26z" fill="#f2d17c"/><rect x="16" y="29" width="48" height="7" fill="#d93b3b"/></svg>',DUCK='<svg viewBox="0 0 60 60"><ellipse cx="28" cy="40" rx="22" ry="14" fill="#ffd23c"/><circle cx="38" cy="20" r="12" fill="#ffd23c"/><path d="M46 20l12 3-12 4z" fill="#ff8a2a"/><circle cx="41" cy="17" r="2" fill="#222"/></svg>';
const T=(r,s)=>({r,s});
const L=[
{img:'scene-01.webp',n:'Encuentra el teléfono oculto',coin:P(1360,60),win:'¡Estaba debajo de los libros!',h:['Mira donde algo pesado tapa algo pequeño.'],
 hot:[T(R(440,590,720,720),'Shhh… el gato duerme'),T(R(730,570,915,695),'Solo un cojín con un gato.'),T(R(1180,385,1525,590),'La tele está apagada.'),T(R(1000,380,1150,600),'Nada bajo la lámpara.'),T(R(800,735,905,825),'Una taza vacía.'),T(R(925,620,1100,760),'Solo tierra y hojas.'),{r:R(1060,750,1225,815),k:'found',svg:PHONE,at:P(1140,770),w:4}]},
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
L.forEach((l,i)=>l.cc=[["#001854", "#011858"], ["#001552", "#001555"], ["#001557", "#001557"], ["#001458", "#001557"], ["#011c63", "#001a61"], ["#011d6f", "#012074"], ["#001a65", "#001866"], ["#001d6a", "#001c6e"]][i]);
let cur=0,done=false,flags={},sayT,toastT;
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}
function say(m){const s=$('say');s.textContent=m;s.classList.add('on');clearTimeout(sayT);sayT=setTimeout(()=>s.classList.remove('on'),2600)}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));if(['home','levels','game'].includes(id)){state.screen=id;save()}}
function coins(){const cl=$('coinsLevels');if(cl)cl.textContent=state.coins;const xf=$('xpFill');if(xf)xf.style.width=state.done.length/L.length*100+'%';$('coinNum').textContent=state.coins}
const css=r=>`left:${r[0]}%;top:${r[1]}%;width:${r[2]}%;height:${r[3]}%`;
function card(h){const c=$('card');c.innerHTML=h;c.classList.add('on');c.onclick=e=>{if(e.target===c)c.classList.remove('on')}}
function start(i){cur=i;state.cur=i;state.fl=null;done=false;flags={};const l=L[i];show('game');$('bg').src=l.img;$('card').classList.remove('on');$('say').classList.remove('on');
 const c=$('coinNum');c.style.background='linear-gradient('+l.cc[0]+','+l.cc[1]+')';c.style.left=l.coin[0]+'%';c.style.top=l.coin[1]+'%';coins();
 const h=$('hots');h.innerHTML='';l.hot.forEach((o,k)=>{const b=document.createElement('button');b.className='hot';b.style.cssText=css(o.r);b.dataset.k=o.k||'';if(o.k==='found'||o.k==='keysrc')b.dataset.g='src';b.onclick=()=>tap(o);h.appendChild(b)})}
function tap(o){if(done)return;setTimeout(()=>{state.fl={c:cur,f:flags};save()},0);const k=o.k,l=L[cur];
 if(!k)return say(o.s);
 if(k==='found'){if(o.svg)reveal(o.svg,o.at,o.w);return finish()}
 if(k==='keysrc'){if(flags.key)return say('Ya sacaste la llave.');flags.key=1;const e=reveal(KEY,o.at,9);drag(e);return say('¡Encontraste una llave! Arrástrala a su lugar.')}
 if(k==='door')return say(flags.key?l.lockMsg:'Está cerrado con llave');
 if(k==='map'){flags.map=1;return card('<div class="paper">Brújula del mapa<br>Norte · Centro · Sureste</div><small>Toca para cerrar</small>')}
 if(k==='cal'){flags.cal=1;return card('<div class="grid3">'+[1,2,3,4,5,6,7,8,9].map(n=>'<b>'+n+'</b>').join('')+'</div><small>Toca para cerrar</small>')}
 if(k==='lock')return keypad()}
function reveal(svg,p,w){const e=document.createElement('div');e.className='item';e.style.cssText=`left:${p[0]}%;top:${p[1]}%;width:${w}%`;e.innerHTML=svg;$('hots').appendChild(e);return e}
function drag(e){const st=$('stage');let on=0,lx=0,ly=0;
 const mv=ev=>{const r=st.getBoundingClientRect();lx=(ev.clientX-r.left)/r.width*100;ly=(ev.clientY-r.top)/r.height*100;e.style.left=lx+'%';e.style.top=ly+'%'};
 e.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();on=1;e.style.animation='none';mv(ev)});
 window.addEventListener('pointermove',ev=>{if(on&&e.isConnected){ev.preventDefault();mv(ev)}},{passive:false});
 const up=()=>{if(!on||!e.isConnected)return;on=0;const t=L[cur].lock;
  if(Math.hypot(lx-t[0],(ly-t[1])*.5625)<9){e.style.left=t[0]+'%';e.style.top=t[1]+'%';finish()}else{say('Ahí no. ¿Dónde va una llave?');e.style.animation=''}};
 window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)}
function keypad(){let v='';const draw=()=>{$('dsp').textContent=v.padEnd(3,'·')};
 card('<div class="disp" id="dsp">···</div><div class="grid3">'+[1,2,3,4,5,6,7,8,9].map(n=>'<button data-n="'+n+'">'+n+'</button>').join('')+'</div>');
 $('card').querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();if(v.length<3)v+=b.dataset.n;draw();if(v.length===3){if(v==='259'){$('card').classList.remove('on');finish()}else{$('dsp').classList.add('shake');v='';setTimeout(()=>{draw();$('dsp').classList.remove('shake')},350);say('Código incorrecto. Busca la brújula.')}}})}
function finish(){if(done)return;done=true;state.screen='levels';const f=!state.done.includes(cur);if(f){state.done.push(cur);state.coins+=10}save();coins();$('winReward').textContent=f?'+10 focos':'Misión completada';$('winText').textContent=L[cur].win;setTimeout(()=>{$('winModal').classList.add('show');if(f)toast('+10 focos')},600)}
function hint(){if(done)return;if(state.coins<25)return noCoins();state.coins-=25;save();coins();const l=L[cur];let t,m;
 if(cur===2){t=!flags.map?'map':!flags.cal?'cal':'lock';m=!flags.map?'Empieza por el mapa de la mesa.':!flags.cal?'Los números están en la pared.':'Ahora el candado del cofre.'}
 else if(l.lock){t=flags.key?'door':'src';m=l.h[flags.key?1:0]}else{t='src';m=l.h[0]}
 document.querySelectorAll('.hot').forEach(b=>b.classList.toggle('glow',t==='src'?b.dataset.g==='src':b.dataset.k===t));say(m);clearTimeout(window._gt);window._gt=setTimeout(()=>document.querySelectorAll('.glow').forEach(b=>b.classList.remove('glow')),9000)}
let lastAd=0;
function vignette(){try{const e=document.createElement('script');e.dataset.zone='12200555';e.src='https://n6wxm.com/vignette.min.js';document.body.appendChild(e)}catch(x){}}
function reward(){const t=Date.now();if(t-lastAd<25000)return toast('Espera un momento para otro anuncio');lastAd=t;toast('Cargando anuncio…');vignette();setTimeout(()=>{state.coins+=25;save();coins();toast('+25 focos')},6000)}
async function ad(kind){kind==='interstitial'?vignette():reward()}
function map(){const el=$('levels');el.classList.add('art');const sp=pc([0,0,1672,941]),C=[[753,292],[1558,292],[753,449],[1558,449],[753,611],[1558,611],[753,771],[1558,771]],R=[[65,230,810,357],[863,230,1612,357],[65,388,810,515],[863,388,1612,515],[65,548,810,675],[863,548,1612,675],[65,708,810,835],[863,708,1612,835]];
 let h='<div class="stage"><img src="ui-map.webp" alt="" draggable="false">'+hb('backHome',sp([55,37,238,98]))+`<i class="pt" id="mapCount" style="${sp([775,138,1022,168])};${gr(S.ct)};justify-content:flex-start"></i><i class="pt" id="coinsLevels" style="${sp([1552,46,1612,92])};${gr(S.cn)}"></i>`;
 R.forEach((r,i)=>{if(!state.done.includes(i)){const c=C[i];h+=`<i class="pt ck" style="${sp([c[0]-40,c[1]-40,c[0]+40,c[1]+40])};${gr(S.ck[i])}"></i>`}h+=`<button class="hb lv" data-i="${i}" style="${sp(r)}"></button>`});
 el.innerHTML=h+'</div>';el.querySelectorAll('.lv').forEach(b=>b.onclick=()=>go(+b.dataset.i));$('mapCount').textContent=state.done.length+' de '+L.length+' completadas';$('backHome').onclick=()=>show('home');coins()}
function go(i){fs();start(i)}

let ac,mg,mt,nx=0,stp=0;const CH=[[220,261.6,329.6,440],[174.6,220,261.6,349.2],[261.6,329.6,392,523.3],[196,246.9,293.7,392]],PT=[0,1,2,3,2,1,2,1];
function tone(f,t,d,ty,v){const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}
function sched(){while(nx<ac.currentTime+.3){const c=CH[(stp>>3)%4],i=stp%8;tone(c[PT[i]]*(i%4==3?2:1),nx,.5,'triangle',.35);if(i===0){tone(c[0]/2,nx,2.4,'sine',.6);tone(c[2],nx,2.4,'sine',.15)}nx+=.34;stp++}}
function music(){if(state.music===false){if(mt){clearInterval(mt);mt=0}if(ac)ac.suspend();return}
 try{if(!ac){ac=new (window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=.12;mg.connect(ac.destination)}ac.resume();if(!mt){nx=ac.currentTime+.1;mt=setInterval(sched,100)}}catch(e){}}
function mlabel(){const t=state.music===false?`<svg class="ic" viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="3" fill="currentColor"/><circle cx="17.5" cy="16" r="3" fill="currentColor"/><path d="M3 3l18 18" stroke="#ff7a7a" stroke-width="2.6" stroke-linecap="round"/></svg> Música: no`:`<svg class="ic" viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="3" fill="currentColor"/><circle cx="17.5" cy="16" r="3" fill="currentColor"/></svg> Música: sí`;$('musicBtn').innerHTML=t;$('muT').textContent=state.music===false?'Música: no':'Música: sí'}
function toggleMusic(){state.music=state.music===false;save();mlabel();music()}
$('musicBtn').onclick=$('musicBtn2').onclick=toggleMusic;document.addEventListener('visibilitychange',()=>{if(document.hidden){if(ac)ac.suspend()}else music()});
document.addEventListener('pointerdown',music,{once:true});mlabel();
function fs(){try{const e=document.documentElement;if(document.fullscreenElement||document.webkitFullscreenElement)return;const p=(e.requestFullscreen||e.webkitRequestFullscreen||(()=>0)).call(e,{navigationUI:'hide'});Promise.resolve(p).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).catch(()=>{})}catch(e){}}
document.addEventListener('pointerdown',ev=>{if(!(ev.target.closest&&ev.target.closest('.item')))fs()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&$('game').classList.contains('active')&&!done)$('pauseModal').classList.add('show')});
function noCoins(){$('coinsModal').classList.add('show')}
$('coinsX').onclick=$('coinsClose').onclick=()=>$('coinsModal').classList.remove('show');$('coinsAd').onclick=()=>{$('coinsModal').classList.remove('show');ad('rewarded')};
$('coinsModal').onclick=e=>{if(e.target.id==='coinsModal')$('coinsModal').classList.remove('show')};
let n=0;
$('hintBtn').onclick=hint;$('pauseBtn').onclick=()=>$('pauseModal').classList.add('show');$('giftBtn').onclick=$('focosBtn').onclick=()=>ad('rewarded');
$('resumeBtn').onclick=()=>$('pauseModal').classList.remove('show');$('retryBtn').onclick=()=>{$('pauseModal').classList.remove('show');start(cur)};$('skipBtn').onclick=()=>{if(state.coins<75){$('pauseModal').classList.remove('show');return noCoins()}state.coins-=75;if(!state.done.includes(cur))state.done.push(cur);save();coins();$('pauseModal').classList.remove('show');done=true;$('winReward').textContent='-75 focos';$('winText').textContent='Misión saltada';$('winModal').classList.add('show')};
$('exitBtn').onclick=()=>{$('pauseModal').classList.remove('show');map();show('levels')};
$('nextBtn').onclick=async()=>{$('winModal').classList.remove('show');if(cur<L.length-1){state.n=(state.n||0)+1;if(state.n>=(state.thr||2)){state.n=0;state.thr=[2,2,2,3][Math.floor(Math.random()*4)];vignette()}save();start(cur+1)}else{map();show('levels')}};
$('mapBtn').onclick=()=>{$('winModal').classList.remove('show');map();show('levels')};
const hits=(box,l)=>l.forEach(([id,r,fn])=>{const b=document.createElement('button');b.className='hb';b.id=id;b.style.cssText=css(r);b.onclick=fn;$(box).appendChild(b)});
let age=Number(state.age)||13;const setAge=v=>{age=Math.max(5,Math.min(99,v));$('ageNum').textContent=age};setAge(age);
hits('ageHits',[['ageDown',R(355,365,580,560),()=>setAge(age-1)],['ageUp',R(1090,365,1320,560),()=>setAge(age+1)],['ageGo',R(470,635,1205,835),()=>{state.age=age;save();show('onboarding-name')}]]);
hits('nameHits',[['nameGo',R(470,620,1205,810),()=>{const v=$('inputName').value.trim();if(!v)return toast('Escribe tu nombre');state.name=v;save();show('home');intro()}]]);
function intro(){if(state.intro)return;$('introModal').classList.add('show')}
$('introGo').onclick=()=>{state.intro=1;save();$('introModal').classList.remove('show')};
const stat=()=>{$('statText').textContent=state.done.length+' de '+L.length+' misiones completadas · '+state.coins+' focos';$('statModal').classList.add('show')};
hits('homeHits',[['playBtn',R(1185,205,1620,355),()=>{const i=L.findIndex((_,k)=>!state.done.includes(k));go(i<0?0:i)}],['levelsBtn',R(1215,372,1600,490),()=>{map();show('levels')}],['trophyBtn',R(1240,505,1580,612),stat],['setBtn',R(1255,625,1570,730),()=>$('setModal').classList.add('show')],['quitBtn',R(1265,745,1565,855),()=>{try{window.close()}catch(e){}toast('Puedes cerrar la app desde tu teléfono')}],['homeGift',R(1405,20,1520,130),reward],['crownBtn',R(1540,20,1650,130),stat]]);
$('setClose').onclick=()=>$('setModal').classList.remove('show');$('statClose').onclick=()=>$('statModal').classList.remove('show');
$('renameBtn').onclick=()=>{$('setModal').classList.remove('show');$('inputName').value=state.name||'';show('onboarding-name')};
if(state.name&&state.age){show('home');if(!state.intro)intro()}else if(state.age)show('onboarding-name');
if(state.screen==='game'&&state.name&&L[state.cur]){start(state.cur);if(state.fl&&state.fl.c===state.cur){flags=state.fl.f||{};const o=L[cur].hot.find(x=>x.k==='keysrc');if(flags.key&&o)drag(reveal(KEY,o.at,9))}$('pauseModal').classList.add('show')}else if(state.screen==='levels'&&state.name){map();show('levels')}
L.forEach(l=>{const i=new Image();i.src=l.img});coins();map();
})();
