import { ZodType } from "zod";

export function validateSchema(schema: ZodType, payload: any) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      ok: false,
      error: result.error,
    };
  }

  return {
    ok: true,
    data: result.data,
  };
}
