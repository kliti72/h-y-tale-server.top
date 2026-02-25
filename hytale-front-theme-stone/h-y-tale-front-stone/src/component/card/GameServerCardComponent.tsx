import { useNavigate } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { notify } from "../notify/NotificationComponent";
import { ServerResponse, ServerStatus } from "../../types/ServerResponse";
import { VoteService } from "../../services/votes.service";
import { StatusService } from "../../services/status.service";

type Props = { server: ServerResponse; onVoteRequest: (s: ServerResponse) => void; nascondiPulsanti?: boolean; };

const GameServerCardComponent: Component<Props> = (props) => {
  const navigate = useNavigate();
  const [status] = createResource<ServerStatus | null>(
    () => StatusService.getStatusById(props.server.id ?? 1),
    { initialValue: null }
  );
  const [voteRes] = createResource(VoteService.aviableVote);

  const canVote  = () => voteRes()?.success ?? false;
  const waitTime = () => voteRes()?.wait_time ?? "?";
  const logo     = () => props.server.logo_url || "https://via.placeholder.com/80/1c1917/92400e?text=SRV";
  const isOnline = () => !status.loading && status() != null;
  const players  = () => `${status()?.players_online ?? 0}/${status()?.players_max ?? 0}`;
  const votes    = () => props.server.voti_totali ?? 0;

  const handleVote = (e: MouseEvent) => {
    e.stopPropagation();
    canVote() ? props.onVoteRequest(props.server) : notify(`Prossimo voto tra ${waitTime()} ore`);
  };

  const copyIp = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
    notify("IP copiato negli appunti!");
  };

  return (
    <div
      onClick={() => navigate(`/server/${props.server.id}`)}
      class="group relative bg-stone-900 border border-stone-700/80 hover:border-amber-800/70 cursor-pointer transition-all duration-200 hover:bg-stone-900/80 overflow-hidden"
    >
      {/* subtle glow on hover */}
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-amber-950/10 via-transparent to-transparent" />

      {/* corner accents */}
      <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-800/50 pointer-events-none" />
      <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-800/50 pointer-events-none" />
      <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-800/50 pointer-events-none" />
      <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-800/50 pointer-events-none" />

      {/* online status bar (top edge) */}
      <div class={`absolute top-0 inset-x-0 h-0.5 transition-colors duration-300 ${isOnline() ? "bg-gradient-to-r from-transparent via-red-700/60 to-transparent" : "bg-gradient-to-r from-transparent via-stone-700/40 to-transparent"}`} />

      <div class="flex items-stretch gap-0 p-3">

        {/* ── Logo ── */}
        <div class="relative flex-shrink-0 mr-3">
          <img
            src={logo()} alt={props.server.name}
            class="w-16 h-16 object-cover border border-stone-700 group-hover:border-amber-900/60 transition-colors"
          />
          {/* online dot badge */}
        </div>

        {/* ── Info ── */}
        <div class="flex-1 min-w-0 flex flex-col justify-center gap-1">

          {/* name + version badge */}
          <div class="flex items-center gap-2 min-w-0">
            <p class="font-serif font-bold text-amber-400 group-hover:text-amber-300 truncate text-sm uppercase tracking-wide transition-colors leading-tight">
              {props.server.name}
            </p>
            <Show when={(props.server as any).version}>
              <span class="flex-shrink-0 text-[10px] font-serif px-1.5 py-0.5 border border-stone-700 text-stone-500 bg-stone-950/60 leading-none">
                {(props.server as any).version}
              </span>
            </Show>
          </div>

          {/* ip */}
          <p class="text-stone-600 font-serif text-xs truncate font-mono leading-tight">
            {props.server.ip}:{props.server.port}
          </p>

          {/* stats row */}
          <div class="flex items-center gap-2.5 mt-0.5">
            <Show
              when={isOnline()}
              fallback={
                <span class="text-[11px] font-serif text-stone-600 italic">
                  Plugin non installato —{" "}
                  <a href="/docs" onClick={e => e.stopPropagation()} class="text-amber-800 hover:text-amber-600 transition-colors not-italic">
                    scaricalo
                  </a>
                </span>
              }
            >
              <span class="flex items-center gap-1 text-xs font-serif text-green-600/90">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {players()} online
              </span>
              <span class="text-stone-800">·</span>
              <span class="text-xs font-serif text-amber-700/80 flex items-center gap-1">
                <span>⚔</span> {votes()} voti
              </span>
            </Show>
          </div>
        </div>

        {/* ── Actions ── */}
        <Show when={!props.nascondiPulsanti}>
          <div class="flex flex-col gap-1.5 flex-shrink-0 ml-3 justify-center">
            <button
              onClick={handleVote}
              title={canVote() ? "Vota questo server" : `Attendi ${waitTime()}h`}
              class={`px-3 py-2 text-xs font-serif uppercase tracking-wider border transition-all duration-150 leading-none
                ${canVote()
                  ? "border-amber-800/70 bg-amber-950/40 text-amber-400 hover:bg-amber-900/50 hover:text-amber-300 hover:border-amber-700"
                  : "border-stone-800 bg-stone-950/60 text-stone-600 cursor-not-allowed"}`}
            >
              {canVote() ? "⚔ Vota" : `⏳ ${waitTime()}h`}
            </button>
            <button
              onClick={copyIp}
              title="Copia IP"
              class="px-3 py-2 text-xs font-serif uppercase tracking-wider border border-stone-700 bg-stone-950/40 text-stone-500 hover:text-amber-500 hover:border-amber-900/60 hover:bg-stone-900 transition-all duration-150 leading-none"
            >
              📋 IP
            </button>
          </div>
        </Show>
      </div>

      {/* bottom shimmer line */}
      <div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-700/30 to-transparent group-hover:via-amber-900/30 transition-colors" />
    </div>
  );
};

export default GameServerCardComponent;