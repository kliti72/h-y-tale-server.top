import { For } from "solid-js";

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
    <div class="bg-gray-900/90 rounded-2xl p-6 border border-violet-900/50">
      <h3 class="text-2xl font-bold text-fuchsia-400 mb-6">💬 Forum</h3>
      <For each={MOCK_FORUM_POSTS}>
        {(post) => (
          <div class="py-4 border-b border-violet-900/30 last:border-0">
            {post.hot && <span class="text-xl">🔥</span>}
            <p class="font-semibold text-violet-200 text-sm mb-2">{post.title}</p>
            <div class="flex items-center gap-2 text-xs text-zinc-400">
              <span>👤 {post.author}</span>
              <span>•</span>
              <span>💬 {post.replies}</span>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}