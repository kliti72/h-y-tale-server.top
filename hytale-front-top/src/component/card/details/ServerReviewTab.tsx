import { createSignal, For, Show } from "solid-js";
import { useAuth } from "../../../auth/AuthContext";
import { notify } from "../../template/Notification";

type User = {
  id: string;
  username: string;
  global_name?: string;
  avatar?: string;
  discriminator?: string;
};

interface Review {
  id: number;
  server_id?: number,
  user? : User,
  comment: string;
  date: string;
  likes: number;
}

interface NewReview {
  rating: number;
  comment: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: 1, author: "DarkSlayer", avatar: "🛡️", rating: 5, comment: "Server top! Staff attivo e community mega friendly 🔥", date: "2 giorni fa", likes: 23 },
  { id: 2, author: "BuildMaster", avatar: "🏗️", rating: 4, comment: "Ottimo server survival, molte possibilità di build. A volte lag ma overall buono!", date: "1 settimana fa", likes: 15 },
  { id: 3, author: "PvPKing", avatar: "⚔️", rating: 5, comment: "Arena PvP spettacolare, no pay to win. Approved 💯", date: "2 settimane fa", likes: 31 },
];

export default function ServerReviewTab() {
  const auth = useAuth();
  const [reviews, setReviews] = createSignal<Review[]>(MOCK_REVIEWS);
  const [likedReviews, setLikedReviews] = createSignal<Set<number>>(new Set());
  const [showForm, setShowForm] = createSignal(false);
  const [newReview, setNewReview] = createSignal<NewReview>({ rating: 5, comment: "" });

  const avgRating = () => {
    const r = reviews();
    return r.length ? (r.reduce((acc, r) => acc + r.rating, 0) / r.length).toFixed(1) : "0";
  };

  const toggleLike = (id: number) => {
    if (!auth.isAuthenticated()) return notify("Fai login per mettere like", "error");
    setLikedReviews(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submitReview = () => {
    const r = newReview();
    if (!r.comment.trim()) return notify("Scrivi qualcosa fratello", "error");
    setReviews(prev => [{
      id: Date.now(),
      author: auth.user?.username ?? "Anonimo",
      avatar: "👤",
      rating: r.rating,
      comment: r.comment,
      date: "Adesso",
      likes: 0,
    }, ...prev]);
    setNewReview({ rating: 5, comment: "" });
    setShowForm(false);
    notify("Recensione aggiunta!", "success");
  };

  return (
    <div class="space-y-4">

      {/* Header con rating medio */}
      <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-5 flex items-center justify-between">
        <div>
          <div class="text-4xl font-black text-white">{avgRating()}</div>
          <div class="text-sm text-violet-400">{reviews().length} recensioni</div>
        </div>
        <Show when={auth.isAuthenticated()}>
          <button
            onClick={() => setShowForm(f => !f)}
            class="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 rounded-xl font-semibold transition-all text-sm"
          >
            ✍️ {showForm() ? "Annulla" : "Scrivi recensione"}
          </button>
        </Show>
      </div>

      {/* Form nuova recensione */}
      <Show when={showForm()}>
        <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-5 space-y-3">
          {/* Stelle */}
          <div class="flex gap-1">
            <For each={[1, 2, 3, 4, 5]}>
              {(star) => (
                <button
                  onClick={() => setNewReview(p => ({ ...p, rating: star }))}
                  class={`text-2xl transition-transform hover:scale-110 ${star <= newReview().rating ? "text-yellow-400" : "text-gray-600"}`}
                >
                  ⭐
                </button>
              )}
            </For>
          </div>
          {/* Testo */}
          <textarea
            rows={3}
            placeholder="Scrivi la tua recensione..."
            value={newReview().comment}
            onInput={e => setNewReview(p => ({ ...p, comment: e.currentTarget.value }))}
            class="w-full bg-violet-900/40 border border-violet-700/50 rounded-lg p-3 text-white placeholder-violet-500 resize-none focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={submitReview}
            class="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 rounded-xl font-semibold text-sm transition-all"
          >
            Pubblica
          </button>
        </div>
      </Show>

      {/* Lista recensioni */}
      <For each={reviews()}>
        {(review) => (
          <div class="bg-violet-950/40 border border-violet-800/30 rounded-xl p-5">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl">{review.avatar}</span>
              <div>
                <div class="font-bold text-white text-sm">{review.author}</div>
                <div class="flex items-center gap-1 text-xs text-violet-400">
                  <For each={[1,2,3,4,5]}>
                    {(star) => <span class={star <= review.rating ? "text-yellow-400" : "text-gray-600"}>⭐</span>}
                  </For>
                  • {review.date}
                </div>
              </div>
            </div>
            <p class="text-violet-200 text-sm mb-3">{review.comment}</p>
            <button
              onClick={() => toggleLike(review.id)}
              class={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all
                ${likedReviews().has(review.id)
                  ? "bg-fuchsia-600/30 text-fuchsia-300 border-fuchsia-500/50"
                  : "bg-violet-950/60 text-violet-300 border-transparent hover:bg-violet-900/80"}`}
            >
              👍 {review.likes + (likedReviews().has(review.id) ? 1 : 0)}
            </button>
          </div>
        )}
      </For>
    </div>
  );
}