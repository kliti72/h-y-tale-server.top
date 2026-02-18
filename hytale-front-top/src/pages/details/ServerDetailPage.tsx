// src/components/ServerDetail.tsx
import { Component, createResource, createSignal, For, Show, Suspense, createMemo, onMount } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { ServerService } from '../../services/server.service';
import { ServerResponse, ServerStatus } from '../../types/ServerResponse';
import PlayersVoteModal from '../../component/modal/PlayersVoteModal';
import Notifications, { notify } from '../../component/template/Notification';
import { useAuth } from '../../auth/AuthContext';
import ShareButton from '../../component/button/ShareButton';
import SaveButton from '../../component/button/SaveButton';
import VoteButton from '../../component/button/VoteButton';
import Breadcrumb from '../../component/card/widget/Breadcrumb';
import { ServerHeaderStats } from '../../component/card/details/ServerHeaderStats';
import ServerNotFound from '../../component/card/details/ServerNotFound';
import ServerIpBox from '../../component/card/details/ServerIpBox';
import ServerInfoCard from '../../component/card/details/ServerInfoCard';
import ServerQuiLinkCard from '../../component/card/details/ServerQuickLinkCard';
import ServerContactTab from '../../component/card/ServerCard/ServerContactTab';
import ServerAdminContactCard from '../../component/card/details/ServerAdminContactCard';
import ServerRulesTable from '../../component/button/ServerRulesTable';

const ServerDetail: Component = () => {
  const params = useParams();
  const serverId = () => parseInt(params.id || '0');
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [playerGameName, setPlayerGameName] = createSignal("");
  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';
  const [server] = createResource<ServerResponse | null>(() => ServerService.getServerById(serverId()));

  const handlePlayerVote = () => {

  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white">

      {/* Hero Section */}
      <div class="relative overflow-hidden bg-black/40 border-b border-violet-900/50 backdrop-blur-sm"
        style={{
          "background-image": server()?.banner_url ? `url(${server()?.banner_url})` : "none",
          "background-color": server()?.banner_url ? "transparent" : "#1e1b4b",
          "background-size": "cover",
          "background-position": "center",
          "background-repeat": "no-repeat"
        }}>
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/70 to-black/90 pointer-events-none" />
        {/* Particelle di sfondo */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
          <div class="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
     <Show
              when={server()}
              fallback={ <ServerNotFound serverName={server()?.name ?? ''} />}>

              {(serverData) => (
                <div>

                  <Breadcrumb items={[
                    { label: "Home", href: "/" },
                    { label: "Server", href: "/servers" },
                    { label: serverData().name ?? '', isActive: true }]} />

                    <div class="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">

                      <ServerHeaderStats 
                        server={serverData()} 
                      />
             

                    {/* Actions */}
                    <div class="flex flex-col gap-3 w-full lg:w-auto">
                      
                      <VoteButton />
                      <div class="flex gap-3">
                        <SaveButton />
                        <ShareButton />
                      </div>
                      <ServerIpBox server={serverData()} />
                    </div>
                  </div>
                </div>
              )}
            </Show>
        </div>
      </div>

      {/* Contenuto principale */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense>
          <Show when={server()}>
            {(serverData) => (
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Info */}
                
                <aside class="lg:col-span-4 space-y-6">
                  <ServerRulesTable rules={serverData().rules ?? ''}/>
                  <ServerInfoCard server={serverData()} />
                  <ServerQuiLinkCard server={serverData()} />

                  {/* <ServerAdminContactCard /> */}
                </aside>
              
                  <ServerContactTab server={serverData()} />
              </div>
            )}
          </Show>
        </Suspense>
      </div>

      {/* Modal Vote */}
      <PlayersVoteModal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        server_id={server()?.id || 0}
        discord_id_user={discord_id_user}
        server_secret_key={server()?.secret_key || ""}
        server_name={server()?.name || ''}
        server_ip={server()?.ip || ''}
        player_game_name={playerGameName() ?? ''}
        onPlayerNameChange={() => setPlayerGameName("")}
        onPlayerVote={handlePlayerVote}
      />
      <Notifications />
    </div>
  );
};

export default ServerDetail;