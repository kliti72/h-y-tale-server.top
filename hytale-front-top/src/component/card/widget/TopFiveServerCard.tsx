import { createResource, For, Show } from "solid-js"
import { ServerService } from "../../../services/server.service"
import { A } from "@solidjs/router";

export default function TopFiveServerCard() {
  const [top_server] = createResource(() => 
    ServerService.getServerParams({ limit: 5, sort: 'votes:desc' })
  );

  return (
    <div class="bg-gray-900/90 rounded-2xl p-6 border border-violet-900/50 mb-6">
      <h3 class="text-2xl font-bold text-fuchsia-400 mb-6">🏆 Top 5</h3>
      <Show when={top_server()} fallback={<p class="text-violet-400">Caricamento...</p>}>
        <For each={top_server()?.data?.slice(0, 5)}>
          {(server, i) => (
            <A href={`/server/${server.id}`} class="flex items-center gap-4 py-4 border-b border-violet-900/30 last:border-0">
              <span class={`text-4xl font-black w-12 text-center 
                ${i() === 0 ? 'text-yellow-400' : i() === 1 ? 'text-gray-300' : i() === 2 ? 'text-amber-600' : 'text-violet-500'}`}>
                #{i() + 1}
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-bold truncate">{server.name}</p>
                <p class="text-sm text-violet-400">🔥 {server.votes ?? 0} voti</p>
              </div>
            </A>
          )}
        </For>
      </Show>
    </div>
  );
}