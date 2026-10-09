export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function baseName(name) {
  return name.replace(/\.[^/.]+$/, "");
}

export function outputExt(format) {
  return ({ webp: "webp", jpeg: "jpg", png: "png" })[format] || "webp";
}

export function mimeFor(format) {
  return ({ webp: "image/webp", jpeg: "image/jpeg", png: "image/png" })[format] || "image/webp";
}

export function batchLabel(index) {
  const n = index + 1;
  if (n === 2) return "2nd Batch";
  if (n === 3) return "3rd Batch";
  return `${n}th Batch`;
}

export function plural(count, word = "image") {
  return `${count} ${word}${count !== 1 ? "s" : ""}`;
}

export function savingPercent(item) {
  return Math.max(0, Math.round((1 - item.result.size / item.file.size) * 100));
}
