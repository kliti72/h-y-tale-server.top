// src/components/HomeHero.tsx
import { Component, createEffect, createResource, Match, Switch } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { For, Show } from "solid-js";
import { ServerService } from "../../services/server.service";
import ServerCardPortalRealm from "../card/ServerCard/ServerCardPortalRealm";
import ServerCard from "../card/ServerCard/ServerCard";
import GamingCard from "../card/ServerCard/GamingCard";



const HeroMain: Component = () => {

  
  const navigate = useNavigate();
  const [featuredd] = createResource(() => ServerService.getServers());
  const featured = () => featuredd()?.data ?? [];

  // Sostituisci con il TUO server ID
  const DISCORD_GUILD_ID = "610190493862854676"; // ← metti il tuo
  const DISCORD_INVITE = "https://discord.gg/tuoinvito"; // ← invito permanente


  const fetchOnlineCount = async () => {
  try {
    const res = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`);
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.presence_count ?? 0; // numero utenti online
  } catch (err) {
    console.error("Errore fetch Discord online count:", err);
    return null;
  }
};
  const [onlineCount] = createResource<number | null>(fetchOnlineCount);
 
  
  return (
    <section class="relative w-full min-h-[70vh] flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.08),transparent_40%)]" />
      </div>

      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Scopri i Migliori Server
          <span class="block text-emerald-400">Hytale</span>
        </h1>

        <p class="text-xl sm:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Esplora regni epici, unisciti a comunità attive, vota i tuoi preferiti e trova il tuo prossimo mondo da conquistare.
        </p>

       <button
          onClick={() => navigate("/servers")}
          class={`
            inline-flex items-center gap-3 px-10 py-5 rounded-xl text-xl font-bold
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            text-white shadow-xl shadow-emerald-900/40 hover:shadow-emerald-700/60
            border border-emerald-500/40 hover:border-emerald-400/60
            transition-all duration-300 active:scale-95 m-2
          `}
        >
          <span class="text-2xl"> </span>
          Esplora tutti 
        </button>

<button
      onClick={() => window.open(DISCORD_INVITE, "_blank")}
      class={`
        inline-flex items-center gap-3 px-8 py-5 rounded-xl text-xl font-bold
        bg-gradient-to-r from-indigo-600 to-purple-600
        hover:from-indigo-500 hover:to-purple-500
        text-white shadow-xl shadow-indigo-900/40 hover:shadow-indigo-700/60
        border border-indigo-500/40 hover:border-indigo-400/60
        transition-all duration-300 active:scale-95
        min-w-[280px] m-2
      `}
    >
      <span class="text-2xl"></span>
      Entra nel nostro Discord
      
      <Switch fallback={<span class="ml-1 px-2.5 py-1 text-base bg-white/20 rounded-full">caricamento...</span>}>
        <Match when={onlineCount.loading}>
          <span class="ml-1 px-2.5 py-1 text-base bg-white/20 rounded-full animate-pulse">
            ...
          </span>
        </Match>
        <Match when={onlineCount() != null}>
          <span class="ml-1 px-2.5 py-1 text-base font-semibold bg-white/20 rounded-full">
            {onlineCount()?.toLocaleString() || 0} online
          </span>
        </Match>
        <Match when={onlineCount() === null}>
          <span class="ml-1 px-2.5 py-1 text-base bg-white/20 rounded-full">
            ? online
          </span>
        </Match>
      </Switch>
    </button>
      </div>

      <div class="relative z-10 w-full mt-16">
        <h3 class="text-2xl sm:text-3xl font-bold text-center text-zinc-200 mb-8">
          Server in Evidenza
        </h3>

        <div class="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 no-scrollbar overflow-x-scroll ">
          <div class="flex gap-5 min-w-max px-4 " style={{ animation: "marquee 40s" }}>
            <Show
              when={!featured.loading}
              fallback={
                <div class="flex gap-5">
                  <For each={Array(6)}>
                    {() => (
                      <div class="w-64 h-40 bg-zinc-800/50 rounded-xl animate-pulse" />
                    )}
                  </For>
                </div>
              }
            >
              <Show when={featured()?.length >= 0} fallback={
                <p class="text-center text-zinc-500 w-full">Nessun server in evidenza al momento...</p>
              }>
                <For each={featured()?.slice(0, 12)}>
                      {(server) => <GamingCard server={server} onVoteRequest={() => ("")} nascondiPulsanti={true} />}

                </For>
              </Show>
            </Show>
          </div>
        </div>

        {/* Indicatore di scorrimento */}
        <div class="text-center mt-4 text-zinc-500 text-sm">
          Auto Scorrimento →  guarda tutti  evidenza
        </div>
      </div>
    </section>
  );
};

export default HeroMain;