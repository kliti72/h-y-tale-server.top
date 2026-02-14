import { Database } from 'bun:sqlite';

export interface Server {
  id?: number;
  name: string;
  ip: string;
  port: string;
  tags?: string[];
  secret_key?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServerAdmin {
  id?: number;
  name: string;
  ip: string;
  port: string;
  tags?: string[];
  secret_key?: string;
  created_at?: string;
  updated_at?: string;
}


export class ServerRepository {

  private static readonly INSERT_SQL = `
    INSERT INTO servers (name, ip, port, tags, secret_key, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `;

  static put(db: Database, data: Omit<Server, 'id'>) {
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
        data.secret_key ?? '',
        data.created_at ?? '',
        data.updated_at ?? '',
      ) as Server | undefined;

    console.log("Inserito", row);
    if (!row) {
      throw new Error('Impossibile creare il server');
    }

    return row;
  }

  // Opzionale: metodo per trovare per nome
  static async findByName(db: Database, name: string): Promise<Server | null> {
    const row = db
      .prepare('SELECT * FROM servers WHERE name = ?')
      .get(name) as Server | undefined;

    return row ?? null;
  }

  static getAll(db: Database): Server[] {
    const rawRows = db.prepare('SELECT * FROM servers').all();
    
    return rawRows.map(row => {
      // Qui potresti usare una funzione di validazione se vuoi
      return row as Server;
    });
  }

  static getByName(db: Database, serverName: string): Server {
    const server = db.prepare('SELECT * FROM servers WHERE name = ?').get(serverName);
    return server as Server;
  }

  
  static getServersByUserID(userId : string, db : Database): Server[] {
    const rawRows = db
        .query(`
        SELECT 
          s.id,
          s.name,
          s.ip,
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
      return row as Server;
    });
  }


  // Opzionale: metodo per aggiornare la secret key
  static async updateSecretKey(db: Database, name: string, newSecret: string): Promise<boolean> {
    const result = db
      .prepare('UPDATE servers SET secret_key = ? WHERE name = ?')
      .run(newSecret, name);

    return result.changes > 0;
  }
}