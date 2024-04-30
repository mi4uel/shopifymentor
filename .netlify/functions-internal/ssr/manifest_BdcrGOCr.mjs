import './chunks/astro_BehGrcX4.mjs';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.6.1_typescript@5.4.5/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"class l extends HTMLElement{posts;container;heading;input;searchIcon;closeIcon;results;debounceTimeout;spinner;constructor(){super(),this.posts=JSON.parse(`${this.dataset.posts}`),this.input=this.querySelector(\"input\"),this.container=this.querySelector(\".search-container\"),this.searchIcon=this.querySelector(\".search-icon\"),this.closeIcon=this.querySelector(\".close-icon\"),this.heading=this.querySelector(\".heading\"),this.results=this.querySelector(\".results\"),this.spinner=this.querySelector(\".spinner\"),this.debounceTimeout=null;const e=this;this.input?.addEventListener(\"input\",function(s){e.debounceTimeout&&clearTimeout(e.debounceTimeout),e.debounceTimeout=setTimeout(()=>{e.handleInput()},1e3)}),this.closeIcon?.addEventListener(\"click\",this.handleClose.bind(this))}handleInput(){if(this.input&&this.input.value&&this.input.value.length>2){this.showResultsBox();const e=this.posts?.filter(t=>t?.data?.title.toLowerCase().includes(this.input?.value));let s=\"\";e&&e?.length>0?e?.map(t=>{let i=\"\";t.data.stack.map(n=>i+=`<li class=\"text-sm text-slate-400\">${n}</li>`),s+=`<div class='p-2 border-2 flex flex-col md:flex-row space-x-4 rounded-lg border-slate-200 bg-slate-50 shrink-0'>\n                  <figure class=\"bg-slate-500 rounded-lg shadow overflow-hidden mb-2 max-h-[100px] flex items-center\">\n                  <Image src=\"${t.data.image.url}\" loading=\"lazy\" height=100 width=100 alt=\"${t.data.title}\" class=\"w-full md:w-[100px] h-full object-cover object-center\"/>\t\n                  </figure>\n                  <div class=\"py-2 \">\n                      <h3 class='text-lg font-semibold'>\n                        <a href=\"/posts/${t.slug}\" class=\"text-slate-800 border-b-2 border-transparent hover:border-slate-950 hover:text-950 cursor-pointer transition-all duration-300\">\"${t.data.title}\"</a></h3>\n                      <div class=\"flex justify-between mb-2\">\n                      <ul class=\"flex space-x-2 \">\n                          ${i}\n                      </ul>\n                      </div> \n                  </div>\n              </div>`}):s=\"<p>No hay resultados</p>\",this.showResultsContent(!0,s);return}this.showResultsContent(!1,\"\")}handleClose(){this.input&&(this.input.value=\"\",this.spinner?.classList.remove(\"hidden\"),this.results.innerHTML=\"\",setTimeout(()=>{this.classList.remove(\"z-10\"),document.querySelector(\".layer\")?.classList.add(\"hidden\"),this.container?.classList.add(\"hidden\"),this.searchIcon?.classList.remove(\"hidden\"),this.closeIcon?.classList.add(\"hidden\"),this.results?.classList.add(\"hidden\"),this.input?.blur()},500))}showResultsBox(){this.spinner?.classList.remove(\"hidden\"),this.heading?.classList.remove(\"hidden\"),this.container?.classList.remove(\"hidden\"),this.searchIcon?.classList.add(\"hidden\"),this.closeIcon?.classList.remove(\"hidden\")}showResultsContent(e,s){e?(document.querySelector(\".layer\")?.classList.remove(\"hidden\"),this.classList.add(\"z-10\"),setTimeout(()=>{this.spinner?.classList.add(\"hidden\"),this.results?.classList.remove(\"hidden\"),this.results.innerHTML=s},700)):(this.classList.remove(\"z-10\"),document.querySelector(\".layer\")?.classList.add(\"hidden\"),setTimeout(()=>{this.container?.classList.add(\"hidden\"),this.spinner?.classList.remove(\"hidden\"),this.results?.classList.add(\"hidden\"),this.results.innerHTML=s},700))}}customElements.define(\"search-input\",l);\n"}],"styles":[{"type":"external","src":"/_astro/index.Db3P1pOI.css"}],"routeData":{"route":"/posts/[...slug]","isIndex":false,"type":"page","pattern":"^\\/posts(?:\\/(.*?))?\\/?$","segments":[[{"content":"posts","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/posts/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"class l extends HTMLElement{posts;container;heading;input;searchIcon;closeIcon;results;debounceTimeout;spinner;constructor(){super(),this.posts=JSON.parse(`${this.dataset.posts}`),this.input=this.querySelector(\"input\"),this.container=this.querySelector(\".search-container\"),this.searchIcon=this.querySelector(\".search-icon\"),this.closeIcon=this.querySelector(\".close-icon\"),this.heading=this.querySelector(\".heading\"),this.results=this.querySelector(\".results\"),this.spinner=this.querySelector(\".spinner\"),this.debounceTimeout=null;const e=this;this.input?.addEventListener(\"input\",function(s){e.debounceTimeout&&clearTimeout(e.debounceTimeout),e.debounceTimeout=setTimeout(()=>{e.handleInput()},1e3)}),this.closeIcon?.addEventListener(\"click\",this.handleClose.bind(this))}handleInput(){if(this.input&&this.input.value&&this.input.value.length>2){this.showResultsBox();const e=this.posts?.filter(t=>t?.data?.title.toLowerCase().includes(this.input?.value));let s=\"\";e&&e?.length>0?e?.map(t=>{let i=\"\";t.data.stack.map(n=>i+=`<li class=\"text-sm text-slate-400\">${n}</li>`),s+=`<div class='p-2 border-2 flex flex-col md:flex-row space-x-4 rounded-lg border-slate-200 bg-slate-50 shrink-0'>\n                  <figure class=\"bg-slate-500 rounded-lg shadow overflow-hidden mb-2 max-h-[100px] flex items-center\">\n                  <Image src=\"${t.data.image.url}\" loading=\"lazy\" height=100 width=100 alt=\"${t.data.title}\" class=\"w-full md:w-[100px] h-full object-cover object-center\"/>\t\n                  </figure>\n                  <div class=\"py-2 \">\n                      <h3 class='text-lg font-semibold'>\n                        <a href=\"/posts/${t.slug}\" class=\"text-slate-800 border-b-2 border-transparent hover:border-slate-950 hover:text-950 cursor-pointer transition-all duration-300\">\"${t.data.title}\"</a></h3>\n                      <div class=\"flex justify-between mb-2\">\n                      <ul class=\"flex space-x-2 \">\n                          ${i}\n                      </ul>\n                      </div> \n                  </div>\n              </div>`}):s=\"<p>No hay resultados</p>\",this.showResultsContent(!0,s);return}this.showResultsContent(!1,\"\")}handleClose(){this.input&&(this.input.value=\"\",this.spinner?.classList.remove(\"hidden\"),this.results.innerHTML=\"\",setTimeout(()=>{this.classList.remove(\"z-10\"),document.querySelector(\".layer\")?.classList.add(\"hidden\"),this.container?.classList.add(\"hidden\"),this.searchIcon?.classList.remove(\"hidden\"),this.closeIcon?.classList.add(\"hidden\"),this.results?.classList.add(\"hidden\"),this.input?.blur()},500))}showResultsBox(){this.spinner?.classList.remove(\"hidden\"),this.heading?.classList.remove(\"hidden\"),this.container?.classList.remove(\"hidden\"),this.searchIcon?.classList.add(\"hidden\"),this.closeIcon?.classList.remove(\"hidden\")}showResultsContent(e,s){e?(document.querySelector(\".layer\")?.classList.remove(\"hidden\"),this.classList.add(\"z-10\"),setTimeout(()=>{this.spinner?.classList.add(\"hidden\"),this.results?.classList.remove(\"hidden\"),this.results.innerHTML=s},700)):(this.classList.remove(\"z-10\"),document.querySelector(\".layer\")?.classList.add(\"hidden\"),setTimeout(()=>{this.container?.classList.add(\"hidden\"),this.spinner?.classList.remove(\"hidden\"),this.results?.classList.add(\"hidden\"),this.results.innerHTML=s},700))}}customElements.define(\"search-input\",l);\n"}],"styles":[{"type":"external","src":"/_astro/index.Db3P1pOI.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/home/mi4uel/Desktop/shopifyMentor.com/src/components/Header.astro",{"propagation":"in-tree","containsHead":false}],["/home/mi4uel/Desktop/shopifyMentor.com/src/layouts/SimpleLayout.astro",{"propagation":"in-tree","containsHead":false}],["/home/mi4uel/Desktop/shopifyMentor.com/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/home/mi4uel/Desktop/shopifyMentor.com/src/pages/posts/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/posts/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/node_modules/.pnpm/astro@4.6.1_typescript@5.4.5/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_BjgL_XlR.mjs","/src/pages/index.astro":"chunks/pages/index_aXL44TCA.mjs","\u0000@astrojs-manifest":"manifest_BdcrGOCr.mjs","\u0000@astro-page:node_modules/.pnpm/astro@4.6.1_typescript@5.4.5/node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_CmlqG2wF.mjs","\u0000@astro-page:src/pages/posts/[...slug]@_@astro":"chunks/_.._yztepr4j.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_C7u6Kel-.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_hydrogen.md?astroContentCollectionEntry=true":"chunks/que_es_hydrogen_BS-OiL0p.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_un_metafield.md?astroContentCollectionEntry=true":"chunks/que_es_un_metafield_B4cH-e-f.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_un_metaobject.md?astroContentCollectionEntry=true":"chunks/que_es_un_metaobject_N-aGbf56.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_hydrogen.md?astroPropagatedAssets":"chunks/que_es_hydrogen_DNd4m0F8.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_un_metafield.md?astroPropagatedAssets":"chunks/que_es_un_metafield_BLV9u7vt.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_un_metaobject.md?astroPropagatedAssets":"chunks/que_es_un_metaobject_DQfFwpWi.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_hydrogen.md":"chunks/que_es_hydrogen_lh7fw0pJ.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_un_metafield.md":"chunks/que_es_un_metafield_BEltsuRt.mjs","/home/mi4uel/Desktop/shopifyMentor.com/src/content/posts/que_es_un_metaobject.md":"chunks/que_es_un_metaobject_3D62TEOV.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.DUuyEdRC.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/hostinger.C-g0QCJu.png","/_astro/index.Db3P1pOI.css","/favicon.svg"],"buildFormat":"directory","checkOrigin":false});

export { manifest };
