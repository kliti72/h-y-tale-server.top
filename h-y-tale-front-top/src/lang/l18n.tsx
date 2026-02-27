import { useLang } from "../App";

// ── dizionari ─────────────────────────────────────────────────────────────────
const translations = {
  it: {
    
    // Header // Done
    name: "TALE",
    sub_name: ".top",
    notify: "Notifiche",
    notify_new: "nuove",
    notify_show_all: "vedi tutte",
    nav_home: "Home",
    nav_servers: "Server",
    nav_leaderboard: "Top Server",
    nav_docs: "Plugin & Api",
    nav_tracker: "Tracker",
    nav_forum: "Forum",
    nav_notizie: "Notizie",
    nav_add: "Aggiungi server",
    nav_exit: "Esci",

    // Footer // TODO
    ft_desc: "Community italiana dedicata a Hytale. Scopri server, vota i preferiti, unisciti agli eventi.",
    ft_disclaimer: "Non affiliato con Hytale™ / Hypixel Studios™",
    // nav links
    ft_explore: "⚔️ Esplora",
    ft_link_servers: "Server",
    ft_link_top: "Top Votati",
    ft_link_discord: "Discord",
    ft_link_privacy: "Privacy",
    // actions
    ft_share: "🏰 Condividi",
    ft_copy: "⬡ Copia link",
    ft_copied: "✓ Copiato!",
    ft_share_x: "𝕏 Condividi su X",
    ft_scroll_top: "↑ Torna su",
    // copyright
    ft_copyright: (year: number) => `© ${year} H-Y-TALE.top — Tutti i diritti riservati`,

    // ServerListPage // TODO
    // hero band
    sl_register: "Registro dei server",
    sl_title: "Server",
    sl_title_brand: "H-YTale",
    sl_found: (n: number) => `${n} server nel registro`,
    sl_none_found: "Nessun server trovato",
    sl_active_filters: (n: number) => `${n} filtri attivi`,
    sl_filters_btn: (n: number) => n > 0 ? `⚙️ Filtri · ${n}` : "⚙️ Filtri",
    sl_filters_close: "✕ Chiudi",
    // sidebar widgets
    sl_w_search: "Cerca server",
    sl_w_search_ph: "Nome o IP...",
    sl_w_mode: "Modalità di gioco",
    sl_w_sort: "Ordina per",
    sl_sort_votes: "Più votati",
    sl_sort_recent: "Più recenti",
    sl_sort_players: "Più giocatori",
    sl_clear_filters: (n: number) => `✕ Rimuovi filtri (${n})`,
    sl_add_server: "✦ Aggiungi il tuo server ✦",
    // cards section
    sl_tavern: "Taverna dei guerrieri",
    // loading / error / empty
    sl_loading: "Caricamento taverna...",
    sl_error_title: "Errore di sistema",
    sl_error_sub: "Riprova più tardi",
    sl_empty_title: "Nessun server trovato",
    sl_empty_sub: "Modifica i filtri di ricerca",
    sl_empty_reset: "Reset ricerca",
    sl_loading_more: "Carico altri...",
    sl_end: "Fine del registro",
    // vote notify
    sl_vote_ok: (name: string) => `Voto registrato per ${name}!`,
    sl_load_err: "Errore caricamento",

    // HomePage // Done
    community_region: "Community italiana",
    explore_server: "Esplora server",
    evidence_server: "Server In evidenza",
    hero_tags: [
      "Esplora regni epici.",
      "Vota i tuoi server preferiti.",
      "Trova il tuo prossimo mondo.",
    ],

    // Server details page
    sd_loading: "Caricamento...",
    sd_not_found: "Server not found",
    sd_breadcrumb: (id: number) => `⚔ Server #${id}`,
    sd_rules: "📜 Info Panel",
    sd_contacts: "🏰 Contatti",

  },

  en: {


  },
} as const;

export type Translations = typeof translations.it;

// ── hook ──────────────────────────────────────────────────────────────────────
export const useT = () => {
  const { lang } = useLang();
  return () => translations[lang()] as Translations;
};