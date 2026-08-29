import { browser } from 'wxt/browser';
import { clozePassage, gradeNote, isHttpUrl, makeBackup, parseBackup, type ReadingNote, type RecallGrade } from '../../shared/model';

const main = document.querySelector<HTMLElement>('#main')!;
let notes: ReadingNote[] = [];
let revealed = false;
const esc = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);

async function load() {
  const stored = await browser.storage.local.get('rmr:notes');
  notes = Array.isArray(stored['rmr:notes']) ? stored['rmr:notes'] as ReadingNote[] : [];
  render();
}

function render() {
  const note = notes.slice().sort((a, b) => a.dueAt.localeCompare(b.dueAt))[0];
  if (!note) {
    main.innerHTML = `<h1>Save a passage to begin</h1><div class="empty"><span aria-hidden="true">⌇</span><p>Select a sentence on a web page. Then choose <strong>Save passage</strong>.</p></div>${transferControls()}`;
    bindTransferControls();
    return;
  }
  main.innerHTML = `<p class="eyebrow">${notes.length} saved · ${note.reviews} reviews</p><h1>Recall the missing word</h1><article><p class="source">${esc(note.sourceTitle)}</p><blockquote>${esc(revealed ? note.passage : clozePassage(note))}</blockquote><p class="gloss-label">Your gloss</p><p class="gloss">${esc(note.gloss)}</p>${revealed ? `<p class="answer">Hidden word: <strong>${esc(note.deletion)}</strong></p><fieldset><legend>How well did you recall it?</legend><div class="grades"><button data-grade="1"><kbd>1</kbd> Again</button><button data-grade="2"><kbd>2</kbd> Hard</button><button data-grade="3"><kbd>3</kbd> Good</button><button data-grade="4"><kbd>4</kbd> Easy</button></div></fieldset>` : `<button id="reveal" class="primary">Reveal answer <kbd>Space</kbd></button>`}<button id="source" class="source-link">Open original page ↗</button></article><div class="footer-actions"><button id="delete" class="danger">Delete note</button></div>${transferControls()}`;
  document.querySelector('#reveal')?.addEventListener('click', () => { revealed = true; render(); });
  document.querySelectorAll<HTMLButtonElement>('[data-grade]').forEach((button) => button.addEventListener('click', () => applyGrade(note.id, Number(button.dataset.grade) as RecallGrade)));
  document.querySelector('#source')?.addEventListener('click', () => {
    if (isHttpUrl(note.sourceUrl)) void browser.tabs.create({ url: note.sourceUrl });
    else document.querySelector('#live')!.textContent = 'This note has no usable web source link.';
  });
  document.querySelector('#delete')?.addEventListener('click', async () => { if (confirm(`Delete the note from “${note.sourceTitle}”?`)) { notes = notes.filter((item) => item.id !== note.id); await save(); render(); } });
  bindTransferControls();
}

function transferControls() {
  return `<section class="transfer" aria-labelledby="transfer-title"><h2 id="transfer-title">Move notes between the extension and web app</h2><p>Export here, then import the same JSON file in the web app.</p><div><button id="export-notes" class="secondary">Export notes as JSON</button><label class="secondary file-label">Import notes from JSON<input id="import-notes" type="file" accept="application/json"></label><button id="open-site" class="source-link">Open my notes in the web app</button></div></section>`;
}

function bindTransferControls() {
  document.querySelector('#open-site')?.addEventListener('click', () => browser.tabs.create({ url: 'https://reading-margin-recall.sociobot.in/library' }));
  document.querySelector('#export-notes')?.addEventListener('click', exportNotes);
  document.querySelector<HTMLInputElement>('#import-notes')?.addEventListener('change', importNotes);
}

async function exportNotes() {
  const blob = new Blob([JSON.stringify(makeBackup(notes), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  try {
    await browser.downloads.download({ url, filename: `reading-margin-recall-${new Date().toISOString().slice(0, 10)}.json`, saveAs: false });
    document.querySelector('#live')!.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'} exported for the web app.`;
  } catch {
    document.querySelector('#live')!.textContent = 'The backup could not be downloaded. Check download permission, then try again.';
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

async function importNotes(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const backup = parseBackup(JSON.parse(await file.text()));
    if (!backup) throw new Error('invalid backup');
    notes = backup.notes;
    await save();
    revealed = false;
    render();
    document.querySelector('#live')!.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'} imported from the web app.`;
  } catch {
    input.value = '';
    document.querySelector('#live')!.textContent = 'That file could not be imported. Choose a complete Reading Margin Recall JSON backup.';
  }
}

async function save() { await browser.storage.local.set({ 'rmr:notes': notes }); }
async function applyGrade(id: string, grade: RecallGrade) { notes = notes.map((note) => note.id === id ? gradeNote(note, grade) : note); await save(); revealed = false; document.querySelector('#live')!.textContent = 'Review saved.'; render(); }

addEventListener('keydown', (event) => {
  if (event.code === 'Space' && document.querySelector('#reveal')) { event.preventDefault(); (document.querySelector('#reveal') as HTMLButtonElement).click(); }
  if (/^[1-4]$/.test(event.key) && revealed) (document.querySelector(`[data-grade="${event.key}"]`) as HTMLButtonElement | null)?.click();
});
load().catch(() => { main.innerHTML = '<h1>Notes could not load</h1><p>Reload the extension. If this continues, check its storage permission.</p>'; });
