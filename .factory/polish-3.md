# Polish 3 — complete finding closure

**Repair commit:** `02891713ae061b0da1a1ddd2af8a11cfb0f78a19`  
**Live URL:** <https://reading-margin-recall.sociobot.in>  
**Scope:** every finding in reviews 1–3 and polish records 1–2.

The repair preserves the botanical field-guide interface. It closes the last two claim-completeness findings by making the privacy wording exact and proving the promised local flows in a real browser. The clean clone claim matrix is at `.factory/evidence/polish-3/claims-fresh.tsv`; every exit code is zero.

| Finding | Change made | Evidence: test, screenshot, live URL check |
| --- | --- | --- |
| F-1-1 | Kept the French sample review, cloze, gloss, source link, and Reveal action above the capture form. | `@regression:first-screen`; `local-demo-mobile.png`; cold `/?demo=1` |
| F-1-2 | Kept versioned JSON export/import in the extension and web app in both directions. | `@claim:json-transfer`; full browser suite; `/library` and extension ZIP |
| F-1-3 | Kept History API scroll restoration, h1 focus, and polite route announcements. | `@regression:history`; full browser suite; `/` → `/library` → Back/Forward |
| F-1-4 | Kept the branded HTTP 404 header, footer, metadata, icons, and return route. | `@regression:built-404`; `local-404-desktop.png`; `/missing-polish-3` |
| F-1-5 | Kept the three-language demo seed claim and count/isolation assertion. | `@claim:demo-isolated`; `local-demo-mobile.png`; `/?demo=1` |
| F-1-6 | Uses the exact selected-text-only extension claim in Privacy; removed the unproved fetch/bypass wording. | `@claim:extension-selection`; `local-privacy-desktop.png`; `/privacy` |
| F-1-7 | Kept the named difficult/source filter claim and observable filtering test. | `@claim:review-filters`; full browser suite; `/review?demo=1` |
| F-1-8 | Kept README’s positive manual gloss, hidden-word, and selected-passage workflow. | `@claim:source-linked-capture`; README audit; `/library` |
| F-1-9 | Kept the plain audience label and removed the field-guide slogan. | `.factory/copy-audit.md`; `local-home-desktop.png`; `/` |
| F-1-10 | Kept “original page link” rather than metaphorical wording. | `@claim:source-linked-capture`; `local-home-desktop.png`; `/` |
| F-1-11 | Kept “How it works” as the standalone section name. | `.factory/copy-audit.md`; `local-home-desktop.png`; `/` |
| F-1-12 | Kept “What the extension stores” as the privacy section label. | `.factory/copy-audit.md`; `local-home-desktop.png`; `/` |
| F-1-13 | Kept device-local note wording and its local-storage claim. | `@claim:local-only`; `local-home-desktop.png`; `/privacy` |
| F-1-14 | Kept “Free review tools” as the specific section name. | `.factory/copy-audit.md`; `local-home-desktop.png`; `/` |
| F-1-15 | Kept “Filter and back up your notes” as the specific section name. | `@claim:review-filters`, `@claim:json-backup`; `local-home-desktop.png`; `/` |
| F-1-16 | Kept note, passage, gloss, hidden word, original page, and demo terminology consistent. | `.factory/copy-audit.md`; full browser suite; `/?demo=1` and `/library` |
| F-1-17 | Kept result-naming “Open original page” links. | `@regression:demo-source-return-link-is-live`; `local-demo-mobile.png`; `/?demo=1` |
| F-1-18 | Kept the explicit demo-exit action and namespace cleanup. | `@claim:demo-isolated`, `@regression:demo-exit`; `local-demo-mobile.png`; `/?demo=1` |
| F-1-19 | Kept “All tools are free” consistently across product, terms, and README. | `@claim:free-tools`; `local-home-desktop.png`; `/terms` |
| F-1-20 | Kept the build explanation split into short contributor sentences. | `.factory/copy-audit.md`; README review; repository README |
| F-1-21 | Kept the verification explanation split into short contributor sentences. | `.factory/copy-audit.md`; README review; repository README |
| F-1-22 | Kept extension/web-app product wording and defined contributor tooling once. | `.factory/copy-audit.md`; README review; repository README |
| F-1-23 | Kept the action and Private, Offline, and Price facts in both required first screens. | `@regression:first-screen`; `local-home-desktop.png`, `local-demo-mobile.png`; `/` |
| F-2-1 | Kept the installed web-app claim and manifest/service-worker proof. | `@claim:pwa-installable`; full browser suite; `/library` |
| F-2-2 | Kept real/demo note and theme namespaces separate; widened its exact request-flow proof. | `@claim:local-only`; `local-privacy-desktop.png`; `/privacy` |
| F-2-3 | Kept the decorative “No. 01” label absent. | `.factory/copy-audit.md`; `local-home-desktop.png`; `/` |
| F-2-4 | Kept “Sample note 1” aligned between Home and the demo sample. | `@regression:first-screen`; `local-demo-mobile.png`; `/` and `/?demo=1` |
| F-3-1 | Replaced the untested full-page/book/protected-content negative promise with “The extension saves only the text you select in its local note store.” The installed-extension test now reads that store and verifies the exact selected passage. | `@claim:extension-selection`; `local-privacy-desktop.png`; `/privacy` |
| F-3-2 | Replaced broad “nothing leaves” wording with an exact `local-only` claim: capture, review, JSON export, and demo Reset/Exit make no third-party requests. The test logs every request through those flows, verifies the local namespaces, and checks the live Privacy wording. | `@claim:local-only`; `local-privacy-desktop.png`; `/privacy` |

## Verification before deployment

- Clean clone at `/tmp/rmr-polish3-clean-UQKmVM`: `npm ci`, all 14 individual claim commands, `npm test`, `npm run typecheck`, `npm run verify:deployment`, and `npm audit --omit=dev` passed.
- Local production checks: `npm test` passed 53 browser tests with 2 intentional mobile-project skips; `npm run typecheck` and `npm run verify:deployment` passed; `npm audit --omit=dev` reported zero vulnerabilities.
- Local visual checks: `local-home-desktop.png`, `local-demo-mobile.png`, `local-privacy-desktop.png`, and `local-404-desktop.png` were captured from the production preview. The 390 px demo view visibly contains the sample, banner, Reset, Exit, and Reveal action without scrolling.

## Deployed evidence

- Deployment through `npm run deploy:site` succeeded. The live build receipt, HTML, hashed CSS/JS, worker, and 14,726-byte MV3 ZIP all byte-match candidate `6d163ef244e26780c9fd8a54b03dbcd47d229add`; see `verify-live.json`.
- Cold public screenshots are `live-home-desktop.png`, `live-demo-mobile.png`, `live-privacy-desktop.png`, and `live-404-desktop.png`. They were visually checked after deployment. The demo mobile capture shows the persistent isolation banner and the Reveal action inside the first 390×844 viewport; the Privacy capture shows both exact repaired claims.
- `verify-url-live/verify.json` passed with a 613 ms cold load, zero browser errors, `lang=en`, one h1, one main landmark, image alt coverage, and named buttons.
- Live Lighthouse 12.8.2 mobile results in `lighthouse-live.json`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 908 ms, LCP 1,058 ms, TBT 5 ms, CLS 0.
- The live verifier rechecked the real 404, header policy, extension ZIP, capture/review/keyboard path, offline reload, current service worker, no third-party requests, 44 px targets, 16 px mobile text, 200% text resize, reduced motion, and Axe on all seven mobile routes. No finding remained.
