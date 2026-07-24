import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{BrowseAndDrop as c,n as l,t as u}from"./FileUpload.stories-DyUB2sYa.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Opinionated browse-and-drop file-selection pattern with persistent labelling, MIME, extension, count and byte-size constraints, built-in rejection feedback and application-owned selected files and upload transport.`}),`
`,(0,p.jsx)(t.h1,{id:`fileupload`,children:`FileUpload`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FileUpload`}),` combines a focusable drop target and native browse button into one accessible file-selection surface.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FileUpload, type FileRejection } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FileUpload`}),` for the canonical browse-and-drop attachment entry when the application can own selected files and upload processing. Drag and drop is optional convenience; the browse button is the keyboard and touch route.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use compound `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` for a compact chooser, directory or camera capture, native form naming, or required state. Use `,(0,p.jsx)(t.code,{children:`DropZone`}),` and `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` directly when you need custom anatomy, a visible application error, drop read-failure handling, refs or placement classes. Use `,(0,p.jsx)(t.code,{children:`FileAttachment`}),` to present actions for an accepted or uploaded file.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FileUpload, type FileRejection } from '@motech-development/breeze-ui';
import { useState } from 'react';

export function SupportingFiles() {
  const [files, setFiles] = useState<File[]>([]);

  const handleReject = (rejections: FileRejection[]) => {
    reportRejectedFiles(rejections);
  };

  return (
    <FileUpload
      acceptedFileTypes={['application/pdf', 'image/*']}
      allowsMultiple
      browseLabel="Browse files"
      guidance="PDF or image files, up to 10 MB each"
      label="Drop files here"
      maxFileSize={10 * 1024 * 1024}
      onFiles={setFiles}
      onReject={handleReject}
      selectedFiles={files}
    />
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsx)(t.p,{children:`FileUpload is a fixed pattern rather than a public compound namespace.`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Region`}),(0,p.jsx)(t.th,{children:`Responsibility`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Drop surface`}),(0,p.jsx)(t.td,{children:`Focus, drag state, persistent label, optional guidance and dropped-file validation.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Browse action`}),(0,p.jsx)(t.td,{children:`Opens the browser’s native file chooser with the same constraints.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Selection label`}),(0,p.jsxs)(t.td,{children:[`Shows `,(0,p.jsx)(t.code,{children:`label`}),` while empty, then locale-formats `,(0,p.jsx)(t.code,{children:`selectedFiles`}),` names as a list.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Feedback`}),(0,p.jsx)(t.td,{children:`Announces Breeze-owned type, size and count rejections from either selection route.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`The application must feed accepted files back through `,(0,p.jsx)(t.code,{children:`selectedFiles`}),`; FileUpload does not retain them as upload state. Replacing the prop with a new array updates the displayed names. It does not render per-file actions or progress.`]}),`
`,(0,p.jsx)(t.h2,{id:`file-formats-and-callback-semantics`,children:`File formats and callback semantics`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`acceptedFileTypes`}),` accepts exact MIME types such as `,(0,p.jsx)(t.code,{children:`'application/pdf'`}),`, wildcard groups such as `,(0,p.jsx)(t.code,{children:`'image/*'`}),`, and dot-prefixed extensions such as `,(0,p.jsx)(t.code,{children:`'.csv'`}),`. Matching is case-insensitive. `,(0,p.jsx)(t.code,{children:`maxFileSize`}),` is bytes. `,(0,p.jsx)(t.code,{children:`allowsMultiple`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`; files after the first are rejected with `,(0,p.jsx)(t.code,{children:`'file-count'`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`onFiles`}),` receives the accepted native `,(0,p.jsx)(t.code,{children:`File[]`}),` after browse or drop validation, including an empty array when no selected file passes. `,(0,p.jsx)(t.code,{children:`onReject`}),` runs when constraints reject files and receives `,(0,p.jsx)(t.code,{children:`FileRejection[]`}),`. Each record has the native `,(0,p.jsx)(t.code,{children:`file`}),` and every applicable reason:`]}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Reason`}),(0,p.jsx)(t.th,{children:`Meaning`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`'file-count'`})}),(0,p.jsxs)(t.td,{children:[`The file exceeds the single-file count when `,(0,p.jsx)(t.code,{children:`allowsMultiple`}),` is false.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`'file-size'`})}),(0,p.jsxs)(t.td,{children:[(0,p.jsx)(t.code,{children:`file.size`}),` exceeds `,(0,p.jsx)(t.code,{children:`maxFileSize`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`'file-type'`})}),(0,p.jsxs)(t.td,{children:[`MIME type or extension does not match `,(0,p.jsx)(t.code,{children:`acceptedFileTypes`}),`.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Mixed selections deliver accepted files to `,(0,p.jsx)(t.code,{children:`onFiles`}),` and rejected records to `,(0,p.jsx)(t.code,{children:`onReject`}),`. Client constraints are usability guidance, not a security boundary; the application and server must validate again. Upload transport, storage, progress, retry, scanning, persistence and business rules remain application-owned.`]}),`
`,(0,p.jsx)(t.h2,{id:`empty-disabled-invalid-and-error-behaviour`,children:`Empty, disabled, invalid and error behaviour`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`selectedFiles`}),` defaults to `,(0,p.jsx)(t.code,{children:`[]`}),`; the visible `,(0,p.jsx)(t.code,{children:`label`}),` is the empty prompt. There is no separate empty-content slot.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents both drop and browse interaction and visibly reduces emphasis.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`invalid`}),` exposes invalid state on the drop target and hidden file input. The fixed pattern has no application error prop; render associated recovery guidance outside it or compose `,(0,p.jsx)(t.code,{children:`DropZone.Error`}),` directly.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Built-in feedback covers only Breeze count, type and size rejections. FileUpload does not expose `,(0,p.jsx)(t.code,{children:`DropZone`}),`’s native `,(0,p.jsx)(t.code,{children:`onFileReadError`}),`; use the primitives directly when dropped-item read failures must be reported.`]}),`
`,(0,p.jsx)(t.li,{children:`There is no controlled value, read-only state or loading prop. Disable replacement only when necessary and render upload progress separately.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-labelling-and-internationalisation`,children:`Keyboard, labelling and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab can focus the drop surface and then the browse button. Enter or Space on Browse opens the native chooser. The operating system owns interaction inside the chooser and restores focus afterwards.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`label`}),` is persistent and names the drop target; `,(0,p.jsx)(t.code,{children:`browseLabel`}),` names the button. Keep both visible and specific. `,(0,p.jsx)(t.code,{children:`guidance`}),` should state relevant type, size and count constraints.`]}),`
`,(0,p.jsx)(t.li,{children:`Dragging must never be the only selection route. Do not rely on active border colour or file-extension filtering alone.`}),`
`,(0,p.jsxs)(t.li,{children:[`Selected filenames are joined with `,(0,p.jsx)(t.code,{children:`FormattedList`}),` using the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` locale. Filenames and native `,(0,p.jsx)(t.code,{children:`File`}),` values are not translated. Visible copy inherits provider direction and must tolerate expansion.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Built-in rejection feedback currently uses fixed English copy. Compose the lower-level file primitives and provide application-owned `,(0,p.jsx)(t.code,{children:`onReject`}),` feedback when those messages must be localised.`]}),`
`,(0,p.jsx)(t.li,{children:`FileUpload performs no routing and accepts no deep-imported file types.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not expect `,(0,p.jsx)(t.code,{children:`selectedFiles`}),` to upload files, express byte limits as decimal prose without deciding the actual byte value, use client validation as security, translate filenames, or hide rejection feedback. Use `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` and `,(0,p.jsx)(t.code,{children:`DropZone`}),` for lower-level control, `,(0,p.jsx)(t.code,{children:`FileAttachment`}),` for persistent file actions, and `,(0,p.jsx)(t.code,{children:`Alert`}),` or `,(0,p.jsx)(t.code,{children:`ProgressBar`}),` for application upload status.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};