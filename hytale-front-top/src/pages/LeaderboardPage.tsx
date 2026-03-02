import { Component, createSignal, For, Show, createResource } from "solid-js";
import { A } from "@solidjs/router";
import { ServerService } from "../services/server.service";
import { ServerResponse, ServerStatus } from "../types/ServerResponse";
import { StatusService } from "../services/status.service";

const MEDALS = [
  { icon: "👑", border: "border-amber-600/60", score: "text-amber-400" },
  { icon: "🥈", border: "border-stone-600/40", score: "text-stone-300" },
  { icon: "🥉", border: "border-amber-800/50", score: "text-amber-700" },
];

// ── Divider ───────────────────────────────────────────────────────────────────
const Divider: Component<{ label: string }> = (p) => (
  <div class="flex items-center gap-3 my-6">
    <div class="h-px flex-1 bg-amber-900/20" />
    <span class="text-amber-800/50 text-xs font-serif uppercase tracking-[0.3em]">{p.label}</span>
    <div class="h-px flex-1 bg-amber-900/20" />
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const LeaderboardPage: Component = () => {
  const [servers, setServers] = createSignal<ServerResponse[]>([]);

  const [data] = createResource(async () => {
    const r = await ServerService.getServerParams({ page: 1, limit: 100, sort: "voti_totali:desc" });
    setServers(r.data);
    return r;
  });

  const podium = () => servers().slice(0, 3);
  const theRest = () => servers().slice(3);

  return (
    <div class="relative min-h-screen bg-stone-950 overflow-x-hidden font-serif">

      {/* dot grid bg */}
      <div
        class="absolute inset-0 opacity-5 pointer-events-none"
        style={{ "background-image": "radial-gradient(circle, #92400e 1px, transparent 1px)", "background-size": "32px 32px" }}
      />
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

      <div class="relative z-10 max-w-2xl mx-auto px-4 py-12">

        {/* header */}
        <div class="text-center mb-10">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="h-px w-10 bg-amber-800/60" />
            <span class="text-amber-700 text-xs font-serif uppercase tracking-[0.3em]">Cronache del Regno</span>
            <div class="h-px w-10 bg-amber-800/60" />
          </div>
          <h1 class="font-serif font-black text-5xl text-amber-500 uppercase tracking-widest drop-shadow-[0_2px_12px_rgba(180,100,10,0.4)] mb-2">
            Leaderboard
          </h1>
          <p class="text-stone-600 text-xs font-serif uppercase tracking-[0.3em]">
            I 100 più valorosi server di hytale.
          </p>
        </div>

        {/* loading */}
        <Show when={data.loading}>
          <div class="flex flex-col items-center py-24 gap-3 text-amber-800">
            <div class="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
            <span class="text-xs uppercase tracking-widest font-serif">Consultando le cronache...</span>
          </div>
        </Show>

        <Show when={!data.loading}>

          {/* podium */}
          <Show when={podium().length > 0}>
            <Divider label="⚜ I Valorosi" />
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
              <For each={podium()}>{(s, i) => (
                <div class={`relative border-2 ${MEDALS[i()].border} bg-stone-900/60 p-4`}>
                  <span class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-amber-800/50" />
                  <span class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-amber-800/50" />

                  <span class="text-2xl block mb-2">{MEDALS[i()].icon}</span>
                  <p class="font-serif font-bold text-stone-200 text-sm truncate mb-0.5">{s.name}</p>
                  <Show when={s.is_online} fallback={
                    <p class="font-serif font-bold text-stone-500 text-sm truncate mb-0.5">Offline</p>
                  }>
                    <p class="font-serif font-bold text-green-500 text-sm truncate mb-0.5">{s.players_online} / {s.players_max} giocatori.</p>
                    <p class="font-serif font-bold text-green-500 text-sm truncate mb-0.5"></p>
                  </Show>
                  <p class="text-stone-600 text-xs italic mb-4">{s.ip}</p>
                  <div class="flex items-end justify-between border-t border-stone-800 pt-3">
                    <div>
                      <span class={`font-serif font-black text-2xl ${MEDALS[i()].score}`}>{s.voti_totali ?? 0}</span>
                      <span class="block text-[9px] uppercase tracking-widest text-stone-600">voti</span>
                    </div>
                    <A
                      href={`/server/${s.id}`}
                      class="text-[10px] font-serif uppercase tracking-wider px-3 py-1.5 border border-amber-800/50 bg-amber-950/20 text-amber-600 hover:text-amber-400 hover:border-amber-700 transition-all"
                    >
                      Entra →
                    </A>
                  </div>
                </div>
              )}</For>
            </div>
          </Show>


          {/* table */}
          <Show when={theRest().length > 0}>
            <Divider label="⚜ Registro" />
            <div class="border border-amber-900/20 bg-stone-900/30 overflow-hidden">
              <For each={theRest()}>{(s, i) => (
                <A
                  href={`/server/${s.id}`}
                  class="group flex items-center gap-4 px-4 py-3 border-b border-stone-800/50 last:border-0 hover:bg-amber-950/10 transition-colors"
                >
                  <span class="w-6 text-center font-serif text-amber-900/60 text-xs shrink-0">#{i() + 4}</span>
                  <div class="flex-1 min-w-0">
                    <p class="font-serif font-bold text-stone-300 group-hover:text-amber-400 text-sm truncate transition-colors">{s.name}</p>
                    <p class="text-stone-600 text-xs italic">{s.ip}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="font-serif font-bold text-amber-600 text-base">{s.voti_totali ?? 0}</span>
                    <span class="block text-[9px] uppercase tracking-wider text-stone-600">voti</span>
                  </div>

                  <Show when={s.is_online} fallback={
                    <div class="text-right shrink-0">
                      <span class="font-serif font-bold text-amber-600 text-base">Off</span>
                      <span class="block text-[9px] uppercase tracking-wider text-stone-600">offline</span>
                    </div>
                  }>
                    <div class="text-right shrink-0">
                      <span class="font-serif font-bold text-amber-600 text-base">{s.players_online ?? 0}/ {s.players_max ?? 1000} </span>
                      <span class="block text-[9px] uppercase tracking-wider text-stone-600">giocatori online.</span>
                    </div>
                  </Show>

                </A>
              )}</For>
              <div class="px-4 py-2 border-t border-stone-800/50 text-center">
                <span class="text-stone-700 text-xs font-serif italic">{servers().length} servitor nel registro</span>
              </div>
            </div>
          </Show>

          {/* empty */}
          <Show when={servers().length === 0}>
            <div class="text-center py-24">
              <p class="text-amber-900/50 text-3xl mb-3">🏚</p>
              <p class="text-amber-800/60 text-xs font-serif uppercase tracking-widest">Il regno tace...</p>
            </div>
          </Show>

          {/* cta */}
          <Show when={servers().length > 0}>
            <div class="mt-10 text-center">
              <div class="flex items-center gap-3 mb-5">
                <div class="h-px flex-1 bg-amber-900/20" />
                <span class="text-amber-900/40 text-xs font-serif tracking-[0.4em] uppercase">ᚠᚱᛖᛖ</span>
                <div class="h-px flex-1 bg-amber-900/20" />
              </div>
              <p class="text-stone-500 text-sm font-serif italic mb-4">Hai un server? Unisciti alla gilda</p>
              <A
                href="/add-server"
                class="relative inline-flex items-center gap-2 px-7 py-3 border-2 border-amber-800/70 bg-stone-900 hover:bg-stone-800 hover:border-amber-600 text-amber-500 hover:text-amber-400 font-serif uppercase tracking-widest text-sm transition-all"
              >
                <span class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-amber-700" />
                <span class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-amber-700" />
                ⚜ Entra nella Gilda
              </A>
            </div>
          </Show>

        </Show>
      </div>
    </div>
  );
};

export default LeaderboardPage;