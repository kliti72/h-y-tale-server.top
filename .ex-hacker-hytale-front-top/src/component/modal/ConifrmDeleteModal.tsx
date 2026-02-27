// src/component/modal/ConfirmDeleteModal.tsx
import { Component, createSignal, Show } from "solid-js";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  serverName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

const ConfirmDeleteModal: Component<ConfirmDeleteModalProps> = (props) => {
  const [loading, setLoading] = createSignal(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await props.onConfirm();
      props.onClose();
    } catch (err) {
      console.error("Errore eliminazione:", err);
      alert("Errore durante l'eliminazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div class="
          w-full max-w-md mx-4 p-8 rounded-2xl
          bg-gradient-to-br from-gray-950 via-red-950/70 to-black
          border-2 border-red-700/60 shadow-2xl shadow-red-900/70
          text-center animate-fade-in
        ">
          <h2 class="
            text-3xl font-black text-transparent bg-clip-text
            bg-gradient-to-r from-red-400 via-pink-500 to-red-400 mb-6
          ">
            Elimina Server
          </h2>

          <p class="text-lg text-zinc-200 mb-8">
            Sei sicuro di voler eliminare permanentemente
            <br />
            <span class="font-bold text-red-300 break-words">"{props.serverName}"</span> ?
          </p>

          <p class="text-sm text-red-400/80 mb-10">
            Questa azione non può essere annullata.
          </p>

          <div class="flex gap-4">
            <button
              onClick={props.onClose}
              class="
                flex-1 py-4 px-6 rounded-xl text-lg font-semibold
                bg-gray-800/70 hover:bg-gray-700/80 text-gray-300
                border border-gray-700 transition-all
              "
              disabled={loading()}
            >
              Annulla
            </button>

            <button
              onClick={handleConfirm}
              class="
                flex-1 py-4 px-6 rounded-xl text-lg font-semibold uppercase tracking-wider
                bg-gradient-to-r from-red-700 to-rose-700
                hover:from-red-600 hover:to-rose-600 text-white
                shadow-lg shadow-red-900/60 hover:shadow-red-800/80
                border border-red-600/50 hover:border-red-500/70
                transition-all duration-300 active:scale-95
              "
              disabled={loading()}
            >
              {loading() ? "Eliminazione..." : "Elimina Ora"}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default ConfirmDeleteModal;