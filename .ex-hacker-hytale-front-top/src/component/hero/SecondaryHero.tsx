import { Component, createSignal, onMount, onCleanup, For, createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { ServerService } from "../../services/server.service";

const SecondaryHero: Component = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = createSignal(false);
  const [counter, setCounter] = createSignal(0);
  const [servers] = createResource(() => ServerService.getServers());
  const TARGET = () => servers()?.data?.length ?? 0;

  onMount(() => {
    // Intersection observer per triggerare animazioni on scroll
    const el = document.getElementById("secondary-hero-root");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Counter animato
          let current = 0;
          const step = Math.ceil(TARGET() / 40);
          const interval = setInterval(() => {
            current = Math.min(current + step, TARGET());
            setCounter(current);
            if (current >= TARGET()) clearInterval(interval);
          }, 30);
          observer.disconnect();
          onCleanup(() => clearInterval(interval));
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    onCleanup(() => observer.disconnect());
  });

  const badges = [
    { label: "COPY_IP.exe", icon: "⬡", desc: "Istantanea" },
    { label: "VOTES_REALTIME", icon: "▲", desc: "Live feed" },
    { label: "ITA_&_INT_COMMUNITY", icon: "◈", desc: "Global" },
    { label: "UPTIME: 24/7", icon: "◉", desc: "Always on" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        #secondary-hero-root {
          font-family: 'Share Tech Mono', monospace;
        }

        .sh-fade-in {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .sh-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .sh-delay-1 { transition-delay: 0.1s; }
        .sh-delay-2 { transition-delay: 0.25s; }
        .sh-delay-3 { transition-delay: 0.4s; }
        .sh-delay-4 { transition-delay: 0.55s; }

        .sh-badge {
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          cursor: default;
        }
        .sh-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 40%, rgba(0,255,65,0.08) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .sh-badge:hover::before {
          transform: translateX(100%);
        }
        .sh-badge:hover {
          border-color: rgba(0,255,65,0.5) !important;
          box-shadow: 0 0 20px rgba(0,255,65,0.15);
          color: #00ff41 !important;
        }

        .sh-btn {
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          letter-spacing: 0.08em;
        }
        .sh-btn::after {
          content: '';
          position: absolute;
          top: -50%; left: -60%;
          width: 40%; height: 200%;
          background: rgba(0,255,65,0.12);
          transform: skewX(-20deg);
          transition: left 0.5s;
        }
        .sh-btn:hover::after {
          left: 130%;
        }
        .sh-btn:hover {
          box-shadow: 0 0 35px rgba(0,255,65,0.35);
          letter-spacing: 0.12em;
        }

        .sh-corner::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 18px; height: 18px;
          border-top: 1px solid rgba(0,255,65,0.5);
          border-left: 1px solid rgba(0,255,65,0.5);
        }
        .sh-corner::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 18px; height: 18px;
          border-bottom: 1px solid rgba(0,255,65,0.5);
          border-right: 1px solid rgba(0,255,65,0.5);
        }

        .sh-scanline {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,255,65,0.012) 3px,
            rgba(0,255,65,0.012) 4px
          );
        }

        .sh-counter {
          font-family: 'Orbitron', monospace;
          background: linear-gradient(135deg, #00ff41, #00cc33);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .blink-cursor {
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .sh-divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,65,0.3) 30%, rgba(0,255,65,0.3) 70%, transparent);
        }
      `}</style>

      <section
        id="secondary-hero-root"
        class="relative w-full py-14 sm:py-20 px-6 overflow-hidden sh-scanline"
        style={{
          background: "linear-gradient(180deg, #000500 0%, #000a02 50%, #000300 100%)",
          "border-top": "1px solid rgba(0,255,65,0.12)",
        }}
      >
        {/* Grid bg */}
        <div
          class="absolute inset-0 pointer-events-none opacity-30"
          style={{
            "background-image": `
              linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)
            `,
            "background-size": "40px 40px",
          }}
        />

        {/* Glow top center */}
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(0,255,65,0.07) 0%, transparent 70%)",
          }}
        />

        <div class="relative z-10 max-w-5xl mx-auto text-center">

          {/* System tag */}
          <div
            class={`sh-fade-in ${visible() ? "visible" : ""} sh-delay-1 inline-flex items-center gap-2 mb-6`}
          >
            <div class="h-px w-10 bg-green-700/50" />
            <span class="text-green-700/70 text-xs tracking-[0.3em] uppercase">
              MODULE: SERVER_BROWSER // v1.0
            </span>
            <div class="h-px w-10 bg-green-700/50" />
          </div>

          {/* Title */}
          <div class={`sh-fade-in ${visible() ? "visible" : ""} sh-delay-1 mb-2`}>
            <h2
              class="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none tracking-tight"
              style={{ "font-family": "'Orbitron', monospace" }}
            >
              TUTTI I SERVER
            </h2>
            <h2
              class="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 tracking-widest"
              style={{ "font-family": "'Share Tech Mono', monospace", color: "rgba(0,255,65,0.8)" }}
            >
              &gt; IN UN UNICO POSTO
              <span class="blink-cursor text-green-400 ml-1">_</span>
            </h2>
          </div>

          {/* Counter */}
          <div class={`sh-fade-in ${visible() ? "visible" : ""} sh-delay-2 my-6`}>
            <span class="sh-counter text-5xl font-black">{counter()}</span>
            <span class="text-green-700/60 text-sm ml-2 tracking-widest">SERVER ATTIVI NEL DB</span>
          </div>

          <div class="sh-divider-line my-6 max-w-md mx-auto" />

          {/* Description */}
          <p class={`sh-fade-in ${visible() ? "visible" : ""} sh-delay-2 text-sm sm:text-base text-green-900/80 max-w-2xl mx-auto mb-10 leading-relaxed font-mono`}>
            <span class="text-green-700/50">&gt;&gt; </span>
            Scorri, copia l'IP in un click, vota i tuoi preferiti e filtra per tag o popolarità.
            Ogni server è verificato dalla community
            <span class="text-green-500"> [TRUSTED]</span> — pronto per essere conquistato.
          </p>

          {/* Badges */}
          <div class={`sh-fade-in ${visible() ? "visible" : ""} sh-delay-3 flex flex-wrap justify-center gap-3 sm:gap-4 mb-10`}>
            <For each={badges}>
              {(badge) => (
                <div
                  class="sh-badge relative px-4 py-2 text-xs font-mono text-green-500/80 flex items-center gap-2"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(0,255,65,0.2)",
                  }}
                >
                  <div class="sh-corner" />
                  <span class="text-green-600">{badge.icon}</span>
                  <span class="tracking-widest uppercase">{badge.label}</span>
                  <span class="text-green-800/60 text-[10px]">// {badge.desc}</span>
                </div>
              )}
            </For>
          </div>

          {/* CTA Button */}
          <div class={`sh-fade-in ${visible() ? "visible" : ""} sh-delay-4`}>
            <button
              onClick={() => navigate("/servers")}
              class="sh-btn relative inline-flex items-center gap-3 px-10 py-4 text-base font-bold text-green-400 uppercase tracking-widest"
              style={{
                background: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(0,255,65,0.35)",
                "box-shadow": "0 0 20px rgba(0,255,65,0.08)",
              }}
            >
              <div class="sh-corner" />
              <span class="text-green-500 text-xl">▶</span>
              ESEGUI: SFOGLIA_SERVER.exe
            </button>
          </div>

          {/* Footer note */}
          <p class={`sh-fade-in ${visible() ? "visible" : ""} sh-delay-4 mt-8 text-xs text-green-900/50 tracking-widest font-mono`}>
            [ SORT:VOTES • FILTER:TAGS • ADD_SERVER: ~30s ]
          </p>

        </div>
      </section>
    </>
  );
};

export default SecondaryHero;