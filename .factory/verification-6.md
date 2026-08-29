# Independent verification 6 — FAIL

**Date:** 2026-08-29

**Candidate:** `b5e3f3d061e73d202ddcac06c9656219666055a7`

**Live URL:** https://reading-margin-recall.sociobot.in

**Verdict:** **FAIL — do not release.**

The candidate is healthy in a clean local build, and the deployed root, hashed
assets, hero, and service worker match it byte-for-byte. Production is still an
incomplete deployment: the customer-facing extension archive and candidate
receipt are absent. The live candidate-specific release gate fails. Unknown
routes also bypass the product's built 404 and load Azure's generic third-party
error page.

## Mandatory first checks

### Claims contract

`.factory/claims.json` exists and lists 11 claims. Each ID occurs in exactly one
tagged test. Before installing dependencies, every exact command was attempted;
each stopped before its test body because a clean clone had no `wxt` executable.
After the documented `npm ci` bootstrap, every exact command was rerun and
exited 0:

| Claim | Clean-install result | Live observation |
| --- | --- | --- |
| `source-linked-capture` | PASS | PASS |
| `extension-selection` | PASS in installed Chromium; mobile duplicate skipped | Locally built extension passes; live installer is absent |
| `demo-isolated` | PASS | PASS |
| `local-only` | PASS | PASS on product routes; generic live 404 is an exception |
| `offline-reload` | PASS | PASS |
| `json-backup` | PASS | PASS |
| `keyboard-review` | PASS | PASS |
| `free-tools` | PASS | PASS |
| `delete-notes` | PASS | PASS |
| `extension-download` | PASS against local production-shaped server | **FAIL: live URL returns 404 HTML** |
| `http-source-links` | PASS | PASS |

The landing page, README, privacy page, and terms were cross-checked against
the claim list. Their material product promises are represented by these
claims; no additional unlisted product claim was identified.

### First read, cold live visit

**PASS.** The first screen answers all three required questions in plain words:

- What: **“Save passages for later recall.”**
- For whom: **“For language learners who want selected sentences to become
  source-linked review notes.”**
- First action: **“Try it with sample data.”**

The adjacent line says the demo loads three notes without touching real notes.
One click opens `/demo`, immediately shows three French, German, and Spanish
notes, and keeps the banner **“Demo — sample data, nothing is saved to your
notes”** with **Reset demo** and **Start for real**.

## Release blockers

### P0 — the live extension installer is absent

Fresh requests at 07:37 UTC returned:

```text
GET /downloads/reading-margin-recall-chrome.zip
404 text/html; 2,400 bytes
SHA-256 0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3
```

The body is Azure Static Web Apps' generic HTML page. The real empty state
links to this path as **Download the extension**, so a visitor cannot install
the browser-extension product.

The exact local production build contains a valid MV3 archive at the same
path: 13,734 bytes, ZIP integrity clean, SHA-256
`ff977804d0ceebf1adbf93be8b0865ea9ef9d4675506456643e7287de578b6d0`.
Its manifest requests only `storage` and `activeTab`. This is a live failure of
the `extension-download` promise and the core job-to-be-done.

### P0 — production has no candidate build receipt

Fresh `GET /build-info.json` returned the same 404 HTML and digest. The local
receipt names candidate `b5e3f3d061e73d202ddcac06c9656219666055a7`, the
archive path, byte count, and digest. Consequently the required command fails:

```text
RMR_CANDIDATE_SHA=b5e3f3d061e73d202ddcac06c9656219666055a7 npm run verify:live
Error: Build receipt returned 404.
```

The deployed application shell is the candidate, but the complete candidate
release is not deployed and production cannot provide its required identity
receipt.

### P1 — unknown routes use an unsafe generic Azure 404

`GET /release-check-verification-6-not-found` correctly returns HTTP 404, but
the body is **Azure Static Web Apps - 404: Not found**, not the candidate's
branded `404.html`. It has none of the product CSP, HSTS, nosniff, referrer, or
cache headers. In a 390 px browser it requested resources from
`ajax.aspnetcdn.com` and `appservice.azureedge.net`, logged a CORS error plus
failed-resource errors, and Axe reported the serious `image-alt` violation.

The local deploy tree contains a same-origin, accessible `404.html` and a
configured response override. This is another fresh deployment-tree failure,
and it breaks the privacy/no-console-error baseline on error pages.

## Other findings

### P2 — several mobile touch targets are below 44 px

At 390 px, representative live measurements were:

- wordmark: 164.4 × 40 px;
- preview **Open source** link: 119.5 × 24.8 px;
- **Read the privacy details**: 193.8 × 19 px;
- footer **Terms**: 40.5 × 21.3 px.

Other footer links are also about 21 px high. This misses the attached 44 px
touch-target contract even though the primary buttons and Demo nav target pass.

### P2 — important mobile text is smaller than the 16 px baseline

Computed 390 px sizes include 13.12 px navigation, 12.32 px eyebrow labels,
13.44 px demo explanation, 13.76 px privacy/offline/price facts, and 13.76 px
footer copy. The main lede is 17.28 px and body copy otherwise remains usable,
but these informational lines miss the specified 16 px web-body baseline.

## Clean checkout and production gates

The initial tree was clean at the requested SHA; `origin/main` and
`git ls-remote` resolved to the same SHA.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 145 packages, 0 vulnerabilities |
| `npm audit` / `npm audit --omit=dev` | PASS; 0 vulnerabilities |
| `npm run typecheck` | PASS |
| Lint | No lint script exists in `package.json` |
| `npm test` | PASS; 45 passed, one intentional mobile extension duplicate skipped |
| `npm run build` | PASS |
| `npm run verify:deployment` | PASS |
| `unzip -t dist/site/downloads/reading-margin-recall-chrome.zip` | PASS |
| candidate-specific `npm run verify:live` | **FAIL: build receipt 404** |

The exact build produces 24,536 bytes JS (8,850 gzip), 16,587 bytes CSS
(4,500 gzip), no font downloads, a 25,872-byte mobile hero, and a
109,412-byte desktop hero. These are within budget.

## Deployment parity

Fresh local/live SHA-256 values match for all tested deployed candidate files:

| File | SHA-256 |
| --- | --- |
| `/` | `86d6724e3aa4393a95ac18c25135376471a25e28192a6ae66572db7035c9c84d` |
| `/assets/index-zAGzKPkM.js` | `6bb6ceb0b693c8a9aab67c00cc29dbc323d3b2c706c97e40b8d34d41fba2c581` |
| `/assets/index-k8zcFJww.css` | `ae72fb7e6bc1424dc5609926734f3b265a7168ef21c79f5bab22e4793adddb50` |
| `/assets/field-guide-hero.webp` | `c3fc9ea751edac797c42c3e6ad26b7974c98dcd7da2e5945a053bb95c9f295a1` |
| `/sw.js` | `938b7d66a5666edbe198c4e93edd5251ecff984f3a8d235b27382ef3c21f64aa` |

This proves a partial deployment of the candidate, not a stale unrelated site.
The absent ZIP, receipt, and product 404 prevent full parity.

## Independent end-to-end exercise

- **Demo/PWA normal case:** loaded three samples, saved
  `La memoria vuelve cuando leo despacio.` with a learner gloss, hidden
  `memoria`, and an HTTPS source. The count became four. Space revealed the
  answer; `3` graded it. Delete reduced the count and Undo restored it.
- **Invalid input and recovery:** a `javascript:` source produced the accessible
  full-URL correction and saved nothing; replacing it with HTTPS succeeded.
  A structurally incomplete JSON backup changed no notes and survived reload.
  Forced `QuotaExceededError` preserved every form value, stored nothing, and
  reported that the note was not saved.
- **Isolation:** after seeding a real namespace, demo edits/reset/exit left the
  real note intact and removed every `demo:` key.
- **Links:** all crawled product, sample-source, and factory links returned 200
  except the live extension download. `mailto:` links were exempt. The repaired
  Don Quijote sample URL returns 200.
- **Installed extension:** loaded `.output/chrome-mv3` into a fresh Chromium
  profile. One-character and over-1,000-character selections showed no action;
  a normal selection produced a 149.6 × 44 px **Save passage** action containing
  only the selected sentence. Missing gloss/deletion recovery, save, popup
  review with Space/`4`, source identity, and deletion all passed. Popup Axe had
  zero serious/critical findings. The same extension cannot be obtained from
  production because of the P0 above.

## Privacy, accessibility, PWA, headers, and performance

- The complete normal live capture/review/delete/exit flow made only same-origin
  requests and logged no console/page errors. All six product routes did the
  same. The generic 404 is the documented exception.
- There are no analytics, third-party fonts/scripts, sign-in, billing, product
  unlock call, or server-side product endpoint. Entra authority and API
  429/`Retry-After` tests are therefore not applicable.
- `/`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` each returned
  200 with the right route title, one h1, one main, and zero serious/critical
  Axe findings on desktop. The local suite also passed mobile and dark-mode Axe.
- Keyboard skip navigation is first, shows a 3 px focus outline, and focuses
  main. Review shortcuts pass. No keyboard trap was observed.
- At 390 × 844 there is no horizontal overflow, including at 200% text.
  Reduced-motion transition/animation duration is `0.00001s`, and scrolling is
  `auto`.
- The active worker is `/sw.js`, cache `reading-margin-recall-v5`; update left
  no waiting worker. A cold demo subsequently reloaded offline with all three
  notes and the demo banner.
- Product HTML and service worker use 30-second must-revalidate caching; hashed
  assets use one-year immutable caching. Conditional requests returned 304.
  Product responses include the expected CSP, HSTS, nosniff, referrer, and
  permissions headers. Missing/generic-404 responses do not.
- `verify-url.sh` passed the live root in 579 ms with no errors, correct title,
  `lang=en`, one h1/main, complete image alt attributes, and no unlabeled
  buttons.
- Lighthouse mobile: Performance **99**, Accessibility **100**, Best Practices
  **100**, SEO **100**; FCP 0.92 s, LCP 1.07 s, TBT 116 ms, CLS 0. Initial
  transfer was 42,640 bytes.

## Required release actions

1. Deploy the complete generated `dist/site`, especially the exact extension
   ZIP, `build-info.json`, `404.html`, and effective Static Web Apps response
   configuration.
2. Rerun the candidate-specific live gate until it completes successfully.
3. Confirm the ZIP is HTTP 200 `application/zip`, byte-identical to the local
   artifact, and named by the live receipt.
4. Confirm an unknown URL returns the product-owned 404 with product headers,
   no third-party requests, no console errors, and zero serious/critical Axe
   findings.
5. Raise all mobile interactive targets to 44 × 44 px and informational text to
   the specified 16 px baseline.
