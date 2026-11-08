// ====== ART: SVG portraits, chests, scenes ======
let _u=0;
const FACE_F='M62,92 C60,124 68,146 86,162 Q100,172 114,162 C132,146 140,124 138,92 C138,52 62,52 62,92Z';
const FACE_M='M61,92 C60,122 66,143 83,159 L100,170 L117,159 C134,143 140,122 139,92 C139,50 61,50 61,92Z';
const FACE_FAT='M54,96 C50,134 62,160 84,172 Q100,181 116,172 C138,160 150,134 146,96 C146,52 54,52 54,96Z';
const BODY='M24,250 C28,212 54,197 86,187 Q100,193 114,187 C146,197 172,212 176,250Z';
const NECK='M88,148 L87,188 Q100,196 113,188 L112,148Z';
const mir=s=>`<g transform="translate(200 0) scale(-1 1)">${s}</g>`;
function eyeSVG(u,c,mood){
  const m=c.sex==='m';let top=m?110:107,low=m?125:127;
  if(mood==='a'){top+=4}else if(mood==='o'||mood==='x'){top-=3;low+=1}else if(mood==='s'||mood==='b'){low-=3}else if(mood==='d'){top+=3}else if(mood==='k'){top+=2}
  if(c.sleepy)top+=4;
  const wp=`M66,117 Q76,${top} 92,${m?114:113} Q91,${low-2} 80,${low} Q69,${low-1} 66,117Z`;
  const ir=(mood==='o'||mood==='x')?6.2:(m?6.8:7.4),iry=(mood==='o'||mood==='x')?7.2:(m?7.6:8.8);
  const pup=c.slit?`<ellipse cx="81" cy="119" rx="1.3" ry="5.5" fill="#12060a"/>`:`<ellipse cx="81" cy="119.5" rx="${m?3:3.4}" ry="${m?4:4.6}" fill="#160c12" opacity=".9"/>`;
  const lash=`M61,${m?118:117} C64,${top+3} 72,${top-2} 80,${top-1.5} C86,${top-1} 91,${top+2} 94,${m?113:112}`;
  return `<path d="${wp}" fill="#fff"/>
   <g clip-path="url(#${u}cl)"><ellipse cx="81" cy="118.5" rx="${ir}" ry="${iry}" fill="url(#${u}i)"/>${pup}
   ${c.ring?`<circle cx="81" cy="118.5" r="4.6" fill="none" stroke="${c.eye[0]}" stroke-width=".8" opacity=".7"/>`:''}
   <path d="M66,${top+1} Q80,${top-6} 94,${top+1} L94,${top+6} Q80,${top} 66,${top+6}Z" fill="#000" opacity=".28"/>
   <circle cx="84.5" cy="114.5" r="2.4" fill="#fff"/><circle cx="78" cy="123" r="1.1" fill="#fff" opacity=".85"/></g>
   <path d="${lash}" stroke="${c.lash||'#1c1218'}" stroke-width="${m?2.4:3.1}" fill="none" stroke-linecap="round"/>
   ${m?'':`<path d="M62,116 L57.5,112.5 M64,113.5 L60,109.5" stroke="${c.lash||'#1c1218'}" stroke-width="1.6" stroke-linecap="round"/>`}
   <path d="M70,${low-1} Q80,${low+2.5} 89,${low-3}" stroke="#3a2228" stroke-width="1" fill="none" opacity=".6"/>
   <path d="M68,${top-3} Q79,${top-9} 92,${top-4}" stroke="${c.skin[1]}" stroke-width="1" fill="none" opacity=".7"/>`;
}
function browSVG(c,mood){const m=c.sex==='m';let d=m?'M63,102 Q77,95 93,99':'M66,103 Q78,96 92,100';
  if(mood==='a')d=m?'M64,97 Q79,99 94,105':'M67,99 Q80,100 92,105';if(mood==='d'||mood==='x')d=m?'M64,101 Q78,100 92,95':'M66,101 Q78,100 91,96';if(mood==='o')d=m?'M63,98 Q77,89 93,94':'M66,99 Q78,90 92,95';if(mood==='k')d=m?'M63,101 Q77,95 93,100':'M66,101 Q78,95 92,100';
  return `<path d="${d}" stroke="${c.hd}" stroke-width="${c.bw||(m?3.4:2.3)}" fill="none" stroke-linecap="round"/>`}
function mouthSVG(c,mood){const lc=c.lip||(c.sex==='m'?'#9c5a52':'#b4505c');const f=c.sex!=='m';let s='';
  switch(mood){case's':case'b':s=`<path d="M91,148 Q100,157 109,148" stroke="${lc}" stroke-width="1.8" fill="${f?'#7a2a36':'none'}" fill-opacity=".55" stroke-linecap="round"/>`;break;
   case'k':s=`<path d="M93,151 Q102,153 109,146" stroke="${lc}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;break;
   case'a':s=`<path d="M93,153 Q100,149 107,153" stroke="${lc}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`;break;
   case'o':case'x':s=`<ellipse cx="100" cy="152" rx="3.6" ry="4.6" fill="#6a2430"/>`;break;
   case'd':s=`<path d="M94,153 Q100,150.5 106,153" stroke="${lc}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;break;
   default:s=`<path d="M94,151 Q100,153.5 106,151" stroke="${lc}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`}
  if(f&&mood!=='o'&&mood!=='x')s+=`<ellipse cx="100" cy="155" rx="4.2" ry="1.4" fill="${lc}" opacity=".35"/>`;
  return s}
function faceCore(u,c,mood){const blush=mood==='b'?.6:(c.sex==='m'?0:.22);
  const face=c.face||(c.sex==='m'?FACE_M:FACE_F);
  const ears=c.elf?`<path d="M64,112 L30,84 C38,104 46,124 63,131Z" fill="url(#${u}s)" stroke="${c.skin[1]}" stroke-width="1"/><path d="M60,108 L40,92 C46,106 52,118 61,124Z" fill="${c.skin[1]}" opacity=".5"/>`
   :`<path d="M63,110 C53,104 51,124 61,132Z" fill="url(#${u}s)" stroke="${c.skin[1]}" stroke-width="1"/>`;
  const eye=eyeSVG(u,c,mood);
  return `<path d="${NECK}" fill="${c.skin[1]}"/><path d="M88,152 Q100,170 112,152 L112,166 Q100,180 88,166Z" fill="#000" opacity=".12"/>
   ${ears}${mir(ears)}
   <path d="${face}" fill="url(#${u}s)" stroke="#5a3a3a" stroke-width="1" stroke-opacity=".35"/>
   ${blush?`<ellipse cx="73" cy="137" rx="9" ry="4.5" fill="#ff6f86" opacity="${blush}"/><ellipse cx="127" cy="137" rx="9" ry="4.5" fill="#ff6f86" opacity="${blush}"/>`:''}
   ${mood==='b'?'<path d="M70,134 l3,-3 M75,134 l3,-3 M122,134 l3,-3 M127,134 l3,-3" stroke="#e05070" stroke-width="1" opacity=".7"/>':''}
   <clipPath id="${u}cl"><path d="M66,117 Q76,${c.sex==='m'?110:104} 92,113 Q91,128 80,130 Q69,128 66,117Z"/></clipPath>
   <path d="M63,100 Q100,84 137,100 L137,108 Q100,94 63,108Z" fill="${c.skin[1]}" opacity=".45"/>
   ${c.sex==='m'?eye+mir(eye):`<g transform="translate(80 118) scale(1.08) translate(-80 -118)">${eye}</g>`+mir(`<g transform="translate(80 118) scale(1.08) translate(-80 -118)">${eye}</g>`)}${browSVG(c,mood)}${mir(browSVG(c,mood))}
   <path d="M101,127 Q99,135 97,138.5 Q100,140.5 103,138.5" stroke="${c.skin[1]}" stroke-width="1.3" fill="none"/>
   ${mouthSVG(c,mood)}${mood==='x'?'<path d="M138,96 C142,102 142,106 138,108 C134,106 134,102 138,96Z" fill="#9fd4ff" opacity=".8"/>':''}`}
function defs(u,c){const h=c.hair||['#888','#444'];return `<defs>
 <linearGradient id="${u}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h[0]}"/><stop offset="1" stop-color="${h[1]}"/></linearGradient>
 <radialGradient id="${u}s" cx=".5" cy=".42" r=".62"><stop offset=".55" stop-color="${c.skin[0]}"/><stop offset="1" stop-color="${c.skin[1]}"/></radialGradient>
 <radialGradient id="${u}i" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="${c.eye[0]}"/><stop offset=".55" stop-color="${c.eye[1]}"/><stop offset="1" stop-color="#140810"/></radialGradient>
 <linearGradient id="${u}o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${(c.out||['#333','#111'])[0]}"/><stop offset="1" stop-color="${(c.out||['#333','#111'])[1]}"/></linearGradient>
 <linearGradient id="${u}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#e8b85a"/><stop offset="1" stop-color="#7a4a0e"/></linearGradient>
 <linearGradient id="${u}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#b8c2d0"/><stop offset="1" stop-color="#4d5868"/></linearGradient>
 <radialGradient id="${u}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${c.glow||'#ff6a2b'}" stop-opacity=".55"/><stop offset="1" stop-color="${c.glow||'#ff6a2b'}" stop-opacity="0"/></radialGradient>
 <filter id="${u}f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
 <filter id="${u}gh"><feColorMatrix type="matrix" values=".5 .6 .2 0 .12  .4 .55 .15 0 .06  .2 .3 .1 0 0  0 0 0 .82 0"/></filter>
</defs>`}
const shine=(y=56)=>`<path d="M76,${y+2} Q100,${y-9} 124,${y+2}" stroke="#fff" stroke-width="5" fill="none" opacity=".22" stroke-linecap="round"/><path d="M84,${y+8} Q92,${y+3} 98,${y+5}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".3" stroke-linecap="round"/>`;
const ST=(c,arr)=>arr.map(d=>`<path d="${d}" stroke="${c}" stroke-width="1" fill="none" opacity=".45" stroke-linecap="round"/>`).join('');
const OL='stroke="#1a0e14" stroke-width="1.1" stroke-opacity=".55"';
// per-character layers: back, body, front, acc
const PC={
 hero:{sex:'m',skin:['#f8dcc6','#d9a58c'],hair:['#ffffff','#9aa5bd'],hd:'#5d6680',eye:['#fff0b0','#d48a0c'],ring:1,glow:'#ff6a2b',out:['#2c2333','#0d0a10'],def:'k',
  back:u=>`<path d="M52,104 C42,60 72,26 101,27 C132,28 160,60 149,106 C154,128 151,148 160,170 L141,154 L140,178 L126,160 L121,182 L110,164 L90,164 L79,182 L74,160 L60,178 L59,154 L40,170 C49,148 46,128 52,104Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/><path d="M88,186 L100,220 L112,186 Q100,193 88,186Z" fill="#ece6dc"/>
   <path d="M86,188 L66,150 L55,172 L70,212 L93,216Z" fill="#1d1722" ${OL}/><path d="M86,190 L68,157 L63,173 L76,205Z" fill="#a3172b"/>
   <path d="M114,188 L134,150 L145,172 L130,212 L107,216Z" fill="#1d1722" ${OL}/><path d="M114,190 L132,157 L137,173 L124,205Z" fill="#a3172b"/>
   <path d="M66,150 L55,172 L70,212 M134,150 L145,172 L130,212 M93,216 L95,250 M107,216 L105,250" stroke="url(#${u}m)" stroke-width="1.6" fill="none"/>
   <path d="M40,226 Q60,212 82,214 M160,226 Q140,212 118,214" stroke="#e8b85a" stroke-width="1" opacity=".5" fill="none"/>
   <path d="M90,192 Q94,214 100,224 Q106,214 110,192" stroke="url(#${u}m)" stroke-width="1.3" fill="none"/>
   <circle cx="100" cy="233" r="17" fill="url(#${u}g)"/><circle cx="100" cy="233" r="9.5" fill="url(#${u}m)" stroke="#6b4a12"/><path d="M100,225 C105,229 105,237 100,241 C97,237 96,230 100,225Z" fill="#ff5a1f"/><path d="M100,229 L100,240" stroke="#ffd36b" stroke-width=".8"/>`,
  front:u=>`<path d="M53,108 C47,64 74,38 102,38 C131,39 155,64 147,108 L141,92 L139,116 L129,86 L124,110 L115,82 L107,106 L99,78 L93,104 L85,82 L79,110 L71,88 L65,116 L59,96Z" fill="url(#${u}h)" ${OL}/>
   <path d="M101,80 C98,96 100,112 95,126 C105,112 107,96 105,80Z" fill="url(#${u}h)" ${OL}/>${shine(54)}${ST('#7a849c',['M102,40 C100,52 98,64 99,78','M88,44 C84,56 84,70 85,82','M116,44 C120,56 122,70 115,82','M74,52 C70,64 70,76 71,88','M130,52 C134,64 136,76 129,86'])}`,
  acc:u=>`<path d="M121,127 L129,141 M122.5,135 L128,132.5" stroke="#c9837a" stroke-width="1.5" stroke-linecap="round"/>`},
 master:{sex:'m',skin:['#f4d6c0','#cf9d86'],hair:['#f6f2ea','#b4ab9c'],hd:'#9a9182',eye:['#fff0b0','#e09a10'],ring:1,glow:'#ffb733',out:['#9a1f2c','#3a0a12'],
  back:u=>`<path d="M54,100 C48,56 76,30 100,30 C124,30 152,56 146,100 C150,140 156,170 160,200 L140,196 C142,170 140,150 138,130 L62,130 C60,150 58,170 60,196 L40,200 C44,170 50,140 54,100Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/><path d="M86,186 L58,156 L50,192 L82,208Z" fill="url(#${u}m)" ${OL}/><path d="M114,186 L142,156 L150,192 L118,208Z" fill="url(#${u}m)" ${OL}/>
   <path d="M62,166 L74,192 M68,162 L80,196 M138,166 L126,192 M132,162 L120,196" stroke="#7a4a0e" stroke-width="1" opacity=".6"/><circle cx="100" cy="206" r="6" fill="#d21f3a" stroke="url(#${u}m)" stroke-width="2"/>`,
  front:u=>`<path d="M56,96 C54,62 78,40 100,40 C122,40 146,62 144,96 C138,78 126,66 112,62 L100,72 L88,62 C74,66 62,78 56,96Z" fill="url(#${u}h)" ${OL}/><path d="M70,70 C63,90 63,106 66,120 C70,104 72,90 77,74Z M130,70 C137,90 137,106 134,120 C130,104 128,90 123,74Z" fill="url(#${u}h)"/>${shine(52)}`,
  acc:u=>`<path d="M74,140 C74,166 88,187 100,191 C112,187 126,166 126,140 C120,152 112,159 100,159 C88,159 80,152 74,140Z" fill="url(#${u}h)" ${OL}/><path d="M86,146 Q100,139 114,146 Q108,151 100,149 Q92,151 86,146Z" fill="#cfc8bb"/>
   <path d="M60,121 l-5,-2 M60,125 l-5,1 M140,121 l5,-2 M140,125 l5,1 M88,86 Q100,82 112,86" stroke="#b98a78" stroke-width="1" fill="none"/>`},
 liora:{sex:'f',skin:['#fbe3d3','#e3ae98'],hair:['#d9bcff','#6b44b8'],hd:'#4b2f86',eye:['#e6c2ff','#7a2bd0'],glow:'#b26bff',out:['#2a1f33','#0e0a12'],lip:'#b2405a',def:'k',
  back:u=>`<path d="M58,96 C50,56 80,32 104,34 C134,36 154,62 146,100 C150,130 160,158 170,188 C178,206 168,224 160,242 L138,240 C150,212 142,182 140,160 L60,160 C58,182 50,212 62,240 L40,242 C32,224 22,206 30,188 C40,158 50,130 58,96Z" fill="url(#${u}h)" ${OL}/>
   <path d="M150,150 C160,170 168,186 162,206 M44,160 C36,180 34,196 40,214" stroke="#fff" stroke-width="2" fill="none" opacity=".15"/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/><ellipse cx="42" cy="216" rx="24" ry="17" fill="#2e2338" ${OL}/><ellipse cx="158" cy="216" rx="24" ry="17" fill="#2e2338" ${OL}/>
   <path d="M24,214 Q42,200 62,214 M138,214 Q158,200 176,214" stroke="url(#${u}m)" stroke-width="1.5" fill="none"/>
   <path d="M78,186 L87,172 L100,196 L113,172 L122,186 L100,212Z" fill="#3a2a48" stroke="url(#${u}m)" stroke-width="1.6"/>
   <path d="M100,212 L100,250 M86,222 Q100,232 114,222 M80,236 Q100,248 120,236" stroke="url(#${u}m)" stroke-width="1.2" fill="none" opacity=".8"/>
   <path d="M87,168 Q100,174 113,168 L113,173 Q100,179 87,173Z" fill="#1c0f22"/><path d="M100,175 l4,5 l-4,5 l-4,-5Z" fill="#c78bff" stroke="url(#${u}m)" stroke-width="1"/>`,
  front:u=>`<path d="M60,102 C55,64 82,42 108,44 C134,46 148,66 142,100 C136,82 128,72 116,66 C112,82 100,93 82,99 C91,89 95,81 95,72 C85,84 73,93 63,106Z" fill="url(#${u}h)" ${OL}/>
   <path d="M62,96 C53,120 56,150 47,182 C59,170 65,150 67,126Z M138,96 C147,122 146,152 155,186 C144,173 136,152 134,128Z" fill="url(#${u}h)" ${OL}/>${shine(52)}${ST('#4b2f86',['M96,72 C92,84 86,92 78,98','M116,66 C113,80 106,89 96,95','M128,72 C134,84 138,92 140,100','M108,48 C100,52 90,60 80,72','M64,104 C60,124 58,150 52,176','M136,104 C141,126 142,152 150,180'])}`,
  acc:u=>`<circle cx="60" cy="135" r="3" fill="url(#${u}m)"/><circle cx="60" cy="143" r="4.5" fill="url(#${u}m)" stroke="#7a4a0e" stroke-width=".6"/><circle cx="140" cy="135" r="3" fill="url(#${u}m)"/><circle cx="140" cy="143" r="4.5" fill="url(#${u}m)" stroke="#7a4a0e" stroke-width=".6"/>
   <circle cx="113" cy="134" r="1.3" fill="#3a1a28"/><path d="M128,62 l10,-12 l3,3 l-10,12Z" fill="url(#${u}m)"/><circle cx="140" cy="51" r="4" fill="#c78bff" stroke="url(#${u}m)"/>`},
 aira:{sex:'f',skin:['#fbe0cf','#e0a891'],hair:['#ff6a5a','#9c1027'],hd:'#6e0e1d',eye:['#c4e6ff','#2b6cb8'],glow:'#ff3b3b',out:['#2a1a1e','#120a0c'],lip:'#b8404a',def:'n',
  back:u=>`<path d="M60,98 C56,58 82,38 102,38 C128,38 148,60 142,100 L138,124 L62,124Z" fill="url(#${u}h)"/>
   <path d="M118,46 C150,22 182,38 178,80 C175,118 188,152 170,200 C166,172 158,142 148,120 C160,96 156,70 136,56Z" fill="url(#${u}h)" ${OL}/>
   <path d="M160,60 C170,90 168,120 172,160" stroke="#fff" stroke-width="2.4" fill="none" opacity=".18"/>`,
  body:u=>`<path d="M12,250 C16,212 40,194 72,190 L128,190 C160,194 184,212 188,250Z" fill="#8e1b28"/><path d="${BODY}" fill="url(#${u}o)"/>
   <path d="M84,188 L86,168 Q100,174 114,168 L116,188 Q100,194 84,188Z" fill="#1d1316" ${OL}/>
   <path d="M60,250 C62,224 76,206 100,204 C124,206 138,224 140,250Z" fill="url(#${u}v)" ${OL}/><path d="M100,214 l6,8 l-6,8 l-6,-8Z" fill="#c22a3a"/>
   <path d="M22,228 C24,200 48,186 74,192 C76,208 64,224 42,234Z" fill="url(#${u}v)" ${OL}/><path d="M30,236 C32,214 50,204 70,208 C70,220 60,232 44,240Z" fill="url(#${u}v)" ${OL}/>
   <path d="M178,228 C176,200 152,186 126,192 C124,208 136,224 158,234Z" fill="url(#${u}v)" ${OL}/><path d="M170,236 C168,214 150,204 130,208 C130,220 140,232 156,240Z" fill="url(#${u}v)" ${OL}/>
   <path d="M26,226 C34,206 52,196 72,196 M174,226 C166,206 148,196 128,196" stroke="#c22a3a" stroke-width="2" fill="none"/>`,
  front:u=>`<path d="M58,104 C54,62 80,42 102,42 C128,42 148,62 142,104 L136,90 L131,104 L124,82 L117,100 L108,78 L100,98 L92,78 L86,100 L78,84 L72,104 L66,92Z" fill="url(#${u}h)" ${OL}/>
   <path d="M62,98 C56,120 58,142 53,162 C62,152 66,134 68,116Z M138,98 C144,120 142,142 147,162 C138,152 134,134 132,116Z" fill="url(#${u}h)" ${OL}/>${shine(54)}${ST('#6e0e1d',['M100,46 C98,60 100,80 100,96','M84,50 C80,64 80,78 82,98','M118,50 C122,64 124,80 124,98'])}`,
  acc:u=>`<rect x="122" y="42" width="12" height="7" rx="3" transform="rotate(-30 128 45)" fill="url(#${u}m)"/><path d="M71,97 L76,107" stroke="#c48a7a" stroke-width="1.2"/>`},
 seylin:{sex:'f',skin:['#fdeee2','#e8bea8'],hair:['#fffbea','#c9bd92'],hd:'#9c8f66',eye:['#a6ffd8','#0f8a5c'],glow:'#3ddc97',out:['#2a7a5a','#0f3a2a'],lip:'#c06070',elf:1,def:'s',
  back:u=>`<path d="M60,96 C54,54 82,34 100,34 C118,34 146,54 140,96 C144,140 150,190 156,250 L44,250 C50,190 56,140 60,96Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/>
   ${[[70,192,-30],[82,200,-12],[100,204,0],[118,200,12],[130,192,30],[58,198,-50],[142,198,50]].map(([x,y,r])=>`<path d="M${x},${y} c-6,8 -6,18 0,24 c6,-6 6,-16 0,-24Z" transform="rotate(${r} ${x} ${y})" fill="#5fd0a0" stroke="#1f5d46" stroke-width=".8"/><path d="M${x},${y+2} l0,20" transform="rotate(${r} ${x} ${y})" stroke="#e8d38a" stroke-width=".7"/>`).join('')}
   <path d="M100,214 C104,220 104,228 100,232 C96,228 96,220 100,214Z" fill="#7cf0c0" stroke="url(#${u}m)" stroke-width="1.2"/><path d="M90,190 Q100,212 110,190" stroke="url(#${u}m)" stroke-width="1" fill="none"/>`,
  front:u=>`<path d="M60,100 C58,62 80,42 100,42 C120,42 142,62 140,100 C134,86 124,70 104,62 L100,74 L96,62 C76,70 66,86 60,100Z" fill="url(#${u}h)" ${OL}/>
   <path d="M61,96 C55,128 58,172 51,214 C62,198 68,160 68,120Z M139,96 C145,128 142,172 149,214 C138,198 132,160 132,120Z" fill="url(#${u}h)" ${OL}/>
   ${[0,1,2,3,4,5,6].map(i=>`<ellipse cx="${66-i*1.2}" cy="${116+i*11}" rx="4" ry="6" fill="url(#${u}h)" ${OL} transform="rotate(${i%2?14:-14} ${66-i*1.2} ${116+i*11})"/>`).join('')}${shine(52)}${ST('#9c8f66',['M100,44 C96,50 92,58 90,64','M100,44 C104,50 108,58 110,64','M66,96 C62,130 62,170 56,206','M134,96 C138,130 138,170 144,206','M80,58 C72,66 66,80 63,96','M120,58 C128,66 134,80 137,96'])}`,
  acc:u=>`<path d="M64,86 Q100,70 136,86" stroke="url(#${u}m)" stroke-width="1.8" fill="none"/><path d="M100,71 C104,75 104,81 100,84 C96,81 96,75 100,71Z" fill="#3ddc97" stroke="url(#${u}m)"/>`},
 velena:{sex:'f',skin:['#fbe6dc','#deaa98'],hair:['#433b52','#0d0a12'],hd:'#08060b',eye:['#ff9aaa','#a3102c'],slit:1,glow:'#c2182f',out:['#5a0f1e','#1a0509'],lip:'#9d1730',def:'k',
  back:u=>`<path d="M58,96 C52,52 82,32 100,32 C118,32 148,52 142,96 C148,140 158,190 162,250 L38,250 C42,190 52,140 58,96Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/><path d="M60,198 Q100,226 140,198 L146,212 Q100,244 54,212Z" fill="#f4ede2" ${OL}/>
   ${[0,1,2,3,4,5,6,7,8].map(i=>{const x=62+i*9.5,y=206+Math.sin(i/8*Math.PI)*18;return`<path d="M${x},${y-4} l4,4 l-4,4 l-4,-4Z" fill="#c2182f"/><circle cx="${x}" cy="${y}" r="1.1" fill="#1a0509"/>`}).join('')}
   <path d="M86,186 L100,204 L114,186" stroke="#c2182f" stroke-width="1.5" fill="none"/>
   <path d="M24,250 C24,214 38,200 58,198 L54,212 C44,220 40,236 42,250Z M176,250 C176,214 162,200 142,198 L146,212 C156,220 160,236 158,250Z" fill="#2a060c" opacity=".7"/>`,
  front:u=>`<path d="M60,102 C58,64 80,46 100,48 C120,46 142,64 140,102 C134,82 120,64 100,60 C80,64 66,82 60,102Z" fill="url(#${u}h)" ${OL}/>
   <path d="M61,98 C55,130 57,168 50,206 C61,192 67,158 68,120Z M139,98 C145,130 143,168 150,206 C139,192 133,158 132,120Z" fill="url(#${u}h)" ${OL}/>${shine(56)}${ST('#5a4e6a',['M100,50 C92,56 82,66 72,84','M100,50 C108,56 118,66 128,84','M64,100 C60,130 60,166 54,200','M136,100 C140,130 140,166 146,200'])}`,
  acc:u=>`<path d="M56,80 C56,40 78,12 100,10 C122,12 144,40 144,80 C130,71 116,67 100,67 C84,67 70,71 56,80Z" fill="#9b0f2a" stroke="url(#${u}m)" stroke-width="2.2"/>
   <path d="M66,72 C68,46 82,26 100,22 C118,26 132,46 134,72" stroke="url(#${u}m)" stroke-width="1.2" fill="none"/>
   ${[...Array(11)].map((_,i)=>{const a=Math.PI*(.12+.76*i/10),x=100-Math.cos(a)*42,y=76-Math.sin(a)*62;return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#fff6ea" stroke="#c9b48a" stroke-width=".4"/>`}).join('')}
   <path d="M100,30 l7,10 l-7,10 l-7,-10Z" fill="#ff2a4a" stroke="url(#${u}m)" stroke-width="1.2"/>
   ${[0,1,2,3,4].map(i=>`<circle cx="${60-i*.6}" cy="${84+i*7}" r="1.7" fill="#fff6ea"/><circle cx="${140+i*.6}" cy="${84+i*7}" r="1.7" fill="#fff6ea"/>`).join('')}`},
 matvey:{sex:'m',skin:['#f4d2b8','#cd9576'],hair:['#f4f1ea','#c4bcae'],hd:'#e6e0d4',bw:4.5,eye:['#9fc7e8','#3a6a98'],sleepy:1,glow:'#e8b85a',out:['#ece2ca','#b8a684'],def:'s',
  back:u=>`<path d="M58,98 C48,104 50,128 62,134 L64,104Z M142,98 C152,104 150,128 138,134 L136,104Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)" ${OL}/><path d="M84,190 Q100,198 116,190 L116,198 Q100,206 84,198Z" fill="#c22a3a"/><path d="M106,198 L106,240" stroke="#c22a3a" stroke-width="3"/>
   ${[0,1,2,3].map(i=>`<path d="M${88+i*7},194 l3,3 l-3,3 l-3,-3Z" fill="#ffd36b"/>`).join('')}`,
  front:u=>`<ellipse cx="86" cy="66" rx="10" ry="4" fill="#fff" opacity=".25"/>`,
  acc:u=>`<path d="M68,132 C66,170 84,200 100,202 C116,200 134,170 132,132 C124,150 112,158 100,158 C88,158 76,150 68,132Z" fill="url(#${u}h)" ${OL}/><path d="M84,146 Q100,138 116,146 Q108,153 100,150 Q92,153 84,146Z" fill="#ddd6c8" ${OL}/><circle cx="100" cy="135" r="6" fill="#e9a08a"/>`},
 baron:{sex:'m',skin:['#f6d0b8','#cf8f74'],hair:['#6a4424','#3a2410'],hd:'#3a2410',eye:['#a0d0a0','#3a6a3a'],sleepy:1,glow:'#b266ff',out:['#5a2a7a','#220c30'],face:FACE_FAT,
  back:u=>`<path d="M54,104 C44,96 46,130 56,138 L58,108Z M146,104 C156,96 154,130 144,138 L142,108Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="M14,250 C16,206 50,190 84,184 Q100,190 116,184 C150,190 184,206 186,250Z" fill="url(#${u}o)"/>
   <path d="M40,212 C46,196 64,188 84,186 C80,196 86,206 100,208 C114,206 120,196 116,186 C136,188 154,196 160,212 C150,206 140,214 130,208 C122,218 110,214 100,220 C90,214 78,218 70,208 C60,214 50,206 40,212Z" fill="#f4efe6" ${OL}/>
   <path d="M76,214 Q100,244 124,214" stroke="url(#${u}m)" stroke-width="3" fill="none"/><circle cx="100" cy="232" r="6" fill="url(#${u}m)"/>`,
  front:u=>`<path d="M70,76 C76,62 90,58 100,58 C112,58 126,62 132,76 C120,70 108,70 100,72 C90,70 80,70 70,76Z" fill="url(#${u}h)" ${OL}/>`,
  acc:u=>`<path d="M78,170 Q100,186 122,170" stroke="#b98a78" stroke-width="1.2" fill="none"/><circle cx="100" cy="135" r="5.5" fill="#ea8a86"/>
   <path d="M84,145 C76,145 68,139 62,130 C68,144 78,150 92,150 Q100,147 108,150 C122,150 132,144 138,130 C132,139 124,145 116,145 Q100,141 84,145Z" fill="#3a2614" ${OL}/>`},
 kael:{sex:'m',skin:['#efd8c8','#c69e8a'],hair:['#3a3a42','#16161a'],hd:'#16161a',eye:['#e8f6ff','#5a8fb8'],glow:'#9fb0c0',out:['#6b7280','#2a2e36'],def:'n',
  back:u=>`<path d="M44,130 C38,60 70,24 100,24 C130,24 162,60 156,130 C160,170 168,210 174,250 L26,250 C32,210 40,170 44,130Z" fill="url(#${u}o)" ${OL}/><path d="M58,104 C56,62 80,40 100,40 C120,40 144,62 142,104 C144,134 140,154 130,170 L70,170 C60,154 56,134 58,104Z" fill="#121418"/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/><path d="M86,188 L100,214 L114,188" stroke="#2a2e36" stroke-width="2" fill="none"/><circle cx="100" cy="220" r="8" fill="url(#${u}v)"/><path d="M96,214 L104,226 M104,214 L96,226" stroke="#2a2e36" stroke-width="1.6"/>`,
  front:u=>`<path d="M66,92 C70,70 86,60 100,60 C116,60 130,70 134,92 L126,80 L118,94 L108,78 L100,92 L92,78 L82,94 L74,80Z" fill="url(#${u}h)"/>`,
  acc:u=>`<path fill-rule="evenodd" d="M61,98 C62,90 72,86 101,89 L101,130 C88,127 76,131 63,134 C59,122 59,108 61,98Z M67,117 Q77,108 91,114 Q90,124 79,125 Q70,124 67,117Z" fill="url(#${u}v)" stroke="#40464f" stroke-width="1"/><path d="M74,100 Q86,96 96,99" stroke="#40464f" stroke-width="1" fill="none"/>`},
 valdric:{sex:'m',skin:['#ffe9b0','#c98a2a'],hair:['#fff','#ccc'],hd:'#7a4a0e',eye:['#fff6c0','#ffb733'],glow:'#ffd36b',out:['#f4ead2','#8a7448'],
  back:u=>`<path d="M44,130 C38,60 70,24 100,24 C130,24 162,60 156,130 C160,170 168,210 174,250 L26,250 C32,210 40,170 44,130Z" fill="url(#${u}o)" ${OL}/><path d="M58,104 C56,62 80,40 100,40 C120,40 144,62 142,104 C144,134 140,154 130,170 L70,170 C60,154 56,134 58,104Z" fill="#0d0a06"/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/><path d="M70,196 Q100,214 130,196 L126,250 L74,250Z" fill="url(#${u}m)" opacity=".75"/>`,
  mask:1,
  acc:u=>`<path d="${FACE_M}" fill="url(#${u}m)" stroke="#6b4a12" stroke-width="1.4"/>${[...Array(7)].map((_,i)=>{const a=Math.PI*(.15+.7*i/6);return`<path d="M100,92 L${(100-Math.cos(a)*20).toFixed(1)},${(92-Math.sin(a)*20).toFixed(1)}" stroke="#7a4a0e" stroke-width="1.6"/>`}).join('')}<circle cx="100" cy="92" r="5" fill="#7a4a0e"/>
   <path d="M68,118 Q80,111 92,117 Q80,121 68,118Z M132,118 Q120,111 108,117 Q120,121 132,118Z" fill="#000"/><circle cx="81" cy="117" r="1.8" fill="#ffd36b"/><circle cx="119" cy="117" r="1.8" fill="#ffd36b"/><path d="M90,152 Q100,155 110,152" stroke="#6b4a12" stroke-width="1.4" fill="none"/><path d="M100,126 L100,140" stroke="#a87a2a" stroke-width="1"/>`},
 prokhor:{sex:'m',skin:['#f4cdb0','#cc8c6c'],hair:['#8a6040','#4a3018'],hd:'#4a3018',eye:['#b8c8a0','#5a6a3a'],sleepy:1,glow:'#ff9a5a',out:['#6a4a2a','#2a1a0c'],def:'s',
  back:u=>`<path d="M56,100 C48,60 76,36 100,36 C126,36 152,60 144,100 L146,124 L54,124Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)" ${OL}/><rect x="50" y="214" width="16" height="12" fill="#8a6a3a" transform="rotate(-12 58 220)"/><path d="M86,188 L100,206 L114,188" stroke="#2a1a0c" stroke-width="2" fill="none"/>`,
  front:u=>`<path d="M58,100 C56,66 80,46 100,46 C124,46 146,66 142,100 L134,82 L126,96 L116,74 L106,92 L96,72 L86,94 L76,78 L68,96Z" fill="url(#${u}h)" ${OL}/>`,
  acc:u=>`<circle cx="100" cy="134" r="6.5" fill="#e87a70"/><ellipse cx="72" cy="138" rx="9" ry="5" fill="#ff6f6f" opacity=".4"/><ellipse cx="128" cy="138" rx="9" ry="5" fill="#ff6f6f" opacity=".4"/>${[...Array(22)].map(()=>`<circle cx="${ri(78,122)}" cy="${ri(150,166)}" r=".7" fill="#4a3018" opacity=".6"/>`).join('')}`},
 frol:{sex:'m',skin:['#f0ceb4','#c48c70'],hair:['#c8c8cc','#7a7a80'],hd:'#5a5a60',eye:['#e0c070','#8a6010'],glow:'#5fd068',out:['#2a4a32','#0e1e12'],def:'k',
  back:u=>`<path d="M56,100 C50,62 76,38 100,38 C124,38 150,62 144,100 L146,130 L54,130Z" fill="url(#${u}h)" ${OL}/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)" ${OL}/><path d="M86,188 L100,210 L114,188" fill="#e8dcc0"/><circle cx="100" cy="222" r="2" fill="url(#${u}m)"/><circle cx="100" cy="234" r="2" fill="url(#${u}m)"/>`,
  front:u=>`<path d="M58,98 C56,64 80,46 104,46 C128,48 146,68 142,98 C132,78 116,66 96,64 C80,68 66,80 58,98Z" fill="url(#${u}h)" ${OL}/>${shine(54)}`,
  acc:u=>`<path d="M86,146 C80,148 72,156 70,170 M114,146 C120,148 128,156 130,170" stroke="#7a7a80" stroke-width="2.4" fill="none"/><path d="M86,146 Q100,141 114,146" stroke="#7a7a80" stroke-width="3" fill="none"/>
   <path d="M64,112 L96,108 L96,126 L66,128Z" fill="#1a1a1a"/><path d="M62,104 L140,96" stroke="#1a1a1a" stroke-width="1.6"/>`},
 hodja:{sex:'m',skin:['#ecc09c','#b88460'],hair:['#2a1a10','#0e0804'],hd:'#1a1008',eye:['#a07040','#4a2a10'],glow:'#ffcf6b',out:['#d8782a','#7a3a0c'],def:'s',
  back:u=>``,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)" ${OL}/>${[0,1,2,3,4].map(i=>`<path d="M${40+i*30},250 C${44+i*30},220 ${50+i*30},205 ${60+i*28},198" stroke="#ffcf6b" stroke-width="3" fill="none" opacity=".5"/>`).join('')}`,
  front:u=>`<path d="M52,92 C46,52 76,26 100,26 C124,26 154,52 148,92 C138,80 124,74 100,74 C76,74 62,80 52,92Z" fill="#f6f0e2" ${OL}/><path d="M58,84 C76,60 124,60 142,84 M62,72 C80,50 120,50 138,72 M70,58 C86,42 114,42 130,58" stroke="#d8ccb0" stroke-width="2" fill="none"/><circle cx="100" cy="62" r="6" fill="#c22a3a" stroke="url(#${u}m)" stroke-width="1.5"/><path d="M100,56 C106,44 112,40 116,30" stroke="#5fd068" stroke-width="2.4" fill="none"/>`,
  acc:u=>`<path d="M70,136 C68,172 86,200 100,202 C114,200 132,172 130,136 C122,152 112,158 100,158 C88,158 78,152 70,136Z" fill="url(#${u}h)" ${OL}/><path d="M84,146 Q100,139 116,146 Q108,151 100,149 Q92,151 84,146Z" fill="#1a1008"/>`},
 stranger:{sex:'m',skin:['#2a2430','#16121a'],hair:['#2a2a3a','#0a0a12'],hd:'#000',eye:['#c8f0ff','#3aa0ff'],glow:'#4aa3ff',out:['#22202c','#08080c'],mask:1,
  back:u=>`<path d="M44,130 C38,60 70,24 100,24 C130,24 162,60 156,130 C160,170 168,210 174,250 L26,250 C32,210 40,170 44,130Z" fill="url(#${u}o)" ${OL}/><path d="M58,104 C56,62 80,40 100,40 C120,40 144,62 142,104 C144,134 140,154 130,170 L70,170 C60,154 56,134 58,104Z" fill="#050407"/>`,
  body:u=>`<path d="${BODY}" fill="url(#${u}o)"/>`,
  acc:u=>`<ellipse cx="82" cy="116" rx="7" ry="3" fill="#8fd8ff" filter="url(#${u}f)"/><ellipse cx="118" cy="116" rx="7" ry="3" fill="#8fd8ff" filter="url(#${u}f)"/><ellipse cx="82" cy="116" rx="4" ry="1.6" fill="#fff"/><ellipse cx="118" cy="116" rx="4" ry="1.6" fill="#fff"/>`},
};
function portrait(id,mood,o={}){const c=PC[id];if(!c)return'';const u='p'+(++_u);mood=mood||c.def||'n';
  const core=c.mask?'':faceCore(u,c,mood);
  const inner=`<ellipse cx="100" cy="130" rx="105" ry="115" fill="url(#${u}g)" opacity="${o.noGlow?0:.9}"/>${c.back(u)}${c.body(u)}${c.mask?`<path d="${NECK}" fill="${c.skin[1]}"/>`:''}${core}${c.front?c.front(u):''}${c.acc?c.acc(u):''}`;
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">${defs(u,c)}${o.ghost?`<g filter="url(#${u}gh)" opacity=".9">${inner}</g><ellipse cx="100" cy="130" rx="90" ry="110" fill="#ffd36b" opacity=".12"/>`:inner}</svg>`}

function chestSVG(type,open=false){const c=CHESTS[type]||CHESTS.wood;const u='c'+(++_u);
  const pal={wood:['#c08850','#6a3e1a','#3a3f48','#8a92a0'],iron:['#a8b2c2','#4a5262','#2a2e36','#d8dee8'],gold:['#ffe08a','#b8780e','#7a4a0e','#fff3c4'],myth:['#c88aff','#4a1a8a','#1aa0a0','#a8fff0'],master:['#ff8a3d','#8a1a10','#ffd36b','#fff3c4']}[type]||['#c08850','#6a3e1a','#3a3f48','#8a92a0'];
  const lid=open?'translate(0,-34) rotate(-18 40 70)':'';
  return `<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></linearGradient>
   <linearGradient id="${u}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${pal[3]}"/><stop offset="1" stop-color="${pal[2]}"/></linearGradient>
   <radialGradient id="${u}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${c.col}" stop-opacity=".9"/><stop offset="1" stop-color="${c.col}" stop-opacity="0"/></radialGradient></defs>
   <ellipse cx="100" cy="158" rx="78" ry="9" fill="#000" opacity=".5"/>
   ${open?`<ellipse cx="100" cy="76" rx="80" ry="40" fill="url(#${u}g)"/>`:''}
   <path d="M28,78 L172,78 L166,150 Q100,160 34,150Z" fill="url(#${u}a)" stroke="#1a0e08" stroke-width="2"/>
   <path d="M30,96 L170,96 M32,124 L168,124" stroke="#00000044" stroke-width="2"/>
   <rect x="46" y="78" width="14" height="76" fill="url(#${u}b)" stroke="#1a0e08"/><rect x="140" y="78" width="14" height="76" fill="url(#${u}b)" stroke="#1a0e08"/>
   ${type==='myth'?'<path d="M80,110 l10,-10 l10,10 l10,-10 l10,10" stroke="#a8fff0" stroke-width="2" fill="none" opacity=".8"/>':''}
   ${type==='master'?'<path d="M100,100 C112,110 112,130 100,142 C94,130 92,114 100,100Z" fill="#ffd36b" opacity=".85"/>':''}
   <g transform="${lid}"><path d="M28,78 C28,40 172,40 172,78Z" fill="url(#${u}a)" stroke="#1a0e08" stroke-width="2"/><path d="M46,78 C46,50 60,46 60,46 L60,78Z M140,46 C140,46 154,50 154,78 L140,78Z" fill="url(#${u}b)" stroke="#1a0e08"/>
   <path d="M40,60 Q100,40 160,60" stroke="#ffffff33" stroke-width="4" fill="none"/></g>
   ${open?'':`<rect x="88" y="70" width="24" height="28" rx="4" fill="url(#${u}b)" stroke="#1a0e08" stroke-width="1.5"/><circle cx="100" cy="82" r="3.4" fill="#1a0e08"/><path d="M100,84 L100,92" stroke="#1a0e08" stroke-width="2.4"/>`}
  </svg>`}

const BGS={
 fire:'radial-gradient(ellipse at 50% 30%,#ff7a1a 0%,#a3170f 35%,#2a0606 75%,#0a0202 100%)',
 dawn:'linear-gradient(180deg,#f4b28a 0%,#c9786a 30%,#5a3a52 65%,#1a1420 100%)',
 home:'radial-gradient(ellipse at 50% 70%,#6a3a1a 0%,#2a1810 50%,#0d0806 100%)',
 market:'linear-gradient(180deg,#e8a860 0%,#9a5a3a 40%,#3a2028 75%,#140c12 100%)',
 tavern:'radial-gradient(ellipse at 40% 40%,#c87a2a 0%,#5a2a14 45%,#160a06 100%)',
 castle:'linear-gradient(180deg,#3a2a5a 0%,#2a1a3a 40%,#120a1a 100%)',
 forest:'linear-gradient(180deg,#2a5a4a 0%,#14382a 45%,#081610 100%)',
 swamp:'linear-gradient(180deg,#4a5a3a 0%,#2a3a24 40%,#0e140a 100%)',
 night:'radial-gradient(ellipse at 70% 15%,#3a4a7a 0%,#141a30 40%,#05060c 100%)',
 sunset:'linear-gradient(180deg,#ff9a4a 0%,#c2410c 30%,#5a1a2a 65%,#140810 100%)',
 dark:'#07050a',
};
function homeBanner(){const night=false;const moon=moonPhase();const wet=S.weather==='дождь'||S.weather==='гроза';
 return `<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wet?'#3a4458':'#2a1a3a'}"/><stop offset=".6" stop-color="${wet?'#5a6070':'#c2614a'}"/><stop offset="1" stop-color="${wet?'#6a6a70':'#f4a86a'}"/></linearGradient>
 <radialGradient id="win" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd36b"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient></defs>
 <rect width="360" height="150" fill="url(#sky)"/>${moon===0?'<circle cx="300" cy="34" r="16" fill="#fff6d8"/><circle cx="300" cy="34" r="28" fill="#fff6d8" opacity=".15"/>':`<circle cx="300" cy="34" r="12" fill="#fff6d8" opacity=".8"/><circle cx="${306-moon}" cy="31" r="11" fill="${wet?'#3a4458':'#2a1a3a'}"/>`}
 ${[[30,20],[70,40],[120,14],[200,30],[250,12],[340,60]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1" fill="#fff" opacity=".7"/>`).join('')}
 <path d="M0,110 Q60,80 120,100 T240,96 T360,92 L360,150 L0,150Z" fill="#2a1e2a"/><path d="M0,124 Q90,106 180,118 T360,112 L360,150 L0,150Z" fill="#1a1218"/>
 <g transform="translate(150,58)"><path d="M0,40 L35,8 L70,40Z" fill="#3a1e18"/><rect x="6" y="40" width="58" height="36" fill="#4a3022"/><rect x="40" y="0" width="10" height="20" fill="#3a2a22"/>
  <circle cx="45" cy="-6" r="6" fill="#aaa" opacity=".3"/><circle cx="50" cy="-16" r="8" fill="#aaa" opacity=".2"/>
  <rect x="16" y="50" width="12" height="12" fill="#ffd36b"/><circle cx="22" cy="56" r="14" fill="url(#win)" opacity=".7"/><rect x="40" y="52" width="14" height="24" fill="#2a1810"/></g>
 ${[0,1,2,3,4,5].map(i=>`<path d="M${40+i*14},132 q4,-14 8,0" stroke="#5fd068" stroke-width="2" fill="none"/>`).join('')}
 ${wet?[...Array(40)].map(()=>`<line x1="${ri(0,360)}" y1="${ri(0,150)}" x2="${ri(0,360)-4}" y2="${ri(0,150)+10}" stroke="#9fc7e8" stroke-width=".8" opacity=".5"/>`).join(''):''}
 <g transform="translate(232,118)"><ellipse cx="0" cy="8" rx="9" ry="5" fill="#e88a3a"/><circle cx="-7" cy="2" r="5" fill="#e88a3a"/><path d="M-11,-1 l2,-6 l3,5 M-6,-2 l2,-6 l2,5" fill="#e88a3a"/><path d="M8,8 q8,-2 6,-10" stroke="#e88a3a" stroke-width="2.5" fill="none"/></g>
 </svg>`}
function valleyMapSVG(){const L=LOCS;let nodes='';
 for(const id in L){const l=L[id];const ok=locOpen(id);const isQ=questLocHint(id);
  nodes+=`<g class="mapnode" data-loc="${id}" transform="translate(${l.x},${l.y})" opacity="${ok?1:.45}">${isQ?'<circle r="20" fill="#ffd36b" class="pulse" opacity=".5"/>':''}<circle r="15" fill="${ok?'#2a1e14':'#151015'}" stroke="${ok?'#e8b85a':'#555'}" stroke-width="2"/><text y="6" text-anchor="middle" font-size="16">${ok?l.e:'🔒'}</text><text y="29" text-anchor="middle" font-size="9.5" fill="#f4e6c8" stroke="#000" stroke-width="2.5" paint-order="stroke" font-family="Georgia,serif">${l.n}</text></g>`}
 return `<svg viewBox="0 0 340 270" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="par" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#d9c08a"/><stop offset="1" stop-color="#7a5a32"/></radialGradient>
 <pattern id="tr" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="5" fill="#2a4a2a" opacity=".55"/></pattern></defs>
 <rect width="340" height="270" fill="url(#par)"/>
 <path d="M0,0 L340,0 L340,270 L0,270Z" fill="none" stroke="#3a2614" stroke-width="6"/>
 <path d="M10,80 C40,60 60,150 30,180 C10,160 0,120 10,80Z M40,90 C80,70 110,120 90,160 C60,170 40,130 40,90Z" fill="url(#tr)"/>
 <ellipse cx="250" cy="115" rx="55" ry="30" fill="#5a6a3a" opacity=".6"/><ellipse cx="240" cy="120" rx="30" ry="14" fill="#3a5a4a" opacity=".6"/>
 ${[[220,30],[245,22],[270,32],[295,26],[200,40]].map(([x,y])=>`<path d="M${x-16},${y+22} L${x},${y-6} L${x+16},${y+22}Z" fill="#6a5a4a" stroke="#3a2a1a"/><path d="M${x-5},${y+6} L${x},${y-6} L${x+5},${y+6}Z" fill="#f4f0e6"/>`).join('')}
 <path d="M340,150 C280,160 230,170 190,200 C160,222 120,230 80,250 L60,270" stroke="#4a7aa8" stroke-width="7" fill="none" opacity=".7"/>
 <path d="M150,205 C120,180 90,150 70,120 M150,205 C190,170 220,140 250,110 M150,205 C190,205 250,205 290,200 M150,205 C200,230 260,245 315,250 M70,120 C60,90 50,60 40,40 M250,110 C255,80 255,60 255,40 M150,205 C120,210 60,200 30,195 M70,120 C100,80 130,50 155,30" stroke="#5a3a1a" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity=".7"/>
 <text x="12" y="262" font-family="Georgia,serif" font-size="11" fill="#3a2614" font-style="italic">Долина Вербы</text>
 <g transform="translate(316,24)"><circle r="12" fill="none" stroke="#3a2614"/><path d="M0,-12 L3,0 L0,12 L-3,0Z" fill="#3a2614"/><text y="-15" font-size="8" text-anchor="middle" fill="#3a2614">С</text></g>
 ${nodes}</svg>`}
function worldMapSVG(){return `<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="300" fill="#16222e"/>
 <path d="M60,40 C120,10 230,14 300,30 C346,50 350,110 330,160 C320,210 290,250 230,276 C170,296 110,286 70,250 C30,214 20,160 30,110 C36,80 40,56 60,40Z" fill="#c8b48a" stroke="#5a4a32" stroke-width="3"/>
 ${WORLD.map(w=>`<circle cx="${w.x}" cy="${w.y}" r="${w.n.includes('Пустошь')?42:36}" fill="${w.c}" opacity=".55"/>`).join('')}
 <path d="M200,95 C215,80 240,85 250,100 C262,120 245,140 225,135 C205,130 190,115 200,95Z" fill="#100c0e" opacity=".85"/>
 ${WORLD.map(w=>`<text x="${w.x}" y="${w.y+4}" text-anchor="middle" font-size="10.5" font-family="Georgia,serif" fill="#fff6e0" stroke="#000" stroke-width="2.5" paint-order="stroke">${w.n}</text>`).join('')}
 <g transform="translate(108,182)"><circle r="5" fill="#ff6a2b"/><circle r="10" fill="none" stroke="#ff6a2b" class="pulse"/><text x="8" y="14" font-size="9" fill="#fff" stroke="#000" stroke-width="2" paint-order="stroke">Ты здесь</text></g>
 <g transform="translate(176,262)"><path d="M0,-12 L4,0 L-4,0Z" fill="#ffd36b"/><text x="7" y="0" font-size="8.5" fill="#ffd36b" stroke="#000" stroke-width="2" paint-order="stroke">Шпиль Тигля</text></g>
 </svg>`}
function wheelSVG(){const n=WHEEL.length,R=150;let s='';for(let i=0;i<n;i++){const a0=(i/n)*Math.PI*2-Math.PI/2,a1=((i+1)/n)*Math.PI*2-Math.PI/2;const x0=160+Math.cos(a0)*R,y0=160+Math.sin(a0)*R,x1=160+Math.cos(a1)*R,y1=160+Math.sin(a1)*R;
  const am=(a0+a1)/2,tx=160+Math.cos(am)*104,ty=160+Math.sin(am)*104,ex=160+Math.cos(am)*128,ey=160+Math.sin(am)*128;
  s+=`<path d="M160,160 L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}Z" fill="${WHEEL[i].c}" stroke="#e8b85a" stroke-width="1.5"/><text x="${ex}" y="${ey+6}" text-anchor="middle" font-size="18" transform="rotate(${am*180/Math.PI+90} ${ex} ${ey})">${WHEEL[i].e}</text><text x="${tx}" y="${ty+4}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff6e0" transform="rotate(${am*180/Math.PI+90} ${tx} ${ty})">${WHEEL[i].t}</text>`}
 return `<svg class="w" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg"><circle cx="160" cy="160" r="158" fill="#2a1a0c" stroke="#e8b85a" stroke-width="4"/>${s}${[...Array(24)].map((_,i)=>{const a=i/24*Math.PI*2;return`<circle cx="${160+Math.cos(a)*153}" cy="${160+Math.sin(a)*153}" r="2.6" fill="#fff3c4"/>`}).join('')}<circle cx="160" cy="160" r="24" fill="url(#hub)" stroke="#7a4a0e" stroke-width="3"/><defs><radialGradient id="hub"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#c08a2e"/></radialGradient></defs><text x="160" y="167" text-anchor="middle" font-size="20">🔥</text></svg>`}
