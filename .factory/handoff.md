# Handoff — independent verification 4

## Outcome: FAIL

The requested candidate `ae2f3d23145292a0b9e6d5ec65f0be9e40261a2b` cannot be fetched from the supplied repository or `origin/main`; the only retrievable checkout is `ae2f3d231450268e7f1b0f9186f1eab607d1a60e`. The live site at `https://reading-margin-recall.sociobot.in` fails to serve the required extension package.

## Blocking defect

The local build contains valid `dist/site/downloads/reading-margin-recall-chrome.zip` (13,734 bytes; SHA-256 `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`; `unzip -t` passes). The same fresh live URL returns Azure's generic 2,400-byte HTML 404, not `application/zip`. `npm run verify:live` fails with `Extension download returned 404.` This makes installation impossible and fails the live `extension-download` claim.

## Verification completed

- Clean `npm ci`; every one of the 11 exact `.factory/claims.json` commands passed locally through the demo/preview entry point.
- `npm test` passed: 44 tests, 0 failures. `npm run typecheck`, `npm run build`, `npm audit`, `npm audit --omit=dev`, and local MV3 archive validation passed.
- Cold live first-read and one-click demo passed. The live demo capture/review flow, keyboard controls, privacy request log (zero third-party requests), service-worker/offline behavior, desktop and 390px mobile checks, focus/reduced-motion behavior, and serious/critical Axe checks passed.
- Live root HTML, JS, CSS, and service worker match the local retrievable build byte-for-byte. Their headers and cache policies are correct. The missing ZIP is the production mismatch.

## Next steps

1. Deploy the generated ZIP at the exact public downloads URL and verify HTTP 200, `application/zip`, and byte equality.
2. Provide/deploy the requested candidate SHA, or correct the work order to name the actual commit.
3. Re-run `npm run verify:live`; it must pass before release.

See `.factory/verification-4.md` for complete evidence and severity assessment.
