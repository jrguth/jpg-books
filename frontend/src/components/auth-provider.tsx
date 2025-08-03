import { useState } from "react";
import { AuthContext, User } from "@/lib/auth-context";
import { decodeJwtClaims } from "@/hooks/gable-api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("jwt");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(
    token ? (decodeJwtClaims(token) as User) : null,
  );

  const value = {
    isLoading,
    setIsLoading,
    user,
    setUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
