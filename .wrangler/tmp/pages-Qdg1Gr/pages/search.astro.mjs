globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, b as renderTemplate, g as defineScriptVars, r as renderComponent, d as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_DSZs3x4S.mjs';
import { $ as $$Icon, a as $$BaseLayout } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { $ as $$HeroSection } from '../chunks/HeroSection_Du39SrCP.mjs';
import { $ as $$Badge } from '../chunks/Badge_DvOoDIg_.mjs';
/* empty css                                  */
import { g as getCollection } from '../chunks/_astro_content_D40xraF-.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://yourdomain.com");
const $$SearchResults = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SearchResults;
  function topicHue(str) {
    let hash = 0;
    for (const ch of str.toLowerCase()) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
    return (hash * 2654435079 % 360 + 360) % 360;
  }
  const {
    searchableContent,
    quickLinks = [
      { href: "/assets", icon: "package-fill", title: "Tools & Resources", description: "Practical resources for your journey" },
      { href: "/insights", icon: "book-open-fill", title: "Insights & Articles", description: "Thoughtful perspectives and guides" },
      { href: "/services", icon: "users-fill", title: "For Professionals", description: "Resources for therapists and coaches" },
      { href: "/projects", icon: "stack-fill", title: "Projects", description: "Our ongoing and completed work" }
    ],
    badgeCategories = ["Insight", "Resource", "Project", "Presentation", "Page", "Service"]
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["<!-- Quick Links Section -->", '<section class="quick-links" id="quickLinks"> <div class="quick-links__container container"> <div class="quick-links__grid"> ', ' </div> </div> </section> <!-- Pre-rendered Badge templates for client-side search results --> <div id="badge-templates" hidden> ', ' </div> <!-- Search Results Section --> <section class="search-results" id="searchResults"> <div class="search-results__container container"> <div class="search-results__header"> <h2 class="search-results__title"> <span id="resultsCount">0</span> Results\n</h2> <p class="search-results__query">for <span id="searchQuery"></span></p> </div> <div class="search-results__grid" id="resultsList"> <!-- Results populated by JavaScript --> </div> <!-- No Results --> <div class="no-results" id="noResults"> <div class="no-results__icon"> ', ' </div> <h3 class="no-results__title">No results found</h3> <p class="no-results__text">Try a different search term or browse our categories above</p> </div> </div> </section>  <script>(function(){', `
  // Search functionality - proper singleton with cleanup
  (function() {
    class SearchPage {
      constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.clearBtn = document.getElementById('clearSearch');
        this.quickLinks = document.getElementById('quickLinks');
        this.searchResults = document.getElementById('searchResults');
        this.resultsList = document.getElementById('resultsList');
        this.noResults = document.getElementById('noResults');
        this.resultsCount = document.getElementById('resultsCount');
        this.searchQuery = document.getElementById('searchQuery');

        this.content = JSON.parse(searchableContent);

        // Build badge template map from pre-rendered Badge components
        this.badgeTemplates = {};
        this.topicHues = {};
        document.querySelectorAll('#badge-templates [data-badge-cat]').forEach(el => {
          this.badgeTemplates[el.dataset.badgeCat] = el.innerHTML;
          this.topicHues[el.dataset.badgeCat] = el.dataset.topicHue;
        });

        // Bind handlers so we can remove them later
        this.handleInputBound = this.handleInput.bind(this);
        this.handleClearBound = this.handleClear.bind(this);

        this.init();
      }

      destroy() {
        this.searchInput?.removeEventListener('input', this.handleInputBound);
        this.clearBtn?.removeEventListener('click', this.handleClearBound);
      }

      init() {
        // Search input handler
        this.searchInput?.addEventListener('input', this.handleInputBound);

        // Clear button
        this.clearBtn?.addEventListener('click', this.handleClearBound);

        // Check URL for search query
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query && this.searchInput) {
          this.searchInput.value = query;
          this.handleSearch(query);
        }
      }

      handleInput(e) {
        this.handleSearch(e.target.value);
      }

      handleClear() {
        if (this.searchInput) {
          this.searchInput.value = '';
          this.searchInput.focus();
          this.handleSearch('');
        }
      }

      handleSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();

        // Show/hide clear button
        if (this.clearBtn) {
          this.clearBtn.classList.toggle('show', !!trimmedQuery);
        }

        if (!trimmedQuery) {
          // Show quick links, hide results
          if (this.quickLinks) this.quickLinks.style.display = 'block';
          if (this.searchResults) this.searchResults.classList.remove('show');
          return;
        }

        // Hide quick links, show results section
        if (this.quickLinks) this.quickLinks.style.display = 'none';
        if (this.searchResults) this.searchResults.classList.add('show');

        // Update query display
        if (this.searchQuery) this.searchQuery.textContent = query;

        // Filter content
        const results = this.content.filter(item =>
          item.title.toLowerCase().includes(trimmedQuery) ||
          item.description.toLowerCase().includes(trimmedQuery) ||
          item.category.toLowerCase().includes(trimmedQuery)
        );

        this.renderResults(results);
      }

      getIconForCategory(category) {
        const icons = {
          'Insight': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.5C39.74,56.83,78.26,17.15,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.64,71.64,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h24V147.31L90.34,117.66a8,8,0,0,1,11.32-11.32L128,132.69l26.34-26.35a8,8,0,0,1,11.32,11.32L136,147.31V192h24v-6a32.12,32.12,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Z"/></svg>',
          'Page': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/></svg>',
          'Resource': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Z"/></svg>',
          'Service': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/></svg>',
          'Project': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M200,32H56A24,24,0,0,0,32,56V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Zm8,168a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V104H208Zm0-112H48V56a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Z"/></svg>',
          'Presentation': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219.12a8,8,0,1,0,12.5,10l29.59-37.12H156.16l29.59,37.12a8,8,0,1,0,12.5-10L176.64,192H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216Z"/></svg>',
        };
        return icons[category] || icons['Page'];
      }

      renderResults(results) {
        if (!this.resultsList || !this.noResults || !this.resultsCount) return;

        this.resultsCount.textContent = results.length;

        if (results.length === 0) {
          this.resultsList.innerHTML = '';
          this.noResults.classList.add('show');
          return;
        }

        this.noResults.classList.remove('show');

        // Build HTML string with proper CSS classes
        let html = '';
        results.forEach(item => {
          const categorySlug = item.category.toLowerCase();
          const iconSvg = this.getIconForCategory(item.category);

          const badgeHtml = this.badgeTemplates[categorySlug] || \`<span class="result-card__badge">\${item.category}</span>\`;
          const hue = this.topicHues[categorySlug] || '0';

          html += \`
            <a href="\${item.url}" class="card result-card" style="--topic-hue: \${hue}">
              <div class="result-card__badge-wrap">\${badgeHtml}</div>
              <div class="result-card__icon">
                \${iconSvg}
              </div>
              <h3 class="result-card__title">\${item.title}</h3>
              <p class="result-card__desc">\${item.description}</p>
            </a>
          \`;
        });

        this.resultsList.innerHTML = html;
      }
    }

    // Initialize with proper cleanup
    function initSearch() {
      if (!document.getElementById('searchInput')) return;

      // Destroy previous instance if exists
      if (window.__searchPageInstance) {
        window.__searchPageInstance.destroy();
      }

      // Create new instance
      window.__searchPageInstance = new SearchPage();
    }

    // Run on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSearch);
    } else {
      initSearch();
    }

    // For Astro page transitions
    document.addEventListener('astro:page-load', initSearch);
  })();
})();<\/script>`], ["<!-- Quick Links Section -->", '<section class="quick-links" id="quickLinks"> <div class="quick-links__container container"> <div class="quick-links__grid"> ', ' </div> </div> </section> <!-- Pre-rendered Badge templates for client-side search results --> <div id="badge-templates" hidden> ', ' </div> <!-- Search Results Section --> <section class="search-results" id="searchResults"> <div class="search-results__container container"> <div class="search-results__header"> <h2 class="search-results__title"> <span id="resultsCount">0</span> Results\n</h2> <p class="search-results__query">for <span id="searchQuery"></span></p> </div> <div class="search-results__grid" id="resultsList"> <!-- Results populated by JavaScript --> </div> <!-- No Results --> <div class="no-results" id="noResults"> <div class="no-results__icon"> ', ' </div> <h3 class="no-results__title">No results found</h3> <p class="no-results__text">Try a different search term or browse our categories above</p> </div> </div> </section>  <script>(function(){', `
  // Search functionality - proper singleton with cleanup
  (function() {
    class SearchPage {
      constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.clearBtn = document.getElementById('clearSearch');
        this.quickLinks = document.getElementById('quickLinks');
        this.searchResults = document.getElementById('searchResults');
        this.resultsList = document.getElementById('resultsList');
        this.noResults = document.getElementById('noResults');
        this.resultsCount = document.getElementById('resultsCount');
        this.searchQuery = document.getElementById('searchQuery');

        this.content = JSON.parse(searchableContent);

        // Build badge template map from pre-rendered Badge components
        this.badgeTemplates = {};
        this.topicHues = {};
        document.querySelectorAll('#badge-templates [data-badge-cat]').forEach(el => {
          this.badgeTemplates[el.dataset.badgeCat] = el.innerHTML;
          this.topicHues[el.dataset.badgeCat] = el.dataset.topicHue;
        });

        // Bind handlers so we can remove them later
        this.handleInputBound = this.handleInput.bind(this);
        this.handleClearBound = this.handleClear.bind(this);

        this.init();
      }

      destroy() {
        this.searchInput?.removeEventListener('input', this.handleInputBound);
        this.clearBtn?.removeEventListener('click', this.handleClearBound);
      }

      init() {
        // Search input handler
        this.searchInput?.addEventListener('input', this.handleInputBound);

        // Clear button
        this.clearBtn?.addEventListener('click', this.handleClearBound);

        // Check URL for search query
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query && this.searchInput) {
          this.searchInput.value = query;
          this.handleSearch(query);
        }
      }

      handleInput(e) {
        this.handleSearch(e.target.value);
      }

      handleClear() {
        if (this.searchInput) {
          this.searchInput.value = '';
          this.searchInput.focus();
          this.handleSearch('');
        }
      }

      handleSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();

        // Show/hide clear button
        if (this.clearBtn) {
          this.clearBtn.classList.toggle('show', !!trimmedQuery);
        }

        if (!trimmedQuery) {
          // Show quick links, hide results
          if (this.quickLinks) this.quickLinks.style.display = 'block';
          if (this.searchResults) this.searchResults.classList.remove('show');
          return;
        }

        // Hide quick links, show results section
        if (this.quickLinks) this.quickLinks.style.display = 'none';
        if (this.searchResults) this.searchResults.classList.add('show');

        // Update query display
        if (this.searchQuery) this.searchQuery.textContent = query;

        // Filter content
        const results = this.content.filter(item =>
          item.title.toLowerCase().includes(trimmedQuery) ||
          item.description.toLowerCase().includes(trimmedQuery) ||
          item.category.toLowerCase().includes(trimmedQuery)
        );

        this.renderResults(results);
      }

      getIconForCategory(category) {
        const icons = {
          'Insight': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.5C39.74,56.83,78.26,17.15,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.64,71.64,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h24V147.31L90.34,117.66a8,8,0,0,1,11.32-11.32L128,132.69l26.34-26.35a8,8,0,0,1,11.32,11.32L136,147.31V192h24v-6a32.12,32.12,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Z"/></svg>',
          'Page': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"/></svg>',
          'Resource': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Z"/></svg>',
          'Service': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/></svg>',
          'Project': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M200,32H56A24,24,0,0,0,32,56V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Zm8,168a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V104H208Zm0-112H48V56a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Z"/></svg>',
          'Presentation': '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219.12a8,8,0,1,0,12.5,10l29.59-37.12H156.16l29.59,37.12a8,8,0,1,0,12.5-10L176.64,192H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216Z"/></svg>',
        };
        return icons[category] || icons['Page'];
      }

      renderResults(results) {
        if (!this.resultsList || !this.noResults || !this.resultsCount) return;

        this.resultsCount.textContent = results.length;

        if (results.length === 0) {
          this.resultsList.innerHTML = '';
          this.noResults.classList.add('show');
          return;
        }

        this.noResults.classList.remove('show');

        // Build HTML string with proper CSS classes
        let html = '';
        results.forEach(item => {
          const categorySlug = item.category.toLowerCase();
          const iconSvg = this.getIconForCategory(item.category);

          const badgeHtml = this.badgeTemplates[categorySlug] || \\\`<span class="result-card__badge">\\\${item.category}</span>\\\`;
          const hue = this.topicHues[categorySlug] || '0';

          html += \\\`
            <a href="\\\${item.url}" class="card result-card" style="--topic-hue: \\\${hue}">
              <div class="result-card__badge-wrap">\\\${badgeHtml}</div>
              <div class="result-card__icon">
                \\\${iconSvg}
              </div>
              <h3 class="result-card__title">\\\${item.title}</h3>
              <p class="result-card__desc">\\\${item.description}</p>
            </a>
          \\\`;
        });

        this.resultsList.innerHTML = html;
      }
    }

    // Initialize with proper cleanup
    function initSearch() {
      if (!document.getElementById('searchInput')) return;

      // Destroy previous instance if exists
      if (window.__searchPageInstance) {
        window.__searchPageInstance.destroy();
      }

      // Create new instance
      window.__searchPageInstance = new SearchPage();
    }

    // Run on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSearch);
    } else {
      initSearch();
    }

    // For Astro page transitions
    document.addEventListener('astro:page-load', initSearch);
  })();
})();<\/script>`])), maybeRenderHead(), quickLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="card quick-link-card"> <div class="quick-link-card__icon"> ${renderComponent($$result, "Icon", $$Icon, { "name": link.icon, "size": 48 })} </div> <h3 class="quick-link-card__title">${link.title}</h3> <p class="quick-link-card__desc">${link.description}</p> </a>`), badgeCategories.map((cat) => renderTemplate`<div${addAttribute(cat.toLowerCase(), "data-badge-cat")}${addAttribute(topicHue(cat), "data-topic-hue")}> ${renderComponent($$result, "Badge", $$Badge, { "label": cat, "shape": "pill", "variant": "fill" })} </div>`), renderComponent($$result, "Icon", $$Icon, { "name": "magnifying-glass-fill", "size": 64 }), defineScriptVars({ searchableContent: JSON.stringify(searchableContent) }));
}, "C:/Users/Business/Website v2.36/src/components/organisms/search/SearchResults.astro", void 0);

const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const allInsights = await getCollection("insights");
  const allAssets = await getCollection("assets");
  const allProjects = await getCollection("projects");
  const allPresentations = await getCollection("presentations");
  const getSlug = (id) => {
    const normalized = id.replace(/[\\/]index\.md$/, "");
    return normalized.split(/[\\/]/).pop() || id;
  };
  const searchableContent = [
    // Insights collection
    ...allInsights.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description || "",
      url: `/insights/${getSlug(entry.id)}`,
      category: "Insight",
      image: entry.data.cardImage?.src || null
    })),
    // Assets collection
    ...allAssets.map((entry) => ({
      title: entry.data.name,
      description: entry.data.description || "",
      url: `/assets/${getSlug(entry.id)}`,
      category: "Resource",
      type: entry.data.type,
      image: entry.data.cardImage?.src || null
    })),
    // Projects collection
    ...allProjects.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description || "",
      url: `/projects/${getSlug(entry.id)}`,
      category: "Project",
      image: entry.data.cardImage?.src || null
    })),
    // Presentations collection
    ...allPresentations.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description || "",
      url: `/presentations/${getSlug(entry.id)}`,
      category: "Presentation",
      image: entry.data.cardImage?.src || null
    })),
    // Static pages
    { title: "About Us", description: "Learn about Walking With A Smile and our mission.", url: "/about", category: "Page", image: null },
    { title: "Contact", description: "Get in touch with our team.", url: "/contact", category: "Page", image: null },
    { title: "Tools & Resources", description: "Browse our collection of resources.", url: "/assets", category: "Page", image: null },
    { title: "Insights & Articles", description: "Thoughtful perspectives and guides.", url: "/insights", category: "Page", image: null },
    { title: "For Professionals", description: "Resources for therapists and coaches.", url: "/services", category: "Service", image: null },
    { title: "Projects", description: "Our ongoing and completed work.", url: "/projects", category: "Page", image: null }
  ];
  const pageTitle = "Search";
  const pageDescription = "Search our resources, insights, tools, and more.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="search-page"> ${renderComponent($$result2, "HeroSection", $$HeroSection, { "variant": "gradient", "gradient": "primary", "alignment": "center", "pattern": true, "title": `Find what you're <span class="search-hero__highlight">looking for</span>` }, { "default": async ($$result3) => renderTemplate` <div class="search-input-wrapper"> <span class="search-input__icon"> ${renderComponent($$result3, "Icon", $$Icon, { "name": "magnifying-glass-fill", "size": 28 })} </span> <input type="text" id="searchInput" class="search-input" placeholder="Type to search..." autocomplete="off" autofocus> <button id="clearSearch" class="search-input__clear" aria-label="Clear search"> ${renderComponent($$result3, "Icon", $$Icon, { "name": "x-circle-fill", "size": 20 })} </button> </div> ` })} ${renderComponent($$result2, "SearchResults", $$SearchResults, { "searchableContent": searchableContent })} </main> ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/search.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
