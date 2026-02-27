import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  server: {
    host: true,          // oppure '0.0.0.0' se preferisci esplicito
    port: 5173,          // opzionale
    open: false,         
      allowedHosts: [
      'play.pvpshield.com',      // esatto dominio che usi
      '.pvpshield.com',          // opzionale: permette tutti i subdomain (*.pvpshield.com)
      'h-y-tale-server.top',
      '.h-y-tale-server.top'
    ],
  },

})
