import { Database } from 'bun:sqlite';
import type { ServerResponse, ServerStatus } from '../types/types';
import { tags } from 'typia';

export class ServerRepository {

  private static readonly INSERT_SQL = `
    INSERT INTO servers (name, ip, port, tags, description, website_url, discord_url, banner_url, logo_url, rules, secret_key, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `;

  static put(db: Database, data: Omit<ServerResponse, 'id'>) {
    console.log("Metodo put chiamato");
    // Convertiamo tags in stringa
    let tagsString: string;

    if (Array.isArray(data.tags)) {
      tagsString = data.tags.join(',');           // "pvp,survival,italia"
    } else if (typeof data.tags === 'string') {
      tagsString = data.tags;                     // già stringa, la lasciamo così
    } else {
      tagsString = '';                            // undefined / null → stringa vuota
    }

    const stmt = db.prepare(this.INSERT_SQL);
    console.log("Inserimento di", data);

    const row = stmt.get(
      data.name,
      data.ip,
      data.port,
      tagsString,
      data.description ?? 'Not have a description',
      data.website_url ?? '',
      data.discord_url ?? '',
      data.banner_url ?? '',
      data.logo_url ?? '',
      data.rules ?? '',
      data.secret_key ?? '',
      data.created_at ?? '',
      data.updated_at ?? '',
    ) as ServerResponse | undefined;

    console.log("Inserito", row);
    if (!row) {
      throw new Error('Impossibile creare il server');
    }

    return row;
  }

  // Opzionale: metodo per trovare per nome
  static async findByName(db: Database, name: string): Promise<ServerResponse | null> {
    const row = db
      .prepare('SELECT * FROM servers WHERE name = ?')
      .get(name) as ServerResponse | undefined;

    return row ?? null;
  }

  static getAll(db: Database): ServerResponse[] {
    const rawRows = db.prepare('SELECT * FROM servers').all();

    return rawRows.map(row => {
      // Qui potresti usare una funzione di validazione se vuoi
      return row as ServerResponse;
    });
  }

  static getAllQuery(
    db: Database,
    { page, limit, sort, search }: { page: number; limit: number; sort: string; search?: string }
  ): ServerResponse[] {
    const offset = (page - 1) * limit;


    console.log("Sort arrivato", sort);
    const validSortFields = ['id', 'name', 'created_at', 'voti_totali'];
    const validSortOrders = ['asc', 'desc'];

    const [sortField, sortOrder] = sort.split(':');
    const safeField = validSortFields.includes(sortField ?? '') ? sortField : 'id';
    const safeOrder = validSortOrders.includes(sortOrder ?? '') ? sortOrder : 'asc';

    // Se c'è search, filtra per nome
    const whereClause = search ? `WHERE name LIKE ?` : '';
    console.log("Serach arrivata per ", search);

    const params = search
      ? [`%${search}%`, limit, offset]
      : [limit, offset];

    console.log(`Search query ${limit}`)

    console.log(` ORder by ${safeField} ${safeOrder} `)
    const rawRows = db
      .prepare(
        `SELECT * FROM servers 
       ${whereClause}
       ORDER BY ${safeField} ${safeOrder} 
       LIMIT ? OFFSET ?`
      )
      .all(...params);

    return rawRows.map(row => row as ServerResponse);
  }


  static getByName(db: Database, serverName: string): ServerResponse {
    const server = db.prepare('SELECT * FROM servers WHERE name = ?').get(serverName);
    return server as ServerResponse;
  }


  static getServersByUserID(userId: string, db: Database): ServerResponse[] {
    const rawRows = db
      .query(`
        SELECT 
          s.id,
          s.name,
          s.ip, 
          s.logo_url,
          s.banner_url,
          s.discord_url,
          s.description,
          s.port,
          s.tags,
          s.secret_key,
          s.created_at,
          so.role
        FROM servers s
        INNER JOIN server_owners so ON so.server_id = s.id
        WHERE so.discord_user_id = ?
        ORDER BY s.created_at DESC
      `)
      .all(userId ?? 0);

    return rawRows.map(row => {
      return row as ServerResponse;
    });
  }


  // Opzionale: metodo per aggiornare la secret key
  static async updateSecretKey(db: Database, name: string, newSecret: string): Promise<boolean> {
    const result = db
      .prepare('UPDATE servers SET secret_key = ? WHERE name = ?')
      .run(newSecret, name);

    return result.changes > 0;
  }

  public static getServerBySecret(secret_key: string, db: Database) {
    const SEARCH_SERVER_BY_SECRET = `SELECT * FROM servers WHERE secret_key = ?`
    console.log("Chiave arrivata", secret_key);
    const stmt = db.prepare(SEARCH_SERVER_BY_SECRET);
    const server = stmt.get(secret_key) as ServerResponse;

    console.log("Server trovato", server);

    return server;

  }

  static toArrayTags(value: string): string[] {
    return value
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  public static getById(id: number, db: Database) {
    const stmt = db.prepare(`SELECT * FROM servers WHERE id = ?`);
    const server = stmt.get(id) as ServerResponse;

    if (!server) return null;

    server.tags = typeof server.tags === "string"
      ? ServerRepository.toArrayTags(server.tags)
      : server.tags ?? [];

    return server;
  }

  static isUserOwner(db: Database, serverId: number, userId: string): boolean {
    const serverIdNum = typeof serverId === 'string' ? parseInt(serverId) : serverId;

    const stmt = db.prepare(`
    SELECT discord_user_id
    FROM server_owners  
    WHERE server_id = ? AND discord_user_id = ? AND role = 'owner'
    `);

    const result = stmt.get(serverIdNum, userId);
    const isOwner = result !== null && result !== undefined;
    return isOwner;
  }

  /**
   * Update server
   */
  static update(
    db: Database,
    serverId: number,
    data: {
      name: string;
      ip: string;
      port: string;
      tags: string[];
      description: string;
      website_url: string;
      discord_url: string;
      banner_url: string;
      logo_url: string;
      rules: string;
      secret_key?: string;
    }
  ): ServerResponse {
    // Converti array tags in stringa

    const stmt = db.prepare(`
      UPDATE servers 
      SET 
        name = ?,
        ip = ?,
        port = ?,
        tags = ?,
        description = ?,
        website_url = ?,
        discord_url = ?,
        banner_url = ?,
        logo_url = ?,
        rules = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);

    const tagsToString = data.tags.join(",");

    stmt.run(
      data.name,
      data.ip,
      data.port,
      tagsToString,
      data.description,
      data.website_url,
      data.discord_url,
      data.banner_url,
      data.logo_url,
      data.rules,
      serverId
    );

    // Ritorna il server aggiornato
    const updatedServer = this.getById(serverId, db);

    if (!updatedServer) {
      throw new Error("Server non trovato dopo l'update!");
    }

    return updatedServer;
  }

  /**
   * Delete server
   */
  static delete(db: Database, serverId: number): void {
    const stmt = db.prepare(`
      DELETE FROM servers WHERE id = ?
    `);

    stmt.run(serverId);

    console.log(`Server ${serverId} eliminato dal database`);
  }



  // ... continua dentro la classe ServerRepository

  // ───────────────────────────────────────────────
  //           METODI PER server_stats
  // ───────────────────────────────────────────────

  /**
   * Crea o aggiorna lo status attuale di un server
   * (UPSERT: se esiste già per quel server_id, aggiorna, altrimenti inserisce)
   */
  static upsertServerStatus(
    db: Database,
    data: Omit<ServerStatus, 'id' | 'last_updated'>
  ): ServerStatus {
    const UPSERT_SQL = `
    INSERT INTO server_stats (
      server_id, players_online, players_max, is_online, last_updated
    ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(server_id) DO UPDATE SET
      players_online      = excluded.players_online,
      players_max         = excluded.players_max,
      is_online           = excluded.is_online,
      last_updated   = CURRENT_TIMESTAMP
    RETURNING *
  `;

    const stmt = db.prepare(UPSERT_SQL);

    const row = stmt.get(
      data.server_id,
      data.players_online,
      data.players_max,
      data.is_online ? 1 : 0,
    ) as ServerStatus | undefined;

    if (!row) {
      throw new Error(`Impossibile aggiornare/creare status per server ${data.server_id}`);
    }

    return row;
  }

  /**
   * Ottiene lo status più recente di un server
   */
  static getLatestStatus(db: Database, serverId: number): ServerStatus | null {
    const row = db
      .prepare('SELECT * FROM server_stats WHERE server_id = ? ORDER BY last_updated DESC LIMIT 1')
      .get(serverId) as ServerStatus | undefined;

    return row ?? null;
  }

  /**
   * Ottiene lo status di tutti i server (ultimo per ognuno)
   * Utile per la lista principale "/servers"
   */
  static getAllLatestStatuses(db: Database): (ServerResponse & { status: ServerStatus | null })[] {
    const rows = db.prepare(`
    SELECT 
      s.*,
      st.players_online,
      st.players_max,
      st.is_online,
      st.last_updated
    FROM servers s
    LEFT JOIN (
      SELECT *
      FROM server_stats
      WHERE (server_id, last_updated) IN (
        SELECT server_id, MAX(last_updated)
        FROM server_stats
        GROUP BY server_id
      )
    ) st ON s.id = st.server_id
    ORDER BY st.players_online DESC, s.name
  `).all() as any[];

    return rows.map(row => ({
      ...row,
      status: row.players_online !== undefined ? {
        server_id: row.id,
        players_online: row.players_online,
        players_max: row.players_max,
        is_online: !!row.is_online,
        latency_ms: row.latency_ms,
        last_updated: row.last_updated
      } : null
    }));
  }

  /**
   * Elimina lo status di un server (es. quando elimini il server)
   */
  static deleteStatus(db: Database, serverId: number): boolean {
    const result = db
      .prepare('DELETE FROM server_stats WHERE server_id = ?')
      .run(serverId);

    return result.changes > 0;
  }

  /**
   * Ottiene gli ultimi N aggiornamenti di status di un server
   * (utile per grafico storico / uptime)
   */
  static getStatusHistory(
    db: Database,
    serverId: number,
    limit: number = 50
  ): ServerStatus[] {
    const rows = db
      .prepare('SELECT * FROM server_stats WHERE server_id = ? ORDER BY last_updated DESC LIMIT ?')
      .all(serverId, limit) as ServerStatus[];

    return rows;
  }

  /**
   * Conta quanti server sono attualmente online
   * (utile per statistiche in homepage)
   */
  static countOnlineServers(db: Database): number {
    const row = db
      .prepare('SELECT COUNT(*) as count FROM server_stats WHERE is_online = 1')
      .get() as { count: number };

    return row.count;
  }

  /**
   * Ottiene i server più popolati al momento
   */
  static getTopPopulated(db: Database, limit: number = 10): (ServerResponse & { status: ServerStatus })[] {
    const rows = db.prepare(`
    SELECT s.*, st.*
    FROM servers s
    INNER JOIN server_stats st ON s.id = st.server_id
    WHERE st.is_online = 1
    ORDER BY st.players_online DESC
    LIMIT ?
  `).all(limit) as any[];

    return rows.map(row => ({
      ...row,
      status: {
        server_id: row.server_id,
        players_online: row.players_online,
        players_max: row.players_max,
        is_online: !!row.is_online,
        // ... altri campi se li hai selezionati
      }
    }));
  }


}