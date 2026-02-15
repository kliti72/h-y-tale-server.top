import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { generateSecretKey } from '../../helper/generateSecretKey';
import { SessioneRepository } from '../../repository/SessionRepository';
import { VoteRepository } from '../../repository/VoteRepository';
import { ServerRepository } from '../../repository/ServerRepository';

export function registerVoteService(
  app = new Elysia({ prefix: '/vote' }),
  db: Database
) {

  //* API FRONTEND
  //
  // ** Insert Server
  // 
  //*
  app.post(
    '/',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);

      const vote = VoteRepository.put({
        server_id: body.server_id,
        playerGameName:  body.server_id,
        voted_at: new Date().toString()
      }, db);

      return vote;
    
    }, {
    body: t.Object({
      server_id: t.String(),
      playerGameName: t.String(),
    })
  });

  app.get(
    '/check/:secret/:playerGameName',
    async ({ body, set, cookie, params }) => {

    const secret_key = params.secret;
    const playerGameName = params.playerGameName;

      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);
      console.log("Body arrivato", body);

      // Arriva la secret key e playerGameName
      // Verifica se esiste un server con quella secret key
      // Trova il server
      
      const server = ServerRepository.getServerBySecret(secret_key, db);

      // Verifica che esistono voti per quel server
      if(server != null && server.id != undefined) {
        // Verifica che esiste almeno un voto di quel server per quel playerGameName
        const Votes = VoteRepository.getVotes(server.id, playerGameName, db);

        return Votes;
        // per ora ritornare voto per verificare se è tutto corretto

        // Quel player ha un voto sul server che ha richiest
        if(Votes != null) {
          // Verificare la validità della data
        }
      } 
  });

  app.get(
    '/status',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);
      console.log("Body arrivato", body);

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