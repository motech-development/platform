# ADR 0004: Keep PDF.js an optional, lazy renderer

- Status: accepted
- Date: 2026-09-30
- Deciders: Breeze UI maintainers

## Context

Breeze UI needs to preview multi-page PDF attachments while keeping images and
other document previews independent of a PDF engine. PDF.js is a substantial
browser dependency and its security updates must remain explicit. Canvas
rendering also cannot guarantee that PDF meaning, reading order, tags, or OCR
are available to assistive technology.

## Decision

`pdfjs-dist` is an optional peer dependency with the supported range
`^6.2.108`; Breeze UI development pins the latest compatible release. The
minimum version is above the affected releases in
[GHSA-hq66-cqwq-w95j](https://github.com/mozilla/pdf.js/security/advisories/GHSA-hq66-cqwq-w95j).

The viewer dynamically imports PDF.js and its matching worker only when an
open PDF needs rendering. It paints pages on demand to canvas and a selectable
text layer. Images never import the engine. Other browser-renderable documents,
and PDFs when the optional peer or renderer is unavailable, use a native
iframe. Zoom, rotation, download, and page navigation are owned by Breeze;
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
