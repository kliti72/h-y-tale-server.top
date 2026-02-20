import { Component, createSignal, For, Show } from "solid-js";
import { createResource } from "solid-js";
import PlayersVoteModal from "../component/modal/PlayersVoteModal";
import HeroSection from "../component/hero/HeroTieatryServer";
import TertiaryHero from "../component/hero/SecondaryHero";
import HeroMain from "../component/hero/HeroMain";
import { ServerService } from "../services/server.service";
import Notifications, { notify, requireDiscordLogin } from "../component/template/Notification";
import { ServerResponse } from "../types/ServerResponse";
import { VoteService } from "../services/votes.service";
import { useAuth } from "../auth/AuthContext";
import GamingCard from "../component/card/ServerCard/GamingCard";
import ServerCardHacking from "../component/card/ServerCard/ServerCardHacking";


const HomePage: Component = () => {

  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';

  const [refreshTrigger, setRefreshTrigger] = createSignal(0);
  const [servers] = createResource(refreshTrigger, () => ServerService.getServers());

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);
  const [playerGameName, setPlayerGameName] = createSignal<string>();

  const handleVoteRequest = (server: ServerResponse) => {

    if (!auth.isAuthenticated()) {
      requireDiscordLogin()
    }

    setIsModalOpen(true);
    setSelectedServer(server);
  };

  const handlePlayerVote = () => {

    const voteRes = VoteService.addVote(discord_id_user, selectedServer()?.id ?? 0, playerGameName() ?? '');

    if (voteRes != null) {
      notify(`Complimenti ${playerGameName()} hai votato correttamente ${selectedServer()?.name}`);
      setRefreshTrigger(prev => prev + 1);
    }

    setIsModalOpen(false);

  }

  const serverData = () => servers()?.data ?? [];
  const serverCount = () => servers()?.count ?? 0;

  return (
    <section>
      <section class="w-full py-10 px-5" style={{ "background-color": "black" }}>
        <HeroMain />
        <TertiaryHero />


        <div class="max-w-4xl mx-auto" id="board">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
            Classifica Hytale Servers
          </h2>

          <Show when={!servers.loading} fallback={<p class="text-center text-zinc-400">Caricamento...</p>}>
            <Show when={!servers.error} fallback={<p class="text-center text-red-400">Errore: {servers.error?.message}</p>}>
              <Show when={serverCount() > 0} fallback={<p class="text-center text-zinc-500 py-8">Nessun server ancora...</p>}>
                <div class="flex flex-col gap-6">
                  <For each={serverData() ?? []}>
                    {(server) => <ServerCardHacking server={server} onVoteRequest={handleVoteRequest} />}
                  </For>
                </div>
              </Show>
            </Show>
          </Show>


        </div>
        <HeroSection />

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
    </section>
  );
};

export default HomePage;