import type { AuthSession } from "@/types/auth.types";

/**
 * O backend é 100% stateless (STATELESS + @CrossOrigin sem credentials) e não
 * emite cookies de sessão, então não há como o middleware/edge ler o estado de
 * autenticação — persistimos em localStorage e resolvemos tudo no client.
 *
 * Exposto como um external store (useSyncExternalStore em AuthContext) em vez
 * de useState+useEffect: evita o re-render extra da hidratação manual e
 * sincroniza logout entre abas de graça via o evento nativo "storage".
 */
const STORAGE_KEY = "edustream.session";

let session: AuthSession | null | undefined; // undefined = ainda não hidratado
const listeners = new Set<() => void>();

function parseSession(raw: string): AuthSession | null {
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

export function getSessionSnapshot(): AuthSession | null {
  if (session === undefined) {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    session = raw ? parseSession(raw) : null;
  }
  return session;
}

export function getServerSessionSnapshot(): null {
  return null;
}

export function subscribeToSession(callback: () => void): () => void {
  listeners.add(callback);

  function handleStorageEvent(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return;
    session = event.newValue ? parseSession(event.newValue) : null;
    emitChange();
  }

  window.addEventListener("storage", handleStorageEvent);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

export function getStoredToken(): string | null {
  return getSessionSnapshot()?.token ?? null;
}

export function persistSession(next: AuthSession): void {
  session = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitChange();
}

export function clearSession(): void {
  session = null;
  window.localStorage.removeItem(STORAGE_KEY);
  emitChange();
}
