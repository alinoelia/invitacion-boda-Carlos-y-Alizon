import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // 👇 CAMBIA "nombre-de-tu-repo" por el nombre real de tu repositorio en GitHub
  base: '/Invitacion-charlizon/', 
  plugins: [react()],
})