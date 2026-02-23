import { Component, createSignal, onMount, onCleanup } from "solid-js";
import { A } from "@solidjs/router";

const Footer: Component = () => {
  const [copied, setCopied] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal("");

  const siteUrl = "https://h-y-tale.top";
  const discordInvite = "https://discord.gg/tuoinvitelink";

  onMount(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    onCleanup(() => clearInterval(interval));
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Errore copia", err);
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent("Scopri H-Y-Tale – la community italiana di Hytale! Server, voti, guide e tanto altro →");
    const url = encodeURIComponent(siteUrl);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        .footer-root {
          font-family: 'Share Tech Mono', monospace;
        }

        .ft-link {
          position: relative;
          color: rgba(0,255,65,0.45);
          text-decoration: none;
          transition: all 0.2s;
          font-size: 13px;
          letter-spacing: 0.05em;
        }
        .ft-link::before {
          content: '> ';
          opacity: 0;
          transition: opacity 0.2s;
          color: rgba(0,255,65,0.7);
        }
        .ft-link:hover {
          color: #00ff41;
          padding-left: 4px;
        }
        .ft-link:hover::before { opacity: 1; }

        .ft-btn {
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .ft-btn:hover {
          color: #00ff41 !important;
          border-color: rgba(0,255,65,0.5) !important;
          box-shadow: 0 0 20px rgba(0,255,65,0.15);
        }

        .ft-corner {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .ft-corner::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 14px; height: 14px;
          border-top: 1px solid rgba(0,255,65,0.4);
          border-left: 1px solid rgba(0,255,65,0.4);
        }
        .ft-corner::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 14px; height: 14px;
          border-bottom: 1px solid rgba(0,255,65,0.4);
          border-right: 1px solid rgba(0,255,65,0.4);
        }

        .ft-scanline {
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 4px
          );
        }

        .ft-social {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(0,255,65,0.2);
          background: rgba(0,0,0,0.6);
          transition: all 0.3s;
          position: relative;
        }
        .ft-social:hover {
          border-color: rgba(0,255,65,0.6);
          box-shadow: 0 0 18px rgba(0,255,65,0.2);
          color: #00ff41;
        }

        .ft-section-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,255,65,0.4);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(0,255,65,0.1);
        }

        .ft-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,65,0.2) 30%, rgba(0,255,65,0.2) 70%, transparent);
        }

        .blink { animation: blink 1s steps(1) infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .ft-ascii {
          font-size: 9px;
          line-height: 1.3;
          color: rgba(0,255,65,0.12);
          letter-spacing: 0.05em;
          user-select: none;
        }

        .ft-scroll-btn {
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        .ft-scroll-btn:hover {
          color: #00ff41;
          letter-spacing: 0.15em;
        }
        .ft-scroll-btn:hover .ft-arrow {
          transform: translateY(-3px);
        }
        .ft-arrow {
          display: inline-block;
          transition: transform 0.3s;
        }
      `}</style>

      <footer
        class="footer-root ft-scanline relative mt-auto w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #000300 0%, #000502 60%, #000200 100%)",
          "border-top": "1px solid rgba(0,255,65,0.12)",
        }}
      >
        {/* Grid bg */}
        <div
          class="absolute inset-0 pointer-events-none"
          style={{
            "background-image": `
              linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px)
            `,
            "background-size": "40px 40px",
          }}
        />

        {/* Glow top */}
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-32 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,255,65,0.05) 0%, transparent 70%)" }}
        />

        {/* Top status bar */}
        <div
          class="relative z-10 border-b px-6 sm:px-10 py-2 flex items-center justify-between"
          style={{ "border-color": "rgba(0,255,65,0.1)" }}
        >
          <div class="flex items-center gap-2 text-xs" style={{ color: "rgba(0,255,65,0.35)" }}>
            <span class="blink" style={{ color: "rgba(0,255,65,0.6)" }}>◉</span>
            SYSTEM_STATUS: ONLINE
          </div>
          <div class="text-xs font-mono" style={{ color: "rgba(0,255,65,0.25)" }}>
            SYS_TIME: {currentTime()}
          </div>
          <div class="text-xs" style={{ color: "rgba(0,255,65,0.25)" }}>
            NODE: H-Y-TALE_PROD
          </div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">

          {/* Grid 4 colonne */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

            {/* Col 1: Brand */}
            <div>
              <div class="ft-section-label">// SYSTEM_ID</div>
              <h3
                class="text-2xl font-black mb-3"
                style={{
                  "font-family": "'Orbitron', monospace",
                  background: "linear-gradient(135deg, #00ff41, #00cc33)",
                  "-webkit-background-clip": "text",
                  "-webkit-text-fill-color": "transparent",
                  "background-clip": "text",
                }}
              >
                H-Y-TALE
                <span class="blink" style={{ "-webkit-text-fill-color": "rgba(0,255,65,0.6)", "font-size": "18px" }}>_</span>
              </h3>
              <p class="text-xs leading-relaxed mb-5" style={{ color: "rgba(0,255,65,0.4)", "line-height": "1.8" }}>
                <span style={{ color: "rgba(0,255,65,0.25)" }}>&gt;&gt; </span>
                Community italiana dedicata a Hytale. Scopri server, vota i preferiti, unisciti agli eventi.
              </p>

              {/* Socials */}
              <div class="flex items-center gap-2">
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ft-social"
                  aria-label="Discord"
                  style={{ color: "rgba(0,255,65,0.5)" }}
                >
                  <div class="ft-corner" />
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8851 1.515.0699.0699 0 00-.032.0277C.5336 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0775.0105c.1202.099.246.1981.372.2914a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6061 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
                <button
                  onClick={handleShareX}
                  class="ft-social"
                  aria-label="X"
                  style={{ color: "rgba(0,255,65,0.5)", "font-size": "14px", "font-weight": "bold" }}
                >
                  <div class="ft-corner" />
                  𝕏
                </button>
              </div>
            </div>

            {/* Col 2: Esplora */}
            <div>
              <div class="ft-section-label">// ESPLORA</div>
              <ul class="space-y-3">
                {[
                  { href: "/servers", label: "SERVER_LIST" },
                  { href: "/leaderboard", label: "TOP_VOTATI" },
                  { href: "/forum", label: "FORUM" },
                  { href: "/guide", label: "GUIDE_HYTALE" },
                ].map((item) => (
                  <li>
                    <A href={item.href} class="ft-link">{item.label}</A>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Community */}
            <div>
              <div class="ft-section-label">// COMMUNITY</div>
              <ul class="space-y-3">
                {[
                  { href: discordInvite, label: "DISCORD_SERVER", external: true },
                  { href: "/contatti", label: "CONTATTACI", external: false },
                  { href: "/privacy", label: "TERMINI_SERVIZIO", external: false },
                ].map((item) => (
                  <li>
                    {item.external
                      ? <a href={item.href} target="_blank" rel="noopener" class="ft-link">{item.label}</a>
                      : <A href={item.href} class="ft-link">{item.label}</A>
                    }
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: ASCII art + stats */}
            <div>
              <div class="ft-section-label">// SYS_INFO</div>
              <pre class="ft-ascii mb-4">{`
 ██╗  ██╗██╗   ██╗
 ██║  ██║╚██╗ ██╔╝
 ███████║ ╚████╔╝ 
 ██╔══██║  ╚██╔╝  
 ██║  ██║   ██║   
 ╚═╝  ╚═╝   ╚═╝  
              `}</pre>
              <div class="space-y-1 text-xs" style={{ color: "rgba(0,255,65,0.3)" }}>
                <div>&gt; BUILT_WITH: SolidJS + Tailwind</div>
                <div>&gt; VERSION: 2.4.1</div>
                <div>&gt; ENV: PRODUCTION</div>
                <div class="mt-2" style={{ color: "rgba(0,255,65,0.15)" }}>
                  NOT_AFFILIATED: Hytale™ / Hypixel Studios™
                </div>
              </div>
            </div>

          </div>

          <div class="ft-divider mb-6" />

          {/* Bottom bar */}
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">

            {/* Left: actions */}
            <div class="flex items-center gap-3 order-2 sm:order-1">
              <button
                onClick={handleCopyLink}
                class="ft-btn relative px-4 py-2 flex items-center gap-2"
                style={{
                  border: "1px solid rgba(0,255,65,0.2)",
                  background: "rgba(0,0,0,0.5)",
                  color: copied() ? "#00ff41" : "rgba(0,255,65,0.45)",
                  "border-color": copied() ? "rgba(0,255,65,0.5)" : "rgba(0,255,65,0.2)",
                  "box-shadow": copied() ? "0 0 15px rgba(0,255,65,0.2)" : "none",
                }}
              >
                <div class="ft-corner" />
                {copied() ? "✓ COPIATO" : "⬡ COPIA_LINK"}
              </button>

              <button
                onClick={handleShareX}
                class="ft-btn px-4 py-2 flex items-center gap-2"
                style={{
                  border: "1px solid rgba(0,255,65,0.2)",
                  background: "rgba(0,0,0,0.5)",
                  color: "rgba(0,255,65,0.45)",
                }}
              >
                𝕏 CONDIVIDI
              </button>
            </div>

            {/* Center: copyright */}
            <div class="text-center order-1 sm:order-2" style={{ color: "rgba(0,255,65,0.2)" }}>
              <span>// © {new Date().getFullYear()} H-Y-TALE.top — ALL_RIGHTS_RESERVED</span>
            </div>

            {/* Right: scroll top */}
            <button
              onClick={scrollToTop}
              class="ft-scroll-btn order-3 flex items-center gap-2 text-xs uppercase tracking-widest"
              style={{ color: "rgba(0,255,65,0.4)" }}
            >
              TORNA_SU <span class="ft-arrow">↑</span>
            </button>

          </div>
        </div>

        {/* Bottom terminal line */}
        <div
          class="relative z-10 border-t px-6 py-2 flex items-center justify-center"
          style={{ "border-color": "rgba(0,255,65,0.06)" }}
        >
          <span class="text-xs font-mono" style={{ color: "rgba(0,255,65,0.1)", "letter-spacing": "0.2em" }}>
            [ END_OF_FILE // H-Y-TALE_OS // SESSION_ACTIVE ]
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;