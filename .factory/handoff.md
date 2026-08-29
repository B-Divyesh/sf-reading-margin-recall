# Handoff — independent verification 3

## Outcome

**FAIL — do not release.**

Fresh independent QA tested candidate `d8cc4216eea5064b364901510edf3138f3f98705` at `https://reading-margin-recall.sociobot.in` on 2026-08-29. The full report is `.factory/verification-3.md`.

## Release blockers

1. The live **Download the extension** URL still returns `404 text/html`. The valid local MV3 ZIP is 13,710 bytes with SHA-256 `caf643b4ee2d799af0d9e5346b75c7226ec56aea9951b927a3f17c1acc1af958`, but it is absent from production.
2. The configured custom 404 target is absent from `dist/site`. Unknown paths therefore show Azure's generic page, make third-party CDN requests, omit product security headers, and produce a critical Axe `image-alt` violation.

## Other defects

- Leaving demo mode through the wordmark or footer keeps edited `demo:` storage after the demo banner disappears.
- The 390 px header Demo target is `42.45×44` CSS px, below the 44×44 baseline.
- Escape from the extension capture dialog returns focus to the host page body.
- The switch from the brief's one-time monetization to an entirely free product is not explained.

## Verification summary

- Mandatory first read: PASS; what, audience, first action, and one-click sample demo are clear in the first viewport.
- All 11 `.factory/claims.json` commands: PASS after `npm ci`; the `extension-download` promise separately FAILS on the live deployment.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 39 passed / 1 intentional mobile duplicate skipped / 0 failed.
- `npm audit` and `npm audit --omit=dev`: PASS, 0 vulnerabilities.
- Exact `npm run build`: PASS; ZIP integrity PASS.
- Normal live capture/review/delete/undo, invalid URL, malformed import, storage-full recovery, demo isolation, and sample links: PASS.
- Locally built extension installed in a clean Chromium profile and completed capture → popup review → source return → delete: PASS.
- Live PWA service-worker update and offline demo reload: PASS.
- Standard route Axe scans: 0 serious/critical; deployed unknown route: 1 critical.
- Lighthouse mobile: 97 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 1.07 s, TBT 181 ms, CLS 0.
- Live HTML, hashed JS/CSS, service worker, manifest, metadata files, and hero assets match the candidate byte-for-byte. The missing ZIP is an incomplete deployment; the missing built 404 is a candidate build defect.
- Product flows are same-origin and local-first. There are no product server endpoints, billing calls, or sign-in, so rate-limit and Entra checks are not applicable.

## Re-run

```sh
npm ci
npm run typecheck
npm test
npm audit
npm audit --omit=dev
npm run build
unzip -t dist/site/downloads/reading-margin-recall-chrome.zip
/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in <evidence-directory>
```

After redeployment, verify both of these explicitly:

```sh
curl -i https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip
curl -i https://reading-margin-recall.sociobot.in/definitely-not-a-route
```

The first must return the ZIP with 200. The second must return the product's styled 404 with status 404 and the product security headers.
