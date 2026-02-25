import { Component, createSignal, For, Show, createResource } from "solid-js";
import { A } from "@solidjs/router";
import { ServerService } from "../services/server.service";
import { ServerResponse } from "../types/ServerResponse";

const TICKER = "⚔ CLASSIFICHE DEL REGNO ◈ VOTA I PIÙ VALOROSI ◎ SCALA LA VETTA ⬟ UNISCITI ALLA GILDA ";
const RUNES  = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ"];
const MEDALS = [{ icon:"👑", border:"border-amber-600",   glow:"shadow-[0_0_24px_rgba(200,150,12,0.18)]", score:"text-amber-400" },
                { icon:"🥈", border:"border-stone-400/40", glow:"",                                        score:"text-stone-300" },
                { icon:"🥉", border:"border-amber-800/60", glow:"",                                        score:"text-amber-700" }];

// ── shared widget corners ──────────────────────────────────────────────────────
const Corners = () => <>
  <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-800/60 pointer-events-none" />
  <span class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-800/60 pointer-events-none" />
  <span class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-800/60 pointer-events-none" />
  <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-800/60 pointer-events-none" />
</>;

const Divider: Component<{ label: string }> = (p) => (
  <div class="flex items-center gap-3 my-6">
    <div class="flex-1 h-px bg-gradient-to-r from-transparent to-amber-900/40" />
    <span class="font-serif text-[11px] uppercase tracking-[0.22em] text-amber-700/80">{p.label}</span>
    <div class="flex-1 h-px bg-gradient-to-l from-transparent to-amber-900/40" />
  </div>
);

// ── page ──────────────────────────────────────────────────────────────────────
const LeaderboardPage: Component = () => {
  const [servers, setServers] = createSignal<ServerResponse[]>([]);

  const [data] = createResource(async () => {
    const r = await ServerService.getServerParams({ page: 1, limit: 100, sort: "voti_totali:desc" });
    setServers(r.data); return r;
  });

  const podium  = () => servers().slice(0, 3);
  const theRest = () => servers().slice(3);
  const totalVotes = () => servers().reduce((a, s) => a + (s.voti_totali ?? 0), 0).toLocaleString();

  return (
    <div class="relative min-h-screen bg-stone-950 overflow-x-hidden font-serif">

      {/* floating runes bg */}
      <div class="fixed inset-0 pointer-events-none z-0" aria-hidden>
        {RUNES.map((r, i) => (
          <span class="absolute text-amber-500 select-none" style={{
            top: `${(i * 94.3 + 17) % 90 + 4}%`, left: `${(i * 137.7 + 31) % 94 + 2}%`,
            opacity: 0.025 + (i % 4) * 0.012, "font-size": `${16 + (i % 5) * 8}px`,
            transform: `rotate(${(i * 47) % 360}deg)`
          }}>{r}</span>
        ))}
      </div>

      {/* ticker */}
      <div class="relative z-10 overflow-hidden border-b border-amber-900/40 bg-stone-950/80 py-1.5">
        <div class="absolute inset-y-0 left-2 flex items-center text-amber-900/50 text-sm">⚔</div>
        <div class="absolute inset-y-0 right-2 flex items-center text-amber-900/50 text-sm">⚔</div>
        <p class="whitespace-nowrap animate-[marquee_30s_linear_infinite] inline-block font-serif text-[10px] uppercase tracking-[0.22em] text-amber-800/70 px-10">
          {TICKER.repeat(5)}
        </p>
      </div>

      {/* hero */}
      <div class="relative z-10 border-b-2 border-stone-800 text-center py-10 bg-gradient-to-b from-stone-900/60 to-transparent overflow-hidden">
        <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
        <p class="text-amber-800 text-[10px] uppercase tracking-[0.35em] mb-2">✦ Cronache del Mondo ✦</p>
        <h1 class="font-serif font-black text-4xl sm:text-5xl text-amber-400 drop-shadow-[0_0_20px_rgba(200,150,12,0.35)] tracking-wide mb-1">
          Leaderboard
        </h1>
        <p class="text-stone-500 text-xs uppercase tracking-[0.25em] mb-6">I Più Valorosi del Regno</p>

        {/* stats */}
        <div class="inline-grid grid-cols-3 gap-3 px-4">
          {[["⚔", totalVotes(), "Voti Totali"], ["🏰", servers().length, "Server"], ["🗡", servers().filter(s => (s.voti_totali ?? 0) > 0).length, "Con Voti"]].map(([icon, val, label]) => (
            <div class="relative bg-stone-900 border border-stone-700 px-4 py-3 min-w-[90px]">
              <Corners />
              <span class="block text-xl mb-0.5">{icon}</span>
              <span class="block font-serif font-black text-xl text-amber-400">{val}</span>
              <span class="block text-[9px] uppercase tracking-[0.18em] text-stone-500 mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* content */}
      <div class="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <Show when={!data.loading} fallback={
          <div class="flex flex-col items-center py-32 gap-4 text-amber-800">
            <div class="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
            <span class="text-xs uppercase tracking-widest">Caricamento cronache...</span>
          </div>
        }>
          <Show when={servers().length > 0} fallback={
            <div class="relative border border-stone-800 bg-stone-900/40 text-center py-20">
              <Corners />
              <span class="text-4xl block mb-3 opacity-40">🏚</span>
              <p class="text-amber-800 text-sm uppercase tracking-widest mb-1">Nessun Segnale</p>
              <p class="text-stone-600 text-xs italic">Il regno tace... nessun servitor risponde</p>
            </div>
          }>

            {/* podium */}
            <Show when={podium().length > 0}>
              <Divider label="⚜ I Valorosi ⚜" />
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                <For each={podium()}>{(s, i) => (
                  <div class={`relative bg-stone-900 border-2 ${MEDALS[i()].border} ${MEDALS[i()].glow} p-5 transition-transform hover:-translate-y-1 overflow-hidden`}>
                    <Corners />
                    {/* rank glow bg */}
                    <div class="absolute inset-0 bg-gradient-to-b from-amber-950/10 to-transparent pointer-events-none" />
                    <span class="text-3xl block mb-2">{MEDALS[i()].icon}</span>
                    <p class="font-serif font-bold text-stone-200 text-sm truncate mb-0.5">{s.name}</p>
                    <p class="text-stone-600 text-xs italic mb-4">{s.ip}</p>
                    <div class="flex items-end justify-between border-t border-stone-800 pt-3">
                      <div>
                        <span class={`font-serif font-black text-2xl ${MEDALS[i()].score}`}>{s.voti_totali ?? 0}</span>
                        <span class="block text-[9px] uppercase tracking-widest text-stone-600">voti</span>
                      </div>
                      <A href={`/server/${s.id}`} class="text-[10px] font-serif uppercase tracking-wider px-3 py-1.5 border border-amber-800/60 bg-amber-950/30 text-amber-600 hover:text-amber-400 hover:border-amber-700 transition-all">
                        Entra →
                      </A>
                    </div>
                  </div>
                )}</For>
              </div>
            </Show>

            {/* table */}
            <Show when={theRest().length > 0}>
              <Divider label="⚜ Cronache ⚜" />
              <div class="relative border border-stone-800 bg-stone-900/60 overflow-hidden">
                <Corners />
                <div class="h-0.5 bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />
                <div class="flex items-center gap-2 px-5 py-3 border-b border-stone-800 bg-stone-950/40">
                  <span>📜</span>
                  <span class="text-[11px] uppercase tracking-[0.2em] text-amber-700/80">Registro dei Guerrieri</span>
                </div>

                <For each={theRest()}>{(s, i) => (
                  <A href={`/server/${s.id}`}
                    class="group flex items-center gap-4 px-5 py-3 border-b border-stone-800/60 last:border-0 hover:bg-amber-950/10 transition-colors relative">
                    <span class="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-700 opacity-0 group-hover:opacity-50 transition-opacity" />
                    <span class="w-8 text-center font-serif text-amber-800 text-sm flex-shrink-0">#{i() + 4}</span>
                    <div class="flex-1 min-w-0">
                      <p class="font-serif font-bold text-stone-300 group-hover:text-amber-400 text-sm truncate transition-colors">{s.name}</p>
                      <p class="text-stone-600 text-xs italic">{s.ip}</p>
                    </div>
                    <div class="text-center flex-shrink-0">
                      <span class="font-serif font-bold text-amber-600 text-base">{s.voti_totali ?? 0}</span>
                      <span class="block text-[9px] uppercase tracking-wider text-stone-600">voti</span>
                    </div>
                  </A>
                )}</For>

                <div class="px-5 py-2.5 border-t border-stone-800 text-center text-[10px] uppercase tracking-[0.2em] text-stone-600">
                  ✦ {servers().length} servitor nel registro ✦
                </div>
              </div>
            </Show>

            {/* cta */}
            <div class="mt-8 text-center">
              <div class="relative inline-block bg-stone-900 border-2 border-amber-800/50 px-10 py-6">
                <Corners />
                <p class="font-serif font-black text-amber-400 text-base mb-1">Hai un Server Minecraft?</p>
                <p class="text-stone-500 text-xs italic mb-4">Unisciti alla gilda e scala le classifiche del regno</p>
                <A href="/add-server"
                  class="inline-flex items-center gap-2 px-6 py-2.5 border border-amber-800/60 bg-amber-950/30 text-amber-500 hover:text-amber-300 hover:border-amber-600 font-serif text-xs uppercase tracking-widest transition-all">
                  ⚜ Entra nella Gilda
                </A>
              </div>
            </div>

          </Show>
        </Show>
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;