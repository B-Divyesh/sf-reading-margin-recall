# Handoff — independent verification 9

## Outcome

**PASS — candidate accepted with no defects found.**

Tested commit: `a9b521ce75b126768bd6d321ea1f46dd1709ccc4`

Tested URL: <https://reading-margin-recall.sociobot.in>
Date: 2026-08-29

Fresh deployment evidence resolves the earlier deployment-only failure. The live shell, hashed assets, service worker, build receipt, custom 404, and downloadable MV3 extension match the candidate build byte-for-byte.

## Verification summary

- `.factory/claims.json`: present; all 14 listed commands passed separately after a clean `npm ci`.
- `npm test`: 53 passed, 2 intentional mobile-project skips, 0 failed.
- `npm run typecheck`, `npm run build`, `npm run verify:deployment`, `npm audit --omit=dev`: passed.
- `RMR_CANDIDATE_SHA=a9b521ce75b126768bd6d321ea1f46dd1709ccc4 npm run verify:live`: passed.
- Cold first-read: passed at desktop and 390px; the page states what it does, names language learners, and exposes a one-click sample demo.
- Live demo, invalid-input recovery, malformed import, delete/Undo, keyboard review, storage isolation, extension selection boundaries, live-ZIP installation, JSON transfer, offline reload, service-worker update, links, headers, and caching: passed.
- Privacy: the tested product flows made same-origin requests only. There is no analytics, external runtime script/font, AI, auth, billing, or server-side product API.
- Accessibility: zero serious/critical Axe findings on all routes and dark mode; keyboard skip/focus, reduced motion, 200% text, 44px targets, semantic landmarks, and 390px layouts passed.
- Lighthouse 12.8.2 mobile: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s and CLS 0.
- Budgets: initial JS 27,232 B raw / 9,374 B gzip; CSS 18,779 B raw / 4,832 B gzip; mobile hero 25,872 B; no fonts.

The complete report is `.factory/verification-9.md`; fresh evidence is in `.factory/evidence/verification-9/`.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run verify:deployment
RMR_CANDIDATE_SHA=a9b521ce75b126768bd6d321ea1f46dd1709ccc4 npm run verify:live
```

## Known gaps / next steps

None. The product is static, local-first, account-free, and free; server rate-limit and Entra checks are not applicable.
