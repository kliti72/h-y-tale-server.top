import { Component, For } from "solid-js";

const ServerPageHero: Component = () => {

    const communityStats = [
        { label: "Voti Oggi", value: 1, icon: "🔥", color: "from-orange-500 to-red-500" },
        { label: "Player Online", value: 5, icon: "👥", color: "from-blue-500 to-cyan-500" },
        { label: "Server Trending", value: 2, icon: "📈", color: "from-purple-500 to-pink-500" }
    ];

   return(
     <div class="relative overflow-hidden">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute w-96 h-96 bg-purple-500/20 blur-3xl -top-20 -left-20 animate-pulse" />
            <div class="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse" />
        </div>
        <div class="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 class="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Top Server Hytale
            </h1>
            <p class="text-xl md:text-2xl text-violet-300 max-w-3xl mx-auto mb-8">
                Scopri, vota e domina i regni più epici 🎮✨
            </p>
        </div>
    </div>
   )
}

export default ServerPageHero;