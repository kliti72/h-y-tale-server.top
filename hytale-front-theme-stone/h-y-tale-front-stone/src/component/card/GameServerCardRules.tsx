import { marked } from "marked";
import DOMPurify from "dompurify";
import { Show } from "solid-js";

export default function GameServerCardRules(props: { rules: string }) {
  return (
    <Show when={props.rules} fallback={
      <div class="p-5 text-center border border-stone-800 bg-stone-900">
        <p class="text-stone-600 font-serif text-xs uppercase tracking-widest">📜 Nessuna regola pubblicata</p>
      </div>
    }>
      <div class="relative border border-stone-700 bg-stone-900 p-5">
        <span class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-800/60" />
        <span class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-800/60" />

        <div class="flex items-center gap-2 mb-4 pb-3 border-b border-stone-800">
          <span class="text-amber-700 font-serif text-xs uppercase tracking-widest">📜 Regole del Server</span>
          <div class="h-px flex-1 bg-stone-800" />
        </div>

        <div innerHTML={DOMPurify.sanitize(marked(props.rules) as string)} class="rules-md" />
      </div>

      <style>{`
        .rules-md { font-family: serif; color: #a8a29e; line-height: 1.8; font-size: 0.85rem; }
        .rules-md h1, .rules-md h2, .rules-md h3 { color: #d97706; font-weight: bold; margin: 1rem 0 0.4rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .rules-md h1 { font-size: 0.95rem; }
        .rules-md h2 { font-size: 0.85rem; }
        .rules-md h3 { font-size: 0.78rem; }
        .rules-md li { list-style: none; padding-left: 0.5rem; margin: 0.3rem 0; }
        .rules-md li::before { content: '⚔ '; color: #78350f; }
        .rules-md strong { color: #fbbf24; }
        .rules-md a { color: #b45309; text-decoration: underline; }
        .rules-md hr { border-color: #292524; margin: 0.8rem 0; }
        .rules-md blockquote { border-left: 2px solid #44403c; padding-left: 0.75rem; color: #78716c; }
        .rules-md code { background: #1c1917; border: 1px solid #292524; padding: 0.1rem 0.3rem; color: #d6d3d1; font-size: 0.75rem; }
      `}</style>
    </Show>
  );
}