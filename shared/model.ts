export type RecallGrade = 1 | 2 | 3 | 4;

export interface ReadingNote {
  id: string;
  passage: string;
  gloss: string;
  deletion: string;
  sourceUrl: string;
  sourceTitle: string;
  createdAt: string;
  dueAt: string;
  intervalDays: number;
  reviews: number;
  lastGrade?: RecallGrade;
}

export interface ReadingNotesBackup {
  version: 1;
  exportedAt: string;
  notes: ReadingNote[];
}

/**
 * Source links are opened from both the web app and the extension. Keep the
 * accepted schemes deliberately narrow so a saved/imported note cannot become
 * an executable or otherwise unusable browser URL.
 */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Backups are user-controlled input, even when they originated in an older
 * version of this app. Keep the complete shape check in one place so a bad
 * record can never reach a renderer or the review scheduler.
 */
export function isStoredReadingNote(value: unknown): value is ReadingNote {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const note = value as Record<string, unknown>;
  const textFields = ['id', 'passage', 'gloss', 'deletion', 'sourceUrl', 'sourceTitle', 'createdAt', 'dueAt'];
  if (textFields.some((field) => typeof note[field] !== 'string' || !(note[field] as string).trim())) return false;
  if (!(note.passage as string).toLocaleLowerCase().includes((note.deletion as string).toLocaleLowerCase())) return false;
  if (!Number.isSafeInteger(note.reviews) || (note.reviews as number) < 0) return false;
  if (typeof note.intervalDays !== 'number' || !Number.isFinite(note.intervalDays) || (note.intervalDays as number) < 0) return false;
  if (Number.isNaN(Date.parse(note.createdAt as string)) || Number.isNaN(Date.parse(note.dueAt as string))) return false;
  return note.lastGrade === undefined || note.lastGrade === 1 || note.lastGrade === 2 || note.lastGrade === 3 || note.lastGrade === 4;
}

/** A backup may only introduce web links; legacy local notes remain safe to display without a link. */
export function isReadingNote(value: unknown): value is ReadingNote {
  return isStoredReadingNote(value) && isHttpUrl(value.sourceUrl);
}

export function makeBackup(notes: ReadingNote[], exportedAt = new Date()): ReadingNotesBackup {
  return { version: 1, exportedAt: exportedAt.toISOString(), notes };
}

export function parseBackup(value: unknown): ReadingNotesBackup | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const backup = value as Record<string, unknown>;
  if (backup.version !== 1 || !Array.isArray(backup.notes) || !backup.notes.every(isReadingNote)) return null;
  return {
    version: 1,
    exportedAt: typeof backup.exportedAt === 'string' ? backup.exportedAt : new Date(0).toISOString(),
    notes: backup.notes
  };
}

export function makeNote(input: Pick<ReadingNote, 'passage' | 'gloss' | 'deletion' | 'sourceUrl' | 'sourceTitle'>): ReadingNote {
  const now = new Date();
  return {
    ...input,
    id: globalThis.crypto?.randomUUID?.() ?? `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
    createdAt: now.toISOString(),
    dueAt: now.toISOString(),
    intervalDays: 0,
    reviews: 0
  };
}

export function gradeNote(note: ReadingNote, grade: RecallGrade, now = new Date()): ReadingNote {
  const nextDays = grade === 1 ? 0 : grade === 2 ? 1 : grade === 3 ? Math.max(2, Math.round(note.intervalDays * 2.2) || 2) : Math.max(4, Math.round(note.intervalDays * 3.2) || 4);
  const due = new Date(now);
  due.setDate(due.getDate() + nextDays);
  if (grade === 1) due.setMinutes(due.getMinutes() + 10);
  return { ...note, lastGrade: grade, reviews: note.reviews + 1, intervalDays: nextDays, dueAt: due.toISOString() };
}

export function clozePassage(note: ReadingNote): string {
  if (!note.deletion) return note.passage;
  const index = note.passage.toLocaleLowerCase().indexOf(note.deletion.toLocaleLowerCase());
  if (index < 0) return note.passage;
  return `${note.passage.slice(0, index)}[…]${note.passage.slice(index + note.deletion.length)}`;
}

export function deletionChoices(passage: string): string[] {
  const words = passage.match(/[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu) ?? [];
  return [...new Set(words.filter((word) => word.length > 1))];
}

export const DEMO_NOTES: ReadingNote[] = [
  {
    id: 'demo-hugo',
    passage: "La vie est une fleur dont l’amour est le miel.",
    gloss: 'Life is a flower whose honey is love.',
    deletion: 'miel',
    sourceUrl: 'https://fr.wikisource.org/wiki/Les_Chansons_des_rues_et_des_bois',
    sourceTitle: 'Les Chansons des rues et des bois',
    createdAt: '2026-08-24T09:00:00.000Z',
    dueAt: '2026-08-25T09:00:00.000Z',
    intervalDays: 2,
    reviews: 2,
    lastGrade: 3
  },
  {
    id: 'demo-goethe',
    passage: 'Wer immer strebend sich bemüht, den können wir erlösen.',
    gloss: 'Whoever keeps striving can be redeemed.',
    deletion: 'strebend',
    sourceUrl: 'https://www.projekt-gutenberg.org/goethe/faust2/faust2.html',
    sourceTitle: 'Faust, der Tragödie zweiter Teil',
    createdAt: '2026-08-26T15:30:00.000Z',
    dueAt: '2026-08-27T15:30:00.000Z',
    intervalDays: 1,
    reviews: 1,
    lastGrade: 2
  },
  {
    id: 'demo-cervantes',
    passage: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme.',
    gloss: 'In a place in La Mancha, whose name I do not wish to recall.',
    deletion: 'acordarme',
    sourceUrl: 'https://es.wikisource.org/wiki/Don_Quijote_de_la_Mancha',
    sourceTitle: 'Don Quijote de la Mancha, capítulo I',
    createdAt: '2026-08-27T18:15:00.000Z',
    dueAt: '2026-08-28T18:15:00.000Z',
    intervalDays: 0,
    reviews: 0
  }
];
