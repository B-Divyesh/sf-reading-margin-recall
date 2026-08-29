# Adversarial first-read review 3

**Product:** Reading Margin Recall

**Live URL:** <https://reading-margin-recall.sociobot.in>

**Reviewed repository commit:** `8565fb7d421d567ba30a24c1f012c006d21a285d`

**Live product receipt:** `a9b521ce75b126768bd6d321ea1f46dd1709ccc4`

**Date:** 2026-08-29
**Verdict:** **FAIL**

Two unlisted privacy claims remain. No registered claim test failed, but PASS requires zero findings and no untested visitor-facing claim. The commits after the live receipt contain only `.factory` verification material; the product files are identical.

## First read before scrolling

Fresh Chromium contexts opened Home at 390 × 844 and 1440 × 900 with empty storage and no scrolling.

| Question | Answer in my own words | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | It saves selected reading passages as source-linked notes for later recall. | “Save passages for later recall” and “selected sentences … become source-linked review notes.” |
| For whom? | Language learners. | “Private review notes for language learners” and “For language learners…” |
| What should I click first? | Open the ready-made sample. | “Try it with sample data” is the visually primary action. |

All three answers were clear in both viewports. The primary action and all three short facts—Private, Offline, and Price—were fully visible before scrolling. No blocking first-screen finding applies.

## Findings

### Major

#### F-3-1 — The privacy page retains an unlisted no-fetch promise

- **Exact quote/location:** `/privacy`, “The extension reads only text you actively select. It does not fetch full pages, book files, or protected content.”
- **Why this fails:** `extension-selection` proves that the capture dialog and extension store receive the selected text. It does not name or test the separate promises about full-page fetches, book files, or protected content. Those negative promises survived after the similar Home claim in F-1-6 was narrowed.
- **Concrete fix:** Delete the second sentence and use the registered positive wording: “The extension copies your selected text into its local note store.” If the negative sentence remains, add a distinct claim and an extension request/content-boundary test for every retained promise.

#### F-3-2 — “No third-party requests” and “nothing leaves” are broader than `local-only`

- **Exact quotes/locations:** README, “Capture and review make no third-party requests.” `/privacy`, “Nothing leaves during capture, review, export, or demo use.”
- **Why this fails:** The registered `local-only` claim promises browser storage and no tracking requests. Its test records requests while changing settings and capturing a demo note, but it does not exercise review or export. “No third-party requests” is broader than “no tracking requests,” and the privacy sentence adds four named flows that the claim entry does not state or fully test.
- **Concrete fix:** Expand `local-only` to the exact promise and have its request log cover capture, answer reveal and grading, JSON export, and demo Reset/Exit in clean real and demo contexts. Alternatively narrow both sentences to the currently registered and tested storage/no-tracking wording.

## Landing-page copy audit

Counts use whitespace-delimited words, count a hyphenated term or number range as one word, and exclude standalone punctuation. The audit includes headings, labels, actions, accessible qualifiers, image alt text, and conditional status copy. No unit exceeds 22 words, uses a banned marketing adjective, changes terminology, relies on metaphor, or uses a non-result-naming action.

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
| An open field notebook connects a sentence slip with a pressed fern and recall mark. | 15 | Pass image alt text |
| Each note keeps the passage, your gloss, and the original page link. | 12 | Pass; `source-linked-capture` |
| Sample note 1 · due today | 5 | Pass; matches the first demo note |
| Live review preview | 3 | Pass |
| Recall the missing word | 4 | Pass |
| La vie est une fleur dont l’amour est le _____. | 10 | Real sample content |
| Your gloss: Life is a flower whose honey is love. | 10 | Real sample content |
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
| Your notes stay on this device | 6 | Pass heading; `local-only` |
| The extension saves only the text you select. | 8 | Pass; `extension-selection` |
| Read the privacy details | 4 | Pass action |
| No account | 2 | Pass; `free-tools` |
| No tracking scripts | 3 | Pass; `local-only` |
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

Shell commands inside the fenced code block are syntax rather than sentences and are not counted. Every heading and prose/list sentence is included. No item exceeds 22 words, contains banned copy, unexplained product jargon, inconsistent terms, or a meaningless heading.

| Copy unit | Words | Result |
| --- | ---: | --- |
| Reading Margin Recall | 3 | Product name |
| Turn selected passages into private, source-linked review notes. | 8 | Pass |
| Reading Margin Recall is for language learners reading their own ebooks and web articles. | 14 | Pass |
| Select one sentence, add your gloss, choose a hidden word, and review it later. | 14 | Pass |
| Every note keeps a link to its original page. | 9 | Pass; `source-linked-capture` |
| The product has two parts: | 5 | Pass |
| A Chrome-compatible extension captures selected text from a web page. | 10 | Pass; `extension-selection` |
| An installable web app provides capture, review, JSON backup, and the one-click demo. | 13 | Pass; registered product claims cover each behavior |
| Each part keeps its own local notes. | 7 | Pass; `local-only`, `extension-selection` |
| Export a JSON backup from either part, then import it into the other. | 13 | Pass; `json-transfer` |
| Reading notes and color settings stay in browser storage. | 9 | Pass; `local-only` |
| Capture and review make no third-party requests. | 7 | **F-3-2: broader than the registered/tested request claim** |
| The installed web app works offline after its first visit. | 10 | Pass; `pwa-installable`, `offline-reload` |
| The demo uses separate `demo:` storage and never touches real notes. | 11 | Pass; `demo-isolated` |
| Try the demo | 3 | Pass heading |
| Open `/?demo=1`, or visit the live demo. | 7 | Pass instruction |
| It loads three French, German, and Spanish sample notes. | 9 | Pass; `demo-isolated` |
| Use Reset demo to restore them. | 6 | Pass instruction |
| Use Exit demo and use my notes to discard the demo data. | 12 | Pass instruction |
| Install the extension | 3 | Pass heading |
| After a production build: | 4 | Pass |
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
| Requirements: Node.js 22 and npm. | 5 | Pass in contributor context |
| Vite builds the web app. | 5 | Pass; tool is explained |
| WXT builds the extension. | 4 | Pass; tool is explained |
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
| The site includes `/privacy` and `/terms`. | 6 | Pass; verified route structure |
| Reading notes and settings stay in browser storage. | 8 | Pass; `local-only` |
| Repository map | 2 | Pass heading |
| `entrypoints/` — extension capture and review screens | 6 | Pass in contributor context |
| `site/` — web app and public page files | 7 | Pass in contributor context |
| `shared/` — note model and recall scheduling | 6 | Pass in contributor context |
| `tests/` — browser claim and quality checks | 6 | Pass in contributor context |
| `.factory/` — product brief, visual thesis, claims, demo guide, copy audit, and handoff | 12 | Pass in contributor context |
| Licensed under the MIT License. | 5 | Pass |

Terminology is consistent: a saved item is a **note**; selected source text is a **passage**; the learner's explanation is a **gloss**; recalled text is the **hidden word**; the source is the **original page**; isolated sample mode is the **demo**.

## Demo and sandbox verification

- One click on “Try it with sample data” opened `/?demo=1` on both viewports.
- The first demo viewport showed the French passage, cloze, learner gloss, original-page link, and “Reveal sample answer” action. The action ended at 804 px in the 844 px mobile viewport.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed Reset and Exit actions.
- The three seeded notes were realistic French, German, and Spanish records with source links and review history.
- Revealing the answer showed `miel`. Reset restored all three samples and the hidden state.
- A real `rmr:notes` sentinel remained byte-for-byte unchanged during entry, reveal, and Reset. Exit removed every `demo:` key and retained the sentinel.
- The live request log for the complete flow contained no cross-origin request and no console/page error.
- After the worker controlled the page, the seeded demo reloaded offline with all three notes.

The demo contract passes; no blocking demo or sandbox finding applies.

## Claims audit

Every exact command in `.factory/claims.json` was run separately in clean clone `/tmp/rmr-review3-clean-KtyjnC` at `8565fb7d421d567ba30a24c1f012c006d21a285d` after `npm ci`.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `source-linked-capture` | PASS | Saved passage, gloss, hidden word, source title, and source URL rendered. |
| `extension-selection` | PASS | The installed extension captured only the selected page text. |
| `demo-isolated` | PASS | Three multilingual samples loaded; Reset and Exit preserved the real namespace. |
| `local-only` | PASS | Real/demo notes and color settings used separate local keys; the request log stayed same-origin. |
| `pwa-installable` | PASS | Manifest, standalone mode, `/library` start URL, icons, and controlling worker passed. |
| `offline-reload` | PASS | The controlled seeded demo reloaded offline with three notes. |
| `json-backup` | PASS | All three notes exported and a backup restored. |
| `keyboard-review` | PASS | Space revealed the answer and key `3` graded it. |
| `free-tools` | PASS | Capture, review, backup, and source tools had no account, billing request, or gate. |
| `review-filters` | PASS | Difficulty and source filters returned only matching notes. |
| `json-transfer` | PASS | Extension → web and web → extension transfers both succeeded. |
| `delete-notes` | PASS | The selected note disappeared from UI and storage. |
| `extension-download` | PASS | The ZIP was nonempty, byte-matched, valid, and Manifest V3. |
| `http-source-links` | PASS | A `javascript:` URL produced an accessible error and no executable link. |

Each ID appears in exactly one tagged test. The listed claims pass, but F-3-1 and F-3-2 identify broader live/README privacy wording that is not registered or fully exercised.

## Earlier finding verification

Every finding in review 1 and review 2, every row in polish 1 and polish 2, and the current handoff assertions were checked against both the live site and current source/tests.

| Earlier ID | Live confirmation | Code/test confirmation | Result |
| --- | --- | --- | --- |
| F-1-1 | A complete sample and reveal action are in the first demo viewport. | `demoSample()` precedes the form; first-screen regression passed. | Fixed |
| F-1-2 | Extension and web app expose JSON transfer in both directions. | `json-transfer` passed with the built extension. | Fixed |
| F-1-3 | Back restored Home near 855 px; h1 focus and polite announcements worked. | History state and `popstate` restoration are present; history regression passed twice. | Fixed |
| F-1-4 | The HTTP 404 has common navigation, legal footer, metadata, icons, and a return action. | `site/404.html`, deployment config, and built-404 regression passed. | Fixed |
| F-1-5 | Home and demo state and show three multilingual samples. | `demo-isolated` names and asserts the count/languages. | Fixed |
| F-1-6 | Home says only selected text is saved. | The Home wording and registered claim are fixed; the similar unlisted `/privacy` negative promise is reported separately as F-3-1. | Fixed at cited location |
| F-1-7 | Difficult-note and source filters work live. | `review-filters` is registered and passed. | Fixed |
| F-1-8 | README states the manual gloss, hidden-word, and chosen-passage workflow. | Capture and extension-selection claims cover it. | Fixed |
| F-1-9 | The audience label is plain and specific. | The old field-guide slogan is absent. | Fixed |
| F-1-10 | The caption names the original page link. | “Path home” is absent. | Fixed |
| F-1-11 | “How it works” stands alone. | “From margin to memory” is absent. | Fixed |
| F-1-12 | The section label says what the extension stores. | “A narrow, honest tool” is absent. | Fixed |
| F-1-13 | The heading says notes stay on this device. | `local-only` covers the promise. | Fixed |
| F-1-14 | The section label is “Free review tools.” | “Everything included” is absent. | Fixed |
| F-1-15 | The heading names filtering and backup. | “Focus each review” is absent. | Fixed |
| F-1-16 | Visible saved objects are consistently called notes. | Note/passage/gloss/hidden word/original page/demo remain distinct in source. | Fixed |
| F-1-17 | Links say “Open original page.” | The ambiguous “Open source” action is absent. | Fixed |
| F-1-18 | Exit says it will use the visitor's notes. | Exit removes every `demo:` key; demo-exit regression passed. | Fixed |
| F-1-19 | Both price statements say all tools are free. | `free-tools` passed without billing or account traffic. | Fixed |
| F-1-20 | The build explanation is split into 16- and 10-word sentences. | Current README audit passes. | Fixed |
| F-1-21 | The verification explanation is split into 11- and 12-word sentences. | Current README audit passes. | Fixed |
| F-1-22 | Product copy uses extension/web-app wording; contributor tools are explained. | Current README audit contains no unexplained product jargon. | Fixed |
| F-1-23 | All three facts are fully above both first-screen folds. | First-screen regression passed on desktop and mobile. | Fixed |
| F-2-1 | README's installable web-app promise remains present. | `pwa-installable` verifies manifest, icons, start URL, display, and worker. | Fixed |
| F-2-2 | Notes and color settings are named as browser-local. | Expanded `local-only` verifies real/demo theme keys and request isolation. | Fixed |
| F-2-3 | No decorative “No. 01” appears in the hero. | The pseudo-element and phrase are absent from source. | Fixed |
| F-2-4 | Home and demo both call the Hugo record “Sample note 1.” | The two source strings match; first-screen regression passed. | Fixed |

No earlier finding regressed at its cited location. The polish records' implementation assertions matched, but their claim-completeness conclusion missed the broader privacy wording now reported as F-3-1 and F-3-2.

## Structure, links, accessibility, privacy, and identity

- `/`, `/?demo=1`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` returned 200. An unknown route returned the designed field-guide page with HTTP 404.
- Each route has one h1, one main landmark, `lang="en"`, ordered headings, a route-specific title, a plain description, canonical URL, Open Graph/Twitter metadata, SVG favicon, and 180 px apple-touch icon. The social image is 1200 × 630.
- Home uses “Product — what it does”; internal routes use “Route — Product.” Every title is under 60 characters.
- Deep links loaded the correct state. Back/Forward restored route, stored scroll, h1 focus, and live-region announcement.
- The crawl covered every discovered internal/product link, all three sample sources, the factory attribution, manifest, robots, sitemap, icons, social image, and extension ZIP. All resolved successfully. A transient Wikisource 429 from the API crawler returned 200 on two browser-user-agent retries; it is rate limiting, not a dead target. `mailto:` links were exempt.
- `/opt/fleet/lib/verify-url.sh` reported the correct title/language, one h1, main, named controls, alt text, and no console error.
- Live Axe scans at 390 × 844 and 1440 × 900 found zero serious or critical violations on Home, demo, library, review, privacy, terms, and 404.
- The 390 px baseline has no horizontal overflow, sub-16 px direct text, or interactive target below 44 × 44 px. At 200% root text, Home had zero horizontal overflow. Reduced-motion transition duration was effectively zero.
- Live Home/demo behavior requested only same-origin HTML, CSS, JavaScript, worker, and product assets. There is no analytics, remote font/script, AI request, billing request, raw provider key, or Azure endpoint.
- Initial JavaScript is 27,232 bytes raw and 9,388 bytes gzip; CSS is 18,779 bytes raw and 4,832 bytes gzip.
- The ruled-paper field guide, pressed-fern art, dark forest/cream/amber palette, serif/sans pairing, clipped sheets, and asymmetric composition form a distinct product identity rather than a generic SaaS template.

## Full local verification

- All 14 claim commands: passed separately in the clean clone.
- `npm test`: 53 passed, 2 intentional mobile-project skips, 0 failed.
- `npm run typecheck`: passed.
- `npm run build`: passed and produced `dist/site/` plus the extension ZIP.
- `npm run verify:deployment`: passed with a valid 14,726-byte Manifest V3 ZIP and product-owned 404.

The general `npm run verify:live` receipt comparison is intentionally not used as acceptance evidence for this review commit: the live receipt is `a9b521c…`, while repository HEAD `8565fb7…` adds verification documents only. The live `index.html` and product files match, and `git diff` confirms no product-file difference between those commits. Live behavior was independently rerun above.

## Missed leverage and AI review

No obvious brief-implied feature is missing. Bidirectional JSON import/export connects the extension and web app. Automatic cloud sync would conflict with the local-first constraint unless separately designed and consented to. The learner-written gloss and chosen deletion are the learning task, so automatic generation is not required. There is no decorative AI feature or embedded provider credential.

## What would make this perfect

Resolve F-3-1 and F-3-2 by removing the broader negative promises or registering their exact wording and testing every named flow with request logs. Then rerun all 14 claim commands and the full suite. Nothing else identified in this review remains.
