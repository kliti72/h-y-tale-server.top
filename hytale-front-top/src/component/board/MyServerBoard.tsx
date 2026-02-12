import { 
  createResource, 
  createSignal, 
  For, 
  Show, 
  Suspense 
} from 'solid-js';
import { useAuth } from '../../auth/AuthContext';
import AddServerModal from "../modal/AddServerModal";

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
    credentials: 'include', // obbligatorio
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Errore ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

const API_URL = "http://localhost:3000";

export default function MyServersBoard() {
  const { isAuthenticated } = useAuth(); 
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  
  
  const handleSubmit = async (data: { name: string; ip: string; port: string; tags: string[] }) => {
    try {
      const response = await fetch(`${API_URL}/api/servers`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore ${response.status}: ${errorText}`);
      }

      await response.json();
      setIsModalOpen(false);
      location.href = '/';
      alert("Server aggiunto con successo! 🎉");
    } catch (err) {
      console.error("Errore aggiunta:", err);
    }
  };

  
  // Oppure prendi tutto dall'API (come nel tuo JSON)
  const [data] = createResource<ApiResponse>(fetchMyServers);

  const handleEdit = (serverId: number) => {
    // Opzioni possibili:
    // 1. navigate(`/servers/${serverId}/edit`) usando useNavigate da @solidjs/router
    // 2. Apri un modal con createSignal<boolean>
    alert(`Modifica server #${serverId} (da implementare)`);
  };

  return (
    <div class="max-w-4xl mx-auto p-6" style={{"background-color": 'white'}}>
      <h1 class="text-3xl font-bold mb-6">I Miei Server</h1>

      {/* Profilo utente */}
      <Show when={data.state === 'ready'} fallback={<p>Caricamento profilo...</p>}>
        <div class="bg-gray-100 p-4 rounded-lg mb-8">
          <h2 class="text-xl font-semibold">
            {data()?.user.displayName || data()?.user.username}
          </h2>
          <p class="text-gray-600">@{data()?.user.username}</p>
          <p class="text-sm text-gray-500 mt-1">
            ID: {data()?.user.id}
          </p>
        </div>
      </Show>

      {/* Lista server */}
      <Suspense fallback={<div class="text-center py-10">Caricamento server...</div>}>
        <Show
          when={data()}
          fallback={<p class="text-red-600">Nessun dato disponibile</p>}
          keyed
        >
          {(loadedData) => (
            <>
              <p class="mb-4 text-lg">
                Hai <strong>{loadedData.count}</strong> server registrati
              </p>

              <div class="grid gap-6 md:grid-cols-2">
                <For each={loadedData.servers} fallback={<p>Nessun server trovato</p>}>
                  {(server) => (
                    <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
                      <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-bold">{server.name}</h3>
                        <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {server.role.toUpperCase()}
                        </span>
                      </div>

                      <p class="text-gray-700 mb-2">
                        <strong>Indirizzo:</strong> {server.ip}:{server.port}
                      </p>

                      <Show when={server.tags?.length > 0}>
                        <div class="flex flex-wrap gap-2 mb-3">
                          <For each={server.tags}>
                            {(tag) => (
                              <span class="px-2 py-1 text-xs bg-gray-200 rounded">
                                {tag}
                              </span>
                            )}
                          </For>
                        </div>
                      </Show>

                      <p class="text-sm text-gray-500 mb-4">
                        Creato il: {new Date(server.created_at).toLocaleDateString('it-IT')}
                      </p>

                      <button
                        onClick={() => handleEdit(server.id)}
                        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                      >
                        Modifica
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </>
          )}
        </Show>
      </Suspense>

 <Show when={isAuthenticated()}>
        {/* Pulsante Aggiungi - stile coerente */}
        <div class="text-center mb-10 flex">
          <button
            onClick={() => setIsModalOpen(true)}
            class="
              flex items-center justify-center gap-2 mx-auto
              px-7 py-3.5 rounded-xl text-base sm:text-lg font-semibold
              text-emerald-50 bg-gradient-to-r from-emerald-700/80 to-teal-700/70
              border border-emerald-600/60
              hover:from-emerald-600/90 hover:to-teal-600/80
              hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-900/40
              active:scale-[0.98] transition-all duration-200
            "
          >
            <span class="text-xl leading-none">⊕</span>
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

    
  );
}