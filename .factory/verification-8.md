# Independent verification 8 — PASS

**Date:** 2026-08-29
**Candidate:** `109fca00449ff17b2b8ac3e0e83077ffcde4723c`
**Live URL:** <https://reading-margin-recall.sociobot.in>
**Verdict:** **PASS — release candidate accepted.**

Fresh evidence resolves the earlier deployment-only failures. The public shell, service worker, build receipt, custom 404, and downloadable extension match the candidate production build. No release-blocking defect was found.

## Mandatory first checks

### Claims contract

`.factory/claims.json` exists. Each of its 13 commands was run separately before other product QA, and every command exited 0.

| Claim | Result |
| --- | --- |
| `source-linked-capture` | PASS |
| `extension-selection` | PASS; Chromium case passed, intentional mobile duplicate skipped |
| `demo-isolated` | PASS |
| `local-only` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
| `keyboard-review` | PASS |
| `free-tools` | PASS |
| `review-filters` | PASS |
| `json-transfer` | PASS |
| `delete-notes` | PASS |
| `extension-download` | PASS |
| `http-source-links` | PASS |

Landing, Privacy, Terms, README, and demo statements map to these claims. The extension-only selection promise is covered by the installed-extension test; privacy statements are covered by the complete request-log test. No unlisted visitor-reliant product claim was found.

### Cold first read

**PASS.** At 1440×900, before any interaction, the live first screen says:

- what it does: **“Save passages for later recall”**;
- who it serves: **language learners** turning selected sentences into source-linked review notes;
- what to click first: **“Try it with sample data.”**

That action is visible without scrolling. One click enters `/?demo=1`, loads three realistic French, German, and Spanish notes, and shows the persistent **“Demo — sample data, nothing is saved”** banner with **Reset demo** and **Exit demo and use my notes**.

## Clean-checkout gates

A detached worktree at the exact candidate was created from the repository, then tested from a fresh `npm ci` installation.

| Check | Result |
| --- | --- |
| Candidate and `origin/main` | PASS — both `109fca00449ff17b2b8ac3e0e83077ffcde4723c` |
| `npm ci` | PASS — 145 packages; 0 vulnerabilities |
| Every claim command | PASS — 13/13 |
| `npm test` | PASS — 52 passed, 2 intentional project duplicates skipped, 0 failed |
| `npm run typecheck` | PASS |
| Lint | N/A — no lint script or lint configuration exists |
| `npm run build` | PASS — generated `dist/site` and the MV3 ZIP |
| `npm run verify:deployment` | PASS |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `RMR_CANDIDATE_SHA=109fca... npm run verify:live` | PASS |

The full suite includes desktop and 390 px routes, dark mode, Axe, metadata, first-screen, history/focus, reduced-motion, storage-failure, incomplete-import, offline/update, extension installation, and bidirectional JSON-transfer cases.

## Independent end-to-end exercise

- Entered the live demo in one click, revealed the sample, reset it, and exited. Demo keys were discarded without touching real-note storage.
- Saved a Unicode French passage, learner gloss, hidden word, title, and HTTPS source. Markup-like passage/title text rendered inert and did not execute.
- Submitted a `javascript:` source URL. The app announced that only HTTP(S) addresses are accepted, saved nothing, retained the form, and successfully saved after correction.
- Imported an incomplete JSON record. The app announced that no notes changed and preserved existing storage byte-for-byte.
- Revealed with Space and graded with `1`. The note recorded one review and a due time 9.999 minutes later, matching the ten-minute “Again” boundary.
- Cancelled deletion, then confirmed it, then used Undo. Each state was correct.
- The full suite separately forced storage exhaustion and confirmed the form and existing notes remain recoverable without a false success message.
- The live extension ZIP was downloaded, integrity-checked, extracted, and loaded in a fresh Chromium profile. It captured only the selected sentence into `chrome.storage.local`, did not write site storage, validated missing fields, reviewed and graded in the popup, and deleted the note.
- Extension selection boundaries behaved correctly: 1 and 1,001 characters were ignored; 2 and 1,000 characters exposed the capture action. Escape returned focus to that action.
- The extension-to-web and web-to-extension JSON transfer passed in the claim suite.

## Privacy, deployment, PWA, and server scope

- The independent live capture/review/delete/offline flow made 16 requests, all to `reading-margin-recall.sociobot.in`; it produced zero console or page errors. The live installed-extension flow also made no cross-origin HTTP request.
- There are no analytics, third-party fonts/scripts, AI calls, sign-in, billing calls, or embedded secrets. The optional-AI missed-leverage check is negative: learner-authored glosses are the product’s stated purpose, and automatic translation is an explicit non-goal.
- This is a static PWA plus browser extension. It has no server-side product endpoint or product-unlock call, so API allowance/429/`Retry-After`, backend concurrency/persistence/health, and Entra-authority checks are not applicable. No request allowance exists to observe.
- The service worker was active and controlling at `/sw.js`, `registration.update()` left no waiting worker, cache `reading-margin-recall-v7` was current, and the three-note demo reloaded offline.
- `npm run verify:live` matched live `index.html`, JS, CSS, service worker, receipt, and extension ZIP to the clean build. The receipt identifies the candidate.
- The live ZIP is 14,726 bytes, `application/zip`, valid MV3, and SHA-256 `2d8f11053f80bb4f4fe21bc49f356cc55d2fc4869a54cf3d7721d4028d8ab047`.
- Unknown routes return the product-owned page with HTTP 404. All discovered product, installer, source, factory, robots, sitemap, and in-page fragment links passed.

## Accessibility and responsive evidence

- Fresh Axe scans found zero serious/critical issues on `/`, demo, library, review, privacy, terms, the 404, dark mode, and the extension popup.
- At 390×844, all seven routes had zero horizontal overflow, no visible control below 44×44 CSS px, and no direct text below 16 px.
- At 200% root text size, the demo had zero horizontal overflow and retained its h1.
- First Tab revealed and focused the skip link with a 3 px outline; Enter focused `main`. The light focus color is 3.52:1 against paper and the dark focus color is 10.74:1 against night.
- Reduced motion lowered transitions/animations to `0.00001s`. Keyboard review and extension-dialog focus recovery passed.
- `/opt/fleet/lib/verify-url.sh` passed: title, `lang=en`, one h1, main landmark, image alt text, labelled buttons, and no console errors.

## Headers, caching, and budgets

Live HTML and assets send CSP restricted to self, HSTS, `nosniff`, `strict-origin-when-cross-origin`, and camera/microphone/geolocation denial. HTTP redirects to HTTPS. Cache behavior is appropriate:

- hashed JS/CSS: one year, immutable;
- HTML and service worker: 30 seconds, must-revalidate;
- build receipt: no-store;
- extension ZIP: one hour.

The clean production build is within every static budget:

- JavaScript: 27,232 B raw / 9,388 B gzip;
- CSS: 18,952 B raw / 4,875 B gzip;
- fonts: none;
- mobile hero: 25,872 B;
- desktop hero: 109,412 B.

Fresh Lighthouse 12.8.2 mobile results: **Performance 95, Accessibility 100, Best Practices 100, SEO 100**. FCP was 1.39 s, LCP 2.19 s, TBT 199 ms, CLS 0, and Speed Index 1.44 s.

## Scope note

The researched brief proposed one-time monetization. An earlier version advertised an unregistered checkout that returned 404 and lacked the required API rate limit. Repository workers cannot register billing infrastructure. The shipped release therefore removes the dead purchase path and makes every tool free. This is an honest, useful deviation: it preserves the complete smallest-useful product, introduces no outside data flow, and avoids promising a purchase that cannot complete.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

## Commands used

These commands were run from the detached candidate while `origin/main` still identified that candidate. The verifier-only documentation commit created after testing is intentionally not deployed.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run verify:deployment
RMR_CANDIDATE_SHA=109fca00449ff17b2b8ac3e0e83077ffcde4723c npm run verify:live
```

Fresh evidence is under `.factory/verification-artifacts/`, including claim results, live headers/link crawl, installed-extension runs, mobile/Axe checks, URL verification, screenshots, and Lighthouse JSON.
