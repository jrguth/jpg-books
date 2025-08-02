import z from "zod";
import { bookSchema } from "./gapi";

type BookRaw = z.infer<typeof bookSchema>;
type VolumeInfo = BookRaw["volumeInfo"];

export type Book = Omit<BookRaw, "volumeInfo"> & VolumeInfo;
