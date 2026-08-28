# Handoff — Reading Margin Recall

## What was built

- A WXT + TypeScript Manifest V3 extension. Selecting page text shows a **Save passage** control. The capture dialog records the passage, gloss, hidden word, page title, and source URL in extension-local storage.
- An extension popup for cloze review, keyboard grading (`Space`, then `1–4`), source return, review scheduling, and deletion.
- A local PWA with manual capture, source-linked review, JSON export/import, empty and error states, offline support, responsive 390 px layouts, light/dark treatments, and a styled 404 route.
- A one-click `/demo` with three public-domain language examples. It uses only `demo:rmr:*` keys and deletes them when the user starts for real.
- Study Edition at $12 once. Sociobot checkout, license restore and verification, revoked-license notice, and paid review filters are implemented. Core capture, review, source links, accessibility, and backup remain free.
- Privacy and terms pages, metadata, a sitemap, PWA files, security headers, documentation, and original botanical artwork with recorded provenance.

## Build and verification

```sh
npm install
npm run typecheck
npm test
npm run build
```

The deploy root is `dist/site`, with `index.html` at its root. The packaged extension is `dist/site/downloads/reading-margin-recall-chrome.zip`. The unpacked MV3 build is `.output/chrome-mv3`.

Verified on 2026-08-28:

- `npm run typecheck`: pass.
- `npm test`: 28 passed, 1 intentional skip. The skip is the extension test in the mobile web project; it passes in Chromium with the built extension loaded.
- Claim tests cover capture, source links, selection boundaries, demo isolation, same-origin privacy, offline reload, JSON export/import, keyboard review, and paid features.
- Axe found no serious or critical violations across every route and the dark treatment.
- `/opt/fleet/lib/verify-url.sh`: pass. Local load was 585 ms, with no console errors.
- Lighthouse 12.8.2 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100. FCP 1.0 s, LCP 1.6 s, TBT 90 ms, CLS 0.
- Initial site bundle: 9.09 KB JS gzip and 4.54 KB CSS gzip. Hero WebP: 108 KB desktop and 28 KB mobile. Extension zip: 14 KB.
- `npm audit --omit=dev`: 0 production vulnerabilities.

## Known gaps and next steps

- The extension and PWA have separate browser-local stores because web origins cannot read extension storage. Both workflows are complete; use JSON export/import when moving a collection between browsers.
- The factory must register `reading-margin-recall` with Sociobot billing before checkout can sell a live license. No product ID or secret is embedded.
- Store signing, browser-store submission, deployment, DNS, and billing configuration remain factory operations.
- Device sync, OCR, automatic translation, ebook-store access, and scraped libraries remain intentional non-goals.
