import { For, Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";
import StringArrayUtils from "../../../utils/StringArrayUtils";

export default function ServerInfoCard(props: { server: ServerResponse }) {
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
          style={{ "border-bottom": "1px solid rgba(0,255,65,0.1)" }}
        >
          <span class="text-green-500/60">◈</span>
          <h3 class="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(0,255,65,0.55)" }}>
            SERVER_INFO
          </h3>
          <div class="h-px flex-1 bg-green-900/25" />
          <span class="text-green-800/30 text-xs">// TAGS.json</span>
        </div>

        {/* Tags label */}
        <div class="flex items-center gap-2 mb-3">
          <span class="text-green-700/40 text-xs">▶</span>
          <span class="text-green-800/45 text-xs tracking-[0.2em] uppercase">GAME_MODES</span>
          <div class="h-px flex-1 bg-green-900/20" />
        </div>

        {/* Tags */}
        <Show
          when={props.server.tags && StringArrayUtils.toArray(props.server.tags.toString()).length > 0}
          fallback={
            <div class="text-xs tracking-widest py-2" style={{ color: "rgba(0,255,65,0.25)" }}>
              <span class="mr-2">◎</span>NO_TAGS_FOUND // array vuoto
            </div>
          }
        >
          <div class="flex flex-wrap gap-2 mb-5">
            <For each={StringArrayUtils.toArray(props.server.tags.toString())}>
              {(tag) => (
                <span
                  class="text-xs px-3 py-1 tracking-wide transition-all"
                  style={{
                    border: "1px solid rgba(0,255,65,0.2)",
                    color: "rgba(0,255,65,0.5)",
                    background: "rgba(0,255,65,0.03)",
                    "font-family": "'Share Tech Mono', monospace",
                  }}
                >
                  #{tag}
                </span>
              )}
            </For>
          </div>
        </Show>

        {/* Divider */}
        <div
          class="my-4 h-px"
          style={{ background: "linear-gradient(90deg, rgba(0,255,65,0.1), rgba(0,255,65,0.03) 60%, transparent)" }}
        />

        {/* Extra info rows */}
        <div class="space-y-2">
          {[
            { label: "VERSIONE", value: props.server.version ?? "—" },
            { label: "LINGUA", value: props.server.language ?? "ITA" },
            { label: "OWNER", value: props.server.owner_name ?? "—" },
          ].filter(r => r.value && r.value !== "—").map((row) => (
            <div class="flex items-center gap-2 text-xs">
              <span class="text-green-700/35">◎</span>
              <span class="text-green-800/45 tracking-widest uppercase w-20 flex-shrink-0">{row.label}</span>
              <span class="text-green-900/40 mr-1">:</span>
              <span class="text-green-500/55 tracking-wide">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          class="flex items-center justify-between mt-5 pt-3"
          style={{ "border-top": "1px solid rgba(0,255,65,0.07)" }}
        >
          <span class="text-green-900/35 text-xs tracking-[0.2em] uppercase">
            // SYS_INFO_MODULE
          </span>
          <span
            class="text-xs"
            style={{
              color: "rgba(0,255,65,0.3)",
              animation: "hk-flicker 4s ease-in-out infinite",
            }}
          >
            ◉
          </span>
        </div>
      </div>

      <style>{`
        @keyframes hk-flicker {
          0%,100% { opacity: 0.3; }
          25%      { opacity: 0.7; text-shadow: 0 0 8px rgba(0,255,65,0.5); }
          50%      { opacity: 0.2; }
          75%      { opacity: 0.6; text-shadow: 0 0 6px rgba(0,255,65,0.4); }
        }
      `}</style>
    </div>
  );
}