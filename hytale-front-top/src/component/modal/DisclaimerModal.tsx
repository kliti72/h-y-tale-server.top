import { createSignal, onMount, Show } from "solid-js";

const STORAGE_KEY = "hytale_top_disclaimer_accepted";

export function DisclaimerModal() {
    const [visible, setVisible] = createSignal(false);
    const [closing, setClosing] = createSignal(false);

    onMount(() => {
        const accepted = localStorage.getItem(STORAGE_KEY);
        if (!accepted) setVisible(true);
    });

    const accept = () => {
        setClosing(true);
        setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, "1");
            setVisible(false);
            setClosing(false);
        }, 800);
    };

    return (
        <Show when={visible()}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=IM+Fell+English:ital@0;1&display=swap');

        @keyframes disclaimerIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes disclaimerOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cardOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-16px) scale(0.97); }
        }
        @keyframes runeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes swordReveal {
          from { opacity: 0; transform: scaleY(0); }
          to   { opacity: 1; transform: scaleY(1); }
        }
        .disclaimer-overlay {
          animation: ${closing() ? "disclaimerOut" : "disclaimerIn"} 0.6s ease both;
        }
        .disclaimer-card {
          animation: ${closing() ? "cardOut" : "cardIn"} 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }
        .rune-scroll {
          animation: runeScroll 18s linear infinite;
          white-space: nowrap;
        }
        .glow-line {
          animation: glowPulse 2.5s ease-in-out infinite;
        }
        .sword-line {
          animation: swordReveal 0.8s 0.6s cubic-bezier(0.16,1,0.3,1) both;
          transform-origin: top;
        }
        .accept-btn:hover .btn-inner {
          background: linear-gradient(135deg, #78350f, #451a03) !important;
          border-color: #c2410c !important;
          box-shadow: 0 0 24px rgba(194,65,12,0.4) !important;
        }
        .accept-btn:hover .btn-rune {
          color: #fb923c !important;
        }
        .accept-btn:active .btn-inner {
          transform: scale(0.97);
        }
      `}</style>

            {/* Overlay */}
            <div
                class="disclaimer-overlay"
                style={{
                    position: "fixed",
                    inset: 0,
                    "z-index": "9999",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    padding: "1rem",
                    background: "radial-gradient(ellipse at center, #1a0f0580 0%, #08070590 60%, #050403ee 100%)",
                    "backdrop-filter": "blur(4px)",
                }}
            >

                {/* Card */}
                <div
                    class="disclaimer-card"
                    style={{
                        position: "relative",
                        width: "100%",
                        "max-width": "480px",
                        background: "linear-gradient(160deg, #0f0d0a 0%, #0a0806 100%)",
                        border: "1px solid #3a2e1e",
                        overflow: "hidden",
                    }}
                >

                    {/* Top glow */}
                    <div
                        class="glow-line absolute top-0 inset-x-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, #c2410c, transparent)" }}
                    />

                    {/* Corner accents */}
                    <span style={{ position: "absolute", top: 0, left: 0, width: "12px", height: "12px", "border-top": "2px solid #92400e", "border-left": "2px solid #92400e" }} />
                    <span style={{ position: "absolute", top: 0, right: 0, width: "12px", height: "12px", "border-top": "2px solid #92400e", "border-right": "2px solid #92400e" }} />
                    <span style={{ position: "absolute", bottom: 0, left: 0, width: "12px", height: "12px", "border-bottom": "2px solid #92400e", "border-left": "2px solid #92400e" }} />
                    <span style={{ position: "absolute", bottom: 0, right: 0, width: "12px", height: "12px", "border-bottom": "2px solid #92400e", "border-right": "2px solid #92400e" }} />

                    {/* Rune scroll top */}
                    <div style={{ overflow: "hidden", "border-bottom": "1px solid #2a1f12", padding: "0.4rem 0" }}>
                        <div class="rune-scroll" style={{ "font-family": "monospace", "font-size": "0.55rem", color: "#3a2e1e", "letter-spacing": "0.4em" }}>
                            ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "2rem 2rem 1.5rem" }}>

                        {/* Sword divider top */}
                        <div class="sword-line flex items-center gap-3 mb-5">
                            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #92400e)" }} />
                            <span style={{ "font-family": "monospace", "font-size": "0.7rem", color: "#c2410c" }}>⚔</span>
                            <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, transparent, #92400e)" }} />
                        </div>

                        {/* Title */}
                        <p style={{
                            "font-family": "'Cinzel', serif",
                            "font-size": "0.55rem",
                            "letter-spacing": "0.35em",
                            "text-transform": "uppercase",
                            color: "#78350f",
                            "text-align": "center",
                            "margin-bottom": "0.6rem",
                        }}>
                            Avviso del Regno
                        </p>

                        <h2 style={{
                            "font-family": "'Cinzel', serif",
                            "font-size": "1.15rem",
                            "font-weight": "900",
                            color: "#d97706",
                            "text-align": "center",
                            "letter-spacing": "0.06em",
                            "text-shadow": "0 0 20px rgba(217,119,6,0.3)",
                            "margin-bottom": "1.4rem",
                            "line-height": "1.3",
                        }}>
                            Sito Indipendente
                        </h2>

                        {/* Body */}
                        <div style={{
                            "font-family": "'IM Fell English', serif",
                            "font-size": "0.82rem",
                            color: "#a8956a",
                            "line-height": "1.7",
                            "text-align": "center",
                            "margin-bottom": "1.6rem",
                        }}>
                            <p style={{ "margin-bottom": "0.8rem" }}>
                                Questo sito <span style={{ color: "#c2410c", "font-style": "normal" }}>non è affiliato</span> né approvato
                                da <span style={{ color: "#d97706" }}>Hypixel Studios</span> o dai creatori di Hytale.
                            </p>
                            <p style={{ color: "#6b5a42", "font-size": "0.75rem", "font-style": "italic" }}>
                                Hytale e tutti i suoi contenuti sono proprietà di Hypixel Studios.
                                Questo è un progetto della community.
                            </p>
                        </div>

                        {/* Sword divider bottom */}
                        <div class="flex items-center gap-3 mb-5">
                            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #3a2e1e)" }} />
                            <span style={{ "font-family": "monospace", "font-size": "0.5rem", color: "#3a2e1e" }}>ᛟ</span>
                            <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, transparent, #3a2e1e)" }} />
                        </div>

                        {/* Accept button */}
                        <div class="accept-btn" style={{ cursor: "pointer" }} onClick={accept}>
                            <div
                                class="btn-inner"
                                style={{
                                    position: "relative",
                                    background: "linear-gradient(135deg, #451a03, #2a0f01)",
                                    border: "1px solid #78350f",
                                    padding: "0.75rem 1.5rem",
                                    "text-align": "center",
                                    transition: "all 0.25s ease",
                                    "box-shadow": "0 0 12px rgba(120,53,15,0.2)",
                                }}
                            >
                                <span style={{ position: "absolute", top: 0, left: 0, width: "8px", height: "8px", "border-top": "1px solid #c2410c", "border-left": "1px solid #c2410c" }} />
                                <span style={{ position: "absolute", bottom: 0, right: 0, width: "8px", height: "8px", "border-bottom": "1px solid #c2410c", "border-right": "1px solid #c2410c" }} />
                                <span
                                    class="btn-rune"
                                    style={{
                                        "font-family": "'Cinzel', serif",
                                        "font-size": "0.65rem",
                                        "font-weight": "700",
                                        "letter-spacing": "0.3em",
                                        "text-transform": "uppercase",
                                        color: "#d97706",
                                        transition: "color 0.25s",
                                    }}
                                >
                                    ᚢ Comprendo — Entra nel Regno
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Bottom rune scroll */}
                    <div style={{ overflow: "hidden", "border-top": "1px solid #2a1f12", padding: "0.4rem 0" }}>
                        <div class="rune-scroll" style={{ "font-family": "monospace", "font-size": "0.55rem", color: "#3a2e1e", "letter-spacing": "0.4em" }}>
                            ᛟ ᚾᛁᛚ ᚠᛟᚱᚷᛖ ᛟ ᚾᛁᛚ ᚠᛟᚱᚷᛖ ᛟ ᚾᛁᛚ ᚠᛟᚱᚷᛖ ᛟ ᚾᛁᛚ ᚠᛟᚱᚷᛖ ᛟ ᚾᛁᛚ ᚠᛟᚱᚷᛖ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>

                    {/* Bottom glow */}
                    <div
                        class="glow-line absolute bottom-0 inset-x-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, #78350f60, transparent)" }}
                    />

                </div>
            </div>
        </Show>
    );
}