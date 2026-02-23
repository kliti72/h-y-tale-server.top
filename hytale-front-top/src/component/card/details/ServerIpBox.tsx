import { createSignal } from "solid-js";
import { notify } from "../../template/Notification";
import { ServerResponse } from "../../../types/ServerResponse";

export default function ServerIpBox(props: { server: ServerResponse }) {
  const [copiedIP, setCopiedIP] = createSignal(false);

  const copyIP = async () => {
    const ip = `${props.server?.ip}${props.server?.port ? ':' + props.server?.port : ''}`;
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedIP(true);
      notify("IP_COPIED // clipboard", "success");
      setTimeout(() => setCopiedIP(false), 2000);
    } catch {
      notify("COPY_FAILED // errore clipboard", "error");
    }
  };

  return (
    <div
      class="relative"
      style={{
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(0,255,65,0.2)",
        "box-shadow": "0 0 30px rgba(0,255,65,0.05)",
        "font-family": "'Share Tech Mono', monospace",
      }}
    >
      {/* Corner decorations */}
      <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500/40 pointer-events-none" />
      <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500/40 pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500/40 pointer-events-none" />
      <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500/40 pointer-events-none" />

      <div class="px-5 py-4">
        {/* Header */}
        <div class="flex items-center gap-2 mb-3">
          <span class="text-green-700/40 text-xs">⬡</span>
          <span class="text-green-700/45 text-xs tracking-[0.25em] uppercase">SERVER_ADDRESS</span>
          <div class="h-px flex-1 bg-green-900/25" />
          <span class="text-green-800/35 text-xs tracking-widest">// CONNECT</span>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* IP display */}
          <div class="flex items-center gap-1 flex-1 min-w-0">
            <span class="text-green-700/40 text-sm mr-2">&gt;</span>
            <span
              class="text-2xl md:text-3xl font-black truncate"
              style={{
                "font-family": "'Orbitron', monospace",
                color: "#00ff41",
                "text-shadow": "0 0 20px rgba(0,255,65,0.35)",
              }}
            >
              {props.server.ip || '—'}
            </span>
            {props.server.port && (
              <>
                <span class="text-green-800/50 text-2xl md:text-3xl mx-1">:</span>
                <span
                  class="text-2xl md:text-3xl font-black"
                  style={{
                    "font-family": "'Orbitron', monospace",
                    color: "rgba(0,255,65,0.6)",
                  }}
                >
                  {props.server.port}
                </span>
              </>
            )}
          </div>

          {/* Copy button */}
          <button
            onClick={copyIP}
            class="relative flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all flex-shrink-0"
            style={{
              "font-family": "'Share Tech Mono', monospace",
              border: copiedIP() ? "1px solid rgba(0,255,65,0.6)" : "1px solid rgba(0,255,65,0.3)",
              color: copiedIP() ? "#00ff41" : "rgba(0,255,65,0.6)",
              background: copiedIP() ? "rgba(0,255,65,0.1)" : "rgba(0,0,0,0.5)",
              "box-shadow": copiedIP() ? "0 0 20px rgba(0,255,65,0.2)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!copiedIP()) {
                e.currentTarget.style.borderColor = "rgba(0,255,65,0.55)";
                e.currentTarget.style.color = "#00ff41";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0,255,65,0.12)";
              }
            }}
            onMouseLeave={(e) => {
              if (!copiedIP()) {
                e.currentTarget.style.borderColor = "rgba(0,255,65,0.3)";
                e.currentTarget.style.color = "rgba(0,255,65,0.6)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/40 pointer-events-none" />
            <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/40 pointer-events-none" />
            {copiedIP() ? "✓ COPIATO" : "◈ COPIA_IP"}
          </button>
        </div>
      </div>
    </div>
  );
}