import { For, Show } from "solid-js";
import { ServerResponse } from "../../../types/ServerResponse";

const LINKS = [
  { key: "website_url", label: "Sito Web", icon: "🌐", cmd: "web" },
  { key: "discord_url", label: "Discord", icon: "💬", cmd: "discord" },
] as const;

export default function ServerQuiLinkCard(props: { server: ServerResponse }) {
  return (
    <div class="relative rounded-xl overflow-hidden" style={{
      background: "linear-gradient(160deg, #020d02 0%, #041004 60%, #020d02 100%)",
      border: "1px solid #0a2a0a",
      "box-shadow": "0 0 0 1px #051405, 0 20px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(0,255,0,0.05)",
    }}>

      {/* Scanlines */}
      <div class="absolute inset-0 pointer-events-none opacity-10" style={{
        "background-image": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)",
      }} />

      {/* Top glow line */}
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
          <span style={{
            "font-family": "'Courier New', monospace",
            color: "#00cc00",
            "font-size": "0.75rem",
            "letter-spacing": "0.15em",
            "text-shadow": "0 0 10px rgba(0,255,0,0.5)",
            "text-transform": "uppercase"
          }}>
            root@server:~$ ls links/
          </span>
        </div>

        {/* Comment */}
        <div style={{
          "font-family": "monospace",
          color: "#005500",
          "font-size": "0.65rem",
          "letter-spacing": "0.1em",
          "margin-bottom": "0.75rem"
        }}>
          // EXTERNAL_LINKS FOUND:
        </div>

        {/* Links */}
        <div class="space-y-2">
          <span style={{
            "font-family": "'Courier New', monospace",
            color: "#00aa00",
            "font-size": "0.72rem",
            "letter-spacing": "0.05em",
            "text-shadow": "0 0 8px rgba(0,255,0,0.3)",
          }}>
            <Show when={props.server.website_url} fallback={"Website not found"}>
                  Website: <a href={props.server.website_url}> Connettiti al sito web di {props.server.name} </a> {} <br> </br>
            </Show>

          <Show when={props.server.discord_url} fallback={"Discord not found"}>
                  Discord: <a href={props.server.discord_url}> Connettiti nel discord di {props.server.name} </a> {} <br> </br>
            </Show>

          </span>
          <span class="ml-auto flex items-center gap-1.5" style={{
            "font-family": "monospace",
            color: "#004400",
            "font-size": "0.7rem",
          }}>
            <span style={{ color: "#003300" }}>↗</span>
          </span>
        </div>

        {/* Footer */}
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
            animation: "pulse 1s infinite"
          }}>
            █
          </span>
        </div>
      </div>
    </div>
  );
}