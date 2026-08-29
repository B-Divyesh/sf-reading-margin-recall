# Handoff — adversarial review 4

## Outcome

**FAIL — two major claim-registry findings remain; no blocking defect was reproduced.**

- Review report: `.factory/review-4.md`
- Reviewed repository commit: `9ab604d0841e39d94cdd797df78589f64d641d7e`
- Live receipt: `f68aabd6dfa0c3e3cd7c7ac55a1d3431265500c1`
- Work order: `reading-margin-recall-review-4`

The cold mobile and desktop first screens are clear. The one-click demo is realistic, resettable, offline-capable, and isolated from a seeded real-note namespace. All 14 registered claim commands and the full 55-test suite passed. Every earlier finding from reviews 1–3 remains fixed.

The review fails because two live privacy statements are absent from `.factory/claims.json`: Home says “No tracking scripts,” and `/privacy` says clearing site browser storage “removes everything.” The second statement also fails to distinguish web-app data from extension data. Exact fixes and proposed tests are in F-4-1 and F-4-2.

## Verification performed

- Fresh live Chromium contexts at 390 × 844 and 1440 × 900.
- One-click demo reveal, capture, review, JSON export, Reset, Exit, real-data sentinel, and offline reload.
- Same-origin request and console/page-error logging for the live flow.
- Live metadata, one-h1/main/lang checks, Axe scans, 404, security headers, deep links, Back/Forward focus/scroll/announcement, and all-link crawl.
- Every `.factory/claims.json` command run separately after `npm ci` in clean clone `/tmp/rmr-review4-clean-wFgf4r`.
- `npm test -- --reporter=line`: 53 passed, 2 intentional skips.
- `npm run typecheck`: passed.
- `npm run verify:deployment`: passed.
- `/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in /tmp/rmr-review4-verify-url`: passed after creating the evidence directory.

## Next steps

1. Resolve F-4-1 by removing “No tracking scripts” or registering and directly testing the exact promise.
2. Resolve F-4-2 with scoped web-app/extension deletion wording and a seeded two-store test.
3. Re-run every claim command and `npm test` before the next review.

No product code was changed during this review.
