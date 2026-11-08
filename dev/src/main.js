// ====== BOOT ======
document.addEventListener('gesturestart',e=>e.preventDefault());
let _lastTouch=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-_lastTouch<300&&!e.target.closest('input,textarea'))e.preventDefault();_lastTouch=n},{passive:false});
window.addEventListener('error',e=>{try{console.error(e.message)}catch(_){}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S)Save.write()});
function boot(){FX.init();titleScreen();
  Save.initCloud().then(c=>{if(!c)return;const loc=Save.readLocal();if(!loc||(c.ts||0)>(loc.ts||0)+1500){try{localStorage.setItem(SAVE_KEY,JSON.stringify(c.st))}catch(e){}
    if(!S){OV.closeAll();titleScreen();toast('☁️ Найдено облачное сохранение')}else if(c.ts>(S.ts||0)+60000){toast('☁️ В облаке есть более новое сохранение — перезапусти игру')}}})}
boot();
