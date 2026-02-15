import { Database } from 'bun:sqlite';
import type { Server } from './ServerRepository';

interface Vote {
    id: string,
    server_id: string,
    playerGameName: string,
    voted_at: string
}

export class VoteRepository {


    public static put(data: Omit<Vote, 'id'>, db : Database) {
       const INSERT_VOTE_QUERY = `
        INSERT INTO servers (server_id, playerGameName, voted_at)
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

}