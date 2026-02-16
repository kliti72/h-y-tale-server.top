// src/components/Footer.tsx
import { Component, createSignal } from "solid-js";

const Footer: Component = () => {
  const [copied, setCopied] = createSignal(false);

  const siteUrl = "https://etherwood-hytale.net"; // cambia con il tuo dominio reale
  const discordInvite = "https://discord.gg/tuoinvitelink"; // metti il tuo invito reale

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Errore copia link", err);
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      "Scopri i migliori server Hytale su Etherwood! 🌌 Vota, copia IP e unisciti alla community italiana →"
    );
    const url = encodeURIComponent(siteUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <footer
      class="relative mt-auto w-full border-t border-emerald-900/30 bg-black backdrop-blur-sm text-zinc-400 text-sm"
    >
      {/* Overlay leggero per glass feel */}
      <div class="absolute inset-0 bg-gradient-to-t from-emerald-950/10 to-transparent pointer-events-none" />

      <div class="relative z-10 max-w-6xl mx-auto px-6 py-10 sm:py-12">
        {/* Sezione superiore: credits + messaggio */}
        <div class="text-center mb-8">
          <p class="text-lg font-medium text-emerald-300 mb-3">
            H-Y-TALE.top • Floating Realms of Hytale
          </p>

          <p class="max-w-3xl mx-auto leading-relaxed mb-4">
            Un progetto nato dalla passione per Hytale e supportato da tutta la community.  
            Grazie infinite a <span class="text-blue-400 font-medium">Grok</span>,{" "}
            <span class="text-emerald-400 font-medium">ChatGPT </span>,
            <span class="text-orange-400 font-medium"> Claude </span>
            
             e soprattutto a tutti i
            <span class="text-emerald-400 font-medium"> creatori di server</span> che rendono questo mondo vivo ogni giorno.
          </p>

          <p class="text-zinc-500 italic">
            Grazie di cuore a chi vota, condivide e gioca con noi. 🖤✨
          </p>
        </div>

        {/* Pulsanti social / share */}
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          {/* Discord */}
          <a
            href={discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            class={`
              flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium
              bg-gradient-to-r from-indigo-700 to-purple-700
              hover:from-indigo-600 hover:to-purple-600
              text-white shadow-md shadow-purple-900/30 hover:shadow-purple-700/50
              border border-purple-600/40 hover:border-purple-400/60
              transition-all duration-300 active:scale-95
            `}
          >
            <span class="text-xl">💬</span>
            Unisciti su Discord
          </a>

          {/* Share su X/Twitter */}
          <button
            onClick={handleShareTwitter}
            class={`
              flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium
              bg-black/50 hover:bg-zinc-900/70 text-zinc-300
              border border-zinc-700 hover:border-zinc-500
              transition-all duration-300 active:scale-95
            `}
          >
            <span class="text-xl">𝕏</span>
            Condividi su X
          </button>

          {/* Copia link */}
          <button
            onClick={handleCopyLink}
            class={`
              flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium
              ${copied() ? "bg-emerald-900/50 text-emerald-300" : "bg-black/50 hover:bg-emerald-950/60 text-emerald-300"}
              border border-emerald-800/50 hover:border-emerald-600/70
              transition-all duration-300 active:scale-95
            `}
          >
            <span class="text-xl">{copied() ? "✅" : "🔗"}</span>
            {copied() ? "Link copiato!" : "Copia link sito"}
          </button>
        </div>

        {/* Copyright + anno dinamico */}
        <div class="text-center text-zinc-600 text-xs sm:text-sm">
          <p>
            © {new Date().getFullYear()} PvPShield.com — Tutti i diritti riservati.  
            Non affiliato ufficialmente con Hytale o Hypixel Studios.
          </p>
          <p class="mt-2">
            Made with ❤️ + SolidJS + Tailwind
          </p>
          <p class="mt-2">
            For Urgency kliti7085@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;