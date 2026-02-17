import { createResource, For, Show } from "solid-js"
import { ServerService } from "../../../services/server.service"
import { A } from "@solidjs/router";

// ═══════════════════════════════════════════════
// 🕹️ LANG CONFIG
// ═══════════════════════════════════════════════
const LANG = {
  title: "⬡ TOP 5 SERVER",
  loading: "◎ INIZIALIZZAZIONE...",
  votes: "⬟ VOTI",
  ranks: ["◈ #1", "◈ #2", "◈ #3", "◈ #4", "◈ #5"],
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  .top5-card {
    background: #060d18;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    border: 2px solid rgba(22, 255, 5, 0.7);
    box-shadow: 0 0 15px rgba(255,230,0,0.08), inset 0 0 15px rgba(255,230,0,0.02);
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .top5-title {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #fbfffa;
    text-shadow: 0 0 10px rgba(255,230,0,0.6);
    margin-bottom: 0.75rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(255,230,0,0.15);
    display: block;
  }

  .top5-loading {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(0,245,255,0.5);
    text-align: center;
    padding: 1rem 0;
  }

  .top5-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.4rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
  }

  .top5-row:last-child { border-bottom: none; }

  .top5-row:hover {
    background: rgba(255,255,255,0.03);
    transform: translateX(4px);
  }

  .top5-rank {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 0.65rem;
    width: 2rem;
    text-align: center;
    flex-shrink: 0;
  }

  .rank-1 { color: #ffe600; text-shadow: 0 0 10px #ffe600; }
  .rank-2 { color: #c0c0c0; text-shadow: 0 0 8px #c0c0c0; }
  .rank-3 { color: #cd7f32; text-shadow: 0 0 8px #cd7f32; }
  .rank-other { color: rgba(0,245,255,0.4); }

  .top5-name {
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
    letter-spacing: 0.04em;
  }

  .top5-row:hover .top5-name {
    color: #00f5ff;
    text-shadow: 0 0 8px rgba(0,245,255,0.4);
  }

  .top5-votes {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(255,230,0,0.5);
    flex-shrink: 0;
    white-space: nowrap;
  }

  .top5-divider {
    width: 1px;
    height: 10px;
    background: rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
`;

const RANK_CLASS = ["rank-1", "rank-2", "rank-3", "rank-other", "rank-other"];

export default function TopFiveServerCard() {
  const [top_server] = createResource(() =>
    ServerService.getServerParams({ limit: 5, sort: 'votes:desc' })
  );

  return (
    <>
      <style>{STYLES}</style>

      <div class="top5-card">
        <span class="top5-title ">{LANG.title}</span>

        <Show
          when={top_server()}
          fallback={<div class="top5-loading">{LANG.loading}</div>}
        >
          <For each={top_server()?.data?.slice(0, 5)}>
            {(server, i) => (
              <A href={`/server/${server.id}`} class="top5-row">
                <span class={`top5-rank ${RANK_CLASS[i()] ?? 'rank-other'}`}>
                  {LANG.ranks[i()]}
                </span>
                <div class="top5-divider" />
                <span class="top5-name">{server.name}</span>
                <span class="top5-votes">{LANG.votes} {server.votes ?? 0}</span>
              </A>
            )}
          </For>
        </Show>
      </div>
    </>
  );
}