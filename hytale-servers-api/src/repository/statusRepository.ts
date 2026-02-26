import { Database } from 'bun:sqlite';

export class statusRepository {

    // In ServerRepository
    public static upsertSecondaryStatus(db: Database, data: {
        server_id: number,
        secondary_id: string,
        players_online: number,
        last_ping: string
    }) {
        // Upsert su tabella server_secondary_status
        return db.run(`
        INSERT INTO server_secondary_status 
        (server_id, secondary_id, players_online, last_ping)
        VALUES 
        (?, ?, ?, ?)
        ON CONFLICT(server_id, secondary_id) 
        DO UPDATE SET
        players_online = excluded.players_online,
        last_ping = excluded.last_ping
  `, [data.server_id, data.secondary_id, data.players_online, data.last_ping]);
    };

    // Somma i secondary "freschi" — TTL 45 secondi implicito
    public static getSecondaryPlayersSum(db: Database, server_id: number): number {
        const threshold = new Date(Date.now() - 45_000).toISOString();
            const stmt = db.prepare(`
                SELECT COALESCE(SUM(players_online), 0) as total
                FROM server_secondary_status
                WHERE server_id = ? AND last_ping > ?`
            );

        const row = stmt.get(server_id, threshold) as { total: number } | undefined;
        return row?.total ?? 0;
    };

}