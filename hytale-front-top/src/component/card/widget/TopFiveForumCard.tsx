import { For } from "solid-js";

// ═══════════════════════════════════════════════
// 🕹️ LANG CONFIG
// ═══════════════════════════════════════════════
const LANG = {
  title: "◎ FORUM NETWORK",
  hot: "⬡ HOT",
  author: "◈ USER",
  replies: "◎ RISPOSTE",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  .forum-card {
    background: #060d18;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    border: 2px solid rgba(57,255,20,0.3);
    box-shadow: 0 0 15px rgba(57,255,20,0.08), inset 0 0 15px rgba(57,255,20,0.02);
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .forum-title {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #39ff14;
    text-shadow: 0 0 10px rgba(57,255,20,0.7);
    margin-bottom: 0.75rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(57,255,20,0.15);
    display: block;
  }

  .forum-row {
    padding: 0.6rem 0.4rem;
    border-bottom: 1px solid rgba(57,255,20,0.07);
    transition: background 0.15s, transform 0.15s;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
  }

  .forum-row:last-child { border-bottom: none; }

  .forum-row:hover {
    background: rgba(57,255,20,0.04);
    transform: translateX(4px);
  }

  .forum-hot {
    font-family: 'Orbitron', monospace;
    font-size: 0.5rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    color: #ff2d78;
    text-shadow: 0 0 8px #ff2d78;
    border: 1px solid rgba(255,45,120,0.4);
    background: rgba(255,45,120,0.08);
    padding: 0.15rem 0.4rem;
    clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    display: inline-block;
    margin-bottom: 0.35rem;
  }

  .forum-post-title {
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    letter-spacing: 0.03em;
    margin-bottom: 0.4rem;
    line-height: 1.4;
  }

  .forum-row:hover .forum-post-title {
    color: #39ff14;
    text-shadow: 0 0 8px rgba(57,255,20,0.4);
  }

  .forum-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
  }

  .forum-author { color: rgba(0,245,255,0.5); }
  .forum-replies { color: rgba(57,255,20,0.5); }

  .forum-meta-sep {
    width: 1px;
    height: 8px;
    background: rgba(255,255,255,0.08);
  }
`;

interface ForumPost {
  id: number;
  title: string;
  author: string;
  replies: number;
  hot: boolean;
}

const MOCK_FORUM_POSTS: ForumPost[] = [
  { id: 1, title: "Miglior server survival 2024?", author: "Steve99", replies: 24, hot: true },
  { id: 2, title: "Come configurare un server spigot", author: "CraftMaster", replies: 12, hot: false },
  { id: 3, title: "Server PvP consigliati per principianti", author: "NoobSlayer", replies: 8, hot: false },
  { id: 4, title: "Plugin essenziali per ogni server", author: "AdminPro", replies: 31, hot: true },
  { id: 5, title: "Problema con whitelist, aiuto!", author: "xXDarkXx", replies: 5, hot: false },
];

export default function TopFiveForumCard() {
  return (
    <>
      <style>{STYLES}</style>

      <div class="forum-card">
        <span class="forum-title">{LANG.title}</span>

        <For each={MOCK_FORUM_POSTS}>
          {(post) => (
            <div class="forum-row">
              {post.hot && <span class="forum-hot">{LANG.hot}</span>}
              <p class="forum-post-title">{post.title}</p>
              <div class="forum-meta">
                <span class="forum-author">{LANG.author} {post.author}</span>
                <div class="forum-meta-sep" />
                <span class="forum-replies">{LANG.replies} {post.replies}</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </>
  );
}