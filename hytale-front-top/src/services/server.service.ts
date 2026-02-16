// src/services/server.service.ts
import type { ServerApiResponse, ServerResponse } from '../types/ServerResponse'; 

export class ServerService {

  static baseUrl = 'http://localhost:3000/api';

  /**
   * Ottiene un singolo server per nome
   */
  static async getServerByName(name: string): Promise<ServerResponse> {
    
    const response = await fetch(`${ServerService.baseUrl}/servers/${encodeURIComponent(name)}`);
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
    
    const res = await fetch(`${ServerService.baseUrl}/api/servers`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(server),
      }); 

      if(!res.ok) {
        throw new Error("Impossibile aggiungere il")
      }

    return res.ok;
  
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

  static async getServers() {
    try {
      const res = await fetch(`${ServerService.baseUrl}/servers`)
      
      if(!res.ok) {
        console.log(`[ServerService] errore durante la fetch ${res.status} : ${res.statusText}`)
      }

      return res.json();
    } catch(err) {
      console.log(`[ServerService] errore durante la chiamata del metodo getServers`)
    }
  }

}