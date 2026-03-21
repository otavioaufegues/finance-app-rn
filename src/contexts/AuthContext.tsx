import { logoutUser, subscribeToAuthChanges } from "@/services/auth";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";

type AuthContextData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      isLoading,
      user,
      signOut: logoutUser,
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
