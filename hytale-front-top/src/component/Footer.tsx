// Footer.tsx (o dove preferisci mettere il pulsante)
import { Component } from "solid-js";

const Footer: Component = () => {

  return (
    <>
      <footer class="py-8 text-center text-zinc-500 text-sm border-t border-zinc-800/50 mt-auto">
        <p class="mb-2">Etherwood • Floating Realms of Hytale</p>
        
        <p class="max-w-2xl mx-auto leading-relaxed">
          Un enorme grazie a <span class="text-zinc-300 font-medium">Grok</span> e{" "}
          <span class="text-zinc-300 font-medium">ChatGPT</span> per l'aiuto nella creazione, e soprattutto
          a tutti i fantastici <span class="text-zinc-300 font-medium">creatori e gestori di server</span> che
          rendono Hytale speciale ogni giorno.
        </p>

        <p class="mt-3 text-zinc-600">Grazie di cuore a tutta la community! 🖤✨</p>

      </footer>


    </>
  );
};

export default Footer;