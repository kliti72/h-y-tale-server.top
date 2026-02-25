import { createResource, createSignal, For, Show, Suspense } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../auth/AuthContext';
import { ServerResponse } from '../types/ServerResponse';
import { ServerService } from '../services/server.service';
import { notify } from '../component/notify/NotificationComponent';
import NoAuth from '../component/error/NoAuth';
import UtilsStringArray from '../utils/UtilsStringArray';
import DeleteModal from '../component/modal/DeleteModal';

const StoneBox = (props: { children: any; class?: string }) => (
  <div class={`relative border border-stone-700 bg-stone-900 ${props.class ?? ""}`}>
    <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-800/60" />
    <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-800/60" />
    {props.children}
  </div>
);

export default function ManagePanelPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = createSignal(false);
  const [selected, setSelected] = createSignal<ServerResponse | null>(null);

  const [data, { refetch }] = createResource(
    () => auth.isAuthenticated(),
    async () => {
      if (!auth.isAuthenticated()) return null;
      try { return await ServerService.getMyServers(); }
      catch { notify("Errore caricamento", "error"); return null; }
    }
  );

  const servers = () => data()?.servers ?? [];

  const handleDelete = async () => {
    const s = selected();
    if (!s) return;
    try {
      await ServerService.deleteServer(s.id ?? 0);
      notify(`"${s.name}" eliminato`, "success");
      setDeleteModalOpen(false);
      setSelected(null);
      refetch();
    } catch { notify("Errore eliminazione", "error"); }
  };

  const AddBtn = () => (
    <button
      onClick={() => navigate("/servers/add")}
      class="relative inline-flex items-center gap-2 px-6 py-2.5 border border-amber-800/60 bg-amber-950/20 hover:bg-amber-900/30 text-amber-500 hover:text-amber-400 font-serif text-sm uppercase tracking-widest transition-all"
    >
      <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-700" />
      <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-700" />
      + Aggiungi server
    </button>
  );

  return (
    <div class="min-h-screen bg-stone-950 text-stone-300">
      <NoAuth />

      <Show when={auth.isAuthenticated()}>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* User card */}
          <StoneBox class="p-6">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-5">
              <img
                src={auth.user()?.avatar
                  ? `https://cdn.discordapp.com/avatars/${auth.user()?.id}/${auth.user()?.avatar}.png?size=256`
                  : `https://cdn.discordapp.com/embed/avatars/0.png`}
                alt="avatar" class="w-16 h-16 border border-stone-700 object-cover"
              />
              <div class="flex-1 text-center md:text-left">
                <p class="font-serif font-black text-xl text-amber-400">{auth.user()?.global_name || auth.user()?.username}</p>
                <p class="text-stone-600 font-serif text-xs mb-3">@{auth.user()?.username} · ID: {auth.user()?.id?.slice(0, 8)}...</p>
                <div class="flex flex-wrap gap-4 text-xs font-serif">
                  <span class="text-stone-500">⚔ Server: <strong class="text-amber-500">{servers().length}</strong></span>
                  <span class="text-stone-500">👑 Voti totali: <strong class="text-amber-500">{servers().reduce((a, s) => a + (s.votes || 0), 0)}</strong></span>
                </div>
              </div>
              <AddBtn />
            </div>
          </StoneBox>

          {/* Server list */}
          <div>
            <div class="flex items-center gap-3 mb-5">
              <span class="text-amber-800 text-xs font-serif uppercase tracking-widest">🏰 I tuoi server</span>
              <div class="h-px flex-1 bg-amber-900/30" />
            </div>

            <Suspense fallback={
              <div class="flex items-center justify-center py-16 gap-3 text-amber-800 font-serif">
                <div class="w-5 h-5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                Caricamento...
              </div>
            }>
              <Show when={servers().length > 0} fallback={
                <StoneBox class="text-center py-16 px-8">
                  <p class="text-stone-600 font-serif text-sm mb-4">Nessun server trovato.</p>
                  <AddBtn />
                </StoneBox>
              }>
                <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <For each={servers()}>
                    {(server) => (
                      <StoneBox>
                        {/* Banner */}
                        <div class="h-32 bg-stone-950 overflow-hidden cursor-pointer relative border-b border-stone-800"
                          onClick={() => navigate(`/server/${server.id}`)}>
                          <Show when={server.logo_url} fallback={
                            <div class="w-full h-full flex items-center justify-center font-serif font-black text-6xl text-stone-800">
                              {server.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                          }>
                            <img src={server.logo_url} alt={server.name} class="w-full h-full object-cover opacity-50 hover:opacity-70 transition-opacity" />
                          </Show>
                          <div class="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />
                          <span class="absolute bottom-2 left-3 text-stone-600 font-serif text-xs">#{server.id}</span>
                        </div>

                        <div class="p-4">
                          <p class="font-serif font-black text-amber-400 text-base truncate mb-0.5">{server.name}</p>
                          <p class="text-stone-600 font-serif text-xs mb-3">{server.ip}{server.port ? `:${server.port}` : ""}</p>

                          <Show when={server.description}>
                            <p class="text-stone-500 font-serif text-xs mb-3 line-clamp-2">{server.description}</p>
                          </Show>

                          {/* Tags */}
                          <div class="flex flex-wrap gap-1 mb-3">
                            <For each={UtilsStringArray.toArray(server.tags.toString())}>
                              {tag => <span class="text-xs px-2 py-0.5 border border-stone-700 text-stone-500 font-serif">#{tag}</span>}
                            </For>
                          </div>

                          {/* Secret key */}
                          <div class="flex items-center gap-2 p-2 border border-stone-800 bg-stone-950 mb-4">
                            <code class="flex-1 text-amber-800 text-xs truncate select-all">{server.secret_key}</code>
                            <button
                              onClick={() => { navigator.clipboard.writeText(server.secret_key); notify("Chiave copiata", "success"); }}
                              class="text-stone-600 hover:text-amber-500 transition-colors text-xs px-1"
                            >📋</button>
                          </div>

                          {/* Actions */}
                          <div class="flex gap-2">
                            <button onClick={() => navigate(`/servers/edit/${server.id}`)}
                              class="flex-1 py-2 border border-stone-700 text-stone-400 hover:text-amber-400 hover:border-amber-800/50 font-serif text-xs uppercase tracking-wide transition-all">
                              ✏ Modifica
                            </button>
                            <button onClick={() => { setSelected(server); setDeleteModalOpen(true); }}
                              class="flex-1 py-2 border border-red-900/40 text-red-700 hover:text-red-400 hover:border-red-700/50 font-serif text-xs uppercase tracking-wide transition-all">
                              🗑 Elimina
                            </button>
                          </div>
                        </div>
                      </StoneBox>
                    )}
                  </For>
                </div>
              </Show>
            </Suspense>
          </div>

        </div>
      </Show>

      <DeleteModal
        isOpen={deleteModalOpen()} serverName={selected()?.name ?? ""}
        onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete}
      />
    </div>
  );
}