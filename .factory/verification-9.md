# Independent verification 9 — PASS

**Date:** 2026-08-29

**Candidate:** `a9b521ce75b126768bd6d321ea1f46dd1709ccc4`

**Live URL:** <https://reading-margin-recall.sociobot.in>

**Verdict:** **PASS — release candidate accepted.**

Fresh evidence resolves the previously reported deployment-only failure. The public site, service worker, build receipt, and downloadable extension match the candidate production build. No release-blocking or lower-severity product defect was found.

## Mandatory first checks

### Claims contract

`.factory/claims.json` exists. After the required clean-clone `npm ci`, every listed command was run separately and exited 0.

| Claim | Result |
| --- | --- |
| `source-linked-capture` | PASS |
| `extension-selection` | PASS; Chromium case passed and the intentional mobile-project duplicate skipped |
| `demo-isolated` | PASS |
| `local-only` | PASS |
| `pwa-installable` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
| `keyboard-review` | PASS |
| `free-tools` | PASS |
| `review-filters` | PASS |
| `json-transfer` | PASS |
| `delete-notes` | PASS |
| `extension-download` | PASS |
| `http-source-links` | PASS |

Each claim tag occurs exactly once in the test source. Landing, demo, legal-page, and README claims map to these entries; no unlisted material claim was found.

### Cold first read

**PASS.** At both 1440×900 and 390×844, a fresh live visit answers all three required questions without scrolling:

- What it does: **“Save passages for later recall.”**
- Who it serves: **language learners** turning selected sentences into source-linked review notes.
- What to click first: **“Try it with sample data.”**

The adjacent text explains that the demo loads three notes and leaves real notes untouched. One click enters `/?demo=1`; the first demo screen already shows an actionable French review note, three French/German/Spanish saved notes, and the persistent **“Demo — sample data, nothing is saved”** banner with **Reset demo** and **Exit demo and use my notes**.

## Clean-checkout gates

| Check | Result |
| --- | --- |
| Checkout identity | PASS — `HEAD` and `origin/main` are `a9b521ce75b126768bd6d321ea1f46dd1709ccc4` |
| `npm ci` | PASS — 145 packages; 0 vulnerabilities |
| All claim commands | PASS — 14/14 |
| `npm test` | PASS — 53 passed, 2 intentional mobile duplicates skipped, 0 failed |
| `npm run typecheck` | PASS |
| Lint | N/A — no lint script or lint configuration exists |
| `npm run build` | PASS — generated `dist/site` and the MV3 extension ZIP |
| `npm run verify:deployment` | PASS |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `RMR_CANDIDATE_SHA=a9b521... npm run verify:live` | PASS |

The full suite covers desktop and 390px routes, dark mode, Axe, metadata, first-screen behavior, History API focus/scroll restoration, reduced motion, storage failure, malformed import, offline reload/update, installed-extension capture, and bidirectional JSON transfer.

## End-to-end and recovery evidence

- The live demo loaded three realistic notes in its `demo:` namespace and did not create `rmr:notes`.
- A Unicode French passage and gloss with markup-like text saved after correction and rendered as text; no injected element or script appeared.
- A `javascript:` source URL was rejected with an announced, actionable error. The form stayed populated and saved successfully after an HTTPS URL replaced it.
- An incomplete JSON backup produced the documented error and left demo storage byte-for-byte unchanged.
- Delete cancellation kept four notes; confirmation reduced the count to three; Undo restored four.
- Space revealed the answer. Key `1` recorded grade 1, incremented reviews, and set the due time 10.000 minutes ahead.
- Extension selection boundaries behaved correctly: 1 and 1,001 characters were ignored; 2 and 1,000 characters exposed **Save passage**. The dialog focused the gloss, rejected missing fields, and saved only the selected sentence.
- The live 14,726-byte ZIP was downloaded, extracted, loaded into a fresh Chromium profile, and used to capture a passage. Its popup showed the correct cloze and gloss.
- All discovered internal, sample-source, extension-download, and factory links returned 200; mail links and in-page fragments were valid protocol/fragment targets.

## Privacy, deployment, PWA, and server scope

- A cold live request log contained only the document, hashed JS, hashed CSS, and self-hosted hero image. The complete capture/review/recovery flows also used only `reading-margin-recall.sociobot.in`; no analytics, tracking, CDN font/script, billing, AI, or auth request occurred.
- Source inspection found no runtime API client, credential, Azure/OpenAI reference, analytics, sign-in, or product-unlock implementation. Notes and theme settings remain in browser storage.
- This is a static PWA plus browser extension. It exposes no server-side product endpoint, so concurrency, backend persistence, health, API allowance/429/`Retry-After`, and Entra-authority checks are not applicable. The observed API allowance is **N/A**.
- The active controlling worker was `/sw.js`, with no waiting worker after `registration.update()`. Cache `reading-margin-recall-v7` was current, and `/?demo=1` reloaded offline with all three notes.
- Live `index.html`, JS, CSS, service worker, `build-info.json`, and extension ZIP matched the clean build byte-for-byte. The live receipt identifies `a9b521ce75b126768bd6d321ea1f46dd1709ccc4`.
- The live ZIP is valid MV3, has SHA-256 `2d8f11053f80bb4f4fe21bc49f356cc55d2fc4869a54cf3d7721d4028d8ab047`, and requests only `storage`, `activeTab`, and `downloads` permissions.
- Unknown paths return the product-owned 404 document with HTTP 404. HTTP redirects to HTTPS.

## Accessibility and responsive evidence

- Independent live Axe scans found zero serious/critical findings on home, demo, library, review, privacy, terms, the real 404, and dark demo mode.
- Every tested route had one h1, one main landmark, `lang=en`, a route-specific title, no page/console errors, and no 390px horizontal overflow.
- The first desktop Tab focused and revealed the skip link with a 3px focus outline; Enter moved focus to main. Keyboard capture/review and dialog focus recovery passed.
- At 200% root text size, the 390px demo retained its h1, had no horizontal overflow, and had no visible target below 44×44 CSS px.
- Reduced motion yielded 0.00001-second transitions/animations and automatic scrolling.
- `/opt/fleet/lib/verify-url.sh` passed: title, language, main, one h1, image alt text, button names, and no console/page errors. Measured cold load was 580 ms.

## Headers, caching, and budgets

Live responses include a self-only CSP, HSTS, `nosniff`, `strict-origin-when-cross-origin`, and camera/microphone/geolocation denial. Caching is appropriate: hashed assets are one year immutable; HTML, manifest, 404, and service worker revalidate within 30 seconds; build receipt is `no-store`; ZIP is cached for one hour.

| Asset | Size |
| --- | ---: |
| Initial JS | 27,232 B raw / 9,374 B gzip |
| Initial CSS | 18,779 B raw / 4,832 B gzip |
| Fonts | 0 B |
| Mobile hero | 25,872 B |
| Desktop hero | 109,412 B |

Fresh Lighthouse 12.8.2 mobile: **Performance 96, Accessibility 100, Best Practices 100, SEO 100**. FCP was 1.0 s, LCP 1.1 s, TBT 220 ms, CLS 0, and Speed Index 1.0 s.

## Product and scope assessment

The smallest useful product is complete: select a passage in the installed extension, add a learner-authored gloss, choose a hidden word, review it, and return to the source. JSON transfer bridges extension and PWA storage. Automatic translation/AI remains correctly absent because learner-authored retrieval is the product thesis and automatic translation is an explicit non-goal.

The researched brief proposed one-time monetization. The candidate honestly ships every tool free because the earlier billing product was unavailable; it contains no dead checkout or misleading paid promise. This does not reduce the smallest useful product.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

## Evidence

Fresh screenshots, the Lighthouse JSON, and URL-verifier output are under `.factory/evidence/verification-9/`.
