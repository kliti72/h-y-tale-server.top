import { createSignal } from "solid-js";
import { notify } from "../notify/NotificationComponent";
import { ServerResponse } from "../../types/ServerResponse";

export default function GameServerAddressBoxComponent(props: { server: ServerResponse }) {
  const [copied, setCopied] = createSignal(false);

  const copyIP = async () => {
    const ip = `${props.server.ip}${props.server.port ? ':' + props.server.port : ''}`;
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      notify("IP copiato!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch { notify("Errore copia", "error"); }
  };

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(15,12,9,0.6) 0%, rgba(10,8,6,0.4) 100%)",
        border: "1px solid #3a2e1e80",
        padding: "0.6rem 1rem",
        "backdrop-filter": "blur(4px)",
        display: "flex",
        "align-items": "center",
        gap: "1rem",
        "flex-wrap": "wrap",
        "justify-content": "space-between",
      }}
    >
      {/* corner runes */}
      <span style={{ position: "absolute", top: 0, left: 0, width: "8px", height: "8px", "border-top": "1px solid #92400e80", "border-left": "1px solid #92400e80" }} />
      <span style={{ position: "absolute", bottom: 0, right: 0, width: "8px", height: "8px", "border-bottom": "1px solid #92400e80", "border-right": "1px solid #92400e80" }} />

      {/* IP */}
      <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
        <span style={{ "font-family": "monospace", "font-size": "0.55rem", color: "#78350f", "letter-spacing": "0.2em" }}>ᚱ</span>
        <p style={{
          "font-family": "'Cinzel', serif",
          "font-size": "clamp(1rem, 3vw, 1.4rem)",
          "font-weight": "700",
          color: "#d97706",
          "letter-spacing": "0.06em",
          "text-shadow": "0 0 16px rgba(217,119,6,0.2)",
          margin: 0,
        }}>
          {props.server.ip || '—'}
          {props.server.port &&
            <span style={{ color: "#44403c", "font-size": "0.75em" }}>:{props.server.port}</span>
          }
        </p>
      </div>

      {/* Copy button */}
      <button
        onClick={copyIP}
        style={{
          position: "relative",
          background: copied()
            ? "rgba(20,83,45,0.25)"
            : "rgba(15,12,9,0.5)",
          border: copied()
            ? "1px solid #166534aa"
            : "1px solid #3a2e1e",
          padding: "0.3rem 0.8rem",
          "font-family": "'Cinzel', serif",
          "font-size": "0.55rem",
          "letter-spacing": "0.2em",
          "text-transform": "uppercase",
          color: copied() ? "#16a34a" : "#78350f",
          cursor: "pointer",
          transition: "all 0.25s ease",
          "flex-shrink": "0",
        }}
        onMouseOver={e => { if (!copied()) { e.currentTarget.style.borderColor = "#92400e"; e.currentTarget.style.color = "#d97706"; }}}
        onMouseOut={e => { if (!copied()) { e.currentTarget.style.borderColor = "#3a2e1e"; e.currentTarget.style.color = "#78350f"; }}}
      >
        <span style={{ position: "absolute", top: 0, left: 0, width: "5px", height: "5px", "border-top": "1px solid currentColor", "border-left": "1px solid currentColor", opacity: "0.6" }} />
        <span style={{ position: "absolute", bottom: 0, right: 0, width: "5px", height: "5px", "border-bottom": "1px solid currentColor", "border-right": "1px solid currentColor", opacity: "0.6" }} />
        {copied() ? "ᚢ Copiato" : "ᚱ Copia IP"}
      </button>
    </div>
  );
}