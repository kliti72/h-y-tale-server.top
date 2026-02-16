// src/components/Footer.tsx
import { Component, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router"; // se usi solid-router
import ThemeToggle from "../card/ThemeToggle";

const Footer: Component = () => {
  const [copied, setCopied] = createSignal(false);
  const [email, setEmail] = createSignal("");
  const [subscribed, setSubscribed] = createSignal(false);

  const siteUrl = "https://h-y-tale.top";
  const discordInvite = "https://discord.gg/tuoinvitelink"; // ← cambia!

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Errore copia", err);
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent(
      "Scopri Etherwood – la community italiana di Hytale! 🌌 Server, voti, guide e tanto altro →"
    );
    const url = encodeURIComponent(siteUrl);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleSubscribe = (e: Event) => {
    e.preventDefault();
    if (email().trim() && email().includes("@")) {
      // Qui potresti fare una fetch reale a backend/Mailchimp
      console.log("Iscrizione newsletter:", email());
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer class="relative mt-auto w-full border-t border-emerald-900/40 bg-gradient-to-b from-black to-indigo-950/90 text-zinc-400 text-sm overflow-hidden">
      {/* Background subtle particles / glow */}
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(34,197,94,0.08),transparent_40%)]" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.06),transparent_50%)]" />
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 lg:py-16">
        {/* Grid principale - 4 colonne su desktop */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Colonna 1: Brand + descrizione */}
          <div class="space-y-5">
            <h3 class="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              H-Y-TALE.top
            </h3>
            <p class="leading-relaxed text-zinc-300 max-w-xs">
              La community italiana dedicata a Hytale. Scopri server, vota i tuoi preferiti, unisciti agli eventi e fai parte del regno floating!
            </p>
            <div class="flex items-center gap-4 pt-2">
              <a
                href={discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-400 hover:text-emerald-300 transition text-2xl hover:scale-110"
                aria-label="Discord"
              >
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8851 1.515.0699.0699 0 00-.032.0277C.5336 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0775.0105c.1202.099.246.1981.372.2914a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6061 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
              <button onClick={handleShareX} class="text-zinc-300 hover:text-white transition text-2xl hover:scale-110" aria-label="Condividi su X">
                𝕏
              </button>
              {/* Aggiungi altri social se vuoi: YouTube, TikTok, Instagram... */}
            </div>
          </div>

          {/* Colonna 2: Links rapidi */}
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-emerald-300">Esplora</h4>
            <ul class="space-y-2.5">
              <li><A href="/servers" class="hover:text-emerald-300 transition">Server</A></li>
              <li><A href="/leaderboard" class="hover:text-emerald-300 transition">Top Votati</A></li>
              <li><A href="/forum" class="hover:text-emerald-300 transition">Forum</A></li>
              <li><A href="/guide" class="hover:text-emerald-300 transition">Guide Hytale</A></li>
            </ul>
          </div>

          {/* Colonna 3: Community & Support */}
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-emerald-300">Community</h4>
            <ul class="space-y-2.5">
              <li><a href={discordInvite} target="_blank" rel="noopener" class="hover:text-emerald-300 transition">Discord</a></li>
              <li><A href="/contatti" class="hover:text-emerald-300 transition" >Contattaci</A></li>
              <li><A href="/privacy" class="hover:text-emerald-300 transition">Termini di Servizio</A></li>
            </ul>
          </div>

          {/* Colonna 4: Newsletter */}
         
        </div>

        {/* Barra inferiore con share + copyright */}
        <div class="border-t border-emerald-900/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-500 text-xs sm:text-sm">
          <div class="flex items-center gap-5 order-2 sm:order-1">
            <button
              onClick={handleCopyLink}
              class={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${copied() ? "bg-emerald-900/40 text-emerald-300" : "hover:bg-emerald-950/40"}`}
            >
              {copied() ? "✅ Copiato!" : "🔗 Copia link"}
            </button>

            <button onClick={handleShareX} class="flex items-center gap-2 hover:text-white transition">
              <span>𝕏</span> Condividi
            </button>
          </div>

          <div class="text-center order-1 sm:order-2">
            © {new Date().getFullYear()} H-Y-Tale.top • Non affiliato ufficialmente con Hytale o Hypixel Studios. 
            <br class="sm:hidden" />
            <span class="inline-block mt-1 sm:mt-0"> Made with ❤️ + SolidJS + Tailwind</span>
          </div>

          <button
            onClick={scrollToTop}
            class="order-3 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
          >
            Torna su <span class="text-lg">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;