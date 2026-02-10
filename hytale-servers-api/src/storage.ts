import { Database } from 'bun:sqlite'


export function __init__database__(db : Database) {


    // Crea tabella se non esiste
    db.run(`
    CREATE TABLE IF NOT EXISTS servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ip TEXT NOT NULL,
        port TEXT NOT NULL,
        tags TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS discord_users (
        id TEXT PRIMARY KEY,                    -- discord user id (string)
        username TEXT NOT NULL,
        global_name TEXT,
        avatar TEXT,
        discriminator TEXT,
        email TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        expires_at INTEGER NOT NULL,           -- timestamp in millisecondi
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES discord_users(id)
    )
    `);

    // Popola con dati di esempio SOLO se la tabella è vuota
    const count = db.query('SELECT COUNT(*) as cnt FROM servers').get() as { cnt: number }
    if (count.cnt === 0) {
    const examples = [
        { name: "Ethereal Grove",     ip: "play.ethereal.it",      port: "25565", tags: ["Survival", "ITA", "PvE"] },
        { name: "Ancient Canopy",      ip: "canopy.hytale.net",    port: "25566", tags: ["PvP", "Economy", "New"] },
        { name: "Luminwood Haven",     ip: "luminwood.fun",        port: "19132", tags: ["Creative", "Community"] },
        { name: "Mistveil Enclave",    ip: "mistveil.org",         port: "25565", tags: ["Roleplay", "Whitelist"] },
        { name: "Starroot Sanctuary",  ip: "starroot.hytale.gg",   port: "25565", tags: ["Minigames", "Family-Friendly"] },
    ]

    const insert = db.prepare(
        'INSERT INTO servers (name, ip, port, tags) VALUES (?, ?, ?, ?)'
    )

    for (const ex of examples) {
        insert.run(ex.name, ex.ip, ex.port, ex.tags.join(','))
    }

    console.log(`Inseriti ${examples.length} server di esempio`)
    }



}