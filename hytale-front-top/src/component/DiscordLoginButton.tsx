import { createSignal, onMount, Show } from 'solid-js';



export default function DiscordLoginButton() {
      
      const [user, setUser] = createSignal<{ id: string; username: string; avatar?: string; global_name: string } | null>(null);
      const [loading, setLoading] = createSignal(true);

      onMount(async () => {
        try {
          const res = await fetch('http://localhost:3000/auth/me', {
            method: 'GET',
            credentials: 'include',          // ← questo è fondamentale!
            headers: {
              'Accept': 'application/json',
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.authenticated) {
              setUser(data.user);            // { id, username, global_name, avatar, ... }
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
          
        } catch (err) {
          console.error('Errore check auth:', err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });

  return (
    <div style={{ "padding": "1rem", "font-family": "system-ui, sans-serif" }}>
<Show when={!loading()} fallback={<p>Caricamento...</p>}>
  <Show when={user()} fallback={<button onClick={() => window.location.href = 'http://localhost:3000/auth/discord/login'}>
    Login con Discord
  </button>}>
    <div>
      Bentornato {user()?.global_name}!
      <img 
        src={`https://cdn.discordapp.com/avatars/${user()?.id}/${user()?.avatar}.png?size=64`} 
        alt="Avatar" 
        width={64} 
      />


    <button onClick={async () => {
      try {
        const res = await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',                  // o GET se preferisci
          credentials: 'include',
        });

        if (res.ok) {
          setUser(null);
          // Opzionale: redirect o ricarica pagina
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Errore logout:', err);
      }
    }}>
      Logout
    </button>

    </div>
  </Show>
</Show>
    </div>
  );
}