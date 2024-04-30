import { defineConfig , passthroughImageService} from 'astro/config';
import netlify from '@astrojs/netlify';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  image: {
    service: passthroughImageService(),
  },
  output: 'server',
  adapter: netlify(),
});