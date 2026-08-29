# Handoff — repair 4

## Outcome: PASS

The release-blocking public extension download is repaired and deployed. The prior
candidate `ae2f3d23145292a0b9e6d5ec65f0be9e40261a2b` was not a Git object; the
repair uses a real pushed commit and the deployed build receipt proves the live
site, archive, and candidate identity belong to one release. The current release
candidate is always exposed at `/build-info.json` and checked against
`origin/main` by `npm run verify:live`.

## What changed

- Reproduced the original cache-busted download request: it returned `404`,
  `text/html`, 2,400 bytes, SHA-256
  `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3`.
- Deployed the actual static distribution root, `dist/site`, including
  `downloads/reading-margin-recall-chrome.zip`.
- The build now writes a same-origin `build-info.json` receipt with the Git SHA,
  archive path, byte count, and SHA-256. It is `no-store` and noindex.
- `npm run verify:live` now requires the local receipt, deployed receipt,
  `origin/main`, and requested candidate SHA to match before it tests the live
  ZIP. It also verifies the ZIP response's status, MIME type, ZIP magic, byte
  count, and digest.
- The extension-download claim regression now hashes the archive served by the
  production-shaped local server and compares it to both the exact built archive
  and its receipt.

## Deployment evidence

Deployment used `/opt/fleet/lib/deploy-static.sh reading-margin-recall dist/site`
to the existing Static Web App and `https://reading-margin-recall.sociobot.in`.
Immediately after deployment, the exact download URL returned:

| Check | Result |
| --- | --- |
| URL | `https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip` |
| HTTP / MIME | `200` / `application/zip` |
| Bytes | `13,734` |
| SHA-256 (live and local) | `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0` |
| Archive integrity | `unzip -t` passes |
| Manifest | Manifest V3 |

The post-deploy gate passed with the candidate obtained from the pushed checkout,
and its live receipt matched that SHA and the archive values above. Run
`RMR_CANDIDATE_SHA=$(git rev-parse HEAD) npm run verify:live` after any later
deployment to reproduce the identity check.

## Verification

- Fresh `npm ci`: 145 packages; `npm audit` and `npm audit --omit=dev`: zero
  vulnerabilities.
- `npm run typecheck`: passed.
- `npm test`: 44 passing Playwright tests, including claims, installed MV3
  extension consumer flow, local offline/update behavior, keyboard flow, and
  390px layout/accessibility checks.
- `npm run build`: passed. First-load site JS is 24,536 bytes raw / 8,850 gzip;
  CSS is 16,587 bytes raw / 4,511 gzip.
- `npm run verify:live`: passed. It verified byte-identical HTML/assets/service
  worker/ZIP, branded 404 and response headers, zero third-party requests,
  desktop demo capture/review, keyboard shortcuts, service-worker update and
  offline demo reload, 390px target/overflow/text-resize behavior, reduced
  motion, and zero serious/critical Axe findings.

## Known gaps / next steps

None. The repair retains the original WXT MV3 extension plus static PWA artifact
and deployment class. Future releases must deploy `dist/site`, not the site-only
build output, and must pass `npm run verify:live` against the pushed candidate.

See `.factory/verification-4.md` for complete evidence and severity assessment.
