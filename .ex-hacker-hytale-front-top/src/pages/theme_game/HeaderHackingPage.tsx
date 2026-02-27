import { Component, createSignal, Show, createEffect, onMount, onCleanup } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useAuth } from "../../auth/AuthContext";
import DiscordLoginButton from "../../component/button/DiscordLoginButton";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

  :root {
    --g-dark:    #020d02;
    --g-mid:     #041004;
    --g-border:  #0a2a0a;
    --g-bright:  #00ff00;
    --g-mid-green: #00cc00;
    --g-dim:     #005500;
    --g-dimmer:  #003300;
    --g-dead:    #001a00;
  }

  .hk-header {
    top: 0;
    z-index: 100;
    font-family: 'Share Tech Mono', monospace;
  }

  /* ── TICKER ── */
  .hk-ticker-wrap {
    overflow: hidden;
    background: #010801;
    border-bottom: 1px solid var(--g-border);
    padding: 0.25rem 0;
    position: relative;
  }
  .hk-ticker-wrap::before,
  .hk-ticker-wrap::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 60px;
    z-index: 2;
    pointer-events: none;
  }
  .hk-ticker-wrap::before { left: 0; background: linear-gradient(90deg, #010801, transparent); }
  .hk-ticker-wrap::after  { right: 0; background: linear-gradient(270deg, #010801, transparent); }

  .hk-ticker {
    display: inline-block;
    white-space: nowrap;
    animation: hk-marquee 25s linear infinite;
    font-size: 1.2em;
    color: var(--g-dim);
    letter-spacing: 0.1em;
  }

  /* ── MAIN BAR ── */
  .hk-bar {
    background: linear-gradient(180deg, #010d01 0%, #020d02 60%, #010801 100%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,255,0,0.02);
  }

  /* Scanlines */
  .hk-bar::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,255,0,0.015) 2px, rgba(0,255,0,0.015) 4px
    );
    pointer-events: none;
    z-index: 0;
  }

  /* Bottom glow line */
  .hk-bar::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--g-dim) 30%, var(--g-mid-green) 50%, var(--g-dim) 70%, transparent);
    opacity: 0.4;
  }

  /* ── LOGO ── */
  .hk-logo {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    line-height: 1;
    position: relative;
    z-index: 1;
  }
  .hk-logo-main {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 1.1rem;
    color: var(--g-mid-green);
    text-shadow: 0 0 10px rgba(0,255,0,0.5), 0 0 30px rgba(0,255,0,0.2);
    letter-spacing: 0.1em;
    transition: all 0.2s;
    animation: hk-flicker 7s ease-in-out infinite;
  }
  .hk-logo:hover .hk-logo-main {
    color: var(--g-bright);
    text-shadow: 0 0 15px rgba(0,255,0,0.7), 0 0 40px rgba(0,255,0,0.3);
  }
  .hk-logo-sub {
    font-size: 0.5rem;
    color: var(--g-dimmer);
    letter-spacing: 0.25em;
    margin-top: 0.15rem;
  }

  /* ── STATUS INDICATOR ── */
  .hk-status {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.55rem;
    color: var(--g-dimmer);
    letter-spacing: 0.1em;
    position: relative;
    z-index: 1;
  }
  .hk-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--g-mid-green);
    box-shadow: 0 0 6px var(--g-mid-green);
    animation: hk-pulse 2s ease-in-out infinite;
  }

  /* ── NAV ── */
  .hk-nav {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    position: relative;
    z-index: 1;
  }
  .hk-nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.8em;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--g-dim);
    text-decoration: none;
    transition: all 0.15s;
    border: 1px solid transparent;
  }
  .hk-nav-link:hover {
    color: var(--g-mid-green);
    border-color: var(--g-border);
    background: rgba(0,40,0,0.4);
    text-shadow: 0 0 8px rgba(0,255,0,0.3);
  }
  .hk-nav-link.active {
    color: var(--g-mid-green);
    border-color: var(--g-dim);
    background: rgba(0,40,0,0.5);
    text-shadow: 0 0 10px rgba(0,255,0,0.4);
  }
  .hk-nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--g-mid-green), transparent);
  }
  .hk-nav-index {
    color: var(--g-dimmer);
    font-size: 1em;
  }

  /* ── ICON BUTTONS ── */
  .hk-icon-btn {
    position: relative;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,20,0,0.6);
    border: 1px solid var(--g-border);
    color: var(--g-dim);
    font-size: 1em;
    cursor: pointer;
    transition: all 0.15s;
    z-index: 1;
  }
  .hk-icon-btn:hover {
    border-color: var(--g-dim);
    color: var(--g-mid-green);
    background: rgba(0,40,0,0.6);
    box-shadow: 0 0 10px rgba(0,255,0,0.08);
  }
  .hk-badge {
    position: absolute;
    top: -4px; right: -4px;
    width: 14px; height: 14px;
    background: #2a0000;
    border: 1px solid #550000;
    font-size: 1em;
    color: #ff4444;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', monospace;
    font-weight: 700;
  }

  /* ── USER BUTTON ── */
  .hk-user-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.7rem 0.35rem 0.4rem;
    background: rgba(0,20,0,0.6);
    border: 1px solid var(--g-border);
    color: var(--g-dim);
    cursor: pointer;
    transition: all 0.15s;
    z-index: 1;
    position: relative;
  }
  .hk-user-btn:hover {
    border-color: var(--g-dim);
    background: rgba(0,40,0,0.6);
    box-shadow: 0 0 10px rgba(0,255,0,0.06);
  }
  .hk-avatar {
    width: 26px; height: 26px;
    background: linear-gradient(135deg, #001a00, #003300);
    border: 1px solid var(--g-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    color: var(--g-mid-green);
    text-shadow: 0 0 6px rgba(0,255,0,0.4);
  }
  .hk-username {
    font-size: 0.58rem;
    color: var(--g-dim);
    letter-spacing: 0.08em;
  }
  .hk-chevron {
    font-size: 0.45rem;
    color: var(--g-dimmer);
    transition: transform 0.15s;
  }

  /* ── DROPDOWN ── */
  .hk-dropdown {
    position: absolute;
    right: 0; top: calc(100% + 6px);
    min-width: 220px;
    background: linear-gradient(160deg, #010d01, #020d02);
    border: 1px solid var(--g-border);
    border-top: 1px solid var(--g-dim);
    box-shadow: 0 12px 40px rgba(0,0,0,0.95), 0 0 20px rgba(0,255,0,0.03);
    z-index: 50;
    overflow: hidden;
  }
  .hk-dropdown::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,255,0,0.01) 2px, rgba(0,255,0,0.01) 4px
    );
    pointer-events: none;
  }

  .hk-dropdown-header {
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid var(--g-border);
    background: rgba(0,30,0,0.4);
  }
  .hk-dropdown-prompt {
    font-size: 0.55rem;
    color: var(--g-dimmer);
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .hk-dropdown-username {
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    color: var(--g-mid-green);
    text-shadow: 0 0 6px rgba(0,255,0,0.3);
    margin-top: 0.2rem;
    letter-spacing: 0.05em;
  }

  .hk-dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid rgba(0,42,0,0.5);
    color: var(--g-dim);
    text-decoration: none;
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    transition: all 0.1s;
    cursor: pointer;
    background: transparent;
    width: 100%;
    text-align: left;
    
  }
  .hk-dropdown-item:last-child { border-bottom: none; }
  .hk-dropdown-item:hover {
    background: rgba(0,40,0,0.5);
    color: var(--g-mid-green);
    padding-left: 1.1rem;
    text-shadow: 0 0 6px rgba(0,255,0,0.3);
  }
  .hk-dropdown-cmd {
    color: var(--g-dimmer);
    font-size: 0.5rem;
  }
  .hk-dropdown-item-danger {
    color: #c7c7c7;
    border-top: 1px solid rgba(80,0,0,0.3);
  }
  .hk-dropdown-item-danger:hover {
    background: rgba(40,0,0,0.5);
    color: #cc3333;
    text-shadow: 0 0 6px rgba(200,0,0,0.3);
  }

  /* ── NOTIF ── */
  .hk-notif-item {
    display: flex;
    gap: 0.6rem;
    padding: 0.65rem 0.8rem;
    border-bottom: 1px solid rgba(0,42,0,0.5);
    cursor: pointer;
    transition: background 0.1s;
  }
  .hk-notif-item:hover { background: rgba(0,30,0,0.5); }
  .hk-notif-item.unread { background: rgba(0,20,0,0.4); }
  .hk-notif-text {
    font-size: 0.62rem;
    color: var(--g-dim);
    line-height: 1.5;
  }
  .hk-notif-time {
    font-size: 0.5rem;
    color: var(--g-dimmer);
    margin-top: 0.2rem;
    letter-spacing: 0.05em;
  }
  .hk-notif-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--g-mid-green);
    box-shadow: 0 0 4px var(--g-mid-green);
    flex-shrink: 0;
    margin-top: 4px;
  }

  /* ── MOBILE MENU ── */
  .hk-mobile-menu {
    background: linear-gradient(180deg, #010d01, #020802);
    border-top: 1px solid var(--g-border);
    box-shadow: 0 8px 20px rgba(0,0,0,0.9);
  }
  .hk-mobile-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 1rem;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--g-dim);
    text-decoration: none;
    border-bottom: 1px solid rgba(0,42,0,0.3);
    transition: all 0.1s;
  }
  .hk-mobile-link:hover, .hk-mobile-link.active {
    color: var(--g-mid-green);
    background: rgba(0,30,0,0.4);
    padding-left: 1.25rem;
    text-shadow: 0 0 6px rgba(0,255,0,0.3);
  }
  .hk-mobile-sep {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--g-border), transparent);
    margin: 0.25rem 0;
  }
  .hk-mobile-logout {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.8rem;
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #550000;
    background: rgba(30,0,0,0.4);
    border: 1px solid rgba(80,0,0,0.3);
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 0.25rem;
  }
  .hk-mobile-logout:hover {
    color: #cc3333;
    background: rgba(50,0,0,0.5);
    border-color: rgba(120,0,0,0.4);
    text-shadow: 0 0 6px rgba(200,0,0,0.3);
  }

  /* ── HAMBURGER ── */
  .hk-hamburger {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,20,0,0.6);
    border: 1px solid var(--g-border);
    color: var(--g-dim);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.15s;
    z-index: 1;
    position: relative;
  }
  .hk-hamburger:hover {
    border-color: var(--g-dim);
    color: var(--g-mid-green);
    box-shadow: 0 0 8px rgba(0,255,0,0.08);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .hk-desktop-only { display: none !important; }
  }
  @media (min-width: 769px) {
    .hk-mobile-only { display: none !important; }
  }
  @media (min-width: 900px) {
    .hk-xl-only { display: inline !important; }
  }
  .hk-xl-only { display: none; }

  /* ── KEYFRAMES ── */
  @keyframes hk-marquee {
    0%   { transform: translateX(100vw); }
    100% { transform: translateX(-100%); }
  }
  @keyframes hk-pulse {
    0%,100% { opacity: 1; box-shadow: 0 0 6px var(--g-mid-green); }
    50%     { opacity: 0.4; box-shadow: 0 0 2px var(--g-mid-green); }
  }
  @keyframes hk-flicker {
    0%,100% { opacity: 1; }
    95%     { opacity: 1; }
    96%     { opacity: 0.5; }
    97%     { opacity: 1; }
    99%     { opacity: 0.8; }
  }
  @keyframes hk-blink {
    0%,100% { opacity: 1; }
    50%     { opacity: 0; }
  }
  .hk-blink { animation: hk-blink 1s step-end infinite; }
`;


const NAV_ITEMS = [
  { path: "/",            label: "HOME",       cmd: "cd ~"        },
  { path: "/servers",     label: "SERVERS",    cmd: "ls /srv"     },
  { path: "/leaderboard", label: "TOP",        cmd: "sort --rank" },
  { path: "/docs",        label: "PLUGIn & API",       cmd: "man pages"   },
];

const NOTIFICATIONS = [
  { id: 1, text: "Nuovo evento PvP questo weekend!", icon: "⚔️", time: "2h fa", unread: false },
  { id: 2, text: "Il tuo server ha ricevuto 5 nuovi voti", icon: "🔥", time: "5h fa", unread: false },
  { id: 3, text: "Risposta al tuo topic nel forum", icon: "💬", time: "1gg fa", unread: false },
];

const HeaderHacking: Component = () => {
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
      <header class="hk-header">

        {/* Main bar */}
        <div class="hk-bar" style={{ opacity: scrolled() ? "0.97" : "1" }}>
          <div style="max-width: 1400px; margin: 0 auto; padding: 0 1rem; position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.6rem 0;">

              {/* LOGO */}
              <A href="/" class="hk-logo">
                <span class="hk-logo-main">H-Y-TALE.top<span style="color: var(--g-dimmer); font-size: 0.9rem;">.top</span></span>
                <span class="hk-logo-sub">root@h-ytale:~$ <span class="hk-blink">_</span></span>
              </A>

              {/* Status */}
              <div class="hk-status hk-desktop-only">
                <div class="hk-status-dot" />
                SYS:OK // NET:LIVE
              </div>

              {/* Desktop Nav */}
              <nav class="hk-nav hk-desktop-only">
                {NAV_ITEMS.map((item, i) => (
                  <A
                    href={item.path}
                    class={`hk-nav-link ${isActive(item.path) ? "active" : ""}`}
                    title={item.cmd}
                  >
                    <span class="hk-nav-index">[{String(i + 1).padStart(2, '0')}]</span>
                    {item.label}
                  </A>
                ))}
              </nav>

              {/* Right actions */}
              <div style="display: flex; align-items: center; gap: 0.4rem; position: relative; z-index: 1;">

                {/* Notifications */}
                <Show when={isAuthenticated()}>
                  <div style="position: relative;">
                    <button
                      class="hk-icon-btn"
                      onClick={() => { setNotificationsOpen(!notificationsOpen()); setShowUserMenu(false); }}
                      title="cat /var/log/notifications"
                    >
                      🔔
                      <Show when={unreadCount() > 0}>
                        <span class="hk-badge">{unreadCount()}</span>
                      </Show>
                    </button>

                    <Show when={notificationsOpen()}>
                      <div class="hk-dropdown" style="width: 280px;">
                        <div class="hk-dropdown-header">
                          <div class="hk-dropdown-prompt">
                            <span style="color: var(--g-dim)">{'>'}</span>
                            cat /notifications
                          </div>
                        </div>
                        <div style="max-height: 260px; overflow-y: auto;">
                          {NOTIFICATIONS.map(n => (
                            <div class={`hk-notif-item ${n.unread ? "unread" : ""}`}>
                              <span style="font-size: 1rem; margin-top: 2px;">{n.icon}</span>
                              <div style="flex: 1;">
                                <div class="hk-notif-text">{n.text}</div>
                                <div class="hk-notif-time">// {n.time}</div>
                              </div>
                              <Show when={n.unread}>
                                <div class="hk-notif-dot" />
                              </Show>
                            </div>
                          ))}
                        </div>
                        <div style="padding: 0.5rem 0.8rem; border-top: 1px solid var(--g-border); text-align: center;">
                          <span style="font-size: 0.5rem; color: var(--g-dimmer); letter-spacing: 0.1em; cursor: pointer;">
                            {'>'} ls -la /notifications --all
                          </span>
                        </div>
                      </div>
                    </Show>
                  </div>
                </Show>

                {/* User / Login */}
                <Show
                  when={isAuthenticated()}
                  fallback={
                    <div class="hk-desktop-only">
                      <DiscordLoginButton />
                    </div>
                  }
                >
                  <div style="position: relative;">
                    <button
                      class="hk-user-btn"
                      onClick={() => { setShowUserMenu(!showUserMenu()); setNotificationsOpen(false); }}
                    >
                      <div class="hk-avatar">{user()?.username?.charAt(0).toUpperCase() || "R"}</div>
                      <span class="hk-username hk-xl-only">{user()?.username || "root"}</span>
                      <span class="hk-chevron" style={{ transform: showUserMenu() ? "rotate(180deg)" : "none" }}>▾</span>
                    </button>

                    <Show when={showUserMenu()}>
                      <div class="hk-dropdown">
                        <div class="hk-dropdown-header">
                          <div class="hk-dropdown-prompt">
                            <span style="color: var(--g-dim)">{'>'}</span> whoami
                          </div>
                          <div class="hk-dropdown-username">{user()?.username || "root"}</div>
                        </div>

                        <A href="/panel" class="hk-dropdown-item">
                          <span class="hk-dropdown-cmd">{'>'}</span>
                          <span>ls ./my-servers</span>
                        </A>
        

                        <button
                          class="hk-dropdown-item hk-dropdown-item-danger"
                          onClick={() => { logout(); setShowUserMenu(false); }}
                        >
                          <span class="hk-dropdown-cmd" style="color: #c3c3c3">{'>'}</span>
                          <span>sudo logout --force</span>
                        </button>
                      </div>
                    </Show>
                  </div>
                </Show>

                {/* Hamburger */}
                <button
                  class="hk-hamburger hk-mobile-only"
                  onClick={() => setMenuOpen(!menuOpen())}
                >
                  {menuOpen() ? "✕" : "≡"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Show when={menuOpen()}>
          <div class="hk-mobile-menu">
            <div style="padding: 0.25rem 0;">
              {NAV_ITEMS.map((item, i) => (
                <A
                  href={item.path}
                  class={`hk-mobile-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style="color: var(--g-dimmer); font-size: 0.5rem;">[{String(i+1).padStart(2,'0')}]</span>
                  {item.label}
                  <span style="margin-left: auto; font-size: 0.5rem; color: var(--g-dimmer);">{item.cmd}</span>
                </A>
              ))}

              <div class="hk-mobile-sep" />

              <Show
                when={isAuthenticated()}
                fallback={<div style="padding: 0.75rem 1rem;"><DiscordLoginButton /></div>}
              >
                <A href="/panel" class="hk-mobile-link" onClick={() => setMenuOpen(false)}>
                  <span style="color: var(--g-dimmer)">{'>'}</span> ls ./my-servers
                </A>
                <A href="/favorites" class="hk-mobile-link" onClick={() => setMenuOpen(false)}>
                  <span style="color: var(--g-dimmer)">{'>'}</span> cat ./favorites
                </A>
                <div style="padding: 0 0.75rem 0.75rem;">
                  <button class="hk-mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>
                    {'>'} sudo logout --force
                  </button>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* Overlay */}
        <Show when={showUserMenu() || notificationsOpen()}>
          <div
            style="position: fixed; inset: 10; z-index: 50009;"

            onClick={() => { setShowUserMenu(false); setNotificationsOpen(false); }}
          />
        </Show>
      </header>
    </>
  );
};

export default HeaderHacking;