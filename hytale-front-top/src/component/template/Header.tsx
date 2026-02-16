// src/components/Header.tsx
import { Component, createSignal, Show, createEffect, onMount, onCleanup } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useAuth } from "../../auth/AuthContext";
import DiscordLoginButton from "../button/DiscordLoginButton";

const Header: Component = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);
  const [showUserMenu, setShowUserMenu] = createSignal(false);
  const [notificationsOpen, setNotificationsOpen] = createSignal(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setMenuOpen(!menuOpen());

  // Scroll effect per header che cambia stile
  onMount(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  // Chiudi menu quando cambia route
  createEffect(() => {
    location.pathname;
    setMenuOpen(false);
    setShowUserMenu(false);
    setNotificationsOpen(false);
  });

  // Mock notifications (da sostituire con dati reali)
  const notifications = [
    { id: 1, text: "Nuovo evento PvP questo weekend!", icon: "⚔️", time: "2h fa", unread: true },
    { id: 2, text: "Il tuo server ha ricevuto 5 nuovi voti", icon: "🔥", time: "5h fa", unread: true },
    { id: 3, text: "Risposta al tuo topic nel forum", icon: "💬", time: "1 giorno fa", unread: false },
  ];

  const unreadCount = () => notifications.filter(n => n.unread).length;

  return (
    <header
      class={`
        sticky top-0 z-50 w-full
        ${scrolled()
          ? "bg-black/95 backdrop-blur-xl shadow-2xl shadow-violet-950/60 border-b border-violet-800/50"
          : "bg-gradient-to-b from-black via-gray-950 to-slate-950 border-b border-violet-900/40 shadow-2xl shadow-violet-950/50"
        }
      `}
    >
      {/* Main Header Content */}
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between gap-6 py-4">
          
          {/* Logo con effetti premium */}
          <A href="/" class="relative group flex items-center gap-3">
            <div class="relative">
              {/* Glow effect */}
              <div
                class="
                  absolute inset-0 rounded-full 
                  bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20
                  blur-xl opacity-70 group-hover:opacity-100 
                  transition-opacity duration-500 animate-pulse
                "
              />
              
              {/* Logo text */}
              <div class="relative flex items-center gap-2">
                <span class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 group-hover:from-violet-300 group-hover:via-fuchsia-300 group-hover:to-pink-300 transition-all tracking-tighter drop-shadow-lg">
                  H-YTALE
                </span>
                <span class="text-xl sm:text-2xl font-bold text-white/90 group-hover:text-violet-300 transition-colors">
                  .top
                </span>
              </div>
            </div>

            {/* Sottile linea glow sotto logo */}
            <div
              class="
                absolute -bottom-2 left-0 right-0 h-0.5
                bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent
                blur-sm opacity-0 group-hover:opacity-80 transition-opacity duration-700
              "
            />
          </A>

          {/* Desktop Navigation */}
          <nav class="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { path: "/", label: "Home", icon: "🏠" },
              { path: "/servers", label: "Server", icon: "🎮" },
              { path: "/top", label: "Top Server", icon: "🏆" },
              { path: "/forum", label: "Forum", icon: "💬" },
              { path: "/earn", label: "Earn", icon: "💸" },
              { path: "/premium", label: "Premium", icon: "🌟" },
              { path: "/plugin", label: "Docs", icon: "🕮" },
            ].map((item) =>
              (true) ? (
                <A
                  href={item.path}
                  class={`
                    relative group flex items-center gap-2 px-4 py-2.5 rounded-xl
                    text-sm xl:text-base font-semibold transition-all duration-300
                    ${isActive(item.path)
                      ? "bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50"
                      : "text-violet-300 hover:text-fuchsia-300 hover:bg-violet-950/40"
                    }
                  `}
                >
                  <span class="text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>

                  {/* Active indicator */}
                  <Show when={isActive(item.path)}>
                    <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-fuchsia-400 rounded-full animate-pulse" />
                  </Show>
                </A>
              ) : null
            )}
          </nav>

          {/* Right side actions */}
          <div class="flex items-center gap-3">
            

            {/* Notifications (solo se autenticato) */}
            <Show when={isAuthenticated()}>
              <div class="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen());
                    setShowUserMenu(false);
                  }}
                  class="
                    relative flex items-center justify-center w-11 h-11 rounded-xl
                    bg-violet-950/40 hover:bg-violet-900/60 
                    border border-violet-800/30 hover:border-violet-600/50
                    text-violet-300 hover:text-white
                    transition-all duration-300
                  "
                >
                  <span class="text-xl">🔔</span>
                  
                  {/* Badge unread */}
                  <Show when={unreadCount() > 0}>
                    <span class="
                      absolute -top-1 -right-1 w-5 h-5 
                      bg-gradient-to-r from-red-500 to-pink-500 
                      rounded-full text-white text-xs font-bold
                      flex items-center justify-center
                      animate-pulse border-2 border-black
                    ">
                      {unreadCount()}
                    </span>
                  </Show>
                </button>

                {/* Notifications Dropdown */}
                <Show when={notificationsOpen()}>
                  <div class="
                    absolute right-0 mt-2 w-80 
                    bg-gradient-to-br from-gray-900 to-black 
                    border-2 border-violet-700/50 rounded-2xl 
                    shadow-2xl shadow-violet-900/50
                    overflow-hidden z-50
                  ">
                    <div class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3">
                      <h3 class="font-bold text-white flex items-center gap-2">
                        <span>🔔</span>
                        Notifiche
                      </h3>
                    </div>

                    <div class="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div 
                            class={`
                              px-4 py-3 border-b border-violet-900/30 
                              hover:bg-violet-950/40 cursor-pointer transition-colors
                              ${notif.unread ? "bg-violet-950/20" : ""}
                            `}
                          >
                            <div class="flex items-start gap-3">
                              <span class="text-2xl mt-1">{notif.icon}</span>
                              <div class="flex-1 min-w-0">
                                <p class={`text-sm ${notif.unread ? "text-white font-medium" : "text-violet-300"}`}>
                                  {notif.text}
                                </p>
                                <p class="text-xs text-violet-400 mt-1">{notif.time}</p>
                              </div>
                              {notif.unread && (
                                <span class="w-2 h-2 bg-fuchsia-500 rounded-full mt-2" />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div class="px-4 py-8 text-center text-violet-400">
                          <div class="text-4xl mb-2">📭</div>
                          <p>Nessuna notifica</p>
                        </div>
                      )}
                    </div>

                    <div class="px-4 py-3 border-t border-violet-800/30 bg-violet-950/20">
                      <button class="w-full text-center text-sm text-fuchsia-400 hover:text-fuchsia-300 font-medium">
                        Vedi tutte →
                      </button>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            {/* User Menu / Login */}
            <Show
              when={isAuthenticated()}
              fallback={
                <div class="hidden md:block">
                  <DiscordLoginButton />
                </div>
              }
            >
              <div class="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu());
                    setNotificationsOpen(false);
                  }}
                  class="
                    flex items-center gap-3 px-4 py-2.5 rounded-xl
                    bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20
                    hover:from-violet-600/30 hover:to-fuchsia-600/30
                    border border-violet-600/50 hover:border-fuchsia-500/70
                    transition-all duration-300
                  "
                >
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                    {user()?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span class="hidden xl:inline text-white font-semibold">
                    {user()?.username || "User"}
                  </span>
                  <span class={`text-violet-300 transition-transform ${showUserMenu() ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* User Dropdown Menu */}
                <Show when={showUserMenu()}>
                  <div class="
                    absolute right-0 mt-2 w-64 
                    bg-gradient-to-br from-gray-900 to-black 
                    border-2 border-violet-700/50 rounded-2xl 
                    shadow-2xl shadow-violet-900/50
                    overflow-hidden z-50
                  ">
                    {/* User Info */}
                    <div class="px-4 py-4 border-b border-violet-800/30 bg-violet-950/20">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl">
                          {user()?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-white truncate">{user()?.username}</p>
                          <p class="text-xs text-violet-400">ID: {user()?.id?.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div class="py-2">
                      <A
                        href="/profile"
                        class="flex items-center gap-3 px-4 py-3 hover:bg-violet-950/40 text-violet-200 hover:text-white transition-colors"
                      >
                        <span class="text-xl">👤</span>
                        <span class="font-medium">Profilo</span>
                      </A>
                      <A
                        href="/panel"
                        class="flex items-center gap-3 px-4 py-3 hover:bg-violet-950/40 text-violet-200 hover:text-white transition-colors"
                      >
                        <span class="text-xl">⚙️</span>
                        <span class="font-medium">I Miei Server</span>
                      </A>
                      <A
                        href="/favorites"
                        class="flex items-center gap-3 px-4 py-3 hover:bg-violet-950/40 text-violet-200 hover:text-white transition-colors"
                      >
                        <span class="text-xl">⭐</span>
                        <span class="font-medium">Preferiti</span>
                      </A>
                      <A
                        href="/settings"
                        class="flex items-center gap-3 px-4 py-3 hover:bg-violet-950/40 text-violet-200 hover:text-white transition-colors"
                      >
                        <span class="text-xl">🔧</span>
                        <span class="font-medium">Impostazioni</span>
                      </A>
                    </div>

                    {/* Logout */}
                    <div class="border-t border-violet-800/30 p-2">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        class="
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl
                          bg-red-600/20 hover:bg-red-600/30
                          border border-red-500/30 hover:border-red-500/50
                          text-red-400 hover:text-red-300
                          transition-all font-medium
                        "
                      >
                        <span class="text-xl">🚪</span>
                        <span>Esci</span>
                      </button>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            {/* Mobile Hamburger */}
            <button
              class="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-violet-950/40 hover:bg-violet-900/60 border border-violet-800/30 text-violet-300 hover:text-white transition-all text-2xl"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {menuOpen() ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Show when={menuOpen()}>
        <div
          class="
            lg:hidden 
            bg-gradient-to-b from-gray-950 to-black
            border-t border-violet-900/50 backdrop-blur-xl
            shadow-2xl shadow-violet-950/60
            animate-fade-in-down
          "
        >
          <nav class="max-w-[1400px] mx-auto px-4 py-6 space-y-2">
            
            {/* Mobile Nav Links */}
            {[
              { path: "/", label: "Home", icon: "🏠" },
              { path: "/servers", label: "Server", icon: "🎮" },
              { path: "/top", label: "Top Server", icon: "🏆" },
              { path: "/forum", label: "Forum", icon: "💬" },
              { path: "/events", label: "Eventi", icon: "🎉" },
            ].map((item) =>
              (true) ? (
                <A
                  href={item.path}
                  class={`
                    flex items-center gap-4 px-5 py-4 rounded-xl
                    text-lg font-semibold transition-all
                    ${isActive(item.path)
                      ? "bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50"
                      : "text-violet-300 hover:text-white hover:bg-violet-950/40"
                    }
                  `}
                  onClick={toggleMenu}
                >
                  <span class="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </A>
              ) : null
            )}

            <div class="h-px bg-violet-900/50 my-4" />

            {/* Auth Section Mobile */}
            <Show
              when={isAuthenticated()}
              fallback={
                <div class="px-2">
                  <DiscordLoginButton />
                </div>
              }
            >
              {/* User Info Mobile */}
              <div class="px-5 py-4 bg-violet-950/20 rounded-xl border border-violet-800/30">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl">
                    {user()?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-white truncate">{user()?.username}</p>
                    <p class="text-xs text-violet-400">Utente autenticato</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <A
                    href="/profile"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-violet-950/40 text-violet-200 hover:text-white transition-colors"
                    onClick={toggleMenu}
                  >
                    <span class="text-lg">👤</span>
                    <span class="font-medium">Il Mio Profilo</span>
                  </A>
                  <A
                    href="/favorites"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-violet-950/40 text-violet-200 hover:text-white transition-colors"
                    onClick={toggleMenu}
                  >
                    <span class="text-lg">⭐</span>
                    <span class="font-medium">Preferiti</span>
                  </A>
                  <A
                    href="/settings"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-violet-950/40 text-violet-200 hover:text-white transition-colors"
                    onClick={toggleMenu}
                  >
                    <span class="text-lg">🔧</span>
                    <span class="font-medium">Impostazioni</span>
                  </A>
                </div>
              </div>

              {/* Logout Mobile */}
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                class="
                  w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 rounded-xl
                  bg-gradient-to-r from-red-600/20 to-pink-600/20
                  hover:from-red-600/30 hover:to-pink-600/30
                  border border-red-500/50 hover:border-red-400/70
                  text-red-400 hover:text-red-300 font-bold text-lg
                  transition-all
                "
              >
                <span class="text-2xl">🚪</span>
                Esci
              </button>
            </Show>
          </nav>
        </div>
      </Show>

      {/* Close dropdowns when clicking outside */}
      <Show when={showUserMenu() || notificationsOpen()}>
        <div
          class="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setNotificationsOpen(false);
          }}
        />
      </Show>
    </header>
  );
};

export default Header;