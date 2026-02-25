import { Component, createSignal, For, Show } from "solid-js";
import HeroSection from "../component/hero/HeroTieatryServer";
import TertiaryHero from "../component/hero/SecondaryHero";
import HeroMain from "../component/hero/HeroMain";
import { useAuth } from "../auth/AuthContext";


const HomePage: Component = () => {
  
  const auth = useAuth();

  return (
    <section>
      <section class="w-full" style={{ "background-color": "black" }}>
        <HeroMain />
        <TertiaryHero />
        <HeroSection />
      </section>
    </section>
  );
};

export default HomePage;