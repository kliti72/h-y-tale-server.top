import {
  createResource,
  createSignal,
  For,
  Show,
  Suspense
} from 'solid-js';
import { useNavigate } from '@solidjs/router'; // Aggiungi questo import
import { useAuth } from '../auth/AuthContext';
import ConfirmDeleteModal from '../component/modal/ConifrmDeleteModal';
import NotAuthenticatedNotice from '../component/template/NoAuthenticationNotice';
import { notify } from '../component/template/Notification';
import { ServerService } from '../services/server.service';
import { ServerResponse } from '../types/ServerResponse';
import StringArrayUtils from '../utils/StringArrayUtils';


export default function Panel() {
  const auth = useAuth();
  const navigate = useNavigate(); // Usa questo invece di navigation
  const [deleteModalOpen, setDeleteModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);

  // Fetch dei tuoi server
  const [myServersData, { refetch }] = createResource(
    () => auth.isAuthenticated(), // Dipendenza: rifai fetch se auth cambia
    async () => {
      if (!auth.isAuthenticated()) return null;
      
      try {
        const data = await ServerService.getMyServers();
        console.log("I tuoi server:", data);
        return data;
      } catch (error) {
        console.error("Errore caricamento server:", error);
        notify("Errore nel caricamento dei server bro!", "error");
        return null;
      }
    }
  );

  // Helper per prendere solo l'array di server
  const servers = () => myServersData()?.servers || [];

  // Delete server
  const handleConfirmDelete = async () => {
    const server = selectedServer();
    if (!server) return;

    try {
      // Chiamata API per eliminare
      await ServerService.deleteServer(server.id); // Devi implementare questo metodo
      
      notify(`Server "${server.name}" eliminato con successo! 🗑️`, "success");
      setDeleteModalOpen(false);
      setSelectedServer(null);
      
      // Ricarica la lista
      refetch();
    } catch (error) {
      console.error("Errore eliminazione:", error);
      notify("Non sono riuscito a eliminare il server fra!", "error");
    }
  };

  return (
    <div class="bg-black min-h-screen">
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
            Gestisci i tuoi regni, personalizza i dettagli e mantieni il controllo totale fra! 💪
          </p>

          <button
            onClick={() => navigate("/servers/add")}
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
              <div class="relative mb-3">
                <img
                  src={
                    auth.user()?.avatar
                      ? `https://cdn.discordapp.com/avatars/${auth.user()?.id}/${auth.user()?.avatar}.png?size=256`
                      : `https://cdn.discordapp.com/embed/avatars/0.png`
                  }
                  alt="Il tuo avatar Discord"
                  class="w-30 h-30 rounded-full object-cover border-4 border-zinc-700 shadow-lg"
                />
              </div>

              <div class="flex-1 text-center md:text-left">
                <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 mb-3">
                  {auth.user()?.global_name || auth.user()?.username}
                </h2> 
                <p class="text-xl text-violet-300/90 mb-2">@{auth.user()?.username || "username"}</p>
                <div class="flex flex-wrap gap-6 text-lg text-zinc-300 mt-6">
                  <div>
                    <span class="text-violet-400 font-bold">Server posseduti:</span> {servers().length}
                  </div>
                  <div>
                    <span class="text-violet-400 font-bold">Totale voti:</span> {servers().reduce((acc, s) => acc + (s.votes || 0), 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista server */}
          <Suspense fallback={
            <div class="text-center py-20 text-violet-400 text-2xl">
              ⏳ Caricamento dei tuoi server...
            </div>
          }>
            <Show 
              when={!myServersData.loading && servers().length > 0} 
              fallback={
                <div class="text-center py-20 text-xl text-zinc-400 bg-black/40 rounded-2xl border border-violet-900/50 p-12">
                  Non hai ancora creato nessun server bro!<br />
                  <span class="text-violet-300">Clicca sopra per aggiungere il tuo primo server! 🚀</span>
                </div>
              }
            >
              <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <For each={servers()}>
                  {(server) => (
                    <div class="
                      group relative rounded-2xl overflow-hidden
                      bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950
                      border-2 border-violet-800/50 hover:border-fuchsia-600/70
                      shadow-2xl shadow-violet-950/50 hover:shadow-fuchsia-900/70
                      transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 backdrop-blur-md
                    "
                    >
                      {/* Logo / immagine server */}
                      <div 
                        class="h-48 bg-gradient-to-br from-violet-900/40 to-black relative overflow-hidden cursor-pointer"
                            onClick={() => navigate(`/server/${server.id}`)} // Usa ID non name!
                      >
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
                          <For each={StringArrayUtils.toArray(server.tags).slice(0, 5)}>
                            {(tag) => (
                              <span class="
                                px-3 py-1 text-xs rounded-full
                                bg-violet-900/60 text-violet-200 border border-violet-700/40
                              ">
                                #{tag}
                              </span>
                            )}
                          </For>
                          <Show when={StringArrayUtils.toArray(server.tags).length > 5}>
                            <span class="text-xs text-violet-400">
                              +{StringArrayUtils.toArray(server.tags).length - 5}
                            </span>
                          </Show>
                        </div>

                        {/* Statistiche */}
                        <div class="grid grid-cols-3 gap-4 text-center text-sm mb-6">
                          <div>
                            <div class="text-emerald-400 font-bold">Online</div>
                            <div class="text-zinc-300">
                              {server.players_online ?? "?"}/{server.max_players ?? "?"}
                            </div>
                          </div>
                          <div>
                            <div class="text-fuchsia-400 font-bold">Voti</div>
                            <div class="text-zinc-300">{server.votes ?? 0}</div>
                          </div>
                          <div>
                            <div class="text-violet-400 font-bold">Ruolo</div>
                            <div class="text-zinc-300 capitalize">{server.role || "owner"}</div>
                          </div>
                        </div>

                        {/* Secret Key */}
                        <div class="mt-4 pt-4 border-t border-violet-800/40">
                          <p class="text-xs text-violet-400 mb-2 flex items-center gap-2">
                            <span>🔑</span> Secret Key (per il plugin)
                          </p>
                          <div class="flex items-center gap-2 bg-black/70 rounded-lg p-2.5 border border-violet-800/50">
                            <code class="flex-1 font-mono text-emerald-300/90 text-xs break-all select-all">
                              {server.secret_key}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(server.secret_key);
                                notify("Copiata bro! 📋", "success");
                              }}
                              class="p-1.5 rounded hover:bg-violet-900/80 transition-colors"
                            >
                              📋
                            </button>
                          </div>
                        </div>

                        {/* Pulsanti azioni */}
                        <div class="flex gap-4 mt-6"> 
                          <button
                            onClick={() => navigate(`/servers/edit/${server.id}`)} // Usa ID non name!
                            class="
                              flex-1 py-3 px-6 rounded-xl text-base font-semibold
                              bg-gradient-to-r from-violet-800 to-fuchsia-800
                              hover:from-violet-700 hover:to-fuchsia-700
                              text-white border border-violet-700/60 hover:border-violet-500/80
                              transition-all duration-300 active:scale-95 shadow-md
                            "
                          >
                            ✏️ Modifica
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
                            🗑️ Elimina
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

        {/* Modal conferma eliminazione */}
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