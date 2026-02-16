// src/controller/server/server.routes.ts
import { Elysia } from 'elysia';
import { Database } from 'bun:sqlite';
import { registerServerCrudRoutes } from './server-crud.routes';
import { registerServerStatusRoutes } from './server-status.routes';
import { registerServerDebugRoutes } from './server-debug.routes';

/**
 * Registra tutte le route relative ai server
 */
export function registerServerRoutes<TPrefix extends string = ''>(
  app: Elysia<TPrefix>,
  db: Database
): Elysia<TPrefix> {
  console.log('📦 Registrazione route server...');

  registerServerCrudRoutes(app, db);
  registerServerStatusRoutes(app, db);

  if (process.env.NODE_ENV !== 'production') {
    registerServerDebugRoutes(app, db);
  }

  console.log('✅ Route server registrate');

  return app;
}