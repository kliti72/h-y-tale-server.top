import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { generateSecretKey } from '../../helper/generateSecretKey';
import { ServerRepository, type Server } from '../../repository/ServerRepository';
import { SessioneRepository } from '../../repository/SessionRepository';
import { serve } from 'bun';


export function registerServerRoutes(
  app = new Elysia({ prefix: '/api' }),
  db: Database
) {

  //* API FRONTEND
  //
  // ** Insert Server
  // 
  //*
  app.post(
    '/servers',
    async ({ body, set, cookie }) => {
      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);
      console.log("Body arrivato", body);

      const serverSecretKey = generateSecretKey();

      const serverCreated = ServerRepository.put(db, {
        name: body.name,
        ip: body.ip,
        port: body.port,
        tags: body.tags,
        secret_key: serverSecretKey
      });

      console.log("Server creato con id", serverCreated.id);

      // Salva il proprietario
      const insertOwner = db.prepare(`
        INSERT INTO server_owners (server_id, discord_user_id, role)
        VALUES (?, ?, 'owner')
      `);

      if(serverCreated != undefined && user.userId != null) {
        insertOwner.run(serverCreated.id ?? 0, user.userId);
      }

    }, {
    body: t.Object({
      name: t.String(),
      ip: t.String(),
      port: t.String(),
      tags: t.Array(t.String()),
      website: t.String(),
      discord: t.String(),
      banner: t.String(),
      logo_url: t.String(),
      rules: t.String()

    })
  });


  //* API FRONTEND
  //
  // ** return -> data: Server[] 
  // 
  //*
  app.get('/servers', ({}) => {
  const servers = ServerRepository.getAll(db);
    
    return {
      success: true,
      count: servers.length,
      data: servers
    };
  });

  //* API FRONTEND
  //
  // ** return -> data: Server
  // 
  //*
  app.get('/servers/:name', (body) => {
    const serverName = body.params.name;
    const servers = ServerRepository.getByName(db, serverName);
    
    return {
      success: true,
      data: servers
    };
  });


  //* API FRONTEND
  //
  // ** return -> data: Server
  // 
  //*
  app.get(
    '/servers/mine',
    async ({ cookie }) => {

      const sessionId = await SessioneRepository.getSessionIdFromCookie(cookie);
      const user = await SessioneRepository.validateSession(sessionId, db);
      const userID = user.userId ? user.userId : '';

      // Query: tutti i server dove l'utente è owner (o ha un ruolo)
      const servers = ServerRepository.getServersByUserID(userID, db);
      return {
        user: {
          id: user.userId,
        },
        servers: servers,
        count: servers.length
      };
    }
  );

  return app;
}