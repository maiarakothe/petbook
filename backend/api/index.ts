import type { Express, Request, Response } from 'express';
import { createApp } from '../src/main';

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
