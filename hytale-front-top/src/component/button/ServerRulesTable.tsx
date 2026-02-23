import { marked } from "marked";
import DOMPurify from "dompurify";
import { Show } from "solid-js";

export default function ServerRulesTable(props: { rules: string }) {
  return (
    <Show
      when={props.rules}
      fallback={
        <div
          class="relative p-5 text-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(0,255,65,0.12)",
            "font-family": "'Share Tech Mono', monospace",
          }}
        >
          <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/25 pointer-events-none" />
          <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/25 pointer-events-none" />
          <span class="text-green-800/40 text-2xl block mb-2">◎</span>
          <p class="text-green-800/40 text-xs tracking-widest uppercase">
            NO_RULES_FOUND // nessuna regola pubblicata
          </p>
        </div>
      }
    >
      <div
        class="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #000500 0%, #000a02 50%, #000300 100%)",
          border: "1px solid rgba(0,255,65,0.2)",
          "box-shadow": "0 0 30px rgba(0,255,65,0.04)",
          "font-family": "'Share Tech Mono', monospace",
        }}
      >
        {/* Grid bg */}
        <div
          class="absolute inset-0 pointer-events-none"
          style={{
            "background-image": `
              linear-gradient(rgba(0,255,65,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,65,0.02) 1px, transparent 1px)
            `,
            "background-size": "30px 30px",
          }}
        />
        {/* Glow top */}
        <div
          class="absolute top-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,255,65,0.03), transparent)" }}
        />

        {/* Corner decorations */}
        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500/35 pointer-events-none" />
        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500/35 pointer-events-none" />
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500/35 pointer-events-none" />
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500/35 pointer-events-none" />

        <div class="relative p-5">
          {/* Header */}
          <div
            class="flex items-center gap-3 mb-5 pb-3"
            style={{ "border-bottom": "1px solid rgba(0,255,65,0.12)" }}
          >
            <span class="text-green-500/60 text-base">◈</span>
            <h3 class="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(0,255,65,0.55)" }}>
              SERVER_RULES
            </h3>
            <div class="h-px flex-1 bg-green-900/25" />
            <span class="text-green-800/30 text-xs">// README.md</span>
          </div>

          {/* Markdown content */}
          <div
            innerHTML={DOMPurify.sanitize(marked(props.rules) as string)}
            class="hk-rules-content"
          />
        </div>
      </div>

      <style>{`
        .hk-rules-content {
          font-family: 'Share Tech Mono', monospace;
          color: rgba(0,255,65,0.45);
          line-height: 1.9;
          font-size: 0.8rem;
        }
        .hk-rules-content h1,
        .hk-rules-content h2,
        .hk-rules-content h3 {
          color: rgba(0,255,65,0.7);
          font-weight: bold;
          margin: 1.2rem 0 0.5rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-shadow: 0 0 12px rgba(0,255,65,0.25);
        }
        .hk-rules-content h1 { font-size: 0.9rem; }
        .hk-rules-content h2 { font-size: 0.82rem; }
        .hk-rules-content h3 { font-size: 0.75rem; }
        .hk-rules-content h1::before { content: '> '; color: rgba(0,255,65,0.3); }
        .hk-rules-content h2::before { content: '>> '; color: rgba(0,255,65,0.25); }
        .hk-rules-content h3::before { content: '>>> '; color: rgba(0,255,65,0.2); }

        .hk-rules-content ul,
        .hk-rules-content ol {
          padding-left: 1rem;
          margin: 0.5rem 0;
        }
        .hk-rules-content li {
          margin: 0.4rem 0;
          color: rgba(0,255,65,0.4);
          list-style: none;
          padding-left: 0.5rem;
        }
        .hk-rules-content li::before {
          content: '◎ ';
          color: rgba(0,255,65,0.25);
        }
        .hk-rules-content ol li::before {
          content: '◈ ';
          color: rgba(0,255,65,0.25);
        }
        .hk-rules-content strong {
          color: rgba(0,255,65,0.7);
          font-weight: bold;
          text-shadow: 0 0 8px rgba(0,255,65,0.2);
        }
        .hk-rules-content em {
          color: rgba(0,200,255,0.5);
          font-style: normal;
        }
        .hk-rules-content hr {
          border: none;
          border-top: 1px solid rgba(0,255,65,0.1);
          margin: 1rem 0;
        }
        .hk-rules-content a {
          color: rgba(0,200,255,0.6);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .hk-rules-content a:hover {
          color: rgba(0,200,255,0.9);
        }
        .hk-rules-content p {
          margin: 0.5rem 0;
        }
        .hk-rules-content blockquote {
          border-left: 2px solid rgba(0,255,65,0.2);
          padding-left: 1rem;
          color: rgba(0,255,65,0.3);
          margin: 0.5rem 0;
          background: rgba(0,255,65,0.02);
        }
        .hk-rules-content code {
          background: rgba(0,255,65,0.05);
          border: 1px solid rgba(0,255,65,0.15);
          padding: 0.1rem 0.4rem;
          color: rgba(0,255,65,0.7);
          font-size: 0.75rem;
        }
        .hk-rules-content pre {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(0,255,65,0.12);
          padding: 0.75rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        .hk-rules-content pre code {
          background: none;
          border: none;
          padding: 0;
        }
      `}</style>
    </Show>
  );
}