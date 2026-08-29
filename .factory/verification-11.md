# Independent verification 11 — PASS

**Date:** 2026-08-29

**Candidate:** `e8bdb6492cf0e261e0879fe893d734b1b538ffe9`

**Live URL:** <https://reading-margin-recall.sociobot.in>
**Verdict:** **PASS — release candidate accepted.**

Fresh evidence confirms that the deployed browser extension and local PWA match the candidate and complete the brief's source-linked capture and recall job. No P0–P3 product defect was found.

## Mandatory release gates

### Claims contract

`.factory/claims.json` exists and declares 16 claims. After `npm ci`, I ran every declared `test` command separately from this clean checkout. Every command rebuilt the production site and exercised its tagged test through the demo entry point; all exited 0.

| Claim | Result | Observable proof |
| --- | --- | --- |
| `source-linked-capture` | PASS | Saved passage, learner gloss, deletion, title, and source URL. |
| `extension-selection` | PASS | A fresh Chromium extension profile captured only the selected sentence. |
| `demo-isolated` | PASS | Reset/exit removed demo data and preserved seeded real data. |
| `local-only` | PASS | Capture, review, export, reset, exit, and color settings stayed local and same-origin. |
| `no-tracking` | PASS | Public routes and a full demo flow loaded no tracking signal, cookie, beacon, or third-party request. |
| `pwa-installable` | PASS | Standalone manifest, required icons, `/library` start URL, and controlling worker verified. |
| `offline-reload` | PASS | A fresh demo context reloaded offline with all three notes. |
| `json-backup` | PASS | Export contained all three notes and import restored the backup. |
| `keyboard-review` | PASS | Space revealed the answer; a number key graded it. |
| `free-tools` | PASS | Capture, review, source, and backup tools had no account, billing, or license gate. |
| `review-filters` | PASS | Difficult and source filters returned only matching notes. |
| `json-transfer` | PASS | Fresh web and extension profiles transferred backups in both directions. |
| `delete-notes` | PASS | Confirmed deletion removed the note from UI and storage. |
| `site-data-boundary` | PASS | Clearing web storage left extension storage intact. |
| `extension-download` | PASS | Public ZIP was non-empty, valid, and Manifest V3. |
| `http-source-links` | PASS | A `javascript:` URL produced an accessible error and no executable link. |

The live landing page, legal pages, and README claims map to these entries. I found no material unlisted product claim.

### Cold first read

**PASS.** A fresh, service-worker-free desktop context showed all required answers without scrolling:

- What: **“Save passages for later recall.”**
- For whom: language learners turning selected sentences into source-linked review notes.
- First action: **“Try it with sample data.”**

That one click opened `/?demo=1`, immediately showing three French, German, and Spanish notes. Its persistent banner states **“Demo — sample data, nothing is saved”** and provides **Reset demo** and **Exit demo and use my notes**. At 390×844, the headline, audience sentence, action, explanatory note, and three plain facts were all in the first viewport; the primary action began at y=433 px.

## Clean-checkout results

| Check | Result |
| --- | --- |
| Checkout identity | PASS — initial `HEAD` was exactly the candidate and the tracked tree was clean. |
| `npm ci` | PASS — 145 packages installed; 0 vulnerabilities reported. |
| All 16 claim commands | PASS — each invoked separately, 0 failures. |
| `npm test` | PASS — 55 passed, 2 intentional mobile-project skips, 0 failed in 1.4 minutes. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — created `dist/site` and the MV3 ZIP. |
| `npm run verify:deployment` | PASS — deploy root, receipt, 404, and package verified. |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities. |
| Lint | N/A — no lint script or lint configuration exists. |

The full suite covers desktop and 390 px mobile routes, extension capture and transfer, invalid and atomic imports, unavailable storage, route metadata/history/focus, dark mode, reduced motion, target sizes, 200% text, service-worker update, offline reload, and deployment assembly.

## Independent live product exercise

- Started with three isolated sample notes. An empty submission did not alter storage and focused the first required field.
- Entered Unicode passage `À bientôt — déjà.` with its gloss and deletion. A `javascript:alert(1)` source was rejected with “must start with http:// or https://”; correcting it to HTTPS saved the fourth note and preserved the Unicode text.
- Demo storage contained only `demo:rmr:notes`; no `rmr:notes` real-data key was created.
- Deleted the new note after confirmation, then used **Undo** to restore it. **Reset demo** restored exactly the three bundled samples.
- Imported a structurally invalid JSON backup. The app announced that no notes changed and retained all three samples.
- Exported JSON parsed as version 1 and contained all three notes.
- On Review, Space revealed the hidden word and key 4 persisted the grade and incremented the review count.
- A fresh link crawl returned 200 for every same-origin page/download and for the three bundled public sources plus Param Factory; `mailto:` links were correctly exempt.
- No account, payment, AI, OCR, translation, scraped library, or content-hosting behavior appeared. This matches the brief's boundaries.

The repository-owned `npm run verify:live` independently passed candidate receipt, byte matching, download, 404, headers, request privacy, desktop flow, keyboard use, offline reload, worker update, mobile baselines, and Axe checks.

## Deployment identity and package

- `/build-info.json` names candidate `e8bdb6492cf0e261e0879fe893d734b1b538ffe9`; `origin/main` names the same commit.
- Live `index.html`, hashed JS/CSS, service worker, and extension ZIP byte-match the local production build.
- Extension: Manifest V3; 14,726 bytes; SHA-256 `2d8f11053f80bb4f4fe21bc49f356cc55d2fc4869a54cf3d7721d4028d8ab047`; served as `application/zip`.
- The live unknown-path response is the product-owned 404 with HTTP 404 and `noindex` metadata.

## Privacy and network evidence

The independent capture/recovery/export/review/route/offline flow recorded 35 browser requests. Their only origin was `https://reading-margin-recall.sociobot.in`; there were no failed requests, cookies, beacons, analytics calls, or page errors. Standard product routes produced no console errors. The sole console message in the combined route crawl was Chromium's expected failed-resource message for the deliberately requested HTTP 404.

The live document sends:

- self-only CSP including `frame-ancestors 'none'` and `connect-src 'self'`;
- HSTS with one-year max age and subdomains;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- camera, microphone, and geolocation denied by Permissions Policy.

This is a static PWA plus extension. It has no product API, unlock call, backend, or sign-in. API allowance/429/`Retry-After`, concurrency, backend persistence/health identity, and Entra authority checks are therefore **not applicable**; observed request allowance: **N/A**.

## PWA, accessibility, responsive behavior

- Service worker was active at `/sw.js`, an explicit update left no waiting worker, and a demo reload while offline retained three notes and exposed the offline state.
- Fresh Playwright Axe scans found 0 serious/critical violations on home, demo, empty library, review, privacy, terms, live 404, dark mode, and the 390 px demo.
- `verify-url.sh` passed in 615 ms: title present, `lang=en`, one `h1`, `main`, no missing image alt, no unlabeled button, and no console errors.
- First Tab focused the skip link with a 3 px amber outline; Enter moved focus to `main`. Space and keys 1–4 operated review.
- At 390 px, `scrollWidth === clientWidth === 390`. Controls meet the tested 44×44 px minimum, text meets 16 px, and the suite passes at 200% text.
- Reduced-motion emulation reduced transition and animation durations to `0.00001s`. Nothing loops or flashes.

## Headers, caching, and performance

| Resource | Live cache policy | Size |
| --- | --- | ---: |
| HTML | `public, must-revalidate, max-age=30` | 1,986 B |
| Hashed JS | `public, max-age=31536000, immutable` | 27,223 B raw / 9,372 B gzip locally |
| Hashed CSS | `public, max-age=31536000, immutable` | 18,779 B raw / 4,837 B gzip locally |
| Mobile hero | immutable | 25,872 B |
| Desktop hero | immutable | 109,412 B |
| Service worker | revalidate within 30 seconds | 1,734 B |
| Extension ZIP | one hour | 14,726 B |
| Build receipt | `no-store` | 241 B |

There are no downloaded fonts. Initial JS, CSS, fonts, and both hero variants remain comfortably inside the 200 KB, 50 KB, 120 KB, and 300 KB budgets.

Fresh Lighthouse 13.4.1 on the live home page completed without runtime error:

- Performance 96
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 902 ms; LCP 1,127 ms; TBT 235 ms; CLS 0

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None. |
| P1 | None. |
| P2 | None. |
| P3 | None. |

## Fresh artifacts

- `.factory/verification-11-artifacts/live-first-read-desktop.png`
- `.factory/verification-11-artifacts/live-demo-after-one-click.png`
- `.factory/verification-11-artifacts/live-first-read-mobile.png`
- `.factory/verification-11-artifacts/live-demo-mobile.png`
- `.factory/verification-11-artifacts/verify-url/verify.json`
- `.factory/verification-11-artifacts/lighthouse-live.json`

## Reproduce

```sh
npm ci
# Run every test string in .factory/claims.json separately.
npm test
npm run typecheck
npm run build
npm run verify:deployment
npm run verify:live
VERIFY_NODE_MODULES="$PWD/node_modules" /opt/fleet/lib/verify-url.sh \
  https://reading-margin-recall.sociobot.in .factory/verification-11-artifacts/verify-url
```
