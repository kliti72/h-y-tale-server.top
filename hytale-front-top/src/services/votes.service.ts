// src/services/server.service.ts
import type { ServerResponse } from '../types/ServerResponse';


interface Vote {
    id: string,
    server_id: string,
    playerGameName: string,
    voted_at: string
}

export class VoteService {

    static baseUrl = 'http://localhost:3000';

    /**
     * Ottiene un singolo server per nome
     */
    static async checkVote(secret_key: string, playerGameName: string): Promise<Vote> {
        const url = `${VoteService.baseUrl}/vote/${secret_key}/${playerGameName}`;

        try {
            const res = await fetch(url, {
                credentials: 'include',
                headers: { 'Accept': 'application/json'},
            });

            if (!res.ok) {
                // Gestire 404, capire dove gestirli, se a livello di componente o qui
                // sarebbe meglio qui 100%
                throw new Error(`Errore ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('[VoteService] Errore durante checkVote:', error);
            throw error;
        }
    }

    

    static async addVote(server_id: number, playerGameName: string): Promise<Vote> {

        try {
            const res = await fetch(`${VoteService.baseUrl}/vote`, {
              method: "POST",
              credentials: 'include',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({server_id, playerGameName}),
            });

            if(!res.ok) {
                throw new Error(`Return error ${res.status}`);
            }

            const vote = await res.json();
            return vote;

        } catch(err) {
            throw new Error(`[VoteService] Errore durante addVote: ${err}`);
        }
    };


}