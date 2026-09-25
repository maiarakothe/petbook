import { createApp } from '../src/main';

let handler: any;

export default async function (req: any, res: any) {
  if (!handler) {
    const app = await createApp();
    handler = app.getHttpAdapter().getInstance();
  }

  return handler(req, res);
}
