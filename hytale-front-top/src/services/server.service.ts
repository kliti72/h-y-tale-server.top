// src/services/server.service.ts
import type { ServerResponse } from '../types/ServerResponse'; 

export class ServerService {

  static baseUrl = 'http://localhost:3000/api';

  /**
   * Ottiene un singolo server per nome
   */
  static async getServerByName(name: string): Promise<ServerResponse> {
    const url = `${ServerService.baseUrl}/servers/${encodeURIComponent(name)}`;

    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Server "${name}" non trovato`);
        }
        throw new Error(`Errore ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ServerResponse;
    } catch (error) {
      console.error('[ServerService] Errore durante getServerByName:', error);
      throw error; // oppure puoi creare un tuo errore custom
    }
  }

  // Bonus - se ti serviranno in futuro
  static async getMyServers(): Promise<any> {
    // implementazione...
    const response = await fetch(`${this.baseUrl}/servers/mine`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Errore caricamento miei server');
    return response.json();
  }

  // ... puoi aggiungere altre funzioni quando ti servono
}