import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        watch: {
            usePolling: true
        },
        host: true, // Here
        strictPort: true,
        port: 5173
    },
    plugins: [svgr(), react()]
});
