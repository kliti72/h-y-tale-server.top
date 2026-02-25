import { createSignal } from "solid-js";
import { notify } from "../notify/NotificationComponent";
import { ServerResponse } from "../../types/ServerResponse";

export default function GameServerAddressBoxComponent(props: { server: ServerResponse }) {
  const [copied, setCopied] = createSignal(false);

  const copyIP = async () => {
    const ip = `${props.server.ip}${props.server.port ? ':' + props.server.port : ''}`;
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      notify("IP copiato!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch { notify("Errore copia", "error"); }
  };

  return (
    <div class="relative border border-stone-700 bg-stone-900 px-5 py-4">
      <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-800/60" />
      <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-800/60" />

      <p class="text-amber-800 text-xs font-serif uppercase tracking-widest mb-3">🏰 Indirizzo Server</p>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p class="font-serif font-black text-2xl md:text-3xl text-amber-400 truncate">
          {props.server.ip || '—'}
          {props.server.port && <span class="text-stone-600">:{props.server.port}</span>}
        </p>

        <button
          onClick={copyIP}
          class={`relative flex-shrink-0 px-4 py-2 border font-serif text-xs uppercase tracking-widest transition-all
            ${copied()
              ? "border-green-700/60 bg-green-950/30 text-green-500"
              : "border-stone-700 bg-stone-800 text-stone-400 hover:border-amber-800 hover:text-amber-500"}`}
        >
          <span class="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-60" />
          <span class="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-60" />
          {copied() ? "✓ Copiato" : "📋 Copia IP"}
        </button>
      </div>
    </div>
  );
}