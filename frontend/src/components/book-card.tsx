import { Book } from "@/lib/types";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Props {
  book: Book;
  className?: string;
}

export const BookCard = ({ book, className }: Props) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex gap-4 w-full ">
          <img
            loading="lazy"
            className="object-cover rounded-sm w-[128px] h-[200px]"
            src={book.imageLinks.thumbnail}
          />

          <div className="grid grid-cols-[1fr_auto] auto-rows-min items-center">
            <CardTitle className="text-xl col-span-2">{book.title}</CardTitle>
            {book.subtitle && (
              <CardDescription className="col-span-2">
                {book.subtitle}
              </CardDescription>
            )}
            {book.authors.length > 0 && (
              <>
                <Label>
                  {book.authors.length === 1 ? "Author:" : "Authors:"}
                </Label>
                <CardDescription>{book.authors.join(", ")}</CardDescription>
              </>
            )}
            <>
              <Label htmlFor={`page_count_${book.id}`}>Page count:</Label>
              <CardDescription id={`page_count_${book.id}`}>
                {book.pageCount}
              </CardDescription>
            </>
            <>
              <Label>Published:</Label>
              <CardDescription>{book.publishedDate}</CardDescription>
            </>
            <>
              <Label>Categories:</Label>
              <div className="flex flex-wrap gap-1 mt-auto">
                {book.categories.map((c) => (
                  <Badge variant="secondary">{c}</Badge>
                ))}
              </div>
            </>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1"></div>
            <div className="flex gap-1"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};
