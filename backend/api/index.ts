let handler: any;

export default async function (req: any, res: any) {
  if (!handler) {
    const { createApp } = await import('../src/main');
    const app = await createApp();
    handler = app.getHttpAdapter().getInstance();
  }

  return handler(req, res);
}
