import { createSignal } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { notify } from "../template/Notification";

export default function SaveButton() {
    const auth = useAuth();
    const [isFavorite, setIsFavorite] = createSignal(false);
    
    const toggleFavorite = () => {
        if (!auth.isAuthenticated()) {
            notify("Fai login per salvare nei preferiti bro 🔐", "error");
            return;
        }
        setIsFavorite(!isFavorite());
        notify(isFavorite() ? "Aggiunto ai preferiti! ⭐" : "Rimosso dai preferiti", "info");
    };

    return (<button
        onClick={toggleFavorite}
        class={`
                                flex-1 flex items-center justify-center gap-2 px-6 py-3 
                                rounded-xl font-semibold transition-all duration-300
                                ${isFavorite()
                ? "bg-yellow-500/20 border-2 border-yellow-500/50 text-yellow-300"
                : "bg-violet-950/60 border-2 border-violet-700/50 text-violet-300 hover:bg-violet-900/80"}
                              `}
    >
        <span class="text-xl">{isFavorite() ? "⭐" : "☆"}</span>
        {isFavorite() ? "Salvato" : "Salva"}
    </button>)
}