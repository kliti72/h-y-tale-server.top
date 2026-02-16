// AddServerModal.tsx (versione completa e stilosa)
import { Component, createSignal, For, Show } from "solid-js";
import { useAuth } from "../../auth/AuthContext";

type AddServerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    ip: string;
    port: string;
    version: string;
    description: string;
    tags: string[];
    logo_url?: string,
    website?: string;
    discord?: string;
    banner?: string;
    rules?: string;
  }) => void;
};

const AddServerModal: Component<AddServerModalProps> = (props) => {
  // Dati base
  const [name, setName] = createSignal("");
  const [ip, setIp] = createSignal("");
  const [port, setPort] = createSignal("25565");
  const [version, setVersion] = createSignal("1.20.4");
  const [description, setDescription] = createSignal("");
  
  // Tags
  const [tags, setTags] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");
  
  // Link esterni
  const [website, setWebsite] = createSignal("");
  const [discord, setDiscord] = createSignal("");
  
  // Media
  const [logoUrl, setLogoUrl] = createSignal("");
  const [bannerUrl, setBannerUrl] = createSignal("");
  
  // Regole
  const [rules, setRules] = createSignal("");
  
  // UI State
  const [currentStep, setCurrentStep] = createSignal(1);
  const [showPreview, setShowPreview] = createSignal(false);
  
  const auth = useAuth();

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
      version: version(),
      description: description(),
      tags: tags(),
      website: website() || undefined,
      discord: discord() || undefined,
      banner: bannerUrl() || undefined,
      logo_url: logoUrl() || undefined,
      rules: rules() || undefined,
    });

    resetForm();
    props.onClose();
  };

  const resetForm = () => {
    setName("");
    setIp("");
    setPort("25565");
    setVersion("1.20.4");
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

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto p-4"
        onClick={props.onClose}
      >
        <div
          class="
            bg-gradient-to-br from-gray-950 to-indigo-950
            border-2 border-violet-700/50
            rounded-3xl 
            w-full max-w-4xl
            my-8
            shadow-2xl shadow-violet-900/50
            max-h-[90vh] 
            overflow-hidden
            flex flex-col
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-6 flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-black text-white flex items-center gap-3">
                <span>🎮</span>
                Aggiungi il Tuo Server
              </h2>
              <p class="text-violet-100 mt-1">Fai crescere la tua community!</p>
            </div>
            <button
              onClick={props.onClose}
              class="text-3xl text-white/80 hover:text-white transition-colors hover:rotate-90 transform duration-300"
            >
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div class="bg-violet-950/30 px-8 py-4 border-b border-violet-800/30">
            <div class="flex items-center justify-center gap-4">
              {[
                { num: 1, label: "Info Base", icon: "📝" },
                { num: 2, label: "Personalizzazione", icon: "🎨" },
                { num: 3, label: "Conferma", icon: "✅" }
              ].map(step => (
                <div class="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentStep(step.num)}
                    class={`
                      flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all
                      ${currentStep() === step.num
                        ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white scale-105"
                        : currentStep() > step.num
                        ? "bg-green-600/30 text-green-300 border border-green-500/50"
                        : "bg-violet-950/60 text-violet-400 border border-violet-700/30"}
                    `}
                  >
                    <span class="text-xl">{step.icon}</span>
                    <span class="hidden sm:inline">{step.label}</span>
                  </button>
                  {step.num < 3 && (
                    <div class={`w-12 h-1 rounded-full ${currentStep() > step.num ? 'bg-green-500' : 'bg-violet-800/30'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content - Scrollable */}
          <div class="flex-1 overflow-y-auto px-8 py-6">
            
            {/* STEP 1: Info Base */}
            <Show when={currentStep() === 1}>
              <div class="space-y-6">
                <div>
                  <h3 class="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
                    <span>📝</span> Informazioni Base
                  </h3>
                </div>

                {/* Nome Server */}
                <div>
                  <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                    <span>🏷️</span> Nome Server *
                  </label>
                  <input
                    type="text"
                    value={name()}
                    onInput={(e) => setName(e.currentTarget.value)}
                    placeholder="Es. Il Regno di Minecraft ITA"
                    class="
                      w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                      rounded-xl text-white placeholder-violet-400 text-lg
                      focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                      transition-all duration-200
                    "
                  />
                  <p class="text-xs text-violet-400 mt-2">
                    Scegli un nome accattivante e memorabile
                  </p>
                </div>

                {/* IP + Port */}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                      <span>🌐</span> Indirizzo IP *
                    </label>
                    <input
                      type="text"
                      value={ip()}
                      onInput={(e) => setIp(e.currentTarget.value)}
                      placeholder="play.tuoserver.it"
                      class="
                        w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                        rounded-xl text-white placeholder-violet-400 font-mono text-lg
                        focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                        transition-all duration-200
                      "
                    />
                  </div>

                  <div>
                    <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                      <span>🔌</span> Porta *
                    </label>
                    <input
                      type="text"
                      value={port()}
                      onInput={(e) => setPort(e.currentTarget.value)}
                      placeholder="25565"
                      class="
                        w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                        rounded-xl text-white placeholder-violet-400 font-mono text-lg
                        focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                        transition-all duration-200
                      "
                    />
                  </div>
                </div>

               

                {/* Descrizione */}
                <div>
                  <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                    <span>📄</span> Descrizione Server *
                  </label>
                  <textarea
                    value={description()}
                    onInput={(e) => setDescription(e.currentTarget.value)}
                    placeholder="Descrivi il tuo server... Che modalità offri? Cosa rende unico il tuo server? Perché i player dovrebbero unirsi?"
                    rows={6}
                    class="
                      w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                      rounded-xl text-white placeholder-violet-400 text-lg resize-none
                      focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                      transition-all duration-200
                    "
                  />
                  <p class="text-xs text-violet-400 mt-2">
                    Sii chiaro e descrittivo. Una buona descrizione attira più player!
                  </p>
                </div>
              </div>
            </Show>

            {/* STEP 2: Personalizzazione */}
            <Show when={currentStep() === 2}>
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

 {/* Banner */}
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
                    Consigliato: 1200x400px, formato JPG o PNG
                  </p>
                  
                  <Show when={logoUrl()}>
                    <div class="mt-4 border-2 border-violet-700/50 rounded-xl overflow-hidden">
                      <img 
                        src={logoUrl()} 
                        alt="Preview Banner" 
                        class="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </Show>
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
                  
                  <Show when={bannerUrl()}>
                    <div class="mt-4 border-2 border-violet-700/50 rounded-xl overflow-hidden">
                      <img 
                        src={bannerUrl()} 
                        alt="Preview Banner" 
                        class="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </Show>
                </div>

                {/* Regole */}
                <div>
                  <label class="block text-violet-300 font-semibold mb-2 flex items-center gap-2">
                    <span>📜</span> Regole del Server (opzionale)
                  </label>
                  <textarea
                    value={rules()}
                    onInput={(e) => setRules(e.currentTarget.value)}
                    placeholder="1. Rispetta tutti i giocatori&#10;2. No griefing o hacking&#10;3. Segui le indicazioni dello staff&#10;..."
                    rows={6}
                    class="
                      w-full px-6 py-4 bg-black/60 border-2 border-violet-700/50 
                      rounded-xl text-white placeholder-violet-400 resize-none
                      focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30
                      transition-all duration-200
                    "
                  />
                </div>
              </div>
            </Show>

            {/* STEP 3: Preview & Conferma */}
            <Show when={currentStep() === 3}>
              <div class="space-y-6">
                <div>
                  <h3 class="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
                    <span>✅</span> Riepilogo e Conferma
                  </h3>
                  <p class="text-violet-300">
                    Controlla i dati prima di pubblicare il server!
                  </p>
                </div>

                <div class="bg-violet-950/40 border-2 border-violet-700/50 rounded-2xl p-6 space-y-4">
                  
                  {/* Preview Card */}
                  <div class="bg-black/60 rounded-xl p-6 border border-violet-600/30">
                    <div class="flex items-start justify-between mb-4">
                      <div>
                        <h4 class="text-2xl font-bold text-white mb-1">{name() || "Nome Server"}</h4>
                        <div class="flex items-center gap-3 text-sm text-violet-400">
                          <span>🎮 {version()}</span>
                          <span>•</span>
                          <span class="font-mono">{ip() || "IP"}:{port()}</span>
                        </div>
                      </div>
                      <span class="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm">
                        Nuovo
                      </span>
                    </div>

                    <Show when={bannerUrl()}>
                      <img 
                        src={bannerUrl()} 
                        alt="Banner" 
                        class="w-full h-32 object-cover rounded-lg mb-4"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    </Show>

                    <p class="text-violet-200 mb-4 line-clamp-3">
                      {description() || "Descrizione del server..."}
                    </p>

                    <Show when={tags().length > 0}>
                      <div class="flex flex-wrap gap-2 mb-4">
                        <For each={tags()}>
                          {(tag) => (
                            <span class="px-3 py-1 bg-violet-950/60 border border-violet-700/40 rounded-full text-xs text-violet-300">
                              #{tag}
                            </span>
                          )}
                        </For>
                      </div>
                    </Show>

                    <div class="flex gap-2">
                      <Show when={website()}>
                        <span class="text-xs text-violet-400">🌐 Website</span>
                      </Show>
                      <Show when={discord()}>
                        <span class="text-xs text-violet-400">💬 Discord</span>
                      </Show>
                    </div>
                  </div>

                  {/* Info Summary */}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-violet-700/30">
                    <div>
                      <div class="text-sm text-violet-400 mb-1">Informazioni Complete</div>
                      <div class="flex items-center gap-2">
                        <span class={name() ? "text-green-400" : "text-red-400"}>
                          {name() ? "✓" : "✗"}
                        </span>
                        <span class="text-white">Nome Server</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class={ip() ? "text-green-400" : "text-red-400"}>
                          {ip() ? "✓" : "✗"}
                        </span>
                        <span class="text-white">Indirizzo IP</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class={description() ? "text-green-400" : "text-red-400"}>
                          {description() ? "✓" : "✗"}
                        </span>
                        <span class="text-white">Descrizione</span>
                      </div>
                    </div>

                    <div>
                      <div class="text-sm text-violet-400 mb-1">Info Aggiuntive</div>
                      <div class="flex items-center gap-2">
                        <span class={tags().length > 0 ? "text-green-400" : "text-yellow-400"}>
                          {tags().length > 0 ? "✓" : "○"}
                        </span>
                        <span class="text-white">{tags().length} Tag</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class={website() ? "text-green-400" : "text-yellow-400"}>
                          {website() ? "✓" : "○"}
                        </span>
                        <span class="text-white">Website</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class={discord() ? "text-green-400" : "text-yellow-400"}>
                          {discord() ? "✓" : "○"}
                        </span>
                        <span class="text-white">Discord</span>
                      </div>
                    </div>
                  </div>

                  <div class="pt-4 border-t border-violet-700/30">
                    <div class="flex items-center gap-2 text-sm text-violet-300">
                      <span>ℹ️</span>
                      <span>I campi con ○ sono opzionali ma consigliati per una migliore visibilità</span>
                    </div>
                  </div>
                </div>
              </div>
            </Show>
          </div>

          {/* Footer Actions */}
          <div class="bg-violet-950/30 px-8 py-6 border-t border-violet-800/30 flex items-center justify-between gap-4">
            <Show when={currentStep() > 1}>
              <button
                onClick={prevStep}
                class="
                  px-8 py-4 bg-violet-950/60 hover:bg-violet-900/80 
                  text-violet-200 rounded-xl font-semibold
                  border-2 border-violet-700/50 transition-all
                  flex items-center gap-2
                "
              >
                <span>←</span>
                Indietro
              </button>
            </Show>

            <div class="flex-1" />

            <Show when={currentStep() < 3}>
              <button
                onClick={nextStep}
                class="
                  px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 
                  hover:from-violet-500 hover:to-fuchsia-500
                  text-white rounded-xl font-bold
                  shadow-lg shadow-fuchsia-900/50 transition-all
                  flex items-center gap-2
                "
              >
                Avanti
                <span>→</span>
              </button>
            </Show>

            <Show when={currentStep() === 3}>
              <div class="flex gap-4">
                <button
                  onClick={() => {
                    resetForm();
                    props.onClose();
                  }}
                  class="
                    px-8 py-4 bg-zinc-800 hover:bg-zinc-700 
                    text-zinc-300 rounded-xl font-semibold
                    transition-colors
                  "
                >
                  Annulla
                </button>
                <button
                  onClick={handleSubmit}
                  class="
                    px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 
                    hover:from-green-500 hover:to-emerald-500
                    text-white rounded-xl font-black text-lg
                    shadow-lg shadow-green-900/50 transition-all
                    flex items-center gap-3
                  "
                >
                  <span class="text-2xl">🚀</span>
                  Pubblica Server
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