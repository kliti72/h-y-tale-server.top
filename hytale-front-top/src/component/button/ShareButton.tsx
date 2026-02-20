import { createSignal, Show } from "solid-js";
import { notify } from "../template/Notification";
import { ServerResponse } from "../../types/ServerResponse";

export default function ShareButton(props : {server : ServerResponse}) {
    const [showShareMenu, setShowShareMenu] = createSignal(false);
    
     const shareServer = (platform: string) => {
        const url = window.location.href;
        let text = `Guarda questo server Hytale!`;
        
        switch(platform) {
          case 'twitter':
            if(props.server.name && props.server.ip) {  
                text = `Guardate il server ${props.server.name}, potete giocarci dall'indirizzo ip ${props.server.ip} su hytale. Se volete altre informazioni ecco il link: `
            }
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
            break;
          case 'discord':
            if(props.server.discord_url) {
                notify("Link copiato per Discord! 💬", "success");
                navigator.clipboard.writeText(props.server.discord_url);
            } else {
                notify("Questo server non ha discord", "error");
            }
            break;  
          case 'copy':
            navigator.clipboard.writeText(url);
            notify("Link copiato! 🔗", "success");
            break;
        }
        setShowShareMenu(false);
      };
      
    return (<div class="relative">
        <button
            onClick={() => setShowShareMenu(!showShareMenu())}
            class="flex items-center justify-center gap-2 px-6 py-3  bg-violet-950/60 border-2 border-violet-700/50  rounded-xl font-semibold text-violet-300 hover:bg-violet-900/80 transition-all"
        >
            <span class="text-xl">🔗</span>
            Share
        </button>

        <Show when={showShareMenu()}>
            <div class="absolute right-0 mt-2 w-48 bg-gray-900 border border-violet-700 rounded-xl shadow-2xl z-10 overflow-hidden">
                <button
                    onClick={() => shareServer('twitter')}
                    class="w-full px-4 py-3 text-left hover:bg-violet-950/60 transition-colors flex items-center gap-3"
                >
                    <span>🐦</span> Twitter
                </button>
                <button
                    onClick={() => shareServer('discord')}
                    class="w-full px-4 py-3 text-left hover:bg-violet-950/60 transition-colors flex items-center gap-3"
                >
                    <span>💬</span> Discord
                </button>
                <button
                    onClick={() => shareServer('copy')}
                    class="w-full px-4 py-3 text-left hover:bg-violet-950/60 transition-colors flex items-center gap-3">
                    <span>📋</span> Copia Link
                </button>
            </div>
        </Show>

    </div>)
}