import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from './cors';

export async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);

  await app.init();

  return app;
}

async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3001);
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
