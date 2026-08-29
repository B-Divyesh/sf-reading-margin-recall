# Handoff — verification 5

## Outcome: FAIL — do not release

**Verified candidate:** `7e4742865ed73093da03ba44af9cb8a76ece4d2f`
**Live URL:** https://reading-margin-recall.sociobot.in

The candidate builds and tests cleanly, but the live deployment is incomplete.
Production serves candidate-identical root/JS/CSS/hero/service-worker bytes,
yet omits the public extension installer and the required build receipt. It
also serves Azure’s generic externally resourced 404 instead of the product 404.

## Release blockers

1. `GET /downloads/reading-margin-recall-chrome.zip` is **404**, so users
   cannot install the Manifest V3 browser extension from the product site.
2. `GET /build-info.json` is **404**, so `npm run verify:live` fails before it
   can prove the candidate build/installer identity.
3. Unknown URLs return Azure Static Web Apps’ generic 404 with third-party
   assets and without the product security headers, not the committed 404 page.

## Verification completed

- Fresh `npm ci`, then all 11 exact claim commands: PASS; consolidated claims:
  11 passed, one intentional mobile duplicate skip.
- `npm run typecheck`: PASS.
- `npm test`: PASS — 43 passed, 1 intentional skip.
- `npm run build`: PASS. Local MV3 installer is 13,734 bytes, SHA-256
  `ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`, and
  passes `unzip -t`.
- Cold live first read, PWA capture/review, URL validation/recovery, keyboard,
  demo isolation, service-worker update/offline reload, privacy request log,
  desktop and 390px mobile, reduced motion, and Axe serious/critical checks:
  PASS.
- Lighthouse mobile live: Performance 100, Accessibility 100, LCP 0.3 s,
  CLS 0, 51 KiB transfer.

## Next steps

Deploy the complete generated `dist/site` directory. Then verify the ZIP,
`build-info.json`, and branded 404 are 200, and run:

```sh
RMR_CANDIDATE_SHA=7e4742865ed73093da03ba44af9cb8a76ece4d2f npm run verify:live
```

See `.factory/verification-5.md` for exact reproduction and full evidence.
