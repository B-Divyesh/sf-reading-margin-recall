# Independent verification 2 — FAIL

**Date:** 2026-08-28  
**Candidate:** `46c937ce762baa2bb89187bef9887dade33906af`  
**Live URL:** https://reading-margin-recall.sociobot.in  
**Verdict:** **FAIL — do not release.**

The candidate source builds and its automated suite passes, but the live browser-extension artifact is still absent. Fresh testing also found unsafe import/storage failure recovery, a dead sample source, and smaller policy defects. This result replaces the repaired PASS implied by the prior handoff.

## Mandatory first read

**PASS.** A cold desktop and 390×844 visit says:

- what it does: **“Save passages for later recall”**;
- who it is for: **“For language learners who want selected sentences to become source-linked review notes”**;
- what to click: **“Try it with sample data.”**

The adjacent text explains that the demo loads three notes without touching real notes. One click opens `/demo`, immediately shows the three sample passages, and keeps the banner **“Demo — sample data, nothing is saved to your notes”** with **Reset demo** and **Start for real**. The cold page had zero horizontal overflow, no console/page errors, and only same-origin requests.

## Claims contract

`.factory/claims.json` exists. Each of its 11 IDs occurs in exactly one tagged test. Before other product checks, every declared command was run individually and passed:

| Claim | Result |
| --- | --- |
| `source-linked-capture` | PASS |
| `extension-selection` | PASS; Chromium case passed, duplicate mobile project intentionally skipped |
| `demo-isolated` | PASS |
| `local-only` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
| `keyboard-review` | PASS |
| `free-tools` | PASS |
| `delete-notes` | PASS |
| `extension-download` | PASS locally; **the same artifact is 404 on the live site** |
| `http-source-links` | PASS |

The claim commands use the production build and local preview. Their success does not prove that deployment included the generated ZIP; the fresh live request below shows it did not.

## Release-blocking findings

### P0 — the live extension download still returns 404

Fresh GETs with both `curl` and Playwright returned:

```text
404 text/html https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip
```

The link is exposed by the real empty state as **Download the extension**. The exact local production build contains `dist/site/downloads/reading-margin-recall-chrome.zip`, size 14,083 bytes; `unzip -t` validates every entry and its manifest is MV3. A browser-extension product cannot be installed from production, so the real job-to-be-done is incomplete.

This is a partial deployment failure, not a stale site. Fresh local/live SHA-256 values match exactly for the candidate's HTML, JS, CSS, service worker, web manifest, robots file, and sitemap. Examples:

```text
index.html                    64a3d0d88f0ca94493e0bc486d575770eb82414ebf14bfd7f6a177f93639ea62
assets/index-D8tmrvwG.js     da4e02920c06c45058b9295c1526285d61217c3d74db71db8235d82ad3c067e1
assets/index-CFp9_9_j.css    829f055e2cf897efde9e73f3f1bdd3108226c67a7707242d827d667d036c8da9
sw.js                         9b9e639d169a574d2343aeaeea6ea0f5663804375a0deec0b7bcdda70148e888
```

### P1 — a malformed backup can poison storage and brick the app

On the live `/demo`, importing this valid JSON shape:

```json
{"version":1,"notes":[{"sourceUrl":"https://example.com"}]}
```

stores the incomplete record in `demo:rmr:notes`. The current DOM remains visible because the import handler catches its own rendering exception, but reloading produces the page error:

```text
Cannot read properties of undefined (reading 'replace')
```

The UI then remains at **“Opening your private reading margin…”** with no demo reset or in-product recovery. The same path affects real-note storage. Import validates only that each item is an object with an HTTP(S) `sourceUrl`; it does not validate the fields the renderer and scheduler require. This fails the required invalid-input and recovery behavior and risks making local data inaccessible.

### P1 — storage failure reports success and discards the entry

With `Storage.setItem` forced to throw `QuotaExceededError` (the browser-storage-full boundary), a valid live capture:

- leaves `rmr:notes` absent;
- shows the empty state;
- clears every completed form field; and
- announces **“Review note saved.”**

The lower-level failure announcement is overwritten after rerender. A local-first product must retain the user's text or clearly say it was not stored; the current behavior causes silent data loss.

### P1 — one of the three demo source links is dead

The bundled Spanish sample links to:

`https://es.wikisource.org/wiki/Don_Quijote_de_la_Mancha:_Cap%C3%ADtulo_I`

Fresh curl and Playwright requests both returned 404. One third of the opinionated sample therefore cannot complete the advertised “return to the original page” loop. All other crawled internal/external links returned 200, except the missing extension ZIP above.

## Other findings

### P2 — unknown routes return HTTP 200 rather than a real 404

`/definitely-not-a-route` renders the styled not-found view but responds `200 text/html`. The required Static Web Apps `responseOverrides`/`404.html` behavior is absent, so broken URLs are soft 404s.

### P2 — the extension selection action is 42 px high

The installed production content script renders **Save passage** at 149.6×42 CSS px. The product design and accessibility contract require controls to be at least 44×44 px. The main `Demo` nav target at 390 px is also about 42.5×44 px. Keyboard focus remains visible and functional.

### P2 — development dependency audit is not clean

`npm audit --omit=dev` reports 0 production vulnerabilities, but the complete post-`npm ci` audit reports 10 development findings: 3 critical, 5 high, and 2 moderate. Critical/high chains include `shell-quote`, `web-ext-run`, `wxt`, `vite`, `adm-zip`, and `tmp`. They are not present in the shipped static bundle, but the build/test toolchain should be upgraded.

## Clean checkout and build gates

The initial tree was clean at the requested SHA and `origin/main` resolved to the same SHA.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 381 packages installed |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 36 passed, 1 intentional mobile duplicate skipped, 0 failed |
| `npm run build` | PASS; exact site and extension production outputs generated |
| `unzip -t dist/site/downloads/reading-margin-recall-chrome.zip` | PASS |
| `npm audit --omit=dev` | PASS; 0 production vulnerabilities |

The built initial bundle is 22.76 KB raw / 8.41 KB gzip JS and 16.40 KB raw / 4.46 KB gzip CSS. There are no downloaded fonts. The mobile hero is 25,872 bytes and the desktop hero is 109,412 bytes. All are below contract budgets.

## End-to-end product exercise

- **Live PWA normal case:** created `La memoria vuelve cuando leo despacio.`, added a gloss, hid `memoria`, and kept an HTTP(S) source. The note appeared, Space revealed it, key `3` graded it, the review counter became 1, deletion removed it, and Undo restored it. No page/console errors occurred.
- **Installed production extension:** loaded `.output/chrome-mv3` in a fresh persistent Chromium profile, selected only the landing lede, opened the injected dialog, received the missing-field error, added a gloss/deletion, and saved. The extension popup showed the selected text from extension storage, Space revealed it, `4` graded it, **Open original page** created the source tab, and deletion restored the empty state. Popup Axe serious/critical count was zero.
- **Boundary/error cases:** unsupported `javascript:` source URLs are rejected accessibly; malformed JSON text is rejected; however, structurally incomplete JSON and storage exhaustion fail as documented above.
- **PWA update/offline:** the live controlling worker is `/sw.js`, cache `reading-margin-recall-v4` is active, no worker is waiting after `registration.update()`, and offline reload of `/demo` retains the banner and three notes.

## Accessibility, responsive behavior, and performance

- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 604 ms cold load, correct title/lang, one h1, main landmark, all image alt attributes present, no unlabeled buttons, and no console/page errors.
- Live Axe scans of `/`, `/demo`, `/library`, `/review`, `/privacy`, `/terms`, and a missing route at desktop and 390 px found **0 serious/critical** violations. Dark mode also found 0.
- Keyboard-only checks passed: first Tab reaches the skip link; its designed focus outline is 3 px solid; Enter focuses `<main>`; activating the demo route and browser Back focus the new h1; Space and keys 1–4 operate review.
- At 390 px there is no horizontal overflow. Simulated 200% root text size also produced no horizontal overflow on all primary routes. Reduced-motion durations are `0.00001s` and scroll behavior is `auto`.
- Fresh Lighthouse mobile: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.82 s, LCP 0.94 s, TBT 146 ms, CLS 0.

## Privacy, requests, headers, and caching

- Cold landing and the complete local demo capture flow made only same-origin requests. Source inspection found no analytics, third-party fonts/scripts, AI/Azure endpoints, billing calls, sign-in, or embedded secrets.
- The site and extension store notes separately in browser-local storage. Demo data uses only the `demo:` namespace in the tested flows.
- Live responses carry a restrictive same-origin CSP, HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial. Hashed JS/CSS and hero assets use one-year immutable caching; HTML and `/sw.js` revalidate after 30 seconds.
- This is a static PWA/extension with no product API, billing verification call, backend, or sign-in flow. The work order's API rate-limit, concurrency, persistence-server, build-health endpoint, and Entra authority checks are therefore not applicable. No rapid-request rate-limit threshold exists to measure.

## Required release actions

1. Deploy the generated extension ZIP and verify a fresh live GET returns 200 and unzips successfully.
2. Validate every imported note field before mutating storage; preserve the previous collection and show a recoverable error when validation fails.
3. Make storage writes return success/failure; do not clear the form or announce success after a failed write.
4. Replace or correct the dead Spanish sample URL.
5. Add a real HTTP 404 response, bring all controls to 44×44 px, and update the vulnerable development toolchain.
