import { Component, createSignal, For, Show, createMemo } from "solid-js";
import { createResource } from "solid-js";
import GamingCard from "../component/card/GamingCard"; // <-- card fancy scelta
// import ServerCardPortalRealm from "../component/card/ServerCardPortalRealm";
// import ServerCardFloatingRealm from "../component/card/ServerCardFloatingRealm";
import PlayersVoteModal from "../component/modal/PlayersVoteModal";
import { ServerService } from "../services/server.service";
import Notifications, { notify, requireDiscordLogin } from "../component/template/Notification";
import { ServerResponse } from "../types/ServerResponse";
import { VoteService } from "../services/votes.service";
import { useAuth } from "../auth/AuthContext";

const Top: Component = () => {
  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';

  const [refreshTrigger, setRefreshTrigger] = createSignal(0);
  const [servers] = createResource(refreshTrigger, () => ServerService.getServers());

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);
  const [playerGameName, setPlayerGameName] = createSignal<string>("");

  // Filtri attivi (Set di tag selezionati)
  const [activeFilters, setActiveFilters] = createSignal<Set<string>>(new Set());

  const handleVoteRequest = (server: ServerResponse) => {
    if (!auth.isAuthenticated()) {
      requireDiscordLogin();
      return;
    }
    setIsModalOpen(true);
    setSelectedServer(server);
  };

  const handlePlayerVote = () => {
    const voteRes = VoteService.addVote(
      discord_id_user,
      selectedServer()?.id ?? 0,
      playerGameName() ?? ''
    );

    if (voteRes != null) {
      notify(`Complimenti ${playerGameName()} hai votato correttamente ${selectedServer()?.name}`);
      setRefreshTrigger(prev => prev + 1);
    }

    setIsModalOpen(false);
  };

  const serverData = () => servers()?.data ?? [];
  const serverCount = () => servers()?.count ?? 0;

  // Tags realistici (puoi caricarli da API in futuro)
  const availableTags = [
    "PvP", "Survival", "MiniGames", "Creative", "Roleplay", "Skyblock",
    "Factions", "Anarchy", "Economy", "Modded", "Vanilla", "Italian",
    "Discord Rich", "Events", "Hardcore", "Pixelmon", "Towny", "Bedwars",
    "Practice", "Lifesteal", "OneBlock"
  ];

  // Filtra i server in base ai tag attivi
  const filteredServers = createMemo(() => {
    const filters = activeFilters();
    if (filters.size === 0) return serverData();

    return serverData().filter(server => {
      // Supponiamo che server abbia un campo tags: string[] (adatta alla tua struttura)
      const serverTags = server.tags ?? []; // fallback se non esiste
      return Array.from(filters).some(tag => serverTags.includes(tag));
    });
  });

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  return (
    <section class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">
      {/* Header pagina */}
      <div class="
       
      ">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <h1 class="
            text-3xl md:text-5xl font-black tracking-tight
            text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400
            drop-shadow-lg
          ">
            CLASSIFICA SERVER
          </h1>


          <div class="flex items-center gap-4">
            <span class="text-violet-300 font-medium">
              {filteredServers().length} / {serverCount()} server
            </span>
            <button
              onClick={() => setRefreshTrigger(p => p + 1)}
              class="
                px-5 py-2 bg-violet-800/70 hover:bg-violet-700/80
                rounded-lg text-sm font-semibold transition-all
                border border-violet-600/50 hover:border-violet-400/70
              "
            >
              Aggiorna
            </button>
          </div>
          
        </div>
      </div>

      

      {/* Contenuto principale */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Tags orizzontali sopra le card */}
        <div class="mb-8">
          <h3 class="text-xl font-bold text-fuchsia-400 mb-4">Filtra per categoria</h3>
          <div class="
            flex flex-nowrap gap-3 pb-4 overflow-x-auto
            scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-violet-950/40
          ">

            
            <For each={availableTags}>
              {(tag) => {
                const isActive = activeFilters().has(tag);
                return (
                  <button
                    onClick={() => toggleFilter(tag)}
                    class={`
                      px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                      transition-all duration-200 flex-shrink-0
                      ${isActive
                        ? "bg-fuchsia-700/80 text-white border-fuchsia-500/70 shadow-md shadow-fuchsia-900/40"
                        : "bg-violet-950/60 text-violet-200 border-violet-700/50 hover:bg-violet-800/70 hover:border-violet-500/60"
                      }
                      border hover:scale-105 active:scale-95
                    `}
                  >
                    #{tag}
                  </button>
                );
              }}
            </For>
          </div>
                <div class="
              bg-gradient-to-br from-gray-900/80 to-black/80
              border border-violet-900/40 rounded-2xl p-6
              shadow-xl shadow-violet-950/30 backdrop-blur-sm
            ">
              <h3 class="text-xl font-bold text-fuchsia-400 mb-4">Statistiche</h3>
              <div class="space-y-3 text-violet-200">
                <p>Server totali: <strong class="text-white">{serverCount()}</strong></p>
                <p>Giocatori online ora: <strong class="text-emerald-400">~12.4k</strong></p>
                <p>Voti oggi: <strong class="text-pink-400">8.2k</strong></p>
              </div>
            </div>
        </div>

  

        {/* Cards */}
        <Show when={!servers.loading} fallback={<p class="text-center text-violet-400 text-xl py-12">Caricamento server...</p>}>
          <Show when={!servers.error} fallback={<p class="text-center text-red-400 text-xl py-12">Errore: {servers.error?.message}</p>}>
            <Show when={serverCount() > 0} fallback={<p class="text-center text-zinc-400 text-xl py-12">Nessun server ancora...</p>}>
              <Show
                when={filteredServers().length > 0}
                fallback={<p class="text-center text-amber-400 text-xl py-12">Nessun server corrisponde ai filtri selezionati</p>}
              >
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <For each={filteredServers()}>
                    {(server) => (
                      <GamingCard server={server} onVoteRequest={handleVoteRequest} />
                      // Cambia qui se vuoi un'altra card fancy:
                      // <ServerCardPortalRealm server={server} onVoteRequest={handleVoteRequest} />
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </Show>
        </Show>
      </div>

      {/* Modal e notifiche */}
      <PlayersVoteModal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        server_id={selectedServer()?.id || 0}
        discord_id_user={discord_id_user}
        server_secret_key={selectedServer()?.secret_key || ""}
        server_name={selectedServer()?.name || ''}
        server_ip={selectedServer()?.ip || ''}
        player_game_name={playerGameName() ?? ''}
        onPlayerNameChange={() => setPlayerGameName("")}
        onPlayerVote={handlePlayerVote}
      />

      <Notifications />
    </section>
  );
};

export default Top;