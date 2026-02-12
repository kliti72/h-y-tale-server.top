// App.tsx
import { Component } from "solid-js";
import ServerBoard from "./component/Board";
import Footer from './component/Footer';
import { AuthProvider } from "./auth/AuthContext";
import Header from "./component/Header";

const App: Component = () => {
  return (
    
    <div
      class="
        min-h-screen 
        text-white 
        font-sans 
        antialiased 
        scroll-smooth
        bg-gradient-to-b from-black via-slate-950 to-black
        "
      style={{

    "color" : "white"
      }}
    >
      <AuthProvider >
  
      <div
        class="
          relative z-10
          min-h-screen
          flex flex-col
          backdrop-blur-[2px]
        "
        style={{
          "background": "rgba(0,0,0,0.18)",
          "box-shadow": "inset 0 0 120px rgba(0,0,0,0.6)",
        }}
      >
        <Header />

        <main class="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div class="max-w-7xl mx-auto">
            <ServerBoard />
          </div>
        </main>

        <Footer />
      </div>

      {/* Glow ambientale globale molto soft */}
      <div
        class="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          "background": "radial-gradient(ellipse at center, rgba(51, 51, 51, 0.09) 0%, transparent 50%)",
          "mix-blend-mode": "screen",
        }}
      />
      </AuthProvider>
    </div>
  );
};

export default App;