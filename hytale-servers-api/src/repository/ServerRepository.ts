import { Database } from 'bun:sqlite';
import { type ServerResponse } from '../types/types';

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

    const stmt = db.prepare(SEARCH_SERVER_BY_SECRET);
    const server = stmt.get(secret_key) as ServerResponse;

    return server;

  }

   public static getById(id: number, db: Database) {
    const SEARCH_SERVER_BY_SECRET = `SELECT * FROM servers WHERE id = ?`

    const stmt = db.prepare(SEARCH_SERVER_BY_SECRET);
    const server = stmt.get(id) as ServerResponse;

    return server;

  }

  
}