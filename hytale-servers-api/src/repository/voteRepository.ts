import { Database } from 'bun:sqlite';

interface Vote {
    id: string,
    server_id: number,
    playerGameName: string,
    voted_at: string
}

export class VoteRepository {


    public static put(data: Omit<Vote, 'id'>, db: Database) {
        const INSERT_VOTE_QUERY = `
        INSERT INTO votes (server_id, playerGameName, voted_at)
        VALUES (?, ?, ?)
        RETURNING *
        `;

        const stmt = db.prepare(INSERT_VOTE_QUERY);
        const vote = stmt.get(
            data.server_id,
            data.playerGameName,
            data.voted_at
        ) as Vote;

        return vote;
    }


    public static clearAll(db: Database) {
        db.prepare(`DELETE FROM votes`).run();
        db.prepare(`UPDATE discord_users SET last_vote_at = NULL`).run();
    }

    public static getAll(db: Database) {
        const GET_VOTES = `
       SELECT * FROM votes
        `;

        const stmt = db.prepare(GET_VOTES);
        const vote = stmt.all() as Vote[];
        return vote;
    }


    public static getVotes(server_id: number, playerGameName: string, db: Database) {
        const GET_LAST_VOTE = `
            SELECT * 
            FROM votes 
            WHERE server_id = ? AND playerGameName = ? 
            ORDER BY voted_at DESC 
        `
        const stmt = db.prepare(GET_LAST_VOTE);
        const vote = stmt.all(server_id, playerGameName) as Vote[];
        return vote;
    }


    public static async handleVote(db: Database, discordUserId: string, serverId: number, playerGameName: string) {
        const now = new Date();

        // Parte corretta
        const recentVote = db
            .prepare(`SELECT id FROM votes WHERE playerGameName = ? AND voted_at > datetime('now', '-24 hours')`)
            .get(playerGameName) as { id: number } | undefined;

        if (recentVote) {
            // Qui fermarsi coretto
            return { success: false, message: "Hai già votato nelle ultime 24 ore!" };
        }

        // Aggiornare ultimo voto dell'utente
        db.prepare(`UPDATE discord_users SET last_vote_at = datetime('now') WHERE id = ?`).run(discordUserId);

        // Aggiornrare voti totali del server corretto
        db.prepare(`UPDATE servers SET voti_totali = voti_totali + 1 WHERE id = ?`).run(serverId);
        
        const result = db.prepare(`INSERT INTO votes (server_id, playerGameName, voted_at) VALUES (?, ?, datetime('now'))`).run(serverId, playerGameName);
        console.log("[VOTE] insert result:", result);

        // verifica immediata
        const inserted = db.prepare(`SELECT * FROM votes WHERE playerGameName = ?`).all(playerGameName);
        console.log("[VOTE] voti nel db dopo insert:", inserted);

        return { success: true, message: "Voto registrato con successo! ⭐" };
    }




}
