"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { searchSchema, SearchSchemaType } from "./schemas/searchSchema";
import { useBooksFilters } from "./hooks/useBooksFilters";
import { useBooksInfinite } from "./hooks/useBooksInfinite";

import BookCard from "./components/BookCard";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import LoaderSpin from "@/components/common/LoaderSpin";
import { useEffect, useRef, useState } from "react";
import BookDetailsSheet from "./components/BookDetailsSheet";
import { Book } from "@/services/books.service";

export default function BooksPage() {
  const form = useForm<SearchSchemaType>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: "", author: "", year: "" },
  });

  // obtener los valores del formulario para usarlos con debounce
  const watchedValues = form.watch();

  // hook que maneja debounce y filtros oficiales
  const { filters, manualSearch } = useBooksFilters(watchedValues);

  // Infinite scroll con los filtros finales
  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useBooksInfinite(filters);

  // scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, isFetchingNextPage]);

  // Botón Buscar
  const handleSubmit = form.handleSubmit((values) => {
    manualSearch(values);
  });

  /* Estados para la modal de detalles */
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState<Book | null>(null);

  const handleViewDetails = (book: Book) => {
    setBook(book);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">Buscador de Libros</h1>

      {/* Formulario */}
      <Card className="p-4">
        <Form {...form}>
          <form className="grid md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="q"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe un libro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del autor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <Input placeholder="1999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Buscar</Button>
          </form>
        </Form>
      </Card>

      {/* Loader inicial */}
      {isFetching && (
        <div className="flex justify-center py-10">
          <LoaderSpin />
        </div>
      )}

      {/* Resultados */}
      {data && (
        <>
          {data.pages?.length > 0 && data.pages[0].books?.length > 0 ? (
            <div className="flex flex-wrap justify-between gap-5 mb-5">
              {data.pages.map((page: any) =>
                page.books.map((book: any) => (
                  <BookCard key={book.key} book={book} onClickCard={() => handleViewDetails(book)} />
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Sin resultados. Ajusta los filtros y vuelve a intentar.
            </div>
          )}

          {/* Infinite Scroll Loader */}
          <div
            ref={loadMoreRef}
            className="h-10 flex justify-center items-center my-5"
          >
            {isFetchingNextPage && <LoaderSpin />}
          </div>
        </>
      )}

      {!data && !isFetching && !isFetchingNextPage && (
        <div className="text-center py-10 text-muted-foreground">
          Sin resultados. Ajusta los filtros y vuelve a intentar.
        </div>
      )}

      {/* Sheet Modal para detalles */}
      <BookDetailsSheet
        open={open}
        book={book}
        setOpen={setOpen}
      />
    </div>
  );
}
