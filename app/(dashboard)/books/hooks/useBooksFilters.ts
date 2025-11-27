"use client";

import { useEffect, useState } from "react";
import { SearchSchemaType } from "../schemas/searchSchema";
import { useDebounce } from "@/hooks/useDebounce";

export function useBooksFilters(formValues: SearchSchemaType) {
  const { q, author, year } = formValues;

  // estados debounced
  const debouncedQ = useDebounce(q, 600);
  const debouncedAuthor = useDebounce(author, 600);
  const debouncedYear = useDebounce(year, 600);

  const [filters, setFilters] = useState<{
    q?: string;
    author?: string;
    year?: string;
  }>({
    q: "",
    author: "",
    year: "",
  });

  const isValidQ = (s?: string) => s && s.trim().length >= 3;
  const isValidAuthor = (s?: string) => s && s.trim().length >= 3;
  const isValidYear = (s?: string) => /^\d{4}$/.test(s ?? "");

  // Actualización automática por debounce
  useEffect(() => {
    const dq = debouncedQ?.trim() ?? "";
    const da = debouncedAuthor?.trim() ?? "";
    const dy = debouncedYear?.trim() ?? "";

    // Si no hay ningún filtro proporcionado, no tocar nada (no limpiar la lista)
    const anyProvided = dq !== "" || da !== "" || dy !== "";

    // Cada filtro es válido si está vacío o cumple la validación correspondiente
    const qOk = dq === "" || isValidQ(dq);
    const authorOk = da === "" || isValidAuthor(da);
    const yearOk = dy === "" || isValidYear(dy);

    // Solo actualizar si hay al menos un filtro y todos los no vacíos son válidos
    if (anyProvided && qOk && authorOk && yearOk) {
      setFilters({
        q: dq,
        author: da,
        year: dy,
      });
    }
    // En cualquier otro caso no hacemos nada para no borrar la lista actual
  }, [debouncedQ, debouncedAuthor, debouncedYear]);

  // Manual search (botón Buscar)
  function manualSearch(values: SearchSchemaType) {
    const dq = values.q?.trim() ?? "";
    const da = values.author?.trim() ?? "";
    const dy = values.year?.trim() ?? "";

    // Si no hay ningún filtro proporcionado, no actualizar
    const anyProvided = dq !== "" || da !== "" || dy !== "";

    // Validamos que los filtros no vacíos cumplan su regla
    if (!anyProvided) return;

    if ((dq !== "" && !isValidQ(dq)) || (da !== "" && !isValidAuthor(da)) || (dy !== "" && !isValidYear(dy))) {
      // Al menos un filtro inválido: no actualizar para no borrar la lista
      return;
    }

    // Todos los filtros no vacíos son válidos -> aplicar
    setFilters({
      q: dq,
      author: da,
      year: dy,
    });
  }

  return { filters, manualSearch };
}
