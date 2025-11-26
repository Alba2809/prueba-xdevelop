import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string({
      error: "El título es inválido",
    })
    .min(1, "El título es obligatorio")
    .min(5, "El título es demasiado corto")
    .max(50, "El título es demasiado largo"),
  body: z
    .string({
      error: "El contenido es inválido",
    })
    .min(1, "El contenido es obligatorio")
    .min(10, "El contenido es demasiado corto")
    .max(500, "El contenido es demasiado largo"),
});

export type PostSchema = z.infer<typeof postSchema>;
