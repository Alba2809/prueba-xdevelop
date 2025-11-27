"use server";

import { API_BOOKS } from "@/utils/constants";
import { api } from "./http";

export interface BookSearchParams {
  q?: string;
  page?: number;
  author?: string;
  year?: number;
}

export interface Book {
  author_name: string;
  author_key: string;
  cover_edition_key: string;
  cover_i: number;
  first_publish_year: number;
  language: string[];
  title: string;
  key: string;
}

export async function searchBooks(params: BookSearchParams) {
  const { q, page = 1, author, year } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  
  if (q) searchParams.set("q", q);
  if (author) searchParams.set("author", author);
  if (year) searchParams.set("first_publish_year", String(year));
//   console.log(searchParams)

  const res = await api.get(
    `${API_BOOKS}/search.json?${searchParams.toString()}&fields=title,author_name,author_key,first_publish_year,key,cover_edition_key,cover_i,language`
  );
//   console.log(`${API_BOOKS}/search.json?${searchParams.toString()}&fields=title,author_name,author_key,first_publish_year,key,cover_edition_key,cover_i,language`)

  if (!res.statusText.startsWith("OK")) {
    console.log("Error al buscar libros");
    throw new Error("Error con la API de OpenLibrary");
  }

  console.log(res.data.docs[0])

  return {
    books: res.data.docs as Book[],
    total: res.data.numFound,
    hasMore: res.data.docs.length > 0,
    page,
    totalPages: Math.ceil(res.data.numFound / 100),
  };
}

export async function getBookDetails(workId: string) {
  const res = await api.get(`${API_BOOKS}/works/${workId}.json`);
  return res.data;
}
