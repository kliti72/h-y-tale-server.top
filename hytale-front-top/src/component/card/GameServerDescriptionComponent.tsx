import { ServerResponse } from "../../types/ServerResponse";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Show } from "solid-js";

export default function GameServerDescriptionComponent(props: { server: ServerResponse }) {
  return (
    <div class="relative border border-stone-700 bg-stone-900 p-5">
      <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-800/60" />
      <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-800/60" />

      <div class="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800">
        <span class="text-amber-700 font-serif text-xs uppercase tracking-widest">⚔️ Panoramica</span>
        <div class="h-px flex-1 bg-stone-800" />
      </div>

      <Show when={props.server.description} fallback={
        <p class="text-stone-600 font-serif text-sm text-center py-8">Nessuna descrizione disponibile.</p>
      }>
        <div innerHTML={DOMPurify.sanitize(marked(props.server.description ?? "") as string)} class="server-desc" />
      </Show>

      <style>{`
        .server-desc { font-family: serif; color: #a8a29e; line-height: 1.8; font-size: 0.875rem; }
        .server-desc h1, .server-desc h2, .server-desc h3 { color: #d97706; font-weight: bold; margin: 1rem 0 0.4rem; text-transform: uppercase; letter-spacing: 0.08em; }
        .server-desc p { margin: 0.5rem 0; }
        .server-desc strong { color: #fbbf24; }
        .server-desc em { color: #78716c; font-style: italic; }
        .server-desc li { margin: 0.3rem 0; }
        .server-desc li::marker { color: #92400e; }
        .server-desc a { color: #b45309; text-decoration: underline; }
        .server-desc blockquote { border-left: 2px solid #44403c; padding-left: 0.75rem; color: #78716c; margin: 0.6rem 0; }
        .server-desc hr { border-color: #292524; margin: 0.8rem 0; }
      `}</style>
    </div>
  );
}