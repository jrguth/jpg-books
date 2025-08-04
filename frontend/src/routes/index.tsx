import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CenteredSpinner } from "@/components/spinner";
import { toast } from "sonner";
import { BookCard } from "@/components/book-card";
import { useMyBooks } from "@/hooks/gable-api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isLoading, data: books, error } = useMyBooks();

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong there!", { position: "top-center" });
    }
  }, [error]);

  return (
    <div className="container mx-auto space-y-4">
      <h1 className="text-4xl font-semibold">My library</h1>
      {isLoading ? (
        <CenteredSpinner />
      ) : (
        <div className="flex flex-col gap-4">
          {books?.map((b) => (
            <BookCard book={b.googleMetadata} id={b.id} />
          ))}
        </div>
      )}
    </div>
  );
}
