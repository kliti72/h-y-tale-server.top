import { createSignal, Show } from "solid-js";
import { notify } from "../template/Notification";
import { ServerResponse } from "../../types/ServerResponse";

export default function ShareButton(props: { server: ServerResponse }) {
  const [showShareMenu, setShowShareMenu] = createSignal(false);

  const shareServer = (platform: string) => {
    const url = window.location.href;
    switch (platform) {
      case 'twitter': {
        const text = props.server.name && props.server.ip
          ? `Guardate il server ${props.server.name}, IP: ${props.server.ip} su Hytale. Info:`
          : "Guarda questo server Hytale!";
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      }
      case 'discord':
        if (props.server.discord_url) {
          navigator.clipboard.writeText(props.server.discord_url);
          notify("DISCORD_LINK_COPIED // clipboard", "success");
        } else {
          notify("DISCORD_NOT_FOUND // server non ha discord", "error");
        }
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        notify("LINK_COPIED // clipboard", "success");
        break;
    }
    setShowShareMenu(false);
  };

  const items = [
    { key: "twitter", icon: "𝕏", label: "SHARE_TWITTER" },
    { key: "discord", icon: "⬡", label: "COPY_DISCORD" },
    { key: "copy",    icon: "◈", label: "COPY_LINK" },
  ];

  return (
    <div class="relative" style={{ "font-family": "'Share Tech Mono', monospace" }}>
      <button
        onClick={() => setShowShareMenu(!showShareMenu())}
        class="relative flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-widest uppercase transition-all"
        style={{
          border: "1px solid rgba(0,255,65,0.25)",
          color: "rgba(0,255,65,0.5)",
          background: "rgba(0,0,0,0.6)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(0,255,65,0.45)";
          e.currentTarget.style.color = "rgba(0,255,65,0.8)";
          e.currentTarget.style.boxShadow = "0 0 15px rgba(0,255,65,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(0,255,65,0.25)";
          e.currentTarget.style.color = "rgba(0,255,65,0.5)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500/30 pointer-events-none" />
        <div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500/30 pointer-events-none" />
        <span style={{ color: "rgba(0,255,65,0.5)" }}>◎</span>
        SHARE
      </button>

      <Show when={showShareMenu()}>
        {/* Overlay chiudi */}
        <div class="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />

        {/* Dropdown */}
        <div
          class="absolute right-0 mt-1 w-52 z-20 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #000500, #000a02)",
            border: "1px solid rgba(0,255,65,0.2)",
            "box-shadow": "0 8px 30px rgba(0,0,0,0.9), 0 0 20px rgba(0,255,65,0.04)",
          }}
        >
          {/* Header */}
          <div
            class="px-3 py-2 text-xs border-b"
            style={{ "border-color": "rgba(0,255,65,0.1)", color: "rgba(0,255,65,0.3)", "letter-spacing": "0.2em" }}
          >
            &gt; SHARE_PROTOCOL
          </div>

          {items.map((item) => (
            <button
              onClick={() => shareServer(item.key)}
              class="w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs tracking-widest uppercase transition-all border-b"
              style={{
                "border-color": "rgba(0,255,65,0.07)",
                color: "rgba(0,255,65,0.4)",
                background: "transparent",
                "font-family": "'Share Tech Mono', monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,255,65,0.05)";
                e.currentTarget.style.color = "#00ff41";
                e.currentTarget.style.paddingLeft = "20px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(0,255,65,0.4)";
                e.currentTarget.style.paddingLeft = "16px";
              }}
            >
              <span style={{ color: "rgba(0,255,65,0.5)", "font-size": "13px" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </Show>
    </div>
  );
}