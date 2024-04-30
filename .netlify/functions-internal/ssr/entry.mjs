import { renderers } from './renderers.mjs';
import { manifest } from './manifest_BdcrGOCr.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_CmlqG2wF.mjs');
const _page1 = () => import('./chunks/_.._yztepr4j.mjs');
const _page2 = () => import('./chunks/index_C7u6Kel-.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.6.1_typescript@5.4.5/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/posts/[...slug].astro", _page1],
    ["src/pages/index.astro", _page2]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "323621a0-c496-4e90-aba4-ded5f780e83b"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
