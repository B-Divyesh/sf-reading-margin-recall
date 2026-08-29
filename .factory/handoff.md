# Handoff — verification 6 release repair

## Outcome

The verifier-6 blockers for candidate `b5e3f3d061e73d202ddcac06c9656219666055a7` are repaired. The browser-extension artifact class, WXT + TypeScript implementation, local-first behavior, researched scope, and field-guide visual system are unchanged.

## Reproduced before repair

On 2026-08-29, fresh production requests reproduced the controller evidence exactly:

- `/build-info.json`: HTTP 404, `text/html`, 2,400 bytes, SHA-256 `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3`.
- `/downloads/reading-margin-recall-chrome.zip`: the same generic Azure 404 response.
- `/release-check-repair-6-not-found`: the same generic Azure document with no product security or cache headers.
- At 390 px, the wordmark was 164.4 × 40 px; Open source was 119.5 × 24.8 px; the privacy link was 193.8 × 19 px; Terms was 40.5 × 21.3 px. Informational text measured 11.52–15.36 px.

## Repairs

- Made `npm run build:site` the complete release assembler. It now builds and packages the WXT MV3 extension, runs Vite, copies the product 404, includes `staticwebapp.config.json`, writes the ZIP and matching `build-info.json`, and validates the exact `dist/site` root. The Vite-only step is no longer the public site build command.
- Made `npm run deploy:site` build and verify the complete tree, deploy exactly `dist/site`, and run the candidate-specific live gate. A partial upload can no longer report success.
- Retained the branded `404.html` response override and product CSP, HSTS, nosniff, referrer, permissions, MIME, cache, and noindex policies in the deployed tree.
- Raised every visible site target to at least 44 × 44 CSS px and every direct text run to at least 16 px at 390 px, including the wordmark, contextual links, footer links, facts, labels, demo copy, and filter checkbox.
- Bumped the service-worker cache to `reading-margin-recall-v6` so existing installs update to the repaired shell.
- Added exact regression coverage that deletes `dist/site`, runs only `npm run build:site`, and requires the ZIP, receipt, 404, stylesheet, and policy at the deploy root.
- Added a seven-route 390 px regression audit for target size, text size, overflow, and serious/critical Axe results. The same audit is part of `npm run verify:live`.
- Extended the live gate to require the product 404 and its noindex directive, no third-party requests, no console errors, security/cache headers, a byte-identical ZIP, and a matching candidate receipt.

## Verification evidence

Clean local release checks on 2026-08-29:

- `npm ci`: 145 packages installed; 0 vulnerabilities.
- `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities.
- `npm run typecheck`: pass.
- `node --check` for all release scripts: pass.
- `npm test`: 44 passed; two intentional mobile duplicates skipped. This includes desktop, 390 px mobile, keyboard, dark mode, Axe, offline reload/update, demo isolation, storage errors, installed-extension capture/popup/review/delete, and package-consumer checks.
- Every exact command in `.factory/claims.json`: pass for all 11 claim IDs.
- `npm run build` and `npm run verify:deployment`: pass.
- `unzip -t dist/site/downloads/reading-margin-recall-chrome.zip`: pass; MV3 archive is 13,734 bytes with only `storage` and `activeTab` permissions.
- Local `verify-url.sh`: 200 in 557 ms; no console errors; title, `lang=en`, one h1, main, image alt text, and button names pass.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 40 ms, CLS 0.
- Production sizes: JS 24,536 bytes (8,850 gzip), CSS 16,764 bytes (4,480 gzip), mobile hero 25,872 bytes, desktop hero 109,412 bytes.

Production verification of repair commit `95d130fb2593ed468776c4424df612c041ce772a`:

- Azure deployment `4330c006-1892-4f2f-9493-2365de18fa18` uploaded the complete 336,593-byte `dist/site` artifact.
- `/build-info.json`: HTTP 200, `application/json`, `no-store`, and the expected commit and extension digest.
- `/downloads/reading-margin-recall-chrome.zip`: HTTP 200, `application/zip`, 13,734 bytes, SHA-256 `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`.
- A fresh unknown URL: HTTP 404 with the 958-byte product document, CSP, HSTS, nosniff, referrer policy, 30-second revalidation, no third-party requests, no console errors, and zero serious/critical Axe findings.
- `npm run verify:live`: pass for byte-identical site assets and service worker; candidate identity; desktop capture/review/keyboard flow; offline reload/update; seven-route 390 px target/text/overflow/Axe audit; 200% text; and request privacy.

## Run and verify

```sh
npm ci
npm audit
npm audit --omit=dev
npm run typecheck
npm test
npm run build
npm run verify:deployment
unzip -t dist/site/downloads/reading-margin-recall-chrome.zip
npm run deploy:site
```

`npm run deploy:site` requires the factory Azure identity and runs `npm run verify:live` after upload. For a separate post-deploy check, run:

```sh
RMR_CANDIDATE_SHA=$(git rev-parse HEAD) npm run verify:live
```

## Known gaps and next steps

No product gaps are known. The extension is distributed as a ZIP for developer-mode installation; publishing to a browser store remains a factory distribution decision, not a product dependency.
