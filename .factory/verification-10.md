# Independent verification 10 — PASS

**Date:** 2026-08-29  
**Candidate:** `f68aabd6dfa0c3e3cd7c7ac55a1d3431265500c1`  
**Live URL:** <https://reading-margin-recall.sociobot.in>  
**Verdict:** **PASS — release candidate accepted.**

Fresh local and live evidence resolves the prior deployment-only concern. The deployed public artifacts and receipt match this candidate exactly, and no P0–P3 defect was found.

## Mandatory first checks

### Claims contract

`.factory/claims.json` exists with 14 claims. From the clean candidate checkout, after `npm ci`, I ran every declared command separately through the product test/demo entry point. All exited 0:

| Claim IDs (all PASS) |
| --- |
| `source-linked-capture`, `extension-selection`, `demo-isolated`, `local-only`, `pwa-installable`, `offline-reload`, `json-backup` |
| `keyboard-review`, `free-tools`, `review-filters`, `json-transfer`, `delete-notes`, `extension-download`, `http-source-links` |

The independent serial sweep printed `PASS` for every ID. The unfiltered `npm test` then passed all 53 executed tests (two intentional mobile-project duplicates skipped). The landing page, demo, privacy/terms pages, and README claims map to those IDs; no material unlisted product claim was found.

### Cold first read

**PASS.** In a fresh desktop browser context, the first screen plainly says:

- **What:** “Save passages for later recall.”
- **For whom:** language learners who turn selected sentences into source-linked review notes.
- **First click:** **“Try it with sample data.”**

That action is one click and opens `/?demo=1`. It immediately shows a French review note plus three French, German, and Spanish sample notes. The persistent banner says **“Demo — sample data, nothing is saved”** and supplies **Reset demo** and **Exit demo and use my notes**. The same required content was visible and usable at 390×844.

## Clean-checkout verification

| Check | Result |
| --- | --- |
| Checkout identity | PASS — `HEAD` was exactly `f68aabd6dfa0c3e3cd7c7ac55a1d3431265500c1` and the worktree was clean before QA docs |
| `npm ci` | PASS — 145 packages installed; npm reported 0 vulnerabilities |
| Every command in `.factory/claims.json` | PASS — 14/14, run serially and separately |
| `npm test` | PASS — 53 passed, 2 intentional skips, 0 failed (1.3 min) |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — generated `dist/site` and the MV3 ZIP |
| `npm run verify:deployment` | PASS — valid product-owned 404, MV3 ZIP, and receipt |
| Lint | N/A — the repository has no lint script/configuration |

The browser suite covers both desktop and 390px mobile routes, capture and source validation, demo isolation, local-only requests, JSON backup in both directions, offline reload and service-worker update, keyboard review, malformed import and failed-storage recovery, metadata/routing/history, reduced motion, target sizing, dark mode, and extension packaging/capture.

## Independent end-to-end evidence

- On the live demo, an invalid `javascript:` source address showed the actionable “Use a full http or https address” error and did not create a fourth note. Replacing it with `https://example.test/qa` saved the Unicode French test passage, gloss, selected deletion, and source; the note count became four. Reset returned the sandbox to exactly three notes.
- On live `/review?demo=1`, `Space` revealed the hidden word and `3` graded it and advanced from **Review 1 of 3** to **Review 2 of 3**.
- In the live mobile context, the first Tab made the skip link visible with a 3px amber focus outline; Enter moved focus to `main`. At 390px, `scrollWidth === clientWidth === 390`. With reduced motion emulated, transition and animation durations were `0.00001s`.
- A fresh live context obtained controller `https://reading-margin-recall.sociobot.in/sw.js`; after the initial demo visit, setting the context offline and reloading still showed all three sample notes with no page errors.
- The extension’s real selection/capture and bidirectional JSON-transfer paths are exercised by the isolated fresh-profile claims and passed. The built ZIP is Manifest V3, 14,726 bytes, SHA-256 `2d8f11053f80bb4f4fe21bc49f356cc55d2fc4869a54cf3d7721d4028d8ab047`.

## Privacy, deployment, and server scope

- A cold live request log contained only the document, same-origin hashed JS/CSS, and the self-hosted hero image. The complete live capture/review/reset flow made no third-party request. It produced no console errors or page errors.
- Notes and theme/demo state use browser storage. The demo flow showed only `demo:rmr:notes` after reset. There is no analytics, CDN font/script, AI, account, billing, or product-unlock request in the live product flow.
- This is a static PWA and extension with no server-side product API or sign-in. Rate allowance/429/`Retry-After`, backend concurrency/persistence/health, and Entra tenant checks are therefore **not applicable**; observed allowance: **N/A**.
- Live `index.html`, manifest, worker, `build-info.json`, extension ZIP, primary JS/CSS, and hero image byte-match the candidate build. The live receipt identifies this exact candidate commit and ZIP hash. `/build.json` correctly returns the product-owned 404 because the receipt is at `/build-info.json`.
- Live headers include a self-only CSP, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and denied camera/microphone/geolocation. HTML and the worker revalidate within 30 seconds; hashed JS/CSS are `max-age=31536000, immutable`; the ZIP is one-hour cached.

## Accessibility and performance

- Fresh Axe Playwright scans found **zero violations**, including zero serious/critical, on home, demo, library, review, privacy, terms, and the live 404.
- All checked routes have `lang=en`, a route title, one `h1`, and a `main` landmark. Cold live load had zero browser console/page errors. Tests additionally cover image alt text, target sizes, 200% text, focus/history behavior, and dark treatment.
- Production first-load JS is 27,196 B raw / 9,370 B gzip; CSS is 18,779 B raw / 4,830 B gzip; there are no downloaded fonts; the mobile hero is 25,872 B and desktop hero 109,412 B. These meet the stated static budgets (200 KB JS, 50 KB CSS, 120 KB fonts, 300 KB hero).
- I attempted a fresh Lighthouse 13.4.1 run. The installed Playwright Chromium crashed under Lighthouse before audit collection, so no fresh Lighthouse score is asserted here. This is an environment-tool incompatibility, not a product console/runtime failure; the independent Axe, responsive, offline, header, and budget checks above passed. Earlier report artifacts are not substituted for fresh scores.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

## Reproduce

```sh
npm ci
# Run every test string in .factory/claims.json separately.
npm test
npm run typecheck
npm run build
npm run verify:deployment
```

For live smoke checks, open <https://reading-margin-recall.sociobot.in/?demo=1> in a fresh profile, wait for `/sw.js`, then reload offline. The deployed build receipt is <https://reading-margin-recall.sociobot.in/build-info.json>.
