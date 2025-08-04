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
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
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
    <Card className={cn("max-w-2xl gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        <CardAction>
          {!isMyBooksLoading && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isAddingBook || isDeletingBook}
                    onClick={() => {
                      if (isSaved) {
                        deleteBook(savedBook.id);
                      } else {
                        addBook(book);
                      }
                    }}
                    className="ml-2 h-8 w-8 p-0 shrink-0 hover:bg-secondary/40"
                    aria-label={
                      isSaved ? "Remove from my books" : "Save to my library"
                    }
                  >
                    <Bookmark
                      className={`h-4 w-4 ${isSaved ? "fill-current text-primary" : "text-muted-foreground"}`}
                    />
                  </Button>
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
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Author{authors.length > 1 ? "s" : ""}
              </p>

              <ul className="font-semibold">
                {authors.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pages</p>
              <p className="font-semibold">{pageCount.toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Genres</p>
              <div className="flex flex-wrap">
                {categories.map((genre, index) => (
                  <Badge key={index} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// export const BookCard = ({ book, showBookmark, className }: Props) => {
//   return (
//     <Card className={className}>
//       <CardHeader>
//         <div className="flex gap-4 w-full ">
//           <img
//             loading="lazy"
//             className="object-cover rounded-sm w-[128px] h-[200px]"
//             src={book.imageLinks.thumbnail}
//           />

//           <div className="grid grid-cols-[auto_1fr] items-center gap-1">
//             <CardTitle className="text-xl col-span-2">{book.title}</CardTitle>
//             {book.subtitle && (
//               <CardDescription className="col-span-2">
//                 {book.subtitle}
//               </CardDescription>
//             )}
//             {book.authors.length > 0 && (
//               <>
//                 <Label className="text-sm">
//                   {book.authors.length === 1 ? "Author:" : "Authors:"}
//                 </Label>
//                 <CardDescription>{book.authors.join(", ")}</CardDescription>
//               </>
//             )}
//             <>
//               <Label htmlFor={`page_count_${book.id}`}>Page count:</Label>
//               <CardDescription id={`page_count_${book.id}`}>
//                 {book.pageCount}
//               </CardDescription>
//             </>
//             <>
//               <Label>Published:</Label>
//               <CardDescription>{book.publishedDate}</CardDescription>
//             </>
//             <>
//               <Label>Categories:</Label>
//               <div className="flex flex-wrap gap-1 mt-auto">
//                 {book.categories.map((c) => (
//                   <Badge variant="secondary">{c}</Badge>
//                 ))}
//               </div>
//             </>
//           </div>
//           <div className="flex flex-col gap-1">
//             <div className="flex gap-1"></div>
//             <div className="flex gap-1"></div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent></CardContent>
//     </Card>
//   );
// };
