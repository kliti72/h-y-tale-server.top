import { Component, For } from "solid-js";
import { A } from "@solidjs/router";

const CATEGORIES = [
  {
    icon: "⚔",
    name: "Generale",
    desc: "Discussioni libere del regno",
    threads: 142,
    last: { title: "Benvenuti nella gilda!", author: "Staff", time: "2h fa" },
  },
  {
    icon: "🏰",
    name: "Server Talk",
    desc: "Promuovi e discuti il tuo server",
    threads: 89,
    last: { title: "Cerca staff per survival 1.21", author: "Aldric", time: "4h fa" },
  },
  {
    icon: "📜",
    name: "Guide & Tutorial",
    desc: "Condividi conoscenza con il popolo",
    threads: 34,
    last: { title: "Come configurare il plugin in 5 min", author: "Dev Team", time: "1g fa" },
  },
  {
    icon: "🗡",
    name: "Supporto",
    desc: "Problemi tecnici e richieste di aiuto",
    threads: 57,
    last: { title: "Plugin non pinga dopo il restart", author: "Thorin", time: "3h fa" },
  },
  {
    icon: "👑",
    name: "Annunci",
    desc: "Comunicazioni ufficiali dello staff",
    threads: 12,
    last: { title: "Plugin v1.0 disponibile al download", author: "Staff", time: "2g fa" },
  },
];

const ForumPage: Component = () => (
  <div class="relative min-h-screen bg-stone-950 font-serif overflow-x-hidden">

    <div class="absolute inset-0 opacity-5 pointer-events-none"
      style={{ "background-image": "radial-gradient(circle, #92400e 1px, transparent 1px)", "background-size": "32px 32px" }} />
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

    <div class="relative z-10 max-w-2xl mx-auto px-4 py-12">

      {/* header */}
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="h-px w-10 bg-amber-800/60" />
          <span class="text-amber-700 text-xs uppercase tracking-[0.3em]">Agorà del Regno</span>
          <div class="h-px w-10 bg-amber-800/60" />
        </div>
        <h1 class="font-black text-5xl text-amber-500 uppercase tracking-widest drop-shadow-[0_2px_12px_rgba(180,100,10,0.4)] mb-2">
          Forum
        </h1>
        <p class="text-stone-600 text-xs uppercase tracking-[0.3em]">Discussioni · Guide · Supporto</p>
      </div>

      {/* categorie */}
      <div class="flex flex-col">
        <For each={CATEGORIES}>{(cat, i) => (
          <A
            href={`/forum/${cat.name.toLowerCase()}`}
            class={`group flex items-start gap-4 py-4 hover:bg-amber-950/10 transition-colors -mx-2 px-2
              ${i() < CATEGORIES.length - 1 ? "border-b border-stone-800/60" : ""}`}
          >
            {/* icona */}
            <span class="text-xl w-7 shrink-0 pt-0.5 text-center">{cat.icon}</span>

            {/* info categoria */}
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-stone-200 text-sm font-bold group-hover:text-amber-400 transition-colors">{cat.name}</p>
                <span class="text-stone-700 text-xs italic">{cat.threads} discussioni</span>
              </div>
              <p class="text-stone-600 text-xs mb-2">{cat.desc}</p>
              {/* ultimo thread */}
              <div class="flex items-center gap-1.5 text-xs text-stone-700">
                <span class="text-amber-900/50">↳</span>
                <span class="italic truncate max-w-[200px]">{cat.last.title}</span>
                <span>·</span>
                <span>{cat.last.author}</span>
                <span>·</span>
                <span>{cat.last.time}</span>
              </div>
            </div>

            <span class="text-amber-900/30 text-xs pt-1 shrink-0 group-hover:text-amber-700 transition-colors">→</span>
          </A>
        )}</For>
      </div>

      {/* cta nuovo thread */}
      <div class="mt-10 text-center">
        <A
          href="/forum/nuovo"
          class="relative inline-flex items-center gap-2 px-7 py-3 border-2 border-amber-800/70 bg-stone-900 hover:bg-stone-800 hover:border-amber-600 text-amber-500 hover:text-amber-400 uppercase tracking-widest text-sm transition-all"
        >
          <span class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-amber-700" />
          <span class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-amber-700" />
          ⚔ Nuova Discussione
        </A>
      </div>

      {/* footer runico */}
      <div class="flex items-center gap-3 mt-10">
        <div class="h-px flex-1 bg-amber-900/20" />
        <span class="text-amber-900/30 text-xs tracking-[0.5em]">ᚠ ᛟ ᚱ ᚢ ᛗ</span>
        <div class="h-px flex-1 bg-amber-900/20" />
      </div>

    </div>
  </div>
);

export default ForumPage;