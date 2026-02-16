// src/component/modal/EditServerModal.tsx
import { Component, createSignal, Show } from "solid-js";
import { ServerResponse } from "../../types/ServerResponse";

type EditServerModalProps = {
  isOpen: boolean;
  server: ServerResponse | null;
  onClose: () => void;
  onSubmit: (updatedServer: Partial<ServerResponse> | null) => Promise<void>;
};

const EditServerModal: Component<EditServerModalProps> = (props) => {
  const [name, setName] = createSignal(props.server?.name || "");
  const [ip, setIp] = createSignal(props.server?.ip || "");
  const [port, setPort] = createSignal(props.server?.port || "");
  const [tagsInput, setTagsInput] = createSignal(props.server?.tags?.join(", ") || "");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updated = {
        name: name().trim(),
        ip: ip().trim(),
        port: port().trim(),
        tags: tagsInput()
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
      };

      await props.onSubmit(updated);
      props.onClose();
    } catch (err: any) {
      setError(err.message || "Errore durante l'aggiornamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Show when={props.isOpen && props.server}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="
          relative w-full max-w-lg mx-4 p-8 rounded-2xl overflow-hidden
          bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950
          border-2 border-violet-700/60 shadow-2xl shadow-violet-900/70
          animate-fade-in-up
        ">
          {/* Glow overlay */}
          <div class="absolute inset-0 bg-gradient-radial from-violet-600/10 via-transparent to-transparent pointer-events-none" />

          <h2 class="
            text-3xl font-black text-transparent bg-clip-text
            bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 mb-6 text-center
          ">
            Modifica Server
          </h2>

          <p class="text-center text-violet-300/80 mb-8">
            {props.server?.name}
          </p>

          <form onSubmit={handleSubmit} class="space-y-6">
            <div>
              <label class="block text-violet-300 font-medium mb-2">Nome Server</label>
              <input
                type="text"
                value={name()}
                onInput={e => setName(e.currentTarget.value)}
                class="
                  w-full px-4 py-3 rounded-lg bg-black/60 border border-violet-700/50
                  text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500
                  focus:ring-2 focus:ring-fuchsia-500/30 transition-all
                "
                placeholder="Es. My Epic Realm"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-violet-300 font-medium mb-2">IP</label>
                <input
                  type="text"
                  value={ip()}
                  onInput={e => setIp(e.currentTarget.value)}
                  class="
                    w-full px-4 py-3 rounded-lg bg-black/60 border border-violet-700/50
                    text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500
                    focus:ring-2 focus:ring-fuchsia-500/30 transition-all
                  "
                  placeholder="192.168.1.100"
                  required
                />
              </div>

              <div>
                <label class="block text-violet-300 font-medium mb-2">Porta</label>
                <input
                  type="text"
                  value={port()}
                  onInput={e => setPort(e.currentTarget.value)}
                  class="
                    w-full px-4 py-3 rounded-lg bg-black/60 border border-violet-700/50
                    text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500
                    focus:ring-2 focus:ring-fuchsia-500/30 transition-all
                  "
                  placeholder="25565"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-violet-300 font-medium mb-2">Tags (separati da virgola)</label>
              <input
                type="text"
                value={tagsInput()}
                onInput={e => setTagsInput(e.currentTarget.value)}
                class="
                  w-full px-4 py-3 rounded-lg bg-black/60 border border-violet-700/50
                  text-white placeholder-violet-400 focus:outline-none focus:border-fuchsia-500
                  focus:ring-2 focus:ring-fuchsia-500/30 transition-all
                "
                placeholder="PvP, Italian, Survival"
              />
            </div>

            <Show when={error()}>
              <p class="text-red-400 text-center font-medium">{error()}</p>
            </Show>

            <div class="flex gap-4 mt-8">
              <button
                type="button"
                onClick={props.onClose}
                class="
                  flex-1 py-3 px-6 rounded-xl text-lg font-semibold
                  bg-gray-800/70 hover:bg-gray-700/80 text-gray-300
                  border border-gray-700 transition-all
                "
                disabled={loading()}
              >
                Annulla
              </button>

              <button
                type="submit"
                class="
                  flex-1 py-3 px-6 rounded-xl text-lg font-semibold
                  bg-gradient-to-r from-violet-700 to-fuchsia-700
                  hover:from-violet-600 hover:to-fuchsia-600 text-white
                  shadow-lg shadow-violet-900/50 hover:shadow-violet-800/70
                  border border-violet-600/50 hover:border-violet-500/70
                  transition-all duration-300 active:scale-95
                "
                disabled={loading()}
              >
                {loading() ? "Salvataggio..." : "Salva Modifiche"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
    </Show>


  );
};

export default EditServerModal;