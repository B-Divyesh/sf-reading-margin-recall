# Polish round 1

Source review: `.factory/review-1.md` at `5e48ebfca80092e1440a894d1aa39168ca0ce193`.
All findings below are acceptance work. Local screenshots are under `.factory/evidence/polish-1/`.
The live checks use `https://reading-margin-recall.sociobot.in` and its named routes.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Put a complete French sample review above the capture form. Its passage, gloss, hidden-word state, source link, and reveal action fit in the first 390×844 screen. | `@regression:first-screen`; `demo-mobile.png`; `demo-desktop.png`; live `/?demo=1` |
| F-1-2 | Added extension JSON export/import with the same validated version-1 schema as the web app. Empty web collections now expose Import JSON. | `@claim:json-transfer`; live extension ZIP and `/library` |
| F-1-3 | Added per-history-entry scroll recording, manual restoration, h1 focus, and polite route announcements on push, Back, and Forward. | `@regression:history`; live `/` → `/library` → Back/Forward |
| F-1-4 | Rebuilt `404.html` with standard header navigation, footer legal links, factory/build identity, description, canonical, OG/Twitter metadata, and apple-touch icon. | `@regression:built-404`; `@regression:routes`; `404-desktop.png`; live unknown-route HTTP 404 |
| F-1-5 | Expanded `demo-isolated` to name the three French, German, and Spanish notes and assert their content, count, reset, exit, and namespace isolation. | `@claim:demo-isolated`; live `/?demo=1` |
| F-1-6 | Replaced the broad negative promise with “The extension saves only the text you select.” | `@claim:extension-selection`; live `/` privacy section |
| F-1-7 | Added the explicit `review-filters` claim and a two-source, two-difficulty behavior test. | `@claim:review-filters`; live `/review?demo=1` |
| F-1-8 | Rewrote the README boundary as the tested manual workflow: the reader writes the gloss, chooses the hidden word, and imports chosen passages. | `@claim:source-linked-capture`; README audit |
| F-1-9 | Replaced the metaphorical eyebrow with “Private review notes for language learners.” | `.factory/copy-audit.md`; `landing-mobile.png`; live `/` |
| F-1-10 | Replaced “path home” with “original page link.” | `.factory/copy-audit.md`; `landing-desktop.png`; live `/` |
| F-1-11 | Removed “From margin to memory.” | `.factory/copy-audit.md`; live `/` |
| F-1-12 | Replaced “A narrow, honest tool” with “What the extension stores.” | `.factory/copy-audit.md`; live `/` |
| F-1-13 | Replaced vague privacy copy with “Your notes stay on this device.” | `@claim:local-only`; `.factory/copy-audit.md`; live `/` |
| F-1-14 | Replaced “Everything included” with “Free review tools.” | `.factory/copy-audit.md`; live `/` |
| F-1-15 | Replaced “Focus each review” with “Filter and back up your notes.” | `.factory/copy-audit.md`; live `/` |
| F-1-16 | Renamed all visible saved objects to notes: “Sample note,” “New review note,” “Saved notes,” and “Your saved notes.” | full Playwright suite; live `/?demo=1` and `/library` |
| F-1-17 | Replaced every visible “Open source” action with “Open original page.” | `@claim:source-linked-capture`; `@regression:demo-source-return-link-is-live`; live `/` and `/?demo=1` |
| F-1-18 | Renamed the exit action to “Exit demo and use my notes.” It still deletes all `demo:` keys. | `@claim:demo-isolated`; `@regression:demo-exit`; live `/?demo=1` |
| F-1-19 | Uses “All tools are free” consistently in the hero, section, README, and claims registry. | `@claim:free-tools`; `.factory/copy-audit.md`; live `/` |
| F-1-20 | Split the 41-word build explanation into short build and verification sentences. | README; copy review |
| F-1-21 | Split the 24-word verification sentence into two short sentences. | README; copy review |
| F-1-22 | Replaced product-facing PWA/MV3 jargon and defined Vite and WXT once for contributors. Simplified release-check terms. | README; copy review |
| F-1-23 | Tightened the asymmetric hero and kept all three facts above the fold at 390×844 and 1440×900. | `@regression:first-screen`; `landing-mobile.png`; `landing-desktop.png`; live `/` |

## Added acceptance coverage

- `@claim:json-transfer` proves extension → web and web → extension transfer using downloaded JSON files.
- `@regression:routes` checks each route’s title, description, canonical URL, Open Graph title/URL, and Twitter title.
- `@regression:first-screen` checks the two review viewports and the one-click `?demo=1` sample action.
- `@regression:history` checks restored scroll, focused h1, and live-region text after Back and Forward.
- `@regression:built-404` checks the full 404 navigation, legal links, metadata, accessibility, and request isolation.

## Verification evidence

- `npm test`: 52 passed, 2 intentional project duplicates skipped.
- Every claim command passed separately in clean clone `/tmp/rmr-clean-final-gQCu2v` at `72525aab1fce480bc446d48d164e70c91c321f6d`.
- `npm run typecheck`: passed.
- `npm run verify:deployment`: passed with a valid MV3 ZIP and matching build record.
- Lighthouse mobile-local: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 30 ms.
- `/opt/fleet/lib/verify-url.sh`: passed title, language, one h1, main, image alt, named controls, and console checks.
- Initial bundles: 27,232-byte JS and 18,952-byte CSS; mobile hero image 25,872 bytes.

## Live evidence

- `npm run deploy:site` deployed verified product commit `ac861d960c29bf078d8ff3a3ade9a8a063d63474` and its exact assets.
- `npm run verify:live` passed the build receipt, asset and ZIP hashes, HTTP 404, security headers, request privacy, offline flow, Axe, mobile layout, and 200% text checks.
- A separate cold-browser pass rechecked both first-screen sizes, `?demo=1`, sample reveal/reset, history restoration, announcements, and an unknown HTTP 404.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 10 ms.
- Cold live screenshots: `live-landing-mobile.png`, `live-landing-desktop.png`, `live-demo-mobile.png`, `live-demo-desktop.png`, and `live-404-desktop.png`.
- The final documentation-only release is deployed again after this evidence commit. Its SHA is served at `/build-info.json` and checked against `origin/main` by `npm run verify:live`.
