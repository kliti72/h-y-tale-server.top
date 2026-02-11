import { createContext, createSignal, useContext, onMount, type JSX } from 'solid-js'

const API_URL = 'http://localhost:3000' 
export interface User {
  id: number
  discord_id: string
  username: string
  avatar: string | null
  email?: string
}

interface AuthContextValue {
  user: () => User | null
  accessToken: () => string | null
  isLoggedIn: () => boolean
  loading: () => boolean
  login: (code: string) => Promise<void>
  logout: () => Promise<void>
  getAuthHeaders: () => any
}

const AuthContext = createContext<AuthContextValue>()


export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null)
  const [accessToken, setAccessToken] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(true)

  const isLoggedIn = () => user() !== null

  const getAuthHeaders = () => {
    const token = accessToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Tenta il refresh al mount (ripristina sessione)
  onMount(async () => {
    try {
      await refreshAccessToken()
    } catch {
      // Nessuna sessione attiva
    } finally {
      setLoading(false)
    }
  })

  async function refreshAccessToken(): Promise<string> {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!res.ok) {
      setUser(null)
      setAccessToken(null)
      throw new Error('Refresh failed')
    }

    const data = await res.json()
    setAccessToken(data.accessToken)
    setUser(data.user)
    return data.accessToken
  }

  async function login(code: string) {
    const res = await fetch(`${API_URL}/api/auth/discord`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }))
      throw new Error(err.error || 'Login failed')
    }

    const data = await res.json()
    setAccessToken(data.accessToken)
    setUser(data.user)
  }

  async function logout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {})

    setUser(null)
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn,
        loading,
        login,
        logout,
        getAuthHeaders,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  console.log(AuthContext)
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
