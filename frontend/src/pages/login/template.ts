export const template = `
<div class="page">

  <!-- ══════ LEFT PANEL ══════ -->
  <div class="left-panel">
    <div class="left-glow"></div>

    <a href="/" class="left-logo">
      <div class="left-logo-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l12-2v13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="6" cy="18" r="3" stroke="white" stroke-width="2"/>
          <circle cx="18" cy="16" r="3" stroke="white" stroke-width="2"/>
        </svg>
      </div>
      <span class="left-wordmark">echo<em>echo</em></span>
    </a>

    <div class="left-body">
      <div style="padding-right:200px">
        <p style="font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.875rem">AI Music Composition</p>
        <h2 class="left-tagline">
          Your mood,<br>now with a <span class="g">melody</span>
        </h2>
        <p class="left-sub">
          Join thousands of creators composing copyright-free original music in seconds.
        </p>
        <div class="left-chips">
          <span class="left-chip"><span data-echo-icon="piano"></span> 20+ Genres</span>
          <span class="left-chip"><span data-echo-icon="zap"></span> Under 30s</span>
          <span class="left-chip"><span data-echo-icon="globe"></span> Copyright-Free</span>
          <span class="left-chip"><span data-echo-icon="music"></span> MP3 + WAV</span>
        </div>

        <!-- mini waveform -->
        <div class="left-wave" id="left-wave"></div>
      </div>
    </div>

    <!-- Vertical scrolling mood cards -->
    <div class="left-cards-wrap">
      <div class="left-cards-track" id="left-cards"></div>
    </div>
  </div>

  <!-- ══════ RIGHT PANEL ══════ -->
  <div class="right-panel">
    <a href="/" class="back-link">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Back to home
    </a>

    <div class="auth-card">
      <!-- Logo mark -->
      <div class="auth-card-logo">
        <div class="auth-card-logo-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18V5l12-2v13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="6" cy="18" r="3" stroke="white" stroke-width="2"/>
            <circle cx="18" cy="16" r="3" stroke="white" stroke-width="2"/>
          </svg>
        </div>
        <span class="auth-card-wordmark">echo<em>echo</em></span>
      </div>

      <!-- Tab toggle (bio.link exact) -->
      <div class="auth-tabs" role="tablist">
        <div class="auth-tab-indicator" id="auth-tab-ind"></div>
        <button class="auth-tab" id="tab-login" onclick="switchAuthTab('login')" role="tab">Log in</button>
        <button class="auth-tab" id="tab-signup" onclick="switchAuthTab('signup')" role="tab">Sign up</button>
      </div>

      <!-- Heading -->
      <h1 class="auth-heading" id="auth-heading">Welcome back</h1>
      <p class="auth-sub" id="auth-sub">Sign in to your Echo Echo account</p>

      <!-- Error / success -->
      <div class="auth-msg" id="auth-msg"></div>

      <!-- Google -->
      <button class="social-btn btn-google" onclick="handleGoogle()">
        <!-- Google SVG icon -->
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
          <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
          <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
          <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <!-- Apple -->
      <button class="social-btn btn-apple" onclick="handleApple()">
        <!-- Apple SVG icon -->
        <svg width="17" height="20" viewBox="0 0 17 20" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.9985 10.5573C13.9852 8.47344 15.0492 7.27083 17.1904 6.5625C16.0071 4.89844 14.223 3.97917 11.8716 3.80729C9.65035 3.63802 7.20816 5.07292 6.28329 5.07292C5.31063 5.07292 3.14648 3.86719 1.45184 3.86719C-1.35254 3.91406 -4.5 6.08073 -4.5 10.4948C-4.5 11.776 -4.2674 13.099 3.8054e-08 14.5677C3.43879 16.7135 6.00001 20 8.09521 20C10.1904 20 10.7143 18.7552 13.2262 18.7552C15.7381 18.7552 16.1429 19.9479 18.2857 19.9479C20.4286 19.9479 22 18.0729 23.8095 15.5729C25.2857 13.5 25.9524 11.5104 26 11.4323C25.3333 11.151 13.9985 10.5573 13.9985 10.5573Z"/>
          <path d="M12 0C10.5152 0.140625 8.78788 1.09375 7.81818 2.32292C6.96970 3.4375 6.24242 5.14583 6.5 6.625C8.11616 6.71875 9.77273 5.72917 10.6970 4.48958C11.5707 3.35417 12.2172 1.65625 12 0Z"/>
        </svg>
        Continue with Apple
      </button>

      <!-- Divider -->
      <div class="auth-divider">
        <div class="auth-divider-line"></div>
        <span class="auth-divider-text">or continue with email</span>
        <div class="auth-divider-line"></div>
      </div>

      <!-- ── Login form ─────────────────────────────────── -->
      <form id="auth-form" onsubmit="handleSubmit(event)">

        <!-- Name row (signup only) -->
        <div class="signup-only name-row" id="name-row">
          <div class="input-group" style="margin-bottom:0">
            <label class="input-label" for="first-name">First name</label>
            <input class="auth-input" type="text" id="first-name" placeholder="Alex" autocomplete="given-name"/>
          </div>
          <div class="input-group" style="margin-bottom:0">
            <label class="input-label" for="last-name">Last name</label>
            <input class="auth-input" type="text" id="last-name" placeholder="Rivera" autocomplete="family-name"/>
          </div>
        </div>
        <div class="signup-only" style="height:.875rem"></div>

        <!-- Email -->
        <div class="input-group">
          <label class="input-label" for="email">Email address</label>
          <input class="auth-input" type="email" id="email" placeholder="you@example.com" autocomplete="email" required/>
        </div>

        <!-- Password -->
        <div class="input-group">
          <label class="input-label" for="password">Password</label>
          <div class="pw-wrap">
            <input class="auth-input" type="password" id="password" placeholder="••••••••" autocomplete="current-password" required style="padding-right:3rem"/>
            <button type="button" class="pw-toggle" onclick="togglePw('password','pw-eye')">
              <svg id="pw-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm password (signup only) -->
        <div class="signup-only input-group" id="confirm-group">
          <label class="input-label" for="confirm-pw">Confirm password</label>
          <div class="pw-wrap">
            <input class="auth-input" type="password" id="confirm-pw" placeholder="••••••••" style="padding-right:3rem"/>
            <button type="button" class="pw-toggle" onclick="togglePw('confirm-pw','confirm-eye')">
              <svg id="confirm-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Forgot (login only) -->
        <div class="forgot-row login-only" id="forgot-row">
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>

        <!-- Submit -->
        <button type="submit" class="bl-dark-btn" id="submit-btn">
          <span id="submit-text">Log in</span>
        </button>
      </form>

      <!-- Terms -->
      <p class="auth-terms">
        By continuing, you agree to Echo Echo's
        <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
      </p>

      <!-- Toggle footer -->
      <p class="auth-toggle-footer" id="toggle-footer">
        Don't have an account? <a href="#" onclick="switchAuthTab('signup');return false">Sign up free</a>
      </p>
    </div>
  </div>
</div>
`;



