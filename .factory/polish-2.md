# Polish 2 — complete finding closure

**Base review:** `7854af652a81845ea73927bce68e0b7f294076cd`  
**Repair:** `0d71b5060c02cc6c68d3b45f8e258b2914b6bda8`  
**Live URL:** <https://reading-margin-recall.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The isolated French sample review remains before the demo capture form, with the reveal action in the first viewport. | `@regression:first-screen`; cold live `/?demo=1`; `polish-2-live-demo-mobile.png` |
| F-1-2 | Extension JSON export/import uses the same backup schema as the web app in both directions. | `@claim:json-transfer`; live extension ZIP hash check |
| F-1-3 | History entries retain scroll; routes focus their h1 and announce it. | `@regression:history`; `npm run verify:live` |
| F-1-4 | The static 404 has the common header/footer, legal links, metadata, icons, and a return action. | `@regression:built-404`; `npm run verify:live` HTTP 404/Axe/header checks |
| F-1-5 | The three multilingual demo notes are explicitly claimed and asserted. | `@claim:demo-isolated`; `.factory/claims.json` |
| F-1-6 | The untestable negative promise was replaced with selected-text-only copy. | `@claim:extension-selection`; live landing privacy section |
| F-1-7 | Difficulty and source filters have a named registered claim. | `@claim:review-filters`; live `/review?demo=1` |
| F-1-8 | README states the positive manual capture workflow. | `@claim:source-linked-capture`; README copy audit |
| F-1-9 | Replaced the slogan with useful audience copy. | `.factory/copy-audit.md`; live `/` |
| F-1-10 | Caption names the original page link. | `@claim:source-linked-capture`; live `/` |
| F-1-11 | Removed the mood heading. | `.factory/copy-audit.md`; live `/` |
| F-1-12 | Privacy section names what the extension stores. | `.factory/copy-audit.md`; live `/privacy` |
| F-1-13 | Privacy heading now names device-local notes. | `@claim:local-only`; live `/privacy` |
| F-1-14 | Free-tools section uses a descriptive heading. | `.factory/copy-audit.md`; live `/` |
| F-1-15 | Filter/backup section names both functions. | `.factory/copy-audit.md`; live `/` |
| F-1-16 | Saved objects consistently use note/passage/gloss/hidden word/original page/demo terminology. | `.factory/copy-audit.md`; full browser suite |
| F-1-17 | Original-page links have unambiguous labels. | `@claim:source-linked-capture`; `@regression:demo-source-return-link-is-live` |
| F-1-18 | Demo exit names the consequence and clears `demo:` storage. | `@claim:demo-isolated`; `@regression:demo-exit`; cold live demo |
| F-1-19 | All visitor-facing free-tier copy consistently says all tools are free. | `@claim:free-tools`; README and live `/terms` |
| F-1-20 | Build explanation is split into short contributor sentences. | README copy audit |
| F-1-21 | Verification explanation is split into short contributor sentences. | README copy audit |
| F-1-22 | Product-facing docs use extension/web-app words; tooling names are defined for contributors. | README copy audit |
| F-1-23 | All three facts and the primary action remain above the required first screens. | `@regression:first-screen`; cold live desktop/mobile checks |
| F-2-1 | Added `pwa-installable`; it tests the linked manifest, standalone display, `/library` start URL, icon responses, and active worker. | `@claim:pwa-installable`; cold live manifest/worker check |
| F-2-2 | Expanded `local-only` to name notes and color settings, and to prove real/demo key isolation with a same-origin request log. | `@claim:local-only`; cold live settings isolation check |
| F-2-3 | Deleted the `.hero-copy::before` decorative `No. 01` label. | `.factory/copy-audit.md`; cold live `/` check; `polish-2-live-home-desktop.png` |
| F-2-4 | Home preview now says `Sample note 1 · due today`, matching its first seeded demo note. | `.factory/copy-audit.md`; cold live `/` and `/?demo=1` check |

All rows were rechecked after deployment. The live verification command also passed request privacy, accessibility, responsive layout, offline reload, source-linked review, keyboard behavior, HTTP 404, and package integrity.
