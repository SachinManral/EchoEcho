export const template = `
<!-- ═══════════ NAVBAR (bio.link floating rounded-[40px] pill) ════════ -->
<div class="nav-outer">
  <div class="nav-inner">
    <a class="nav-logo" href="/">
      <div class="nav-logo-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18V5l12-2v13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="6" cy="18" r="3" stroke="white" stroke-width="2"/>
          <circle cx="18" cy="16" r="3" stroke="white" stroke-width="2"/>
        </svg>
      </div>
      <span class="nav-wordmark">echo<em>echo</em></span>
    </a>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#faq">FAQ</a>
    </div>
    <div class="nav-right">
      <a href="/login" class="nav-login">Log in</a>
      <a href="/login?mode=signup" class="nav-signup">Sign up</a>
    </div>
  </div>
</div>

<!-- ═══════════ HERO (text left + 3D flip phone right) ════════════════ -->
<div class="tw-content-anim animate">
  <div class="hero-wrap">
    <div class="hero-left">
      <h1 class="hero-h1">
        Your mood,<br>now with a <span class="gtext">melody</span>
      </h1>
      <h4 class="hero-h4">
        Join thousands of creators using Echo Echo.<br>
        Pick a vibe, set the tempo, and let AI compose<br>
        original copyright-free music in seconds.
      </h4>
      <div style="margin-top:2rem">
        <button class="bl-dark-btn" onclick="handleCTA()" style="width:260px">
          <span>Get started for free</span>
        </button>
      </div>
    </div>

    <!-- bio.link flip-box 3D phone -->
    <div class="hero-right">
      <div class="flip-box" id="hero-flipbox">
        <div class="flip-box-inner" id="flip-inner">
          <!-- Front: player screen -->
          <div class="flip-face front">
            <div class="phone">
              <div class="phone-status"><span>9:41</span><span>●●●</span></div>
              <div class="phone-header">
                <div class="phone-header-lbl">Now Playing</div>
                <div class="phone-header-title">Generated Track - Lo-fi</div>
              </div>
              <div class="phone-body">
                <div class="p-card">
                  <div class="p-card-lbl">Generated Track</div>
                  <div class="p-waverow" id="hero-wave"></div>
                  <div class="p-play">
                    <div class="p-play-dot"><svg viewBox="0 0 10 10"><polygon points="3,2 8,5 3,8"/></svg></div>
                    <div style="flex:1">
                      <div class="p-play-name">Generated Track</div>
                      <div class="p-play-time">2:34 / 3:12</div>
                    </div>
                  </div>
                </div>
                <div class="p-card">
                  <div class="p-card-lbl">Tags</div>
                  <div style="margin-top:.15rem">
                    <span class="p-tag">Lo-fi</span>
                    <span class="p-tag">90 BPM</span>
                    <span class="p-tag">Melancholy</span>
                    <span class="p-tag">Piano</span>
                  </div>
                </div>
                <div class="p-card">
                  <div class="p-card-lbl">Up next</div>
                  <div style="font-size:.75rem;font-weight:700;color:var(--dark)">Generated Track</div>
                  <div style="font-size:.65rem;color:var(--grey71)">Upbeat · Jazz · 120 BPM</div>
                </div>
              </div>
            </div>
          </div>
          <!-- Back: mood selector -->
          <div class="flip-face back">
            <div class="phone-b">
              <div class="phone-b-step">Step 1 of 8</div>
              <div class="phone-b-title">Choose Your Mood</div>
              <div class="mood-grid">
                <div class="mood-chip"><span class="mood-emoji"><span data-echo-icon="calm"></span></span>Calm</div>
                <div class="mood-chip sel"><span class="mood-emoji"><span data-echo-icon="cloudRain"></span></span>Melancholy</div>
                <div class="mood-chip"><span class="mood-emoji"><span data-echo-icon="flame"></span></span>Energetic</div>
                <div class="mood-chip"><span class="mood-emoji"><span data-echo-icon="sparkles"></span></span>Euphoric</div>
                <div class="mood-chip"><span class="mood-emoji"><span data-echo-icon="guitar"></span></span>Rebellious</div>
                <div class="mood-chip"><span class="mood-emoji"><span data-echo-icon="moon"></span></span>Dreamy</div>
              </div>
              <div class="phone-b-next">Next →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════ "LOVED BY MUSICIANS" MARQUEE (bio.link exact) ════════ -->
<div class="loved-section tw-content-anim" style="padding:7rem 0 0">
  <h2 class="loved-h2" style="padding:0 1rem">Loved by music creators</h2>
  <div class="marquee-wrap" style="margin-top:2rem">
    <div class="mfade-l"></div>
    <div class="mfade-r"></div>
    <div class="marquee-track" id="creators-track"></div>
  </div>
</div>

<!-- ═══════════ "COMPOSE IN SECONDS" ═════════════════════════════════ -->
<div class="cta-mid tw-content-anim" style="padding-top:7rem">
  <div style="text-align:center;margin-bottom:1.25rem">
    <span class="sec-label">Compose your page</span>
  </div>
  <h2 class="sec-title" style="text-align:center">
    Create your AI track<br>in minutes
  </h2>
  <h5 style="color:var(--dark);font-weight:400;font-size:1.1rem;margin-top:1rem;text-align:center">
    <span style="color:var(--grey71)">Pick mood, genre, tempo, instruments — and let Echo Echo <br>
    generate a complete original track, ready to download.</span>
  </h5>
  <button class="bl-dark-btn" onclick="handleCTA()" style="width:260px;margin:2rem auto 0;display:flex">
    <span>Get started for free</span>
  </button>
</div>

<!-- ═══════════ APP VIEW SECTION (bio.link: full-viewport) ════════════ -->
<div class="app-view-section tw-content-anim" id="how-it-works">
  <div class="app-view-inner">
    <div style="text-align:center;margin-bottom:1.25rem">
      <span class="sec-label">AI Music Engine</span>
    </div>
    <h2 class="sec-title" style="text-align:center">
      Compose smarter.<br>Sound original.
    </h2>
    <h5 style="color:var(--grey71);font-weight:400;font-size:1.1rem;margin-top:1rem;text-align:center">
      The Echo Echo AI is trained on music theory to guide your creative choices,<br>
      generate tracks, and keep every output unique.
    </h5>
    <button class="bl-dark-btn" onclick="handleCTA()" style="width:260px;margin:2rem auto 0;display:flex">
      <span>Get started for free</span>
    </button>

    <!-- Tab switcher (bio.link exact) -->
    <div class="tab-switcher">
      <div class="tab-indicator" id="app-tab-indicator"></div>
      <button class="tab-btn" onclick="switchAppTab('desktop',this)" id="tab-desktop">Desktop</button>
      <button class="tab-btn" onclick="switchAppTab('mobile',this)" id="tab-mobile">Mobile</button>
    </div>
  </div>

  <!-- Desktop view -->
  <div class="app-view-canvas active" id="view-desktop">
    <div class="app-mock">
      <div class="app-mock-topbar">
        <div class="app-mock-dot" style="background:#ff5f57"></div>
        <div class="app-mock-dot" style="background:#febc2e"></div>
        <div class="app-mock-dot" style="background:#28c840"></div>
        <div class="app-mock-title">Echo Echo — Dashboard</div>
        <div style="font-size:.75rem;color:var(--grey71)">echo.app</div>
      </div>
      <div class="app-mock-body">
        <div class="app-sidebar">
          <div class="app-sidebar-item active"><span data-echo-icon="music"></span> My Tracks</div>
          <div class="app-sidebar-item"><span data-echo-icon="sparkles"></span> Create New</div>
          <div class="app-sidebar-item"><span data-echo-icon="analytics"></span> Analytics</div>
          <div class="app-sidebar-item"><span data-echo-icon="heart"></span> Favourites</div>
          <div class="app-sidebar-item"><span data-echo-icon="synth"></span> Settings</div>
        </div>
        <div class="app-main">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:1rem;font-weight:800;color:var(--dark)">Recent Tracks</div>
            <button class="bl-dark-btn" style="padding:.5rem 1rem;font-size:.8rem"><span>+ Create Inspo</span></button>
          </div>
          <div class="app-track-card">
            <div class="app-track-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
            <div style="flex:1">
              <div class="app-track-name">Generated Track</div>
              <div class="app-track-meta">Lo-fi · Melancholy · 90 BPM · 3:12</div>
              <div class="app-track-bar"><div class="app-track-fill" style="width:55%"></div></div>
            </div>
            <div style="font-size:.75rem;color:var(--grey71)">2:34</div>
          </div>
          <div class="app-track-card">
            <div class="app-track-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
            <div style="flex:1">
              <div class="app-track-name">Generated Track</div>
              <div class="app-track-meta">Jazz · Upbeat · 120 BPM · 2:47</div>
              <div class="app-track-bar"><div class="app-track-fill" style="width:30%"></div></div>
            </div>
            <div style="font-size:.75rem;color:var(--grey71)">0:50</div>
          </div>
          <div class="app-track-card">
            <div class="app-track-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
            <div style="flex:1">
              <div class="app-track-name">Generated Track</div>
              <div class="app-track-meta">Electronic · Dreamy · 110 BPM · 4:01</div>
              <div class="app-track-bar"><div class="app-track-fill" style="width:75%"></div></div>
            </div>
            <div style="font-size:.75rem;color:var(--grey71)">3:00</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile view -->
  <div class="app-view-canvas hidden" id="view-mobile">
    <div class="mob-mock">
      <div class="phone">
        <div class="phone-status"><span>9:41</span><span>●●●</span></div>
        <div class="phone-header" style="padding:1rem">
          <div class="phone-header-lbl">Echo Echo</div>
          <div class="phone-header-title" style="font-size:16px">My Tracks</div>
        </div>
        <div class="phone-body" style="padding:1rem">
          <div class="hist-list">
            <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Lo-fi · 90 BPM</div></div><span class="hist-tag">New</span></div>
            <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Jazz · 120 BPM</div></div><span class="hist-tag" style="background:rgba(192,88,255,.08);color:#c058ff"><span data-echo-icon="heart"></span></span></div>
            <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Electronic · 110 BPM</div></div></div>
          </div>
          <button class="bl-dark-btn" style="width:100%;margin-top:1rem;padding:.75rem;font-size:.9rem">
            <span>+ Create New Inspo</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════ FEATURES BENTO GRID (bio.link exact) ═════════════════ -->
<section class="features-section" id="features">
  <div style="text-align:center;margin-bottom:1.25rem" class="tw-content-anim">
    <span class="sec-label">Features</span>
  </div>
  <h2 class="sec-title tw-content-anim" style="text-align:center">
    Next level features,<br>unmatched sound
  </h2>

  <!-- Grid 1: 3 cols (bio.link exact: h-[440px] rounded-3xl bg-greyF4) -->
  <div class="features-grid-3 tw-content-anim" style="--delay:.2s">

    <!-- Card 1: custom domain equivalent → mood engine + scrolling shots -->
    <div class="f-card">
      <h3>8 parameters for infinite vibes</h3>
      <div class="scroll-shots-wrap">
        <div class="scroll-shots" id="shots-1">
          <div class="shot-item"><div class="shot-inner side"><div class="shot-screen"><div class="shot-header"><div class="shot-header-title">Pick Mood</div><div class="shot-header-sub">Step 1 of 8</div></div><div class="shot-body"><div class="shot-row"><div class="shot-dot"></div><div><div class="shot-text"><span data-echo-icon="calm"></span> Calm</div></div></div><div class="shot-row" style="background:rgba(255,88,88,.07)"><div class="shot-dot"></div><div><div class="shot-text" style="color:#ff5858"><span data-echo-icon="cloudRain"></span> Melancholy</div></div></div></div></div></div></div>
          <div class="shot-item"><div class="shot-inner center"><div class="shot-screen"><div class="shot-header"><div class="shot-header-title">Choose Genre</div><div class="shot-header-sub">Step 2 of 8</div></div><div class="shot-body"><div class="shot-row"><div class="shot-dot"></div><div><div class="shot-text"><span data-echo-icon="piano"></span> Lo-fi Hip Hop</div></div></div><div class="shot-row"><div class="shot-dot"></div><div><div class="shot-text"><span data-echo-icon="jazz"></span> Jazz</div></div></div><div class="shot-row"><div class="shot-dot"></div><div><div class="shot-text"><span data-echo-icon="guitar"></span> Rock</div></div></div></div></div></div></div>
          <div class="shot-item"><div class="shot-inner side"><div class="shot-screen"><div class="shot-header"><div class="shot-header-title">Set Tempo</div><div class="shot-header-sub">Step 6 of 8</div></div><div class="shot-body"><div style="background:#fff;border-radius:8px;padding:.4rem"><div style="font-size:7px;font-weight:700;color:var(--dark)">90 BPM</div><div style="height:3px;background:var(--greyD9);border-radius:2px;margin-top:.3rem"><div style="width:40%;height:100%;background:var(--gradient);border-radius:2px"></div></div></div></div></div></div></div>
          <div class="shot-item"><div class="shot-inner side"><div class="shot-screen"><div class="shot-header"><div class="shot-header-title">Your Prompt</div><div class="shot-header-sub">Step 8 of 8</div></div><div class="shot-body"><div style="background:#fff;border-radius:8px;padding:.4rem;font-size:6.5px;color:var(--grey71);font-style:italic">"rainy evening, warm piano..."</div></div></div></div></div>
          <div class="shot-item"><div class="shot-inner side"><div class="shot-screen"><div class="shot-header" style="background:var(--dark)"><div class="shot-header-title" style="color:#fff">Track Ready <span data-echo-icon="music"></span></div><div class="shot-header-sub">Generated in 28s</div></div><div class="shot-body" style="display:flex;flex-direction:column;gap:.3rem"><div style="background:var(--gradient);border-radius:6px;padding:.3rem;text-align:center;font-size:6.5px;font-weight:700;color:#fff"><span data-echo-icon="play"></span> Play Now</div></div></div></div></div>
        </div>
        <div class="shots-dots" id="dots-1">
          <div class="shot-dot-nav active" onclick="moveShots('shots-1','dots-1',0)"></div>
          <div class="shot-dot-nav" onclick="moveShots('shots-1','dots-1',1)"></div>
          <div class="shot-dot-nav" onclick="moveShots('shots-1','dots-1',2)"></div>
          <div class="shot-dot-nav" onclick="moveShots('shots-1','dots-1',3)"></div>
          <div class="shot-dot-nav" onclick="moveShots('shots-1','dots-1',4)"></div>
        </div>
      </div>
    </div>

    <!-- Card 2: real-time generation + waveform -->
    <div class="f-card">
      <h3>Watch your track come alive in real-time</h3>
      <div class="bento-vis" style="flex-direction:column;gap:.75rem">
        <div class="bento-wave" id="bento-wave"></div>
        <div style="background:var(--dark);border-radius:12px;padding:.625rem 1.25rem;display:flex;align-items:center;gap:.625rem;width:100%">
          <div style="width:26px;height:26px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="white"><polygon points="3,2 8,5 3,8"/></svg>
          </div>
          <div style="flex:1">
            <div style="font-size:.75rem;font-weight:700;color:#fff">Generated Track</div>
            <div style="height:3px;background:rgba(255,255,255,.15);border-radius:2px;margin-top:.35rem"><div style="width:55%;height:100%;background:var(--gradient);border-radius:2px"></div></div>
          </div>
          <div style="font-size:.68rem;color:rgba(255,255,255,.45)">2:34</div>
        </div>
      </div>
    </div>

    <!-- Card 3: track history (= bio.link "stats" card) -->
    <div class="f-card">
      <h3>All your tracks, always ready to play</h3>
      <div class="bento-vis">
        <div class="hist-list">
          <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Lo-fi · 90 BPM · 3:12</div></div><span class="hist-tag">New</span></div>
          <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Jazz · 120 BPM · 2:47</div></div><span class="hist-tag" style="background:rgba(192,88,255,.08);color:#c058ff"><span data-echo-icon="heart"></span></span></div>
          <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Electronic · 110 BPM</div></div></div>
          <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Rock · 140 BPM</div></div></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Grid 2: 5-col (2+3) -->
  <div class="features-grid-5 tw-content-anim" style="--delay:.3s">
    <div class="f-card-wide">
      <h3>Embed in your projects anywhere</h3>
      <div style="color:var(--grey71);font-size:.9rem;margin-top:.5rem;line-height:1.6">
        Download as MP3 or WAV. Use in YouTube, Twitch, podcasts, or games. Every track is 100% copyright-free.
      </div>
      <div class="spectrum" id="spectrum"></div>
    </div>
    <div class="f-card-wide">
      <h3>Create as many compositions as you want</h3>
      <div style="color:var(--grey71);font-size:.9rem;margin-top:.5rem;line-height:1.6">
        Generate unlimited tracks on Pro. Each one is unique — no two tracks are ever the same, even with the same parameters.
      </div>
      <div class="mood-pill-row" style="margin-top:1.25rem">
        <span class="mood-pill"><span data-echo-icon="piano"></span> Lo-fi</span>
        <span class="mood-pill"><span data-echo-icon="jazz"></span> Jazz</span>
        <span class="mood-pill"><span data-echo-icon="guitar"></span> Rock</span>
        <span class="mood-pill"><span data-echo-icon="violin"></span> Classical</span>
        <span class="mood-pill"><span data-echo-icon="waves"></span> Ambient</span>
        <span class="mood-pill"><span data-echo-icon="microphone"></span> Hip-hop</span>
        <span class="mood-pill" style="background:rgba(255,88,88,.07);border-color:rgba(255,88,88,.2);color:#ff5858">+14 more</span>
      </div>
    </div>
  </div>

  <!-- Grid 3: 3 cols (bio.link h-[380px]) -->
  <div class="features-grid-3b tw-content-anim" style="--delay:.4s">
    <div class="f-card-sm">
      <h3>Build a library of your compositions</h3>
      <div class="bento-vis">
        <div class="hist-list">
          <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Lo-fi · 3:12</div></div></div>
          <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Jazz · 2:47</div></div></div>
          <div class="hist-item"><div class="hist-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div><div class="hist-info"><div class="hist-name">Generated Track</div><div class="hist-meta">Electronic · 4:01</div></div></div>
        </div>
      </div>
    </div>
    <div class="f-card-sm">
      <h3>Share your tracks and alert your fans</h3>
      <div style="color:var(--grey71);font-size:.9rem;margin-top:.5rem;line-height:1.6">
        Share a public link to any generated track. Let fans listen, download, and follow your music page for new releases.
      </div>
      <div style="flex:1;display:flex;align-items:flex-end">
        <div style="width:100%;background:var(--greyD9);border-radius:12px;height:4px;position:relative">
          <div style="width:65%;height:100%;background:var(--gradient);border-radius:12px"></div>
        </div>
      </div>
    </div>
    <div class="f-card-sm">
      <h3>Share your QR code anywhere</h3>
      <div style="color:var(--grey71);font-size:.9rem;margin-top:.5rem;line-height:1.6">
        Every track gets a QR code. Print it, post it, or embed it — let anyone scan and instantly listen.
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center">
        <!-- QR code placeholder (CSS) -->
        <div style="width:80px;height:80px;background:var(--dark);border-radius:8px;padding:8px;margin-top:1rem">
          <div style="width:100%;height:100%;display:grid;grid-template-columns:repeat(7,1fr);gap:1px">
            <!-- simplified QR visual -->
          </div>
          <div style="color:#fff;font-size:7px;text-align:center;margin-top:2px;letter-spacing:.05em">SCAN</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════ PRICING (bio.link exact gradient border card) ═════════ -->
<section class="pricing-section tw-content-anim" id="pricing">
  <div style="text-align:center;margin-bottom:1.25rem">
    <span class="sec-label">Pricing</span>
  </div>
  <h1 class="sec-title" style="text-align:center">All features,<br>one simple plan</h1>

  <!-- Monthly/Yearly tab (bio.link exact) -->
  <div class="price-tabs-bg" style="margin:2.5rem auto 0">
    <button class="price-tab" id="tab-monthly" onclick="switchPriceTab('monthly')">Monthly</button>
    <button class="price-tab" id="tab-yearly" onclick="switchPriceTab('yearly')">Yearly (Save 50%)</button>
    <div class="price-tab-indicator" id="price-tab-ind"></div>
  </div>

  <!-- bio.link plan-deatils gradient border -->
  <div class="plan-details">
    <div class="plan-inner">
      <div class="plan-name">
        Pro plan
        <span class="plan-save">Save 50%</span>
      </div>
      <div class="plan-price-row">
        <span class="plan-price" id="plan-price">$4.99</span>
        <span class="plan-period">/mo</span>
      </div>
      <ul class="plan-features">
        <li class="plan-feature">
          <span class="plan-feature-icon"><span data-echo-icon="infinity"></span></span>
          Unlimited track generations
        </li>
        <li class="plan-feature">
          <span class="plan-feature-icon"><span data-echo-icon="music"></span></span>
          AI composes across 20+ genres
        </li>
        <li class="plan-feature">
          <span class="plan-feature-icon"><span data-echo-icon="download"></span></span>
          High-quality MP3 &amp; WAV downloads
        </li>
        <li class="plan-feature">
          <span class="plan-feature-icon"><span data-echo-icon="globe"></span></span>
          100% copyright-free tracks
        </li>
        <li class="plan-feature">
          <span class="plan-feature-icon"><span data-echo-icon="analytics"></span></span>
          Track library &amp; play history
        </li>
      </ul>
      <button class="bl-dark-btn" onclick="handleCTA()" style="width:100%;margin-top:2rem;padding:1rem">
        <span>Try for free →</span>
      </button>
    </div>
  </div>
</section>

<!-- ═══════════ COMPARE (bio.link "All you need, one place") ══════════ -->
<section class="compare-section tw-content-anim">
  <div style="margin-bottom:1.25rem"><span class="sec-label">Compare</span></div>
  <h1 class="sec-title">All you need, in one place</h1>
  <h5 style="color:var(--grey71);font-weight:400;font-size:1.1rem;margin-top:.75rem">Why juggle apps when one does it all?</h5>

  <div class="compare-wrap">
    <!-- top dashed line -->
    <svg width="100%" height="2" style="display:block"><line x1="0" y1="1" x2="100%" y2="1" stroke="black" stroke-opacity=".1" stroke-width="2" stroke-dasharray="8 8"/></svg>

    <div class="compare-list" style="margin-top:1.25rem">
      <div class="compare-row">
        <div class="compare-left"><div class="compare-icon"><span data-echo-icon="piano"></span></div><div><div class="compare-name">Music generation tools</div><div class="compare-sub">Replaces Suno, Udio, Mubert</div></div></div>
        <div class="compare-price">$20</div>
      </div>
      <div class="compare-row">
        <div class="compare-left"><div class="compare-icon"><span data-echo-icon="folder"></span></div><div><div class="compare-name">Cloud storage for audio</div><div class="compare-sub">Replaces Dropbox, SoundCloud</div></div></div>
        <div class="compare-price">$10</div>
      </div>
      <div class="compare-row">
        <div class="compare-left"><div class="compare-icon"><span data-echo-icon="analytics"></span></div><div><div class="compare-name">Music analytics platform</div><div class="compare-sub">Replaces Chartmetric, Soundcharts</div></div></div>
        <div class="compare-price">$15</div>
      </div>
      <div class="compare-row">
        <div class="compare-left"><div class="compare-icon"><span data-echo-icon="globe"></span></div><div><div class="compare-name">Music licensing service</div><div class="compare-sub">Replaces Musicbed, Artlist</div></div></div>
        <div class="compare-price">$16</div>
      </div>
      <div class="compare-row">
        <div class="compare-left"><div class="compare-icon"><span data-echo-icon="link"></span></div><div><div class="compare-name">Creator link-in-bio page</div><div class="compare-sub">Replaces Linktree, Beacons</div></div></div>
        <div class="compare-price">$15</div>
      </div>
    </div>

    <svg width="100%" height="2" style="display:block;margin-top:1.25rem"><line x1="0" y1="1" x2="100%" y2="1" stroke="black" stroke-opacity=".1" stroke-width="2" stroke-dasharray="8 8"/></svg>

    <div class="compare-total-row">
      <div style="display:flex;align-items:center;gap:.75rem">
        <div style="width:28px;height:28px;border-radius:8px;background:var(--greyF4);display:flex;align-items:center;justify-content:center;opacity:.6"><span data-echo-icon="music"></span></div>
        <div style="color:var(--grey71)">What you'd spend otherwise</div>
      </div>
      <div class="strikethrough">$76/mo</div>
    </div>
    <div class="compare-total-row" style="margin-top:.75rem">
      <div style="display:flex;align-items:center;gap:.75rem">
        <div style="font-size:1rem;font-weight:800;color:var(--dark)">echo<em style="font-style:normal;background:var(--gradient-text);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">echo</em></div>
        <div style="color:var(--dark)">Get everything with Echo Echo</div>
      </div>
      <div class="ours-price">$4.99/mo</div>
    </div>

    <button class="bl-dark-btn" onclick="handleCTA()" style="width:80%;margin:1.5rem auto 0;display:flex;justify-content:center">
      <span>Start my free trial →</span>
    </button>
  </div>
</section>

<!-- ═══════════ FAQ (bio.link exact accordion) ════════════════════════ -->
<section class="faq-section tw-content-anim" id="faq">
  <div style="text-align:center;margin-bottom:1.25rem"><span class="sec-label">FAQ</span></div>
  <h1 class="sec-title" style="text-align:center">Got questions?</h1>
  <div class="faq-list">
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-header">
        <h3 class="faq-q">How does Echo Echo generate music?</h3>
        <svg class="faq-arrow" width="12" height="9" viewBox="0 0 16 9" fill="none"><path d="M1 1L8 8L15 1" stroke="#0D0C22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="faq-body"><p>Echo Echo uses a fine-tuned MusicGen AI model. You provide parameters — mood, genre, tempo, instruments — plus an optional text prompt. The model composes an original audio track matching your description in under 30 seconds.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-header">
        <h3 class="faq-q">Are the generated tracks copyright-free?</h3>
        <svg class="faq-arrow" width="12" height="9" viewBox="0 0 16 9" fill="none"><path d="M1 1L8 8L15 1" stroke="#0D0C22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="faq-body"><p>Yes. Every track generated by Echo Echo is 100% original and copyright-free. Use them in YouTube videos, Twitch streams, podcasts, or any commercial project without licensing issues.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-header">
        <h3 class="faq-q">Do I need any music knowledge to use Echo Echo?</h3>
        <svg class="faq-arrow" width="12" height="9" viewBox="0 0 16 9" fill="none"><path d="M1 1L8 8L15 1" stroke="#0D0C22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="faq-body"><p>None at all. The step-by-step mood flow guides you through every parameter with simple choices and animated icons. If you know how you want to feel, Echo Echo handles the rest.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-header">
        <h3 class="faq-q">How many tracks can I generate for free?</h3>
        <svg class="faq-arrow" width="12" height="9" viewBox="0 0 16 9" fill="none"><path d="M1 1L8 8L15 1" stroke="#0D0C22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="faq-body"><p>The free plan includes 5 track generations per month. The Pro plan offers unlimited generations, priority queue, and higher audio quality exports.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-header">
        <h3 class="faq-q">How do creators typically use Echo Echo?</h3>
        <svg class="faq-arrow" width="12" height="9" viewBox="0 0 16 9" fill="none"><path d="M1 1L8 8L15 1" stroke="#0D0C22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="faq-body"><p>YouTubers use it for background music. Podcasters score their intros. Indie developers soundtrack their games. Streamers set the vibe for each session. Wherever you need original audio without a music degree, Echo Echo fits in.</p></div>
    </div>
    <div class="faq-item" onclick="toggleFaq(this)">
      <div class="faq-header">
        <h3 class="faq-q">Can I download and use the tracks commercially?</h3>
        <svg class="faq-arrow" width="12" height="9" viewBox="0 0 16 9" fill="none"><path d="M1 1L8 8L15 1" stroke="#0D0C22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="faq-body"><p>Yes. Every track can be downloaded as MP3 or WAV from your library. Pro plan users own full commercial rights to every track they generate.</p></div>
    </div>
  </div>
</section>

<!-- ═══════════ FOOTER (bio.link exact structure) ════════════════════ -->
<div style="max-width:1100px;margin:5rem auto 0;padding:0 2.5rem">
  <!-- gradient wave SVG divider (bio.link) -->
  <svg width="100%" height="8" viewBox="0 0 1101 8" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:.4">
    <path d="M0 7C5.68 7 8.58 5.05 11.13 3.35C13.44 1.82 15.26 0.61 19.16 0.61C23.05 0.61 24.87 1.82 27.18 3.35C29.73 5.05 32.63 7 38.31 7" stroke="url(#wg1)" stroke-width="1.5"/>
    <path d="M38.31 7C44 7 46.89 5.05 49.45 3.35C51.75 1.82 53.57 0.61 57.47 0.61C61.36 0.61 63.18 1.82 65.49 3.35C68.04 5.05 70.94 7 76.62 7C82.31 7 85.2 5.05 87.76 3.35C90.07 1.82 91.89 0.61 95.78 0.61C99.68 0.61 101.5 1.82 103.8 3.35C106.36 5.05 109.25 7 114.94 7" stroke="url(#wg2)" stroke-width="1.5"/>
    <path d="M114.94 7C120.62 7 123.52 5.05 126.07 3.35C128.38 1.82 130.2 0.61 134.1 0.61C137.99 0.61 139.81 1.82 142.12 3.35C144.67 5.05 147.57 7 153.26 7C158.95 7 161.85 5.05 164.4 3.35C166.71 1.82 168.53 0.61 172.42 0.61" stroke="url(#wg3)" stroke-width="1.5"/>
    <defs>
      <linearGradient id="wg1" x1="0" y1="4" x2="8" y2="-4" gradientUnits="userSpaceOnUse"><stop stop-color="#FF5858"/><stop offset="1" stop-color="#C058FF"/></linearGradient>
      <linearGradient id="wg2" x1="38" y1="4" x2="46" y2="-4" gradientUnits="userSpaceOnUse"><stop stop-color="#FF5858"/><stop offset="1" stop-color="#C058FF"/></linearGradient>
      <linearGradient id="wg3" x1="115" y1="4" x2="123" y2="-4" gradientUnits="userSpaceOnUse"><stop stop-color="#FF5858"/><stop offset="1" stop-color="#C058FF"/></linearGradient>
    </defs>
  </svg>

  <div style="margin-top:3rem;padding-bottom:2rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:2rem;align-items:flex-start">
    <div>
      <!-- App store badges (bio.link style) -->
      <div style="display:flex;align-items:center;gap:.5rem">
        <a href="#" class="footer-app-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          Google Play
        </a>
        <a href="#" class="footer-app-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/></svg>
          App Store
        </a>
      </div>
      <div class="footer-nav-links" style="margin-top:2rem">
        <a href="#features">Features</a>
        <a href="#faq">FAQ</a>
        <a href="#">Help</a>
        <a href="#">Terms of Use</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    <div class="footer-socials">
      <a href="#" title="Twitter">?</a>
      <a href="#" title="Instagram"><span data-echo-icon="camera"></span></a>
      <a href="#" title="YouTube"><span data-echo-icon="play"></span></a>
      <a href="#" title="TikTok">♪</a>
    </div>
  </div>

  <div class="footer-bottom">
    <span class="footer-copy">© 2025 Echo Echo. All rights reserved.</span>
    <span class="footer-copy">Made with <span data-echo-icon="heart"></span> for music lovers</span>
  </div>
</div>
`;




