import * as THREE from 'three';
// Small procedural maps: each body has a distinct palette and surface language.
const palettes={
 'Меркурий':['#514756','#a99a96','#d2bcb0'],'Венера':['#a95520','#e5a850','#ffe2a1'],
 'Марс':['#612b2e','#bc5335','#e49861'],'Юпитер':['#895044','#d8a67e','#f4ddbd'],
 'Сатурн':['#a98247','#d9be81','#f9e6b5'],'Уран':['#3b929e','#79c9ca','#b4e5df'],
 'Нептун':['#192c82','#335ebc','#82acdf'],'Луна':['#555566','#9c99a7','#dedad9'],
 'Вулкан':['#130f28','#39233e','#83504a'],
 'Ио':['#926022','#dac052','#ffeb9c'],'Европа':['#a89280','#dfdacc','#fff0d8'],
 'Ганимед':['#585559','#999390','#cfc8ba'],'Каллисто':['#292b32','#655e58','#aba393'],
 'Титан':['#7c431b','#d69237','#f1c76e'],'Энцелад':['#95b4c2','#dae8e8','#ffffff'],
 'Япет':['#35302c','#928778','#e4dbca'],'Тритон':['#778d99','#b5c8c6','#e6dbce']};
const gas=new Set(['Венера','Юпитер','Сатурн','Уран','Нептун','Титан']);
export function bodyTexture(name,satellite=false){
 const c=document.createElement('canvas');c.width=satellite?512:1024;c.height=c.width/2;const ctx=c.getContext('2d'),w=c.width,h=c.height;
 let seed=[...name].reduce((n,c)=>n*31+c.charCodeAt(0),7)>>>0;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};const phase=rnd()*6.28;
 const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),pal=(palettes[name]||['#555969','#a5aeba','#e1dfdc']).map(rgb);
 const im=ctx.createImageData(w,h);const gaseous=gas.has(name);
 for(let y=0;y<h;y++){const v=y/h,latitude=Math.sin(v*Math.PI);for(let x=0;x<w;x++){const u=x/w*6.28318;
 const folds=Math.sin(u*3+phase+Math.sin(v*17))*.5+Math.sin(u*7-v*9+phase)*.18;
 let f=.52+Math.sin(u*4+v*21+phase)*.10+Math.cos(u*9-v*31)*.07;
 if(gaseous){const freq=name==='Юпитер'?45:name==='Сатурн'?64:name==='Венера'?19:28;const warp=folds*(name==='Венера'?2.4:.8);f=.57+Math.sin(v*freq+warp)*.20+Math.sin(v*freq*2.7+folds)*.055;if(name==='Уран')f=.64+(f-.5)*.30;if(name==='Нептун')f=.44+(f-.5)*.65;}
 if(name==='Япет')f+=Math.tanh(Math.sin(u+phase)*5)*.30;
 f=Math.max(0,Math.min(1,f*latitude+.72*(1-latitude)));const a=f<.5?pal[0]:pal[1],b=f<.5?pal[1]:pal[2],mix=f<.5?f*2:(f-.5)*2,index=(y*w+x)*4;
 for(let k=0;k<3;k++)im.data[index+k]=a[k]+(b[k]-a[k])*mix;im.data[index+3]=255;
 }}ctx.putImageData(im,0,0);
 const ellipse=(x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();};
 if(name==='Юпитер'){for(let i=8;i>0;i--)ellipse(w*.63,h*.61,w*(.025+i*.004),h*(.018+i*.003),i%2?'#bb674a':'#d38b66');ellipse(w*.628,h*.61,w*.018,h*.013,'#a55240');for(let i=0;i<8;i++)ellipse(rnd()*w,(.2+rnd()*.65)*h,w*.006,h*.004,'#f1d8b8');}
 if(name==='Нептун'){ellipse(w*.67,h*.6,w*.035,h*.023,'#203b7e');ellipse(w*.65,h*.57,w*.022,h*.005,'#aacbdf');}
 if(!gaseous&&name!=='Вулкан'&&!['Европа','Энцелад'].includes(name)){
 const count=name==='Каллисто'?125:name==='Ио'?48:45;
 for(let i=0;i<count;i++){const x=rnd()*w,y=(.1+rnd()*.8)*h,r=w*(.003+rnd()*.022);ctx.save();ctx.translate(x,y);ctx.scale(1,.7);const g=ctx.createRadialGradient(-r*.15,-r*.15,r*.08,0,0,r);g.addColorStop(0,name==='Ио'?'#502520bb':'#20243177');g.addColorStop(.64,'#38323966');g.addColorStop(.82,name==='Ио'?'#ef902477':'#f3e6d280');g.addColorStop(1,'#aaa6a000');ctx.fillStyle=g;ctx.fillRect(-r,-r,2*r,2*r);ctx.restore();}
 }
 if(['Европа','Энцелад','Ганимед','Миранда','Ариэль','Тритон','Вулкан','Марс'].includes(name)){
 const volcanic=name==='Вулкан',n=volcanic?34:name==='Марс'?7:22;
 for(let i=0;i<n;i++){const y=rnd()*h;ctx.strokeStyle=volcanic?(i%3?'#efb969':'#fff1bc'):name==='Европа'?'#9e665870':name==='Марс'?'#602d3150':'#61879c65';ctx.lineWidth=volcanic?1+rnd()*2:.5+rnd()*1.3;ctx.shadowColor=volcanic?'#ffb64a':'transparent';ctx.shadowBlur=volcanic?8:0;ctx.beginPath();for(let x=0;x<=w;x+=4){const yy=y+Math.sin(x/w*6.28*(2+i%4)+phase+i)*h*.025+Math.sin(x/w*6.28*9+i)*h*.007;x?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}ctx.stroke();}ctx.shadowBlur=0;
 }
 if(name==='Вулкан'){ctx.strokeStyle='#ffdda7bb';ctx.lineWidth=1.1;ctx.shadowColor='#e39858';ctx.shadowBlur=6;for(let i=0;i<18;i++){let px=rnd()*w,py=rnd()*h;ctx.beginPath();ctx.moveTo(px,py);for(let j=0;j<9;j++){px+=(rnd()-.35)*w*.032;py+=(rnd()-.3)*h*.065;ctx.lineTo(px,py);}ctx.stroke();}ctx.shadowBlur=0;for(let i=0;i<60;i++){const x=rnd()*w,y=rnd()*h,r=1+rnd()*2;ellipse(x,y,r,r,'#ffdc99');}}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.anisotropy=4;return t;
}
