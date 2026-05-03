import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 파일 변경 감지가 안 될 때를 대비한 설정
    watch: {
      usePolling: true,
    },
  },
  // JSX 해석을 강제하는 설정
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
})