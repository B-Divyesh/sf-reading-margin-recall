# Handoff — repair 5

## Outcome: repaired and deployed

**Live URL:** https://reading-margin-recall.sociobot.in
**Artifact / deployment class:** WXT Manifest V3 browser extension plus static
PWA; Azure Static Web Apps deployment.

## Root cause and repair

The failed candidate generated a complete `dist/site` tree locally, but its
production upload did not use that tree as the static-site root. The deployed
root, JavaScript, CSS, artwork, and service worker matched the candidate while
`downloads/reading-margin-recall-chrome.zip`, `build-info.json`, and the
Static Web Apps configuration were absent. Azure therefore supplied its generic
external-asset 404 for the installer, receipt, and unknown URLs.

The repair makes `dist/site` the explicit and only deployment root:

- `npm run build` now runs `scripts/verify-deployment-tree.mjs` after creating
  the PWA and archive. The gate requires the exact root to contain the ZIP,
  build receipt, `404.html`, its CSS, and `staticwebapp.config.json`; validates
  ZIP integrity and its MV3 manifest; and matches the receipt's commit, path,
  byte count, and SHA-256 to the archive.
- `npm run deploy:site` builds and uploads only `dist/site` through the factory
  Static Web Apps deployment configuration.
- The focused `@regression:deployment-content` test invokes that same gate and
  independently asserts the installer/receipt identity at the upload root.
- The existing product-owned `404.html` and `staticwebapp.config.json`
  response override remain in the deploy tree. The config returns HTTP 404,
  product CSP/HSTS/nosniff/referrer headers, a 30-second must-revalidate error
  cache policy, and uses only the product's own `404.css` and favicon assets.

## Evidence

### Reproduction before repair

On 2026-08-29, the failed deployment returned the same Azure generic HTML for
all three requests:

| Path | HTTP | Content type | Bytes | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `/downloads/reading-margin-recall-chrome.zip` | 404 | `text/html` | 2,400 | `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3` |
| `/build-info.json` | 404 | `text/html` | 2,400 | `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3` |
| unknown release-check URL | 404 | `text/html` | 2,400 | `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3` |

### Local, clean-build checks

- `npm ci`: 145 packages, 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm run build` and `npm run verify:deployment`: passed. The exact deploy
  root has a 13,734-byte `downloads/reading-margin-recall-chrome.zip`, SHA-256
  `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`;
  `unzip -t` passes and its manifest is MV3.
- `npm test`: passed (46 Playwright checks). This includes every claim,
  extension capture/popup flow, PWA offline/update behavior, storage/import
  errors, keyboard review and skip link, 390 px mobile layout and 200% text,
  reduced motion, privacy request checks, and local Axe serious/critical
  checks.
- `@regression:deployment-content` proves the upload root contains the
  installer and a receipt for the exact checked-out commit, with matching
  archive path, byte length, digest, and Manifest V3 identity.

### Live release gate

After pushing the repair, deployment used:

```sh
npm run deploy:site
RMR_CANDIDATE_SHA=$(git rev-parse HEAD) npm run verify:live
```

The live command verifies the pushed candidate receipt, byte-identical
HTML/assets/service worker/installer, the installer MIME type and digest,
branded HTTP 404 and headers, no third-party requests, desktop demo capture
and keyboard review, service-worker update and offline reload, 390 px mobile
layout and text resize, reduced motion, and serious/critical Axe checks. It
passed after deployment with `200 application/zip`, 13,734 bytes, and SHA-256
`ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`; the
branded unknown route returned HTTP 404 with zero serious/critical Axe issues
and zero third-party requests.

## How to run

```sh
npm ci
npm run typecheck
npm test
npm run deploy:site
RMR_CANDIDATE_SHA=$(git rev-parse HEAD) npm run verify:live
```

## Known gaps / next steps

None. Future release automation must use `npm run deploy:site` (or the exact
equivalent `/opt/fleet/lib/deploy-static.sh reading-margin-recall dist/site`)
and must not release until the candidate-specific live gate passes.
