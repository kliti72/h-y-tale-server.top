import {
  createResource,
  createSignal,
  For,
  Show,
  Suspense
} from 'solid-js';
import { useAuth } from '../auth/AuthContext';
import AddServerModal from "../component/modal/AddServerModal";
import EditServerModal from "../component/modal/EditServerModal";
import ConfirmDeleteModal from '../component/modal/ConifrmDeleteModal';
import NotAuthenticatedNotice from '../component/template/NoAuthenticationNotice';
import { notify } from '../component/template/Notification';

type Server = {
  id: number;
  name: string;
  ip: string;
  port: string;
  description?: string;
  logo_url?: string;
  website?: string;
  tags: string[];
  secret_key: string;
  created_at: string;
  role: string;
  owner: {
    id: string;
    username: string;
    displayName: string;
  };
  // placeholder per statistiche (puoi fetchare dopo)
  players_online?: number;
  max_players?: number;
  votes?: number;
};

type ApiResponse = {
  user: {
    id: string;
    username: string;
    displayName: string;
  };
  servers: Server[];
  count: number;
};

const fetchMyServers = async (): Promise<ApiResponse> => {
  const response = await fetch('http://localhost:3000/api/servers/mine', {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) throw new Error(`Errore ${response.status}`);
  return response.json();
};

const API_URL = "http://localhost:3000";

export default function Panel() {
  const auth = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = createSignal(false);
  const [editModalOpen, setEditModalOpen] = createSignal(false);
  const [deleteModalOpen, setDeleteModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<Server | null>(null);

  const [data, { refetch }] = createResource<ApiResponse>(fetchMyServers);

  // Aggiungi server
  const handleAddServer = async (formData: any) => {
    try {
      const res = await fetch(`${API_URL}/api/servers`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      setIsAddModalOpen(false);
      refetch();
      notify("Server aggiunto con successo! 🎉", "success");
    } catch (err: any) {
      notify(err.message || "Errore durante l'aggiunta", "error");
    }
  };

  // Update server
  const handleUpdateServer = async (updated: Partial<Server>) => {
    const server = selectedServer();
    if (!server) return;

    try {
      const res = await fetch(`${API_URL}/api/servers/${server.id}`, {
        method: "PATCH",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error(await res.text());

      setEditModalOpen(false);
      refetch();
      notify("Server aggiornato con successo!", "success");
    } catch (err: any) {
      notify(err.message || "Errore durante l'aggiornamento", "error");
    }
  };

  // Delete server
  const handleConfirmDelete = async () => {
    const server = selectedServer();
    if (!server) return;

    try {
      const res = await fetch(`${API_URL}/api/servers/${server.id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!res.ok) throw new Error(await res.text());

      setDeleteModalOpen(false);
      refetch();
      notify("Server eliminato con successo", "success");
    } catch (err: any) {
      notify(err.message || "Errore durante l'eliminazione", "error");
    }
  };

  return (
    <div class="bg-black">
      <NotAuthenticatedNotice />

      <Show when={auth.isAuthenticated()}>
        {/* Header hero */}
        <div class="relative py-16 md:py-20 px-6 text-center border-b border-violet-900/60 backdrop-blur-xl">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-fuchsia-900/10 pointer-events-none" />

          <h1 class="
            text-5xl md:text-7xl font-black tracking-tight mb-6
            text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400
            drop-shadow-2xl animate-pulse-slow
          ">
            I MIEI SERVER
          </h1>
          <p class="text-xl md:text-2xl text-violet-200/90 max-w-4xl mx-auto mb-10">
            Gestisci i tuoi regni Hytale, personalizza i dettagli, carica il logo e mantieni il controllo totale.
          </p>

          <button
            onClick={() => setIsAddModalOpen(true)}
            class="
              inline-flex items-center gap-4 px-10 py-5 rounded-2xl text-xl font-bold
              bg-gradient-to-r from-violet-700 via-fuchsia-700 to-pink-700
              hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600
              text-white shadow-2xl shadow-violet-900/60 hover:shadow-violet-800/80
              border-2 border-violet-600/60 hover:border-violet-400/80
              transition-all duration-300 active:scale-95 transform hover:-translate-y-1
            "
          >
            <span class="text-3xl">✦</span> Aggiungi Nuovo Server
          </button>
        </div>

        {/* Profilo utente + statistiche */}
        <div class="max-w-7xl mx-auto px-6 py-12">
          <div class="
            backdrop-blur-xl bg-black/50 border border-violet-800/50 rounded-2xl p-8 mb-16
            shadow-2xl shadow-violet-950/40
          ">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-800/40 to-fuchsia-800/40 flex items-center justify-center text-6xl shadow-inner overflow-hidden">
                {auth.user()?.username}
              </div>
              <div class="flex-1 text-center md:text-left">
                <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 mb-3">
                  {auth.user()?.username}
                </h2>
                <p class="text-xl text-violet-300/90 mb-2">@{auth.user()?.username || "username"}</p>
                <div class="flex flex-wrap gap-6 text-lg text-zinc-300 mt-6">
                  <div>
                    <span class="text-violet-400 font-bold">Server posseduti:</span> {data()?.count || 0}
                  </div>
                  <div>
                    <span class="text-violet-400 font-bold">Registrato il:</span> {new Date().toLocaleDateString('it-IT')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista server */}
          <Suspense fallback={<div class="text-center py-20 text-violet-400 text-2xl">Caricamento dei tuoi regni...</div>}>
            <Show when={data()?.servers?.length} fallback={
              <div class="text-center py-20 text-xl text-zinc-400 bg-black/40 rounded-2xl border border-violet-900/50 p-12">
                Non hai ancora creato nessun server.<br />
                <span class="text-violet-300">Clicca sopra per aggiungere il tuo primo regno Hytale!</span>
              </div>
            }>
              <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <For each={data()?.servers}>
                  {(server) => (
                    <div class="
                      group relative rounded-2xl overflow-hidden
                      bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950
                      border-2 border-violet-800/50 hover:border-fuchsia-600/70
                      shadow-2xl shadow-violet-950/50 hover:shadow-fuchsia-900/70
                      transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 backdrop-blur-md
                    ">
                      {/* Logo / immagine server */}
                      <div class="h-48 bg-gradient-to-br from-violet-900/40 to-black relative overflow-hidden">
                        <Show when={server.logo_url}>
                          <img
                            src={server.logo_url}
                            alt={server.name}
                            class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                        </Show>
                        <Show when={!server.logo_url}>
                          <div class="absolute inset-0 flex items-center justify-center text-8xl opacity-30">
                            {server.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        </Show>
                      </div>

                      <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                          <h3 class="
                            text-2xl font-black text-transparent bg-clip-text
                            bg-gradient-to-r from-fuchsia-300 to-violet-300 group-hover:from-fuchsia-200 group-hover:to-violet-200
                            transition-all
                          ">
                            {server.name}
                          </h3>
                          <span class="
                            px-4 py-1 text-xs font-bold rounded-full
                            bg-emerald-900/70 text-emerald-300 border border-emerald-700/50
                          ">
                            {server.role.toUpperCase()}
                          </span>
                        </div>

                        <p class="font-mono text-violet-300 mb-3">
                          {server.ip}:{server.port}
                        </p>

                        <Show when={server.description}>
                          <p class="text-zinc-300 text-sm mb-5 line-clamp-3">
                            {server.description}
                          </p>
                        </Show>

                        {/* Tags */}
                        <div class="flex flex-wrap gap-2 mb-6">
                          <For each={server.tags.slice(0, 5)}>
                            {(tag) => (
                              <span class="
                                px-3 py-1 text-xs rounded-full
                                bg-violet-900/60 text-violet-200 border border-violet-700/40
                              ">
                                {tag}
                              </span>
                            )}
                          </For>
                          <Show when={server.tags.length > 5}>
                            <span class="text-xs text-violet-400">+{server.tags.length - 5}</span>
                          </Show>
                        </div>

                        {/* Statistiche placeholder */}
                        <div class="grid grid-cols-3 gap-4 text-center text-sm mb-6">
                          <div>
                            <div class="text-emerald-400 font-bold">Giocatori</div>
                            <div>{server.players_online ?? "?"} / {server.max_players ?? "?"}</div>
                          </div>
                          <div>
                            <div class="text-fuchsia-400 font-bold">Voti</div>
                            <div>{server.votes ?? 0}</div>
                          </div>
                          <div>
                            <div class="text-violet-400 font-bold">Creato</div>
                            <div>{new Date(server.created_at).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })}</div>
                          </div>
                        </div>

                        <div class="mt-4 pt-4 border-t border-violet-800/40 m-2">
                          <p class="text-xs text-violet-400 mb-2 flex items-center gap-2 ">
                            <span>🔑 Secret Key (per il plugin)</span>
                          </p>
                          <div class="flex items-center gap-2 bg-black/70 rounded-lg p-2.5 border border-violet-800/50">
                            <code class="flex-1 font-mono text-emerald-300/90 text-xs break-all select-all">
                              {server.secret_key}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(server.secret_key);
                                notify("Copiata!", "success");
                              }}
                              class="p-1.5 rounded hover:bg-violet-900/80 transition-colors"
                            >
                              📋
                            </button>
                          </div>
                        </div>

                        {/* Pulsanti azioni */}
                        <div class="flex gap-4">
                          <button
                            onClick={() => {
                              setSelectedServer(server);
                              setEditModalOpen(true);
                            }}
                            class="
                              flex-1 py-3 px-6 rounded-xl text-base font-semibold
                              bg-gradient-to-r from-violet-800 to-fuchsia-800
                              hover:from-violet-700 hover:to-fuchsia-700
                              text-white border border-violet-700/60 hover:border-violet-500/80
                              transition-all duration-300 active:scale-95 shadow-md
                            "
                          >
                            Modifica
                          </button>

                          <button
                            onClick={() => {
                              setSelectedServer(server);
                              setDeleteModalOpen(true);
                            }}
                            class="
                              flex-1 py-3 px-6 rounded-xl text-base font-semibold
                              bg-gradient-to-r from-red-900 to-rose-900
                              hover:from-red-800 hover:to-rose-800
                              text-red-200 border border-red-800/60 hover:border-red-600/80
                              transition-all duration-300 active:scale-95 shadow-md
                            "
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Suspense>
        </div>

        {/* Modali */}
        <AddServerModal
          isOpen={isAddModalOpen()}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddServer}
        />

        <EditServerModal
          isOpen={editModalOpen()}
          server={selectedServer()}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleUpdateServer}
        />

        <ConfirmDeleteModal
          isOpen={deleteModalOpen()}
          serverName={selectedServer()?.name || ""}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Show>
    </div>
  );
}