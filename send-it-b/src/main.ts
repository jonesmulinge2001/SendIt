/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Whitelist function: allow localhost, your prod domain, and any vercel.app subdomain
  app.enableCors({
    origin: (origin, cb) => {
      const allow =
        !origin || // curl/Postman or same-origin
        origin === 'http://localhost:4200' ||
        origin === 'https://send-it-2xlq.vercel.app' ||        // your stable prod URL
        /\.vercel\.app$/.test(origin);                         // any Vercel preview
      cb(allow ? null : new Error('CORS blocked: ' + origin), allow);
    },
    credentials: true, // set to true only if you actually use cookies
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
