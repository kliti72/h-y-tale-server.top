import { Component, createSignal, For, Show, createMemo, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { createResource } from "solid-js";
import { ServerService } from "../../services/server.service";
import { ServerResponse } from "../../types/ServerResponse";

// Types per le classifiche
type LeaderboardPeriod = "today" | "week" | "month" | "alltime";
type LeaderboardType = "votes" | "players" | "trending" | "new";

type ServerRanking = {
  rank: number;
  server: ServerResponse;
  value: number;
  change: number; // +/- posizioni rispetto al periodo precedente
  trend: "up" | "down" | "same";
};

const Leaderboard: Component = () => {
  const [selectedPeriod, setSelectedPeriod] = createSignal<LeaderboardPeriod>("week");
  const [selectedType, setSelectedType] = createSignal<LeaderboardType>("votes");
  const [searchQuery, setSearchQuery] = createSignal("");
  
  const [servers] = createResource(() => ServerService.getServers());

  // Stats animate
  const [totalVotes, setTotalVotes] = createSignal(0);
  const [totalServers, setTotalServers] = createSignal(0);
  const [activeNow, setActiveNow] = createSignal(0);

  onMount(() => {
    // Animazione contatori
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setTotalVotes(Math.min(count * 127, 12784));
      setTotalServers(Math.min(count * 2, 247));
      setActiveNow(Math.min(count * 3, 342));
      if (count >= 100) clearInterval(interval);
    }, 15);
  });

  // Mock data per le classifiche (sostituisci con dati reali)
  const generateRankings = (): ServerRanking[] => {
    const serverData = servers()?.data || [];
    
    return serverData.slice(0, 50).map((server, index) => {
      // Mock values basati sul tipo di classifica
      let value = 0;
      if (selectedType() === "votes") {
        value = server.votes || Math.floor(Math.random() * 1000);
      } else if (selectedType() === "players") {
        value = Math.floor(Math.random() * 200);
      } else if (selectedType() === "trending") {
        value = Math.floor(Math.random() * 500);
      } else {
        value = Math.floor(Math.random() * 100);
      }

      const change = Math.floor(Math.random() * 10) - 5;
      const trend: "up" | "down" | "same" = change > 0 ? "up" : change < 0 ? "down" : "same";

      return {
        rank: index + 1,
        server,
        value,
        change: Math.abs(change),
        trend
      };
    }).sort((a, b) => b.value - a.value);
  };

  const rankings = createMemo(() => {
    let data = generateRankings();
    
    // Filtro ricerca
    const query = searchQuery().toLowerCase().trim();
    if (query) {
      data = data.filter(r => 
        r.server.name.toLowerCase().includes(query) ||
        r.server.ip.toLowerCase().includes(query)
      );
    }

    return data;
  });

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-amber-500";
    if (rank === 2) return "from-gray-300 to-gray-400";
    if (rank === 3) return "from-amber-600 to-orange-700";
    return "from-violet-600 to-purple-600";
  };

  const getValueLabel = () => {
    switch (selectedType()) {
      case "votes": return "voti";
      case "players": return "player";
      case "trending": return "punti";
      case "new": return "giorni fa";
    }
  };

  return (
            <section class="game-root">
        {/* RAINBOW TOP BAR */}
                <div class="g-rainbow" />
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      
      

      {/* Main Content */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
   {/* HERO */}
                <div class="g-hero">
                    <span class="g-hero-deco g-hero-deco-1">🎮</span>
                    <span class="g-hero-deco g-hero-deco-2">⭐</span>
                    <span class="g-hero-deco g-hero-deco-3">🌍</span>
                    <div class="g-hero-tag">Top Ranking </div>
                    <div class="g-hero-title" style="margin-top:0.5rem;">Top ranking 2</div>
                    <div class="g-hero-sub"> Top ranking 3 </div>

                    </div>

        {/* Leaderboard Table */}
        <Show 
          when={rankings().length > 0}
          fallback={
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-12 border border-violet-900/50 text-center">
              <div class="text-6xl mb-4">🔍</div>
              <h3 class="text-2xl font-bold text-white mb-2">Nessun server trovato</h3>
              <p class="text-violet-300">Prova a modificare i filtri o la ricerca</p>
            </div>
          }
        >
          <div class="space-y-4">
            
            {/* Rest of Rankings - List */}
            <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl overflow-hidden border border-violet-900/50 backdrop-blur-md">
              
              {/* Table Header */}
              <div class="bg-violet-950/50 border-b border-violet-800/50 px-6 py-4 hidden md:grid md:grid-cols-12 gap-4 text-sm font-semibold text-violet-300">
                <div class="col-span-1">Pos.</div>
                <div class="col-span-1">Trend</div>
                <div class="col-span-5">Server</div>
                <div class="col-span-2 text-center">{getValueLabel().charAt(0).toUpperCase() + getValueLabel().slice(1)}</div>
                <div class="col-span-3 text-right">Azioni</div>
              </div>

              {/* Table Rows */}
              <div class="divide-y divide-violet-900/30">
                <For each={rankings().slice(3)}>
                  {(ranking) => (
                    <div class="
                      px-4 md:px-6 py-4 hover:bg-violet-950/30 transition-colors
                      grid grid-cols-1 md:grid-cols-12 gap-4 items-center
                    ">
                      
                      {/* Rank */}
                      <div class="md:col-span-1 flex md:block items-center gap-3 md:gap-0">
                        <span class="text-sm text-violet-400 md:hidden">Posizione:</span>
                        <div class="text-2xl font-black text-white">
                          #{ranking.rank}
                        </div>
                      </div>

                      {/* Trend */}
                      <div class="md:col-span-1 flex md:block items-center gap-3 md:gap-0">
                        <span class="text-sm text-violet-400 md:hidden">Variazione:</span>
                        <Show 
                          when={ranking.trend !== "same"}
                          fallback={
                            <span class="text-gray-500 text-sm">—</span>
                          }
                        >
                          <div class={`
                            inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold
                            ${ranking.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                          `}>
                            <span>{ranking.trend === "up" ? "↑" : "↓"}</span>
                            {ranking.change}
                          </div>
                        </Show>
                      </div>

                      {/* Server Info */}
                      <div class="md:col-span-5">
                        <A 
                          href={`/server/${ranking.server.name}`}
                          class="group"
                        >
                          <h4 class="text-lg font-bold text-white mb-1 group-hover:text-fuchsia-400 transition-colors">
                            {ranking.server.name}
                          </h4>
                        </A>
                        <div class="flex items-center gap-2 text-sm text-violet-400 font-mono">
                          <span>🌐</span>
                          {ranking.server.ip}
                        </div>
                      </div>

                      {/* Value */}
                      <div class="md:col-span-2 flex md:block items-center gap-3 md:gap-0">
                        <span class="text-sm text-violet-400 md:hidden capitalize">{getValueLabel()}:</span>
                        <div class="md:text-center">
                          <div class="text-2xl font-black text-fuchsia-400">
                            {ranking.value.toLocaleString()}
                          </div>
                          <div class="text-xs text-violet-500 hidden md:block">{getValueLabel()}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div class="md:col-span-3 flex items-center justify-start md:justify-end gap-2">
                        <A
                          href={`/server/${ranking.server.name}`}
                          class="
                            flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600
                            hover:from-violet-500 hover:to-fuchsia-500
                            rounded-xl font-semibold text-sm
                            transition-all text-center
                          "
                        >
                          Visita
                        </A>
                        <button
                          onClick={() => alert("Vota funzionalità in arrivo!")}
                          class="
                            px-6 py-2.5 bg-violet-950/60 hover:bg-violet-900/80
                            border border-violet-700/50 hover:border-fuchsia-500/50
                            rounded-xl font-semibold text-sm
                            transition-all
                          "
                        >
                          🔥 Vota
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              {/* Footer Info */}
              <div class="bg-violet-950/30 border-t border-violet-800/30 px-6 py-4 text-center text-sm text-violet-400">
                Mostrando {rankings().length} server • Aggiornato in tempo reale
              </div>
            </div>
          </div>
        </Show>

        {/* Info Box */}
        <div class="mt-8 bg-gradient-to-br from-violet-950/40 to-fuchsia-950/40 rounded-2xl p-6 border border-violet-700/30">
          <div class="flex items-start gap-4">
            <span class="text-4xl">ℹ️</span>
            <div>
              <h3 class="text-lg font-bold text-white mb-2">Come Funzionano le Classifiche</h3>
              <p class="text-violet-200 mb-3">
                Le classifiche vengono aggiornate in tempo reale basandosi sui voti ricevuti dai server. 
                Più voti riceve un server, più sale in classifica!
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-violet-300">
                <div class="flex items-center gap-2">
                  <span class="text-green-400">↑</span>
                  <span>Freccia verde = server in crescita</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-red-400">↓</span>
                  <span>Freccia rossa = server in calo</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>🥇🥈🥉</span>
                  <span>Medaglie per i primi 3 posti</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>🔥</span>
                  <span>Vota per aiutare i tuoi server preferiti!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div class="mt-8 text-center">
          <div class="inline-block bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-8 border border-violet-900/50">
            <h3 class="text-2xl font-bold text-white mb-3">
              Hai un server Minecraft?
            </h3>
            <p class="text-violet-300 mb-6">
              Aggiungilo alla nostra piattaforma e inizia a scalare le classifiche!
            </p>
            <A
              href="/panel"
              class="
                inline-flex items-center gap-3 px-8 py-4 
                bg-gradient-to-r from-green-600 to-emerald-600
                hover:from-green-500 hover:to-emerald-500
                rounded-xl font-bold text-lg shadow-lg shadow-green-900/50
                transition-all
              "
            >
              <span class="text-2xl">🚀</span>
              Aggiungi il Tuo Server
            </A>
          </div>
        </div>
      </div>
    </div>
            </section>
          

  );
};

export default Leaderboard;