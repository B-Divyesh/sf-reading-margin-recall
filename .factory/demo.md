# Demo sandbox

Open `https://reading-margin-recall.sociobot.in/demo` or use `http://localhost:5173/demo` during development.

The demo starts with three source-linked notes in French, German, and Spanish. Each includes a learner-written gloss, one hidden word, review history, and a public source URL. The sample is bundled with the app and works offline.

Demo notes use `localStorage` key `demo:rmr:notes`. Demo theme settings use `demo:rmr:theme`. Real notes use `rmr:notes`; no demo action reads or writes that key.

Choose **Reset demo** to restore the three bundled notes. Choose **Start for real** to delete every `demo:` key and open the real notes screen. Demo notes are never copied into real storage.
