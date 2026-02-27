import { createSignal, onMount, onCleanup } from "solid-js";

// ── Typing effect ─────────────────────────────────────────────────────────────
const TypingText = (props) => {
  const [displayed, setDisplayed] = createSignal("");
  const [idx, setIdx] = createSignal(0);
  const [charIdx, setCharIdx] = createSignal(0);
  const [deleting, setDeleting] = createSignal(false);

  onMount(() => {
    const tick = () => {
      const cur = props.texts[idx()];
      if (!deleting()) {
        setCharIdx(c => c + 1);
        setDisplayed(cur.slice(0, charIdx()));
        if (charIdx() >= cur.length) setTimeout(() => setDeleting(true), 2000);
      } else {
        setCharIdx(c => c - 1);
        setDisplayed(cur.slice(0, charIdx()));
        if (charIdx() <= 0) {
          setDeleting(false);
          setIdx(i => (i + 1) % props.texts.length);
        }
      }
    };
    const t = setInterval(tick, deleting() ? 38 : 75);
    onCleanup(() => clearInterval(t));
  });

  return (
    <span class="text-amber-400 font-serif italic">
      {displayed()}<span class="animate-pulse">|</span>
    </span>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const TrackerLanding = () => {
  const TAGLINES = [
    "Traccia i tuoi server in tempo reale",
    "Ping automatico ogni 2 minuti",
    "Disponibile da ogni dispositivo",
    "Network, lobby e secondary — tutto sotto controllo",
  ];

  return (
    <section class="relative w-full min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-stone-950 overflow-hidden">

      {/* dot grid bg */}
      <div
        class="absolute inset-0 opacity-5 pointer-events-none"
        style={{ "background-image": "radial-gradient(circle, #92400e 1px, transparent 1px)", "background-size": "32px 32px" }}
      />

      {/* top border */}
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

      <div class="relative z-10 max-w-lg mx-auto text-center w-full flex flex-col items-center gap-6">

        {/* eyebrow */}
        <div class="flex items-center gap-3">
          <div class="h-px w-10 bg-amber-800/60" />
          <span class="text-amber-700 text-xs font-serif uppercase tracking-[0.3em]">Sistema di Monitoraggio</span>
          <div class="h-px w-10 bg-amber-800/60" />
        </div>

        {/* title */}
        <div>
          <h1 class="font-serif font-black text-5xl sm:text-6xl text-amber-500 uppercase tracking-widest drop-shadow-[0_2px_12px_rgba(180,100,10,0.4)]">
            Server Tracker
          </h1>
          <p class="text-stone-500 text-xs font-serif uppercase tracking-[0.4em] mt-2">
            H-Y-Tale · Plugin Free
          </p>
        </div>

        {/* rune divider */}
        <p class="text-amber-900/60 text-lg tracking-[0.6em] select-none">
          ᚱ ᚢ ᚾ ᛖ
        </p>

        {/* typing */}
        <p class="text-stone-500 font-serif text-sm h-5">
          <TypingText texts={TAGLINES} />
        </p>

        {/* feature pills */}
        <div class="flex flex-wrap justify-center gap-2 mt-2">
          {[
            { icon: "📡", label: "Ping ogni 2 min" },
            { icon: "🌐", label: "Tutti i dispositivi" },
            { icon: "🏰", label: "Network support" },
            { icon: "⚔️", label: "Comando /claim" },
          ].map(f => (
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif text-amber-600/80 border border-amber-900/40 bg-stone-900/60 uppercase tracking-wider">
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button class="relative inline-flex items-center gap-2 px-7 py-3 border-2 border-amber-800/70 bg-stone-900 hover:bg-stone-800 hover:border-amber-600 text-amber-500 hover:text-amber-400 font-serif uppercase tracking-widest text-sm transition-all mt-2">
          <span class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-amber-700" />
          <span class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-amber-700" />
          ⚔ Aggiungi il tuo server
        </button>

        {/* stat strip */}
        <div class="w-full grid grid-cols-3 border border-amber-900/30 mt-2">
          {[
            { num: "2min", label: "Ping interval" },
            { num: "∞",    label: "Server supportati" },
            { num: "3",    label: "Dispositivi" },
          ].map((s, i) => (
            <div class={`py-3 text-center ${i < 2 ? "border-r border-amber-900/30" : ""}`}>
              <span class="block font-serif font-black text-2xl text-amber-500">{s.num}</span>
              <span class="block text-stone-600 text-xs uppercase tracking-wider font-serif mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* how it works */}
        <div class="w-full mt-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="h-px flex-1 bg-amber-900/20" />
            <span class="text-amber-800/60 text-xs font-serif uppercase tracking-[0.3em]">Come funziona</span>
            <div class="h-px flex-1 bg-amber-900/20" />
          </div>
          <div class="flex flex-col gap-3">
            {[
              { step: "I",   text: "Installa il plugin e incolla la tua secret key dalla lista server" },
              { step: "II",  text: "Il plugin pinga automaticamente ogni 2 minuti con giocatori e stato" },
              { step: "III", text: "Monitora tutto in real-time dal sito, da PC, tablet o mobile" },
            ].map(s => (
              <div class="flex items-start gap-4 text-left px-4 py-3 border border-amber-900/20 bg-stone-900/40">
                <span class="font-serif text-amber-800/70 text-xs uppercase tracking-widest pt-0.5 w-6 shrink-0">{s.step}</span>
                <span class="text-stone-400 text-sm font-serif leading-relaxed">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom rune line */}
        <div class="flex items-center gap-3 mt-4 w-full">
          <div class="h-px flex-1 bg-amber-900/20" />
          <span class="text-amber-900/40 text-xs font-serif tracking-[0.4em] uppercase">
            ᛗ ᛟ ᚾ ᛁ ᛏ ᛟ ᚱ
          </span>
          <div class="h-px flex-1 bg-amber-900/20" />
        </div>

      </div>

      {/* bottom border */}
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />

    </section>
  );
};

export default TrackerLanding;