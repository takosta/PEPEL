// ====== BATTLE ======
function startBattle(foeId,onEnd){const F=FOES[foeId];const pm=80+S.level*6;
  const B={foe:F,id:foeId,ehp:F.hp,emax:F.hp,php:pm,pmax:pm,might:0,stone:0,dodge:0,smoke:0,stun:0,hex:0,used:{},turn:0,busy:false,log:'Схватка начинается!'};
  const m=OV.open(`<div class="bt" id="bt"></div>`,{full:true});
  const allies=[];if(hp('aira',30)||F.story)allies.push({g:'aira',n:'Алый Взмах',d:'30–40 урона'});if((hp('seylin',30)||F.story)&&S.flags.seylin_met)allies.push({g:'seylin',n:'Шквал стрел',d:'3 × 10–14'});
  if((hp('velena',30)||F.story)&&S.flags.velena_met)allies.push({g:'velena',n:'Сглаз',d:'Враг слабее на 40%'});if(hp('liora',30))allies.push({g:'liora',n:'Золотой порошок',d:'Враг пропускает 2 хода'});
  const dmgMult=()=>(1+T('phoenix')*.12)*(B.might?1.6:1);
  function pop(txt,cls,who){const el=document.createElement('div');el.className='dmg '+(cls||'');el.textContent=txt;const tgt=$(who==='e'?'#bt-e':'#bt-p',m);if(!tgt)return;const r=tgt.getBoundingClientRect();el.style.left=(r.left+r.width/2-30+ri(-20,20))+'px';el.style.top=(r.top+r.height*.3)+'px';el.style.position='fixed';document.body.appendChild(el);setTimeout(()=>el.remove(),1000)}
  function render(){const acts=[];acts.push(`<button class="btn" data-a="hit">⚔️ Удар</button>`);
    for(const rid in RECIPES){const r=RECIPES[rid];if(!r.bat)continue;const c=elixCount(rid);if(c)acts.push(`<button class="btn sec" data-a="e:${rid}">${r.e} ${r.n.split(' ').slice(0,2).join(' ')} <span class="mut">×${c}</span></button>`)}
    for(const a of allies)if(!B.used[a.g])acts.push(`<button class="btn sec" data-a="g:${a.g}" style="border-color:${CHARS[a.g].col}">💗 ${CHARS[a.g].n}: ${a.n}</button>`);
    if(!F.story)acts.push(`<button class="btn sec" data-a="run">🏃 Бежать</button>`);
    $('#bt',m).innerHTML=`<div style="text-align:center"><div class="serif" style="font-size:20px;color:#ffb0a0">${F.n}</div><div class="hpbar" style="margin:6px 20px"><i style="width:${B.ehp/B.emax*100}%"></i></div><div class="mut">${Math.max(0,B.ehp)} / ${B.emax} ${B.stun?'· 💫 оглушён':''}${B.hex?' · 🌙 сглаз':''}${B.smoke?' · 💨 ослеплён':''}</div></div>
    <div id="bt-e" style="flex:1;display:flex;align-items:center;justify-content:center;min-height:0">${F.por?`<div style="width:min(70vw,260px)">${portrait(F.por,B.ehp<B.emax*.3?'x':'a')}</div>`:`<div style="font-size:120px;filter:drop-shadow(0 0 30px #f00)">${F.e}</div>`}</div>
    <div class="blog">${B.log}</div>
    <div id="bt-p" class="row" style="margin:8px 0"><div class="por-mini">${portrait('hero',B.php<B.pmax*.3?'a':'k',{noGlow:1})}</div><div class="grow"><b>${S.name}</b> ${B.might?'💪':''}${B.stone?'🪨':''}${B.dodge?'🌑':''}<div class="hpbar me"><i style="width:${B.php/B.pmax*100}%"></i></div><div class="mut">${Math.max(0,B.php)} / ${B.pmax}</div></div></div>
    <div class="grid g2" style="max-height:34vh;overflow-y:auto">${acts.join('')}</div>`;
    $$('[data-a]',m).forEach(b=>b.onclick=()=>act(b.dataset.a))}
  async function act(a){if(B.busy)return;B.busy=true;let msg='';
    if(a==='hit'){let d=Math.round((ri(8,14)+S.level*1.3)*dmgMult());const cr=chance(.13);if(cr)d=Math.round(d*1.8);B.ehp-=d;pop((cr?'КРИТ! ':'')+d,cr?'crit':'','e');sfx('hit');hap(cr?'heavy':'medium');msg=cr?`Сокрушительный удар! ${d} урона.`:`Ты бьёшь на ${d}.`}
    else if(a.startsWith('e:')){const rid=a.slice(2);const q=bestElix(rid);invAdd(rid+'#'+q,-1);const e=RECIPES[rid].bat;const qm=1+q*.15;
      if(e.heal){const h=Math.min(B.pmax-B.php,Math.round(e.heal*qm));B.php+=h;pop('+'+h,'heal','p');sfx('heal');msg=`${RECIPES[rid].n}: +${h} здоровья.`}
      if(e.dmg){const d=Math.round(ri(e.dmg[0],e.dmg[1])*qm*(1+T('phoenix')*.12));B.ehp-=d;pop(d,'crit','e');sfx('boom');hap('heavy');msg=`${RECIPES[rid].n}! ${d} урона.`}
      if(e.smoke){B.smoke=2;msg='Облако едкого дыма! Враг ничего не видит.'}if(e.might){B.might=e.might;msg='Сила богатыря наполняет мышцы!'}if(e.stone){B.stone=e.stone;msg='Кожа твердеет, как гранит.'}
      if(e.dodge){B.dodge=e.dodge;msg='Ты сливаешься с тенью.'}if(e.stun){B.stun=e.stun;msg+=' Враг оглушён!'}}
    else if(a.startsWith('g:')){const g=a.slice(2);B.used[g]=1;sfx('heart');
      if(g==='aira'){const d=ri(30,40);B.ehp-=d;pop(d,'crit','e');msg=`Айра врывается алым вихрем: «Не смей трогать моего алхимика!» ${d} урона.`}
      if(g==='seylin'){let t=0;for(let i=0;i<3;i++)t+=ri(10,14);B.ehp-=t;pop(t,'crit','e');msg=`Три стрелы Сэйлин поют в воздухе. ${t} урона.`}
      if(g==='velena'){B.hex=4;msg='Велена шепчет проклятие. Враг слабеет на глазах.'}
      if(g==='liora'){B.stun=2;msg='Лиора швыряет горсть золотой пыли врагу в глаза: «За счёт заведения!»'}}
    else if(a==='run'){if(chance(.6+(hasBook('b_kolobok')?.3:0))){OV.close(m);toast('Ты сбежал. Колобок бы гордился.');onEnd&&onEnd(false);return}msg='Сбежать не удалось!'}
    B.log=msg;if(B.might)B.might--;render();await sleepMs(650);
    if(B.ehp<=0){return finish(true)}
    B.turn++;let em='';
    if(B.stun){B.stun--;em='Враг приходит в себя...'}
    else if(B.smoke&&chance(.75)){em='Враг бьёт мимо, кашляя в дыму.'}
    else if(B.dodge&&chance(.7)){em='Удар проходит сквозь тень.'}
    else{let d,sp=false;if(F.sp&&B.turn%F.sp.every===0){d=ri(F.sp.dmg[0],F.sp.dmg[1]);sp=true}else d=ri(F.atk[0],F.atk[1]);if(B.hex)d=Math.round(d*.6);if(B.stone)d=Math.round(d*.5);B.php-=d;pop(d,'','p');sfx('hit');hap('heavy');$('#bt',m).classList.add('shake');setTimeout(()=>$('#bt',m)&&$('#bt',m).classList.remove('shake'),500);em=sp?`${F.sp.t} ${d} урона!`:`${F.n} бьёт на ${d}.`}
    if(B.smoke)B.smoke--;if(B.dodge)B.dodge--;if(B.stone)B.stone--;if(B.hex)B.hex--;
    B.log=msg+'<br>'+em;B.busy=false;render();if(B.php<=0)return finish(false)}
  function finish(win){OV.close(m);S.stats.fights++;
    if(win){let items=[];if(F.loot){const n=ri(2,3);for(let i=0;i<n;i++){const [k]=wpick(F.loot,x=>lwt(ITEMS[x[0]].r,x[1]));items.push({kind:'item',id:k,n:1,r:ITEMS[k].r})}const g=ri(20,60)+S.level*5;items.unshift({kind:'gold',n:g,r:0});applyLoot(items);if(chance(.15))S.chests.iron=(S.chests.iron||0)+1}
      gainXP(F.story?0:40+S.level*4);Bus.emit('fightwin',foeId);Save.write();
      if(items.length)showLoot('Победа!',items,()=>onEnd&&onEnd(true));else onEnd&&onEnd(true)}
    else{const g=Math.round(S.gold*.08);S.gold-=g;Save.write();OV.open(`<h2 class="t">Поражение</h2><p class="serif">Ты отступаешь, зализывая раны${g?`, и теряешь ${g}💰`:''}. Пепел учит терпению.</p>${F.story?'<p class="mut">Подготовь больше боевых эликсиров (Жидкий огонь, Целебные зелья, Дымовые бомбы) и попробуй снова из журнала заданий.</p>':''}<button class="btn wide" data-x>Понятно</button>`,{center:true,onClose:()=>onEnd&&onEnd(false)})}}
  render()}

// ====== CARD GAME: «Пепельный Гамбит» ======
let G=null;let _cu=0;
const CI=id=>({id,u:++_cu,mod:0});
function cardVal(side,row,c){const C=CARDS[c.id];if(C.row==='s'&&C.ab==='decoy')return 0;const hero=C.ab==='hero';let v=C.p;const R=G[side].rows[row];
  if(!hero){if(G.weather[row])v=1;v+=c.mod;const bc=R.filter(x=>x.id===c.id).length;if(C.ab==='bond'&&bc>1)v*=bc;
    const mor=R.filter(x=>x!==c&&(CARDS[x.id].ab==='morale'||CARDS[x.id].x==='morale')).length;v+=mor;if(G[side].horn[row])v*=2}
  return Math.max(0,v)}
const rowSum=(side,row)=>G[side].rows[row].reduce((a,c)=>a+cardVal(side,row,c),0);
const total=side=>rowSum(side,'f')+rowSum(side,'b');
function startCards(oppId,onEnd){const O=OPPS[oppId];
  if(S.deck.length<15){toast('В колоде должно быть минимум 15 карт','bad');return}
  if(O.stake){if(S.gold<O.stake){toast(`Ставка ${O.stake}💰 — не хватает золота`,'bad');return}S.gold-=O.stake}
  const hs=10+(hasRelic('gusli')?1:0)+(hasBook('b_gambit')?1:0);
  const mk=(deck,n)=>{const d=shuffle(deck.map(CI));return{deck:d,hand:d.splice(0,n),rows:{f:[],b:[]},horn:{f:false,b:false},disc:[],lives:2,passed:false}};
  G={opp:oppId,O,me:mk(S.deck,hs),ai:mk(O.deck,10+(O.lvl>=3?1:0)),weather:{f:false,b:false},round:1,turn:'me',sel:null,mode:null,msg:'Твой ход. Выбери карту.',onEnd,over:false};
  const m=OV.open('<div class="gw" id="gw"></div>',{full:true});G.m=m;renderGW()}
function draw(side,n){for(let i=0;i<n&&G[side].deck.length;i++)G[side].hand.push(G[side].deck.shift())}
function playCard(side,c,row,target){const P=G[side],E=G[side==='me'?'ai':'me'];const C=CARDS[c.id];P.hand=P.hand.filter(x=>x!==c);
  const ab=C.ab;
  if(C.row==='s'){
    if(ab==='frost'){G.weather.f=true;P.disc.push(c)}else if(ab==='fog'){G.weather.b=true;P.disc.push(c)}else if(ab==='clear'){G.weather.f=G.weather.b=false;P.disc.push(c)}
    else if(ab==='horn'){P.horn[row]=true;P.disc.push(c)}
    else if(ab==='scorch'){let mx=0;const all=[];for(const s of ['me','ai'])for(const r of ['f','b'])for(const x of G[s].rows[r]){if(CARDS[x.id].ab==='hero'||CARDS[x.id].row==='s')continue;const v=cardVal(s,r,x);all.push([s,r,x,v]);mx=Math.max(mx,v)}
      if(mx>0)for(const [s,r,x,v] of all)if(v===mx){G[s].rows[r]=G[s].rows[r].filter(y=>y!==x);G[s].disc.push(x)}P.disc.push(c);return mx}
    else if(ab==='buff'){if(target)target.c.mod+=4;P.disc.push(c)}
    else if(ab==='poison'){if(target){target.c.mod-=5;const base=CARDS[target.c.id].p+target.c.mod;if(base<=0){const s=target.side;G[s].rows[target.row]=G[s].rows[target.row].filter(y=>y!==target.c);G[s].disc.push(target.c)}}P.disc.push(c)}
    else if(ab==='decoy'){if(target){P.rows[target.row]=P.rows[target.row].filter(y=>y!==target.c);target.c.mod=0;P.hand.push(target.c);P.rows[target.row].push(c)}else P.disc.push(c)}
    return}
  const r=C.row==='a'?(row||'f'):C.row;
  if(ab==='spy'){E.rows[r].push(c);draw(side,2)}else P.rows[r].push(c);
  if(ab==='medic'||C.x==='medic'){const cand=P.disc.filter(x=>CARDS[x.id].row!=='s'&&CARDS[x.id].ab!=='hero');if(cand.length){cand.sort((a,b)=>CARDS[b.id].p-CARDS[a.id].p);const rv=cand[0];P.disc=P.disc.filter(x=>x!==rv);rv.mod=0;const rr=CARDS[rv.id].row==='a'?'f':CARDS[rv.id].row;if(CARDS[rv.id].ab==='spy'){E.rows[rr].push(rv);draw(side,2)}else P.rows[rr].push(rv)}}
  if(C.x==='draw')draw(side,1)}
function needsTarget(c){const ab=CARDS[c.id].ab;return ab==='buff'||ab==='poison'||ab==='decoy'||ab==='horn'||CARDS[c.id].row==='a'}
function validTargets(side,c){const ab=CARDS[c.id].ab;const out=[];const own=side,opp=side==='me'?'ai':'me';
  const units=(s)=>{for(const r of ['f','b'])for(const x of G[s].rows[r])if(CARDS[x.id].ab!=='hero'&&CARDS[x.id].row!=='s')out.push({side:s,row:r,c:x})};
  if(ab==='buff'||ab==='decoy')units(own);if(ab==='poison')units(opp);return out}
function cardTip(c){const C=CARDS[c.id];let t=`<b class="r${C.r}">${C.e} ${C.n}</b>`;if(C.p!==undefined&&C.row!=='s')t+=` · сила ${C.p} · ${C.row==='f'?'авангард':C.row==='b'?'тыл':'любой ряд'}`;
  const ab=C.ab&&AB_TXT[C.ab]?AB_TXT[C.ab]:'';const x=C.x&&AB_TXT[C.x]?' '+AB_TXT[C.x]:'';t+=`<div class="mut">${ab}${x}${C.d?' '+C.d:''}</div>`;return t}
function miniCard(side,row,c,tgt){const C=CARDS[c.id];const v=cardVal(side,row,c);const cls=(C.ab==='hero'?'hero ':'')+(v>C.p?'up ':v<C.p?'dn ':'')+(tgt?'tgt':'');return `<div class="mc ${cls}" data-u="${c.u}" data-s="${side}" data-r="${row}"><span class="p">${C.row==='s'?'':v}</span>${C.e}</div>`}
function bigCard(c,sel,attr,badge){const C=CARDS[c.id];const sp=C.row==='s';return `<div class="gc ${C.ab==='hero'?'hero':''} ${sp?'sp':''} ${sel?'sel':''}" ${attr||`data-h="${c.u}"`}>${badge?`<span style="position:absolute;top:2px;right:4px;font-size:11px;font-weight:800;color:var(--gold2)">${badge}</span>`:''}${sp?'':`<span class="p">${C.p}</span>`}<div class="art">${C.e}</div><div class="n">${C.n}</div>${C.ab?`<span class="ab">${AB_ICON[C.ab]||''}</span>`:''}${!sp?`<span class="rr">${C.row==='f'?'⚔':C.row==='b'?'🏹':'↕'}</span>`:''}</div>`}
function renderGW(){if(!G||G.over)return;const m=G.m;const tg=G.mode&&G.mode.targets||[];const isT=(s,r,c)=>tg.some(t=>t.c===c);
  const rowH=(side,row)=>{const wt=G.weather[row];const rowTgt=G.mode&&G.mode.rows&&side==='me'&&G.mode.rows.includes(row);
    return `<div class="rw ${wt?'wthr':''} ${rowTgt?'tgt':''}" data-row="${side}:${row}"><div class="rs">${rowSum(side,row)}</div><div class="rc">${G[side].rows[row].map(c=>miniCard(side,row,c,isT(side,row,c))).join('')}</div>${G[side].horn[row]?'<span class="horn">📯</span>':''}${wt?`<span class="horn" style="right:${G[side].horn[row]?20:4}px">${row==='f'?'❄️':'🦔'}</span>`:''}</div>`};
  const lives=n=>`<span class="lives"><i class="${n<1?'off':''}"></i><i class="${n<2?'off':''}"></i></span>`;
  const sel=G.sel?G.me.hand.find(x=>x.u===G.sel):null;
  m.querySelector('#gw').innerHTML=`<div class="side"><div class="por-mini" style="width:40px;height:40px">${portrait(G.O.por,'k',{noGlow:1})}</div><div class="grow"><b>${G.O.n}</b> ${lives(G.ai.lives)}<div class="mut">🂠 ${G.ai.hand.length} карт ${G.ai.passed?'· <b style="color:#ff9a7a">ПАС</b>':''}</div></div><div class="tot">${total('ai')}</div></div>
   <div class="rows">${rowH('ai','b')}${rowH('ai','f')}<div class="mid"></div>${rowH('me','f')}${rowH('me','b')}</div>
   <div class="side"><div class="grow"><b>${S.name}</b> ${lives(G.me.lives)} <span class="mut">· колода ${G.me.deck.length} ${G.me.passed?'· <b style="color:#ff9a7a">ПАС</b>':''}</span></div><div class="tot">${total('me')}</div></div>
   <div class="bar"><div class="msg">${sel?cardTip(sel):G.msg}</div></div>
   <div class="hand">${G.me.hand.map(c=>bigCard(c,c.u===G.sel)).join('')||'<div class="mut" style="padding:30px">Карты кончились</div>'}</div>
   <div class="bar">${G.mode&&G.mode.rows?`<button class="btn sm grow" data-rowpick="f">⚔ Авангард</button><button class="btn sm grow" data-rowpick="b">🏹 Тыл</button>`:''}${sel&&!G.mode?`<button class="btn sm grow" data-play>Сыграть</button>`:''}${G.mode?`<button class="btn sm sec" data-cancel>Отмена</button>`:''}<button class="btn sm red" data-pass ${G.turn!=='me'||G.me.passed?'disabled':''}>Пас</button><button class="btn sm sec" data-quit>✕</button></div>`;
  $$('[data-h]',m).forEach(el=>el.onclick=()=>{if(G.turn!=='me'||G.me.passed)return;const u=+el.dataset.h;sfx('card');if(G.mode)G.mode=null;if(G.sel===u){tryPlay()}else{G.sel=u;renderGW()}});
  $$('.mc',m).forEach(el=>el.onclick=()=>{if(!G.mode||!G.mode.targets)return;const t=G.mode.targets.find(t=>t.c.u===+el.dataset.u);if(t)doPlay(G.mode.card,null,t)});
  $$('[data-rowpick]',m).forEach(b=>b.onclick=()=>doPlay(G.mode.card,b.dataset.rowpick));
  $$('[data-row]',m).forEach(el=>el.onclick=e=>{if(!G.mode||!G.mode.rows)return;const [s,r]=el.dataset.row.split(':');if(s==='me'&&G.mode.rows.includes(r)&&!e.target.closest('.mc'))doPlay(G.mode.card,r)});
  const pb=$('[data-play]',m);if(pb)pb.onclick=tryPlay;const cb=$('[data-cancel]',m);if(cb)cb.onclick=()=>{G.mode=null;renderGW()};
  $('[data-pass]',m).onclick=()=>{if(G.turn!=='me')return;G.me.passed=true;G.sel=null;G.mode=null;G.msg='Ты пасуешь.';sfx('click');afterMe()};
  $('[data-quit]',m).onclick=async()=>{if(await confirmBox('Сдаться? Ставка сгорит.','Сдаться','Играть')){G.over=true;OV.close(G.m);S.stats.cardL++;Save.write();G.onEnd&&G.onEnd(false)}}}
function tryPlay(){const c=G.me.hand.find(x=>x.u===G.sel);if(!c)return;const C=CARDS[c.id];
  if(C.row==='a'||C.ab==='horn'){G.mode={card:c,rows:C.ab==='horn'?['f','b'].filter(r=>!G.me.horn[r]):['f','b']};G.msg='Выбери ряд';renderGW();return}
  if(['buff','poison','decoy'].includes(C.ab)){const tg=validTargets('me',c);if(!tg.length){if(C.ab==='decoy'){toast('Нет карты, которую Барсик мог бы утащить');return}G.msg='Нет подходящих целей';renderGW();return}G.mode={card:c,targets:tg};G.msg='Выбери цель на поле';renderGW();return}
  doPlay(c)}
function doPlay(c,row,target){G.mode=null;G.sel=null;const C=CARDS[c.id];const sc=playCard('me',c,row,target);sfx(C.ab==='scorch'?'boom':'card');hap();G.msg=`Ты сыграл: ${C.e} ${C.n}${C.ab==='spy'?' — берёшь 2 карты':''}${C.ab==='scorch'&&sc?` — сожжено всё силой ${sc}`:''}`;afterMe()}
function afterMe(){if(!G.me.hand.length)G.me.passed=true;renderGW();if(G.me.passed&&G.ai.passed)return setTimeout(endRound,700);if(!G.ai.passed){G.turn='ai';renderGW();setTimeout(aiTurn,900)}else{G.turn='me';renderGW()}}
function aiTurn(){if(!G||G.over)return;const mv=aiChoose();if(!mv){G.ai.passed=true;G.msg=`${G.O.n} пасует.`}else{const C=CARDS[mv.c.id];const sc=playCard('ai',mv.c,mv.row,mv.target);sfx('card');G.msg=`${G.O.n}: ${C.e} ${C.n}${C.ab==='scorch'&&sc?` — сожжено всё силой ${sc}!`:''}`}
  if(!G.ai.hand.length)G.ai.passed=true;
  if(G.me.passed&&G.ai.passed){renderGW();return setTimeout(endRound,800)}
  if(G.me.passed){renderGW();return setTimeout(aiTurn,800)}G.turn='me';renderGW()}
function remap(mv){const c=G.ai.hand.find(x=>x.u===mv.c.u);let t=null;if(mv.target){const s=mv.target.side,r=mv.target.row;const cc=G[s].rows[r].find(x=>x.u===mv.target.c.u);t=cc?{side:s,row:r,c:cc}:null}return{c,row:mv.row,target:t,v:mv.v}}
function simDelta(mv){const snap=JSON.stringify({me:G.me,ai:G.ai,weather:G.weather});const b=total('ai')-total('me');
  const hand=G.ai.hand;const R=remap(mv);if(!R.c)return -99;
  playCard('ai',R.c,R.row,R.target);const a=total('ai')-total('me');const handGain=G.ai.hand.length-(hand.length-1);
  const st=JSON.parse(snap);G.me=st.me;G.ai=st.ai;G.weather=st.weather;return a-b+handGain*4.5}
function aiChoose(){const my=total('ai'),op=total('me');const P=G.ai;if(!P.hand.length)return null;
  const moves=[];for(const c of P.hand){const C=CARDS[c.id];
    if(C.ab==='buff'||C.ab==='decoy'){const t=validTargets('ai',c);if(!t.length)continue;if(C.ab==='decoy'){const sp=t.find(x=>CARDS[x.c.id].ab==='spy'||CARDS[x.c.id].ab==='medic');if(sp)moves.push({c,target:sp});continue}t.sort((a,b)=>cardVal(b.side,b.row,b.c)-cardVal(a.side,a.row,a.c));moves.push({c,target:t[0]});continue}
    if(C.ab==='poison'){const t=validTargets('ai',c);if(!t.length)continue;t.sort((a,b)=>cardVal(b.side,b.row,b.c)-cardVal(a.side,a.row,a.c));moves.push({c,target:t[0]});continue}
    if(C.ab==='horn'){for(const r of ['f','b'])if(!P.horn[r])moves.push({c,row:r});continue}
    if(C.row==='a'){moves.push({c,row:G.weather.f?'b':'f'});continue}moves.push({c})}
  if(!moves.length)return null;
  for(const mv of moves)mv.v=simDelta(mv);
  const lead=my-op;const handDiff=P.hand.length-G.me.hand.length;
  if(G.me.passed){if(lead>0)return null;const win=moves.filter(m=>m.v>-lead).sort((a,b)=>a.v-b.v);if(win.length)return remap(win[0]);if(P.lives===1)return remap(moves.sort((a,b)=>b.v-a.v)[0]);return null}
  if(G.round===1&&lead>=10&&handDiff<=0&&chance(.7))return null;
  if(G.round===1&&lead<=-18&&handDiff<0&&P.lives===2&&chance(.6))return null;
  if(lead>=15&&P.hand.length<=G.me.hand.length)return null;
  moves.sort((a,b)=>b.v-a.v);
  const lvl=G.O.lvl;const k=lvl>=3?0:lvl>=2?(chance(.8)?0:1):(chance(.6)?0:Math.min(moves.length-1,ri(0,2)));
  const pickM=moves[Math.min(k,moves.length-1)];if(pickM.v<=0&&G.round<3&&lead>0)return null;return remap(pickM)}
function endRound(){if(!G||G.over)return;const a=total('me'),b=total('ai');let res;
  if(a>b){G.ai.lives--;res='Раунд за тобой!';sfx('good')}else if(b>a){G.me.lives--;res=`Раунд за ${G.O.n}`;sfx('fail')}else{G.me.lives--;G.ai.lives--;res='Ничья — оба теряют жизнь'}
  for(const s of ['me','ai']){for(const r of ['f','b']){G[s].disc.push(...G[s].rows[r]);G[s].rows[r]=[];G[s].horn[r]=false}G[s].passed=false}G.weather={f:false,b:false};
  if(G.me.lives<=0||G.ai.lives<=0)return endMatch();
  G.round++;G.msg=`${res} (${a}:${b}). Раунд ${G.round}.`;G.turn=b>a?'me':(a>b?'ai':'me');toast(`${res} ${a}:${b}`);renderGW();
  if(G.turn==='ai')setTimeout(aiTurn,1200)}
function endMatch(){const win=G.ai.lives<=0&&G.me.lives>0;const draw_=G.ai.lives<=0&&G.me.lives<=0;G.over=true;OV.close(G.m);const O=G.O;const items=[];
  if(win){S.stats.cardW++;if(S.stats.cardW>=10)ach('card10');const g=Math.round(O.stake*2*(1+T('gambler')*.15));if(g){gold(g);items.push({kind:'gold',n:g,r:0})}gainXP(25+O.lvl*15);
    if(chance(.35+O.lvl*.08)){const r=wpick([[0,40-O.lvl*8],[1,35],[2,18+O.lvl*3],[3,5+O.lvl*3],[4,.6+O.lvl]],x=>lwt(x[0],x[1]))[0];const pool=Object.keys(CARDS).filter(c=>CARDS[c].r===r&&!CARDS[c].npc);const c=pick(pool);S.cards[c]=(S.cards[c]||0)+1;items.push({kind:'card',id:c,n:1,r:CARDS[c].r})}
    Bus.emit('cardwin',G.opp);Save.write();showLoot('Победа в Гамбите!',items,()=>G.onEnd&&G.onEnd(true))}
  else{if(draw_&&O.stake)gold(O.stake);S.stats.cardL++;Save.write();OV.open(`<h2 class="t">${draw_?'Ничья':'Поражение'}</h2><p class="serif">${draw_?'Ставка возвращена.':`${O.n} забирает банк.`}</p><p class="mut">Совет: не выкладывай всё в первом раунде. Иногда выгодно спасовать и сберечь карты.</p><button class="btn wide" data-x>Ещё бы</button>`,{center:true,onClose:()=>G.onEnd&&G.onEnd(false)})}}
