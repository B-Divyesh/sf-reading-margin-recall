# Polish 3 retry 1 — complete finding closure

**Reviewed release:** `a9b521ce75b126768bd6d321ea1f46dd1709ccc4`

**Review report:** `f6dc32c921d422ac3f6c45f8100532e284befce9`

**Transfer-test repair:** `c72cf18b0cbd69f94f59b44f43a7c6ea4ae960f4`

**Live URL:** <https://reading-margin-recall.sociobot.in>

All review 1–3 findings remain closed. This retry also fixes the controller’s download race with two clean extension profiles, controlled download directories, Chrome completion checks, on-disk byte checks, and real file-input imports in both directions. Screenshot paths below are relative to `.factory/evidence/polish-3-retry1/`.

| Finding | Change made | Evidence: test · screenshot · live check |
| --- | --- | --- |
| F-1-1 | A complete French sample review appears before the capture form. | `@regression:first-screen` · `local-demo-mobile.png`, `live-demo-mobile.png` · `/?demo=1` |
| F-1-2 | The extension and web app share one versioned JSON schema and transfer notes both ways. | `@claim:json-transfer` · `local-extension-transfer.png` · `/library` plus the live extension ZIP |
| F-1-3 | History entries restore scroll, focus the route h1, and announce navigation. | `@regression:history` · `local-home-desktop.png` · `/` → `/library` → Back/Forward |
| F-1-4 | The HTTP 404 uses the product header, footer, metadata, icons, legal links, and return action. | `@regression:built-404` · `local-404-desktop.png`, `live-404-desktop.png` · `/missing-polish-3-retry1` |
| F-1-5 | The claim registry names all three multilingual demo notes and storage isolation. | `@claim:demo-isolated` · `local-demo-mobile.png` · `/?demo=1` |
| F-1-6 | The broad no-fetch wording was replaced by the selected-text-only claim. | `@claim:extension-selection` · `local-privacy-desktop.png` · `/privacy` |
| F-1-7 | Difficult-note and source filters have a named behavioral claim. | `@claim:review-filters` · `local-home-desktop.png` · `/review?demo=1` |
| F-1-8 | README describes the tested manual gloss, hidden-word, and selected-passage workflow. | `@claim:source-linked-capture` · `local-extension-transfer.png` · live `/library`; README audited in the repository |
| F-1-9 | The metaphorical slogan was replaced with the language-learner audience label. | `@regression:first-screen` · `local-home-desktop.png`, `live-home-desktop.png` · `/` |
| F-1-10 | The caption now names the original page link. | `@claim:source-linked-capture` · `local-home-desktop.png` · `/` |
| F-1-11 | The mood heading was removed; “How it works” stands alone. | `page quality /` · `local-home-desktop.png` · `/` |
| F-1-12 | The privacy section label now says “What the extension stores.” | `page quality /` · `local-home-desktop.png` · `/` |
| F-1-13 | Privacy copy says notes stay on this device and browser. | `@claim:local-only` · `local-privacy-desktop.png`, `live-privacy-desktop.png` · `/privacy` |
| F-1-14 | The generic section label is now “Free review tools.” | `page quality /` · `local-home-desktop.png` · `/` |
| F-1-15 | The section heading names filtering and backup. | `@claim:review-filters`, `@claim:json-backup` · `local-home-desktop.png` · `/` |
| F-1-16 | Saved objects consistently use note, passage, gloss, hidden word, original page, and demo. | full browser suite · `local-demo-mobile.png` · `/?demo=1` and `/library` |
| F-1-17 | Every source action says “Open original page.” | `@regression:demo-source-return-link-is-live` · `local-demo-mobile.png` · `/?demo=1` |
| F-1-18 | Demo exit names the result and deletes every `demo:` key. | `@claim:demo-isolated`, `@regression:demo-exit` · `local-demo-mobile.png` · `/?demo=1` |
| F-1-19 | Price copy consistently says all tools are free. | `@claim:free-tools` · `local-home-desktop.png` · `/` and `/terms` |
| F-1-20 | The README build explanation is split into short contributor sentences. | `.factory/copy-audit.md` · `local-home-desktop.png` for product copy · README audited in the repository |
| F-1-21 | The README verification explanation is split into short sentences. | `.factory/copy-audit.md` · `local-home-desktop.png` for product copy · README audited in the repository |
| F-1-22 | Product copy uses extension and web app; contributor tooling is defined once. | `.factory/copy-audit.md` · `local-extension-transfer.png` · `/library` and repository README |
| F-1-23 | The primary action and Private, Offline, and Price facts fit both required first screens. | `@regression:first-screen` · `local-home-desktop.png`, `live-home-desktop.png` · `/` |
| F-2-1 | The installable-web-app claim covers its manifest, icons, start URL, display mode, and worker. | `@claim:pwa-installable` · `local-home-desktop.png` · `/library` and `/manifest.webmanifest` |
| F-2-2 | Real and demo note/theme namespaces are separate and request-audited. | `@claim:local-only` · `local-privacy-desktop.png` · `/privacy` |
| F-2-3 | The decorative “No. 01” pseudo-label remains absent. | `@regression:first-screen` · `local-home-desktop.png` · `/` |
| F-2-4 | Home and demo both call the Hugo example “Sample note 1.” | `@regression:first-screen` · `local-demo-mobile.png` · `/` and `/?demo=1` |
| F-3-1 | Privacy uses the exact selected-text/local-store claim. | `@claim:extension-selection` · `local-privacy-desktop.png`, `live-privacy-desktop.png` · `/privacy` |
| F-3-2 | The exact no-third-party-request claim covers capture, review, export, Reset, and Exit. | `@claim:local-only` · `local-privacy-desktop.png`, `live-privacy-desktop.png` · `/privacy` |
| C-3-1 | The transfer test waits for extension download completion and disk existence, then proves each direction in a separate empty profile. | `@claim:json-transfer` passed once from the clean claim matrix and three repeated local runs · `local-extension-transfer.png` · live ZIP byte match and `/library` |

## Clean-clone verification

- Clone: `/tmp/rmr-polish3-retry1-clean-8eYs35` at `c72cf18b0cbd69f94f59b44f43a7c6ea4ae960f4`.
- Every claim command passed independently; see `claims-fresh.tsv`.
- `npm test -- --reporter=line`: 53 passed, 2 intentional project skips, 0 failed.
- `npm run typecheck`, `npm run verify:deployment`, and `npm audit --omit=dev`: passed; zero production vulnerabilities.
- `@claim:json-transfer` also passed three consecutive isolated runs locally.
- Local Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,504 ms, TBT 20 ms, CLS 0.
- Local URL verifier: 550 ms load, zero browser errors, `lang=en`, one h1, one main, complete image alt text, and named buttons.

## Deployment verification

Candidate `d556c48356687e29d2973dee4310efe351823f5c` was pushed and deployed through `npm run deploy:site`. The build receipt and HTML, JS, CSS, service worker, and 14,726-byte extension ZIP byte-matched. `npm run verify:live` passed the real 404, offline reload, keyboard review, request privacy, reduced motion, text resizing, touch targets, and Axe on seven routes.

The live URL verifier reported an 830 ms load with zero errors. Live Lighthouse scored 100 in Performance, Accessibility, Best Practices, and SEO, with 1,052 ms LCP and zero CLS. Cold screenshots are `live-home-desktop.png`, `live-demo-mobile.png`, `live-privacy-desktop.png`, and `live-404-desktop.png`.
