// index.ts
import { Elysia, t } from 'elysia'
import { Database } from 'bun:sqlite'
import { initDatabaseSchema } from './src/storage';
import { cors } from '@elysiajs/cors'
import { registerAuthRoutes } from './src/controller/auth/DiscordAuthController';
import { registerVoteService } from './src/controller/vote/VoteController';
import { seedDatabase } from './src/seedDatabase';
import { registerServerRoutes } from './src/controller/server/server.routes';
import { ConsoleLogWriter } from 'drizzle-orm';
const db = new Database('servers.db', { create: true })

initDatabaseSchema(db);
// seedDatabase(db)

const crossProduction = ['http://h-y-tale-server.top', 'http://www.h-y-tale-server.top', 'https://h-y-tale-server.top', 'https://www.h-y-tale-server.top']
const crossDevelopment = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
var origin = (Bun.env.PRODUCTION === "true") ? crossProduction : crossDevelopment;
var isProduction = (Bun.env.PRODUCTION === "true") ? true : false;

const port = isProduction ? 3000 : 3000
const hostname = isProduction ? '0.0.0.0' : '127.0.0.1'

const app = new Elysia()
  .use(
    cors({ 
      origin: origin,
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', "Authorization"],
      credentials: true,
      maxAge: 86400
    })
  )
  .use(registerAuthRoutes(new Elysia({ prefix: '/auth' }), db))
  .use(registerServerRoutes(new Elysia({ prefix: '/servers' }), db))
  .use(registerVoteService(new Elysia({ prefix: '/vote' }), db))
  .get('/', () => 'API Server operativo')
  .options("/*", () => new Response(null, { status: 204 }))
  .listen({
    port: port,
    hostname: hostname,
  })

console.log("Server accessibile dall'origin:")
origin.forEach((x, w) => { console.log("--", w, "--", x, ": all") })
console.log("Server Online su: ", hostname, ":", port);

