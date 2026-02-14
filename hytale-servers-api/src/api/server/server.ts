import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { generateSecretKey } from '../../helper/generateSecretKey';
import { ServerRepository, type Server } from '../../repository/ServerRepository';
import { SessioneRepository } from '../../repository/SessionRepository';
import { serve } from 'bun';


export function registerServerRoutes(
  app = new Elysia({ prefix: '/api' }),
  db: Database
) {
  // POST /api/servers
  app.post(
    '/servers',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);
      console.log("Body arrivato", body);

      const serverSecretKey = generateSecretKey();

      const serverCreated = ServerRepository.put(db, {
        name: body.name,
        ip: body.ip,
        port: body.port,
        tags: body.tags,
        secret_key: serverSecretKey
      });

      console.log("Server creato con id", serverCreated.id);

      // Salva il proprietario
      const insertOwner = db.prepare(`
        INSERT INTO server_owners (server_id, discord_user_id, role)
        VALUES (?, ?, 'owner')
      `);

      if(serverCreated != undefined && user.userId != null) {
        insertOwner.run(serverCreated.id ?? 0, user.userId);
      }

    }, {
    body: t.Object({
      name: t.String(),
      ip: t.String(),
      port: t.String(),
      tags: t.Array(t.String()),
    })
  });

  // GET /api/servers
  app.get('/servers', () => {
    return ServerRepository.getAll(db);
  });

  // GET /api/servers
  app.get('/servers/:name', (body) => {
    const name = body.params.name;

    const rows = db.query(
      'SELECT * FROM servers WHERE name = ?'
    ).get(name);

    return rows;
  });


  app.get(
    '/servers/mine',
    async ({ cookie, set }) => {
      const sessionId = cookie.session?.value as string | undefined;

      if (!sessionId) {
        set.status = 401;
        return { error: 'Sessione non trovata' };
      }

      // Recupera la sessione
      const session = db
        .query(
          'SELECT user_id, expires_at FROM sessions WHERE session_id = ?'
        )
        .get(sessionId) as { user_id: string; expires_at: number } | null;

      if (!session?.user_id) {
        set.status = 401;
        return { error: 'Sessione non valida o scaduta' };
      }

      // Recupera l'utente (opzionale, ma utile per mostrare username)
      const user = db
        .query('SELECT id, username, global_name FROM discord_users WHERE id = ?')
        .get(session.user_id) as { id: string; username: string; global_name: string | null } | null;

      if (!user) {
        set.status = 410; // Gone – utente cancellato
        return { error: 'Utente non trovato' };
      }

      // Query: tutti i server dove l'utente è owner (o ha un ruolo)
      const servers = db
        .query(`
        SELECT 
          s.id,
          s.name,
          s.ip,
          s.port,
          s.tags,
          s.secret_key,
          s.created_at,
          so.role
        FROM servers s
        INNER JOIN server_owners so ON so.server_id = s.id
        WHERE so.discord_user_id = ?
        ORDER BY s.created_at DESC
      `)
        .all(user.id) as Array<{
          id: number;
          name: string;
          ip: string;
          port: string;
          tags: string;
          secret_key: string,
          created_at: string;
          role: string;
        }>;

      // Trasforma tags in array + aggiungi info utente proprietario (opzionale)
      const result = servers.map(server => ({
        ...server,
        tags: server.tags
          ? server.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],
        // se vuoi mostrare chi è l'utente (utile per debug o UI)
        owner: {
          id: user.id,
          username: user.username,
          displayName: user.global_name || user.username
        }
      }));

      return {
        user: {
          id: user.id,
          username: user.username,
          displayName: user.global_name || user.username
        },
        servers: result,
        count: result.length
      };
    },

    // Opzionale: definisci la risposta per OpenAPI / type safety
    {
      response: {
        200: t.Object({
          user: t.Object({
            id: t.String(),
            username: t.String(),
            displayName: t.String()
          }),
          servers: t.Array(
            t.Object({
              id: t.Number(),
              name: t.String(),
              ip: t.String(),
              port: t.String(),
              tags: t.Array(t.String()),
              secret_key: t.String(),
              created_at: t.String(),
              role: t.String(),
              owner: t.Object({
                id: t.String(),
                username: t.String(),
                displayName: t.String()
              })
            })
          ),
          count: t.Number()
        }),
        401: t.Object({ error: t.String() })
      }
    }
  );

  return app;
}