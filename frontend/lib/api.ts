import type { ComposeFormData, ComposeResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function compose(form: ComposeFormData): Promise<ComposeResponse> {
  const prompt = [
    `Create a ${form.mood} ${form.genre} piece`,
    form.instrument && `featuring ${form.instrument}`,
    form.theme && `with themes of ${form.theme}`,
    form.bpm && `at approximately ${form.bpm} BPM`,
  ]
    .filter(Boolean)
    .join(", ") + ".";

  const res = await fetch(`${API_BASE}/compose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }

  return res.json();
}
