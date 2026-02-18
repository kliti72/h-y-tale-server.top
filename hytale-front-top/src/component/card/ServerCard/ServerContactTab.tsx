import { createSignal, Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";
import { marked } from "marked";
import DOMPurify from "dompurify";

const TABS = [
  { id: 'overview', label: 'Panoramica', icon: '⚔️' },
  { id: 'stats',    label: 'Statistiche', icon: '📜' },
  { id: 'reviews',  label: 'Recensioni',  icon: '🏆' },
  { id: 'events',   label: 'Eventi',      icon: '🔮' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function ServerContactTab(props: { server: ServerResponse }) {
  const [activeTab, setActiveTab] = createSignal<TabId>('overview');

  return (
    <main class="lg:col-span-8 space-y-8">
      <div class="relative rounded-xl overflow-hidden" style={{
        background: "linear-gradient(160deg, #0d0d0f 0%, #111116 50%, #0a0a0c 100%)",
        border: "1px solid #2a2a3a",
        "box-shadow": "0 0 0 1px #1a1a2a, 0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}>

        {/* Linea decorativa top */}
        <div class="absolute top-0 left-0 right-0 h-px" style={{
          background: "linear-gradient(90deg, transparent, #6d28d9 30%, #a855f7 50%, #6d28d9 70%, transparent)"
        }} />

        {/* Tab bar */}
        <div class="flex border-b overflow-x-auto" style={{ "border-color": "#1e1e2e" }}>
          {TABS.map((tab, i) => (
            <button
              onClick={() => setActiveTab(tab.id)}
              class="relative flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all group"
              style={{
                "font-family": "'Courier New', monospace",
                "font-size": "0.8rem",
                "letter-spacing": "0.08em",
                color: activeTab() === tab.id ? "#e2e8f0" : "#4a4a6a",
                background: activeTab() === tab.id
                  ? "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)"
                  : "transparent",
                "text-transform": "uppercase",
              }}
            >
              {/* Active indicator top */}
              <Show when={activeTab() === tab.id}>
                <div class="absolute top-0 left-0 right-0 h-0.5" style={{
                  background: "linear-gradient(90deg, #7c3aed, #a855f7)"
                }} />
              </Show>

              <span class="text-base">{tab.icon}</span>
              <span>{tab.label}</span>

              {/* Number badge stile terminale */}
              <span class="text-xs opacity-30" style={{ "font-family": "monospace" }}>
                [{String(i + 1).padStart(2, '0')}]
              </span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <div class="p-6 md:p-8">

          {/* OVERVIEW */}
          <Show when={activeTab() === 'overview'}>
            <div class="space-y-6">
              {/* Header terminale */}
              <div class="flex items-center gap-3 mb-6">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div class="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span style={{
                  "font-family": "monospace",
                  color: "#4a4a6a",
                  "font-size": "0.75rem",
                  "letter-spacing": "0.05em"
                }}>
                  server://descrizione
                </span>
              </div>

              <Show when={props.server.description} fallback={
                <div class="text-center py-12" style={{ "font-family": "monospace" }}>
                  <div class="text-4xl mb-3 opacity-30">{'{ }'}</div>
                  <p style={{ color: "#3a3a5a", "font-size": "0.8rem" }}>
                    // nessuna descrizione disponibile
                  </p>
                </div>
              }>
                <div
                  innerHTML={DOMPurify.sanitize(marked(props.server.description ?? "") as string)}
                  class="tab-description"
                />
              </Show>
            </div>
          </Show>

          {/* COMING SOON template */}
          {(['stats', 'reviews', 'events'] as TabId[]).map(id => (
            <Show when={activeTab() === id}>
              <div class="flex flex-col items-center justify-center py-16 gap-4">
                <div style={{
                  "font-family": "monospace",
                  color: "#2a2a4a",
                  "font-size": "3rem",
                  "line-height": "1"
                }}>
                  {'</>'}
                </div>
                <p style={{
                  "font-family": "monospace",
                  color: "#3a3a6a",
                  "font-size": "0.8rem",
                  "letter-spacing": "0.1em"
                }}>
                  // COMING_SOON — feature in sviluppo
                </p>
                <div class="flex gap-1 mt-2">
                  {[0, 1, 2].map(i => (
                    <div class="w-1.5 h-1.5 rounded-full" style={{
                      background: "#3a3a6a",
                      animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            </Show>
          ))}

        </div>

        {/* Footer decorativo */}
        <div class="px-6 py-2 flex items-center justify-between border-t" style={{
          "border-color": "#1a1a2a",
          background: "#080810"
        }}>
          <span style={{ "font-family": "monospace", color: "#2a2a4a", "font-size": "0.65rem" }}>
            SYS:OK
          </span>
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: "pulse 2s infinite" }} />
            <span style={{ "font-family": "monospace", color: "#2a2a4a", "font-size": "0.65rem" }}>
              LIVE
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .tab-description {
          font-family: 'Georgia', serif;
          color: #8888aa;
          line-height: 1.9;
          font-size: 0.9rem;
        }
        .tab-description h1, .tab-description h2, .tab-description h3 {
          color: #a78bfa;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          letter-spacing: 0.05em;
          margin: 1.2rem 0 0.5rem;
          text-transform: uppercase;
          font-size: 0.85rem;
        }
        .tab-description p { margin: 0.6rem 0; }
        .tab-description strong { color: #c4b5fd; }
        .tab-description em { color: #7c6faa; font-style: italic; }
        .tab-description ul, .tab-description ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .tab-description li { margin: 0.3rem 0; }
        .tab-description li::marker { color: #6d28d9; }
        .tab-description a { color: #7c3aed; text-decoration: underline; }
        .tab-description blockquote {
          border-left: 2px solid #3a2a6a;
          padding-left: 1rem;
          color: #5a5a8a;
          font-style: italic;
          margin: 0.8rem 0;
        }
        .tab-description hr {
          border: none;
          border-top: 1px solid #1e1e3a;
          margin: 1rem 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  );
}