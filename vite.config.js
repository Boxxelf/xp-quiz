import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",        // 相对路径，任何托管平台的子目录都能跑
  build: { outDir: "dist" },
});
