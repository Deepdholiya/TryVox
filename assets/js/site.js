/* TryVox site script: shared by every page; each module runs only when its section exists. */
(function(){
  'use strict';
  const SF=[];
  const root=document.documentElement;root.classList.add('js');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const NS='http://www.w3.org/2000/svg';
  const el=(tag,attrs,parent)=>{const n=document.createElementNS(NS,tag);for(const k in attrs)n.setAttribute(k,attrs[k]);if(parent)parent.append(n);return n};

  /* theme */
  try{const t=localStorage.getItem('tv-theme');if(t)root.setAttribute('data-theme',t)}catch(e){}
  const isDark=()=>root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
  $('#themeT').addEventListener('click',e=>{
    const next=isDark()?'light':'dark';
    const apply=()=>{root.setAttribute('data-theme',next);try{localStorage.setItem('tv-theme',next)}catch(e){}};
    if(document.startViewTransition&&!reduce){
      const r=e.currentTarget.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,end=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      document.startViewTransition(apply).ready.then(()=>root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${end}px at ${x}px ${y}px)`]},{duration:700,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
    }else apply();
  });

  /* menus */
  $$('.has-mega').forEach(li=>{const b=li.querySelector('.nl');let t;const o=v=>{li.classList.toggle('open',v);b.setAttribute('aria-expanded',v)};
    li.addEventListener('mouseenter',()=>{clearTimeout(t);o(true)});li.addEventListener('mouseleave',()=>{t=setTimeout(()=>o(false),140)});
    b.addEventListener('click',()=>o(!li.classList.contains('open')));
    li.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>o(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')o(false)})});
  const bg=$('#burger');if(bg)bg.addEventListener('click',()=>{const o=!root.classList.contains('menu-open');root.classList.toggle('menu-open',o);bg.setAttribute('aria-expanded',o)});
  $$('.sheet a').forEach(a=>a.addEventListener('click',()=>{root.classList.remove('menu-open');bg.setAttribute('aria-expanded',false)}));
  $$('.kbtn').forEach(b=>{b.addEventListener('pointerdown',()=>b.classList.add('down'));['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>b.classList.remove('down')))});

  /* reveal */
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{rootMargin:'0px 0px -6% 0px'});
  $$('.rv').forEach(n=>{if(n.getBoundingClientRect().top<innerHeight)n.classList.add('in');else io.observe(n)});

  /* helpers */
  function add(feed,cls,text,max){const d=document.createElement('div');d.className='msg '+cls;d.textContent=text;feed.append(d);while(feed.children.length>max)feed.firstElementChild.remove()}
  let ac=null;
  function tone(fs,dur,vol){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const g=ac.createGain();g.connect(ac.destination);const n=ac.currentTime;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(vol,n+.03);g.gain.setValueAtTime(vol,n+dur-.05);g.gain.linearRampToValueAtTime(0,n+dur);fs.forEach(f=>{const o=ac.createOscillator();o.frequency.value=f;o.connect(g);o.start(n);o.stop(n+dur+.02)})}catch(e){}}

  /* ---------- hero call rig ---------- */
  if($('#rig')){

  const gS=$('#gStatus'),gT=$('#gTime'),gF=$('#gFeed'),dial=$('#dial'),dl=$('#dialLbl'),L0=$('#L0'),L1=$('#L1');
  let live=false,tms=[],clock=null,secs=0,typer=null;
  const later=(f,ms)=>tms.push(setTimeout(f,ms));
  const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  function typeStatus(word){clearInterval(typer);if(reduce){gS.textContent=word;return}let i=0;gS.textContent='';typer=setInterval(()=>{gS.textContent=word.slice(0,++i);if(i>=word.length)clearInterval(typer)},45)}
  const script=[['a','Hi, this is Riya calling from Acme Finance. Is this a good time?'],['c','Yes, go ahead.'],['a','Your EMI of ₹4,250 is due on Friday. Shall I send a payment link on WhatsApp?'],['c','Yes please.'],['ev ok','Call completed · 6 events sent to your webhook']];
  function start(){
    live=true;tms.forEach(clearTimeout);tms=[];clearInterval(clock);gF.innerHTML='';
    dial.classList.add('live');dl.textContent='END';L0.classList.remove('on');L1.classList.remove('on');secs=0;gT.textContent='00:00';
    typeStatus('dialing');tone([350,440],.25,.03);
    later(()=>{L0.classList.add('on');add(gF,'ev','Outbound from +91 80 4718 2290',6)},400);
    later(()=>{typeStatus('ringing');add(gF,'ev','Routed · carrier primary · in-south',6);tone([440,480],1,.025)},1000);
    later(()=>{L1.classList.add('on');typeStatus('connected');add(gF,'ev ok','Answered · audio streaming to your agent',6);
      clock=setInterval(()=>{secs++;gT.textContent=fmt(secs)},1000);
      script.forEach((s,i)=>later(()=>add(gF,s[0],s[1],6),900+i*1700));
      later(()=>end(true),900+script.length*1700);
    },2600);
  }
  function end(done){live=false;tms.forEach(clearTimeout);tms=[];clearInterval(clock);dial.classList.remove('live');dl.textContent='CALL';typeStatus(done?'call ended':'ready')}
  dial.addEventListener('click',()=>{dial.classList.add('down');setTimeout(()=>dial.classList.remove('down'),150);live?end(false):start()});
  $('#gForm').addEventListener('submit',e=>{e.preventDefault();const em=$('#gEmail'),f=$('#gForm');
    if(!em.value||!em.checkValidity()){em.focus();em.placeholder='Enter a valid work email';em.value='';return}
    f.innerHTML='';const p=document.createElement('p');p.className='g-done';p.append('Next, create your account. ');const a=document.createElement('a');a.href='https://app.tryvox.io/';a.textContent='Continue to sign-up ↗';p.append(a);f.append(p)});
  const rig=$('#rig');
  if(!reduce&&matchMedia('(hover:hover)').matches){rig.style.transition='transform .6s cubic-bezier(.22,1,.36,1)';rig.addEventListener('mousemove',e=>{const r=rig.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;rig.style.transform=`perspective(1600px) rotateY(${x*2.4}deg) rotateX(${-y*2.4}deg)`});rig.addEventListener('mouseleave',()=>rig.style.transform='')}
  }

  /* ---------- partner marquee ---------- */
  if($('#mq')){

  const MQ=[['img','/assets/logos/vapi.svg','Vapi'],['img','/assets/logos/retell.svg','Retell AI'],['imgt','/assets/logos/livekit.svg','LiveKit'],['img','/assets/logos/bolna.svg','Bolna'],['t','','ElevenLabs'],['t','','Deepgram'],['t','','Amazon Polly'],['t','','WhatsApp'],['t','','Webhooks']];
  const mq=$('#mq');
  for(let r=0;r<2;r++)MQ.forEach(([k,src,name])=>{const it=document.createElement('span');it.className='it'+(k==='t'?' t':'');if(r)it.setAttribute('aria-hidden','true');
    if(k!=='t'){const im=document.createElement('img');im.className='plogo';im.src=src;im.alt=k==='imgt'?'':name;it.append(im)}
    if(k!=='img'){it.append(name)}mq.append(it)});
  }

  /* ---------- industries ---------- */
  if($('#acc')){

  const IND=[
    {n:'Financial services',c:'#3B2A63',h:'Collections and reminders that connect.',s:'Local caller ID, payment links on WhatsApp and a human one transfer away.',f:[['Trigger','EMI due in 3 days'],['Call','Agent calls from a local number'],['Outcome','Promise to pay: Friday'],['Follow-up','WhatsApp payment link sent']],big:'₹4,250 due'},
    {n:'Healthcare',c:'#24485A',h:'Appointments booked without hold music.',s:'Inbound lines per clinic, rescheduling by phone and reminders by SMS.',f:[['Inbound','Patient calls the clinic'],['Agent','Checks open slots'],['Booked','Thursday, 4 PM'],['Reminder','SMS 24 hours before']],big:'Thu · 4 PM'},
    {n:'E-commerce',c:'#5B2B4E',h:'Order confirmations at checkout speed.',s:'COD checks, cart recovery and order-status calls at sale-day volume.',f:[['Trigger','COD order placed'],['Call','Agent confirms address'],['Keypad','Customer presses 1'],['Outcome','Order released to ship']],big:'Press 1'},
    {n:'Logistics',c:'#4A3A22',h:'Delivery calls that reach the doorstep.',s:'Slot confirmations and rescheduling, with numbers masked on both sides.',f:[['Trigger','Out for delivery'],['Call','Agent confirms the slot'],['Change','Customer asks for 6 PM'],['Update','Driver app updated']],big:'6 PM slot'},
    {n:'Real estate',c:'#283D33',h:'Every enquiry called back in minutes.',s:'Qualify leads the moment they land and book site visits while interest is high.',f:[['Lead','Form filled on a portal'],['Call','Agent calls back in 60 seconds'],['Qualify','Budget and location'],['Booked','Site visit on Sunday']],big:'60 s callback'},
    {n:'Travel & hospitality',c:'#2D3360',h:'Bookings and changes, around the clock.',s:'24/7 lines, toll-free numbers and confirmations by SMS.',f:[['Inbound','Guest calls the hotel'],['Agent','Finds the booking'],['Change','Late check-out added'],['Confirm','SMS sent to guest']],big:'Late check-out'}
  ];
  const acc=$('#acc');let cur=0;
  IND.forEach((d,i)=>{const s=document.createElement('div');s.className='slab'+(i===0?' on':'');s.style.setProperty('--bgc',d.c);s.setAttribute('role','button');s.tabIndex=0;s.setAttribute('aria-label',d.n);
    let paths='';for(let k=0;k<14;k++)paths+=`<path d="M${-20+k*4} ${80+k*18} C 140 ${40+k*20}, 260 ${200+k*6}, 420 ${120+k*16}" stroke="#fff" stroke-opacity="${(.05+k*.012).toFixed(3)}" fill="none"/>`;
    s.innerHTML=`<svg class="art" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="ig${i}" cx="${30+i*9}%" cy="${70-i*6}%" r="80%"><stop offset="0" stop-color="#B98BFF" stop-opacity=".55"/><stop offset=".55" stop-color="#B98BFF" stop-opacity="0"/></radialGradient></defs><rect width="400" height="400" fill="url(#ig${i})"/>${paths}</svg><span class="vert"></span><span class="big"></span><span class="lbl"></span>`;
    s.querySelector('.vert').textContent=d.n;s.querySelector('.big').textContent=d.big;s.querySelector('.lbl').textContent=String(i+1).padStart(2,'0')+' · '+d.n;
    s.addEventListener('click',()=>setInd(i));s.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches)setInd(i)});
    s.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setInd(i)}});acc.append(s)});
  function setInd(i){cur=(i+IND.length)%IND.length;const d=IND[cur];
    $$('.slab').forEach((s,k)=>s.classList.toggle('on',k===cur));
    const h=$('#indH');h.textContent=d.h+' ';const sp=document.createElement('span');sp.textContent=d.s;h.append(sp);
    const fl=$('#indFlow');fl.innerHTML='';d.f.forEach(([k,v])=>{const r=document.createElement('div');const b=document.createElement('b');b.textContent=k;const t=document.createElement('span');t.textContent=v;r.append(b,t);fl.append(r)});
    $('#indN').textContent=String(cur+1).padStart(2,'0')+' / 06 · '+d.n}
  setInd(0);$('#indPrev').addEventListener('click',()=>setInd(cur-1));$('#indNext').addEventListener('click',()=>setInd(cur+1));
  }

  /* ---------- isometric layer stack ---------- */
  if($('#iso')){

  const iso=$('#iso');
  const S=200,cx0=290,TH=10;
  const P=(x,y)=>[cx0+(x-y)*0.866*S,(x+y)*0.5*S];
  const pts=a=>a.map(p=>p.join(',')).join(' ');
  const quad=(x0,y0,x1,y1)=>[P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)];
  const LAYERS=[
    {k:'01 · Your agent',p:'The voice agent you built, on any platform. It listens, thinks and talks.',draw:g=>{
      el('polygon',{class:'soft',points:pts(quad(.08,.08,.92,.22))},g);
      [.30,.40,.50].forEach((y,i)=>el('polygon',{class:'ink',points:pts(quad(.12,y,.12+[.62,.48,.56][i],y+.05))},g));
      el('polygon',{class:'soft',points:pts(quad(.12,.64,.88,.88))},g);
      for(let k=0;k<9;k++){const h=[.06,.12,.18,.1,.2,.14,.08,.16,.1][k];el('polygon',{class:'ink',points:pts(quad(.2+k*.07,.76-h/2,.24+k*.07,.76+h/2))},g)}
      const t=el('text',{class:'tx',transform:`translate(${P(.1,.12)[0]} ${P(.1,.12)[1]}) rotate(30)`},g);t.textContent='RUN:AGENT'}},
    {k:'02 · Your stack',p:'Vapi, Retell, LiveKit, Bolna or your own code. Keep the tools you already use.',draw:g=>{
      ['VAPI','RETELL','LIVEKIT','BOLNA'].forEach((n,i)=>{const x=.08+(i%2)*.44,y=.1+Math.floor(i/2)*.42;el('polygon',{class:'face',points:pts(quad(x,y,x+.4,y+.36)),style:'stroke-dasharray:3 3'},g);
        const c=P(x+.06,y+.2);const t=el('text',{class:'tx',transform:`translate(${c[0]} ${c[1]}) rotate(30)`},g);t.textContent=n})}},
    {k:'03 · Our platform',p:'TryVox numbers, SIP trunks, live audio streaming, call control and webhooks.',draw:g=>{
      for(let k=0;k<14;k++){const a=P(.06+k*.028,.08),b=P(.06+k*.028,.92);el('line',{class:'hatch',x1:a[0],y1:a[1],x2:b[0],y2:b[1]},g)}
      [['NUMBERS',.5,.08],['SIP',.5,.3],['STREAM',.5,.52],['EVENTS',.5,.74]].forEach(([n,x,y])=>{el('polygon',{class:'soft',points:pts(quad(x,y,x+.42,y+.18))},g);
        const c=P(x+.04,y+.11);const t=el('text',{class:'tx',transform:`translate(${c[0]} ${c[1]}) rotate(30)`},g);t.textContent=n});
      const c=P(.09,.5);const t=el('text',{class:'tx',transform:`translate(${c[0]} ${c[1]}) rotate(30)`},g);t.textContent='TRYVOX'}},
    {k:'04 · Our carrier network',p:'Licensed carrier routes, KYC-verified Indian numbers, consent and DLT compliance.',draw:g=>{
      for(let k=0;k<22;k++){const w=[.02,.035,.015,.03][k%4];const x=.1+k*.036;el('polygon',{class:'ink',points:pts(quad(x,.62,x+w*.8,.9))},g)}
      for(let r=0;r<3;r++)for(let k=0;k<6;k++){const a=P(.12+k*.13,.12+r*.14);el('path',{class:'ln',d:`M${a[0]-5} ${a[1]} l10 0 M${a[0]} ${a[1]-3} l0 6`},g)}
      const c=P(.1,.52);const t=el('text',{class:'tx',transform:`translate(${c[0]} ${c[1]}) rotate(30)`},g);t.textContent='PSTN · +91 · DLT'}}
  ];
  const guides=el('g',{},iso);
  const gds=[[0,0],[1,0],[1,1],[0,1]].map(c=>({c:P(c[0],c[1]),l:el('line',{class:'gd'},guides)}));
  const lyG=[];
  for(let i=LAYERS.length-1;i>=0;i--){const g=el('g',{class:'ly'},iso);const b=el('g',{class:'bob',style:`animation-delay:${-i*1.3}s`},g);
    const base=quad(0,0,1,1);
    el('polygon',{class:'side',points:pts([base[1],base[2],[base[2][0],base[2][1]+TH],[base[1][0],base[1][1]+TH]])},b);
    el('polygon',{class:'side',points:pts([base[2],base[3],[base[3][0],base[3][1]+TH],[base[2][0],base[2][1]+TH]])},b);
    el('polygon',{class:'face',points:pts(base)},b);LAYERS[i].draw(b);
    const rc=P(1,0);el('line',{class:'lead',x1:rc[0]+6,y1:rc[1],x2:rc[0]+34,y2:rc[1]},b);
    const n=el('text',{class:'num',x:rc[0]+40,y:rc[1]+4},b);n.textContent='0'+(i+1);
    lyG[i]=g}
  const pkts=[0,1,2].map(k=>el('circle',{class:'pk'+(k===1?' g':''),r:4,cx:cx0,cy:-20},iso));
  const ltrack=$('#ltrack'),lstage=$('#lstage'),lis=$$('#layers li'),capK=$('#lcapK'),capP=$('#lcapP');
  let lcur=-1,lTop=0,lYs=[0,0,0,0],lVis=false;
  const OPEN=116,CLOSED=14;
  const ease=t=>t*t*(3-2*t);
  function layout(p){const a=Math.min(3,Math.floor(p*4));
    const e=[1,1,2,3].map((k,i)=>i===0?1:ease(clamp(p*4-k+.9,0,1)));
    const ys=[0];for(let k=1;k<4;k++)ys[k]=ys[k-1]+CLOSED+e[k]*(OPEN-CLOSED);
    lYs=ys;const total=ys[3]+S+TH;lTop=(640-total)/2;
    lyG.forEach((g,i)=>{g.style.transform=`translateY(${lTop+ys[i]-(i===a?14:0)}px)`;g.classList.toggle('shut',i>0&&e[i]<.35)});
    gds.forEach(({c,l})=>{l.setAttribute('x1',c[0]);l.setAttribute('x2',c[0]);l.setAttribute('y1',lTop+c[1]);l.setAttribute('y2',lTop+ys[3]+c[1])});
    if(a!==lcur){lcur=a;lyG.forEach((g,i)=>{g.classList.toggle('on',i===a);g.classList.toggle('dim',i!==a)});lis.forEach((li,i)=>li.classList.toggle('on',i===a));capK.textContent=LAYERS[a].k;capP.textContent=LAYERS[a].p}}
  function onLayers(){const r=ltrack.getBoundingClientRect(),stick=parseFloat(getComputedStyle(lstage).top)||0,range=ltrack.offsetHeight-lstage.offsetHeight;layout(clamp((stick-r.top)/Math.max(1,range),0,1))}
  layout(0);
  function pkTick(now){const y0=lTop+S/2,y1=lTop+lYs[Math.max(lcur,0)]+S/2,on=lcur>0;pkts.forEach((c,k)=>{const u=((now/2600)+k/3)%1;c.setAttribute('cy',y0+(y1-y0)*u);c.setAttribute('opacity',on?Math.sin(u*Math.PI).toFixed(2):0)});if(lVis&&!reduce)requestAnimationFrame(pkTick)}
  new IntersectionObserver(es=>{const was=lVis;lVis=es[0].isIntersecting;if(lVis&&!was&&!reduce)requestAnimationFrame(pkTick)}).observe(ltrack);
  if(reduce)pkts.forEach(c=>c.setAttribute('opacity',0));
  lis.forEach(li=>li.addEventListener('click',()=>{const range=ltrack.offsetHeight-lstage.offsetHeight,stick=parseFloat(getComputedStyle(lstage).top)||0;scrollTo({top:ltrack.getBoundingClientRect().top+scrollY-stick+range*((+li.dataset.i+.55)/4),behavior:reduce?'auto':'smooth'})}));
    SF.push(onLayers);
  }

  /* ---------- strands (purple band) ---------- */
  if($('#strands')){

  const cv=$('#strands'),cx=cv.getContext('2d'),ht=$('#htrack'),hs=$('#hstage'),hT=$('#hT'),hP=$('#hP'),htl=$('#htitle'),railB=$$('#hseg button'),hcnt=$('#hcnt'),howEl=$('.how');
  const HT=[['Number.','Search, buy and configure numbers with KYC done online.'],['Connect.','Bind the number to your Vapi, Retell, LiveKit or Bolna agent in the dashboard.'],['Stream.','Live audio flows both ways while your agent talks.'],['Observe.','Webhooks, recordings and call records for every call.']];
  let hp=0,hstep=0,W=0,H=0,t0=performance.now(),visible=false;
  function size(){const d=Math.min(2,devicePixelRatio||1);W=hs.clientWidth;H=hs.clientHeight;cv.width=Math.max(1,W*d);cv.height=Math.max(1,H*d);cx.setTransform(d,0,0,d,0,0)}
  size();addEventListener('resize',size);
  const groups=[{label:'Phone numbers',y:.34,n:12},{label:'SIP trunks',y:.52,n:10},{label:'Carriers',y:.7,n:12}];
  const bez=(p0,p1,p2,p3,t)=>{const u=1-t;return u*u*u*p0+3*u*u*t*p1+3*u*t*t*p2+t*t*t*p3};
  function draw(now){
    const t=(now-t0)/1000;cx.clearRect(0,0,W,H);const col='255,255,255';
    const mob=W<700,nx=W*.62,ny=H*(mob?.6:.56);
    groups.forEach((g,gi)=>{const active=gi===0||hp>.2,reach=gi===0?clamp(.35+hp*2.2,0,1):clamp((hp-.2)*2.6,0,1);const sp=H*(mob?.007:.009);
      for(let k=0;k<g.n;k++){const sx=W*.03+((k*37)%11)*W*.004,sy=H*g.y+(k-g.n/2)*sp+Math.sin(t*.6+k)*2;
        const c1x=W*.28,c1y=sy+(k-g.n/2)*3,c2x=nx-W*.18,c2y=ny+(k-g.n/2)*1.2,steps=60,lim=Math.floor(steps*reach);
        cx.beginPath();cx.moveTo(sx,sy);for(let s=1;s<=lim;s++){const u=s/steps;cx.lineTo(bez(sx,c1x,c2x,nx,u),bez(sy,c1y,c2y,ny,u))}
        const lead=k===Math.floor(g.n/2);cx.strokeStyle=`rgba(${col},${lead?.95:active?.28:.1})`;cx.lineWidth=lead?1.4:1;cx.stroke();
        cx.fillStyle=`rgba(${col},.7)`;cx.fillRect(sx-1,sy-1,2,2);
        if(hp>.48&&k%3===0){for(let m=0;m<2;m++){const u=((t*.18+k*.07+m*.5)%1);cx.fillStyle='rgba(124,255,138,.95)';cx.beginPath();cx.arc(bez(sx,c1x,c2x,nx,u),bez(sy,c1y,c2y,ny,u),1.8,0,7);cx.fill()}}}
      cx.fillStyle=`rgba(${col},${active?.85:.45})`;cx.font='13px Geist, system-ui, sans-serif';cx.fillText(g.label,W*.03,H*g.y-sp*g.n/2-12)});
    const lbl=hp>.72?'Your agent, on every call':hp>.48?'Your agent, live':'Your agent';
    cx.font='500 15px Geist, system-ui, sans-serif';const lw=cx.measureText(lbl).width,pw=lw+24,ph=32;
    const lx=mob?clamp(nx-pw/2,12,W-pw-12):nx+18,ly=mob?ny+20:ny-ph/2;
    if(hp>.72){const x0=mob?nx+14:lx+pw+14,r=clamp((hp-.72)*4,0,1),ex=x0+(W-x0-24)*r;
      if(ex>x0){cx.strokeStyle=`rgba(${col},.5)`;cx.lineWidth=1;cx.setLineDash([2,5]);cx.beginPath();cx.moveTo(x0,ny);cx.lineTo(ex,ny);cx.stroke();cx.setLineDash([]);
        for(let i=1;i<5;i++){const x=x0+(W-x0-24)*i/5;if(x<ex){cx.fillStyle=`rgba(${col},.8)`;cx.fillRect(x-1,ny-5,2,10)}}}}
    cx.fillStyle='#121016';cx.strokeStyle='rgba(255,255,255,.9)';cx.lineWidth=1.5;cx.beginPath();if(cx.roundRect)cx.roundRect(nx-9,ny-9,18,18,4);else cx.rect(nx-9,ny-9,18,18);cx.fill();cx.stroke();
    cx.fillStyle='#00B900';cx.fillRect(nx-5,ny-5,10,10);
    cx.beginPath();if(cx.roundRect)cx.roundRect(lx,ly,pw,ph,ph/2);else cx.rect(lx,ly,pw,ph);cx.fillStyle='rgba(24,8,58,.62)';cx.fill();cx.strokeStyle='rgba(255,255,255,.22)';cx.lineWidth=1;cx.stroke();
    cx.fillStyle='#FFFFFF';cx.fillText(lbl,lx+12,ly+21);
    if(!reduce&&visible)requestAnimationFrame(draw)}
  new IntersectionObserver(es=>{const was=visible;visible=es[0].isIntersecting;if(visible&&!was&&!reduce)requestAnimationFrame(draw)}).observe(ht);
  requestAnimationFrame(draw);
  function onHow(){const r=ht.getBoundingClientRect(),stick=parseFloat(getComputedStyle(hs).top)||0,range=ht.offsetHeight-hs.offsetHeight;
    hp=clamp((stick-r.top)/Math.max(1,range),0,1);const s=Math.min(3,Math.floor(hp*4));
    railB.forEach((b,k)=>{const v=clamp(hp*4-k,0,1);b.querySelector('.pf').style.setProperty('--p',v.toFixed(3));b.classList.toggle('done',v>=.999&&k<3)});howEl.style.setProperty('--hd',hp.toFixed(3));
    if(s!==hstep){hstep=s;htl.classList.add('swap');setTimeout(()=>{hT.textContent=HT[s][0];hP.textContent=HT[s][1];htl.classList.remove('swap')},reduce?0:260);railB.forEach((b,k)=>b.classList.toggle('on',k===s));hcnt.textContent='0'+(s+1)}
    if(reduce)requestAnimationFrame(draw)}
  railB.forEach(b=>b.addEventListener('click',()=>{const range=ht.offsetHeight-hs.offsetHeight,stick=parseFloat(getComputedStyle(hs).top)||0;scrollTo({top:ht.getBoundingClientRect().top+scrollY-stick+range*((+b.dataset.go+.55)/4),behavior:reduce?'auto':'smooth'})}));
    SF.push(onHow);
  }

  /* ---------- integrations: one highlighted at a time, panel follows ---------- */
  if($('#ix')){
  const INTEG=[
    {n:'Vapi',c:'agent',t:'Agent platform',h:'1-click',img:'/assets/logos/vapi.svg',w:62},
    {n:'Retell AI',c:'agent',t:'Agent platform',h:'1-click',img:'/assets/logos/retell.svg',w:72},
    {n:'LiveKit',c:'agent',t:'Agent framework',h:'Native',img:'/assets/logos/livekit.svg',w:24,txt:1},
    {n:'Bolna',c:'agent',t:'Agent platform',h:'1-click',img:'/assets/logos/bolna.svg',w:48},
    {n:'ElevenLabs',c:'agent',t:'Agent platform',h:'1-click',m:'11',bg:'#17131F'},
    {n:'Deepgram',c:'speech',t:'Speech to text',h:'Via your agent',m:'DG',bg:'#13A36F'},
    {n:'Amazon Polly',c:'speech',t:'Text to speech',h:'Via your agent',m:'AP',bg:'#E07B1A'},
    {n:'WhatsApp',c:'msg',t:'Messaging & calling',h:'Native',m:'WA',bg:'#1FAF55'},
    {n:'SMS · DLT',c:'msg',t:'Messaging',h:'Native',m:'SMS',bg:'#7444CF'},
    {n:'Webhooks',c:'dev',t:'Call events',h:'Native',m:'{ }',bg:'#3B3747'},
    {n:'VoxML',c:'dev',t:'Call flows',h:'Native',m:'</>',bg:'#5B3FB0'},
    {n:'SIP / BYOC',c:'dev',t:'Bring your own carrier',h:'Any SIP stack',m:'SIP',bg:'#2D3360'}
  ];

  const X={'Vapi':['Bind a TryVox number to your Vapi assistant. Calls reach it with caller context in SIP headers.',['Number bound · +91 80 4718 2290','X-TryVox-Provider: vapi','Agent answered on first ring']],
   'Retell AI':['Connect a Retell agent to an Indian number in a few clicks, with no SIP setup.',['Number bound · +91 22 6120 4471','X-TryVox-Provider: retell','Call record sent to your webhook']],
   'LiveKit':['Route calls into LiveKit rooms over a TryVox SIP trunk or a one-click binding.',['trunk-prod attached','Room joined · agent-01','Audio streaming']],
   'Bolna':['Give your Bolna agent a local or toll-free line that it answers straight away.',['Number bound · 1800 xxx xxxx','X-TryVox-Provider: bolna','Agent answered']],
   'ElevenLabs':['Put your ElevenLabs conversational agent on a real phone number.',['Number bound · +91 80 4718 3301','X-TryVox-Provider: elevenlabs','Agent answered']],
   'Deepgram':['Speech to text runs inside your agent. TryVox streams clean call audio to it.',['Audio streamed to your agent','Transcription via your agent','Call events to your webhook']],
   'Amazon Polly':['Text to speech runs inside your agent. TryVox carries the call and the audio.',['Agent speaks via Polly','Audio sent to caller','Call record stored']],
   'WhatsApp':['Follow up on WhatsApp the moment a call ends, from the same account.',['Template payment_reminder sent','Delivered · read','WhatsApp calling enabled']],
   'SMS · DLT':['Send DLT-ready SMS for OTPs, reminders and alerts across India.',['DLT entity linked','Template otp_login approved','Delivered']],
   'Webhooks':['Every stage of every call lands in your system, signed with your secret.',['POST ring_url · 200','POST answer_url · VoxML','POST hangup_url · 200']],
   'VoxML':['Build call flows with Say, Gather, Dial and Stream. TryVox runs them live.',['Say a greeting','Gather a keypress','Stream audio to your agent']],
   'SIP / BYOC':['Connect any SIP stack, or bring your own carrier and keep your routes.',['trunk-prod created','Credentials + IP ACL set','Your carrier connected']]};
  const ix=$('#ix'),track=$('#ixTrack'),main=$('#ixMain');let pool=INTEG.slice(),cur=0,hold=false;
  const logo=(d,big)=>{const w=document.createElement('span');w.className='ix-lg';if(d.img){const im=document.createElement('img');im.src=d.img;im.alt='';im.width=big?d.w:d.w;im.height=20;w.append(im)}else{w.textContent=d.m;w.style.background=d.bg;w.classList.add('mk')}return w};
  function build(){track.innerHTML='';pool.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.className='ix-i';b.setAttribute('aria-label',d.n);b.append(logo(d));
    b.addEventListener('click',()=>{hold=true;set(i);setTimeout(()=>hold=false,6000)});track.append(b)})}
  function set(i){cur=(i+pool.length)%pool.length;const bs=Array.from(track.children);
    bs.forEach((b,j)=>{const dist=Math.abs(j-cur);b.classList.toggle('on',j===cur);b.classList.toggle('near',dist===1);b.classList.toggle('far',dist>2)});
    const W=bs[0]?bs[0].offsetWidth:56,G=parseFloat(getComputedStyle(track).columnGap)||20,row=track.parentElement.clientWidth;
    track.style.transform=`translateX(${row/2-(cur*(W+G)+W/2)}px)`;
    const d=pool[cur],x=X[d.n]||['',[]];main.classList.remove('in');void main.offsetWidth;
    main.innerHTML='';const h=document.createElement('div');h.className='ix-h';h.append(logo(d,1));const t=document.createElement('div');const nm=document.createElement('b');nm.textContent=d.n;const ty=document.createElement('small');ty.textContent=d.t;t.append(nm,ty);const pl=document.createElement('span');pl.className='pill';pl.textContent=d.h;h.append(t,pl);
    const p=document.createElement('p');p.className='ix-d';p.textContent=x[0];const ul=document.createElement('ul');ul.className='ix-ev';x[1].forEach((e,k)=>{const li=document.createElement('li');li.textContent=e;li.style.setProperty('--k',k);ul.append(li)});
    const inp=document.createElement('div');inp.className='ix-in';const sp=document.createElement('span');sp.textContent='Connect '+d.n.replace(' AI','')+' to line 01';const go=document.createElement('b');go.textContent='→';inp.append(sp,go);
    main.append(h,p,ul,inp);main.classList.add('in')}
  const fBtns=$$('#iFilters button'),iCount=$('#iCount');
  fBtns.forEach(b=>{const f=b.dataset.f,n=f==='all'?INTEG.length:INTEG.filter(d=>d.c===f).length;b.querySelector('span').textContent=n;
    b.addEventListener('click',()=>{fBtns.forEach(x=>x.setAttribute('aria-selected',x===b));ix.dataset.f=f;iCount.textContent=n;pool=f==='all'?INTEG.slice():INTEG.filter(d=>d.c===f);build();set(0)})});
  build();set(0);addEventListener('resize',()=>set(cur));
  ix.addEventListener('mouseenter',()=>hold=true);ix.addEventListener('mouseleave',()=>hold=false);
  if(!reduce)setInterval(()=>{if(!hold&&pool.length>1)set(cur+1)},2800);
  }

  /* ---------- cells spotlight ---------- */
  $$('.cell').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left)+'px');c.style.setProperty('--y',(e.clientY-r.top)+'px')}));

  /* ---------- code (from docs.tryvox.io) ---------- */
  if($('#codeBox')){

  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const CODE={curl:`# Place an outbound call
curl -X POST https://api.tryvox.io/v1/voice/accounts/$TRYVOX_AUTH_ID/calls \\
  -u $TRYVOX_AUTH_ID:$TRYVOX_AUTH_TOKEN \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "+918047182290",
    "to": "+919812345678",
    "answer_url": "https://example.com/answer",
    "hangup_url": "https://example.com/hangup",
    "status_callback_url": "https://example.com/status",
    "ring_timeout": 30,
    "time_limit": 3600
  }'`,
  node:`// Place an outbound call
const { TRYVOX_AUTH_ID: id, TRYVOX_AUTH_TOKEN: token } = process.env;

const res = await fetch(\`https://api.tryvox.io/v1/voice/accounts/\${id}/calls\`, {
  method: "POST",
  headers: {
    Authorization: "Basic " + Buffer.from(\`\${id}:\${token}\`).toString("base64"),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "+918047182290",
    to: "+919812345678",
    answer_url: "https://example.com/answer",
    hangup_url: "https://example.com/hangup",
  }),
});
const { data } = await res.json(); // data.status === "queued"`,
  py:`# Place an outbound call
import os, requests

auth_id = os.environ["TRYVOX_AUTH_ID"]
call = requests.post(
    f"https://api.tryvox.io/v1/voice/accounts/{auth_id}/calls",
    auth=(auth_id, os.environ["TRYVOX_AUTH_TOKEN"]),
    json={
        "from": "+918047182290",
        "to": "+919812345678",
        "answer_url": "https://example.com/answer",
        "hangup_url": "https://example.com/hangup",
    },
).json()["data"]`,
  sip:`# Headers your agent receives on an inbound call
# after you bind a TryVox number to it

X-TryVox-Direction:    inbound
X-TryVox-Route:        ai-agent
X-TryVox-AI-Provider:  vapi | elevenlabs | retell
X-TryVox-From:         <E.164 caller>
X-TryVox-To:           <E.164 TryVox number>`};
  const hl=src=>esc(src).split('\n').map(l=>/^\s*(#|\/\/)/.test(l)?`<span class="c">${l}</span>`:l.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g,'<span class="s">$1</span>').replace(/\b(const|await|import|curl|X-TryVox-[A-Za-z-]+)\b/g,'<span class="k">$1</span>').replace(/(\/\/ .*)$/,'<span class="c">$1</span>')).join('\n');
  const cdata=$('#codeData');if(cdata){const d=JSON.parse(cdata.textContent);Object.keys(CODE).forEach(k=>delete CODE[k]);Object.assign(CODE,d)}
  const box=$('#codeBox');let lang=Object.keys(CODE)[0],typing;
  function show(l,anim){lang=l;clearInterval(typing);const raw=CODE[l];if(!anim||reduce){box.innerHTML=hl(raw);return}let n=0;typing=setInterval(()=>{n+=8;box.innerHTML=hl(raw.slice(0,n));if(n>=raw.length)clearInterval(typing)},16)}
  show(lang);
  $$('.code-top [data-lang]').forEach(b=>b.addEventListener('click',()=>{$$('.code-top [data-lang]').forEach(x=>x.setAttribute('aria-selected',x===b));show(b.dataset.lang,true)}));
  $('#copy').addEventListener('click',()=>{const b=$('#copy');const sel=()=>{const r=document.createRange();r.selectNodeContents(box);const s=getSelection();s.removeAllRanges();s.addRange(r)};
    try{navigator.clipboard.writeText(CODE[lang]).then(()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1500)},()=>{sel();b.textContent='Press ⌘C'})}catch(e){sel()}});
  }

  /* ---------- estimator ---------- */
  if($('#eCalls')){

  const eC=$('#eCalls'),eM=$('#eMin'),eH=$('#eHrs'),nf=n=>Math.round(n).toLocaleString('en-IN');
  function est(){[eC,eM,eH].forEach(i=>i.style.setProperty('--p',((i.value-i.min)/(i.max-i.min)*100)+'%'));
    const c=+eC.value,m=+eM.value,h=+eH.value,perHr=c/(22*h),conc=Math.max(1,Math.ceil(perHr*m/60*2.5));
    $('#oCalls').textContent=nf(c);$('#oMin').textContent=m+' min';$('#oHrs').textContent=h+' h';
    $('#rMin').textContent=nf(c*m);$('#rPeak').textContent=conc;$('#rHr').textContent=nf(perHr);$('#rNum').textContent=Math.max(1,Math.ceil(conc/10))}
  [eC,eM,eH].forEach(i=>i.addEventListener('input',est));est();
  $('#estForm').addEventListener('submit',e=>{e.preventDefault();const em=$('#estEmail'),msg=$('#estMsg');
    if(!em.value||!em.checkValidity()){msg.textContent='Enter a valid work email.';em.focus();return}
    msg.textContent=`Your sizing: ${$('#rMin').textContent} min a month, ${$('#rPeak').textContent} peak calls. Send it to the team from `;const a=document.createElement('a');a.href='/contact/';a.textContent='the contact page ↗';msg.append(a)});
  }



  /* ---------- inner pages: motion + micro-interactions ---------- */
  const watch=(nodes,cb,opt)=>{const o=new IntersectionObserver(es=>es.forEach(e=>cb(e.isIntersecting,e.target)),opt||{threshold:.25});nodes.forEach(n=>o.observe(n))};
  // headline words rise in
  $$('.split').forEach(h=>{if(reduce)return;let i=0;const walk=n=>{Array.from(n.childNodes).forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t)){f.append(t);return}const w=document.createElement('span');w.className='w';const s=document.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);w.append(s);f.append(w)});c.replaceWith(f)}else if(c.nodeType===1)walk(c)})};walk(h)});
  // panel tilt + glare that follows the pointer
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce)$$('.tilt').forEach(t=>{const inn=t.querySelector('.tilt-in');
    t.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;inn.style.setProperty('--ry',((x-.5)*7).toFixed(2)+'deg');inn.style.setProperty('--rx',((.5-y)*6).toFixed(2)+'deg');inn.style.setProperty('--mx',(x*100)+'%');inn.style.setProperty('--my',(y*100)+'%')});
    t.addEventListener('pointerleave',()=>{inn.style.setProperty('--rx','0deg');inn.style.setProperty('--ry','0deg')})});
  // product tour: sticky panel follows the step in view
  $$('.tour4').forEach(sec=>{const its=Array.from(sec.querySelectorAll('.tr4')),vs=Array.from(sec.querySelectorAll('.tv4')),pr=sec.querySelector('.t4-prog'),list=sec.querySelector('.t4-list');let cur=-1;
    const set=k=>{if(k===cur)return;cur=k;its.forEach((x,j)=>x.classList.toggle('on',j===k));vs.forEach((x,j)=>x.classList.toggle('on',j===k))};set(0);
    SF.push(()=>{const mid=innerHeight*.5;let a=0;its.forEach((x,j)=>{if(x.getBoundingClientRect().top<mid)a=j});set(a);const r=list.getBoundingClientRect();pr.style.setProperty('--tp',(clamp((mid-r.top)/r.height,0,1)*100).toFixed(1)+'%')})});
  // before/after switch: flips itself once on first view, then it's yours
  $$('.vs4').forEach(v=>{const b=v.querySelector('.vs-t');const set=on=>{v.classList.toggle('with',on);b.setAttribute('aria-checked',on)};
    b.addEventListener('click',()=>set(!v.classList.contains('with')));
    if(!reduce&&v.getBoundingClientRect().top>innerHeight){set(false);let done=false;watch([v],vis=>{if(vis&&!done){done=true;setTimeout(()=>set(true),700)}},{threshold:.5})}});
  // counters
  const cs=$$('.cnt[data-to]');
  if(cs.length&&!reduce)watch(cs,(vis,n)=>{if(!vis||n.dataset.run)return;n.dataset.run=1;const to=+n.dataset.to,dec=(n.dataset.to.split('.')[1]||'').length,t0=performance.now();
    const f=t=>{const k=clamp((t-t0)/1400,0,1),v=to*(1-Math.pow(1-k,3));n.textContent=n.dataset.pre+v.toFixed(dec)+n.dataset.suf;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)},{threshold:.6});
  // solution hero: the call plays itself, events land as it goes
  $$('.lc').forEach(lc=>{const D=JSON.parse(lc.querySelector('.lc-data').textContent),feed=lc.querySelector('.lc-feed'),ev=lc.querySelector('.lc-ev'),tm=lc.querySelector('.lc-t'),bars=Array.from(lc.querySelectorAll('.lc-wave i'));
    let timers=[],clock=null,talk=null,sec=0,started=false;const later=(f,ms)=>timers.push(setTimeout(f,ms));
    const wave=on=>{clearInterval(talk);if(!on||reduce){bars.forEach(b=>b.style.height='12%');return}talk=setInterval(()=>bars.forEach(b=>b.style.height=(12+Math.random()*80)+'%'),140)};
    const addMsg=(c,t)=>{const d=document.createElement('div');d.className='msg '+c;d.textContent=t;feed.append(d)};
    const addEv=h=>{const li=document.createElement('li');const s=document.createElement('span');s.innerHTML=h;li.append(s);ev.append(li)};
    function play(){timers.forEach(clearTimeout);timers=[];clearInterval(clock);feed.innerHTML='';ev.innerHTML='';lc.classList.remove('ended');sec=0;tm.textContent='00:00';
      if(reduce){D.msgs.forEach(m=>addMsg(m[0],m[1]));D.events.forEach(addEv);lc.classList.add('ended');return}
      clock=setInterval(()=>{sec++;tm.textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')},1000);
      let t=300;const per=D.events.length/D.msgs.length;let e=0;
      D.msgs.forEach((m,i)=>{const speak=m[0]!=='ev';if(speak){later(()=>{const ty=document.createElement('div');ty.className='msg typing '+m[0];ty.innerHTML='<i></i><i></i><i></i>';feed.append(ty);wave(true)},t);t+=750}
        later(()=>{const ty=feed.querySelector('.typing');if(ty)ty.remove();addMsg(m[0],m[1]);wave(false);while(e<Math.round((i+1)*per)&&e<D.events.length){addEv(D.events[e]);e++}},t);t+=speak?1100:600});
      later(()=>{while(e<D.events.length){addEv(D.events[e]);e++}clearInterval(clock);lc.classList.add('ended')},t+300)}
    lc.querySelector('.lc-re').addEventListener('click',play);
    watch([lc],vis=>{if(vis&&!started){started=true;play()}},{threshold:.3})});
  // pinned horizontal call flow
  $$('.hp').forEach(hp=>{const tr=hp.querySelector('.hp-track'),cards=Array.from(hp.querySelectorAll('.hp-c')),cnt=hp.querySelector('.hp-count b'),line=hp.querySelector('.hp-line');
    SF.push(()=>{const r=hp.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight),0,1),last=cards[cards.length-1],max=Math.max(0,last.offsetLeft+last.offsetWidth+parseFloat(getComputedStyle(tr).paddingLeft)-innerWidth);
      tr.style.setProperty('--tx',(-p*max).toFixed(1)+'px');line.style.setProperty('--hp',(p*100).toFixed(1)+'%');
      const a=Math.min(cards.length-1,Math.round(p*(cards.length-1)));cards.forEach((c,j)=>c.classList.toggle('on',j===a));cnt.textContent=String(a+1).padStart(2,'0')})});
  // use-case tabs with auto-advance
  $$('.ut').forEach(u=>{const bs=Array.from(u.querySelectorAll('.ut-b')),vs=Array.from(u.querySelectorAll('.ut-v'));let cur=0;
    const set=k=>{cur=k;bs.forEach((b,j)=>{b.classList.toggle('on',j===k);b.setAttribute('aria-selected',j===k)});vs.forEach((v,j)=>v.classList.toggle('on',j===k))};
    bs.forEach((b,k)=>{b.addEventListener('click',()=>set(k));b.querySelector('.ut-p').addEventListener('animationend',()=>set((cur+1)%bs.length))});
    set(0);if(!reduce)watch([u],vis=>u.classList.toggle('run',vis),{threshold:.3})});


  /* ---------- v5 product + solution layouts ---------- */
  // hero layer stack: layers light up in turn, labels follow; hover a label to pick it
  $$('.ah-stage').forEach(st=>{if(st.closest('.ahp'))return;const sl=Array.from(st.querySelectorAll('.sl')),lb=Array.from(st.querySelectorAll('li[data-i]')),n=sl.length;let cur=n-1,hold=false;
    const set=k=>{cur=k;sl.forEach(g=>g.classList.toggle('on',+g.dataset.i===k));lb.forEach(l=>l.classList.toggle('on',+l.dataset.i===k))};set(n-1);
    lb.forEach(l=>{l.addEventListener('mouseenter',()=>{hold=true;set(+l.dataset.i)});l.addEventListener('mouseleave',()=>hold=false)});
    if(!reduce)setInterval(()=>{if(!hold)set((cur+n-1)%n)},1900)});
  // statement: words light up as you scroll
  $$('.revp').forEach(rp=>{const ws=Array.from(rp.querySelectorAll('span'));SF.push(()=>{const r=rp.getBoundingClientRect(),p=reduce?1:clamp((innerHeight*.78-r.top)/(r.height+innerHeight*.15),0,1),k=Math.round(p*ws.length);ws.forEach((w,j)=>w.classList.toggle('on',j<k))})});
  // panels: sticky index, panel focus, dark-to-light flip
  $$('.pp').forEach(pp=>{const ps=Array.from(pp.querySelectorAll('.ppn')),ns=Array.from(pp.querySelectorAll('.pp-nav a'));
    watch(ps,(v,t)=>{if(v)t.classList.add('on')},{threshold:.35});
    SF.push(()=>{const mid=innerHeight*.5;let a=0;ps.forEach((x,j)=>{if(x.getBoundingClientRect().top<mid)a=j});ns.forEach((x,j)=>x.classList.toggle('on',j===a));
      const flip=ps[Math.min(2,ps.length-1)];pp.classList.toggle('lite',flip.getBoundingClientRect().top<innerHeight*.55)})});
  // industry picker
  $$('.isel').forEach(d=>{const b=d.querySelector('.isel-b');const set=o=>{d.classList.toggle('open',o);b.setAttribute('aria-expanded',o)};
    b.addEventListener('click',e=>{e.stopPropagation();set(!d.classList.contains('open'))});document.addEventListener('click',e=>{if(!d.contains(e.target))set(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)})});
  // benefit carousel: auto-advances while in view, pauses on hover
  $$('.cr').forEach(cr=>{const tr=cr.querySelector('.cr-track'),cs=Array.from(tr.children),bs=Array.from(cr.querySelectorAll('.cr-bars button')),nb=cr.querySelector('.cr-n b');let cur=0,vis=false,hover=false;
    const set=k=>{cur=k;const view=cr.querySelector('.cr-view'),max=Math.max(0,tr.scrollWidth-view.clientWidth+parseFloat(getComputedStyle(view).paddingLeft));tr.style.setProperty('--cx',-Math.min(cs[k].offsetLeft,max)+'px');cs.forEach((c,j)=>c.classList.toggle('on',j===k));bs.forEach((b,j)=>b.classList.toggle('on',j===k));nb.textContent=String(k+1).padStart(2,'0')};
    bs.forEach((b,k)=>b.addEventListener('click',()=>set(k)));cr.addEventListener('mouseenter',()=>hover=true);cr.addEventListener('mouseleave',()=>hover=false);
    set(0);watch([cr],v=>vis=v,{threshold:.3});if(!reduce)setInterval(()=>{if(vis&&!hover)set((cur+1)%cs.length)},3600);addEventListener('resize',()=>set(cur))});
  // steps + growing columns
  $$('.cl').forEach(cl=>{const it=Array.from(cl.querySelectorAll('.cl-i')),cols=Array.from(cl.querySelectorAll('.cl-col'));let cur=0;
    const set=k=>{cur=k;it.forEach((x,j)=>x.classList.toggle('on',j===k));cols.forEach((c,j)=>c.classList.toggle('on',j<=k))};
    it.forEach((x,k)=>{x.querySelector('button').addEventListener('click',()=>set(k));x.querySelector('.cl-p').addEventListener('animationend',()=>set((cur+1)%it.length))});
    set(0);if(reduce)cols.forEach(c=>c.classList.add('on'));else watch([cl],v=>cl.classList.toggle('run',v),{threshold:.3})});
  // logo groups
  $$('.lg5').forEach(l=>{const bs=Array.from(l.querySelectorAll('.lg-tabs button')),ss=Array.from(l.querySelectorAll('.lg-set'));bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.toggle('on',x===b));ss.forEach(x=>x.classList.toggle('on',x.dataset.g===b.dataset.g))}))});


  /* ---------- v6 ---------- */
  // home: dark hero eases to white
  
  // product: stack opens one layer at a time as you scroll
  $$('.ahp').forEach(sec=>{const svg=sec.querySelector('.stk-svg'),E=+svg.dataset.e,sl=Array.from(svg.querySelectorAll('.sl')),n=sl.length,lb=Array.from(sec.querySelectorAll('li[data-i]')),cnt=sec.querySelector('.ahp-c b'),bar=sec.querySelector('.ahp-bar');
    const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    SF.push(()=>{const r=sec.getBoundingClientRect(),p=reduce?1:clamp(-r.top/(r.height-innerHeight),0,1);let off=0,opened=0;
      for(let k=0;k<n;k++){if(k>0){const o=ease(clamp(p*(n-1)*1.12-(n-1-k),0,1));off+=E*o;if(o>.5)opened++}sl[k].style.transform=`translateY(${-off}px)`}
      const act=Math.max(0,n-1-opened);sl.forEach(g=>g.classList.toggle('hi',+g.dataset.i===act));lb.forEach(l=>l.classList.toggle('on',+l.dataset.i===act));
      cnt.textContent=String(act+1).padStart(2,'0');bar.style.setProperty('--sp',(p*100).toFixed(1)+'%');const vb=svg.viewBox.baseVal.height,sc=svg.clientHeight/vb;svg.style.transform=`translateY(${-((n-1)*E-off)/2*sc}px)`})});
  // compliance: checks tick as you scroll
  $$('.cp7').forEach(cp=>{const cs=Array.from(cp.querySelectorAll('.c7-c')),nb=cp.querySelector('.c7-pill b'),bd=cp.querySelector('.c7-badge');let last=-1;
    SF.push(()=>{const r=cp.getBoundingClientRect(),p=reduce?1:clamp((innerHeight*.9-r.top)/(r.height*.7),0,1),k=Math.min(4,Math.floor(p*5));if(k===last)return;last=k;
      cs.forEach((c,j)=>c.classList.toggle('ck',j<k));nb.textContent=k;bd.classList.toggle('full',k===4)})});
  // hero snippets type themselves
  $$('.th-f span').forEach(sp=>{const t=sp.dataset.t;if(reduce){sp.textContent=t;return}let i=0,dir=1;const tick=()=>{i+=dir;sp.textContent=t.slice(0,i);if(i>=t.length){dir=-1;setTimeout(tick,2600+Math.random()*2000);return}if(i<=0){dir=1;setTimeout(tick,600+Math.random()*1500);return}setTimeout(tick,dir>0?55:25)};setTimeout(tick,(+getComputedStyle(sp).getPropertyValue('--i')||0)*450)});
  // solutions: live console
  $$('.sh6').forEach(h=>{const st=h.querySelector('.lvb'),bars=Array.from(h.querySelectorAll('.lv-wave i')),t=h.querySelector('.lv-t');let s=0;
    if(!reduce){setInterval(()=>bars.forEach(b=>b.style.height=(10+Math.random()*85)+'%'),160);setInterval(()=>{s++;t.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},1000);
      SF.push(()=>{const r=st.getBoundingClientRect(),p=clamp((innerHeight-r.top)/(innerHeight*.7),0,1);st.style.setProperty('--tl',(12*(1-p)).toFixed(2)+'deg')})}});
  // solutions: horizontal cards driven by vertical scroll
  $$('.hx').forEach(hx=>{const tr=hx.querySelector('.hx-t'),cs=Array.from(tr.children),cnt=hx.querySelector('.hx-c b'),bar=hx.querySelector('.hx-bar');
    SF.push(()=>{const r=hx.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight),0,1),last=cs[cs.length-1],max=Math.max(0,last.offsetLeft+last.offsetWidth+parseFloat(getComputedStyle(tr).paddingLeft)-innerWidth);
      tr.style.setProperty('--tx',(-p*max).toFixed(1)+'px');bar.style.setProperty('--hb',(p*100).toFixed(1)+'%');const a=Math.min(cs.length-1,Math.round(p*(cs.length-1)));cs.forEach((c,j)=>c.classList.toggle('on',j===a));cnt.textContent=String(a+1).padStart(2,'0')})});
  // solutions: call flow advances with scroll
  $$('.c6').forEach(c6=>{const it=Array.from(c6.querySelectorAll('.c6-i')),cols=Array.from(c6.querySelectorAll('.cl-col')),rail=c6.querySelector('.c6-rail'),pc=c6.querySelector('.c6-pct b'),n=it.length;
    SF.push(()=>{const r=c6.getBoundingClientRect(),pin=getComputedStyle(c6.querySelector('.c6-st')).position==='sticky';
      const p=reduce?1:pin?clamp(-r.top/(r.height-innerHeight),0,1):clamp((innerHeight*.7-r.top)/(r.height*.8),0,1),a=Math.min(n-1,Math.floor(p*n*.999));
      it.forEach((x,j)=>{x.classList.toggle('on',j===a);x.classList.toggle('done',j<a)});cols.forEach((c,j)=>c.classList.toggle('on',j<=a));rail.style.setProperty('--cr',(p*100).toFixed(1)+'%');pc.textContent=Math.round(p*100)})});
  // about: problem list advances with scroll
  $$('.abp').forEach(ab=>{const ps=Array.from(ab.querySelectorAll('.ab-p')),ds=Array.from(ab.querySelectorAll('.ab-d')),l=ab.querySelector('.abp-l'),g=ab.querySelector('.abp-g'),n=ps.length;
    SF.push(()=>{const r=ab.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight),0,1),a=Math.min(n-1,Math.floor(p*n*.999));
      ps.forEach((x,j)=>x.classList.toggle('on',j===a));ds.forEach((x,j)=>x.classList.toggle('on',j===a));
      if(innerWidth>1000){const el=ps[a];l.style.setProperty('--ly',(g.clientHeight/2-el.offsetTop-el.offsetHeight/2)+'px')}else l.style.setProperty('--ly','0px')})});
  // pricing: volume tiles
  $$('.gts').forEach(g=>{const bs=Array.from(g.children),m=g.parentElement.querySelector('.gmsg');bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.toggle('on',x===b));m.textContent=b.dataset.msg}))});


  // header goes dark over dark sections
  {const DK='.cl,.c6,.how,.ahp';const hd=$('#hdr');let was=null;
   SF.push(()=>{const y=(hd?hd.offsetHeight:60)+2,el=document.elementFromPoint(innerWidth/2,y);let dk=false;
     if(el&&!el.closest('.hdr,.mega,.sheet')){const t=el.closest('.th');if(t){const r=t.getBoundingClientRect();dk=(y-r.top)/r.height<.5}else dk=!!el.closest(DK)}
     if(dk!==was){was=dk;root.classList.toggle('hdr-dk',dk)}})}


  // integrations (Arrakis rhythm): category list + vertical logo carousel
  $$('.ig').forEach(ig=>{const bs=Array.from(ig.querySelectorAll('.ig-cats button')),ss=Array.from(ig.querySelectorAll('.ig-set'));let g=0,k=0,hold=false;
    const place=()=>{const set=ss[g],tr=set.querySelector('.ig-tr'),cs=Array.from(tr.children),c=cs[k];if(!c)return;
      tr.style.transform=`translateY(${set.clientHeight/2-(c.offsetTop+c.offsetHeight/2)}px)`;cs.forEach((x,j)=>{x.classList.toggle('on',j===k);x.classList.toggle('near',Math.abs(j-k)===1)})};
    const show=i=>{g=i;k=0;bs.forEach((b,j)=>b.classList.toggle('on',j===i));ss.forEach((x,j)=>x.classList.toggle('on',j===i));place()};
    bs.forEach((b,i)=>b.addEventListener('click',()=>{hold=true;show(i);setTimeout(()=>hold=false,8000)}));
    show(0);addEventListener('resize',place);ig.addEventListener('mouseenter',()=>hold=true);ig.addEventListener('mouseleave',()=>hold=false);
    if(!reduce)setInterval(()=>{if(hold)return;const n=ss[g].querySelectorAll('.ig-c').length;k++;if(k>=n){show((g+1)%ss.length)}else place()},2200)});

  /* ---------- footer ---------- */
  const fStt=$('#fStt'),states=['Ringing your agent','Connected · streaming','Call completed · events sent'];let fi=0;
  if(fStt&&!reduce)setInterval(()=>{fi=(fi+1)%states.length;fStt.textContent=states[fi]},2600);
  $$('.fdial .bars i').forEach((b,i)=>b.style.animationDelay=(i*.07)+'s');
  const giant=$('#giant .w');
  function onGiant(){if(!giant)return;const r=giant.getBoundingClientRect(),p=clamp((innerHeight-r.top)/(r.height+40),0,1);giant.style.setProperty('--fill',(p*100).toFixed(1)+'%')}

  /* ---------- scroll loop ---------- */
  let ticking=false;
  SF.push(onGiant);
  function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;SF.forEach(f=>f())})}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);SF.forEach(f=>f());
})();
