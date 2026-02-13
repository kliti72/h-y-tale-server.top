import { 
  createResource, 
  createSignal, 
  For, 
  Show, 
  Suspense 
} from 'solid-js';
import { useAuth } from '../../auth/AuthContext';
import AddServerModal from "../modal/AddServerModal";
import HeroTieatryServer from './hero/HeroTieatryServer';

type Server = {
  id: number;
  name: string;
  ip: string;
  port: string;
  tags: string[];
  created_at: string;
  role: string;
  owner: {
    id: string;
    username: string;
    displayName: string;
  };
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

export default function MyServersBoard() {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const user = useAuth();

  const [data] = createResource<ApiResponse>(fetchMyServers);

  const handleSubmit = async (formData: { name: string; ip: string; port: string; tags: string[] }) => {
    try {
      const res = await fetch(`${API_URL}/api/servers`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `Errore ${res.status}`);
      }

      setIsModalOpen(false);
      // Ricarica la lista (o usa refetch di createResource se vuoi)
      location.reload(); // semplice, oppure implementa refetch
      alert("Server aggiunto con successo! 🎉");
    } catch (err) {
      console.error("Errore aggiunta server:", err);
      alert("Errore durante l'aggiunta del server.");
    }
  };

  const handleEdit = (serverId: number) => {
    alert(`Modifica server #${serverId} (implementa edit modal o pagina)`);
    // Futuro: navigate(`/servers/${serverId}/edit`) o apri modal
  };

  const handleDelete = (serverId: number, serverName: string) => {
    if (!confirm(`Sei sicuro di voler eliminare "${serverName}"?`)) return;
    
    alert(`Eliminazione server #${serverId} (da implementare con DELETE fetch)`);
    // Futuro esempio:
    // fetch(`${API_URL}/api/servers/${serverId}`, { method: 'DELETE', credentials: 'include' })
    //   .then(() => location.reload());
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-black via-violet-950/95 to-black text-white">
      {/* Hero-like header */}
      <div class="relative py-16 px-6 text-center border-b border-emerald-900/100 backdrop-blur-sm">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-900/100 via-transparent to-cyan-900/5 pointer-events-none" />
        
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          I <span class="text-emerald-400">Miei Server</span>
        </h1>
        <p class="text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto">
          Gestisci i tuoi regni Hytale, aggiungi nuovi mondi e mantieni il controllo.
        </p>

           <div class="max-w-7xl mx-auto px-5 py-10">
        {/* Profilo utente (glass card) */}
        <Show when={!data.loading} fallback={<div class="text-center py-10 text-zinc-400">Caricamento profilo...</div>}>
          <Show when={user.isAuthenticated}>
              <div class="mb-12 backdrop-blur-md bg-black/40 border border-emerald-800/40 rounded-xl p-6 shadow-xl shadow-emerald-950/20">
                <h2 class="text-2xl font-bold text-emerald-300 mb-2">
                  {user.user.name || user.user.name}
                </h2>
                <p class="text-emerald-400/80">@{user.user.name}</p>
                <p class="text-sm text-zinc-500 mt-1">
                  ID: {user.user.name} • 1 server registrati
                </p>
              </div>
          </Show>
        </Show>

      </div>

   

        {/* Lista server */}
        <Suspense fallback={<div class="text-center py-20 text-zinc-400">Caricamento server...</div>}>
          <Show when={data()?.servers?.length} fallback={
            <div class="text-center py-16 text-zinc-500">
              Non hai ancora aggiunto nessun server.<br/>
              Clicca su "Aggiungi il tuo Server" per iniziare!
            </div>
          }>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <For each={data()?.servers}>
                {(server) => (
                  <div class="
                    backdrop-blur-md bg-black/30 border border-emerald-800/40 
                    rounded-xl p-6 shadow-lg shadow-emerald-950/20
                    hover:border-emerald-600/60 hover:shadow-emerald-900/30
                    transition-all duration-300 group
                  ">
                    <div class="flex justify-between items-start mb-4">
                      <h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {server.name}
                      </h3>
                      <span class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">
                        {server.role.toUpperCase()}
                      </span>
                    </div>

                    <p class="text-emerald-400 font-mono mb-2">
                      {server.ip}:{server.port}
                    </p>

                    <p class="text-sm text-zinc-400 mb-5">
                      Creato il {new Date(server.created_at).toLocaleDateString('it-IT')}
                    </p>

                    <div class="flex gap-3">
                      <button
                        onClick={() => handleEdit(server.id)}
                        class="
                          flex-1 py-2.5 px-4 rounded-lg text-sm font-medium
                          bg-emerald-800/70 hover:bg-emerald-700/80 text-white
                          border border-emerald-700/50 hover:border-emerald-500/60
                          transition-all active:scale-97
                        "
                      >
                        Modifica
                      </button>

                      <button
                        onClick={() => handleDelete(server.id, server.name)}
                        class="
                          flex-1 py-2.5 px-4 rounded-lg text-sm font-medium
                          bg-red-900/50 hover:bg-red-800/70 text-red-200
                          border border-red-800/50 hover:border-red-600/60
                          transition-all active:scale-97
                        "
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Suspense>

        {/* Pulsante Aggiungi - hero style */}
        <Show when={isAuthenticated()}>
          <div class="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              class="
                inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-semibold
                bg-gradient-to-r from-emerald-700 to-teal-700
                hover:from-emerald-600 hover:to-teal-600
                text-white shadow-xl shadow-emerald-900/40 hover:shadow-emerald-700/60
                border border-emerald-600/50 hover:border-emerald-400/60
                transition-all duration-300 active:scale-95
              "
            >
              <span class="text-2xl">⊕</span>
              Aggiungi il tuo Server
            </button>
          </div>
        </Show>

        <AddServerModal
          isOpen={isModalOpen()}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}