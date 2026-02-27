import { createSignal, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";

type Props = {
  isOpen: boolean; onClose: () => void; onPlayerVote: () => void;
  onPlayerNameChange: (n: string) => void; player_game_name: string;
  server_id: number; server_name: string; server_ip: string;
  server_secret_key: string; discord_id_user: string;
};

const PlayersVoteModal = (props: Props) => {
  const auth = useAuth();
  const [name, setName] = createSignal("");
  const [error, setError] = createSignal("");

  const submit = () => {
    const n = name().trim();
    if (!n || n.length < 3) { setError("Nickname richiesto (min. 3 caratteri)"); return; }
    setError("");
    props.onPlayerVote();
  };

  const avatar = auth.user()?.avatar
    ? `https://cdn.discordapp.com/avatars/${auth.user()?.id}/${auth.user()?.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  return (
    <Show when={props.isOpen && auth.isAuthenticated()}>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={props.onClose}>
        <div class="relative w-full max-w-sm bg-stone-950 border-2 border-amber-900/50 p-6 shadow-2xl shadow-black" onClick={e => e.stopPropagation()}>

          {/* corners */}
          <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-700" />
          <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-700" />
          <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-700" />
          <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-700" />

          {/* user */}
          <div class="flex items-center gap-3 mb-5">
            <img src={avatar} class="w-12 h-12 border border-stone-700" alt="avatar" />
            <div>
              <p class="font-serif font-bold text-amber-400">{auth.user()?.global_name}</p>
              <p class="text-stone-600 text-xs font-serif">ID: {auth.user()?.id?.slice(0, 8)}...</p>
            </div>
          </div>

          <div class="h-px bg-amber-900/30 mb-5" />

          <p class="text-stone-500 font-serif text-xs mb-4 leading-relaxed">
            Inserisci il tuo nickname Hytale per votare <span class="text-amber-600">{props.server_name}</span>.<br />
            Ritira i premi con <span class="text-amber-500 font-bold">/claim</span>.
          </p>

          <input
            type="text"
            placeholder="Il tuo nickname..."
            value={props.player_game_name}
            onInput={e => { setName(e.currentTarget.value); props.onPlayerNameChange(e.currentTarget.value); }}
            autofocus
            class="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 focus:border-amber-800 text-stone-300 font-serif text-sm outline-none transition-colors placeholder:text-stone-600 mb-2"
          />

          <Show when={error()}>
            <p class="text-red-600 font-serif text-xs mb-3">⚠ {error()}</p>
          </Show>

          <div class="flex gap-2 mt-4">
            <button onClick={props.onClose} class="flex-1 py-2.5 border border-stone-700 text-stone-500 hover:text-stone-400 font-serif text-xs uppercase tracking-wide transition-all">
              Annulla
            </button>
            <button
              onClick={submit}
              disabled={!name().trim()}
              class="flex-1 py-2.5 border border-amber-800/60 bg-amber-950/30 text-amber-500 hover:text-amber-400 hover:bg-amber-950/50 font-serif text-xs uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ⚔ Vota
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default PlayersVoteModal;