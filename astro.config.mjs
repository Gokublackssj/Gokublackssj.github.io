// @ts-check
import { defineConfig } from "astro/config";

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
});
