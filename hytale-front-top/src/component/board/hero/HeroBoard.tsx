// src/components/HeroSection.tsx  (o chiamalo SecondaryHero, BottomHero, etc.)
import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const HeroBoard: Component = () => {
  const navigate = useNavigate();

  return (
    <section class="relative w-full py-16 px-6 bg-black/80 overflow-hidden">
      {/* Sfondo glass + gradient */}
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-cyan-950/10 pointer-events-none" />
      <div class="absolute inset-0 backdrop-blur-[2px] opacity-40" />

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        {/* Titolo secondario */}
        <h2 class="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
          Lista dei server
          <span class="block text-emerald-400 mt-2">Esplora i tuoi server e filtra.</span>
        </h2>

        {/* Descrizione breve + tech vibe */}
        <p class="text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Usare l'opzione filtra ti permette di trovare il server che preferisci
        </p>

   
      </div>
    </section>
  );
};

export default HeroBoard;