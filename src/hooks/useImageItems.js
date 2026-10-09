import { useMemo, useState } from "react";
import { readImageFile } from "../utils/image";

/**
 * The list of selected images shared by both tools.
 * `onAdded` fires after new images are loaded, `onRemoved` after one is removed.
 */
export function useImageItems({ onAdded, onRemoved } = {}) {
  const [items, setItems] = useState([]);

  const addFiles = files => {
    const valid = files.filter(file => file.type.startsWith("image/"));
    if (!valid.length) return;
    Promise.all(valid.map(readImageFile)).then(results => {
      const added = results.filter(Boolean);
      if (!added.length) return;
      setItems(prev => [...prev, ...added]);
      onAdded?.();
    });
  };

  const removeItem = id => {
    setItems(prev => prev.filter(x => x.id !== id));
    onRemoved?.();
  };

  const clearItems = () => {
    items.forEach(i => URL.revokeObjectURL(i.preview));
    setItems([]);
  };

  // Preview URLs are temporary, so they are left out of what gets saved and rebuilt on restore.
  const savableItems = useMemo(() => items.map(({ preview, ...rest }) => rest), [items]);
  const restoreItems = saved =>
    setItems(saved.map(s => ({ ...s, preview: URL.createObjectURL(s.file) })));

  return { items, setItems, addFiles, removeItem, clearItems, savableItems, restoreItems };
}
