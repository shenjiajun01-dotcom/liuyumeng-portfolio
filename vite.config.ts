import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 项目站点部署在 /liuyumeng-portfolio/ 子路径下，
// 因此生产构建需要以该路径作为 base；本地开发仍使用根路径。
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/liuyumeng-portfolio/" : "/",
  plugins: [react()],
  server: { host: "0.0.0.0" },
}));