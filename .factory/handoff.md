# Handoff — polish round 3 retry 1

## Outcome

**PASS — every finding in reviews 1–3 and the controller evidence review is closed.**

- Product/test repair: `c72cf18b0cbd69f94f59b44f43a7c6ea4ae960f4`
- Evidence candidate deployed and cold-verified: `d556c48356687e29d2973dee4310efe351823f5c`
- Live URL: <https://reading-margin-recall.sociobot.in>
- Work order: `reading-margin-recall-polish-3-retry1`
- Date: 2026-08-29

The botanical field-guide identity is unchanged. The final repair makes `@claim:json-transfer` deterministic. Extension-to-web and web-to-extension each start in a different clean Chromium profile with empty extension and web stores. The extension download must report `complete`, `exists`, matching received and total bytes, and a matching on-disk file size before the test reads it. Both transfers use real file inputs, and the reverse web download is saved to a controlled path before import.

## Finding evidence

`.factory/polish-3.md` maps F-1-1 through F-1-23, F-2-1 through F-2-4, F-3-1 through F-3-2, and controller finding C-3-1 to the implemented change, test, screenshot, and live route.

The first screen says what the product does, who it serves, and what to click. `/?demo=1` opens isolated sample data in one click. Its 390×844 first screen contains the banner, Reset, Exit, sample passage, gloss, source link, and reveal action. Home shows Private, Offline, and Price before either required fold. Titles, metadata, real routes, h1 focus, live announcements, scroll restoration, product-owned 404, legal links, and mobile layout all pass their browser assertions.

## Clean-clone verification

Clean clone `/tmp/rmr-polish3-retry1-clean-8eYs35` at `c72cf18b0cbd69f94f59b44f43a7c6ea4ae960f4`:

- `npm ci`: passed; 145 packages installed.
- All 14 commands in `.factory/claims.json`: passed independently.
- `npm test -- --reporter=line`: 53 passed, 2 intentional project skips, 0 failed.
- `npm run typecheck`: passed.
- `npm run verify:deployment`: passed with a 14,726-byte Manifest V3 ZIP and product-owned 404.
- `npm audit --omit=dev`: zero vulnerabilities.
- `@claim:json-transfer` repeat run: 3 of 3 passed.
- Claim-tag audit: 14 registered IDs and exactly one test tag per ID.

The browser suite covers extension capture, both JSON transfer directions, demo isolation, local-only requests, offline reload, service-worker updates, keyboard review, import validation, storage failures, source safety, routes, metadata, 404 behavior, history, mobile targets, text size, reduced motion, dark mode, and Axe scans.

## Performance and accessibility

- Initial production JS: 27,196 bytes; CSS: 18,779 bytes; mobile hero: 25,872 bytes.
- Local Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 903 ms, LCP 1,504 ms, TBT 20 ms, CLS 0.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 902 ms, LCP 1,052 ms, TBT 11 ms, CLS 0.
- Live URL verifier: 830 ms load, zero browser errors, `lang=en`, one h1, one main, complete image alt text, and named buttons.
- Live route checks found zero serious or critical Axe violations, no target below 44×44 px, no direct text below 16 px, no 200% text overflow, and an effective zero-duration reduced-motion path.

## Deployment and cold verification

`npm run deploy:site` deployed only `dist/site` through the work-order static deployment. `npm run verify:live` passed after deployment. It byte-matched the HTML, hashed JS/CSS, worker, extension ZIP, and build receipt to `d556c48356687e29d2973dee4310efe351823f5c`. The live ZIP is 14,726 bytes with SHA-256 `2d8f11053f80bb4f4fe21bc49f356cc55d2fc4869a54cf3d7721d4028d8ab047`.

Cold browser checks independently confirmed:

- all three Home facts end at 689 px in the 900 px viewport;
- Back restored Home from 815 px to 853 px, focused its h1, and announced the route;
- both exact repaired privacy statements are visible;
- an unknown URL returns HTTP 404 with the correct title and h1;
- the demo reveal action ends at 804 px in the 844 px mobile viewport;
- the demo banner, Reset, Exit, passage, gloss, source, and reveal action are visible;
- no unexpected console or page errors occurred.

Evidence is in `.factory/evidence/polish-3-retry1/`, including local/live screenshots, claim results, URL-verifier reports, Lighthouse JSON, and the live check summary.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run verify:deployment
npm audit --omit=dev
```

Run every `test` command in `.factory/claims.json` separately from a clean clone. For the deployed product, run:

```sh
npm run verify:live
/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in /tmp/rmr-verify-url
```

## Known gaps / next steps

None. The product has no backend, analytics, billing, authentication, AI runtime, or third-party runtime dependency.
