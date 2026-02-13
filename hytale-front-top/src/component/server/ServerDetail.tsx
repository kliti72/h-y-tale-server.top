// src/components/ServerDetail.tsx
import { Component, createResource, createSignal, For, Show, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import { ServerService } from '../../services/server.service';
import { ServerResponse } from '../../types/ServerResponse';
import PlayersVoteModal from '../modal/PlayersVoteModal';
import Notifications, { notify } from '../template/Notification';
import { useAuth } from '../../auth/AuthContext';

const ServerDetail: Component = () => {
  const params = useParams();
  const serverName = () => decodeURIComponent(params.name || '');
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const user = useAuth();
  const handleSubmit = () => {
    return;
  }

  const [server] = createResource<ServerResponse | undefined, string>(
    serverName,
    ServerService.getServerByName
  );

  const tagsArray = () => {
    const tags = server()?.tags;
    if (!tags || typeof tags !== 'string') return [];
    return tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <div class="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header / Titolo principale */}

        <div class="mb-10 flex flex-row items-center sm:items-end gap-4 sm:gap-6 justify-between">
          <div class="text-center sm:text-left">
            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              {server()?.name || serverName() || 'Server'}
            </h1>
            <p class="mt-3 text-xl text-zinc-400">
              Dettagli completi del server
            </p>
          </div>

   
          <div class='flex justify-content right'>
                  {/* Bottone grande a destra su schermi ≥ sm */}
                  <button
                    onClick={() => {
                      if (user.isAuthenticated()) {
                        setIsModalOpen(true);
                      } else {
                        notify("Devi essere loggato con Discord per votare.");
                      }
                    }}
                    class={`
                        flex items-center justify-center gap-3
                        px-8 py-4 sm:px-10 sm:py-5
                        rounded-xl text-lg sm:text-xl font-semibold
                        text-white
                        bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600
                        hover:from-indigo-500 hover:via-purple-500 hover:to-purple-600
                        shadow-lg shadow-indigo-900/30 hover:shadow-xl hover:shadow-purple-900/40
                        border border-indigo-400/40 hover:border-purple-400/50
                        active:scale-95
                        transition-all duration-300 ease-out
                        w-full sm:w-auto sm:self-end
                      `} >
                    <span class="text-2xl sm:text-3xl leading-none">♡</span>
                    Vota questo server
                  </button>
          </div>

        </div>


        <Suspense fallback={
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-6 text-lg text-zinc-400">Caricamento informazioni server...</p>
          </div>
        }>
          <Show
            when={server()}
            fallback={
              <div class="bg-zinc-900/70 border border-zinc-800 rounded-xl p-10 text-center">
                <h2 class="text-2xl font-semibold text-zinc-300 mb-4">
                  Server non trovato
                </h2>
                <p class="text-zinc-500 mb-6">
                  Il server <strong class="text-zinc-300">{serverName()}</strong> non è presente nel database.
                </p>
                <a
                  href="/"
                  class="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Torna alla lista
                </a>
              </div>
            }
          >
            {(serverData) => (
              <div class="space-y-8">
                {/* Card principale */}
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                  <div class="px-6 py-5 border-b border-zinc-800 bg-zinc-950/60">
                    <h2 class="text-2xl font-semibold text-indigo-400">
                      {serverData.name}
                    </h2>
                    <div class="mt-1 flex items-center gap-4 text-sm text-zinc-500">
                      <span>ID: {serverData().id || '—'}</span>
                      <span>•</span>
                      <span>Creato il {formatDate(serverData().created_at)}</span>
                    </div>
                  </div>

                  {/* Informazioni principali */}
                  <div class="p-6 grid gap-8 md:grid-cols-2">
                    {/* Indirizzo di connessione */}
                    <div class="space-y-2">
                      <h3 class="text-lg font-medium text-zinc-300">Indirizzo di connessione</h3>
                      <div class="flex items-center gap-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xl">
                        <span class="text-indigo-300">{serverData().ip || '—'}</span>
                        <span class="text-zinc-600">:</span>
                        <span class="text-indigo-300">{serverData().port || '—'}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div class="space-y-2">
                      <h3 class="text-lg font-medium text-zinc-300">Tags / Modalità</h3>
                      <div class="flex flex-wrap gap-2">
                        <Show when={tagsArray().length > 0} fallback={
                          <span class="text-zinc-500 italic">Nessun tag specificato</span>
                        }>
                          <For each={tagsArray()}>
                            {(tag) => (
                              <span class="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-sm border border-zinc-700">
                                {tag}
                              </span>
                            )}
                          </For>
                        </Show>
                      </div>
                    </div>
                  </div>

                  {/* Informazioni extra / footer card */}
                  <div class="px-6 py-5 border-t border-zinc-800 bg-zinc-950/40 text-sm text-zinc-500 flex justify-between items-center">
                    <div>
                      Ultimo aggiornamento: {formatDate(serverData().created_at)}
                    </div>
                    <div class="flex items-center gap-3">
                      <button class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm">
                        Copia IP
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sezione placeholder per statistiche / giocatori / descrizione futura */}
                <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <h3 class="text-xl font-semibold mb-4 text-zinc-300">
                    Informazioni aggiuntive
                  </h3>
                  <p class="text-zinc-500">
                    Qui in futuro potrai trovare:
                  </p>
                  <ul class="mt-3 space-y-2 text-zinc-400 list-disc pl-5">
                    <li>Numero di giocatori online / massimo</li>
                    <li>Versione Minecraft / modpack</li>
                    <li>Stato del server (online/offline)</li>
                    <li>Descrizione / MOTD</li>
                    <li>Recensioni e valutazioni</li>
                  </ul>
                </div>

                {/* Pulsanti azione */}
                <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <a
                    href="/"
                    class="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors text-center"
                  >
                    Torna alla lista server
                  </a>
                  <button
                    class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors text-white"
                    onClick={() => alert("Funzionalità in arrivo")}
                  >
                    Aggiungi ai preferiti
                  </button>
                </div>
              </div>
            )}
          </Show>
        </Suspense>

        <Notifications />

        <PlayersVoteModal
          serverVoted={serverName()}
          serverIp={server()?.ip}
          isOpen={isModalOpen()}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />

      </div>
    </div>
  );
};

export default ServerDetail;