// index.ts
import { Elysia, t } from 'elysia'
import { Database } from 'bun:sqlite'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'

// ---------------------
// Env
// ---------------------
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!
const JWT_SECRET = process.env.JWT_SECRET!

// ---------------------
// Database
// ---------------------
const db = new Database('servers.db', { create: true })

db.run(`
  CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    port TEXT NOT NULL,
    tags TEXT DEFAULT '',
    owner_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (owner_id) REFERENCES users(id)
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    avatar TEXT,
    email TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
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

// ---------------------
// Helpers
// ---------------------
function generateRefreshToken(): string {
  const bytes = new Uint8Array(48)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

const ACCESS_TOKEN_EXPIRY = 15 * 60 // 15 minuti in secondi
const REFRESH_TOKEN_DAYS = 7

interface DiscordTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

interface DiscordUser {
  id: string
  username: string
  avatar: string | null
  email?: string
}

// ---------------------
// App (chained per propagare i tipi)
// ---------------------
new Elysia({ prefix: '/api' })
  .use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400,
    })
  )
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: `${ACCESS_TOKEN_EXPIRY}s`,
    })
  )
  .options('/*', () => new Response(null, { status: 204 }))

  // ---------------------
  // Auth: Discord OAuth
  // ---------------------
  .post(
    '/auth/discord',
    async ({ body, jwt, set, cookie: { refresh_token } }) => {
      const { code } = body

      // 1. Scambia code con token Discord
      const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: DISCORD_REDIRECT_URI,
          scope: 'identify email',
        }),
      })

      if (!tokenRes.ok) {
        const errText = await tokenRes.text()
        set.status = 400
        return { error: 'Discord token exchange failed', details: errText }
      }

      const discordTokens = (await tokenRes.json()) as DiscordTokenResponse

      // 2. Ottieni info utente da Discord
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${discordTokens.access_token}` },
      })

      if (!userRes.ok) {
        set.status = 400
        return { error: 'Failed to fetch Discord user info' }
      }

      const discordUser = (await userRes.json()) as DiscordUser

      // 3. Crea o aggiorna utente nel DB
      const existing = db.query('SELECT * FROM users WHERE discord_id = ?').get(discordUser.id) as any

      let userId: number
      if (existing) {
        db.run(
          'UPDATE users SET username = ?, avatar = ?, email = ? WHERE discord_id = ?',
          [discordUser.username, discordUser.avatar, discordUser.email ?? null, discordUser.id]
        )
        userId = existing.id
      } else {
        db.run(
          'INSERT INTO users (discord_id, username, avatar, email) VALUES (?, ?, ?, ?)',
          [discordUser.id, discordUser.username, discordUser.avatar, discordUser.email ?? null]
        )
        const inserted = db.query('SELECT last_insert_rowid() as id').get() as { id: number }
        userId = inserted.id
      }

      // 4. Genera access token (JWT)
      const accessToken = await jwt.sign({
        sub: String(userId),
        discord_id: discordUser.id,
      })

      // 5. Genera refresh token e salva in DB
      const newRefreshToken = generateRefreshToken()
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000).toISOString()

      // Rimuovi vecchi refresh token dell'utente (max 5 sessioni attive)
      const oldTokens = db.query(
        'SELECT id FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC'
      ).all(userId) as { id: number }[]

      if (oldTokens.length >= 5) {
        const toDelete = oldTokens.slice(4).map(t => t.id)
        db.run(`DELETE FROM refresh_tokens WHERE id IN (${toDelete.join(',')})`)
      }

      db.run(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, newRefreshToken, expiresAt]
      )

      // 6. Set refresh token cookie
      refresh_token!.set({
        value: newRefreshToken,
        httpOnly: true,
        secure: false, // true in produzione con HTTPS
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60,
      })

      return {
        accessToken,
        user: {
          id: userId,
          discord_id: discordUser.id,
          username: discordUser.username,
          avatar: discordUser.avatar,
          email: discordUser.email,
        },
      }
    },
    {
      body: t.Object({
        code: t.String({ minLength: 1 }),
      }),
    }
  )

  // ---------------------
  // Auth: Refresh token
  // ---------------------
  .post('/auth/refresh', async ({ jwt, set, cookie: { refresh_token } }) => {
    const tokenValue = refresh_token?.value

    if (!tokenValue) {
      set.status = 401
      return { error: 'No refresh token' }
    }

    // Cerca token in DB
    const stored = db.query(
      'SELECT * FROM refresh_tokens WHERE token = ?'
    ).get(String(tokenValue)) as any

    if (!stored) {
      refresh_token.remove()
      set.status = 401
      return { error: 'Invalid refresh token' }
    }

    // Verifica scadenza
    if (new Date(stored.expires_at) < new Date()) {
      db.run('DELETE FROM refresh_tokens WHERE id = ?', [stored.id])
      refresh_token.remove()
      set.status = 401
      return { error: 'Refresh token expired' }
    }

    // Ottieni utente
    const user = db.query('SELECT * FROM users WHERE id = ?').get(stored.user_id) as any

    if (!user) {
      db.run('DELETE FROM refresh_tokens WHERE id = ?', [stored.id])
      refresh_token.remove()
      set.status = 401
      return { error: 'User not found' }
    }

    // Rotation: elimina vecchio, crea nuovo
    db.run('DELETE FROM refresh_tokens WHERE id = ?', [stored.id])

    const newRefreshToken = generateRefreshToken()
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000).toISOString()

    db.run(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, newRefreshToken, expiresAt]
    )

    // Nuovo access token
    const accessToken = await jwt.sign({
      sub: String(user.id),
      discord_id: user.discord_id,
    })

    refresh_token.set({
      value: newRefreshToken,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60,
    })

    return {
      accessToken,
      user: {
        id: user.id,
        discord_id: user.discord_id,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      },
    }
  })

  // ---------------------
  // Auth: Logout
  // ---------------------
  .post('/auth/logout', ({ cookie: { refresh_token } }) => {
    const tokenValue = refresh_token?.value

    if (tokenValue) {
      db.run('DELETE FROM refresh_tokens WHERE token = ?', [String(tokenValue)])
    }

    refresh_token?.remove()

    return { success: true }
  })

  // ---------------------
  // Auth: Me (protetta)
  // ---------------------
  .get('/auth/me', async ({ jwt, set, headers }) => {
    const auth = headers['authorization']
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      return { error: 'Missing authorization header' }
    }

    const token = auth.slice(7)
    const payload = await jwt.verify(token)

    if (!payload) {
      set.status = 401
      return { error: 'Invalid or expired token' }
    }

    const user = db.query('SELECT * FROM users WHERE id = ?').get(Number(payload.sub)) as any

    if (!user) {
      set.status = 404
      return { error: 'User not found' }
    }

    return {
      id: user.id,
      discord_id: user.discord_id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
    }
  })

  // ---------------------
  // Servers API
  // ---------------------

  // POST /api/servers → aggiungi (protetta)
  .post(
    '/servers',
    async ({ body, jwt, set, headers }) => {
      const auth = headers['authorization']
      if (!auth?.startsWith('Bearer ')) {
        set.status = 401
        return { error: 'Autenticazione richiesta' }
      }

      const token = auth.slice(7)
      const payload = await jwt.verify(token)

      if (!payload) {
        set.status = 401
        return { error: 'Token non valido o scaduto' }
      }

      const { name, ip, port, tags = [] } = body

      db.run(
        'INSERT INTO servers (name, ip, port, tags, owner_id) VALUES (?, ?, ?, ?, ?)',
        [name, ip, port, tags.join(','), Number(payload.sub)]
      )

      return { success: true, message: 'Server aggiunto' }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        ip: t.String({ minLength: 3 }),
        port: t.String({ pattern: '^[0-9]+$' }),
        tags: t.Optional(t.Array(t.String())),
      }),
    }
  )

  // GET /api/servers → lista (pubblica)
  .get('/servers', () => {
    const rows = db.query('SELECT * FROM servers ORDER BY created_at DESC').all() as any[]

    return rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',').filter(Boolean) : [],
    }))
  })

  .listen(3000)

console.log('Server su http://localhost:3000')
