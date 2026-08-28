# Independent verification — FAIL

**Verifier:** independent QA  
**Date:** 2026-08-28  
**Candidate commit:** `80a14ed43e1180ba560318184e702759420939c1`  
**Live URL:** https://reading-margin-recall.sociobot.in  
**Verdict:** **FAIL — do not release.**

The locally built application is healthy, but the live release is incomplete and a live paid flow is broken. The site serves the candidate's JavaScript and CSS byte-for-byte, so these are fresh deployment findings rather than an unrelated site version.

## First read (cold live visit)

Pass. The first screen says that it saves passages for later recall, names language learners as the audience, and offers **Try it with sample data**. The adjacent sentence says that clicking loads three notes and does not touch real notes. The one-click action opens `/demo`, which shows a persistent `Demo — sample data, nothing is saved to your notes` banner with both Reset demo and Start for real.

## Release-blocking defects

### P0 — installed extension cannot be downloaded from production

`GET https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip` returned **404** on 2026-08-28. This is the direct download exposed by the real empty state. The exact local production build contains a valid 14,014-byte ZIP at `dist/site/downloads/reading-margin-recall-chrome.zip` (`unzip -t` passed). A browser-extension product cannot be installed end to end from the deployed site while that artifact is absent.

### P0 — advertised $12 checkout is not registered/live

`GET https://api.sociobot.in/api/v1/products/reading-margin-recall/checkout` returned **404** with:

```json
{"error":"enabled factory product","status":404}
```

The live landing page advertises “Study Edition costs $12 once” and links its Buy action to that endpoint. It therefore cannot perform the paid flow it presents. The local `@claim:paid-study-edition` test passes only because it checks the displayed price, URL, and restore control; it does not exercise the endpoint.

### P1 — required API rate limiting is absent on the product unlock endpoint

I sent 40 rapid requests to:

`GET https://api.sociobot.in/api/v1/products/reading-margin-recall/verify?license=invalid-qa-token`

All **40/40** returned **200** with `{"valid":false,"reason":"invalid","expires_at":null}`. No response returned 429 or a `Retry-After` header. The required threshold was therefore **not observed through 40 requests**. The work order explicitly requires rate limiting for this endpoint.

### P1 — unlisted, unproved visitor claims violate the claims contract

The live copy and README contain material claims with no corresponding entry/test in `.factory/claims.json`, including “Core tools are free,” “No account,” “No subscription or account,” “Delete any note,” and the Terms statement that the free tools are free. The contract requires each visitor-reliant claim to have an observable sandbox test or to be removed. Existing entries cover capture, isolation, local-only requests, offline reload, JSON backup, keyboard review, and price/checkout URL, but not those claims.

### P2 — source URL validation accepts an unusable JavaScript URL

On the live `/library` form, `javascript:document.body.setAttribute('data-rmr-qa','executed')` is accepted as a “Source URL” and saves a note. Clicking its source link produces a browser CSP console error rather than a useful recovery message. The strict CSP blocks execution, so no script ran, but only `http:`/`https:` source URLs should be accepted and the form should tell the learner what to correct.

## Local build and automated checks

Initial checkout was clean and at the candidate SHA. `npm ci` completed successfully.

| Check | Result |
| --- | --- |
| Every command declared in `.factory/claims.json` | PASS individually from the fresh install |
| `npm test` | PASS: 28 passed, 1 intentional mobile-project skip, 0 failures (40.7 s) |
| `npm run typecheck` | PASS |
| Exact `npm run build` | PASS; outputs `dist/site` and MV3 ZIP |
| Production dependency audit | PASS: `npm audit --omit=dev` found 0 vulnerabilities |
| MV3 ZIP integrity | PASS: `unzip -t .output/reading-margin-recall-1.0.0-chrome.zip` |

All declared claims had a passing tagged test: `source-linked-capture`, `extension-selection`, `demo-isolated`, `local-only`, `offline-reload`, `json-backup`, `keyboard-review`, and `paid-study-edition`. The extension-selection test runs in Chromium; its intentionally skipped mobile-project duplicate is the one test skip.

## Product exercise and browser QA

- Normal real PWA flow passed: created a French passage with gloss, deletion, source title and URL; it appeared in the library, revealed with Space in review, and graded with `3`.
- The extension claim test passed with the production MV3 build: selected text alone populated the capture dialog, completed the save flow, and made no site-localStorage write. Its built manifest is MV3 with only `storage` and `activeTab` permissions.
- Source inspection confirms the extension rejects selections outside 2–1,000 characters. Empty/demo, invalid-import, deletion/undo, export/import, review, source return, and offline paths are covered in the passing suite.
- Live `/demo` completed an offline reload after service-worker activation and retained all three sample notes. `registration.update()` succeeded with an active `/sw.js`, no waiting worker, and a controlling worker.
- At a 390 px viewport, horizontal overflow was 0 px. The demo banner, form, notes, and footer remained usable. Keyboard Tab reached the skip link with a 3 px solid visible focus outline. With reduced motion, animation and transition duration were `0.00001s` and scroll behavior was `auto`.
- Axe on live `/`, `/demo`, `/library`, `/review`, `/privacy`, `/terms`, and `/missing-page` found no serious or critical violations. Cold-load console/page errors were empty. `/opt/fleet/lib/verify-url.sh` also passed: title present, `lang=en`, one h1, main, all images have alt attributes, no unlabeled buttons; measured cold load was 798 ms.
- Lighthouse mobile, fresh live run: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.1 s, TBT 10 ms, CLS 0.

## Privacy, headers, caching, and deployment identity

- A cold live landing-page capture requested only the same origin: document, hashed JS, hashed CSS, and self-hosted hero image. Source inspection finds no analytics, third-party fonts, or Azure/OpenAI endpoint; purchase verification is the only optional `api.sociobot.in` call.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin-when-cross-origin referrer policy, permissions policy, and a restrictive CSP with `default-src 'self'` and API-only `connect-src` allowance. Hashed JS/CSS and hero assets have `Cache-Control: public, max-age=31536000, immutable`; HTML and service worker use 30-second revalidation.
- Local initial bundle is 9.09 KB gzip JS and 4.54 KB gzip CSS. Mobile hero is 25,872 bytes; desktop hero is 109,412 bytes. All meet the stated budgets.
- Deployment identity is mixed: the live `index-R1pwuowB.js` SHA-256 is `2c97a3787f316f10e98e49d295f4fbfcefefc80240e326ba493734a68a798be7` and the live CSS SHA-256 is `0d62801c333211c60d1bc46f69511b00c5087883b97214679f94549becf405bd`, both exactly matching this candidate's fresh `dist/site`. However, the candidate's extension ZIP was not deployed, which is a material mismatch.

## Required release actions

1. Deploy `dist/site/downloads/reading-margin-recall-chrome.zip` and verify its live response is 200 with a valid downloadable archive.
2. Register/enable the `reading-margin-recall` billing product and make checkout complete successfully before advertising the paid edition.
3. Add server-side throttling to the verification endpoint; verify a documented burst threshold returns 429 plus `Retry-After`.
4. Add observable claim tests for all retained free/account/subscription/delete promises, or remove the promises.
5. Restrict source URLs to `https:`/`http:` and return an accessible form error for unsupported schemes.
