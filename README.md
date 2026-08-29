# Reading Margin Recall

Turn selected passages into private, source-linked review notes.

Reading Margin Recall is for language learners reading their own ebooks and web articles.
Select one sentence, add your gloss, choose a hidden word, and review it later.
Every note keeps a link to its original page.

The product has two parts:

- A Chrome-compatible extension captures selected text from a web page.
- An installable web app provides capture, review, JSON backup, and the one-click demo.

Each part keeps its own local notes.
Export a JSON backup from either part, then import it into the other.

Reading notes and color settings stay in browser storage.
Capture, review, JSON export, and demo Reset or Exit make no third-party requests.
The installed web app works offline after its first visit.
The demo uses separate `demo:` storage and never touches real notes.

## Try the demo

Open `/?demo=1`, or visit [the live demo](https://reading-margin-recall.sociobot.in/?demo=1).
It loads three French, German, and Spanish sample notes.
Use **Reset demo** to restore them.
Use **Exit demo and use my notes** to discard the demo data.

## Install the extension

After a production build:

1. Open `chrome://extensions` in Chrome or another Chromium browser.
2. Turn on Developer mode.
3. Choose **Load unpacked** and select `.output/chrome-mv3`.
4. Select text on a web page, then choose **Save passage**.
5. Open the extension to reveal and grade the note.

The packaged download is written to `dist/site/downloads/reading-margin-recall-chrome.zip`.

## Move notes between both parts

Choose **Export notes as JSON** in the extension.
Open My notes in the web app and choose **Import JSON**.
To move notes back, export from the web app and import the file in the extension.

## Develop

Requirements: Node.js 22 and npm.
Vite builds the web app. WXT builds the extension.

```sh
npm install
npm run dev             # web app at http://localhost:5173
npm run dev:extension   # extension development
npm run typecheck
npm test
npm run build
npm run verify:deployment # checks the exact dist/site tree before upload
npm run deploy:site       # builds, uploads dist/site, then checks the deployed site
npm run verify:live       # checks the deployed build, download, routes, and accessibility
```

`npm run build` and `npm run build:site` create the extension ZIP and static site in `dist/site`.
They also verify the installer, build record, and 404 configuration.
The web-app-only build step is private to the release assembler.
`npm run deploy:site` deploys `dist/site` and then runs deployed-site checks.
`npm run verify:live` compares the deployed assets, extension ZIP, and site-served build record with the local build.
The command confirms that the live receipt names the deployed commit.
It then checks the 404 page, headers, request privacy, and Axe results.

## Product behavior

- Space reveals a review answer.
- Keys 1–4 grade recall.
- JSON export includes every note.
- JSON import restores a backup.
- Source links accept only `http:` and `https:` addresses.
- All tools are free to use. No account or subscription is required.
- Filters show difficult notes or notes from one source.

You write the gloss and choose the hidden word yourself.
Import only the passages you choose.

## Privacy and terms

The site includes `/privacy` and `/terms`.
Reading notes and settings stay in browser storage.

## Repository map

- `entrypoints/` — extension capture and review screens
- `site/` — web app and public page files
- `shared/` — note model and recall scheduling
- `tests/` — browser claim and quality checks
- `.factory/` — product brief, visual thesis, claims, demo guide, copy audit, and handoff

Licensed under the [MIT License](LICENSE).
