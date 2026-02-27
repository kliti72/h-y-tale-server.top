import { createSignal, For, Show } from "solid-js";
import DiscordButtonComponent from "../button/DiscordButtonComponent";

type Toast = { id: number; msg: string; type?: "success" | "error" | "info" };

const [toasts, setToasts] = createSignal<Toast[]>([]);
const [showLoginModal, setShowLoginModal] = createSignal(false);
let nextId = 0;

export function notify(message: string, type: Toast["type"] = "info") {
  const id = nextId++;
  setToasts(p => [...p, { id, msg: message, type }]);
  setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3400);
}

export function requireDiscordLogin() { setShowLoginModal(true); }

const ICONS = { success: "⚔", error: "💀", info: "📜" };
const COLORS = {
  success: "border-green-800 text-green-500 bg-stone-900",
  error:   "border-red-900 text-red-500 bg-stone-900",
  info:    "border-amber-900/60 text-amber-500 bg-stone-900",
};

export default function NotificationComponent() {
  return (
    <>
      {/* Toasts */}
      <div class="fixed bottom-6 right-6 z-[10000] flex flex-col gap-2 pointer-events-none">
        <For each={toasts()}>
          {(t) => (
            <div class={`relative flex items-center gap-3 px-4 py-3 border min-w-52 max-w-sm pointer-events-auto animate-[slideIn_0.2s_ease] font-serif text-sm ${COLORS[t.type ?? "info"]}`}>
              <span class="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-60" />
              <span class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-60" />
              <span>{ICONS[t.type ?? "info"]}</span>
              <span>{t.msg}</span>
            </div>
          )}
        </For>
      </div>

      {/* Login Modal */}
      <Show when={showLoginModal()}>
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={() => setShowLoginModal(false)}>
          <div class="relative bg-stone-950 border-2 border-amber-900/50 p-8 max-w-sm w-full text-center shadow-2xl shadow-black" onClick={e => e.stopPropagation()}>
            <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-700" />
            <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-700" />
            <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-700" />
            <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-700" />

            <p class="text-red-600 text-xs font-serif uppercase tracking-widest mb-3">⚠ Accesso Negato</p>
            <h2 class="text-amber-500 font-serif font-black text-2xl uppercase tracking-widest mb-2">Autenticazione</h2>
            <div class="h-px bg-amber-900/40 my-4" />
            <p class="text-stone-500 font-serif text-sm mb-6 leading-relaxed">
              Devi accedere con Discord per votare o eseguire altre azioni.
            </p>

            <DiscordButtonComponent />

            <button
              onClick={() => setShowLoginModal(false)}
              class="mt-3 w-full py-2 border border-stone-800 text-stone-600 hover:text-stone-400 hover:border-stone-700 font-serif text-xs uppercase tracking-widest transition-all"
            >
              Annulla
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}