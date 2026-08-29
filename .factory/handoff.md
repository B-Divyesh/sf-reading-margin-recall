# Handoff — adversarial first-read review 3

## Outcome

**FAIL — two unlisted privacy claims.**

Reviewed repository commit: `8565fb7d421d567ba30a24c1f012c006d21a285d`

Live product receipt: `a9b521ce75b126768bd6d321ea1f46dd1709ccc4`

Live URL: <https://reading-margin-recall.sociobot.in>
Date: 2026-08-29

The complete report is `.factory/review-3.md`. This work order changed review documentation only; no product code was modified.

## Verification

- Cold Home review passed at 390 × 844 and 1440 × 900.
- The one-click demo showed realistic sample use immediately; Reset, Exit, real-data isolation, same-origin requests, and offline reload passed.
- All 14 commands in `.factory/claims.json` passed separately in clean clone `/tmp/rmr-review3-clean-KtyjnC`.
- `npm test`: 53 passed, 2 intentional skips, 0 failed.
- `npm run typecheck` and `npm run verify:deployment`: passed.
- `/opt/fleet/lib/verify-url.sh` passed the live root.
- Live Axe: zero serious/critical findings on seven routes at mobile and desktop sizes.
- Route metadata, HTTP 404, deep links, Back/Forward scroll/focus/announcement behavior, and the complete link crawl passed.
- Landing and README copy audits found no overlong, jargon-heavy, metaphorical, inconsistent, or non-result-naming copy.
- Every F-1-1 through F-1-23 and F-2-1 through F-2-4 repair was independently confirmed live and in source/tests.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run verify:deployment
/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in /tmp/rmr-review3-verify-url
```

Run each `test` command in `.factory/claims.json` separately from a clean clone to reproduce the claim matrix.

## Known gaps / next steps

Resolve F-3-1 and F-3-2 in `.factory/review-3.md`: either remove the broader privacy promises or register their exact wording and test the named flows with request logs. The live receipt predates repository HEAD only because later commits contain `.factory` verification documentation; product files are identical.
