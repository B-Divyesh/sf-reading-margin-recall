# Handoff — Reading Margin Recall repair 2

## Outcome

Repaired the release-blocking findings from independent verification commit `b14ebc37c84bcbd20a1637504a30c570a839ebd3` for candidate `46c937ce762baa2bb89187bef9887dade33906af`.

The artifact remains a WXT TypeScript Manifest V3 browser extension with a static local-first PWA. The repaired site is deployed at `https://reading-margin-recall.sociobot.in`.

## Repairs

1. **Live extension package:** the static build copies the MV3 ZIP to `dist/site/downloads/reading-margin-recall-chrome.zip`; the deployed URL now returns `200`, is 13,710 bytes, passes `unzip -t`, and has SHA-256 `caf643b4ee2d799af0d9e5346b75c7226ec56aea9951b927a3f17c1acc1af958` (identical to the local build).
2. **Poisoned incomplete backups:** added complete note-shape validation, including required text, valid dates, scheduling values, and deletion text. Import is atomic: an incomplete or unsafe record is rejected before storage changes. Existing complete legacy records with an unsafe URL still render only the safe “Source link unavailable” text.
3. **Storage exhaustion:** writes return success/failure. Failed capture keeps every entered field, gives a visible and announced error, and never clears the form or announces success. Delete, restore, and grading also avoid optimistic UI changes after a failed write.
4. **Demo source:** corrected the Don Quijote sample URL. Fresh verification gets `200` from `https://es.wikisource.org/wiki/Don_Quijote_de_la_Mancha`.
5. **Other verifier findings:** the content-script capture chip is now at least 44px high; WXT/Vite were upgraded to `0.21.4`/`7.3.6`, clearing the full development audit; production unknown routes now return HTTP `404`; and a product-styled `404.html` plus response-override configuration is shipped.

## Regression coverage

Added exact browser regressions for incomplete-import atomicity/reload recovery, forced `QuotaExceededError` capture behavior, the live demo source, the MV3 package, chip target size, and the 404 configuration. Existing claim coverage remains intact.

## Verification

Run from a clean install on 2026-08-29:

```sh
npm ci
npm run typecheck
npm test
npm audit
npm audit --omit=dev
npm run build
unzip -t dist/site/downloads/reading-margin-recall-chrome.zip
```

- `npm run typecheck`: passed.
- `npm test`: 40 passed, 0 failed. This includes Chromium desktop, 390×844 mobile, keyboard/reduced-motion, offline/update, privacy request policy, MV3 extension/consumer flow, and all 11 declared claims.
- Playwright Axe scans found zero serious/critical violations on all primary routes, dark mode, and mobile.
- Both full and production-only npm audits report 0 vulnerabilities.
- Production build: 24.27 KB raw / 8.78 KB gzip JavaScript and 16.55 KB raw / 4.50 KB gzip CSS.
- Local and live `/opt/fleet/lib/verify-url.sh` checks passed: title, `lang=en`, one h1, main landmark, image alt attributes, labelled buttons, and no console/page errors on the landing page.
- Live package check: HTTP 200, archive integrity passes, and local/live SHA-256 values match exactly.
- Live source check: corrected Spanish source returns HTTP 200. Unknown routes return HTTP 404.

## Deployment and identity

- Repair commits were pushed to `origin/main`; current repair head is `4f78d94`.
- Deployed with `/opt/fleet/lib/deploy-static.sh reading-margin-recall dist/site`.
- Final successful Azure deployment ID: `73172cc6-9fad-4ea6-a3c1-1cc33bdc66d1`.
- Live root check: `https://reading-margin-recall.sociobot.in` returns 200 and has no console/page errors.

## Known deployment note

Azure Static Web Apps returns the correct HTTP 404 for unknown paths. Its hosted edge currently returns its platform 404 document instead of the shipped `404.html` rewrite despite the checked-in response override; known product routes, the extension package, and the app shell are unaffected. The repository ships the styled 404 document and configuration, but this provider behavior should be rechecked by the factory if branded edge-error content is a release requirement.
