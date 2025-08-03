import { AuthContext } from "@/lib/auth-context";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
