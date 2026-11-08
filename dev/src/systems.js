// ====== SYSTEMS ======
const T=id=>S.talents[id]||0;
const hasBook=id=>S.books.includes(id);
const hasRelic=id=>S.equip.includes(id);
const qDone=id=>S.quests[id]&&S.quests[id].st==='d';
const qActive=id=>S.quests[id]&&S.quests[id].st==='a';
const hp=(g,v)=>S.hearts[g]>=v;
function moonPhase(){return S.day%8} // 0 = full moon
const isFull=()=>moonPhase()===0;
const MOON_IC=['🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔'];
const WEATHER_IC={'ясно':'☀️','дождь':'🌧️','гроза':'⛈️','туман':'🌫️','звездопад':'🌠'};
function luck(){let l=T('fortune')*.04+(hasBook('b_fortune')?.06:0)+(hasRelic('ring')?.10:0)+(hp('velena',30)?.05:0)+(S.flags.fern?.08:0)+(S.buffs.luck||0)+(S.weather==='звездопад'?.10:0);return l}
function sellBonus(){return 1+T('tongue')*.05+(hasBook('b_trade')?.10:0)+(hasRelic('monocle')?.10:0)+(hp('liora',60)?.10:0)+(S.buffs.charm?.20:0)}
function buyMult(){return Math.max(.5,1-T('haggle')*.05-(hp('liora',30)?.10:0))}
function mutChance(){return .06+T('mutagen')*.015+(hasBook('b_mutation')?.04:0)+(hp('seylin',60)?.03:0)+luck()*.04}
function xpMult(){return 1+(hasBook('b_preis')?.10:0)}
function maxEnergy(){return 30+(S.level-1)*2+T('stamina')*4+(hasRelic('cloth')?10:0)}
function xpNeed(l){return Math.round(50*Math.pow(l,1.5))}
function lwt(r,w){return r>=2?w*Math.pow(1+luck(),r-1):w}

let pendingLevelUps=[];
function gainXP(n){n=Math.round(n*xpMult());S.xp+=n;while(S.xp>=xpNeed(S.level)){S.xp-=xpNeed(S.level);S.level++;S.tp++;onLevel(S.level);pendingLevelUps.push(S.level)}}
function onLevel(l){S.maxEnergy=maxEnergy();S.energy=Math.min(S.maxEnergy,S.energy+10);
  if(l===3||l===6)S.plotMax+=2;if(l===10)S.plotMax+=4;if(l===6||l===12)S.relicSlots++;while(S.plots.length<S.plotMax)S.plots.push(null);
  if(l%3===0)invAdd('token',1);if(l===2&&!S.orders.length)genOrders();if(l===10)ach('lvl10')}
function gold(n){S.gold+=n;if(n>0)sfx('coin')}
function useEnergy(n){if(S.energy<n){toast('Не хватает энергии ⚡ — выпей Отвар Бодрости или ляг спать','bad');return false}S.energy-=n;return true}
function ach(id){if(S.ach[id])return;S.ach[id]=1;const a=ACH[id];S.gold+=a.g;toast(`🏆 Достижение: <b>${a.n}</b> (+${a.g}💰)`,'gold');sfx('rare');hap('success')}
function itemName(k){const [id,q]=k.split('#');if(q!==undefined)return RECIPES[id].n;return (ITEMS[id]||{}).n||id}
function itemEmoji(k){const [id,q]=k.split('#');if(q!==undefined)return RECIPES[id].e;const it=ITEMS[id];return it?(it.seedE?it.seedE:it.e):'❔'}
function itemRar(k){const [id,q]=k.split('#');if(q!==undefined)return +q;return (ITEMS[id]||{}).r||0}

// ---------- rewards ----------
function giveReward(rew,silent){const out=[];if(!rew)return out;
  if(rew.gold){gold(rew.gold);out.push({e:'💰',n:'Золото',c:rew.gold,r:1})}
  if(rew.xp){gainXP(rew.xp);out.push({e:'✨',n:'Опыт',c:rew.xp,r:1})}
  for(const k in rew.items||{}){invAdd(k,rew.items[k]);out.push({e:itemEmoji(k),n:itemName(k),c:rew.items[k],r:itemRar(k)})}
  for(const k in rew.chests||{}){S.chests[k]=(S.chests[k]||0)+rew.chests[k];out.push({e:'📦',n:CHESTS[k].n,c:rew.chests[k],r:k==='wood'?0:k==='iron'?1:k==='gold'?2:k==='myth'?3:4})}
  for(const b of rew.books||[]){if(learnBook(b,true))out.push({e:BOOKS[b].e,n:BOOKS[b].n,r:BOOKS[b].r})}
  for(const r of rew.recipes||[]){if(!S.recipes.includes(r)){S.recipes.push(r);out.push({e:RECIPES[r].e,n:'Рецепт: '+RECIPES[r].n,r:2})}}
  for(const c of rew.cards||[]){S.cards[c]=(S.cards[c]||0)+1;out.push({e:CARDS[c].e,n:'Карта: '+CARDS[c].n,r:CARDS[c].r})}
  for(const g in rew.hearts||{}){heart(g,rew.hearts[g],true);out.push({e:'💗',n:CHARS[g].n,c:rew.hearts[g],r:3})}
  for(const f of rew.flags||[])S.flags[f]=1;
  if(rew.diary){if(addDiary(rew.diary))out.push({e:'📜',n:'Дневник Мастера, стр. '+rew.diary,r:4})}
  return out}
function learnBook(id,silent){if(S.books.includes(id))return false;S.books.push(id);const b=BOOKS[id];for(const r of b.rec||[])if(!S.recipes.includes(r))S.recipes.push(r);
  if(b.set==='war'&&['b_war1','b_war2','b_war3','b_war4'].every(hasBook)){if(!S.recipes.includes('peace'))S.recipes.push('peace');S.tp++;ach('war');toast('📚 Собрание «Войны и Мира Зелий» полное! Рецепт + очко таланта','leg')}
  if(id==='b_carto')toast('🗺️ На карте появился Курган Безымянных','gold');
  if(!silent)toast(`📖 Книга: <b>${b.n}</b>`,'gold');return true}
function addDiary(n){S.flags.diary=S.flags.diary||[];if(S.flags.diary.includes(n))return false;S.flags.diary.push(n);if(S.flags.diary.length>=7){if(!S.recipes.includes('phoenix'))S.recipes.push('phoenix');ach('diary')}return true}

// ---------- farming ----------
function plant(i,seed){const p=S.plots[i];if(p||!invHas(seed))return;invAdd(seed,-1);S.plots[i]={s:seed,d:0,w:S.weather==='дождь'};Bus.emit('plant');sfx('click');hap()}
function water(i){const p=S.plots[i];if(!p||p.w)return false;p.w=true;return true}
function waterAll(){const need=S.plots.filter(p=>p&&!p.w&&p.d<CROPS[p.s].d).length;if(!need){toast('Всё уже полито 💧');return}if(!useEnergy(1))return;S.plots.forEach(p=>{if(p)p.w=true});sfx('brew');toast(`💧 Полито грядок: ${need}`)}
function plotReady(p){return p&&p.d>=CROPS[p.s].d}
function harvest(i){const p=S.plots[i];if(!plotReady(p))return null;const c=CROPS[p.s];let n=ri(c.y[0],c.y[1]);if(chance(T('green')*.15))n++;if(c.prod==='chamomile'&&hasBook('b_margo'))n++;
  let mc=mutChance()*(c.mutK||1);if(S.weather==='гроза')mc*=2;if(p.zap)mc=1;const mut=chance(mc);
  if(mut){invAdd(c.mut,1);n=Math.max(0,n-1);S.stats.mut++;ach('mut')}
  invAdd(c.prod,n);S.plots[i]=null;S.stats.harvest+=n+(mut?1:0);Bus.emit('harvest',{id:c.prod,n:n+(mut?1:0)});gainXP(2*(n+1)+(mut?20:0));
  return {prod:c.prod,n,mut:mut?c.mut:null}}

// ---------- brewing ----------
function missing(rid){const r=RECIPES[rid];const m=[];for(const k in r.ing){const h=invCount(k);if(h<r.ing[k])m.push([k,r.ing[k]-h])}return m}
function brewYield(){return CAULDRON[S.cauldron].y}
function brewRoll(rid,zone){ // zone: -1 fail,0 ok,1 good,2 perfect
  const r=RECIPES[rid];
  for(const k in r.ing){for(let j=0;j<r.ing[k];j++){if(!chance(T('thrift')*.08))invAdd(k,-1)}}
  S.stats.brewed++;
  if(zone<0&&chance(.4)){S.stats.boom++;ach('boom');Bus.emit('brewfail');return {boom:true}}
  const ins=T('insight')*.04+S.level*.004+(S.cauldron-1)*.025+luck()*.15;const zb=[-.4,0,.12,.3][zone+1];
  let q=0;const p=[.40+zb+ins,.22+zb*.8+ins,.08+zb*.5+ins*.7,.06+zb*.2+ins*.4+(hasRelic('mirror')?.03:0)];
  if(zone===2)q=1;
  for(let i=q;i<4;i++){if(chance(clamp(p[i],0,.95)))q=i+1;else break}
  if(zone<0)q=0;
  let cnt=brewYield();const crit=chance(.08+T('double')*.05);if(crit){cnt*=2;S.stats.crit++}
  invAdd(rid+'#'+q,cnt);
  gainXP(r.xp*cnt*(1+q*.35));
  if(q>=3){S.stats.mastery++;ach('master')}if(q>=4){ach('legbrew');S.stats.legend++}
  if(S.stats.brewed===1)ach('first');
  Bus.emit('brew',{id:rid,q,n:cnt});
  return {q,cnt,crit}}
function drink(k){const [id,q]=k.split('#');const r=RECIPES[id];if(!r.drink||!invHas(k))return;invAdd(k,-1);const d=r.drink;const qm=1+(+q)*.25;
  if(d.en){const e=Math.round((d.en+(id==='bodr'&&hasBook('b_axe')?10:0))*qm);S.energy=Math.min(S.maxEnergy+20,S.energy+e);toast(`⚡ +${e} энергии`)}
  if(d.luck){S.buffs.luck=Math.max(S.buffs.luck||0,d.luck*qm);toast(`🍀 Удача +${Math.round(d.luck*qm*100)}% до конца дня`,'gold')}
  if(d.charm){S.buffs.charm=1;toast('💜 Ты неотразим. Сегодня.','gold')}
  if(d.night){S.buffs.night=1;toast('🦉 Ночные вылазки открыты до утра','gold')}
  if(d.safe){S.buffs.safe=1;toast('💪 Опасности не страшны')}
  sfx('heal');hap()}
function distill(k){const [id,q]=k.split('#');if(+q>=4||invCount(k)<3)return null;if(!useEnergy(1))return null;invAdd(k,-3);
  const ok=chance(.70+T('insight')*.05);if(ok){invAdd(id+'#'+(+q+1),1);if(+q+1>=3)S.stats.mastery++;if(+q+1===4)ach('legbrew')}return ok}
function upgradeCauldron(){const nx=CAULDRON[S.cauldron+1];if(!nx)return;const cost=Math.round(nx.cost*(hasBook('b_steel')?.75:1));if(S.level<nx.lvl){toast(`Нужен ${nx.lvl} уровень`,'bad');return}if(S.gold<cost){toast('Не хватает золота','bad');return}S.gold-=cost;S.cauldron++;sfx('level');toast(`⚗️ ${nx.n}! Зелий за варку: ${nx.y}`,'gold')}

// ---------- market ----------
const SELLABLE=k=>{const [id,q]=k.split('#');if(q!==undefined)return true;const it=ITEMS[id];return it&&it.t!=='key'};
function initMarket(){const all=[...Object.keys(RECIPES),...Object.keys(ITEMS)];for(const id of all){S.market.p[id]=+(0.8+rnd()*.5).toFixed(3);S.market.prev[id]=S.market.p[id]}genShop()}
function updateMarket(){const M=S.market;M.sold={};for(const id in M.p){M.prev[id]=M.p[id];let m=M.p[id];m=m+(1-m)*.22+(rnd()-.5)*.34;if(chance(.04))m*=rnd()<.5?.6:1.6;M.p[id]=+clamp(m,.5,2.2).toFixed(3)}
  M.ev=null;if(S.day>3&&chance(.32))M.ev=pick(MEVENTS).id;
  if(S.flags.forecast){M.ev=S.flags.forecast;delete S.flags.forecast}
  M.wander=null;if(S.day>=4&&chance(.15+T('conn')*.06))M.wander=genWander();genShop()}
function evMult(id,isRaw,r){const e=MEVENTS.find(x=>x.id===S.market.ev);if(!e)return 1;let m=e.all||1;if(e.m&&e.m[id])m*=e.m[id];if(isRaw&&e.raw)m*=e.raw;if(isRaw&&e.rare&&r>=2)m*=e.rare;return m}
function sellPrice(k,extra=0){const [id,q]=k.split('#');const isE=q!==undefined;const base=isE?RECIPES[id].p*QMULT[+q]:ITEMS[id].p*.7;
  const m=S.market.p[id]||1;const sold=(S.market.sold[id]||0)+extra;const sat=Math.max(.45,1-sold*.04*(1-T('mono')*.3));
  return Math.max(1,Math.round(base*m*evMult(id,!isE,isE?0:ITEMS[id].r)*sellBonus()*sat))}
function trend(id){const M=S.market;const d=(M.p[id]||1)-(M.prev[id]||1);return d>.04?1:d<-.04?-1:0}
function sell(k,n){let tot=0;n=Math.min(n,invCount(k));if(n<=0)return 0;const [id]=k.split('#');for(let i=0;i<n;i++){tot+=sellPrice(k);S.market.sold[id]=(S.market.sold[id]||0)+1}
  invAdd(k,-n);S.gold+=tot;S.stats.sold+=n;S.stats.earned+=tot;gainXP(Math.max(1,Math.round(tot/40)));Bus.emit('earn',tot);if(S.stats.earned>=10000)ach('rich');sfx('coin');hap();return tot}
function genShop(){const st=[];const seeds=['seed_chamomile','seed_mint','seed_nettle'];if(qDone('q5')||qActive('q6'))seeds.push('seed_wormwood');if(S.quests.q7)seeds.push('seed_hawthorn');if(S.quests.q9)seeds.push('seed_lily');if(S.level>=5)seeds.push('seed_mandrake');if(hasBook('b_green'))seeds.push('seed_heart');if(S.level>=6)seeds.push('seed_apple');
  for(const s of seeds)st.push({k:s,p:Math.round(ITEMS[s].p*1.3),q:99});
  const pool=['chamomile','mint','nettle','wormwood','hawthorn','fly_agaric','sulfur','slime','firefly','lily_dew','bone','bark'];if(S.level>=4)pool.push('quartz','fire_ash');if(S.level>=6)pool.push('leech','wolf_fang');
  shuffle(pool).slice(0,5).forEach(k=>st.push({k,p:Math.round(ITEMS[k].p*1.6),q:ri(4,12)}));
  const lotPool=Object.keys(ITEMS).filter(k=>{const it=ITEMS[k];return(it.r===2||it.r===3)&&it.t!=='key'&&it.t!=='seed'});
  const lk=pick(lotPool);st.push({k:lk,p:Math.round(ITEMS[lk].p*1.7),q:1,lot:1});
  st.push({chest:'wood',p:150,q:3});if(S.level>=3)st.push({chest:'iron',p:520,q:1});if(S.level>=6&&chance(.35))st.push({k:'key_gold',p:900,q:1});
  if(hp('liora',80)){const sp=Object.keys(ITEMS).filter(k=>ITEMS[k].r===4&&ITEMS[k].t!=='key');const sk=pick(sp);st.push({k:sk,p:Math.round(ITEMS[sk].p*1.4),q:1,secret:1})}
  S.market.stock=st}
function genWander(){const st=[];const rel=Object.keys(RELICS).filter(r=>!S.relics.includes(r));if(rel.length&&chance(.35)){const r=pick(rel);st.push({relic:r,p:RELICS[r].r===5?14000:7000,q:1})}
  st.push({bag:1,p:350,q:3});const myth=pick(['fern','firebird_feather','rip_grass','youth_apple','blood_heart','mermaid_tear','star_dust']);st.push({k:myth,p:Math.round(ITEMS[myth].p*1.5),q:1});
  st.push({chest:'gold',p:1200,q:1});if(chance(.4))st.push({k:'key_myth',p:3200,q:1});
  const bk=Object.keys(BOOKS).filter(b=>!hasBook(b)&&BOOKS[b].r>=2&&b!=='b_green'&&b!=='b_grimoire'&&b!=='b_basics');if(bk.length&&chance(.6)){const b=pick(bk);st.push({book:b,p:BOOKS[b].r*700,q:1})}
  return st}
function buy(o,src){const price=Math.round(o.p*(o.relic||o.bag?1:buyMult()));if(o.q<=0)return false;if(S.gold<price){toast('Не хватает золота 💰','bad');return false}
  S.gold-=price;S.stats.spent+=price;o.q--;sfx('coin');hap();
  if(o.k){invAdd(o.k,1);toast(`Куплено: ${itemEmoji(o.k)} ${itemName(o.k)}`)}
  else if(o.chest){S.chests[o.chest]=(S.chests[o.chest]||0)+1;toast(`📦 ${CHESTS[o.chest].n} — в Усадьбе`)}
  else if(o.relic){S.relics.push(o.relic);autoEquip(o.relic);toast(`${RELICS[o.relic].e} ${RELICS[o.relic].n}!`,'leg')}
  else if(o.book){learnBook(o.book)}
  else if(o.bag){return {bag:rollBag()}}
  return true}
function rollBag(){const r=wpick([0,1,2,3,4,5].map(r=>[r,[0,40,34,18,6.5,1.2][r]]),x=>lwt(x[0],x[1]))[0];const it=rollItemOfRarity(r);applyLoot([it]);return it}

// ---------- loot ----------
function poolByR(r){return Object.keys(ITEMS).filter(k=>{const it=ITEMS[k];return it.r===r&&it.t!=='key'&&k!=='koschei_needle'||(r===5&&k==='koschei_needle')}).filter(k=>ITEMS[k].t!=='key')}
function rollItemOfRarity(r,ctx={}){
  const books=Object.keys(BOOKS).filter(b=>!hasBook(b)&&!['b_basics','b_green','b_grimoire','b_trade'].includes(b));
  const relics=Object.keys(RELICS).filter(x=>!S.relics.includes(x));
  const cards=Object.keys(CARDS).filter(c=>!CARDS[c].npc);
  const opts=[];
  const ing=poolByR(r).filter(k=>ITEMS[k].t!=='seed'||r<=1);
  if(r<=1){opts.push(['ing',70],['seed',20]);if(S.recipes.length)opts.push(['elix',10])}
  if(r===2){opts.push(['ing',55],['key_gold',7],['token',8],['pack',9],['card',10]);if(books.some(b=>BOOKS[b].r<=2))opts.push(['book',7]);opts.push(['elix',6])}
  if(r===3){opts.push(['ing',45],['card',16],['elix',14],['pack',8]);if(books.some(b=>BOOKS[b].r===3))opts.push(['book',14]);if(S.flags.medal_awake&&(S.flags.diary||[]).length<7)opts.push(['diary',6])}
  if(r===4){opts.push(['ing',32],['card',16],['key_myth',10]);if(relics.some(x=>RELICS[x].r===4))opts.push(['relic',34]);if(books.some(b=>BOOKS[b].r===4))opts.push(['book',10])}
  if(r===5){opts.push(['ing',45],['card',10]);if(relics.some(x=>RELICS[x].r===5))opts.push(['relic',45])}
  const kind=wpick(opts,x=>x[1])[0];
  if(kind==='ing'){const k=pick(ing.length?ing:poolByR(0));return{kind:'item',id:k,n:r===0?ri(1,3):1,r}}
  if(kind==='seed'){const s=pick(Object.keys(CROPS).filter(s=>!CROPS[s].req||hasBook(CROPS[s].req)));return{kind:'item',id:s,n:ri(1,3),r:ITEMS[s].r}}
  if(kind==='elix'){const rid=pick(S.recipes.length?S.recipes:['bodr']);const q=clamp(r+(chance(.3)?1:0)-1,0,4);return{kind:'item',id:rid+'#'+q,n:1,r:q}}
  if(['key_gold','token','pack','key_myth'].includes(kind))return{kind:'item',id:kind,n:1,r:ITEMS[kind].r};
  if(kind==='card'){const pool=cards.filter(c=>CARDS[c].r===r);const c=pick(pool.length?pool:cards.filter(c=>CARDS[c].r<=r));return{kind:'card',id:c,n:1,r:CARDS[c].r}}
  if(kind==='book'){const pool=books.filter(b=>BOOKS[b].r===r||(r===2&&BOOKS[b].r<2));const b=pick(pool);return{kind:'book',id:b,n:1,r:BOOKS[b].r}}
  if(kind==='relic'){const pool=relics.filter(x=>RELICS[x].r===r);const x=pick(pool);return{kind:'relic',id:x,n:1,r}}
  if(kind==='diary'){const left=[4,5,6,7].filter(n=>!(S.flags.diary||[]).includes(n));if(left.length)return{kind:'diary',id:left[0],n:1,r:4};return{kind:'item',id:pick(poolByR(3)),n:1,r:3}}
  return{kind:'item',id:'chamomile',n:1,r:0}}
function rollChest(type){const c=CHESTS[type];const rolls=ri(c.rolls[0],c.rolls[1])+(chance(T('eye')*.08)?1:0);const out=[];let maxR=0;
  for(let i=0;i<rolls;i++){let r=wpick([0,1,2,3,4,5].map(r=>[r,c.w[r]]),x=>lwt(x[0],x[1]))[0];
    if(type!=='wood'&&type!=='iron'){S.pity.rolls++;if(r>=4)S.pity.rolls=0;if(S.pity.rolls>=60){r=4;S.pity.rolls=0}}
    const it=rollItemOfRarity(r);out.push(it);maxR=Math.max(maxR,it.r)}
  const g=ri(c.g[0],c.g[1]);out.unshift({kind:'gold',n:g,r:0});return{items:out,maxR}}
function applyLoot(items){for(const it of items){
  if(it.kind==='gold')gold(it.n);
  else if(it.kind==='item')invAdd(it.id,it.n);
  else if(it.kind==='card')S.cards[it.id]=(S.cards[it.id]||0)+1;
  else if(it.kind==='book'){if(!learnBook(it.id,true)){gold(BOOKS[it.id].r*200);it.dup=1}}
  else if(it.kind==='relic'){if(!S.relics.includes(it.id)){S.relics.push(it.id);autoEquip(it.id)}else{gold(3000);it.dup=1}}
  else if(it.kind==='diary')addDiary(it.id);
  if(it.r>=4){S.stats.legend++;ach('legend');if(it.r>=5)ach('myth');if(it.id==='fern'){S.flags.fern=1;ach('fern')}}}}
function lootView(it){if(it.kind==='gold')return{e:'💰',n:'Золото',c:it.n,r:0};if(it.kind==='item')return{e:itemEmoji(it.id),n:itemName(it.id)+(it.id.includes('#')?' '+QSTAR[it.r]:''),c:it.n,r:it.r};
  if(it.kind==='card')return{e:CARDS[it.id].e,n:'Карта: '+CARDS[it.id].n,r:it.r};if(it.kind==='book')return{e:BOOKS[it.id].e,n:BOOKS[it.id].n+(it.dup?' (дубль → 💰)':''),r:it.r};
  if(it.kind==='relic')return{e:RELICS[it.id].e,n:RELICS[it.id].n+(it.dup?' (дубль → 💰)':''),r:it.r};if(it.kind==='diary')return{e:'📜',n:'Дневник Мастера, стр. '+it.id,r:4};return{e:'❔',n:'?',r:0}}
function autoEquip(id){if(S.equip.length<S.relicSlots&&!S.equip.includes(id))S.equip.push(id);S.maxEnergy=maxEnergy()}
function canOpen(type){const k=CHESTS[type].key;if(!k)return true;return invHas(k)||invHas('rip_grass')}
function takeKey(type){const k=CHESTS[type].key;if(!k)return;if(invHas(k))invAdd(k,-1);else invAdd('rip_grass',-1)}

// ---------- wheel ----------
function wheelFree(){return S.wheel.last!==todayKey()}
function spinWheel(){const free=wheelFree();if(!free&&!invHas('token'))return null;
  if(free){const y=new Date(Date.now()-864e5);const yk=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();S.wheel.streak=S.wheel.last===yk?S.wheel.streak+1:1;S.wheel.last=todayKey()}else invAdd('token',-1);
  const i=WHEEL.indexOf(wpick(WHEEL,s=>s.g.jackpot?s.w*(1+T('gambler'))*(1+luck()):s.w));return i}
function wheelGrant(i){const s=WHEEL[i].g;const out=[];
  if(s.gold){const g=s.gold*(1+Math.min(S.wheel.streak,7)*.1|0);gold(s.gold);out.push({kind:'gold',n:s.gold,r:0})}
  if(s.chest){S.chests[s.chest]=(S.chests[s.chest]||0)+1;out.push({kind:'chest',id:s.chest})}
  if(s.seeds){const ss=pick(['seed_chamomile','seed_mint','seed_nettle','seed_wormwood','seed_hawthorn','seed_lily','seed_mandrake']);invAdd(ss,4);out.push({kind:'item',id:ss,n:4,r:0})}
  if(s.elix){const rid=pick(S.recipes.length?S.recipes:['bodr']);const q=ri(0,2);invAdd(rid+'#'+q,2);out.push({kind:'item',id:rid+'#'+q,n:2,r:q})}
  if(s.ingr){const it=rollItemOfRarity(chance(.2)?3:2);it.kind='item';if(it.id&&!ITEMS[it.id.split('#')[0]]&&!it.id.includes('#'))it.id='quartz';applyLoot([it]);out.push(it)}
  if(s.item){invAdd(s.item,1);out.push({kind:'item',id:s.item,n:1,r:ITEMS[s.item].r})}
  if(s.jackpot){const r=chance(.25)?5:4;const it=rollItemOfRarity(r);applyLoot([it]);gold(2500);out.push({kind:'gold',n:2500,r:4},it)}
  if(S.wheel.streak>=7&&S.wheel.streak%7===0&&S.wheel.bonusDay!==todayKey()){S.wheel.bonusDay=todayKey();S.chests.gold=(S.chests.gold||0)+1;invAdd('key_gold',1);out.push({kind:'chest',id:'gold',streak:1})}
  return out}

// ---------- expeditions ----------
function locOpen(id){const l=LOCS[id];const r=l.req;if(!r)return true;if(r.q&&!S.quests[r.q])return false;if(r.f&&!S.flags[r.f])return false;if(r.lvl&&S.level<r.lvl)return false;if(r.book&&!hasBook(r.book))return false;if(r.act&&qDone('q7')&&id==='castle')return true;return true}
function locCost(id){let c=LOCS[id].cost||0;if(hasRelic('boots'))c=Math.max(1,c-1);if(hasRelic('mortar')&&S.mortarDay!==S.day)c=0;return c}
function questLocHint(id){for(const q of QUESTS){const st=S.quests[q.id];if(!st||st.st!=='a')continue;for(const o of q.objs){if(o.t==='explore'&&o.loc===id)return true;if(o.t==='card'&&((o.opp==='aira'&&id==='village')||(o.opp==='baron'&&id==='castle')))return true}if(q.id==='q11'&&id==='swamp')return true}return false}
function explore(id,night){const L=LOCS[id];const cost=locCost(id);if(!useEnergy(cost))return null;if(hasRelic('mortar')&&S.mortarDay!==S.day)S.mortarDay=S.day;
  const table=night&&L.night?L.night:L.loot;const loot={};let rolls=4+(chance(T('eye')*.08)?1:0)+(hasRelic('ball')?1:0)+(S.weather==='туман'?1:0)+(night?1:0);
  const lk=luck();for(let i=0;i<rolls;i++){const [k]=wpick(table,x=>lwt(ITEMS[x[0]].r,x[1]));const n=ITEMS[k].r===0?ri(1,3):1;loot[k]=(loot[k]||0)+n}
  if(id==='ruins'&&night&&isFull()&&hasBook('b_firebird')&&chance(.02*(1+lk)))loot.firebird_feather=1;
  if(id==='grove'&&night&&chance((isFull()?.008:.0015)*(1+lk)*(S.hev.velena>=2?2:1)))loot.fern=1;
  if(S.weather==='звездопад'&&chance(.3))loot.star_dust=(loot.star_dust||0)+1;
  if(id==='caves'&&hasBook('b_dragon')&&chance(.25))loot.wyvern_scale=(loot.wyvern_scale||0)+1;
  const items=Object.entries(loot).map(([k,n])=>({kind:'item',id:k,n,r:ITEMS[k].r}));
  let chest=null;const cr=rnd();const cm=1+lk+(S.buffs.map?3:0);if(S.buffs.map){delete S.buffs.map}
  if(cr<.0025*cm)chest='myth';else if(cr<.017*cm)chest='gold';else if(cr<.07*cm)chest='iron';else if(cr<.19*cm)chest='wood';if(id==='kurgan'&&!chest&&chance(.3))chest='iron';
  if(chest){S.chests[chest]=(S.chests[chest]||0)+1}
  let book=null;if(chance(.025*(1+lk)+(id==='ruins'?.03:0))){const pool=Object.keys(BOOKS).filter(b=>!hasBook(b)&&BOOKS[b].r<=3&&!['b_basics','b_green','b_grimoire','b_trade'].includes(b));if(pool.length)book=pick(pool)}
  if(book)learnBook(book,true);
  let diary=null;if(S.flags.medal_awake&&chance(.025)){const left=[4,5,6,7].filter(n=>!(S.flags.diary||[]).includes(n));if(left.length){diary=left[0];addDiary(diary)}}
  applyLoot(items);S.stats.explore++;gainXP(8+cost*2);Bus.emit('explore',id);
  let ev=null;if(chance(S.weather==='туман'?.38:.28))ev=pickEvent(id,night);
  return{items,chest,book,diary,ev}}
const EXP_EVENTS=[
 {id:'gop',locs:['grove','swamp','caves','ruins'],danger:1,t:'Гопники у моста',d:'Трое в кепках сидят на корточках у старого моста. «Слышь, алхимик. Есть чё?»',ch:[
  {t:'Угостить «Боярышником» 🍾',req:()=>elixCount('hawthorn_t')>0,fn:()=>{elixTake('hawthorn_t',1);const it=rollItemOfRarity(chance(.3)?2:1);applyLoot([it]);let msg='Мужики растроганы до слёз. «Братан, ты свой!» Тебе суют находку.';if(chance(.3)){S.cards.bandit=(S.cards.bandit||0)+1;msg+=' И карту «Гопник с моста».'}return{msg,loot:[it]}}},
  {t:'Сразиться ⚔️',fn:()=>({fight:'gopnik'})},
  {t:'«Я от бабушки ушёл...» 🏃',fn:()=>{if(chance(.5+(hasBook('b_kolobok')?.4:0)))return{msg:'Ты уходишь так быстро, что гопники даже не успевают встать с корточек.'};const g=Math.min(50,Math.round(S.gold*.1));S.gold-=g;return{msg:`Не ушёл. Отдал ${g}💰 «на семечки».`}}},
 ]},
 {id:'wounded',locs:null,t:'Раненый путник',d:'У дороги стонет путник в изорванном плаще. Кровь проступает сквозь повязку.',ch:[
  {t:'Дать Целебное зелье ❤️‍🩹',req:()=>elixCount('heal')>0,fn:()=>{elixTake('heal',1);const g=ri(40,120);gold(g);let loot=[];if(chance(.18)){const it=rollItemOfRarity(3);applyLoot([it]);loot=[it]}return{msg:`Путник благодарит и суёт тебе ${g}💰. «Я тебя запомню, алхимик».`,loot}}},
  {t:'Пройти мимо',fn:()=>({msg:'Совесть немного скребёт. Но только немного.'})},
 ]},
 {id:'ring',locs:['grove','swamp'],t:'Ведьмин круг',d:'Кольцо светящихся грибов. Внутри воздух дрожит, как над костром.',ch:[
  {t:'Шагнуть внутрь',fn:()=>{const r=rnd();if(r<.4){const it=[rollItemOfRarity(2),rollItemOfRarity(1),rollItemOfRarity(chance(.2)?3:1)];applyLoot(it);return{msg:'Мир переворачивается — и ты оказываешься в незнакомой чаще, полной редких трав.',loot:it}}if(r<.7){S.buffs.luck=Math.max(S.buffs.luck||0,.15);return{msg:'Тебя окутывает тёплый свет. Удача +15% до конца дня.'}}S.energy=Math.max(0,S.energy-4);return{msg:'Ты просыпаешься через час с венком на голове и без 4 энергии. Что было — не помнишь.'}}},
  {t:'Не рисковать',fn:()=>({msg:'Грибы разочарованно гаснут.'})},
 ]},
 {id:'mimic',locs:null,t:'Сундук посреди поляны',d:'Сундук. Посреди поляны. Подозрительно посреди.',ch:[
  {t:'Открыть',fn:()=>{if(chance(.65)){S.chests.iron=(S.chests.iron||0)+1;return{msg:'Настоящий! Железный сундук отправлен в Усадьбу.'}}S.energy=Math.max(0,S.energy-4);return{msg:'МИМИК! Он кусает тебя за руку и убегает, хохоча. −4 энергии.'}}},
  {t:'Пнуть',fn:()=>{if(chance(.35)){const it=rollItemOfRarity(3);applyLoot([it]);return{msg:'Сундук взвизгивает и удирает на ножках, роняя что-то ценное!',loot:[it]}}S.chests.wood=(S.chests.wood||0)+1;return{msg:'Сундук обычный. Ты его немного помял. Теперь он деревянный.'}}},
 ]},
 {id:'bard',locs:null,t:'Странствующий бард',d:'Бард с лютней: «Спою балладу о великом алхимике! Всего 20 золотых!»',ch:[
  {t:'Заплатить 20💰',req:()=>S.gold>=20,fn:()=>{S.gold-=20;S.buffs.luck=Math.max(S.buffs.luck||0,.10);return{msg:'Баллада вышла настолько эпичной, что даже Фортуна прослезилась. Удача +10% сегодня.'}}},
  {t:'«Я сам себе баллада»',fn:()=>({msg:'Бард уходит, бормоча что-то про «пафосных выскочек».'})},
 ]},
 {id:'wolves',locs:['grove','lair'],danger:1,night:1,t:'Вой в темноте',d:'Из кустов светятся жёлтые глаза. Волколак!',ch:[
  {t:'Принять бой ⚔️',fn:()=>({fight:'wolf'})},
  {t:'Бросить мясо и бежать',fn:()=>{if(chance(.6+(hasBook('b_kolobok')?.3:0)))return{msg:'Пронесло.'};S.energy=Math.max(0,S.energy-5);return{msg:'Волколак догнал и потрепал. −5 энергии.'}}},
 ]},
 {id:'altar',locs:['ruins','kurgan','caves'],t:'Древний алтарь',d:'Каменный алтарь, покрытый рунами. На нём — следы старых подношений.',ch:[
  {t:'Подношение 100💰',req:()=>S.gold>=100,fn:()=>{S.gold-=100;if(chance(.22+luck()*.2)){S.chests.gold=(S.chests.gold||0)+1;invAdd('key_gold',1);return{msg:'Руны вспыхивают! На алтаре — Золотой сундук и ключ!'}}return{msg:'Боги молчат. Боги всегда молчат.'}}},
  {t:'Уйти',fn:()=>({msg:'Ты уходишь. Руны провожают тебя взглядом.'})},
 ]},
 {id:'star',locs:null,night:1,t:'Падающая звезда',d:'С неба срывается звезда и падает где-то совсем рядом!',ch:[
  {t:'Найти её ✨',fn:()=>{const n=ri(1,2);invAdd('star_dust',n);return{msg:`Ты находишь ${n}× Звёздную пыль. Загадай желание!`,loot:[{kind:'item',id:'star_dust',n,r:3}]}}},
 ]},
 {id:'kiki',locs:['swamp'],t:'Кикимора',d:'Из трясины высовывается кикимора: «Отгадаешь загадку — награжу. Не отгадаешь — сама возьму. Без окон, без дверей — полна горница людей?»',ch:[
  {t:'Огурец',fn:()=>{const it=chance(.35)?{kind:'item',id:'mermaid_tear',n:1,r:3}:{kind:'item',id:'shadow',n:2,r:2};applyLoot([it]);return{msg:'«Ишь, умный!» — кикимора швыряет тебе награду и с хлюпом исчезает.',loot:[it]}}},
  {t:'Конклав',fn:()=>{const ks=Object.keys(S.inv).filter(k=>!k.includes('#')&&ITEMS[k]&&ITEMS[k].t!=='key');if(ks.length){const k=pick(ks);invAdd(k,-1);return{msg:`«Хи-хи, почти!» Кикимора утаскивает ${itemName(k)}.`}}return{msg:'«Хи-хи, почти!»'}}},
  {t:'Тыква',fn:()=>({msg:'«Тыква! Ха! Тыква!» Кикимора хохочет так, что уходит под воду.'})},
 ]},
 {id:'hodja',locs:null,t:'Ходжа и напёрстки',d:'На ишаке восседает хитрец в чалме: «Сыграем в напёрстки, уважаемый? Ставка — 50, выигрыш — 150!»',ch:[
  {t:'Левый напёрсток',req:()=>S.gold>=50,fn:()=>shells()},{t:'Средний',req:()=>S.gold>=50,fn:()=>shells()},{t:'Правый',req:()=>S.gold>=50,fn:()=>shells()},
  {t:'Не играть',fn:()=>({msg:'«Мудрость — тоже выигрыш», — смеётся Ходжа.'})},
 ]},
 {id:'map',locs:null,t:'Обрывок карты',d:'Под камнем — обрывок старой карты с крестиком.',ch:[
  {t:'Забрать',fn:()=>{S.buffs.map=1;return{msg:'На следующей вылазке шанс найти сундук сильно выше.'}}},
 ]},
];
function shells(){S.gold-=50;if(chance(.34+luck()*.2)){gold(150);return{msg:'Шарик под твоим напёрстком! +150💰. Ходжа уважительно цокает языком.'}}return{msg:'Пусто. «Аллах любит терпеливых», — Ходжа прячет твои 50💰.'}}
function pickEvent(loc,night){let pool=EXP_EVENTS.filter(e=>(!e.locs||e.locs.includes(loc))&&(!e.night||night||e.id==='wolves'&&loc==='lair'));
  if(pool.some(e=>e.danger)){const safe=S.buffs.safe||(hp('aira',60)&&chance(.5))||(hasRelic('hat')&&chance(.5));if(safe)pool=pool.filter(e=>!e.danger)}return pool.length?pick(pool):null}

// ---------- day ----------
function newDay(){const rep={};
  for(const p of S.plots){if(!p)continue;if(p.w){p.d++;if(hp('seylin',30)&&chance(.25))p.d++}p.w=false;p.zap=false}
  S.day++;S.buffs={};S.maxEnergy=maxEnergy();S.energy=S.maxEnergy;
  S.weather=wpick([['ясно',58],['дождь',20],['гроза',7],['туман',9],['звездопад',6]],x=>x[1])[0];
  if(S.weather==='дождь'||S.weather==='гроза')S.plots.forEach(p=>{if(p)p.w=true});
  if(S.weather==='гроза'){const gr=S.plots.filter(p=>p);if(gr.length&&chance(.25)){const p=pick(gr);p.zap=true;rep.zap=CROPS[p.s].n}}
  updateMarket();
  if(chance(.38)){const r=wpick([[0,60],[1,30],[2,8],[3,1.6],[4,.25]],x=>lwt(x[0],x[1]))[0];const it=rollItemOfRarity(r);if(it.kind==='relic'||it.kind==='book'||it.kind==='diary'){it.kind='item';it.id=pick(poolByR(Math.min(r,3)))}S.cat=it}
  if(hasRelic('hen')){if(chance(.15)){gold(250);rep.egg='золотое'}else{rep.egg='обычное'}}
  if(S.level>=2&&(S.day-S.ordersDay>=3||S.orders.length===0))genOrders();
  if(hp('velena',50)){const ev=pick(MEVENTS);S.flags.forecast=ev.id;rep.forecast=ev.t}
  rep.ready=S.plots.filter(plotReady).length;
  Save.write();return rep}

// ---------- orders ----------
function genOrders(){S.ordersDay=S.day;S.orders=[];const rs=S.recipes.filter(r=>!['phoenix','living','dead','peace'].includes(r));if(!rs.length)return;
  for(let i=0;i<3;i++){const rid=pick(rs);const n=ri(1,RECIPES[rid].p>200?2:4);const q=S.level>=8&&chance(.35)?2:S.level>=4&&chance(.45)?1:0;
   const girls=Object.keys(GIRL_REQ).filter(g=>qDone(GIRL_REQ[g])||S.quests[GIRL_REQ[g]]&&g!=='velena');const girl=chance(.25)&&girls.length?pick(girls):null;
   const g=Math.round(RECIPES[rid].p*QMULT[q]*n*(1.5+rnd()*.5)*(1+T('conn')*.1));
   S.orders.push({id:Date.now()+i,npc:girl?CHARS[girl].n:pick(ORDER_NPC),girl,rid,n,q,gold:g,xp:Math.round(RECIPES[rid].xp*n*1.5),chest:chance(.3)?(chance(.15)?'gold':chance(.4)?'iron':'wood'):null})}}
function fulfillOrder(o){if(elixCount(o.rid,o.q)<o.n)return false;elixTake(o.rid,o.n,o.q);gold(o.gold);gainXP(o.xp);if(o.chest)S.chests[o.chest]=(S.chests[o.chest]||0)+1;if(o.girl)heart(o.girl,3);S.orders=S.orders.filter(x=>x!==o);return true}

// ---------- romance ----------
function heart(g,n,silent){const m=(1+T('charisma')*.25)*(S.buffs.charm?2:1);const v=Math.round(n>0?n*m:n);S.hearts[g]=clamp(S.hearts[g]+v,0,100);if(!silent&&v>0){toast(`💗 ${CHARS[g].n} +${v}`);sfx('heart')}
  if(S.hearts[g]>=80)ach('heart');if(Object.values(S.hearts).every(h=>h>=50))ach('harem')}
function giftValue(g,k){const id=k.split('#')[0];const G=GIFTS[g];if(G.love.includes(id))return 8;if(G.like.includes(id))return 4;if(G.hate.includes(id))return -3;return 1}
function nextRomance(g){const ev=ROMANCE[g];const done=S.hev[g]||0;const e=ev[done];if(e&&S.hearts[g]>=e.at)return e;return null}

// ---------- quests ----------
function startQuest(id){if(S.quests[id])return;const q=QMAP[id];S.quests[id]={st:'a',c:q.objs.map(()=>0),b:{earned:S.stats.earned}};
  const on=q.on||{};for(const k in on.items||{})invAdd(k,on.items[k]);for(const b of on.books||[])learnBook(b,true);for(const r of on.recipes||[])if(!S.recipes.includes(r))S.recipes.push(r);for(const f of on.flags||[])S.flags[f]=1;
  if(on.deck&&!S.deck.length){for(const c of STARTER_DECK)S.cards[c]=(S.cards[c]||0)+1;S.deck=STARTER_DECK.slice()}genShop()}
function objProg(q,i){const o=q.objs[i];const st=S.quests[q.id];let cur=0,need=o.n||1;
  switch(o.t){case'plant':case'harvest':case'brew':case'explore':case'card':case'fight':cur=st.c[i];break;
   case'give':cur=RECIPES[o.id]?elixCount(o.id,o.q||0):invCount(o.id);break;
   case'givemut':cur=Object.keys(S.inv).filter(k=>ITEMS[k]&&ITEMS[k].t==='mut').reduce((a,k)=>a+S.inv[k],0);break;
   case'giveq':cur=Object.keys(S.inv).filter(k=>k.includes('#')&&+k.split('#')[1]>=o.q).reduce((a,k)=>a+S.inv[k],0);need=1;break;
   case'earn':cur=S.stats.earned-(st.b.earned||0);break;case'lvl':cur=S.level;break;case'pay':cur=S.gold;break}
  return [Math.min(cur,need),need]}
function questReady(id){const q=QMAP[id];const st=S.quests[id];if(!st||st.st!=='a')return false;return q.objs.every((o,i)=>{const [c,n]=objProg(q,i);return c>=n})}
function turnIn(id){const q=QMAP[id];if(!questReady(id))return null;
  q.objs.forEach(o=>{if(o.t==='give'){if(RECIPES[o.id])elixTake(o.id,o.n,o.q||0);else invAdd(o.id,-o.n)}
   if(o.t==='givemut'){const k=Object.keys(S.inv).find(k=>ITEMS[k]&&ITEMS[k].t==='mut');invAdd(k,-1)}
   if(o.t==='giveq'){const ks=Object.keys(S.inv).filter(k=>k.includes('#')&&+k.split('#')[1]>=o.q).sort((a,b)=>RECIPES[a.split('#')[0]].p-RECIPES[b.split('#')[0]].p);invAdd(ks[0],-1)}
   if(o.t==='pay')S.gold-=o.n});
  S.quests[id].st='d';const out=giveReward(q.rew,true);return out}
function currentMain(){for(const q of QUESTS){const st=S.quests[q.id];if(!st)return null;if(st.st==='a')return q}return null}
function nextMainId(){for(const q of QUESTS)if(!S.quests[q.id])return q.id;return null}
Bus.on('plant',()=>bump('plant'));Bus.on('harvest',d=>bump('harvest',o=>!o.id||o.id===d.id,d.n));
Bus.on('brew',d=>bump('brew',o=>o.id===d.id&&d.q>=(o.q||0),1));Bus.on('explore',loc=>bump('explore',o=>o.loc===loc));
Bus.on('cardwin',opp=>bump('card',o=>o.opp===opp));Bus.on('fightwin',foe=>bump('fight',o=>o.foe===foe));
function bump(t,f=()=>true,n=1){for(const q of QUESTS){const st=S.quests[q.id];if(!st||st.st!=='a')continue;q.objs.forEach((o,i)=>{if(o.t===t&&f(o))st.c[i]+=n})}}
