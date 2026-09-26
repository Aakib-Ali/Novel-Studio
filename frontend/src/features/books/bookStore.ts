import { useSyncExternalStore } from "react";
import { addNotification } from "../notifications/notificationStore";

export type BookStatus =
  | "draft"
  | "processing"
  | "translating"
  | "review"
  | "approved"
  | "audio-ready"
  | "failed";

export interface Book {
  id: string;
  title: string;
  author: string;
  chapters: number;
  words: number;
  progress: number;
  status: BookStatus;
  updatedAt: string;
  chapterItems?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  fileName: string;
  originalText: string;
  words: number;
  createdAt: string;
  translatedText?: string;
  translationStatus?: "draft" | "approved";
}

const storageKey = "novel-studio-books-demo-v1";
const sampleDate = "2026-09-01T00:00:00.000Z";

const sampleBooks: Book[] = [
  {
    id: "demo-1",
    title: "The Silent House",
    author: "Aakib Ali",
    chapters: 24,
    words: 68420,
    progress: 76,
    status: "translating",
    updatedAt: sampleDate,
  },
  {
    id: "demo-2",
    title: "Echoes of Rain",
    author: "Aakib Ali",
    chapters: 18,
    words: 42180,
    progress: 100,
    status: "approved",
    updatedAt: sampleDate,
  },
  {
    id: "demo-3",
    title: "The Last Lantern",
    author: "Aakib Ali",
    chapters: 31,
    words: 91240,
    progress: 100,
    status: "audio-ready",
    updatedAt: sampleDate,
  },
  {
    id: "demo-4",
    title: "Letters from Winter",
    author: "Aakib Ali",
    chapters: 12,
    words: 42600,
    progress: 0,
    status: "draft",
    updatedAt: sampleDate,
  },
  {
    id: "demo-5",
    title: "A City Without Sleep",
    author: "Aakib Ali",
    chapters: 27,
    words: 91700,
    progress: 48,
    status: "processing",
    updatedAt: sampleDate,
  },
  {
    id: "demo-6",
    title: "Where the Stars Fell",
    author: "Aakib Ali",
    chapters: 20,
    words: 73100,
    progress: 100,
    status: "review",
    updatedAt: sampleDate,
  },
];

function loadBooks(): Book[] {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return sampleBooks;

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return sampleBooks;

    return parsed.filter(
      (item): item is Book =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.author === "string" &&
        typeof item.chapters === "number" &&
        typeof item.words === "number" &&
        typeof item.progress === "number" &&
        typeof item.status === "string" &&
        typeof item.updatedAt === "string",
    );
  } catch {
    return sampleBooks;
  }
}

let books = loadBooks();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return books;
}

function save(next: Book[], requirePersistence = false) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    if (requirePersistence) {
      throw new Error(
        "Browser storage is full. Remove some chapters or use a smaller file.",
      );
    }
  }

  books = next;
  listeners.forEach((listener) => listener());
}

export function useBooks() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
}

export function createBook(title: string, author: string) {
  const cleanTitle = title.trim();
  const cleanAuthor = author.trim();

  if (!cleanTitle || !cleanAuthor) {
    throw new Error("Title and author are required.");
  }

  const book: Book = {
    id: crypto.randomUUID(),
    title: cleanTitle,
    author: cleanAuthor,
    chapters: 0,
    words: 0,
    progress: 0,
    status: "draft",
    updatedAt: new Date().toISOString(),
    chapterItems: [],
  };

  save([book, ...books]);
  return book;
}

export function updateBook(
  id: string,
  title: string,
  author: string,
) {
  const cleanTitle = title.trim();
  const cleanAuthor = author.trim();

  if (!cleanTitle || !cleanAuthor) {
    throw new Error("Title and author are required.");
  }

  const previous = books.find((book) => book.id === id);
  if (!previous) return null;

  const updated: Book = {
    ...previous,
    title: cleanTitle,
    author: cleanAuthor,
    updatedAt: new Date().toISOString(),
  };

  save([updated, ...books.filter((book) => book.id !== id)]);
  return updated;
}

export function deleteBook(id: string) {
  if (!books.some((book) => book.id === id)) {
    return false;
  }

  save(books.filter((book) => book.id !== id));
  return true;
}

export function addChapter(
  bookId: string,
  fileName: string,
  originalText: string,
) {
  const book = books.find((item) => item.id === bookId);
  if (!book) throw new Error("Book not found.");

  const title = fileName.replace(/\.(txt|md)$/i, "").trim();
  if (!title) {
    throw new Error("The file needs a chapter title.");
  }
  if (!originalText.trim()) {
    throw new Error("The file is empty.");
  }

  const existing = book.chapterItems ?? [];

  if (
    existing.some(
      (item) =>
        item.title.toLocaleLowerCase() ===
        title.toLocaleLowerCase(),
    )
  ) {
    throw new Error(
      "A chapter with this title already exists.",
    );
  }

  const words =
    originalText.trim().match(/\S+/gu)?.length ?? 0;

  const chapter: Chapter = {
    id: crypto.randomUUID(),
    title,
    fileName,
    originalText,
    words,
    createdAt: new Date().toISOString(),
  };

  const updated: Book = {
    ...book,
    chapters: book.chapters + 1,
    words: book.words + words,
    chapterItems: [...existing, chapter],
    updatedAt: new Date().toISOString(),
  };

  save(
    [updated, ...books.filter((item) => item.id !== bookId)],
    true,
  );

  addNotification({
    type: "chapter",
    title: "Chapter uploaded",
    description: `${title} · ${book.title}`,
    href: `/books/${bookId}/chapters/${chapter.id}`,
  });

  return chapter;
}

export function updateChapterTranslation(
  bookId: string,
  chapterId: string,
  translatedText: string,
) {
  const book = books.find((item) => item.id === bookId);
  const chapter = book?.chapterItems?.find(
    (item) => item.id === chapterId,
  );

  if (!book || !chapter) {
    throw new Error("Chapter not found.");
  }

  const updated: Book = {
    ...book,
    updatedAt: new Date().toISOString(),
    chapterItems: book.chapterItems!.map((item) =>
      item.id === chapterId
        ? {
            ...item,
            translatedText,
            translationStatus: "draft",
          }
        : item,
    ),
  };

  save(
    books.map((item) =>
      item.id === bookId ? updated : item,
    ),
    true,
  );
}

export function approveChapterTranslation(
  bookId: string,
  chapterId: string,
) {
  const book = books.find((item) => item.id === bookId);
  const chapter = book?.chapterItems?.find(
    (item) => item.id === chapterId,
  );

  if (!book || !chapter) {
    throw new Error("Chapter not found.");
  }

  if (!chapter.translatedText?.trim()) {
    throw new Error(
      "Add translated text before approving.",
    );
  }

  if (chapter.translationStatus === "approved") return;

  const updated: Book = {
    ...book,
    updatedAt: new Date().toISOString(),
    chapterItems: book.chapterItems!.map((item) =>
      item.id === chapterId
        ? { ...item, translationStatus: "approved" }
        : item,
    ),
  };

  save(
    books.map((item) =>
      item.id === bookId ? updated : item,
    ),
    true,
  );

  addNotification({
    type: "translation",
    title: "Translation approved",
    description: `${chapter.title} · ${book.title}`,
    href: `/books/${bookId}/chapters/${chapterId}`,
  });
}

export function formatWords(count: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
}