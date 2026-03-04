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

    // plugin page
    docs_description: "Questo plugin ti permette di aggionrare le statistiche e abiltiare il comando /claim dei vari premi direttamente in gioco",
    docs_card: [
      ["ping", "Ping automatico", "Ogni 2 minuti, zero intervento"],
      ["multi server", "Network support", "Server secondari aggregati al principale"],
      ["comandi", "Comando /claim", "Reward in-game configurabili"],
      ["api", "API pubblica", "Accesso gratuito a tutti gli endpoint"]],
    docs_install: [
      ["I", "Scarica il plugin", "Scarica il .jar dalla pagina download e inseriscilo in /mods.", null],
      ["II", "Avvia il server", "Avvia una volta per generare config.json in /plugins/h-y-tale-vote/.", null],
      ["III", "Copia la secret key", "Dal menu I miei Server del sito, copia la key e incollala nel config.", `{\n  "secret_key": "la-tua-key-qui",\n  "is_principal_network": true,\n  ...\n}`],
      ["IV", "Riavvia e verifica", "Riavvia il server. Il plugin inizierà a pingare ogni 2 minuti.", null]],
    docs_config: [
      ["secretKey", "String", "Obbligatorio", "Key univoca copiata dal pannello H-YTale"],
      ["isPrincipalNetwork", "Boolean", "Default: true", "false se questo è un server secondario del network"],
      ["secondaryId", "String", "Solo secondary", "ID univoco del sub-server (es. survival-1). Vuoto se principale"],
      ["errorSecretNotValidMessage", "String", "Personalizzabile", "Messaggio mostrato se la secret key non è valida"],
      ["enableKeyForVoteClaimMenu", "Boolean", "Default: true", "Abilita l'uso della key per il menu di claim del voto"],
      ["openMenuOnClaim", "Boolean", "Default: true", "Apre il menu GUI al comando /claim"],
      ["isClaimEnabled", "Boolean", "Default: true", "Abilita o disabilita il comando /claim sul server"],
      ["disableClaimMessage", "Boolean", "Default: false", "Se true, sopprime i messaggi di risposta al /claim"],
      ["voteClaimMessage", "String", "Personalizzabile", "Messaggio inviato al player dopo il claim del reward"],
      ["fullInventory", "String", "Personalizzabile", "Messaggio se l'inventario è pieno al momento del claim"],
      ["voteNotFoundMessage", "String", "Personalizzabile", "Messaggio se il player non ha votato. Supporta {server_name} e {server_link}"],
      ["voteTimeToWaitMessage", "String", "Personalizzabile", "Messaggio se il player ha già votato. Supporta {time}"],
      ["rewardUpdateMessage", "String", "Personalizzabile", "Messaggio admin dopo aggiornamento reward via /setreward. Supporta tag MiniMessage"],
      ["rewardItems", "Array", "In gioco con /setreward", "Lista oggetti da consegnare al /claim — { itemId, quantity }"],
    ],
    docs_config_json: `{
      "secretKey": "471d1f7a-29a7-4d38-bac3-ec93ba0d35ea",
      "isPrincipalNetwork": true,
      "secondaryId": "",
      "errorSecretNotValidMessage": "The secret key is not valid",
      "enableKeyForVoteClaimMenu": true,
      "openMenuOnClaim": true,
      "isClaimEnabled": true,
      "disableClaimMessage": false,
      "voteClaimMessage": "You claimed the reward! Thanks you for vote",
      "fullInventory": "Your inventory is full, free before request the rewards.",
      "voteNotFoundMessage": "You are never voted {server_name}, please vote on {server_link}.",
      "voteTimeToWaitMessage": "You are already voted this server. Please wait {time} for new vote.",
      "rewardUpdateMessage": "<green> The reward for the player are updated! </green>.",
      "rewardItems": [
        {
          "itemId": "Rock_Crystal_Purple_Large",
          "quantity": 100
        }
      ]
    }`,
    docs_comandi: [
      ["/claim", "All", "Ritira il premio del voto. Il plugin chiama l'API e consegna gli item configurati."],
      ["/setreward", "hyvote.set.reward", "Importa i premi che i giocatori riceveranno dopo il voto."],
      ["/claimtest", "hyvote.claim.test", "Mostra l'ultimo ping, giocatori rilevati e latenza verso l'API."],
    ],
    docs_comandi_title: "Comandi",
    docs_network_title: "Come conettere insieme più server hytale.",
    docs_network_description: " Configura un server principale e più secondary: i giocatori vengono automaticamente sommati al totale del principale.",
    docs_note: ["Tutti i secondary devono usare la stessa secret_key del principale.",
      "Il secondary_id deve essere univoco per ogni sub-server.",
      "Secondary con last_ping > 2min vengono esclusi dalla somma.",
      "Il /claim è disponibile su tutti i server; disabilitalo via enable_claim in config.json."],
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