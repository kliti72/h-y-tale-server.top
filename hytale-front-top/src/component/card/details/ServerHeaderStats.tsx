import { createSignal, Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";

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

export function ServerHeaderStats(props: { server: ServerResponse }) {
    // Stats mockate (in futuro da API)
    const [mockStats] = createSignal<ServerStats>({
        online: true,
        players: { online: 47, max: 100 },
        uptime: "99.8%",
        version: "1.20.4",
        ping: 23
    });

    return (<div class="flex-1">
        <div class="flex items-center gap-4 mb-4">
            <Show
                when={props.server.logo_url}
                fallback={
                    <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {props.server.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                }
            >
                <img
                    src={props.server.logo_url}
                    alt={`${props.server.name} logo`}
                    class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-violet-500/50 shadow-xl shadow-violet-900/40"
                    onError={(e) => {
                        // Fallback se l'immagine non carica
                        e.currentTarget.src = ""; // o una tua immagine placeholder
                        e.currentTarget.classList.add("hidden");
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                />
                {/* Hidden fallback visibile solo se img fallisce */}
                <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg hidden">
                    {props.server.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
            </Show>

            <h1 class="text-4xl md:text-6xl font-black bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                {props.server.name}
            </h1>
            {mockStats().online ? (
                <span class="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm font-medium flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                </span>
            ) : (
                <span class="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-300 text-sm font-medium">
                    Offline
                </span>
            )}
        </div>

        <p class="text-xl text-violet-200 mb-6">
            Esplora uno dei server più fighi della community 🎮✨
        </p>

        {/* Quick stats */}
        <div class="flex flex-wrap items-center gap-4 text-sm">
            <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                <span>👥</span>
                <span class="font-bold text-white">{mockStats().players.online}/{mockStats().players.max}</span>
                <span class="text-violet-300">giocatori</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                <span>🔥</span>
                <span class="font-bold text-white">0</span>
                <span class="text-violet-300">voti</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                <span>⭐</span>
                <span class="font-bold text-white">{0}</span>
                <span class="text-violet-300">rating</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-violet-950/50 rounded-lg border border-violet-800/30">
                <span>📡</span>
                <span class="font-bold text-white">{mockStats().ping}ms</span>
                <span class="text-violet-300">ping</span>
            </div>
        </div>
    </div>)

}