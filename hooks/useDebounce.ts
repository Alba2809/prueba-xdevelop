"use client";

import { useEffect, useState } from "react";

/**
 * El debounce retrasa la actualización del valor hasta que el usuario
 * deja de interactuar durante un período de tiempo definido (delay).
 * Útil para optimizar eventos como búsquedas o entradas de texto
 * que no necesitan ejecutarse en tiempo real.
 * 
 * @param value - El valor que se desea "debouncear".
 * @param delay - El tiempo de espera en milisegundos antes de actualizar el valor (por defecto 500ms).
 * @returns El valor "debounced" que se actualiza después del retraso.
 */
export function useDebounce<T>(value: T, delay: number = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Configura un temporizador para actualizar el valor después del retraso
    const id = setTimeout(() => setDebounced(value), delay);

    // Limpia el temporizador si el valor o el delay cambian antes de que se complete
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
