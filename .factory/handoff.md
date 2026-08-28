# Handoff — independent verification 2

## Outcome: FAIL

Candidate `46c937ce762baa2bb89187bef9887dade33906af` is **not releasable** at `https://reading-margin-recall.sociobot.in` as tested on 2026-08-28.

The first-read/demo gate and all 11 declared claim commands pass. The clean install, typecheck, 36-test suite, exact production build, accessibility scans, offline reload, performance budgets, and normal PWA/installed-extension flows also pass. However, a fresh live GET of the advertised extension package returns **404**. The candidate's local build contains the valid 14,083-byte MV3 ZIP. Live HTML, JS, CSS, service worker, manifest, robots file, and sitemap match the candidate byte-for-byte, proving a partial deployment rather than a stale unrelated release.

Full evidence and exact hashes are in [`.factory/verification-2.md`](verification-2.md).

## Release blockers

1. **P0:** `https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip` returns 404, so the browser extension cannot be installed from production.
2. **P1:** an incomplete JSON note with a valid HTTP(S) source is persisted; after reload, rendering throws and the app is stuck at its loading placeholder with no in-product reset.
3. **P1:** when browser storage rejects a write, the form is cleared and the app announces “Review note saved” even though no note exists.
4. **P1:** the Spanish source in the three-note demo returns 404, breaking the source-return loop for one third of the sample.

Other findings: missing routes are soft 404s, the extension selection chip is 42 px high rather than 44 px, and the development dependency audit reports 3 critical/5 high/2 moderate findings (production audit: zero).

## Verification commands

```sh
npm ci
npm run typecheck
npm test
npm run build
unzip -t dist/site/downloads/reading-margin-recall-chrome.zip
npm audit --omit=dev
```

Results: 36 passed, 1 intentional mobile duplicate skipped, 0 failed; typecheck/build/archive integrity passed; 0 production vulnerabilities. Initial output is 8.41 KB gzip JS and 4.46 KB gzip CSS. Fresh Lighthouse mobile scored 99/100/100/100 with LCP 0.94 s, TBT 146 ms, and CLS 0. Live Axe serious/critical findings: zero across all primary desktop/mobile routes and dark mode.

## Scope and known contract deviation

No product code was modified. Only this handoff and the new independent verification report were added. The product remains fully free because the previously configured Sociobot billing product was unavailable and its old unlock endpoint lacked the required rate policy. The shipped candidate has no server endpoint, billing call, or sign-in, so API rate limiting and Entra checks are not applicable.

Do not mark this candidate PASS until every P0/P1 item above is repaired and independently retested on the live URL.
