# Handoff — Reading Margin Recall repair 3

## Outcome

All release-blocking findings in independent verification 3 (`eec4dd351b891acac5e7ac74b025eacd8ab839b2`, candidate `d8cc4216eea5064b364901510edf3138f3f98705`) are repaired, tested, pushed, and deployed.

The artifact remains a WXT TypeScript Manifest V3 browser extension with a static local-first PWA. The live release is `https://reading-margin-recall.sociobot.in`.

## Reproduction and repairs

1. **Extension download:** before repair, a fresh live GET returned Azure's 2,400-byte `404 text/html` body with SHA-256 `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3`. The build already created the ZIP, but Static Web Apps had no `.zip` MIME registration. The config now maps `.zip` to `application/zip`; the build asserts the public package exists and is larger than 10 KB. Live now returns 200 and the exact 13,734-byte local archive with SHA-256 `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`.
2. **Missing custom 404:** after the clean install, the pre-fix build reproduced `dist/site/404.html` as absent. Vite copies `site/public`, while the designed source is `site/404.html`. The build now copies it explicitly and asserts its presence. The Static Web Apps 404 override keeps the genuine 404 status. A fresh unknown live URL now returns the product document with HTTP 404, the same-origin CSP, HSTS, `nosniff`, strict referrer and permissions policies, and a 30-second revalidation policy. It makes no third-party requests and has zero serious/critical Axe findings on mobile. The 404 also uses the existing product favicon, so it creates no secondary missing-resource error.
3. **Demo cleanup:** navigation now deletes every `demo:` key whenever a demo link leaves demo mode, including the wordmark, footer Privacy link, browser history, and external/non-demo links. Demo-to-demo navigation retains the isolated store. Regression coverage starts with four edited notes and checks both reported exit paths.
4. **Mobile Demo target:** header navigation links now have a 44px minimum width and height. The 390px regression measures the Demo link at or above 44×44 CSS px.
5. **Extension dialog focus:** Escape or Cancel restores a visible **Save passage** control and focuses it. A successful save does not reopen that control. The installed-extension test asserts initial dialog focus, Escape closure, restored focus, then completes save into extension storage.
6. **Monetization deviation:** the researched brief says one-time monetization. This release remains entirely free because the previously advertised Sociobot product was not registered and its checkout returned 404; its verification endpoint also lacked the required rate policy. Removing the dead purchase promise was the closest honest, useful release. There is no checkout, license request, account, or server endpoint. The `free-tools` claim proves the retained behavior.

## Regression coverage

- `@regression:production-download`: HTTP 200, `application/zip`, archive size/integrity, and MV3 manifest.
- `@regression:built-404`: built file presence, product title/heading, return link, same-origin requests, no console errors, and zero serious/critical Axe findings on desktop and 390px mobile.
- Deployment policy: `.zip` MIME type, product headers, short HTML/404 cache policy, and the exact SWA 404 response override.
- `@regression:demo-exit`: edited demo storage is removed through both verifier-reported navigation paths.
- `@claim:extension-selection`: 44px selection action, focus into the dialog, Escape restoration, selected-text-only capture, and extension-local storage.
- `npm run verify:live`: local/live asset and service-worker identity, exact ZIP hash, real HTTP 404 policy and content, Axe/request checks, desktop capture/review, keyboard use, demo isolation, service-worker update, offline reload, 390px layout/target size, reduced motion, and 200% text.

## Verification evidence

Run on 2026-08-29 from a clean `npm ci` install (145 packages, zero vulnerabilities):

```sh
npm run typecheck
npm test
npm audit
npm audit --omit=dev
npm run build
unzip -t dist/site/downloads/reading-margin-recall-chrome.zip
npm run verify:live
```

- TypeScript: passed. No lint script/configuration exists.
- Full suite: 43 passed, 1 intentional mobile duplicate skipped, 0 failed. All 11 commands in `.factory/claims.json` also passed individually.
- Production build: 24.54 KB raw / 8.85 KB gzip JavaScript; 16.59 KB raw / 4.50 KB gzip CSS; no downloaded fonts; 25,872-byte mobile hero; `dist/site/404.html` present.
- Package/consumer: `unzip -t` passed; the MV3 package uses only `storage` and `activeTab`; the clean Chromium install completed selection, dialog recovery, save, popup review, source return, and delete coverage.
- Desktop/mobile/accessibility: all primary routes, the product 404, dark mode, keyboard focus, reduced motion, and 390px checks passed with no serious/critical Axe findings or horizontal overflow. The 200% text check passed.
- Privacy/response policy: the full live flow and 404 made zero third-party requests. Live 404 headers include CSP, HSTS, `nosniff`, referrer policy, permissions policy, and `Cache-Control: public, must-revalidate, max-age=30`.
- Offline/update: service worker `reading-margin-recall-v5` is active with no waiting worker; `/demo` reloads offline with its banner and three notes.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200 in 612 ms, correct title/lang, one h1, main landmark, no missing alt text, no unlabelled buttons, and no console/page errors.
- Final live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 904 ms, LCP 1,054 ms, TBT 4 ms, CLS 0, transfer 42,640 bytes.
- Live identity: deployed `index.html`, hashed JavaScript, hashed CSS, and `sw.js` match the final local build byte-for-byte.

## Deployment

- Repair commits through `fd57019` were pushed to `origin/main`; the final handoff/check-script commit follows them.
- Deployed with `/opt/fleet/lib/deploy-static.sh reading-margin-recall dist/site`.
- Final successful Azure deployment ID: `e1e83262-eb40-4c52-96f8-cf3db58cfb1a`.
- Final live verification: `npm run verify:live` passed against the custom domain.

## Known gaps

None found. API rate limiting, backend concurrency/persistence, billing verification, and Entra identity are not applicable because this release has no backend, billing flow, or sign-in.
