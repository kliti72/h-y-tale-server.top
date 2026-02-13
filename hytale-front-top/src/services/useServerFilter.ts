import { createSignal, createMemo, createResource } from "solid-js";

// ────────────────────────────────────────────────
// Costanti e tipi
// ────────────────────────────────────────────────

const API_URL = "http://localhost:3000";

export type ServerResponse = {
  created_at?: string;
  id?: string;
  ip?: string;
  name?: string;
  port?: string;
  tags?: string;          // presumo sia una stringa tipo "survival,pvp,ita"
};

export type Server = ServerResponse & {
  // possiamo aggiungere campi derivati se serve
};

// ────────────────────────────────────────────────
// Fetch dei server (invariato)
// ────────────────────────────────────────────────

const fetchServers = async (): Promise<ServerResponse[]> => {
  const res = await fetch(`${API_URL}/api/servers`);
  if (!res.ok) throw new Error("Errore nel caricamento dei server");
  return res.json();
};

// ────────────────────────────────────────────────
// Stato e logica filtri (da mettere nel componente principale)
// ────────────────────────────────────────────────

export function useServerFilters() {
  // 1. Dati grezzi dal server
  const [serversResource] = createResource(fetchServers);

  // 2. Stato dei filtri
  const [searchQuery, setSearchQuery] = createSignal("");
  const [selectedTags, setSelectedTags] = createSignal<string[]>([]);
  const [sortBy, setSortBy] = createSignal<"votes" | "newest" | "online" | "name">("newest");

  // Nota: attualmente non hai "votes" né "online" nel tipo ServerResponse
  //      → se vuoi usarli dovrai aggiungerli nel backend o derivarli
  //      per ora useremo solo "name" e "created_at" per ordinamento

  // 3. Tutti i tag disponibili (estratti dai server)
  const availableTags = createMemo(() => {
    const servers = serversResource() || [];
    const tagSet = new Set<string>();

    servers.forEach(server => {
      if (server.tags) {
        // se tags è una stringa "tag1,tag2,tag3"
        server.tags.split(",").forEach(t => {
          const trimmed = t.trim();
          if (trimmed) tagSet.add(trimmed);
        });
      }
    });

    return Array.from(tagSet).sort();
  });

  // 4. Server filtrati e ordinati (reattivo)
  const filteredAndSortedServers = createMemo(() => {
    let list = serversResource() || [];

    // Filtro ricerca (nome o IP)
    const query = searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(server =>
        (server.name?.toLowerCase().includes(query) ||
         server.ip?.toLowerCase().includes(query))
      );
    }

    // Filtro tag (tutti i tag selezionati devono essere presenti)
    const activeTags = selectedTags();
    if (activeTags.length > 0) {
      list = list.filter(server => {
        if (!server.tags) return false;
        const serverTags = server.tags.split(",").map(t => t.trim());
        return activeTags.every(tag => serverTags.includes(tag));
      });
    }

    // Ordinamento
    const sort = sortBy();
    list = [...list]; // copia per non mutare l'originale

    if (sort === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    else if (sort === "newest") {
      list.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB.getTime() - dateA.getTime(); // più recente prima
      });
    }
    // "votes" e "online" non implementati perché non esistono nel modello
    // puoi aggiungerli quando il backend li fornisce

    return list;
  });

  // 5. Funzione reset
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy("newest"); // o il tuo default preferito
  };

  return {
    // per la sidebar
    availableTags: () => availableTags(),
    selectedTags: () => selectedTags(),
    onTagsChange: () => setSelectedTags,
    searchQuery: () => searchQuery(),
    onSearchChange: () => setSearchQuery,
    sortBy: () => sortBy(),
    onSortChange: () => setSortBy,
    onResetFilters: () => resetFilters,

    // per la lista principale
    filteredServers: filteredAndSortedServers(),
    isLoading: serversResource.loading,
    error: serversResource.error,
  };
}