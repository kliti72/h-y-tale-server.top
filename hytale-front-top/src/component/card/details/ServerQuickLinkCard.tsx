import { Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";

export default function ServerQuiLinkCard(props: { server: ServerResponse }) {
  return (
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
          style={{ "border-bottom": "1px solid rgba(0,255,65,0.1)" }}
        >
          <span class="text-green-500/60">⬡</span>
          <h3 class="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(0,255,65,0.55)" }}>
            QUICK_LINKS
          </h3>
          <div class="h-px flex-1 bg-green-900/25" />
          <span class="text-green-800/30 text-xs">// PORTALS</span>
        </div>

        {/* Links */}
        <div class="flex flex-col gap-2">

          {/* Website */}
          <Show
            when={props.server.website_url}
            fallback={
              <div
                class="flex items-center gap-3 px-4 py-3 text-xs"
                style={{
                  border: "1px solid rgba(0,255,65,0.07)",
                  background: "rgba(0,0,0,0.3)",
                  color: "rgba(0,255,65,0.2)",
                }}
              >
                <span class="text-green-900/40">◎</span>
                <span class="tracking-widest uppercase">WEBSITE_URL: NULL</span>
              </div>
            }
          >
            <a
              href={props.server.website_url}
              target="_blank"
              rel="noopener noreferrer"
              class="relative flex items-center gap-3 px-4 py-3 text-xs tracking-wide transition-all group"
              style={{
                border: "1px solid rgba(0,255,65,0.18)",
                background: "rgba(0,255,65,0.03)",
                color: "rgba(0,255,65,0.55)",
                "text-decoration": "none",
                "font-family": "'Share Tech Mono', monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,255,65,0.4)";
                e.currentTarget.style.color = "#00ff41";
                e.currentTarget.style.background = "rgba(0,255,65,0.06)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0,255,65,0.08)";
                e.currentTarget.style.paddingLeft = "20px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,255,65,0.18)";
                e.currentTarget.style.color = "rgba(0,255,65,0.55)";
                e.currentTarget.style.background = "rgba(0,255,65,0.03)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.paddingLeft = "16px";
              }}
            >
              <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/30 pointer-events-none" />
              <span style={{ color: "rgba(0,255,65,0.4)" }}>🌐</span>
              <div class="flex-1 min-w-0">
                <div class="uppercase tracking-widest text-xs">WEBSITE_URL</div>
                <div class="text-green-800/45 text-xs mt-0.5 truncate">{props.server.website_url}</div>
              </div>
              <span style={{ color: "rgba(0,255,65,0.3)", "font-size": "10px" }}>→</span>
            </a>
          </Show>

          {/* Discord */}
          <Show
            when={props.server.discord_url}
            fallback={
              <div
                class="flex items-center gap-3 px-4 py-3 text-xs"
                style={{
                  border: "1px solid rgba(0,255,65,0.07)",
                  background: "rgba(0,0,0,0.3)",
                  color: "rgba(0,255,65,0.2)",
                }}
              >
                <span class="text-green-900/40">◎</span>
                <span class="tracking-widest uppercase">DISCORD_URL: NULL</span>
              </div>
            }
          >
            <a
              href={props.server.discord_url}
              target="_blank"
              rel="noopener noreferrer"
              class="relative flex items-center gap-3 px-4 py-3 text-xs tracking-wide transition-all"
              style={{
                border: "1px solid rgba(99,102,241,0.2)",
                background: "rgba(99,102,241,0.03)",
                color: "rgba(99,102,241,0.6)",
                "text-decoration": "none",
                "font-family": "'Share Tech Mono', monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)";
                e.currentTarget.style.color = "rgba(165,180,252,0.9)";
                e.currentTarget.style.background = "rgba(99,102,241,0.07)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(99,102,241,0.1)";
                e.currentTarget.style.paddingLeft = "20px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                e.currentTarget.style.color = "rgba(99,102,241,0.6)";
                e.currentTarget.style.background = "rgba(99,102,241,0.03)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.paddingLeft = "16px";
              }}
            >
              <div class="absolute top-0 left-0 w-2 h-2 border-t border-l pointer-events-none" style={{ "border-color": "rgba(99,102,241,0.3)" }} />
              <span>💬</span>
              <div class="flex-1 min-w-0">
                <div class="uppercase tracking-widest text-xs">DISCORD_URL</div>
                <div class="text-xs mt-0.5 truncate" style={{ color: "rgba(99,102,241,0.35)" }}>{props.server.discord_url}</div>
              </div>
              <span style={{ color: "rgba(99,102,241,0.35)", "font-size": "10px" }}>→</span>
            </a>
          </Show>

        </div>

        {/* Footer */}
        <div
          class="flex items-center justify-between mt-4 pt-3"
          style={{ "border-top": "1px solid rgba(0,255,65,0.07)" }}
        >
          <span class="text-green-900/35 text-xs tracking-[0.2em] uppercase">// EXTERNAL_LINKS</span>
          <span
            class="text-xs"
            style={{ color: "rgba(0,255,65,0.3)", animation: "hk-flicker2 4s ease-in-out infinite" }}
          >
            ◉
          </span>
        </div>
      </div>

      <style>{`
        @keyframes hk-flicker2 {
          0%,100% { opacity: 0.3; }
          25%      { opacity: 0.7; text-shadow: 0 0 8px rgba(0,255,65,0.5); }
          50%      { opacity: 0.15; }
          75%      { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}