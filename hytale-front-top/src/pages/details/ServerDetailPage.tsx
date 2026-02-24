import { Component, createResource, createSignal, Show, Suspense, onMount, onCleanup } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { ServerService } from '../../services/server.service';
import { ServerResponse } from '../../types/ServerResponse';
import PlayersVoteModal from '../../component/modal/PlayersVoteModal';
import Notifications, { notify, requireDiscordLogin } from '../../component/template/Notification';
import { useAuth } from '../../auth/AuthContext';
import ShareButton from '../../component/button/ShareButton';
import VoteButton from '../../component/button/VoteButton';
import Breadcrumb from '../../component/card/widget/Breadcrumb';
import { ServerCardStatus } from '../../component/card/details/ServerCardStatus';
import ServerNotFound from '../../component/card/details/ServerNotFound';
import ServerIpBox from '../../component/card/details/ServerIpBox';
import ServerInfoCard from '../../component/card/details/ServerInfoCard';
import ServerQuiLinkCard from '../../component/card/details/ServerQuickLinkCard';
import ServerContactTab from '../../component/card/ServerCard/ServerContactTab';
import ServerRulesTable from '../../component/button/ServerRulesTable';
import { VoteService } from '../../services/votes.service';

const ServerDetail: Component = () => {
  const params = useParams();
  const serverId = () => parseInt(params.id || '0');
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [playerGameName, setPlayerGameName] = createSignal("");
  const [timedOut, setTimedOut] = createSignal(false);
  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';
  const [server, { refetch }] = createResource<ServerResponse | null>(() => ServerService.getServerById(serverId()));
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);

  onMount(() => {
    const t = setTimeout(() => setTimedOut(true), 10000);
    onCleanup(() => clearTimeout(t));
  });

  const handleVoteRequest = (server: ServerResponse) => {
    if (!auth.isAuthenticated()) { requireDiscordLogin(); return; }
    setIsModalOpen(true);
    setSelectedServer(server);
  };

  const handlePlayerVote = () => {
      const voteRes = VoteService.addVote(discord_id_user, selectedServer()?.id ?? 0, playerGameName() ?? '');
      voteRes.then((res) => {
        if(res.success) {
          notify(res.message);
          refetch();
          setIsModalOpen(false);
        } else {
          notify(res.message);
        }
      })
      
  };


  return (
    <div
      class="min-h-screen text-white"
      style={{
        background: "linear-gradient(160deg, #000300 0%, #000a02 40%, #000500 100%)",
        "font-family": "'Share Tech Mono', monospace",
      }}
    >
      {/* Grid bg */}
      <div
        class="fixed inset-0 pointer-events-none"
        style={{
          "z-index": "0",
          "background-image": `
            linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px)
          `,
          "background-size": "40px 40px",
        }}
      />
      {/* Scanlines */}
      <div
        class="fixed inset-0 pointer-events-none"
        style={{
          "z-index": "1",
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 4px)",
        }}
      />
      {/* Glow top */}
      <div
        class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-48 pointer-events-none"
        style={{
          "z-index": "0",
          background: "radial-gradient(ellipse, rgba(0,255,65,0.05) 0%, transparent 70%)",
        }}
      />

      {/* ── HERO BANNER ── */}
      <div
        class="relative overflow-hidden border-b border-green-900/30"
        style={{
          "background-image": server()?.banner_url ? `url(${server()?.banner_url})` : "none",
          "background-color": "#000500",
          "background-size": "cover",
          "background-position": "center",
          "min-height": "280px",
        }}
      >
        {/* Banner overlay */}
        <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50 pointer-events-none" />
        {/* Green tint overlay per coerenza stile */}
        <div
          class="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,65,0.04) 0%, transparent 70%)" }}
        />

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Loading state */}
          <Show when={server.loading && !timedOut()}>
            <div class="flex flex-col items-center justify-center py-16 gap-4">
              <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span class="text-xs text-green-700/60 tracking-widest animate-pulse">
                &gt; LOADING_SERVER_DATA...
              </span>
            </div>
          </Show>

          {/* Timeout / not found */}
          <Show when={timedOut() && server.loading}>
            <ServerNotFound serverName="" />
          </Show>

          {/* Error */}
          <Show when={!server.loading && server.error}>
            <ServerNotFound serverName="" />
          </Show>

          {/* Content */}
          <Show when={!server.loading && !server.error && server()}>
            {(serverData) => (
              <div>
                {/* Top status bar */}
                <div class="flex items-center gap-2 mb-6">
                  <div class="h-px flex-1 bg-gradient-to-r from-transparent to-green-900/40" />
                  <span class="text-green-700/40 text-xs tracking-[0.25em] uppercase">
                    &gt; SERVER_DETAIL // ID_{serverId()}
                  </span>
                  <div class="h-px flex-1 bg-gradient-to-l from-transparent to-green-900/40" />
                </div>

                <Breadcrumb items={[
                  { label: "Home", href: "/" },
                  { label: "Server", href: "/servers" },
                  { label: serverData().name ?? '', isActive: true },
                ]} />

                <div class="flex flex-col lg:flex-row items-start justify-between gap-3 mt-4 mb-8">
                  <ServerCardStatus server={serverData()} />
                  <ServerIpBox server={serverData()} />
                  {/* Actions */}
                </div>
                <VoteButton server={serverData()} onVoteRequest={handleVoteRequest}/>
              </div>
            )}
          </Show>

        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense>
          <Show when={server()}>
            {(serverData) => (
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Sidebar */}
                <aside class="lg:col-span-4 space-y-6">

                  {/* Section label */}
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-green-700/40 text-xs tracking-[0.25em] uppercase">// INFO_PANEL</span>
                    <div class="h-px flex-1 bg-green-900/30" />
                  </div>

                  {/* Cards con bordo hacker */}
                  <div class="relative border border-green-900/30 bg-black/40 p-px">
                    <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />
                    <ServerRulesTable rules={serverData().rules ?? ''} />
                  </div>

                  <div class="relative border border-green-900/30 bg-black/40 p-px">
                    <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />
                    <ServerInfoCard server={serverData()} />
                  </div>

                  <div class="relative border border-green-900/30 bg-black/40 p-px">
                    <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />
                    <ServerQuiLinkCard server={serverData()} />
                  </div>

                </aside>

                {/* Main tab */}
                <div class="lg:col-span-8">
                  <div class="flex items-center gap-2 mb-6">
                    <span class="text-green-700/40 text-xs tracking-[0.25em] uppercase">// CONTACT_TAB</span>
                    <div class="h-px flex-1 bg-green-900/30" />
                  </div>
                  <div class="relative border border-green-900/30 bg-black/40 p-px">
                    <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />
                    <ServerContactTab server={serverData()} />
                  </div>
                </div>

              </div>
            )}
          </Show>
        </Suspense>
      </div>

      {/* Modals */}
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
    </div>
  );
};

export default ServerDetail;