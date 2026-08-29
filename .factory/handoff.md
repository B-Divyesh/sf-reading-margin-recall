# Handoff — adversarial first-read review 2

## Outcome

**FAIL — four non-blocking findings remain.**

The complete report is `.factory/review-2.md`. Product code was not modified.

## What was done

- Opened the live site cold at 390 × 844 and 1440 × 900 before scrolling.
- Exercised the one-click demo, Reset, Exit, namespace isolation, and request logging.
- Audited every landing-page and README copy unit with word counts.
- Ran all 13 `.factory/claims.json` commands separately from clean clone `/tmp/rmr-review2-clean-Kp7io7`.
- Rechecked all 23 findings from review 1 against the live site and code.
- Crawled public links and checked routes, metadata, 404 behavior, History API behavior, focus, announcements, headers, privacy, and visual identity.
- Ran the full local suite, typecheck, deployment verification, live URL verifier, and live Axe scans.
- Checked for unnecessary AI, external model calls, embedded provider keys, and missed import/export or sync leverage.

## Verification results

- Every registered claim: 13/13 passed.
- `npm test -- --reporter=line`: 52 passed, 2 skipped, 0 failed.
- `npm run typecheck`: passed.
- `npm run verify:deployment`: passed.
- `/opt/fleet/lib/verify-url.sh https://reading-margin-recall.sociobot.in …`: passed.
- Live Axe, mobile and desktop across seven routes: zero serious/critical violations.
- Live link crawl: all HTTP links passed; mail links exempt.
- Live demo traffic: zero cross-origin requests and zero console/page errors.

## Findings left

- F-2-1: the README’s web-app installability assertion is absent from `claims.json`.
- F-2-2: the README/privacy settings-storage assertion is not named or tested by `local-only`.
- F-2-3: visible “No. 01” hero lore carries no information.
- F-2-4: the Hugo sample is numbered 3 on Home and 1 in the demo.

No finding is blocking, but the review contract requires zero findings for PASS.

## Provenance

The reviewed repository was at `77fcd5859e1971d60d2ac4202b08f22799e618ce`. The live build receipt names `109fca00449ff17b2b8ac3e0e83077ffcde4723c`; all later repository changes before this review were verification-only documents and artifacts.
