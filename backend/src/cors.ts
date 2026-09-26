import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const LOCALHOST_ORIGIN = /^http:\/\/localhost(?::\d+)?$/;
const PETBOOK_VERCEL_PREVIEW =
  /^https:\/\/petbook-[a-z0-9-]+-maiarakothes-projects\.vercel\.app$/;
const PETBOOK_VERCEL_PRODUCTION = /^https:\/\/petbook\.vercel\.app$/;

function configuredOrigins(): Set<string> {
  return new Set(
    (process.env.FRONTEND_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

/**
 * Permite o domínio de produção configurado e previews do projeto PetBook,
 * sem abrir a API para qualquer subdomínio da Vercel.
 */
export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Requests sem Origin (curl, health checks e comunicação servidor-a-servidor)
    // não são cross-origin e podem continuar normalmente.
    if (
      !origin ||
      LOCALHOST_ORIGIN.test(origin) ||
      PETBOOK_VERCEL_PRODUCTION.test(origin) ||
      PETBOOK_VERCEL_PREVIEW.test(origin) ||
      configuredOrigins().has(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin não permitida pelo CORS: ${origin}`));
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  optionsSuccessStatus: 204,
};
