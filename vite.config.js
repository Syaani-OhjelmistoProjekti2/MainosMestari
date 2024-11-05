import path from "path"
import react from "@vitejs/plugin-react"
import mkcert from'vite-plugin-mkcert'
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
 plugins: [react(), mkcert()],
 resolve: {
   alias: {
     "@": path.resolve(__dirname, "./src"),
   },
   server: {
    https: true,
    host: true
   }
 },
})
