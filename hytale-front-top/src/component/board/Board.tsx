import { Component, createSignal, For, Show } from "solid-js";
import { createResource } from "solid-js";
import ServerCard from "../card/ServerCard";
import PlayersVoteModal from "../modal/PlayersVoteModal";
import HeroSection from "./hero/HeroTieatryServer";
import HeroBoard from "./hero/HeroBoard";
import Notifications from "../template/Notification";

const API_URL = "http://localhost:3000";

const fetchServers = async () => {
  const res = await fetch(`${API_URL}/api/servers`);
  if (!res.ok) throw new Error("Errore nel caricamento dei server");
  return res.json();
};

const Board: Component = () => {
  const [servers] = createResource(fetchServers);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const [selectedServer, setSelectedServer] = createSignal<{ name: string; ip: string } | null>(null);

  const handleVoteRequest = (serverName: string, serverIp: string) => {
    setIsModalOpen(true);
    setSelectedServer({ name: serverName, ip: serverIp });
  };

  const rankedServers = () => {
    const list = servers() || [];
    return list.map((s: { created_at: string | number | Date; }, i: number) => ({
      ...s,
      rank: i + 1,
      isNew: new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // ultimi 7 giorni
    }));
  };

  return (
    <section>
      <HeroBoard />
      <section
        class="w-full py-10 px-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #000000, #0f2f1f 40%, #001a14 80%, #000000)",
        }}
      >
        <div class="max-w-4xl mx-auto">
          <Show when={!servers.loading} fallback={<p class="text-center text-zinc-400">Caricamento...</p>}>
            <Show when={!servers.error} fallback={<p class="text-center text-red-400">Errore: {servers.error?.message}</p>}>
              <Show when={servers()?.length > 0} fallback={<p class="text-center text-zinc-500 py-8">Nessun server ancora...</p>}>
                <div class="flex flex-col gap-6">
                  <For each={servers()}>
                    {(server) => (
                      <ServerCard
                        server={server}
                        onVoteRequest={handleVoteRequest}
                      />
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </Show>


          <PlayersVoteModal
            isOpen={isModalOpen()}
            onClose={() => setIsModalOpen(false)}
            serverVoted={selectedServer()?.name || ''}
            serverIp={selectedServer()?.ip || ''}
          />

        </div>
        <Notifications />


      </section>
      <HeroSection />

    </section>
  );
};

export default Board;