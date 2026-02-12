import { Show, type Component } from "solid-js";
import { useAuth } from "../auth/AuthContext";

const DiscordLoginButton: Component = () => {
  const auth = useAuth();

  const isAuthenticated = () => auth.isAuthenticated();
  const user = () => auth.user();

  return (
    <Show
      when={!auth.loading()}
      fallback={
        <div class="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 bg-gray-800/50 rounded-lg animate-pulse">
          <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" />
          </svg>
          Caricamento...
        </div>
      }
    >
      <button
        type="button"
        disabled={auth.loading()}
        onClick={() => (isAuthenticated() ? auth.logout() : auth.login())}
        class={`
          group relative inline-flex items-center gap-2.5
          px-5 py-2.5 text-sm font-medium tracking-wide
          transition-all duration-200 ease-out
          rounded-xl border border-transparent
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/40
          disabled:opacity-60 disabled:cursor-not-allowed
          ${
            isAuthenticated()
              ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-900/30 hover:shadow-red-900/50"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50"
          }
        `}
      >
        {/* Icona Discord */}
        <svg
          class="w-5 h-5 transition-transform group-hover:scale-110"
          viewBox="0 0 127.14 96.36"
          fill="currentColor"
        >
          <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-.09 56.6.03 80.21a113.31 113.31 0 0 0 33.09 16.59 77.06 77.06 0 0 0 6.75-10.33 70.33 70.33 0 0 1-10.81-5.14c.91-.66 1.8-1.34 2.66-2.03a73.6 73.6 0 0 0 62.36 0c.87.69 1.75 1.37 2.66 2.03a70.8 70.8 0 0 1-10.82 5.15 77 77 0 0 0 6.75 10.33 113.3 113.3 0 0 0 33.08-16.59c.13-23.61-2.75-47.56-25.29-72.14zM42.45 65.69C38.49 65.69 35 62.58 35 58.62s3.49-7.07 7.45-7.07 7.45 3.12 7.45 7.07-3.49 7.07-7.45 7.07zm42.24 0c-3.96 0-7.45-3.12-7.45-7.07s3.49-7.07 7.45-7.07 7.45 3.12 7.45 7.07-3.49 7.07-7.45 7.07z" />
        </svg>

        <span>
          {isAuthenticated()
            ? `Esci • ${user()?.username ?? user()?.global_name ?? "utente"}`
            : "Accedi con Discord"}
        </span>

        {/* Effetto hover glow */}
        <span
          class={`
            absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300
            ${isAuthenticated() ? "from-red-500 to-rose-500" : "from-indigo-500 to-blue-500"}
          `}
        />
      </button>
    </Show>
  );
};

export default DiscordLoginButton;