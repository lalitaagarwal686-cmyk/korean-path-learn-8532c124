// Static SPA build for GitHub Pages (no server runtime).
// The normal Lovable build still uses vite.config.ts + nitro.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const base = process.env["PAGES_BASE"] ?? "/korean-path-learn/";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    // Render a static shell and hydrate on the client — no server needed.
    spa: { enabled: true },
    prerender: { enabled: true },
    server: { entry: "server" },
  },
  vite: {
    base,
  },
});
