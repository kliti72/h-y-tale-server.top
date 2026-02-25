import { Component, createSignal, Show } from "solid-js";

type Props = { isOpen: boolean; serverName: string; onClose: () => void; onConfirm: () => Promise<void>; };

const DeleteModal: Component<Props> = (props) => {
  const [loading, setLoading] = createSignal(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await props.onConfirm(); props.onClose(); }
    catch { alert("Errore durante l'eliminazione"); }
    finally { setLoading(false); }
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={props.onClose}>
        <div class="relative w-full max-w-sm bg-stone-950 border-2 border-red-900/60 p-8 text-center shadow-2xl shadow-black" onClick={e => e.stopPropagation()}>
          <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-800" />
          <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-800" />
          <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-800" />
          <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-800" />

          <p class="text-red-700 font-serif text-xs uppercase tracking-widest mb-3">⚠ Azione Irreversibile</p>
          <h2 class="font-serif font-black text-2xl text-red-500 uppercase mb-4">Elimina Server</h2>
          <div class="h-px bg-red-900/40 mb-5" />
          <p class="text-stone-400 font-serif text-sm mb-2">Stai per eliminare permanentemente</p>
          <p class="text-red-400 font-serif font-bold mb-6 break-words">"{props.serverName}"</p>

          <div class="flex gap-3">
            <button onClick={props.onClose} disabled={loading()}
              class="flex-1 py-2.5 border border-stone-700 text-stone-500 hover:text-stone-300 font-serif text-sm uppercase tracking-wide transition-all disabled:opacity-40">
              Annulla
            </button>
            <button onClick={handleConfirm} disabled={loading()}
              class="flex-1 py-2.5 border border-red-800/60 bg-red-950/30 hover:bg-red-900/40 text-red-500 hover:text-red-400 font-serif text-sm uppercase tracking-wide transition-all disabled:opacity-40">
              {loading() ? "..." : "💀 Elimina"}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default DeleteModal;