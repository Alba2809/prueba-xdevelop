import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({
        error: "El email es inválido"
    })
    .min(1, "El email es obligatorio"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
