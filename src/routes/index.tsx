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

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [query, setQuery] = useDebounceValue("", 500);
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<Awaited<ReturnType<typeof searchBooks>>>(
    [],
  );

  useEffect(() => {
    setIsLoading(true);
    setBooks([]);
    searchBooks(query)
      .then((result) => setBooks(result))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [query]);
  return (
    <div className="container mx-auto space-y-4">
      <Input
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a book"
      />
      {isLoading && <CenteredSpinner />}
      {!isLoading && books.length > 0 && (
        <div className="w-full gap-4 flex flex-col">
          {books.map((b) => (
            <Card>
              <CardHeader>
                <div className="flex gap-4 w-full ">
                  <img
                    loading="lazy"
                    className="object-cover rounded-sm"
                    src={b.volumeInfo.imageLinks.thumbnail}
                  />
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl">
                      {b.volumeInfo.title}
                    </CardTitle>
                    {b.volumeInfo.subtitle && (
                      <CardDescription>{b.volumeInfo.subtitle}</CardDescription>
                    )}
                    {b.volumeInfo.authors.length > 0 && (
                      <div className="flex gap-1">
                        <Label>
                          {b.volumeInfo.authors.length === 1
                            ? "Author:"
                            : "Authors:"}
                        </Label>
                        <CardDescription>
                          {b.volumeInfo.authors.join(", ")}
                        </CardDescription>
                      </div>
                    )}
                    <div className="flex gap-1">
                      <Label htmlFor={`page_count_${b.id}`}>Page count:</Label>
                      <CardDescription id={`page_count_${b.id}`}>
                        {b.volumeInfo.pageCount}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Label>Published:</Label>
                      <CardDescription>
                        {b.volumeInfo.publishedDate}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      <Label>Categories:</Label>
                      {b.volumeInfo.categories.map((c) => (
                        <Badge variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
