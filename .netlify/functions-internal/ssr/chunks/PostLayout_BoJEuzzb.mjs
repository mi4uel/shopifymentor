import { d as createAstro, e as createComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute, l as renderComponent, o as renderSlot } from './astro_BehGrcX4.mjs';
import { c as $$Image } from './pages/__BX4OidK2.mjs';

function getShareUrl(platform, url, description) {
  let shareUrl = "";
  let userAgent = "";
  if (typeof window !== "undefined" && window.navigator) {
    userAgent = window.navigator.userAgent || "";
  }
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
  switch (platform) {
    case "facebook":
      if (isMobile) {
        shareUrl = `fb://facewebmodal/f?href=${encodeURIComponent(url)}`;
      } else {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
      }
      break;
    case "reddit":
      if (isMobile) {
        shareUrl = `https://reddit.app.link/?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(description)}`;
      } else {
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(description)}`;
      }
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(description)}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}&summary=${encodeURIComponent(description)}`;
      break;
    case "pinterest":
      shareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
        url
      )}&description=${encodeURIComponent(description)}`;
      break;
    case "whatsapp":
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        description
      )}%20${encodeURIComponent(url)}`;
      break;
    case "email":
      shareUrl = `mailto:?subject=${encodeURIComponent(
        description
      )}&body=${encodeURIComponent(url)}`;
      break;
    default:
      console.error(`Invalid platform: ${platform}`);
      break;
  }
  return shareUrl;
}

const $$Astro$2 = createAstro();
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Icon;
  const { id, size, color } = Astro2.props;
  return renderTemplate`${id == "facebook" && renderTemplate`${maybeRenderHead()}<svg${addAttribute(color, "fill")}${addAttribute(size, "height")}${addAttribute(size, "width")} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-143 145 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M169.5,357.6l-2.9,38.3h-39.3 v133H77.7v-133H51.2v-38.3h26.5v-25.7c0-11.3,0.3-28.8,8.5-39.7c8.7-11.5,20.6-19.3,41.1-19.3c33.4,0,47.4,4.8,47.4,4.8l-6.6,39.2 c0,0-11-3.2-21.3-3.2c-10.3,0-19.5,3.7-19.5,14v29.9H169.5z"></path></g></svg>`}${id == "twitter" && renderTemplate`<svg${addAttribute(color, "fill")}${addAttribute(size, "height")}${addAttribute(size, "width")} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-143 145 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M215.2,361.2 c0.1,2.2,0.1,4.5,0.1,6.8c0,69.5-52.9,149.7-149.7,149.7c-29.7,0-57.4-8.7-80.6-23.6c4.1,0.5,8.3,0.7,12.6,0.7 c24.6,0,47.3-8.4,65.3-22.5c-23-0.4-42.5-15.6-49.1-36.5c3.2,0.6,6.5,0.9,9.9,0.9c4.8,0,9.5-0.6,13.9-1.9 C13.5,430-4.6,408.7-4.6,383.2v-0.6c7.1,3.9,15.2,6.3,23.8,6.6c-14.1-9.4-23.4-25.6-23.4-43.8c0-9.6,2.6-18.7,7.1-26.5 c26,31.9,64.7,52.8,108.4,55c-0.9-3.8-1.4-7.8-1.4-12c0-29,23.6-52.6,52.6-52.6c15.1,0,28.8,6.4,38.4,16.6 c12-2.4,23.2-6.7,33.4-12.8c-3.9,12.3-12.3,22.6-23.1,29.1c10.6-1.3,20.8-4.1,30.2-8.3C234.4,344.5,225.5,353.7,215.2,361.2z"></path></g></svg>`}${id == "linkedin" && renderTemplate`<svg${addAttribute(color, "fill")}${addAttribute(size, "height")}${addAttribute(size, "width")} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-143 145 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M41.4,508.1H-8.5V348.4h49.9 V508.1z M15.1,328.4h-0.4c-18.1,0-29.8-12.2-29.8-27.7c0-15.8,12.1-27.7,30.5-27.7c18.4,0,29.7,11.9,30.1,27.7 C45.6,316.1,33.9,328.4,15.1,328.4z M241,508.1h-56.6v-82.6c0-21.6-8.8-36.4-28.3-36.4c-14.9,0-23.2,10-27,19.6 c-1.4,3.4-1.2,8.2-1.2,13.1v86.3H71.8c0,0,0.7-146.4,0-159.7h56.1v25.1c3.3-11,21.2-26.6,49.8-26.6c35.5,0,63.3,23,63.3,72.4V508.1z "></path></g></svg>`}`;
}, "/home/mi4uel/Desktop/shopifyMentor.com/src/components/Icon.astro", void 0);

const $$Astro$1 = createAstro();
const $$SocialShare = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SocialShare;
  const socialShare = [
    { id: "facebook", color: "#000" },
    { id: "twitter", color: "#000" },
    { id: "linkedin", color: "#000" },
    { id: "pinterest", color: "#000" }
  ];
  return renderTemplate`${maybeRenderHead()}<ul class="flex space-x-4 w-full"> ${socialShare.map(
    (item) => renderTemplate`<li> <a${addAttribute(getShareUrl(`${item.id}`, `${Astro2.url}`, "Check out this blog post!"), "href")} target="_blank" rel="noopener"> ${renderComponent($$result, "Icon", $$Icon, { "id": item.id, "size": "26", "color": item.color })} </a> </li>`
  )} </ul>`;
}, "/home/mi4uel/Desktop/shopifyMentor.com/src/components/SocialShare.astro", void 0);

const $$Astro = createAstro();
const $$PostLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostLayout;
  const { frontmatter } = Astro2.props;
  const img = frontmatter.image.url;
  return renderTemplate`<style>
  .post-content ul, .post-content ol{
    padding: 10px;
    list-style: unset;
    margin: 5px 10px;
  }
  .post-content ul li, .post-content ol li{
    margin-bottom: 10px;
  }
  h2{
    font-size: 1.5rem;
  }
  h1,h2,h3,h4,h5,h6{
    margin-top: 10px;
    font-weight: 700;
    margin-bottom: 10px;
  }
</style>${maybeRenderHead()}<section> <article class=" flex flex-col space-y-4 items-center"> <div class="w-full mb-4 md:mb-8"> <figure class="bg-slate-100 w-full max-h-[400px] overflow-hidden rounded-lg"> ${renderComponent($$result, "Image", $$Image, { "src": img, "loading": "lazy", "height": 400, "width": 400, "class": "w-full object-cover", "alt": frontmatter.title })} </figure> <ul class="flex space-x-2 text-sm text-slate-600 mb-2 mt-4"> ${frontmatter.stack.map((item) => renderTemplate`<li>${item}</li>`)} </ul> <h1 class="text-2xl mb-2 font-semibold">${frontmatter.title}</h1> <h3>${new Date(frontmatter.pubDate).toLocaleString("en-US", { timeZoneName: "short" })}</h3> </div> <div class="col-span-2 mt-8 post-content"> ${renderSlot($$result, $$slots["default"])} </div> ${renderComponent($$result, "SocialShare", $$SocialShare, {})} </article> </section>`;
}, "/home/mi4uel/Desktop/shopifyMentor.com/src/layouts/PostLayout.astro", void 0);

export { $$PostLayout as $ };
