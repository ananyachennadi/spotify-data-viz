import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '..', 'flask-server', 'certs', 'localhost+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '..', 'flask-server', 'certs', 'localhost+1.pem')),
    },
    host: '127.0.0.1',
    port: 5173,
  }
})