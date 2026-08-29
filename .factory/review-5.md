# Adversarial first-read review 5

**Product:** Reading Margin Recall

**Live URL:** <https://reading-margin-recall.sociobot.in>

**Reviewed commit:** `943eee6e0de5156e307a1fda426bac36a3b6c05d`

**Date:** 2026-08-29
**Verdict:** **PASS**

This review found zero blocking, major, or minor findings. All registered claims were run independently from a clean checkout, and no unlisted landing-page or README product claim was found.

## Cold first read

Fresh Chromium contexts, with no prior storage, loaded the live home page at 390 × 844 and 1440 × 900. Before scrolling, the answer was the same at both sizes:

| Question | Answer a new visitor can give | First-screen evidence |
| --- | --- | --- |
| What does this do? | It saves selected reading passages as notes that hide a word for later review and link back to the original page. | “Save passages for later recall”; “selected sentences … become source-linked review notes.” |
| Who is it for? | Language learners reading ebooks or web articles. | “Private review notes for language learners.” |
| What should I click first? | “Try it with sample data.” | Prominent named primary action with an adjacent result note. |

The primary action and all three facts—Private, Offline, and Price—were fully visible before scrolling at both widths. The 390 px view has a readable two-row header, visible 44 px actions, and no horizontal overflow. The first screen is clear, tryable, and honest.

## Copy audit

Word counts treat contractions and hyphenated terms as one word. Commands are syntax, not sentences. The inventory includes all landing-page and README prose, headings, controls, labels, and meaningful accessible qualifiers. No unit exceeds 22 words; no banned marketing adjective, unexplained product jargon, vague slogan, inconsistent term, or non-result-naming action remains.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Reading Margin Recall | 3 | Product name |
| Demo / My notes / Review / Privacy | 1 / 2 / 1 / 1 | Pass navigation labels |
| Change color theme | 3 | Pass action |
| Private review notes for language learners | 6 | Pass audience label |
| Save passages for later recall | 5 | Pass job headline |
| For language learners who want selected sentences to become source-linked review notes. | 12 | Pass |
| Try it with sample data | 5 | Pass result-naming action |
| Add my first passage | 4 | Pass result-naming action |
| The demo loads three sample notes. | 6 | `demo-isolated` |
| Your real notes stay untouched. | 5 | `demo-isolated` |
| Private / Stays on this device | 1 / 4 | `local-only` |
| Offline / Works after the first visit | 1 / 5 | `offline-reload` |
| Price / All tools are free | 1 / 4 | `free-tools` |
| An open field notebook connects a sentence slip with a pressed fern and recall mark. | 15 | Useful image alt text |
| Each note keeps the passage, your gloss, and the original page link. | 12 | `source-linked-capture` |
| Sample note 1 · due today | 5 | Pass consistent sample label |
| Live review preview / Recall the missing word | 3 / 4 | Pass section labels |
| La vie est une fleur dont l’amour est le _____. | 10 | Realistic French sample |
| Your gloss: Life is a flower whose honey is love. | 10 | Realistic gloss |
| Reveal it in the demo | 5 | Pass result-naming action |
| Open original page (external) | 4 | Pass named external action |
| How it works | 3 | Pass section heading |
| Select a sentence / Highlight only the text you own or can read. | 3 / 9 | Pass instruction |
| Add your gloss / Choose one word to hide during review. | 3 / 7 | Pass instruction |
| Recall, then return / Grade your answer and open the original page. | 3 / 8 | Pass instruction |
| What the extension stores | 4 | Pass section heading |
| Your notes stay on this device | 6 | `local-only` |
| The extension saves only the text you select. | 8 | `extension-selection` |
| Read the privacy details | 4 | Pass result-naming action |
| No account | 2 | `free-tools` |
| No tracking scripts | 3 | `no-tracking` |
| JSON backup and restore | 4 | `json-backup` |
| Delete any note | 3 | `delete-notes` |
| Free / All tools | 1 / 2 | Pass labels |
| Free review tools | 3 | Pass section heading |
| Filter and back up your notes | 6 | Pass section heading |
| All tools are free to use. | 6 | `free-tools` |
| No account or subscription is required. | 6 | `free-tools` |
| Filter difficult notes | 3 | `review-filters` |
| Review one source at a time | 6 | `review-filters` |
| Export and import JSON backups | 5 | `json-backup`, `json-transfer` |
| Source-linked recall notes for language learners. | 6 | Accurate footer description |
| Terms | 1 | Pass navigation label |
| Built by Param Factory (external) | 5 | Attribution |
| v1.0.0 · Original generated field-guide artwork | 5 | Asset provenance |
| Back online. | 2 | Clear connection status |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Turn selected passages into private, source-linked review notes. | 8 | Pass |
| Reading Margin Recall is for language learners reading their own ebooks and web articles. | 14 | Pass |
| Select one sentence, add your gloss, choose a hidden word, and review it later. | 14 | `source-linked-capture` |
| Every note keeps a link to its original page. | 9 | `source-linked-capture` |
| The product has two parts: | 5 | Pass context |
| A Chrome-compatible extension captures selected text from a web page. | 10 | `extension-selection` |
| An installable web app provides capture, review, JSON backup, and the one-click demo. | 13 | Registered behavior claims |
| Each part keeps its own local notes. | 7 | `local-only`, `extension-selection` |
| Export a JSON backup from either part, then import it into the other. | 13 | `json-transfer` |
| Reading notes and color settings stay in browser storage. | 9 | `local-only` |
| Capture, review, JSON export, and demo Reset or Exit make no third-party requests. | 13 | `local-only` |
| The installed web app works offline after its first visit. | 10 | `offline-reload` |
| The demo uses separate `demo:` storage and never touches real notes. | 11 | `demo-isolated` |
| Try the demo / Install the extension / Move notes between both parts / Develop / Product behavior / Privacy and terms / Repository map | 3 / 3 / 5 / 1 / 2 / 3 / 2 | Pass headings |
| Open `/?demo=1`, or visit the live demo. | 7 | Pass instruction |
| It loads three French, German, and Spanish sample notes. | 9 | `demo-isolated` |
| Use Reset demo to restore them. | 6 | Pass instruction |
| Use Exit demo and use my notes to discard the demo data. | 12 | Pass instruction |
| After a production build: | 4 | Pass contributor context |
| Open `chrome://extensions` in Chrome or another Chromium browser. | 8 | Pass instruction |
| Turn on Developer mode. | 4 | Pass instruction |
| Choose Load unpacked and select `.output/chrome-mv3`. | 6 | Pass instruction |
| Select text on a web page, then choose Save passage. | 10 | Pass instruction |
| Open the extension to reveal and grade the note. | 9 | Pass instruction |
| The packaged download is written to `dist/site/downloads/reading-margin-recall-chrome.zip`. | 7 | `extension-download` |
| Choose Export notes as JSON in the extension. | 8 | Pass instruction |
| Open My notes in the web app and choose Import JSON. | 11 | Pass instruction |
| To move notes back, export from the web app and import the file in the extension. | 16 | `json-transfer` |
| Requirements: Node.js 22 and npm. | 5 | Pass contributor context |
| Vite builds the web app. | 5 | Defined contributor tool |
| WXT builds the extension. | 4 | Defined contributor tool |
| `npm run build` and `npm run build:site` create the extension ZIP and static site in `dist/site`. | 16 | Pass instruction |
| They also verify the installer, build record, and 404 configuration. | 10 | Pass instruction |
| The web-app-only build step is private to the release assembler. | 10 | Pass contributor boundary |
| `npm run deploy:site` deploys `dist/site` and then runs deployed-site checks. | 10 | Pass instruction |
| `npm run verify:live` compares the deployed assets, extension ZIP, and site-served build record with the local build. | 17 | Pass instruction |
| The command confirms that the live receipt names the deployed commit. | 11 | Pass instruction |
| It then checks the 404 page, headers, request privacy, and Axe results. | 12 | Pass instruction |
| Space reveals a review answer. | 5 | `keyboard-review` |
| Keys 1–4 grade recall. | 4 | `keyboard-review` |
| JSON export includes every note. | 5 | `json-backup` |
| JSON import restores a backup. | 5 | `json-backup` |
| Source links accept only `http:` and `https:` addresses. | 8 | `http-source-links` |
| All tools are free to use. | 6 | `free-tools` |
| No account or subscription is required. | 6 | `free-tools` |
| Filters show difficult notes or notes from one source. | 9 | `review-filters` |
| You write the gloss and choose the hidden word yourself. | 10 | `source-linked-capture` |
| Import only the passages you choose. | 6 | `extension-selection`, `json-transfer` |
| The site includes `/privacy` and `/terms`. | 6 | Pass structural statement |
| Reading notes and settings stay in browser storage. | 8 | `local-only` |
| Clear this site's data to remove web-app notes and color settings. | 10 | `site-data-boundary` |
| Delete extension notes from the extension separately. | 7 | `site-data-boundary` |
| Licensed under the MIT License. | 5 | Pass |

Terminology remains consistent: **note**, **passage**, **gloss**, **hidden word**, **original page**, and **demo**. The detailed maintained inventory is also in `.factory/copy-audit.md`.

## Demo and sandbox

One click on “Try it with sample data” opened `/?demo=1` at both review widths. Its first screen already contained a realistic French cloze passage, learner-written gloss, source link, and “Reveal sample answer” control. The persistent banner read “Demo — sample data, nothing is saved” and had working **Reset demo** and **Exit demo and use my notes** actions.

Live inspection confirmed only `demo:rmr:notes` existed in a fresh demo context. The complete request log contained the document, same-origin JS, and same-origin CSS only. A controlled service worker reload at `context.setOffline(true)` still showed “Review a sample passage” and “3 saved notes.” The clean claim test separately seeded real storage and verified Reset and Exit never changed it.

## Claims

Each exact command listed in `.factory/claims.json` ran separately after `npm ci` in clean checkout `/tmp/rmr-review5-clean-normal-cjPYbc` at the reviewed commit. All passed.

| Claim ID | Result | Observable result |
| --- | --- | --- |
| source-linked-capture | PASS | A complete note saved its passage, gloss, hidden word, and original URL. |
| extension-selection | PASS | The built extension captured only selected page text. |
| demo-isolated | PASS | Three multilingual samples loaded; real storage survived demo changes, Reset, and Exit. |
| local-only | PASS | Notes/themes stayed namespaced; full flows made no third-party request. |
| no-tracking | PASS | No tracking signal, cookie, beacon, or analytics request loaded. |
| pwa-installable | PASS | Manifest, icons, standalone start URL, and active worker were present. |
| offline-reload | PASS | Controlled demo reloaded offline with all three notes. |
| json-backup | PASS | All demo notes exported; a backup restored. |
| keyboard-review | PASS | Space revealed and 1–4 graded recall. |
| free-tools | PASS | No account, license gate, or billing request blocked core tools. |
| review-filters | PASS | Difficulty and source filters showed only matching notes. |
| json-transfer | PASS | Extension-to-web and web-to-extension JSON transfers both worked. |
| delete-notes | PASS | A deleted local note disappeared from UI and storage. |
| site-data-boundary | PASS | Clearing web data left separately stored extension notes intact. |
| extension-download | PASS | Public ZIP was nonempty, exact, valid, and Manifest V3. |
| http-source-links | PASS | `javascript:` input produced an accessible error and no executable link. |

The landing page and README claim-like statements map to these entries. No unlisted claim finding applies.

## Earlier findings

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. The 31 historical finding IDs below were confirmed on the deployed page and in current source/tests; none is unfixed, half-fixed, or regressed.

| Earlier IDs | Current confirmation | Result |
| --- | --- | --- |
| F-1-1, F-1-5, F-1-18, F-1-23 | First demo viewport shows the sample and named exit; all facts fit before the fold; demo count/isolation tests pass. | Fixed |
| F-1-2 | Versioned JSON import/export works in both directions between extension and web app. | Fixed |
| F-1-3 | The history regression passed: it restores saved scroll position, focuses the route h1, and announces it. | Fixed |
| F-1-4 | Live unknown route returns HTTP 404 with full product skeleton and metadata. | Fixed |
| F-1-6 through F-1-17 | Old vague/metaphorical, ambiguous, generic, and inconsistent terms are absent; plain specific replacements are live. | Fixed |
| F-1-19 through F-1-22 | Price language and README copy are consistent, short, and defined for their audience. | Fixed |
| F-2-1 through F-2-4 | Installable app, local settings, hero label, and sample naming are verified. | Fixed |
| F-3-1, F-3-2 | Privacy wording is scoped to named, tested selected-text and request behaviors. | Fixed |
| F-4-1, F-4-2 | `no-tracking` and `site-data-boundary` are registered and passed as direct claim tests. | Fixed |

## Structure, access, privacy, and links

- `/`, `/?demo=1`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` returned 200. An unknown route returned the designed 404 with HTTP 404.
- Each app route has `lang="en"`, exactly one `main` and `h1`, route-specific title, description, canonical, Open Graph/Twitter tags, favicon, and apple-touch icon. Titles are concise and follow the route/product pattern.
- SPA deep links load the intended state. Back/Forward, h1 focus, and polite route announcements pass the full browser regression.
- All discovered same-origin links returned 200; the designed unknown route correctly returned 404. The three realistic sample sources and Param Factory attribution returned 200 after redirects. `mailto:` links are intentional.
- Live page loads reported zero console errors. The full suite checks Axe serious/critical issues, 390 px sizing/overflow, 44 px targets, keyboard focus, dark treatment, 200% text, and reduced motion; it passed 55 tests with two intentional mobile-project skips.
- The app made only same-origin product requests. It has no remote font/script, analytics package, provider key, billing request, Azure endpoint, or decorative AI feature.
- The field-guide identity is visibly distinct: original botanical art, ruled warm paper, forest ink and amber palette, serif/sans pairing, clipped specimen sheets, and asymmetric layouts match `.factory/design.md` rather than a generic SaaS template.

## Missed leverage and AI

No brief-implied high-value capability is missing. The extension and web app have bidirectional JSON transfer; adding cloud sync would contradict the local-first privacy boundary. Automatic gloss-writing or hidden-word selection would replace the learner’s central action, not remove incidental work. There is no unexplained AI feature or embedded provider credential.

## What would make this perfect

No product change is required by this review. Preserve the current claim matrix, cold-demo path, local-only boundary, and history/404 regressions on future changes; those are the specific behaviors most likely to regress.
