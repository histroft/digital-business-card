import type { Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

type ExpressHandler = (request: Request, response: Response) => void;

let serverPromise: Promise<ExpressHandler> | undefined;

async function getServer(): Promise<ExpressHandler> {
  if (!serverPromise) {
    serverPromise = (async () => {
      const app = await NestFactory.create(AppModule, { logger: false });
      app.enableCors();
      await app.init();
      return app.getHttpAdapter().getInstance() as ExpressHandler;
    })();
  }

  return serverPromise;
}

/** Vercel serverless entry point. */
export default async function handler(request: Request, response: Response): Promise<void> {
  const server = await getServer();
  server(request, response);
}
