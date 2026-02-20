import { createResource, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { notify } from "../template/Notification";
import { VoteService } from "../../services/votes.service";
import { ServerResponse } from "../../types/ServerResponse";

interface VoteButtonProps {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
}

export default function VoteButton(props: VoteButtonProps) {
  const auth = useAuth();
  const [aviableVoteResource] = createResource(VoteService.aviableVote);
  const canVote = () => aviableVoteResource()?.success ?? false;
  const waitTime = () => aviableVoteResource()?.wait_time ?? "?";

  const handleClick = () => {
    if (!auth.isAuthenticated()) {
      notify("Fai login con Discord per votare bro 🔐", "error");
      return;
    }
    if (!canVote()) {
      notify(`Puoi votare di nuovo tra ${waitTime()} ⏳`, "error");
      return;
    }
    props.onVoteRequest(props.server);
  };

  return (
    <Show
      when={!aviableVoteResource.loading}
      fallback={
        /* ── Loading ── */
        <button disabled class="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold border opacity-50 cursor-not-allowed border-violet-800/40 bg-violet-950/40 text-violet-500">
          <span class="text-xl animate-spin">⏳</span>
          Controllo...
        </button>
      }
    >
      <Show
        when={canVote()}
        fallback={
          /* ── Cannot vote yet ── */
          <div class="flex flex-col items-center gap-2">
            <button
              disabled
              class="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold border border-red-800/50 bg-red-950/30 text-red-400/70 cursor-not-allowed shadow-inner"
            >
              <span class="text-xl">⏰</span>
              Già votato
            </button>

            {/* Cooldown badge */}
            <div class="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-800/40 bg-orange-950/20">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span class="text-orange-400/80 text-xs font-medium">
                Prossimo voto tra{" "}
                <span class="text-orange-300 font-bold">{waitTime()}h</span>
              </span>
            </div>
          </div>
        }
      >
        {/* ── Can vote ── */}
        <button
          onClick={handleClick}
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
          Vota ora
        </button>
      </Show>
    </Show>
  );
}