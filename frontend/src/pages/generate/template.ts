export const template = `
<!-- ── Nav ──────────────────────────────────────────────── -->
<nav class="nav">
  <a class="nav-logo" href="/dashboard">
    <div class="nav-logo-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    </div>
    <span class="nav-wordmark">Echo<em>Echo</em></span>
  </a>

  <div class="nav-divider"></div>
  <a class="nav-back" href="/dashboard">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 12H5m7-7-7 7 7 7"/>
    </svg>
    Dashboard
  </a>

  <div class="nav-right">
    <a class="skip-link" href="/output" id="nav-skip-link">Skip preview →</a>
  </div>
</nav>

<!-- ── Page ──────────────────────────────────────────────── -->
<main class="page">
  <div class="container">

    <!-- 1. Inspo Pills Row -->
    <div class="pills-row" id="pills-row">
      <!-- populated by JS -->
    </div>

    <!-- 2. Animated Stage -->
    <div class="stage">

      <!-- Orbit rings (decorative) -->
      <div class="orbit-ring orbit-ring-1"></div>
      <div class="orbit-ring orbit-ring-2"></div>
      <div class="orbit-ring orbit-ring-3"></div>

      <!-- Orbiting dots -->
      <div class="orbit-wrap orbit-wrap-1">
        <div class="orbit-dot orbit-dot-1"></div>
      </div>
      <div class="orbit-wrap orbit-wrap-2">
        <div class="orbit-dot orbit-dot-2"></div>
      </div>
      <div class="orbit-wrap orbit-wrap-3">
        <div class="orbit-dot orbit-dot-3"></div>
      </div>
      <div class="orbit-wrap orbit-wrap-4">
        <div class="orbit-dot orbit-dot-4"></div>
      </div>

      <!-- Central orb -->
      <div class="orb">
        <div class="orb-inner"></div>
        <div class="orb-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
      </div>

      <!-- Waveform bars -->
      <div class="waveform" id="waveform"></div>
    </div>

    <!-- 3. Status text -->
    <div class="status-block">
      <div class="status-headline-wrap">
        <div class="status-headline" id="status-headline">Tuning your melody...</div>
      </div>
      <p class="status-sub">Your track will be ready soon...</p>
      <div class="status-timer" id="status-timer">0:00</div>
    </div>

    <!-- 4. Generation steps -->
    <div class="steps" id="steps-list">
      <!-- populated by JS -->
    </div>

    <!-- 5. Skip footer -->
    <div class="skip-footer">
      <a href="/output">Skip preview and go to output →</a>
    </div>

  </div>
</main>
`;


