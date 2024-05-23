import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import { qrcode } from "vite-plugin-qrcode"
import rune from "vite-plugin-rune"
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Makes paths relative
  plugins: [
    wasm(),
    qrcode(), // only applies in dev mode
    react(),
    rune({
      logicPath: path.resolve("./src/logic/logic.ts"),
      minifyLogic: false, // This flag can be used if your logic reaches the allowed limit. However, it will make it significantly more difficult to detect validation issues
      ignoredDependencies: [],
    }),
  ],
})
