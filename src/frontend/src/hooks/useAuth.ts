import { useCallback, useState } from "react";

export interface BioUser {
  name: string;
  email: string;
  picture?: string;
  isGuest?: boolean;
}

const STORAGE_KEY = "bioviewer_user";

function readUser(): BioUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BioUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUserState] = useState<BioUser | null>(readUser);

  const login = useCallback((u: BioUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUserState(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUserState(null);
  }, []);

  return { user, login, logout, isLoggedIn: !!user };
}
