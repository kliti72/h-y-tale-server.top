// AddServerModal.tsx
import { Component, createSignal, For, Show, createMemo } from "solid-js";
import { useAuth } from "../../auth/AuthContext";
import { ServerResponse } from "../../types/ServerResponse";
import { marked } from "marked";
import DOMPurify from "dompurify";

type AddServerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Partial<ServerResponse>) => void;
};

const AddServerModal: Component<AddServerModalProps> = (props) => {
  const auth = useAuth();

  const [step, setStep] = createSignal(1);
  const [name, setName] = createSignal("");
  const [ip, setIp] = createSignal("");
  const [port, setPort] = createSignal("25565");
  const [description, setDescription] = createSignal("");
  const [rules, setRules] = createSignal("");
  const [tags, setTags] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");
  const [website, setWebsite] = createSignal("");
  const [discord, setDiscord] = createSignal("");
  const [logoUrl, setLogoUrl] = createSignal("");
  const [bannerUrl, setBannerUrl] = createSignal("");


  // Regole

  // UI State
  const [currentStep, setCurrentStep] = createSignal(1);


  // Preset tags comuni
  const presetTags = [
    "PvP", "Survival", "Creative", "Roleplay", "Economy",
    "Factions", "Skyblock", "Prison", "Towny", "Vanilla",
    "Modded", "Italian", "Events", "Discord Rich", "No Lag"
  ];

  const addTag = (tag?: string) => {
    const tagToAdd = tag || newTag().trim();
    if (tagToAdd && !tags().includes(tagToAdd)) {
      setTags((prev) => [...prev, tagToAdd]);
      setNewTag("");
    }
  };

  function arrayToCommaStringNoSpace(items: string[]): string {
    return items.join(",");
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = () => {

    // Validazione base
    if (!name().trim()) {
      alert("Inserisci il nome del server bro!");
      return;
    }
    if (!ip().trim()) {
      alert("Inserisci l'IP del server!");
      return;
    }
    if (!port().trim()) {
      alert("Inserisci la porta!");
      return;
    }
    if (!description().trim()) {
      alert("Aggiungi una descrizione del server!");
      return;
    }

    props.onSubmit?.({
      name: name(),
      ip: ip(),
      port: port(),
      description: description(),
      tags: tags(),
      website_url: website() || '',
      discord_url: discord() || '',
      banner_url: bannerUrl() || '',
      logo_url: logoUrl() || '',
      rules: rules() || '',
      secret_key: '',
    });

    resetForm();
    props.onClose();
  };

  const resetForm = () => {
    setName("");
    setIp("");
    setPort("65564");
    setDescription("");
    setTags([]);
    setWebsite("");
    setDiscord("");
    setBannerUrl("");
    setLogoUrl("");
    setRules("");
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep() < 3) setCurrentStep(currentStep() + 1);
  };

  const prevStep = () => {
    if (currentStep() > 1) setCurrentStep(currentStep() - 1);
  };

  // Preview Markdown sicure
  const descriptionHtml = createMemo(() => {
    if (!description()) return "<p class='text-violet-400 italic'>Inserisci una descrizione...</p>";
    const raw = marked.parse(description(), { async: false, gfm: true });
    return DOMPurify.sanitize(raw as string);
  });

  const rulesHtml = createMemo(() => {
    if (!rules()) return "<p class='text-violet-400 italic'>Nessuna regola inserita</p>";
    const raw = marked.parse(rules(), { async: false, gfm: true });
    return DOMPurify.sanitize(raw as string);
  });


  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={props.onClose}
      >
        <div
          class="
            bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950
            border border-violet-700/50 rounded-none md:rounded-2xl
            w-full max-w-none md:max-w-6xl mx-auto
            min-h-screen md:min-h-[96vh] md:my-4
            shadow-2xl shadow-violet-950/70
            flex flex-col
          "
          onClick={e => e.stopPropagation()}
        >
          {/* Header più piccolo */}
          <div class="bg-gradient-to-r from-violet-800 to-fuchsia-800 px-5 py-4 md:px-8 md:py-5 flex items-center justify-between border-b border-violet-700/40">
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                <span class="text-3xl">🎮</span> Aggiungi Server
              </h2>
              <p class="text-sm md:text-base text-violet-200 mt-0.5">Rendi visibile il tuo server in pochi passi</p>
            </div>
            <button
              onClick={props.onClose}
              class="text-3xl text-white/80 hover:text-white transition hover:rotate-90 duration-300"
            >
              ×
            </button>
          </div>

          {/* Steps bar (ridotta) */}
          <div class="bg-black/30 px-5 py-4 md:px-8 border-b border-violet-800/40">
            <div class="flex justify-center gap-2 md:gap-5 flex-wrap">
              {[
                { n: 1, txt: "Base", icon: "📝" },
                { n: 2, txt: "Dettagli", icon: "🎨" },
              ].map(s => (
                <>
                  <button
                    type="button"
                    onClick={() => setStep(s.n)}
                    class={`
                      px-4 py-2.5 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all
                      ${step() === s.n
                        ? "bg-fuchsia-700 text-white shadow-md"
                        : step() > s.n
                          ? "bg-emerald-800/40 text-emerald-300"
                          : "bg-violet-900/50 text-violet-300 hover:bg-violet-800/60"}
                    `}
                  >
                    {s.icon} <span class="hidden sm:inline">{s.txt}</span>
                  </button>
                  {s.n < 2 && <div class="hidden md:block w-10 h-0.5 my-auto bg-violet-700/40" />}
                </>
              ))}
            </div>
          </div>

          {/* Contenuto principale - ora occupa quasi tutto lo spazio */}
          <div class="flex-1 overflow-y-auto p-5 md:p-8 lg:p-10 space-y-8 md:space-y-10">
            {/* STEP 1 - Info base (invariato o leggermente ridotto) */}
            <Show when={step() === 1}>
              <section class="space-y-8">
                <h3 class="text-2xl md:text-3xl font-bold text-fuchsia-400 flex items-center gap-3">
                  <span>📝</span> Informazioni essenziali
                </h3>

                <div class="space-y-6">
                  <div>
                    <label class="block text-violet-200 font-medium mb-2">Nome Server *</label>
                    <input
                      value={name()}
                      onInput={e => setName(e.currentTarget.value)}
                      placeholder="Es: Italian Hardcore ITA"
                      class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white placeholder-violet-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div class="md:col-span-2">
                      <label class="block text-violet-200 font-medium mb-2">Indirizzo IP / Dominio *</label>
                      <input
                        value={ip()}
                        onInput={e => setIp(e.currentTarget.value)}
                        placeholder="play.mioserver.it"
                        class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white font-mono placeholder-violet-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                      />
                    </div>
                    <div>
                      <label class="block text-violet-200 font-medium mb-2">Porta</label>
                      <input
                        value={port()}
                        onInput={e => setPort(e.currentTarget.value)}
                        placeholder="25565"
                        class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white font-mono placeholder-violet-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-violet-200 font-medium mb-2">Descrizione breve *</label>
                    <textarea
                      value={description()}
                      onInput={e => setDescription(e.currentTarget.value)}
                      placeholder="Modalità, versione, eventi, community..."
                      rows={5}
                      class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white placeholder-violet-500 resize-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                    />
                    <p class="text-sm text-violet-400 mt-2">Minimo 40-50 parole per attirare giocatori</p>
                  </div>
                </div>
              </section>
              <div class="space-y-6">
              </div>
            </Show>

            {/* STEP 2 - Dettagli & Media */}
            <Show when={step() === 2}>
              <div class="space-y-8">

                {/* Descrizione con Markdown preview */}
                
                <div class="space-y-6">
                  <div>
                    <h3 class="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
                      <span>🎨</span> Personalizzazione
                    </h3>
                  </div>

                  {/* Tags */}
                  <div>
                    <label class="block text-violet-300 font-semibold mb-3 flex items-center gap-2">
                      <span>🏷️</span> Tag & Modalità
                    </label>

                    {/* Preset Tags */}
                    <div class="mb-4">
                      <p class="text-sm text-violet-400 mb-3">Scegli dai tag più comuni:</p>
                      <div class="flex flex-wrap gap-2">
                        <For each={presetTags}>
                          {(tag) => {
                            const isSelected = () => tags().includes(tag);
                            return (
                              <button
                                onClick={() => isSelected() ? removeTag(tag) : addTag(tag)}
                                class={`
                                px-4 py-2 rounded-lg font-medium transition-all text-sm
                                ${isSelected()
                                    ? "bg-fuchsia-600 text-white border-2 border-fuchsia-400"
                                    : "bg-violet-950/60 text-violet-300 border-2 border-violet-700/30 hover:bg-violet-900/80"}
                              `}
                              >
                                {isSelected() && "✓ "}#{tag}
                              </button>
                            );
                          }}
                        </For>
                      </div>
                    </div>

                    {/* Custom Tag Input */}
                    <div class="flex gap-2">
                      <input
                        type="text"
                        value={newTag()}
                        onInput={(e) => setNewTag(e.currentTarget.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Oppure aggiungi tag personalizzato..."
                        class="
                        flex-1 px-6 py-3 bg-black/60 border-2 border-violet-700/50 
                        rounded-xl text-white placeholder-violet-400
                        focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                        transition-all duration-200
                      "
                      />
                      <button
                        type="button"
                        onClick={() => addTag()}
                        class="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors font-semibold"
                      >
                        + Aggiungi
                      </button>
                    </div>

                    {/* Selected Tags */}
                    <Show when={tags().length > 0}>
                      <div class="mt-4 flex flex-wrap gap-2">
                        <For each={tags()}>
                          {(tag) => (
                            <div class="
                            flex items-center gap-2 px-4 py-2 
                            bg-gradient-to-r from-fuchsia-600 to-purple-600
                            text-white rounded-lg border border-fuchsia-400/50
                          ">
                              #{tag}
                              <button
                                onClick={() => removeTag(tag)}
                                class="text-white hover:text-red-300 font-bold text-lg leading-none ml-1"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>

                  {/* Links Esterni */}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                        <span>🌐</span> Sito Web (opzionale)
                      </label>
                      <input
                        type="url"
                        value={website()}
                        onInput={(e) => setWebsite(e.currentTarget.value)}
                        placeholder="https://tuoserver.it"
                        class="
                        w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                        rounded-xl text-white placeholder-violet-400
                        focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                        transition-all duration-200
                      "
                      />
                    </div>

                    <div>
                      <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                        <span>💬</span> Discord (opzionale)
                      </label>
                      <input
                        type="url"
                        value={discord()}
                        onInput={(e) => setDiscord(e.currentTarget.value)}
                        placeholder="https://discord.gg/..."
                        class="
                        w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                        rounded-xl text-white placeholder-violet-400
                        focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                        transition-all duration-200
                      "
                      />
                    </div>
                  </div>


                  <div>
                    <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                      <span>🖼️</span> Logo Url (opzionale..)
                    </label>
                    <input
                      type="url"
                      value={logoUrl()}
                      onInput={(e) => setLogoUrl(e.currentTarget.value)}
                      placeholder="https://example.com/logo.png"
                      class="
                      w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                      rounded-xl text-white placeholder-violet-400
                      focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                      transition-all duration-200
                    "
                    />
                    <p class="text-xs text-violet-400 mt-2">
                      Consigliato: 256x256 o 512x512, formato JPG o PNG
                    </p>

                  </div>

                  {/* Banner */}
                  <div>
                    <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                      <span>🖼️</span> Banner URL (opzionale)
                    </label>
                    <input
                      type="url"
                      value={bannerUrl()}
                      onInput={(e) => setBannerUrl(e.currentTarget.value)}
                      placeholder="https://example.com/banner.png"
                      class="
                      w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                      rounded-xl text-white placeholder-violet-400
                      focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                      transition-all duration-200
                    "
                    />
                    <p class="text-xs text-violet-400 mt-2">
                      Consigliato: 1200x400px, formato JPG o PNG
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                  <label class="block text-violet-200 font-medium">Descrizione server (supporta Html & Css)</label>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <textarea
                      value={description()}
                      onInput={e => setDescription(e.currentTarget.value)}
                      placeholder="**Caratteristiche principali**\n- Versione 1.20+\n- Eventi settimanali\n- Economia personalizzata"
                      rows={10}
                      class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white placeholder-violet-500 font-mono text-sm resize-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                    />
                    <div
                      class="prose prose-invert prose-sm md:prose-base border border-violet-700/40 rounded-xl p-5 bg-black/60 overflow-auto max-h-[500px]"
                      innerHTML={descriptionHtml()}
                    />
                  </div>
                  <p class="text-xs text-violet-400">
                    Usa **grassetto**, *italico*, - liste, [link](url), ```codice```
                  </p>
                </div>

                {/* Regole con Markdown preview */}
                <div class="space-y-3">
                  <label class="block text-violet-200 font-medium">Regole server (supporta Html e Css)</label>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <textarea
                      value={rules()}
                      onInput={e => setRules(e.currentTarget.value)}
                      placeholder="1. No griefing o cheat\n**Vietato** l'uso di X-Ray\n- Rispetta lo staff\n> Segnala con /report"
                      rows={10}
                      class="w-full px-5 py-4 bg-black/50 border border-violet-700/60 rounded-xl text-white placeholder-violet-500 font-mono text-sm resize-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 outline-none transition"
                    />
                    <div
                      class="prose prose-invert prose-sm md:prose-base border border-violet-700/40 rounded-xl p-5 bg-black/60 overflow-auto max-h-[500px]"
                      innerHTML={rulesHtml()}
                    />
                  </div>
                </div>
            </Show>

  



          </div>

          {/* Footer più piccolo */}
          <div class="bg-black/40 px-5 py-4 md:px-8 md:py-5 border-t border-violet-800/40 flex items-center justify-between gap-4 flex-wrap">
            <Show when={step() > 1}>
              <button
                onClick={() => setStep(s => s - 1)}
                class="px-6 py-3 bg-violet-900/60 hover:bg-violet-800/80 text-violet-100 rounded-xl font-medium transition"
              >
                ← Indietro
              </button>
            </Show>

            <div class="flex-1" />

            <Show when={step() === 2}>
              <div class="flex gap-4">
                <button
                  onClick={() => { resetForm(); props.onClose(); }}
                  class="px-7 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSubmit}
                  class="px-9 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-md transition flex items-center gap-2"
                >
                  <span>🚀</span> Pubblica
                </button>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default AddServerModal;