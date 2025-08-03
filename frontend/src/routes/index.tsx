import { createFileRoute } from "@tanstack/react-router";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { CenteredSpinner } from "@/components/spinner";

import { useBookSearch } from "@/hooks/gapi";
import { toast } from "sonner";
import { BookCard } from "@/components/book-card";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [query, setQuery] = useDebounceValue("", 500);

  const { isLoading, data: books, error } = useBookSearch(query);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong there!", { position: "top-center" });
    }
  }, [error]);

  if (books) console.log(JSON.stringify(books[0]));

  return (
    <div className="container mx-auto space-y-4">
      <Input
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a book"
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
