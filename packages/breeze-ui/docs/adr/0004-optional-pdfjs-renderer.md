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
Using `pdfjs-dist` directly as the optional peer instead of routing through a
wrapper such as `react-pdf` keeps the engine range and security updates under
consumer control: each application can independently resolve and update a
compatible engine version within the declared range.

The viewer dynamically imports PDF.js and its matching worker only when an
open PDF needs rendering. It paints pages on demand to canvas and a selectable
text layer. Images render in `<img>` and never import the engine. Other
browser-renderable documents, and PDFs that PDF.js fails to load or render,
use an `<iframe>` fallback. Whether an _absent_ peer reaches that fallback is
decided by the consuming application's bundler, not by Breeze UI: Vite replaces
an unresolved optional import with a module that throws when loaded, so the
fallback applies, but other bundlers may fail the application build instead. The native browser PDF viewer is not
the normal renderer: `#toolbar=0` is ignored by Firefox and macOS WebKit, so
browser chrome, including annotation controls, can compete with Breeze's
viewer. Zoom, rotation, download, and page navigation are owned by Breeze;
replacement and removal remain app callbacks.

The surrounding application record supplies the attachment's meaning. The
viewer explains that a rendered document may expose no content to assistive
technology and keeps a download of the original available. Native iframe
controls and accessibility remain browser-owned.

## Consequences

- Consumers that render PDFs with canvas install `pdfjs-dist` explicitly.
  Consumers that only show images or iframe content do not need it under Vite;
  with other bundlers they may need to install it anyway, or mark it as an
  ignored optional module, to keep the build passing.
- The worker is referenced as `new URL('pdfjs-dist/build/pdf.worker.mjs',
import.meta.url)`, which the consuming application's Vite or webpack 5 build
  resolves and emits. Breeze UI's own library build would otherwise inline the
  1.27 MB worker as base64, so a library-only build plugin leaves the reference
  for the consumer, and the build fails if the published form changes. Resolution
  in a consumer's Vite development server and in webpack has not been verified
  against a real consumer build.
- PDF.js and its worker are fetched only after an open PDF is requested.
- Applications must keep the installed PDF.js version within the declared
  peer range and update it for security fixes.
- Canvas rendering cannot create missing semantic tags, reading order, or OCR.
- Browser iframe behavior differs by format and browser.
