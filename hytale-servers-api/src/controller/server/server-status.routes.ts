// src/routes/server/server-status.routes.ts
import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { ServerRepository } from '../../repository/ServerRepository';

export function registerServerStatusRoutes<TPrefix extends string = ''>(
  app : Elysia<TPrefix>,
  db: Database
) : Elysia<TPrefix> {

  /**
   * GET /api/servers/status/:serverId
   * Status più recente di un singolo server
   */
  app.get(
    '/servers/status/:serverId',
    ({ params, set }) => {
      const serverId = Number(params.serverId);
      
      if (isNaN(serverId)) {
        set.status = 400;
        return { 
          success: false, 
          message: "ID server non valido" 
        };
      }

      const status = ServerRepository.getLatestStatus(db, serverId);

      if (!status) {
        set.status = 404;
        return { 
          success: false, 
          message: "Nessuno status disponibile per questo server" 
        };
      }

      return {
        success: true,
        data: status
      };
    },
    {
      params: t.Object({
        serverId: t.String({ pattern: '^[0-9]+$' })
      })
    }
  );

  /**
   * GET /api/servers/status
   * Status attuale di TUTTI i server
   */
  app.get('/servers/status', () => {
    const serversWithStatus = ServerRepository.getAllLatestStatuses(db);

    return {
      success: true,
      count: serversWithStatus.length,
      data: serversWithStatus
    };
  });

  /**
   * POST /api/servers/status/ping
   * Endpoint per aggiornare lo status (chiamato dal plugin)
   */
  app.post(
    '/servers/status/ping',
    ({ body, set }) => {
      const { secret_key, ...statusData } = body;

      if (!secret_key) {
        set.status = 400;
        return { 
          success: false, 
          message: "secret_key mancante" 
        };
      }

      const server = ServerRepository.getServerBySecret(secret_key, db);
      
      if (!server) {
        set.status = 403;
        return { 
          success: false, 
          message: "Chiave segreta non valida" 
        };
      }

      const fullData = {
        server_id: server.id ?? 0,
        ...statusData
      };

      try {
        const updatedStatus = ServerRepository.upsertServerStatus(db, fullData);
        
        return {
          success: true,
          message: "Status aggiornato",
          data: updatedStatus
        };
      } catch (err) {
        console.error("❌ Errore upsert status:", err);
        set.status = 500;
        return { 
          success: false, 
          message: "Errore durante l'aggiornamento status" 
        };
      }
    },
    {
      body: t.Object({
        secret_key: t.String(),
        players_online: t.Number(),
        players_max: t.Number(),
        is_online: t.Boolean(),
        version_name: t.Optional(t.String()),
        version_protocol: t.Optional(t.Number()),
        motd: t.Optional(t.String()),
        latency_ms: t.Optional(t.Number()),
        software_type: t.Optional(t.String()),
        last_ping_error: t.Optional(t.String())
      })
    }
  );

  /**
   * GET /api/servers/top-populated?limit=10
   * Top server più popolati
   */
  app.get(
    '/servers/top-populated',
    ({ query }) => {
      const limit = Number(query.limit) || 10;
      const top = ServerRepository.getTopPopulated(db, Math.min(limit, 50));

      return {
        success: true,
        count: top.length,
        data: top
      };
    },
    {
      query: t.Object({
        limit: t.Optional(t.String({ pattern: '^[0-9]+$' }))
      })
    }
  );

  /**
   * GET /api/servers/online-count
   * Numero totale di server online
   */
  app.get('/servers/online-count', () => {
    const count = ServerRepository.countOnlineServers(db);
    
    return {
      success: true,
      count
    };
  });

  return app;
}