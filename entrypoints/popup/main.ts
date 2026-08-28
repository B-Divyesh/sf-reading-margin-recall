import { browser } from 'wxt/browser';
import { clozePassage, gradeNote, type ReadingNote, type RecallGrade } from '../../shared/model';

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
    main.innerHTML = `<h1>Save a passage to begin</h1><div class="empty"><span aria-hidden="true">⌇</span><p>Select a sentence on a web page. Then choose <strong>Save passage</strong>.</p></div><button id="open-site" class="secondary">Open the full reading margin</button>`;
    document.querySelector('#open-site')?.addEventListener('click', () => browser.tabs.create({ url: 'https://reading-margin-recall.sociobot.in/library' }));
    return;
  }
  main.innerHTML = `<p class="eyebrow">${notes.length} saved · ${note.reviews} reviews</p><h1>Recall the missing word</h1><article><p class="source">${esc(note.sourceTitle)}</p><blockquote>${esc(revealed ? note.passage : clozePassage(note))}</blockquote><p class="gloss-label">Your gloss</p><p class="gloss">${esc(note.gloss)}</p>${revealed ? `<p class="answer">Hidden word: <strong>${esc(note.deletion)}</strong></p><fieldset><legend>How well did you recall it?</legend><div class="grades"><button data-grade="1"><kbd>1</kbd> Again</button><button data-grade="2"><kbd>2</kbd> Hard</button><button data-grade="3"><kbd>3</kbd> Good</button><button data-grade="4"><kbd>4</kbd> Easy</button></div></fieldset>` : `<button id="reveal" class="primary">Reveal answer <kbd>Space</kbd></button>`}<button id="source" class="source-link">Open original page ↗</button></article><div class="footer-actions"><button id="open-site" class="secondary">Open all notes</button><button id="delete" class="danger">Delete note</button></div>`;
  document.querySelector('#reveal')?.addEventListener('click', () => { revealed = true; render(); });
  document.querySelectorAll<HTMLButtonElement>('[data-grade]').forEach((button) => button.addEventListener('click', () => applyGrade(note.id, Number(button.dataset.grade) as RecallGrade)));
  document.querySelector('#source')?.addEventListener('click', () => browser.tabs.create({ url: note.sourceUrl }));
  document.querySelector('#open-site')?.addEventListener('click', () => browser.tabs.create({ url: 'https://reading-margin-recall.sociobot.in/library' }));
  document.querySelector('#delete')?.addEventListener('click', async () => { if (confirm(`Delete the note from “${note.sourceTitle}”?`)) { notes = notes.filter((item) => item.id !== note.id); await save(); render(); } });
}

async function save() { await browser.storage.local.set({ 'rmr:notes': notes }); }
async function applyGrade(id: string, grade: RecallGrade) { notes = notes.map((note) => note.id === id ? gradeNote(note, grade) : note); await save(); revealed = false; document.querySelector('#live')!.textContent = 'Review saved.'; render(); }

addEventListener('keydown', (event) => {
  if (event.code === 'Space' && document.querySelector('#reveal')) { event.preventDefault(); (document.querySelector('#reveal') as HTMLButtonElement).click(); }
  if (/^[1-4]$/.test(event.key) && revealed) (document.querySelector(`[data-grade="${event.key}"]`) as HTMLButtonElement | null)?.click();
});
load().catch(() => { main.innerHTML = '<h1>Notes could not load</h1><p>Reload the extension. If this continues, check its storage permission.</p>'; });
