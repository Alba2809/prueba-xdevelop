import { Post, updatePost } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Hook para actualizar un post de forma optimista
export function useUpdatePostMutation(id: number) {
  const qc = useQueryClient();

  return useMutation({
    // Función que realiza la mutación (actualización del post)
    mutationFn: (payload: Partial<Post>) => updatePost(id, payload),

    // Optimistic Update: Se ejecuta antes de que la mutación sea confirmada
    onMutate: async (newPost) => {
      // Cancela cualquier consulta en curso para evitar conflictos
      await qc.cancelQueries({ queryKey: ["post", id] });

      // Obtiene los datos actuales del post desde la cache
      const previous = qc.getQueryData(["post", id]);

      // Actualiza la cache con los nuevos datos de forma optimista
      qc.setQueryData(["post", id], (old: any) => ({
        ...old, // Mantiene los datos existentes
        ...newPost, // Sobrescribe con los nuevos datos
      }));

      // Devuelve los datos anteriores para poder revertir en caso de error
      return { previous };
    },

    // Manejo de errores: Revertir los cambios optimistas si ocurre un error
    onError: (_err, _vars, ctx) => {
      // Restaura los datos anteriores en la cache
      qc.setQueryData(["post", id], ctx?.previous);
    },

    // Después de que la mutación se complete (ya sea éxitoso o con error)
    onSettled: () => {
      // Refresca los datos del post específico
      qc.invalidateQueries({ queryKey: ["post", id] });

      // Refresca la lista de posts para reflejar los cambios
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
