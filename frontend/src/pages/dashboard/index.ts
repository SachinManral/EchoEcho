// @ts-nocheck
import "./styles.css";
import { startIconObserver } from "../../shared/icons";
import { fetchSongs, songToTrack } from "../../shared/api";

startIconObserver();

let tracks = [];
let playingId = null;
let activeFilter = 'all';
let audioPlayer = null;

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
(async function init(){
  // auth guard
  if(!localStorage.getItem('echo_auth_token')){
    window.location.href='/login'; return;
  }

  // user info
  const name = localStorage.getItem('echo_user_name') || 'Music Creator';
  const email = localStorage.getItem('echo_user_email') || 'creator@echo.app';
  const initial = name.charAt(0).toUpperCase();
  document.getElementById('profile-initial').textContent = initial;
  document.getElementById('dd-avatar').textContent = initial;
  document.getElementById('dd-name').textContent = name;
  document.getElementById('dd-email').textContent = email;

  await loadTracks();

  renderView();
  if(localStorage.getItem('echo_open_create') === '1'){
    localStorage.removeItem('echo_open_create');
    openCreateInspo();
  }
})();

async function loadTracks(){
  try {
    const songs = await fetchSongs();
    tracks = songs.map(songToTrack);
    saveTracks();
  } catch (error) {
    tracks = JSON.parse(localStorage.getItem('echo_tracks') || '[]');
    showToast(error instanceof Error ? error.message : 'Could not load library');
  }
}

/* ═══════════════════════════════════════════════
   VIEW SWITCHING
═══════════════════════════════════════════════ */
function renderView(){
  if(tracks.length === 0){
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('filled-state').style.display = 'none';
    buildEmptyWave();
  } else {
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('filled-state').style.display = 'block';
    updateStats();
    renderTracks();
  }
}

/* ═══════════════════════════════════════════════
   EMPTY STATE WAVEFORM
═══════════════════════════════════════════════ */
function buildEmptyWave(){
  const w = document.getElementById('empty-wave');
  w.innerHTML = '';
  for(let i=0;i<32;i++){
    const b = document.createElement('div');
    b.className = 'ew-bar';
    const mn=6+Math.random()*10, mx=20+Math.random()*48;
    const dur=.7+Math.random()*1.6, dly=(Math.random()*2).toFixed(2);
    b.style.cssText=`height:${mn}px;animation:wave ${dur}s ease-in-out infinite alternate ${dly}s`;
    b.style.setProperty('--min-h',mn+'px');
    b.style.setProperty('--max-h',mx+'px');
    w.appendChild(b);
  }
}

/* ═══════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════ */
function updateStats(){
  document.getElementById('stat-count').textContent = tracks.length + ' track' + (tracks.length!==1?'s':'');
  const totalSecs = tracks.reduce((a,t)=>{
    const [m,s] = t.dur.split(':').map(Number); return a+m*60+s;
  },0);
  const mins = Math.floor(totalSecs/60);
  document.getElementById('stat-dur').textContent = mins + ' min total';
}

/* ═══════════════════════════════════════════════
   RENDER TRACKS
═══════════════════════════════════════════════ */
function renderTracks(filter){
  const f = filter || activeFilter;
  const list = document.getElementById('tracks-list');
  list.innerHTML = '';

  const filtered = f==='all' ? tracks : tracks.filter(t=>t.genre.toLowerCase().includes(f));

  document.getElementById('no-filter-results').style.display = filtered.length===0?'block':'none';

  filtered.forEach((t,i)=>{
    const el = document.createElement('div');
    el.className = 'track-card';
    el.style.animationDelay = (i*.055)+'s';
    el.id = 'card-'+t.id;

    // build mini waveform bars (progress)
    let bars='';
    const filled = Math.floor(Math.random()*22)+4;
    for(let j=0;j<32;j++){
      const h=4+Math.abs(Math.sin(j*0.6+i)*14);
      bars+=`<div class="tp-bar${j<filled?' filled':''}" style="height:${h}px"></div>`;
    }

    // cover mini bars
    let cvBars='';
    for(let j=0;j<5;j++){
      const h=3+Math.random()*6;
      cvBars+=`<div class="cover-bar" style="height:${h}px"></div>`;
    }

    el.innerHTML=`
      <div class="track-cover" id="cover-${t.id}" style="background:linear-gradient(135deg,${t.color}cc,${t.color}66)">
        <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <div class="cover-wave">${cvBars}</div>
      </div>
      <div class="track-info">
        <div class="track-name">${t.name}</div>
        <div class="track-meta-row">
          <span class="track-tag mood">${t.mood}</span>
          <span class="track-tag genre">${t.genre}</span>
          <span class="track-tag">${t.bpm} BPM</span>
          ${t.fav?'<span class="track-tag" style="background:rgba(255,88,88,.08);color:#e04040"><span data-echo-icon="heart"></span></span>':''}
        </div>
        <div class="track-progress">${bars}</div>
      </div>
      <div class="track-right">
        <span class="track-dur">${t.dur}</span>
        <span class="track-date">${t.date}</span>
      </div>
      <div class="track-actions">
        <button class="act-btn act-play" onclick="togglePlay('${t.id}',event)" title="Play">
          <svg id="play-icon-${t.id}" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        </button>
        <div style="position:relative">
          <button class="act-btn act-more" onclick="toggleMoreMenu('${t.id}',event)" title="More">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>
          <div class="more-menu" id="more-${t.id}">
            <button class="more-item" onclick="downloadTrack('${t.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download MP3
            </button>
            <button class="more-item" onclick="downloadTrack('${t.id}','wav')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download WAV
            </button>
            <button class="more-item" onclick="toggleFav('${t.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="${t.fav?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              ${t.fav ? 'Remove from favourites' : 'Add to favourites'}
            </button>
            <button class="more-item" onclick="shareTrack('${t.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share track
            </button>
            <div class="more-sep"></div>
            <button class="more-item danger" onclick="deleteTrack('${t.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>`;
    list.appendChild(el);
  });
}

/* ═══════════════════════════════════════════════
   FILTER
═══════════════════════════════════════════════ */
function filterTracks(f, btn){
  activeFilter = f;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderTracks(f);
}

/* ═══════════════════════════════════════════════
   PLAYBACK (UI only)
═══════════════════════════════════════════════ */
function togglePlay(id, e){
  e.stopPropagation();
  const wasPlaying = playingId === id;

  // reset previous
  if(playingId){
    const pc = document.getElementById('cover-'+playingId);
    if(pc) pc.classList.remove('playing');
    const pi = document.getElementById('play-icon-'+playingId);
    if(pi) pi.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
  }

  if(wasPlaying){
    playingId = null;
    if(audioPlayer) audioPlayer.pause();
    showToast('Paused');
  } else {
    playingId = id;
    const cover = document.getElementById('cover-'+id);
    if(cover) cover.classList.add('playing');
    const icon = document.getElementById('play-icon-'+id);
    if(icon) icon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
    const t = tracks.find(t=>t.id===id);
    if(t?.audioUrl){
      if(audioPlayer) audioPlayer.pause();
      audioPlayer = new Audio(t.audioUrl);
      audioPlayer.addEventListener('ended', () => togglePlay(id, { stopPropagation(){} }));
      audioPlayer.play().catch(() => showToast('Audio playback failed'));
    }
    if(t) showToast('Playing: '+t.name);
  }
}

/* ═══════════════════════════════════════════════
   MORE MENU
═══════════════════════════════════════════════ */
function toggleMoreMenu(id, e){
  e.stopPropagation();
  const m = document.getElementById('more-'+id);
  const wasOpen = m.classList.contains('open');
  closeAllMenus();
  if(!wasOpen) m.classList.add('open');
}
function closeAllMenus(){
  document.querySelectorAll('.more-menu.open').forEach(m=>m.classList.remove('open'));
}

function downloadTrack(id, fmt='mp3'){
  closeAllMenus();
  const t = tracks.find(t=>t.id===id);
  if(!t) return;
  if(t.downloadUrl || t.audioUrl){
    window.open(t.downloadUrl || t.audioUrl, '_blank');
    showToast('Downloading '+t.name+'.'+fmt);
  } else {
    showToast('No download is available yet');
  }
}

function toggleFav(id){
  closeAllMenus();
  const t = tracks.find(t=>t.id===id);
  if(!t) return;
  t.fav = !t.fav;
  saveTracks();
  renderTracks();
  showToast(t.fav ? '<span data-echo-icon="heart"></span> Added to favourites' : 'Removed from favourites');
}

function shareTrack(id){
  closeAllMenus();
  const t = tracks.find(t=>t.id===id);
  if(!t) return;
  const url = 'https://echo.app/track/'+id;
  navigator.clipboard?.writeText(url).catch(()=>{});
  showToast('Link copied to clipboard');
}

function deleteTrack(id){
  closeAllMenus();
  const card = document.getElementById('card-'+id);
  if(card){ card.style.opacity='.4'; card.style.transform='scale(.97)'; card.style.transition='all .2s'; }
  setTimeout(()=>{
  tracks = tracks.filter(t=>t.id!==id);
    saveTracks();
    renderView();
    showToast('Track deleted');
  },200);
}

function saveTracks(){
  localStorage.setItem('echo_tracks', JSON.stringify(tracks));
}

/* ═══════════════════════════════════════════════
   PROFILE DROPDOWN
═══════════════════════════════════════════════ */
function toggleDropdown(e){
  e.stopPropagation();
  const dd = document.getElementById('profile-dropdown');
  dd.classList.toggle('open');
}
document.addEventListener('click', ()=>{
  document.getElementById('profile-dropdown').classList.remove('open');
  closeAllMenus();
});

/* ═══════════════════════════════════════════════
   LOGOUT
═══════════════════════════════════════════════ */
function handleLogout(){
  localStorage.removeItem('echo_auth_token');
  localStorage.removeItem('echo_user_name');
  localStorage.removeItem('echo_user_email');
  localStorage.removeItem('echo_tracks');
  window.location.href = '/login';
}

/* ═══════════════════════════════════════════════
   CREATE INSPO POPUP — Phase 4
═══════════════════════════════════════════════ */
const STEPS = [
  {
    id:'generation-mode', label:'Mode',
    title:'Choose generation mode',
    sub:'Use the cloud API for faster songs, or the local model running in this backend.',
    type:'mode', key:'generationMode',
    options:[
      {value:'api', title:'API', meta:'Cloud generation', detail:'Usually faster and returns MP3 audio.'},
      {value:'musicgen', title:'Model', meta:'Local MusicGen', detail:'Runs through the loaded backend model.'},
    ]
  },
  {
    id:'mood', label:'Mood',
    title:'How do you want to feel?',
    sub:'Pick the vibe that captures your current state of mind.',
    type:'grid', key:'mood',
    options:[
      {e:'<span data-echo-icon="calm"></span>',l:'Calm'},     {e:'<span data-echo-icon="cloudRain"></span>',l:'Melancholy'}, {e:'<span data-echo-icon="flame"></span>',l:'Energetic'}, {e:'<span data-echo-icon="sparkles"></span>',l:'Euphoric'},
      {e:'<span data-echo-icon="guitar"></span>',l:'Rebellious'},{e:'<span data-echo-icon="moon"></span>',l:'Dreamy'},      {e:'<span data-echo-icon="heart"></span>',l:'Dark'},       {e:'<span data-echo-icon="sun"></span>',l:'Hopeful'},
    ]
  },
  {
    id:'genre', label:'Genre',
    title:'Choose a genre',
    sub:'What kind of music are you in the mood for?',
    type:'grid', key:'genre',
    options:[
      {e:'<span data-echo-icon="piano"></span>',l:'Lo-fi'},   {e:'<span data-echo-icon="jazz"></span>',l:'Jazz'},     {e:'<span data-echo-icon="guitar"></span>',l:'Rock'},    {e:'<span data-echo-icon="violin"></span>',l:'Classical'},
      {e:'<span data-echo-icon="zap"></span>',l:'Electronic'},{e:'<span data-echo-icon="microphone"></span>',l:'Hip-hop'}, {e:'<span data-echo-icon="waves"></span>',l:'Ambient'},  {e:'<span data-echo-icon="music"></span>',l:'Pop'},
    ]
  },
  {
    id:'theme', label:'Theme',
    title:'Paint a scene',
    sub:'What world should your music bring to life?',
    type:'grid', key:'theme',
    options:[
      {e:'<span data-echo-icon="nature"></span>',l:'Nature'},  {e:'<span data-echo-icon="urban"></span>',l:'Urban'},   {e:'<span data-echo-icon="space"></span>',l:'Space'},    {e:'<span data-echo-icon="waves"></span>',l:'Ocean'},
      {e:'<span data-echo-icon="nostalgia"></span>',l:'Nostalgia'},{e:'<span data-echo-icon="fantasy"></span>',l:'Fantasy'}, {e:'<span data-echo-icon="heart"></span>',l:'Love'},     {e:'<span data-echo-icon="freedom"></span>',l:'Freedom'},
    ]
  },
  {
    id:'instrument', label:'Instrument',
    title:'Lead with an instrument',
    sub:'Which instrument should carry the melody?',
    type:'grid', key:'instrument',
    options:[
      {e:'<span data-echo-icon="piano"></span>',l:'Piano'},  {e:'<span data-echo-icon="guitar"></span>',l:'Guitar'}, {e:'<span data-echo-icon="drums"></span>',l:'Drums'},   {e:'<span data-echo-icon="violin"></span>',l:'Violin'},
      {e:'<span data-echo-icon="synth"></span>',l:'Synth'}, {e:'<span data-echo-icon="music"></span>',l:'Bass'},   {e:'<span data-echo-icon="trumpet"></span>',l:'Trumpet'}, {e:'<span data-echo-icon="flute"></span>',l:'Flute'},
    ]
  },
  {
    id:'style', label:'Style',
    title:'Production style',
    sub:'How should the track be crafted and finished?',
    type:'grid', key:'style',
    options:[
      {e:'<span data-echo-icon="music"></span>',l:'Acoustic'},    {e:'<span data-echo-icon="zap"></span>',l:'Electric'},      {e:'<span data-echo-icon="orchestral"></span>',l:'Orchestral'}, {e:'<span data-echo-icon="minimal"></span>',l:'Minimal'},
      {e:'<span data-echo-icon="layered"></span>',l:'Layered'},    {e:'<span data-echo-icon="experimental"></span>',l:'Experimental'},  {e:'<span data-echo-icon="dramatic"></span>',l:'Dramatic'},   {e:'<span data-echo-icon="flower"></span>',l:'Delicate'},
    ]
  },
  {
    id:'bpm', label:'BPM',
    title:'Set the BPM',
    sub:'How fast or slow should the track pulse?',
    type:'bpm', key:'bpm',
  },
  {
    id:'tempo', label:'Tempo Feel',
    title:'Tempo feel',
    sub:'Choose the energy and rhythmic groove.',
    type:'grid', key:'tempoFeel', cols:5,
    options:[
      {e:'<span data-echo-icon="coffee"></span>',l:'Lazy'}, {e:'<span data-echo-icon="waves"></span>',l:'Flowing'}, {e:'<span data-echo-icon="steady"></span>',l:'Steady'}, {e:'<span data-echo-icon="rocket"></span>',l:'Driving'}, {e:'<span data-echo-icon="zap"></span>',l:'Frantic'},
    ]
  },
  {
    id:'prompt', label:'Prompt',
    title:'Describe your vibe',
    sub:'Optional: guide the AI with your own words.',
    type:'prompt', key:'promptText',
  },
];

let popupStep = 0;
const sel = {};   // selections store

function openCreateInspo(){
  popupStep = 0;
  Object.keys(sel).forEach(k => delete sel[k]);
  sel.generationMode = 'api';
  sel.bpm = 90;
  buildPopupDots();
  renderPopupStep(0, null);
  document.getElementById('popup-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePopup(){
  document.getElementById('popup-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* Close on overlay click */
document.getElementById('popup-overlay').addEventListener('click', function(e){
  if(e.target === this) closePopup();
});

/* ESC key */
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closePopup();
});

function buildPopupDots(){
  const c = document.getElementById('popup-dots');
  c.innerHTML = '';
  STEPS.forEach((_,i) => {
    const d = document.createElement('div');
    d.className = 'p-dot upcoming';
    d.id = 'p-dot-'+i;
    c.appendChild(d);
  });
}

function updatePopupDots(idx){
  STEPS.forEach((_,i) => {
    const d = document.getElementById('p-dot-'+i);
    if(!d) return;
    d.className = 'p-dot ' + (i < idx ? 'done' : i === idx ? 'active' : 'upcoming');
  });
  const pct = idx === 0 ? 0 : (idx / (STEPS.length - 1)) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('popup-step-badge').textContent = `Step ${idx+1} of ${STEPS.length} · ${STEPS[idx].label}`;
}

function buildStepHTML(step){
  let html = `<div class="step-title">${step.title}</div>
              <div class="step-sub">${step.sub}</div>`;

  if(step.type === 'grid'){
    const cols = step.cols || 4;
    html += `<div class="choice-grid${cols===5?' cols-5':''}">`;
    step.options.forEach(o => {
      const active = sel[step.key] === o.l;
      html += `<div class="choice-chip${active?' sel':''}" data-key="${step.key}" data-val="${o.l}" onclick="selectChip(this)">
        <span class="chip-emoji">${o.e}</span>
        <span class="chip-label">${o.l}</span>
      </div>`;
    });
    html += `</div>`;

  } else if(step.type === 'mode'){
    const current = sel.generationMode || 'api';
    html += `<div class="mode-choice-grid">`;
    step.options.forEach(o => {
      const active = current === o.value;
      html += `<button type="button" class="mode-choice${active?' sel':''}" data-key="${step.key}" data-val="${o.value}" onclick="selectMode(this)">
        <span class="mode-choice-title">${o.title}</span>
        <span class="mode-choice-meta">${o.meta}</span>
        <span class="mode-choice-detail">${o.detail}</span>
      </button>`;
    });
    html += `</div>`;

  } else if(step.type === 'bpm'){
    const v = sel.bpm || 90;
    html += `<div class="bpm-display">
      <div class="bpm-number" id="bpm-num">${v}</div>
      <div class="bpm-unit">BPM</div>
    </div>
    <input type="range" class="bpm-slider" id="bpm-slider" min="60" max="200" value="${v}" oninput="onBPMInput(this)"/>
    <div class="bpm-presets">
      <button class="bpm-preset${v<=80?' sel':''}" onclick="setBPMPreset(70,this)">Slow<span class="bpm-preset-range">60–80</span></button>
      <button class="bpm-preset${v>80&&v<=110?' sel':''}" onclick="setBPMPreset(95,this)">Moderate<span class="bpm-preset-range">80–110</span></button>
      <button class="bpm-preset${v>110&&v<=140?' sel':''}" onclick="setBPMPreset(125,this)">Upbeat<span class="bpm-preset-range">110–140</span></button>
      <button class="bpm-preset${v>140?' sel':''}" onclick="setBPMPreset(155,this)">Fast<span class="bpm-preset-range">140+</span></button>
    </div>`;

  } else if(step.type === 'prompt'){
    const txt = sel.promptText || '';
    html += `<textarea class="prompt-textarea" id="prompt-input" maxlength="200"
      placeholder="e.g. late night city drive with rain outside..."
      oninput="onPromptInput(this)">${txt}</textarea>
    <div class="char-row">
      <span style="font-size:.72rem;color:var(--grey71)">Optional — skip with Next if you prefer</span>
      <span class="char-count" id="char-count">${200-txt.length}/200</span>
    </div>
    <div class="prompt-sug">
      <button class="sug-pill" onclick="insertSug(this)">late night city drive</button>
      <button class="sug-pill" onclick="insertSug(this)">morning run energy</button>
      <button class="sug-pill" onclick="insertSug(this)">rainy café afternoon</button>
      <button class="sug-pill" onclick="insertSug(this)">cinematic chase scene</button>
      <button class="sug-pill" onclick="insertSug(this)">cozy winter fireplace</button>
    </div>`;
  }
  return html;
}

function renderPopupStep(idx, dir){
  const step = STEPS[idx];
  const body = document.getElementById('popup-body');

  /* ── Clear body completely — zero overlap, zero leftover DOM ── */
  body.innerHTML = `<div class="step-slide">${buildStepHTML(step)}</div>`;
  const slide = body.firstElementChild;

  /* ── Animate in: opacity + translateX, no absolute positioning ── */
  if(dir){
    slide.style.opacity = '0';
    slide.style.transform = `translateX(${dir === 'back' ? '-28px' : '28px'})`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      slide.style.transition = 'opacity .22s ease, transform .24s cubic-bezier(.2,.75,.28,.9)';
      slide.style.opacity = '1';
      slide.style.transform = 'translateX(0)';
    }));
  }

  if(step.type === 'bpm') updateSliderFill(sel.bpm || 90);
  updatePopupDots(idx);
  updatePopupNav(idx);
}

function selectChip(el){
  const key = el.dataset.key;
  const val = el.dataset.val;
  sel[key] = val;
  el.closest('.choice-grid').querySelectorAll('.choice-chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
}

function selectMode(el){
  const key = el.dataset.key;
  const val = el.dataset.val;
  sel[key] = val;
  el.closest('.mode-choice-grid').querySelectorAll('.mode-choice').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
}

function onBPMInput(input){
  const v = parseInt(input.value);
  sel.bpm = v;
  document.getElementById('bpm-num').textContent = v;
  updateSliderFill(v);
  document.querySelectorAll('.bpm-preset').forEach((b,i) => {
    const ranges = [[60,80],[81,110],[111,140],[141,200]];
    b.classList.toggle('sel', v >= ranges[i][0] && v <= ranges[i][1]);
  });
}

function setBPMPreset(val, btn){
  sel.bpm = val;
  const slider = document.getElementById('bpm-slider');
  if(slider){ slider.value = val; updateSliderFill(val); }
  document.getElementById('bpm-num').textContent = val;
  document.querySelectorAll('.bpm-preset').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

function updateSliderFill(v){
  const pct = ((v-60)/(200-60))*100;
  const slider = document.getElementById('bpm-slider');
  if(slider) slider.style.background =
    `linear-gradient(to right,#ff5858 ${pct}%,var(--greyD9) ${pct}%)`;
}

function onPromptInput(ta){
  sel.promptText = ta.value;
  const left = 200 - ta.value.length;
  const cc = document.getElementById('char-count');
  if(cc){ cc.textContent = left+'/200'; cc.className = 'char-count'+(left<30?' warn':''); }
}

function insertSug(btn){
  const ta = document.getElementById('prompt-input');
  if(!ta) return;
  ta.value = btn.textContent;
  onPromptInput(ta);
  ta.focus();
}

function updatePopupNav(idx){
  const backBtn = document.getElementById('popup-back-btn');
  const nextBtn = document.getElementById('popup-next-btn');
  const nextTxt = document.getElementById('popup-next-text');
  backBtn.disabled = idx === 0;
  const isLast = idx === STEPS.length - 1;
  nextTxt.textContent = isLast ? 'Generate ✦' : 'Next';
  nextBtn.classList.toggle('gen-btn', isLast);
}

function nextStep(){
  if(popupStep < STEPS.length - 1){
    popupStep++;
    renderPopupStep(popupStep, 'fwd');
  } else {
    submitInspo();
  }
}

function prevStep(){
  if(popupStep > 0){
    popupStep--;
    renderPopupStep(popupStep, 'back');
  }
}

function submitInspo(){
  // Persist inspo data for generate page
  const inspo = {
    generationMode: sel.generationMode || 'api',
    mood:       sel.mood       || 'Custom',
    genre:      sel.genre      || 'Mixed',
    theme:      sel.theme      || '',
    instrument: sel.instrument || '',
    style:      sel.style      || '',
    bpm:        sel.bpm        || 90,
    tempoFeel:  sel.tempoFeel  || '',
    promptText: sel.promptText || '',
  };
  localStorage.setItem('echo_pending_inspo', JSON.stringify(inspo));
  closePopup();
  // Brief delay so close animation plays before nav
  setTimeout(() => { window.location.href = '/generate'; }, 280);
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}


Object.assign(window, {
  renderView,
  buildEmptyWave,
  updateStats,
  renderTracks,
  filterTracks,
  togglePlay,
  toggleMoreMenu,
  closeAllMenus,
  downloadTrack,
  toggleFav,
  shareTrack,
  deleteTrack,
  saveTracks,
  toggleDropdown,
  handleLogout,
  openCreateInspo,
  closePopup,
  buildPopupDots,
  updatePopupDots,
  buildStepHTML,
  renderPopupStep,
  selectChip,
  selectMode,
  onBPMInput,
  setBPMPreset,
  updateSliderFill,
  onPromptInput,
  insertSug,
  updatePopupNav,
  nextStep,
  prevStep,
  submitInspo,
  showToast,
});


