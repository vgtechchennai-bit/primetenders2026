# PrimeTenders.in — Tailwind CSS Website

## Service priority
1. Tender management / GeM bidding (`#tender`, `tender-gem-bidding.html`)
2. Web application development (`#webapp`, `web-app-development.html`)
3. DSC vendor (`#dsc`, `class-3-dsc.html` and the DSC guide pages)

## Technology
- HTML5 + Tailwind CSS (CDN). No separate stylesheet: shared component classes live in an inline `<style type="text/tailwindcss">` block (marked COMPONENTS:START/END) in every page. Dark mode uses Tailwind `dark:` variants.
- Vanilla JavaScript (`app.js`), Google Apps Script (`Code.gs`), Google Sheets

## Images (keep in the site root)
- `vg.png` — logo / favicon
- `tender-gem.png` — hero + Tender & GeM section
- `webapp-development.png` — Web App section
- `dsc-class3.png` — DSC section

## Google Sheets connection
1. Create a Google Sheet, then Extensions → Apps Script.
2. Paste `Code.gs`, then Deploy → New deployment → Web app (Execute as: Me, access: Anyone).
3. Put the /exec URL in `config.js`.

The form writes to an `Enquiries` sheet: Timestamp | Name | Company Name | Mobile / WhatsApp | Email | Service Required | Requirement Details | Status

## Production note
Tailwind CDN is fine for simple hosting. For production, compile Tailwind locally to remove unused CSS.

## SEO
Root-level pages suit GitHub Pages / Netlify. Submit `sitemap.xml` in Search Console. See `OFF_PAGE_SEO.md`.
