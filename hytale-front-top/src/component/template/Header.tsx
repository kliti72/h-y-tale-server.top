// src/components/Header.tsx
import { Component, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";           // per link attivi e navigazione
import { useAuth } from "../../auth/AuthContext";
import DiscordLoginButton from "../DiscordLoginButton";

const Header: Component = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation(); // per highlight link attivo

  return (
    <header class="
      w-full 
      py-4 px-5 sm:py-5 sm:px-6 
      bg-zinc-950/90 
      border-b border-zinc-800/70 
      backdrop-blur-sm 
      sticky top-0 z-50
    ">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">

        {/* Titolo / Logo (cliccabile) */}
        <A href="/" class="flex items-center gap-3 no-underline">
          <h1 class="
            text-2xl sm:text-3xl md:text-4xl 
            font-extrabold 
            text-white 
            tracking-tight
            hover:text-indigo-400 transition-colors
          ">
            Hytale • Classifica
          </h1>
        </A>

        {/* Navigazione + Auth buttons */}
        <nav class="flex items-center gap-5 sm:gap-7">
          
          {/* Link sempre visibile */}
          <A
            href="/"           // adatta il path reale che usi per la lista generale
            class={`
              text-zinc-300 hover:text-white transition-colors font-medium
              ${location.pathname === '/servers' ? 'text-white underline underline-offset-4' : ''}
            `}
          >
            Lista Server
          </A>

          {/* Link visibile solo se autenticato */}
          <Show when={isAuthenticated()}>
            <A
              href="/owner"           // o "/my-servers" – quello che usi per MyServersBoard
              class={`
                text-indigo-400 hover:text-indigo-300 transition-colors font-medium
                ${location.pathname === '/owner' ? 'underline underline-offset-4' : ''}
              `}
            >
              I Miei Server
            </A>
          </Show>

          {/* Spazio separatore sottile su schermi medi+ */}
          <div class="hidden sm:block h-5 w-px bg-zinc-700/60" />

          {/* Pulsante Discord / Logout */}
          <Show
            when={isAuthenticated()}
            fallback={<DiscordLoginButton />}
          >
            {/* Qui puoi mettere un pulsante Logout o Avatar+dropdown */}
            <button
              onClick={() => {
                logout()
              }}
              class="
                px-4 py-1.5 
                text-sm font-medium 
                bg-zinc-800 hover:bg-zinc-700 
                border border-zinc-700 
                rounded-md transition-colors
                text-white
              "
            >
              Esci
            </button>
          </Show>
        </nav>

      </div>
    </header>
  );
};

export default Header;