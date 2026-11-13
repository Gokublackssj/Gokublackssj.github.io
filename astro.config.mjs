// @ts-check
import { defineConfig } from "astro/config";
import { existsSync } from "node:fs";

// GitHub Pages user site (repository Gokublackssj.github.io). Not published yet.
export default defineConfig({
  site: "https://gokublackssj.github.io",
  trailingSlash: "always",
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false },
  },
  image: {
    // Screenshots are the only raster images; keep quality high enough for UI text.
    service: { entrypoint: "astro/assets/services/sharp", config: { limitInputPixels: false } },
  },
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
  // Local experiments never become public routes or assets in an Astro build.
  integrations: [{
    name: "local-radial-lab",
    hooks: {
      "astro:config:setup": ({ command, injectRoute }) => {
        if (command === "dev") {
          for (const name of ["radial", "portfolio", "glass"]) {
            if (existsSync(new URL(`./src/lab/${name}.astro`, import.meta.url))) {
              injectRoute({ pattern: `/lab/${name}`, entrypoint: `./src/lab/${name}.astro`, prerender: false });
            }
          }
        }
      },
    },
  }],
});
