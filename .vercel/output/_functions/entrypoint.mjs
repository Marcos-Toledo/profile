import { g as getActionQueryString, a as astroCalledServerError, A as ActionError, d as deserializeActionResult, b as ACTION_QUERY_PARAMS, c as appendForwardSlash } from './chunks/astro-designed-error-pages_C9NbitLT.mjs';
import 'piccolore';
import 'es-module-lexer';
import './chunks/astro/server_CbmyWGvn.mjs';
import 'clsx';
import * as z from 'zod';
import { d as defineAction } from './chunks/index_BaZHplyc.mjs';

const internalFetchHeaders = {};

const apiContextRoutesSymbol = /* @__PURE__ */ Symbol.for("context.routes");
const ENCODED_DOT = "%2E";
function toActionProxy(actionCallback = {}, aggregatedPath = "") {
  return new Proxy(actionCallback, {
    get(target, objKey) {
      if (target.hasOwnProperty(objKey) || typeof objKey === "symbol") {
        return target[objKey];
      }
      const path = aggregatedPath + encodeURIComponent(objKey.toString()).replaceAll(".", ENCODED_DOT);
      function action(param) {
        return handleAction(param, path, this);
      }
      Object.assign(action, {
        queryString: getActionQueryString(path),
        toString: () => action.queryString,
        // redefine prototype methods as the object's own property, not the prototype's
        bind: action.bind,
        valueOf: () => action.valueOf,
        // Progressive enhancement info for React.
        $$FORM_ACTION: function() {
          const searchParams = new URLSearchParams(action.toString());
          return {
            method: "POST",
            // `name` creates a hidden input.
            // It's unused by Astro, but we can't turn this off.
            // At least use a name that won't conflict with a user's formData.
            name: "_astroAction",
            action: "?" + searchParams.toString()
          };
        },
        // Note: `orThrow` does not have progressive enhancement info.
        // If you want to throw exceptions,
        //  you must handle those exceptions with client JS.
        async orThrow(param) {
          const { data, error } = await handleAction(param, path, this);
          if (error) throw error;
          return data;
        }
      });
      return toActionProxy(action, path + ".");
    }
  });
}
function _getActionPath(toString) {
  let path = `${"/".replace(/\/$/, "")}/_actions/${new URLSearchParams(toString()).get(ACTION_QUERY_PARAMS.actionName)}`;
  {
    path = appendForwardSlash(path);
  }
  return path;
}
async function handleAction(param, path, context) {
  if (context) {
    const pipeline = Reflect.get(context, apiContextRoutesSymbol);
    if (!pipeline) {
      throw astroCalledServerError();
    }
    const action = await pipeline.getAction(path);
    if (!action) throw new Error(`Action not found: ${path}`);
    return action.bind(context)(param);
  }
  const headers = new Headers();
  headers.set("Accept", "application/json");
  for (const [key, value] of Object.entries(internalFetchHeaders)) {
    headers.set(key, value);
  }
  let body = param;
  if (!(body instanceof FormData)) {
    try {
      body = JSON.stringify(param);
    } catch (e) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: `Failed to serialize request body to JSON. Full error: ${e.message}`
      });
    }
    if (body) {
      headers.set("Content-Type", "application/json");
    } else {
      headers.set("Content-Length", "0");
    }
  }
  const rawResult = await fetch(
    _getActionPath(() => getActionQueryString(path)),
    {
      method: "POST",
      body,
      headers
    }
  );
  if (rawResult.status === 204) {
    return deserializeActionResult({ type: "empty", status: 204 });
  }
  const bodyText = await rawResult.text();
  if (rawResult.ok) {
    return deserializeActionResult({
      type: "data",
      body: bodyText,
      status: 200,
      contentType: "application/json+devalue"
    });
  }
  return deserializeActionResult({
    type: "error",
    body: bodyText,
    status: rawResult.status,
    contentType: "application/json"
  });
}
toActionProxy();

const N8N_WEBHOOK_URL = "https://n8n.srv1124993.hstgr.cloud/webhook/2fa6cdb5-6102-463d-a353-2cd64759c834";
const server = {
  postContact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
      email: z.string().email({ message: "Informe um endereço de e-mail válido." }),
      subject: z.string().min(10, { message: "O assunto deve ter pelo menos 10 caracteres." }),
      message: z.string().min(5, { message: "A mensagem deve ter pelo menos 5 caracteres." }).max(500, {
        message: "A mensagem deve ter no máximo 500 caracteres."
      })
    }),
    handler: async (data) => {
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "User-Agent": "Astro-Action-Bot" },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "O serviço de e-mail falhou. Tente novamente mais tarde."
          });
        }
        const result = await response.json().catch(() => null);
        return {
          success: true,
          message: `Obrigado, ${data.name}, entraremos em contato!`,
          data: result
        };
      } catch (error) {
        if (error instanceof ActionError) throw error;
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro inesperado ao processar sua solicitação."
        });
      }
    }
  })
};

export { server };
