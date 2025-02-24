import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 Allows network access
    port: 5173,
    allowedHosts: ['d08d-74-111-17-171.ngrok-free.app'], // 👈 Add your ngrok domain here
  },
});
