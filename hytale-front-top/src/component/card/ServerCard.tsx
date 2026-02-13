// src/components/ServerCard.tsx
import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import { notify } from "../template/Notification";
import { ServerResponse } from "../../types/ServerResponse";


const API_URL = "http://localhost:3000";

const fetchFeaturedServers = async () => {
  const res = await fetch(`${API_URL}/api/servers?limit=10&sort=created_at:desc`);
  if (!res.ok) throw new Error("Errore caricamento server in evidenza");
  return res.json();
};

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (serverName: string, serverIp: string) => void;
};

const ServerCard: Component<ServerCardProps> = (props) => {
  const navigate = useNavigate();
  const logoSrc = () =>
    props.server.logoUrl ||
    "https://via.placeholder.com/80/" + "Mario";

  return (
    <div
      onClick={() => navigate(`/server/${props.server.name}`)}
      class={`
        group relative rounded-xl overflow-hidden
        backdrop-blur-md bg-black/30 border border-emerald-800/40
        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        hover:border-emerald-500/60 hover:shadow-[0_12px_40px_rgba(16,185,129,0.18)]
        transition-all duration-300 ease-out
        cursor-pointer
      `}
    >
        
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-cyan-900/5 pointer-events-none" />

      <div class="relative p-5 flex items-center gap-5">
        {/* Logo compatto */}
        <div class="flex-shrink-0">
          <img
            src={logoSrc()}
            alt={`${props.server.name} logo`}
            class="w-16 h-16 rounded-lg object-cover border border-emerald-700/30 shadow-inner shadow-emerald-950/40"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/64/0f2f1f/22ff99?text=?";
            }}
          />
        </div>

        {/* Info principali – layout semplice e leggibile */}
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors truncate leading-tight">
            {props.server.name}
          </h3>

          <p class="mt-1 text-base font-mono text-emerald-400/90 tracking-wide">
            {props.server.ip}:{props.server.port}
          </p>

          <div class="mt-2 flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-emerald-200/90">Online: 25/100</span>
            </div>
          </div>

                            
        </div>

        {/* Pulsanti – colonna compatta a destra */}
        <div class="flex flex-col gap-2.5 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              props.onVoteRequest(
                props.server.name || 'Sconosciuto',
                props.server.ip || '0.0.0.0'
              )
            }}
            class={`
              px-6 py-2.5 rounded-lg text-sm font-semibold
              bg-gradient-to-r from-emerald-700 to-teal-700
              hover:from-emerald-600 hover:to-teal-600
              text-white shadow-md shadow-emerald-900/40
              border border-emerald-600/50 hover:border-emerald-400/60
              active:scale-97 transition-all duration-200
            `}
          >
            Vota
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
              notify("Indirizzo copiato! 📋");
            }}
            class={`
              px-6 py-2.5 rounded-lg text-sm font-medium
              bg-black/40 hover:bg-emerald-950/60 text-emerald-300
              border border-emerald-800/50 hover:border-emerald-600/70
              transition-all duration-200 active:scale-97
            `}
            title="Copia IP:porta"
          >
            Copia Indirizzo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;