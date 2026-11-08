// ====== UI ======
const UI={tab:'home',heroTab:'bag',mkTab:'sell',map:'valley',bag:'all'};
const RB=r=>`b${r}`;
function render(){if(!S)return;renderTop();renderTabs();const sc=$('#screen');const y=UI._lastTab===UI.tab?sc.scrollTop:0;
  ({home:scrHome,map:scrMap,market:scrMarket,quests:scrQuests,hero:scrHero})[UI.tab](sc);sc.scrollTop=y;UI._lastTab=UI.tab;
  if(pendingLevelUps.length&&!OV.stack.length)setTimeout(showLevelUp,200)}
function renderTop(){const need=xpNeed(S.level);$('#top').innerHTML=`<div class="toprow"><div class="lvl">${S.level}</div><div class="who"><b>${esc(S.name)}</b><div class="xpbar"><i style="width:${S.xp/need*100}%"></i></div></div>
 <div class="res"><div class="pill">💰 ${fmt(S.gold)}</div><div class="pill" style="${S.energy<4?'color:#ff8a8a':''}">⚡ ${S.energy}/${S.maxEnergy}</div></div></div>
 <div class="daybar"><span>📅 День ${S.day} · ${WEATHER_IC[S.weather]} ${S.weather} · ${MOON_IC[moonPhase()]}${isFull()?' полнолуние':''}</span><span>${S.buffs.luck?'🍀':''}${S.buffs.charm?'💜':''}${S.buffs.night?'🦉':''}${S.buffs.safe?'💪':''} ${S.tp?`<b style="color:var(--gold2)">✦ ${S.tp} талант</b>`:''}</span></div>`}
function badgeCounts(){let home=0;if(wheelFree())home++;if(S.cat)home++;home+=Object.values(S.chests).reduce((a,b)=>a+b,0)>0?1:0;if(S.plots.some(plotReady))home++;
  let q=QUESTS.some(x=>questReady(x.id))?1:0;q+=S.orders.filter(o=>elixCount(o.rid,o.q)>=o.n).length;let hero=S.tp?1:0;for(const g in ROMANCE)if(girlAvail(g)&&nextRomance(g))hero++;return{home,quests:q,hero}}
function renderTabs(){const b=badgeCounts();const T_=[['home','🏠','Усадьба'],['map','🗺️','Карта'],['market','⚖️','Рынок'],['quests','📜','Задания'],['hero','🔥','Герой']];
 $('#tabs').innerHTML=T_.map(([id,ic,n])=>`<button data-tab="${id}" class="${UI.tab===id?'on':''}"><span class="ic">${ic}</span>${n}${b[id]?`<span class="badge">${b[id]}</span>`:''}</button>`).join('');
 $$('#tabs button').forEach(x=>x.onclick=()=>{sfx('click');hap();UI.tab=x.dataset.tab;render()})}
const tileItem=(e,n,c,r,extra='')=>`<div class="tile ${RB(r)}" ${extra}><div class="em">${e}</div><div class="nm r${r}">${n}</div>${c!=null?`<span class="q">×${c}</span>`:''}</div>`;

// ---------- HOME ----------
function scrHome(el){const mq=currentMain();const chestN=Object.values(S.chests).reduce((a,b)=>a+b,0);
 el.innerHTML=`<div class="banner">${homeBanner()}<div class="ov"><div class="serif" style="font-size:19px;text-shadow:0 2px 6px #000">Усадьба алхимика</div><div class="small" style="text-shadow:0 1px 4px #000;color:#f4e6c8">${CAULDRON[S.cauldron].n}${S.cat?' · 🐈 Барсик что-то принёс!':''}</div></div></div>
 ${mq?questCard(mq,true):''}
 <div class="quick"><button class="qb" data-q="brew"><span class="em">⚗️</span><span>Котёл</span></button>
  <button class="qb" data-q="chests"><span class="em">📦</span><span>Сундуки</span>${chestN?`<span class="badge">${chestN}</span>`:''}</button>
  <button class="qb" data-q="wheel"><span class="em">🎡</span><span>Фортуна</span>${wheelFree()?'<span class="badge">!</span>':invHas('token')?`<span class="badge">${invCount('token')}</span>`:''}</button>
  <button class="qb" data-q="cat"><span class="em">🐈</span><span>Барсик</span>${S.cat?'<span class="badge">🎁</span>':''}</button></div>
 <div class="card"><div class="row" style="margin-bottom:8px"><h3 class="t grow" style="margin:0">🌱 Огород</h3><button class="btn sm sec" data-q="water">💧 Полить (1⚡)</button>${S.plots.some(plotReady)?'<button class="btn sm" data-q="harvestall">Собрать всё</button>':''}</div>
  <div class="plots">${S.plots.map((p,i)=>plotHTML(p,i)).join('')}${[...Array(Math.max(0,12-S.plots.length))].map(()=>`<div class="plot lock">🔒</div>`).join('').slice(0,0)}</div>
  <div class="mut" style="margin-top:6px">Полей грядки — без воды ничего не растёт. Дождь поливает сам. Иногда урожай мутирует ✨</div></div>
 ${S.flags.relicHint?'':''}
 <button class="btn wide" data-q="sleep" style="margin-top:6px;padding:14px">🌙 Лечь спать — новый день</button>`;
 $$('[data-q]',el).forEach(b=>b.onclick=()=>{sfx('click');hap();homeAct(b.dataset.q)});
 $$('[data-plot]',el).forEach(b=>b.onclick=()=>plotTap(+b.dataset.plot));bindQuestCard(el)}
function plotHTML(p,i){if(!p)return `<div class="plot" data-plot="${i}"><span style="font-size:20px;opacity:.5">＋</span></div>`;const c=CROPS[p.s];const ready=plotReady(p);const pr=p.d/c.d;
 const em=ready?c.e:pr<.34?'🌱':pr<.67?'🌿':'🪴';return `<div class="plot ${p.w&&!ready?'wet':''} ${ready?'ready':''}" data-plot="${i}">${em}${p.zap?'<span class="mutf">⚡</span>':''}<span class="st">${ready?'Готово!':`${p.d}/${c.d} дн${p.w?' 💧':''}`}</span></div>`}
function plotTap(i){const p=S.plots[i];if(!p){seedPicker(i);return}if(plotReady(p)){const r=harvest(i);if(!r)return;sfx(r.mut?'rare':'good');hap(r.mut?'success':'light');
  if(r.mut){burst(innerWidth/2,innerHeight/2,'#ffb733',30);toast(`✨ МУТАЦИЯ! ${ITEMS[r.mut].e} ${ITEMS[r.mut].n}`,'leg')}toast(`+${r.n} ${ITEMS[r.prod].e} ${ITEMS[r.prod].n}`);Save.write();render();return}
  if(!p.w){p.w=true;sfx('click');toast('💧 Полито');Save.write();render()}else toast(`${CROPS[p.s].n.replace('Семена ','')}: растёт (${p.d}/${CROPS[p.s].d} дн.)`)}
function seedPicker(i){const seeds=Object.keys(S.inv).filter(k=>CROPS[k]);if(!seeds.length){toast('Нет семян — купи в лавке на рынке','bad');return}
 const m=OV.open(`<h2 class="t">Что посадить?</h2><div class="grid g3">${seeds.map(k=>{const c=CROPS[k];return tileItem(c.e,c.n.replace('Семена ','').replace('Саженец ','').replace('Луковица ',''),invCount(k),ITEMS[k].r,`data-s="${k}"`).replace('</div></div>',`<div class="mut small">${c.d} дн.</div></div></div>`)}).join('')}</div>${seeds.length?`<button class="btn sec wide" style="margin-top:10px" data-all>Засадить все пустые грядки</button>`:''}`);
 $$('[data-s]',m).forEach(b=>b.onclick=()=>{plant(i,b.dataset.s);OV.close(m);Save.write();render()});
 $('[data-all]',m).onclick=()=>{let si=0;S.plots.forEach((p,j)=>{if(p)return;while(si<seeds.length&&!invHas(seeds[si]))si++;if(si<seeds.length)plant(j,seeds[si])});OV.close(m);Save.write();render()}}
function homeAct(a){
 if(a==='brew')return brewUI();if(a==='chests')return chestList();if(a==='wheel')return wheelUI();if(a==='water'){waterAll();Save.write();return render()}
 if(a==='harvestall'){let mutants=[];let tot=0;S.plots.forEach((p,i)=>{if(plotReady(p)){const r=harvest(i);tot+=r.n;if(r.mut)mutants.push(r.mut)}});sfx(mutants.length?'rare':'good');
  if(mutants.length){burst(innerWidth/2,innerHeight/2,'#ffb733',30);mutants.forEach(k=>toast(`✨ МУТАЦИЯ! ${ITEMS[k].e} ${ITEMS[k].n}`,'leg'))}toast(`Собрано: ${tot}`);Save.write();return render()}
 if(a==='cat'){if(!S.cat){toast(pick(['Барсик спит. Не буди.','Барсик смотрит на тебя как на табуретку.','Мяу. (Барсик ничего не принёс)','Барсик гоняет муху. Муха побеждает.']));return}
  const it=S.cat;S.cat=null;applyLoot([it]);sfx(it.r>=3?'rare':'good');showLoot('Барсик принёс подарок!',[it]);Save.write();return}
 if(a==='sleep')return sleepNow()}
async function sleepNow(){const unready=S.plots.filter(p=>p&&!p.w&&!plotReady(p)).length;if(unready&&S.weather!=='дождь'){if(!await confirmBox(`Не полито грядок: ${unready}. Они не вырастут за ночь. Всё равно спать?`,'Спать','Полить'))return}
 const m=OV.open('<div style="position:absolute;inset:0;background:#000;display:grid;place-items:center;pointer-events:auto;animation:fadein .6s"><div class="serif" style="font-size:22px;color:#d8b98a">🌙 Ночь...</div></div>',{full:true});
 await sleepMs(900);const rep=newDay();OV.close(m);morning(rep);render()}
function morning(rep){const ev=MEVENTS.find(e=>e.id===S.market.ev);const lines=[];
 lines.push(`${WEATHER_IC[S.weather]} Погода: <b>${S.weather}</b>${S.weather==='гроза'?' — шанс мутаций ×2!':S.weather==='звездопад'?' — удача +10%!':S.weather==='туман'?' — на вылазках больше находок и событий':S.weather==='дождь'?' — огород полит':''}`);
 if(isFull())lines.push('🌕 <b>Полнолуние.</b> Ночью в лесу может случиться что угодно...');
 if(rep.zap)lines.push(`⚡ Молния ударила в грядку (${rep.zap})! Урожай точно мутирует.`);
 if(ev)lines.push(`📢 Рынок: <b>${ev.t}</b>. ${ev.d}`);if(S.market.wander)lines.push('🐫 В деревню приехал <b>Ходжа</b> с диковинками! (Рынок)');
 if(S.cat)lines.push('🐈 Барсик что-то притащил и сидит с гордым видом.');if(rep.egg)lines.push(`🐔 Курочка Ряба снесла ${rep.egg} яйцо${rep.egg==='золотое'?' (+250💰)':''}.`);
 if(rep.forecast)lines.push(`🔮 Велена шепчет: завтра на рынке — «${rep.forecast}».`);if(rep.ready)lines.push(`🌾 Созрело грядок: ${rep.ready}`);
 if(wheelFree())lines.push('🎡 Колесо Фортуны ждёт бесплатного вращения!');
 OV.open(`<div class="serif" style="font-size:26px;color:var(--gold2);text-align:center">День ${S.day}</div><div class="sep"></div><div class="col" style="gap:8px">${lines.map(l=>`<div>${l}</div>`).join('')}</div><button class="btn wide" style="margin-top:14px" data-x>Начать день ⚡${S.energy}</button>`,{center:true})}

// ---------- quest card ----------
function questCard(q,compact){const st=S.quests[q.id];const ready=questReady(q.id);const objs=q.objs.map((o,i)=>{const [c,n]=objProg(q,i);return `<li class="${c>=n?'ok':''}"><span>${o.l}</span><span>${o.t==='pay'||o.t==='earn'?fmt(c)+'/'+fmt(n):o.t==='lvl'?c+'/'+n:c+'/'+n}</span></li>`}).join('');
 const acts=[];if(ready)acts.push(`<button class="btn wide" data-turnin="${q.id}">✦ Завершить задание</button>`);
 q.objs.forEach((o,i)=>{const [c,n]=objProg(q,i);if(c>=n)return;if(o.t==='fight')acts.push(`<button class="btn red wide" data-fight="${o.foe}">⚔️ Начать бой</button>`);if(o.t==='card'&&o.opp==='aira')acts.push(`<button class="btn wide" data-cardq="aira">🃏 Сыграть с Айрой</button>`);if(o.t==='card'&&o.opp==='baron'){const [c0,n0]=objProg(q,0);acts.push(`<button class="btn wide" data-cardq="baron" ${c0<n0?'disabled':''}>🏰 К барону ${c0<n0?'(сначала «Боярышник»)':''}</button>`)}});
 return `<div class="card glow"><div class="row"><span class="tag g">Глава ${q.ch}</span><b class="serif grow" style="font-size:16px">${q.t}</b></div>${compact?'':`<div class="mut" style="margin-top:4px">${q.d}</div>`}<ul class="objs">${objs}</ul>${acts.length?`<div class="col" style="margin-top:6px">${acts.join('')}</div>`:''}</div>`}
function bindQuestCard(el){$$('[data-turnin]',el).forEach(b=>b.onclick=()=>completeQuest(b.dataset.turnin));
 $$('[data-fight]',el).forEach(b=>b.onclick=()=>{const q=currentMain();if(q&&q.s&&!S.seen['f_'+q.id]){S.seen['f_'+q.id]=1}startBattle(b.dataset.fight,()=>render())});
 $$('[data-cardq]',el).forEach(b=>b.onclick=()=>{const o=b.dataset.cardq;const go=()=>startCards(o,()=>render());if(o==='baron'&&!S.seen.baron){S.seen.baron=1;playScene('baron_meet',go)}else go()})}
function completeQuest(id){const q=QMAP[id];const out=turnIn(id);if(!out)return;sfx('legend');hap('success');Save.write();
 const after=()=>showLoot('Задание выполнено!',out,()=>{const nx=nextMainId();if(nx&&!(id==='q15'))beginQuest(nx);Save.write();render()},q.t);
 if(q.e)playScene(q.e,after);else after()}
function beginQuest(id){startQuest(id);const q=QMAP[id];Save.write();const done=()=>{toast(`📜 Новое задание: <b>${q.t}</b>`,'gold');render()};if(q.s)playScene(q.s,done);else done()}

// ---------- dialogue ----------
function playScene(id,cb){const sc=SCENES[id];if(!sc){cb&&cb();return}playLines(sc.lines,sc.bg,cb)}
function playLines(lines,bg,cb){const m=OV.open(`<div class="vn"><div class="bg" style="background:${BGS[bg]||BGS.dark}"></div><div class="stage"></div><button class="skip">⏭ Пропустить</button><div class="box"><div class="nm" style="display:none"></div><div class="tx"></div><div class="chs"></div><span class="nx">▼</span></div></div>`,{full:true});
 const q=lines.slice();let typing=null,full='',cur=null,lastWho=null,skipping=false;const tx=$('.tx',m),nm=$('.nm',m),chs=$('.chs',m),stage=$('.stage',m),nx=$('.nx',m);
 const sub=t=>t.replace(/\{name\}/g,esc(S.name));
 function step(){if(typing){clearInterval(typing);typing=null;tx.innerHTML=full;nx.style.display='';return}
  if(chs.children.length)return;const it=q.shift();if(!it){OV.close(m);cb&&cb();return}
  if(it.fx){if(it.fx==='flash'){const f=document.createElement('div');f.className='flash';$('.vn',m).appendChild(f);setTimeout(()=>f.remove(),900);sfx('rare');hap('heavy')}if(it.fx==='shake'){$('.vn',m).classList.add('shake');setTimeout(()=>$('.vn',m).classList.remove('shake'),500);sfx('boom');hap('heavy')}if(it.fx==='fire'){$('.bg',m).style.background=BGS.fire;sfx('boom')}return step()}
  if(it.pressf){skipping=false;nm.style.display='none';stage.innerHTML='';tx.className='tx narr';tx.innerHTML='Перо на кургане чуть светится в закатном свете.';
   chs.innerHTML=`<button data-f style="text-align:center;font-size:22px;font-weight:900;letter-spacing:2px">[ F ] Отдать дань уважения</button>`;nx.style.display='none';
   $('[data-f]',m).onclick=e=>{e.stopPropagation();chs.innerHTML='';ach('pressf');tx.innerHTML='Ты отдаёшь дань уважения. Где-то очень далеко кто-то одобрительно хмыкает.';nx.style.display=''};return}
  if(it.c){skipping=false;nx.style.display='none';chs.innerHTML=it.c.map((c,i)=>`<button data-c="${i}">${sub(c.t)}</button>`).join('');
   $$('[data-c]',m).forEach(b=>b.onclick=e=>{e.stopPropagation();const c=it.c[+b.dataset.c];sfx('click');hap();for(const g in c.h||{})heart(g,c.h[g]);if(c.f)S.flags[c.f]=1;chs.innerHTML='';q.unshift(...(c.then||[]));step()});return}
  const [who,mood,text]=it;full=sub(text);
  if(who==='n'){nm.style.display='none';tx.className='tx narr';stage.innerHTML=lastWho&&lastWho!=='n'?stage.innerHTML:'';if(stage.firstChild)stage.firstChild.style.filter='brightness(.5)'}
  else{const ch=CHARS[who];nm.style.display='';nm.textContent=typeof ch.n==='function'?ch.n():ch.n;nm.style.background=`linear-gradient(180deg,#fff,${ch.col})`;tx.className='tx';
   const pid=ch.por||who;if(PC[pid]){const html=`<div class="por ${lastWho!==who?'in':''}">${portrait(pid,mood||null,{ghost:ch.ghost})}</div>`;if(lastWho!==who||cur!==mood){stage.innerHTML=html}else if(stage.firstChild)stage.firstChild.style.filter=''}else stage.innerHTML=''}
  lastWho=who;cur=mood;
  if(skipping||S.settings.fastText){tx.innerHTML=full;if(skipping)setTimeout(step,0);return}
  tx.innerHTML='';nx.style.display='none';let i=0;typing=setInterval(()=>{i+=2;tx.innerHTML=full.slice(0,i);if(i%6===0)sfx('tick');if(i>=full.length){clearInterval(typing);typing=null;tx.innerHTML=full;nx.style.display=''}},22)}
 $('.vn',m).onclick=e=>{if(e.target.closest('.skip')||e.target.closest('.chs button'))return;step()};
 $('.skip',m).onclick=e=>{e.stopPropagation();if(typing){clearInterval(typing);typing=null}skipping=true;step()};step()}

// ---------- loot display ----------
function showLoot(title,items,cb,sub){const views=items.map(it=>it.e?it:lootView(it));const maxR=Math.max(0,...views.map(v=>v.r||0));
 const m=OV.open(`<div style="text-align:center">${sub?`<div class="mut">${sub}</div>`:''}<h2 class="t" style="justify-content:center">${title}</h2>${maxR>=4?`<div class="legend-banner ${maxR>=5?'m':''}">${maxR>=5?'МИФИЧЕСКОЕ!':'ЛЕГЕНДАРНОЕ!'}</div>`:''}
  <div class="loot">${views.map((v,i)=>`<div class="tile ${RB(v.r||0)}" style="animation-delay:${i*.12}s"><div class="em">${v.e}</div><div class="nm r${v.r||0}">${v.n}</div>${v.c?`<span class="q">${v.c>0?'+':''}${fmt(v.c)}</span>`:''}</div>`).join('')}</div>
  <button class="btn wide" data-x style="margin-top:8px">Забрать</button></div>`,{center:true,onClose:cb});
 if(maxR>=4){sfx('legend');hap('success');burst(innerWidth/2,innerHeight/2,maxR>=5?'#ff4d6d':'#ffb733',40)}else if(maxR>=2)sfx('rare');else sfx('good');renderTop();return m}
function showLevelUp(){const l=pendingLevelUps.shift();if(!l)return;sfx('level');hap('success');burst(innerWidth/2,innerHeight/3,'#ffd36b',36);
 OV.open(`<div class="lvlup"><div class="mut">НОВЫЙ УРОВЕНЬ</div><div class="big">${l}</div><div class="serif" style="font-size:16px;margin:6px 0">+1 очко таланта · +2 к энергии${l%3===0?' · 🎟️ Жетон Фортуны':''}</div>${LEVEL_UNLOCK[l]?`<div class="card glow" style="margin-top:10px"><b>🔓 Открыто:</b> ${LEVEL_UNLOCK[l]}</div>`:''}<button class="btn wide" data-x style="margin-top:10px">Пламя растёт</button></div>`,{center:true,onClose:()=>{render()}})}

// ---------- brewing ----------
function brewUI(){const m=OV.open(`<h2 class="t">⚗️ ${CAULDRON[S.cauldron].n}</h2><div class="mut" style="margin:-6px 2px 10px">Зелий за варку: ${brewYield()} · Варка: 2⚡</div><div id="rl"></div>`);
 const draw_=()=>{const rl=$('#rl',m);const rec=S.recipes.slice().sort((a,b)=>(missing(a).length?1:0)-(missing(b).length?1:0)||RECIPES[a].p-RECIPES[b].p);
  const nx=CAULDRON[S.cauldron+1];
  rl.innerHTML=(rec.length?rec.map(rid=>{const r=RECIPES[rid];const mis=missing(rid);const ing=Object.entries(r.ing).map(([k,n])=>`<span class="${invCount(k)>=n?'':'dn'}">${ITEMS[k].e}${invCount(k)}/${n}</span>`).join(' ');
   return `<div class="card" style="padding:10px"><div class="row"><div style="font-size:30px">${r.e}</div><div class="grow"><b>${r.n}</b> <span class="mut">~${fmt(sellPrice(rid+'#0'))}💰</span><div class="small">${ing}</div><div class="mut small">${r.d}</div></div><button class="btn sm" data-b="${rid}" ${mis.length?'disabled':''}>Варить</button></div></div>`}).join(''):'<div class="empty">Нет рецептов</div>')
   +(S.level>=7?`<button class="btn sec wide" data-dist style="margin-top:6px">🔁 Перегонный куб (3 зелья → 1 качеством выше, 70%)</button>`:'')
   +(nx?`<div class="card" style="margin-top:10px"><b>Улучшение:</b> ${nx.n} — ${nx.y} зелья за варку<div class="mut">Нужен ${nx.lvl} ур. · ${fmt(Math.round(nx.cost*(hasBook('b_steel')?.75:1)))}💰</div><button class="btn sm" data-up style="margin-top:6px" ${S.level<nx.lvl?'disabled':''}>Улучшить котёл</button></div>`:'');
  $$('[data-b]',m).forEach(b=>b.onclick=()=>{if(S.energy<2){toast('Не хватает энергии ⚡','bad');return}brewGame(b.dataset.b,()=>{draw_();render()})});
  const up=$('[data-up]',m);if(up)up.onclick=()=>{upgradeCauldron();Save.write();draw_();render()};const ds=$('[data-dist]',m);if(ds)ds.onclick=()=>distillUI(draw_)};draw_()}
function brewGame(rid,done){const r=RECIPES[rid];S.energy-=2;
 const goodW=.18+T('steady')*.03,perfW=.045+T('steady')*.015;const gs=.15+rnd()*(.7-goodW);const ps=gs+rnd()*(goodW-perfW);const speed=(.75+Math.min(1.1,r.p/900))*(S.level<3?.8:1);
 const m=OV.open(`<div class="cauldron-wrap"><div class="serif" style="font-size:18px">${r.e} ${r.n}</div><div class="mut">Останови стрелку в <b style="color:#5fd068">зелёной</b> зоне. <b style="color:#ffd36b">Золотая</b> — идеально!</div>
  <div class="bubbles" id="cb">${cauldronSVG()}</div>
  <div class="meter"><div class="z" style="left:0;width:12%;background:#5a1a1a"></div><div class="z" style="right:0;width:12%;background:#5a1a1a"></div><div class="z" style="left:12%;right:12%;background:#2a2433"></div>
   <div class="z" style="left:${gs*100}%;width:${goodW*100}%;background:linear-gradient(180deg,#3fbf6a,#1f7a3a)"></div><div class="z" style="left:${ps*100}%;width:${perfW*100}%;background:linear-gradient(180deg,#fff3a0,#e8b85a);box-shadow:0 0 12px #ffd36b"></div><div class="needle" id="nd"></div></div>
  <button class="btn wide" id="pour" style="padding:16px;font-size:18px">ВЛИТЬ!</button><div id="res"></div></div>`,{center:true,noClose:true});
 let pos=0,dir=1,run=true,last=performance.now();const nd=$('#nd',m);sfx('brew');
 const loop=t=>{if(!run)return;const dt=Math.min(50,t-last)/1000;last=t;pos+=dir*speed*dt;if(pos>1){pos=1;dir=-1}if(pos<0){pos=0;dir=1}nd.style.left=(pos*100)+'%';requestAnimationFrame(loop)};requestAnimationFrame(loop);
 $('#pour',m).onclick=async()=>{if(!run)return;run=false;hap('medium');const zone=pos<.12||pos>.88?-1:(pos>=ps&&pos<=ps+perfW)?2:(pos>=gs&&pos<=gs+goodW)?1:0;
  $('#pour',m).style.display='none';const zt=['Мимо!','Сойдёт','Хорошо!','ИДЕАЛЬНО!'][zone+1];toast(zt,zone===2?'gold':zone<0?'bad':'');
  $('#cb',m).classList.add('shake');sfx('brew');await sleepMs(900);const res=brewRoll(rid,zone);Save.write();
  let html;if(res.boom){sfx('boom');hap('heavy');$('#cb',m).innerHTML='<div style="font-size:90px;text-align:center;line-height:170px">💥</div>';html=`<div class="res-pop"><div class="serif" style="font-size:22px;color:#ff6b6b">БА-БАХ!</div><div class="serif">Это фиаско, братан. Ингредиенты разлетелись по потолку.</div></div>`}
  else{const q=res.q;if(q>=4){sfx('legend');hap('success');burst(innerWidth/2,innerHeight/2,'#ffb733',50)}else if(q>=2)sfx('rare');else sfx('good');
   html=`<div class="res-pop">${q>=4?'<div class="legend-banner">ЛЕГЕНДАРНОЕ!</div>':''}<div style="font-size:54px">${r.e}</div><div class="serif r${q}" style="font-size:20px">${r.n} ${QSTAR[q]}</div><div class="r${q}"><b>${QN[q]}</b> ×${res.cnt}</div>${res.crit?'<div style="color:var(--gold2);font-weight:800">⚡ КРИТ! Двойная порция!</div>':''}<div class="mut">Цена сегодня: ~${fmt(sellPrice(rid+'#'+q))}💰 за шт.</div></div>`}
  $('#res',m).innerHTML=html+`<div class="row" style="margin-top:10px"><button class="btn sec grow" data-close>Готово</button>${missing(rid).length||S.energy<2?'':'<button class="btn grow" data-again>Ещё раз (2⚡)</button>'}</div>`;
  $('[data-close]',m).onclick=()=>{OV.close(m);done&&done()};const ag=$('[data-again]',m);if(ag)ag.onclick=()=>{OV.close(m);brewGame(rid,done)};renderTop()}}
function cauldronSVG(){return `<svg viewBox="0 0 200 170"><defs><radialGradient id="liq"><stop offset="0" stop-color="#9dff7a"/><stop offset="1" stop-color="#2a8a3a"/></radialGradient></defs><ellipse cx="100" cy="160" rx="70" ry="8" fill="#000" opacity=".5"/>
 <path d="M60,150 L50,165 M140,150 L150,165" stroke="#3a2a1a" stroke-width="6"/><path d="M30,70 Q30,160 100,160 Q170,160 170,70Z" fill="#3a2a22" stroke="#1a100a" stroke-width="3"/><ellipse cx="100" cy="70" rx="72" ry="16" fill="#2a1a12" stroke="#c08a2e" stroke-width="3"/><ellipse cx="100" cy="72" rx="64" ry="11" fill="url(#liq)"/>
 ${[0,1,2,3,4,5].map(i=>`<circle cx="${70+i*12}" cy="70" r="${3+i%3}" fill="#c8ffb0" opacity=".8"><animate attributeName="cy" values="72;30;72" dur="${1.2+i*.3}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0;.9" dur="${1.2+i*.3}s" repeatCount="indefinite"/></circle>`).join('')}
 <path d="M100,120 C108,128 108,140 100,148 C94,140 92,128 100,120Z" fill="#e8b85a" opacity=".6"/><path d="M60,165 Q100,140 140,165" fill="#ff6a2b" opacity=".7"><animate attributeName="opacity" values=".5;.9;.5" dur=".6s" repeatCount="indefinite"/></path></svg>`}
function distillUI(cb){const ks=Object.keys(S.inv).filter(k=>k.includes('#')&&+k.split('#')[1]<4&&S.inv[k]>=3);
 const m=OV.open(`<h2 class="t">🔁 Перегонный куб</h2><div class="mut" style="margin-bottom:8px">3 одинаковых зелья → 1 качеством выше. Шанс 70%. 1⚡</div>${ks.length?`<div class="grid g3">${ks.map(k=>{const [id,q]=k.split('#');return tileItem(RECIPES[id].e,RECIPES[id].n+' '+QSTAR[+q],S.inv[k],+q,`data-k="${k}"`)}).join('')}</div>`:'<div class="empty">Нужно минимум 3 одинаковых зелья одного качества</div>'}`);
 $$('[data-k]',m).forEach(b=>b.onclick=()=>{const ok=distill(b.dataset.k);if(ok===null)return;OV.close(m);const [id,q]=b.dataset.k.split('#');if(ok){sfx(+q+1>=3?'rare':'good');toast(`✨ Получено: ${RECIPES[id].n} — ${QN[+q+1]}`,+q+1>=4?'leg':'gold')}else{sfx('fail');toast('Перегонка не удалась. Пар ушёл в трубу.','bad')}Save.write();cb&&cb();render()})}

// ---------- chests ----------
function chestList(){const ks=Object.keys(S.chests).filter(k=>S.chests[k]>0);
 const m=OV.open(`<h2 class="t">📦 Сундуки</h2>${ks.length?`<div class="grid g2">${ks.map(k=>`<div class="card" style="text-align:center;padding:8px" data-c="${k}"><div style="width:110px;margin:0 auto">${chestSVG(k)}</div><b style="color:${CHESTS[k].col}">${CHESTS[k].n}</b><div class="mut">×${S.chests[k]} ${CHESTS[k].key?`· нужен ${ITEMS[CHESTS[k].key].e} (${invCount(CHESTS[k].key)})`:''}</div></div>`).join('')}</div>`:'<div class="empty">Сундуков нет. Ищи на вылазках, в заданиях, на колесе или купи в лавке.</div>'}
  <div class="mut" style="margin-top:8px">🔑 Золотой ключ: ${invCount('key_gold')} · 🗝️ Ключ Бездны: ${invCount('key_myth')} · 🍀 Разрыв-трава: ${invCount('rip_grass')}</div>`);
 $$('[data-c]',m).forEach(b=>b.onclick=()=>{const k=b.dataset.c;if(!canOpen(k)){toast(`Нужен ${ITEMS[CHESTS[k].key].n}`,'bad');return}OV.close(m);openChest(k)})}
function openChest(type){if(!S.chests[type]||!canOpen(type))return;S.chests[type]--;takeKey(type);const res=rollChest(type);applyLoot(res.items);S.stats.chests++;if(S.stats.chests>=10)ach('chest10');if(S.stats.chests>=100)ach('chest100');gainXP(3);Save.write();
 const m=OV.open(`<div class="chest-stage" style="background:radial-gradient(ellipse at 50% 45%,#2a1a30,#07050a 70%);padding-top:var(--sat)"><svg class="rays" viewBox="0 0 900 900">${[...Array(16)].map((_,i)=>`<path d="M450,450 L${450+Math.cos(i/16*6.283)*450},${450+Math.sin(i/16*6.283)*450} L${450+Math.cos((i+.5)/16*6.283)*450},${450+Math.sin((i+.5)/16*6.283)*450}Z" fill="#fff" opacity=".07"/>`).join('')}</svg>
  <div class="serif" style="font-size:18px;color:${CHESTS[type].col};z-index:2">${CHESTS[type].n}</div><div class="chest-svg" id="ch">${chestSVG(type)}</div><div class="mut" id="hint" style="z-index:2">Нажми, чтобы открыть</div><div id="ban" style="z-index:2;min-height:10px"></div><div class="loot" id="lt"></div><div id="cbtn" style="z-index:2;padding:10px calc(var(--sab) + 10px);width:100%;max-width:420px"></div></div>`,{full:true});
 const ch=$('#ch',m);let opened=false;
 const go=async()=>{if(opened)return;opened=true;$('#hint',m).textContent='';ch.classList.add('shake');sfx('chest');hap('medium');
  const fast=S.settings.fastText;for(let r=0;r<=res.maxR;r++){ch.style.filter=`drop-shadow(0 0 ${12+r*8}px ${RCOL[r]}) drop-shadow(0 0 ${6+r*5}px ${RCOL[r]})`;if(r>0){sfx('shine');hap(r>=3?'heavy':'light')}await sleepMs(fast?120:(r>=3?650:420))}
  ch.classList.remove('shake');ch.innerHTML=chestSVG(type,true);sfx(res.maxR>=4?'legend':res.maxR>=2?'rare':'good');const rc=ch.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2,RCOL[res.maxR],20+res.maxR*8);
  if(res.maxR>=3){$('.rays',m).style.opacity=1;$('.rays',m).style.filter=`drop-shadow(0 0 20px ${RCOL[res.maxR]})`}
  if(res.maxR>=4){$('#ban',m).innerHTML=`<div class="legend-banner ${res.maxR>=5?'m':''}">${res.maxR>=5?'МИФИЧЕСКОЕ!':'ЛЕГЕНДАРНОЕ!'}</div>`;hap('success')}
  $('#lt',m).innerHTML=res.items.map((it,i)=>{const v=lootView(it);return `<div class="tile ${RB(v.r)}" style="animation-delay:${.15+i*.18}s"><div class="em">${v.e}</div><div class="nm r${v.r}">${v.n}</div>${v.c?`<span class="q">×${fmt(v.c)}</span>`:''}</div>`}).join('');
  const more=S.chests[type]>0&&canOpen(type);$('#cbtn',m).innerHTML=`<div class="row"><button class="btn sec grow" data-done>Забрать</button>${more?`<button class="btn grow" data-more>Ещё (${S.chests[type]})</button>`:''}</div>`;
  $('[data-done]',m).onclick=()=>{OV.close(m);render()};const mb=$('[data-more]',m);if(mb)mb.onclick=()=>{OV.close(m);openChest(type)};renderTop()};
 ch.onclick=go;$('#hint',m).onclick=go}

// ---------- wheel ----------
let wheelRot=0;
function wheelUI(){const m=OV.open(`<div style="text-align:center"><h2 class="t" style="justify-content:center">🎡 Колесо Фортуны</h2><div class="mut">Бесплатно раз в сутки. Серия дней: <b>${S.wheel.streak}</b> ${S.wheel.streak?'🔥':''} · каждые 7 дней подряд — Золотой сундук!</div>
  <div class="wheel-box"><svg class="ptr" viewBox="0 0 28 36"><path d="M14,36 L2,8 Q14,-4 26,8Z" fill="#ffd36b" stroke="#7a4a0e" stroke-width="2"/></svg><div id="wh" style="width:100%;height:100%">${wheelSVG()}</div></div>
  <button class="btn wide" id="spin" style="padding:14px;font-size:17px">${wheelFree()?'Крутить бесплатно!':invHas('token')?`Крутить за 🎟️ (${invCount('token')})`:'Жетонов нет — приходи завтра'}</button><div id="wr" style="min-height:20px;margin-top:8px"></div></div>`,{center:true});
 const svg=$('#wh svg',m);svg.style.transform=`rotate(${wheelRot}deg)`;
 const btn=$('#spin',m);if(!wheelFree()&&!invHas('token'))btn.disabled=true;
 btn.onclick=async()=>{const i=spinWheel();if(i===null)return;btn.disabled=true;const n=WHEEL.length,seg=360/n;const target=360-(i+.5)*seg+ri(-seg*.35,seg*.35);const cur=((wheelRot%360)+360)%360;wheelRot+=360*6+((target-cur+360)%360);
  svg.style.transform=`rotate(${wheelRot}deg)`;let ticks=0;const tk=setInterval(()=>{sfx('tick');if(++ticks>40)clearInterval(tk)},120);hap('light');
  await sleepMs(5300);clearInterval(tk);const out=wheelGrant(i);Save.write();const jp=WHEEL[i].g.jackpot;
  if(jp){sfx('legend');hap('success');burst(innerWidth/2,innerHeight/2,'#ffb733',60)}else sfx('good');
  $('#wr',m).innerHTML=`<div class="serif" style="font-size:18px;color:${jp?'var(--r4)':'var(--gold2)'}">${jp?'👑 ДЖЕКПОТ! 👑':'Выпало: '+WHEEL[i].e+' '+WHEEL[i].t}</div><div class="small">${out.map(o=>o.kind==='chest'?`${CHESTS[o.id].n}${o.streak?' (бонус серии!)':''}`:lootView(o).n+(o.n>1||o.kind==='gold'?' ×'+fmt(o.n):'')).join(' · ')}</div>`;
  btn.disabled=!invHas('token');btn.textContent=invHas('token')?`Ещё за 🎟️ (${invCount('token')})`:'На сегодня всё';render()}}

// ---------- MAP ----------
function scrMap(el){el.innerHTML=`<div class="tabs2"><button class="${UI.map==='valley'?'on':''}" data-m="valley">🧭 Долина Вербы</button><button class="${UI.map==='world'?'on':''}" data-m="world">🌍 Эльдрея</button></div>
 <div class="mapwrap">${UI.map==='valley'?valleyMapSVG():worldMapSVG()}</div><div class="mut" style="margin-top:8px;text-align:center">${UI.map==='valley'?'Нажми на место на карте. Мерцают места, связанные с заданием.':'Континент Эльдрея. Остальные земли откроются позже.'}</div>`;
 $$('[data-m]',el).forEach(b=>b.onclick=()=>{UI.map=b.dataset.m;render()});$$('.mapnode',el).forEach(n=>n.onclick=()=>{sfx('click');hap();locSheet(n.dataset.loc)})}
function girlAvail(g){return !!S.quests[GIRL_REQ[g]]&&(qDone(GIRL_REQ[g])||g==='liora'&&qActive('q4')||g==='aira'&&false)}
function locSheet(id){const Lc=LOCS[id];if(!locOpen(id)){const r=Lc.req;toast(`🔒 ${r.lvl?`Нужен ${r.lvl} уровень`:r.book?'Нужна особая карта...':id==='road'?'Акт II — скоро':'Откроется по сюжету'}`,'bad');return}
 const acts=[];const girls=Object.keys(GIRL_LOC).filter(g=>GIRL_LOC[g]===id&&girlAvail(g));
 if(id==='village'){acts.push(`<button class="btn wide" data-a="tavern">🍺 Таверна «Пьяный Гусь» — Гамбит</button>`);acts.push(`<button class="btn sec wide" data-a="shop">⚖️ Рынок и лавка</button>`);if(S.level>=2)acts.push(`<button class="btn sec wide" data-a="orders">📋 Доска заказов (${S.orders.length})</button>`);acts.push(`<button class="btn sec wide" data-a="matvey">👴 Поговорить с дедом Матвеем</button>`);if(qDone('q15'))acts.push(`<button class="btn sec wide" data-a="grave">🪶 Курган Мастера</button>`)}
 if(Lc.loot){const c=locCost(id);acts.push(`<button class="btn wide" data-a="exp">🎒 Вылазка (${c}⚡)</button>`);if(Lc.night)acts.push(`<button class="btn sec wide" data-a="night" ${S.buffs.night?'':'disabled'}>🦉 Ночная вылазка (${c+1}⚡) ${S.buffs.night?'':'— нужно Зелье Ночного Зрения'}</button>`)}
 if(Lc.fight)acts.push(`<button class="btn red wide" data-a="hunt">⚔️ Охота (${locCost(id)}⚡)</button>`);
 if(id==='castle'){if(qDone('q7'))acts.push(`<div class="mut">Замок пуст. Барон уехал «лечить нервы» на воды.</div>`);else acts.push(`<button class="btn wide" data-a="baron">🏰 Явиться на пир</button>`)}
 if(id==='road')acts.push(`<div class="mut">Дорога на Мирану. Акт II в разработке.</div>`);
 const gh=girls.map(g=>`<div class="row card" style="padding:8px;margin:0" data-g="${g}"><div class="por-mini">${portrait(g,null,{noGlow:1})}</div><div class="grow"><b style="color:${CHARS[g].col}">${CHARS[g].n}</b> ${nextRomance(g)?'<span class="tag g">💗 событие!</span>':''}<div class="prog h"><i style="width:${S.hearts[g]}%"></i></div></div><span>›</span></div>`).join('');
 const m=OV.open(`<h2 class="t">${Lc.e} ${Lc.n}</h2><div class="mut serif" style="margin:-4px 2px 12px">${Lc.d}</div>${gh?`<div class="col" style="margin-bottom:10px">${gh}</div>`:''}<div class="col">${acts.join('')}</div>`);
 $$('[data-g]',m).forEach(b=>b.onclick=()=>girlSheet(b.dataset.g));
 $$('[data-a]',m).forEach(b=>b.onclick=()=>{sfx('click');const a=b.dataset.a;
  if(a==='exp'||a==='night'){if(S.energy<locCost(id)+(a==='night'?1:0)){toast('Не хватает энергии ⚡','bad');return}if(a==='night')S.energy--;const r=explore(id,a==='night');if(!r)return;OV.close(m);expResult(id,r)}
  if(a==='hunt'){if(!useEnergy(locCost(id)))return;OV.close(m);startBattle(chance(.3)?'alpha':'wolf',()=>render())}
  if(a==='tavern'){OV.close(m);tavern()}if(a==='shop'){OV.closeAll();UI.tab='market';render()}if(a==='orders'){ordersUI()}
  if(a==='matvey'){playLines([L('matvey','s',pick(['Ты, милок, главное — ешь. Алхимия алхимией, а щи по расписанию.','Бабка моя говорит, ты на её покойного брата похож. Тот тоже вечно что-то взрывал.','Раньше в Заводи скучно было. Теперь — то барон, то ведьмы, то серые. Красота!','Шёл бы ты, внучок, огород копать. Огород — он дурного не посоветует.','Говорят, в Миране дома из мрамора, а люди — из камня. Не езди туда. А если поедешь — привези пряник.','Кот твой у меня сметану стащил. Я не в обиде. Он с достоинством стащил.']))],'dawn')}
  if(a==='grave'){playLines([N('Обгоревшее перо на кургане чуть светится.'),{pressf:1}],'sunset')}
  if(a==='baron'){const q=QMAP.q7;if(!qActive('q7')){toast('Сейчас тебе там нечего делать');return}const [c,n]=objProg(q,0);if(c<n){toast('Сначала свари 3× «Боярышник» качества Хорошее+','bad');return}OV.close(m);const go=()=>startCards('baron',()=>render());if(!S.seen.baron){S.seen.baron=1;playScene('baron_meet',go)}else go()}})}
function expResult(id,r){Save.write();const items=r.items.slice();const extra=[];if(r.chest)extra.push(`<div class="tile ${RB(r.chest==='wood'?0:r.chest==='iron'?1:r.chest==='gold'?2:3)}"><div class="em">📦</div><div class="nm">${CHESTS[r.chest].n}</div></div>`);
 if(r.book)extra.push(`<div class="tile ${RB(BOOKS[r.book].r)}"><div class="em">${BOOKS[r.book].e}</div><div class="nm r${BOOKS[r.book].r}">${BOOKS[r.book].n}</div></div>`);if(r.diary)extra.push(`<div class="tile b4"><div class="em">📜</div><div class="nm r4">Дневник Мастера, стр. ${r.diary}</div></div>`);
 const maxR=Math.max(...items.map(i=>i.r),r.book?BOOKS[r.book].r:0,r.diary?4:0);if(maxR>=4){sfx('legend');hap('success');burst(innerWidth/2,innerHeight/2,RCOL[maxR],40)}else if(maxR>=2||r.chest)sfx('rare');else sfx('good');
 const m=OV.open(`<h2 class="t">🎒 ${LOCS[id].n}</h2>${maxR>=4?`<div class="legend-banner ${maxR>=5?'m':''}">${items.some(i=>i.id==='fern')?'ЦВЕТОК ПАПОРОТНИКА!':maxR>=5?'МИФИЧЕСКОЕ!':'ЛЕГЕНДАРНОЕ!'}</div>`:''}<div class="loot">${items.map((it,i)=>{const v=lootView(it);return `<div class="tile ${RB(v.r)}" style="animation-delay:${i*.1}s"><div class="em">${v.e}</div><div class="nm r${v.r}">${v.n}</div><span class="q">×${v.c}</span></div>`}).join('')}${extra.join('')}</div>
  <div class="row" style="margin-top:8px"><button class="btn sec grow" data-done>${r.ev?'Дальше...':'Вернуться'}</button>${!r.ev&&S.energy>=locCost(id)?`<button class="btn grow" data-again>Ещё (${locCost(id)}⚡)</button>`:''}</div>`,{center:true});
 $('[data-done]',m).onclick=()=>{OV.close(m);if(r.ev)eventUI(r.ev,id);else render()};const ag=$('[data-again]',m);if(ag)ag.onclick=()=>{OV.close(m);const r2=explore(id,false);if(r2)expResult(id,r2)}}
function eventUI(ev,loc){const m=OV.open(`<h2 class="t">❗ ${ev.t}</h2><div class="serif" style="font-size:16px;margin-bottom:12px">${ev.d}</div><div class="col">${ev.ch.map((c,i)=>`<button class="btn ${i?'sec':''} wide" data-i="${i}" ${c.req&&!c.req()?'disabled':''}>${c.t}</button>`).join('')}</div>`,{center:true,noClose:true});
 $$('[data-i]',m).forEach(b=>b.onclick=()=>{const c=ev.ch[+b.dataset.i];const res=c.fn();OV.close(m);Save.write();sfx('click');
  if(res.fight){startBattle(res.fight,()=>render());return}
  OV.open(`<div class="serif" style="font-size:16px">${res.msg}</div>${res.loot&&res.loot.length?`<div class="loot">${res.loot.map(it=>{const v=lootView(it);return `<div class="tile ${RB(v.r)}"><div class="em">${v.e}</div><div class="nm r${v.r}">${v.n}</div></div>`}).join('')}</div>`:''}<button class="btn wide" data-x style="margin-top:10px">Дальше</button>`,{center:true,onClose:render})})}
function tavern(){const ops=Object.keys(OPPS).filter(o=>!OPPS[o].story||(o==='aira'&&(qActive('q5')||qDone('q5'))));
 const m=OV.open(`<h2 class="t">🍺 «Пьяный Гусь»</h2>${!S.flags.cards?'<div class="empty">Здесь играют в Пепельный Гамбит. Тебя пока не приглашали за стол.</div>':`<div class="mut" style="margin-bottom:8px">Лучший из трёх раундов. Сильнейший ряд побеждает. Пас — когда хватит. Колода: ${S.deck.length} карт.</div>
  <div class="col">${ops.map(o=>{const O=OPPS[o];const lock=O.req&&((O.req.heart&&S.hearts[O.req.heart]<O.req.v)||(O.req.lvl&&S.level<O.req.lvl));const isQ=o==='aira'&&qActive('q5');
   return `<div class="card row" style="margin:0;padding:8px"><div class="por-mini">${portrait(O.por,null,{noGlow:1})}</div><div class="grow"><b>${O.n}</b> ${isQ?'<span class="tag g">задание</span>':''}<div class="mut small">${O.d||(o==='aira'?'Алая наёмница. Играет агрессивно.':'')}</div><div class="small">${O.stake?`Ставка ${O.stake}💰 · выигрыш ${O.stake*2}💰`:'Без ставки'}</div></div><button class="btn sm" data-o="${o}" ${lock?'disabled':''}>${lock?'🔒':'Играть'}</button></div>`}).join('')}</div>
  <button class="btn sec wide" data-deck style="margin-top:10px">🎴 Колода</button>`}`);
 $$('[data-o]',m).forEach(b=>b.onclick=()=>{OV.close(m);startCards(b.dataset.o,()=>render())});const dk=$('[data-deck]',m);if(dk)dk.onclick=()=>deckUI()}
function ordersUI(){const m=OV.open(`<h2 class="t">📋 Доска заказов</h2><div class="mut" style="margin-bottom:8px">Обновляется раз в 3 дня.</div><div id="ol"></div>`);
 const d=()=>{$('#ol',m).innerHTML=S.orders.length?S.orders.map((o,i)=>{const have=elixCount(o.rid,o.q);return `<div class="card" style="padding:10px"><div class="row"><div style="font-size:28px">${RECIPES[o.rid].e}</div><div class="grow"><b>${o.npc}</b><div>${RECIPES[o.rid].n} ×${o.n} ${o.q?`<span class="r${o.q}">(${QN[o.q]}+)</span>`:''}</div><div class="small">Награда: ${fmt(o.gold)}💰 · ${o.xp}✨${o.chest?` · 📦 ${CHESTS[o.chest].n}`:''}${o.girl?' · 💗':''}</div></div><button class="btn sm" data-i="${i}" ${have<o.n?'disabled':''}>${have}/${o.n}</button></div></div>`}).join(''):'<div class="empty">Заказов нет. Загляни через пару дней.</div>';
  $$('[data-i]',m).forEach(b=>b.onclick=()=>{const o=S.orders[+b.dataset.i];if(fulfillOrder(o)){sfx('coin');toast(`Заказ выполнен! +${fmt(o.gold)}💰`,'gold');Save.write();d();render()}})};d()}

// ---------- girls ----------
function girlSheet(g){const ch=CHARS[g];const ev=nextRomance(g);const done=S.hev[g]||0;const nxt=ROMANCE[g][done];const talked=S.talkDay[g]===S.day,gifted=S.giftDay[g]===S.day;
 const perks={liora:['30: −10% к покупкам','60: +10% к продажам','90: тайный лот в лавке'],aira:['30: помогает в схватках','60: опасности на вылазках реже','90: её карта-герой'],seylin:['30: растения растут быстрее','60: +3% мутаций','90: её карта-герой'],velena:['30: +5% удачи','60: гадание о рынке','90: её карта-герой']}[g];
 const m=OV.open(`<div style="max-width:300px;margin:-6px auto 0">${portrait(g,S.hearts[g]>=50?'s':null)}</div><h2 class="t" style="justify-content:center;color:${ch.col}">${ch.n}</h2>
  <div class="row"><span>💗</span><div class="prog h grow"><i style="width:${S.hearts[g]}%"></i></div><b>${S.hearts[g]}</b></div>
  <div class="mut small" style="margin:6px 0">${perks.map(p=>`<div class="${S.hearts[g]>=+p.slice(0,2)?'up':''}">${S.hearts[g]>=+p.slice(0,2)?'✓':'·'} ${p}</div>`).join('')}</div>
  ${ev?`<div class="card glow" style="margin:8px 0"><b>💗 Особое событие: «${ev.t}»</b></div>`:nxt?`<div class="mut small">Следующее событие при ${nxt.at}💗</div>`:''}
  <div class="row" style="margin-top:10px"><button class="btn grow" data-t ${talked&&!ev?'disabled':''}>${ev?'💗 Событие':'💬 Поговорить'}</button><button class="btn sec grow" data-gift ${gifted?'disabled':''}>🎁 Подарок</button></div>`);
 $('[data-t]',m).onclick=()=>{OV.close(m);if(ev){S.hev[g]=done+1;Save.write();playLines(ev.lines,g==='seylin'?'forest':g==='velena'?'swamp':g==='aira'?'tavern':'market',()=>{if(ev.card){S.cards[ev.card]=(S.cards[ev.card]||0)+1}heart(g,5);OV.open(`<h2 class="t">💗 ${ev.t}</h2><div class="serif">${ev.rew}</div><button class="btn wide" data-x style="margin-top:10px">❤</button>`,{center:true,onClose:render});Save.write()})}
  else{S.talkDay[g]=S.day;heart(g,1,true);Save.write();playLines([L(g,pick(['s','k','n','b']),pick(TALK[g]))],g==='seylin'?'forest':g==='velena'?'swamp':g==='aira'?'tavern':'market',render)}};
 $('[data-gift]',m).onclick=()=>giftUI(g,()=>{OV.close(m);girlSheet(g)})}
function giftUI(g,cb){const ks=Object.keys(S.inv).filter(k=>{const [id]=k.split('#');return (ITEMS[id]&&ITEMS[id].t!=='key'&&ITEMS[id].t!=='seed')||RECIPES[id]});
 const m=OV.open(`<h2 class="t">🎁 Подарок для ${CHARS[g].n}</h2><div class="mut" style="margin-bottom:8px">Раз в день. Угадай, что она любит.</div><div class="grid g4">${ks.map(k=>tileItem(itemEmoji(k),itemName(k).split(' ').slice(0,2).join(' ')+(k.includes('#')?' '+QSTAR[+k.split('#')[1]]:''),S.inv[k],itemRar(k),`data-k="${k}"`)).join('')||'<div class="empty">Нечего дарить</div>'}</div>`);
 $$('[data-k]',m).forEach(b=>b.onclick=()=>{const k=b.dataset.k;invAdd(k,-1);let v=giftValue(g,k);if(k.includes('#'))v+=+k.split('#')[1];S.giftDay[g]=S.day;OV.close(m);
  const line=v>=8?pick(['Ох... Ты запомнил. Мне это очень нравится.','Это... именно то, что я хотела. Откуда ты знаешь?!','Не смотри так, я не краснею! ...Спасибо.']):v>=4?pick(['Мило. Спасибо.','Приятно. Правда.','О, полезная вещь. Ценю.']):v<0?pick(['Это что, шутка?','...Серьёзно? Мне?','Унеси. Сейчас же.']):pick(['Хм. Спасибо, наверное.','Ну... ладно.','Буду знать, что ты обо мне думал.']);
  heart(g,v);Save.write();playLines([L(g,v>=8?'b':v>=4?'s':v<0?'a':'n',line)],'market',cb)})}

// ---------- MARKET ----------
function scrMarket(el){if(!S.flags.market){el.innerHTML='<div class="empty">Рынок откроется, когда деревня узнает о тебе.<br>Продолжай задания.</div>';return}
 const ev=MEVENTS.find(e=>e.id===S.market.ev);const W=S.market.wander;
 el.innerHTML=`${ev?`<div class="card glow" style="border-color:#ff9a4a66"><b>📢 ${ev.t}</b><div class="mut">${ev.d}</div></div>`:''}
 <div class="tabs2"><button class="${UI.mkTab==='sell'?'on':''}" data-t="sell">💰 Продать</button><button class="${UI.mkTab==='buy'?'on':''}" data-t="buy">🛒 Лавка Лиоры</button>${W?`<button class="${UI.mkTab==='hodja'?'on':''}" data-t="hodja">🐫 Ходжа</button>`:''}</div><div id="mk"></div>`;
 $$('[data-t]',el).forEach(b=>b.onclick=()=>{UI.mkTab=b.dataset.t;render()});if(UI.mkTab==='hodja'&&!W)UI.mkTab='sell';
 const mk=$('#mk',el);
 if(UI.mkTab==='sell'){const ks=Object.keys(S.inv).filter(SELLABLE).sort((a,b)=>(b.includes('#')-a.includes('#'))||sellPrice(b)-sellPrice(a));
  mk.innerHTML=ks.length?`<div class="mut" style="margin-bottom:6px">Цена падает с каждой проданной штукой одного товара за день. ▲▼ — изменение со вчера.</div>`+ks.map(k=>{const [id]=k.split('#');const t=trend(id);return `<div class="card row" style="padding:8px 10px;margin-bottom:6px"><div style="font-size:26px;width:34px;text-align:center">${itemEmoji(k)}</div><div class="grow"><div class="r${itemRar(k)}" style="font-weight:600;font-size:13.5px">${itemName(k)} ${k.includes('#')?QSTAR[+k.split('#')[1]]:''}</div><div class="small"><span class="price">${fmt(sellPrice(k))}💰</span> <span class="${t>0?'up':t<0?'dn':'mut'}">${t>0?'▲':t<0?'▼':'•'}</span> <span class="mut">· есть ${S.inv[k]}</span></div></div><button class="btn sm sec" data-s1="${k}">1</button><button class="btn sm" data-sa="${k}">Все</button></div>`}).join(''):'<div class="empty">Нечего продавать. Свари зелья или собери урожай.</div>';
  $$('[data-s1]',mk).forEach(b=>b.onclick=()=>{const g=sell(b.dataset.s1,1);toast(`+${fmt(g)}💰`);Save.write();render()});
  $$('[data-sa]',mk).forEach(b=>b.onclick=async()=>{const k=b.dataset.sa;const n=S.inv[k];let est=0;for(let i=0;i<n;i++)est+=sellPrice(k,i);if(itemRar(k)>=3&&!await confirmBox(`Продать ${n}× ${itemName(k)} за ~${fmt(est)}💰? Редкая вещь.`,'Продать'))return;const g=sell(k,n);toast(`+${fmt(g)}💰`,'gold');Save.write();render()})}
 if(UI.mkTab==='buy'||UI.mkTab==='hodja'){const st=UI.mkTab==='buy'?S.market.stock:W;
  mk.innerHTML=(UI.mkTab==='hodja'?`<div class="card row" style="padding:8px"><div class="por-mini">${portrait('hodja',null,{noGlow:1})}</div><div class="grow serif">«Ассаламу алейкум, уважаемый! У Ходжи есть всё, чего нет у других. И немного того, чего нет вообще».</div></div>`:`<div class="card row" style="padding:8px"><div class="por-mini">${portrait('liora',null,{noGlow:1})}</div><div class="grow serif">«${pick(['Смотри, но руками — только за деньги.','Сегодня у меня есть кое-что особенное.','Для тебя — почти честная цена.'])}»</div></div>`)+
  st.map((o,i)=>{let e,n,r,d='';if(o.k){e=itemEmoji(o.k);n=itemName(o.k);r=itemRar(o.k);d=(ITEMS[o.k]||{}).d||''}else if(o.chest){e='📦';n=CHESTS[o.chest].n;r=o.chest==='wood'?0:o.chest==='iron'?1:2;d='Внутри — что угодно. Даже легенда.'}else if(o.relic){e=RELICS[o.relic].e;n=RELICS[o.relic].n;r=RELICS[o.relic].r;d=RELICS[o.relic].d}else if(o.book){e=BOOKS[o.book].e;n=BOOKS[o.book].n;r=BOOKS[o.book].r;d=BOOKS[o.book].eff}else if(o.bag){e='👝';n='Мешок наугад';r=3;d='От мусора до мифа. Азарт — бесплатно.'}
   const price=Math.round(o.p*(o.relic||o.bag?1:buyMult()));return `<div class="card row" style="padding:8px 10px;margin-bottom:6px;${o.lot||o.secret?'border-color:#e8b85a66':''}"><div style="font-size:26px;width:34px;text-align:center">${e}</div><div class="grow"><div class="r${r}" style="font-weight:600;font-size:13.5px">${n} ${o.lot?'<span class="tag g">лот дня</span>':''}${o.secret?'<span class="tag g">тайный</span>':''}</div><div class="mut small">${d}</div><div class="small"><span class="price">${fmt(price)}💰</span> ${o.q<50?`<span class="mut">· осталось ${o.q}</span>`:''}</div></div><button class="btn sm" data-b="${i}" ${o.q<=0||S.gold<price?'disabled':''}>Купить</button></div>`}).join('');
  $$('[data-b]',mk).forEach(b=>b.onclick=()=>{const o=st[+b.dataset.b];const r=buy(o);if(r&&r.bag){showLoot('Мешок наугад',[r.bag])}Save.write();render()})}}

// ---------- QUESTS ----------
function scrQuests(el){const act=QUESTS.filter(q=>qActive(q.id));const done=QUESTS.filter(q=>qDone(q.id));
 el.innerHTML=`<h2 class="t">📜 Сюжет</h2>${act.map(q=>questCard(q)).join('')||(qDone('q15')?'<div class="card glow"><b class="serif">Акт I завершён.</b><div class="mut">Акт II «Тигель» — в разработке. А пока: прокачивайся, собирай легенды, завоёвывай сердца, выбивай мифику.</div></div>':'')}
 ${S.level>=2?`<h3 class="t">📋 Доска заказов</h3>${S.orders.map((o,i)=>{const have=elixCount(o.rid,o.q);return `<div class="card row" style="padding:8px"><div style="font-size:24px">${RECIPES[o.rid].e}</div><div class="grow small"><b>${o.npc}</b>: ${RECIPES[o.rid].n} ×${o.n}${o.q?` <span class="r${o.q}">${QN[o.q]}+</span>`:''}<div class="mut">${fmt(o.gold)}💰${o.chest?' · 📦':''}${o.girl?' · 💗':''}</div></div><button class="btn sm" data-o="${i}" ${have<o.n?'disabled':''}>${have}/${o.n}</button></div>`}).join('')||'<div class="mut">Пусто. Новые заказы — через пару дней.</div>'}`:''}
 <h3 class="t">💗 Сердца</h3>${Object.keys(ROMANCE).filter(girlAvail).map(g=>{const ev=nextRomance(g);const nx=ROMANCE[g][S.hev[g]||0];return `<div class="card row" style="padding:8px" data-g="${g}"><div class="por-mini">${portrait(g,null,{noGlow:1})}</div><div class="grow"><b style="color:${CHARS[g].col}">${CHARS[g].n}</b> ${ev?'<span class="tag g">событие!</span>':''}<div class="prog h"><i style="width:${S.hearts[g]}%"></i></div><div class="mut small">${nx?`Следующее событие: ${nx.at}💗`:'Все события пройдены'} · ${GIRL_LOC[g]==='village'?'Тихая Заводь':LOCS[GIRL_LOC[g]].n}</div></div></div>`}).join('')||'<div class="mut">Пока никого. Но это ненадолго.</div>'}
 ${done.length?`<h3 class="t">✓ Выполнено</h3><div class="mut">${done.map(q=>`Гл.${q.ch} · ${q.t}`).join('<br>')}</div>`:''}`;
 bindQuestCard(el);$$('[data-g]',el).forEach(b=>b.onclick=()=>girlSheet(b.dataset.g));$$('[data-o]',el).forEach(b=>b.onclick=()=>{const o=S.orders[+b.dataset.o];if(fulfillOrder(o)){toast(`Заказ выполнен! +${fmt(o.gold)}💰`,'gold');Save.write();render()}})}

// ---------- HERO ----------
function scrHero(el){const tabs=[['bag','🎒 Сумка'],['tal','✦ Таланты'+(S.tp?` (${S.tp})`:'')],['books','📚 Книги'],['relics','💍 Реликвии'],['deck','🎴 Колода'],['girls','💗 Девушки'],['ach','🏆'],['set','⚙️']];
 el.innerHTML=`<div class="card row" style="padding:10px"><div style="width:96px;flex:none">${portrait('hero')}</div><div class="grow"><div class="serif" style="font-size:19px;color:var(--gold2)">${esc(S.name)}</div><div class="mut small">Ученик Феникса · ур. ${S.level}</div>
  <div class="small" style="margin-top:6px;line-height:1.6">🍀 Удача: <b>+${Math.round(luck()*100)}%</b><br>💰 Продажа: <b>+${Math.round((sellBonus()-1)*100)}%</b> · 🧬 Мутации: <b>${(mutChance()*100).toFixed(1)}%</b><br>⚡ Энергия: <b>${S.maxEnergy}</b> · ⚗️ Котёл ур. ${S.cauldron}</div></div></div>
  <div class="tabs2">${tabs.map(([id,n])=>`<button class="${UI.heroTab===id?'on':''}" data-t="${id}">${n}</button>`).join('')}</div><div id="ht"></div>`;
 $$('[data-t]',el).forEach(b=>b.onclick=()=>{UI.heroTab=b.dataset.t;render()});const ht=$('#ht',el);
 ({bag:heroBag,tal:heroTal,books:heroBooks,relics:heroRelics,deck:heroDeck,girls:heroGirls,ach:heroAch,set:heroSet})[UI.heroTab](ht)}
function heroBag(ht){const F=[['all','Всё'],['elix','Зелья'],['herb','Травы'],['seed','Семена'],['rare','Редкое'],['key','Ключи']];
 const ks=Object.keys(S.inv).filter(k=>{const [id,q]=k.split('#');const it=ITEMS[id];if(UI.bag==='all')return true;if(UI.bag==='elix')return q!==undefined;if(!it)return false;if(UI.bag==='herb')return['herb','wild','mut','mineral','beast'].includes(it.t);if(UI.bag==='seed')return it.t==='seed';if(UI.bag==='rare')return it.r>=3;if(UI.bag==='key')return it.t==='key'}).sort((a,b)=>itemRar(b)-itemRar(a));
 ht.innerHTML=`<div class="tabs2">${F.map(([id,n])=>`<button class="${UI.bag===id?'on':''}" data-f="${id}">${n}</button>`).join('')}</div><div class="grid g4">${ks.map(k=>tileItem(itemEmoji(k),itemName(k)+(k.includes('#')?' '+QSTAR[+k.split('#')[1]]:''),S.inv[k],itemRar(k),`data-k="${k}"`)).join('')}</div>${ks.length?'':'<div class="empty">Пусто</div>'}`;
 $$('[data-f]',ht).forEach(b=>b.onclick=()=>{UI.bag=b.dataset.f;render()});$$('[data-k]',ht).forEach(b=>b.onclick=()=>itemSheet(b.dataset.k))}
function itemSheet(k){const [id,q]=k.split('#');const isE=q!==undefined;const r=itemRar(k);const d=isE?RECIPES[id].d:ITEMS[id].d;
 const acts=[];if(isE&&RECIPES[id].drink)acts.push(`<button class="btn grow" data-a="drink">Выпить</button>`);if(SELLABLE(k)&&S.flags.market)acts.push(`<button class="btn sec grow" data-a="sell">Продать (${fmt(sellPrice(k))}💰)</button>`);
 if(k==='token')acts.push(`<button class="btn grow" data-a="wheel">К колесу</button>`);if(k==='pack')acts.push(`<button class="btn grow" data-a="pack">Открыть</button>`);if(CROPS[k])acts.push(`<button class="btn grow" data-a="plant">На грядку</button>`);
 const m=OV.open(`<div style="text-align:center"><div style="font-size:64px">${itemEmoji(k)}</div><div class="serif r${r}" style="font-size:20px">${itemName(k)} ${isE?QSTAR[+q]:''}</div><div class="r${r} small">${isE?QN[+q]+' качество':RAR[r]}</div><div class="serif" style="margin:10px 0">${d}</div><div class="mut">В сумке: ${S.inv[k]}</div></div><div class="row" style="margin-top:12px;flex-wrap:wrap">${acts.join('')}</div>`,{center:true});
 $$('[data-a]',m).forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='drink'){drink(k);OV.close(m);Save.write();render()}if(a==='sell'){const g=sell(k,1);toast(`+${fmt(g)}💰`);OV.close(m);Save.write();render()}
  if(a==='wheel'){OV.close(m);wheelUI()}if(a==='plant'){OV.closeAll();UI.tab='home';render()}if(a==='pack'){invAdd('pack',-1);const its=[];for(let i=0;i<3;i++){const rr=wpick([[0,45],[1,32],[2,16],[3,6],[4,1.2]],x=>lwt(x[0],x[1]))[0];const pool=Object.keys(CARDS).filter(c=>CARDS[c].r===rr&&!CARDS[c].npc);const c=pick(pool);S.cards[c]=(S.cards[c]||0)+1;its.push({kind:'card',id:c,n:1,r:rr})}OV.close(m);Save.write();showLoot('Колода-сюрприз',its,render)}})}
function heroTal(ht){const br=[...new Set(TALENTS.map(t=>t.br))];ht.innerHTML=`<div class="mut" style="margin-bottom:8px">Очков таланта: <b style="color:var(--gold2)">${S.tp}</b>. 1 очко за уровень.</div>`+br.map(b=>`<h3 class="t">${b}</h3>`+TALENTS.filter(t=>t.br===b).map(t=>`<div class="talent"><div class="em">${t.e}</div><div class="grow"><b>${t.n}</b><div class="mut small">${t.d}</div><div class="dots">${[...Array(t.max)].map((_,i)=>`<i class="${T(t.id)>i?'on':''}"></i>`).join('')}</div></div><button class="btn sm" data-t="${t.id}" ${!S.tp||T(t.id)>=t.max?'disabled':''}>＋</button></div>`).join('')).join('');
 $$('[data-t]',ht).forEach(b=>b.onclick=()=>{const id=b.dataset.t;if(!S.tp)return;S.talents[id]=T(id)+1;S.tp--;S.maxEnergy=maxEnergy();sfx('level');hap('success');Save.write();render()})}
function heroBooks(ht){const d=S.flags.diary||[];ht.innerHTML=(S.books.length?S.books.map(b=>{const B=BOOKS[b];return `<div class="book"><div class="em">${B.e}</div><div class="grow"><b class="r${B.r}">${B.n}</b><div class="serif small" style="font-style:italic;color:#d8cfc0">${B.d}</div><div class="small up">${B.eff}</div></div></div>`}).join(''):'<div class="empty">Книг пока нет</div>')+
 `<h3 class="t">📜 Дневник Мастера (${d.length}/7)</h3>`+[1,2,3,4,5,6,7].map(n=>d.includes(n)?`<div class="book" style="border-color:#e8b85a55"><div class="em">📜</div><div class="serif small">${DIARY[n-1]}</div></div>`:`<div class="book" style="opacity:.4"><div class="em">❔</div><div class="mut small">Страница ${n} утеряна...</div></div>`).join('')+
 `<h3 class="t">🧪 Рецепты (${S.recipes.length})</h3><div class="mut small">${S.recipes.map(r=>RECIPES[r].e+' '+RECIPES[r].n).join(' · ')}</div>`}
function heroRelics(ht){ht.innerHTML=`<div class="mut" style="margin-bottom:8px">Слоты: ${S.equip.length}/${S.relicSlots}. Реликвии — легендарные предметы из сундуков и от Ходжи.</div>`+(S.relics.length?S.relics.map(r=>{const R=RELICS[r];const on=S.equip.includes(r);return `<div class="card row ${on?'glow':''}" style="padding:10px"><div style="font-size:34px">${R.e}</div><div class="grow"><b class="r${R.r}">${R.n}</b><div class="small">${R.d}</div></div><button class="btn sm ${on?'sec':''}" data-r="${r}">${on?'Снять':'Надеть'}</button></div>`}).join(''):`<div class="empty">Реликвий нет. Их шанс — доли процента. Но кому-то везёт...</div>`)+
 (S.equip.includes('fish')?`<button class="btn wide" data-wish ${S.day-S.wishDay<7?'disabled':''}>🐠 Загадать желание ${S.day-S.wishDay<7?`(через ${7-(S.day-S.wishDay)} дн.)`:''}</button>`:'');
 $$('[data-r]',ht).forEach(b=>b.onclick=()=>{const r=b.dataset.r;if(S.equip.includes(r))S.equip=S.equip.filter(x=>x!==r);else{if(S.equip.length>=S.relicSlots){toast('Все слоты заняты','bad');return}S.equip.push(r)}S.maxEnergy=maxEnergy();Save.write();render()});
 const w=$('[data-wish]',ht);if(w)w.onclick=()=>{const m=OV.open(`<h2 class="t">🐠 «Чего тебе надобно?»</h2><div class="col"><button class="btn" data-w="gold">💰 Богатства (2000)</button><button class="btn" data-w="chest">📦 Сундук (Золотой + ключ)</button><button class="btn" data-w="luck">🍀 Удачи (+50% на день)</button></div>`,{center:true});
  $$('[data-w]',m).forEach(b=>b.onclick=()=>{const x=b.dataset.w;S.wishDay=S.day;if(x==='gold')gold(2000);if(x==='chest'){S.chests.gold=(S.chests.gold||0)+1;invAdd('key_gold',1)}if(x==='luck')S.buffs.luck=.5;OV.close(m);toast('Рыбка плеснула хвостом. Желание исполнено.','leg');Save.write();render()})}}
function heroDeck(ht){if(!S.flags.cards){ht.innerHTML='<div class="empty">Ты ещё не знаешь Пепельный Гамбит.</div>';return}deckUI(ht)}
function deckUI(host){const inDeck={};S.deck.forEach(c=>inDeck[c]=(inDeck[c]||0)+1);const owned=Object.keys(S.cards).filter(c=>S.cards[c]>0).sort((a,b)=>CARDS[b].r-CARDS[a].r||(CARDS[b].p||0)-(CARDS[a].p||0));
 const html=`<div class="mut" style="margin-bottom:6px">Колода: <b>${S.deck.length}</b> карт (15–25). Нажми карту в коллекции — добавить, в колоде — убрать.</div><h3 class="t">В колоде</h3><div class="hand" style="flex-wrap:wrap;overflow:visible">${Object.keys(inDeck).map(c=>bigCard({id:c},false,`data-rm="${c}"`,'×'+inDeck[c])).join('')}</div>
  <h3 class="t">Коллекция</h3><div class="hand" style="flex-wrap:wrap;overflow:visible">${owned.map(c=>{const free=S.cards[c]-(inDeck[c]||0);return bigCard({id:c},false,`data-add="${c}" style="opacity:${free>0?1:.35}"`,free+'/'+S.cards[c])}).join('')}</div>`;
 const tgt=host||OV.open(`<h2 class="t">🎴 Колода</h2><div id="dk"></div>`).querySelector('#dk');tgt.innerHTML=html;
 $$('[data-rm]',tgt).forEach(b=>b.onclick=()=>{const c=b.dataset.rm;if(S.deck.length<=15){toast('Минимум 15 карт','bad');return}S.deck.splice(S.deck.indexOf(c),1);Save.write();deckUI(host||tgt)});
 $$('[data-add]',tgt).forEach(b=>b.onclick=()=>{const c=b.dataset.add;const free=S.cards[c]-(inDeck[c]||0);if(free<=0)return;if(S.deck.length>=25){toast('Максимум 25 карт','bad');return}S.deck.push(c);Save.write();deckUI(host||tgt)})}
function heroGirls(ht){const gs=Object.keys(ROMANCE).filter(girlAvail);ht.innerHTML=gs.length?`<div class="grid g2">${gs.map(g=>`<div class="card" style="padding:6px;text-align:center" data-g="${g}"><div>${portrait(g)}</div><b style="color:${CHARS[g].col}">${CHARS[g].n}</b><div class="prog h" style="margin:4px 6px"><i style="width:${S.hearts[g]}%"></i></div><div class="small">💗 ${S.hearts[g]} ${nextRomance(g)?'· <span class="up">событие!</span>':''}</div></div>`).join('')}</div>`:'<div class="empty">Сюжет ещё сведёт тебя кое с кем...</div>';
 $$('[data-g]',ht).forEach(b=>b.onclick=()=>girlSheet(b.dataset.g))}
function heroAch(ht){const s=S.stats;ht.innerHTML=`<div class="card small" style="line-height:1.7">⚗️ Сварено: ${s.brewed} · 💥 Взрывов: ${s.boom} · ⭐ Шедевров+: ${s.mastery}<br>🌾 Собрано: ${s.harvest} · ✨ Мутаций: ${s.mut}<br>🎒 Вылазок: ${s.explore} · ⚔️ Схваток: ${s.fights}<br>📦 Сундуков: ${s.chests} · 🌟 Легенд: ${s.legend}<br>💰 Заработано: ${fmt(s.earned)} · 🃏 Гамбит: ${s.cardW}/${s.cardL}</div>`+
 Object.keys(ACH).map(a=>`<div class="card row ach ${S.ach[a]?'got':''}" style="padding:8px"><div style="font-size:24px">${S.ach[a]?'🏆':'🔒'}</div><div class="grow"><b>${ACH[a].n}</b><div class="mut small">${ACH[a].d}</div></div><span class="price small">${ACH[a].g}💰</span></div>`).join('')}
function heroSet(ht){ht.innerHTML=`<div class="card"><div class="row"><span class="grow">🔊 Звук</span><button class="btn sm sec" data-s="sound">${S.settings.sound?'Вкл':'Выкл'}</button></div><div class="sep"></div><div class="row"><span class="grow">⏩ Быстрый текст и анимации</span><button class="btn sm sec" data-s="fastText">${S.settings.fastText?'Вкл':'Выкл'}</button></div></div>
 <div class="card"><b>💾 Сохранение</b><div class="mut small" style="margin:4px 0 8px">Игра сохраняется сама после каждого действия${Save.cloud?' — и в облако':''}. Код ниже — резервная копия: сохрани его в Заметках.</div>
  <textarea class="code" id="exp" readonly>${Save.exportCode()}</textarea><div class="row" style="margin-top:6px"><button class="btn sm grow" data-copy>Скопировать</button></div>
  <div class="sep"></div><textarea class="code" id="imp" placeholder="Вставь код сохранения сюда"></textarea><button class="btn sm sec wide" data-imp style="margin-top:6px">Загрузить из кода</button></div>
 <div class="card"><button class="btn red wide" data-reset>Начать заново</button></div><div class="mut small" style="text-align:center">Пепел Мастера · v1.0 · Акт I</div>`;
 $$('[data-s]',ht).forEach(b=>b.onclick=()=>{S.settings[b.dataset.s]=!S.settings[b.dataset.s];Save.write();render()});
 $('[data-copy]',ht).onclick=async()=>{const t=$('#exp',ht);try{await navigator.clipboard.writeText(t.value);toast('Скопировано')}catch(e){t.select();toast('Выдели и скопируй вручную')}};
 $('[data-imp]',ht).onclick=async()=>{try{const st=Save.importCode($('#imp',ht).value);if(await confirmBox('Заменить текущий прогресс этим сохранением?','Загрузить')){S=migrate(st);Save.write();render();toast('Загружено','gold')}}catch(e){toast('Неверный код','bad')}};
 $('[data-reset]',ht).onclick=async()=>{if(await confirmBox('Стереть весь прогресс и начать заново?','Стереть')&&await confirmBox('Точно? Это необратимо.','Да, стереть')){Save.wipe();S=null;OV.closeAll();titleScreen()}}}

// ---------- title / new game ----------
function titleScreen(){const has=!!Save.readLocal();const m=OV.open(`<div class="title-screen"><div style="font-size:56px;filter:drop-shadow(0 0 20px #ff6a2b)">🔥</div><div class="logo">ПЕПЕЛ<br>МАСТЕРА</div><div class="logo-sub">сага алхимика</div>
  <div style="height:40px"></div>${has?'<button class="btn wide" style="max-width:300px;padding:14px" data-cont>Продолжить</button><div style="height:10px"></div>':''}<button class="btn ${has?'sec':''} wide" style="max-width:300px;padding:14px" data-new>Новая игра</button>
  <div class="mut small" style="position:absolute;bottom:calc(var(--sab) + 14px)">Нажми, чтобы включить звук 🔊</div></div>`,{full:true});
 const c=$('[data-cont]',m);if(c)c.onclick=()=>{ac();S=migrate(Save.readLocal());OV.close(m);boot2()};
 $('[data-new]',m).onclick=async()=>{ac();if(has&&!await confirmBox('Начать новую игру? Текущий прогресс будет стёрт.','Начать'))return;OV.close(m);nameScreen()}}
function nameScreen(){const m=OV.open(`<div class="title-screen"><div class="serif" style="font-size:18px;color:#d8b98a;margin-bottom:16px">Как звали ученика Феникса?</div><input class="name" maxlength="16" value="Рейн" id="nm"><div style="height:20px"></div><button class="btn wide" style="max-width:300px;padding:14px" data-go>Начать</button></div>`,{full:true});
 $('[data-go]',m).onclick=()=>{const n=($('#nm',m).value||'Рейн').trim().slice(0,16)||'Рейн';S=newState(n);initMarket();S.maxEnergy=maxEnergy();OV.close(m);Save.write();
  playScene('prologue',()=>playScene('wake',()=>{beginQuest('q1');boot2()}))}}
function boot2(){S.maxEnergy=maxEnergy();if(!Object.keys(S.market.p).length)initMarket();render()}
