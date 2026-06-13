export const template = `
<!-- ══════ NAV ══════ -->
<nav class="nav">
  <a href="/" class="nav-logo">
    <div class="nav-logo-icon">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 18V5l12-2v13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="6" cy="18" r="3" stroke="white" stroke-width="2"/>
        <circle cx="18" cy="16" r="3" stroke="white" stroke-width="2"/>
      </svg>
    </div>
    <span class="nav-wordmark">echo<em>echo</em></span>
  </a>
  <div class="nav-divider"></div>
  <a href="/dashboard" class="nav-back">
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M9 11.5L5 7.5L9 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Back to Dashboard
  </a>
</nav>

<!-- ══════ MAIN ══════ -->
<main class="main">
  <div class="container">

    <!-- ── PAGE HEADER ───────────────────────────────── -->
    <div class="page-header">
      <div class="success-badge">✦ Generated</div>
      <h1 class="page-headline">Your tracks are ready</h1>
      <p class="page-sub">Generated from your inspo</p>
      <div class="inspo-pills" id="inspo-pills">
        <!-- populated by JS -->
      </div>
    </div>

    <!-- ── CARDS GRID ─────────────────────────────────── -->
    <div class="cards-grid" id="cards-grid">
      <!-- Card 1: Best Match (gradient border wrapper) -->
      <div class="best-match-wrap" style="animation-delay:.05s">
        <div class="output-card" id="card-0" data-idx="0">
          <div class="card-cover" id="cover-0"
               style="background: linear-gradient(135deg, rgba(255,88,88,.13), rgba(255,88,88,.28))">
            <div class="waveform" id="wave-0"></div>
            <div class="cover-dur" id="dur-0">0:00</div>
            <div class="best-badge">Best Match ✦</div>
          </div>

          <div class="card-body">
            <div class="card-name">Generated track</div>
            <div class="card-tags" id="tags-0"></div>
            <div class="card-dur-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span id="dur-label-0">0:00</span>
            </div>
          </div>

          <div class="playback-bar">
            <button class="play-btn" id="play-0" onclick="togglePlay(0)" title="Play">
              <svg id="play-icon-0" width="13" height="13" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </button>
            <div class="progress-wrap">
              <input type="range" class="progress-range" id="range-0"
                     min="0" max="100" value="0"
                     oninput="onRangeInput(0, this)"
                     style="background: var(--greyF4)"/>
            </div>
            <div class="time-display" id="time-0">0:00 / 0:00</div>
          </div>

          <div class="action-row">
            <button class="dl-btn" onclick="downloadTrack(0,'mp3')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              MP3
            </button>
            <button class="dl-btn" onclick="downloadTrack(0,'wav')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              WAV
            </button>
            <button class="heart-btn" id="heart-0" onclick="toggleHeart(0)" title="Favourite">
              <svg viewBox="0 0 24 24" fill="none" stroke="#ff5858" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="heart-icon-0">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div class="sheet-download-row">
            <button class="sheet-dl-btn" id="lyrics-pdf-0" onclick="downloadSheetPdf(0,'lyrics')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="14" y2="17"/>
              </svg>
              Lyrics PDF
            </button>
            <button class="sheet-dl-btn" id="music-pdf-0" onclick="downloadSheetPdf(0,'music')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M9 18V11l6-1v7"/>
                <circle cx="8" cy="18" r="1"/>
                <circle cx="14" cy="17" r="1"/>
              </svg>
              Music PDF
            </button>
            <button class="sheet-dl-btn" id="chord-pdf-0" onclick="downloadSheetPdf(0,'chord')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M8 13h8M8 17h8M8 9h3"/>
              </svg>
              Chord PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: Atmospheric -->
      <div class="output-card" id="card-1" data-idx="1" style="animation-delay:.1s">
        <div class="card-cover" id="cover-1"
             style="background: linear-gradient(135deg, rgba(192,88,255,.13), rgba(192,88,255,.28))">
          <div class="waveform" id="wave-1"></div>
          <div class="cover-dur" id="dur-1">0:00</div>
        </div>

        <div class="card-body">
          <div class="card-name">Generated track</div>
          <div class="card-tags" id="tags-1"></div>
          <div class="card-dur-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span id="dur-label-1">0:00</span>
          </div>
        </div>

        <div class="playback-bar">
          <button class="play-btn" id="play-1" onclick="togglePlay(1)" title="Play">
            <svg id="play-icon-1" width="13" height="13" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </button>
          <div class="progress-wrap">
            <input type="range" class="progress-range" id="range-1"
                   min="0" max="100" value="0"
                   oninput="onRangeInput(1, this)"
                   style="background: var(--greyF4)"/>
          </div>
          <div class="time-display" id="time-1">0:00 / 0:00</div>
        </div>

        <div class="action-row">
          <button class="dl-btn" onclick="downloadTrack(1,'mp3')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            MP3
          </button>
          <button class="dl-btn" onclick="downloadTrack(1,'wav')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            WAV
          </button>
          <button class="heart-btn" id="heart-1" onclick="toggleHeart(1)" title="Favourite">
            <svg viewBox="0 0 24 24" fill="none" stroke="#c058ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="heart-icon-1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Card 3: Upbeat -->
      <div class="output-card" id="card-2" data-idx="2" style="animation-delay:.15s">
        <div class="card-cover" id="cover-2"
             style="background: linear-gradient(135deg, rgba(61,158,255,.13), rgba(61,158,255,.28))">
          <div class="waveform" id="wave-2"></div>
          <div class="cover-dur" id="dur-2">0:00</div>
        </div>

        <div class="card-body">
          <div class="card-name">Generated track</div>
          <div class="card-tags" id="tags-2"></div>
          <div class="card-dur-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span id="dur-label-2">0:00</span>
          </div>
        </div>

        <div class="playback-bar">
          <button class="play-btn" id="play-2" onclick="togglePlay(2)" title="Play">
            <svg id="play-icon-2" width="13" height="13" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </button>
          <div class="progress-wrap">
            <input type="range" class="progress-range" id="range-2"
                   min="0" max="100" value="0"
                   oninput="onRangeInput(2, this)"
                   style="background: var(--greyF4)"/>
          </div>
          <div class="time-display" id="time-2">0:00 / 0:00</div>
        </div>

        <div class="action-row">
          <button class="dl-btn" onclick="downloadTrack(2,'mp3')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            MP3
          </button>
          <button class="dl-btn" onclick="downloadTrack(2,'wav')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            WAV
          </button>
          <button class="heart-btn" id="heart-2" onclick="toggleHeart(2)" title="Favourite">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3d9eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="heart-icon-2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Card 4: Raw -->
      <div class="output-card" id="card-3" data-idx="3" style="animation-delay:.2s">
        <div class="card-cover" id="cover-3"
             style="background: linear-gradient(135deg, rgba(247,183,49,.13), rgba(247,183,49,.28))">
          <div class="waveform" id="wave-3"></div>
          <div class="cover-dur" id="dur-3">0:00</div>
        </div>

        <div class="card-body">
          <div class="card-name">Generated track</div>
          <div class="card-tags" id="tags-3"></div>
          <div class="card-dur-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span id="dur-label-3">0:00</span>
          </div>
        </div>

        <div class="playback-bar">
          <button class="play-btn" id="play-3" onclick="togglePlay(3)" title="Play">
            <svg id="play-icon-3" width="13" height="13" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </button>
          <div class="progress-wrap">
            <input type="range" class="progress-range" id="range-3"
                   min="0" max="100" value="0"
                   oninput="onRangeInput(3, this)"
                   style="background: var(--greyF4)"/>
          </div>
          <div class="time-display" id="time-3">0:00 / 0:00</div>
        </div>

        <div class="action-row">
          <button class="dl-btn" onclick="downloadTrack(3,'mp3')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            MP3
          </button>
          <button class="dl-btn" onclick="downloadTrack(3,'wav')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            WAV
          </button>
          <button class="heart-btn" id="heart-3" onclick="toggleHeart(3)" title="Favourite">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f7b731" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="heart-icon-3">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </div><!-- /cards-grid -->

    <!-- ── BOTTOM CTA ─────────────────────────────────── -->
    <div class="cta-section">
      <h2 class="cta-heading">Love one of these?</h2>
      <p class="cta-sub">Pick the version that hits right, or go again for a fresh batch.</p>
      <div class="cta-buttons">
        <button class="bl-dark-btn" onclick="saveToLibrary(selectedCard)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          <span>Save to Library</span>
        </button>
        <button class="outlined-btn" onclick="generateMore()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
          Generate More
        </button>
      </div>
      <p class="cta-fine">All tracks are copyright-free. Download and use anywhere.</p>
    </div>

  </div>
</main>

<!-- Toast -->
<div class="toast" id="toast"></div>
`;



