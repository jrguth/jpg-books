import { createFileRoute } from "@tanstack/react-router";
import { useBoolean, useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { searchBooks } from "@/lib/gapi";
import { getBook } from "@/lib/gapi";
import { CenteredSpinner } from "@/components/spinner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
