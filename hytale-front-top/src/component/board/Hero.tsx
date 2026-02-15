import { Component, createSignal, For, Show } from "solid-js";
import { createResource } from "solid-js";
import ServerCard from "../card/ServerCard";
import PlayersVoteModal from "../modal/PlayersVoteModal";
import HeroSection from "./hero/HeroTieatryServer";
import TertiaryHero from "./SecondaryHero";
import HeroMain from "./hero/HeroMain";
import { ServerService } from "../../services/server.service";
import Notifications from "../template/Notification";


const Hero: Component = () => {
  const [servers] = createResource(ServerService.getServers);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<{ name: string; server_id : number, ip: string } | null>(null);

  const handleVoteRequest = (serverName: string, server_id: number, serverIp: string) => {
    setIsModalOpen(true);
    setSelectedServer({ name: serverName, server_id: server_id, ip: serverIp});
  };

  const serverData = () => servers()?.data ?? [];
  const serverCount = () => servers()?.count ?? 0;

  return (
    <section>
      <section class="w-full py-10 px-5" style={{ "background-color": "black" }}>
      <HeroMain />
      <TertiaryHero />


      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Classifica Hytale Servers
        </h2>

        <Show when={!servers.loading} fallback={<p class="text-center text-zinc-400">Caricamento...</p>}>
          <Show when={!servers.error} fallback={<p class="text-center text-red-400">Errore: {servers.error?.message}</p>}>
            <Show when={serverCount() > 0} fallback={<p class="text-center text-zinc-500 py-8">Nessun server ancora...</p>}>
              <div class="flex flex-col gap-6">
                <For each={serverData() ?? []}>
                  {(server) => <ServerCard server={server} onVoteRequest={handleVoteRequest} />}
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
            server_id={selectedServer()?.server_id || 0}
            serverVoted={selectedServer()?.name || ''}
            serverIp={selectedServer()?.ip || ''}
          />

          <Notifications />

    </section>
    </section>
  );
};

export default Hero;