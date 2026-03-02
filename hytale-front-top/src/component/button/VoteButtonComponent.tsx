import { createResource, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { notify } from "../notify/NotificationComponent";
import { VoteService } from "../../services/votes.service";
import { ServerResponse } from "../../types/ServerResponse";
import DiscordButtonComponent from "./DiscordButtonComponent";

interface Props { server: ServerResponse; onVoteRequest: (s: ServerResponse) => void; value: string }

export default function VoteButtonComponent(props: Props) {
  const auth = useAuth();

  const [voteRes] = createResource(
    () => auth.user()?.id,  // source — si rivaluta quando cambia
    (id) => VoteService.aviableVote(id)  // fetcher — parte solo se id è truthy
  );

  const canVote = () => voteRes()?.canVote ?? false;
  const waitTime = () => voteRes()?.message ?? "?";

  const handleClick = () => {
    if (!auth.isAuthenticated()) { notify("Accedi con Discord per votare", "error"); return; }
    if (!canVote()) { notify(`Riprova tra ${waitTime()}`, "error"); return; }
    console.log("Il bottone lo manda al padre");
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
          <Show when={auth.isAuthenticated()} fallback={
            <DiscordButtonComponent />
          }>
            <button
              disabled
              style={{
                padding: "0.5rem 1.2rem",
                background: "rgba(0, 0, 0, 0.46)",
                border: "1px solid #c54b23",
                "font-family": "'Cinzel', serif",
                "font-size": "0.55rem",
                "letter-spacing": "0.2em",
                "text-transform": "uppercase",
                color: "#ffeae1",
                cursor: "not-allowed",
                opacity: "0.86",
                "line-height": "1.8",
                "text-align": "center",
              }}
            >
              ᚦ Voto Bloccato {waitTime()}
            </button>
          </Show>


        </div>
      }>
        <button
          onClick={handleClick}
          class="relative px-6 py-2.5 border-2 border-amber-700/70 bg-amber-950/20 hover:bg-amber-900/30 hover:border-amber-600 text-amber-500 hover:text-amber-400 font-serif text-sm uppercase tracking-widest transition-all"
        >
          <span class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-600" />
          <span class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-600" />
          ⚔ {props.value}
        </button>
      </Show>
    </Show>
  );
}