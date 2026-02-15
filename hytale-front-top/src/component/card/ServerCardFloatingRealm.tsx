// src/components/ServerCardFloatingRealm.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { notify } from "../template/Notification";
import { ServerResponse } from "../../types/ServerResponse";
import { VoteService } from "../../services/votes.service";

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
};

const ServerCardFloatingRealm: Component<ServerCardProps> = (props) => {
  const navigate = useNavigate();
  const [aviableVoteResource] = createResource(VoteService.aviableVote);

  const canVote = () => aviableVoteResource()?.success ?? false;
  const waitTime = () => aviableVoteResource()?.wait_time ?? "??";

  const logoSrc = () => props.server.logoUrl || "https://via.placeholder.com/120/2a1b4d/00ffaa?text=";

  const handleVote = (e: MouseEvent) => {
    e.stopPropagation();
    if (canVote()) {
      props.onVoteRequest(props.server);
    } else {
      notify(`Prossimo voto tra ${waitTime()} ore – torna presto avventuriero!`);
    }
  };

  const copyAddress = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
    notify("Indirizzo copiato! ✨ Pronto per il portale?");
  };

  return (
    <div
      onClick={() => navigate(`/server/${props.server.name}`)}
      class={`
        group relative rounded-3xl overflow-hidden
        bg-gradient-to-b from-sky-950 via-indigo-950 to-purple-950
        border-4 border-amber-700/40 hover:border-amber-400/70
        shadow-2xl shadow-purple-950/60 hover:shadow-[0_0_60px_#c084fc88,0_0_120px_#a855f766]
        transition-all duration-700 ease-out
        hover:scale-[1.04] hover:-translate-y-3
        backdrop-blur-xl cursor-pointer
        before:content-[''] before:absolute before:inset-0
        before:bg-[radial-gradient(circle_at_30%_70%,rgba(192,132,252,0.15),transparent_60%)]
        before:pointer-events-none before:opacity-70 group-hover:before:opacity-100 before:transition
      `}
    >
      {/* Floating island base – effetto parallax leggero al hover */}
      <div class="absolute inset-0 pointer-events-none">
        <div class={`
          absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-48
          bg-gradient-to-t from-emerald-900/40 to-transparent
          rounded-t-full blur-xl opacity-60 group-hover:opacity-90
          transition-all duration-1000 -translate-y-4 group-hover:-translate-y-8
        `} />
      </div>

      {/* Cristalli fluttuanti decorativi */}
      <div class="absolute top-6 right-8 w-16 h-32 opacity-80 pointer-events-none animate-float-slow">
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-400/60 to-purple-500/40 blur-xl rounded-full" />
      </div>
      <div class="absolute bottom-20 left-12 w-12 h-24 opacity-70 pointer-events-none animate-float-reverse">
        <div class="absolute inset-0 bg-gradient-to-tl from-pink-400/50 to-blue-500/40 blur-lg rounded-full" />
      </div>

      <div class="relative p-8 flex flex-col gap-6 z-10">
        {/* Logo + Nome server – stile insegna incantata */}
        <div class="flex items-center gap-6">
          <div class="relative">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-600/30 blur-2xl opacity-70 animate-pulse-slow" />
            <img
              src={logoSrc()}
              alt={props.server.name}
              class="w-28 h-28 rounded-2xl object-cover border-4 border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.5)] ring-2 ring-cyan-300/40"
              onError={e => (e.currentTarget.src = "https://via.placeholder.com/120/2a1b4d/ffaa00?text=??")}
            />
          </div>

          <div>
            <h3 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 group-hover:from-amber-200 group-hover:via-yellow-100 group-hover:to-amber-300 transition-all tracking-wide drop-shadow-lg">
              PROVA
            </h3>
            <p class="mt-1 font-mono text-cyan-200/90 text-lg tracking-widest drop-shadow-md">
              {props.server.ip}:{props.server.port}
            </p>
          </div>
        </div>


        {/* Status panel – stile cartello Minecraft */}
        <div class={`
          relative bg-gradient-to-b from-stone-900/90 to-black/80
          border-4 border-amber-800/70 rounded-2xl p-6 text-center
          shadow-inner shadow-black/60
          before:content-[''] before:absolute before:inset-2 before:border-2 before:border-amber-600/40 before:rounded-xl
        `}>
          <p class="text-amber-300/90 font-bold text-xl tracking-wide mb-3">
            STATUS: <span class="text-emerald-400 animate-pulse">ONLINE</span>
          </p>
          <p class="text-cyan-200 font-semibold text-lg">
            PLAYERS: 0/300
          </p>
        </div>

        {/* Pulsanti – stile wood/stone buttons con glow */}
        <div class="flex gap-5 justify-center">
          <button
            onClick={handleVote}
            class={`
              relative px-10 py-5 rounded-2xl text-xl font-bold uppercase tracking-wider
              transition-all duration-300 active:scale-95 shadow-xl
              ${canVote()
                ? "bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 text-white border-4 border-amber-400/60 hover:border-amber-300/80 shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:shadow-[0_0_50px_rgba(245,158,11,0.9)]"
                : "bg-stone-800/80 text-stone-400 cursor-not-allowed border-4 border-stone-700/50"}
            `}
          >
            {canVote() ? "VOTA" : `Attendi ${waitTime()}h`}
            <span class="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-amber-500/20 opacity-0 hover:opacity-100 transition" />
          </button>

          <button
            onClick={copyAddress}
            class={`
              px-10 py-5 rounded-2xl text-xl font-bold uppercase tracking-wider
              bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900
              hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800
              text-white border-4 border-emerald-500/50 hover:border-emerald-400/70
              shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_rgba(16,185,129,0.8)]
              transition-all duration-300
            `}
          >
            COPIA INDIRIZZO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerCardFloatingRealm;