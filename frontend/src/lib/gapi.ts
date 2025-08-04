import axios from "axios";
import { z } from "zod";
import { GoogleBook } from "./types";

const imageBackup =
  "https://books.google.com.br/googlebooks/images/no_cover_thumb.gif";

export const api = axios.create({
  baseURL: "https://www.googleapis.com/books/v1/volumes",
});

export const bookSchema = z
  .object({
    id: z.string(),
    volumeInfo: z.object({
      title: z.string(),
      subtitle: z.string().nullish(),
      authors: z.array(z.string()).default([]),
      description: z.string().nullish(),
      publishedDate: z.string().nullish(),
      publisher: z.string().default(""),
      industryIdentifiers: z
        .array(z.object({ type: z.string(), identifier: z.string() }))
        .default([]),
      pageCount: z.number().nullish(),
      categories: z.array(z.string()).default([]),
      imageLinks: z
        .object({
          smallThumbnail: z.url().default(imageBackup),
          thumbnail: z.url().default(imageBackup),
        })
        .default({ smallThumbnail: imageBackup, thumbnail: imageBackup }),
    }),
    saleInfo: z
      .object({
        country: z.string().default(""),
        saleability: z.string().default(""),
        isEbook: z.boolean(),
        retailPrice: z
          .object({
            amount: z.number(),
            currencyCode: z.string(),
          })
          .nullish(),
      })
      .nullish(),
  })
  .transform((arg) => {
    const { volumeInfo, saleInfo, ...rest } = arg;
    return {
      ...rest,
      ...volumeInfo,
      ...saleInfo,
    };
  });

export const searchBooks = async (
  query: string,
): Promise<Array<GoogleBook>> => {
  const {
    data: { items },
  } = await api.get("?q=" + query + "&maxResults=20");

  return z.array(bookSchema).default([]).parse(items);
};

export const getBook = async (id: string) => {
  const { data } = await api.get(id);
  return bookSchema.parse(data);
};
