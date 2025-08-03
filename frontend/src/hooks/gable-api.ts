import { useMutation } from "@tanstack/react-query";
import GableApi from "@/lib/gable-api";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "./auth";

const defaultErrorHandler = (error: Error) => {
  console.error(error);
  if (axios.isAxiosError(error)) {
    if (error.status === 400) {
      toast.error(error.message);
    } else {
      toast.error("Something went wrong there", { position: "top-center" });
    }
  }
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ["gable-api", "register"],
    mutationFn: (registration: {
      emailOrUsername: string;
      password: string;
      name: string | null;
    }) => GableApi.post("/auth/register", registration),
    onError: defaultErrorHandler,
  });
};

export const useLogin = () => {
  const { setUser } = useAuth();
  return useMutation({
    mutationKey: ["gable-api", "login"],
    mutationFn: async (login: { emailOrUsername: string; password: string }) =>
      GableApi.post<{ value: string }>("/auth/login", login),
    onSuccess: ({ data }) => {
      localStorage.setItem("jwt", data.value);
      const claims = decodeJwtClaims(data.value);
      console.log(claims);
      setUser(claims);
    },
    onError: defaultErrorHandler,
  });
};

function decodeJwtClaims(token: string) {
  // Split the JWT into its three parts
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
  }

  // Get the payload (second part)
  const payload = parts[1];

  // Add padding if needed for proper base64 decoding
  const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

  // Decode from base64url to string
  const decodedPayload = atob(
    paddedPayload.replace(/-/g, "+").replace(/_/g, "/"),
  );

  // Parse the JSON
  const claims = JSON.parse(decodedPayload);

  return claims;
}
