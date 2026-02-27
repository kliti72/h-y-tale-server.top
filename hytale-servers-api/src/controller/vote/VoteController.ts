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

   app.get(
    '/test',
    async ({ body, set, cookie }) => {
      return {test: "ok deploy2"};
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
    if (!server) {
      return { success: false, status: -1, message: "Server non trovato" };
    }

    // Mai votato
    const anyVote = db
      .prepare(`SELECT voted_at FROM votes WHERE playerGameName = ? AND server_id = ? ORDER BY voted_at DESC LIMIT 1`)
      .get(playerGameName, server.id ?? 0) as { voted_at: string } | undefined;

    if (!anyVote) {
      return { success: false, status: 0, serverId: server.id };
    }

    // Voto valido non ancora claimato
    const validVote = db
      .prepare(`
        SELECT id, voted_at FROM votes
        WHERE playerGameName = ?
        AND server_id = ?
        AND voted_at > datetime('now', '-24 hours')
        AND is_claimed = 0
      `)
      .get(playerGameName, server.id ?? 0) as { id: number; voted_at: string } | undefined;

    // Ha votato ma deve aspettare
    if (!validVote) {
      const lastVote = new Date(anyVote.voted_at + "Z").getTime();
      const nextVote = lastVote + 24 * 60 * 60 * 1000;
      const time_to_wait = Math.max(0, Math.ceil((nextVote - Date.now()) / 1000 / 60)); // minuti

      return { success: false, status: 1, serverId: server.id, time_to_wait };
    }

    db.prepare(`UPDATE votes SET is_claimed = 1 WHERE id = ?`).run(validVote.id);
    return { success: true, status: 2, serverId: server.id, serverName: server.name, voti_totali: server.voti_totali};
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