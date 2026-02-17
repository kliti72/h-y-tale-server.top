import { Component } from "solid-js";
import { A } from "@solidjs/router";

const PrivacyPolicyPage: Component = () => {
  const lastUpdated = "16 Febbraio 2026";

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-violet-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Hero / Intestazione */}
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Informativa sulla Privacy
          </h1>
          <p class="text-xl text-violet-300">
            H-Ytale Community • Ultimo aggiornamento: {lastUpdated}
          </p>
          <p class="mt-4 text-violet-400 max-w-2xl mx-auto">
            Ci impegniamo a proteggere la tua privacy. Questa informativa spiega come raccogliamo, usiamo e proteggiamo i tuoi dati personali quando usi il nostro sito, forum, guide e servizi correlati.
          </p>
        </div>

        {/* Contenuto principale */}
        <div class="space-y-12 text-lg leading-relaxed">
          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">1. Chi siamo (Titolare del trattamento)</h2>
            <p>
              Titolare del trattamento è <strong>H-Ytale Community</strong> (o la denominazione legale della tua associazione/società), con sede in Italia.
            </p>
            <p class="mt-4">
              Per contattarci: <a href="mailto:privacy@h-ytale.it" class="text-fuchsia-400 hover:text-fuchsia-300 underline">privacy@h-ytale.it</a>
            </p>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">2. Quali dati raccogliamo</h2>
            <ul class="list-disc pl-6 space-y-3">
              <li><strong>Dati di navigazione</strong>: IP, browser, dispositivo, pagine visitate, timestamp (tramite cookie e log server)</li>
              <li><strong>Dati di registrazione</strong>: username, email, avatar (opzionale), data di nascita (se richiesta per età)</li>
              <li><strong>Dati pubblicati</strong>: post, guide, commenti, like, messaggi privati (se implementati)</li>
              <li><strong>Dati Discord/terze parti</strong>: se accedi tramite Discord, riceviamo ID utente, username, avatar (solo con tuo consenso)</li>
              <li><strong>Dati tecnici</strong>: tipo di connessione, provider, risoluzione schermo (per ottimizzazione)</li>
            </ul>
            <p class="mt-6 text-violet-300">
              Non raccogliamo dati sensibili (salute, origine etnica, opinioni politiche, ecc.) né dati di minori sotto i 16 anni senza consenso del genitore.
            </p>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">3. Perché raccogliamo i dati (finalità e base giuridica)</h2>
            <div class="space-y-6">
              <div>
                <h3 class="text-2xl font-semibold text-violet-200 mb-2">Obbligatorie per il funzionamento</h3>
                <p>Base giuridica: esecuzione contratto / nostro legittimo interesse</p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                  <li>Creare e gestire account</li>
                  <li>Pubblicare e moderare contenuti</li>
                  <li>Prevenire abusi/spam</li>
                  <li>Migliorare sicurezza del sito</li>
                </ul>
              </div>

              <div>
                <h3 class="text-2xl font-semibold text-violet-200 mb-2">Con tuo consenso (facoltative)</h3>
                <ul class="list-disc pl-6 space-y-1">
                  <li>Newsletter / aggiornamenti (se ti iscrivi)</li>
                  <li>Statistiche aggregate anonime</li>
                  <li>Login social (Discord, Google, ecc.)</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">4. Con chi condividiamo i dati</h2>
            <p>Non vendiamo i tuoi dati personali a terzi per marketing.</p>
            <p class="mt-4">Possibili destinatari:</p>
            <ul class="list-disc pl-6 space-y-2 mt-2">
              <li>Provider hosting / CDN (es. Vercel, Cloudflare)</li>
              <li>Servizi di moderazione / anti-spam (se usati)</li>
              <li>Discord Inc. (solo se accedi tramite OAuth)</li>
              <li>Autorità giudiziarie / forze dell'ordine (se obbligo legale)</li>
            </ul>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">5. Cookie e tecnologie simili</h2>
            <p>Usiamo cookie essenziali per il funzionamento (login, preferenze). Cookie analitici/statistici solo con consenso.
                Non salviamo quasi nulla, non racogliamo password ne dati sensibili.
            </p>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">6. I tuoi diritti GDPR</h2>
            <p>Hai diritto a:</p>
            <ul class="list-disc pl-6 space-y-2 mt-4">
              <li>Accesso, rettifica, cancellazione dei dati</li>
              <li>Limitazione / opposizione al trattamento</li>
              <li>Portabilità dei dati</li>
              <li>Revoca consenso (dove applicabile)</li>
              <li>Reclamo al Garante Privacy (www.garanteprivacy.it)</li>
            </ul>
            <p class="mt-6">
              Per esercitare i diritti: <a href="mailto:privacy@h-ytale.it" class="text-fuchsia-400 hover:text-fuchsia-300 underline">privacy@h-ytale.it</a>
            </p>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">7. Conservazione dei dati</h2>
            <p>Conserviamo i dati per il tempo necessario alle finalità:</p>
            <ul class="list-disc pl-6 space-y-2 mt-4">
              <li>Dati account attivi → finché non elimini l'account</li>
              <li>Contenuti pubblicati → finché non li cancelli o violano regole</li>
              <li>Log di sicurezza → max 12 mesi</li>
              <li>Dati di analytics anonimi → max 26 mesi</li>
            </ul>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">8. Minori</h2>
            <p>Il sito non è rivolto a minori di 16 anni. Se scopriamo dati di minori senza consenso parentale, li elimineremo immediatamente.</p>
          </section>

          <section class="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 md:p-10 border border-violet-800/50 backdrop-blur-md">
            <h2 class="text-3xl font-bold text-fuchsia-400 mb-6">9. Modifiche all'informativa</h2>
            <p>Può essere aggiornata. Ti informeremo di cambiamenti sostanziali via email o annuncio sul sito.</p>
            <p class="mt-4 text-violet-400 text-sm">
              Ultimo aggiornamento: {lastUpdated}
            </p>
          </section>
        </div>

        {/* Footer sezione */}
        <div class="text-center mt-16 text-violet-400 text-sm">
          <p>© {new Date().getFullYear()} H-Ytale Community • Tutti i diritti riservati</p>
          <p class="mt-2">
            Questa è un'informativa ai sensi degli artt. 13-14 GDPR. Per dubbi contattaci.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;