import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GableApi from "@/lib/gable-api";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "./auth";
import { Book, BookWithMeta, GoogleBook } from "@/lib/types";

const defaultErrorHandler = (error: Error) => {
  console.error(error);
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data ?? error.message, {
      position: "top-center",
    });
    // if (error.status === 400) {
    //   toast.error(error.response?.data ?? error.message, {
    //     position: "top-center",
    //   });
    // } else {
    //   toast.error("Something went wrong there", { position: "top-center" });
    // }
  }
};

export const useRegister = () => {
  const { setUser } = useAuth();
  return useMutation({
    mutationKey: ["gable-api", "register"],
    mutationFn: (registration: {
      email: string;
      username: string;
      password: string;
      name: string | null;
    }) => GableApi.post<{ value: string }>("/auth/register", registration),
    onSuccess: ({ data }) => {
      localStorage.setItem("jwt", data.value);
      const claims = decodeJwtClaims(data.value);
      setUser(claims);
    },
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
      setUser(claims);
    },
    onError: defaultErrorHandler,
  });
};

export const useMyBooks = () => {
  return useQuery({
    queryKey: ["gable-api", "books"],
    queryFn: async () => {
      const res = await GableApi.get<Array<Book>>("/books");
      return res.data.map(
        (b) =>
          ({
            ...b,
            googleMetadata: JSON.parse(b.googleMetadata),
          }) as BookWithMeta,
      );
    },
  });
};

export const useAddBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GoogleBook) => {
      const payload = {
        title: data.title,
        googleId: data.id,
        googleMetadata: JSON.stringify(data),
      };
      const res = await GableApi.post<Book>("/books/add", payload);
      return {
        ...res.data,
        googleMetadata: JSON.parse(res.data.googleMetadata),
      } as BookWithMeta;
    },
    onSuccess: async (data) => {
      const queryKey = ["gable-api", "books"];
      queryClient.setQueryData(queryKey, (oldBooks: Array<BookWithMeta>) => [
        ...(oldBooks ?? []),
        data,
      ]);
    },
    onError: defaultErrorHandler,
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string) => GableApi.delete(`books/${bookId}`),
    onSuccess: (_, bookId) => {
      queryClient.setQueryData(
        ["gable-api", "books"],
        (oldBooks: Array<BookWithMeta>) =>
          oldBooks.filter((b) => b.id !== bookId),
      );
      return queryClient.invalidateQueries({
        queryKey: ["gable-api", "books"],
      });
    },
    onError: defaultErrorHandler,
  });
};

export function decodeJwtClaims(token: string) {
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
