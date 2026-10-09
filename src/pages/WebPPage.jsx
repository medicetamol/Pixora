import { useMemo, useRef, useState } from "react";
import { Check, FileImage, Zap } from "lucide-react";
import PageShell from "../components/PageShell";
import PrivacyNote from "../components/PrivacyNote";
import Dropzone from "../components/Dropzone";
import ImagesHeader from "../components/ImagesHeader";
import FileCard from "../components/FileCard";
import PreviewModal from "../components/PreviewModal";
import ProcessButton from "../components/ProcessButton";
import ResizeFields, { RESIZE_LAST_OPTIONS } from "../components/ResizeFields";
import { AddMoreButton } from "../components/AddMore";
import { BatchLog, ClearAllButton, DownloadActions, SuccessCaption } from "../components/BatchResults";
import { useImageItems } from "../hooks/useImageItems";
import { useFilePicker } from "../hooks/useFilePicker";
import { useBatchProcessing } from "../hooks/useBatchProcessing";
import { useResizeSettings } from "../hooks/useResizeSettings";
import { useSessionPersistence } from "../hooks/useSessionPersistence";
import { useShareFiles } from "../hooks/useShareFiles";
import { plural } from "../utils/format";
import { downloadZip, processItem } from "../utils/image";
import { scrollToRef } from "../utils/navigate";

export default function WebPPage() {
  const [quality, setQuality] = useState(82);
  const [lossless, setLossless] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const settingsRef = useRef(null);
  const logRef = useRef(null);

  const { share, shareDisabled } = useShareFiles();
  const batch = useBatchProcessing();
  const { markDirty } = batch;

  const { items, setItems, addFiles, removeItem, clearItems, savableItems, restoreItems } = useImageItems({
    onAdded: () => { markDirty(); scrollToRef(settingsRef); },
    onRemoved: markDirty
  });
  const { picker, openPicker } = useFilePicker(addFiles);

  const resize = useResizeSettings({
    initialMode: "none",
    percentMax: 1000,
    syncDimsOnModeChange: true,
    firstItem: items[0],
    onChange: markDirty
  });

  const convertAll = async () => {
    if (resize.isInvalid) return;
    await batch.run(items, setItems, item =>
      processItem(item, { ...resize.getDims(item), format: "webp", quality: lossless ? 1 : quality / 100 }));
    scrollToRef(logRef); // show the newest batch in the log
  };

  // Keep the work when the browser drops the tab (e.g. while you check another app).
  const media = useMemo(() => ({ items: savableItems, batches: batch.batches }), [savableItems, batch.batches]);
  const meta = useMemo(
    () => ({ done: batch.done, settings: { resize: resize.values, quality, lossless } }),
    [batch.done, resize.values, quality, lossless]
  );
  const { ready, clearSaved } = useSessionPersistence("webp", media, meta, (savedMedia, savedMeta) => {
    restoreItems(savedMedia.items);
    batch.restore(savedMedia.batches ?? [], savedMeta.done ?? false);
    const st = savedMeta.settings;
    if (st) {
      resize.restore(st.resize);
      setQuality(st.quality); setLossless(st.lossless);
    }
  });

  const clearAll = () => { clearItems(); batch.reset(); clearSaved(); };

  const readyCount = items.filter(x => x.result).length;
  const hasResults = readyCount > 0;

  return <PageShell title="Image → WebP" subtitle="Convert JPG, PNG, JPEG and other images to WebP with no upload.">
    {!ready ? null : items.length === 0 ? <Dropzone onFiles={addFiles}/> : <>
      <ImagesHeader subtitle={`${plural(items.length)} ready`} onClear={clearAll}>{picker}</ImagesHeader>

      <div className="file-list">
        {items.map(item => <FileCard key={item.id} className="webp-file-card" item={item}
          onRemove={removeItem} onPreview={setPreviewItem}/>)}
      </div>

      <AddMoreButton onClick={openPicker}/>

      <section className="settings-card webp-settings" ref={settingsRef}>
        <div className="setting-head">
          <div><h3>Conversion settings</h3><p>Choose how your images should be converted.</p></div>
          <Zap size={22}/>
        </div>

        <ResizeFields {...resize} options={RESIZE_LAST_OPTIONS}/>

        <label className="range-label">Quality <strong>{lossless ? "Lossless" : `${quality}%`}</strong></label>
        <input className="range" type="range" min="10" max="100" value={quality} disabled={lossless}
          onChange={e => { setQuality(Number(e.target.value)); markDirty(); }}/>
        <div className="range-scale"><span>10%</span><span>50%</span><span>80%</span><span>100%</span></div>

        <button className={`lossless ${lossless ? "selected" : ""}`} onClick={() => { setLossless(v => !v); markDirty(); }}>
          <span><FileImage size={22}/><span><b>Lossless WebP</b><small>Preserves maximum image quality</small></span></span>
          {lossless ? <Check/> : <span className="radio"/>}
        </button>
      </section>

      <div className="webp-actions">
        <ProcessButton
          className="convert-status" doneClassName="converted"
          busy={batch.busy} done={batch.done} disabled={batch.busy || batch.done || resize.isInvalid}
          onClick={convertAll}
          idleIcon={<Zap size={18}/>} idleLabel={`Convert ${items.length} to WebP`}
          busyLabel="Converting…" doneLabel="Converted" spinnerSize={18}/>

        {batch.done && <SuccessCaption>{plural(items.length)} converted to WebP</SuccessCaption>}
        <BatchLog batches={batch.batches} onPreview={setPreviewItem} lastBatchRef={logRef}/>
        {hasResults && <DownloadActions count={readyCount} disabled={batch.busy}
          onZip={() => downloadZip(items, "webp-images.zip")}
          onShare={() => share(items)} shareDisabled={shareDisabled}/>}
        <ClearAllButton onClick={clearAll}/>
      </div>
    </>}
    <PrivacyNote/>
    <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)}/>
  </PageShell>;
}
