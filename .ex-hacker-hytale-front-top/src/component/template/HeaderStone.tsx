import { Component, createSignal, Show, createEffect, onMount, onCleanup } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useAuth } from "../../auth/AuthContext";
import DiscordLoginButton from "../button/DiscordLoginButton";

const RUNE_ROW = "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@400;700&family=IM+Fell+English:ital@0;1&display=swap');

  :root {
    --stone-dark:   #0d0b08;
    --stone-mid:    #1a1610;
    --stone-light:  #2a2318;
    --stone-border: #3d3020;
    --gold:         #c8960c;
    --gold-light:   #e8b830;
    --gold-dim:     #6b4e08;
    --parchment:    #c4924a;
    --parchment-dim:#7a5c30;
    --blood:        #6b1010;
  }

  /* Grain texture */
  .stone-header {
    position: relative;
    font-family: 'Cinzel', serif;
  }
  .stone-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
    background-size: 200px;
    opacity: 0.04;
    pointer-events: none;
    z-index: 0;
  }

  /* ── RUNE TICKER ── */
  .rune-ticker-wrap {
    overflow: hidden;
    border-bottom: 1px solid var(--gold-dim);
    background: linear-gradient(90deg, var(--stone-dark), #110e08, var(--stone-dark));
    padding: 0.3rem 0;
    position: relative;
  }
  .rune-ticker {
    display: inline-block;
    white-space: nowrap;
    animation: rune-scroll 20s linear infinite;
    font-family: 'IM Fell English', serif;
    font-size: 0.75rem;
    color: var(--gold-dim);
    letter-spacing: 0.4em;
    opacity: 0.7;
  }

  /* ── MAIN HEADER ── */
  .stone-header-main {
    background: linear-gradient(180deg,
      #0a0806 0%,
      #0f0c08 40%,
      #130f0a 70%,
      #0d0b08 100%
    );
    border-bottom: 2px solid var(--stone-border);
    box-shadow:
      0 4px 20px rgba(0,0,0,0.9),
      0 1px 0 rgba(200,150,12,0.08),
      inset 0 -1px 0 rgba(200,150,12,0.05);
    position: relative;
    z-index: 1;
  }

  .stone-header-main::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent,
      var(--gold-dim) 20%,
      var(--gold) 50%,
      var(--gold-dim) 80%,
      transparent
    );
    opacity: 0.5;
  }

  /* Corner rune decorations */
  .stone-corner {
    position: absolute;
    font-family: 'IM Fell English', serif;
    color: var(--gold-dim);
    opacity: 0.3;
    font-size: 1.2rem;
    pointer-events: none;
    z-index: 0;
  }

  /* ── LOGO ── */
  .stone-logo-text {
    font-family: 'Cinzel Decorative', serif;
    font-weight: 900;
    font-size: 1.4rem;
    color: var(--gold-light);
    text-shadow:
      0 0 15px rgba(200,150,12,0.5),
      0 2px 4px rgba(0,0,0,0.8),
      1px 1px 0 rgba(0,0,0,0.6);
    letter-spacing: 0.05em;
    transition: all 0.3s;
  }
  .stone-logo-text:hover {
    text-shadow:
      0 0 25px rgba(200,150,12,0.7),
      0 2px 4px rgba(0,0,0,0.8);
    color: #f0d060;
  }
  .stone-logo-dot {
    font-family: 'Cinzel', serif;
    color: var(--parchment-dim);
    font-size: 1rem;
    font-weight: 400;
    margin-left: 0.2rem;
  }
  .stone-logo-runes {
    font-family: 'IM Fell English', serif;
    font-size: 0.55rem;
    color: var(--gold-dim);
    letter-spacing: 0.3em;
    display: block;
    margin-top: 0.1rem;
    opacity: 0.6;
  }

  /* ── NAV LINKS ── */
  .stone-nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--parchment-dim);
    text-decoration: none;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .stone-nav-link:hover {
    color: var(--gold-light);
    border-color: rgba(200,150,12,0.2);
    background: rgba(200,150,12,0.04);
    text-shadow: 0 0 8px rgba(200,150,12,0.3);
  }
  .stone-nav-link.active {
    color: var(--gold);
    border-color: rgba(200,150,12,0.35);
    background: rgba(200,150,12,0.07);
    text-shadow: 0 0 10px rgba(200,150,12,0.4);
    box-shadow: inset 0 0 12px rgba(0,0,0,0.4);
  }
  .stone-nav-link.active::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .stone-nav-sep {
    color: var(--gold-dim);
    font-size: 0.9rem;
    opacity: 0.4;
    font-family: 'IM Fell English', serif;
  }

  /* ── ICON BUTTONS ── */
  .stone-icon-btn {
    position: relative;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, var(--stone-mid), var(--stone-dark));
    border: 1px solid var(--stone-border);
    color: var(--parchment-dim);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
  }
  .stone-icon-btn:hover {
    border-color: var(--gold-dim);
    color: var(--gold);
    box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 0 10px rgba(200,150,12,0.12);
  }
  .stone-badge {
    position: absolute;
    top: -4px; right: -4px;
    width: 16px; height: 16px;
    background: var(--blood);
    border: 1px solid #a02020;
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    color: #ffaaaa;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
  }

  /* ── USER BUTTON ── */
  .stone-user-btn {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 0.8rem 0.45rem 0.5rem;
    background: linear-gradient(160deg, var(--stone-light), var(--stone-mid));
    border: 1px solid var(--stone-border);
    color: var(--parchment-dim);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: inset 0 0 12px rgba(0,0,0,0.5);
  }
  .stone-user-btn:hover {
    border-color: var(--gold-dim);
    box-shadow: inset 0 0 12px rgba(0,0,0,0.5), 0 0 12px rgba(200,150,12,0.1);
  }
  .stone-avatar {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #3d2a10, #6b4a18);
    border: 1px solid var(--gold-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cinzel Decorative', serif;
    font-size: 0.75rem;
    color: var(--gold);
    font-weight: 700;
    text-shadow: 0 0 6px rgba(200,150,12,0.4);
  }
  .stone-user-name {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    color: var(--parchment-dim);
    text-transform: uppercase;
  }
  .stone-chevron {
    font-size: 0.5rem;
    color: var(--gold-dim);
    transition: transform 0.2s;
  }

  /* ── DROPDOWN ── */
  .stone-dropdown {
    position: absolute;
    right: 0; top: calc(100% + 8px);
    min-width: 240px;
    background: linear-gradient(160deg, #16120c, #0d0b07);
    border: 1px solid var(--stone-border);
    border-top: 2px solid var(--gold-dim);
    box-shadow: 0 12px 40px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.5);
    z-index: 50;
    overflow: hidden;
  }
  .stone-dropdown::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
    background-size: 150px;
    opacity: 0.04;
    pointer-events: none;
  }

  .stone-dropdown-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--stone-border);
    background: rgba(200,150,12,0.04);
  }
  .stone-dropdown-title {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: var(--gold-dim);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .stone-dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(61,48,32,0.4);
    color: var(--parchment-dim);
    text-decoration: none;
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: all 0.15s;
    cursor: pointer;
    background: transparent;
    width: 100%;
    text-align: left;
  }
  .stone-dropdown-item:last-child { border-bottom: none; }
  .stone-dropdown-item:hover {
    background: rgba(200,150,12,0.05);
    color: var(--gold);
    padding-left: 1.25rem;
  }
  .stone-dropdown-item-danger {
    color: #8b3030;
    border-top: 1px solid rgba(139,26,26,0.2);
  }
  .stone-dropdown-item-danger:hover {
    background: rgba(139,26,26,0.1);
    color: #c04040;
  }

  /* ── NOTIF DROPDOWN ── */
  .stone-notif-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(61,48,32,0.4);
    transition: background 0.15s;
    cursor: pointer;
  }
  .stone-notif-item:hover { background: rgba(200,150,12,0.04); }
  .stone-notif-item.unread { background: rgba(200,150,12,0.03); }
  .stone-notif-text {
    font-family: 'IM Fell English', serif;
    font-size: 0.7rem;
    color: var(--parchment-dim);
    line-height: 1.4;
  }
  .stone-notif-time {
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    color: var(--gold-dim);
    letter-spacing: 0.08em;
    margin-top: 0.25rem;
  }

  /* ── MOBILE MENU ── */
  .stone-mobile-menu {
    background: linear-gradient(180deg, #0f0c08, #0a0806);
    border-top: 1px solid var(--stone-border);
    box-shadow: 0 8px 20px rgba(0,0,0,0.8);
  }
  .stone-mobile-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.25rem;
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--parchment-dim);
    text-decoration: none;
    border-bottom: 1px solid rgba(61,48,32,0.3);
    transition: all 0.15s;
  }
  .stone-mobile-link:hover, .stone-mobile-link.active {
    color: var(--gold);
    background: rgba(200,150,12,0.04);
    padding-left: 1.5rem;
  }
  .stone-mobile-sep {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
    margin: 0.5rem 0;
    opacity: 0.4;
  }
  .stone-mobile-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.9rem;
    margin-top: 0.5rem;
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8b3030;
    background: rgba(139,26,26,0.06);
    border: 1px solid rgba(139,26,26,0.2);
    cursor: pointer;
    transition: all 0.15s;
  }
  .stone-mobile-logout:hover {
    background: rgba(139,26,26,0.15);
    color: #c04040;
    border-color: rgba(139,26,26,0.4);
  }

  /* ── HAMBURGER ── */
  .stone-hamburger {
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, var(--stone-mid), var(--stone-dark));
    border: 1px solid var(--stone-border);
    color: var(--parchment-dim);
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .stone-hamburger:hover {
    border-color: var(--gold-dim);
    color: var(--gold);
  }

  @keyframes rune-scroll {
    0%   { transform: translateX(100vw); }
    100% { transform: translateX(-100%); }
  }
`;

const NAV_ITEMS = [
  { path: "/",           label: "Dimora",   rune: "ᚠ" },
  { path: "/servers",    label: "Gilde",    rune: "ᚷ" },
  { path: "/leaderboard",label: "Cronache", rune: "ᛏ" },
  { path: "/docs",       label: "Pergamene",rune: "ᛒ" },
];

const NOTIFICATIONS = [
  { id: 1, text: "Nuovo evento PvP questo weekend!", icon: "⚔️", time: "2h fa", unread: true },
  { id: 2, text: "Il tuo server ha ricevuto 5 nuovi voti", icon: "🔥", time: "5h fa", unread: true },
  { id: 3, text: "Risposta al tuo topic nel forum", icon: "📜", time: "1 giorno fa", unread: false },
];

const HeaderStone: Component = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [showUserMenu, setShowUserMenu] = createSignal(false);
  const [notificationsOpen, setNotificationsOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = () => NOTIFICATIONS.filter(n => n.unread).length;

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onCleanup(() => window.removeEventListener('scroll', onScroll));
  });

  createEffect(() => {
    location.pathname;
    setMenuOpen(false);
    setShowUserMenu(false);
    setNotificationsOpen(false);
  });

  return (
    <>
      <style>{STYLES}</style>
      <header class="stone-header" style={{ position: "sticky", top: 0, "z-index": 100 }}>

        {/* Rune ticker */}
        <div class="rune-ticker-wrap">
          <span class="rune-ticker">{`${RUNE_ROW} ✦ `.repeat(8)}</span>
        </div>

        {/* Main bar */}
        <div class="stone-header-main" style={{
          background: scrolled()
            ? "linear-gradient(180deg, #080604, #0d0b07)"
            : "linear-gradient(180deg, #0a0806, #100d08)",
        }}>
          {/* Corner rune decorations */}
          <span class="stone-corner" style={{ top: "6px", left: "8px" }}>ᚠ</span>
          <span class="stone-corner" style={{ top: "6px", right: "8px" }}>ᛟ</span>

          <div style="max-width: 1400px; margin: 0 auto; padding: 0 1rem; position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.7rem 0;">

              {/* LOGO */}
              <A href="/" style="text-decoration: none; display: flex; flex-direction: column; line-height: 1;">
                <span class="stone-logo-text">H-YTALE<span class="stone-logo-dot">.top</span></span>
                <span class="stone-logo-runes">ᚺ ᛃ ᛏ ᚨ ᛚ ᛖ</span>
              </A>

              {/* Divider ornamental */}
              <div style="flex: 0 0 auto; display: flex; align-items: center; gap: 0.4rem; color: var(--gold-dim); font-size: 0.9rem; opacity: 0.4;" class="hidden-mobile">
                ᛜ
              </div>

              {/* Desktop Nav */}
              <nav style="display: none;" class="stone-desktop-nav">
                <style>{`.stone-desktop-nav { display: flex !important; align-items: center; gap: 0.2rem; } @media (max-width: 768px) { .stone-desktop-nav { display: none !important; } .hidden-mobile { display: none !important; } }`}</style>
                {NAV_ITEMS.map((item, i) => (
                  <>
                    <A
                      href={item.path}
                      class={`stone-nav-link ${isActive(item.path) ? "active" : ""}`}
                    >
                      <span style={{ color: "var(--gold-dim)", "font-family": "'IM Fell English', serif" }}>{item.rune}</span>
                      {item.label}
                    </A>
                    {i < NAV_ITEMS.length - 1 && <span class="stone-nav-sep">⸺</span>}
                  </>
                ))}
              </nav>

              {/* Right actions */}
              <div style="display: flex; align-items: center; gap: 0.5rem;">

                {/* Notifications */}
                <Show when={isAuthenticated()}>
                  <div style="position: relative;">
                    <button
                      class="stone-icon-btn"
                      onClick={() => { setNotificationsOpen(!notificationsOpen()); setShowUserMenu(false); }}
                    >
                      🔔
                      <Show when={unreadCount() > 0}>
                        <span class="stone-badge">{unreadCount()}</span>
                      </Show>
                    </button>

                    <Show when={notificationsOpen()}>
                      <div class="stone-dropdown" style="width: 300px;">
                        <div class="stone-dropdown-header">
                          <div class="stone-dropdown-title">🔔 ᛜ Messaggi del Regno</div>
                        </div>
                        <div style="max-height: 280px; overflow-y: auto;">
                          {NOTIFICATIONS.map(n => (
                            <div class={`stone-notif-item ${n.unread ? "unread" : ""}`}>
                              <span style="font-size: 1.2rem; margin-top: 2px;">{n.icon}</span>
                              <div>
                                <div class="stone-notif-text">{n.text}</div>
                                <div class="stone-notif-time">ᚦ {n.time}</div>
                              </div>
                              <Show when={n.unread}>
                                <div style="width: 6px; height: 6px; border-radius: 50%; background: var(--gold); margin-top: 4px; flex-shrink: 0; box-shadow: 0 0 6px rgba(200,150,12,0.5);" />
                              </Show>
                            </div>
                          ))}
                        </div>
                        <div style="padding: 0.6rem 1rem; border-top: 1px solid var(--stone-border); text-align: center;">
                          <span style="font-family: 'Cinzel', serif; font-size: 0.5rem; color: var(--gold-dim); letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;">
                            ✦ Vedi tutte le Cronache ✦
                          </span>
                        </div>
                      </div>
                    </Show>
                  </div>
                </Show>

                {/* User / Login */}
                <Show
                  when={isAuthenticated()}
                  fallback={<div class="hidden-md"><style>{`.hidden-md { display: none; } @media (min-width: 640px) { .hidden-md { display: block !important; } }`}</style><DiscordLoginButton /></div>}
                >
                  <div style="position: relative;">
                    <button
                      class="stone-user-btn"
                      onClick={() => { setShowUserMenu(!showUserMenu()); setNotificationsOpen(false); }}
                    >
                      <div class="stone-avatar">{user()?.username?.charAt(0).toUpperCase() || "G"}</div>
                      <span class="stone-user-name stone-desktop-only">
                        <style>{`.stone-desktop-only { display: none; } @media (min-width: 900px) { .stone-desktop-only { display: inline !important; } }`}</style>
                        {user()?.username || "Guerriero"}
                      </span>
                      <span class="stone-chevron" style={{ transform: showUserMenu() ? "rotate(180deg)" : "none" }}>▾</span>
                    </button>

                    <Show when={showUserMenu()}>
                      <div class="stone-dropdown">
                        {/* User info */}
                        <div class="stone-dropdown-header">
                          <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div class="stone-avatar" style="width: 36px; height: 36px; font-size: 1rem;">
                              {user()?.username?.charAt(0).toUpperCase() || "G"}
                            </div>
                            <div>
                              <div style="font-family: 'Cinzel', serif; font-size: 0.7rem; color: var(--parchment); letter-spacing: 0.05em;">
                                {user()?.username}
                              </div>
                              <div style="font-family: 'IM Fell English', serif; font-size: 0.6rem; color: var(--gold-dim); font-style: italic;">
                                ᛜ Guerriero del Regno
                              </div>
                            </div>
                          </div>
                        </div>

                        <A href="/panel" class="stone-dropdown-item">
                          <span>⚔️</span> I Miei Feudi
                        </A>
                        <A href="/favorites" class="stone-dropdown-item">
                          <span>⭐</span> Luoghi Prediletti
                        </A>
                        <A href="/settings" class="stone-dropdown-item">
                          <span>🔧</span> Pergamene di Config.
                        </A>
                        <button
                          class="stone-dropdown-item stone-dropdown-item-danger"
                          onClick={() => { logout(); setShowUserMenu(false); }}
                        >
                          <span>🚪</span> Abbandonare il Regno
                        </button>
                      </div>
                    </Show>
                  </div>
                </Show>

                {/* Hamburger mobile */}
                <button class="stone-hamburger stone-mobile-only" onClick={() => setMenuOpen(!menuOpen())}>
                  <style>{`.stone-mobile-only { display: flex !important; } @media (min-width: 769px) { .stone-mobile-only { display: none !important; } }`}</style>
                  <span style={{ "font-family": "'IM Fell English', serif" }}>{menuOpen() ? "✕" : "☰"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Show when={menuOpen()}>
          <div class="stone-mobile-menu">
            <div style="padding: 0.5rem 0;">
              {NAV_ITEMS.map(item => (
                <A
                  href={item.path}
                  class={`stone-mobile-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ color: "var(--gold-dim)", "font-family": "'IM Fell English', serif", "font-size": "1rem" }}>
                    {item.rune}
                  </span>
                  {item.label}
                </A>
              ))}

              <div class="stone-mobile-sep" />

              <Show
                when={isAuthenticated()}
                fallback={<div style="padding: 0.75rem 1rem;"><DiscordLoginButton /></div>}
              >
                <A href="/panel" class="stone-mobile-link" onClick={() => setMenuOpen(false)}>
                  <span>⚔️</span> I Miei Feudi
                </A>
                <A href="/favorites" class="stone-mobile-link" onClick={() => setMenuOpen(false)}>
                  <span>⭐</span> Luoghi Prediletti
                </A>
                <div style="padding: 0 0.75rem 0.75rem;">
                  <button class="stone-mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                    🚪 Abbandonare il Regno
                  </button>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* Overlay chiudi dropdown */}
        <Show when={showUserMenu() || notificationsOpen()}>
          <div
            style="position: fixed; inset: 0; z-index: 40;"
            onClick={() => { setShowUserMenu(false); setNotificationsOpen(false); }}
          />
        </Show>
      </header>
    </>
  );
};

export default HeaderStone;