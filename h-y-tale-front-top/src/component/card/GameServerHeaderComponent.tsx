import { createResource, Show } from "solid-js";
import { ServerResponse, ServerStatus } from "../../types/ServerResponse";
import { StatusService } from "../../services/status.service";

export function GameServerHeaderComponent(props: { server: ServerResponse }) {
  const [status] = createResource<ServerStatus | null>(
    () => StatusService.getStatusById(props.server.id ?? 1),
    { initialValue: null }
  );

  const dot = () => {
    if (status.loading) return "bg-yellow-600 animate-pulse";
    return status() ? "bg-green-500 animate-pulse" : "bg-red-600";
  };

  const label = () => {
    if (status.loading) return "Sincronizzazione...";
    return status() ? "● Online" : "● Offline";
  };

  return (
    <div class="flex items-start gap-5">

      {/* Logo */}
      <div class="relative flex-shrink-0">
        <Show when={props.server.logo_url} fallback={
          <div class="w-20 h-20 border-2 border-stone-700 bg-stone-900 flex items-center justify-center font-serif font-black text-3xl text-amber-600">
            {props.server.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        }>
          <img
            src={props.server.logo_url}
            alt={props.server.name}
            class="w-20 h-20 object-cover border-2 border-stone-700"
          />
        </Show>
        {/* status dot */}
        <span class={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-stone-950 ${dot()}`} />
      </div>

      {/* Info */}
      <div class="flex-1 min-w-0">
        <h1 class="font-serif font-black text-3xl md:text-4xl text-amber-400 truncate leading-tight mb-1">
          {props.server.name}
        </h1>

        <p class={`font-serif text-xs uppercase tracking-widest mb-3 ${status() ? "text-green-600" : "text-red-700"}`}>
          {label()}
        </p>

        <Show when={!status.loading && status()}>
          {(s) => (
            <div class="flex gap-4">
              <div class="relative border border-stone-700 bg-stone-900 px-3 py-2">
                <span class="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-800/60" />
                <p class="text-stone-500 font-serif text-xs uppercase tracking-wide">Giocatori</p>
                <p class="text-amber-400 font-serif font-bold text-lg">{s().players_online}/{s().players_max}</p>
              </div>
              <div class="relative border border-stone-700 bg-stone-900 px-3 py-2">
                <span class="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-800/60" />
                <p class="text-stone-500 font-serif text-xs uppercase tracking-wide">Voti</p>
                <p class="text-amber-400 font-serif font-bold text-lg">{props.server.voti_totali ?? 0}</p>
              </div>
            </div>
          )}
        </Show>

        <Show when={!status.loading && !status()}>
          <div class="relative border border-yellow-900/40 bg-yellow-950/20 px-3 py-2 max-w-xs">
            <span class="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-yellow-800/60" />
            <p class="text-yellow-700 font-serif text-xs">Plugin non installato —{" "}
              <a href="/docs" class="text-amber-600 hover:text-amber-400 underline transition-colors">scaricalo</a>
            </p>
          </div>
        </Show>
      </div>

    </div>
  );
}