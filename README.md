# Pixora

Resize images and convert them to WebP, privately in your browser.
Nothing is uploaded: every image is processed on your device.

## Pages

- `/` — tool selector
- `/resize` — Resize Image
- `/webp` — Image → WebP converter

## Features

### Both tools
- Select or drop multiple images, add more at any time, remove single images
- Resize by percentage, by pixel (with aspect-ratio lock), or not at all
- Required-field validation on every number input
- Results log for every run, with before => after sizes and Preview / Download per file
- Earlier runs stay in the log (2nd Batch, 3rd Batch, …) until Clear All
- Zip of all finished files, or send them through the phone share sheet
- Your work survives switching apps, and is cleared by Clear All or after 30 minutes
- Mobile and desktop layouts, dark theme with indigo accents

### Resize Image
- Output as JPG, WebP or PNG, with quality, DPI and background (transparent, white, black)

### Image → WebP
- Quality slider or lossless WebP

## Screenshots

_Add screenshots here._

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. To make a production build: `npm run build`.

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and publishes the site to
   `https://<your-username>.github.io/<repo-name>/`.

## Source structure

```
src/
├── main.jsx            entry
├── App.jsx             tiny router
├── pages/              Home, ResizePage, WebPPage
├── components/         Header, PageShell, Dropzone, CustomSelect, FileCard, Field,
│                       ResizeFields, ProcessButton, BatchResults, PreviewModal, ...
├── hooks/              useImageItems, useBatchProcessing, useResizeSettings,
│                       useSessionPersistence, useShareFiles, useFilePicker
└── utils/              format, image (canvas processing, ZIP, share), navigate, storage, session
```

## License

MIT
