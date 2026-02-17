import { createSignal, Show } from "solid-js";

type ServerStats = {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  uptime: string;
  version: string;
  ping: number;
};

  // Stats mockate (in futuro da API)
  const [mockStats] = createSignal<ServerStats>({
    online: true,
    players: { online: 47, max: 100 },
    uptime: "99.8%",
    version: "1.20.4",
    ping: 23
  });

  
export default function ServerInfoCard() {
    <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-6 border border-violet-900/50 backdrop-blur-md sticky top-6">
                    <h3 class="text-xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
                      <span>ℹ️</span> Info Server
                    </h3>

                    <div class="space-y-4">
                      <div>
                        <div class="text-sm text-violet-400 mb-1">Versione</div>
                        <div class="text-lg font-semibold text-white flex items-center gap-2">
                          <span>🎮</span> {mockStats().version}
                        </div>
                      </div>

                      <div>
                        <div class="text-sm text-violet-400 mb-1">Uptime</div>
                        <div class="text-lg font-semibold text-white flex items-center gap-2">
                          <span>⚡</span> {mockStats().uptime}
                        </div>
                      </div>

                      <div>
                        <div class="text-sm text-violet-400 mb-1">Creato il</div>
                      </div>

                      <div>
                        <div class="text-sm text-violet-400 mb-2">Modalità</div>
                        <div class="flex flex-wrap gap-2">
                          <Show 
                            when={tagsArray().length > 0} 
                            fallback={
                              <span class="text-sm text-violet-500 italic">Nessun tag</span>
                            }
                          >
                            <For each={tagsArray()}>
                              {(tag) => (
                                <span class="px-3 py-1.5 bg-violet-950/60 border border-violet-700/50 rounded-full text-sm text-violet-200">
                                  #{tag}
                                </span>
                              )}
                            </For>
                          </Show>
                        </div>
                      </div>
                    </div>
                  </div>
}