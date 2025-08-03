import z from "zod";
import { bookSchema } from "./gapi";

type BookRaw = z.infer<typeof bookSchema>;
type VolumeInfo = BookRaw["volumeInfo"];

export type Book = Prettify<Omit<BookRaw, "volumeInfo"> & VolumeInfo>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
