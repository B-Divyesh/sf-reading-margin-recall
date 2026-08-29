# Local verification evidence

Clean clone: `/tmp/rmr-polish3-retry1-clean-8eYs35`

Commit: `c72cf18b0cbd69f94f59b44f43a7c6ea4ae960f4`

- `npm ci`: passed; 145 packages installed, 0 vulnerabilities.
- Every command in `.factory/claims.json`: passed independently.
- `npm test -- --reporter=line`: 53 passed, 2 intentional project skips, 0 failed.
- `npm run typecheck`: passed.
- `npm run verify:deployment`: passed with a 14,726-byte Manifest V3 ZIP and product-owned 404.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `npx playwright test --grep @claim:json-transfer --project=chromium --repeat-each=3`: 3 passed.
- Claim-tag audit: 14 registered IDs and exactly one test tag per ID.
- Initial production assets: 27,196-byte JS, 18,779-byte CSS, 25,872-byte mobile hero.
- Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 903 ms, LCP 1,504 ms, TBT 20 ms, CLS 0.
- URL verifier: 550 ms load, zero console/page errors, correct title and language, one h1, one main, no missing alt text, no unnamed buttons.
