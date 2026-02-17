// src/components/ServerCard.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { notify } from "../../template/Notification";
import { ServerResponse } from "../../../types/ServerResponse";
import { VoteService } from "../../../services/votes.service";

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
};

const MobileCard: Component<ServerCardProps> = (props) => {
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
        rounded-xl bg-slate-900/70 border border-slate-800/60
        hover:border-emerald-700/60 p-4 transition-all
        hover:shadow-emerald-900/30 cursor-pointer flex gap-4 items-center
      `}
    >
      <img
        src={logoSrc()}
        class="w-14 h-14 rounded-lg object-cover border border-emerald-800/30"
      />

      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-white truncate">{props.server.name}</h4>
        <p class="text-xs text-slate-400 font-mono">
          {props.server.ip}:{props.server.port}
        </p>
      </div>

      <button
        onClick={handleVoteClick}
        class={`
          px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
          ${canVote()
            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
            : "bg-orange-900/70 text-orange-300 cursor-default"}
        `}
      >
        {canVote() ? "Vota" : `${waitTime()}h`}
      </button>
    </div>
  );
};

export default MobileCard;