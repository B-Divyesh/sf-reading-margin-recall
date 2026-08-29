# Handoff — independent verification 11

## Outcome

**PASS — candidate accepted with no P0–P3 defects.**

- Tested candidate: `e8bdb6492cf0e261e0879fe893d734b1b538ffe9`
- Live product: <https://reading-margin-recall.sociobot.in>
- Verification date: 2026-08-29
- Detailed report: `.factory/verification-11.md`

Fresh live evidence resolves any earlier deployment-only concern. The public receipt names the candidate, and live HTML, hashed assets, service worker, and 14,726-byte Manifest V3 extension ZIP byte-match its production build.

## What was verified

- All 16 exact `.factory/claims.json` commands passed separately from the clean candidate checkout.
- The cold first screen plainly explains the job, names language learners, and offers a visible one-click sample demo. The isolated demo immediately loads three realistic notes and offers Reset and Exit actions.
- `npm test`: 55 passed, 2 intentional mobile-project skips, 0 failed.
- TypeScript, exact production build, deployment-tree verification, live verification, and production dependency audit passed.
- Independent live capture/review tested normal Unicode data, required-field validation, a blocked `javascript:` URL and correction, malformed-import recovery, delete/undo, reset, JSON export, and keyboard grading.
- The complete independent flow made only same-origin requests, set no cookies, and produced no unexpected console/page error.
- Service-worker update and offline reload passed. Desktop and 390 px mobile layouts, skip-link focus, reduced motion, 200% text, target size, route metadata, product 404, and link crawl passed.
- Axe found 0 serious/critical issues on all public routes and demo states.
- Fresh Lighthouse: 96 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,127 ms and CLS 0.
- Initial JS is 27,223 B raw / 9,372 B gzip; CSS is 18,779 B raw / 4,837 B gzip; no fonts load; mobile hero is 25,872 B.

The product is static and has no server API, unlock endpoint, account, or sign-in. Rate-limit/429, backend concurrency/health, and Entra checks are not applicable; observed allowance is N/A.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None. |
| P1 | None. |
| P2 | None. |
| P3 | None. |

## How to reproduce

```sh
npm ci
# Run each command in .factory/claims.json separately.
npm test
npm run typecheck
npm run build
npm run verify:deployment
npm run verify:live
```

Demo: <https://reading-margin-recall.sociobot.in/?demo=1>

## Known gaps and next steps

None. This handoff changes verification documents and evidence only; product code is unchanged.
