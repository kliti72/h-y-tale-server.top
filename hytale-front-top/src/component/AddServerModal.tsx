// AddServerModal.tsx (versione aggiornata)
import { Component, createSignal, For, from, Show } from "solid-js";
import { useAuth } from "../auth/AuthContext";

type AddServerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    ip: string;
    port: string;
    tags: string[];
  }) => void;
};

const AddServerModal: Component<AddServerModalProps> = (props) => {
  const [name, setName] = createSignal("");
  const [ip, setIp] = createSignal("");
  const [port, setPort] = createSignal("");
  const [tags, setTags] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");
  const auth = useAuth();

  const addTag = () => {
    const trimmed = newTag().trim();
    if (trimmed && !tags().includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!name() || !ip() || !port()) {
      alert("Compila nome, IP e porta!");
      return;
    }

    props.onSubmit?.({
      name: name(),
      ip: ip(),
      port: port(),
      tags: tags(),
    });

    setName("");
    setIp("");
    setPort("");
    setTags([]);
    props.onClose();
  };

  return (
    <Show when={props.isOpen && auth.isAuthenticated()}>
      <div
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto"
        onClick={props.onClose}
      >
        <div
          class="
            bg-zinc-900 
            border border-zinc-700 
            rounded-xl 
            w-full max-w-lg 
            mx-4 
            my-16          // ← spazio dall'alto
            p-6 sm:p-8
            shadow-2xl 
            max-h-[90vh] 
            overflow-y-auto
          "
          onClick={(e) => e.stopPropagation()}
        >
          <h2 class="text-2xl font-bold text-white mb-6 text-center">
            Aggiungi il tuo Server
          </h2>

          {/* Nome server */}
          <div class="mb-5">
            <label class="block text-zinc-400 text-sm mb-1.5">Nome Server</label>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="Es. Il mio Regno Epico"
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
            />
          </div>

          {/* IP + Port */}
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-zinc-400 text-sm mb-1.5">Indirizzo IP</label>
              <input
                type="text"
                value={ip()}
                onInput={(e) => setIp(e.currentTarget.value)}
                placeholder="play.esempio.com"
                class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
              />
            </div>

            <div>
              <label class="block text-zinc-400 text-sm mb-1.5">Porta</label>
              <input
                type="text"
                value={port()}
                onInput={(e) => setPort(e.currentTarget.value)}
                placeholder="25565"
                class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
              />
            </div>
          </div>

          {/* Tags */}
          <div class="mb-7">
            <label class="block text-zinc-400 text-sm mb-2">Tag personalizzati (opzionale)</label>

            <div class="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag()}
                onInput={(e) => setNewTag(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="es. PvP, ITA, Survival, Economy..."
                class="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
              />
              <button
                type="button"
                onClick={addTag}
                class="px-5 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors min-w-[60px]"
              >
                +
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <For each={tags()}>
                {(tag) => (
                  <div class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/50 text-emerald-300 rounded-full border border-emerald-800/40 text-sm">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      class="text-emerald-400 hover:text-red-400 ml-1 text-base leading-none"
                    >
                      ×
                    </button>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Pulsanti azione */}
          <div class="flex gap-4 mt-8">
            <button
              onClick={props.onClose}
              class="flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors font-medium"
            >
              Annulla
            </button>
            <button
              onClick={handleSubmit}
              class="flex-1 py-3.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-lg transition-all shadow-md shadow-emerald-950/30"
            >
              Aggiungi Server
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default AddServerModal;