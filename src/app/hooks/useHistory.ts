import { useState, useRef, useEffect } from 'react';

/**
 * Hook de gestion d'historique pour undo/redo sur un tableau d'états (ex: scènes)
 * @param currentState L'état courant à surveiller (ex: scenes)
 * @param maxHistory Nombre maximum d'états à conserver
 */
export function useHistory<T>(currentState: T, maxHistory: number = 30) {
  const [history, setHistory] = useState<T[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // Ajoute l'état courant à l'historique si ce n'est pas un undo/redo
  useEffect(() => {
    if (!isUndoRedoAction.current && currentState) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(currentState)));
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      } else {
        setHistoryIndex(historyIndex + 1);
      }
      setHistory(newHistory);
    }
    isUndoRedoAction.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState]);

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      setHistoryIndex(historyIndex + 1);
    }
  };

  // L'état courant de l'historique (pour affichage ou restauration)
  const present = history[historyIndex] || currentState;

  return {
    history,
    historyIndex,
    present,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setHistoryIndex,
    setHistory,
  };
}
