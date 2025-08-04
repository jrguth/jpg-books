import z from "zod";
import { bookSchema } from "./gapi";

export type GoogleBook = Prettify<z.infer<typeof bookSchema>>;

export interface Genre {
  id: string;
  genreName: string;
}

export interface Author {
  id: string;
  name: string;
}

interface IBook {
  id: string;
  googleId: string;
  title: string;
  genres: Array<Genre>;
  authors: Array<Author>;
}

export interface Book extends IBook {
  googleMetadata: string;
}

export interface BookWithMeta extends IBook {
  googleMetadata: GoogleBook;
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
