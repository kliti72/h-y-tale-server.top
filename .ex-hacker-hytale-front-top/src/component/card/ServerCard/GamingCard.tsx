// src/components/ServerCard.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { notify } from "../../template/Notification";
import { ServerResponse } from "../../../types/ServerResponse";
import { VoteService } from "../../../services/votes.service";

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
  nascondiPulsanti?: boolean,
};

const GamingCard: Component<ServerCardProps> = (props) => {
  const navigate = useNavigate();
  const [aviableVoteResource] = createResource(VoteService.aviableVote);
  const logoSrc = () => props.server.logo_url || "https://via.placeholder.com/80/111827/10b981?text=";

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

  const copyIp = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
    notify("IP copiato nel buffer neural → pronto per il netrun!");
  };

  return (
    <div class={`
      relative rounded-2xl overflow-hidden
      bg-gradient-to-br from-gray-950 via-slate-950 to-black
      border border-violet-900/30 hover:border-violet-600/60
      shadow-2xl shadow-violet-950/40 hover:shadow-violet-900/50
      transition-all duration-400 hover:scale-[1.02] group
      backdrop-blur-md
    `}
    style={{"cursor" :"pointer"}}
    onClick={() => navigate(`/server/${props.server.id}`)}
>
      {/* Badge in alto a sinistra */}
      <div class="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold rounded-full bg-violet-600/90 text-white shadow-md">
        Popular
      </div>

      <div class="p-6 flex gap-6 items-center">
        <img
          src={logoSrc()}
          class="w-24 h-24 rounded-2xl ring-2 ring-violet-500/30 object-cover shadow-2xl"
        />

        <div class="flex-1">
          <h3 class="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors mb-1">
            {props.server.name}
          </h3>
          <p class="font-mono text-violet-400/80 text-sm mb-4">
            {props.server.ip}:{props.server.port}
          </p>

          <div class="flex items-center gap-5 text-sm text-gray-300">
            <div class="flex items-center gap-2">
              <span class="text-emerald-400">●</span> 87/200 online
            </div>
            <div>Voti: 0</div>
          </div>
        </div>
        <div class="flex flex-col gap-4">

          <Show when={!props.nascondiPulsanti}>
            <button
              onClick={handleVoteClick}
              class={`
              w-40 py-3 rounded-xl font-semibold text-base
              shadow-lg transition-all duration-200 active:scale-95
              ${canVote()
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
                  : "bg-gray-800/70 text-gray-400 cursor-not-allowed"}
            `}
            >
              {canVote() ? "VOTA" : `Attendi ${waitTime()}h`}
            </button>

            <button
              onClick={copyIp}
              class="w-40 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 font-medium transition"
            >
              Copia IP
            </button>
          </Show>

        </div>
      </div>
    </div>
  );
};

export default GamingCard;