# ADR 0004: Keep PDF.js an optional, lazy renderer

- Status: accepted
- Date: 2026-09-30
- Deciders: Breeze UI maintainers

## Context

Breeze UI needs to preview multi-page PDF attachments while keeping images and
other document previews independent of a PDF engine. PDF.js is the only v4
dependency adopted without prototype evidence; it is substantial, so its
installation and loading remain optional and its security updates explicit.
Canvas rendering also cannot guarantee that PDF meaning, reading order, tags,
or OCR are available to assistive technology.

## Decision

`pdfjs-dist` is a direct optional peer dependency with supported range
`^6.2.108` (development currently pins `6.3.289`). This excludes affected
versions `>=5.6.83 <6.2.108` in
[GHSA-hq66-cqwq-w95j](https://github.com/mozilla/pdf.js/security/advisories/GHSA-hq66-cqwq-w95j).
The viewer uses PDF.js directly because `react-pdf` hard-pins its PDF.js
dependency and cannot satisfy this security floor.

The viewer dynamically imports PDF.js and its matching worker only when an
open PDF needs rendering. It paints pages on demand to canvas and a selectable
text layer. Images render in `<img>` and never import the engine. Other
browser-renderable documents, and PDFs when the optional peer or renderer is
unavailable, use an `<iframe>` fallback. The native browser PDF viewer is not
the normal renderer: `#toolbar=0` is ignored by Firefox and macOS WebKit, so
browser chrome, including annotation controls, can compete with Breeze's
viewer. Zoom, rotation, download, and page navigation are owned by Breeze;
replacement and removal remain app callbacks.

The surrounding application record supplies the attachment's meaning. The
viewer explains that a rendered document may expose no content to assistive
technology and keeps a download of the original available. Native iframe
controls and accessibility remain browser-owned.

## Consequences

- Consumers that render PDFs with canvas install `pdfjs-dist` explicitly;
  consumers that only show images or iframe content do not need it.
- PDF.js and its worker are fetched only after an open PDF is requested.
- Applications must keep the installed PDF.js version within the declared
  peer range and update it for security fixes.
- Canvas rendering cannot create missing semantic tags, reading order, or OCR.
- Browser iframe behavior differs by format and browser.
