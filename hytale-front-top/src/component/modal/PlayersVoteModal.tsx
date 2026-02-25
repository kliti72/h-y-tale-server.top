import { createSignal, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";

type VoteServerProps = {
  server_id: number;
  discord_id_user: string;
  server_ip: string;
  server_name: string;
  server_secret_key: string;
  player_game_name: string;
  isOpen: boolean;
  onClose: () => void;
  onPlayerVote: () => void;
  onPlayerNameChange: (playerName: string) => string;
};

const PlayersVoteModal = (props: VoteServerProps) => {
  const auth = useAuth();
  const [playerName, setPlayerName] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);

  const handleSubmit = async () => {
    const name = playerName().trim();
    if (!name) { setError("⚠ NICKNAME_REQUIRED // campo obbligatorio"); return; }
    if (name.length < 3) { setError("⚠ NICKNAME_TOO_SHORT // minimo 3 caratteri"); return; }
    setError(null);
    props.onPlayerNameChange(playerName());
    props.onPlayerVote();
  };

  return (
    <Show when={props.isOpen && auth.isAuthenticated()}>
      {/* Backdrop */}
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(0,0,0,0.85)",
          "backdrop-filter": "blur(4px)",
        }}
        onClick={props.onClose}
      >
        {/* Modal */}
        <div
          class="relative w-full max-w-md overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #000500 0%, #000a02 100%)",
            border: "1px solid rgba(0,255,65,0.25)",
            "box-shadow": "0 0 60px rgba(0,255,65,0.08), 0 0 120px rgba(0,0,0,0.8)",
            "font-family": "'Share Tech Mono', monospace",
            "max-height": "90vh",
            "overflow-y": "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Corner decorations */}
          <div class="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-500/50 pointer-events-none z-10" />
          <div class="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-green-500/50 pointer-events-none z-10" />
          <div class="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-green-500/50 pointer-events-none z-10" />
          <div class="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-500/50 pointer-events-none z-10" />

  

          <div class="relative z-10 p-6 sm:p-8">

            {/* Top status bar */}
 

            {/* Avatar + user info */}
            <div class="flex flex-col items-center mb-8">
              <div class="relative mb-4">
                {/* Avatar con border hacker */}
                <div
                  class="relative"
                  style={{ "box-shadow": "0 0 25px rgba(0,255,65,0.12)" }}
                >
                  <div class="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-green-500/60 pointer-events-none" />
                  <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-green-500/60 pointer-events-none" />
                  <img
                    src={
                      auth.user()?.avatar
                        ? `https://cdn.discordapp.com/avatars/${auth.user()?.id}/${auth.user()?.avatar}.png?size=256`
                        : `https://cdn.discordapp.com/embed/avatars/0.png`
                    }
                    alt="Discord avatar"
                    class="w-18 h-18 object-cover"
                    style={{ width: "72px", height: "72px", filter: "saturate(0.8) brightness(0.9)" }}
                  />
                  {/* Online dot */}
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2"
                    style={{ "border-color": "#000500", "box-shadow": "0 0 8px rgba(0,255,65,0.5)" }}
                  />
                </div>
              </div>

              {/* Username */}
              <div class="text-green-400 text-xs tracking-widest uppercase mb-1">
                &gt; USER_IDENTIFIED
              </div>
              <div
                class="text-white text-lg font-black mb-1"
                style={{ "font-family": "'Orbitron', monospace" }}
              >
                {auth.user()?.global_name}
              </div>
              <div class="text-green-800/50 text-xs tracking-widest">
                ID: {auth.user()?.id?.slice(0, 8)}...
              </div>
            </div>

            {/* Divider */}
            <div
              class="mb-6 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.2) 30%, rgba(0,255,65,0.2) 70%, transparent)" }}
            />

            {/* Subtitle */}
            <p class="text-xs text-green-800/60 text-center mb-6 leading-relaxed tracking-wide">
              <span class="text-green-700/40">&gt;&gt; </span>
              Inserisci il tuo nickname Hytale per votare.<br />
              Ritira i premi in-game con{" "}
              <span class="text-green-400 font-bold">/claim</span>
            </p>

            {/* Server selezionato */}
            <div class="mb-5">
              <div class="text-green-700/50 text-xs tracking-widest uppercase mb-2">
                &gt; TARGET_SERVER
              </div>
              <div
                class="w-full px-4 py-3 text-green-700/60 text-sm border border-green-900/30 bg-black/50 cursor-not-allowed tracking-wide"
                style={{ "font-family": "'Share Tech Mono', monospace" }}
              >
                {props.server_name}
              </div>
            </div>

            {/* Nickname input */}
            <div class="mb-6">
              <div class="text-green-700/50 text-xs tracking-widest uppercase mb-2">
                &gt; PLAYER_NICKNAME
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 text-xs">▶</span>
                <input
                  type="text"
                  value={props.player_game_name}
                  onInput={(e) => {
                    setPlayerName(e.currentTarget.value);
                    props.onPlayerNameChange(e.currentTarget.value);
                  }}
                  placeholder="Es. xX_DarkKiller_Xx"
                  autofocus
                  class="w-full pl-7 pr-4 py-3 text-sm bg-black/60 border border-green-900/50 text-green-300 placeholder-green-900/40 focus:outline-none focus:border-green-600/60 transition-colors"
                  style={{ "font-family": "'Share Tech Mono', monospace" }}
                />
              </div>
            </div>

            {/* Error */}
            <Show when={error()}>
              <div
                class="mb-4 px-4 py-2 border border-red-800/50 bg-red-900/20 text-red-400 text-xs tracking-widest"
              >
                {error()}
              </div>
            </Show>

            {/* Buttons */}
            <div class="flex gap-3 mt-6">
              <button
                onClick={props.onClose}
                class="flex-1 py-3 text-xs tracking-widest uppercase border border-green-900/40 text-green-800/60 bg-black/40 hover:border-green-800/60 hover:text-green-700/80 transition-all"
                style={{ "font-family": "'Share Tech Mono', monospace" }}
              >
                [ANNULLA]
              </button>

              <button
                onClick={handleSubmit}
                disabled={!playerName().trim()}
                class="flex-1 py-3 text-xs tracking-widest uppercase border text-green-400 bg-green-900/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  "font-family": "'Share Tech Mono', monospace",
                  "border-color": playerName().trim() ? "rgba(0,255,65,0.5)" : "rgba(0,255,65,0.15)",
                  "box-shadow": playerName().trim() ? "0 0 20px rgba(0,255,65,0.1)" : "none",
                }}
              >
                ⬡ ESEGUI_VOTO.exe
              </button>
            </div>



          </div>
        </div>
      </div>
    </Show>
  );
};

export default PlayersVoteModal;