const form = document.querySelector("#generator-form");
const generateButton = document.querySelector("#generate-button");
const energy = document.querySelector("#energy");
const tempo = document.querySelector("#tempo");
const energyValue = document.querySelector("#energy-value");
const tempoValue = document.querySelector("#tempo-value");
const progressLabel = document.querySelector("#progress-label");
const progressPercent = document.querySelector("#progress-percent");
const progressFill = document.querySelector("#progress-fill");
const elapsedTime = document.querySelector("#elapsed-time");
const remainingTime = document.querySelector("#remaining-time");
const errorMessage = document.querySelector("#error-message");
const result = document.querySelector("#result");
const library = document.querySelector("#library");
const refreshHistory = document.querySelector("#refresh-history");

const API_BASE =
  window.ECHOECHO_API_BASE ||
  (window.location.protocol === "file:" ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname) && window.location.port && window.location.port !== "8000")
    ? "http://127.0.0.1:8000"
    : "");

const steps = [
  { label: "Building prompt...", progress: 8, seconds: 3 },
  { label: "Submitting to Suno...", progress: 18, seconds: 10 },
  { label: "Generating song...", progress: 72, seconds: 110 },
  { label: "Downloading audio...", progress: 84, seconds: 16 },
  { label: "Saving original MP3...", progress: 97, seconds: 6 },
];

let timer = null;
let startedAt = null;
let estimatedTotal = steps.reduce((sum, step) => sum + step.seconds, 0);

function fmt(seconds) {
  const value = Math.max(0, Math.round(seconds));
  if (value < 60) return `${value}s`;
  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  return `${minutes}m ${rest}s`;
}

function setProgress(label, percent, elapsed, remaining) {
  progressLabel.textContent = label;
  progressPercent.textContent = `${Math.round(percent)}%`;
  progressFill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  elapsedTime.textContent = fmt(elapsed);
  remainingTime.textContent = fmt(remaining);
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    throw new Error(body?.detail || body?.message || `Request failed with ${response.status}`);
  }
  return body;
}

function startProgress() {
  startedAt = Date.now();
  clearInterval(timer);
  timer = setInterval(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    const ratio = Math.min(0.96, elapsed / estimatedTotal);
    const percent = Math.max(1, ratio * 97);
    let active = steps[0];
    let passed = 0;
    for (const step of steps) {
      passed += step.seconds;
      if (elapsed <= passed) {
        active = step;
        break;
      }
    }
    setProgress(active.label, percent, elapsed, estimatedTotal - elapsed);
  }, 1000);
  setProgress("Building prompt...", 3, 0, estimatedTotal);
}

function completeProgress() {
  clearInterval(timer);
  const elapsed = startedAt ? (Date.now() - startedAt) / 1000 : 0;
  setProgress("Completed.", 100, elapsed, 0);
}

function stopProgressWithError(message) {
  clearInterval(timer);
  const elapsed = startedAt ? (Date.now() - startedAt) / 1000 : 0;
  setProgress("Stopped.", Number(progressFill.style.width.replace("%", "")) || 0, elapsed, 0);
  errorMessage.textContent = message;
}

function updateSliderLabels() {
  energyValue.textContent = energy.value;
  tempoValue.textContent = `${tempo.value} BPM`;
}

function payloadFromForm() {
  const data = new FormData(form);
  return {
    mood: data.get("mood"),
    theme: data.get("theme"),
    style: data.get("style"),
    instruments: data.getAll("instruments"),
    tempo: Number(data.get("tempo")),
    energy: Number(data.get("energy")),
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dateLabel(value) {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function copySongId(songId) {
  await navigator.clipboard.writeText(songId);
}

async function createTrim(code, button) {
  const previous = button.textContent;
  button.disabled = true;
  button.textContent = "Creating trimmed version...";
  errorMessage.textContent = "";
  try {
    const data = await apiFetch(`/api/library/${encodeURIComponent(code)}/trim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration_seconds: 30, force: false }),
    });
    result.innerHTML = resultCard(data.song);
    await loadHistory();
  } catch (error) {
    errorMessage.textContent = error.message || "Could not create trimmed version.";
  } finally {
    button.disabled = false;
    button.textContent = previous;
  }
}

function audioBlock(song, kind) {
  const isTrimmed = kind === "trimmed";
  const audioUrl = isTrimmed ? song.trimmed_audio_url : song.original_audio_url;
  const downloadUrl = isTrimmed ? song.trimmed_download_url : song.original_download_url;
  const label = isTrimmed ? "Trimmed 30s" : "Original MP3";
  if (!audioUrl) return "";
  return `
    <div class="audio-block">
      <span>${label}</span>
      <audio controls src="${escapeHtml(audioUrl)}" type="audio/mpeg"></audio>
      <a class="download-link" href="${escapeHtml(downloadUrl)}">${isTrimmed ? "Download Trimmed" : "Download Original"}</a>
    </div>
  `;
}

function trimButton(song) {
  if (song.trimmed_audio_url) return "";
  return `<button type="button" data-trim="${escapeHtml(song.code || song.song_id)}">Create 30s Trim</button>`;
}

function resultCard(song) {
  const instruments = song.instruments?.length ? song.instruments.join(", ") : "None";
  const taskId = song.task_id || "Pending";
  const code = song.code || song.song_id;
  return `
    <article class="result-card">
      <div class="card-head">
        <div>
          <h3>${escapeHtml(code)}</h3>
          <p class="tagline">${escapeHtml(song.mood)} / ${escapeHtml(song.theme)} / ${escapeHtml(song.style)}</p>
        </div>
      </div>
      <div class="meta-grid">
        <div class="meta"><span>Mood</span>${escapeHtml(song.mood)}</div>
        <div class="meta"><span>Theme</span>${escapeHtml(song.theme)}</div>
        <div class="meta"><span>Style</span>${escapeHtml(song.style)}</div>
        <div class="meta"><span>Instruments</span>${escapeHtml(instruments)}</div>
        <div class="meta"><span>KieAI Task</span>${escapeHtml(taskId)}</div>
      </div>
      ${audioBlock(song, "original")}
      ${audioBlock(song, "trimmed")}
      <div class="card-actions">
        ${trimButton(song)}
        <button type="button" data-copy="${escapeHtml(code)}">Copy Code</button>
      </div>
      <details>
        <summary>Advanced Details</summary>
        <pre>${escapeHtml(song.prompt)}</pre>
      </details>
    </article>
  `;
}

function libraryCard(song) {
  const taskId = song.task_id ? `<span>Task ${escapeHtml(song.task_id)}</span>` : "";
  const code = song.code || song.song_id;
  return `
    <article class="song-card">
      <div class="card-head">
        <h3>${escapeHtml(code)}</h3>
        <span class="song-date">${dateLabel(song.created_at)}</span>
      </div>
      <div class="meta-row">
        <span>${escapeHtml(song.mood)}</span>
        <span>${escapeHtml(song.theme)}</span>
        <span>${escapeHtml(song.style)}</span>
        ${taskId}
      </div>
      ${audioBlock(song, "original")}
      ${audioBlock(song, "trimmed")}
      <div class="card-actions">
        ${trimButton(song)}
        <button type="button" data-copy="${escapeHtml(code)}">Copy Code</button>
      </div>
    </article>
  `;
}

async function loadHistory() {
  refreshHistory.disabled = true;
  refreshHistory.textContent = "Refreshing";
  try {
    const data = await apiFetch("/history");
    if (!data.songs.length) {
      library.innerHTML = `<p class="empty">No songs yet. Generate the first inspiration to start the notebook.</p>`;
      return;
    }
    library.innerHTML = data.songs.map(libraryCard).join("");
  } catch (error) {
    library.innerHTML = `<p class="empty">${escapeHtml(error.message)}</p>`;
  } finally {
    refreshHistory.disabled = false;
    refreshHistory.textContent = "Refresh";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  result.innerHTML = "";
  generateButton.disabled = true;
  generateButton.textContent = "Generating...";
  startProgress();

  try {
    const data = await apiFetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadFromForm()),
    });
    completeProgress();
    result.innerHTML = resultCard(data.song);
    await loadHistory();
  } catch (error) {
    stopProgressWithError(error.message || "Generation failed.");
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "Generate Inspiration";
  }
});

document.addEventListener("click", async (event) => {
  const trim = event.target.closest("[data-trim]");
  if (trim) {
    await createTrim(trim.dataset.trim, trim);
    return;
  }

  const button = event.target.closest("[data-copy]");
  if (!button) return;
  const songId = button.dataset.copy;
  try {
    await copySongId(songId);
    const previous = button.textContent;
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = previous;
    }, 1200);
  } catch {
    errorMessage.textContent = "Could not copy Song ID.";
  }
});

energy.addEventListener("input", updateSliderLabels);
tempo.addEventListener("input", updateSliderLabels);
refreshHistory.addEventListener("click", loadHistory);

updateSliderLabels();
loadHistory();
