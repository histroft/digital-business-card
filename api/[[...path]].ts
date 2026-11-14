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

/** Vercel catch-all serverless entry point. */
export default async function handler(request: Request, response: Response): Promise<void> {
  // Rewrites route Vercel's /api/* function back to Nest's public paths.
  if (request.url?.startsWith('/api/')) request.url = request.url.slice(4) || '/';
  if (request.url === '/api') request.url = '/';

  const server = await getServer();
  server(request, response);
}
