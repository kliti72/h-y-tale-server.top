// ServerBoard.tsx
import { Component, createSignal, For, Show } from "solid-js";
import AddServerModal from "./AddServerModal";
import { createResource } from "solid-js";
import { useAuth } from "../auth/AuthContext";

const API_URL = "http://localhost:3000";

const fetchServers = async () => {
  const res = await fetch(`${API_URL}/api/servers`);
  if (!res.ok) throw new Error("Errore nel caricamento dei server");
  return res.json();
};

const ServerBoard: Component = () => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [servers, { refetch }] = createResource(fetchServers);
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  const handleSubmit = async (data: { name: string; ip: string; port: string; tags: string[] }) => {
    try {
      const response = await fetch(`${API_URL}/api/servers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore ${response.status}: ${errorText}`);
      }

      await response.json();
      setIsModalOpen(false);
      refetch(); // ricarica la lista
      alert("Server aggiunto con successo! 🎉");
    } catch (err) {
      console.error("Errore aggiunta:", err);
      alert("Impossibile aggiungere il server.\n" + (err.message || "Errore sconosciuto"));
    }
  };

  // Calcola rank dinamico (1 = più recente o più visualizzato in futuro)
  const rankedServers = () => {
    const list = servers() || [];
    return list.map((s, i) => ({
      ...s,
      rank: i + 1,
      isNew: new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // ultimi 7 giorni
    }));
  };

  return (
    <section class="w-full py-10 px-5">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Classifica Hytale Servers
        </h2>

        <Show when={isAuthenticated}>
        {/* Pulsante Aggiungi - stile coerente */}
        <div class="text-center mb-10">
          <button
            onClick={() => setIsModalOpen(true)}
            class="
              flex items-center justify-center gap-2 mx-auto
              px-7 py-3.5 rounded-xl text-base sm:text-lg font-semibold
              text-emerald-50 bg-gradient-to-r from-emerald-700/80 to-teal-700/70
              border border-emerald-600/60
              hover:from-emerald-600/90 hover:to-teal-600/80
              hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-900/40
              active:scale-[0.98] transition-all duration-200
            "
          >
            <span class="text-xl leading-none">⊕</span>
            Aggiungi il tuo Server
          </button>
        </div>
        </Show>

        {/* Loading / Error / Lista */}
        <Show when={!servers.loading} fallback={<p class="text-center text-zinc-400">Caricamento server...</p>}>
          <Show when={servers.error}>
            <p class="text-center text-red-400 mb-6">
              Errore: {servers.error?.message || "Impossibile caricare i server"}
            </p>
          </Show>

          <Show when={servers() && servers().length > 0} fallback={
            <p class="text-center text-zinc-500 py-8">
              Nessun server aggiunto ancora. Sii il primo! 🚀
            </p>
          }>
            <div class="flex flex-col gap-5">
              <For each={rankedServers()}>
                {(server) => {
                  const isTop3 = server.rank <= 3;

                  return (
                    <div
                      class={`
                        rounded-xl bg-zinc-900/70 border border-zinc-700/60
                        p-5 transition-all duration-200
                        hover:bg-zinc-800/80 hover:border-zinc-500/70
                        ${isTop3 ? "border-l-4" : "border-l border-l-zinc-600/50"}
                        ${server.rank === 1 ? "border-l-amber-500" :
                          server.rank === 2 ? "border-l-emerald-500" :
                          server.rank === 3 ? "border-l-cyan-500" : ""}
                      `}
                    >
                      <div class="flex items-center gap-4 mb-4">
                        <div class={`
                          min-w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                          ${server.rank === 1 ? "bg-amber-600 text-amber-100" :
                            server.rank === 2 ? "bg-emerald-600 text-emerald-100" :
                            server.rank === 3 ? "bg-cyan-600 text-cyan-100" :
                            "bg-zinc-700 text-zinc-300"}
                        `}>
                          #{server.rank}
                        </div>

                        <h3 class="text-xl md:text-2xl font-semibold text-white truncate">
                          {server.name}
                        </h3>
                      </div>

                      {/* Info principali (adattate ai dati reali) */}
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-sm">
                        <div class="text-zinc-400">Indirizzo</div>
                        <div class="text-right font-medium text-white">
                          {server.ip}:{server.port}
                        </div>

                        <div class="text-zinc-400">Tag</div>
                        <div class="text-right font-medium text-emerald-300">
                          {server.tags?.length || 0}
                        </div>

                        <div class="text-zinc-400">Aggiunto</div>
                        <div class="text-right font-medium text-cyan-300">
                          {new Date(server.created_at).toLocaleDateString("it-IT")}
                        </div>

                        {/* placeholder per metriche future */}
                        <div class="text-zinc-400">Online</div>
                        <div class="text-right font-medium text-white">?</div>
                      </div>

                      {/* Tags + Badge */}
                      <div class="mt-4 flex flex-wrap gap-2">
                        <For each={server.tags}>
                          {(tag) => (
                            <span class="px-3 py-1 text-xs rounded-full bg-zinc-800/70 text-zinc-300 border border-zinc-700">
                              {tag}
                            </span>
                          )}
                        </For>

                        {server.isNew && (
                          <span class="px-3 py-1 text-xs rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-700/40">
                            ✨ New
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </Show>

        <AddServerModal
          isOpen={isModalOpen()}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default ServerBoard;