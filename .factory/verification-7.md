# Independent verification 7 — PASS

**Date:** 2026-08-29  
**Candidate:** `47e669cdb764d5fbeec7dccc6e5c2e510418b8d3`  
**Live URL:** <https://reading-margin-recall.sociobot.in>  
**Verdict:** **PASS — release candidate accepted.**

The previous deployment-only failure is resolved. This fresh independent QA found the candidate build, receipt, installer, and product 404 deployed correctly.

## Mandatory first checks

### Claims contract

`.factory/claims.json` exists with 11 claims. After `npm ci` in the clean checkout, each declared command was run separately against the shipped demo entry point and passed.

| Claim ID | Result |
| --- | --- |
| `source-linked-capture` | PASS |
| `extension-selection` | PASS (Chromium; intentional mobile duplicate skipped) |
| `demo-isolated` | PASS |
| `local-only` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
| `keyboard-review` | PASS |
| `free-tools` | PASS |
| `delete-notes` | PASS |
| `extension-download` | PASS |
| `http-source-links` | PASS |

The exact command for each row was `npm test -- --grep @claim:<id>`. The full-suite artifact `test-results/.last-run.json` reports `status: passed` and no failed tests. Landing, README, Privacy, and Terms material claims map to this contract; no unlisted visitor-reliant claim was found.

### First read, cold live visit

**PASS.** The first screen says **“Save passages for later recall”**, names **language learners** who want selected sentences as source-linked review notes, and offers **“Try it with sample data.”** The adjacent sentence says the click loads three notes without touching real notes. One click opened `/demo`, showed three realistic French, German, and Spanish notes, and displayed the persistent **Demo — sample data, nothing is saved to your notes** banner with **Reset demo** and **Start for real**.

## Local and live evidence

| Check | Result |
| --- | --- |
| Clean checkout / `origin/main` | PASS — both identify `47e669cdb764d5fbeec7dccc6e5c2e510418b8d3` |
| `npm ci` | PASS — 145 packages; audit found 0 vulnerabilities |
| All 11 claim commands | PASS |
| `npm test` | PASS — 46 Playwright tests, zero failures |
| `npm run typecheck` | PASS |
| lint | No lint script exists in `package.json` |
| `npm run build` | PASS — complete `dist/site` generated |
| `npm run verify:deployment` | PASS — complete deploy tree, MV3 installer, receipt and 404 |
| `npm audit` and `npm audit --omit=dev` | PASS — 0 vulnerabilities |
| `RMR_CANDIDATE_SHA=47e669cdb764d5fbeec7dccc6e5c2e510418b8d3 npm run verify:live` | PASS |

The initial bundle is 24,536 B JavaScript (8,850 B gzip) and 16,764 B CSS (4,480 B gzip), with no downloaded fonts. The mobile and desktop hero assets are 25,872 B and 109,412 B. All are within applicable budgets.

## End-to-end exercise

- The live demo loaded three notes. A new French passage, gloss, hidden word, and HTTPS source saved successfully. Space revealed its answer and `3` graded it.
- `javascript:alert(1)` in Source URL was rejected with an accessible correction and saved no note. Replacing it with `https://example.com/recovery-check` saved successfully, with no console/page errors.
- The full suite covers incomplete-import atomicity, storage-quota recovery, delete/undo, JSON export/import, review filters, demo isolation, and legacy unsafe source data.
- The built MV3 extension was loaded in a fresh Chromium profile. It captured only normal selected text into extension-local storage; its popup revealed/graded via Space/`4`, opened the source, and deleted the note. Popup Axe had no serious/critical issues. Its only permissions are `storage` and `activeTab`.

## Deployment, privacy, PWA, accessibility, and links

- `npm run verify:live` compared live HTML, JS, CSS, service worker, and ZIP byte-for-byte with the fresh build. The receipt identifies the candidate. The installer is HTTP 200 `application/zip`, 13,734 B, SHA-256 `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`.
- Live desktop capture/review, keyboard grading, demo exit, offline reload, and service-worker update passed. The worker is active and current, with no waiting update.
- Whole-flow Playwright logs found zero third-party requests and zero console/page errors. A separate invalid-input/recovery flow requested only same-origin document/assets. There are no analytics, remote fonts, sign-in, billing, product-unlock call, or server endpoint; Entra and API allowance/429 checks are not applicable.
- Desktop plus all seven 390×844 routes had no horizontal overflow, no visible target below 44×44 px, no direct text below 16 px, and zero serious/critical Axe issues. At 200% text there was no overflow. The first Tab reaches the visible 3 px skip-link focus ring; reduced motion removes transitions.
- Root and 404 have `lang`, title, one `h1`, one `main`, alt text, no console errors, and no serious/critical Axe issues. Unknown routes return the product’s secure 404 rather than Azure’s generic page.
- Hashed assets are one-year immutable; HTML/SW use 30-second must-revalidate; build receipt is no-store; ZIP has a one-hour cache. CSP restricts connections to `self`. All product routes, installer, sample sources, and the factory link returned 200; `mailto:` links are exempt.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run verify:deployment
RMR_CANDIDATE_SHA=47e669cdb764d5fbeec7dccc6e5c2e510418b8d3 npm run verify:live
```
