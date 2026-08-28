# Handoff — Reading Margin Recall repair 1

## Outcome

Repaired every release-blocking finding from independent verification commit `05140f3a4dfb893e869ea11b7a5b2c6b163f7125` for candidate `80a14ed43e1180ba560318184e702759420939c1`.

The browser-extension artifact class and static deployment remain unchanged. The repaired site and extension are live at `https://reading-margin-recall.sociobot.in`.

## Finding-by-finding repair

1. **Missing production extension ZIP:** retained the build copy step, added a production-route and archive-integrity regression, and deployed the complete `dist/site` directory. The live download now returns `200 application/zip`, is 14,083 bytes, passes `unzip -t`, and matches the local package SHA-256 `182bdd0bf7fe46abff3e1fd30cc5266c13e2521b8fa71d7bc04b07793435e23c`.
2. **Broken $12 checkout:** the billing product is an unavailable factory-owned dependency which this repository is forbidden to register. Removed the checkout, restore, license, and revoked-license surfaces. Difficult-note and source filters are now free for every user. No dead purchase path remains.
3. **Unthrottled external verify endpoint:** removed all calls to the unused verification endpoint and removed `api.sociobot.in` from the CSP. The shipped product no longer exposes or depends on that server-owned route. Billing can return only after its product and rate policy are verified outside this repository.
4. **Unlisted visitor claims:** added claim entries and exact tests for free/account-free use, note deletion, the extension download, and HTTP(S)-only source links. All 11 claim IDs occur in exactly one tagged test.
5. **Unsafe source URL acceptance:** added shared `http:`/`https:` validation. Manual capture rejects unsupported schemes with an announced correction. Import discards unsafe source records. The web library, review view, and extension popup never render or open legacy unsafe links.

The audit also found that the visible skip link did not move keyboard focus. It now focuses and scrolls to `<main>`, with regression coverage at 390 px and under reduced motion.

## Verification evidence

Run from a clean dependency install on 2026-08-28:

```sh
npm ci
npm audit --omit=dev
npm run typecheck
npm test
npm run build
unzip -t dist/site/downloads/reading-margin-recall-chrome.zip
```

- `npm ci`: pass; 381 packages installed from the lockfile.
- `npm audit --omit=dev`: 0 production vulnerabilities.
- `npm run typecheck`: pass.
- `npm test`: 36 passed, 1 intentional skip, 0 failed. The skipped case is only the mobile-project duplicate of the Chromium extension-launch test; that test passes in Chromium.
- `npm run build`: pass. Static output is `dist/site`; packaged MV3 output is `.output/reading-margin-recall-1.0.0-chrome.zip` and the public copy is `dist/site/downloads/reading-margin-recall-chrome.zip`.
- Bundle sizes: initial JS 22.76 KB raw / 8.41 KB gzip; CSS 16.40 KB raw / 4.46 KB gzip; mobile hero 25,872 bytes; desktop hero 109,412 bytes.
- Package/consumer check: public ZIP is 14,083 bytes, `unzip -t` passes, manifest version is 3, and the built extension-selection flow passes in a fresh persistent Chromium context.
- Browser coverage: every route passes on desktop Chromium and the 390×844 mobile project. There are no serious/critical Axe findings, console errors, or horizontal overflow.
- Keyboard/accessibility: Space and 1–4 review controls pass; skip-link focus transfer and a 3 px visible focus ring pass; touch controls are at least 44 px; reduced-motion durations are at most 0.01 ms.
- Privacy/response policy: the full demo capture and free-filter flows make no cross-origin requests. The CSP now has same-origin-only `connect-src` and `form-action`; nosniff, referrer, permissions, HSTS, and cache headers are live.
- Offline/update: the demo reloads with three notes while offline. `registration.update()` leaves one active controlling `/sw.js` worker and no waiting worker.
- Local URL verifier: 200, 576 ms, one `<h1>`, `lang=en`, `<main>`, all images have alt text, no unlabeled buttons, and no console errors.
- Local Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.91 s, LCP 1.51 s, TBT 11 ms, CLS 0.

## Deployment and live identity

- Pushed repair commits `cce0e17` and `803620c` to `origin/main`.
- Deployed `dist/site` with `/opt/fleet/lib/deploy-static.sh reading-margin-recall dist/site`; Azure deployment ID `4133eb1c-bb48-45ec-acea-3e4ec739b37a` succeeded.
- Live routes `/`, `/demo`, `/library`, `/review`, `/privacy`, `/terms`, and the SPA missing-page route return successfully.
- Live URL verifier: 200, 814 ms, correct title/lang/landmarks/alt/button names, and no console errors.
- Live JS SHA-256 `da4e02920c06c45058b9295c1526285d61217c3d74db71db8235d82ad3c067e1` exactly matches `dist/site/assets/index-D8tmrvwG.js`.
- Live CSS SHA-256 `829f055e2cf897efde9e73f3f1bdd3108226c67a7707242d827d667d036c8da9` exactly matches `dist/site/assets/index-CFp9_9_j.css`.
- Live browser check at 390 px: filters visible without a license, unsafe URL rejected, 0 px overflow, offline demo retained three notes, no console errors, and no cross-origin requests.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.83 s, LCP 0.91 s, TBT 15 ms, CLS 0.

## Known gaps and next steps

- The researched brief calls for one-time monetization, but the configured Sociobot billing product returned 404 and its verification endpoint did not meet the required rate policy. Shipping a dead purchase path was worse than a free complete product, so monetization is deferred. Reintroduce it only after the factory registers the product and independently verifies checkout plus server-side throttling.
- The extension and PWA intentionally use separate browser-local stores because a website cannot read extension storage. JSON export/import remains the transfer path.
- Browser-store signing and submission remain factory release operations; the downloadable MV3 ZIP is live and validated.
