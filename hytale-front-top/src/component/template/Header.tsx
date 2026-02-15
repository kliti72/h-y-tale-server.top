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
    <header
      class={`
        sticky top-0 z-50 w-full
        bg-gradient-to-b from-black via-gray-950 to-slate-950
        border-b border-violet-900/40 hover:border-violet-600/60
        shadow-2xl shadow-violet-950/50 backdrop-blur-xl
        transition-all duration-500
      `}
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo con glow neon */}
        <A href="/" class="relative group flex items-center gap-3">
          <div class="relative">
            <div
              class="
                absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20
                blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500
              "
            />
            <span class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 group-hover:from-violet-300 group-hover:via-fuchsia-300 group-hover:to-pink-300 transition-all tracking-tighter drop-shadow-lg">
              HYTALE
            </span>
          </div>
          <span class="text-xl sm:text-2xl font-bold text-white/90 group-hover:text-violet-300 transition-colors">
            .top
          </span>

          {/* Sottile linea glow sotto logo */}
          <div
            class="
              absolute -bottom-2 left-0 right-0 h-0.5
              bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent
              blur-sm opacity-0 group-hover:opacity-80 transition-opacity duration-700
            "
          />
        </A>

        {/* Desktop Nav – stile gaming */}
        <nav class="hidden md:flex items-center gap-7 lg:gap-10">
          {[
            { path: "/", label: "Home", icon: "🏠" },
            { path: "/top", label: "Top Server", icon: "🏆" },
            { path: "/panel", label: "I Miei Server", icon: "🖥️", authOnly: true },
            { path: "/plugin", label: "Vote Plugin", icon: "🔌" },
          ].map((item) =>
            (!item.authOnly || isAuthenticated()) ? (
              <A
                href={item.path}
                class={`
                  relative group flex items-center gap-2 text-base font-medium
                  text-violet-300 hover:text-fuchsia-300 transition-all duration-300
                  ${isActive(item.path) ? "text-fuchsia-400" : ""}
                `}
              >
                <span class="text-lg opacity-80 group-hover:opacity-100 transition">
                  {item.icon}
                </span>
                {item.label}

                {/* Sottolineatura glow attiva */}
                <span
                  class={`
                    absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-fuchsia-500 to-violet-500
                    transition-all duration-400
                    ${isActive(item.path) ? "w-full opacity-90" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70"}
                  `}
                />
              </A>
            ) : null
          )}

          <div class="h-6 w-px bg-violet-900/60 mx-3" />

          <Show
            when={isAuthenticated()}
            fallback={
              <DiscordLoginButton  />
            }
          >
            <button
              onClick={logout}
              class="
                px-6 py-2.5 text-base font-semibold
                bg-gradient-to-r from-violet-800/90 to-fuchsia-800/90
                hover:from-violet-700 hover:to-fuchsia-700
                text-white rounded-xl border border-violet-700/50 hover:border-violet-500/70
                shadow-lg shadow-violet-950/50 hover:shadow-violet-900/70
                transition-all duration-300 active:scale-97
              "
            >
              Esci
            </button>
          </Show>
        </nav>

        {/* Hamburger mobile */}
        <button
          class="md:hidden text-violet-400 hover:text-fuchsia-400 text-3xl transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen() ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu – stesso stile */}
      <Show when={menuOpen()}>
        <div
          class="
            md:hidden absolute top-full left-0 right-0
            bg-gradient-to-b from-gray-950 to-black
            border-b border-violet-900/50 backdrop-blur-xl
            shadow-2xl shadow-violet-950/60
            animate-fade-in-down
          "
        >
          <nav class="flex flex-col p-6 gap-5">
            {[
              { path: "/", label: "Home", icon: "🏠" },
              { path: "/top", label: "Top Server", icon: "🏆" },
              { path: "/panel", label: "I Miei Server", icon: "🖥️", authOnly: true },
              { path: "/plugin", label: "Vote Plugin", icon: "🔌" },
            ].map((item) =>
              (!item.authOnly || isAuthenticated()) ? (
                <A
                  href={item.path}
                  class={`
                    flex items-center gap-4 text-xl font-medium
                    text-violet-300 hover:text-fuchsia-300 transition-colors py-3 px-5 rounded-xl
                    hover:bg-violet-950/40 ${isActive(item.path) ? "bg-violet-950/50 text-fuchsia-400" : ""}
                  `}
                  onClick={toggleMenu}
                >
                  <span class="text-2xl">{item.icon}</span>
                  {item.label}
                </A>
              ) : null
            )}

            <div class="h-px bg-violet-900/50 my-2" />

            <Show when={isAuthenticated()}>
              <button
                onClick={() => { logout(); toggleMenu(); }}
                class="
                  mt-2 px-6 py-4 text-lg font-semibold
                  bg-gradient-to-r from-violet-800 to-fuchsia-800
                  hover:from-violet-700 hover:to-fuchsia-700
                  text-white rounded-xl transition-all active:scale-97
                  shadow-md shadow-violet-900/50
                "
              >
                Esci
              </button>
            </Show>

            <Show when={!isAuthenticated()}>
              <div class="mt-3 px-2" onClick={toggleMenu}>
                <DiscordLoginButton />
              </div>
            </Show>
          </nav>
        </div>
      </Show>
    </header>
  );
};

export default Header;