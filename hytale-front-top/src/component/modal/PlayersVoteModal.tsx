import { createSignal, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext"; // presumo esista
import Notifications, { notify } from "../template/Notification";

type Vote = {
  playerName: string;
  serverVoted: string;
};

type VoteServerProps = {
  serverVoted: string;      // nome server già scelto
  serverIp?: string;        // opzionale, se ti serve dopo
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Vote) => void | Promise<void>;
};

const PlayersVoteModal = (props: VoteServerProps) => {
  const auth = useAuth();

  const [playerName, setPlayerName] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = async () => {
    const name = playerName().trim();

    if (!name) {
      setError("Inserisci il tuo nickname!");
      return;
    }

    if (name.length < 3) {
      setError("Il nickname deve avere almeno 3 caratteri.");
      return;
    }

    setError(null);

    const voteData: Vote = {
      playerName: name,
      serverVoted: props.serverVoted,
    };

    try {
      // Se hai una funzione onSubmit dal genitore (es: invio al backend)
      if (props.onSubmit) {
        await props.onSubmit(voteData);
      }

      notify(`Hai votato ${props.serverVoted} come ${name}! 🎮`);
      props.onClose();
    } catch (err) {
      setError("Qualcosa è andato storto. Riprova.");
      notify("Errore durante il voto 😕",); // se hai tipi di notifica
    }
  };

  return (
    <Show when={props.isOpen && auth.isAuthenticated()}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={props.onClose}
      >
        <div
          class={`
            bg-zinc-900 border border-zinc-500 rounded-xl 
            w-full max-w-md sm:max-w-lg 
            p-6 sm:p-8 shadow-2xl shadow-black/50
            max-h-[90vh] overflow-y-auto
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con logo Discord */}
{/* Header con avatar dell'utente Discord */}
<div class="flex flex-col items-center mb-6">
  <div class="relative mb-3">
    <img
      src={
                auth.user()?.avatar
                ? `https://cdn.discordapp.com/avatars/${auth.user()?.id}/${auth.user()?.avatar}.png?size=256`
                : `https://cdn.discordapp.com/embed/avatars/0.png` 
            }
            alt="Il tuo avatar Discord"
            class="w-20 h-20 rounded-full object-cover border-4 border-zinc-700 shadow-lg"
            />
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-zinc-900" />

        </div>

            <div class="text-white"> {auth.user()?.global_name} </div>


        <h2 class="text-2xl font-bold text-white text-center">
            Vota il Server
        </h2>
        <p class="text-zinc-400 text-sm mt-1">
            Scrivi qui il nome del giocatore di Hytale.
            <br> </br>Ritira i tuoi premi nel server con <span style={{color: "violet"}}> /claim. </span>
            
        </p>
        </div>

          {/* Nome Server (fisso / disabilitato) */}
          <div class="mb-6">
            <label class="block text-zinc-400 text-sm mb-1.5 font-medium">
              Server selezionato
            </label>
            <input
              type="text"
              disabled
              value={props.serverVoted}
              class="
                w-full px-4 py-3 bg-zinc-800/70 border border-zinc-600 
                rounded-lg text-zinc-300 cursor-not-allowed
                opacity-80
              "
            />
          </div>

          {/* Nome Giocatore */}
          <div class="mb-6">
            <label class="block text-zinc-400 text-sm mb-1.5 font-medium">
              Il tuo Nickname in gioco
            </label>
            <input
              type="text"
              value={playerName()}
              onInput={(e) => setPlayerName(e.currentTarget.value)}
              placeholder="Es. xX_DarkKiller_Xx"
              class="
                w-full px-4 py-3 bg-zinc-800 border border-zinc-700 
                rounded-lg text-white placeholder-zinc-500 
                focus:outline-none focus:border-emerald-600 
                focus:ring-1 focus:ring-emerald-600/30
                transition-all
              "
              autofocus
            />
          </div>

          {/* Errore */}
          <Show when={error()}>
            <p class="text-red-400 text-sm mb-4 text-center font-medium">
              {error()}
            </p>
          </Show>

          {/* Pulsanti */}
          <div class="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={props.onClose}
              class="
                flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 
                text-zinc-300 rounded-lg transition-colors font-medium
              "
            >
              Annulla
            </button>

            <button
              onClick={handleSubmit}
              class="
                flex-1 py-3.5 bg-gradient-to-r from-emerald-700 to-teal-700 
                hover:from-emerald-600 hover:to-teal-600 
                text-white font-medium rounded-lg 
                transition-all shadow-md shadow-emerald-950/40
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={!playerName().trim()}
            >
              Vota Server
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default PlayersVoteModal;