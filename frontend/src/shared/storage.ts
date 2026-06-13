import type { Inspiration, Track } from "./models";

const KEYS = {
  authToken: "echo_auth_token",
  userName: "echo_user_name",
  userEmail: "echo_user_email",
  tracks: "echo_tracks",
  pendingInspiration: "echo_pending_inspo",
  openCreate: "echo_open_create",
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const storage = {
  keys: KEYS,
  isAuthenticated: () => Boolean(localStorage.getItem(KEYS.authToken)),
  getTracks: () => readJson<Track[]>(KEYS.tracks, []),
  setTracks: (tracks: Track[]) => localStorage.setItem(KEYS.tracks, JSON.stringify(tracks)),
  getInspiration: () => readJson<Partial<Inspiration>>(KEYS.pendingInspiration, {}),
  setInspiration: (inspiration: Inspiration) =>
    localStorage.setItem(KEYS.pendingInspiration, JSON.stringify(inspiration)),
  clearSession: () => {
    localStorage.removeItem(KEYS.authToken);
    localStorage.removeItem(KEYS.userName);
    localStorage.removeItem(KEYS.userEmail);
    localStorage.removeItem(KEYS.tracks);
  },
};

