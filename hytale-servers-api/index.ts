// index.ts
import { Elysia, t } from 'elysia'
import { Database } from 'bun:sqlite'
import { registerServerRoutes } from './src/api/server/server';
import { __init__database__ } from './src/storage';
import { cors } from '@elysiajs/cors'
import { registerAuthRoutes } from './src/api/auth/auth';

const env = require('dotenv').config();
const db = new Database('servers.db', { create: true })

// Create database and prepare with mock data
__init__database__(db);


const app = new Elysia()
  .use(
     cors({
        origin: 'http://localhost:5173',          // esatto origin del tuo frontend (Vite)
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
        credentials: true,                        // se userai cookie/auth dopo
        maxAge: 86400                             // cache preflight
      })
  )
  .use(registerAuthRoutes(new Elysia({ prefix: '/auth' }), db))
  .use(registerServerRoutes(new Elysia({ prefix: '/api' }), db))
  .get('/', () => 'API Server operativo')
  .options("/*", () => new Response(null, {status: 204}))
  .listen(3000);


console.log('🚀 Server su http://localhost:3000')