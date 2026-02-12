import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';

// Definiamo i tipi minimi necessari per non avere errori di tipo unknown
interface SessionRow {
  user_id: string;
  access_token: string;
  expires_at: number;
}

interface DiscordUserRow {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  discriminator: string | null;
  email: string | null;
}

interface ServerInput {
  name: string;
  ip: string;
  port: string;
  tags?: string;
}

export function registerServerRoutes(
  app = new Elysia({ prefix: '/api' }),
  db: Database
) {
  // POST /api/servers
  app.post(
    '/servers',
    async ({ body, set, cookie }) => {
      const sessionId = cookie.session?.value as string | undefined;

      if (!sessionId) {
        set.status = 401;
        return { error: 'Sessione non trovata' };
      }

      const session = db
        .query(
          'SELECT user_id, access_token, expires_at FROM sessions WHERE session_id = ?'
        )
        .get(sessionId) as SessionRow | null;

      if (!session?.user_id) {
        set.status = 401;
        return { error: 'Sessione non valida' };
      }

      const user = db
        .query(
          'SELECT id, username, global_name, avatar, discriminator, email FROM discord_users WHERE id = ?'
        )
        .get(session.user_id) as DiscordUserRow | null;

      if (!user?.id) {
        set.status = 401;
        return { error: 'Utente non trovato' };
      }

      // Validazione manuale (puoi sostituirla con lo schema t.Object se vuoi type inference più forte)
      const { name, ip, port, tags = '' } = body as ServerInput;

      if (!name || !ip || !port) {
        set.status = 400;
        return { error: 'Nome, IP e porta sono obbligatori' };
      }

      let tagsString = '';

      if (typeof tags === 'string') {
            // se arriva già come stringa (es. "tag1,tag2")
            tagsString = tags.trim();
          } else if (Array.isArray(tags)) {
            tagsString = (tags as string[])
            .map(tag => tag.trim())           
              .filter(tag => tag.length > 0)  
              .join(',');          
          }

          
      try {
        db.transaction(() => {
          const insertServer = db.prepare(`
            INSERT INTO servers (name, ip, port, tags)
            VALUES (?, ?, ?, ?)
          `);


          const serverResult = insertServer.run(name, ip, port, tagsString);
          const serverId = serverResult.lastInsertRowid;

          const insertOwner = db.prepare(`
            INSERT INTO server_owners (server_id, discord_user_id, role)
            VALUES (?, ?, 'owner')
          `);

          insertOwner.run(serverId, user.id);
        })();

        set.status = 201;
        return {
          message: 'Server creato con successo',
          name,
          ip,
          port,
          tags
        };
      } catch (err) {
        console.error(err);
        set.status = 500;
        return { error: 'Errore durante la creazione del server' };
      }
    },

    // Schema opzionale – se lo metti, TypeScript inferisce body automaticamente
    // Se lo togli, devi fare cast come sopra (body as ServerInput)
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        ip: t.String({ minLength: 3 }),
        port: t.String(),
        tags: t.Optional(t.ArrayString())
      })
    }
  );

  // GET /api/servers
  app.get('/servers', () => {
    const rows = db
      .query('SELECT * FROM servers ORDER BY created_at DESC')
      .all() as Array<{
        id: number;
        name: string;
        ip: string;
        port: string;
        tags: string;
        created_at: string;
      }>;

    return rows.map(row => ({
      ...row,
      tags: row.tags
        ? row.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []
    }));
  });

  // Aggiungila dentro la funzione registerServerRoutes

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