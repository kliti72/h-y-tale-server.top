
import { Component, createSignal, For } from "solid-js";

type Tag = string; 

type ServerFiltersSidebarProps = {
  availableTags: Tag[];        
  selectedTags: Tag[];     
  onTagsChange: (tags: Tag[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: "votes" | "newest" | "online" | "name";
  onSortChange: (sort: "votes" | "newest" | "online" | "name") => void;
  onResetFilters?: () => void;
};

const ServerFiltersSidebar: Component<ServerFiltersSidebarProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(true); 

  return (
    <aside
      class={`
        fixed top-0 right-0 z-30 h-full w-80 sm:w-72 lg:w-80
        bg-black/60 backdrop-blur-xl border-l border-emerald-900/40
        shadow-2xl shadow-emerald-950/30
        transition-transform duration-300
        ${isOpen() ? "translate-x-0" : "translate-x-full"}
        sm:relative sm:translate-x-0
      `}
    >
      {/* Header del pannello */}
      <div class="p-5 border-b border-emerald-900/30 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-emerald-300">
          Filtri Server
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen())}
          class="sm:hidden text-emerald-400 hover:text-emerald-300"
        >
          {isOpen() ? "Chiudi ×" : "Filtri"}
        </button>
      </div>

      <div class="p-5 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
        {/* Ricerca testo */}
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            Cerca per nome o IP
          </label>
          <input
            type="text"
            value={props.searchQuery}
            onInput={(e) => props.onSearchChange(e.currentTarget.value)}
            placeholder="Es. survival ITA, 192.168..."
            class={`
              w-full px-4 py-2.5 rounded-lg bg-black/40 border border-emerald-800/50
              text-white placeholder-zinc-500 focus:outline-none
              focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30
              transition-all
            `}
          />
        </div>

        {/* Ordinamento */}
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            Ordina per
          </label>
          <select
            value={props.sortBy}
            onChange={(e) => props.onSortChange(e.currentTarget.value as any)}
            class={`
              w-full px-4 py-2.5 rounded-lg bg-black/40 border border-emerald-800/50
              text-white focus:outline-none focus:border-emerald-600
              transition-all appearance-none
            `}
          >
            <option value="votes">Più votati</option>
            <option value="online">Più online</option>
            <option value="newest">Più recenti</option>
            <option value="name">Nome A–Z</option>
          </select>
        </div>

        {/* Filtri per tag */}
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-3">
            Tag / Categorie
          </label>
          <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2">
            <For each={props.availableTags}>
              {(tag) => {
                const isSelected = props.selectedTags.includes(tag);
                return (
                  <button
                    onClick={() => {
                      if (isSelected) {
                        props.onTagsChange(props.selectedTags.filter(t => t !== tag));
                      } else {
                        props.onTagsChange([...props.selectedTags, tag]);
                      }
                    }}
                    class={`
                      px-3.5 py-1.5 text-sm rounded-full font-medium transition-all
                      ${isSelected
                        ? "bg-emerald-700/70 text-white border-emerald-500/60"
                        : "bg-black/40 text-emerald-300 border border-emerald-800/50 hover:border-emerald-600/70 hover:bg-emerald-950/40"}
                    `}
                  >
                    {tag}
                  </button>
                );
              }}
            </For>
          </div>
        </div>

        {/* Pulsante reset */}
        <button
          onClick={() => {
            props.onSearchChange("");
            props.onTagsChange([]);
            props.onSortChange("votes"); // o il default che preferisci
            props.onResetFilters?.();
          }}
          class={`
            w-full py-3 mt-4 rounded-lg text-sm font-medium
            bg-black/50 hover:bg-red-950/40 text-red-300
            border border-red-900/50 hover:border-red-700/60
            transition-all duration-200 active:scale-98
          `}
        >
          Reimposta filtri
        </button>
      </div>
    </aside>
  );
};

export default ServerFiltersSidebar;