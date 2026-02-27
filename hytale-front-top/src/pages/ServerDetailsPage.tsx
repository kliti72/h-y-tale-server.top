import { Component, createResource, createSignal, Show, Suspense, onMount, onCleanup } from 'solid-js';
import { useParams } from '@solidjs/router';
import { useAuth } from '../auth/AuthContext';
import { ServerService } from '../services/server.service';
import { VoteService } from '../services/votes.service';
import { ServerResponse } from '../types/ServerResponse';
import PlayersVoteModal from '../component/modal/PlayersVoteModal';
import Notifications, { notify, requireDiscordLogin } from '../component/notify/NotificationComponent';

import { GameServerHeaderComponent } from '../component/card/GameServerHeaderComponent';
import GameServerAddressBoxComponent from '../component/card/GameServerAddressBoxComponent';
import GameServerCardRules from '../component/card/GameServerCardRules';
import VoteButtonComponent from '../component/button/VoteButtonComponent';
import GameServerDescriptionComponent from '../component/card/GameServerDescriptionComponent';

const ServerDetailsPage: Component = () => {
  const params = useParams();
  const auth = useAuth();
  const serverId = () => parseInt(params.id || '0');

  const [modalOpen, setModalOpen] = createSignal(false);
  const [playerName, setPlayerName] = createSignal("");
  const [selected, setSelected] = createSignal<ServerResponse | null>(null);
  const [timedOut, setTimedOut] = createSignal(false);

  const [server, { refetch }] = createResource<ServerResponse | null>(() => ServerService.getServerById(serverId()));

  onMount(() => {
    const t = setTimeout(() => setTimedOut(true), 10000);
    onCleanup(() => clearTimeout(t));
  });

  const handleVote = (s: ServerResponse) => {
    if (!auth.isAuthenticated()) { requireDiscordLogin(); return; }
    setSelected(s); setModalOpen(true);
  };

  const handlePlayerVote = () => {
    VoteService.addVote(auth.user()?.id ?? '', selected()?.id ?? 0, playerName()).then(res => {
      notify(res.message);
      if (res.success) { refetch(); setModalOpen(false); }
    });
  };

  return (
    <div class="min-h-screen bg-stone-950 text-stone-300">

      {/* Hero Banner */}
      <div
        class="relative border-b-2 border-amber-900/40 overflow-hidden"
        style={{
          "background-image": server()?.banner_url ? `url(${server()?.banner_url})` : "none",
          "background-size": "cover", "background-position": "center", "min-height": "260px"
        }}
      >
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/50" />
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

          <Show when={server.loading && !timedOut()}>
            <div class="flex items-center justify-center py-16 gap-3 text-amber-800 font-serif">
              <div class="w-5 h-5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
              Caricamento...
            </div>
          </Show>

          <Show when={(timedOut() && server.loading) || (!server.loading && server.error)}>
            <a> Server not found </a>
          </Show>

          <Show when={!server.loading && !server.error && server()}>
            {(s) => (
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <div class="h-px flex-1 bg-amber-900/30" />
                  <span class="text-amber-800 text-xs font-serif uppercase tracking-widest">⚔ Server #{serverId()}</span>
                  <div class="h-px flex-1 bg-amber-900/30" />
                </div>

                <div class="flex flex-col lg:flex-row items-start justify-between gap-3 mt-4 mb-6">
                  <GameServerHeaderComponent server={s()} />
                <VoteButtonComponent server={s()} onVoteRequest={handleVote} />

                </div>
                  <GameServerAddressBoxComponent server={s()} />

              </div>
            )}
          </Show>
        </div>
      </div>

      {/* Main content */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Suspense>
          <Show when={server()}>
            {(s) => (
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

                <aside class="lg:col-span-4 space-y-4">
                  <StoneBox><GameServerCardRules rules={s().rules ?? ''} /></StoneBox>
                </aside>

                <div class="lg:col-span-8">
                  <GameServerDescriptionComponent server={s()} />
                </div>

              </div>
            )}
          </Show>
        </Suspense>
      </div>

      <PlayersVoteModal
        isOpen={modalOpen()} onClose={() => setModalOpen(false)}
        server_id={selected()?.id || 0} discord_id_user={auth.user()?.id ?? ''}
        server_secret_key={selected()?.secret_key || ''} server_name={selected()?.name || ''}
        server_ip={selected()?.ip || ''} player_game_name={playerName()}
        onPlayerNameChange={setPlayerName} 
        onPlayerVote={handlePlayerVote}
      />
      <Notifications />
    </div>
  );
};

const StoneBox = (props: { children: any }) => (
  <div class="relative border border-stone-700 bg-stone-900">
    <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-800/60" />
    <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-800/60" />
    {props.children}
  </div>
);

const SectionLabel = (props: { label: string }) => (
  <div class="flex items-center gap-3 mb-3">
    <span class="text-amber-800 text-xs font-serif uppercase tracking-widest">{props.label}</span>
    <div class="h-px flex-1 bg-amber-900/30" />
  </div>
);

export default ServerDetailsPage;