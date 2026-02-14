import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { generateSecretKey } from '../../helper/generateSecretKey';
import { SessioneRepository } from '../../repository/SessionRepository';


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
      console.log("Body arrivato", body);

      const serverSecretKey = generateSecretKey();

      // Aggiunge voto al server 
      // la tabella voti ha playerGameName, server_id (reference a server), data_votazione 
      
      // Per Capire quanti voti ha un server basta fare un sum di server_id e id_server

      // Ritorna voto registrato
    }, {
    body: t.Object({
      playerGameName: t.String(),
      server: t.String(),
    })
  });

  app.get(
    '/check',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);
      console.log("Body arrivato", body);

      // Arrivano, secret_key, playerGameName, data:votazione

      // Trovare il server con la secret_key
      // Verificare che nella tabella voti esiste il voto di playerGameName e che la data votazione sia recente di almeno 24 ore.
      // Ritornare booelena true (voto valido il plugin procedera con darli il premio)
      const serverSecretKey = generateSecretKey();


    }, {
    body: t.Object({
      playerGameName: t.String(),
      server: t.String(),
    })
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