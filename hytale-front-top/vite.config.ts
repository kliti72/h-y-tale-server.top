import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  server: {
    host: true,          // oppure '0.0.0.0' se preferisci esplicito
    port: 80,          // opzionale
    open: false,         // non apre automaticamente il browser sulla VPS
  },
})
