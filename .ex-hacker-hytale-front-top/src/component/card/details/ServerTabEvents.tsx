export default function ServerTabEvents() {
    return (<div class="space-y-6">
        <div class="text-center py-12">
            <div class="text-6xl mb-4">🎉</div>
            <h3 class="text-2xl font-bold text-white mb-2">Eventi in Arrivo</h3>
            <p class="text-violet-300 mb-6">
                Tornei, build competition e molto altro!
            </p>
        </div>

        <div class="grid gap-4">
            {[
                {
                    title: "Torneo PvP Weekend",
                    date: "Sabato 28 Feb • 18:00",
                    prize: "100€",
                    type: "pvp",
                    icon: "⚔️",
                    color: "from-red-600 to-orange-600"
                },
                {
                    title: "Build Competition",
                    date: "Domenica 1 Mar • 15:00",
                    prize: "Premium Rank",
                    type: "build",
                    icon: "🏗️",
                    color: "from-blue-600 to-cyan-600"
                },
                {
                    title: "Drop Party",
                    date: "Venerdì 27 Feb • 20:00",
                    prize: "Items Rari",
                    type: "party",
                    icon: "🎁",
                    color: "from-purple-600 to-pink-600"
                }
            ].map(event => (
                <div class={`
                                bg-gradient-to-r ${event.color} p-1 rounded-xl
                                hover:scale-102 transition-transform
                              `}>
                    <div class="bg-gray-900/90 rounded-xl p-6">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex items-start gap-4">
                                <span class="text-4xl">{event.icon}</span>
                                <div>
                                    <h4 class="text-xl font-bold text-white mb-1">{event.title}</h4>
                                    <p class="text-violet-300 text-sm mb-2">{event.date}</p>
                                    <span class="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs text-yellow-300 font-medium">
                                        🏆 {event.prize}
                                    </span>
                                </div>
                            </div>
                            <button class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">
                                Partecipa
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    )
}