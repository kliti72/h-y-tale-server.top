import { A } from "@solidjs/router";

export default function ServerNotFound(props : { serverName: string }) {
    return (
    <div class="text-center py-20">
        <div class="text-6xl mb-6">❌</div>
        <h2 class="text-3xl font-bold text-white mb-4"> Server non trovato </h2>
        <p class="text-violet-300 text-lg mb-8"> Il server <strong class="text-fuchsia-400">{props.serverName}</strong> non esiste nel database bro, come ci sei finito qui </p>
        <A href="/" class="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold hover:scale-105 transition-transform">
            ← Torna ai Server
        </A>
    </div>)
}