import { createSignal, Show } from "solid-js";
import { notify } from "../template/Notification";

export default function ShareButton() {
    const [showShareMenu, setShowShareMenu] = createSignal(false);
    
     const shareServer = (platform: string) => {
        const url = window.location.href;
        const text = `Guarda questo server Minecraft!`;
        
        switch(platform) {
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
            break;
          case 'discord':
            notify("Link copiato per Discord! 💬", "success");
            navigator.clipboard.writeText(url);
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