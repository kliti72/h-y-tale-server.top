import { For, Show } from "solid-js";
import ServerCardHacking from "../../component/card/ServerCard/ServerCardHacking";

export default function FavoritePage() {
  const { favoritedServers } = useFavorites();

  const handleVoteRequest = (serverId: number) => {
    // TODO: gestisci voto
  };

  return (
    <div class="min-h-screen relative">

      {/* ── Hero ── */}
      <div class="relative py-16 px-6 text-center overflow-hidden">

        {/* Glow sfondo */}
        <div class="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(80,140,255,0.07) 0%, transparent 100%)",
        }} />

        {/* Runa top */}
        <div style={{
          "font-family": "Georgia, serif",
          color: "#2a4a7a",
          "font-size": "0.65rem",
          "letter-spacing": "0.3em",
          "text-transform": "uppercase",
          "margin-bottom": "12px",
        }}>
          ᚹ ᛟ ᚠ ᚱ ᚢ ᚾ ᚹ
        </div>

        {/* Titolo */}
        <h1 style={{
          "font-family": "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
          "font-size": "clamp(2rem, 6vw, 3.5rem)",
          "font-weight": "900",
          color: "#6aadff",
          "text-shadow": "0 0 30px rgba(80,150,255,0.5), 0 0 60px rgba(80,150,255,0.1)",
          "letter-spacing": "0.06em",
          margin: "0 0 12px 0",
          "line-height": "1",
        }}>
          ⚜ Reami Custoditi ⚜
        </h1>

        {/* Sottotitolo */}
        <p style={{
          "font-family": "Georgia, serif",
          color: "#2a4a7a",
          "font-size": "0.95rem",
          "font-style": "italic",
          "letter-spacing": "0.08em",
          "margin-bottom": "0",
        }}>
          I varchi che hai scelto di tenere in memoria, viaggiatore
        </p>

        {/* Divider */}
        <div class="flex items-center gap-3 mt-6 max-w-md mx-auto" style={{ opacity: "0.5" }}>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, transparent, #2a4a7a)" }} />
          <span style={{ color: "#2a4a7a", "font-size": "0.7rem", "font-family": "serif" }}>◆</span>
          <span style={{ color: "#1a3050", "font-size": "0.6rem", "font-family": "serif" }}>ᚠᚹᛟ</span>
          <span style={{ color: "#2a4a7a", "font-size": "0.7rem", "font-family": "serif" }}>◆</span>
          <div style={{ flex: "1", height: "1px", background: "linear-gradient(90deg, #2a4a7a, transparent)" }} />
        </div>
      </div>

      {/* ── Contenuto ── */}
      <div class="px-6 pb-16 max-w-7xl mx-auto">

        <Show
          when={favoritedServers().length > 0}
          fallback={
            /* Empty state */
            <div class="flex flex-col items-center justify-center py-20 gap-4">
              <div style={{
                "font-family": "Georgia, serif",
                color: "#1a3050",
                "font-size": "3rem",
                opacity: "0.4",
              }}>⚔</div>
              <p style={{
                "font-family": "'Palatino Linotype', Palatino, Georgia, serif",
                color: "#1e3458",
                "font-size": "1rem",
                "font-style": "italic",
                "letter-spacing": "0.08em",
                "text-align": "center",
              }}>
                Nessun reame custodito — esplora e aggiungi i tuoi preferiti
              </p>
              <div style={{
                "font-family": "Georgia, serif",
                color: "#1a2d45",
                "font-size": "0.6rem",
                "letter-spacing": "0.2em",
                "text-transform": "uppercase",
                opacity: "0.5",
              }}>
                ᚠ Le rune tacciono ᚠ
              </div>
            </div>
          }
        >
          {/* Counter */}
          <div class="flex items-center gap-2 mb-6" style={{
            "font-family": "Georgia, serif",
            color: "#2a4a7a",
            "font-size": "0.65rem",
            "letter-spacing": "0.15em",
            "text-transform": "uppercase",
          }}>
            <span style={{ color: "#3a6a9a" }}>†</span>
            <span>{favoritedServers().length} reami custoditi</span>
            <span style={{ color: "#3a6a9a" }}>†</span>
          </div>

          {/* Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <For each={favoritedServers()}>
              {(server) => (
                <ServerCardHacking server={server} onVoteRequest={handleVoteRequest} />
              )}
            </For>
          </div>
        </Show>

      </div>
    </div>
  );
}

function useFavorites(): { favoritedServers: any; } {
    throw new Error("Function not implemented.");
}
