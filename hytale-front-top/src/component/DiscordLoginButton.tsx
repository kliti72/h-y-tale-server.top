import { Show } from 'solid-js';
import { useAuth } from '../auth/AuthContext';

export default function DiscordLoginButton() {
  const auth = useAuth();

  return (
    <Show when={!auth.loading()} fallback={<div>Caricamento auth...</div>}>
      <button
        disabled={auth.loading()}           // ← ()
        onClick={() => auth.isAuthenticated() ? auth.logout() : auth.login()}
      >
        {auth.isAuthenticated()
          ? `Logout (${auth.user()?.username ?? '??'})`
          : "Login con Discord"}
      </button>

      <Show when={auth.error()}>
        <div class="text-red-400">Errore: {auth.error()}</div>
      </Show>
    </Show>
  );
}