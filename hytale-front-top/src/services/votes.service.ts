interface Vote {
    id: string,
    server_id: number,
    playerGameName: string,
    voted_at: string
}

interface Aviable {
    success: boolean,
    wait_time: string,
}


export class VoteService {

    static baseUrl = 'http://localhost:3000';

    /**
     * Ottiene un singolo server per nome
     */
    static async checkVote(secret_key: string, playerGameName: string): Promise<Vote[]> {
        const url = `${VoteService.baseUrl}/vote/check/${secret_key}/${playerGameName}`;

        try {
            const res = await fetch(url, {
                credentials: 'include',
                headers: { 'Accept': 'application/json'},
            });

            if (!res.ok) {
                throw new Error(`Errore ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('[VoteService] Errore durante checkVote:', error);
            throw error;
        }
    }

    // Aggiungi un voto
    static async addVote(discord_user_id : string, server_id: number, playerGameName: string): Promise<Vote> {

        try {
            const res = await fetch(`${VoteService.baseUrl}/vote`, {
              method: "POST",
              credentials: 'include',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({discord_user_id, server_id, playerGameName}),
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

    // Verifica se puoi votare
    static async aviableVote(): Promise<Aviable> {
        try {
            const res = await fetch(`${VoteService.baseUrl}/vote/aviable`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            return await res.json();
        } catch (err) {
            throw new Error(`[VoteService] Errore durante aviableVote: ${err}`);
        }
        
    }



}