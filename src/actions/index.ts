import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";

const N8N_WEBHOOK_URL = import.meta.env.N8N_WEBHOOK_PROD_URL

export const server = {
  postContact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
      email: z.string().email({ message: "Informe um endereço de e-mail válido." }),
      subject: z.string().min(10, { message: "O assunto deve ter pelo menos 10 caracteres." }),
      message: z.string().min(5, { message: "A mensagem deve ter pelo menos 5 caracteres." }).max(500, {
      message: "A mensagem deve ter no máximo 500 caracteres.",
    }),
  }),
  handler: async (data) => {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "omit",
    });

    if (!response.ok) throw new ActionError({ code: "BAD_REQUEST", message: "Falha ao enviar para o n8n." });
    
    return await response.json().catch(() => ({ 
        success: true,
        raw: `Obrigado, ${data.name}, entraremos em contato!`
      })
    );
  },
  }),
};
