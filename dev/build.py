import os,base64
B=os.path.dirname(os.path.abspath(__file__))
src=lambda f:open(os.path.join(B,'src',f),encoding='utf-8').read()
css=src('style.css')
js='\n'.join(src(f) for f in ['core.js','data.js','story.js','art.js','systems.js','games.js','ui.js','main.js'])
icon=''
ip=os.path.join(B,'dist','icon180.png')
if os.path.exists(ip): icon='<link rel="apple-touch-icon" href="data:image/png;base64,'+base64.b64encode(open(ip,'rb').read()).decode()+'">'
html=f'''<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Пепел Мастера"><meta name="theme-color" content="#0b0910"><title>Пепел Мастера</title>{icon}<style>{css}
html,body{{touch-action:manipulation}}</style></head><body><canvas id="fx"></canvas><div id="app"><div id="top"></div><div id="screen"></div><nav id="tabs"></nav></div><div id="ov"></div><div id="toasts"></div><script>{js}</script></body></html>'''
os.makedirs(os.path.join(B,'dist'),exist_ok=True)
open(os.path.join(B,'dist','index.html'),'w',encoding='utf-8').write(html)
print('built',len(html)//1024,'KB')
