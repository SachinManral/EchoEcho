// @ts-nocheck
import "./styles.css";
import { startIconObserver } from "../../shared/icons";
import { fetchSongs, formatDuration, songToTrack } from "../../shared/api";

startIconObserver();

/* ═══════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════ */
const CARD_ACCENTS = ['#ff5858', '#c058ff', '#3d9eff', '#f7b731'];
const CARD_VARIANTS = ['Generated'];

/* Playing state per card */
const playState = [false];
let playIntervals = [null];
let heartState = [false];
let selectedCard = 0; // default: Best Match
let outputTracks = [];
let audioPlayer = null;
const durSeconds = [180];
const fakeProgress = [0];

/* ═══════════════════════════════════════════════
   AUTH GUARD
═══════════════════════════════════════════════ */
(async function init() {
  if (!localStorage.getItem('echo_auth_token')) {
    window.location.href = '/login';
    return;
  }
  const inspo = JSON.parse(localStorage.getItem('echo_pending_inspo') || '{}');
  const generatedSong = JSON.parse(localStorage.getItem('echo_generated_song') || 'null');
  let songs = generatedSong ? [generatedSong] : [];
  if (songs.length === 0) {
    songs = await fetchSongs().catch(() => []);
  }
  outputTracks = songs.slice(0, 1).map(songToTrack);
  buildInspoPills(inspo);
  renderGeneratedCards(inspo);
  buildAllWaveforms();
})();

/* ═══════════════════════════════════════════════
   INSPO PILLS
═══════════════════════════════════════════════ */
function buildInspoPills(inspo) {
  const mood  = inspo.mood  || 'Melancholy';
  const genre = inspo.genre || 'Lo-fi';
  const bpm   = inspo.bpm   || 90;

  const container = document.getElementById('inspo-pills');
  container.innerHTML = `
    <span class="inspo-pill mood-pill">${mood}</span>
    <span class="inspo-pill genre-pill">${genre}</span>
    <span class="inspo-pill bpm-pill">${bpm} BPM</span>
    ${inspo.theme ? `<span class="inspo-pill">${inspo.theme}</span>` : ''}
    ${inspo.instrument ? `<span class="inspo-pill">${inspo.instrument}</span>` : ''}
  `;
}

/* ═══════════════════════════════════════════════
   TAGS PER CARD
═══════════════════════════════════════════════ */
function buildAllTags(inspo) {
  const mood  = inspo.mood  || 'Melancholy';
  const genre = inspo.genre || 'Lo-fi';
  const bpm   = inspo.bpm   || 90;
  const subtitles = CARD_VARIANTS;

  for (let i = 0; i < outputTracks.length; i++) {
    const container = document.getElementById('tags-' + i);
    if (!container) continue;
    const track = outputTracks[i];
    const accentBg = CARD_ACCENTS[i] + '22';
    container.innerHTML = `
      <span class="c-tag mood">${track.mood || mood}</span>
      <span class="c-tag genre">${track.genre || genre}</span>
      <span class="c-tag">${track.bpm || bpm} BPM</span>
      <span class="c-tag" style="background:${accentBg};color:${CARD_ACCENTS[i]}">${subtitles[i]}</span>
    `;
  }
}

function renderGeneratedCards(inspo) {
  const track = outputTracks[0];
  document.querySelector('.page-sub').textContent = track
    ? 'Generated from your inspo'
    : 'No generated song was found';

  for (let i = 1; i < 4; i++) {
    const card = document.getElementById('card-' + i);
    if (card) card.style.display = 'none';
  }

  if (!track) return;

  const cardName = document.querySelector('#card-0 .card-name');
  if (cardName) cardName.textContent = track.name;

  const seconds = durationToSeconds(track.dur);
  document.getElementById('dur-0').textContent = track.dur;
  document.getElementById('dur-label-0').textContent = track.dur;
  document.getElementById('time-0').textContent = `0:00 / ${track.dur}`;
  durSeconds[0] = seconds;

  buildAllTags(inspo);
  updateSheetButtons(0);
}

/* ═══════════════════════════════════════════════
   WAVEFORMS
═══════════════════════════════════════════════ */
function buildWaveform(containerId, accent, barCount) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'wv-bar';

    /* Randomised heights for organic look */
    const minH = 6 + Math.random() * 8;
    const maxH = 20 + Math.random() * 44;

    /* Wave pattern: taller in the middle */
    const center = barCount / 2;
    const dist = Math.abs(i - center) / center;
    const shapedMaxH = maxH * (1 - dist * 0.45);

    const dur = (0.6 + Math.random() * 1.4).toFixed(2) + 's';
    const delay = (Math.random() * 1.8).toFixed(2) + 's';

    bar.style.cssText = `
      height: ${minH}px;
      background: ${accent};
      --min-h: ${minH}px;
      --max-h: ${shapedMaxH}px;
      --dur: ${dur};
      --delay: ${delay};
      animation: wave ${dur} ease-in-out infinite alternate ${delay};
      opacity: 0.7;
    `;

    container.appendChild(bar);
  }
}

function buildAllWaveforms() {
  for (let i = 0; i < Math.max(outputTracks.length, 1); i++) {
    buildWaveform('wave-' + i, CARD_ACCENTS[i], 50);
  }
}

/* ═══════════════════════════════════════════════
   PLAYBACK (FAKE)
═══════════════════════════════════════════════ */
function togglePlay(idx) {
  const wasPlaying = playState[idx];

  // Stop all others
  for (let i = 0; i < playState.length; i++) {
    if (playState[i]) stopCard(i);
  }

  if (wasPlaying) {
    stopCard(idx);
  } else {
    startCard(idx);
  }
}

function startCard(idx) {
  playState[idx] = true;

  /* Update play icon → pause */
  document.getElementById('play-icon-' + idx).innerHTML =
    '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';

  /* Waveform fast mode */
  const card = document.getElementById('card-' + idx);
  card.classList.add('playing');

  /* Highlight selected card */
  selectedCard = idx;
  document.querySelectorAll('.output-card').forEach((c, i) => {
    c.style.outline = i === idx
      ? `2px solid ${CARD_ACCENTS[idx]}66`
      : 'none';
  });
  // best-match-wrap needs special treatment
  const wrap = document.querySelector('.best-match-wrap');
  if (wrap) {
    wrap.style.boxShadow = idx === 0
      ? `0 0 0 2px ${CARD_ACCENTS[0]}55`
      : 'none';
  }

  /* Tick fake progress */
  clearInterval(playIntervals[idx]);
  const track = outputTracks[idx];
  if (track?.audioUrl) {
    if (audioPlayer) audioPlayer.pause();
    audioPlayer = new Audio(track.audioUrl);
    audioPlayer.addEventListener('ended', () => stopCard(idx));
    audioPlayer.play().catch(() => showToast('Audio playback failed'));
  }
  playIntervals[idx] = setInterval(() => {
    fakeProgress[idx] = Math.min(fakeProgress[idx] + (100 / durSeconds[idx]), 100);
    updateProgressUI(idx);
    if (fakeProgress[idx] >= 100) stopCard(idx);
  }, 1000);

  showToast('Playing: ' + (track?.name || 'Generated track'));
}

function stopCard(idx) {
  playState[idx] = false;
  clearInterval(playIntervals[idx]);
  playIntervals[idx] = null;
  if (audioPlayer) audioPlayer.pause();

  /* Restore play icon */
  document.getElementById('play-icon-' + idx).innerHTML =
    '<polygon points="5,3 19,12 5,21"/>';

  /* Remove playing state */
  document.getElementById('card-' + idx).classList.remove('playing');
}

function updateProgressUI(idx) {
  const pct = fakeProgress[idx];
  const range = document.getElementById('range-' + idx);
  range.value = pct;
  updateRangeTrack(idx, pct, CARD_ACCENTS[idx]);

  const elapsed = Math.round((pct / 100) * durSeconds[idx]);
  document.getElementById('time-' + idx).textContent =
    formatTime(elapsed) + ' / ' + formatDuration(durSeconds[idx]);
}

function onRangeInput(idx, input) {
  const pct = parseFloat(input.value);
  fakeProgress[idx] = pct;
  updateRangeTrack(idx, pct, CARD_ACCENTS[idx]);
  const elapsed = Math.round((pct / 100) * durSeconds[idx]);
  document.getElementById('time-' + idx).textContent =
    formatTime(elapsed) + ' / ' + formatDuration(durSeconds[idx]);
}

function updateRangeTrack(idx, pct, accent) {
  const range = document.getElementById('range-' + idx);
  range.style.background =
    `linear-gradient(to right, ${accent} ${pct}%, var(--greyF4) ${pct}%)`;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m + ':' + String(s).padStart(2, '0');
}

/* ═══════════════════════════════════════════════
   HEART / FAVOURITE
═══════════════════════════════════════════════ */
function toggleHeart(idx) {
  heartState[idx] = !heartState[idx];
  const btn = document.getElementById('heart-' + idx);
  const icon = document.getElementById('heart-icon-' + idx);
  const accent = CARD_ACCENTS[idx];

  if (heartState[idx]) {
    btn.classList.add('liked');
    icon.setAttribute('fill', accent);
    showToast('<span data-echo-icon="heart"></span> Added to favourites');
  } else {
    btn.classList.remove('liked');
    icon.setAttribute('fill', 'none');
    showToast('Removed from favourites');
  }
}

/* ═══════════════════════════════════════════════
   DOWNLOAD
═══════════════════════════════════════════════ */
function downloadTrack(idx, fmt) {
  const track = outputTracks[idx];
  if (track?.downloadUrl || track?.audioUrl) {
    window.open(track.downloadUrl || track.audioUrl, '_blank');
    showToast('Downloading ' + track.name + '.' + fmt);
  } else {
    showToast('No download is available yet');
  }
}

function downloadSheetPdf(idx, type) {
  const track = outputTracks[idx];
  const url = sheetPdfUrl(track, type);
  if (!url) {
    showToast(sheetLabel(type) + ' PDF is not available yet');
    return;
  }
  window.open(url, '_blank');
  showToast('Downloading ' + sheetLabel(type) + ' PDF');
}

function sheetPdfUrl(track, type) {
  if (!track) return null;
  if (type === 'lyrics') return track.lyricsPdfUrl;
  if (type === 'music') return track.musicSheetPdfUrl;
  if (type === 'chord') return track.chordSheetPdfUrl;
  return null;
}

function sheetLabel(type) {
  if (type === 'lyrics') return 'Lyrics';
  if (type === 'music') return 'Music sheet';
  if (type === 'chord') return 'Chord sheet';
  return 'Sheet';
}

function updateSheetButtons(idx) {
  const track = outputTracks[idx];
  [
    ['lyrics-pdf-' + idx, 'lyrics'],
    ['music-pdf-' + idx, 'music'],
    ['chord-pdf-' + idx, 'chord'],
  ].forEach(([id, type]) => {
    const button = document.getElementById(id);
    if (!button) return;
    const unavailable = !sheetPdfUrl(track, type);
    button.classList.toggle('disabled', unavailable);
    button.title = unavailable ? sheetLabel(type) + ' PDF is not available yet' : 'Download ' + sheetLabel(type) + ' PDF';
  });
}

/* ═══════════════════════════════════════════════
   SAVE TO LIBRARY
═══════════════════════════════════════════════ */
function saveToLibrary(cardIdx) {
  const track = outputTracks[cardIdx];
  if (track) localStorage.setItem('echo_tracks', JSON.stringify(outputTracks));
  window.location.href = '/dashboard';
}

/* ═══════════════════════════════════════════════
   GENERATE MORE
═══════════════════════════════════════════════ */
function generateMore() {
  // Clear pending inspo and go back to dashboard to trigger popup
  localStorage.removeItem('echo_pending_inspo');
  localStorage.setItem('echo_open_create', '1');
  window.location.href = '/dashboard';
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ═══════════════════════════════════════════════
   CARD SELECTION (click anywhere on card)
═══════════════════════════════════════════════ */
(function bindCardSelection() {
  document.querySelectorAll('.output-card').forEach((card, idx) => {
    card.addEventListener('click', function(e) {
      // Don't override button clicks
      if (e.target.closest('button') || e.target.closest('input')) return;
      selectedCard = idx;
      showToast((outputTracks[idx]?.name || 'Generated track') + ' selected');
    });
  });
})();

function durationToSeconds(value) {
  const [minutes, seconds] = String(value || '3:00').split(':').map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}


Object.assign(window, {
  buildInspoPills,
  buildAllTags,
  buildWaveform,
  buildAllWaveforms,
  togglePlay,
  startCard,
  stopCard,
  updateProgressUI,
  onRangeInput,
  updateRangeTrack,
  formatTime,
  toggleHeart,
  downloadTrack,
  downloadSheetPdf,
  saveToLibrary,
  generateMore,
  showToast,
});


