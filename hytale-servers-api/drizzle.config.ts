import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',     // dove salverà il file generato
  out: './drizzle/migrations',      // cartella per migrazioni future
  dialect: 'sqlite',
  driver: "d1-http",          // importante: bun:sqlite usa better-sqlite3 sotto
  dbCredentials: {
    url: 'servers.db',                // percorso relativo al file .db
  },
} satisfies Config;