import type { AuthUser } from "@/types/portal";
import { setApiToken } from "@/lib/api";

export type AuthScope = "default" | "admin" | "warga";

function getTokenKey(scope: AuthScope) {
  if (scope === "admin") return "portal-kampung-admin-token";
  if (scope === "warga") return "portal-kampung-warga-token";
  return "portal-kampung-token";
}

function getUserKey(scope: AuthScope) {
  if (scope === "admin") return "portal-kampung-admin-user";
  if (scope === "warga") return "portal-kampung-warga-user";
  return "portal-kampung-user";
}

export function saveAuthSession(token: string, user: AuthUser, scope: AuthScope = "default") {
  localStorage.setItem(getTokenKey(scope), token);
  localStorage.setItem(getUserKey(scope), JSON.stringify(user));
  setApiToken(token);
}

export function clearAuthSession(scope: AuthScope = "default") {
  localStorage.removeItem(getTokenKey(scope));
  localStorage.removeItem(getUserKey(scope));
  setApiToken(null);
}

export function getStoredToken(scope: AuthScope = "default") {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(getTokenKey(scope));
}

export function getStoredUser(scope: AuthScope = "default"): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(getUserKey(scope));
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}
