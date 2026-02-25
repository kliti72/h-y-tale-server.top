import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { generateSecretKey } from '../../helper/generateSecretKey';
import { SessioneRepository } from '../../repository/sessionRepository';
import { VoteRepository } from '../../repository/voteRepository';
import { ServerRepository } from '../../repository/serverRepository';

export function registerVoteService(
  app = new Elysia({ prefix: '/vote' }),
  db: Database
) {

  //* API FRONTEND
  //
  // ** GET ALL VOTE
  // 
  //*
  app.get(
    '/',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);

      const votes = VoteRepository.getAll(db);
      return votes;

    }, {
    body: t.Object({
      server_id: t.String(),
      playerGameName: t.String(),
    })
  });


  
  //* API FRONTEND
  //
  // ** INSERT VOTE
  // 
  //*
  app.post(
    '/add',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);

      return VoteRepository.handleVote(db, body.discord_user_id, body.server_id, body.playerGameName);
    }, {
    body: t.Object({
      discord_user_id: t.String(),
      playerGameName: t.String(),
      server_id: t.Number(),
    })
  });

  app.get(
    '/clear',
    async ({ body, set, cookie }) => {
      console.log("Arrivato");
      return VoteRepository.clearAll(db);
    });

    
 app.post(
    '/claim/:secret_key/:playerGameName',
    async ({ params }) => {
        const { secret_key, playerGameName } = params;

        const server = ServerRepository.getServerBySecret(secret_key, db);
        console.log("[CLAIM] server trovato:", server);

        if (!server) {
            return { success: false, message: "Server non trovato" };
        }

        const validVote = db
            .prepare(`
                SELECT id FROM votes 
                WHERE playerGameName = ? 
                AND server_id = ?
                AND voted_at > datetime('now', '-24 hours')
                AND is_claimed = 0
            `)
            .get(playerGameName, server.id ?? 0) as { id: number } | undefined;
        
        console.log("[CLAIM] playerGameName:", playerGameName);
        console.log("[CLAIM] server.id:", server.id);
        console.log("[CLAIM] validVote:", validVote);

        // debug voti raw
        const allVotes = db.prepare(`SELECT * FROM votes WHERE playerGameName = ?`).all(playerGameName);
        console.log("[CLAIM] tutti i voti del player:", allVotes);

        if (!validVote) {
            return { 
                success: false, 
                message: `Devi tornare sul portale h-y-tale-server.top/${server.id} per votare nuovamente`,
                serverId: server.id
            };
        }

        db.prepare(`UPDATE votes SET is_claimed = 1 WHERE id = ?`).run(validVote.id);
        return { success: true, message: "Voto ritirato con successo", serverId: server.id };
    }
);

  app.get(
    '/check/:discordId',
    async ({ params }) => {
      const { discordId } = params;

      const user = db
        .prepare(`SELECT last_vote_at FROM discord_users WHERE id = ?`)
        .get(discordId) as { last_vote_at: string | null } | undefined;

      if (!user?.last_vote_at) {
        return { success: true, canVote: true };
      }

      const hoursDiff = (new Date().getTime() - new Date(user.last_vote_at).getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return { success: true, canVote: false, message: `Riprova tra ${Math.ceil(24 - hoursDiff)} ore.` };
      }

      return { success: true, canVote: true };
    }
  );

  app.get(
    '/status',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);

      const serverSecretKey = generateSecretKey();

      // Riceve secret_key, verifica che esista un server con quel secret_key
      // Trova il server con la secret_key

      // Aggiorna i server_stats che ha una foregin key con id_server

      // Riceve: players_online, max_player, status, tps e last_updated
      // Aggiorna

    }, {
    body: t.Object({
      playerGameName: t.String(),
      server: t.String(),
    })
  });


  return app;
}