import type { Cookie } from "elysia/cookies";
import { Database } from "bun:sqlite";

// Tipi (puoi spostarli in un file types/session.ts se preferisci)
export interface SessionRow {
  session_id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;     // millisecondi da epoch
  created_at: string;
}

export interface SessionValidationResult {
  valid: boolean;
  userId?: string;
  expired?: boolean;
  reason?: string;
}

export class SessioneRepository {
  private static readonly TABLE = "sessions";

  /**
   * Estrae l'ID della sessione dal cookie
   */
  static getSessionIdFromCookie(cookies: Record<string, Cookie<unknown>>): string | undefined {
    return cookies.session?.value as string | undefined;
  }

  /**
   * Valida una sessione controllando esistenza e scadenza
   * @returns oggetto con validità, userId e motivo eventuale fallimento
   */
  static validateSession(
    sessionId: string | undefined,
    db: Database
  ): SessionValidationResult {
    if (!sessionId) {
      return {
        valid: false,
        reason: "Nessun session ID fornito",
      };
    }

    const session = db
      .query(
        `SELECT user_id, expires_at 
         FROM ${this.TABLE} 
         WHERE session_id = ?`
      )
      .get(sessionId) as { user_id: string; expires_at: number } | undefined;

    if (!session) {
      return {
        valid: false,
        reason: "Sessione non trovata",
      };
    }

    const now = Date.now();

    if (session.expires_at < now) {
      return {
        valid: false,
        expired: true,
        userId: session.user_id,
        reason: "Sessione scaduta",
      };
    }

    return {
      valid: true,
      userId: session.user_id,
    };
  }

  /**
   * Recupera l'intera riga della sessione (se valida e non scaduta)
   */
  static async getValidSession(sessionId: string, db: Database): Promise<SessionRow | null> {
    const session = db
      .query(
        `SELECT * FROM ${this.TABLE} WHERE session_id = ?`
      )
      .get(sessionId) as SessionRow | undefined;

    if (!session) return null;

    if (session.expires_at < Date.now()) {
      // Opzionale: potresti eliminare la sessione scaduta qui
      // await this.deleteSession(sessionId, db);
      return null;
    }

    return session;
  }

  /**
   * Crea una nuova sessione e la salva nel database
   * @returns la sessione appena creata
   */
  static async createSession(
    db: Database,
    data: {
      session_id: string;
      user_id: string;
      access_token: string;
      refresh_token: string;
      expires_at: number;
    }
  ): Promise<SessionRow> {
    const now = new Date().toISOString().replace("T", " ").split(".")[0]?.toString();

    const stmt = db.prepare(`
      INSERT INTO ${this.TABLE} (
        session_id, user_id, access_token, refresh_token, expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `);

    if(now != null) {
      const row = stmt.get(
        data.session_id,
        data.user_id,
        data.access_token,
        data.refresh_token,
        data.expires_at,
        now
      ) as SessionRow | undefined;
      
      if (!row) {
        throw new Error("Impossibile creare la sessione");
      }
      return row;
    }
  
    throw new Error("Impossibile creare la sessione");
  }

  /**
   * Elimina/invalida una sessione
   * @returns true se eliminata con successo
   */
  static async deleteSession(sessionId: string, db: Database): Promise<boolean> {
    const result = db
      .prepare(`DELETE FROM ${this.TABLE} WHERE session_id = ?`)
      .run(sessionId);

    return result.changes > 0;
  }

  /**
   * Elimina tutte le sessioni scadute (utile per pulizia periodica)
   */
  static async cleanupExpiredSessions(db: Database): Promise<number> {
    const result = db
      .prepare(`DELETE FROM ${this.TABLE} WHERE expires_at < ?`)
      .run(Date.now());

    return result.changes;
  }

  /**
   * Combina estrazione + validazione in un unico metodo comodo
   */
  static async getValidatedUserIdFromRequest(
    cookies: Record<string, Cookie<unknown>>,
    db: Database
  ): Promise<string | null> {
    const sessionId = this.getSessionIdFromCookie(cookies);
    if (!sessionId) return null;

    const validation = this.validateSession(sessionId, db);
    return validation.valid ? validation.userId! : null;
  }
}