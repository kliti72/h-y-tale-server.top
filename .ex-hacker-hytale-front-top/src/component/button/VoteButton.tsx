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
  const [aviableVoteResource] = createResource(VoteService.aviableVote(auth.user()?.id ?? ''));
  const canVote = () => aviableVoteResource()?.success ?? false;
  const waitTime = () => aviableVoteResource()?.wait_time ?? "?";

  const handleClick = () => {
    if (!auth.isAuthenticated()) {
      notify("AUTH_REQUIRED // fai login con Discord", "error");
      return;
    }
    if (!canVote()) {
      notify(`COOLDOWN_ACTIVE // riprova tra ${waitTime()}h`, "error");
      return;
    }
    props.onVoteRequest(props.server);
  };

  return (
    <Show
      when={!aviableVoteResource.loading}
      fallback={
        <button
          disabled
          class="relative flex justify-center gap-3 px-6 py-3 text-xs tracking-widest uppercase cursor-not-allowed opacity-40"
          style={{
            "font-family": "'Share Tech Mono', monospace",
            border: "1px solid rgba(0,255,65,0.15)",
            color: "rgba(0,255,65,0.4)",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <span class="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin" />
          CHECKING_VOTE_STATUS...
        </button>
      }
    >
      <Show
        when={canVote()}
        fallback={
          <div class="flex flex-col gap-2">
            {/* Cannot vote */}
            <button
              disabled
              class="relative flex justify-center gap-3 px-6 py-3 text-xs tracking-widest uppercase cursor-not-allowed"
              style={{
                "font-family": "'Share Tech Mono', monospace",
                border: "1px solid rgba(255,80,80,0.25)",
                color: "rgba(255,80,80,0.4)",
                background: "rgba(20,0,0,0.5)",
              }}
            >
              <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-700/30 pointer-events-none" />
              <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-red-700/30 pointer-events-none" />
              ⚠ VOTE_LOCKED
            </button>

            {/* Cooldown badge */}
            <div
              class="flex gap-2 px-3 py-1.5 text-xs"
              style={{
                "font-family": "'Share Tech Mono', monospace",
                border: "1px solid rgba(255,140,0,0.2)",
                background: "rgba(10,5,0,0.6)",
                color: "rgba(255,140,0,0.55)",
              }}
            >
              <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{ "box-shadow": "0 0 4px rgba(255,140,0,0.5)" }} />
              COOLDOWN:{" "}
              <span style={{ color: "rgba(255,160,0,0.8)", "font-weight": "bold" }}>{waitTime()}h</span>
              {" "}// riprova dopo
            </div>
          </div>
        }
      >
        <div
          onClick={handleClick}
          class="relative gap-3 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-all"
          style={{
            "font-family": "'Share Tech Mono', monospace",
            "font-size": "1em",
            border: "2px solid rgba(61, 208, 16, 0.72)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 30px rgba(7, 179, 27, 0.67)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,65,0.08)";
          }}
        >
          VOTA_QUI.EXE
        </div>
      </Show>
    </Show>
  );
}