'use strict';
// ====== CORE: utils, rng, state, save, audio, haptics, bus ======
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const rnd=Math.random;
const ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const pick=a=>a[Math.floor(rnd()*a.length)];
const chance=p=>rnd()<p;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function wpick(list,wf){let t=0;for(const x of list)t+=wf(x);let r=rnd()*t;for(const x of list){r-=wf(x);if(r<=0)return x}return list[list.length-1]}
const fmt=n=>Math.floor(n).toLocaleString('ru-RU');
const todayKey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleepMs=ms=>new Promise(r=>setTimeout(r,ms));
const RAR=['Обычный','Необычный','Редкий','Эпический','Легендарный','Мифический'];
const RCOL=['#b9b4a8','#5fd068','#4aa3ff','#b266ff','#ffb733','#ff4d6d'];
const QN=['Обычное','Хорошее','Превосходное','Шедевр','Легендарное'];
const QMULT=[1,1.6,2.8,5,12];
const QSTAR=['','★','★★','★★★','✦'];

const Bus={h:{},on(e,f){(this.h[e]=this.h[e]||[]).push(f)},emit(e,d){(this.h[e]||[]).forEach(f=>{try{f(d)}catch(err){console.error(err)}})}};

let S=null;
function newState(name){return{
  v:1,ts:0,created:Date.now(),name:name||'Рейн',day:1,energy:30,maxEnergy:30,gold:40,xp:0,level:1,tp:0,
  talents:{},inv:{},plots:[null,null,null,null],plotMax:4,
  recipes:[],books:[],relics:[],equip:[],relicSlots:2,
  flags:{},quests:{},hearts:{liora:0,aira:0,seylin:0,velena:0},hev:{},
  giftDay:{},talkDay:{},cards:{},deck:[],chests:{},
  market:{p:{},prev:{},sold:{},ev:null,stock:[],wander:null},
  wheel:{last:'',tokens:0,streak:0,lastStreakDay:''},pity:{leg:0,rolls:0},
  stats:{brewed:0,sold:0,earned:0,chests:0,legend:0,cardW:0,cardL:0,explore:0,harvest:0,boom:0,mut:0,fights:0,crit:0,mastery:0,spent:0},
  ach:{},orders:[],ordersDay:0,cauldron:1,buffs:{},weather:'ясно',cat:null,seen:{},wishDay:-99,mortarDay:0,
  settings:{sound:true,fastText:false},bgDay:0
}}

// ---------- inventory ----------
// elixirs: key "id#q"; ingredients/seeds/keys: id
function invAdd(k,n=1){S.inv[k]=(S.inv[k]||0)+n;if(S.inv[k]<=0)delete S.inv[k]}
function invHas(k,n=1){return (S.inv[k]||0)>=n}
function invCount(k){return S.inv[k]||0}
function elixCount(id,minQ=0){let c=0;for(let q=minQ;q<=4;q++)c+=S.inv[id+'#'+q]||0;return c}
function elixTake(id,n,minQ=0){ // take lowest qualities first that satisfy minQ
  for(let q=minQ;q<=4&&n>0;q++){const k=id+'#'+q;const h=S.inv[k]||0;const t=Math.min(h,n);if(t){invAdd(k,-t);n-=t}}return n===0}
function bestElix(id){for(let q=4;q>=0;q--)if(S.inv[id+'#'+q])return q;return -1}

// ---------- save ----------
const SAVE_KEY='pm_save_v1';
const Save={cloud:null,busy:false,dirty:null,
  readLocal(){let a=null,b=null;try{a=JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch(e){}try{if(window.__NATIVE_SAVE_B64)b=JSON.parse(decodeURIComponent(escape(atob(window.__NATIVE_SAVE_B64))))}catch(e){}if(a&&b)return (b.ts||0)>(a.ts||0)?b:a;return a||b},
  native(j){try{window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.save&&window.webkit.messageHandlers.save.postMessage(j)}catch(e){}},
  wipe(){try{localStorage.removeItem(SAVE_KEY)}catch(e){}window.__NATIVE_SAVE_B64=null;this.native('')},
  write(){if(!S)return;S.ts=Date.now();const j=JSON.stringify(S);try{localStorage.setItem(SAVE_KEY,j)}catch(e){}this.native(j);this.dirty=j;this.flush()},
  async flush(){if(!this.cloud||this.busy||!this.dirty)return;this.busy=true;await sleepMs(2000);const body=this.dirty;this.dirty=null;
    try{await this.cloud.set({j:body,ts:S.ts})}catch(e){}this.busy=false;if(this.dirty)this.flush()},
  async initCloud(){try{if(!(window.claude&&typeof window.claude.use==='function'))return null;
      const db=await window.claude.use('db');const user=await window.claude.use('user');if(!db||!user)return null;
      const id=await user.id();if(!id)return null;this.cloud=db.doc('data/users/'+id+'/save');
      const snap=await this.cloud.get();if(snap&&snap.exists){const d=snap.data();if(d&&d.j)return {st:JSON.parse(d.j),ts:d.ts||0}}
    }catch(e){}return null},
  exportCode(){return btoa(unescape(encodeURIComponent(JSON.stringify(S))))},
  importCode(c){const st=JSON.parse(decodeURIComponent(escape(atob(c.trim()))));if(!st||!st.v||!st.inv)throw new Error('bad');return st}
};
function migrate(st){const base=newState(st.name);for(const k in base)if(st[k]===undefined)st[k]=base[k];
  for(const k in base.stats)if(st.stats[k]===undefined)st.stats[k]=0;for(const k in base.hearts)if(st.hearts[k]===undefined)st.hearts[k]=0;return st}

// ---------- audio ----------
let AC=null;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,d,type='sine',v=.15,when=0,slide=0){const a=ac();if(!a)return;const t=a.currentTime+when;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.05)}
function noise(d,v=.2,when=0,hp=800){const a=ac();if(!a)return;const t=a.currentTime+when;const b=a.createBuffer(1,a.sampleRate*d,a.sampleRate);const ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=(Math.random()*2-1)*(1-i/ch.length);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=a.createGain();g.gain.value=v;s.connect(f).connect(g).connect(a.destination);s.start(t)}
function sfx(n){if(!S||!S.settings.sound)return;try{switch(n){
  case'click':tone(660,.06,'triangle',.06);break;
  case'coin':tone(1320,.08,'square',.05);tone(1760,.15,'square',.05,.06);break;
  case'brew':noise(.6,.08,0,300);tone(220,.4,'sine',.06,0,1.5);break;
  case'good':[523,659,784].forEach((f,i)=>tone(f,.25,'triangle',.08,i*.07));break;
  case'rare':[523,659,784,1047].forEach((f,i)=>tone(f,.35,'triangle',.09,i*.08));break;
  case'legend':[392,523,659,784,1047,1319].forEach((f,i)=>tone(f,.6,'triangle',.1,i*.09));tone(196,1.4,'sawtooth',.04,0);break;
  case'fail':tone(200,.5,'sawtooth',.08,0,.4);noise(.5,.15,0,200);break;
  case'boom':noise(1,.35,0,60);tone(80,.8,'sine',.2,0,.3);break;
  case'level':[392,494,587,784].forEach((f,i)=>tone(f,.3,'square',.05,i*.1));tone(784,.8,'triangle',.08,.4);break;
  case'tick':tone(1400,.03,'square',.03);break;
  case'chest':tone(150,.2,'square',.06);noise(.2,.1,0,1500);break;
  case'shine':tone(1800+Math.random()*800,.2,'sine',.04);break;
  case'card':noise(.08,.1,0,2500);break;
  case'hit':noise(.15,.25,0,400);tone(120,.15,'square',.08,0,.5);break;
  case'heal':tone(523,.3,'sine',.07,0,1.5);break;
  case'heart':tone(880,.15,'sine',.06);tone(1175,.25,'sine',.06,.1);break;
  case'page':noise(.25,.06,0,3000);break;
}}catch(e){}}
function hap(t='light'){try{window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.haptic&&window.webkit.messageHandlers.haptic.postMessage(t)}catch(e){}}

// ---------- toasts ----------
function toast(m,c=''){const t=document.createElement('div');t.className='toast '+c;t.innerHTML=m;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),2800)}

// ---------- modal stack ----------
const OV={stack:[],
  open(html,{cls='',center=false,onClose=null,full=false,noClose=false}={}){const m=document.createElement('div');
    if(full){m.className='full '+cls;m.innerHTML=html}else{m.className='modal '+(center?'center ':'')+cls;m.innerHTML=`<div class="sheet">${noClose?'':'<button class="x" data-x>✕</button>'}${html}</div>`;
      m.addEventListener('click',e=>{if(e.target===m&&!noClose)this.close(m)})}
    m._onClose=onClose;$('#ov').appendChild(m);this.stack.push(m);m.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sfx('click');this.close(m)});return m},
  close(m){m=m||this.stack[this.stack.length-1];if(!m)return;const i=this.stack.indexOf(m);if(i>=0)this.stack.splice(i,1);m.remove();if(m._onClose)m._onClose()},
  closeAll(){while(this.stack.length)this.close()},
  top(){return this.stack[this.stack.length-1]}
};
function confirmBox(text,yes='Да',no='Отмена'){return new Promise(res=>{const m=OV.open(`<div style="padding:6px 2px 4px"><div class="serif" style="font-size:16px;margin:4px 0 14px">${text}</div><div class="row"><button class="btn sec grow" data-n>${no}</button><button class="btn grow" data-y>${yes}</button></div></div>`,{center:true,onClose:()=>res(false)});
  m.querySelector('[data-y]').onclick=()=>{m._onClose=null;OV.close(m);res(true)};m.querySelector('[data-n]').onclick=()=>{OV.close(m)}})}

// ---------- ember particles ----------
const FX={on:true,init(){const c=$('#fx');const x=c.getContext('2d');let W,H,P=[];const rs=()=>{W=c.width=innerWidth*devicePixelRatio;H=c.height=innerHeight*devicePixelRatio};rs();addEventListener('resize',rs);
  for(let i=0;i<26;i++)P.push(this.mk(W,H,true));const loop=()=>{if(!document.hidden&&this.on){x.clearRect(0,0,W,H);for(const p of P){p.y-=p.v;p.x+=Math.sin(p.y/60+p.s)*.4;p.a-=.0015;if(p.y<-10||p.a<=0)Object.assign(p,this.mk(W,H));x.globalAlpha=Math.max(0,p.a);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}}requestAnimationFrame(loop)};loop()},
  mk(W,H,init){return{x:Math.random()*W,y:init?Math.random()*H:H+10,r:(Math.random()*1.6+.6)*devicePixelRatio,v:(Math.random()*.5+.2)*devicePixelRatio,a:Math.random()*.5+.2,s:Math.random()*6,c:Math.random()<.7?'#ff8a3d':'#ffd27a'}}};

// burst particles at element (DOM)
function burst(x,y,col='#ffd27a',n=24){for(let i=0;i<n;i++){const d=document.createElement('div');const a=Math.random()*Math.PI*2,s=60+Math.random()*120;
  d.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:6px;height:6px;border-radius:50%;background:${col};box-shadow:0 0 8px ${col};z-index:95;pointer-events:none;transition:transform .9s cubic-bezier(.1,.8,.3,1),opacity .9s`;
  document.body.appendChild(d);requestAnimationFrame(()=>{d.style.transform=`translate(${Math.cos(a)*s}px,${Math.sin(a)*s}px) scale(.3)`;d.style.opacity='0'});setTimeout(()=>d.remove(),950)}}
