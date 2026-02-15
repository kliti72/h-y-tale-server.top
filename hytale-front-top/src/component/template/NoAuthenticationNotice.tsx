// src/components/NotAuthenticatedNotice.tsx
import { Component, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";

const NotAuthenticatedNotice: Component = () => {
  const auth = useAuth();
  const isAuthenticated = () => !!auth.user(); // o auth.isAuthenticated() se ce l'hai

  return (
    <Show when={!isAuthenticated()}>
      <div
        style={{
          background: "linear-gradient(135deg, #2d3748, #1a202c)",
          border: "1px solid #4a5568",
          "border-radius": "12px",
          padding: "24px 32px",
          margin: "24px auto",
          "max-width": "600px",
          "text-align": "center",
          color: "#e2e8f0",
          "box-shadow": "0 8px 25px rgba(0,0,0,0.4)",
        }}
      >
        <h3
          style={{
            "font-size": "1.5rem",
            "margin-bottom": "16px",
            color: "#cbd5e1",
          }}
        >
          Non sei autenticato
        </h3>

        <p style={{ "margin-bottom": "20px", "line-height": "1.6" }}>
          Per votare i server, aggiungere ai preferiti, vedere statistiche personali  
          e sbloccare altre funzionalità devi collegare il tuo account Discord.
        </p>

        <button
          onClick={() => auth.login()}
          style={{
            background: "#5865F2",
            color: "white",
            "border": "none",
            padding: "14px 36px",
            "border-radius": "8px",
            "font-weight": 600,
            "font-size": "1.1rem",
            cursor: "pointer",
            transition: "all 0.2s",
            "margin-bottom": "24px",
          }}
        >
          Accedi con Discord
        </button>

        {/* Elementi "a preferenza" – puoi aggiungere/rimuovere quello che vuoi */}
        <div
          style={{
            display: "grid",
            "grid-template-columns": "1fr 1fr",
            gap: "16px",
            "font-size": "0.95rem",
            color: "#a0aec0",
          }}
        >
          <div>
            <strong>Vota i server</strong><br />
            <span style={{ "font-size": "0.85rem" }}>Supporta i tuoi preferiti</span>
          </div>
          <div>
            <strong>Aggiungi ai preferiti</strong><br />
            <span style={{ "font-size": "0.85rem" }}>Salva e ricevi aggiornamenti</span>
          </div>
          <div>
            <strong>Statistiche personali</strong><br />
            <span style={{ "font-size": "0.85rem" }}>Vedi i tuoi voti e ranking</span>
          </div>
          <div>
            <strong>Badge & riconoscimenti</strong><br />
            <span style={{ "font-size": "0.85rem" }}>Mostra il tuo supporto</span>
          </div>
        </div>

        <p style={{ "margin-top": "24px", "font-size": "0.9rem", color: "#94a3b8" }}>
          L'accesso è veloce e sicuro — usiamo solo le informazioni base di Discord.
        </p>
      </div>
    </Show>
  );
};

export default NotAuthenticatedNotice;