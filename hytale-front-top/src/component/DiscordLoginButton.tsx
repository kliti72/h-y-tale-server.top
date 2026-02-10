import { createSignal, onMount, Show } from 'solid-js';

const CLIENT_ID = "1470838972711436401";

const REDIRECT_URI = "http://localhost:5173"; 

// Scopes che ti servono (modificali secondo necessità)
const SCOPES = "identify email guilds"; 

const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?` + 
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
  }).toString();

export default function DiscordLoginButton() {
  const [code, setCode] = createSignal<string | null>(null);
  const [tokenData, setTokenData] = createSignal<any>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  // 1. Al mount leggiamo se c'è il code nell'URL
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("code");
    
    if (codeFromUrl) {
      setCode(codeFromUrl);
      // Puliamo l'URL per bellezza (rimuove ?code=...)
      window.history.replaceState({}, document.title, window.location.pathname);
      exchangeCodeForToken(codeFromUrl);
    }
  });

  // 2. Scambia il code con access_token + refresh_token + info utente
  async function exchangeCodeForToken(authCode: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: "1470838972711436401",  
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: REDIRECT_URI,
          scope: SCOPES,
        }),
      });

      if (!response.ok) {
        throw new Error(`Discord error: ${response.status} ${await response.text()}`);
      }

      const data = await response.json();
      setTokenData(data);

      // Opzionale: prendi subito le info utente
      if (data.access_token) {
        await fetchUserInfo(data.access_token);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Errore durante l'autenticazione");
    } finally {
      setLoading(false);
    }
  }

  // Opzionale: recupera /users/@me con l'access token
  async function fetchUserInfo(accessToken: string) {
    try {
      const res = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const user = await res.json();
        setTokenData((prev) => ({ ...prev, user }));
      }
    } catch (err) {
      console.warn("Impossibile recuperare info utente", err);
    }
  }

  return (
    <div style={{ "padding": "1rem", "font-family": "system-ui, sans-serif" }}>
      <Show when={!code() && !tokenData()}>
        <button
          onClick={() => window.location.href = DISCORD_AUTH_URL}
          disabled={loading()}
          style={{
            background: "#5865F2",
            color: "white",
            "border": "none",
            padding: "12px 24px",
            "border-radius": "8px",
            "font-size": "16px",
            cursor: "pointer",
            "display": "flex",
            "align-items": "center",
            gap: "8px",
            opacity: loading() ? 0.7 : 1,
          }}
        >
          {loading() ? "Attendi..." : "Registrati con Discord"}
          <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-.45 56.6.14 80.21a113.31 113.31 0 0 0 33.09 16.59 77.06 77.06 0 0 0 6.75-10.3 70.33 70.33 0 0 1-10.81-5.14c.91-.66 1.8-1.34 2.66-2.03a73.6 73.6 0 0 0 62.36 0c.87.69 1.75 1.37 2.66 2.03a70.8 70.8 0 0 1-10.82 5.15 77.4 77.4 0 0 0 6.75 10.29 113.5 113.5 0 0 0 33.09-16.59c.59-23.61-2.65-47.56-12.44-72.14z"/>
          </svg>
        </button>
      </Show>

      <Show when={loading()}>
        <p>Autenticazione in corso...</p>
      </Show>

      <Show when={error()}>
        <p style={{ color: "#ff5555", "font-weight": "bold" }}>
          Errore: {error()}
        </p>
      </Show>

      <Show when={tokenData()}>
        <div>
          <h3>Registrazione completata!</h3>
          <pre style={{
            background: "#2c2f33",
            color: "#fff",
            padding: "1rem",
            "border-radius": "8px",
            "overflow-x": "auto",
            "max-width": "100%",
          }}>
            {JSON.stringify(tokenData(), null, 2)}
          </pre>

          <button
            onClick={() => {
              setCode(null);
              setTokenData(null);
              setError(null);
            }}
            style={{
              padding: "8px 16px",
              background: "#4f545c",
              color: "white",
              border: "none",
              "border-radius": "6px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </Show>
    </div>
  );
}