// src/components/template/Notification.tsx
import { createSignal, For, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext"; // ← presumo tu abbia questo
import DiscordLoginButton from "../button/DiscordLoginButton";

type Toast = { id: number; msg: string; type?: "success" | "error" | "info" };

const [toasts, setToasts] = createSignal<Toast[]>([]);
const [showLoginModal, setShowLoginModal] = createSignal(false);

let nextId = 0;

// Toast normale
export function notify(message: string, type: Toast["type"] = "info") {
  const id = nextId++;
  setToasts((prev) => [...prev, { id, msg: message, type }]);

  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3400);
}

// Modale di login Discord
export function requireDiscordLogin() {
  setShowLoginModal(true);
}


export default function Notifications() {
  const auth = useAuth(); // se vuoi mostrare nome utente o stato

  return (
    <>
      {/* ── Toast ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          "z-index": 10000,
          display: "flex",
          "flex-direction": "column",
          gap: "12px",
          "pointer-events": "none",
        }}
      >
        <For each={toasts()}>
          {(t) => (
            <div
              class="toast"
              style={{
                "background-color":
                  t.type === "success"
                    ? "#14532d"
                    : t.type === "error"
                    ? "#7f1d1d"
                    : "#1e293b",
                color: "#f1f5f9",
                padding: "12px 18px",
                "border-radius": "8px",
                "box-shadow": "0 6px 20px rgba(0,0,0,0.4)",
                "min-width": "220px",
                "max-width": "420px",
                "pointer-events": "auto",
                animation: "fadeIn 0.3s, fadeOut 0.4s 3s forwards",
              }}
            >
              {t.msg}
            </div>
          )}
        </For>
      </div>

      {/* ── Modale Login Discord ───────────────────────────────── */}
      <Show when={showLoginModal()}>
        <div
          style={{
            position: "fixed",
            inset: 0,
            "background-color": "rgba(0,0,0,0.75)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 9999,
          }}
          onClick={() => setShowLoginModal(false)} // chiudi cliccando fuori
        >
          <div
            style={{
              "background-color": "#1e1e1e",
              "border-radius": "12px",
              padding: "32px 40px",
              "max-width": "420px",
              width: "90%",
              "text-align": "center",
              "box-shadow": "0 10px 30px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()} // impedisci chiusura cliccando dentro
          >
            <h2 style={{ "font-size": "1.5rem", "margin-bottom": "16px", "color" : "white", "font-width" : "bold"}}>
              Accesso richiesto
            </h2>

            <p style={{ "margin-bottom": "24px", color: "#d1d5db" }}>
              Devi accedere con Discord per proseguire con il voto o altre azioni.
            </p>

            <DiscordLoginButton />  

            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                "margin-left": "16px",
                background: "transparent",
                color: "#d1d5db",
                padding: "12px 24px",
                "border-radius": "8px",
                cursor: "pointer",
              }}
            >
              Annulla
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}