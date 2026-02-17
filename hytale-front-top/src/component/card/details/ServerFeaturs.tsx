export default function ServerFeaturs() {
    return(
        <div>
                            <h3 class="text-2xl font-bold text-white mb-4">Features Principali</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { icon: "⚔️", title: "PvP Arena", desc: "Arena dedicata con kit bilanciati" },
                                { icon: "💰", title: "Economy", desc: "Sistema economico completo e fair" },
                                { icon: "🏆", title: "Tornei", desc: "Eventi settimanali con premi" },
                                { icon: "🛡️", title: "Land Claims", desc: "Proteggi le tue build" },
                                { icon: "🎁", title: "Daily Rewards", desc: "Ricompense giornaliere" },
                                { icon: "👥", title: "Community", desc: "Discord attivo 24/7" }
                              ].map(feature => (
                                <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-4 hover:bg-violet-900/50 transition-colors">
                                  <div class="flex items-start gap-3">
                                    <span class="text-3xl">{feature.icon}</span>
                                    <div>
                                      <h4 class="font-bold text-white mb-1">{feature.title}</h4>
                                      <p class="text-sm text-violet-300">{feature.desc}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
    )
}