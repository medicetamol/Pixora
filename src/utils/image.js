import JSZip from "jszip";
import { baseName, mimeFor, outputExt, uid } from "./format";

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image")); };
    img.src = url;
  });
}

function canvasBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Conversion failed")), mime, quality);
  });
}

/** Draw the file onto a canvas at the given size and encode it. */
export async function processImage(file, { width, height, format = "webp", quality = 0.85, background = "transparent" }) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d", { alpha: true });
  if (background !== "transparent") {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await canvasBlob(canvas, mimeFor(format), quality);
  return { blob, width: canvas.width, height: canvas.height };
}

/** Process one item and attach a `result` to it. */
export async function processItem(item, options) {
  const r = await processImage(item.file, options);
  return {
    ...item,
    result: {
      blob: r.blob,
      size: r.blob.size,
      name: `${baseName(item.file.name)}.${outputExt(options.format)}`,
      width: r.width,
      height: r.height
    }
  };
}

/** Read an image file into an item with preview URL and natural size (null if unreadable). */
export function readImageFile(file) {
  return new Promise(resolve => {
    const id = uid();
    const preview = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ id, file, preview, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = preview;
  });
}

/** Target size of an item for the current resize settings. */
export function getTargetDims(item, { mode, percent, width, height, lock }) {
  if (mode === "percent") {
    const pct = Math.max(1, Number(percent) || 1);
    return {
      width: Math.max(1, Math.round(item.width * pct / 100)),
      height: Math.max(1, Math.round(item.height * pct / 100))
    };
  }
  if (mode === "pixel") {
    if (lock) {
      return {
        width: width || item.width,
        height: Math.max(1, Math.round((width || item.width) * item.height / item.width))
      };
    }
    return { width: width || item.width, height: height || item.height };
  }
  return { width: item.width, height: item.height };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.rel = "noopener"; a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // keep the link alive long enough for slow phones to start the download
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export async function downloadZip(items, filename) {
  const zip = new JSZip();
  items.forEach(item => { if (item.result) zip.file(item.result.name, item.result.blob); });
  downloadBlob(await zip.generateAsync({ type: "blob", mimeType: "application/zip" }), filename);
}

/** True when this browser can share image files (phone/tablet share sheet). */
export function canShareFiles() {
  try {
    const probe = new File([""], "probe.png", { type: "image/png" });
    return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [probe] }));
  } catch {
    return false;
  }
}

/**
 * Open the share sheet with every finished file (Save to Files / Photos ...).
 * Resolves "shared", "cancelled" (user closed the sheet) or "failed".
 */
export async function shareItems(items) {
  const ready = items.filter(i => i.result);
  if (!ready.length) return "cancelled";
  const files = ready.map(i => new File([i.result.blob], i.result.name, { type: i.result.blob.type }));
  try {
    if (!navigator.canShare?.({ files })) return "failed";
    await navigator.share({ files });
    return "shared";
  } catch (err) {
    return err?.name === "AbortError" ? "cancelled" : "failed";
  }
}
