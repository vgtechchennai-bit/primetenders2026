# PrimeTender.in — Premium Tailwind Website

## Technology
- HTML5
- Tailwind CSS CDN
- Small custom CSS layer
- Vanilla JavaScript
- Google Apps Script
- Google Sheets

## Pages / sections
- Hero
- Services
- Automation workflow
- Process
- About / CTA
- Enquiry form
- Footer
- Responsive mobile navigation

## Google Sheets connection
1. Create a Google Sheet.
2. Extensions → Apps Script.
3. Paste `Code.gs`.
4. Deploy → New deployment → Web app.
5. Execute as: Me.
6. Set access according to your hosting requirement.
7. Copy the Web App URL.
8. Put it into `config.js`.

The form creates/uses an `Enquiries` sheet with:
Timestamp | Name | Company Name | Mobile / WhatsApp | Email | Service Required | Requirement Details | Status

## Important
This version uses Tailwind through the CDN for easy deployment and editing. For a production build, compile Tailwind locally to remove unused CSS and improve performance.

## Hosting
Works on Netlify, GitHub Pages, any static hosting, or can be adapted into Google Apps Script HTML Service.

## SEO
The DSC content cluster includes `/dsc/`, `/dsc-vendor-chennai/`, `/dsc-purchase-documents/`, and `/dsc-for-e-tendering/`. See [OFF_PAGE_SEO.md](OFF_PAGE_SEO.md) for the legitimate backlink, local listing, review, social distribution and measurement checklist.
