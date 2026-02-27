import { Component, createSignal, onMount, onCleanup, createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { ServerService } from "../services/server.service";
import GameServerCardComponent from "../component/card/GameServerCardComponent";
import { Title, Meta } from "@solidjs/meta";
import { useT } from "../lang/l18n";


const DISCORD_INVITE = "https://discord.gg/tuoinvito";
const DISCORD_GUILD_ID = "610190493862854676";


const TypingText: Component<{ texts: readonly string[] }> = (props) => {
  const [displayed, setDisplayed] = createSignal("");
  const [idx, setIdx] = createSignal(0);
  const [charIdx, setCharIdx] = createSignal(0);
  const [deleting, setDeleting] = createSignal(false);

  onMount(() => {
    const tick = () => {
      const cur = props.texts[idx()];
      if (!deleting()) {
        setCharIdx(c => c + 1);
        setDisplayed(cur.slice(0, charIdx()));
        if (charIdx() >= cur.length) setTimeout(() => setDeleting(true), 1800);
      } else {
        setCharIdx(c => c - 1);
        setDisplayed(cur.slice(0, charIdx()));
        if (charIdx() <= 0) { setDeleting(false); setIdx(i => (i + 1) % props.texts.length); }
      }
    };
    const t = setInterval(tick, deleting() ? 40 : 80);
    onCleanup(() => clearInterval(t));
  });

  return <span class="text-amber-400 font-serif italic">{displayed()}<span class="animate-pulse">|</span></span>;
};

const HeroMain: Component = () => {
  const navigate = useNavigate();
  const [servers] = createResource(() => ServerService.getServers());
  const featured = () => servers()?.data ?? [];
  const t = useT();

  const TAGLINES = t().hero_tags;

  const [online] = createResource<number | null>(async () => {
    try {
      const r = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`);
      return r.ok ? (await r.json()).presence_count ?? 0 : null;
    } catch { return null; }
  });

  return (
    <section class="relative w-full min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-stone-950 overflow-hidden">

      {/* bg texture */}
      <div class="absolute inset-0 opacity-5 pointer-events-none"
        style={{ "background-image": "radial-gradient(circle, #92400e 1px, transparent 1px)", "background-size": "32px 32px" }} />
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />

      <div class="relative z-10 max-w-4xl mx-auto text-center w-full">

        {/* eyebrow */}
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="h-px w-12 bg-amber-800/60" />
          <span class="text-amber-700 text-xs font-serif uppercase tracking-[0.3em]">{t().community_region}</span>
          <div class="h-px w-12 bg-amber-800/60" />
        </div>

        {/* title */}
        <h1 class="font-serif font-black text-6xl sm:text-7xl text-amber-500 uppercase tracking-widest drop-shadow-[0_2px_12px_rgba(180,100,10,0.4)] mb-3">
          H-YTALE
        </h1>
        <p class="text-stone-400 font-serif text-lg uppercase tracking-widest mb-2">
          Server Discovery
        </p>

        {/* typing */}
        <p class="text-stone-500 font-serif text-base mb-10 h-6">
          <TypingText texts={TAGLINES} />
        </p>

        {/* CTAs */}
        <div class="flex flex-wrap justify-center gap-4 mb-14">
          <button
            onClick={() => navigate("/servers")}
            class="relative inline-flex items-center gap-2 px-7 py-3 border-2 border-amber-800/70 bg-stone-900 hover:bg-stone-800 hover:border-amber-600 text-amber-500 hover:text-amber-400 font-serif uppercase tracking-widest text-sm transition-all shadow-[inset_0_1px_0_rgba(180,120,20,0.1)]"
          >
            <span class="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-amber-700" />
            <span class="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-amber-700" />
            ⚔️ {t().explore_server}
          </button>

          <button
            onClick={() => window.open(DISCORD_INVITE, "_blank")}
            class="inline-flex items-center gap-2 px-7 py-3 border-2 border-stone-700 bg-stone-900 hover:bg-stone-800 hover:border-stone-600 text-stone-400 hover:text-stone-300 font-serif uppercase tracking-widest text-sm transition-all"
          >
            🏰 Discord
            <Show when={!online.loading && online() != null}>
              <span class="text-xs border border-amber-900/50 bg-amber-950/30 text-amber-600 px-2 py-0.5">
                {online()} online
              </span>
            </Show>
          </button>
        </div>

        {/* Featured servers */}
        <div class="w-full">
          <div class="flex items-center gap-3 mb-5">
            <div class="h-px flex-1 bg-amber-900/30" />
            <span class="text-amber-800 text-xs font-serif uppercase tracking-[0.25em]">⚔ {t().evidence_server}</span>
            <div class="h-px flex-1 bg-amber-900/30" />
          </div>

          <div class="overflow-x-auto pb-3">
            <div class="flex gap-3 min-w-max px-1">
              <Show
                when={!servers.loading}
                fallback={
                  <For each={Array(6)}>
                    {() => <div class="w-60 h-36 bg-stone-900 border border-stone-800 animate-pulse" />}
                  </For>
                }
              >
                <For each={featured().slice(0, 8)}>
                  {(server) => <GameServerCardComponent server={server} onVoteRequest={() => ""} nascondiPulsanti={true} />}
                </For>
              </Show>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


const HomePage: Component = () => (
  <main class="w-full bg-stone-950">
    <HeroMain />
  </main>
);

export default HomePage;