import { marked } from "marked";
import DOMPurify from "dompurify";
import { Show } from "solid-js";

export default function ServerRulesTable(props: { rules: string }) {
  return (
    <Show when={props.rules} fallback={
      <div class="relative rounded-lg p-5 text-center"
        style={{
          background: "linear-gradient(135deg, #1a0f00 0%, #2d1a00 50%, #1a0f00 100%)",
          border: "3px solid #5c3a00",
          "box-shadow": "0 4px 20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,180,50,0.1), inset 0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <span class="text-3xl mb-2 block">📜</span>
        <p class="text-amber-700 text-sm font-medium" style={{ "font-family": "Georgia, serif" }}>
          Nessuna regola pubblicata
        </p>
      </div>
    }>
      <div
        class="relative rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1c0e00 0%, #2a1500 30%, #1f1000 60%, #160b00 100%)",
          border: "3px solid #6b4200",
          "box-shadow": `
            0 8px 32px rgba(0,0,0,0.9),
            inset 0 1px 0 rgba(255,180,50,0.15),
            inset 0 0 60px rgba(0,0,0,0.6),
            0 0 0 1px rgba(100,60,0,0.3)
          `,
        }}
      >
        {/* Texture grain overlay */}
        <div class="absolute inset-0 pointer-events-none opacity-30"
          style={{
            "background-image": `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            "background-size": "200px 200px",
          }}
        />

        {/* Vignette bordi legno */}
        <div class="absolute inset-0 pointer-events-none"
          style={{
            "box-shadow": "inset 0 0 30px rgba(0,0,0,0.7), inset 0 0 80px rgba(0,0,0,0.3)"
          }}
        />

        {/* Chiodi angoli */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map(pos => (
          <div class={`absolute ${pos} w-3 h-3 rounded-full z-10`}
            style={{
              background: "radial-gradient(circle at 35% 35%, #888, #222)",
              "box-shadow": "0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
            }}
          />
        ))}

        <div class="relative p-6">
          {/* Header */}
          <div class="flex items-center gap-3 mb-5 pb-4"
            style={{ "border-bottom": "1px solid rgba(120,70,0,0.5)" }}
          >
            <span class="text-2xl">📜</span>
            <h3 style={{
              "font-family": "Georgia, 'Times New Roman', serif",
              color: "#d4840a",
              "font-size": "1.1rem",
              "font-weight": "bold",
              "text-shadow": "0 1px 3px rgba(0,0,0,0.8), 0 0 20px rgba(180,100,0,0.3)",
              "letter-spacing": "0.05em",
            }}>
              ⚔ REGOLE DEL SERVER ⚔
            </h3>
          </div>

          {/* Contenuto markdown */}
          <div
            innerHTML={DOMPurify.sanitize(marked(props.rules) as string)}
            style={{
              "font-family": "Georgia, 'Times New Roman', serif",
              color: "#c4924a",
              "line-height": "1.8",
              "font-size": "0.875rem",
            }}
            class="rules-content"
          />
        </div>
      </div>

      <style>{`
        .rules-content h1, .rules-content h2, .rules-content h3 {
          color: #d4840a;
          font-weight: bold;
          margin: 1rem 0 0.5rem;
          text-shadow: 0 0 15px rgba(180,100,0,0.4);
          letter-spacing: 0.05em;
        }
        .rules-content h1 { font-size: 1.1rem; }
        .rules-content h2 { font-size: 1rem; }
        .rules-content h3 { font-size: 0.9rem; }
        .rules-content ul, .rules-content ol {
          padding-left: 1.2rem;
          margin: 0.5rem 0;
        }
        .rules-content li {
          margin: 0.3rem 0;
          color: #b8834a;
        }
        .rules-content li::marker {
          color: #d4840a;
        }
        .rules-content strong {
          color: #e09030;
          font-weight: bold;
        }
        .rules-content em {
          color: #a07840;
          font-style: italic;
        }
        .rules-content hr {
          border: none;
          border-top: 1px solid rgba(120,70,0,0.4);
          margin: 1rem 0;
        }
        .rules-content a {
          color: #d4840a;
          text-decoration: underline;
        }
        .rules-content p {
          margin: 0.5rem 0;
        }
        .rules-content blockquote {
          border-left: 3px solid #6b4200;
          padding-left: 1rem;
          color: #8a6030;
          font-style: italic;
          margin: 0.5rem 0;
        }
      `}</style>
    </Show>
  );
}