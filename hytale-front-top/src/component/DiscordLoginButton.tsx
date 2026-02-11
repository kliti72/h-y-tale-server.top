import { createSignal, onMount, Show } from 'solid-js'
import { useAuth } from '../context/AuthContext'

const CLIENT_ID = '1470838972711436401'
const REDIRECT_URI = 'http://localhost:5173'
const SCOPES = 'identify email'

const DISCORD_AUTH_URL =
  `https://discord.com/oauth2/authorize?` +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
  }).toString()

export default function DiscordLoginButton() {
  const { user, isLoggedIn, login, logout, loading } = useAuth()
  const [error, setError] = createSignal<string | null>(null)
  const [loggingIn, setLoggingIn] = createSignal(false)

  // Al mount: se c'è un code nell'URL, scambialo via backend
  onMount(async () => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname)
      setLoggingIn(true)
      setError(null)

      try {
        await login(code)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore durante l'autenticazione")
      } finally {
        setLoggingIn(false)
      }
    }
  })

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div style={{ padding: '1rem', 'font-family': 'system-ui, sans-serif' }}>
      <Show when={loading() || loggingIn()}>
        <p class="text-zinc-400">Autenticazione in corso...</p>
      </Show>

      <Show when={error()}>
        <p style={{ color: '#ff5555', 'font-weight': 'bold' }}>Errore: {error()}</p>
      </Show>

      <Show when={!loading() && !loggingIn() && !isLoggedIn()}>
        <button
          onClick={() => (window.location.href = DISCORD_AUTH_URL)}
          style={{
            background: '#5865F2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            'border-radius': '8px',
            'font-size': '16px',
            cursor: 'pointer',
            display: 'flex',
            'align-items': 'center',
            gap: '8px',
          }}
        >
          Registrati con Discord
          <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-.45 56.6.14 80.21a113.31 113.31 0 0 0 33.09 16.59 77.06 77.06 0 0 0 6.75-10.3 70.33 70.33 0 0 1-10.81-5.14c.91-.66 1.8-1.34 2.66-2.03a73.6 73.6 0 0 0 62.36 0c.87.69 1.75 1.37 2.66 2.03a70.8 70.8 0 0 1-10.82 5.15 77.4 77.4 0 0 0 6.75 10.29 113.5 113.5 0 0 0 33.09-16.59c.59-23.61-2.65-47.56-12.44-72.14z" />
          </svg>
        </button>
      </Show>

      <Show when={!loading() && isLoggedIn()}>
        <div class="flex items-center gap-3">
          <Show when={user()?.avatar}>
            <img
              src={`https://cdn.discordapp.com/avatars/${user()!.discord_id}/${user()!.avatar}.png?size=32`}
              alt="avatar"
              class="w-8 h-8 rounded-full"
            />
          </Show>
          <span class="text-white font-medium">{user()!.username}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#4f545c',
              color: 'white',
              border: 'none',
              'border-radius': '6px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </Show>
    </div>
  )
}
