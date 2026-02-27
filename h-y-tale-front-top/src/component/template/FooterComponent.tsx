import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";

const SITE_URL = "https://h-y-tale.top";
const DISCORD = "https://discord.gg/tuoinvitelink";

const FooterComponent: Component = () => {
  const [copied, setCopied] = createSignal(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(SITE_URL).catch(console.error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => {
    const t = encodeURIComponent("Scopri H-Y-Tale – community italiana Hytale →");
    window.open(`https://x.com/intent/tweet?text=${t}&url=${encodeURIComponent(SITE_URL)}`, "_blank");
  };

  return (
    <footer class="w-full bg-stone-950 border-t-2 border-amber-900/40 mt-auto">
      <div class="h-px w-full bg-gradient-to-r from-transparent via-amber-800/40 to-transparent" />

      <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <p class="font-serif font-black text-amber-500 text-xl uppercase tracking-widest mb-2">H-YTALE.top</p>
          <p class="text-stone-500 text-xs font-serif leading-relaxed">
            Community italiana dedicata a Hytale. Scopri server, vota i preferiti, unisciti agli eventi.
          </p>
          <p class="text-stone-700 text-xs font-serif mt-3">Non affiliato con Hytale™ / Hypixel Studios™</p>
        </div>

        {/* Links */}
        <div class="flex flex-col gap-2">
          <p class="text-amber-800 text-xs uppercase tracking-widest font-serif mb-1">⚔️ Esplora</p>
          {[
            { href: "/servers", label: "Server" },
            { href: "/leaderboard", label: "Top Votati" },
            { href: DISCORD, label: "Discord", ext: true },
            { href: "/privacy", label: "Privacy" },
          ].map(item => item.ext
            ? <a href={item.href} target="_blank" rel="noopener" class="text-stone-500 hover:text-amber-400 text-sm font-serif transition-colors">{item.label}</a>
            : <A href={item.href} class="text-stone-500 hover:text-amber-400 text-sm font-serif transition-colors">{item.label}</A>
          )}
        </div>

        {/* Actions */}
        <div class="flex flex-col gap-3">
          <p class="text-amber-800 text-xs uppercase tracking-widest font-serif mb-1">🏰 Condividi</p>
          <button onClick={copyLink}
            class="px-4 py-2 border border-amber-900/50 bg-stone-900 hover:bg-stone-800 text-amber-600 hover:text-amber-400 font-serif text-sm uppercase tracking-wide transition-all text-left">
            {copied() ? "✓ Copiato!" : "⬡ Copia link"}
          </button>
          <button onClick={shareX}
            class="px-4 py-2 border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-500 hover:text-amber-400 font-serif text-sm uppercase tracking-wide transition-all text-left">
            𝕏 Condividi su X
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            class="text-stone-600 hover:text-amber-500 font-serif text-xs uppercase tracking-widest transition-colors text-left mt-1">
            ↑ Torna su
          </button>
        </div>

      </div>

      <div class="h-px w-full bg-amber-900/20" />
      <div class="text-center py-3 text-stone-700 text-xs font-serif tracking-widest">
        © {new Date().getFullYear()} H-Y-TALE.top — Tutti i diritti riservati
      </div>
    </footer>
  );
};

export default FooterComponent;