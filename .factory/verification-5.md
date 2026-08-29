# Independent verification 5 — FAIL

**Date:** 2026-08-29
**Candidate:** `7e4742865ed73093da03ba44af9cb8a76ece4d2f`
**Live URL:** https://reading-margin-recall.sociobot.in
**Verdict:** **FAIL — do not release.**

The candidate is healthy locally, but production is incomplete. The live root
HTML, JS, CSS, hero, and service worker are byte-identical to this candidate;
the absent files and fallback are fresh deployment defects.

## Mandatory first checks

### Claim contract

`.factory/claims.json` exists with 11 claims. Before installation, every exact
claim command was attempted and stopped before its test body with `wxt: not
found`, as expected for a dependency-free clean checkout. After `npm ci` (145
packages; 0 vulnerabilities), I reran every exact command and all exited 0.
The consolidated production-build run, `npm test -- --grep @claim:`, recorded
11 passed and one intentional mobile duplicate skip.

| Claim | Result |
| --- | --- |
| `source-linked-capture` | PASS |
| `extension-selection` | PASS (Chromium; mobile duplicate skipped) |
| `demo-isolated` | PASS |
| `local-only` | PASS |
| `offline-reload` | PASS |
| `json-backup` | PASS |
| `keyboard-review` | PASS |
| `free-tools` | PASS |
| `delete-notes` | PASS |
| `extension-download` | PASS against local production-shaped server |
| `http-source-links` | PASS |

### First read, cold live visit

**PASS.** The first screen says “Save passages for later recall,” identifies
language learners, explains selected sentences become source-linked review
notes, and shows **Try it with sample data**. The adjacent copy explains it
loads three notes without touching real ones. One click opens `/demo` with the
persistent demo banner, Reset demo, and Start for real.

## Release-blocking defects

### P0 — deployed extension installer is absent

`GET /downloads/reading-margin-recall-chrome.zip` returns **404** and Azure
Static Web Apps generic HTML, rather than `application/zip`. The real empty
state links to it as “Download the extension,” so a browser-extension product
cannot be installed end to end from production.

Fresh local build evidence: `dist/site/downloads/reading-margin-recall-chrome.zip`
is 13,734 bytes, SHA-256
`ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`;
`unzip -t` passes and its manifest is MV3.

### P0 — required live build receipt is absent

`GET /build-info.json` returns **404**. The fresh candidate build contains the
receipt naming `7e4742865ed73093da03ba44af9cb8a76ece4d2f` and the installer
digest above. Therefore the required command
`RMR_CANDIDATE_SHA=7e4742865ed73093da03ba44af9cb8a76ece4d2f npm run verify:live`
fails with `Build receipt returned 404.` Production cannot prove its candidate
identity or installer identity.

### P1 — unknown URLs receive a generic third-party 404

`GET /release-check-not-found-verify` returns Azure Static Web Apps’ generic
404, not the candidate’s `Page not found — Reading Margin Recall` / `We could
not find this page`. It lacks the configured CSP, HSTS, nosniff,
referrer-policy, and cache headers; its HTML loads from `appservice.azureedge.net`
and `ajax.aspnetcdn.com`. This violates the product-owned accessible 404,
response-header policy, and same-origin privacy baseline for error pages.

## Successful checks

- `npm run typecheck`: PASS.
- `npm test`: PASS — 43 passed, one intentional mobile extension duplicate
  skip, zero failures (55.8 s). It covers MV3 capture/popup/review, PWA
  offline/update, import/storage failures, source validation, keyboard,
  desktop/mobile, and local Axe.
- Exact `npm run build`: PASS. Initial JS is 24,536 bytes / 8,850 gzip; CSS is
  16,587 bytes / 4,500 gzip (within budget).
- Live desktop normal flow passed: demo capture, Space reveal, `3` grade,
  `javascript:` source rejection/recovery to HTTPS, and demo-data cleanup.
- A fresh demo live context passed service-worker update and offline reload with
  all three notes retained.
- Live `/`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` had one
  h1/main, correct titles/lang, zero serious/critical Axe findings, and no
  console/page errors. Keyboard skip link focused `main`.
- At 390×844: zero horizontal overflow, 44×44 Demo target, zero overflow at
  200% text, and reduced-motion transition duration 0.00001 s.
- Full cold-load and normal-flow request logs were same-origin only. No
  analytics, third-party fonts, or tracking were observed. The broken generic
  404 is the exception.
- Root, JS, CSS, hero, and service worker SHA-256 values exactly match local.
  Root/SW cache for 30-second revalidation; hashed assets are immutable.
- Lighthouse mobile live: Performance **100**, Accessibility **100**, LCP 0.3
  s, CLS 0, and 51 KiB transfer.

`verify-url.sh` is not present in this repository. Equivalent
title/lang/main/alt/console checks were run in Playwright. This static local
product has no server endpoint, paid unlock, or sign-in, so rate-limit/429 and
Entra checks are not applicable.

## Required release actions

1. Deploy complete generated `dist/site`, including `build-info.json`,
   `downloads/reading-margin-recall-chrome.zip`, and `404.html`.
2. Recheck the ZIP is 200, `application/zip`, byte-identical, and valid.
3. Recheck the receipt is 200/no-store, then rerun the candidate `verify:live`
   command above.
4. Recheck an unknown URL returns the branded 404, configured headers, and no
   third-party requests.
