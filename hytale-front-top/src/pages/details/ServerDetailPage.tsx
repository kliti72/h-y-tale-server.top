// src/components/ServerDetail.tsx
import { Component, createResource, createSignal, For, Show, Suspense, createMemo, onMount } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { ServerService } from '../../services/server.service';
import { ServerResponse, ServerStatus } from '../../types/ServerResponse';
import PlayersVoteModal from '../../component/modal/PlayersVoteModal';
import Notifications, { notify, requireDiscordLogin } from '../../component/template/Notification';
import { useAuth } from '../../auth/AuthContext';
import ShareButton from '../../component/button/ShareButton';
import SaveButton from '../../component/button/SaveButton';
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
  const auth = useAuth();
  const discord_id_user = auth.user()?.id ?? '';
  const [server] = createResource<ServerResponse | null>(() => ServerService.getServerById(serverId()));
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);

 const handleVoteRequest = (server: ServerResponse) => {
    if (!auth.isAuthenticated()) {
      requireDiscordLogin();
      return;
    }
    setIsModalOpen(true);
    setSelectedServer(server);
    console.log("Modale aperto per", server);
  };
  

   const handlePlayerVote = () => {
      const voteRes = VoteService.addVote(discord_id_user, selectedServer()?.id ?? 0, playerGameName() ?? '');
      if (voteRes != null) {
        notify(`Complimenti ${playerGameName()} hai votato correttamente ${selectedServer()?.name}`);
      }
      console.log("Voto registrato")
      setIsModalOpen(false);
    }
  
  

  return (
<div
  class="min-h-screen text-white"
  style={{
    background: `
      radial-gradient(ellipse at 20% 20%, rgba(15,25,50,0.9) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 80%, rgba(10,18,35,0.9) 0%, transparent 60%),
      radial-gradient(ellipse at 50% 0%, rgba(30,50,90,0.4) 0%, transparent 50%),
      linear-gradient(160deg, #06080f 0%, #080c18 40%, #060810 70%, #07090e 100%)
    `,
    "background-color": "#06080f",
  }}
>
  {/* Stone texture + rune overlay */}
  <div
    class="fixed inset-0 pointer-events-none"
    style={{ "z-index": "0" }}
  >
    {/* Noise / pietra grezza */}
    <div class="absolute inset-0" style={{
      "background-image": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
      opacity: "1",
    }} />

    {/* Vignette bordi scuri */}
    <div class="absolute inset-0" style={{
      background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(3,5,10,0.85) 100%)",
    }} />

    {/* Rune pattern subtile in diagonale */}
    <div class="absolute inset-0" style={{
      "background-image": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ctext x='10' y='40' font-size='18' fill='rgba(80,120,200,0.04)' font-family='serif'%3Eᚠ%3C/text%3E%3Ctext x='60' y='80' font-size='14' fill='rgba(80,120,200,0.03)' font-family='serif'%3Eᛟ%3C/text%3E%3Ctext x='20' y='110' font-size='16' fill='rgba(80,120,200,0.025)' font-family='serif'%3Eᚹ%3C/text%3E%3Ctext x='80' y='20' font-size='12' fill='rgba(80,120,200,0.03)' font-family='serif'%3Eᚱ%3C/text%3E%3C/svg%3E")`,
      "background-size": "120px 120px",
    }} />

    {/* Luce centrale sottile dall'alto tipo finestra gotica */}
    <div class="absolute inset-0" style={{
      background: "radial-gradient(ellipse 40% 30% at 50% 0%, rgba(60,100,200,0.06) 0%, transparent 100%)",
    }} />
  </div>

  {/* Il tuo contenuto va qui — assicurati che abbia relative z-10 */}
      {/* Hero Section */}
      <div class="relative overflow-hidden bg-black/40 border-b border-violet-900/50 backdrop-blur-sm "
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
          <div class="absolute w-96 h-96 bg-whuite-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
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

                      <ServerCardStatus 
                        server={serverData()} 
                      />
             

                    {/* Actions */}
                    <div class="flex flex-col gap-3 w-full lg:w-auto">
                      
                    <VoteButton server={serverData()} onVoteRequest={handleVoteRequest} />
                        <ShareButton server={serverData()} />

                    </div>
                  </div>
                      <ServerIpBox server={serverData()} />
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