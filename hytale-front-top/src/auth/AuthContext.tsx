import { createContext, useContext, createSignal, onMount, ParentComponent } from 'solid-js';

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

  // Funzione per caricare l'utente
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Not authenticated');

      const data = await res.json();

      console.log("Utente catturato:", data);

      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        console.log("Utente non catturato");
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
      setError('Impossibile verificare l\'autenticazione');
    } finally {
      console.log("Arrivato a set loading..");
      setLoading(false);
    }
  };

  // Carica l'utente all'avvio dell'app
  onMount(fetchUser);

  const login = () => {
    window.location.href = 'http://localhost:3000/auth/discord/login';
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
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