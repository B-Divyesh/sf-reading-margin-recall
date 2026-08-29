import { browser } from 'wxt/browser';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { deletionChoices, makeNote, type ReadingNote } from '../shared/model';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    const host = document.createElement('div');
    host.id = 'reading-margin-recall-root';
    const shadow = host.attachShadow({ mode: 'open' });
    document.documentElement.append(host);
    let selectedText = '';

    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      * { box-sizing: border-box; }
      button, input, textarea, select { font: 16px/1.4 ui-sans-serif, system-ui, sans-serif; }
      button { cursor: pointer; min-height: 44px; }
      button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 3px solid #d79a2b; outline-offset: 3px; }
      .capture-chip { position: fixed; z-index: 2147483646; display: none; min-height: 44px; padding: 8px 13px; border: 0; border-radius: 4px 18px 4px 4px; box-shadow: 0 8px 28px rgba(16,37,29,.28); background: #18362b; color: #f4f0e4; font-weight: 800; }
      .capture-chip.visible { display: block; }
      dialog { width: min(520px, calc(100vw - 24px)); max-height: calc(100vh - 24px); margin: auto; padding: 0; border: 1px solid #50635a; border-radius: 3px 28px 3px 3px; box-shadow: 0 24px 80px rgba(16,37,29,.35); background: #f4f0e4; color: #18362b; font: 16px/1.5 ui-sans-serif, system-ui, sans-serif; overflow: auto; }
      dialog::backdrop { background: rgba(16,37,29,.52); }
      form { padding: 24px; }
      h2 { margin: 0 0 6px; font: 500 30px/1.12 Georgia, serif; }
      .hint { margin: 0 0 20px; color: #50635a; }
      blockquote { margin: 0 0 18px; padding: 14px; border-left: 4px solid #d79a2b; background: #e7dfc9; font: 20px/1.45 Georgia, serif; }
      label { display: block; margin: 14px 0 5px; font-weight: 800; }
      textarea, select { width: 100%; padding: 10px; border: 1px solid #50635a; border-radius: 2px; background: #fbf8ef; color: #18362b; }
      textarea { min-height: 86px; resize: vertical; }
      .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
      .primary, .secondary { padding: 9px 16px; border: 1px solid #173f31; border-radius: 3px 14px 3px 3px; font-weight: 800; }
      .primary { background: #173f31; color: #f4f0e4; }
      .secondary { background: transparent; color: #173f31; }
      .error { min-height: 24px; margin: 10px 0 0; color: #913641; font-weight: 700; }
      .success { display: none; padding: 36px 24px; text-align: center; }
      .success strong { display: block; margin-bottom: 8px; font: 500 28px Georgia, serif; }
      @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
    `;
    const chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'capture-chip'; chip.textContent = 'Save passage';
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-labelledby', 'rmr-title');
    dialog.innerHTML = `<form method="dialog"><h2 id="rmr-title">Save this passage</h2><p class="hint">Add your meaning, then choose one word to recall.</p><blockquote id="rmr-passage"></blockquote><label for="rmr-gloss">Your gloss</label><textarea id="rmr-gloss" required></textarea><label for="rmr-deletion">Word to hide</label><select id="rmr-deletion" required><option value="">Choose a word</option></select><p id="rmr-error" class="error" role="alert"></p><div class="actions"><button class="secondary" value="cancel">Cancel</button><button id="rmr-save" class="primary" value="default">Save review note</button></div></form><div class="success" role="status"><strong>Passage saved</strong><span>Open the extension to review it.</span></div>`;
    shadow.append(style, chip, dialog);

    const hideChip = () => chip.classList.remove('visible');
    document.addEventListener('mousedown', (event) => { if (!host.contains(event.target as Node)) hideChip(); });
    document.addEventListener('selectionchange', () => { if (!document.getSelection()?.toString().trim()) hideChip(); });
    document.addEventListener('mouseup', (event) => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const selection = document.getSelection(); const value = selection?.toString().replace(/\s+/g, ' ').trim() ?? '';
      if (value.length < 2 || value.length > 1000 || !selection?.rangeCount) { hideChip(); return; }
      selectedText = value;
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      chip.style.left = `${Math.max(8, Math.min(innerWidth - 132, rect.left))}px`;
      chip.style.top = `${Math.max(8, Math.min(innerHeight - 52, rect.bottom + 8))}px`;
      chip.classList.add('visible');
    });

    chip.addEventListener('click', () => {
      hideChip();
      dialog.querySelector<HTMLElement>('#rmr-passage')!.textContent = selectedText;
      const select = dialog.querySelector<HTMLSelectElement>('#rmr-deletion')!;
      select.replaceChildren(new Option('Choose a word', ''), ...deletionChoices(selectedText).map((word) => new Option(word, word)));
      (dialog.querySelector<HTMLTextAreaElement>('#rmr-gloss')!).value = '';
      dialog.querySelector<HTMLElement>('.success')!.style.display = 'none';
      dialog.querySelector<HTMLFormElement>('form')!.style.display = 'block';
      dialog.showModal();
      requestAnimationFrame(() => dialog.querySelector<HTMLTextAreaElement>('#rmr-gloss')!.focus());
    });

    dialog.querySelector<HTMLButtonElement>('#rmr-save')!.addEventListener('click', async (event) => {
      event.preventDefault();
      const gloss = dialog.querySelector<HTMLTextAreaElement>('#rmr-gloss')!.value.trim();
      const deletion = dialog.querySelector<HTMLSelectElement>('#rmr-deletion')!.value;
      const error = dialog.querySelector<HTMLElement>('#rmr-error')!;
      if (!gloss || !deletion) { error.textContent = 'Add your gloss and choose a hidden word.'; return; }
      try {
        const stored = await browser.storage.local.get('rmr:notes');
        const notes = Array.isArray(stored['rmr:notes']) ? stored['rmr:notes'] as ReadingNote[] : [];
        notes.unshift(makeNote({ passage: selectedText, gloss, deletion, sourceUrl: location.href, sourceTitle: document.title || location.hostname }));
        await browser.storage.local.set({ 'rmr:notes': notes });
        dialog.querySelector<HTMLFormElement>('form')!.style.display = 'none';
        dialog.querySelector<HTMLElement>('.success')!.style.display = 'block';
        setTimeout(() => dialog.close(), 1200);
      } catch {
        error.textContent = 'The passage was not saved. Check extension storage, then try again.';
      }
    });
  }
});
