// Header.tsx
import { Component } from "solid-js";
import DiscordLoginButton from "./DiscordLoginButton";

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

        <DiscordLoginButton />

      </div>


    </header>
  );
};

export default Header;