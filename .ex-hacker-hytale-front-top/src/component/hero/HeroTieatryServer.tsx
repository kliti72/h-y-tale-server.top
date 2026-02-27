import { Component, createSignal, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";

const HeroTieatryServer: Component = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = createSignal(false);
  const [glitchActive, setGlitchActive] = createSignal(false);

  onMount(() => {
    const el = document.getElementById("hero-try-root");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    onCleanup(() => observer.disconnect());

    // Glitch random ogni tanto
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, 4000);
    onCleanup(() => clearInterval(glitchInterval));
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        #hero-try-root {
          font-family: 'Share Tech Mono', monospace;
        }

        .hts-fade { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .hts-fade.on { opacity: 1; transform: translateY(0); }
        .hts-d1 { transition-delay: 0.1s; }
        .hts-d2 { transition-delay: 0.25s; }
        .hts-d3 { transition-delay: 0.4s; }
        .hts-d4 { transition-delay: 0.55s; }

        .hts-glitch {
          position: relative;
          display: inline-block;
        }
        .hts-glitch.active::before {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          color: #ff0055;
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
          transform: translate(-3px, 0);
        }
        .hts-glitch.active::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          color: #00ffff;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          transform: translate(3px, 0);
        }

        .hts-btn {
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          letter-spacing: 0.06em;
        }
        .hts-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(0,255,65,0.1) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .hts-btn:hover::before { transform: translateX(100%); }
        .hts-btn:hover {
          box-shadow: 0 0 35px rgba(0,255,65,0.3);
          letter-spacing: 0.1em;
          border-color: rgba(0,255,65,0.6) !important;
          color: #00ff41 !important;
        }
        .hts-btn:active { transform: scale(0.97); }

        .hts-corner {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hts-corner::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 20px; height: 20px;
          border-top: 1px solid rgba(0,255,65,0.5);
          border-left: 1px solid rgba(0,255,65,0.5);
        }
        .hts-corner::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 20px; height: 20px;
          border-bottom: 1px solid rgba(0,255,65,0.5);
          border-right: 1px solid rgba(0,255,65,0.5);
        }

        .hts-box {
          position: relative;
          border: 1px solid rgba(0,255,65,0.15);
          background: rgba(0,0,0,0.7);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .hts-box:hover {
          border-color: rgba(0,255,65,0.3);
          box-shadow: 0 0 30px rgba(0,255,65,0.06);
        }

        .hts-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(0,255,65,0.5);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border: 1px solid rgba(0,255,65,0.12);
          padding: 3px 10px;
          background: rgba(0,0,0,0.5);
        }

        .hts-scanline {
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,255,65,0.01) 3px, rgba(0,255,65,0.01) 4px
          );
        }

        .blink { animation: blink 1s steps(1) infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hts-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,65,0.25) 30%, rgba(0,255,65,0.25) 70%, transparent);
        }

        .hts-html-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          padding: 2px 8px;
          border-radius: 2px;
        }
      `}</style>

      <section
        id="hero-try-root"
        class="hts-scanline relative w-full py-20 px-6 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #000300 0%, #000802 40%, #000501 100%)",
          "border-top": "1px solid rgba(0,255,65,0.1)",
        }}
      >
        {/* Grid bg */}
        <div
          class="absolute inset-0 pointer-events-none"
          style={{
            "background-image": `
              linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)
            `,
            "background-size": "50px 50px",
          }}
        />

        {/* Glow center */}
        <div
          class="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,65,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Glow left accent */}
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%)",
          }}
        />

        <div class="relative z-10 max-w-5xl mx-auto text-center">

          {/* System label */}
          <div class={`hts-fade hts-d1 ${visible() ? "on" : ""} inline-flex items-center gap-2 mb-8`}>
            <div class="h-px w-10 bg-green-800/50" />
            <span class="hts-tag">
              <span class="blink text-green-500">◉</span>
              MODULE: ADD_SERVER_PROTOCOL
            </span>
            <div class="h-px w-10 bg-green-800/50" />
          </div>

          {/* Title */}
          <div class={`hts-fade hts-d1 ${visible() ? "on" : ""} mb-3`}>
            <h2
              class="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none"
              style={{ "font-family": "'Orbitron', monospace" }}
            >
              <span
                class={`hts-glitch ${glitchActive() ? "active" : ""}`}
                data-text="AGGIUNGI"
              >
                AGGIUNGI
              </span>
            </h2>
            <h2
              class="text-2xl sm:text-3xl mt-2 font-bold tracking-widest"
              style={{ "font-family": "'Share Tech Mono', monospace", color: "rgba(0,255,65,0.85)" }}
            >
              &gt; IL TUO SERVER<span class="blink ml-1">_</span>
            </h2>
          </div>

          {/* Subtitle chips */}
          <div class={`hts-fade hts-d2 ${visible() ? "on" : ""} flex justify-center gap-3 flex-wrap my-5`}>
            {["FACILE", "INTUITIVO", "PERSONALIZZABILE"].map((w) => (
              <span class="text-xs font-mono text-green-700/70 border border-green-900/40 px-3 py-1 tracking-widest">
                {w}
              </span>
            ))}
          </div>

          <div class="hts-divider my-6 max-w-sm mx-auto" />

          {/* Description */}
          <p class={`hts-fade hts-d2 ${visible() ? "on" : ""} text-sm sm:text-base text-green-900/75 max-w-2xl mx-auto mb-4 leading-relaxed font-mono`}>
            <span class="text-green-700/50">&gt;&gt; </span>
            Condividi il tuo server con altri giocatori, costruisci una community e
            vivi esperienze indimenticabili insieme.
          </p>
          <p class={`hts-fade hts-d2 ${visible() ? "on" : ""} text-sm text-green-900/60 max-w-xl mx-auto mb-10 font-mono`}>
            Personalizza la tua pagina con la massima libertà —{" "}
            <span class="hts-html-tag" style={{ background: "rgba(255,80,0,0.1)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.3)" }}>
              &lt;HTML5/&gt;
            </span>{" "}
            <span class="hts-html-tag" style={{ background: "rgba(0,120,255,0.1)", color: "#4da6ff", border: "1px solid rgba(77,166,255,0.3)" }}>
              {"{CSS3}"}
            </span>
          </p>

          {/* CTA */}
          <div class={`hts-fade hts-d3 ${visible() ? "on" : ""}`}>
            <button
              onClick={() => navigate("/panel")}
              class="hts-btn hts-box relative inline-flex items-center gap-3 px-10 py-4 text-base font-bold text-green-400 uppercase tracking-widest"
            >
              <div class="hts-corner" />
              <span class="text-green-500 text-xl">+</span>
              DEPLOY_SERVER.exe
            </button>
          </div>

          {/* Footer note */}
          <p class={`hts-fade hts-d4 ${visible() ? "on" : ""} mt-8 text-xs text-green-900/45 tracking-widest font-mono`}>
            [ IP_COPY: INSTANT • VOTES: REALTIME • COMMUNITY: VERIFIED ]
          </p>

        </div>
      </section>
    </>
  );
};

export default HeroTieatryServer;