import { createSignal, For } from "solid-js";

// Types per le stats mockate
type PlayerActivity = {
  time: string;
  count: number;
};

export default function ServerTabStats() {
    // Activity chart data mockato
      const [playerActivity] = createSignal<PlayerActivity[]>([
        { time: '00:00', count: 12 },
        { time: '04:00', count: 8 },
        { time: '08:00', count: 15 },
        { time: '12:00', count: 34 },
        { time: '16:00', count: 52 },
        { time: '20:00', count: 47 },
      ]);
      
    return (
        <div class="space-y-6">
            <div>
                <h3 class="text-2xl font-bold text-white mb-6">Player Activity (24h)</h3>

                {/* Chart semplice */}
                <div class="bg-violet-950/30 rounded-xl p-6 border border-violet-800/30">
                    <div class="flex items-end justify-between h-48 gap-2">
                        <For each={playerActivity()}>
                            {(data) => (
                                <div class="flex-1 flex flex-col items-center gap-2">
                                    <div class="relative w-full bg-violet-900/40 rounded-t-lg overflow-hidden">
                                        <div
                                            class="bg-gradient-to-t from-fuchsia-600 to-purple-500 rounded-t-lg transition-all duration-500"
                                            style={{ height: `${(data.count / 60) * 100}%` }}
                                        />
                                    </div>
                                    <div class="text-xs text-violet-400 font-medium">{data.time}</div>
                                    <div class="text-sm font-bold text-white">{data.count}</div>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6">
                    <h4 class="text-lg font-bold text-fuchsia-400 mb-4">Performance</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-violet-300">Ping Medio</span>
                            <span class="font-bold text-white">{mockStats().ping}ms</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-violet-300">Uptime</span>
                            <span class="font-bold text-green-400">{mockStats().uptime}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-violet-300">TPS</span>
                            <span class="font-bold text-white">19.8</span>
                        </div>
                    </div>
                </div>

                <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6">
                    <h4 class="text-lg font-bold text-fuchsia-400 mb-4">Statistiche</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-violet-300">Voti Totali</span>
                            <span class="font-bold text-white">{0}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-violet-300">Player Unici</span>
                            <span class="font-bold text-white">2,847</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-violet-300">Record Player</span>
                            <span class="font-bold text-fuchsia-400">97</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}