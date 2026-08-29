# Adversarial first-read review 1

**Product:** Reading Margin Recall  
**Live URL:** <https://reading-margin-recall.sociobot.in>  
**Reviewed repository commit:** `a84aa7b9102e3a9b005e2d1f203f78b6c53e7c7e`  
**Live product commit:** `47e669cdb764d5fbeec7dccc6e5c2e510418b8d3`  
**Date:** 2026-08-29  
**Verdict:** **FAIL**

There is one blocking demo defect, three material product/route defects, four unlisted claims, and fifteen copy/structure defects. A PASS requires zero findings.

The live commit and reviewed commit contain identical product code. The reviewed commit adds only `.factory/handoff.md` and `.factory/verification-7.md` after the deployed commit.

## First read before scrolling

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900. No prior storage was present and the page was not scrolled.

| Question | 390 px | Desktop | Evidence |
| --- | --- | --- | --- |
| What does it do? | Clear | Clear | “Save passages for later recall” and “selected sentences … become source-linked review notes.” |
| For whom? | Clear | Clear | “For language learners…” |
| What should I click first? | Clear | Clear | “Try it with sample data” is the primary action. |

The required three comprehension questions pass. The mobile viewport shows only the Private and Offline facts; the Price fact is below the fold. On desktop, all three facts begin at the 900 px viewport boundary and are not readable before scrolling. This separate first-screen structure failure is F-1-22.

## Findings

### Blocking

#### F-1-1 — The one-click demo does not show sample data in its first screen

- **Location/quote:** `/demo`, after selecting “Try it with sample data”: “Explore saved sample passages”, “These three sample notes use a separate demo store”, then the empty “New specimen” form.
- **Evidence:** At both 390 × 844 and 1440 × 900, no saved sample passage, gloss, hidden word, or review state is visible without scrolling. The first sample cards begin after the entire empty capture form. The earlier verification said the click “showed three” notes, but it did not check whether any note was in the first viewport.
- **Why this fails:** The demo contract requires the first screen after one click to already look like the product being used with realistic sample data. A new visitor instead sees an empty form and a claim that samples exist elsewhere.
- **Concrete fix:** Put a real sample review card directly below the demo heading and above the capture form, with its passage, gloss, hidden-word state, source, and a “Reveal sample answer” action visible at 390 × 844. Keep the full list and capture form below it. Add a viewport assertion that one seeded sample card is visible immediately after the landing-page click.

### Major

#### F-1-2 — The extension and web app are separate collections with no usable transfer path

- **Location/quote:** README: “Each part keeps its own local notes. Use JSON export and import when moving a collection between browsers.” Extension popup: “Open the separate web app.”
- **Evidence:** The web app exports/imports `localStorage` notes. The extension stores notes in `browser.storage.local` and its popup has no export or import control. Opening the web app therefore opens a different, empty collection; the README’s transfer instruction cannot be followed for extension notes.
- **Why this fails:** The brief describes one browser-extension-plus-PWA workflow. A normal user expects a passage captured by the extension to be reviewable or at least transferable to the web app. This is the obvious missing import/export leverage.
- **Concrete fix:** Add extension-side “Export notes as JSON” and “Import notes from JSON” actions using the same versioned schema as the PWA, or provide an explicit local handoff that requires user confirmation and no server. Add end-to-end tests for extension → PWA and PWA → extension transfer. Rewrite the README only after that path exists.

#### F-1-3 — Back/forward navigation loses scroll state and route changes are not announced in the live region

- **Location:** SPA navigation in `site/src/main.ts`; live Home → My notes → Back test.
- **Evidence:** Starting at `scrollY = 900`, opening My notes moved focus to its h1 and reset to `scrollY = 0`. Back focused the Home h1 but returned to `scrollY = 0`, not 900. After route navigation, `#announcer` was empty.
- **Why this fails:** The site-structure contract requires back/forward to restore scroll and focus and route changes to be announced through the polite live region. Focus works; scroll restoration and the live announcement do not.
- **Concrete fix:** Save scroll positions per history entry, restore them on `popstate`, and announce the new page heading in the persistent live region. Add a browser test that starts from a nonzero scroll position and asserts restored scroll, focused h1, and announced title after Back and Forward.

#### F-1-4 — The designed 404 does not use the site’s required header, footer, or metadata skeleton

- **Location/quote:** unknown live route; static `site/404.html`.
- **Evidence:** The live 404 correctly returns HTTP 404 and shows “We could not find this page”, but its header has no Demo/My notes/Review/Privacy navigation. Its footer has no Privacy, Terms, Param Factory, version, or build identity. It also lacks a meta description, canonical, Open Graph/Twitter metadata, and the apple-touch icon.
- **Why this fails:** The contract requires a consistent header and footer on every route and complete route metadata. The error page looks related to the product but is structurally incomplete.
- **Concrete fix:** Give `404.html` the same header navigation and full footer as product routes, plus a plain description, canonical error URL policy, OG/Twitter tags, and apple-touch icon. Extend the 404 regression test to assert these elements.

#### F-1-5 — “The demo loads three notes” is an unlisted claim

- **Location/quote:** landing action note: “The demo loads three notes.” README: “It loads three French, German, and Spanish sample notes.”
- **Why this fails:** A test happens to assert the count inside `@claim:demo-isolated`, but `.factory/claims.json` does not state the three-note seed claim. The claims contract requires the visitor-facing promise itself to be listed.
- **Concrete fix:** Change the `demo-isolated` claim text to “The demo loads three sample notes and demo changes never touch real notes,” retain the count/isolation assertions, and update `where` to include the README.

#### F-1-6 — The no-fetch/no-translation/no-bypass promise is unlisted

- **Location/quote:** landing privacy section: “It does not fetch books, translate pages, or bypass access controls.”
- **Why this fails:** `extension-selection` proves what selected text enters the dialog; it does not list or directly test these three negative promises.
- **Concrete fix:** Prefer the already tested rewrite: “The extension saves only the text you select.” Otherwise add a named claim and a request/content test for each retained behavior.

#### F-1-7 — The review-filter promise is not named in the claim entry

- **Location/quote:** landing: “Filter difficult notes” and “Review one source at a time.” README: “Difficult-note and source filters are available in every review.”
- **Why this fails:** `@claim:free-tools` exercises the two filters, but its registered claim only says tools are free. The behavior a visitor is promised is absent from the claim text.
- **Concrete fix:** Add a `review-filters` claim with the existing observable filter assertions, or expand and rename the existing claim so its claim text explicitly covers both filters and free access.

#### F-1-8 — The README’s omitted-feature promise is unlisted

- **Location/quote:** README: “No automatic translation, OCR, book catalog, sync account, or content scraping is included.”
- **Why this fails:** This is useful scope information, but it is still a visitor-reliant claim and has no claims entry.
- **Concrete fix:** Rewrite it as the positive, testable workflow: “You write the gloss and choose the hidden word yourself. Import only the passages you choose.” Add those behaviors to `source-linked-capture`, or add a static boundary test if the negative list is retained.

### Minor

#### F-1-9 — “A private field guide for words” is a metaphorical slogan

- **Location/quote:** landing eyebrow above the h1.
- **Why this fails:** It does not add usable information and relies on brand lore.
- **Concrete fix:** “Private review notes for language learners.”

#### F-1-10 — “its path home” is a metaphor

- **Location/quote:** hero-art caption: “Keep the sentence, your gloss, and its path home.”
- **Why this fails:** “Path home” hides the concrete source-link behavior.
- **Concrete fix:** “Each note keeps the passage, your gloss, and the original page link.”

#### F-1-11 — “From margin to memory” is a mood heading

- **Location/quote:** eyebrow above “How it works”.
- **Why this fails:** It adds no information and would make little sense in a headings list.
- **Concrete fix:** Delete it; “How it works” already names the section.

#### F-1-12 — “A narrow, honest tool” is untestable marketing copy

- **Location/quote:** eyebrow above the privacy section.
- **Why this fails:** “Honest” is self-praise, and “narrow” does not name the section.
- **Concrete fix:** “What the extension stores.”

#### F-1-13 — “Your reading stays yours” is vague privacy copy

- **Location/quote:** landing privacy h2.
- **Why this fails:** It does not say whether the product stores, sends, or republishes reading data.
- **Concrete fix:** “Your notes stay on this device.”

#### F-1-14 — “Everything included” does not name its section

- **Location/quote:** eyebrow above the free-tools section.
- **Why this fails:** It is generic and gives no useful context.
- **Concrete fix:** “Free review tools.”

#### F-1-15 — “Focus each review” does not describe the section

- **Location/quote:** landing h2 above filters and JSON backup.
- **Why this fails:** The section is about filters, price, and backups, not the abstract idea of focus.
- **Concrete fix:** “Filter and back up your notes.”

#### F-1-16 — “specimen”, “field log”, and “private margin” conflict with the product’s own note terminology

- **Location/quote:** “Specimen 03”, “New specimen”, “Local field log”, and “Your private margin”; elsewhere the same records are “notes” and “saved passages”.
- **Why this fails:** Decorative taxonomy makes the saved object harder to name and violates the declared terminology table (`note`, `passage`, `gloss`, `hidden word`, `source`, `demo`).
- **Concrete fix:** Use “Sample note 3”, “New review note”, “Saved notes”, and “Your saved notes”. Reserve “passage” for the selected source text inside a note.

#### F-1-17 — “Open source” is ambiguous action copy

- **Location/quote:** landing preview and saved-note cards: “Open source”.
- **Why this fails:** It can mean source code rather than the note’s original page, so it does not name the result unambiguously.
- **Concrete fix:** “Open original page.”

#### F-1-18 — “Start for real” does not name the result of leaving the demo

- **Location/quote:** demo banner button.
- **Why this fails:** It does not tell the visitor that demo data will be discarded and the real notes screen will open.
- **Concrete fix:** “Exit demo and use my notes.”

#### F-1-19 — “Core tools are free” conflicts with “Every tool is free”

- **Location/quote:** first-screen fact “Core tools are free”; later “Every tool is free to use.”
- **Why this fails:** “Core” implies that some tools may be paid, while the later claim says none are.
- **Concrete fix:** Use “All tools are free” in both places.

#### F-1-20 — A README build sentence is 41 words

- **Location/quote:** “`npm run build` and `npm run build:site` both build the WXT extension, package its zip, write the complete static deployment to `dist/site`, and verify that the exact deployment root contains the installer, matching build receipt, and product 404 configuration.”
- **Why this fails:** It exceeds the 22-word hard cap and combines build output with verification behavior.
- **Concrete fix:** “`npm run build` and `npm run build:site` create the extension ZIP and static site in `dist/site`. They also verify the installer, build receipt, and 404 configuration.”

#### F-1-21 — A README verification sentence is 24 words

- **Location/quote:** “It also proves the live receipt names the pushed candidate commit, then checks the live HTTP 404, product headers, request privacy, and Axe results.”
- **Why this fails:** It exceeds the 22-word hard cap and combines unrelated checks.
- **Concrete fix:** “The command confirms that the live receipt names the deployed commit. It then checks the 404 page, headers, request privacy, and Axe results.”

#### F-1-22 — Unexplained build jargon makes the README harder to use

- **Location/quote:** “Manifest V3”, “PWA”, “WXT”, “Vite-only step”, “live release gate”, and “same-origin build receipt”.
- **Why this fails:** The README never defines these terms. A user trying the product does not need most of them; a contributor needs a short explanation.
- **Concrete fix:** Use “Chrome-compatible extension” and “installable web app” in the product overview. In Develop, state once: “Vite builds the web app. WXT builds the extension.” Replace “live release gate” with “deployed-site checks” and “same-origin build receipt” with “build record served by this site”.

#### F-1-23 — The first screen does not show all three required plain facts

- **Location/quote:** first-screen facts “Private”, “Offline”, and “Price”.
- **Evidence:** At 390 × 844, Price is below the fold. At 1440 × 900, all fact headings begin at the viewport boundary.
- **Why this fails:** The mandatory first-screen shape requires all three privacy/offline/price facts before scrolling.
- **Concrete fix:** Reduce hero vertical spacing and headline height, or move the three facts beside the action note. Add viewport tests at both required sizes asserting all three fact rows intersect the viewport by more than a token edge.

## Demo and sandbox verification

- One click from Home opens `/demo`.
- The persistent banner reads “Demo — sample data, nothing is saved to your notes” and includes Reset demo and Start for real.
- Three realistic French, German, and Spanish notes are seeded under `demo:rmr:notes`.
- A seeded `rmr:notes` real-data sentinel remained byte-for-byte unchanged after entering demo, resetting, and leaving.
- Reset restored three samples. Start for real removed every `demo:` key and opened `/library`.
- The live landing/demo flow requested only the product origin. The registered local privacy test also passed a complete demo capture flow with no cross-origin request.
- F-1-1 remains blocking because the seeded records are below the first viewport.

## Claims audit

Every exact command in `.factory/claims.json` was run separately after `npm ci` in a clean clone of commit `a84aa7b9102e3a9b005e2d1f203f78b6c53e7c7e`.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `source-linked-capture` | PASS | Saved passage, gloss, deletion, and source URL rendered. |
| `extension-selection` | PASS | Installed MV3 extension captured only selected text. |
| `demo-isolated` | PASS | Real namespace survived reset/exit; demo namespace was removed. |
| `local-only` | PASS | Complete demo capture flow made no cross-origin request. |
| `offline-reload` | PASS | Demo reloaded offline with all three notes. |
| `json-backup` | PASS | Three-note export downloaded; one-note backup restored. |
| `keyboard-review` | PASS | Space revealed; `3` graded. |
| `free-tools` | PASS | Filters worked without sign-in, license gate, or cross-origin request. |
| `delete-notes` | PASS | Saved note disappeared from UI and storage. |
| `extension-download` | PASS | Built ZIP was nonempty, byte-matched, valid, and MV3. |
| `http-source-links` | PASS | `javascript:` was rejected and never rendered as a link. |

No listed claim test failed. F-1-5 through F-1-8 are claim-like live/README statements whose wording is not represented in the claims registry.

## Landing-page copy audit

Counts treat hyphenated terms, contractions, and version strings as one word. Repeated navigation/footer labels are listed once. The table includes headings, actions, labels, captions, and status copy so the non-sentence flags are visible. No landing sentence exceeds 22 words and no banned word appears.

| Copy unit | Words | Audit |
| --- | ---: | --- |
| Skip to main content | 4 | Clear |
| Reading Margin Recall | 3 | Product name |
| Demo | 1 | Clear nav label |
| My notes | 2 | Clear nav label |
| Review | 1 | Clear nav label |
| Privacy | 1 | Clear nav label |
| A private field guide for words | 6 | F-1-9 |
| Save passages for later recall | 5 | Clear job headline |
| For language learners who want selected sentences to become source-linked review notes. | 12 | Clear |
| Try it with sample data | 5 | Clear primary action |
| Add my first passage | 4 | Clear action |
| The demo loads three notes. | 5 | F-1-5 |
| Your real notes stay untouched. | 5 | Listed claim |
| Private | 1 | Clear fact label |
| Stays on this device | 4 | Listed claim |
| Offline | 1 | Clear fact label |
| Works after the first visit | 5 | Listed claim |
| Price | 1 | Clear fact label |
| Core tools are free | 4 | F-1-19 |
| Keep the sentence, your gloss, and its path home. | 9 | F-1-10 |
| Specimen 03 · due today | 4 | F-1-16 |
| Live review preview | 3 | Clear |
| Recall the missing word | 4 | Clear |
| La vie est une fleur dont l’amour est le _____. | 9 | Realistic sample content |
| Your gloss: Life is a flower whose honey is love. | 10 | Clear sample content |
| Reveal it in the demo | 5 | Result-naming action |
| Open source | 2 | F-1-17 |
| From margin to memory | 4 | F-1-11 |
| How it works | 3 | Clear section heading |
| Select a sentence | 3 | Clear |
| Highlight only the text you own or can read. | 9 | Clear |
| Add your gloss | 3 | Clear |
| Choose one word to hide during review. | 7 | Clear |
| Recall, then return | 3 | Clear |
| Grade your answer and open the original page. | 8 | Clear |
| A narrow, honest tool | 4 | F-1-12 |
| Your reading stays yours | 4 | F-1-13 |
| The extension captures only text you select. | 7 | Listed claim |
| It does not fetch books, translate pages, or bypass access controls. | 11 | F-1-6 |
| Read the privacy details | 4 | Clear link |
| No account | 2 | Listed claim |
| No tracking scripts | 3 | Listed claim |
| JSON backup and restore | 4 | Listed claim |
| Delete any note | 3 | Listed claim |
| Free | 1 | Clear fact |
| All tools | 2 | Clear fact |
| Everything included | 2 | F-1-14 |
| Focus each review | 3 | F-1-15 |
| Every tool is free to use. | 6 | Listed claim |
| No account or subscription is required. | 6 | Listed claim |
| Filter difficult notes | 3 | F-1-7 |
| Review one source at a time | 6 | F-1-7 |
| Export and import JSON backups | 5 | Listed claim |
| Source-linked recall notes for language learners. | 6 | Clear footer description |
| Terms | 1 | Clear link |
| Built by Param Factory | 4 | Clear external link |
| v1.0.0 · Original generated field-guide artwork | 5 | Clear provenance/build line |
| Back online. | 2 | Clear status |

## README copy audit

Code-block commands are excluded because they are shell syntax, not sentences. Headings and list items are included as copy units. No banned word appears.

| Copy unit | Words | Audit |
| --- | ---: | --- |
| Reading Margin Recall | 3 | Product name |
| Turn selected passages into private, source-linked review notes. | 8 | Clear |
| Reading Margin Recall is for language learners reading their own ebooks and web articles. | 14 | Clear |
| Select one sentence, add your gloss, choose a hidden word, and review it later. | 14 | Clear |
| Every note keeps a link to its original page. | 9 | Clear |
| The product has two parts: | 5 | Clear |
| A Manifest V3 browser extension captures selected text on any normal web page. | 13 | F-1-22 |
| A local PWA provides capture, review, JSON backup, and the one-click demo. | 12 | F-1-22 |
| Each part keeps its own local notes. | 7 | Clear boundary |
| Use JSON export and import when moving a collection between browsers. | 11 | F-1-2 |
| Reading notes stay in browser storage. | 6 | Listed claim |
| Capture and review make no third-party requests. | 7 | Listed claim |
| The installed PWA works offline after its first visit. | 9 | F-1-22; listed claim |
| The demo uses separate `demo:` storage and never touches real notes. | 11 | Listed claim |
| Try the demo | 3 | Clear heading |
| Open `/demo`, or visit the live demo. | 7 | Clear |
| It loads three French, German, and Spanish sample notes. | 9 | F-1-5 |
| Use Reset demo to restore them. | 6 | Clear action |
| Use Start for real to discard the demo data. | 9 | F-1-18 |
| Install the extension | 3 | Clear heading |
| After a production build: | 4 | Clear |
| Open `chrome://extensions` in Chrome or another Chromium browser. | 9 | Clear |
| Turn on Developer mode. | 4 | Clear |
| Choose Load unpacked and select `.output/chrome-mv3`. | 7 | Clear |
| Select text on a web page, then choose Save passage. | 10 | Clear |
| Open the extension to reveal and grade the note. | 9 | Clear |
| The packaged download is written to `dist/site/downloads/reading-margin-recall-chrome.zip`. | 11 | Listed claim |
| Develop | 1 | Clear heading |
| Requirements: Node.js 22 and npm. | 6 | Clear |
| `npm run build` and `npm run build:site` both build the WXT extension, package its zip, write the complete static deployment to `dist/site`, and verify that the exact deployment root contains the installer, matching build receipt, and product 404 configuration. | 41 | F-1-20 and F-1-22 |
| The Vite-only step is private to the release assembler. | 9 | F-1-22 |
| `npm run deploy:site` deploys `dist/site`, never its parent, and fails unless the live release gate passes. | 18 | F-1-22 |
| `npm run verify:live` compares the deployed script, stylesheet, extension ZIP, and same-origin build receipt with that build. | 18 | F-1-22 |
| It also proves the live receipt names the pushed candidate commit, then checks the live HTTP 404, product headers, request privacy, and Axe results. | 24 | F-1-21 and F-1-22 |
| Product behavior | 2 | Clear heading |
| Space reveals a review answer. | 5 | Listed claim |
| Keys 1–4 grade recall. | 5 | Listed claim |
| JSON export includes every note. | 5 | Listed claim |
| JSON import restores a backup. | 5 | Listed claim |
| Source links accept only `http:` and `https:` addresses. | 8 | Listed claim |
| Every tool is free to use. | 6 | Listed claim |
| No account or subscription is required. | 6 | Listed claim |
| Difficult-note and source filters are available in every review. | 9 | F-1-7 |
| No automatic translation, OCR, book catalog, sync account, or content scraping is included. | 13 | F-1-8 |
| Privacy and terms | 3 | Clear heading |
| The site includes `/privacy` and `/terms`. | 6 | Confirmed structure |
| Reading notes and settings stay in browser storage. | 8 | Listed claim |
| Repository map | 2 | Clear heading |
| `entrypoints/` — WXT content script and popup | 6 | F-1-22 |
| `site/` — static PWA and public metadata | 6 | F-1-22 |
| `shared/` — note model and recall scheduling | 6 | Clear |
| `tests/` — Playwright claim and quality checks | 6 | Technical but clear in context |
| `.factory/` — brief, visual thesis, claim contract, demo guide, copy audit, and handoff | 12 | Technical but clear in context |
| Licensed under the MIT License. | 5 | Confirmed by `LICENSE` |

## Structure, accessibility, privacy, and visual checks

- `/`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` returned 200. Each had the expected route title, one h1, one main, description, canonical URL, OG/Twitter tags, and favicons.
- A fresh unknown path returned the product-owned HTTP 404 with CSP, HSTS, nosniff, referrer, and permissions headers. F-1-4 covers its incomplete skeleton/metadata.
- All discovered internal routes, the extension ZIP, all three sample-source links, and the Param Factory link returned 200 after redirects. `mailto:` links were exempt.
- `robots.txt` and `sitemap.xml` exist; the sitemap lists all six public product routes.
- The full pinned Playwright suite passed: 44 passed, 2 intentional mobile duplicates skipped. Its Axe checks found no serious or critical violations on all routes, mobile routes, dark mode, the extension popup, and the built 404.
- The standalone Axe CLI could not run because its automatically selected ChromeDriver 152 did not match the pinned Chromium 145. The repository’s pinned `@axe-core/playwright` 4.10.2 integration supplied the Axe evidence instead.
- `/opt/fleet/lib/verify-url.sh` passed the live root: title, `lang=en`, one h1, main, image alt text, named buttons, and no console errors.
- At 390 px, automated checks found no horizontal overflow, text below 16 px, or controls below 44 × 44 px. Reduced motion and visible keyboard focus passed.
- The live root and demo load only same-origin HTML, JS, CSS, and product imagery. No analytics, remote fonts, third-party scripts, AI endpoint, or embedded provider key was found.
- The initial JavaScript bundle is 24,536 bytes (8,850 bytes gzip), below the product limit.
- The botanical field-guide palette, asymmetric notebook layout, paper texture, serif/sans pairing, generated original art, and specimen shapes are recognizably product-specific rather than a generic SaaS template. F-1-9 through F-1-16 concern copy clarity, not lack of visual identity.

## Earlier finding verification

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The prior handoff summarizes five verification-6 findings; each was checked live and in code.

| Earlier finding | Live confirmation | Code confirmation | Result |
| --- | --- | --- | --- |
| Extension installer missing | HTTP 200 `application/zip`, 13,734 bytes, expected SHA-256 | Build assembles ZIP in `dist/site/downloads/` | Fixed |
| Candidate receipt missing | `/build-info.json` returns 200 and identifies deployed commit `47e669c…` | Build writes and deployment verifier validates receipt | Fixed |
| Generic Azure 404 | Unknown path returns branded 958-byte product 404 and product security headers | `responseOverrides.404` rewrites to `/404.html` | Fixed; stricter skeleton issue is F-1-4 |
| Mobile targets below 44 px | Seven-route 390 px audit found none | Regression test covers all visible controls | Fixed |
| Mobile text below 16 px | Seven-route 390 px audit found none | Regression test covers all visible direct text | Fixed |

The live gate passes for deployed product commit `47e669c…` in the previous verification. Running it from current commit `a84aa7b…` rejects the receipt because `a84aa7b…` is an undeployed documentation-only commit; the product-code diff is empty. This is recorded as provenance, not a product finding.

## Missed leverage and AI review

F-1-2 is the missed-leverage finding: local JSON transfer between the extension and PWA is the obvious useful addition implied by the two-part product. Cloud sync is not required and would weaken the local-first model.

No AI feature is needed for the brief’s user-written gloss and deletion workflow. No decorative AI control, external AI call, Azure credential, or embedded provider key was found.

## What would make this perfect

Resolve every finding above. Most importantly, put an actionable sample note in the first demo viewport, provide a tested local transfer path between the extension and PWA, complete the 404 skeleton, restore history scroll and live announcements, register or remove every remaining claim, and replace every metaphorical or ambiguous label with the proposed plain wording. Then rerun the cold 390 px/desktop review, every claim command, the full suite, link crawl, request log, and route metadata audit from scratch.
