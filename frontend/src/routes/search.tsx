import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { CenteredSpinner } from "@/components/spinner";

import { useBookSearch } from "@/hooks/gapi";
import { toast } from "sonner";
import { BookCard } from "@/components/book-card";
import z from "zod";

export const Route = createFileRoute("/search")({
  component: Search,
  validateSearch: z.object({
    q: z.string().default(""),
  }),
});

function Search() {
  const handleInputChange = useDebounceCallback((value: string) =>
    navigate({ search: { q: value } }),
  );
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { isLoading, data: books, error } = useBookSearch(q);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-center" });
    }
  }, [error]);

  return (
    <div className="container mx-auto space-y-4">
      <h1 className="text-4xl font-semibold">Book Search</h1>
      {/* <form></form> */}
      <Input
        onChange={(e) => void handleInputChange(e.target.value)}
        defaultValue={q}
        placeholder="Title, author, genre, etc."
        autoFocus
      />
      {isLoading && <CenteredSpinner />}
      {!isLoading && books && (
        <div className="w-full gap-4 flex flex-col">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
