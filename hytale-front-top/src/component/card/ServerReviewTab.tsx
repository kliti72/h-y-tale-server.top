import { createSignal, For, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { notify } from "../template/Notification";

type Review = {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
};

export default function ServerReviewTab() {

  const [likedReviews, setLikedReviews] = createSignal<Set<number>>(new Set());

    // Reviews mockate
    const [mockReviews] = createSignal<Review[]>([
        {
            id: 1,
            author: "DarkSlayer",
            avatar: "🛡️",
            rating: 5,
            comment: "Server top! Staff attivo e community mega friendly. PvP bilanciato e economy ben fatta. Lo consiglio 100% bro 🔥",
            date: "2 giorni fa",
            likes: 23
        },
        {
            id: 2,
            author: "BuildMaster",
            avatar: "🏗️",
            rating: 4,
            comment: "Ottimo server survival, molte possibilità di build. Unico difetto: a volte il lag in zone troppo buildate. Overall molto buono!",
            date: "1 settimana fa",
            likes: 15
        },
        {
            id: 3,
            author: "PvPKing",
            avatar: "⚔️",
            rating: 5,
            comment: "Arena PvP spettacolare, tornei ogni weekend con premi veri. Meta ben bilanciato, no pay to win. Approved 💯",
            date: "2 settimane fa",
            likes: 31
        }
    ]);

    const toggleLikeReview = (reviewId: number) => {
        const auth = useAuth();

        if (!auth.isAuthenticated()) {
            // notify("Login per mettere like alle recensioni", "error");
            return;
        }

        return (
            <div class="space-y-6">
                Tab Review
                {/* Rating Overview */}
                <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div class="text-5xl font-black text-white mb-2">{0}</div>
                            <div class="flex items-center gap-1 mb-2">
                                <For each={[1, 2, 3, 4, 5]}>
                                    {(star) => (
                                        <span class={`text-2xl ${star <= parseFloat(0) ? 'text-yellow-400' : 'text-gray-600'}`}>
                                            ⭐
                                        </span>
                                    )}
                                </For>
                            </div>
                            <div class="text-sm text-violet-400">
                                Basato su {mockReviews().length} recensioni
                            </div>
                        </div>

                        <Show when={auth.isAuthenticated()}>
                            <button
                                onClick={() => notify("Funzione in arrivo! (demo)", "info")}
                                class="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-semibold transition-all"
                            >
                                ✍️ Scrivi Recensione
                            </button>
                        </Show>
                    </div>
                </div>

                {/* Reviews List */}
                <div class="space-y-4">
                    <For each={mockReviews()}>
                        {(review) => (
                            <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-6 hover:bg-violet-900/50 transition-colors">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center gap-3">
                                        <span class="text-3xl">{review.avatar}</span>
                                        <div>
                                            <div class="font-bold text-white">{review.author}</div>
                                            <div class="flex items-center gap-2">
                                                <div class="flex items-center gap-0.5">
                                                    <For each={[1, 2, 3, 4, 5]}>
                                                        {(star) => (
                                                            <span class={`${star <= review.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                                                                ⭐
                                                            </span>
                                                        )}
                                                    </For>
                                                </div>
                                                <span class="text-xs text-violet-400">• {review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p class="text-violet-200 mb-4 leading-relaxed">
                                    {review.comment}
                                </p>

                                <div class="flex items-center gap-4 pt-4 border-t border-violet-800/30">
                                    <button
                                        onClick={() => toggleLikeReview(review.id)}
                                        class={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                        ${likedReviews().has(review.id)
                                                ? "bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50"
                                                : "bg-violet-950/60 text-violet-300 hover:bg-violet-900/80 border border-transparent"}
                                      `}
                                    >
                                        <span>{likedReviews().has(review.id) ? "👍" : "👍🏻"}</span>
                                        {review.likes + (likedReviews().has(review.id) ? 1 : 0)}
                                    </button>

                                    <button class="text-sm text-violet-400 hover:text-violet-200 transition-colors">
                                        💬 Rispondi
                                    </button>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        )
    }