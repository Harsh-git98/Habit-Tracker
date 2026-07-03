import { useEffect, useMemo, useState } from 'react';

import { loadDiaryEntries, saveDiaryEntries } from './diaryStorage';
import type { DiaryDraft, DiaryEntry } from './diaryTypes';
import { createDiaryDraft, createDiaryId, sortDiaryEntries } from './diaryUtils';

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadDiaryEntries().then((storedEntries) => {
      if (!mounted) {
        return;
      }

      setEntries(storedEntries);
      setIsLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void saveDiaryEntries(entries);
  }, [entries, isLoaded]);

  const sortedEntries = useMemo(() => sortDiaryEntries(entries), [entries]);

  const addEntry = (draft: DiaryDraft) => {
    const now = new Date().toISOString();
    const newEntry: DiaryEntry = {
      id: createDiaryId(),
      ...draft,
      timestamp: draft.timestamp || now,
      createdAt: now,
      updatedAt: now,
    };

    setEntries((currentEntries) => [newEntry, ...currentEntries]);
  };

  const updateEntry = (entryId: string, draft: DiaryDraft) => {
    const updatedAt = new Date().toISOString();

    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              ...draft,
              timestamp: draft.timestamp || entry.timestamp,
              updatedAt,
            }
          : entry,
      ),
    );
  };

  const deleteEntry = (entryId: string) => {
    setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== entryId));
  };

  const resetDraft = () => createDiaryDraft();

  return {
    entries: sortedEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    resetDraft,
    isLoaded,
  };
}