# Reading Margin Recall

Turn selected passages into private, source-linked review notes.

Reading Margin Recall is for language learners reading their own ebooks and web articles. Select one sentence, add your gloss, choose a hidden word, and review it later. Every note keeps a link to its original page.

The product has two parts:

- A Manifest V3 browser extension captures selected text on any normal web page.
- A local PWA provides capture, review, JSON backup, and the one-click demo.

Each part keeps its own local notes. Use JSON export and import when moving a collection between browsers.

Reading notes stay in browser storage. Capture and review make no third-party requests. The installed PWA works offline after its first visit. The demo uses separate `demo:` storage and never touches real notes.

## Try the demo

Open `/demo`, or visit [the live demo](https://reading-margin-recall.sociobot.in/demo). It loads three French, German, and Spanish sample notes. Use **Reset demo** to restore them. Use **Start for real** to discard the demo data.

## Install the extension

After a production build:

1. Open `chrome://extensions` in Chrome or another Chromium browser.
2. Turn on Developer mode.
3. Choose **Load unpacked** and select `.output/chrome-mv3`.
4. Select text on a web page, then choose **Save passage**.
5. Open the extension to reveal and grade the note.

The packaged download is written to `dist/site/downloads/reading-margin-recall-chrome.zip`.

## Develop

Requirements: Node.js 22 and npm.

```sh
npm install
npm run dev             # PWA at http://localhost:5173
npm run dev:extension   # WXT extension development
npm run typecheck
npm test
npm run build
npm run verify:live     # after deployment; checks build identity, ZIP, and branded HTTP 404
```

`npm run build` builds the WXT extension, packages its zip, and writes the static deployment to `dist/site`. Deploy that directory as the site root.
`npm run verify:live` compares the deployed script, stylesheet, extension ZIP, and same-origin build receipt with that build. It also proves the live receipt names the pushed candidate commit, then checks the live HTTP 404, product headers, request privacy, and Axe results.

## Product behavior

- Space reveals a review answer. Keys 1–4 grade recall.
- JSON export includes every note. JSON import restores a backup.
- Source links accept only `http:` and `https:` addresses.
- Every tool is free to use. No account or subscription is required.
- Difficult-note and source filters are available in every review.

No automatic translation, OCR, book catalog, sync account, or content scraping is included.

## Privacy and terms

The site includes `/privacy` and `/terms`. Reading notes and settings stay in browser storage.

## Repository map

- `entrypoints/` — WXT content script and popup
- `site/` — static PWA and public metadata
- `shared/` — note model and recall scheduling
- `tests/` — Playwright claim and quality checks
- `.factory/` — brief, visual thesis, claim contract, demo guide, copy audit, and handoff

Licensed under the [MIT License](LICENSE).
