import { Show, type Component } from "solid-js";
import { useAuth } from "../../auth/AuthContext";

const DiscordLoginButton: Component = () => {
  const auth = useAuth();

  const isAuthenticated = () => auth.isAuthenticated();
  const user = () => auth.user();

  return (
    <Show
      when={!auth.loading()}
      fallback={
        <div class="inline-flex items-center gap-3 px-5 py-2.5 text-sm font-mono text-[#00ff88]/70 bg-black/60 border border-green-900/50 animate-pulse">
          <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" />
          </svg>
          INITIALIZING CONNECTION...
        </div>
      }
    >
      <button
        type="button"
        disabled={auth.loading()}
        onClick={() => (isAuthenticated() ? auth.logout() : auth.login())}
        class={`
          group relative inline-flex items-center gap-3
          px-6 py-3 text-sm font-medium tracking-widest uppercase
          font-mono transition-all duration-150
          border border-green-900/60 bg-black/70
          hover:bg-green-950/40 hover:border-green-700/60
          focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:ring-offset-2 focus:ring-offset-black
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-[0_0_15px_rgba(0,255,65,0.12)]
          hover:shadow-[0_0_25px_rgba(0,255,65,0.25)]
        `}
      >
        {/* Cornicette decorative hacker-style */}
        <span class="absolute -top-px -left-px h-3 w-3 border-t border-l border-green-600/50 pointer-events-none" />
        <span class="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-green-600/50 pointer-events-none" />

        {/* Icona Discord adattata al verde terminal */}
        <svg
          class="w-5 h-5 transition-all duration-200 group-hover:scale-110 group-hover:text-[#00ff99]"
          viewBox="0 0 127.14 96.36"
          fill="rgba(38, 196, 10, 0.4)"
        >
          <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-.09 56.6.03 80.21a113.31 113.31 0 0 0 33.09 16.59 77.06 77.06 0 0 0 6.75-10.33 70.33 70.33 0 0 1-10.81-5.14c.91-.66 1.8-1.34 2.66-2.03a73.6 73.6 0 0 0 62.36 0c.87.69 1.75 1.37 2.66 2.03a70.8 70.8 0 0 1-10.82 5.15 77 77 0 0 0 6.75 10.33 113.3 113.3 0 0 0 33.08-16.59c.13-23.61-2.75-47.56-25.29-72.14zM42.45 65.69C38.49 65.69 35 62.58 35 58.62s3.49-7.07 7.45-7.07 7.45 3.12 7.45 7.07-3.49 7.07-7.45 7.07zm42.24 0c-3.96 0-7.45-3.12-7.45-7.07s3.49-7.07 7.45-7.07 7.45 3.12 7.45 7.07-3.49 7.07-7.45 7.07z" />
        </svg>

        <span
          class={`transition-colors duration-150 ${
            isAuthenticated()
              ? "text-[#00ff41] group-hover:text-[#00ff88]"
              : "text-[#00ff77] group-hover:text-[#00ff99]"
          }`}
        >
          {isAuthenticated()
            ? `LOGOUT • ${user()?.username ?? user()?.global_name ?? "GUEST"}`
            : "CONNECT VIA DISCORD"}
        </span>

        {/* Effetto glow hover più cyber */}
        <span
          class={`
            absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40
            bg-gradient-to-r from-transparent via-green-600/20 to-transparent
            blur-xl transition-opacity duration-300
          `}
        />

        {/* Cursore blinking opzionale per feeling terminal */}
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[#00ff41] animate-pulse">
          _
        </span>
      </button>
    </Show>
  );
};

export default DiscordLoginButton;