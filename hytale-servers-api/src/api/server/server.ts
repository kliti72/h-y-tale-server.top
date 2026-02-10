import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';

export function registerServerRoutes(
  app = new Elysia({ prefix: '/api' }),
  db: Database
) {
  // POST /api/servers  → crea nuovo server
  app.post(
    '/servers',
    ({ body }) => {
      const { name, ip, port, tags = [] } = body;

      db.run(
        'INSERT INTO servers (name, ip, port, tags) VALUES (?, ?, ?, ?)',
        [name, ip, port, tags.join(',')]
      );

      return { success: true, message: 'Server aggiunto correttamente' };
    },
    {
      // Validazione body (tipo-safe grazie a Elysia + t)
      body: t.Object({
        name: t.String({ minLength: 1, error: 'Nome server obbligatorio' }),
        ip: t.String({ minLength: 3, error: 'IP non valido' }),
        port: t.String({ pattern: '^[0-9]+$', error: 'Porta deve essere numerica' }),
        tags: t.Optional(t.Array(t.String()))
      })
    }
  );

  // GET /api/servers  → lista tutti i server
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

    // Trasforma tags da stringa CSV → array
    return rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',').filter(Boolean) : []
    }));
  });

  // Ritorna l'istanza per permettere chaining ulteriore
  return app;
}