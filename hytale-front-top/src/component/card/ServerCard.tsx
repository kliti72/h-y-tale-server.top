// src/components/ServerCard.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createResource } from "solid-js";
import { notify } from "../template/Notification";
import { ServerResponse } from "../../types/ServerResponse";
import { VoteService } from "../../services/votes.service";

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
};

const ServerCard: Component<ServerCardProps> = (props) => {
  const navigate = useNavigate();
  const [aviableVoteResource] = createResource(VoteService.aviableVote);
  const logoSrc = () => props.server.logoUrl || `https://via.placeholder.com/96/0a0a1f/00ff9f?text`

  const canVote = () => aviableVoteResource()?.success ?? false;
  const waitTime = () => aviableVoteResource()?.wait_time ?? "??";

  const handleVoteClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (canVote()) {
      props.onVoteRequest(props.server);
    } else {
      notify(`Cooldown attivo → prossimo voto tra ${waitTime()}h`);
    }
  };

  const copyIp = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
    notify("IP copiato nel buffer neural → pronto per il netrun!");
  };

  return (
    <div
      onClick={() => navigate(`/server/${props.server.name}`)}
      class={`
        group relative rounded-2xl overflow-hidden
        bg-gradient-to-br from-black via-indigo-950/80 to-purple-950/60
        border-2 border-transparent
        hover:border-purple-500/70 hover:shadow-[0_0_40px_#8b5cf6cc,0_0_80px_#a855f7aa]
        shadow-[0_0_30px_rgba(139,92,246,0.3)]
        transition-all duration-500 ease-out
        backdrop-blur-xl cursor-pointer
        hover:scale-[1.03] hover:-translate-y-1
        before:content-[''] before:absolute before:inset-0
        before:bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.12),transparent_40%)]
        before:pointer-events-none before:opacity-0 group-hover:before:opacity-100 before:transition-opacity
      `}
    >
      {/* Overlay glitch/scanline leggero (opzionale, commenta se troppo) */}
      <div class="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity">
        <div class="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,0,255,0.03),rgba(255,0,255,0.03)_1px,transparent_1px,transparent_3px)]" />
      </div>

      <div class="relative p-6 flex items-center gap-6 z-10">
        {/* Logo con glow neon */}
        <div class="relative flex-shrink-0">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-600/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
          <img
            src={logoSrc()}
            alt={props.server.name}
            class="w-24 h-24 rounded-2xl object-cover border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.6)] ring-1 ring-cyan-400/40"
            onError={e => (e.currentTarget.src = "https://via.placeholder.com/96/0a0a1f/ff00ff?text=ERR")}
          />
        </div>

        {/* Info centrali – stile HUD */}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-400 transition-all tracking-tight">
              {props.server.name}
            </h3>
              <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-red-600/80 text-white shadow-[0_0_15px_#ef4444aa] animate-pulse">
                HOT
              </span>
          </div>

          <p class="font-mono text-cyan-300/90 text-base tracking-wider drop-shadow-md">
            {props.server.ip}:{props.server.port}
          </p>

          <div class="mt-3 flex items-center gap-5 text-sm">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981cc] animate-pulse" />
              <span class="text-emerald-300/90 font-medium">Online: 87/200</span>
            </div>
            <div class="text-purple-300/80">
              Voti: 33
            </div>
          </div>
        </div>

        {/* Pulsanti – stile neon button cyber */}
        <div class="flex flex-col gap-4 flex-shrink-0">
          <button
            onClick={handleVoteClick}
            class={`
              relative px-8 py-3.5 rounded-xl text-base font-bold uppercase tracking-widest
              overflow-hidden transition-all duration-300 active:scale-95
              ${canVote()
                ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-[0_0_25px_rgba(236,72,153,0.6),inset_0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_45px_rgba(236,72,153,0.9)]"
                : "bg-gray-900/70 text-gray-500 cursor-not-allowed border border-gray-700/50"}
              border-2 border-purple-500/40 hover:border-purple-400/70
              before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-30 before:transition
            `}
          >
            {canVote() ? "VOTA ORA" : `Cooldown ${waitTime()}h`}
            <span class="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
          </button>

          <button
            onClick={copyIp}
            class={`
              px-8 py-3.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-cyan-900/70 to-purple-900/70
              hover:from-cyan-800/80 hover:to-purple-800/80
              text-cyan-300 border border-cyan-700/50 hover:border-cyan-500/70
              shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)]
              transition-all duration-300
            `}
          >
            COPIA NETRUN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;