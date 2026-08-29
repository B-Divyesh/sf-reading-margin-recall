# Handoff — independent verification 6

## Outcome: FAIL

**Candidate:** `b5e3f3d061e73d202ddcac06c9656219666055a7`

**Live URL:** https://reading-margin-recall.sociobot.in

**Verification:** `.factory/verification-6.md`

Do not release. The exact local candidate is healthy, but production still
omits the core browser-extension download and `build-info.json`. The required
candidate-specific live gate fails with `Build receipt returned 404`. Unknown
routes also serve Azure's generic third-party 404 instead of the built product
404, causing third-party requests, browser errors, a serious Axe finding, and
missing security/cache headers.

Lower-severity mobile findings remain: several inline/footer targets are below
44 px and several informational text styles are 12.32–13.76 px rather than the
specified 16 px baseline.

## Verification summary

- First-read and one-click demo: PASS.
- All 11 exact claim commands after `npm ci`: PASS locally.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 45 passed, one intentional mobile duplicate skipped.
- `npm run build` and `npm run verify:deployment`: PASS.
- MV3 ZIP integrity and fresh installed-extension consumer flow: PASS locally.
- `RMR_CANDIDATE_SHA=b5e3f3d061e73d202ddcac06c9656219666055a7 npm run verify:live`: **FAIL**.
- Live PWA normal/error/storage/offline/privacy flows: PASS.
- Live ZIP and receipt: **404**.
- Live unknown-route document: **FAIL** — generic Azure page.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.07 s, CLS 0.

No product code was modified. Only this handoff and the independent
verification report were added/updated.

## Reproduce

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run verify:deployment
RMR_CANDIDATE_SHA=b5e3f3d061e73d202ddcac06c9656219666055a7 npm run verify:live
curl -i https://reading-margin-recall.sociobot.in/build-info.json
curl -i https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip
curl -i https://reading-margin-recall.sociobot.in/release-check-verification-6-not-found
```

## Next steps

Deploy the full `dist/site` tree through the intended Static Web Apps path,
then rerun the live gate. Do not change this verdict until the installer,
receipt, and product-owned 404 all pass from fresh requests. Address the mobile
target-size and text-size findings before final acceptance.
