import { Component, For } from "solid-js";

const NEWS = [
  { date: "27 Feb 2026", tag: "Rilascio",      title: "Plugin v1.0 — Primo rilascio ufficiale",        excerpt: "Il plugin è ora disponibile. Installa, configura la secret key e inizia a monitorare in real-time." },
  { date: "25 Feb 2026", tag: "Aggiornamento", title: "API Secondary Server — Ora disponibile",         excerpt: "I giocatori dei server secondari vengono ora aggregati automaticamente al server principale." },
  { date: "20 Feb 2026", tag: "Annuncio",      title: "H-YTale apre le registrazioni",                 excerpt: "Da oggi chiunque può registrare il proprio server gratuitamente sulla piattaforma." },
  { date: "14 Feb 2026", tag: "Community",     title: "Server in evidenza — Febbraio 2026",            excerpt: "I server più votati del mese. Complimenti a tutti i partecipanti della community." },
  { date: "8 Feb 2026",  tag: "Fix",           title: "Fix: doppio conteggio giocatori sui network",   excerpt: "Risolto un bug che causava il doppio conteggio in alcuni edge case sui server principali." },
];

const TAG_COLOR: Record<string, string> = {
  Rilascio:      "text-amber-400   border-amber-800/60",
  Aggiornamento: "text-sky-400     border-sky-900/50",
  Fix:           "text-emerald-400 border-emerald-900/50",
  Annuncio:      "text-amber-300   border-amber-700/50",
  Community:     "text-stone-300   border-stone-700/50",
};

const NewsPage: Component = () => (
  <div class="relative min-h-screen bg-stone-950 font-serif overflow-x-hidden">

    <div class="absolute inset-0 opacity-5 pointer-events-none"
      style={{ "background-image": "radial-gradient(circle, #92400e 1px, transparent 1px)", "background-size": "32px 32px" }} />
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

    <div class="relative z-10 max-w-2xl mx-auto px-4 py-12">

      {/* header */}
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="h-px w-10 bg-amber-800/60" />
          <span class="text-amber-700 text-xs uppercase tracking-[0.3em]">Cronache del Reame</span>
          <div class="h-px w-10 bg-amber-800/60" />
        </div>
        <h1 class="font-black text-5xl text-amber-500 uppercase tracking-widest drop-shadow-[0_2px_12px_rgba(180,100,10,0.4)] mb-2">
          Notizie
        </h1>
        <p class="text-stone-600 text-xs uppercase tracking-[0.3em]">Rilasci · Aggiornamenti · Annunci</p>
      </div>

      {/* lista */}
      <div class="flex flex-col">
        <For each={NEWS}>{(item, i) => (
          <div class={`flex gap-4 py-4 ${i() < NEWS.length - 1 ? "border-b border-stone-800/60" : ""}`}>
            <div class="w-24 shrink-0 pt-0.5">
              <span class={`text-[10px] border px-1.5 py-0.5 uppercase tracking-wide ${TAG_COLOR[item.tag] ?? "text-stone-400 border-stone-700"}`}>
                {item.tag}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-stone-200 text-sm font-bold leading-snug mb-1">{item.title}</p>
              <p class="text-stone-500 text-xs leading-relaxed">{item.excerpt}</p>
            </div>
            <span class="text-stone-700 text-xs italic shrink-0 pt-0.5 hidden sm:block">{item.date}</span>
          </div>
        )}</For>
      </div>

      {/* footer runico */}
      <div class="flex items-center gap-3 mt-10">
        <div class="h-px flex-1 bg-amber-900/20" />
        <span class="text-amber-900/30 text-xs tracking-[0.5em]">ᚾ ᛟ ᛏ ᛁ ᛉ ᛁ ᛖ</span>
        <div class="h-px flex-1 bg-amber-900/20" />
      </div>

    </div>
  </div>
);

export default NewsPage;