// src/components/MyServersBoard.tsx
import { 
  createResource, 
  For, 
  Show, 
  Suspense 
} from 'solid-js';
import { useAuth } from '../../auth/AuthContext';

// Tipi (opzionale ma consigliato)
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
    credentials: 'include', // se usi cookie/session/auth
    headers: {
      'Accept': 'application/json',
      // 'Authorization': `Bearer ${token}` // se usi token
    },
  });

  if (!response.ok) {
    throw new Error(`Errore ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export default function MyServersBoard() {
  const { user } = useAuth(); // ← opzionale, se lo usi già nel layout

  // Oppure prendi tutto dall'API (come nel tuo JSON)
  const [data, { refetch, mutate }] = createResource<ApiResponse>(fetchMyServers);

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

      {/* Pulsante refresh manuale (utile per debug) */}
      <button
        onClick={() => refetch()}
        class="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Ricarica dati
      </button>
    </div>
  );
}