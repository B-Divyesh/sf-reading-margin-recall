# Adversarial first-read review 2

**Product:** Reading Margin Recall

**Live URL:** <https://reading-margin-recall.sociobot.in>

**Reviewed repository commit:** `77fcd5859e1971d60d2ac4202b08f22799e618ce`

**Live product receipt:** `109fca00449ff17b2b8ac3e0e83077ffcde4723c`

**Date:** 2026-08-29

**Verdict:** **FAIL**

Four findings remain: two unlisted claims and two copy defects. No registered claim test failed, and no blocking defect was found. A PASS still requires zero findings.

The repository changes after the live receipt are verification documents and artifacts only. No product file differs between the live product commit and this review commit.

## First read before scrolling

Fresh Chromium contexts opened the live Home page at 390 × 844 and 1440 × 900. No storage or prior navigation was present.

| Question | Answer from the first screen | Evidence |
| --- | --- | --- |
| What does this do? | It saves a selected reading passage as a note, hides one word, and brings it back for recall. | “Save passages for later recall” and “selected sentences … become source-linked review notes.” |
| For whom? | Language learners reading web pages or ebooks. | “For language learners…” |
| What should I click first? | Try the seeded example. | “Try it with sample data” is the primary action. |

All three answers are clear on both viewports. The primary action and the Private, Offline, and Price facts are visible before scrolling. On mobile, the three fact descriptions end at 666 px; on desktop, they end by 674 px.

## Findings

### Major

#### F-2-1 — The README calls the web app installable without a registered claim

- **Exact quote/location:** `README.md`, product overview: “An installable web app provides capture, review, JSON backup, and the one-click demo.”
- **Why this fails:** “Installable” is a visitor-reliant product promise. `.factory/claims.json` tests an installable Manifest V3 extension, but it has no web-app installability claim. The service worker and manifest exist, yet no registered claim test verifies the manifest fields, icons, start URL, display mode, and controlling service worker together.
- **Concrete fix:** Either rewrite this as “A web app provides capture, review, JSON backup, and the one-click demo,” or add `pwa-installable` to `.factory/claims.json` with a test that validates the linked manifest, required icons, `/library` start URL, standalone display mode, and active service worker from a clean context.

#### F-2-2 — The privacy copy adds untested settings storage

- **Exact quote/location:** `README.md`: “Reading notes and settings stay in browser storage.” `/privacy`: “Passages, glosses, source links, review dates, and settings stay in browser storage.”
- **Why this fails:** `local-only` names and tests reading notes and outbound requests. It does not name settings or assert that a changed setting remains only in the correct local or `demo:` namespace. The extra privacy promise is therefore not represented by the claim entry.
- **Concrete fix:** Either remove “and settings” from both sentences, or expand `local-only` to name settings and test real and demo theme keys while recording the request log.

### Minor

#### F-2-3 — “No. 01” is a decorative label with no information

- **Exact quote/location:** Home hero, above “Private review notes for language learners”; `site/src/styles.css`, `.hero-copy::before { content: 'No. 01'; }`.
- **Why this fails:** The label does not identify a section, state, or action. It is the kind of invented catalog lore prohibited by the plain-words contract and was omitted from the repository copy audit even though it is visible.
- **Concrete fix:** Delete the pseudo-element and preserve the spacing with layout CSS rather than replacement copy.

#### F-2-4 — The same sample changes number between Home and the demo

- **Exact quote/location:** Home labels the Hugo passage “Sample note 3 · due today”; the one-click demo labels that same passage “Sample note 1 · due today.”
- **Why this fails:** A first-time visitor who follows the preview into the demo sees the identical passage renumbered. The numbering looks like state but is decorative and inconsistent.
- **Concrete fix:** Use “Sample note 1 · due today” in both places, or remove the number from both labels. Add a copy assertion tying the Home preview to the first seeded demo note.

## Demo and sandbox

- One click on “Try it with sample data” opened `/?demo=1`.
- At 390 × 844 and 1440 × 900, the first demo viewport already showed the French passage, its gloss, hidden-word state, source, and “Reveal sample answer.”
- The banner read “Demo — sample data, nothing is saved” and exposed Reset and Exit actions.
- Reset restored the French, German, and Spanish seed notes.
- A real `rmr:notes` sentinel remained byte-for-byte unchanged through entry and Reset. Exit removed `demo:rmr:notes` and retained the real namespace.
- The live landing/demo run made only same-origin requests and produced no console or page errors.
- `@claim:local-only` separately exercised a full demo capture flow with a request log and passed.

The demo itself passes. None of the four findings weakens namespace isolation or the first-use experience.

## Claims audit

Every command in `.factory/claims.json` was run separately after `npm ci` in clean clone `/tmp/rmr-review2-clean-Kp7io7` at `77fcd5859e1971d60d2ac4202b08f22799e618ce`.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `source-linked-capture` | PASS | Saved passage, gloss, hidden word, title, and source link rendered. |
| `extension-selection` | PASS | The installed extension captured only selected text into extension storage. |
| `demo-isolated` | PASS | Three multilingual notes loaded; Reset and Exit preserved the real namespace. |
| `local-only` | PASS | The complete demo capture flow made no cross-origin request. |
| `offline-reload` | PASS | The controlled demo reloaded offline with three notes. |
| `json-backup` | PASS | All three demo notes exported; a backup imported successfully. |
| `keyboard-review` | PASS | Space revealed the answer and `3` saved a grade. |
| `free-tools` | PASS | Capture, review, backup, and source tools had no account, license, billing call, or gate. |
| `review-filters` | PASS | Difficulty and source filters returned only matching seeded notes. |
| `json-transfer` | PASS | Extension → web and web → extension transfers both succeeded. |
| `delete-notes` | PASS | The note disappeared from the page and storage. |
| `extension-download` | PASS | The served ZIP matched the build and contained a valid MV3 manifest. |
| `http-source-links` | PASS | A `javascript:` URL was rejected and never rendered as a link. |

There are no failing listed claims. F-2-1 and F-2-2 are the two unlisted assertions.

## Landing-page copy audit

Counts treat hyphenated terms, contractions, and version strings as one word. Headings, labels, actions, screen-reader qualifiers, and conditional status messages are included. No item exceeds 22 words or contains a banned marketing adjective.

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Reading Margin Recall | 3 | Product name |
| Demo | 1 | Pass |
| My notes | 2 | Pass |
| Review | 1 | Pass |
| Privacy | 1 | Pass |
| Change color theme | 3 | Pass; result-naming action |
| No. 01 | 2 | **F-2-3: decorative label** |
| Private review notes for language learners | 6 | Pass |
| Save passages for later recall | 5 | Pass; job headline |
| For language learners who want selected sentences to become source-linked review notes. | 12 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Add my first passage | 4 | Pass; result-naming action |
| The demo loads three sample notes. | 6 | Pass; `demo-isolated` |
| Your real notes stay untouched. | 5 | Pass; `demo-isolated` |
| Private | 1 | Pass |
| Stays on this device | 4 | Pass; `local-only` |
| Offline | 1 | Pass |
| Works after the first visit | 5 | Pass; `offline-reload` |
| Price | 1 | Pass |
| All tools are free | 4 | Pass; `free-tools` |
| Each note keeps the passage, your gloss, and the original page link. | 12 | Pass; `source-linked-capture` |
| Sample note 3 · due today | 5 | **F-2-4: inconsistent sample number** |
| Live review preview | 3 | Pass |
| Recall the missing word | 4 | Pass |
| La vie est une fleur dont l’amour est le _____. | 10 | Sample content |
| Your gloss: Life is a flower whose honey is love. | 10 | Sample content |
| Reveal it in the demo | 5 | Pass; result-naming action |
| Open original page (external) | 4 | Pass; result-naming action |
| How it works | 3 | Pass |
| Select a sentence | 3 | Pass |
| Highlight only the text you own or can read. | 9 | Pass |
| Add your gloss | 3 | Pass |
| Choose one word to hide during review. | 7 | Pass |
| Recall, then return | 3 | Pass |
| Grade your answer and open the original page. | 8 | Pass |
| What the extension stores | 4 | Pass |
| Your notes stay on this device | 6 | Pass; `local-only` |
| The extension saves only the text you select. | 8 | Pass; `extension-selection` |
| Read the privacy details | 4 | Pass; result-naming action |
| No account | 2 | Pass; `free-tools` |
| No tracking scripts | 3 | Pass; `local-only` |
| JSON backup and restore | 4 | Pass; `json-backup` |
| Delete any note | 3 | Pass; `delete-notes` |
| Free | 1 | Pass |
| All tools | 2 | Pass |
| Free review tools | 3 | Pass |
| Filter and back up your notes | 6 | Pass |
| All tools are free to use. | 6 | Pass; `free-tools` |
| No account or subscription is required. | 6 | Pass; `free-tools` |
| Filter difficult notes | 3 | Pass; `review-filters` |
| Review one source at a time | 6 | Pass; `review-filters` |
| Export and import JSON backups | 5 | Pass; `json-backup`, `json-transfer` |
| Source-linked recall notes for language learners. | 6 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory (external) | 5 | Attribution |
| v1.0.0 · Original generated field-guide artwork | 5 | Provenance |
| Offline · saved notes still work | 5 | Pass; conditional `offline-reload` status |
| Back online. | 2 | Pass; conditional status |

## README copy audit

Shell commands are excluded because they are syntax, not sentences. Headings and list items are included so jargon and out-of-context labels can be checked. No unit exceeds 22 words or contains a banned marketing adjective.

| Copy unit | Words | Result |
| --- | ---: | --- |
| Reading Margin Recall | 3 | Product name |
| Turn selected passages into private, source-linked review notes. | 8 | Pass |
| Reading Margin Recall is for language learners reading their own ebooks and web articles. | 14 | Pass |
| Select one sentence, add your gloss, choose a hidden word, and review it later. | 14 | Pass |
| Every note keeps a link to its original page. | 9 | Pass |
| The product has two parts: | 5 | Pass |
| A Chrome-compatible extension captures selected text from a web page. | 10 | Pass; `extension-selection` |
| An installable web app provides capture, review, JSON backup, and the one-click demo. | 13 | **F-2-1: unlisted installability claim** |
| Each part keeps its own local notes. | 7 | Pass; `local-only`, `extension-selection` |
| Export a JSON backup from either part, then import it into the other. | 13 | Pass; `json-transfer` |
| Reading notes stay in browser storage. | 6 | Pass; `local-only` |
| Capture and review make no third-party requests. | 7 | Pass; `local-only` |
| The installed web app works offline after its first visit. | 10 | Pass; `offline-reload` |
| The demo uses separate `demo:` storage and never touches real notes. | 11 | Pass; `demo-isolated` |
| Try the demo | 3 | Pass heading |
| Open `/?demo=1`, or visit the live demo. | 8 | Pass |
| It loads three French, German, and Spanish sample notes. | 9 | Pass; `demo-isolated` |
| Use Reset demo to restore them. | 6 | Pass |
| Use Exit demo and use my notes to discard the demo data. | 12 | Pass |
| Install the extension | 3 | Pass heading |
| After a production build: | 4 | Pass |
| Open `chrome://extensions` in Chrome or another Chromium browser. | 9 | Pass |
| Turn on Developer mode. | 4 | Pass |
| Choose Load unpacked and select `.output/chrome-mv3`. | 6 | Pass |
| Select text on a web page, then choose Save passage. | 10 | Pass |
| Open the extension to reveal and grade the note. | 9 | Pass |
| The packaged download is written to `dist/site/downloads/reading-margin-recall-chrome.zip`. | 7 | Pass; `extension-download` |
| Move notes between both parts | 5 | Pass heading |
| Choose Export notes as JSON in the extension. | 8 | Pass |
| Open My notes in the web app and choose Import JSON. | 11 | Pass |
| To move notes back, export from the web app and import the file in the extension. | 16 | Pass; `json-transfer` |
| Develop | 1 | Pass heading |
| Requirements: Node.js 22 and npm. | 6 | Pass in contributor context |
| Vite builds the web app. | 5 | Pass; tool is explained |
| WXT builds the extension. | 4 | Pass; tool is explained |
| `npm run build` and `npm run build:site` create the extension ZIP and static site in `dist/site`. | 16 | Pass; verified build instruction |
| They also verify the installer, build record, and 404 configuration. | 10 | Pass; verified build instruction |
| The web-app-only build step is private to the release assembler. | 10 | Pass; contributor boundary |
| `npm run deploy:site` deploys `dist/site` and then runs deployed-site checks. | 10 | Pass; contributor instruction |
| `npm run verify:live` compares the deployed assets, extension ZIP, and site-served build record with the local build. | 17 | Pass; contributor instruction |
| The command confirms that the live receipt names the deployed commit. | 11 | Pass; contributor instruction |
| It then checks the 404 page, headers, request privacy, and Axe results. | 12 | Pass; contributor instruction |
| Product behavior | 2 | Pass heading |
| Space reveals a review answer. | 5 | Pass; `keyboard-review` |
| Keys 1–4 grade recall. | 5 | Pass; `keyboard-review` |
| JSON export includes every note. | 5 | Pass; `json-backup` |
| JSON import restores a backup. | 5 | Pass; `json-backup` |
| Source links accept only `http:` and `https:` addresses. | 8 | Pass; `http-source-links` |
| All tools are free to use. | 6 | Pass; `free-tools` |
| No account or subscription is required. | 6 | Pass; `free-tools` |
| Filters show difficult notes or notes from one source. | 9 | Pass; `review-filters` |
| You write the gloss and choose the hidden word yourself. | 10 | Pass; `source-linked-capture` |
| Import only the passages you choose. | 6 | Pass; `extension-selection`, `json-transfer` |
| Privacy and terms | 3 | Pass heading |
| The site includes `/privacy` and `/terms`. | 6 | Pass; verified structure |
| Reading notes and settings stay in browser storage. | 8 | **F-2-2: settings are not named or tested** |
| Repository map | 2 | Pass heading |
| `entrypoints/` — extension capture and review screens | 6 | Pass in contributor context |
| `site/` — web app and public page files | 7 | Pass in contributor context |
| `shared/` — note model and recall scheduling | 6 | Pass in contributor context |
| `tests/` — browser claim and quality checks | 6 | Pass in contributor context |
| `.factory/` — product brief, visual thesis, claims, demo guide, copy audit, and handoff | 12 | Pass in contributor context |
| Licensed under the MIT License. | 5 | Pass |

## Earlier finding verification

Every finding in `.factory/review-1.md` was checked against the live site and the current source. `.factory/polish-1.md` was treated as a list of assertions to verify.

| Earlier ID | Live confirmation | Code/test confirmation | Result |
| --- | --- | --- | --- |
| F-1-1 | The first demo viewport shows a complete French review and Reveal action at both sizes. | `demoSample()` renders before the workbench; `@regression:first-screen` passed. | Fixed |
| F-1-2 | The live ZIP hash matches the build containing extension transfer controls. | `transferControls()` and `@claim:json-transfer` passed both directions. | Fixed |
| F-1-3 | Back restored the saved Home scroll above 800 px; route h1 focus and polite announcements were correct. | History state stores `scrollY`; `@regression:history` passed desktop and mobile. | Fixed |
| F-1-4 | The live HTTP 404 has standard navigation, legal footer, title, description, canonical, social image, and icons. | `site/404.html` and `@regression:built-404` passed. | Fixed |
| F-1-5 | Home and demo state that three multilingual samples load. | `demo-isolated` now names and asserts all three samples. | Fixed |
| F-1-6 | Home now says only “The extension saves only the text you select.” | `@claim:extension-selection` passed with the built extension. | Fixed |
| F-1-7 | Home and README use the difficult/source filter wording. | `review-filters` is registered and passed. | Fixed |
| F-1-8 | README now states the manual gloss, deletion, and chosen-passage workflow. | `source-linked-capture` and extension selection cover it. | Fixed |
| F-1-9 | “Private review notes for language learners” is live. | Old metaphor is absent from source. | Fixed |
| F-1-10 | Caption says “original page link.” | Old “path home” wording is absent. | Fixed |
| F-1-11 | “From margin to memory” is absent. | Only “How it works” remains. | Fixed |
| F-1-12 | Section label is “What the extension stores.” | Old adjective-led label is absent. | Fixed |
| F-1-13 | Heading is “Your notes stay on this device.” | `local-only` covers the note claim. | Fixed |
| F-1-14 | Section label is “Free review tools.” | Old generic label is absent. | Fixed |
| F-1-15 | Heading is “Filter and back up your notes.” | It names the section’s two functions. | Fixed |
| F-1-16 | Visible records are consistently called notes. | Source uses note/passage/gloss/hidden word/original page/demo consistently. | Fixed |
| F-1-17 | Links say “Open original page.” | Old ambiguous action is absent. | Fixed |
| F-1-18 | Demo action says “Exit demo and use my notes.” | It clears every `demo:` key before `/library`. | Fixed |
| F-1-19 | Hero and section both say all tools are free. | `free-tools` passed with no billing request or gate. | Fixed |
| F-1-20 | Build behavior is split into 16- and 10-word sentences. | README lines 64–65 contain the split copy. | Fixed |
| F-1-21 | Verification behavior is split into 11- and 12-word sentences. | README lines 69–70 contain the split copy. | Fixed |
| F-1-22 | Product copy uses “Chrome-compatible extension” and “web app”; Vite and WXT are each explained once for contributors. | README no longer uses the earlier unexplained release jargon. | Fixed |
| F-1-23 | All three fact descriptions are fully above the fold at both required sizes. | `@regression:first-screen` passed. | Fixed |

No earlier finding is unfixed, half-fixed, or regressed. F-2-1 through F-2-4 are newly identified issues.

## Structure, accessibility, privacy, and visual identity

- `/`, `/?demo=1`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` returned 200. Each has one h1, one main, `lang="en"`, a route-specific title, description, canonical URL, Open Graph/Twitter metadata, SVG favicon, and apple-touch icon.
- The titles follow the product/job pattern on Home and the route/product pattern elsewhere. Each is under 60 characters.
- An unknown URL returned HTTP 404 and the designed field-guide page with Home, Demo, My notes, Review, Privacy, Terms, factory attribution, and build identity.
- All 21 unique HTTP links discovered across the public routes returned 200; the two `mailto:` links were exempt. `robots.txt`, `sitemap.xml`, the manifest, and the extension ZIP also exist.
- Back/Forward restore the route, h1 focus, polite announcement, and stored scroll. The smooth restoration settled at 844 px after navigation from an 815 px sampled position.
- The live request log contained only same-origin HTML, JS, CSS, and product art. The CSP also restricts scripts, styles, and connections to self. No analytics, remote fonts, AI calls, Azure endpoint, provider key, or billing request was found.
- `/opt/fleet/lib/verify-url.sh` passed the live root. Live Axe scans at 390 × 844 and 1440 × 900 found zero serious or critical issues on Home, demo, library, review, privacy, terms, and 404.
- The field-guide palette, ruled paper, pressed-fern image, serif/sans typography, asymmetric layout, and clipped sheets are recognizably product-specific. It does not use a generic centered-gradient/feature-card SaaS treatment.
- The initial production JavaScript is 27,232 bytes raw and 9,388 bytes gzip.

## Full local verification

The clean clone produced these results:

- `npm test -- --reporter=line`: 52 passed, 2 intentional project duplicates skipped.
- `npm run typecheck`: passed.
- `npm run verify:deployment`: passed; valid 14,726-byte Manifest V3 ZIP and product-owned 404.
- All 13 claim commands: passed separately.

## Missed leverage and AI review

No additional product feature is an obvious omission. Bidirectional JSON transfer now connects the extension and web app; cloud sync would conflict with the local-first brief unless separately designed and consented to. The learner-authored gloss and deletion are deliberate parts of the learning task, so an AI-generated gloss is not necessary. No decorative AI feature or embedded provider key exists.

## What would make this perfect

Resolve F-2-1 through F-2-4: register or remove the web-app installability claim, register or narrow the settings-storage promise, delete “No. 01,” and make the sample label consistent. Then rerun every claim command and the complete cold mobile/desktop copy audit. With those four changes verified, nothing else identified in this review would remain.
