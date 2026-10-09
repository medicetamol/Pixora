import { useMemo, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import PageShell from "../components/PageShell";
import PrivacyNote from "../components/PrivacyNote";
import Dropzone from "../components/Dropzone";
import Field from "../components/Field";
import ImagesHeader from "../components/ImagesHeader";
import FileCard from "../components/FileCard";
import PreviewModal from "../components/PreviewModal";
import ProcessButton from "../components/ProcessButton";
import ResizeFields, { RESIZE_FIRST_OPTIONS } from "../components/ResizeFields";
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

export default function ResizePage() {
  const [dpi, setDpi] = useState(72);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(85);
  const [background, setBackground] = useState("transparent");
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
    initialMode: "percent",
    percentMax: 100,
    clampPercent: true,
    syncDimsOnModeChange: true,
    firstItem: items[0],
    onChange: markDirty
  });

  const changed = setter => value => { setter(value); markDirty(); };

  const invalid = resize.isInvalid || !dpi || !quality;

  const resizeAll = async () => {
    if (!items.length || invalid) return;
    await batch.run(items, setItems, item =>
      processItem(item, { ...resize.getDims(item), format, quality: quality / 100, background }));
    scrollToRef(logRef); // show the newest batch in the log
  };

  // Keep the work when the browser drops the tab (e.g. while you check another app).
  const media = useMemo(() => ({ items: savableItems, batches: batch.batches }), [savableItems, batch.batches]);
  const meta = useMemo(
    () => ({ done: batch.done, settings: { resize: resize.values, dpi, format, quality, background } }),
    [batch.done, resize.values, dpi, format, quality, background]
  );
  const { ready, clearSaved } = useSessionPersistence("resize", media, meta, (savedMedia, savedMeta) => {
    restoreItems(savedMedia.items);
    batch.restore(savedMedia.batches ?? [], savedMeta.done ?? false);
    const st = savedMeta.settings;
    if (st) {
      resize.restore(st.resize);
      setDpi(st.dpi); setFormat(st.format); setQuality(st.quality); setBackground(st.background);
    }
  });

  const clearAll = () => { clearItems(); batch.reset(); clearSaved(); };

  const readyCount = items.filter(x => x.result).length;
  const hasResults = readyCount > 0;

  return <PageShell title="Resize Image" subtitle="Change image dimensions, format and quality — privately in your browser.">
    {!ready ? null : items.length === 0 ? <Dropzone onFiles={addFiles}/> : <>
      <ImagesHeader subtitle={`${plural(items.length)} added`} onClear={clearAll}>{picker}</ImagesHeader>

      <div className="file-list">
        {items.map(item => <FileCard key={item.id} className="resize-file-card" item={item}
          onRemove={removeItem} onPreview={setPreviewItem}/>)}
      </div>

      <AddMoreButton onClick={openPicker}/>

      <section className="editor-card resize-settings-card" ref={settingsRef}>
        <div className="editor-title">
          <div><h2>Resize Settings</h2><p>Applied to all {plural(items.length)}</p></div>
        </div>

        <ResizeFields {...resize} options={RESIZE_FIRST_OPTIONS}/>

        <Field label="Resolution (DPI)" invalid={!dpi}>
          <input type="number" min="1" value={dpi} placeholder="Required"
            onChange={e => changed(setDpi)(e.target.value === "" ? "" : Number(e.target.value))}/>
        </Field>

        <div className="two-col">
          <label className="field">Format
            <select value={format} onChange={e => changed(setFormat)(e.target.value)}>
              <option value="jpeg">JPG</option><option value="webp">WebP</option><option value="png">PNG</option>
            </select>
          </label>
          <Field label="Quality" invalid={!quality}>
            <input type="number" min="1" max="100" value={quality} placeholder="Required"
              onChange={e => changed(setQuality)(e.target.value === "" ? "" : Number(e.target.value))}/>
          </Field>
        </div>

        <label className="field">Background</label>
        <div className="backgrounds">
          <button className={background === "transparent" ? "swatch selected" : "swatch"} onClick={() => changed(setBackground)("transparent")}>
            <span className="checker"/> Transparent
          </button>
          <button className={background === "#ffffff" ? "swatch selected" : "swatch"} onClick={() => changed(setBackground)("#ffffff")}>
            <span className="solid white"/> White
          </button>
          <button className={background === "#000000" ? "swatch selected" : "swatch"} onClick={() => changed(setBackground)("#000000")}>
            <span className="solid black"/> Black
          </button>
        </div>
      </section>

      <div className="resize-submit-area">
        <ProcessButton
          className="primary wide resize-submit" doneClassName="resize-complete"
          busy={batch.busy} done={batch.done}
          disabled={batch.busy || batch.done || invalid}
          onClick={resizeAll}
          idleIcon={<Maximize2 size={18}/>} idleLabel={`Resize ${plural(items.length)}`}
          busyLabel="Resizing…" doneLabel="Resized"/>

        {batch.done && <SuccessCaption className="resize-success">{plural(items.length)} resized</SuccessCaption>}
        <BatchLog batches={batch.batches} onPreview={setPreviewItem} lastBatchRef={logRef} className="resize-summary"/>
      </div>

      {hasResults && <div className="resize-result-actions">
        <DownloadActions count={readyCount} disabled={batch.busy}
          onZip={() => downloadZip(items, "resized-images.zip")}
          onShare={() => share(items)} shareDisabled={shareDisabled}/>
        <ClearAllButton onClick={clearAll}/>
      </div>}
    </>}

    <PrivacyNote/>
    <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)}/>
  </PageShell>;
}
