# Handoff — polish round 1

## Outcome

All F-1-1 through F-1-23 findings in `.factory/review-1.md` are fixed. There were no earlier review or polish files.
The browser-extension artifact and static deployment model are unchanged.
The botanical field-guide identity, palette, type, illustration, and motion remain intact.

The canonical one-click sample entry is `https://reading-margin-recall.sociobot.in/?demo=1`.
It shows an actionable sample review in the first 390×844 screen.
The banner exposes Reset demo and Exit demo and use my notes.
Demo data remains under `demo:` keys and never enters the real note namespace.

The extension and web app now exchange the same validated JSON backup.
Export and import work in both directions, including import into an empty web collection.

## Local verification

- `npm test`: 52 passed; 2 intentional mobile duplicates skipped.
- `npm run typecheck`: passed.
- `npm run build`: passed and produced `dist/site` plus the packaged extension ZIP.
- `npm run verify:deployment`: passed.
- Every `.factory/claims.json` command is rerun from a clean clone before release.
- Playwright Axe found zero serious or critical issues across all routes, mobile routes, dark mode, the 404, and extension popup.
- `verify-url.sh` passed with no console errors. Evidence: `.factory/evidence/polish-1/verify-url-local/verify.json`.
- Lighthouse mobile-local: 100 performance, 100 accessibility, 100 best practices, and 100 SEO.
- Lighthouse metrics: 1.5 s LCP, 0 CLS, and 30 ms total blocking time.
- Initial bundles: 27,232-byte JavaScript and 18,952-byte CSS. The mobile hero is 25,872 bytes.

Screenshots:

- `.factory/evidence/polish-1/landing-mobile.png`
- `.factory/evidence/polish-1/landing-desktop.png`
- `.factory/evidence/polish-1/demo-mobile.png`
- `.factory/evidence/polish-1/demo-desktop.png`
- `.factory/evidence/polish-1/404-desktop.png`

## Live verification

The final deployment is checked cold at the root, `/?demo=1`, `/library`, `/review`, `/privacy`, `/terms`, and an unknown URL.
`npm run verify:live` verifies build identity, assets, ZIP, HTTP 404, security headers, request privacy, offline reload, Axe, mobile layout, and 200% text.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run verify:deployment
npm run deploy:site
```

## Known gaps and next steps

None for this work order.
