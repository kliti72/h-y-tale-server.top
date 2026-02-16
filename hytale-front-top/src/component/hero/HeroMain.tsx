// src/components/HomeHero.tsx
import { Component, createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { For, Show } from "solid-js";

const API_URL = "http://localhost:3000";

const fetchFeaturedServers = async () => {
  // Potresti avere un endpoint dedicato tipo /api/servers/featured
  // Oppure riutilizzare /api/servers e prendere i primi 8-10
  const res = await fetch(`${API_URL}/api/servers?limit=10&sort=created_at:desc`);
  if (!res.ok) throw new Error("Errore caricamento server in evidenza");
  return res.json();
};

const HeroMain: Component = () => {
  const navigate = useNavigate();
  const [featured] = createResource(fetchFeaturedServers);

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
          onClick={() => navigate("/top")}
          class={`
            inline-flex items-center gap-3 px-10 py-5 rounded-xl text-xl font-bold
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            text-white shadow-xl shadow-emerald-900/40 hover:shadow-emerald-700/60
            border border-emerald-500/40 hover:border-emerald-400/60
            transition-all duration-300 active:scale-95
          `}
        >
          <span class="text-2xl">🔍</span>
          Esplora tutti i server
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
              <Show when={featured()?.length > 0} fallback={
                <p class="text-center text-zinc-500 w-full">Nessun server in evidenza al momento...</p>
              }>
                <For each={featured()?.slice(0, 12)}>
                  {(server) => (
                    <div
                      onClick={() => navigate(`/server/${server.name}`)}
                      class={`
                        flex-shrink-0 w-72 sm:w-80 bg-zinc-900/70 border border-zinc-700/60 rounded-xl
                        p-5 cursor-pointer transition-all duration-300
                        hover:border-emerald-600/70 hover:shadow-lg hover:shadow-emerald-900/30
                        hover:-translate-y-1
                      `}
                    >
                      <h4 class="text-lg font-bold text-white truncate mb-2">
                        {server.name}
                      </h4>
                      <p class="text-sm text-emerald-400 mb-3">
                        {server.ip}:{server.port}
                      </p>
                      <div class="flex flex-wrap gap-2">
                        <For each={server.tags?.slice(0, 3)}>
                          {(tag) => (
                            <span class="px-2.5 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {tag}
                            </span>
                          )}
                        </For>
                      </div>
                      <div class="flex gap-4 text-xs text-zinc-400 mt-2">
                        <span>★ {server.votes || 0} voti</span>
                        <span>👥 ? online</span>
                      </div>
                    </div>
                  )}
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