import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{FromAttachmentRowDocs as c,ImageDocs as l,PdfWorker as u,PdfWorkerDocs as d,n as f,t as p}from"./DocumentViewer.stories-CYJGwpiP.js";function m(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(o,{of:p,summary:`Opens an attached image or document in an accessible full-screen preview.`}),`
`,(0,g.jsx)(t.h1,{id:`documentviewer`,children:`DocumentViewer`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`DocumentViewer`}),` opens an attached image, PDF or other document in a full-screen preview with zoom, rotation and download controls. Use it to let people read an attachment without leaving the record it belongs to.`]}),`
`,(0,g.jsx)(t.h2,{id:`basic-viewer`,children:`Basic viewer`}),`
`,(0,g.jsxs)(t.p,{children:[`The viewer is controlled: pass `,(0,g.jsx)(t.code,{children:`open`}),` and `,(0,g.jsx)(t.code,{children:`onOpenChange`}),`, and render your own trigger, such as the Open button of an `,(0,g.jsx)(t.code,{children:`AttachmentRow`}),`. Set `,(0,g.jsx)(t.code,{children:`src`}),` to the file URL, `,(0,g.jsx)(t.code,{children:`title`}),` to the visible title, and `,(0,g.jsx)(t.code,{children:`mediaType`}),` to `,(0,g.jsx)(t.code,{children:`image`}),`, `,(0,g.jsx)(t.code,{children:`pdf`}),` or `,(0,g.jsx)(t.code,{children:`document`}),`.`]}),`
`,(0,g.jsx)(t.p,{children:`Each example below starts closed; use its Open button to view the attachment.`}),`
`,(0,g.jsx)(a,{of:l}),`
`,(0,g.jsx)(a,{of:d}),`
`,(0,g.jsx)(t.h2,{id:`toolbar`,children:`Toolbar`}),`
`,(0,g.jsx)(t.p,{children:`The toolbar shows the file name, the current zoom percentage and these actions:`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.strong,{children:`Zoom`}),` and `,(0,g.jsx)(t.strong,{children:`Rotate`}),`, for images, PDF pages and embedded documents.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.strong,{children:`Download`}),`, always available. `,(0,g.jsx)(t.code,{children:`downloadName`}),` sets the saved file name.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.strong,{children:`Full screen`}),`, shown only when the browser supports the Fullscreen API.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.strong,{children:`Replace`}),` and `,(0,g.jsx)(t.strong,{children:`Remove`}),`, shown only when you pass `,(0,g.jsx)(t.code,{children:`onReplace`}),` or `,(0,g.jsx)(t.code,{children:`onRemove`}),`. Handle any confirmation in your application.`]}),`
`]}),`
`,(0,g.jsx)(t.p,{children:`Multi-page PDFs add page navigation in a separate row beneath the toolbar. When you zoom a PDF, the current page stays visible and keeps its scroll position until the sharper version replaces it.`}),`
`,(0,g.jsx)(t.p,{children:`Downloads from another origin need the file host to allow CORS from your application, so the file name can be kept. If a download fails, for example because a presigned URL has expired, the viewer shows an error and stays open; it never navigates away to the file URL.`}),`
`,(0,g.jsx)(t.h2,{id:`pdfs`,children:`PDFs`}),`
`,(0,g.jsxs)(t.p,{children:[`Images and other documents need no setup. PDFs are rendered page by page with selectable text using the optional `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` peer dependency. Install a compatible version in your application:`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-sh`,children:`yarn add pdfjs-dist@^6.2.108
`})}),`
`,(0,g.jsx)(t.p,{children:`PDF.js and its worker are loaded only when a PDF is opened, so they add nothing to your initial bundle. Together they are roughly 635 KiB gzipped.`}),`
`,(0,g.jsx)(t.p,{children:`The viewer fetches each PDF in a single request and makes no later byte-range requests, so a presigned URL only needs to be valid when the document is opened.`}),`
`,(0,g.jsx)(t.h3,{id:`worker`,children:`Worker`}),`
`,(0,g.jsxs)(t.p,{children:[`By default, the viewer locates the PDF.js worker with `,(0,g.jsx)(t.code,{children:`new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url)`}),`. Vite resolves this in production builds and emits the worker as an asset. For Vite's development server, exclude Breeze UI from dependency pre-bundling:`]}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-ts`,children:`export default defineConfig({
  optimizeDeps: {
    exclude: ['@motech-development/breeze-ui'],
  },
});
`})}),`
`,(0,g.jsxs)(t.p,{children:[`With another bundler, or if you prefer not to change `,(0,g.jsx)(t.code,{children:`optimizeDeps`}),`, host the worker for your installed `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` version and pass its URL as `,(0,g.jsx)(t.code,{children:`pdfAssets.workerSrc`}),`.`]}),`
`,(0,g.jsx)(t.h3,{id:`fonts-and-character-maps`,children:`Fonts and character maps`}),`
`,(0,g.jsxs)(t.p,{children:[`Some PDFs use predefined Adobe character maps or PDF.js standard fonts. To support them, copy the `,(0,g.jsx)(t.code,{children:`cmaps/`}),` and `,(0,g.jsx)(t.code,{children:`standard_fonts/`}),` directories from your installed `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` version to public asset paths, and pass their URLs through `,(0,g.jsx)(t.code,{children:`pdfAssets`}),`:`]}),`
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
`,(0,g.jsxs)(t.p,{children:[`The files must come from the same `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` version. A trailing slash is added to each URL. Documents that do not use these assets work without them.`]}),`
`,(0,g.jsx)(t.h3,{id:`without-pdfjs`,children:`Without PDF.js`}),`
`,(0,g.jsx)(t.p,{children:`If PDF.js is not installed or cannot render a file, the viewer shows the PDF in the browser's built-in PDF viewer instead. It fetches the file first, so the source must be same-origin or allow CORS. If the fetch fails, the viewer reports that the preview is unavailable and Download remains available.`}),`
`,(0,g.jsxs)(t.p,{children:[`When `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),` is not installed, Vite builds still succeed and use this fallback. Other bundlers may fail the build; install `,(0,g.jsx)(t.code,{children:`pdfjs-dist`}),`, or configure the bundler to ignore the missing optional module.`]}),`
`,(0,g.jsx)(t.h2,{id:`opening-from-an-attachmentrow`,children:`Opening from an AttachmentRow`}),`
`,(0,g.jsxs)(t.p,{children:[`Give the `,(0,g.jsx)(t.code,{children:`AttachmentRow`}),` and the viewer the same unique `,(0,g.jsx)(t.code,{children:`transitionName`}),` to animate between the row and the viewer in both directions. The file is revealed once the opening animation finishes. Closing returns to the row, and any sheet or dialog around it stays open. Browsers without view transition support, and people who prefer reduced motion, see the same flow without animation.`]}),`
`,(0,g.jsx)(a,{of:c}),`
`,(0,g.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`title`}),` names the viewer.`]}),`
`,(0,g.jsx)(t.li,{children:`The viewer is non-modal. The page or sheet beneath it stays open and interactive, and remains available to assistive technology.`}),`
`,(0,g.jsx)(t.li,{children:`While the viewer is open, Tab and Shift+Tab keep focus within its controls, and page scrolling is locked.`}),`
`,(0,g.jsx)(t.li,{children:`Escape and the Close button close the viewer.`}),`
`,(0,g.jsx)(t.li,{children:`Opened from a sheet, the viewer covers the screen while the sheet stays open behind it. Closing the viewer returns focus to the sheet, and closing the sheet also closes the viewer.`}),`
`]}),`
`,(0,g.jsx)(t.p,{children:`Rendered PDF pages are drawn as images, so screen readers cannot read their content. PDF text can be selected, but document tags, reading order and text in scanned images are not available. The viewer shows a notice to this effect and offers the original file for download, so make sure the surrounding record describes the attachment.`}),`
`,(0,g.jsxs)(t.p,{children:[`For `,(0,g.jsx)(t.code,{children:`mediaType="document"`}),`, the browser's own viewer displays the file, and its controls, keyboard support and accessibility vary by browser and file type. These frames are sandboxed, so embedded HTML or SVG cannot run scripts in your application.`]}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsx)(i,{of:u})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;e((()=>{g=t(),s(),r(),f()}))();export{h as default};