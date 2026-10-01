import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-zJh2FNJ3.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{FromAttachmentRowDocs as c,ImageDocs as l,PdfWorker as u,PdfWorkerDocs as d,n as f,t as p}from"./DocumentViewer.stories-DTqVWqZe.js";function m(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(o,{of:p,summary:`Opens an attached image or document in an accessible full-screen preview.`}),`
`,(0,g.jsx)(t.h1,{id:`documentviewer`,children:`DocumentViewer`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`DocumentViewer`}),` presents one attachment in a modal reading surface with
zoom, rotation, download, and optional app-owned Replace and Remove actions.
The toolbar displays the current zoom percentage beside the zoom controls.
Use it with `,(0,g.jsx)(t.code,{children:`AttachmentRow`}),` by passing the same unique `,(0,g.jsx)(t.code,{children:`transitionName`}),` to both
components. The viewer owns its dialog and toolbar; the surrounding record owns
attachment meaning, storage, replacement, and removal.
The viewer is controlled: pass both `,(0,g.jsx)(t.code,{children:`open`}),` and `,(0,g.jsx)(t.code,{children:`onOpenChange`}),`, and let the
owning screen provide the trigger and state.`]}),`
`,(0,g.jsx)(t.h2,{id:`images-and-pdfs`,children:`Images and PDFs`}),`
`,(0,g.jsxs)(t.p,{children:[`Images render directly and do not load the PDF engine. PDFs use the optional
`,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` peer dependency to paint each page to a canvas and provide a
selectable text layer. PDF.js and its worker load only after an open PDF is
requested. Install a compatible `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` version (`,(0,g.jsx)(t.code,{children:`^6.2.108`}),`) in the
application to enable this renderer. If the peer is absent or PDF.js cannot
render a file, the viewer falls back to the browser's PDF frame.`]}),`
`,(0,g.jsxs)(t.p,{children:[`PDFs that use predefined Adobe character maps or PDF.js standard font files
also need those matching directories served by the application. Copy the
`,(0,g.jsx)(t.code,{children:`cmaps/`}),` and `,(0,g.jsx)(t.code,{children:`standard_fonts/`}),` directories from the installed `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),`
version to public asset paths, then pass their directory URLs to the PDF
viewer:`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`<DocumentViewer
  mediaType="pdf"
  onOpenChange={setOpen}
  open={open}
  pdfAssets={{
    cMapUrl: '/pdfjs/cmaps',
    standardFontDataUrl: '/pdfjs/standard_fonts',
  }}
  src={source}
  title="Quarterly report"
/>
`})}),`
`,(0,g.jsxs)(t.p,{children:[`These URLs must serve the matching files from the same `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` version.
The viewer adds a trailing slash to each directory URL. The auxiliary assets
are optional when a document does not reference them.
When the application uses a bundler that cannot resolve PDF.js's worker URL
import, provide `,(0,g.jsx)(t.code,{children:`pdfAssets.workerSrc`}),` with the URL emitted or copied for the
installed `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` version. Vite users can omit it and use the default.`]}),`
`,(0,g.jsx)(t.p,{children:`When PDF.js is unavailable or cannot render a file, the viewer fetches the PDF
and passes its bytes to the browser's native PDF viewer as a PDF-typed Blob.
The source must be readable by the application: same-origin files work directly,
and cross-origin hosts must allow CORS. If the fetch fails, the preview reports
that it is unavailable and the Download action remains available.`}),`
`,(0,g.jsx)(t.p,{children:`The reader supports page navigation for multi-page PDFs. Zoom and rotation
apply to images, rendered PDF pages, and browser-owned frames.
Each preview starts closed inside its own frame; use its Open button to view the
attachment. The PDF example loads PDF.js only after you open it.`}),`
`,(0,g.jsx)(a,{of:l}),`
`,(0,g.jsx)(a,{of:d}),`
`,(0,g.jsx)(t.p,{children:`The compact toolbar keeps the filename and document actions in one raised strip.
For multi-page PDFs, page navigation sits in a separate neutral row beneath it.`}),`
`,(0,g.jsx)(t.h2,{id:`attachmentrow-transition`,children:`AttachmentRow transition`}),`
`,(0,g.jsxs)(t.p,{children:[`Give the row and viewer the same stable `,(0,g.jsx)(t.code,{children:`transitionName`}),` to morph between the
attachment row and the reader in both directions. Close and Escape return to the
row while preserving the surrounding overlay. The loaded image or PDF remains
covered until the opening morph finishes, then its rendered content is revealed.
Unsupported View Transition APIs and reduced-motion preferences use the same
flow without animation.`]}),`
`,(0,g.jsx)(a,{of:c}),`
`,(0,g.jsx)(t.h2,{id:`accessibility-and-fallback-limits`,children:`Accessibility and fallback limits`}),`
`,(0,g.jsx)(t.p,{children:`Rendered PDF canvases do not expose their page content to assistive technology.
PDF text is selectable visually, but document tags, reading order, and scanned
image OCR are not interpreted. The notice in the viewer therefore states that
the attachment's meaning comes from its surrounding record and offers the
original download.`}),`
`,(0,g.jsxs)(t.p,{children:[`The fallback iframe is browser-owned. Its controls, keyboard behavior, and
accessibility vary by browser and document type; Breeze cannot inspect or
improve the embedded viewer's content. Use `,(0,g.jsx)(t.code,{children:`mediaType="document"`}),` for other
browser-renderable formats when embedding is appropriate. These document frames
are sandboxed so embedded HTML or SVG cannot run scripts in the application.`]}),`
`,(0,g.jsx)(t.h2,{id:`bundle-measurement`,children:`Bundle measurement`}),`
`,(0,g.jsxs)(t.p,{children:[`With Breeze UI's development pin `,(0,g.jsx)(t.code,{children:`pdfjs-dist@6.3.289`}),`, the measurements on
2026-09-30 show the package and PDF.js engine as separate gzip payloads. The
PDF.js figure sums the independently compressed main-thread and worker files.`]}),`
`,(0,g.jsxs)(t.table,{children:[(0,g.jsx)(t.thead,{children:(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.th,{children:`Payload`}),(0,g.jsx)(t.th,{style:{textAlign:`right`},children:`Gzip size`})]})}),(0,g.jsxs)(t.tbody,{children:[(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:`Breeze UI library JavaScript (package output; external dependencies excluded)`}),(0,g.jsx)(t.td,{style:{textAlign:`right`},children:`39.05 KiB`})]}),(0,g.jsxs)(t.tr,{children:[(0,g.jsx)(t.td,{children:`PDF.js engine JavaScript (main + worker, independently compressed)`}),(0,g.jsx)(t.td,{style:{textAlign:`right`},children:`634.60 KiB`})]})]})]}),`
`,(0,g.jsx)(t.h2,{id:`actions`,children:`Actions`}),`
`,(0,g.jsx)(t.p,{children:`The Download link is always available. Cross-origin sources are fetched as a
blob so the requested filename is preserved; the file host must allow CORS from
the application. If that request is blocked, the browser navigates to the
original source in the current tab. Replace and Remove buttons appear only when
their corresponding callbacks are provided, leaving mutation and confirmation
flows in the application. Full screen appears only when the browser reports
support for the native Fullscreen API.`}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsx)(i,{of:u})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;e((()=>{g=t(),s(),r(),f()}))();export{h as default};