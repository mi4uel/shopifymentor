/* empty css                          */
import { d as createAstro, e as createComponent, r as renderTemplate, l as renderComponent, m as maybeRenderHead } from '../astro_BehGrcX4.mjs';
import { a as getCollection, $ as $$PostCard, b as $$SimpleLayout } from './__C5p8aG7B.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const allPosts = await getCollection("posts");
  allPosts.sort((a, b) => Date.parse(`${b.data.pubDate}`) - Date.parse(`${a.data.pubDate}`));
  return renderTemplate`${renderComponent($$result, "SimpleLayout", $$SimpleLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section> <article class="grid grid-cols-1 md:grid-cols-2 gap-4 "> ${allPosts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "sidebar": false })}`)} </article> </section> ` })}`;
}, "/home/mi4uel/Desktop/shopifyMentor.com/src/pages/index.astro", void 0);

const $$file = "/home/mi4uel/Desktop/shopifyMentor.com/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
