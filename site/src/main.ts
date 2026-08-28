import './styles.css';
import { DEMO_NOTES, clozePassage, deletionChoices, gradeNote, isHttpUrl, makeNote, type ReadingNote, type RecallGrade } from '../../shared/model';

const PRODUCT = 'Reading Margin Recall';
const SITE = 'https://reading-margin-recall.sociobot.in';
const app = document.querySelector<HTMLDivElement>('#app')!;
let demoMode = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let lastDeleted: ReadingNote | null = null;
let revealAnswer = false;

const e = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const notesKey = () => demoMode ? 'demo:rmr:notes' : 'rmr:notes';
const themeKey = () => demoMode ? 'demo:rmr:theme' : 'rmr:theme';

function readNotes(): ReadingNote[] {
  try {
    const raw = localStorage.getItem(notesKey());
    if (!raw && demoMode) {
      localStorage.setItem(notesKey(), JSON.stringify(DEMO_NOTES));
      return structuredClone(DEMO_NOTES);
    }
    return raw ? JSON.parse(raw) as ReadingNote[] : [];
  } catch {
    announce('Notes could not be read. Check this browser’s storage settings.');
    return [];
  }
}

function saveNotes(notes: ReadingNote[]) {
  try {
    localStorage.setItem(notesKey(), JSON.stringify(notes));
  } catch {
    announce('The note was not saved because browser storage is unavailable.');
  }
}

function announce(message: string) {
  const live = document.querySelector<HTMLElement>('#announcer');
  if (live) live.textContent = message;
}

function icon(): string {
  return `<svg aria-hidden="true" viewBox="0 0 64 64"><path d="M18 52c9-9 18-22 28-40M29 39c-8 0-13-4-16-10 8-2 14 0 19 5m7-10c1-6 5-11 12-13 1 8-3 14-10 18"/><circle cx="47" cy="47" r="5"/></svg>`;
}

function header(): string {
  const demoHref = (path: string) => demoMode ? `${path}?demo=1` : path;
  return `<a class="skip-link" href="#main">Skip to main content</a>
    ${demoMode ? `<aside class="demo-banner" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved to your notes.</span><div><button class="quiet-button" data-action="reset-demo">Reset demo</button><button class="quiet-button" data-action="start-real">Start for real</button></div></aside>` : ''}
    <header class="site-header">
      <a class="wordmark nav-link" href="/" aria-label="Reading Margin Recall home">${icon()}<span>Reading Margin<br><em>Recall</em></span></a>
      <nav aria-label="Main navigation"><a class="nav-link" href="/demo">Demo</a><a class="nav-link" href="${demoHref('/library')}">My notes</a><a class="nav-link" href="${demoHref('/review')}">Review</a><a class="nav-link" href="${demoHref('/privacy')}">Privacy</a></nav>
      <button class="theme-button" data-action="theme" aria-label="Change color theme" title="Change color theme"><span aria-hidden="true">◐</span></button>
    </header>`;
}

function footer(): string {
  return `<footer><div><p><strong>${PRODUCT}</strong></p><p>Source-linked recall notes for language learners.</p></div><nav aria-label="Footer navigation"><a class="nav-link" href="/privacy">Privacy</a><a class="nav-link" href="/terms">Terms</a><a href="https://hello-factory.sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external)</span></a></nav><p class="build">v1.0.0 · Original generated field-guide artwork</p></footer>`;
}

function shell(content: string): string {
  return `${header()}<main id="main" tabindex="-1">${content}</main>${footer()}<div id="announcer" class="sr-only" aria-live="polite"></div><div id="toast" class="toast" role="status"></div>`;
}

function landing(): string {
  return shell(`<section class="hero section-pad">
    <div class="hero-copy"><p class="eyebrow">A private field guide for words</p><h1>Save passages for later recall</h1><p class="lede">For language learners who want selected sentences to become source-linked review notes.</p>
      <div class="hero-actions"><a class="button primary nav-link" href="/demo">Try it with sample data</a><a class="button secondary nav-link" href="/library">Add my first passage</a></div><p class="action-note">The demo loads three notes. Your real notes stay untouched.</p>
      <ul class="plain-facts" aria-label="Product facts"><li><strong>Private</strong><span>Stays on this device</span></li><li><strong>Offline</strong><span>Works after the first visit</span></li><li><strong>Price</strong><span>Core tools are free</span></li></ul>
    </div>
    <figure class="hero-art"><picture><source media="(max-width: 640px)" srcset="/assets/field-guide-hero-mobile.webp"><img src="/assets/field-guide-hero.webp" width="1536" height="1024" alt="An open field notebook connects a sentence slip with a pressed fern and recall mark." fetchpriority="high" decoding="async"></picture><figcaption>Keep the sentence, your gloss, and its path home.</figcaption></figure>
  </section>
  <section class="preview section-pad ruled" aria-labelledby="preview-title"><div class="margin-label">Specimen 03 · due today</div><div class="preview-sheet"><p class="eyebrow">Live review preview</p><h2 id="preview-title">Recall the missing word</h2><blockquote lang="fr">La vie est une fleur dont l’amour est le <mark>_____</mark>.</blockquote><p class="gloss">Your gloss: Life is a flower whose honey is love.</p><div class="preview-actions"><a class="button secondary nav-link" href="/demo">Reveal it in the demo</a><a href="https://fr.wikisource.org/wiki/Les_Chansons_des_rues_et_des_bois" rel="external">Open source <span class="sr-only">(external)</span> ↗</a></div></div></section>
  <section class="steps section-pad" aria-labelledby="how-title"><p class="eyebrow">From margin to memory</p><h2 id="how-title">How it works</h2><ol><li><span>01</span><h3>Select a sentence</h3><p>Highlight only the text you own or can read.</p></li><li><span>02</span><h3>Add your gloss</h3><p>Choose one word to hide during review.</p></li><li><span>03</span><h3>Recall, then return</h3><p>Grade your answer and open the original page.</p></li></ol></section>
  <section class="boundaries section-pad" aria-labelledby="privacy-title"><div><p class="eyebrow">A narrow, honest tool</p><h2 id="privacy-title">Your reading stays yours</h2><p>The extension captures only text you select. It does not fetch books, translate pages, or bypass access controls.</p><a class="nav-link" href="/privacy">Read the privacy details</a></div><ul><li>No account</li><li>No tracking scripts</li><li>JSON backup and restore</li><li>Delete any note</li></ul></section>
  <section class="included section-pad" aria-labelledby="included-title"><div class="included-stamp"><strong>Free</strong><span>all tools</span></div><div><p class="eyebrow">Everything included</p><h2 id="included-title">Focus each review</h2><p>Every tool is free to use. No account or subscription is required.</p><ul><li>Filter difficult notes</li><li>Review one source at a time</li><li>Export and import JSON backups</li></ul></div></section>`);
}

function captureForm(notes: ReadingNote[]): string {
  const params = new URLSearchParams(location.search);
  const passage = params.get('text') ?? '';
  const sourceUrl = params.get('url') ?? '';
  const sourceTitle = params.get('title') ?? '';
  const choices = deletionChoices(passage);
  return `<form id="capture-form" class="capture-form"><div class="field wide"><label for="passage">Selected passage <span aria-hidden="true">*</span></label><textarea id="passage" name="passage" rows="4" required aria-describedby="passage-help">${e(passage)}</textarea><small id="passage-help">Paste one sentence or use the browser extension.</small></div><div class="field"><label for="gloss">Your gloss <span aria-hidden="true">*</span></label><textarea id="gloss" name="gloss" rows="3" required></textarea></div><div class="field"><label for="deletion">Word to hide <span aria-hidden="true">*</span></label><select id="deletion" name="deletion" required><option value="">Choose a word</option>${choices.map((word) => `<option value="${e(word)}">${e(word)}</option>`).join('')}</select></div><div class="field"><label for="source-title">Source title <span aria-hidden="true">*</span></label><input id="source-title" name="sourceTitle" value="${e(sourceTitle)}" required></div><div class="field wide"><label for="source-url">Source URL <span aria-hidden="true">*</span></label><input id="source-url" name="sourceUrl" type="url" value="${e(sourceUrl)}" required aria-describedby="source-url-help capture-error"><small id="source-url-help">Use a full http or https address.</small></div><button class="button primary" type="submit">Save review note</button><p id="capture-error" class="form-error" role="alert"></p></form>`;
}

function sourceAnchor(note: ReadingNote, text: string, className = ''): string {
  if (!isHttpUrl(note.sourceUrl)) return `<span class="unavailable-source ${className}">Source link unavailable</span>`;
  return `<a class="${className}" href="${e(note.sourceUrl)}" rel="external">${text}</a>`;
}

function noteList(notes: ReadingNote[]): string {
  if (!notes.length) return `<div class="empty-state"><span class="pressed-leaf" aria-hidden="true">⌇</span><h2>No passages saved yet</h2><p>Your selected passages will appear here. Add one above or install the extension.</p><a class="button secondary" href="/downloads/reading-margin-recall-chrome.zip" download>Download the extension</a></div>`;
  return `<section class="field-log" aria-labelledby="field-log-title"><div class="section-heading"><div><p class="eyebrow">Local field log</p><h2 id="field-log-title">${notes.length} saved ${notes.length === 1 ? 'passage' : 'passages'}</h2></div><div class="toolbar"><button class="quiet-button" data-action="export">Export JSON</button><label class="quiet-button file-label">Import JSON<input id="import-file" type="file" accept="application/json"></label></div></div><ol class="note-grid">${notes.map((note, index) => `<li class="note-card"><div class="specimen-number">${String(index + 1).padStart(2, '0')}</div><blockquote>${e(note.passage)}</blockquote><p class="note-gloss">${e(note.gloss)}</p><dl><div><dt>Hide</dt><dd>${e(note.deletion)}</dd></div><div><dt>Reviews</dt><dd>${note.reviews}</dd></div></dl><div class="note-actions">${sourceAnchor(note, `Open source <span class="sr-only">${e(note.sourceTitle)} (external)</span> ↗`)}<button class="text-button danger" data-delete="${e(note.id)}">Delete</button></div></li>`).join('')}</ol></section>`;
}

function library(): string {
  const notes = readNotes();
  return shell(`<section class="app-intro section-pad"><p class="eyebrow">Your private margin</p><h1>${demoMode ? 'Explore saved sample passages' : 'Save a passage for later recall'}</h1><p>${demoMode ? 'These three sample notes use a separate demo store.' : 'Paste a selected sentence, explain it in your words, then hide one word.'}</p></section><section class="workbench section-pad"><div class="margin-label">New specimen</div>${captureForm(notes)}</section><div class="section-pad">${noteList(notes)}</div>`);
}

function review(): string {
  const allNotes = readNotes();
  const filters = new URLSearchParams(location.search);
  const difficultOnly = filters.get('difficult') === '1';
  const sourceFilter = filters.get('source') ?? '';
  const notes = allNotes.filter((note) => (!difficultOnly || (note.lastGrade ?? 1) <= 2) && (!sourceFilter || note.sourceTitle === sourceFilter));
  const now = Date.now();
  const due = notes.filter((note) => new Date(note.dueAt).getTime() <= now).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const note = due[0] ?? notes[0];
  const filterBar = `<form id="review-filters" class="review-filters"><label><input type="checkbox" name="difficult" value="1" ${difficultOnly ? 'checked' : ''}> Difficult notes only</label><label for="source-filter">Source</label><select id="source-filter" name="source"><option value="">Every source</option>${[...new Set(allNotes.map((item) => item.sourceTitle))].map((source) => `<option ${source === sourceFilter ? 'selected' : ''}>${e(source)}</option>`).join('')}</select></form>`;
  if (!note) return shell(`<section class="center-state section-pad"><p class="eyebrow">Review desk</p><h1>Review saved passages</h1>${filterBar}<div class="empty-state"><h2>${allNotes.length ? 'No notes match these filters' : 'No notes are ready'}</h2><p>${allNotes.length ? 'Change a filter to see more notes.' : 'Save a passage first. Its first review starts right away.'}</p><a class="button primary nav-link" href="/library">Add a passage</a></div></section>`);
  const passage = revealAnswer ? note.passage : clozePassage(note);
  return shell(`<section class="review-page section-pad" data-note-id="${e(note.id)}"><p class="eyebrow">Review ${Math.min(notes.length, notes.length - due.length + 1)} of ${notes.length}</p><h1>Recall the missing word</h1>${filterBar}<article class="review-sheet"><div class="specimen-tab">${e(note.sourceTitle)}</div><blockquote>${e(passage)}</blockquote><p class="gloss-label">Your gloss</p><p class="review-gloss">${e(note.gloss)}</p>${revealAnswer ? `<p class="answer">Hidden word: <strong>${e(note.deletion)}</strong></p><fieldset class="grade-field"><legend>How well did you recall it?</legend><div><button class="grade" data-grade="1"><kbd>1</kbd> Again</button><button class="grade" data-grade="2"><kbd>2</kbd> Hard</button><button class="grade" data-grade="3"><kbd>3</kbd> Good</button><button class="grade" data-grade="4"><kbd>4</kbd> Easy</button></div></fieldset>` : `<button class="button primary reveal" data-action="reveal">Reveal answer <kbd>Space</kbd></button>`}${sourceAnchor(note, `Return to “${e(note.sourceTitle)}” <span class="sr-only">(external)</span> ↗`, 'source-return')}</article><p class="keyboard-note">Keyboard: Space reveals. Keys 1–4 grade your answer.</p></section>`);
}

function privacy(): string {
  return shell(`<article class="legal section-pad"><p class="eyebrow">Privacy · updated 28 August 2026</p><h1>Your notes stay in your browser</h1><h2>What is stored</h2><p>Passages, glosses, source links, review dates, and settings stay in browser storage.</p><h2>What leaves the device</h2><p>Nothing leaves during capture, review, export, or demo use.</p><h2>Demo data</h2><p>The demo uses keys that start with <code>demo:</code>. Starting for real deletes those demo keys and never copies them.</p><h2>Extension access</h2><p>The extension reads only text you actively select. It does not fetch full pages, book files, or protected content.</p><h2>Delete your data</h2><p>Delete individual notes in My notes. Clearing this site’s browser storage removes everything.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with privacy questions.</p></article>`);
}

function terms(): string {
  return shell(`<article class="legal section-pad"><p class="eyebrow">Terms · updated 28 August 2026</p><h1>Use your own reading material</h1><h2>Your responsibility</h2><p>Capture only text you may access. Do not use the extension to copy whole works or bypass access controls.</p><h2>The free tools</h2><p>Capture, review, filters, source links, JSON export, and JSON import are free.</p><h2>No warranty</h2><p>The software is provided as is. Keep a JSON backup of notes you cannot replace.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> for help.</p></article>`);
}

function notFound(): string {
  return shell(`<section class="not-found section-pad"><div class="lost-leaf" aria-hidden="true">⌁</div><p class="eyebrow">404 · loose leaf</p><h1>This page is not in the field guide</h1><p>The link may be old. Your saved notes have not changed.</p><a class="button primary nav-link" href="/">Return home</a></section>`);
}

function titleFor(path: string): string {
  return ({ '/': 'Reading Margin Recall — Save passages for review', '/demo': 'Demo — Reading Margin Recall', '/library': 'My notes — Reading Margin Recall', '/review': 'Review — Reading Margin Recall', '/privacy': 'Privacy — Reading Margin Recall', '/terms': 'Terms — Reading Margin Recall' } as Record<string, string>)[path] ?? 'Page not found — Reading Margin Recall';
}

function render(moveFocus = false) {
  const path = demoMode && location.pathname === '/demo' ? '/demo' : location.pathname;
  document.title = titleFor(path);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `${SITE}${path === '/demo' ? '/demo' : path}`;
  app.innerHTML = path === '/' ? landing() : path === '/demo' || path === '/library' ? library() : path === '/review' ? review() : path === '/privacy' ? privacy() : path === '/terms' ? terms() : notFound();
  applyTheme();
  bindEvents();
  if (moveFocus) requestAnimationFrame(() => { const heading = document.querySelector<HTMLElement>('h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true }); });
}

function navigate(url: URL) {
  demoMode = url.pathname === '/demo' || url.searchParams.get('demo') === '1';
  history.pushState({}, '', `${url.pathname}${url.search}`);
  revealAnswer = false;
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  render(true);
}

function applyTheme() {
  const saved = localStorage.getItem(themeKey()) ?? 'auto';
  document.documentElement.dataset.theme = saved;
}

function bindEvents() {
  document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    const main = document.querySelector<HTMLElement>('#main');
    main?.focus({ preventScroll: true });
    main?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  document.querySelectorAll<HTMLAnchorElement>('a.nav-link').forEach((link) => link.addEventListener('click', (event) => {
    const url = new URL(link.href);
    if (url.origin === location.origin) { event.preventDefault(); navigate(url); }
  }));
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((control) => control.addEventListener('click', handleAction));
  document.querySelectorAll<HTMLButtonElement>('[data-delete]').forEach((button) => button.addEventListener('click', () => deleteNote(button.dataset.delete!)));
  document.querySelectorAll<HTMLButtonElement>('[data-grade]').forEach((button) => button.addEventListener('click', () => submitGrade(Number(button.dataset.grade) as RecallGrade)));
  const form = document.querySelector<HTMLFormElement>('#capture-form');
  form?.addEventListener('submit', captureNote);
  (form?.elements.namedItem('passage') as HTMLTextAreaElement | null)?.addEventListener('input', updateDeletionChoices);
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', importNotes);
  document.querySelector<HTMLFormElement>('#review-filters')?.addEventListener('change', applyReviewFilters);
}

function applyReviewFilters(event: Event) {
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const url = new URL(location.href);
  data.get('difficult') ? url.searchParams.set('difficult', '1') : url.searchParams.delete('difficult');
  const source = String(data.get('source') ?? '');
  source ? url.searchParams.set('source', source) : url.searchParams.delete('source');
  navigate(url);
}

function handleAction(event: Event) {
  const target = event.currentTarget as HTMLElement;
  const action = target.dataset.action;
  if (action === 'reset-demo') { localStorage.removeItem('demo:rmr:notes'); revealAnswer = false; render(); announce('Demo reset to three sample notes.'); }
  if (action === 'start-real') { Object.keys(localStorage).filter((key) => key.startsWith('demo:')).forEach((key) => localStorage.removeItem(key)); navigate(new URL('/library', location.origin)); }
  if (action === 'theme') {
    const current = localStorage.getItem(themeKey()) ?? 'auto';
    const next = current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
    localStorage.setItem(themeKey(), next); applyTheme(); announce(`Color theme: ${next}.`);
  }
  if (action === 'reveal') { revealAnswer = true; render(); announce('Answer revealed. Choose a recall grade.'); }
  if (action === 'export') exportNotes();
}

function updateDeletionChoices(event: Event) {
  const select = document.querySelector<HTMLSelectElement>('#deletion')!;
  const words = deletionChoices((event.target as HTMLTextAreaElement).value);
  select.innerHTML = `<option value="">Choose a word</option>${words.map((word) => `<option value="${e(word)}">${e(word)}</option>`).join('')}`;
}

function captureNote(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const input = Object.fromEntries(['passage', 'gloss', 'deletion', 'sourceUrl', 'sourceTitle'].map((key) => [key, String(data.get(key) ?? '').trim()])) as Record<string, string>;
  const error = document.querySelector<HTMLElement>('#capture-error')!;
  if (Object.values(input).some((value) => !value)) { error.textContent = 'The note is missing a field. Fill each marked field, then save again.'; return; }
  if (!input.passage.toLocaleLowerCase().includes(input.deletion.toLocaleLowerCase())) { error.textContent = 'The hidden word is not in the passage. Choose a listed word.'; return; }
  if (!isHttpUrl(input.sourceUrl)) { error.textContent = 'The source link must start with http:// or https://. Paste the full web address.'; return; }
  const notes = readNotes();
  notes.unshift(makeNote(input as Pick<ReadingNote, 'passage' | 'gloss' | 'deletion' | 'sourceUrl' | 'sourceTitle'>));
  saveNotes(notes); form.reset(); render(); announce('Review note saved.');
}

function deleteNote(id: string) {
  const notes = readNotes();
  const note = notes.find((item) => item.id === id);
  if (!note || !confirm(`Delete the note from “${note.sourceTitle}”?`)) return;
  lastDeleted = note; saveNotes(notes.filter((item) => item.id !== id)); render();
  const toast = document.querySelector<HTMLElement>('#toast')!;
  toast.innerHTML = `Note deleted. <button class="text-button" data-action="undo">Undo</button>`;
  toast.classList.add('show');
  toast.querySelector('button')?.addEventListener('click', () => { if (lastDeleted) { const current = readNotes(); current.unshift(lastDeleted); saveNotes(current); lastDeleted = null; render(); announce('Note restored.'); } });
}

function submitGrade(grade: RecallGrade) {
  const id = document.querySelector<HTMLElement>('[data-note-id]')?.dataset.noteId;
  const notes = readNotes().map((note) => note.id === id ? gradeNote(note, grade) : note);
  saveNotes(notes); revealAnswer = false; render(); announce('Review saved. The next note is ready.');
}

function exportNotes() {
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), notes: readNotes() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = `reading-margin-recall-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url);
  announce('JSON backup downloaded.');
}

async function importNotes(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
  try {
    const parsed = JSON.parse(await file.text()) as { notes?: ReadingNote[] };
    if (!Array.isArray(parsed.notes)) throw new Error('missing notes');
    const safeNotes = parsed.notes.filter((note): note is ReadingNote => typeof note === 'object' && note !== null && isHttpUrl((note as ReadingNote).sourceUrl));
    if (!safeNotes.length && parsed.notes.length) throw new Error('no safe source URLs');
    saveNotes(safeNotes); render(); announce(`${safeNotes.length} notes imported.`);
  } catch { announce('That file could not be imported. Choose a Reading Margin Recall JSON backup.'); }
}

function setConnectionState() {
  document.body.dataset.connection = navigator.onLine ? 'online' : 'offline';
  announce(navigator.onLine ? 'Back online.' : 'Offline. Saved notes still work.');
}

render(); setConnectionState();
addEventListener('popstate', () => { demoMode = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1'; render(true); });
addEventListener('online', setConnectionState); addEventListener('offline', setConnectionState);
addEventListener('keydown', (event) => {
  const tag = (event.target as HTMLElement).tagName; if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
  if (event.code === 'Space' && document.querySelector('[data-action="reveal"]')) { event.preventDefault(); (document.querySelector('[data-action="reveal"]') as HTMLButtonElement).click(); }
  if (/^[1-4]$/.test(event.key) && revealAnswer) (document.querySelector(`[data-grade="${event.key}"]`) as HTMLButtonElement | null)?.click();
  if (event.key.toLowerCase() === 'n' && location.pathname !== '/library') navigate(new URL('/library', location.origin));
});
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => announce('Offline setup failed. Reload once while online to try again.'));
