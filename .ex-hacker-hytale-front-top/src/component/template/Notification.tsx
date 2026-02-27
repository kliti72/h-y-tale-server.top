// src/components/template/Notification.tsx
import { createSignal, For, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import DiscordLoginButton from "../button/DiscordLoginButton";

type Toast = { id: number; msg: string; type?: "success" | "error" | "info" };

const [toasts, setToasts] = createSignal<Toast[]>([]);
const [showLoginModal, setShowLoginModal] = createSignal(false);

let nextId = 0;

export function notify(message: string, type: Toast["type"] = "info") {
  const id = nextId++;
  setToasts((prev) => [...prev, { id, msg: message, type }]);
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3400);
}

export function requireDiscordLogin() {
  setShowLoginModal(true);
}

const TOAST_STYLES: Record<NonNullable<Toast["type"]>, { border: string; text: string; bg: string; icon: string; glow: string }> = {
  success: {
    border: "rgba(0,255,65,0.4)",
    text: "#00ff41",
    bg: "rgba(0,20,5,0.95)",
    icon: "◈",
    glow: "rgba(0,255,65,0.15)",
  },
  error: {
    border: "rgba(255,50,50,0.4)",
    text: "#ff4444",
    bg: "rgba(20,0,0,0.95)",
    icon: "⚠",
    glow: "rgba(255,50,50,0.12)",
  },
  info: {
    border: "rgba(0,200,255,0.35)",
    text: "rgba(0,200,255,0.9)",
    bg: "rgba(0,5,20,0.95)",
    icon: "◎",
    glow: "rgba(0,200,255,0.1)",
  },
};

export default function Notifications() {
  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(30px); }
        }
        .toast-enter { animation: slideInRight 0.25s ease forwards; }
        .toast-exit  { animation: fadeOutRight 0.4s ease 3s forwards; }
      `}</style>

      {/* ── TOASTS ── */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          "z-index": "10000",
          display: "flex",
          "flex-direction": "column",
          gap: "10px",
          "pointer-events": "none",
        }}
      >
        <For each={toasts()}>
          {(t) => {
            const s = TOAST_STYLES[t.type ?? "info"];
            return (
              <div
                class="toast-enter toast-exit"
                style={{
                  position: "relative",
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  "box-shadow": `0 0 20px ${s.glow}`,
                  padding: "10px 16px",
                  "min-width": "240px",
                  "max-width": "400px",
                  "pointer-events": "auto",
                  "font-family": "'Share Tech Mono', monospace",
                }}
              >
                {/* Corner decorations */}
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: "10px", height: "10px",
                  "border-top": `1px solid ${s.border}`,
                  "border-left": `1px solid ${s.border}`,
                }} />
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "10px", height: "10px",
                  "border-bottom": `1px solid ${s.border}`,
                  "border-right": `1px solid ${s.border}`,
                }} />

                <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                  <span style={{ color: s.text, "font-size": "14px", "flex-shrink": "0" }}>{s.icon}</span>
                  <span style={{ color: s.text, "font-size": "12px", "letter-spacing": "0.05em", "line-height": "1.5" }}>
                    {t.msg}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0,
                  height: "2px",
                  width: "100%",
                  background: s.border,
                  animation: "shrink 3.4s linear forwards",
                }} />
              </div>
            );
          }}
        </For>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      {/* ── LOGIN MODAL ── */}
      <Show when={showLoginModal()}>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            "backdrop-filter": "blur(4px)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": "9999",
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div
            style={{
              position: "relative",
              background: "linear-gradient(160deg, #000500 0%, #000a02 100%)",
              border: "1px solid rgba(0,255,65,0.25)",
              "box-shadow": "0 0 60px rgba(0,255,65,0.08)",
              padding: "36px 40px",
              "max-width": "420px",
              width: "90%",
              "text-align": "center",
              "font-family": "'Share Tech Mono', monospace",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner decorations */}
            {[
              { top: 0, left: 0, "border-top": "2px solid rgba(0,255,65,0.5)", "border-left": "2px solid rgba(0,255,65,0.5)" },
              { top: 0, right: 0, "border-top": "2px solid rgba(0,255,65,0.5)", "border-right": "2px solid rgba(0,255,65,0.5)" },
              { bottom: 0, left: 0, "border-bottom": "2px solid rgba(0,255,65,0.5)", "border-left": "2px solid rgba(0,255,65,0.5)" },
              { bottom: 0, right: 0, "border-bottom": "2px solid rgba(0,255,65,0.5)", "border-right": "2px solid rgba(0,255,65,0.5)" },
            ].map((style) => (
              <div style={{ position: "absolute", width: "18px", height: "18px", ...style }} />
            ))}

            {/* Grid bg */}
            <div style={{
              position: "absolute", inset: 0, "pointer-events": "none",
              "background-image": `
                linear-gradient(rgba(0,255,65,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,65,0.02) 1px, transparent 1px)
              `,
              "background-size": "30px 30px",
            }} />

            {/* Glow */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "200px", height: "80px", "pointer-events": "none",
              background: "radial-gradient(ellipse, rgba(0,255,65,0.06) 0%, transparent 70%)",
            }} />

            <div style={{ position: "relative", "z-index": "1" }}>
              {/* Status */}
              <div style={{
                display: "flex", "align-items": "center", "justify-content": "center",
                gap: "8px", "margin-bottom": "20px",
              }}>
                <span style={{ width: "6px", height: "6px", background: "#ff4444", "border-radius": "50%", animation: "blink 1s steps(1) infinite", "box-shadow": "0 0 6px #ff4444", display: "inline-block" }} />
                <span style={{ color: "rgba(255,68,68,0.7)", "font-size": "10px", "letter-spacing": "0.3em", "text-transform": "uppercase" }}>
                  ACCESS_DENIED
                </span>
              </div>

              {/* Title */}
              <div style={{
                color: "white", "font-size": "22px", "font-weight": "900",
                "font-family": "'Orbitron', monospace", "margin-bottom": "8px",
                "text-shadow": "0 0 20px rgba(0,255,65,0.15)",
              }}>
                AUTH_REQUIRED
              </div>

              {/* Divider */}
              <div style={{
                height: "1px", margin: "16px 0",
                background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.2) 30%, rgba(0,255,65,0.2) 70%, transparent)",
              }} />

              <p style={{ color: "rgba(0,255,65,0.45)", "font-size": "12px", "margin-bottom": "28px", "line-height": "1.8", "letter-spacing": "0.04em" }}>
                <span style={{ color: "rgba(0,255,65,0.25)" }}>&gt;&gt; </span>
                Devi autenticarti con Discord<br />per votare o eseguire altre azioni.
              </p>

              <DiscordLoginButton />

              <button
                onClick={() => setShowLoginModal(false)}
                style={{
                  display: "block", width: "100%",
                  "margin-top": "12px",
                  background: "transparent",
                  color: "rgba(0,255,65,0.3)",
                  padding: "10px 24px",
                  border: "1px solid rgba(0,255,65,0.1)",
                  cursor: "pointer",
                  "font-family": "'Share Tech Mono', monospace",
                  "font-size": "11px",
                  "letter-spacing": "0.2em",
                  "text-transform": "uppercase",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(0,255,65,0.6)";
                  e.currentTarget.style.borderColor = "rgba(0,255,65,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(0,255,65,0.3)";
                  e.currentTarget.style.borderColor = "rgba(0,255,65,0.1)";
                }}
              >
                [ANNULLA]
              </button>

              <div style={{ "margin-top": "16px", color: "rgba(0,255,65,0.15)", "font-size": "10px", "letter-spacing": "0.2em" }}>
                [ AUTH_PROTOCOL // DISCORD_OAUTH2 ]
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}