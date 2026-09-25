import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      const isVercelPreview =
        origin?.startsWith('https://petbook-') &&
        origin.endsWith('.vercel.app');

      if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
        return;
      }

      callback(new Error('Origem não permitida pelo CORS'), false);
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
