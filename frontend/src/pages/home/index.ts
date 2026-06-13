// @ts-nocheck
import "./styles.css";
import { startIconObserver } from "../../shared/icons";

startIconObserver();

/* ── Hero phone waveform ───────────────────────────── */
  (function(){
    const hw=document.getElementById('hero-wave');
    for(let i=0;i<28;i++){
      const b=document.createElement('div');b.className='p-wavebar';
      b.style.height=(4+Math.random()*14)+'px';hw.appendChild(b);
    }
  })();

  /* ── Auto-flip hero phone ──────────────────────────── */
  setInterval(()=>{
    const fi=document.getElementById('flip-inner');
    const cur=fi.style.transform;
    fi.style.transition='transform .9s cubic-bezier(.19,1,.22,1)';
    fi.style.transform=cur.includes('180deg')?'rotateY(0deg)':'rotateY(180deg)';
  },3500);

  /* ── Creator cards marquee ─────────────────────────── */
  const creators=[
    {i:'<span data-echo-icon="piano"></span>',n:'Alex M.',g:'Lo-fi Producer',t:'34 tracks'},
    {i:'<span data-echo-icon="jazz"></span>',n:'Priya K.',g:'Jazz Composer',t:'21 tracks'},
    {i:'<span data-echo-icon="guitar"></span>',n:'Jordan T.',g:'Rock Artist',t:'58 tracks'},
    {i:'<span data-echo-icon="violin"></span>',n:'Maria S.',g:'Orchestral',t:'12 tracks'},
    {i:'<span data-echo-icon="microphone"></span>',n:'Sam W.',g:'Hip-hop',t:'47 tracks'},
    {i:'<span data-echo-icon="music"></span>',n:'Chen L.',g:'Ambient',t:'29 tracks'},
    {i:'<span data-echo-icon="drums"></span>',n:'Dev R.',g:'Electronic',t:'61 tracks'},
    {i:'<span data-echo-icon="waves"></span>',n:'Sofia P.',g:'Chill Wave',t:'18 tracks'},
    {i:'<span data-echo-icon="zap"></span>',n:'Ryo K.',g:'Synthwave',t:'33 tracks'},
    {i:'<span data-echo-icon="moon"></span>',n:'Ana B.',g:'Dream Pop',t:'26 tracks'},
    {i:'<span data-echo-icon="flame"></span>',n:'Marcus J.',g:'Trap',t:'52 tracks'},
    {i:'<span data-echo-icon="sparkles"></span>',n:'Lily C.',g:'Indie Folk',t:'15 tracks'},
    {i:'<span data-echo-icon="trumpet"></span>',n:'Omar F.',g:'Afrobeats',t:'40 tracks'},
    {i:'<span data-echo-icon="audio"></span>',n:'Zara M.',g:'R&B',t:'38 tracks'},
  ];
  const track=document.getElementById('creators-track');
  [...creators,...creators].forEach(c=>{
    const el=document.createElement('div');
    el.className='creator-card';
    el.innerHTML=`<div class="creator-avatar">${c.i}</div>
      <div class="creator-name">${c.n}</div>
      <div class="creator-genre">${c.g}</div>
      <div class="creator-tracks">${c.t}</div>`;
    track.appendChild(el);
  });

  /* ── Bento waveform ────────────────────────────────── */
  (function(){
    const bw=document.getElementById('bento-wave');
    for(let i=0;i<46;i++){
      const b=document.createElement('div');b.className='bento-wavebar';
      const mn=4+Math.random()*10,mx=18+Math.random()*50;
      const dur=.7+Math.random()*1.3,dly=(Math.random()*1.8).toFixed(2);
      b.style.cssText=`height:${mn}px;animation:wave ${dur}s ease-in-out infinite alternate ${dly}s`;
      b.style.setProperty('--min-h',mn+'px');
      b.style.setProperty('--max-h',mx+'px');
      bw.appendChild(b);
    }
  })();

  /* ── Spectrum bars ─────────────────────────────────── */
  (function(){
    const sp=document.getElementById('spectrum');
    [20,35,55,70,85,95,90,75,60,80,65,50,70,85,60,45,30,55,75,90,80,65,50,35].forEach(h=>{
      const b=document.createElement('div');b.className='spec-bar';
      b.style.height=h+'%';sp.appendChild(b);
    });
  })();

  /* ── App view tab switcher ─────────────────────────── */
  function switchAppTab(name,btn){
    document.getElementById('view-desktop').className='app-view-canvas hidden';
    document.getElementById('view-mobile').className='app-view-canvas hidden';
    document.getElementById('view-'+name).className='app-view-canvas active';
    const ind=document.getElementById('app-tab-indicator');
    ind.style.transform=name==='mobile'?'translateX(100%)':'translateX(0)';
  }

  /* ── Pricing tab ───────────────────────────────────── */
  function switchPriceTab(tab){
    const ind=document.getElementById('price-tab-ind');
    const price=document.getElementById('plan-price');
    if(tab==='monthly'){
      ind.style.transform='translateX(0)';
      price.textContent='$9.99';
    } else {
      ind.style.transform='translateX(88px)';
      price.textContent='$4.99';
    }
  }
  // init yearly selected
  switchPriceTab('yearly');

  /* ── Scrolling shots inside bento card ────────────── */
  function moveShots(trackId,dotsId,idx){
    const t=document.getElementById(trackId);
    const offset=idx*(240+8);
    t.style.transform=`translateX(-${offset}px)`;
    document.querySelectorAll('#'+dotsId+' .shot-dot-nav').forEach((d,i)=>{
      d.classList.toggle('active',i===idx);
    });
  }

  /* ── FAQ accordion ─────────────────────────────────── */
  function toggleFaq(el){
    const was=el.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
    if(!was) el.classList.add('open');
  }

  /* ── IntersectionObserver fade-up (bio.link) ───────── */
  const obs=new IntersectionObserver(
    entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('animate');obs.unobserve(e.target);}
    }),{threshold:.08}
  );
  document.querySelectorAll('.tw-content-anim').forEach(el=>obs.observe(el));

  /* ── CTA auth ──────────────────────────────────────── */
  function handleCTA(){
    window.location.href=localStorage.getItem('echo_auth_token')?'/dashboard':'/login';
  }


Object.assign(window, {
  switchAppTab,
  switchPriceTab,
  moveShots,
  toggleFaq,
  handleCTA,
});


