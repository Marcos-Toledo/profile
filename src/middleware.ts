import type { MiddlewareHandler } from "astro";

const ALLOWED_ORIGIN = 'https://marcostoledo.vercel.app/';

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Preflight CORS (OPTIONS)
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
      },
    });
  }

  // Demais métodos (GET/POST…)
  const response = await next();

  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
};