import {
  createResource,
  createSignal,
  For,
  Show,
  Suspense
} from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../auth/AuthContext';
import ConfirmDeleteModal from '../../component/modal/ConifrmDeleteModal';
import NotAuthenticatedNotice from '../../component/template/NoAuthenticationNotice';
import { notify } from '../../component/template/Notification';
import { ServerService } from '../../services/server.service';
import { ServerResponse } from '../../types/ServerResponse';
import StringArrayUtils from '../../utils/StringArrayUtils';

export default function ManagePanelPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = createSignal(false);
  const [selectedServer, setSelectedServer] = createSignal<ServerResponse | null>(null);

  const [myServersData, { refetch }] = createResource(
    () => auth.isAuthenticated(),
    async () => {
      if (!auth.isAuthenticated()) return null;
      try {
        const data = await ServerService.getMyServers();
        return data;
      } catch (error) {
        notify("ERRORE_CARICAMENTO // riprova", "error");
        return null;
      }
    }
  );

  const servers = () => myServersData()?.servers || [];

  const handleConfirmDelete = async () => {
    const server = selectedServer();
    if (!server) return;
    try {
      await ServerService.deleteServer(server.id ?? 0);
      notify(`SERVER_DELETED // "${server.name}"`, "success");
      setDeleteModalOpen(false);
      setSelectedServer(null);
      refetch();
    } catch (error) {
      notify("DELETE_FAILED // permesso negato", "error");
    }
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
      <div class="fixed inset-0 pointer-events-none" style={{
        "z-index": "-10",
        "background-image": `linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px)`,
        "background-size": "40px 40px",
      }} />
      {/* Scanlines */}
      <div class="fixed inset-0 pointer-events-none" style={{
        "z-index": "1",
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 4px)",
      }} />

      <NotAuthenticatedNotice />

      <Show when={auth.isAuthenticated()}>
        <div class="relative z-1">

          {/* ── HERO ── */}
  
  
            
  
          </div>

          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <button
                onClick={() => navigate("/servers/add")}
                class="relative inline-flex items-center gap-3 px-8 py-3.5 text-sm font-bold text-green-400 uppercase tracking-widest border border-green-700/50 bg-green-900/20 hover:bg-green-900/35 hover:border-green-500/60 transition-all"
                style={{ "font-family": "'Share Tech Mono', monospace" }}
              >
                <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/50 pointer-events-none" />
                <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/50 pointer-events-none" />
                + DEPLOY_NEW_SERVER.exe
              </button>
              
            {/* ── USER CARD ── */}
            <div class="relative border border-green-900/30 bg-black/50 p-6 mb-10">
              <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none" />
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none" />

              <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div class="relative flex-shrink-0">
                  <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/40 pointer-events-none" />
                  <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/40 pointer-events-none" />
                  <img
                    src={
                      auth.user()?.avatar
                        ? `https://cdn.discordapp.com/avatars/${auth.user()?.id}/${auth.user()?.avatar}.png?size=256`
                        : `https://cdn.discordapp.com/embed/avatars/0.png`
                    }
                    alt="avatar"
                    class="w-20 h-20 object-cover"
                    style={{ filter: "saturate(0.7) brightness(0.85)", "box-shadow": "0 0 20px rgba(0,255,65,0.1)" }}
                  />
                </div>

                <div class="flex-1 text-center md:text-left">
                  <div class="text-green-700/45 text-xs tracking-widest mb-1">&gt; USER_AUTHENTICATED</div>
                  <h2
                    class="text-2xl font-black text-white mb-1"
                    style={{ "font-family": "'Orbitron', monospace" }}
                  >
                    {auth.user()?.global_name || auth.user()?.username}
                  </h2>
                  <div class="text-green-800/50 text-xs mb-4">@{auth.user()?.username} // ID: {auth.user()?.id?.slice(0, 8)}...</div>

                  <div
                    class="h-px mb-4"
                    style={{ background: "linear-gradient(90deg, rgba(0,255,65,0.15), transparent)" }}
                  />

                  <div class="flex flex-wrap gap-4 text-xs">
                    {[
                      { label: "SERVER_OWNED", value: servers().length },
                      { label: "TOTAL_VOTES", value: servers().reduce((acc, s) => acc + (s.votes || 0), 0) },
                    ].map((stat) => (
                      <div class="flex items-center gap-2">
                        <span class="text-green-700/45">◈</span>
                        <span class="text-green-800/60">{stat.label}:</span>
                        <span class="text-green-400 font-bold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section label */}
            <div class="flex items-center gap-3 mb-6">
              <span class="text-green-700/45 text-xs tracking-[0.25em] uppercase">// SERVER_LIST</span>
              <div class="h-px flex-1 bg-green-900/25" />
            </div>

            {/* ── SERVER LIST ── */}
            <Suspense fallback={
              <div class="text-center py-20">
                <div class="w-7 h-7 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <div class="text-xs text-green-700/50 tracking-widest animate-pulse">◎ LOADING_SERVERS...</div>
              </div>
            }>
              <Show
                when={!myServersData.loading && servers().length > 0}
                fallback={
                  <div class="relative border border-green-900/25 bg-black/40 text-center py-16 px-8">
                    <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/25 pointer-events-none" />
                    <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/25 pointer-events-none" />
                    <div class="text-3xl text-green-800/30 mb-4">?</div>
                    <div class="text-sm text-green-800/50 tracking-widest uppercase mb-2">NO_SERVERS_FOUND</div>
                    <div class="text-xs text-green-900/40 tracking-widest">
                      &gt; Clicca DEPLOY_NEW_SERVER.exe per iniziare
                    </div>
                    <br>
                    </br>
                  <br>
                  </br>

                              <button
                onClick={() => navigate("/servers/add")}
                class="relative inline-flex items-center gap-3 px-8 py-3.5 text-sm font-bold text-green-400 uppercase tracking-widest border border-green-700/50 bg-green-900/20 hover:bg-green-900/35 hover:border-green-500/60 transition-all"
                style={{ "font-family": "'Share Tech Mono', monospace" }}
              >
                <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/50 pointer-events-none" />
                <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/50 pointer-events-none" />
                + DEPLOY_NEW_SERVER.exe
              </button>
                  </div>
                }
              >
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <For each={servers()}>
                    {(server) => (
                      <div class="relative border border-green-900/30 bg-black/50 hover:border-green-700/45 transition-all group"
                        style={{ "box-shadow": "0 0 0 rgba(0,255,65,0)", transition: "box-shadow 0.3s" }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 25px rgba(0,255,65,0.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 0 rgba(0,255,65,0)"}
                      >
                        <div class="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/30 pointer-events-none z-10" />
                        <div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/30 pointer-events-none z-10" />

                        {/* Logo / banner */}
                        <div
                          class="h-36 bg-black/70 relative overflow-hidden cursor-pointer border-b border-green-900/25"
                          onClick={() => navigate(`/server/${server.id}`)}
                        >
                          <Show when={server.logo_url}>
                            <img
                              src={server.logo_url}
                              alt={server.name}
                              class="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                              style={{ filter: "saturate(0.6)" }}
                            />
                          </Show>
                          <Show when={!server.logo_url}>
                            <div class="absolute inset-0 flex items-center justify-center text-7xl font-black text-green-900/20"
                              style={{ "font-family": "'Orbitron', monospace" }}
                            >
                              {server.name?.[0]?.toUpperCase() || "?"}
                            </div>
                          </Show>
                          {/* Overlay */}
                          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                          <div class="absolute bottom-2 left-3 text-xs text-green-700/50 tracking-widest">
                            ID_{server.id}
                          </div>
                        </div>

                        <div class="p-5">
                          {/* Nome */}
                          <div
                            class="text-white font-black text-lg mb-1 truncate"
                            style={{ "font-family": "'Orbitron', monospace" }}
                          >
                            {server.name}
                          </div>

                          {/* IP */}
                          <div class="text-green-800/60 text-xs mb-3 tracking-wide">
                            &gt; {server.ip}{server.port ? `:${server.port}` : ""}
                          </div>

                          <Show when={server.description}>
                            <p class="text-green-900/55 text-xs mb-4 line-clamp-2 leading-relaxed">
                              {server.description}
                            </p>
                          </Show>

                          {/* Tags */}
                          <div class="flex flex-wrap gap-1.5 mb-4">
                            <For each={StringArrayUtils.toArray(server.tags.toString())}>
                              {(tag) => (
                                <span class="text-xs px-2 py-0.5 border border-green-900/40 text-green-800/60 tracking-wide">
                                  #{tag}
                                </span>
                              )}
                            </For>
                          </div>

                          {/* Secret key */}
                          <div
                            class="mb-4 p-3 border border-green-900/25 bg-black/40"
                            style={{ "border-top": "1px solid rgba(0,255,65,0.1)" }}
                          >
                            <div class="text-green-800/45 text-xs tracking-widest mb-1.5">&gt; SECRET_KEY</div>
                            <div class="flex items-center gap-2">
                              <code class="flex-1 text-green-600/70 text-xs break-all select-all font-mono truncate">
                                {server.secret_key}
                              </code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(server.secret_key);
                                  notify("KEY_COPIED // clipboard", "success");
                                }}
                                class="text-xs px-2 py-1 border border-green-900/40 text-green-800/50 hover:text-green-400 hover:border-green-700/50 transition-all flex-shrink-0"
                              >
                                ◈
                              </button>
                            </div>
                          </div>

                          {/* Azioni */}
                          <div class="flex gap-2">
                            <button
                              onClick={() => navigate(`/servers/edit/${server.id}`)}
                              class="flex-1 py-2.5 text-xs border border-green-800/40 text-green-600/70 hover:border-green-600/55 hover:text-green-400 transition-all tracking-widest uppercase"
                              style={{ "font-family": "'Share Tech Mono', monospace" }}
                            >
                              ✏ MODIFICA
                            </button>
                            <button
                              onClick={() => { setSelectedServer(server); setDeleteModalOpen(true); }}
                              class="flex-1 py-2.5 text-xs border border-red-900/40 text-red-700/60 hover:border-red-700/55 hover:text-red-400 transition-all tracking-widest uppercase"
                              style={{ "font-family": "'Share Tech Mono', monospace" }}
                            >
                              ⚠ DELETE
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