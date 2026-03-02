import { Show, type Component } from "solid-js";
import { useAuth } from "../../auth/AuthContext";

const DiscordButtonComponent: Component = () => {
  const auth = useAuth();

  return (
    <Show
      when={!auth.loading()}
      fallback={
        <div class="inline-flex items-center gap-2 px-4 py-2 border border-amber-900/40 bg-stone-900 text-amber-700 font-serif text-sm uppercase tracking-widest animate-pulse">
          ⏳ Caricamento...
        </div>
      }
    >
      <button
        type="button"
        disabled={auth.loading()}
        onClick={(e) => {
        auth.isAuthenticated() ? auth.logout() : auth.login();
        e.stopPropagation();
        }}
        class="group relative inline-flex items-center gap-3 px-5 py-2.5
          border-2 border-amber-900/60 bg-stone-900
          hover:bg-stone-800 hover:border-amber-700/80
          text-amber-500 hover:text-amber-400
          font-serif text-sm uppercase tracking-widest
          transition-all duration-200 disabled:opacity-50
          shadow-[inset_0_1px_0_rgba(180,120,20,0.1)]"
      >
        {/* corner ornaments */}
        <span class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-amber-700/60" />
        <span class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-amber-700/60" />

        <svg class="w-4 h-4 fill-amber-600/70 group-hover:fill-amber-500 transition-colors" viewBox="0 0 127.14 96.36">
          <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-.09 56.6.03 80.21a113.31 113.31 0 0 0 33.09 16.59 77.06 77.06 0 0 0 6.75-10.33 70.33 70.33 0 0 1-10.81-5.14c.91-.66 1.8-1.34 2.66-2.03a73.6 73.6 0 0 0 62.36 0c.87.69 1.75 1.37 2.66 2.03a70.8 70.8 0 0 1-10.82 5.15 77 77 0 0 0 6.75 10.33 113.3 113.3 0 0 0 33.08-16.59C127.23 56.6 124.35 32.65 107.7 8.07zM42.45 65.69C38.49 65.69 35 62.58 35 58.62s3.49-7.07 7.45-7.07 7.45 3.12 7.45 7.07-3.49 7.07-7.45 7.07zm42.24 0c-3.96 0-7.45-3.12-7.45-7.07s3.49-7.07 7.45-7.07 7.45 3.12 7.45 7.07-3.49 7.07-7.45 7.07z" />
        </svg>

        <span>
          {auth.isAuthenticated()
            ? `Esci • ${auth.user()?.username ?? "Avventuriero"}`
            : "Accedi con Discord"}
        </span>
      </button>
    </Show>
  );
};

export default DiscordButtonComponent;