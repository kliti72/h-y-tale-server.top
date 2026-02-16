import Elysia, { redirect } from 'elysia';
import { randomBytes } from 'crypto'
import { sha256Base64url } from '../../helper/GeneratePKCE';
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

      console.log("Autorized code mandato", codeChallenge);

      return redirect(url.toString())
    })
 


  app.get('/discord/callback', async ({ query, set, redirect }) => {
    const { code, state, error } = query as { code?: string; state?: string; error?: string };

    let frontendRedirect = `${Bun.env.FRONTEND_URL}/?error=unknown`;

    // 1. Gestione errori iniziali
    if (error) {
      frontendRedirect = `${Bun.env.FRONTEND_URL}/?error=${encodeURIComponent(error)}`;
    } else if (!code || !state) {
      frontendRedirect = `${Bun.env.FRONTEND_URL}/?error=missing_code_or_state`;
    } else {
      const stored = authStates.get(state);
      if (!stored || Date.now() - stored.created > 10 * 60_000) {
        frontendRedirect = `${Bun.env.FRONTEND_URL}/?error=invalid_state`;
      } else {
        // Token exchange
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: Bun.env.DISCORD_CLIENT_ID!,
            client_secret: Bun.env.DISCORD_CLIENT_SECRET!,
            grant_type: "authorization_code",
            code,
            redirect_uri: Bun.env.REDIRECT_URI!,
            code_verifier: stored.verifier || "",
          }),
        });

        authStates.delete(state);

        if (!tokenRes.ok) {
          const txt = await tokenRes.text();
          console.error("Token exchange failed:", txt);
          frontendRedirect = `${Bun.env.FRONTEND_URL}/?error=token_exchange_failed`;
        } else {

          const tokenData = await tokenRes.json() as {
            access_token: string;
            token_type: string;
            expires_in: number;
            refresh_token: string;
            scope: string;
          };

          // Fetch user
          const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });

          if (!userRes.ok) {
            frontendRedirect = `${Bun.env.FRONTEND_URL}/?error=user_fetch_failed`;
          } else {

            const discordUser = await userRes.json() as {
            id: string,
            access_token: string,
            username: string,
            global_name: string,
            avatar: string,
            discriminator: string,
            email: string
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

            // Se tutto ok → successo
            const sessionId = crypto.randomUUID();
            // ... salva sessione nel DB ...

            db.run(
              `INSERT INTO sessions (session_id, user_id, access_token, refresh_token, expires_at)
              VALUES (?, ?, ?, ?, ?)`,
              [
                sessionId,
                discordUser.id,
                tokenData.access_token,
                tokenData.refresh_token,
                Date.now() + tokenData.expires_in * 1000
              ]
            );

            // Setta cookie
            const isProd = Bun.env.NODE_ENV === 'production';
            set.headers['set-cookie'] = `session=${sessionId}; HttpOnly; ${isProd ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=604800`;

            frontendRedirect = `${Bun.env.FRONTEND_URL}/?auth=success`;
          }
        }
      }
    }

    // SOLO ALLA FINE → un unico redirect
    return redirect(frontendRedirect);
  });



  app.get('/me', async ({ cookie, set }) => {

      const sessionId: string = cookie.session?.value as string;

      if (!sessionId) {
        set.status = 401;
        return { error: "Non autenticato" };
      }
      
      // Cerca la sessione
      const session = db.query(
        "SELECT user_id, access_token, expires_at FROM sessions WHERE session_id = ?"
      ).get(sessionId) as any;

      if (!session) {
        set.status = 401;
        return { error: "Sessione non valida" };
      }

      if (Date.now() > session.expires_at) {
        // Qui potresti provare a fare refresh token...
        set.status = 401;
        return { error: "Sessione scaduta" };
      }

      // Recupera l'utente
      const user = db.query(
        "SELECT id, username, global_name, avatar, discriminator, email FROM discord_users WHERE id = ?"
      ).get(session.user_id) as any;

      if (!user) {
        set.status = 404;
        return { error: "Utente non trovato" };
      }

      // Opzionale: potresti voler rifare la chiamata a Discord /users/@me
      // se vuoi dati freschissimi (es. avatar aggiornato)

    return {
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
          global_name: user.global_name,
          avatar: user.avatar
        }
      };
    });

    app.post('/logout', async ({ cookie, set }) => {
      const sessionId: string = cookie.session?.value as string;

    if (sessionId) {
      // Opzionale: rimuovi la sessione dal DB
      db.run("DELETE FROM sessions WHERE session_id = ?", [sessionId]);
    }

    const isProd = Bun.env.NODE_ENV === 'production';
    // Invalida il cookie → lo fai scadere subito
    set.headers['set-cookie'] = `session=; HttpOnly; ${isProd ? 'Secure; ' : ''}SameSite=Lax; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    // Oppure con Elysia cookie API (più pulita se usi .cookie())
    // cookie.session.remove();   ← se hai configurato cookie con schema

    set.status = 200;
    return { success: true, message: "Logout effettuato" };
  });




    return app;
}