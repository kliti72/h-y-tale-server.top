// src/components/Header.tsx
import { Component, createSignal, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useAuth } from "../../auth/AuthContext";
import DiscordLoginButton from "../button/DiscordLoginButton";

const Header: Component = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setMenuOpen(!menuOpen());

  return (
    <header class="sticky top-0 z-50 w-full bg-black/95 border-b border-zinc-800/70 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo con leggero glow hover */}
        <A
          href="/"
          class="relative group"
        >
          <h1 class="
            text-2xl sm:text-3xl font-extrabold 
            text-emerald-400 tracking-tight 
            transition-all duration-300
            group-hover:text-indigo-300 group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]
          ">
            H-Y-Tale.top
          </h1>
          {/* Particelle/glow sottile sotto il logo */}
          <div class="
            absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 
            bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent 
            blur-sm opacity-0 group-hover:opacity-80 transition-opacity duration-500
          " />
        </A>

        {/* Desktop Nav */}
        <nav class="hidden md:flex items-center gap-6 lg:gap-8">

          <A
            href="/"
            class={`text-emerald-400 hover:text-indigo-300 font-medium transition-colors ${isActive("/") ? "underline underline-offset-4" : ""}`}
          >
            <span class="icon">🏠</span>
            Home
          </A>

      <A
            href="/top"
            class={`text-emerald-400 hover:text-indigo-300 font-medium transition-colors ${isActive("/top") ? "underline underline-offset-4" : ""}`}
          >
            <span class="icon">🏆</span>Top Server
          </A>

          <Show when={isAuthenticated()}>
    <A
            href="/panel"
            class={`text-emerald-400 hover:text-indigo-300 font-medium transition-colors ${isActive("/panel") ? "underline underline-offset-4" : ""}`}
          >              <span class="icon">🖥️</span>I Miei Server
            </A>
          </Show>

      <A
            href="/plugin"
            class={`text-emerald-400 hover:text-indigo-300 font-medium transition-colors ${isActive("/plugin") ? "underline underline-offset-4" : ""}`}
          >
            <span class="icon">🔌</span>Vote Plugin
          </A>

          <div class="h-5 w-px bg-zinc-700/60 mx-2" />

          <Show
            when={isAuthenticated()}
            fallback={<DiscordLoginButton />}
          >
            <button
              onClick={logout}
              class="px-4 py-1.5 text-sm font-medium bg-indigo-800/80 hover:bg-indigo-700 text-white border border-indigo-700/60 rounded-md transition-all hover:shadow-md hover:shadow-indigo-900/40 active:scale-95"
            >
              Esci
            </button>
          </Show>
        </nav>

        {/* Hamburger su mobile */}
        <button
          class="md:hidden text-emerald-400 hover:text-emerald-300 transition-colors text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen() ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <Show when={menuOpen()}>
        <div class="
          md:hidden absolute top-full left-0 right-0 
          bg-black/95 border-b border-zinc-800/70 backdrop-blur-md
          animate-fade-in-down
          shadow-2xl shadow-black/60
        ">
          <nav class="flex flex-col p-5 gap-4">
            <A href="/" class={`mobile-link ${isActive("/") ? "active" : ""}`} onClick={toggleMenu}>
              <span class="icon text-emerald-500">🏠 Home </span>
            </A>

            <A href="/top" class={`mobile-link ${isActive("/top") ? "active" : ""}`} onClick={toggleMenu}>
              <span class="icon text-emerald-500">🏆 Top Server </span>
            </A>

            <Show when={isAuthenticated()}>
              <A href="/panel" class={`mobile-link ${isActive("/panel") ? "active" : ""}`} onClick={toggleMenu}>
                <span class="icon text-emerald-500">🖥️ I Miei Server</span>
              </A>
            </Show>

            <A href="/plugins" class={`mobile-link ${isActive("/plugins") ? "active" : ""}`} onClick={toggleMenu}>
              <span class="icon text-emerald-500">🔌 </span>
            </A>

            <Show when={isAuthenticated()}>
              <button
                onClick={() => { logout(); toggleMenu(); }}
                class="mt-2 px-5 py-3 text-base font-medium bg-indigo-800/80 hover:bg-indigo-700 text-white rounded-lg transition-all active:scale-95"
              >
                Esci
              </button>
            </Show>

            <Show when={!isAuthenticated()}>
              <div class="mt-2" onClick={toggleMenu}>
                <DiscordLoginButton />
              </div>
            </Show>
          </nav>
        </div>
      </Show>
    </header>
  );
};

// Stili globali necessari (mettili in un file CSS globale o in <style> nel root)
const globalStyles = `
  .nav-link {
    @apply flex items-center gap-1.5 text-emerald-400 hover:text-indigo-300 font-medium transition-all duration-200;
  }
  .nav-link.active {
    @apply text-indigo-300 underline underline-offset-4;
  }
  .mobile-link {
    @apply flex items-center gap-3 text-lg text-emerald-300 hover:text-indigo-300 transition-colors py-2 px-4 rounded-lg hover:bg-zinc-900/50;
  }
  .mobile-link.active {
    @apply text-indigo-300 bg-zinc-900/40;
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-down {
    animation: fadeInDown 0.25s ease-out forwards;
  }
`;

// Puoi aggiungere <style>{globalStyles}</style> nel tuo App.tsx o importare un file CSS
export default Header;