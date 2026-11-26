# PromoVista — Smart home, thoughtfully chosen

PromoVista is an advertising and product showcase for smart-home devices: connected home hubs, lighting, security, comfort, and entertainment. Its goal is to make smart-home technology feel useful, welcoming, and easy to explore.

## Pages

- **Home (`index.html`)** — brand introduction, featured product carousel, room inspiration, and links into the collection.
- **Catalog (`catalog.html`)** — illustrated descriptions of the complete device collection, with in-page category navigation.
- **Shop (`shop.html`)** — product cards and the prices from the original project. Prices are illustrative listings and may vary by retailer.
- **Our story (`more.html`)** — owner introduction, project point of view, values, and partner marketplace links.

## Run locally

This is a static HTML site; no build tools or server are required. Open `index.html` in a browser. For local hosting, from the repository folder run:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

HTML uses Tailwind CSS from its browser CDN; the custom design system lives in `site.css`. Smooth scroll is powered by Lenis when the external library is available, with native scrolling as a fallback and reduced-motion support. The carousel controls are implemented in `site.js`.

Product photos use the image files already included in the repository. The retailer links on the story page point to Amazon and Alibaba; this showcase does not process orders or verify live inventory/pricing.
