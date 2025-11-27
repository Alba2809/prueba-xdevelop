import { z } from "zod";

export const searchSchema = z
  .object({
    q: z.string(),
    author: z.string(),
    year: z
      .string()
      .refine(
        (v) => v === "" || /^\d{4}$/.test(v),
        "El año debe tener 4 dígitos"
      ),
  })
  .refine(
    (vals) => {
      const qOk = vals.q.trim().length >= 3;
      const authorOk = vals.author.trim().length >= 3;
      const yearOk = /^\d{4}$/.test(vals.year.trim());

      return qOk || authorOk || yearOk;
    },
    {
      message:
        "Debes buscar por título (>=3), autor (>=3) o año (4 dígitos).",
      path: ["q"],
    }
  );

export type SearchSchemaType = z.infer<typeof searchSchema>;
