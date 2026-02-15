// src/components/ServerCard.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { notify } from "../template/Notification";
import { ServerResponse } from "../../types/ServerResponse";
import { VoteService } from "../../services/votes.service";

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
};

const MinimalCard: Component<ServerCardProps> = (props) => {
  const navigate = useNavigate();
  const [aviableVoteResource] = createResource(VoteService.aviableVote);
  const logoSrc = () => props.server.logoUrl || "https://via.placeholder.com/80/111827/10b981?text=";

  const canVote = () => aviableVoteResource()?.success ?? false;
  const waitTime = () => aviableVoteResource()?.wait_time ?? "?";

  const handleVoteClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (canVote()) {
      props.onVoteRequest(props.server);
    } else {
      notify(`Prossimo voto tra ${waitTime()} ore`);
    }
  };

  return (
    <div
      onClick={() => navigate(`/server/${props.server.name}`)}
      class={`
        group relative rounded-xl overflow-hidden
        bg-gradient-to-b from-slate-900/80 to-slate-950/80
        border border-slate-700/50 hover:border-emerald-600/60
        shadow-lg shadow-black/40 hover:shadow-emerald-900/30
        backdrop-blur-sm transition-all duration-300
        hover:scale-[1.015] hover:-translate-y-0.5
        cursor-pointer
      `}
    >
      <div class="p-5 flex items-start gap-5">
        {/* Logo */}
        <img
          src={logoSrc()}
          alt={props.server.name}
          class="w-20 h-20 rounded-xl object-cover border-2 border-emerald-700/30 shadow-md"
          onError={e => (e.currentTarget.src = "https://via.placeholder.com/80/111827/10b981?text=?")}
        />

        {/* Contenuto centrale */}
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
            {props.server.name}
          </h3>
          <p class="mt-1 text-sm font-mono text-slate-400">
            {props.server.ip}:{props.server.port}
          </p>
          <div class="mt-3 flex items-center gap-4 text-xs text-slate-300">
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Online · 42/128
            </div>
          </div>
        </div>

        {/* Azioni a destra */}
        <div class="flex flex-col gap-3 items-end">
          <button
            onClick={handleVoteClick}
            disabled={!canVote()}
            class={`
              min-w-[140px] px-5 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 active:scale-95
              ${canVote()
                ? "bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-emerald-900/40"
                : "bg-slate-800/80 text-slate-400 cursor-not-allowed"}
              border border-emerald-700/40
            `}
          >
            {canVote() ? "Vota ora" : `Attendi ${waitTime()}h`}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
              notify("Indirizzo copiato negli appunti");
            }}
            class="min-w-[140px] px-5 py-2.5 rounded-lg text-sm font-medium
                   bg-slate-800/60 hover:bg-slate-700/80 text-slate-300
                   border border-slate-600/50 transition-all"
          >
            Copia IP
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinimalCard;