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
  const { data, fetchNextPage, isFetchingNextPage, isFetching, hasNextPage } =
    useBooksInfinite(filters);

  // scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Si no existe el sentinel en el DOM no hacemos nada
    if (!loadMoreRef.current) return;

    /**
     * IntersectionObserver callback:
     * - Se ejecuta cuando el "sentinel" (loadMoreRef) entra/sale del viewport.
     * - entry.isIntersecting => el sentinel es visible (o está dentro del rootMargin).
     * - Verificamos además que no estemos ya realizando el fetch la siguiente página
     *   (isFetchingNextPage) y que realmente exista una siguiente página (hasNextPage).
     * - Solo entonces llamamos a fetchNextPage() para cargar más resultados.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // Evitar fetchs redundantes: solo cuando el sentinel es visible
        // y no estamos ya cargando ni hemos llegado al final.
        if (entry.isIntersecting && !isFetchingNextPage && hasNextPage) {
          // Disparar la carga de la siguiente página
          fetchNextPage();
        }
      },
      {
        // threshold bajo y rootMargin positivo para disparar antes y ser más confiable
        // rootMargin positivo para "preload" (disparar antes de que el usuario llegue al final)
        threshold: 0.1,
        rootMargin: "200px 0px 200px 0px",
      }
    );

    const el = loadMoreRef.current;
    observer.observe(el);

    // Cleanup: dejar de observar cuando el componente se desmonta o cambian dependencias
    return () => observer.unobserve(el);
  }, [
    fetchNextPage, // función que dispara la petición (asegurar identidad estable)
    isFetchingNextPage, // condiciones para permitir el fetch
    hasNextPage,
    filters.q, // reinician el observer cuando cambian los filtros (nuevos resultados)
    filters.author,
    filters.year,
  ]);

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
    <div className="flex flex-col gap-6 size-full">
      <h1 className="text-3xl font-bold text-center">Buscador de Libros</h1>
      {/* Sheet Modal para detalles */}
      <BookDetailsSheet open={open} book={book} setOpen={setOpen} />

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
            <>
              <div className="flex flex-wrap justify-between gap-5 mb-5">
                {data.pages.map((page: any) =>
                  page.books.map((book: any) => (
                    <BookCard
                      key={book.key}
                      book={book}
                      onClickCard={() => handleViewDetails(book)}
                    />
                  ))
                )}
              </div>
              {!hasNextPage && (
                <div className="text-center py-10 text-muted-foreground">
                  ¿No encontraste lo que buscabas? Intenta modificando los
                  filtros.
                </div>
              )}
            </>
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
          Sin resultados. Ajusta los filtros y vuelve a intentar 2.
        </div>
      )}
    </div>
  );
}
