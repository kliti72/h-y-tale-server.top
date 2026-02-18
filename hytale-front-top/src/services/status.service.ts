// src/services/server.service.ts
import type { ServerStatus, ServerStatusApiResponse } from '../types/ServerResponse';

export class StatusService {

  static baseUrl = 'http://localhost:3000/servers';

  /**
   * Ottiene un singolo server per nome
   */
  static async getStatusById(id: number): Promise<ServerStatus> {

    const response = await fetch(`${StatusService.baseUrl}/status/${encodeURIComponent(id)}`);
    const wrapperResponse: ServerStatusApiResponse = await response.json();

    if (!wrapperResponse.success) {
      throw new Error(wrapperResponse.error || "Errore nel caricamento del server");
    }

    if (!wrapperResponse.data) {
      throw new Error("Server non trovato");
    }

    return wrapperResponse.data;

  }


}