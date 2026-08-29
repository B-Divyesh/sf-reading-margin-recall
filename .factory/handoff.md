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
- Every `.factory/claims.json` command passed separately in clean clone `/tmp/rmr-clean-final-gQCu2v` at `72525aab1fce480bc446d48d164e70c91c321f6d`.
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

`npm run deploy:site` deployed verified product commit `ac861d960c29bf078d8ff3a3ade9a8a063d63474` successfully.
`npm run verify:live` passed build identity, assets, ZIP, HTTP 404, security headers, request privacy, offline reload, Axe, mobile layout, and 200% text.
The final extension ZIP is 14,726 bytes with SHA-256 `2d8f11053f80bb4f4fe21bc49f356cc55d2fc4869a54cf3d7721d4028d8ab047`.
The live unknown route returned HTTP 404 with zero serious or critical Axe issues and zero third-party requests.
A separate cold-browser pass rechecked the root, `/?demo=1`, history restoration, route announcements, and the complete 404 shell.
Live Lighthouse scored 100 for performance, accessibility, best practices, and SEO.
Its measured LCP was 1.1 s, CLS was 0, and total blocking time was 10 ms.

Live evidence:

- `.factory/evidence/polish-1/live-landing-mobile.png`
- `.factory/evidence/polish-1/live-landing-desktop.png`
- `.factory/evidence/polish-1/live-demo-mobile.png`
- `.factory/evidence/polish-1/live-demo-desktop.png`
- `.factory/evidence/polish-1/live-404-desktop.png`
- `.factory/evidence/polish-1/verify-url-live/verify.json`
- `.factory/evidence/polish-1/lighthouse-live.json`

The final documentation-only commit is deployed after this handoff update.
Its authoritative SHA is served at `/build-info.json` and compared with `origin/main` by `npm run verify:live`.

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
