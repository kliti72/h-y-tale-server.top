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

  static async getAll(db: Database): Promise<Server | null> {
    const row = db
      .prepare('SELECT * FROM servers')
      .get() as Server | undefined;
    return row ?? null;
  }


  // Opzionale: metodo per aggiornare la secret key
  static async updateSecretKey(db: Database, name: string, newSecret: string): Promise<boolean> {
    const result = db
      .prepare('UPDATE servers SET secret_key = ? WHERE name = ?')
      .run(newSecret, name);

    return result.changes > 0;
  }
}