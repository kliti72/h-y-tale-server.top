import { Component, createSignal, Show, createEffect, onMount, onCleanup, For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useAuth } from "../../auth/AuthContext";
import DiscordButtonComponent from "../button/DiscordButtonComponent";

const NAV_LINKS = [
  { path: "/", label: "Home", icon: "⚔️" },
  { path: "/servers", label: "Server", icon: "🏰" },
  { path: "/leaderboard", label: "Top Server", icon: "👑" },
  { path: "/docs", label: "Plugin & Api", icon: "📜" },
];

const NOTIFICATIONS = [
  { id: 2, text: "Hai sbloccato la possibilità di pubblicare un server", icon: "🔥", time: "Vai nella sezione Aggiungi server", unread: true },
  { id: 1, text: "Benvenuto su H-Y-Tale.top", icon: "⚔️", time: "Puoi votare il tuo server preferito", unread: false },
];

// ─── sub-components ────────────────────────────────────────────────────────────

const Rune = () => (
  <span class="text-amber-900/40 text-xs font-serif select-none">✦</span>
);

const Avatar: Component<{ username?: string; size?: "sm" | "md" }> = (props) => {
  const s = props.size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      class={`${s} rounded-sm bg-gradient-to-br from-amber-900 to-stone-900 border border-amber-700/60 flex items-center justify-center text-amber-300 font-serif font-bold shadow-inner shadow-black/40`}
    >
      {props.username?.charAt(0).toUpperCase() ?? "?"}
    </div>
  );
};

const UnreadDot = () => (
  <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 shadow shadow-red-900 animate-pulse" />
);

// ─── main component ────────────────────────────────────────────────────────────

const HeaderComponent: Component = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);
  const [showUserMenu, setShowUserMenu] = createSignal(false);
  const [notifOpen, setNotifOpen] = createSignal(false);

  const hasUnread = NOTIFICATIONS.some((n) => n.unread);
  const isActive = (path: string) => location.pathname === path;
  const closeAll = () => { setShowUserMenu(false); setNotifOpen(false); };

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  createEffect(() => { location.pathname; setMenuOpen(false); closeAll(); });

  const navLinkClass = (path: string) =>
    `relative flex items-center gap-1.5 px-3 py-2 text-xs font-serif font-bold uppercase tracking-widest border transition-all duration-200
     ${isActive(path)
       ? "bg-amber-950/60 border-amber-700/50 text-amber-400 shadow-[inset_0_1px_0_rgba(180,120,20,0.2)]"
       : "border-transparent text-stone-500 hover:text-amber-400 hover:border-amber-900/30 hover:bg-stone-900/80"}`;

  const iconBtnClass = "relative w-9 h-9 flex items-center justify-center border border-stone-800 hover:border-amber-800/60 bg-stone-900/80 hover:bg-stone-900 text-stone-500 hover:text-amber-400 transition-all duration-200 shadow-inner shadow-black/20";

  return (
    <>
      {/* ── sticky header ── */}
      <header
        class={`sticky top-0 z-50 transition-all duration-500
          ${scrolled()
            ? "bg-stone-950/95 backdrop-blur-sm shadow-xl shadow-black/70 border-b border-amber-900/50"
            : "bg-stone-950 border-b border-stone-900"}`}
      >
        {/* top shimmer line */}
        <div class="h-px w-full bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />

        {/* secondary decorative line */}
        <div class="h-px w-full bg-gradient-to-r from-transparent via-stone-800/80 to-transparent" />

        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-6 h-14">

          {/* ── Logo ── */}
          <A href="/" class="group flex items-center gap-2 shrink-0">
            <span class="font-serif font-black text-xl sm:text-2xl uppercase tracking-[0.2em]
              text-amber-500 group-hover:text-amber-400 transition-colors duration-300
              drop-shadow-[0_0_12px_rgba(200,140,20,0.4)] group-hover:drop-shadow-[0_0_18px_rgba(200,140,20,0.7)]">
              H-YTALE
            </span>
            <span class="text-stone-600 font-serif text-sm group-hover:text-amber-700 transition-colors">.top</span>
          </A>

          {/* ── Desktop Nav ── */}
          <nav class="hidden lg:flex items-center gap-0.5">
            <Rune />
            <For each={NAV_LINKS}>{(item) => (
              <A href={item.path} class={navLinkClass(item.path)}>
                <span class="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
                <Show when={isActive(item.path)}>
                  <span class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
                </Show>
              </A>
            )}</For>
            <Rune />
          </nav>

          {/* ── Right Actions ── */}
          <div class="flex items-center gap-2">

            {/* Notifications */}
            <Show when={isAuthenticated()}>
              <div class="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen()); setShowUserMenu(false); }}
                  class={iconBtnClass}
                  title="Notifiche"
                >
                  <span class="text-base leading-none">🔔</span>
                  <Show when={hasUnread}><UnreadDot /></Show>
                </button>

                <Show when={notifOpen()}>
                  <div class="absolute right-0 mt-2 w-80 bg-stone-950 border border-amber-900/40 shadow-2xl shadow-black/80 z-50 overflow-hidden">
                    {/* header */}
                    <div class="px-4 py-2.5 bg-gradient-to-r from-amber-950/40 to-stone-950 border-b border-amber-900/30 flex items-center justify-between">
                      <span class="font-serif text-amber-500 uppercase tracking-widest text-xs">⚔️ Notifiche</span>
                      <span class="text-xs text-stone-600 font-serif">{NOTIFICATIONS.filter(n=>n.unread).length} nuove</span>
                    </div>
                    {/* list */}
                    <div class="divide-y divide-stone-900">
                      <For each={NOTIFICATIONS}>{(n) => (
                        <div class={`px-4 py-3 flex gap-3 cursor-pointer transition-colors hover:bg-stone-900/60
                          ${n.unread ? "bg-amber-950/10" : ""}`}>
                          <span class="text-xl mt-0.5 shrink-0">{n.icon}</span>
                          <div class="min-w-0">
                            <p class={`text-sm font-serif leading-snug ${n.unread ? "text-stone-200" : "text-stone-400"}`}>{n.text}</p>
                            <p class="text-xs text-stone-600 mt-1 font-serif">{n.time}</p>
                          </div>
                          <Show when={n.unread}>
                            <span class="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 self-start" />
                          </Show>
                        </div>
                      )}</For>
                    </div>
                    {/* footer */}
                    <div class="px-4 py-2 border-t border-stone-900 bg-stone-950/80">
                      <button class="text-xs text-amber-700 hover:text-amber-400 font-serif uppercase tracking-wider transition-colors">
                        Vedi tutte →
                      </button>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            {/* User / Login */}
            <Show when={isAuthenticated()} fallback={<div class="hidden md:block"><DiscordButtonComponent /></div>}>
              <div class="relative">
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu()); setNotifOpen(false); }}
                  class="flex items-center gap-2 pl-1 pr-3 py-1 border border-stone-800 hover:border-amber-800/50 bg-stone-900/70 hover:bg-stone-900 transition-all duration-200 shadow-inner shadow-black/20"
                >
                  <Avatar username={user()?.username} />
                  <span class="hidden xl:inline text-xs font-serif text-stone-400 max-w-[100px] truncate">{user()?.username ?? "Avventuriero"}</span>
                  <span class={`text-stone-600 text-[10px] transition-transform duration-200 ${showUserMenu() ? "rotate-180" : ""}`}>▼</span>
                </button>

                <Show when={showUserMenu()}>
                  <div class="absolute right-0 mt-2 w-52 bg-stone-950 border border-amber-900/40 shadow-2xl shadow-black/80 z-50 overflow-hidden">
                    {/* user info */}
                    <div class="px-4 py-3 bg-gradient-to-br from-amber-950/30 to-transparent border-b border-stone-800 flex items-center gap-3">
                      <Avatar username={user()?.username} size="md" />
                      <div class="min-w-0">
                        <p class="font-serif font-bold text-amber-400 text-sm truncate">{user()?.username}</p>
                        <p class="text-[10px] text-stone-600 font-mono">#{user()?.id?.slice(0, 8)}</p>
                      </div>
                    </div>
                    {/* actions */}
                    <div class="py-1">
                      <A
                        href="/panel"
                        class="flex items-center gap-2.5 px-4 py-2.5 text-stone-400 hover:text-amber-400 hover:bg-stone-900/80 font-serif text-xs uppercase tracking-wide transition-colors"
                      >
                        <span>⚙️</span> Aggiungi server
                      </A>
                    </div>
                    {/* logout */}
                    <div class="p-2 border-t border-stone-900">
                      <button
                        onClick={() => { logout(); closeAll(); }}
                        class="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:text-red-400 hover:bg-red-950/20 border border-red-900/20 hover:border-red-900/40 font-serif text-xs uppercase tracking-wide transition-all"
                      >
                        <span>🚪</span> Esci
                      </button>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            {/* Mobile Hamburger */}
            <button
              class={`${iconBtnClass} lg:hidden text-base`}
              onClick={() => setMenuOpen(!menuOpen())}
              aria-label="Menu"
            >
              {menuOpen() ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* bottom ornament */}
        <div class="h-px w-full bg-gradient-to-r from-transparent via-stone-800/50 to-transparent" />

        {/* ── Mobile Menu ── */}
        <Show when={menuOpen()}>
          <nav class="lg:hidden bg-stone-950/98 border-t border-amber-900/20 px-4 py-3 space-y-0.5">
            <For each={NAV_LINKS}>{(item) => (
              <A
                href={item.path}
                onClick={() => setMenuOpen(false)}
                class={`flex items-center gap-3 px-4 py-3 font-serif text-sm uppercase tracking-wide border-l-2 transition-all
                  ${isActive(item.path)
                    ? "border-amber-600 bg-amber-950/20 text-amber-400 pl-5"
                    : "border-transparent text-stone-500 hover:text-amber-400 hover:border-amber-800/40 hover:pl-5"}`}
              >
                <span>{item.icon}</span> {item.label}
              </A>
            )}</For>

            <div class="h-px bg-gradient-to-r from-amber-900/30 to-transparent my-2" />

            <Show
              when={isAuthenticated()}
              fallback={<div class="px-2 pt-1"><DiscordButtonComponent /></div>}
            >
              <div class="px-4 py-3 bg-stone-900/60 border border-stone-800 flex items-center gap-3 mb-1">
                <Avatar username={user()?.username} size="md" />
                <div>
                  <p class="font-serif font-bold text-amber-400 text-sm">{user()?.username}</p>
                  <p class="text-xs text-stone-600">Avventuriero autenticato</p>
                </div>
              </div>
              <A href="/panel" onClick={() => setMenuOpen(false)}
                class="flex items-center gap-2.5 px-4 py-2.5 text-stone-400 hover:text-amber-400 font-serif text-sm transition-colors">
                ⚙️ Aggiungi server
              </A>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                class="w-full flex items-center gap-2.5 px-4 py-2.5 mt-1 border border-red-900/30 text-red-600 hover:text-red-400 hover:bg-red-950/20 font-serif text-sm transition-all"
              >
                🚪 Esci
              </button>
            </Show>
          </nav>
        </Show>
      </header>

      {/* Backdrop */}
      <Show when={showUserMenu() || notifOpen()}>
        <div class="fixed inset-0 z-40" onClick={closeAll} />
      </Show>
    </>
  );
};

export default HeaderComponent;