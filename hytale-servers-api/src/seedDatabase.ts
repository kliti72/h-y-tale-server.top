import { Database } from 'bun:sqlite'

export function seedDatabase(db: Database) {
    console.log('🌱 Seeding database con dati fake...');

    // 1. DISCORD USERS (owner dei server)
    const discordUsers = [
        {
            id: '123456789012345678',
            username: 'gangsta_dev',
            global_name: 'Gangsta Dev',
            avatar: 'avatar_hash_1',
            discriminator: '0001',
            email: 'gangsta@example.com',
            last_vote_at: null
        },
        {
            id: '234567890123456789',
            username: 'coatto_gamer',
            global_name: 'Coatto Gamer',
            avatar: 'avatar_hash_2',
            discriminator: '0002',
            email: 'coatto@example.com',
            last_vote_at: null
        },
        {
            id: '345678901234567890',
            username: 'street_admin',
            global_name: 'Street Admin',
            avatar: 'avatar_hash_3',
            discriminator: '0003',
            email: 'street@example.com',
            last_vote_at: null
        }
    ];

    for (const user of discordUsers) {
        db.run(`
            INSERT OR IGNORE INTO discord_users (id, username, global_name, avatar, discriminator, email, last_vote_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [user.id, user.username, user.global_name, user.avatar, user.discriminator, user.email, user.last_vote_at]);
    }

    // 2. SERVERS
    const servers = [
        {
            name: 'ItalianCraft Survival',
            ip: 'play.italiancraft.it',
            port: '25565',
            tags: 'Survival,PvP,Economy,Italian,Events',
            description: `# 🎮 ItalianCraft - Il Miglior Server Survival Italiano

**Benvenuto su ItalianCraft!** Il server survival più attivo d'Italia 🇮🇹

## ✨ Caratteristiche Principali
- 🗡️ **PvP Bilanciato** con arena dedicata
- 💰 **Economy Avanzata** con negozi player
- 🏰 **Protezioni Terreni** con GriefPrevention
- 🎉 **Eventi Settimanali** con premi esclusivi
- 👥 **Community Attiva** di 500+ giocatori

## 🎁 Cosa Offriamo
- Versione: **1.20.4**
- Lag-free con hardware dedicato
- Staff italiano disponibile H24
- Discord ricco di 2000+ membri
- Sistema rank con vantaggi progressivi

**Entra e diventa leggenda!** 🔥`,
            website_url: 'https://italiancraft.it',
            discord_url: 'https://discord.gg/italiancraft',
            banner_url: 'https://picsum.photos/seed/server1/1200/400',
            logo_url: 'https://picsum.photos/seed/logo1/512/512',
            rules: `# 📜 Regole del Server

## Regole Generali
1. ❌ **NO Griefing** - Rispetta le costruzioni altrui
2. ❌ **NO Cheat/Hack** - Ban permanente immediato
3. ✅ **Rispetta tutti** - Staff e giocatori
4. ❌ **NO Spam** - In chat e comandi

## PvP
- Il PvP è attivo nelle zone designate
- No kill in spawn o nelle città protette
- Fair play sempre, no teaming 1v1

## Economy
- No truffare altri giocatori
- Prezzi onesti nei negozi
- Segnala bug economy allo staff

> Violazioni gravi = Ban permanente
> Usa **/report** per segnalazioni`,
            secret_key: 'secret_key_italiancraft_2024'
        },
        {
            name: 'RolePlay City ITA',
            ip: 'rp.cityita.net',
            port: '25565',
            tags: 'Roleplay,Italian,City,Jobs,Realistic',
            description: `# 🏙️ RolePlay City ITA

**Vivi una seconda vita** nel nostro server roleplay italiano!

## 🎭 Esperienza Roleplay Completa
- 👮 **Forze dell'Ordine** - Polizia, Carabinieri
- 🚑 **Sistema Sanitario** - Medici e ambulanze
- 💼 **Business** - Apri la tua attività
- 🏛️ **Governo** - Elezioni democratiche
- 🚗 **Veicoli Realistici** - 50+ modelli custom

## 📱 Sistema Smartphone
- Chat tra giocatori
- App bancaria
- GPS integrato
- Social network in-game

## 🌃 La Città
Mappa custom italiana 10.000x10.000 con:
- Centro storico dettagliato
- Quartieri residenziali
- Zone industriali
- Porto e aeroporto

**Inizia la tua storia oggi!** 🎬`,
            website_url: 'https://rpcity.it',
            discord_url: 'https://discord.gg/rpcity',
            banner_url: 'https://picsum.photos/seed/server2/1200/400',
            logo_url: 'https://picsum.photos/seed/logo2/512/512',
            rules: `# 🎭 Regole Roleplay

## Core RP Rules
1. **Rimani sempre in character** durante il gioco
2. **No PowerGaming** - Azioni realistiche only
3. **No MetaGaming** - Info solo IC (in-character)
4. **Rispetta il RP altrui** - Collabora nelle scene

## Combattimento RP
- /me per azioni fisiche
- Dichiara sempre le azioni prima
- Accetta le conseguenze del RP
- No revenge kill (RDM)

## Lavori e Business
- Svolgi il tuo lavoro realisticamente
- Rispetta gli orari di servizio
- Prezzi concordati con l'economia server

## Comportamento
- Linguaggio appropriato
- No insulti OOC (out of character)
- Staff ha sempre ragione in dispute

> Break RP grave = Kick/Ban
> Usa **/report** per violazioni`,
            secret_key: 'secret_key_rpcity_2024'
        },
        {
            name: 'SkyBlock Legends',
            ip: 'sky.legends.mc',
            port: '25565',
            tags: 'Skyblock,Economy,Custom,Italian,Coop',
            description: `# ☁️ SkyBlock Legends

**L'avventura nel cielo inizia qui!** 🌤️

## 🏝️ Skyblock Next-Gen
- 🔧 **Custom Items** - 200+ oggetti unici
- ⚡ **Generatori Automatici** - Farm AFK
- 🤝 **Isole Coop** - Gioca con gli amici
- 🏆 **Classifiche** - Compete per il top
- 🎁 **Daily Rewards** - Login giornalieri

## 💎 Sistema Economia
- Shop infinito con prezzi dinamici
- Aste pubbliche tra giocatori
- Quest giornaliere ricompensate
- Rank acquistabili in-game

## 🌟 Features Esclusive
- 🔥 **Nether Island** - Espandi il tuo impero
- 🌊 **Ocean Dimension** - Pesca avanzata
- 🐉 **End Portal Custom** - Boss unici
- 🎪 **Eventi Weekend** - Drop 2x e bonus

**Da isola vuota a impero leggendario!** 👑`,
            website_url: 'https://skylegends.net',
            discord_url: 'https://discord.gg/skylegends',
            banner_url: 'https://picsum.photos/seed/server3/1200/400',
            logo_url: 'https://picsum.photos/seed/logo3/512/512',
            rules: `# ☁️ Regole SkyBlock

## Isole e Gameplay
1. **No Grief** - Anche su isole coop
2. **No Bug Abuse** - Segnala i bug trovati
3. **No Lag Machines** - Farm ottimizzate only
4. **AFK Farms OK** - Ma no bot/macro

## Economy e Scambi
- Rispetta gli accordi di trade
- No scam o truffe
- Prezzi onesti nelle vendite
- Segnala player sospetti

## Coop e Isole
- Trustare solo amici fidati
- Owner isola decide le regole
- No raid di isole altrui
- Rimuovi player inattivi (30 giorni)

## Generale
- Aiuta i nuovi player
- Chat in italiano preferita
- No pubblicità altri server
- Staff è qui per aiutarti

> Uso exploit = Ban temporaneo
> Scam provato = Ban permanente`,
            secret_key: 'secret_key_skylegends_2024'
        },
        {
            name: 'HardCore Factions',
            ip: 'fac.hardcore.gg',
            port: '25565',
            tags: 'Factions,PvP,Hardcore,Raiding,Italian',
            description: `# ⚔️ HardCore Factions

**Solo per veri guerrieri!** Non è per tutti. 💀

## 🔥 Factions Hardcore
- ⚔️ **PvP Intenso** - Combatti ovunque
- 💣 **Raiding** - TNT, creeper, tutto permesso
- 🏰 **Claim Territoriali** - Difendi la tua base
- 👥 **Alleanze** - Forma coalizioni potenti
- 💰 **Koths** - King of the Hill events

## 💎 Sistema Potere
- Più membri = più territorio
- Morti riducono il power
- Proteggi il tuo impero
- Raidabili sotto 0 power

## 🎯 Obiettivo
**Domina il server** eliminando le fazioni rivali!

## ⚡ Features
- 1.8 Combat System
- Custom Enchants
- Sell Wands per loot veloce
- Outpost contestabili
- Top Factions rewards settimanali

**Entra, conquista, domina!** 🔱`,
            website_url: 'https://hardcorefac.gg',
            discord_url: 'https://discord.gg/hardcorefac',
            banner_url: 'https://picsum.photos/seed/server4/1200/400',
            logo_url: 'https://picsum.photos/seed/logo4/512/512',
            rules: `# ⚔️ Regole Factions

## PvP & Raiding
1. **Tutto permesso** - It's factions bro
2. **No Hacked Clients** - Ban immediato
3. **Raiding OK** - Ma no exploits
4. **Griefing OK** - Proteggi la tua roba
5. **Camping spawn** - Max 5 minuti

## Factions
- No factions da 1 solo membro (min 3)
- Ally max 2 fazioni
- No trucing durante KoTH
- Leader decide tutto

## Ban Permanenti
- X-Ray / Hacks
- Bug abuse gravi
- Chargebacks su donazioni
- Alt accounts bannati

## Generale
- Insulti light OK, ma senza esagerare
- No spam eccessivo
- No pubblicità
- Rispetta gli admin

> Questo è hardcore, gioca smart o muori
> Usa **/report** per hacker`,
            secret_key: 'secret_key_hardcore_2024'
        },
        {
            name: 'Creative Plus',
            ip: 'creative.plus.eu',
            port: '25565',
            tags: 'Creative,Building,Italian,Plots,Events',
            description: `# 🎨 Creative Plus

**Libera la tua creatività!** Build senza limiti 🏗️

## 🏗️ Plots Illimitati
- 📐 **Plot 256x256** - Spazio enorme
- 🎭 **WorldEdit** - Build veloce
- 🖌️ **VoxelSniper** - Dettagli perfetti
- 🎪 **Temi Mensili** - Contest con premi
- 🏆 **Hall of Fame** - Esposizione top builds

## 🎁 Sistema Ranks
Guadagna rank buildando!
- **Novice** → Plot basic
- **Builder** → Comandi extra
- **Architect** → WorldEdit avanzato
- **Master** → VoxelSniper completo
- **Legend** → Perks esclusivi

## 🌟 Eventi Settimanali
- Lunedì: Speed Build (30 min)
- Mercoledì: Team Build (3v3)
- Venerdì: Tema Libero
- Domenica: Mega Contest (premi veri)

## 🎪 Community
- 300+ builders attivi
- Discord con showcase
- Tutorials e guide
- Staff sempre disponibile

**Costruisci il tuo capolavoro!** 🎨`,
            website_url: 'https://creativeplus.eu',
            discord_url: 'https://discord.gg/creativeplus',
            banner_url: 'https://picsum.photos/seed/server5/1200/400',
            logo_url: 'https://picsum.photos/seed/logo5/512/512',
            rules: `# 🎨 Regole Creative

## Building
1. **No Lag Machines** - Plot ottimizzati
2. **No Contenuti Offensivi** - Build appropriati
3. **No Pixel Arts 18+** - Keep it clean
4. **Rispetta i plot altrui** - No griefing
5. **Credit alle ispirazioni** - No plagio

## WorldEdit
- Usa con moderazione
- Max 100k blocks per comando
- No spam di comandi
- Chiedi aiuto se blocchi il server

## Contest
- No builds pre-fatte
- Rispetta il tema
- Tempo limite = tempo limite
- Giudizio staff è finale

## Comportamento
- Aiuta i nuovi builder
- Condividi tecniche
- No spam in chat
- Critica costruttiva OK

## Plot
- Max 5 plot per player
- Inattività 60 giorni = reset
- Merge plots con /plot merge
- Fidati solo di chi conosci

> Inappropriate builds = Clear plot
> Lag machines = Temp ban`,
            secret_key: 'secret_key_creativeplus_2024'
        }
    ];

    const serverIds: number[] = [];
    for (const server of servers) {
        const result = db.run(`
            INSERT INTO servers (name, ip, port, tags, description, website_url, discord_url, banner_url, logo_url, rules, secret_key)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            server.name, server.ip, server.port, server.tags, server.description,
            server.website_url, server.discord_url, server.banner_url, server.logo_url,
            server.rules, server.secret_key
        ]);
        serverIds.push(Number(result.lastInsertRowid));
    }

    // 3. SERVER STATS
    const serverStats = [
        { server_id: serverIds[0], players_online: 245, players_max: 500, is_online: true, version: '1.20.4', motd: '§6ItalianCraft §7| §aSurvival §7| §bNuova Season!', latency_ms: 15 },
        { server_id: serverIds[1], players_online: 89, players_max: 150, is_online: true, version: '1.19.4', motd: '§eRolePlay City §7| §dVivi la tua storia!', latency_ms: 22 },
        { server_id: serverIds[2], players_online: 167, players_max: 300, is_online: true, version: '1.20.2', motd: '§bSkyBlock §7| §6Custom Items §7| §aEventi!', latency_ms: 18 },
        { server_id: serverIds[3], players_online: 134, players_max: 200, is_online: true, version: '1.8.9', motd: '§4§lHARDCORE §cFactions §7| §6Raiding Enabled!', latency_ms: 12 },
        { server_id: serverIds[4], players_online: 56, players_max: 100, is_online: true, version: '1.20.4', motd: '§5Creative Plus §7| §dLibera la creatività!', latency_ms: 20 }
    ];

    for (const stat of serverStats) {
        db.run(`
            INSERT INTO server_stats (server_id, players_online, players_max, is_online, version, motd, latency_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [stat.server_id ?? 0, stat.players_online, stat.players_max, stat.is_online ? 1 : 0, stat.version, stat.motd, stat.latency_ms]);
    }

    // 4. SERVER OWNERS (Associa owner ai server)
    const ownerships = [
        { server_id: serverIds[0], discord_user_id: '123456789012345678', role: 'owner' },
        { server_id: serverIds[1], discord_user_id: '234567890123456789', role: 'owner' },
        { server_id: serverIds[2], discord_user_id: '345678901234567890', role: 'owner' },
        { server_id: serverIds[3], discord_user_id: '123456789012345678', role: 'owner' }, // Stesso owner del primo
        { server_id: serverIds[4], discord_user_id: '234567890123456789', role: 'owner' }  // Stesso owner del secondo
    ];

    for (const ownership of ownerships) {
        db.run(`
            INSERT INTO server_owners (server_id, discord_user_id, role)
            VALUES (?, ?, ?)
        `, [ownership.server_id ?? 0, ownership.discord_user_id, ownership.role]);
    }

    // 5. VOTES (voti fake da vari player)
    const playerNames = [
        'xXDarkKillerXx', 'NotchSupremo', 'SteveLeggenda', 'AlexBuilder',
        'CreeperSlayer', 'EnderDragon99', 'DiamondMiner', 'RedstoneMaster',
        'PvPGod123', 'BuilderPro', 'FarmerJoe', 'MiningKing',
        'IlPirataDX', 'GamerITA', 'ProPlayer2024', 'NoobDestroyer'
    ];

    // Genera voti casuali per ogni server
    for (const serverId of serverIds) {
        const numVotes = Math.floor(Math.random() * 50) + 20; // 20-70 voti per server
        for (let i = 0; i < numVotes; i++) {
            const randomPlayer = playerNames[Math.floor(Math.random() * playerNames.length)];
            const daysAgo = Math.floor(Math.random() * 30); // Voti negli ultimi 30 giorni
            db.run(`
                INSERT INTO votes (server_id, playerGameName, voted_at)
                VALUES (?, ?, datetime('now', '-${daysAgo} days'))
            `, [serverId, randomPlayer ?? '']);
        }
    }

    // 6. SESSIONS (sessioni attive fake)
    const sessions = [
        {
            session_id: 'sess_' + Math.random().toString(36).substring(7),
            user_id: '123456789012345678',
            access_token: 'token_' + Math.random().toString(36).substring(7),
            refresh_token: 'refresh_' + Math.random().toString(36).substring(7),
            expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 giorni
        },
        {
            session_id: 'sess_' + Math.random().toString(36).substring(7),
            user_id: '234567890123456789',
            access_token: 'token_' + Math.random().toString(36).substring(7),
            refresh_token: 'refresh_' + Math.random().toString(36).substring(7),
            expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000)
        }
    ];

    for (const session of sessions) {
        db.run(`
            INSERT INTO sessions (session_id, user_id, access_token, refresh_token, expires_at)
            VALUES (?, ?, ?, ?, ?)
        `, [session.session_id, session.user_id, session.access_token, session.refresh_token, session.expires_at]);
    }

    console.log('✅ Database seedato con successo!');
    console.log(`   - ${discordUsers.length} Discord users`);
    console.log(`   - ${servers.length} Servers`);
    console.log(`   - ${serverStats.length} Server stats`);
    console.log(`   - ${ownerships.length} Ownerships`);
    console.log(`   - ~${playerNames.length * serverIds.length} Votes`);
    console.log(`   - ${sessions.length} Active sessions`);
}