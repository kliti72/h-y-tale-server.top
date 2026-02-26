// src/routes/server/server-status.routes.ts
import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { ServerRepository } from '../../repository/serverRepository';
import { statusRepository } from '../../repository/statusRepository';

export function registerServerStatusRoutes<TPrefix extends string = ''>(
  app: Elysia<TPrefix>,
  db: Database
): Elysia<TPrefix> {

  /**
   * GET /api/servers/status/:serverId
   * Status più recente di un singolo server
   */
  app.get(
    '/status/:serverId',
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
   * Rimuovere questo tag per la sicurezza dei secret token
   */
  app.get('/status', () => {
    const serversWithStatus = ServerRepository.getAllLatestStatuses(db);

    return {
      success: true,
      count: serversWithStatus.length,
      data: serversWithStatus
    };
  });

  /**
 * POST /api/servers/status/ping/secondary
 * Endpoint per aggiornare lo status dei server secondari (network)
 * I secondary si identificano con secondary_id e aggiornano solo la loro riga
 * TTL implicito: il principale ignora i secondary con last_ping > 45s
 */
  app.post(
    '/status/ping/secondary',
    ({ body, set }) => {
      const { secret_key, secondary_id, players_online } = body;

      if (!secret_key) {
        set.status = 400;
        return {
          success: false,
          message: "secret_key mancante"
        };
      }

      // Valida che il server principale esista con quella secret_key
      const principalServer = ServerRepository.getServerBySecret(secret_key, db);

      if (!principalServer) {
        set.status = 403;
        return {
          success: false,
          message: "Chiave segreta non valida"
        };
      }

      try {
        console.log(`Ping secondary [${secondary_id}] per server ${principalServer.id}`);

        // Upsert della riga del secondary — crea se non esiste, aggiorna se esiste
        const updatedSecondary = statusRepository.upsertSecondaryStatus(db, {
          server_id: principalServer.id ?? 0,
          secondary_id,
          players_online,
          last_ping: new Date().toISOString()
        });

        return {
          success: true,
          message: "Status secondary aggiornato",
          data: updatedSecondary
        };
      } catch (err) {
        console.error("❌ Errore upsert secondary status:", err);
        set.status = 500;
        return {
          success: false,
          message: "Errore durante l'aggiornamento status secondary"
        };
      }
    },
    {
      body: t.Object({
        secret_key: t.String(),
        secondary_id: t.String(),       // es. "lobby-eu", "survival-1" — nome univoco del sub-server
        players_online: t.Number(),     // valore assoluto, non delta
      })
    }
  );

  /**
   * POST /api/servers/status/ping
   * Endpoint per aggiornare lo status (chiamato dal plugin)
   */
  app.post(
    '/status/ping',
    ({ body, set }) => {
      const { secret_key, ...statusData } = body;
      console.log("Body in arrivo", body);
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

      const secondaryPlayers = statusRepository.getSecondaryPlayersSum(db, server.id ?? 0);

      const fullData = {
        server_id: server.id ?? 0,
        ...statusData,
        players_online: statusData.players_online + secondaryPlayers  // somma aggregata 🔥
      };

      try {
        console.log("Tentativo di update status tramite ping..");
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
        latency_ms: t.Optional(t.Number()),
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