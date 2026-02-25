import { createResource, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { notify } from "../notify/NotificationComponent";
import { VoteService } from "../../services/votes.service";
import { ServerResponse } from "../../types/ServerResponse";

interface Props { server: ServerResponse; onVoteRequest: (s: ServerResponse) => void; }

export default function VoteButtonComponent(props: Props) {
  const auth = useAuth();
  const [voteRes] = createResource(VoteService.aviableVote);
  const canVote = () => voteRes()?.success ?? false;
  const waitTime = () => voteRes()?.wait_time ?? "?";

  const handleClick = () => {
    if (!auth.isAuthenticated()) { notify("Accedi con Discord per votare", "error"); return; }
    if (!canVote()) { notify(`Riprova tra ${waitTime()}h`, "error"); return; }
    props.onVoteRequest(props.server);
  };

  return (
    <Show when={!voteRes.loading} fallback={
      <button disabled class="flex items-center gap-2 px-5 py-2.5 border border-stone-700 text-stone-600 font-serif text-xs uppercase tracking-widest animate-pulse">
        <div class="w-3 h-3 border border-stone-600 border-t-transparent rounded-full animate-spin" />
        Verifica voto...
      </button>
    }>
      <Show when={canVote()} fallback={
        <div class="flex items-center gap-3">
          <button disabled class="px-5 py-2.5 border border-red-900/40 bg-red-950/20 text-red-700 font-serif text-xs uppercase tracking-widest cursor-not-allowed">
            ⚠ Voto bloccato
          </button>
          <span class="text-amber-700 font-serif text-xs">⏳ Riprova tra <strong>{waitTime()}h</strong></span>
        </div>
      }>
        <button
          onClick={handleClick}
          class="relative px-6 py-2.5 border-2 border-amber-700/70 bg-amber-950/20 hover:bg-amber-900/30 hover:border-amber-600 text-amber-500 hover:text-amber-400 font-serif text-sm uppercase tracking-widest transition-all"
        >
          <span class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-600" />
          <span class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-600" />
          ⚔ Vota
        </button>
      </Show>
    </Show>
  );
}