import { createSignal, Show } from "solid-js";

export default function ServerContactTab() {
    const [activeTab, setActiveTab] = createSignal<'overview' | 'stats' | 'reviews' | 'events'>('overview');
    
    return(<main class="lg:col-span-8 space-y-8">
                  
                  {/* Tabs */}
                  <div class="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl border border-violet-900/50 backdrop-blur-md overflow-hidden">
                    <div class="flex border-b border-violet-800/50 overflow-x-auto">
                      {[
                        { id: 'overview', label: 'Panoramica', icon: '📊' },
                        { id: 'stats', label: 'Statistiche', icon: '📈' },
                        { id: 'reviews', label: 'Recensioni', icon: '⭐' },
                        { id: 'events', label: 'Eventi', icon: '🎉' }
                      ].map(tab => (
                        <button
                          onClick={() => setActiveTab(tab.id as any)}
                          class={`
                            flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-all
                            ${activeTab() === tab.id
                              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-b-2 border-fuchsia-400"
                              : "text-violet-300 hover:bg-violet-950/40"}
                          `}
                        >
                          <span class="text-xl">{tab.icon}</span>
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div class="p-6 md:p-8">
                      
                      {/* Tab: Overview */}
                      <Show when={activeTab() === 'overview'}>
                        <div class="space-y-6">
                          <div>
                            <h3 class="text-2xl font-bold text-white mb-4">Descrizione</h3>
                            <p class="text-violet-200 leading-relaxed">
                              {/* {server()?.rules} */}
                            </p>
                          </div>
                          server rules table
                        </div>
                      </Show>

                      {/* Tab: Stats */}
                      <Show when={activeTab() === 'stats'}>
                        Tab stats
                      </Show>

                      {/* Tab: Reviews */}
                      <Show when={activeTab() === 'reviews'}>
                        Recensioni
                      </Show>

                      {/* Tab: Events */}
                      <Show when={activeTab() === 'events'}>
                        tab events
                      </Show>
                    </div>
                  </div>
                </main>);
}