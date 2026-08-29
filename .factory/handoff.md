# Handoff — polish round 3

## Outcome

**PASS — no review finding remains.**

- Product repair commit: `02891713ae061b0da1a1ddd2af8a11cfb0f78a19`
- Deployed candidate and live build receipt: `6d163ef244e26780c9fd8a54b03dbcd47d229add`
- Live URL: <https://reading-margin-recall.sociobot.in>
- Date: 2026-08-29

The product retains its botanical field-guide identity. The final repair closes F-3-1 by replacing the unproved negative extension promise with the exact selected-text/local-store claim. It closes F-3-2 by registering the exact no-third-party-request promise and proving it through capture, review and grading, JSON export, and demo Reset/Exit in fresh browser storage.

## Evidence

- `.factory/polish-3.md` maps every F-1-1 through F-1-23, F-2-1 through F-2-4, and F-3-1 through F-3-2 to its change, test, screenshot, and live route.
- Fresh clone `/tmp/rmr-polish3-clean-UQKmVM` at repair commit `0289171…`: `npm ci` passed; every one of the 14 claim commands in `.factory/claims.json` passed independently. Exit codes are recorded in `.factory/evidence/polish-3/claims-fresh.tsv`.
- The same clean clone passed `npm test` (53 passed, 2 intentional mobile-project skips), `npm run typecheck`, `npm run verify:deployment`, and `npm audit --omit=dev` (0 vulnerabilities).
- Local production verification also passed `npm test`, typecheck, deployment-tree validation, claim-tag uniqueness (14 IDs, one tag each), and diff whitespace checks.
- `npm run deploy:site` succeeded. `npm run verify:live` passed against the public hostname; `.factory/evidence/polish-3/verify-live.json` records byte-matched site assets, worker, and MV3 ZIP, a real 404, offline demo reload, a current service worker, keyboard review, zero cross-origin requests, and zero serious/critical Axe violations.
- `/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in` passed. Its report is `.factory/evidence/polish-3/verify-url-live/verify.json`: 613 ms cold load, zero console/page errors, title, `lang=en`, one h1, one main, image alt text, and labelled buttons.
- Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 908 ms, LCP 1,058 ms, TBT 5 ms, CLS 0. Full JSON: `.factory/evidence/polish-3/lighthouse-live.json`.
- Cold live captures: `live-home-desktop.png`, `live-demo-mobile.png`, `live-privacy-desktop.png`, and `live-404-desktop.png` under `.factory/evidence/polish-3/`. The live demo recheck confirms sample data, banner, Reset, Exit, and Reveal in the first mobile screen. The live Privacy recheck confirms the two repaired sentences.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run verify:deployment
npm audit --omit=dev
```

Run every `test` command in `.factory/claims.json` separately in a fresh clone. For the deployed product, run:

```sh
npm run verify:live
/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in /tmp/rmr-verify-url
```

## Known gaps / next steps

None. The static app and MV3 extension have no backend, billing, authentication, analytics, or AI runtime surface. No external account or service configuration remains to complete.
