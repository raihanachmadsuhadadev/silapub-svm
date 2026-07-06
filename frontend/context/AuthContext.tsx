"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, TOKEN_STORAGE_KEY } from "@/lib/api";

export type UserRole = "admin" | "warga";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  nik?: string | null;
  phone?: string | null;
  rt?: string | null;
  rw?: string | null;
  address?: string | null;
  is_active: boolean;
};

type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  nik: string;
  phone: string;
  email: string;
  rt: string;
  rw: string;
  address: string;
  password: string;
  password_confirmation: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};

type MeResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const storeSession = useCallback((nextUser: AuthUser, nextToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const response = await api.get<MeResponse>("/auth/me");
      setUser(response.data.data.user);
      return response.data.data.user;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!savedToken) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      if (active) {
        setToken(savedToken);
      }

      await fetchMe();

      if (active) {
        setLoading(false);
      }
    }

    bootstrapSession();

    return () => {
      active = false;
    };
  }, [fetchMe]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      const { user: nextUser, token: nextToken } = response.data.data;
      storeSession(nextUser, nextToken);
      return nextUser;
    },
    [storeSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await api.post<AuthResponse>("/auth/register", payload);
      const { user: nextUser, token: nextToken } = response.data.data;
      storeSession(nextUser, nextToken);
      return nextUser;
    },
    [storeSession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      fetchMe,
    }),
    [fetchMe, loading, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
