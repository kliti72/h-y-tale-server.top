// Header.tsx
import { Component } from "solid-js";


const Header: Component = () => {
  return (
    <header class="
      w-full 
      py-6 px-5 
      bg-zinc-950/90 
      border-b border-zinc-800/70 
      backdrop-blur-sm
    ">
      <div class="max-w-5xl mx-auto flex flex-col items-center gap-6">

        {/* Titolo principale */}
        <h1 class="
          text-4xl sm:text-5xl md:text-6xl 
          font-extrabold 
          text-white 
          tracking-tight
        ">
          Hytale • Classifica Server

        </h1>



        {/* Filtri / viste */}
        <nav class="flex flex-wrap justify-center gap-3 md:gap-4">
          {[
            { label: "Top Visualizzati", icon: "📊" },
            { label: "Top Giocatori Online", icon: "👥" },
            { label: "Ultimi Aggiunti", icon: "🕒" },
          ].map((item) => (
            <button
              class="
                flex items-center gap-2 
                px-5 py-2.5 
                rounded-lg 
                text-sm sm:text-base 
                font-medium 
                text-zinc-300 
                bg-zinc-900/70 
                border border-zinc-700/60 
                hover:bg-zinc-800/80 
                hover:text-white 
                hover:border-zinc-600/80 
                active:scale-[0.98] 
                transition-all duration-200
              "
            >
              <span class="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>



 


      </div>


    </header>
  );
};

export default Header;