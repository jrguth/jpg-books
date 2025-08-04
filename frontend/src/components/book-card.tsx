import { GoogleBook } from "@/lib/types";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bookmark, Check, X } from "lucide-react";
import { useAddBook, useDeleteBook, useMyBooks } from "@/hooks/gable-api";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  id?: string;
  book: GoogleBook;
  className?: string;
}

export const BookCard = ({ book, className }: Props) => {
  const { title, subtitle, authors, pageCount, categories } = book;
  const { data: myBooks, isLoading: isMyBooksLoading } = useMyBooks();
  const { mutate: addBook, isPending: isAddingBook } = useAddBook();
  const { mutate: deleteBook, isPending: isDeletingBook } = useDeleteBook();

  const savedBook = myBooks?.find((b) => b.googleId === book.id);
  const isSaved = !!savedBook;
  return (
    <Card className={cn("max-w-4xl gap-4", className)}>
      <CardHeader className="gap-1">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        <CardAction className="flex items-center gap-2">
          {!isMyBooksLoading && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className:
                      "ml-2 h-8 w-8 p-0 shrink-0 hover:bg-secondary/40",
                  })}
                  disabled={isAddingBook || isDeletingBook}
                  onClick={() => {
                    if (isSaved) {
                      deleteBook(savedBook.id);
                    } else {
                      addBook(book);
                    }
                  }}
                  aria-label={
                    isSaved ? "Remove from my books" : "Save to my library"
                  }
                >
                  <Bookmark
                    className={`h-4 w-4 ${isSaved ? "fill-current text-primary" : "text-muted-foreground"}`}
                  />
                </TooltipTrigger>
                <TooltipContent
                  className="bg-secondary text-secondary-foreground"
                  arrowClassName="bg-secondary fill-secondary"
                >
                  {isSaved ? "Remove from my library" : "Save to my library"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="shrink-0">
            <img
              loading="lazy"
              className="object-cover rounded-sm w-[128px] h-[200px]"
              src={book.imageLinks.thumbnail}
            />
          </div>
          <div className="flex-1 grid grid-cols-2 auto-rows-min gap-3">
            {authors.length > 0 && (
              <div className="shrink-none">
                <p className="text-sm text-muted-foreground">
                  Author{authors.length > 1 ? "s" : ""}
                </p>
                <ul className="font-semibold">
                  {authors.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {(pageCount ?? 0) > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-semibold">{pageCount}</p>
              </div>
            )}
            {book.publishedDate && (
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="font-semibold text-nowrap">
                  {book.publishedDate}
                </p>
              </div>
            )}
            {book.publisher && (
              <div>
                <p className="text-sm text-muted-foreground">Publisher</p>
                <p className="font-semibold">{book.publisher}</p>
              </div>
            )}
            {categories.length > 0 && (
              <div className="col-start-1">
                <p className="text-sm text-muted-foreground mb-1">Genres</p>
                <div className="flex flex-wrap">
                  {categories.map((genre, index) => (
                    <Badge key={index} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ebook?</p>
              {book.isEbook ? (
                <Check
                  className="size-5 shrink-0 text-green-500 font-extrabold"
                  strokeWidth={3}
                />
              ) : (
                <X
                  className="size-5 shrink-0 text-red-500 font-extrabold"
                  strokeWidth={3}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
