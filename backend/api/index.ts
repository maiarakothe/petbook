import type { Express, Request, Response } from 'express';
// A Vercel executa esta função como ESM. Importe o bundle produzido pelo
// Rspack com a extensão explícita, em vez do código TypeScript fonte.
import { createApp } from '../dist/main.js';

let server: Express | undefined;

async function bootstrap(): Promise<Express> {
  if (server) return server;

  const app = await createApp();
  server = app.getHttpAdapter().getInstance() as Express;
  return server;
}

export const maxDuration = 60;

export default async function handler(request: Request, response: Response) {
  const instance = await bootstrap();
  return instance(request, response);
}
