import { searchBooks } from "@/lib/gapi";
import { useQuery } from "@tanstack/react-query";

export const useBookSearch = (q: string) => {
  return useQuery({
    queryKey: ["gapi", "searchBooks", q],
    queryFn: () => searchBooks(q),
    enabled: !!q,
  });
};
