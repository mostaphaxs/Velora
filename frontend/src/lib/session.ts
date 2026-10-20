import "server-only";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

// The customer's Laravel Sanctum token. It never reaches browser JavaScript:
// the cookie is httpOnly and only server code reads it.
const COOKIE_NAME = "velora_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function getSessionToken() {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}

export async function setSessionToken(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function clearSessionToken() {
  (await cookies()).delete(COOKIE_NAME);
}

// Calls the API as the signed-in customer (or as a guest when there is no session).
export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getSessionToken();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
}
