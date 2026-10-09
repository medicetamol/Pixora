import { useState } from "react";
import { uid } from "../utils/format";

/**
 * Run/busy/done state and the per-run log (batches) shared by both tools.
 * Each log entry keeps its own result (blob), so Preview/Download keep working for older batches.
 * `done` turns false as soon as anything changes (markDirty) so the button re-enables.
 */
export function useBatchProcessing() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [batches, setBatches] = useState([]);

  const markDirty = () => setDone(false);

  const run = async (items, setItems, processOne) => {
    setBusy(true);
    setDone(false);
    try {
      const updated = [];
      for (const item of items) updated.push(await processOne(item));
      setItems(updated);
      setBatches(prev => [
        ...prev,
        updated.map(item => ({
          id: uid(),
          name: item.file.name,
          before: item.file.size,
          after: item.result.size,
          result: item.result
        }))
      ]);
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setDone(false); setBatches([]); };
  const restore = (savedBatches, savedDone) => { setBatches(savedBatches); setDone(savedDone); };

  return { busy, done, batches, markDirty, run, reset, restore };
}
