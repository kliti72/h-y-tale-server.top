// src/routes/server/server-debug.routes.ts
import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';

export function registerServerDebugRoutes<TPrefix extends string = ''>(
  app : Elysia<TPrefix>,
  db: Database
) : Elysia<TPrefix>  {

  /**
   * GET /api/debug/server-owners/:serverId
   * Mostra tutti gli owner di un server (per debug)
   */
  app.get(
    '/debug/server-owners/:serverId',
    ({ params }) => {
      const serverId = parseInt(params.serverId);

      const stmt = db.prepare(`
        SELECT 
          so.server_id,
          so.discord_user_id,
          so.role,
          s.name as server_name,
          du.username
        FROM server_owners so
        JOIN servers s ON s.id = so.server_id
        JOIN discord_users du ON du.id = so.discord_user_id
        WHERE so.server_id = ?
      `);

      const owners = stmt.all(serverId);

      return {
        serverId,
        owners
      };
    },
    {
      params: t.Object({
        serverId: t.String()
      })
    }
  );

  return app;
}