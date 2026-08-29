# Independent verification 4 — FAIL

**Date:** 2026-08-29  
**Requested candidate:** `ae2f3d23145292a0b9e6d5ec65f0be9e40261a2b`  
**Live URL:** <https://reading-margin-recall.sociobot.in>  
**Retrievable local/remote commit tested:** `ae2f3d231450268e7f1b0f9186f1eab607d1a60e`

## Verdict

**FAIL — do not release.** The live deployment does not serve the installable browser-extension package that the product promises and the local production build produces. The requested candidate object is also not available from the supplied repository or `origin/main`, so candidate identity cannot be verified.

## Release blockers

### Critical — live extension download is absent

- Local production build creates `dist/site/downloads/reading-margin-recall-chrome.zip`: 13,734 bytes, begins with ZIP magic (`PK`), passes `unzip -t`, has SHA-256 `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`, and contains the expected Manifest V3 manifest.
- Fresh live request to `https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip?qa=20260829` returned **404**, `Content-Type: text/html`, 2,400 bytes, SHA-256 `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3`.
- Its document is the Azure Static Web Apps generic “404: Not found” page, not a ZIP and not a product-owned error response. It pulls Azure CDN resources if rendered.
- `npm run verify:live` independently fails at `Error: Extension download returned 404.`
- This falsifies the customer-facing `extension-download` claim on the live product and prevents users from installing the required browser extension. It is a release blocker even though the local claim test passes against the preview build.

### Critical — supplied candidate is not retrievable or identifiable

- After `git fetch origin main --tags --prune`, `git cat-file -t ae2f3d23145292a0b9e6d5ec65f0be9e40261a2b` returned `fatal: git cat-file: could not get object info`.
- `origin/main`, the clean checkout `HEAD`, and `git ls-remote origin refs/heads/main` all resolve instead to `ae2f3d231450268e7f1b0f9186f1eab607d1a60e`.
- The requested candidate has not been shown to be the deployed code; acceptance cannot be signed off until a fetchable commit is provided and deployed.

## First-read test

Passed on a cold desktop browser context. The first screen says:

- What it does: “Save passages for later recall.”
- For whom: “For language learners who want selected sentences to become source-linked review notes.”
- What to do first: “Try it with sample data”; the adjacent text says it loads three notes and does not touch real notes.

The action is present in one click and opened `/demo` with the persistent “Demo — sample data” banner and three realistic French, German, and Spanish notes. This part of the release is clear and meets the demo-sandbox requirement.

## Clean local verification (retrievable commit only)

`npm ci` completed with 145 packages and zero reported vulnerabilities. Every exact command from `.factory/claims.json` was run from that clean install through the product demo/preview entry point; all passed:

| Claim ID | Exact command result |
| --- | --- |
| `source-linked-capture` | PASS |
| `extension-selection` | PASS |
| `demo-isolated` | PASS |
| `local-only` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
| `keyboard-review` | PASS |
| `free-tools` | PASS |
| `delete-notes` | PASS |
| `extension-download` | PASS locally only |
| `http-source-links` | PASS |

The aggregate claim-run status was `passed` with no failed tests. Additional local gates:

- `npm test`: **44 passed**, 0 failed.
- `npm run typecheck`: passed (`wxt prepare && tsc --noEmit`). No lint script exists in `package.json`.
- `npm run build`: passed. Local site JS is 24,536 bytes raw / 8,850 bytes gzip; CSS is 16,587 bytes raw / 4,511 bytes gzip; both are within the static-product budgets.
- `unzip -t dist/site/downloads/reading-margin-recall-chrome.zip`: passed. The package declares `manifest_version: 3`, uses only `storage` and `activeTab`, and full Playwright coverage installed it into clean Chromium, captured selected text, saved to extension storage, reviewed, opened its source, and deleted the note.
- `npm audit` and `npm audit --omit=dev`: both reported zero vulnerabilities.

## Live product checks

Other than the missing ZIP, the live product behavior is healthy for the retrievable base build.

- Byte equality passed for live `/`, `/assets/index-zAGzKPkM.js`, `/assets/index-k8zcFJww.css`, and `/sw.js` against the just-produced local build.
- Normal demo flow passed: capture created a fourth note, review navigation worked, `Space` revealed the deletion, and `3` graded it. Returning home removed all `demo:` storage keys.
- Privacy: a fresh Playwright context recorded **zero third-party requests** through the complete demo capture/review/exit flow. There is no sign-in, billing, backend endpoint, or product-unlock endpoint, so Entra and 429/`Retry-After` requirements are not applicable.
- Desktop and 390px mobile had no console or page errors, no horizontal overflow, and no serious/critical Axe violations. The mobile Demo control measured 44 x 44 CSS pixels. Reduced-motion transition duration was `0.00001s`.
- Keyboard: the skip link was first, focused `main`, and the in-product review shortcuts worked. The local test suite additionally checks visible focus and browser-extension dialog recovery.
- Offline and update behavior passed locally and in the live flow before the deployment ZIP check: the active service worker was current with no waiting worker; `/demo` reloaded offline with three notes.
- `/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in <temp-evidence-dir>` passed: HTTP 200 in 625 ms, correct title/lang, one `h1`, `main`, no missing image alt attributes or unlabelled buttons, and no browser errors.
- Headers/caching on live HTML, JS, CSS, and service worker are appropriate: CSP self-only, HSTS, `nosniff`, `strict-origin-when-cross-origin`, permission restrictions, 30-second revalidation for HTML/service worker, and immutable caching for hashed JS/CSS. The failing ZIP and unknown-route 404 responses do **not** carry these product headers because Azure is serving its generic error page.

## Required repair and re-verification

1. Deploy `dist/site/downloads/reading-margin-recall-chrome.zip` so the exact live URL returns HTTP 200, `application/zip`, and the built archive bytes.
2. Make the requested candidate SHA fetchable and deploy that exact object (or correct the work order to name the actual commit).
3. Re-run `npm run verify:live` against the deployed candidate. It must complete successfully before this report can change to PASS.
