import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";

const N8N_WEBHOOK_URL = import.meta.env.N8N_WEBHOOK_PROD_URL;

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
      // 1. Verificação de segurança da URL
      if (!N8N_WEBHOOK_URL) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Configuração do servidor ausente (Webhook URL).",
        });
      }

      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "User-Agent": "Astro-Action-Bot" },
          body: JSON.stringify(data),
          // credentials removido pois aqui é server-side
        });

        if (!response.ok) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "O serviço de e-mail falhou. Tente novamente mais tarde.",
          });
        }

        // Tenta ler o JSON, se falhar, retorna um fallback de sucesso
        const result = await response.json().catch(() => null);
        
        return {
          success: true,
          message: `Obrigado, ${data.name}, entraremos em contato!`,
          data: result
        };

      } catch (error) {
        // Captura erros de rede ou DNS
        if (error instanceof ActionError) throw error;
        
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro inesperado ao processar sua solicitação.",
        });
      }
    },
  }),
};
