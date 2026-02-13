import { Component, createSignal, For, Show } from "solid-js";
import { createResource } from "solid-js";
import ServerCard from "../card/ServerCard";
import PlayersVoteModal from "../modal/PlayersVoteModal";
import HeroSection from "./hero/HeroTieatryServer";
import TertiaryHero from "./SecondaryHero";
import HeroMain from "./hero/HeroMain";

const API_URL = "http://localhost:3000";

const fetchServers = async () => {
  const res = await fetch(`${API_URL}/api/servers`);
  if (!res.ok) throw new Error("Errore nel caricamento dei server");
  return res.json();
};

const Hero: Component = () => {
  const [servers] = createResource(fetchServers);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<{ name: string; ip: string } | null>(null);

  const handleVoteRequest = (serverName: string, serverIp: string) => {
    setIsModalOpen(true);
    setSelectedServer({ name: serverName, ip: serverIp });
  };

  // Calcola rank dinamico (1 = più recente o più visualizzato in futuro) // Implementa server più votati
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
      <section class="w-full py-10 px-5" style={{ "background-color": "black" }}>
      <HeroMain />
      <TertiaryHero />


      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Classifica Hytale Servers
        </h2>

        <Show when={!servers.loading} fallback={<p class="text-center text-zinc-400">Caricamento...</p>}>
          <Show when={!servers.error} fallback={<p class="text-center text-red-400">Errore: {servers.error?.message}</p>}>
            <Show when={servers()?.length > 0} fallback={<p class="text-center text-zinc-500 py-8">Nessun server ancora...</p>}>
              <div class="flex flex-col gap-6">
                <For each={rankedServers()}>
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
          serverVoted={servers()?.name || ""}
          serverIp={servers()?.ip || ""}
          isOpen={isModalOpen()}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {
            setIsModalOpen(false);
          }}
        />
      </div>
        <HeroSection />

           <PlayersVoteModal
            isOpen={isModalOpen()}
            onClose={() => setIsModalOpen(false)}
            serverVoted={selectedServer()?.name || ''}
            serverIp={selectedServer()?.ip || ''}
          />


    </section>
    </section>
  );
};

export default Hero;