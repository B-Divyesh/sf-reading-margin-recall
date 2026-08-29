# Handoff — polish round 4

## Outcome

**PASS — all findings from adversarial reviews 1–4 are closed.**

- Repair code commit: `4955acce722c81326b67f5f67ba5d12355b772aa`
- Work order: `reading-margin-recall-polish-4`
- Live product: <https://reading-margin-recall.sociobot.in>
- Detailed closure matrix: `.factory/polish-4.md`

This repair registers and proves the two previously unlisted privacy claims. “No tracking scripts” now has a public-route and complete-demo browser proof. The privacy page now distinguishes web-app storage from the separately stored extension notes, and a seeded two-store Chromium test proves the boundary.

The one-click `?demo=1` sandbox, source-linked review workflow, extension/web JSON transfer, first-screen copy, routing, 404, legal pages, focus restoration, mobile layout, local-first storage, offline reload, and field-guide visual identity remain intact.

## How to run and verify

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run verify:deployment
npm run deploy:site
```

The live demo is `https://reading-margin-recall.sociobot.in/?demo=1`. It loads three bundled French, German, and Spanish notes in `demo:` storage. **Reset demo** restores the samples; **Exit demo and use my notes** deletes demo keys.

## Evidence

- Clean clone `/tmp/rmr-polish4-clean-dWd58t` ran all 16 exact `.factory/claims.json` commands separately after `npm ci`; all passed.
- Full browser suite: 57 passed, 2 intentional mobile-project skips, 0 failures.
- Typecheck, production build, deployment-tree verification, diff check, and production dependency audit passed.
- The deployed receipt, shell assets, service worker, and 14,726-byte MV3 ZIP byte-matched the repair code commit. `npm run verify:live` passed its HTTP 404, headers, route, offline, keyboard, request-privacy, mobile, and Axe checks.
- Live cold checks: `verify-url.sh` reported 797 ms load and no browser errors; the six-route/full-demo tracking proof observed no cookies, beacons, analytics, or cross-origin requests; a live site-clear left a seeded extension note untouched.
- Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,100 ms, TBT 37 ms, CLS 0.
- Screenshots and reports: `.factory/evidence/polish-4/`.

## Known gaps and next steps

None. No paid tier, account, analytics, backend, or AI service is intentionally included; that preserves the brief’s local-first workflow.
