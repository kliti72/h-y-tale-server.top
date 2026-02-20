// src/routes/server/server-crud.routes.ts
import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { generateSecretKey } from '../../helper/GenerateSecretKey';
import { ServerRepository } from '../../repository/ServerRepository';
import { SessioneRepository } from '../../repository/SessionRepository';

export function registerServerCrudRoutes<TPrefix extends string = ''>(
  app: Elysia<TPrefix>,
  db: Database
): Elysia<TPrefix> {

  /**
   * POST /api/servers
   * Crea un nuovo server
   */
  app.post(
    '/',
    async ({ body, set, cookie }) => {
      try {
        const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
        const user = await SessioneRepository.validateSession(sessionId, db);

        if (!user || !user.userId) {
          set.status = 401;
          return {
            success: false,
            error: "Non autenticato bro! Fai login prima."
          };
        }

        console.log("📝 Creazione nuovo server:", body.name);

        const serverSecretKey = generateSecretKey();
        body.secret_key = serverSecretKey;

        const serverCreated = ServerRepository.put(db, body);
        console.log("✅ Server creato con id:", serverCreated.id);

        // Salva il proprietario
        const insertOwner = db.prepare(`
          INSERT INTO server_owners (server_id, discord_user_id, role)
          VALUES (?, ?, 'owner')
        `);

        if (serverCreated && user.userId) {
          insertOwner.run(serverCreated.id ?? 0, user.userId);
        }

        set.status = 201;
        return {
          success: true,
          message: "Server creato con successo! 🎉",
          data: serverCreated
        };

      } catch (error) {
        console.error("❌ Errore creazione server:", error);
        set.status = 500;
        return {
          success: false,
          error: "Errore nella creazione del server bro!"
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        ip: t.String(),
        port: t.String(),
        tags: t.Array(t.String()),
        description: t.String(),
        website_url: t.String(),
        discord_url: t.String(),
        banner_url: t.String(),
        rules: t.String(),
        logo_url: t.String(),
        secret_key: t.String(),
      })
    }
  );

  /**
   * GET /api/servers
   * Lista tutti i server
   */
  app.get('/all', () => {
    const servers = ServerRepository.getAll(db);

    return {
      success: true,
      count: servers.length,
      data: servers
    };
  });

  /**
   * GET /api/servers/:id
   * Ottieni un server specifico per ID
   */
  app.get(
    '/:id',
    ({ params, set }) => {
      try {
        const serverId = parseInt(params.id);

        if (isNaN(serverId)) {
          set.status = 400;
          return {
            success: false,
            error: "ID non valido bro!"
          };
        }

        const server = ServerRepository.getById(serverId, db);

        if (!server) {
          set.status = 404;
          return {
            success: false,
            error: "Server non trovato!"
          };
        }

        return {
          success: true,
          data: server
        };
      } catch (error) {
        console.error("❌ Errore get server by id:", error);
        set.status = 500;
        return {
          success: false,
          error: "Errore nel caricamento del server"
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      })
    }
  );

  /**
 * GET /api/servers
 * Lista server con pagination e sort
 */
  app.get(
    '/',
    ({ query, set }) => {
      try {
        const page = parseInt(query.page ?? '1');
        const limit = parseInt(query.limit ?? '10');
        const search = query.search ?? undefined;
        const sort = query.sort ?? 'asc';

        console.log("Arrivata all'api search", search);
        
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
          set.status = 400;
          return {
            success: false,
            error: "Parametri non validi bro!"
          };
        }

        const servers = ServerRepository.getAllQuery(db, { page, limit, sort, search });

        return {
          success: true,
          data: servers
        };
      } catch (error) {
        console.error("❌ Errore get servers:", error);
        set.status = 500;
        return {
          success: false,
          error: "Errore nel caricamento dei server"
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        search: t.Optional(t.String())
      })
    }
  );

  /**
   * PUT /api/servers/:id
   * Aggiorna un server (solo owner)
   */
  app.put(
    '/:id',
    async ({ params, body, set, cookie }) => {
      try {
        const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
        const user = await SessioneRepository.validateSession(sessionId, db);

        if (!user || !user.userId) {
          set.status = 401;
          return {
            success: false,
            error: "Non autenticato bro! Fai login prima."
          };
        }

        const serverId = parseInt(params.id);

        if (isNaN(serverId)) {
          set.status = 400;
          return {
            success: false,
            error: "ID server non valido fra!"
          };
        }

        const existingServer = ServerRepository.getById(serverId, db);

        if (!existingServer) {
          set.status = 404;
          return {
            success: false,
            error: "Server non trovato bro!"
          };
        }

        const isOwner = ServerRepository.isUserOwner(db, serverId, user.userId);

        if (!isOwner) {
          set.status = 403;
          return {
            success: false,
            error: "Ao fra, non sei il proprietario di questo server! 🚫"
          };
        }

        console.log(`✏️ User ${user.userId} sta aggiornando server ${serverId}`);

        const updateData = {
          ...body,
          secret_key: existingServer.secret_key,
          id: serverId
        };

        const updatedServer = ServerRepository.update(db, serverId, updateData);

        console.log("✅ Server aggiornato:", updatedServer);

        set.status = 200;
        return {
          success: true,
          message: "Server aggiornato con successo fra! 💯",
          data: updatedServer
        };

      } catch (error) {
        console.error("❌ Errore update server:", error);
        set.status = 500;
        return {
          success: false,
          error: "Qualcosa è andato storto nell'aggiornamento bro!"
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        name: t.String(),
        ip: t.String(),
        port: t.String(),
        tags: t.Array(t.String()),
        description: t.String(),
        website_url: t.String(),
        discord_url: t.String(),
        banner_url: t.String(),
        logo_url: t.String(),
        rules: t.String(),
      })
    }
  );

  /**
   * DELETE /api/servers/:id
   * Elimina un server (solo owner)
   */
  app.delete(
    '/:id',
    async ({ params, set, cookie }) => {
      try {
        const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
        const user = await SessioneRepository.validateSession(sessionId, db);

        if (!user || !user.userId) {
          set.status = 401;
          return {
            success: false,
            error: "Non autenticato bro!"
          };
        }

        const serverId = parseInt(params.id);

        if (isNaN(serverId)) {
          set.status = 400;
          return {
            success: false,
            error: "ID server non valido!"
          };
        }

        const existingServer = ServerRepository.getById(serverId, db);

        if (!existingServer) {
          set.status = 404;
          return {
            success: false,
            error: "Server non trovato!"
          };
        }

        const isOwner = ServerRepository.isUserOwner(db, serverId, user.userId);

        if (!isOwner) {
          set.status = 403;
          return {
            success: false,
            error: "Non puoi eliminare un server che non è tuo fra! 🚫"
          };
        }

        console.log(`🗑️ User ${user.userId} sta eliminando server ${serverId}`);

        ServerRepository.delete(db, serverId);

        set.status = 200;
        return {
          success: true,
          message: `Server "${existingServer.name}" eliminato con successo! 🗑️`
        };

      } catch (error) {
        console.error("❌ Errore delete server:", error);
        set.status = 500;
        return {
          success: false,
          error: "Errore nell'eliminazione del server bro!"
        };
      }
    },
    {
      params: t.Object({
        id: t.String()
      })
    }
  );

  /**
   * GET /api/servers/mine
   * Ottieni tutti i server dell'utente loggato
   */
  app.get(
    '/mine',
    async ({ cookie, set }) => {
      try {
        const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
        const user = await SessioneRepository.validateSession(sessionId, db);

        if (!user || !user.userId) {
          set.status = 401;
          return {
            success: false,
            error: "Non autenticato bro!"
          }; 
        }

        const servers = ServerRepository.getServersByUserID(user.userId, db);

        return {
          user: {
            id: user.userId,
          },
          servers: servers,
          count: servers.length
        };
      } catch (error) {
        console.error("❌ Errore get my servers:", error);
        set.status = 500;
        return {
          success: false,
          error: "Errore nel caricamento dei tuoi server"
        };
      }
    }
  );

  return app;
}