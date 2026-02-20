// src/components/ServerCard.tsx
import { useNavigate } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import { notify } from "../../template/Notification";
import { ServerResponse, ServerStatus } from "../../../types/ServerResponse";
import { VoteService } from "../../../services/votes.service";
import { ServerCardStatus } from "../details/ServerCardStatus";
import { StatusService } from "../../../services/status.service";

// ═══════════════════════════════════════════════
// 🕹️ LANG CONFIG
// ═══════════════════════════════════════════════
const LANG = {
  badge: "◈ POPOLARE",
  online: "● ONLINE",
  votes: "⬡ VOTI",
  vote: {
    can: "⬡ VOTA",
    wait: (h: string) => `◎ ATTENDI ${h}H`,
  },
  copyIp: "◈ COPIA IP",
  copied: "IP copiato nel buffer neural → pronto per il netrun!",
  waitNotify: (h: string) => `Prossimo voto tra ${h} ore`,
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  .gcard {
    position: relative;
    background: #060d18;
    border: 1px solid rgba(0,245,255,0.18);
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    box-shadow: 0 0 0px rgba(0,245,255,0);
    transition: box-shadow 0.3s, border-color 0.3s, transform 0.2s;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .gcard::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,245,255,0.03) 0%, transparent 60%);
    pointer-events: none;
  }

  .gcard:hover {
    border-color: rgba(0,245,255,0.5);
    box-shadow: 0 0 20px rgba(0,245,255,0.15), 0 0 40px rgba(0,245,255,0.05), inset 0 0 20px rgba(0,245,255,0.03);
    transform: translateX(3px);
  }

  .gcard-badge {
    font-family: 'Orbitron', monospace;
    font-size: 0.55rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    color: #ff2d78;
    text-shadow: 0 0 8px #ff2d78;
    border: 1px solid rgba(255,45,120,0.5);
    box-shadow: 0 0 8px rgba(255,45,120,0.2);
    background: rgba(255,45,120,0.08);
    padding: 0.25rem 0.6rem;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
  }

  .gcard-logo {
    width: 72px;
    height: 72px;
    object-fit: cover;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    border: 1px solid rgba(0,245,255,0.25);
    box-shadow: 0 0 12px rgba(0,245,255,0.15);
    flex-shrink: 0;
  }

  .gcard-name {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 1rem;
    color: #ffffff;
    letter-spacing: 0.04em;
    transition: color 0.2s, text-shadow 0.2s;
  }

  .gcard:hover .gcard-name {
    color: #00f5ff;
    text-shadow: 0 0 12px rgba(0,245,255,0.6);
  }

  .gcard-ip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(0,245,255,0.45);
    letter-spacing: 0.08em;
  }

  .gcard-stat {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .stat-online { color: #39ff14; text-shadow: 0 0 6px #39ff14; }
  .stat-votes  { color: rgba(255,230,0,0.7); }

  .gcard-stat-sep {
    width: 1px;
    height: 12px;
    background: rgba(255,255,255,0.1);
  }

  .gcard-btn {
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 0.55rem 0.75rem;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .gcard-btn:hover  { filter: brightness(1.2); transform: scale(1.04); }
  .gcard-btn:active { transform: scale(0.96); }

  .gcard-btn-vote {
    background: rgba(255,45,120,0.15);
    color: #ff2d78;
    border: 1px solid rgba(255,45,120,0.5);
    box-shadow: 0 0 10px rgba(255,45,120,0.15);
  }

  .gcard-btn-vote:hover {
    background: rgba(255,45,120,0.25);
    box-shadow: 0 0 18px rgba(255,45,120,0.3);
  }

  .gcard-btn-vote-disabled {
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: not-allowed;
  }

  .gcard-btn-vote-disabled:hover { filter: none; transform: none; }

  .gcard-btn-copy {
    background: rgba(0,245,255,0.06);
    color: rgba(0,245,255,0.6);
    border: 1px solid rgba(0,245,255,0.2);
  }

  .gcard-btn-copy:hover {
    background: rgba(0,245,255,0.12);
    color: #00f5ff;
    box-shadow: 0 0 12px rgba(0,245,255,0.15);
  }

  .gcard-scanline {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.08) 3px,
      rgba(0,0,0,0.08) 4px
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .gcard:hover .gcard-scanline { opacity: 1; }
`;

type ServerCardProps = {
  server: ServerResponse;
  onVoteRequest: (server: ServerResponse) => void;
  nascondiPulsanti?: boolean;
};

const ServerCardHacking: Component<ServerCardProps> = (props) => {
      const [status] = createResource<ServerStatus | null>(
          () => StatusService.getStatusById(props.server.id ?? 1),
          { initialValue: null }
      );
      
  const navigate = useNavigate();
  const [aviableVoteResource] = createResource(VoteService.aviableVote);
  const logoSrc = () => props.server.logo_url || "https://via.placeholder.com/80/030810/00f5ff?text=SRV";

  const canVote = () => aviableVoteResource()?.success ?? false;
  const waitTime = () => aviableVoteResource()?.wait_time ?? "?";

  const handleVoteClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (canVote()) {
      props.onVoteRequest(props.server);
    } else {
      notify(LANG.waitNotify(String(waitTime())));
    }
  };

  const copyIp = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${props.server.ip}:${props.server.port}`);
    notify(LANG.copied);
  };

  return (
    <>
      <style>{STYLES}</style>

      <div class="gcard" onClick={() => navigate(`/server/${props.server.id}`)}>
        {/* scanline overlay on hover */}
        <div class="gcard-scanline" />

        <div style="padding: 1rem; display: flex; gap: 1rem; align-items: center;">

          {/* LOGO */}
          <img src={logoSrc()} class="gcard-logo" alt={props.server.name} />

          {/* INFO */}
          <div style="flex: 1; min-width: 0;">

            {/* badge + name */}
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span class="gcard-badge">{LANG.badge}</span>
            </div>

            <div class="gcard-name" style="margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {props.server.name}
            </div>

            <div class="gcard-ip" style="margin-bottom: 0.6rem;">
              {props.server.ip}:{props.server.port}
            </div>

            {/* STATS */}
            
                 <Show when={!status.loading} fallback={
            <div class="px-1 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs">
                <span class="text-yellow-300 font-bold"> Non hai integrato H-Y-TaleVerifier.jar</span>
                
                <br />
               <span class="text-violet-400 text-xs">
                    Sei il proprietario? <a href="/docs" class="underline text-violet-300 hover:text-white">Scaricalo qui</a>
                </span>
            </div>
        }>
                 <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="gcard-stat stat-online">
                {LANG.online} <span style="color: rgba(255,255,255,0.5);">{status()?.players_online}/{status()?.players_max}</span>
              </span>
              <div class="gcard-stat-sep" />
              <span class="gcard-stat stat-votes">
                {LANG.votes} <span style="color: rgba(255,255,255,0.5);">{props.server.voti_totali ?? 0}</span>
              </span>
            </div>
        </Show>
          </div>
     

          {/* BUTTONS */}
          <Show when={!props.nascondiPulsanti}>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0;">
              <button
                onClick={handleVoteClick}
                class={`gcard-btn ${canVote() ? 'gcard-btn-vote' : 'gcard-btn-vote-disabled'}`}
              >
                {canVote() ? LANG.vote.can : LANG.vote.wait(String(waitTime()))}
              </button>

              <button onClick={copyIp} class="gcard-btn gcard-btn-copy">
                {LANG.copyIp}
              </button>
            </div>
          </Show>

        </div>
      </div>
    </>
  );
};

export default ServerCardHacking;