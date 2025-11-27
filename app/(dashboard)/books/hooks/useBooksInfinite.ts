import { BookSearchParams, searchBooks } from "@/services/books.service";
import { useInfiniteQuery } from "@tanstack/react-query";

interface BooksInfiniteParams {
  q?: string;
  author?: string;
  year?: string;
}

export function useBooksInfinite({ q, author, year }: BooksInfiniteParams) {
  return useInfiniteQuery({
    queryKey: ["books-infinite", q, author, year],

    initialPageParam: 1, // requerido por React Query v5

    queryFn: async ({ pageParam }) => {
      return await searchBooks({
        q,
        page: pageParam,
        author,
        year: Number(year),
      });
    },

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },

    enabled: Boolean(q || author || year), // solo si hay alguno de los filtros
  });
}
