# Adversarial first-read review 4

- **Product:** Reading Margin Recall
- **Live URL:** <https://reading-margin-recall.sociobot.in>
- **Reviewed repository commit:** `9ab604d0841e39d94cdd797df78589f64d641d7e`
- **Live product receipt:** `f68aabd6dfa0c3e3cd7c7ac55a1d3431265500c1`
- **Date:** 2026-08-29
- **Verdict:** **FAIL**

Two unlisted privacy claims remain. No registered claim test failed, no earlier finding regressed, and no blocking product defect was reproduced. A PASS still requires zero findings and no untested claim.

The repository differs from the live receipt only in `.factory/handoff.md` and `.factory/verification-10.md`. `git diff f68aabd..9ab604d` contains no product, test, dependency, or build change.

## First read before scrolling

Fresh Chromium contexts opened Home at 390 × 844 and 1440 × 900. Storage was empty, the service worker was blocked for the cold read, and the page was not scrolled.

| Question | Answer in my own words | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | It saves selected reading passages as notes for later word recall. | “Save passages for later recall” and “selected sentences … become source-linked review notes.” |
| For whom? | Language learners. | “Private review notes for language learners” and “For language learners…” |
| What should I click first? | Open the ready-made example. | “Try it with sample data” is the filled primary action. |

All three answers were clear at both sizes. The primary action and the Private, Offline, and Price facts were fully visible before scrolling. No blocking first-screen finding applies.

## Findings

### Major

#### F-4-1 — “No tracking scripts” is an unlisted privacy claim

- **Exact quote/location:** Home, “What the extension stores” list: “No tracking scripts”.
- **Why this fails:** A visitor can rely on this as a privacy promise, but no `.factory/claims.json` entry says that tracking scripts are absent. `local-only` records cross-origin requests during named flows. That does not detect a same-origin tracking script, beacon, cookie, or local identifier. Code inspection and this review’s request log found no tracker, but the claims contract requires the promise itself to be registered and directly tested.
- **Concrete fix:** Either remove the line, or expand `local-only` to say “No tracking scripts load.” Add an assertion that the built page loads only the expected application script, sets no tracking cookie or identifier, invokes no beacon, and sends no analytics request while all public routes and the complete demo flow are exercised.

#### F-4-2 — The bulk-deletion promise is unlisted and does not distinguish web-app data from extension data

- **Exact quote/location:** `/privacy`, “Delete your data”: “Clearing this site’s browser storage removes everything.”
- **Why this fails:** No claim entry or claim test clears site storage and verifies the result. “Everything” can also make a reader think extension notes are removed, but extension notes use a separate `browser.storage.local` store. The registered `delete-notes` test covers deleting one web-app note, not this broader deletion path.
- **Concrete fix:** Rewrite it as: “Clear this site’s data to remove web-app notes and color settings. Delete extension notes from the extension separately.” Register that exact behavior and test it with seeded web-app and extension stores, confirming that clearing site data removes only the web-app keys.

There are no blocking findings. The verdict remains FAIL because the required standard is zero findings.

## Landing-page copy audit

Counts are whitespace-delimited; hyphenated terms and contractions count as one word. The table includes headings, controls, labels, accessible qualifiers, alt text, and conditional status copy. No unit exceeds 22 words, uses a banned marketing adjective, changes product terminology, relies on metaphor, or uses a non-result-naming action. F-4-1 is the only landing-copy claim gap.

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Reading Margin Recall | 3 | Product name |
| Demo | 1 | Pass navigation label |
| My notes | 2 | Pass navigation label |
| Review | 1 | Pass navigation label |
| Privacy | 1 | Pass navigation label |
| Change color theme | 3 | Pass action |
| Private review notes for language learners | 6 | Pass audience label |
| Save passages for later recall | 5 | Pass job headline |
| For language learners who want selected sentences to become source-linked review notes. | 12 | Pass |
| Try it with sample data | 5 | Pass action |
| Add my first passage | 4 | Pass action |
| The demo loads three sample notes. | 6 | Pass; `demo-isolated` |
| Your real notes stay untouched. | 5 | Pass; `demo-isolated` |
| Private | 1 | Pass fact label |
| Stays on this device | 4 | Pass; `local-only` |
| Offline | 1 | Pass fact label |
| Works after the first visit | 5 | Pass; `offline-reload` |
| Price | 1 | Pass fact label |
| All tools are free | 4 | Pass; `free-tools` |
| An open field notebook connects a sentence slip with a pressed fern and recall mark. | 15 | Pass alt text |
| Each note keeps the passage, your gloss, and the original page link. | 12 | Pass; `source-linked-capture` |
| Sample note 1 · due today | 5 | Pass; matches the demo |
| Live review preview | 3 | Pass section label |
| Recall the missing word | 4 | Pass heading |
| La vie est une fleur dont l’amour est le _____. | 10 | Real sample content |
| Your gloss: Life is a flower whose honey is love. | 10 | Pass sample content |
| Reveal it in the demo | 5 | Pass action |
| Open original page (external) | 4 | Pass action and qualifier |
| How it works | 3 | Pass heading |
| Select a sentence | 3 | Pass heading |
| Highlight only the text you own or can read. | 9 | Pass instruction |
| Add your gloss | 3 | Pass heading |
| Choose one word to hide during review. | 7 | Pass instruction |
| Recall, then return | 3 | Pass heading |
| Grade your answer and open the original page. | 8 | Pass instruction |
| What the extension stores | 4 | Pass section label |
| Your notes stay on this device | 6 | Pass; `local-only` |
| The extension saves only the text you select. | 8 | Pass; `extension-selection` |
| Read the privacy details | 4 | Pass action |
| No account | 2 | Pass; `free-tools` |
| No tracking scripts | 3 | **F-4-1: unlisted claim** |
| JSON backup and restore | 4 | Pass; `json-backup` |
| Delete any note | 3 | Pass; `delete-notes` |
| Free | 1 | Pass label |
| All tools | 2 | Pass label |
| Free review tools | 3 | Pass section label |
| Filter and back up your notes | 6 | Pass heading |
| All tools are free to use. | 6 | Pass; `free-tools` |
| No account or subscription is required. | 6 | Pass; `free-tools` |
| Filter difficult notes | 3 | Pass; `review-filters` |
| Review one source at a time | 6 | Pass; `review-filters` |
| Export and import JSON backups | 5 | Pass; `json-backup`, `json-transfer` |
| Source-linked recall notes for language learners. | 6 | Pass footer description |
| Terms | 1 | Pass navigation label |
| Built by Param Factory (external) | 5 | Pass attribution |
| v1.0.0 · Original generated field-guide artwork | 5 | Pass provenance |
| Offline · saved notes still work | 5 | Pass conditional status; `offline-reload` |
| Back online. | 2 | Pass conditional status |

## README copy audit

Shell commands inside the fenced block are syntax rather than sentences and are not counted. Every heading and prose/list unit is included. No unit exceeds 22 words. Technical terms occur only in contributor instructions, and Vite and WXT are defined where introduced.

| Copy unit | Words | Result |
| --- | ---: | --- |
| Reading Margin Recall | 3 | Product name |
| Turn selected passages into private, source-linked review notes. | 8 | Pass |
| Reading Margin Recall is for language learners reading their own ebooks and web articles. | 14 | Pass |
| Select one sentence, add your gloss, choose a hidden word, and review it later. | 14 | Pass |
| Every note keeps a link to its original page. | 9 | Pass; `source-linked-capture` |
| The product has two parts: | 5 | Pass |
| A Chrome-compatible extension captures selected text from a web page. | 10 | Pass; `extension-selection` |
| An installable web app provides capture, review, JSON backup, and the one-click demo. | 13 | Pass; registered behavior claims |
| Each part keeps its own local notes. | 7 | Pass; `local-only`, `extension-selection` |
| Export a JSON backup from either part, then import it into the other. | 13 | Pass; `json-transfer` |
| Reading notes and color settings stay in browser storage. | 9 | Pass; `local-only` |
| Capture, review, JSON export, and demo Reset or Exit make no third-party requests. | 13 | Pass; exact `local-only` claim |
| The installed web app works offline after its first visit. | 10 | Pass; `pwa-installable`, `offline-reload` |
| The demo uses separate `demo:` storage and never touches real notes. | 11 | Pass; `demo-isolated` |
| Try the demo | 3 | Pass heading |
| Open `/?demo=1`, or visit the live demo. | 7 | Pass instruction |
| It loads three French, German, and Spanish sample notes. | 9 | Pass; `demo-isolated` |
| Use Reset demo to restore them. | 6 | Pass instruction |
| Use Exit demo and use my notes to discard the demo data. | 12 | Pass instruction |
| Install the extension | 3 | Pass heading |
| After a production build: | 4 | Pass contributor context |
| Open `chrome://extensions` in Chrome or another Chromium browser. | 8 | Pass instruction |
| Turn on Developer mode. | 4 | Pass instruction |
| Choose Load unpacked and select `.output/chrome-mv3`. | 6 | Pass instruction |
| Select text on a web page, then choose Save passage. | 10 | Pass instruction |
| Open the extension to reveal and grade the note. | 9 | Pass instruction |
| The packaged download is written to `dist/site/downloads/reading-margin-recall-chrome.zip`. | 7 | Pass; `extension-download` |
| Move notes between both parts | 5 | Pass heading |
| Choose Export notes as JSON in the extension. | 8 | Pass instruction |
| Open My notes in the web app and choose Import JSON. | 11 | Pass instruction |
| To move notes back, export from the web app and import the file in the extension. | 16 | Pass; `json-transfer` |
| Develop | 1 | Pass heading |
| Requirements: Node.js 22 and npm. | 5 | Pass contributor context |
| Vite builds the web app. | 5 | Pass; tool is defined |
| WXT builds the extension. | 4 | Pass; tool is defined |
| `npm run build` and `npm run build:site` create the extension ZIP and static site in `dist/site`. | 16 | Pass contributor instruction |
| They also verify the installer, build record, and 404 configuration. | 10 | Pass contributor instruction |
| The web-app-only build step is private to the release assembler. | 10 | Pass contributor boundary |
| `npm run deploy:site` deploys `dist/site` and then runs deployed-site checks. | 10 | Pass contributor instruction |
| `npm run verify:live` compares the deployed assets, extension ZIP, and site-served build record with the local build. | 17 | Pass contributor instruction |
| The command confirms that the live receipt names the deployed commit. | 11 | Pass contributor instruction |
| It then checks the 404 page, headers, request privacy, and Axe results. | 12 | Pass contributor instruction |
| Product behavior | 2 | Pass heading |
| Space reveals a review answer. | 5 | Pass; `keyboard-review` |
| Keys 1–4 grade recall. | 4 | Pass; `keyboard-review` |
| JSON export includes every note. | 5 | Pass; `json-backup` |
| JSON import restores a backup. | 5 | Pass; `json-backup` |
| Source links accept only `http:` and `https:` addresses. | 8 | Pass; `http-source-links` |
| All tools are free to use. | 6 | Pass; `free-tools` |
| No account or subscription is required. | 6 | Pass; `free-tools` |
| Filters show difficult notes or notes from one source. | 9 | Pass; `review-filters` |
| You write the gloss and choose the hidden word yourself. | 10 | Pass; `source-linked-capture` |
| Import only the passages you choose. | 6 | Pass; `extension-selection`, `json-transfer` |
| Privacy and terms | 3 | Pass heading |
| The site includes `/privacy` and `/terms`. | 6 | Pass structure statement |
| Reading notes and settings stay in browser storage. | 8 | Pass; `local-only` |
| Repository map | 2 | Pass heading |
| `entrypoints/` — extension capture and review screens | 6 | Pass contributor context |
| `site/` — web app and public page files | 7 | Pass contributor context |
| `shared/` — note model and recall scheduling | 6 | Pass contributor context |
| `tests/` — browser claim and quality checks | 6 | Pass contributor context |
| `.factory/` — product brief, visual thesis, claims, demo guide, copy audit, and handoff | 12 | Pass contributor context |
| Licensed under the MIT License. | 5 | Pass |

Terminology is otherwise consistent: a saved item is a **note**; selected source text is a **passage**; the learner’s explanation is a **gloss**; recalled text is the **hidden word**; the source is the **original page**; isolated sample mode is the **demo**.

## Demo and sandbox verification

- One click on “Try it with sample data” opened `/?demo=1` at both review widths.
- The first demo screen showed a French cloze passage, learner gloss, source, and “Reveal sample answer” action. The reveal control ended at 804 px in the 844 px viewport.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed Reset and Exit actions.
- The three notes are realistic French, German, and Spanish records with glosses, hidden words, review history, and public source URLs.
- Reveal showed `miel`. Reset hid it again and restored exactly three samples.
- A seeded `rmr:notes` sentinel remained byte-for-byte unchanged through reveal, capture, review grading, JSON export, Reset, and Exit.
- Demo capture created a fourth note only in `demo:rmr:notes`. Reset restored the three bundled notes. Exit removed all `demo:` note/theme keys and kept the real sentinel.
- After the service worker controlled the page, the demo reloaded offline with three notes.
- The complete live flow made zero cross-origin requests and logged zero console or page errors.

The one-click demo, Reset behavior, real-data isolation, and offline behavior pass. No blocking demo finding applies.

## Claims audit

Every exact command in `.factory/claims.json` ran separately after `npm ci` in clean clone `/tmp/rmr-review4-clean-wFgf4r` at `9ab604d0841e39d94cdd797df78589f64d641d7e`. Each registered ID appears in exactly one tagged test.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `source-linked-capture` | PASS | Saved passage, gloss, hidden word, source title, and source URL rendered. |
| `extension-selection` | PASS | A built extension captured only selected page text into its own store. |
| `demo-isolated` | PASS | Three multilingual notes loaded; Reset and Exit preserved the real namespace. |
| `local-only` | PASS | Notes/theme keys stayed separated; capture, review, export, Reset, and Exit made no third-party request. |
| `pwa-installable` | PASS | Manifest, standalone display, `/library` start URL, icons, and controlling service worker passed. |
| `offline-reload` | PASS | The controlled demo reloaded offline with all three notes. |
| `json-backup` | PASS | Three notes exported and a one-note backup restored. |
| `keyboard-review` | PASS | Space revealed and key `3` graded the answer. |
| `free-tools` | PASS | Capture, review, backup, and source tools had no sign-in, license gate, or billing request. |
| `review-filters` | PASS | Difficulty and source filters returned only matching notes. |
| `json-transfer` | PASS | Extension → web and web → extension transfers passed in separate clean profiles. |
| `delete-notes` | PASS | The selected note disappeared from the page and storage. |
| `extension-download` | PASS | The ZIP was nonempty, byte-matched, valid, and Manifest V3. |
| `http-source-links` | PASS | A `javascript:` URL produced an accessible error and no executable link. |

No listed claim test failed. F-4-1 and F-4-2 are claim-like live statements absent from the registry.

## Earlier finding verification

Every finding in reviews 1–3 and every closure row in polish 1–3 was checked against the deployed site and current source/tests.

| Earlier ID | Live confirmation | Code/test confirmation | Result |
| --- | --- | --- | --- |
| F-1-1 | The first demo viewport contains the sample passage, gloss, source label, and reveal control. | `demoSample()` precedes the form; `@regression:first-screen` passed. | Fixed |
| F-1-2 | Extension and web app expose JSON transfer in both directions. | `@claim:json-transfer` passed with two clean profiles. | Fixed |
| F-1-3 | Back restored Home to 900 px; Back/Forward focused h1 and announced the route. | History state and `popstate` restoration remain; regression passed. | Fixed |
| F-1-4 | The live HTTP 404 has common navigation, legal footer, metadata, icons, and Return home. | `site/404.html` and the built-404 regression passed. | Fixed |
| F-1-5 | Home and demo state and show three sample notes. | `demo-isolated` names and asserts the count and languages. | Fixed |
| F-1-6 | Home uses only the selected-text claim. | `extension-selection` passed; the old negative promise is absent. | Fixed |
| F-1-7 | Difficult-note and source filters work live. | `review-filters` is registered and passed. | Fixed |
| F-1-8 | README states the manual gloss, hidden-word, and chosen-passage workflow. | Capture and extension-selection tests cover it. | Fixed |
| F-1-9 | The hero audience label is plain and specific. | The old field-guide slogan is absent. | Fixed |
| F-1-10 | The caption names the original page link. | “Path home” is absent. | Fixed |
| F-1-11 | “How it works” stands alone. | The mood heading is absent. | Fixed |
| F-1-12 | The privacy section names what the extension stores. | The adjective-led label is absent. | Fixed |
| F-1-13 | The heading says notes stay on this device. | `local-only` covers the note-storage promise. | Fixed |
| F-1-14 | The section label is “Free review tools.” | The generic label is absent. | Fixed |
| F-1-15 | The section heading names filtering and backup. | Both behaviors have registered passing tests. | Fixed |
| F-1-16 | Saved objects are consistently called notes. | Note/passage/gloss/hidden word/original page/demo remain distinct. | Fixed |
| F-1-17 | Source actions say “Open original page.” | The ambiguous “Open source” action is absent. | Fixed |
| F-1-18 | Exit names its result and opens real notes. | Exit clears every `demo:` key; isolation test passed. | Fixed |
| F-1-19 | Both price statements say all tools are free. | `free-tools` passed without an account or billing path. | Fixed |
| F-1-20 | The README build explanation is split into 16- and 10-word sentences. | Current copy audit passes. | Fixed |
| F-1-21 | The verification explanation is split into 11- and 12-word sentences. | Current copy audit passes. | Fixed |
| F-1-22 | Product copy uses extension/web-app wording; contributor tools are defined. | Current README contains no unexplained product-facing release jargon. | Fixed |
| F-1-23 | The primary action and three facts fit both required first screens. | Live bounds and first-screen regression passed. | Fixed |
| F-2-1 | The README still names the installable web app. | `pwa-installable` verifies manifest, icons, start URL, display, and worker. | Fixed |
| F-2-2 | Notes and color settings are named as browser-local. | Expanded `local-only` verifies both real/demo theme namespaces. | Fixed |
| F-2-3 | The decorative “No. 01” is absent. | The pseudo-element and text are absent from source. | Fixed |
| F-2-4 | Home and demo both label the Hugo record “Sample note 1.” | The strings match; first-screen regression passed. | Fixed |
| F-3-1 | Privacy now uses the positive selected-text statement only. | Exact `extension-selection` claim/test passed. | Fixed |
| F-3-2 | Privacy and README use the exact named no-third-party-request flow. | Expanded `local-only` exercises capture, review, export, Reset, and Exit. | Fixed |

No earlier finding is unfixed, half-fixed, or regressed. F-4-1 and F-4-2 are new claim-registry omissions.

## Structure, links, accessibility, privacy, and identity

- `/`, `/?demo=1`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` returned 200. An unknown route returned the designed field-guide 404 with HTTP 404.
- Every app route has one h1, one main, `lang="en"`, a route-specific title, a plain meta description, canonical URL, Open Graph/Twitter metadata, SVG favicon, and apple-touch icon.
- Home follows “Product — what it does”; internal pages follow “Route — Product.” All titles are under 60 characters.
- The 404 has `noindex`, common header/navigation, the legal footer links, metadata, security headers, and a Return home action.
- Deep links loaded the correct state. A settled Home scroll position of 900 px was restored after Back; Forward restored the notes route to its saved top position. Route changes focused h1 and populated the polite live region.
- The crawl covered all 15 unique HTTP(S) targets discovered across the public routes, including three sample sources, factory attribution, manifest, and extension ZIP. Every target returned 200 after redirects. `mailto:` targets were exempt.
- Live Axe scans found zero serious or critical violations on all public routes and the 404. The URL verifier found one h1, one main, `lang=en`, no missing alt text, no unnamed button, and no console error.
- The full local suite also checks 390 px overflow, 44 px targets, 16 px text, 200% text resizing, keyboard focus, dark mode, and reduced motion.
- Live app activity requested only the product origin. Repository inspection found no analytics package, remote font/script, AI endpoint, raw provider key, billing call, or Azure endpoint.
- Production output contains 27.20 kB raw JavaScript (9.37 kB gzip) and 18.78 kB raw CSS (4.83 kB gzip).
- The ruled paper, botanical art, forest/cream/amber palette, serif/sans pairing, clipped sheets, and asymmetric layout are product-specific rather than a generic SaaS template. The generated-art provenance is recorded in `.factory/design.md`.

## Full local verification

- All 14 claim commands: passed independently in the clean clone.
- `npm test -- --reporter=line`: 53 passed, 2 intentional cross-project skips, 0 failed.
- `npm run build`: passed and produced `dist/site` plus the extension ZIP.
- `npm run typecheck`: passed.
- `npm run verify:deployment`: passed with a 14,726-byte Manifest V3 ZIP and product-owned 404.
- `/opt/fleet/lib/verify-url.sh`: passed against the live URL after its evidence directory was created; load 876 ms, zero browser errors.

## Missed leverage and AI review

No obvious brief-implied feature is missing. Bidirectional JSON transfer connects the separate extension and web-app stores. Cloud sync would change the local-only privacy model. Automatically writing the gloss or choosing the hidden word would replace the learner’s core learning action rather than remove incidental work. There is no decorative AI feature or embedded provider credential.

## What would make this perfect

Resolve F-4-1 and F-4-2 by removing the two promises or registering their exact, scoped wording and adding direct tests. Re-run the 14-claim matrix and full suite. Nothing else identified in this review remains.
