// index.ts
import { Elysia, t } from 'elysia'
import { Database } from 'bun:sqlite'
import { cors } from '@elysiajs/cors'

const db = new Database('servers.db', { create: true })

// Crea tabella se non esiste
db.run(`
  CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    port TEXT NOT NULL,
    tags TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  )
`)

// Popola con dati di esempio SOLO se la tabella è vuota
const count = db.query('SELECT COUNT(*) as cnt FROM servers').get() as { cnt: number }
if (count.cnt === 0) {
  const examples = [
    { name: "Ethereal Grove",     ip: "play.ethereal.it",      port: "25565", tags: ["Survival", "ITA", "PvE"] },
    { name: "Ancient Canopy",      ip: "canopy.hytale.net",    port: "25566", tags: ["PvP", "Economy", "New"] },
    { name: "Luminwood Haven",     ip: "luminwood.fun",        port: "19132", tags: ["Creative", "Community"] },
    { name: "Mistveil Enclave",    ip: "mistveil.org",         port: "25565", tags: ["Roleplay", "Whitelist"] },
    { name: "Starroot Sanctuary",  ip: "starroot.hytale.gg",   port: "25565", tags: ["Minigames", "Family-Friendly"] },
  ]

  const insert = db.prepare(
    'INSERT INTO servers (name, ip, port, tags) VALUES (?, ?, ?, ?)'
  )

  for (const ex of examples) {
    insert.run(ex.name, ex.ip, ex.port, ex.tags.join(','))
  }

  console.log(`Inseriti ${examples.length} server di esempio`)
}

// --------------------------
// API
// --------------------------
const app = new Elysia({ prefix: '/api' })

app.use(
  cors({
    origin: 'http://localhost:5173',          // esatto origin del tuo frontend (Vite)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,                        // se userai cookie/auth dopo
    maxAge: 86400                             // cache preflight
  })
)
app.options('/*', () => new Response(null, { status: 204 }));

// POST /api/servers → aggiungi
app.post(
  '/servers',
  ({ body }) => {
    const { name, ip, port, tags = [] } = body

    db.run(
      'INSERT INTO servers (name, ip, port, tags) VALUES (?, ?, ?, ?)',
      [name, ip, port, tags.join(',')]
    )

    return { success: true, message: 'Server aggiunto' }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      ip: t.String({ minLength: 3 }),
      port: t.String({ pattern: '^[0-9]+$' }),
      tags: t.Optional(t.Array(t.String()))
    })
  }
)

// GET /api/servers → lista con tags come array
app.get('/servers', () => {
  const rows = db.query('SELECT * FROM servers ORDER BY created_at DESC').all() as any[]

  // Trasforma tags da stringa a array
  return rows.map(row => ({
    ...row,
    tags: row.tags ? row.tags.split(',').filter(Boolean) : []
  }))
})

app.listen(3000)

console.log('🚀 Server su http://localhost:3000')