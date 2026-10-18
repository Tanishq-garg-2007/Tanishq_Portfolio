import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          drei: ['@react-three/drei'],
          fiber: ['@react-three/fiber'],
          bvh: ['three-mesh-bvh'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
