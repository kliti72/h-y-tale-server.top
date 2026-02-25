import { createContext, useContext, createSignal, onMount, ParentComponent } from 'solid-js';
import { isProduction } from './producation';

type User = {
  id: string;
  username: string;
  global_name?: string;
  avatar?: string;
  discriminator?: string;
};

type AuthContextType = {
  user: () => User | null;              // ← accessor
  isAuthenticated: () => boolean;
  loading: () => boolean;
  error: () => string | null;
  login: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>();

export const AuthProvider: ParentComponent = (props) => {
  
  const [user, setUser] = createSignal<User | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const logoutUrl = !isProduction() ? "http://localhost:3000/auth/logout" : "https://h-y-tale-server.top/api/auth/logout"
  const loginUrl = !isProduction() ? 'http://localhost:3000/auth/discord/login' : 'https://h-y-tale-server.top/api/auth/discord/login';
  const userUrl =  !isProduction() ? 'http://localhost:3000/auth/me' : 'https://h-y-tale-server.top/api/auth/me';

  // Funzione per caricare l'utente
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(userUrl, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Not authenticated');

      const data = await res.json();


      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setError('Impossibile verificare l\'autenticazione');
    } finally {
      setLoading(false);
    }
  };

  // Carica l'utente all'avvio dell'app
  onMount(fetchUser);

  const login = () => {
    window.location.href = loginUrl;
  };

  const logout = async () => {
    try {
      await fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refresh = fetchUser;

  const value = {
    user,
    isAuthenticated: () => !!user(),
    loading,
    error,
    login,
    logout,
    refresh: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
};

// Hook personalizzato
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato dentro un AuthProvider');
  }
  return context;
};