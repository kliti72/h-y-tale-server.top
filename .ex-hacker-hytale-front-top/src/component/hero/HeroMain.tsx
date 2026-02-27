// src/components/HomeHero.tsx
import { Component, createEffect, createResource, Match, Switch } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import { ServerService } from "../../services/server.service";
import GamingCard from "../card/ServerCard/GamingCard";
import ServerCardHacking from "../card/ServerCard/ServerCardHacking";

// --- Glitch Text Component ---
const GlitchText: Component<{ text: string; class?: string }> = (props) => {
  return (
    <span
      class={`glitch-text ${props.class ?? ""}`}
      data-text={props.text}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {props.text}
    </span>
  );
};

// --- Matrix Rain Canvas ---
const MatrixRain: Component = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) return;
    const canvas = canvasRef;
    const ctx = canvas.getContext("2d")!;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01ハヒフヘホマミムメモヤユヨラリルレロワヲン ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const green = Math.random() > 0.95 ? "#fff" : "#00ff41";
        ctx.fillStyle = green;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <canvas
      ref={canvasRef}
      class="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      style={{ "z-index": "0" }}
    />
  );
};

// --- Typing Effect ---
const TypingText: Component<{ texts: string[] }> = (props) => {
  const [displayed, setDisplayed] = createSignal("");
  const [textIdx, setTextIdx] = createSignal(0);
  const [charIdx, setCharIdx] = createSignal(0);
  const [deleting, setDeleting] = createSignal(false);

  onMount(() => {
    const tick = () => {
      const current = props.texts[textIdx()];
      if (!deleting()) {
        setCharIdx((c) => c + 1);
        setDisplayed(current.slice(0, charIdx()));
        if (charIdx() >= current.length) {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        setCharIdx((c) => c - 1);
        setDisplayed(current.slice(0, charIdx()));
        if (charIdx() <= 0) {
          setDeleting(false);
          setTextIdx((i) => (i + 1) % props.texts.length);
        }
      }
    };
    const interval = setInterval(tick, deleting() ? 40 : 80);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <span class="text-green-400 font-mono">
      {displayed()}
      <span class="animate-pulse text-green-300">█</span>
    </span>
  );
};

// --- Scanline Overlay ---
const Scanlines: Component = () => (
  <div
    class="fixed inset-0 pointer-events-none"
    style={{
      "z-index": "1",
      background:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)",
    }}
  />
);

// --- Main Component ---
const HeroMain: Component = () => {
  const navigate = useNavigate();
  const [featuredd] = createResource(() => ServerService.getServers());
  const featured = () => featuredd()?.data ?? [];

  const DISCORD_GUILD_ID = "610190493862854676";
  const DISCORD_INVITE = "https://discord.gg/tuoinvito";

  const fetchOnlineCount = async () => {
    try {
      const res = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.presence_count ?? 0;
    } catch {
      return null;
    }
  };

  const [onlineCount] = createResource<number | null>(fetchOnlineCount);
  const [bootDone, setBootDone] = createSignal(false);
  const [bootLines, setBootLines] = createSignal<string[]>([]);

  const bootSequence = [
    "> INITIALIZING HYTALE_REALM_OS v2.4.1...",
    "> LOADING kernel modules... [OK]",
    "> Mounting server database... [OK]",
    "> Scanning active realms... [FOUND 247 SERVERS]",
    "> Establishing secure connection... [OK]",
    "> ACCESS GRANTED. Welcome, traveler.",
  ];

  onMount(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setBootLines((prev) => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootDone(true), 600);
      }
    }, 320);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

        .hero-root {
          font-family: 'Share Tech Mono', monospace;
        }

        .glitch-text {
          animation: glitch 4s infinite;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          color: #ff0055;
          animation: glitch-before 4s infinite;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
        }
        .glitch-text::after {
          color: #00ffff;
          animation: glitch-after 4s infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
        }
        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 1px); }
          94% { transform: translate(2px, -1px); }
          96% { transform: translate(-1px, 2px); }
        }
        @keyframes glitch-before {
          0%, 90%, 100% { transform: translate(0); opacity: 0; }
          92% { transform: translate(3px, 0); opacity: 0.8; }
          94% { transform: translate(-3px, 0); opacity: 0.8; }
          96% { transform: translate(0); opacity: 0; }
        }
        @keyframes glitch-after {
          0%, 90%, 100% { transform: translate(0); opacity: 0; }
          93% { transform: translate(-3px, 1px); opacity: 0.6; }
          95% { transform: translate(3px, -1px); opacity: 0.6; }
          97% { transform: translate(0); opacity: 0; }
        }

        .terminal-border {
          border: 1px solid rgba(0, 255, 65, 0.3);
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.1), inset 0 0 20px rgba(0, 255, 65, 0.03);
        }
        .terminal-border:hover {
          box-shadow: 0 0 40px rgba(0, 255, 65, 0.25), inset 0 0 30px rgba(0, 255, 65, 0.06);
        }

        .btn-hack {
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        .btn-hack::before {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: linear-gradient(120deg, transparent 30%, rgba(0,255,65,0.15) 50%, transparent 70%);
          transition: all 0.5s;
        }
        .btn-hack:hover::before {
          top: 100%;
          left: 100%;
        }
        .btn-hack:hover {
          box-shadow: 0 0 30px rgba(0,255,65,0.4);
          letter-spacing: 0.08em;
        }

        .btn-discord-hack {
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        .btn-discord-hack:hover {
          box-shadow: 0 0 30px rgba(99,102,241,0.5);
          letter-spacing: 0.08em;
        }

        .boot-line {
          animation: fadeInLine 0.3s ease forwards;
        }
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .corner-tl::before, .corner-tl::after,
        .corner-br::before, .corner-br::after {
          content: '';
          position: absolute;
          width: 16px; height: 16px;
        }
        .corner-decoration {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .corner-decoration::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 24px; height: 24px;
          border-top: 2px solid rgba(0,255,65,0.6);
          border-left: 2px solid rgba(0,255,65,0.6);
        }
        .corner-decoration::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 24px; height: 24px;
          border-bottom: 2px solid rgba(0,255,65,0.6);
          border-right: 2px solid rgba(0,255,65,0.6);
        }

        .scroll-track {
          scrollbar-width: thin;
          scrollbar-color: rgba(0,255,65,0.3) transparent;
        }
        .scroll-track::-webkit-scrollbar { height: 4px; }
        .scroll-track::-webkit-scrollbar-thumb { background: rgba(0,255,65,0.3); border-radius: 2px; }

        .status-dot {
          width: 8px; height: 8px;
          background: #00ff41;
          border-radius: 50%;
          animation: blink-dot 1.2s steps(1) infinite;
          box-shadow: 0 0 6px #00ff41;
        }
        @keyframes blink-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .hex-bg {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='rgba(0,255,65,0.04)' stroke-width='1'/%3E%3C/svg%3E");
          background-size: 60px 52px;
        }
      `}</style>

      <Scanlines />

      <section
        class="hero-root relative w-full min-h-screen flex flex-col items-center justify-center py-16 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #000300 0%, #000a00 40%, #000500 70%, #000200 100%)",
          "background-color": "#000300",
        }}
      >
        {/* Matrix rain background */}
        <MatrixRain />

        {/* Hex pattern */}
        <div class="absolute inset-0 hex-bg opacity-100 pointer-events-none" style={{ "z-index": "0" }} />

        {/* Glow orbs */}
        <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{
          background: "radial-gradient(circle, rgba(0,255,65,0.06) 0%, transparent 70%)",
          "z-index": "0",
        }} />
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{
          background: "radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%)",
          "z-index": "0",
        }} />

        {/* BOOT SEQUENCE */}
        <Show when={!bootDone()}>
          <div class="relative z-10 w-full max-w-2xl terminal-border bg-black/90 p-6 rounded-sm" style={{ "min-height": "220px" }}>
            <div class="corner-decoration" />
            <div class="flex items-center gap-2 mb-4 border-b border-green-900/50 pb-2">
              <div class="status-dot" />
              <span class="text-green-500 text-xs tracking-widest uppercase">HYTALE_OS TERMINAL</span>
            </div>
            <For each={bootLines()}>
              {(line) => (
                <div class="boot-line text-green-400 text-sm font-mono mb-1">
                  {line}
                </div>
              )}
            </For>
          </div>
        </Show>

        {/* MAIN CONTENT */}
        <Show when={bootDone()}>
          <div class="relative z-10 max-w-5xl mx-auto text-center w-full">

            {/* System label */}
            <div class="flex items-center justify-center gap-3 mb-6">
              <div class="h-px w-16 bg-gradient-to-r from-transparent to-green-500/60" />
              <span class="text-green-500/70 text-xs tracking-[0.3em] uppercase font-mono">
                SYSTEM ONLINE // REALM_DISCOVERY_v2
              </span>
              <div class="h-px w-16 bg-gradient-to-l from-transparent to-green-500/60" />
            </div>

            {/* MAIN TITLE */}
            <h1
              class="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4 leading-none"
              style={{ "font-family": "'Orbitron', monospace" }}
            >
              <span class="block text-green-400 mb-2" style={{ "font-size": "0.9em" }}>
                <GlitchText text="HYTALE" />
              </span>
              <span class="block text-white/90" style={{ "font-size": "0.55em", "letter-spacing": "0.15em", "font-family": "'Share Tech Mono', monospace" }}>
                SERVER DISCOVERY PROTOCOL
              </span>
            </h1>

            {/* Typing subtitle */}
            <p class="text-lg sm:text-xl text-green-900/80 max-w-2xl mx-auto mb-3 font-mono mt-6">
              <span class="text-green-600/60">&gt;&gt; </span>
              <TypingText texts={[
                "Esplora regni epici.",
                "Unisciti a comunità attive.",
                "Vota i tuoi server preferiti.",
                "Trova il tuo prossimo mondo.",
                "Conquista nuovi realm.",
              ]} />
            </p>

            <p class="text-green-700/50 text-sm font-mono mb-10 tracking-widest">
              [ 247 SERVER ATTIVI // LATENZA MEDIA: 23ms // STATUS: ONLINE ]
            </p>

            {/* CTA BUTTONS */}
            <div class="flex flex-wrap justify-center gap-4 mb-16">
              <button
                onClick={() => navigate("/servers")}
                class="btn-hack inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-green-400 terminal-border bg-black/80 rounded-sm tracking-widest uppercase"
              >
                <div class="corner-decoration" />
                <span class="text-green-500">▶</span>
                ESPLORA_TUTTI.exe
              </button>

              <button
                onClick={() => window.open(DISCORD_INVITE, "_blank")}
                class="btn-discord-hack inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-indigo-300 bg-black/80 rounded-sm tracking-widest uppercase"
                style={{
                  border: "1px solid rgba(99,102,241,0.4)",
                  "box-shadow": "0 0 20px rgba(99,102,241,0.08)",
                }}
              >
                <span class="text-indigo-400">⬡</span>
                DISCORD_LINK

                <Switch fallback={null}>
                  <Match when={onlineCount.loading}>
                    <span class="text-xs bg-indigo-900/40 border border-indigo-700/40 px-2 py-0.5 rounded-sm animate-pulse">
                      SYNC...
                    </span>
                  </Match>
                  <Match when={onlineCount() != null}>
                    <span class="text-xs bg-green-900/30 border border-green-700/40 px-2 py-0.5 rounded-sm text-green-400">
                      {onlineCount()?.toLocaleString() || 0} ONLINE
                    </span>
                  </Match>
                  <Match when={onlineCount() === null}>
                    <span class="text-xs bg-red-900/30 border border-red-700/40 px-2 py-0.5 rounded-sm text-red-400">
                      N/A
                    </span>
                  </Match>
                </Switch>
              </button>
            </div>

            {/* FEATURED SERVERS */}
            <div class="relative w-full">
              {/* Section header */}
              <div class="flex items-center gap-4 mb-6">
                <div class="h-px flex-1 bg-gradient-to-r from-transparent via-green-800/40 to-transparent" />
                <div class="terminal-border px-4 py-1 relative">
                  <div class="corner-decoration" />
                  <span class="text-green-500/80 text-xs tracking-[0.25em] uppercase font-mono">
                    // SERVER_IN_EVIDENZA
                  </span>
                </div>
                <div class="h-px flex-1 bg-gradient-to-r from-transparent via-green-800/40 to-transparent" />
              </div>

              {/* Cards scroll */}
              <div class="overflow-x-auto pb-4 scroll-track">
                <div class="flex gap-4 min-w-max px-2">
                  <Show
                    when={!featuredd.loading}
                    fallback={
                      <div class="flex gap-4">
                        <For each={Array(6)}>
                          {() => (
                            <div
                              class="w-64 h-40 rounded-sm animate-pulse"
                              style={{
                                background: "rgba(0,255,65,0.03)",
                                border: "1px solid rgba(0,255,65,0.1)",
                              }}
                            >
                              <div class="p-3 space-y-2">
                                <div class="h-3 bg-green-900/40 rounded-sm w-3/4" />
                                <div class="h-2 bg-green-900/30 rounded-sm w-1/2" />
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    }
                  >
                    <Show
                      when={featured()?.length >= 0}
                      fallback={
                        <p class="text-green-700/60 font-mono text-sm w-full text-center">
                          &gt; NO_SERVERS_FOUND // DATABASE VUOTO
                        </p>
                      }
                    >
                      <For each={featured()?.slice(0, 12)}>
                        {(server) => (
                          <ServerCardHacking server={server} onVoteRequest={() => ""} nascondiPulsanti={true} />
                        )}
                      </For>
                    </Show>
                  </Show>
                </div>
              </div>

              {/* Scroll hint */}
              <div class="text-center mt-3 text-green-800/50 text-xs font-mono tracking-widest">
                [ SCROLL_RIGHT → LOAD_MORE_SERVERS ]
              </div>
            </div>
          </div>
        </Show>
      </section>
    </>
  );
};

export default HeroMain;