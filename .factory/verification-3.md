# Independent verification 3 — FAIL

**Date:** 2026-08-29  
**Candidate:** `d8cc4216eea5064b364901510edf3138f3f98705`  
**Live URL:** https://reading-margin-recall.sociobot.in  
**Verdict:** **FAIL — do not release.**

The candidate builds and the normal PWA flows are healthy, but the live browser-extension package is still absent. The product's own empty state links to a 404 instead of an installable extension. The intended custom 404 is also omitted from the production build, leaving Azure's generic page with a critical accessibility violation and third-party requests.

## Mandatory first read

**PASS.** A cold 1440×900 visit immediately showed:

- what it does: **“Save passages for later recall”**;
- who it is for: **“For language learners who want selected sentences to become source-linked review notes”**;
- what to do first: **“Try it with sample data.”**

The action is visible in the first viewport. Its adjacent text says the demo loads three notes without touching real notes. One click opens `/demo`, where three realistic notes and the persistent **“Demo — sample data, nothing is saved to your notes”** banner appear with **Reset demo** and **Start for real**.

## Release-blocking findings

### P0 — the live extension package still returns 404

Fresh curl and Playwright requests to:

`https://reading-margin-recall.sociobot.in/downloads/reading-margin-recall-chrome.zip`

returned `404 text/html` and Azure's 2,400-byte generic error page. This URL is linked as **Download the extension** from the real empty state.

The exact local production build does contain a valid 13,710-byte MV3 ZIP. `unzip -t` passes, and its SHA-256 is:

`caf643b4ee2d799af0d9e5346b75c7226ec56aea9951b927a3f17c1acc1af958`

The live response instead has SHA-256 `0a76274e99e285c9d7e18d094e71ea6fca1b0274e30c28492a24218e53c61cb3`. The `extension-download` claim passes only against the local preview; its observable production promise is false. A new user cannot install the browser-extension artifact from the product.

### P1 — the production build omits the configured custom 404

`site/public/staticwebapp.config.json` rewrites 404 responses to `/404.html`, and a styled source file exists at `site/404.html`. However, `npm run build` does not copy that file to `dist/site`; a complete listing of the build output contains `404.css` but no `404.html`.

Consequently, `/404.html`, `/definitely-not-a-route`, and the missing extension download all return Azure's generic 404 rather than the product's page. Fresh evidence:

- response status is correctly `404`, but title is **“Azure Static Web Apps - 404: Not found”**;
- Axe reports one critical `image-alt` violation on desktop and mobile;
- the page requests scripts, CSS, and images from `ajax.aspnetcdn.com` and `appservice.azureedge.net`;
- the response omits the product CSP, HSTS, `nosniff`, referrer policy, and cache policy;
- there is no product-styled route or way back.

This is a candidate build defect, not merely an edge configuration quirk: the configured rewrite target is absent from `dist/site`.

## Other findings

### P2 — leaving the demo can retain edited demo state

From `/demo`, I added a fourth note and left using either the wordmark or the footer Privacy link. The banner disappeared, but `demo:rmr:notes` remained with four records. The demo contract requires leaving demo mode to discard demo data unless the user explicitly chooses to keep it. **Start for real** does clear every `demo:` key correctly.

### P2 — the mobile Demo navigation target is narrower than required

At 390×844, the header **Demo** target measured `42.45×44` CSS px. The acceptance baseline requires every touch target to be at least 44×44 px. Other measured header and primary actions met the size requirement.

### P2 — cancelling the extension dialog loses focus

The installed extension correctly moves focus into the modal gloss field. Pressing Escape closes the dialog, but focus falls to the host page `<body>` because the invoking capture chip was hidden before `showModal()`. Focus should return to a meaningful control or the selected passage context.

### P2 — the monetization deviation is not explained

The researched brief specifies one-time monetization. The candidate instead states that every tool is free and contains no billing integration. Shipping free is honest and avoids the former dead checkout, but `.factory/handoff.md` did not explain this scope deviation as the work order requires.

## Claims contract

`.factory/claims.json` exists with 11 entries. After the clean-clone `npm ci` prerequisite, every listed command was run exactly and passed:

| Claim | Local sandbox result | Fresh live evidence |
| --- | --- | --- |
| `source-linked-capture` | PASS | PASS |
| `extension-selection` | PASS; Chromium case, mobile duplicate intentionally skipped | PASS with locally built extension |
| `demo-isolated` | PASS | PASS for real/demo namespace isolation |
| `local-only` | PASS | PASS for normal landing/demo/capture/review flow |
| `offline-reload` | PASS | PASS |
| `json-backup` | PASS | PASS |
| `keyboard-review` | PASS | PASS |
| `free-tools` | PASS | PASS |
| `delete-notes` | PASS | PASS, including Undo |
| `extension-download` | PASS against local preview | **FAIL live: 404** |
| `http-source-links` | PASS | PASS |

An initial literal pre-install invocation could not start because `node_modules` was absent (`wxt: not found`). This was the expected clean-clone setup state, not an application assertion failure; after `npm ci`, the command and all other claim commands passed.

## Clean checkout and local quality gates

The initial worktree was clean and `HEAD` exactly matched the requested candidate.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 145 packages installed, 0 vulnerabilities |
| `npm run typecheck` | PASS |
| Lint | N/A; no lint script or configuration exists |
| `npm test` | PASS; 39 passed, 1 intentional mobile extension duplicate skipped, 0 failed |
| `npm audit` | PASS; 0 vulnerabilities |
| `npm audit --omit=dev` | PASS; 0 vulnerabilities |
| `npm run build` | PASS; generated `dist/site` and the MV3 ZIP |
| `unzip -t dist/site/downloads/reading-margin-recall-chrome.zip` | PASS |

## End-to-end and recovery exercise

- The live real-data PWA saved `La memoria vuelve cuando leo despacio.` with a learner gloss, hidden word, title, and HTTPS source.
- Space revealed `memoria`; key `3` recorded one review with grade 3 and a two-day interval.
- Delete plus confirmation removed the note; Undo restored it.
- A `javascript:` source URL produced the accessible documented error and saved nothing.
- A structurally incomplete backup left existing storage byte-for-byte unchanged and announced recovery instructions.
- Forced `QuotaExceededError` kept all entered text, retained the existing note, and never announced success.
- Demo reset and **Start for real** preserved a seeded real note and removed demo keys.
- All three bundled source links returned 200.
- Extension selection boundaries behaved as implemented: 1 and 1,001 characters were ignored; 2 and 1,000 characters exposed the capture action.

The locally built extension was loaded into a clean Chromium profile. It captured only the selected sentence into extension storage, showed the required-field error, saved successfully, opened its popup, revealed with Space, graded with `4`, opened the original source tab, and deleted the note. Popup Axe found zero serious/critical violations. Its manifest is MV3 with only `storage` and `activeTab` permissions. This proves the local artifact works; it does not cure the missing production download.

## Accessibility and responsive behavior

- Standard live routes `/`, `/demo`, `/library`, `/review`, `/privacy`, and `/terms` had zero serious/critical Axe findings at desktop and 390 px; dark mode also had zero.
- The deployed unknown-route page had one critical Axe `image-alt` finding on both viewports.
- `/opt/fleet/lib/verify-url.sh` passed the landing page: load 700 ms, title present, `lang=en`, one h1, main landmark, no missing image alt, no unlabeled buttons, and no console/page errors.
- First Tab focused the skip link with a 3 px solid outline; its light-mode contrast is 3.52:1. Enter moved focus to `<main>`.
- At 390 px there was zero horizontal overflow. Simulated 200% root text also had zero horizontal overflow.
- Reduced motion produced `0.00001s` transitions/animations and `scroll-behavior: auto`.
- The extension dialog is labelled and initially focuses the gloss field, but its close-focus defect is noted above.

## Privacy, headers, endpoints, and offline behavior

- The full normal landing/demo/capture/review flow made requests only to `reading-margin-recall.sociobot.in`; there were no analytics, third-party fonts/scripts, AI calls, or embedded secrets.
- Root and `/demo` responses include the restrictive same-origin CSP, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and camera/microphone/geolocation denial.
- The Azure fallback page is the exception: it makes third-party requests and has none of those product headers.
- Live service-worker update passed: active and controlling worker `/sw.js`, no waiting worker, cache `reading-margin-recall-v4`.
- After switching offline, `/demo` reloaded with its banner and all three sample notes; no console/page errors occurred.
- The product has no server-side product endpoints, billing verification, or sign-in. API rate-limit, backend concurrency/persistence/health, and Entra authority checks are therefore not applicable. No request allowance exists to measure.

## Performance, caching, and deployment identity

Fresh Lighthouse mobile run: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.92 s**, LCP **1.07 s**, TBT **181 ms**, CLS **0**, total transfer **51,939 bytes**.

The local production build is comfortably within budget:

- JavaScript: 24.27 KB raw / 8.78 KB gzip;
- CSS: 16.55 KB raw / 4.50 KB gzip;
- fonts: none downloaded;
- mobile hero: 25,872 bytes;
- desktop hero: 109,412 bytes.

Hashed JS/CSS and hero assets use one-year immutable caching. HTML, the manifest, and service worker use 30-second revalidation.

The deployed shell is this candidate: live and local SHA-256 hashes match exactly for `index.html`, hashed JS, hashed CSS, `sw.js`, manifest, robots, sitemap, and both hero images. Representative hashes:

| Asset | SHA-256 local and live |
| --- | --- |
| `index.html` | `77895ee83c71dc65066f83487c9bee3f68fdfa187a8a5fd4e7a172ea749835a8` |
| `assets/index-Ydm-eSO9.js` | `db9b769eda5580f012178c6eb8d43f36bd7335960fc6afb38d12e0ee08c8b593` |
| `assets/index-JgE9hKS3.css` | `e90592213f3556228131557ca58f747564bbc499fa4d1ebc59234960fc171b16` |
| `sw.js` | `9b9e639d169a574d2343aeaeea6ea0f5663804375a0deec0b7bcdda70148e888` |

The mismatch is material and specific: the extension ZIP is missing live, while the custom 404 is missing from the local production output itself.

## Required release actions

1. Deploy `dist/site/downloads/reading-margin-recall-chrome.zip` and confirm a fresh unauthenticated GET returns the ZIP with status 200 and matching SHA-256.
2. Include the styled `404.html` in `dist/site`, then verify unknown paths return it with status 404, product security headers, no third-party requests, and zero serious/critical Axe violations.
3. Clear demo storage whenever navigation leaves demo mode, or explicitly offer to keep it.
4. Increase the mobile Demo nav hit area to at least 44×44 CSS px.
5. Restore focus after the extension dialog closes.
6. Record why the researched one-time monetization was replaced with an entirely free release.
