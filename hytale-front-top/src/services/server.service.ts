// src/services/server.service.ts
import type { ServerApiResponse, ServerResponse } from '../types/ServerResponse';

// Primo, crea un nuovo tipo per la risposta di "mine"
export interface MyServersResponse {
  user: {
    id: string;
  };
  servers: ServerResponse[];
  count: number;
}

interface GetServerParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string; // tanto ce l'hai ora
}

export class ServerService {

  static baseUrl = 'http://localhost:3000/servers';

  /**
   * Ottiene un singolo server per nome
   */
  static async getServerByName(name: string): Promise<ServerResponse> {

    const response = await fetch(`${ServerService.baseUrl}/${encodeURIComponent(name)}`);
    const wrapperResponse: ServerApiResponse = await response.json();

    if (!wrapperResponse.success) {
      throw new Error(wrapperResponse.error || "Errore nel caricamento del server");
    }

    if (!wrapperResponse.data) {
      throw new Error("Server non trovato");
    }

    return wrapperResponse.data;

  }

  /**
 * Ottiene un singolo server per nome
 */
  static async addServer(server: ServerResponse): Promise<Boolean> {

    const res = await fetch(`${ServerService.baseUrl}/`, {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(server),
    });

    if (!res.ok) {
      throw new Error("Impossibile aggiungere il")
    }

    return res.ok;

  }

  // Poi nel service, aggiorna il metodo
  static async getMyServers(): Promise<MyServersResponse> {
    const response = await fetch(`${this.baseUrl}/mine`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error("Errore nel caricamento dei tuoi server bro!");
    }

    const data: MyServersResponse = await response.json();

    return data;
  }

  static async getServers() {
    try {
      const res = await fetch(`${ServerService.baseUrl}/all`)

      if (!res.ok) {
        console.log(`[ServerService] errore durante la fetch ${res.status} : ${res.statusText}`)
      }

      return res.json();
    } catch (err) {
      console.log(`[ServerService] errore durante la chiamata del metodo getServers`)
    }
  }

  static async getServerParams({ page = 1, limit = 20, sort = '', search = '' }: GetServerParams = {}) {
    try {
      const qs = new URLSearchParams();
      qs.set('page', String(page));
      qs.set('limit', String(limit));
      if (sort) qs.set('sort', sort);
      if (search) qs.set('search', search); 

      const url = `${this.baseUrl}?${qs}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json() as { success: boolean; data: ServerResponse[] };
    } catch (err) {
      console.error('[getServerParams]', err);
      throw err;
    }
  }

  static async updateServer(serverId: number, data: Partial<ServerResponse>): Promise<ServerResponse> {
    const response = await fetch(`${this.baseUrl}/${serverId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Errore nell'aggiornamento del server bro!");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Errore nell'aggiornamento");
    }

    return result.data;
  }

  static async deleteServer(serverId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${serverId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Errore nell'eliminazione del server!");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Errore nell'eliminazione");
    }
  }

  static async getServerById(serverId: number): Promise<ServerResponse> {
    const response = await fetch(`${this.baseUrl}/${serverId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Server non trovato fra!");
      }
      throw new Error("Errore nel caricamento del server bro!");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Dati server mancanti");
    }

    return result.data;
  }

}