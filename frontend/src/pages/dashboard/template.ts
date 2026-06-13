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
  <span class="nav-page-title">Dashboard</span>

  <div class="nav-right">
    <button class="create-btn" onclick="openCreateInspo()">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1V13M1 7H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Create Inspo</span>
    </button>

    <div class="profile-wrap">
      <button class="profile-avatar" id="profile-avatar-btn" onclick="toggleDropdown(event)">
        <span id="profile-initial">M</span>
      </button>
      <div class="dropdown" id="profile-dropdown">
        <div class="dd-user">
          <div class="dd-avatar" id="dd-avatar">M</div>
          <div>
            <div class="dd-name" id="dd-name">Music Creator</div>
            <div class="dd-email" id="dd-email">creator@echo.app</div>
          </div>
        </div>
        <div class="dd-menu">
          <button class="dd-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/></svg>
            Profile
          </button>
          <button class="dd-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
            Settings
          </button>
          <button class="dd-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Help &amp; Support
          </button>
          <div class="dd-sep"></div>
          <button class="dd-item danger" onclick="handleLogout()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log out
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>

<!-- ══════ MAIN ══════ -->
<main class="main">
  <div class="container">

    <!-- ── EMPTY STATE ─────────────────────────────────── -->
    <div id="empty-state" style="display:none">
      <div class="empty-state">
        <div class="empty-wave" id="empty-wave"></div>
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <h2 class="empty-title">Let's create your first inspo</h2>
        <p class="empty-sub">
          Choose your mood, pick a genre and tempo —<br>
          Echo Echo composes an original track in under 30 seconds.
        </p>
        <button class="empty-create-btn" onclick="openCreateInspo()">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
          <span>Create your first inspo</span>
        </button>
        <div class="empty-steps">
          <div class="empty-step">
            <div class="step-num">1</div>
            <span>Choose mood</span>
          </div>
          <span class="step-arrow">→</span>
          <div class="empty-step">
            <div class="step-num">2</div>
            <span>Pick genre &amp; tempo</span>
          </div>
          <span class="step-arrow">→</span>
          <div class="empty-step">
            <div class="step-num">3</div>
            <span>AI composes</span>
          </div>
          <span class="step-arrow">→</span>
          <div class="empty-step">
            <div class="step-num">4</div>
            <span>Download &amp; use</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── FILLED STATE ────────────────────────────────── -->
    <div id="filled-state" style="display:none">

      <!-- Stats row -->
      <div class="stats-row" id="stats-row">
        <div class="stat-pill">
          <div class="stat-dot"></div>
          <span class="stat-label" id="stat-count">6 tracks</span>
        </div>
        <div class="stat-pill">
          <div class="stat-dot"></div>
          <span class="stat-label" id="stat-dur">21 min total</span>
        </div>
        <div class="stat-pill">
          <div class="stat-dot"></div>
          <span class="stat-label">5 genres</span>
        </div>
      </div>

      <!-- Page header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">My Tracks</h1>
          <p class="page-subtitle">Your generated music library</p>
        </div>
      </div>

      <!-- Filter chips -->
      <div class="filter-row" id="filter-row">
        <button class="filter-chip active" onclick="filterTracks('all',this)">All</button>
        <button class="filter-chip" onclick="filterTracks('lo-fi',this)">Lo-fi</button>
        <button class="filter-chip" onclick="filterTracks('jazz',this)">Jazz</button>
        <button class="filter-chip" onclick="filterTracks('electronic',this)">Electronic</button>
        <button class="filter-chip" onclick="filterTracks('rock',this)">Rock</button>
        <button class="filter-chip" onclick="filterTracks('ambient',this)">Ambient</button>
      </div>

      <!-- Tracks list -->
      <div class="tracks-list" id="tracks-list"></div>

      <!-- Empty after filter -->
      <div id="no-filter-results" style="display:none;text-align:center;padding:3rem 1rem;color:var(--grey71);font-size:.875rem">
        No tracks match this filter. <a href="#" onclick="filterTracks('all',document.querySelector('.filter-chip'));return false" style="color:var(--dark);font-weight:600">Show all</a>
      </div>
    </div>
  </div>
</main>

<!-- Toast -->
<div class="toast" id="toast"></div>

<!-- ══════ CREATE INSPO POPUP ══════ -->
<div class="popup-overlay" id="popup-overlay">
  <div class="popup-card" id="popup-card">

    <!-- Header -->
    <div class="popup-header">
      <div class="popup-top-row">
        <div class="popup-step-meta">
          <div class="popup-dots" id="popup-dots"></div>
          <span class="popup-step-badge" id="popup-step-badge">Step 1 of 8</span>
        </div>
        <button class="popup-close" onclick="closePopup()" title="Close">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="popup-progress">
        <div class="popup-progress-fill" id="progress-fill" style="width:0%"></div>
      </div>
    </div>

    <!-- Body (steps rendered here by JS) -->
    <div class="popup-body" id="popup-body"></div>

    <!-- Footer -->
    <div class="popup-footer">
      <button class="popup-back" id="popup-back-btn" onclick="prevStep()" disabled>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7L9 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back
      </button>
      <button class="popup-next" id="popup-next-btn" onclick="nextStep()">
        <span id="popup-next-text">Next</span>
      </button>
    </div>
  </div>
</div>
`;


