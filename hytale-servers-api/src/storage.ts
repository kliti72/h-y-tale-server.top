import { Database } from 'bun:sqlite'


export function initDatabaseSchema(db: Database) {

    db.run(`
    CREATE TABLE IF NOT EXISTS servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        ip TEXT NOT NULL,
        port TEXT NOT NULL,
        tags TEXT DEFAULT '',
        description TEXT DEFAULT '',
        website_url TEXT DEFAULT '',
        discord_url TEXT DEFAULT '',
        banner_url TEXT DEFAULT '',
        logo_url TEXT DEFAULT '',
        rules TEXT DEFAULT '',
        secret_key  TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at  TEXT DEFAULT (datetime('now'))
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS votes (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id       INTEGER NOT NULL,
        playerGameName  TEXT NOT NULL COLLATE NOCASE,
        voted_at        TEXT NOT NULL DEFAULT (datetime('now')),
        
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
    );
    `)


    db.run(`
    CREATE TABLE IF NOT EXISTS discord_users (
        id TEXT PRIMARY KEY,                    -- discord user id (string)
        username TEXT NOT NULL,
        global_name TEXT,
        avatar TEXT,
        discriminator TEXT,
        email TEXT,
        last_vote_at TEXT,
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

    db.run(`
        CREATE TABLE IF NOT EXISTS server_owners (
            server_id       INTEGER NOT NULL,
            discord_user_id TEXT    NOT NULL,
            role            TEXT    DEFAULT 'owner',  
            joined_at       TEXT    DEFAULT (datetime('now')),
            
            PRIMARY KEY (server_id, discord_user_id),
            FOREIGN KEY (server_id)       REFERENCES servers(id)       ON DELETE CASCADE,
            FOREIGN KEY (discord_user_id) REFERENCES discord_users(id) ON DELETE CASCADE
        );
    `);

}