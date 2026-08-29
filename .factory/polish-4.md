# Polish 4 — complete review closure

**Repair code commit:** `4955acce722c81326b67f5f67ba5d12355b772aa`  
**Reviewed release:** `f68aabd6dfa0c3e3cd7c7ac55a1d3431265500c1`  
**Source reports:** `.factory/review-1.md` through `.factory/review-4.md`, and `.factory/polish-1.md` through `.factory/polish-3.md`  
**Live URL:** <https://reading-margin-recall.sociobot.in>

Every historical finding was rechecked. Screenshot paths below are relative to `.factory/evidence/`.

| Finding | Change made | Evidence: test · screenshot · live check |
| --- | --- | --- |
| F-1-1 | Retained the French sample review before the capture form. | `@regression:first-screen` · `polish-4/live-demo-mobile.png` · `/?demo=1` |
| F-1-2 | Retained versioned JSON transfer in both extension and web app. | `@claim:json-transfer` · `polish-3-retry1/local-extension-transfer.png` · live ZIP byte match and `/library` |
| F-1-3 | Retained history scroll restoration, h1 focus, and live announcements. | `@regression:history` · `polish-4/live-home-desktop.png` · `/` → `/library` → Back/Forward |
| F-1-4 | Retained the full product-owned HTTP 404 skeleton and metadata. | `@regression:built-404` · `polish-4/live-404-desktop.png` · `/polish-4-missing` returned HTTP 404 |
| F-1-5 | Retained the explicit three-language demo claim and seed assertion. | `@claim:demo-isolated` · `polish-4/live-demo-mobile.png` · `/?demo=1` |
| F-1-6 | Retained selected-text-only privacy copy. | `@claim:extension-selection` · `polish-4/live-home-desktop.png` · `/` privacy section |
| F-1-7 | Retained named difficult/source review filters. | `@claim:review-filters` · `polish-4/live-home-desktop.png` · `/review?demo=1` |
| F-1-8 | Retained the tested manual gloss, hidden-word, and selected-passage README wording. | `@claim:source-linked-capture` · `polish-3-retry1/local-extension-transfer.png` · `/library` |
| F-1-9 | Retained the plain language-learner audience label. | `@regression:first-screen` · `polish-4/live-home-desktop.png` · `/` |
| F-1-10 | Retained the concrete original-page-link caption. | `@claim:source-linked-capture` · `polish-4/live-home-desktop.png` · `/` |
| F-1-11 | Retained the useful “How it works” heading without mood copy. | `page quality /` · `polish-4/live-home-desktop.png` · `/` |
| F-1-12 | Retained “What the extension stores” as the privacy section label. | `page quality /` · `polish-4/live-home-desktop.png` · `/` |
| F-1-13 | Retained device-local note wording. | `@claim:local-only` · `polish-4/live-privacy-desktop.png` · `/privacy` |
| F-1-14 | Retained “Free review tools” as the section label. | `page quality /` · `polish-4/live-home-desktop.png` · `/` |
| F-1-15 | Retained filtering and backup in the section heading. | `@claim:review-filters`, `@claim:json-backup` · `polish-4/live-home-desktop.png` · `/` |
| F-1-16 | Retained consistent note/passage/gloss/hidden-word/original-page/demo terminology. | full browser suite · `polish-4/live-demo-mobile.png` · `/?demo=1` and `/library` |
| F-1-17 | Retained “Open original page” source actions. | `@regression:demo-source-return-link-is-live` · `polish-4/live-demo-mobile.png` · `/?demo=1` |
| F-1-18 | Retained the explicit demo exit action and deletion of every `demo:` key. | `@claim:demo-isolated` · `polish-4/live-demo-mobile.png` · `/?demo=1` |
| F-1-19 | Retained consistent “All tools are free” wording. | `@claim:free-tools` · `polish-4/live-home-desktop.png` · `/` and `/terms` |
| F-1-20 | Retained short, separated build instructions. | README copy audit · `polish-4/live-home-desktop.png` · repository README |
| F-1-21 | Retained short, separated deployment-verification instructions. | README copy audit · `polish-4/live-home-desktop.png` · repository README |
| F-1-22 | Retained plain product wording and defined contributor tools. | README copy audit · `polish-4/live-home-desktop.png` · repository README |
| F-1-23 | Retained the primary action and three facts in both first viewports. | `@regression:first-screen` · `polish-4/live-home-desktop.png`, `polish-4/live-demo-mobile.png` · `/` |
| F-2-1 | Retained and tested installable web-app metadata and worker. | `@claim:pwa-installable` · `polish-4/live-home-desktop.png` · `/manifest.webmanifest` and `/library` |
| F-2-2 | Retained separate real/demo note and color-setting namespaces. | `@claim:local-only` · `polish-4/live-privacy-desktop.png` · `/privacy` |
| F-2-3 | Kept the decorative “No. 01” label removed. | `@regression:first-screen` · `polish-4/live-home-desktop.png` · `/` |
| F-2-4 | Retained matching “Sample note 1” labels on Home and demo. | `@regression:first-screen` · `polish-4/live-demo-mobile.png` · `/` and `/?demo=1` |
| F-3-1 | Retained only the selected-text extension promise. | `@claim:extension-selection` · `polish-4/live-privacy-desktop.png` · `/privacy` |
| F-3-2 | Retained and exercised all named no-third-party-request flows. | `@claim:local-only` · `polish-4/live-privacy-desktop.png` · `/privacy` |
| F-4-1 | Added `no-tracking`: Home’s “No tracking scripts” is registered and directly audits app scripts, service worker, cookies, storage IDs, beacons, and analytics traffic. | `@claim:no-tracking` · `polish-4/live-home-desktop.png` · live six-route/full-demo proof: 0 cookies, beacons, analytics, or cross-origin requests |
| F-4-2 | Rewrote the deletion boundary: clearing site data removes web-app notes/settings; extension notes are deleted separately. Added a two-store Chromium proof. | `@claim:site-data-boundary` · `polish-4/live-privacy-desktop.png` · live seeded web/extension-store proof retained `extension-note` after site clear |

## Verification evidence

- Clean clone: `/tmp/rmr-polish4-clean-dWd58t` at `4955acce722c81326b67f5f67ba5d12355b772aa`; `npm ci` completed with zero vulnerabilities.
- Every one of the 16 exact commands listed in `.factory/claims.json` passed separately. The registry has 16 entries and exactly one `@claim:<id>` tag for each.
- `npm test -- --reporter=line`: 57 passed, 2 intentional mobile duplicates skipped, 0 failed.
- `npm run typecheck`, `npm run build`, `npm run verify:deployment`, `git diff --check`, and `npm audit --omit=dev`: passed.
- `/opt/fleet/lib/verify-url.sh` on the live root passed: 797 ms load, zero console/page errors, title, `lang=en`, one h1, one main, image alt text, and named buttons. Output: `polish-4/verify-url/verify.json`.
- `npm run verify:live` passed against the deployed repair: exact receipt, HTML/JS/CSS/service-worker/ZIP byte match, HTTP 404, headers, offline reload, keyboard review, mobile 390 px baseline, 200% text, and Axe.
- Cold live proof for F-4-1 exercised all six app routes and a complete demo capture/review/export/Reset/Exit. It observed exactly `/assets/index-PD1olOtf.js` and `/sw.js`, with zero cookies, beacons, analytics, or cross-origin requests.
- Cold live proof for F-4-2 seeded `rmr:notes` and `rmr:theme` on the live origin and an `extension-note` in the packaged extension. Clearing only the live origin removed all web keys and retained the extension note.
- Live Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,100 ms, TBT 37 ms, CLS 0. Report: `polish-4/lighthouse-live.json`.

There are no known product gaps or unresolved review findings.
