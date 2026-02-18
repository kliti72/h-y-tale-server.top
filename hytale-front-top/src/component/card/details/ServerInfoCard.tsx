import { For, Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";
import StringArrayUtils from "../../../utils/StringArrayUtils";

export default function ServerInfoCard(props: { server: ServerResponse }) {
  return (
    <div class="relative rounded-xl overflow-hidden" style={{
      background: "linear-gradient(160deg, #020d02 0%, #041004 60%, #020d02 100%)",
      border: "1px solid #0a2a0a",
      "box-shadow": "0 0 0 1px #051405, 0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(0,255,0,0.02), inset 0 1px 0 rgba(0,255,0,0.05)",
    }}>

      {/* Scanline overlay */}
      <div class="absolute inset-0 pointer-events-none opacity-10" style={{
        "background-image": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)",
      }} />

      {/* Glow top line */}
      <div class="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, #00ff00 30%, #00cc00 50%, #00ff00 70%, transparent)",
        opacity: "0.4"
      }} />

      <div class="relative p-5">

        {/* Header */}
        <div class="flex items-center gap-2 mb-5">
          <div class="w-2 h-2 rounded-full" style={{
            background: "#00ff00",
            "box-shadow": "0 0 6px #00ff00",
            animation: "pulse 2s infinite"
          }} />
          <h3 style={{
            "font-family": "'Courier New', monospace",
            color: "#00cc00",
            "font-size": "0.75rem",
            "letter-spacing": "0.15em",
            "text-shadow": "0 0 10px rgba(0,255,0,0.5)",
            "text-transform": "uppercase"
          }}>
            root@server:~$ cat modalita.txt
          </h3>
        </div>

        {/* Tags */}
        <div class="mb-2">
          <div style={{
            "font-family": "monospace",
            color: "#005500",
            "font-size": "0.65rem",
            "letter-spacing": "0.1em",
            "margin-bottom": "0.75rem"
          }}>
            // GAME_MODES DETECTED:
          </div>

          <Show
            when={props.server.tags && StringArrayUtils.toArray(props.server.tags.toString()).length > 0}
            fallback={
              <div style={{
                "font-family": "monospace",
                color: "#003300",
                "font-size": "0.75rem",
                "letter-spacing": "0.05em"
              }}>
                <span style={{ color: "#004400" }}>{'>'}</span> NULL — nessun tag trovato
              </div>
            }
          >
            <div class="flex flex-wrap gap-2">
              <For each={StringArrayUtils.toArray(props.server.tags.toString())}>
                {(tag, i) => (
                  <span
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded"
                    style={{
                      background: "rgba(0,40,0,0.6)",
                      border: "1px solid #0a3a0a",
                      "font-family": "'Courier New', monospace",
                      "font-size": "0.72rem",
                      color: "#00cc00",
                      "letter-spacing": "0.05em",
                      "text-shadow": "0 0 8px rgba(0,255,0,0.3)",
                      "box-shadow": "0 0 10px rgba(0,255,0,0.05), inset 0 1px 0 rgba(0,255,0,0.05)"
                    }}
                  >
                    <span style={{ color: "#005500" }}>[{String(i() + 1).padStart(2, '0')}]</span>
                    #{tag}
                  </span>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Footer terminale */}
        <div class="mt-5 pt-3 flex items-center justify-between" style={{
          "border-top": "1px solid #0a2a0a"
        }}>
          <span style={{
            "font-family": "monospace",
            color: "#003a00",
            "font-size": "0.6rem",
            "letter-spacing": "0.1em"
          }}>
            EXIT_CODE: 0x00
          </span>
          <span style={{
            "font-family": "monospace",
            color: "#004400",
            "font-size": "0.6rem",
          }}>
            █
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #00ff00; }
          50% { opacity: 0.4; box-shadow: 0 0 2px #00ff00; }
        }
      `}</style>
    </div>
  );
}