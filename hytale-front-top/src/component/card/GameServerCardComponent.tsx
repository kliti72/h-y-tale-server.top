import { useNavigate } from "@solidjs/router";
import { Component, createEffect, createResource, createSignal, Show } from "solid-js";
import { notify } from "../notify/NotificationComponent";
import { ServerResponse, ServerStatus } from "../../types/ServerResponse";
import { VoteService } from "../../services/votes.service";
import { StatusService } from "../../services/status.service";
import VoteButtonComponent from "../button/VoteButtonComponent";

type Props = { server: ServerResponse; onVoteRequest: (s: ServerResponse) => void; nascondiPulsanti?: boolean; };

const GameServerCardComponent: Component<Props> = (props) => {
  const navigate = useNavigate();
  const [status] = createResource<ServerStatus | null>(
    () => StatusService.getStatusById(props.server.id ?? 1),
    { initialValue: null }
  );

  const isOnline = () => !status.loading && status() != null && !!status()?.is_online;
  const players = () => `${status()?.players_online ?? 0} / ${status()?.players_max ?? 0}`;
  const votes = () => props.server.voti_totali ?? 0;

  const copyIp = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
    notify("IP copiato negli appunti!");
  };

  const [logoValid, setLogoValid] = createSignal(false);

  // controlla se l'immagine esiste
  const url = props.server?.logo_url;
  if (url) {
    const img = new Image();
    img.onload = () => setLogoValid(true);
    img.onerror = () => setLogoValid(false);
    img.src = url;
  }


  function nohandle(s: ServerResponse): void { }

  return (
    <div
      onClick={() => navigate(`/server/${props.server.id}`)}
      class="runic-card group relative cursor-pointer select-none"
      style={{
        background: "linear-gradient(160deg, #0f0d0b 0%, #141210 60%, #0a0908 100%)",
        border: "1px solid #3a2e1e",
        padding: "1px",
        position: "relative",
        transition: "border-color 0.3s",
      }}
    >
      {/* rune glow overlay on hover */}
      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(180,100,20,0.07) 0%, transparent 70%)",
        }}
      />

      {/* top rune line */}
      <div
        class="absolute top-0 inset-x-0 h-px"
        style={{
          background: isOnline()
            ? "linear-gradient(90deg, transparent, rgba(180,120,30,0.6), transparent)"
            : "linear-gradient(90deg, transparent, rgba(80,60,40,0.4), transparent)",
          transition: "background 0.4s",
        }}
      />

      {/* corner runes — ᚱ simboli */}
      <span class="absolute top-1 left-1.5 text-[8px] text-amber-900/50 group-hover:text-amber-700/70 transition-colors font-mono leading-none pointer-events-none">ᚱ</span>
      <span class="absolute top-1 right-1.5 text-[8px] text-amber-900/50 group-hover:text-amber-700/70 transition-colors font-mono leading-none pointer-events-none">ᚦ</span>
      <span class="absolute bottom-1 left-1.5 text-[8px] text-amber-900/30 font-mono leading-none pointer-events-none">ᛟ</span>
      <span class="absolute bottom-1 right-1.5 text-[8px] text-amber-900/30 font-mono leading-none pointer-events-none">ᚾ</span>

      <div class="relative flex items-center gap-3 px-4 py-3">

        {/* ── Logo / Iniziale ── */}
        <div class="relative flex-shrink-0">
          <Show
            when={logoValid()}
            fallback={
              <div
                class="w-14 h-14 flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, #1a1410, #0d0b09)",
                  border: "1px solid #2e2318",
                  "box-shadow": "inset 0 1px 3px rgba(0,0,0,0.8)",
                  "font-size": "1.5rem",
                  "font-weight": "900",
                  color: "#92400e",
                  "letter-spacing": "0.05em",
                }}
              >
                {props.server.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            }
          >
            <img
              src={props.server.logo_url}
              alt={props.server.name}
              class="w-14 h-14 object-cover"
              style={{ border: "1px solid #2e2318" }}
            />
          </Show>

          {/* status gem */}
          <span
            class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5"
            style={{
              background: status.loading
                ? "#78350f"
                : isOnline()
                  ? "#15803d"
                  : "#7f1d1d",
              border: "1px solid #0f0d0b",
              "box-shadow": isOnline() ? "0 0 6px rgba(34,197,94,0.4)" : "none",
              transition: "all 0.4s",
              "clip-path": "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // diamond shape
            }}
          />
        </div>

        {/* ── Info ── */}
        <div class="flex-1 min-w-0 flex flex-col gap-0.5">

          {/* nome */}
          <p
            class="truncate leading-tight group-hover:text-amber-300 transition-colors"
            style={{

              "font-size": "0.8rem",
              "font-weight": "700",
              color: "#d97706",
              "letter-spacing": "0.08em",
              "text-transform": "uppercase",
            }}
          >
            {props.server.name}
          </p>

          {/* ip */}
          <p
            class="truncate"
            style={{
              "font-size": "0.65rem",
              color: "#44403c",
            }}
          >
            {props.server.ip}:{props.server.port}
          </p>

          {/* status riga */}
          <div class="mt-1">
            <Show
              when={!status.loading && status() != null}
              fallback={
                <span style={{ "font-size": "0.65rem", color: "#57534e", "font-style": "italic" }}>
                  Plugin non installato —{" "}
                  <a
                    href="/docs"
                    onClick={e => e.stopPropagation()}
                    style={{ color: "#92400e", "text-decoration": "none" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#b45309")}
                    onMouseOut={e => (e.currentTarget.style.color = "#92400e")}
                  >
                    scaricalo
                  </a>
                </span>
              }
            >
              <Show
                when={isOnline()}
                fallback={
                  <div style={{ display: "flex", "align-items": "baseline", gap: "0.4rem", "flex-wrap": "wrap" }}>
                    <span style={{ "font-size": "0.65rem", color: "#16a34a" }}>
                      ◈ {votes()}
                    </span>
                    <span style={{ "font-size": "0.55rem", "letter-spacing": "0.2em", "text-transform": "uppercase", color: "#78350f" }}>
                      ᚢ voti
                    </span>
                    <span style={{ "font-size": "0.65rem", "font-style": "italic", color: "#c2410c" }}>
                      · ◈ offline ({status()?.last_updated})
                    </span>
                  </div>
                }
              >
                <div class="flex items-center gap-2">
                  <span style={{ "font-size": "0.65rem", color: "#16a34a" }}>
                    ◈ {players()}
                  </span>
                  <span style={{ color: "#292524", "font-size": "0.5rem" }}>◆</span>
                  <span style={{ "font-size": "0.65rem", color: "#b45309" }}>
                    ᚢ {votes()} voti
                  </span>
                </div>
              </Show>
            </Show>
          </div>
        </div>

        {/* ── Actions ── */}
        <Show when={!props.nascondiPulsanti}>
          <div class="flex flex-col gap-1.5 flex-shrink-0">
            <VoteButtonComponent server={props.server} onVoteRequest={nohandle} value="entra" />
            <button
              onClick={copyIp}
              title="Copia IP"
              style={{
                padding: "0.35rem 0.6rem",

                "font-size": "0.6rem",
                "text-transform": "uppercase",
                "letter-spacing": "0.08em",
                background: "transparent",
                border: "1px solid #292524",
                color: "#57534e",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={e => {
                e.currentTarget.style.color = "#d97706";
                e.currentTarget.style.borderColor = "#78350f";
              }}
              onMouseOut={e => {
                e.currentTarget.style.color = "#57534e";
                e.currentTarget.style.borderColor = "#292524";
              }}
            >
              📜 COPIA IP
            </button>
          </div>
        </Show>
      </div>

      {/* bottom line */}
      <div
        class="absolute bottom-0 inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(60,40,20,0.3), transparent)",
        }}
      />
    </div>
  );
};

export default GameServerCardComponent;