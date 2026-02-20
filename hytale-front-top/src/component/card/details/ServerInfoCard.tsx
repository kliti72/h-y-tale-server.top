import { For, Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";
import StringArrayUtils from "../../../utils/StringArrayUtils";

export default function ServerInfoCard(props: { server: ServerResponse }) {
  return (
    <div class="relative rounded-sm overflow-hidden" style={{
      background: "linear-gradient(160deg, #1a1208 0%, #0f0b05 50%, #1a1208 100%)",
      border: "1px solid #4a3520",
      "box-shadow": `
        0 0 0 1px #2a1f0e,
        0 0 0 3px #1a1208,
        0 0 0 4px #3d2c1a,
        0 20px 60px rgba(0,0,0,0.95),
        0 0 80px rgba(180,130,40,0.04),
        inset 0 1px 0 rgba(200,160,80,0.08),
        inset 0 -1px 0 rgba(0,0,0,0.5)
      `,
    }}>

      {/* Parchment texture overlay */}
      <div class="absolute inset-0 pointer-events-none" style={{
        "background-image": `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
        `,
        opacity: "0.6"
      }} />

      {/* Top ornamental border */}
      <div class="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, #7a5c2e 20%, #c8a050 50%, #7a5c2e 80%, transparent)",
        opacity: "0.7"
      }} />
      <div class="absolute top-0 left-0 right-0" style={{ height: "2px" }}>
        <div style={{
          position: "absolute",
          top: "3px",
          left: "0",
          right: "0",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #3d2c1a 30%, #5a4020 50%, #3d2c1a 70%, transparent)",
          opacity: "0.5"
        }} />
      </div>

      {/* Corner rune decorations */}
      <div class="absolute top-2 left-2" style={{
        color: "#4a3520",
        "font-size": "0.9rem",
        opacity: "0.6",
        "font-family": "serif",
        "text-shadow": "0 0 8px rgba(180,130,40,0.3)",
        "line-height": "1"
      }}>⚜</div>
      <div class="absolute top-2 right-2" style={{
        color: "#4a3520",
        "font-size": "0.9rem",
        opacity: "0.6",
        "font-family": "serif",
        "text-shadow": "0 0 8px rgba(180,130,40,0.3)",
        "line-height": "1"
      }}>⚜</div>

      <div class="relative p-6 pt-7">

        {/* Header */}
        <div class="flex items-center gap-3 mb-6">
          {/* Crest / seal */}
          <div style={{
            width: "28px",
            height: "28px",
            background: "radial-gradient(circle at 40% 35%, #c8a050, #7a5020 60%, #3d2008)",
            border: "1px solid #7a5c2e",
            "border-radius": "50%",
            "box-shadow": "0 0 10px rgba(180,120,20,0.4), inset 0 1px 0 rgba(255,220,100,0.2)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "flex-shrink": "0"
          }}>
            <span style={{
              color: "#1a0f04",
              "font-size": "0.75rem",
              "line-height": "1",
              "font-family": "serif"
            }}>✦</span>
          </div>

          <div>
            <h3 style={{
              "font-family": "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
              color: "#c8a050",
              "font-size": "0.7rem",
              "letter-spacing": "0.25em",
              "text-shadow": "0 0 12px rgba(200,160,80,0.4), 0 1px 0 rgba(0,0,0,0.8)",
              "text-transform": "uppercase",
              "font-weight": "normal",
              margin: "0",
              "line-height": "1.2"
            }}>
              ᚹ Modalità del Reame ᚹ
            </h3>
            <div style={{
              "font-family": "Georgia, serif",
              color: "#5a4020",
              "font-size": "0.55rem",
              "letter-spacing": "0.15em",
              "text-transform": "uppercase",
              "margin-top": "2px"
            }}>
              Incisioni della Pergamena
            </div>
          </div>
        </div>

        {/* Horizontal rune divider */}
        <div class="flex items-center gap-2 mb-5" style={{ opacity: "0.5" }}>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, transparent, #7a5c2e)" }} />
          <span style={{ color: "#7a5c2e", "font-size": "0.6rem", "font-family": "serif" }}>◆</span>
          <span style={{ color: "#5a4020", "font-size": "0.5rem", "font-family": "serif" }}>ᚱᚢᚾ</span>
          <span style={{ color: "#7a5c2e", "font-size": "0.6rem", "font-family": "serif" }}>◆</span>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, #7a5c2e, transparent)" }} />
        </div>

        {/* Tags label */}
        <div style={{
          "font-family": "Georgia, serif",
          color: "#5a4020",
          "font-size": "0.6rem",
          "letter-spacing": "0.18em",
          "text-transform": "uppercase",
          "margin-bottom": "0.75rem",
          display: "flex",
          "align-items": "center",
          gap: "6px"
        }}>
          <span style={{ color: "#7a5c2e" }}>†</span>
          Doni del Crogiuolo
          <span style={{ color: "#7a5c2e" }}>†</span>
        </div>

        {/* Tags */}
        <Show
          when={props.server.tags && StringArrayUtils.toArray(props.server.tags.toString()).length > 0}
          fallback={
            <div style={{
              "font-family": "Georgia, 'Palatino Linotype', serif",
              color: "#3d2c1a",
              "font-size": "0.75rem",
              "letter-spacing": "0.08em",
              "font-style": "italic",
              padding: "0.5rem 0"
            }}>
              <span style={{ color: "#5a4020" }}>⚔</span> Nessun sigillo trovato — le rune tacciono
            </div>
          }
        >
          <div class="flex flex-wrap gap-2">
            <For each={StringArrayUtils.toArray(props.server.tags.toString())}>
              {(tag, i) => (
                <span
                  class="flex items-center gap-2 px-3 py-1.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(60,35,10,0.7) 0%, rgba(40,22,5,0.9) 100%)",
                    border: "1px solid #4a3520",
                    "border-top": "1px solid #6a4c28",
                    "border-bottom": "1px solid #2a1a08",
                    "font-family": "'Palatino Linotype', Palatino, Georgia, serif",
                    "font-size": "0.72rem",
                    color: "#c8a050",
                    "letter-spacing": "0.06em",
                    "text-shadow": "0 0 8px rgba(200,160,80,0.25), 0 1px 0 rgba(0,0,0,0.8)",
                    "box-shadow": "0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(200,160,80,0.06)",
                    "clip-path": "polygon(6px 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0% 50%)",
                    "padding-left": "14px",
                    "padding-right": "14px",
                  }}
                >
                  <span style={{
                    color: "#7a5c2e",
                    "font-size": "0.55rem",
                    "font-family": "serif"
                  }}>
                    {/* Roman numeral style index */}
                    {['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ'][i()] ?? `${i()+1}`}
                  </span>
                  {tag}
                </span>
              )}
            </For>
          </div>
        </Show>

        {/* Bottom rune divider */}
        <div class="flex items-center gap-2 mt-5 mb-4" style={{ opacity: "0.4" }}>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, transparent, #4a3520)" }} />
          <span style={{ color: "#4a3520", "font-size": "0.55rem", "font-family": "serif" }}>ᛟ</span>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, #4a3520, transparent)" }} />
        </div>

        {/* Footer */}
        <div class="flex items-center justify-between" style={{
          "border-top": "1px solid #2a1f0e",
          "padding-top": "0.75rem"
        }}>
          <span style={{
            "font-family": "Georgia, serif",
            color: "#3d2c1a",
            "font-size": "0.58rem",
            "letter-spacing": "0.12em",
            "text-transform": "uppercase",
            "font-style": "italic"
          }}>
            ᚠ Sigillo del Custode ᚠ
          </span>
          <div style={{ display: "flex", gap: "4px", "align-items": "center" }}>
            <span style={{
              color: "#c8a050",
              "font-size": "0.6rem",
              opacity: "0.5",
              animation: "flicker 3s ease-in-out infinite",
              "text-shadow": "0 0 6px rgba(200,160,80,0.6)"
            }}>🜃</span>
          </div>
        </div>
      </div>

      {/* Bottom ornamental border */}
      <div class="absolute bottom-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, #7a5c2e 20%, #c8a050 50%, #7a5c2e 80%, transparent)",
        opacity: "0.5"
      }} />

      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.5; text-shadow: 0 0 6px rgba(200,160,80,0.6); }
          25% { opacity: 0.8; text-shadow: 0 0 12px rgba(200,160,80,0.9); }
          50% { opacity: 0.3; text-shadow: 0 0 4px rgba(200,160,80,0.3); }
          75% { opacity: 0.7; text-shadow: 0 0 10px rgba(200,160,80,0.7); }
        }
      `}</style>
    </div>
  );
}