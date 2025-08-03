import { createContext } from "react";

export type User = {
  userId: string;
  emailOrUsername: string;
  name: string | null;
};

export type AuthContext = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContext>({
  isLoading: true,
  setIsLoading: () => {},
  user: null,
  setUser: () => {},
});
