import { createResource, Show } from "solid-js";
import { ServerResponse, ServerStatus } from "../../../types/ServerResponse";
import { StatusService } from "../../../services/status.service";

export function ServerCardStatus(props: { server: ServerResponse }) {
  const [status] = createResource<ServerStatus | null>(
    () => StatusService.getStatusById(props.server.id ?? 1),
    { initialValue: null }
  );

  return (
    <div class="flex-1" style={{ "font-family": "'Share Tech Mono', monospace" }}>

      {/* ── TOP ROW: logo + nome + badge ── */}
      <div class="flex items-start gap-6 mb-6">

        {/* LOGO — grande e tondo, protagonista */}
        <div class="relative flex-shrink-0">
          {/* Glow ring esterno */}
          <div
            class="absolute inset-0 rounded-full pointer-events-none"
            style={{
              "box-shadow": "0 0 0 1px rgba(0,255,65,0.2), 0 0 25px rgba(0,255,65,0.15), 0 0 60px rgba(0,255,65,0.06)",
              "border-radius": "50%",
            }}
          />
          {/* Rotating dashed ring */}
          <div
            class="absolute pointer-events-none"
            style={{
              inset: "-6px",
              "border-radius": "50%",
              border: "1px dashed rgba(0,255,65,0.2)",
              animation: "spin 12s linear infinite",
            }}
          />

          <Show
            when={props.server.logo_url}
            fallback={
              <div
                class="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-4xl font-black bg-black/80"
                style={{
                  border: "2px solid rgba(0,255,65,0.3)",
                  color: "#00ff41",
                  "font-family": "'Orbitron', monospace",
                  "text-shadow": "0 0 20px rgba(0,255,65,0.5)",
                  "box-shadow": "inset 0 0 30px rgba(0,255,65,0.06)",
                }}
              >
                {props.server.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            }
          >
            <img
              src={props.server.logo_url}
              alt={`${props.server.name} logo`}
              class="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
              style={{
                border: "2px solid rgba(0,255,65,0.3)",
                "box-shadow": "0 0 30px rgba(0,255,65,0.12)",
                filter: "saturate(0.85)",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)?.style.setProperty("display", "flex");
              }}
            />
            <div
              class="w-24 h-24 md:w-28 md:h-28 rounded-full items-center justify-center text-4xl font-black bg-black/80"
              style={{
                display: "none",
                border: "2px solid rgba(0,255,65,0.3)",
                color: "#00ff41",
                "font-family": "'Orbitron', monospace",
              }}
            >
              {props.server.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </Show>

          {/* Status dot sopra il logo */}
          <div class="absolute bottom-1 right-1">
            <Show when={!status.loading} fallback={
              <span class="w-4 h-4 rounded-full bg-yellow-500/60 block animate-pulse border-2 border-black" style={{ "box-shadow": "0 0 6px rgba(234,179,8,0.5)" }} />
            }>
              <Show when={status()} fallback={
                <span class="w-4 h-4 rounded-full bg-red-500 block border-2 border-black" style={{ "box-shadow": "0 0 6px rgba(239,68,68,0.6)" }} />
              }>
                <span class="w-4 h-4 rounded-full bg-green-400 block animate-pulse border-2 border-black" style={{ "box-shadow": "0 0 8px #00ff41" }} />
              </Show>
            </Show>
          </div>
        </div>

        {/* Nome + tag + status label */}
        <div class="flex-1 min-w-0 pt-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-green-700/40 text-xs tracking-[0.25em]">◎ SERVER_DETAIL</span>
            <div class="h-px flex-1 bg-green-900/30" />
          </div>

          <h1
            class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none mb-3 truncate"
            style={{
              "font-family": "'Orbitron', monospace",
              "text-shadow": "0 0 40px rgba(0,255,65,0.15)",
            }}
          >
            {props.server.name}
          </h1>

          <Show when={!status.loading} fallback={
            <span class="inline-flex items-center gap-2 text-xs tracking-widest text-yellow-500/60 uppercase">
              <span class="w-1.5 h-1.5 bg-yellow-500/60 rounded-full animate-pulse" />
              SYNCING...
            </span>
          }>
            <Show when={status()} fallback={
              <span class="inline-flex items-center gap-2 text-xs tracking-widest text-red-500/60 uppercase">
                <span class="w-1.5 h-1.5 bg-red-500 rounded-full" />
                OFFLINE // SERVER_UNREACHABLE
              </span>
            }>
              <span class="inline-flex items-center gap-2 text-xs tracking-widest uppercase" style={{ color: "rgba(0,255,65,0.6)" }}>
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ "box-shadow": "0 0 4px #00ff41" }} />
                ONLINE // CONNESSIONE_ATTIVA
              </span>
            </Show>
          </Show>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div
        class="mb-5 h-px"
        style={{ background: "linear-gradient(90deg, rgba(0,255,65,0.2), rgba(0,255,65,0.05) 60%, transparent)" }}
      />

      {/* ── STATS / WARNING ── */}
      <Show
        when={!status.loading}
        fallback={
          <div class="relative border border-yellow-800/35 bg-black/40 px-4 py-3 max-w-lg">
            <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-yellow-600/35 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-yellow-600/35 pointer-events-none" />
            <div class="text-yellow-500/70 text-xs uppercase tracking-widest font-bold mb-1">
              ⚠ SERVER_VERIFIER: NOT_INTEGRATED
            </div>
            <div class="text-green-900/55 text-xs">
              Sei il proprietario?{" "}
              <a href="/docs" class="text-green-600/60 hover:text-green-400 transition-colors underline underline-offset-2">
                Scarica H-Y-TaleVerifier.jar
              </a>
            </div>
          </div>
        }
      >
        <Show when={status()}>
          {(statusData) => (
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "◈", label: "PLAYERS", value: `${statusData().players_online}/${statusData().players_max}`, sub: "online" },
                { icon: "▲", label: "VOTES", value: String(props.server.voti_totali ?? 0), sub: "totali" },
              ].map((stat) => (
                <div
                  class="relative flex flex-col px-3 py-2.5 border border-green-900/30 bg-black/40"
                  style={{ "box-shadow": "0 0 12px rgba(0,255,65,0.03)" }}
                >
                  <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-600/25 pointer-events-none" />
                  <div class="flex items-center gap-1.5 mb-1">
                    <span class="text-green-700/50 text-xs">{stat.icon}</span>
                    <span class="text-green-800/50 text-xs tracking-widest uppercase">{stat.label}</span>
                  </div>
                  <span class="text-white font-black text-lg leading-none" style={{ "font-family": "'Orbitron', monospace" }}>
                    {stat.value}
                  </span>
                  <span class="text-green-900/50 text-xs mt-0.5">{stat.sub}</span>
                </div>
              ))}
            </div>
          )}
        </Show>
      </Show>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}