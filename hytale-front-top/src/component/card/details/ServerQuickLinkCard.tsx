import { For, Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";

const LINKS = [
  { key: "website_url", label: "Sito Web", icon: "🌐", cmd: "web" },
  { key: "discord_url", label: "Discord", icon: "💬", cmd: "discord" },
] as const;

export default function ServerQuiLinkCard(props: { server: ServerResponse }) {
  return (
    <div class="relative rounded-sm overflow-hidden" style={{
      background: "linear-gradient(160deg, #080e1a 0%, #050b14 50%, #080e1a 100%)",
      border: "1px solid #1a2d4a",
      "box-shadow": `
        0 0 0 1px #0d1e30,
        0 0 0 3px #080e1a,
        0 0 0 4px #162440,
        0 20px 60px rgba(0,0,0,0.95),
        0 0 80px rgba(80,140,255,0.06),
        inset 0 1px 0 rgba(100,160,255,0.08),
        inset 0 -1px 0 rgba(0,0,0,0.5)
      `,
    }}>

      {/* Parchment / dust texture overlay */}
      <div class="absolute inset-0 pointer-events-none" style={{
        "background-image": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: "0.5"
      }} />

      {/* Top ornamental border */}
      <div class="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, #2a4a7a 20%, #6aadff 50%, #2a4a7a 80%, transparent)",
        opacity: "0.8"
      }} />
      <div class="absolute top-0 left-0 right-0" style={{ height: "2px" }}>
        <div style={{
          position: "absolute",
          top: "3px",
          left: "0",
          right: "0",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #162440 30%, #1e3458 50%, #162440 70%, transparent)",
          opacity: "0.5"
        }} />
      </div>

      {/* Corner rune decorations */}
      <div class="absolute top-2 left-2" style={{
        color: "#1a3050",
        "font-size": "0.9rem",
        opacity: "0.7",
        "font-family": "serif",
        "text-shadow": "0 0 8px rgba(80,160,255,0.4)",
        "line-height": "1"
      }}>⚜</div>
      <div class="absolute top-2 right-2" style={{
        color: "#1a3050",
        "font-size": "0.9rem",
        opacity: "0.7",
        "font-family": "serif",
        "text-shadow": "0 0 8px rgba(80,160,255,0.4)",
        "line-height": "1"
      }}>⚜</div>

      <div class="relative p-6 pt-7">

        {/* Header */}
        <div class="flex items-center gap-3 mb-6">
          {/* Crest / seal */}
          <div style={{
            width: "28px",
            height: "28px",
            background: "radial-gradient(circle at 40% 35%, #6aadff, #2a5a9a 60%, #0d1e30)",
            border: "1px solid #2a4a7a",
            "border-radius": "50%",
            "box-shadow": "0 0 12px rgba(80,150,255,0.5), inset 0 1px 0 rgba(150,210,255,0.2)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "flex-shrink": "0"
          }}>
            <span style={{
              color: "#050b14",
              "font-size": "0.75rem",
              "line-height": "1",
              "font-family": "serif"
            }}>✦</span>
          </div>

          <div>
            <h3 style={{
              "font-family": "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
              color: "#6aadff",
              "font-size": "0.7rem",
              "letter-spacing": "0.25em",
              "text-shadow": "0 0 14px rgba(100,180,255,0.6), 0 1px 0 rgba(0,0,0,0.8)",
              "text-transform": "uppercase",
              "font-weight": "normal",
              margin: "0",
              "line-height": "1.2"
            }}>
              ᚹ Portali del Reame ᚹ
            </h3>
            <div style={{
              "font-family": "Georgia, serif",
              color: "#1e3458",
              "font-size": "0.55rem",
              "letter-spacing": "0.15em",
              "text-transform": "uppercase",
              "margin-top": "2px"
            }}>
              Varchi verso il Mondo Esterno
            </div>
          </div>
        </div>

        {/* Rune divider */}
        <div class="flex items-center gap-2 mb-5" style={{ opacity: "0.5" }}>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, transparent, #2a4a7a)" }} />
          <span style={{ color: "#2a4a7a", "font-size": "0.6rem", "font-family": "serif" }}>◆</span>
          <span style={{ color: "#1a3050", "font-size": "0.5rem", "font-family": "serif" }}>ᚱᚢᚾ</span>
          <span style={{ color: "#2a4a7a", "font-size": "0.6rem", "font-family": "serif" }}>◆</span>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, #2a4a7a, transparent)" }} />
        </div>

        {/* Label */}
        <div style={{
          "font-family": "Georgia, serif",
          color: "#1e3458",
          "font-size": "0.6rem",
          "letter-spacing": "0.18em",
          "text-transform": "uppercase",
          "margin-bottom": "0.85rem",
          display: "flex",
          "align-items": "center",
          gap: "6px"
        }}>
          <span style={{ color: "#2a4a7a" }}>†</span>
          Pergamene di Accesso
          <span style={{ color: "#2a4a7a" }}>†</span>
        </div>

        {/* Links */}
        <div class="flex flex-col gap-3">

          {/* Website */}
          <Show
            when={props.server.website_url}
            fallback={
              <div style={{
                display: "flex",
                "align-items": "center",
                gap: "10px",
                padding: "10px 14px",
                background: "rgba(10,20,38,0.6)",
                border: "1px solid #0d1e30",
                "border-top": "1px solid #0f2240",
                "font-family": "Georgia, 'Palatino Linotype', serif",
                color: "#1a2d45",
                "font-size": "0.72rem",
                "font-style": "italic",
                "letter-spacing": "0.06em",
              }}>
                <span style={{ color: "#1a2d45", opacity: "0.6" }}>🌐</span>
                <span>Il portale web tace — nessun varco trovato</span>
              </div>
            }
          >
            <a
              href={props.server.website_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                "align-items": "center",
                gap: "10px",
                padding: "10px 14px",
                background: "linear-gradient(135deg, rgba(20,40,70,0.7) 0%, rgba(10,22,40,0.9) 100%)",
                border: "1px solid #1a3050",
                "border-top": "1px solid #2a4a7a",
                "border-bottom": "1px solid #0a1828",
                "text-decoration": "none",
                cursor: "pointer",
                "box-shadow": "0 2px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(100,180,255,0.05)",
                transition: "all 0.2s ease",
                "clip-path": "polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)",
                "padding-left": "18px",
                "padding-right": "18px",
              }}
            >
              <span style={{ "font-size": "0.85rem" }}>🌐</span>
              <div style={{ flex: "1" }}>
                <div style={{
                  "font-family": "'Palatino Linotype', Palatino, Georgia, serif",
                  color: "#6aadff",
                  "font-size": "0.72rem",
                  "letter-spacing": "0.08em",
                  "text-shadow": "0 0 10px rgba(100,180,255,0.4), 0 1px 0 rgba(0,0,0,0.8)",
                }}>
                  Sito Web del Reame
                </div>
                <div style={{
                  "font-family": "Georgia, serif",
                  color: "#2a4a7a",
                  "font-size": "0.58rem",
                  "letter-spacing": "0.06em",
                  "margin-top": "2px",
                  "font-style": "italic"
                }}>
                  {props.server.name}
                </div>
              </div>
              <span style={{
                color: "#3a6a9a",
                "font-size": "0.7rem",
                "font-family": "serif",
                "text-shadow": "0 0 6px rgba(80,150,255,0.5)"
              }}>⚔</span>
            </a>
          </Show>

          {/* Discord */}
          <Show
            when={props.server.discord_url}
            fallback={
              <div style={{
                display: "flex",
                "align-items": "center",
                gap: "10px",
                padding: "10px 14px",
                background: "rgba(10,20,38,0.6)",
                border: "1px solid #0d1e30",
                "border-top": "1px solid #0f2240",
                "font-family": "Georgia, 'Palatino Linotype', serif",
                color: "#1a2d45",
                "font-size": "0.72rem",
                "font-style": "italic",
                "letter-spacing": "0.06em",
              }}>
                <span style={{ color: "#1a2d45", opacity: "0.6" }}>💬</span>
                <span>Il consiglio del discord è silente — nessun varco trovato</span>
              </div>
            }
          >
            <a
              href={props.server.discord_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                "align-items": "center",
                gap: "10px",
                padding: "10px 14px",
                background: "linear-gradient(135deg, rgba(20,40,70,0.7) 0%, rgba(10,22,40,0.9) 100%)",
                border: "1px solid #1a3050",
                "border-top": "1px solid #2a4a7a",
                "border-bottom": "1px solid #0a1828",
                "text-decoration": "none",
                cursor: "pointer",
                "box-shadow": "0 2px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(100,180,255,0.05)",
                transition: "all 0.2s ease",
                "clip-path": "polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)",
                "padding-left": "18px",
                "padding-right": "18px",
              }}
            >
              <span style={{ "font-size": "0.85rem" }}>💬</span>
              <div style={{ flex: "1" }}>
                <div style={{
                  "font-family": "'Palatino Linotype', Palatino, Georgia, serif",
                  color: "#6aadff",
                  "font-size": "0.72rem",
                  "letter-spacing": "0.08em",
                  "text-shadow": "0 0 10px rgba(100,180,255,0.4), 0 1px 0 rgba(0,0,0,0.8)",
                }}>
                  Conclave del Discord
                </div>
                <div style={{
                  "font-family": "Georgia, serif",
                  color: "#2a4a7a",
                  "font-size": "0.58rem",
                  "letter-spacing": "0.06em",
                  "margin-top": "2px",
                  "font-style": "italic"
                }}>
                  {props.server.name}
                </div>
              </div>
              <span style={{
                color: "#3a6a9a",
                "font-size": "0.7rem",
                "font-family": "serif",
                "text-shadow": "0 0 6px rgba(80,150,255,0.5)"
              }}>⚔</span>
            </a>
          </Show>

        </div>

        {/* Bottom rune divider */}
        <div class="flex items-center gap-2 mt-5 mb-4" style={{ opacity: "0.4" }}>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, transparent, #1a3050)" }} />
          <span style={{ color: "#1a3050", "font-size": "0.55rem", "font-family": "serif" }}>ᛟ</span>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, #1a3050, transparent)" }} />
        </div>

        {/* Footer */}
        <div class="flex items-center justify-between" style={{
          "border-top": "1px solid #0d1e30",
          "padding-top": "0.75rem"
        }}>
          <span style={{
            "font-family": "Georgia, serif",
            color: "#162440",
            "font-size": "0.58rem",
            "letter-spacing": "0.12em",
            "text-transform": "uppercase",
            "font-style": "italic"
          }}>
            ᚠ Sigillo del Custode ᚠ
          </span>
          <div>
            <span style={{
              color: "#6aadff",
              "font-size": "0.6rem",
              opacity: "0.5",
              animation: "flicker 3s ease-in-out infinite",
              "text-shadow": "0 0 6px rgba(80,150,255,0.6)"
            }}>🜃</span>
          </div>
        </div>
      </div>

      {/* Bottom ornamental border */}
      <div class="absolute bottom-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, #2a4a7a 20%, #6aadff 50%, #2a4a7a 80%, transparent)",
        opacity: "0.5"
      }} />

      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.5; text-shadow: 0 0 6px rgba(80,150,255,0.6); }
          25% { opacity: 0.9; text-shadow: 0 0 14px rgba(100,180,255,0.9); }
          50% { opacity: 0.3; text-shadow: 0 0 4px rgba(80,150,255,0.3); }
          75% { opacity: 0.75; text-shadow: 0 0 10px rgba(100,180,255,0.7); }
        }
      `}</style>
    </div>
  );
}