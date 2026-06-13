// @ts-nocheck
import "./styles.css";
import { startIconObserver } from "../../shared/icons";

startIconObserver();

/* ── Left panel waveform ─────────────────────────────── */
  (function(){
    const w=document.getElementById('left-wave');
    for(let i=0;i<36;i++){
      const b=document.createElement('div');b.className='lw-bar';
      const mn=3+Math.random()*5,mx=8+Math.random()*28;
      const dur=.6+Math.random()*1.5,dly=(Math.random()*2).toFixed(2);
      b.style.cssText=`width:4px;border-radius:3px;height:${mn}px;background:rgba(255,255,255,.2);animation:wave ${dur}s ease-in-out infinite alternate ${dly}s`;
      b.style.setProperty('--min-h',mn+'px');
      b.style.setProperty('--max-h',mx+'px');
      w.appendChild(b);
    }
  })();

  /* ── Vertical scrolling cards ────────────────────────── */
  const moods=[
    {e:'<span data-echo-icon="cloudRain"></span>',n:'Generated Track',s:'Lo-fi · 90 BPM',p:55},
    {e:'<span data-echo-icon="sun"></span>',n:'Generated Track',s:'Jazz · 120 BPM',p:30},
    {e:'<span data-echo-icon="waves"></span>',n:'Generated Track',s:'Ambient · 75 BPM',p:80},
    {e:'<span data-echo-icon="flame"></span>',n:'Generated Track',s:'Rock · 140 BPM',p:45},
    {e:'<span data-echo-icon="sparkles"></span>',n:'Generated Track',s:'Electronic · 110 BPM',p:70},
    {e:'<span data-echo-icon="moon"></span>',n:'Generated Track',s:'Chill · 85 BPM',p:60},
    {e:'<span data-echo-icon="guitar"></span>',n:'Generated Track',s:'Punk · 155 BPM',p:35},
    {e:'<span data-echo-icon="flower"></span>',n:'Generated Track',s:'Dream Pop · 95 BPM',p:90},
  ];
  const ct=document.getElementById('left-cards');
  [...moods,...moods].forEach(m=>{
    const el=document.createElement('div');el.className='left-card';
    el.innerHTML=`<div class="left-card-emoji">${m.e}</div>
      <div class="left-card-name">${m.n}</div>
      <div class="left-card-sub">${m.s}</div>
      <div class="left-card-bar"><div class="left-card-fill" style="width:${m.p}%"></div></div>`;
    ct.appendChild(el);
  });

  /* ── Tab switcher ────────────────────────────────────── */
  let currentTab='login';
  function switchAuthTab(tab){
    currentTab=tab;
    const ind=document.getElementById('auth-tab-ind');
    ind.style.transform=tab==='login'?'translateX(0)':'translateX(100%)';

    const isLogin=tab==='login';
    document.getElementById('auth-heading').textContent=isLogin?'Welcome back':'Create account';
    document.getElementById('auth-sub').textContent=isLogin?'Sign in to your Echo Echo account':'Join thousands of music creators';
    document.getElementById('submit-text').textContent=isLogin?'Log in':'Create account';
    document.getElementById('toggle-footer').innerHTML=isLogin
      ?`Don't have an account? <a href="#" onclick="switchAuthTab('signup');return false">Sign up free</a>`
      :`Already have an account? <a href="#" onclick="switchAuthTab('login');return false">Log in</a>`;

    document.querySelectorAll('.signup-only').forEach(el=>el.style.display=isLogin?'none':'');
    document.querySelectorAll('.signup-only.name-row').forEach(el=>el.style.display=isLogin?'none':'grid');
    document.getElementById('forgot-row').style.display=isLogin?'flex':'none';
    document.getElementById('confirm-group').style.display=isLogin?'none':'block';
    document.getElementById('password').autocomplete=isLogin?'current-password':'new-password';
    hideMsg();
  }

  /* ── Password toggle ────────────────────────────────── */
  function togglePw(inputId,eyeId){
    const inp=document.getElementById(inputId);
    const eye=document.getElementById(eyeId);
    const show=inp.type==='password';
    inp.type=show?'text':'password';
    eye.innerHTML=show
      ?`<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`
      :`<path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>`;
  }

  /* ── Messages ────────────────────────────────────────── */
  function showMsg(text,type){
    const m=document.getElementById('auth-msg');
    m.textContent=text;m.className='auth-msg '+type+' show';
  }
  function hideMsg(){
    const m=document.getElementById('auth-msg');
    m.className='auth-msg';
  }

  /* ── Social OAuth stubs ──────────────────────────────── */
  function handleGoogle(){
    showMsg('Redirecting to Google…','success');
    setTimeout(()=>{
      localStorage.setItem('echo_auth_token','google_stub_token');
      localStorage.setItem('echo_user_name','Music Creator');
      window.location.href='/dashboard';
    },1000);
  }
  function handleApple(){
    showMsg('Redirecting to Apple…','success');
    setTimeout(()=>{
      localStorage.setItem('echo_auth_token','apple_stub_token');
      localStorage.setItem('echo_user_name','Music Creator');
      window.location.href='/dashboard';
    },1000);
  }

  /* ── Email form submit ───────────────────────────────── */
  function handleSubmit(e){
    e.preventDefault();
    hideMsg();
    const email=document.getElementById('email').value.trim();
    const pw=document.getElementById('password').value;

    if(!email||!pw){showMsg('Please fill in all fields.','error');return;}
    if(pw.length<6){showMsg('Password must be at least 6 characters.','error');return;}

    if(currentTab==='signup'){
      const cpw=document.getElementById('confirm-pw').value;
      if(pw!==cpw){showMsg('Passwords do not match.','error');return;}
    }

    const btn=document.getElementById('submit-btn');
    const span=document.getElementById('submit-text');
    btn.disabled=true;span.textContent='Please wait…';

    setTimeout(()=>{
      localStorage.setItem('echo_auth_token','email_stub_token');
      localStorage.setItem('echo_user_email',email);
      localStorage.setItem('echo_user_name',email.split('@')[0]);
      showMsg(currentTab==='login'?'Signed in! Redirecting…':'Account created! Redirecting…','success');
      setTimeout(()=>{window.location.href='/dashboard';},700);
    },900);
  }

  /* ── Init ────────────────────────────────────────────── */
  (function(){
    // check for ?mode=signup
    if(new URLSearchParams(location.search).get('mode')==='signup'){
      switchAuthTab('signup');
    } else {
      switchAuthTab('login');
    }
    // if already authed
    if(localStorage.getItem('echo_auth_token')){
      window.location.href='/dashboard';
    }
  })();


Object.assign(window, {
  switchAuthTab,
  togglePw,
  showMsg,
  hideMsg,
  handleGoogle,
  handleApple,
  handleSubmit,
});


