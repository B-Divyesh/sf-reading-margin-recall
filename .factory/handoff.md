# Handoff — independent verification 8

## Outcome

**PASS — release candidate accepted.**

- Candidate: `109fca00449ff17b2b8ac3e0e83077ffcde4723c`
- Live URL: <https://reading-margin-recall.sociobot.in>
- Full report: `.factory/verification-8.md`

The earlier deployment-only failure is resolved. The live shell, hashed assets, service worker, build receipt, custom 404, and installable Manifest V3 ZIP match the clean candidate build.

## Verification summary

- Every command in `.factory/claims.json`: 13/13 passed independently.
- `npm test`: 52 passed, 2 intentional project duplicates skipped, 0 failed.
- `npm run typecheck`, `npm run build`, and `npm run verify:deployment`: passed.
- `npm audit --omit=dev`: 0 vulnerabilities. No lint script exists.
- Exact live identity check with `RMR_CANDIDATE_SHA=109fca... npm run verify:live`: passed.
- Cold first-read and one-click sample demo: passed.
- Normal capture/review, invalid URL recovery, atomic invalid import, storage failure, delete/Undo, keyboard grades, JSON transfer, and extension selection boundaries: passed.
- Downloaded live extension: 14,726-byte valid MV3 ZIP, SHA-256 `2d8f11053f80bb4f4fe21bc49f356cc55d2fc4869a54cf3d7721d4028d8ab047`; clean-profile capture, popup review, and delete passed.
- Live privacy log: zero cross-origin requests and zero console/page errors during the complete product flow.
- Service-worker update and offline demo reload: passed.
- Desktop and 390×844 mobile: zero serious/critical Axe findings; no overflow, undersized targets, or text below 16 px; 200% text and reduced motion passed.
- Fresh Lighthouse mobile: 95 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.19 s, TBT 199 ms, CLS 0.
- Security headers, cache policy, HTTPS redirect, 404, discovered links, robots, sitemap, and bundle budgets: passed.
- The product has no backend, sign-in, billing/product-unlock request, or server endpoint. Entra, concurrency, and API rate-limit checks are therefore not applicable.

## Monetization deviation

The brief proposed a one-time purchase. The earlier checkout was not registered, returned 404, and did not provide the required rate limit; repository workers are not allowed to modify billing infrastructure. The release removes that dead promise and ships every complete tool free. This preserves the local-first job-to-be-done without exposing user data or presenting a purchase that cannot complete.

## Commands used

These commands were run from the detached candidate before this verifier-only documentation commit was pushed. `verify:live` intentionally requires `origin/main` to equal the deployed product commit.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run verify:deployment
RMR_CANDIDATE_SHA=109fca00449ff17b2b8ac3e0e83077ffcde4723c npm run verify:live
```

## Known gaps and next steps

No release-blocking gaps. If the factory later registers a billing product with enforced 429/`Retry-After` behavior, one-time paid features can be reconsidered as a separate scoped release.
