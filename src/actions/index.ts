import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z
        .string()
        .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
      email: z
        .string()
        .email({ message: "Informe um endereço de e-mail válido." }),
      subject: z
        .string()
        .min(10, {
          message: "O assunto deve ter pelo menos 10 caracteres.",
        }),
      message: z
        .string()
        .min(5, { message: "A mensagem deve ter pelo menos 5 caracteres." })
        .max(500, {
          message: "A mensagem deve ter no máximo 500 caracteres.",
        }),
    }),
    handler: async ({ name, email, subject, message }) => {
      console.log({ name, email, subject, message });
    },
  }),
};