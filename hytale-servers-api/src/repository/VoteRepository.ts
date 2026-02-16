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


    // Esempio funzione che gestisce il voto
    public static async handleVote(db: Database, discordUserId: string, serverId: number, playerGameName: string) {
        // 1. Cerchiamo quando ha votato l'ultima volta
        const lastVote = db
            .prepare('SELECT last_vote_at FROM discord_users WHERE id = ?')
            .get(discordUserId) as { last_vote_at: string | null } | undefined;

        const now = new Date();

        console.log("Arrivato discord user", discordUserId);

        let canVote = true;
        let reason = "";

        if (lastVote?.last_vote_at) {
            const lastVoteDate = new Date(lastVote.last_vote_at);
            const diffMs = now.getTime() - lastVoteDate.getTime();
            const hoursDiff = diffMs / (1000 * 60 * 60);

            if (hoursDiff < 24) {
                canVote = false;
                reason = `Hai già votato nelle ultime 24 ore! Riprova tra ${Math.ceil(24 - hoursDiff)} ore.`;
            }
        }

        console.log("Verificato se l'utente può votare: ", canVote);

        if (!canVote) {
            return { success: false, message: reason };
        }

        // 2. Se può votare → registriamo il voto
        //    (qui fai l'INSERT nella tabella votes come preferisci)

        db.prepare(`
        INSERT INTO votes (server_id, playerGameName, voted_at)
        VALUES (?, ?, datetime('now'))
        `).run(serverId, playerGameName);

        // 3. IMPORTANTISSIMO → aggiorniamo l'ultima data di voto dell'utente
        db.prepare(`
        UPDATE discord_users
        SET last_vote_at = datetime('now')
        WHERE id = ?
        `).run(discordUserId);

        return { success: true, message: "Voto registrato con successo! ⭐" };
    }

        // Esempio funzione che gestisce il voto
    public static async aviableVote(db: Database, discordUserId: string) {
        // 1. Cerchiamo quando ha votato l'ultima volta
        const lastVote = db
            .prepare('SELECT last_vote_at FROM discord_users WHERE id = ?')
            .get(discordUserId) as { last_vote_at: string | null } | undefined;

        const now = new Date();

        console.log("Arrivato discord user", discordUserId);

        let canVote = true;
        let reason = "";

        if (lastVote?.last_vote_at) {
            const lastVoteDate = new Date(lastVote.last_vote_at);
            const diffMs = now.getTime() - lastVoteDate.getTime();
            const hoursDiff = diffMs / (1000 * 60 * 60);

            if (hoursDiff < 24) {
                reason = `${Math.ceil(24 - hoursDiff)}`;
                canVote = false;
            }
        }
 
        if (!canVote) {
            return { success: false, wait_time: reason };
        }
 
        return { success: true };

    }

}