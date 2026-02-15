// src/components/ServerCardPortalRealm.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createResource, For, Show } from "solid-js";
import { notify } from "../template/Notification";
import { ServerResponse } from "../../types/ServerResponse";
import { VoteService } from "../../services/votes.service";

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
};

const ServerCardPortalRealm: Component<ServerCardProps> = (props) => {
  const navigate = useNavigate();
  const [aviableVoteResource] = createResource(VoteService.aviableVote);

  const canVote = () => aviableVoteResource()?.success ?? false;
  const waitTime = () => aviableVoteResource()?.wait_time ?? "??";

  const portals = [
    { color: "from-purple-600 via-indigo-600 to-blue-600", name: "Realm Antico" },
    { color: "from-cyan-600 via-teal-600 to-emerald-600", name: "Realm Etereo" },
    { color: "from-pink-600 via-fuchsia-600 to-purple-600", name: "Realm Stellare" },
  ];

  const handleVote = (e: MouseEvent) => {
    e.stopPropagation();
    if (canVote()) {
      props.onVoteRequest(props.server);
    } else {
      notify(`Il portale è sigillato per ${waitTime()} ore – medita e riprova!`);
    }
  };

  const copyAddress = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
    notify("Coordinate del portale copiate! ✨ Attraversa quando sei pronto.");
  };

  return (
    <div
      onClick={() => navigate(`/server/${props.server.name}`)}
      class={`
        relative rounded-3xl overflow-hidden p-8
        bg-gradient-to-b from-indigo-950 via-purple-950 to-black
        border-4 border-purple-700/40 hover:border-purple-400/70
        shadow-2xl shadow-purple-950/70 hover:shadow-[0_0_80px_#a855f7cc,0_0_140px_#7c3aed88]
        transition-all duration-800 ease-out
        hover:scale-[1.03] hover:-translate-y-4 backdrop-blur-xl cursor-pointer
      `}
    >
      {/* Sfondo floating islands + nebbia */}
      <div class="absolute inset-0 pointer-events-none opacity-40">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.2),transparent_70%)]" />
      </div>

      {/* Particelle swirlanti intorno ai portali */}
      <For each={Array(12).fill(0)}>
        {(_, i) => (
          <div
            class="particle"
            style={{
              left: `${20 + (i() % 5) * 15}%`,
              top: `${30 + Math.floor(i() / 5) * 20}%`,
              "animation-delay": `${i() * 0.8}s`,
            }}
          />
        )}
      </For>

      <div class="relative z-10 text-center">
        <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 mb-8 tracking-wider drop-shadow-2xl animate-pulse-slow">
          {props.server.name}
        </h2>

        <p class="font-mono text-cyan-200/90 text-xl mb-6 tracking-widest">
          {props.server.ip}:{props.server.port}
        </p>

        {/* I 3 portali affiancati */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <For each={portals}>
            {(portal) => (
              <div
                class={`
                  relative rounded-2xl overflow-hidden aspect-[4/5] max-h-[320px]
                  bg-gradient-to-br ${portal.color}
                  border-4 border-purple-400/30 hover:border-purple-300/70
                  shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:shadow-[0_0_80px_rgba(168,85,247,1)]
                  transition-all duration-500 group/portal hover:scale-105
                `}
              >
                {/* Effetto portale swirl interno */}
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div class="w-4/5 h-4/5 rounded-full bg-gradient-radial from-white/20 via-purple-400/40 to-transparent blur-2xl animate-pulse-slow" />
                </div>

                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-bold text-lg px-6 py-3 rounded-full bg-black/60 border border-purple-300/50 backdrop-blur-md">
                  {portal.name}
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Status + Pulsanti */}
        <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
          <div class="px-8 py-4 bg-stone-900/70 rounded-2xl border-2 border-amber-600/50 text-amber-300 font-bold text-xl">
            STATUS: <span class="text-emerald-400 animate-pulse">ONLINE</span> • 0/300
          </div>

          <button
            onClick={handleVote}
            class={`
              px-12 py-5 rounded-2xl text-xl font-bold uppercase tracking-wider
              ${canVote()
                ? "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-[0_0_30px_#fbbf24cc]"
                : "bg-gray-800/70 text-gray-400 cursor-not-allowed"}
              border-4 border-amber-500/60 hover:border-amber-400/80 transition-all duration-300 active:scale-95
            `}
          >
            {canVote() ? "ATTRAVERSA & VOTA" : `Portale sigillato (${waitTime()}h)`}
          </button>

          <button
            onClick={copyAddress}
            class="px-12 py-5 rounded-2xl text-xl font-bold uppercase tracking-wider bg-gradient-to-r from-teal-800 to-cyan-800 hover:from-teal-700 hover:to-cyan-700 text-white border-4 border-cyan-500/50 hover:border-cyan-400/70 shadow-[0_0_30px_#22d3ee88] transition-all duration-300"
          >
            COPIA COORDINATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerCardPortalRealm;