# Handoff — adversarial first-read review 1

## Outcome

**FAIL.** The independent review is in `.factory/review-1.md`. No product code was changed.

The first screen clearly states the job, audience, and primary action. The release still fails because `/demo` places all realistic sample records below an empty capture form, so neither the 390 × 844 nor 1440 × 900 first viewport shows the product in use. The review also records missing extension/PWA data transfer, incomplete history behavior and 404 structure, unlisted claims, and plain-language defects.

## Verification performed

- Opened the live site in fresh 390 × 844 and 1440 × 900 Chromium contexts before scrolling.
- Exercised the live demo, Reset demo, Start for real, seeded-real-data isolation, and same-origin request logging.
- Ran all 11 exact `.factory/claims.json` commands separately after `npm ci` in a clean clone; all passed.
- Ran the complete pinned suite in that clone: 44 passed, 2 intentional mobile duplicates skipped.
- Ran `npm run typecheck` and `npm run verify:deployment`; both passed after the production build.
- Ran `/opt/fleet/lib/verify-url.sh` against the live root; it passed with no console errors.
- Used the repository’s Playwright/Axe checks after the standalone Axe CLI selected an incompatible ChromeDriver; all serious/critical Axe checks passed.
- Crawled every discovered product, download, sample-source, and factory link; all returned 200 after redirects.
- Checked titles, h1 count, metadata, canonical URLs, 404 response/headers, deep links, Back/Forward behavior, focus, mobile targets/text, reduced motion, request privacy, and bundle size.
- Read the brief, design thesis, claims, demo notes, copy audit, README, prior handoff, and referenced prior verification findings.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run verify:deployment
VERIFY_NODE_MODULES="$PWD/node_modules" /opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in /tmp/rmr-verify
```

The live build receipt names product commit `47e669cdb764d5fbeec7dccc6e5c2e510418b8d3`. Review base `a84aa7b9102e3a9b005e2d1f203f78b6c53e7c7e` differs from it only in prior verification documentation, not product code. Therefore the candidate-specific live gate rejects the current documentation-only SHA even though the served product assets match the product commit.

## Next steps

Address F-1-1 through F-1-23, then rerun the complete checklist from a fresh context. F-1-1 must be resolved before release: a realistic seeded note must be visible and actionable in the first viewport immediately after one click from Home.
