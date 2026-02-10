import Elysia, { redirect } from 'elysia';
import { randomBytes } from 'crypto'
import { sha256Base64url } from '../../helper/generatePKCE';
import { Database } from 'bun:sqlite'

export function registerAuthRoutes(
  app = new Elysia({prefix: "/auth"}),
  db : Database
) {

    const authStates = new Map<string, { verifier?: string; created: number }>()
    
    // Login api
    app.get('/discord/login', async () => {
    
      const state       = randomBytes(16).toString('hex')
      const codeVerifier = randomBytes(32).toString('base64url')           // PKCE
      const codeChallenge = await sha256Base64url(codeVerifier)            // PKCE
    
      const url = new URL("https://discord.com/oauth2/authorize")
    
      authStates.set(state, { verifier: codeVerifier, created: Date.now() })
    
      url.searchParams.set("client_id",     Bun.env.DISCORD_CLIENT_ID)
      url.searchParams.set("redirect_uri",  Bun.env.REDIRECT_URI)
      url.searchParams.set("response_type", "code")
      url.searchParams.set("scope",         Bun.env.SCOPES)
      url.searchParams.set("state",         state)
      url.searchParams.set("code_challenge", codeChallenge)
      url.searchParams.set("code_challenge_method", "S256")
    
      return redirect(url.toString())
    })
    
    // Discord callback cookie storage
    app.get('/discord/callback', async ({ query, set, redirect }) => {
      const { code, state, error } = query as { code?: string; state?: string; error?: string }
    
      // Gestisci Errore 400 not found
      if (error) {
        set.status = 400
        return redirect(`${Bun.env.FRONTEND_URL}/?error=${encodeURIComponent(error)}`)
      }
    
      // Errore del codice o stato
      if (!code || !state) {
        set.status = 400
        return redirect(`${Bun.env.FRONTEND_URL}/?error=missing_code_or_state`)
      }
    
      // verifica che la richiesta di autenticazione si iniziata da meno di 10m
      const stored = authStates.get(state)
      if (!stored || Date.now() - stored.created > 10 * 60_000) { // 10 min
        set.status = 400
        return redirect(`${Bun.env.FRONTEND_URL}/?error=invalid_state`)
      }

        
      // Scambia code → token
      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id:     Bun.env.DISCORD_CLIENT_ID,
          client_secret: Bun.env.DISCORD_CLIENT_SECRET,
          grant_type:    "authorization_code",
          code,
          redirect_uri:  Bun.env.REDIRECT_URI,
          code_verifier: stored.verifier || "",
        }),
      })
    
      authStates.delete(state)

      if (!tokenRes.ok) {
        const txt = await tokenRes.text()
        console.error(txt)
        return redirect(`${Bun.env.FRONTEND_URL}/?error=token_exchange_failed`)
      }
    
      const tokens = await tokenRes.json() as {
        access_token: string
        refresh_token: string
        expires_in: number
        scope: string
        token_type: string
      }
    
      // Opzionale: prendi info utente
      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
    
      const user = userRes.ok ? await userRes.json() : null
    
      // ── Qui decidi come gestire la sessione ──────────────────────
      // Opzione semplice: session ID random + salva token in memoria (o db)

      const discordUser = await userRes.json() as {
        id: string
        username: string
        global_name: string | null
        avatar: string | null
        discriminator: string
        email: string | null
      };

      // 3. Salva / aggiorna utente (UPSERT)
      db.run(
        `INSERT INTO discord_users (id, username, global_name, avatar, discriminator, email)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          username = excluded.username,
          global_name = excluded.global_name,
          avatar = excluded.avatar`,
        [discordUser.id, discordUser.username, discordUser.global_name, discordUser.avatar, discordUser.discriminator, discordUser.email]
      );

      // 4. Crea sessione
      const sessionId = crypto.randomUUID();

      db.run(
        `INSERT INTO sessions (session_id, user_id, access_token, refresh_token, expires_at)
        VALUES (?, ?, ?, ?, ?)`,
        [
          sessionId,
          discordUser.id,
          tokens.access_token,
          tokens.refresh_token,
          Date.now() + tokens.expires_in * 1000
        ]
      );
    
      // Salva lato server (in memoria per ora – poi puoi usare db/redis)
      // Esempio: sessionStore.set(sessionId, { discord: { tokens, user }, created: Date.now() })
      const isProd = Bun.env.NODE_ENV === 'production' || Bun.env.isProduction === 'true';

      set.headers['set-cookie'] = [
        `session=${sessionId}`,
        'HttpOnly',
        isProd ? 'Secure' : '',
        'SameSite=Lax',
        'Path=/',
        'Max-Age=604800'
      ].filter(Boolean).join('; ');

    
      // Redirect al frontend con successo
      return redirect(`${Bun.env.FRONTEND_URL}/?auth=success`)
    })


    return app;
}