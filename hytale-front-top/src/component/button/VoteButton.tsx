import { createSignal } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { notify } from "../template/Notification";

export default function VoteButton() {
    const [isModalOpen, setIsModalOpen] = createSignal(false);
    const auth = useAuth();

    return (<button
        onClick={() => {
            if (auth.isAuthenticated()) {
                setIsModalOpen(true);
            } else {
                notify("Fai login con Discord per votare bro 🔐", "error");
            }
        }}
        class="
                              flex items-center justify-center gap-3 px-8 py-4 
                              bg-gradient-to-r from-fuchsia-600 to-purple-600 
                              hover:from-fuchsia-500 hover:to-purple-500
                              rounded-xl text-lg font-bold shadow-lg shadow-fuchsia-900/50
                              hover:scale-105 active:scale-95 transition-all duration-300
                              border border-fuchsia-400/50
                            "
    >
        <span class="text-2xl">🔥</span>
        Vota Questo Server
    </button>)
}