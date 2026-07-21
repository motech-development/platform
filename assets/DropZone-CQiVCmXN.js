import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{SyntheticDrop as c,n as l,t as u}from"./DropZone.stories-DJHjQG_e.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Accessible native-file drop target with visible labelling, optional guidance and invalid feedback, MIME, extension, count and byte-size validation, accepted and rejected File callbacks, atomic file-read failure handling, and a FileTrigger fallback composition.`}),`
`,(0,p.jsx)(t.h1,{id:`dropzone`,children:`DropZone`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`DropZone`}),` accepts native files through drag and drop, validates them and returns successfully read files to the application.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DropZone, FileTrigger } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`DropZone`}),` when dragging files from the operating system is a useful primary interaction. Always provide a keyboard- and touch-operable `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` fallback when selection is required.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` alone for a compact chooser or the `,(0,p.jsx)(t.code,{children:`FileUpload`}),` pattern for a complete upload workflow. `,(0,p.jsx)(t.code,{children:`DropZone`}),` does not upload, store, preview or remove files.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DropZone, FileTrigger } from '@motech-development/breeze-ui';

<DropZone.Root
  acceptedFileTypes={['application/pdf']}
  aria-label="Documents"
  onFiles={(files) => queueFiles(files)}
>
  <DropZone.Label>Drop documents here</DropZone.Label>
  <DropZone.Description>PDF documents only.</DropZone.Description>
  <FileTrigger.Root
    acceptedFileTypes={['application/pdf']}
    onFiles={queueFiles}
  >
    <FileTrigger.Trigger>Choose documents</FileTrigger.Trigger>
  </FileTrigger.Root>
  <DropZone.Feedback />
</DropZone.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DropZone.Root`})}),(0,p.jsx)(t.td,{children:`Owns native drop interaction, file reading, validation state and callbacks.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DropZone.Label`})}),(0,p.jsx)(t.td,{children:`Persistent visible drop-target label.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DropZone.Description`})}),(0,p.jsx)(t.td,{children:`Associated guidance about interaction or accepted files.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DropZone.Feedback`})}),(0,p.jsx)(t.td,{children:`Announces Breeze-owned file count, type and size rejections.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DropZone.Error`})}),(0,p.jsxs)(t.td,{children:[`Application validation message, rendered as an alert only while `,(0,p.jsx)(t.code,{children:`invalid`}),` is true.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep all parts inside `,(0,p.jsx)(t.code,{children:`Root`}),`. A nested `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` is a separate public compound component and should use the same acceptance rules to avoid inconsistent results.`]}),`
`,(0,p.jsx)(t.h2,{id:`files-failures-and-callbacks`,children:`Files, failures and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`acceptedFileTypes`}),` accepts exact MIME types, wildcard groups such as `,(0,p.jsx)(t.code,{children:`'image/*'`}),`, and extensions such as `,(0,p.jsx)(t.code,{children:`'.csv'`}),`. `,(0,p.jsx)(t.code,{children:`maxFileSize`}),` is bytes. `,(0,p.jsx)(t.code,{children:`allowsMultiple`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`. `,(0,p.jsx)(t.code,{children:`onFiles`}),` receives the accepted native `,(0,p.jsx)(t.code,{children:`File[]`}),`; `,(0,p.jsx)(t.code,{children:`onReject`}),` receives rejected files with one or more stable reasons: `,(0,p.jsx)(t.code,{children:`'file-count'`}),`, `,(0,p.jsx)(t.code,{children:`'file-size'`}),` and `,(0,p.jsx)(t.code,{children:`'file-type'`}),`. Mixed valid and invalid drops deliver both accepted files and rejection records.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Reading precedes validation. If any dropped item cannot be read, the entire mixed drop is atomic: `,(0,p.jsx)(t.code,{children:`onFileReadError`}),` runs once with `,(0,p.jsx)(t.code,{children:`DropZoneFileReadFailure[]`}),`, while `,(0,p.jsx)(t.code,{children:`onFiles`}),` and `,(0,p.jsx)(t.code,{children:`onReject`}),` are not called. Each failure supplies `,(0,p.jsx)(t.code,{children:`cause`}),`, zero-based `,(0,p.jsx)(t.code,{children:`itemIndex`}),`, and browser-supplied `,(0,p.jsx)(t.code,{children:`name`}),` and `,(0,p.jsx)(t.code,{children:`type`}),`. File-reading failures are distinct from constraint rejections and `,(0,p.jsx)(t.code,{children:`Feedback`}),` does not render them; show application-owned recovery guidance.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`invalid`}),` controls `,(0,p.jsx)(t.code,{children:`Error`}),` and accessible invalid state. `,(0,p.jsx)(t.code,{children:`required`}),` is presentation and validation semantics only because a drop zone has no native submitted value. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and dropping. There is no controlled file value, read-only state or loading prop; keep selected files and upload progress in application state.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`The drop target can receive focus, but dragging is not a complete keyboard interaction. Include a clearly labelled `,(0,p.jsx)(t.code,{children:`FileTrigger.Trigger`}),` fallback.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Provide a concise root accessible name, such as `,(0,p.jsx)(t.code,{children:`aria-label="Documents"`}),`, and a persistent visible `,(0,p.jsx)(t.code,{children:`Label`}),`. Use `,(0,p.jsx)(t.code,{children:`Description`}),` for type, size and count constraints.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Feedback`}),` and `,(0,p.jsx)(t.code,{children:`Error`}),` use alert semantics. Do not render generic error prose in `,(0,p.jsx)(t.code,{children:`Feedback`}),`; it is reserved for Breeze constraint rejections.`]}),`
`,(0,p.jsx)(t.li,{children:`Active drop-target appearance is supplementary. Do not rely on border colour alone to communicate acceptance, rejection or required state.`}),`
`,(0,p.jsxs)(t.li,{children:[`Visible content inherits provider locale and direction. Native filenames and files are not transformed; Breeze-owned rejection text is fixed component copy, so use `,(0,p.jsx)(t.code,{children:`onReject`}),` when the product needs different domain or localisation handling.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not make drag and drop the only route, treat client-side constraints as security, confuse byte counts with megabytes, or call `,(0,p.jsx)(t.code,{children:`onFiles`}),` yourself after `,(0,p.jsx)(t.code,{children:`onFileReadError`}),`. Keep nested `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` constraints aligned. Use `,(0,p.jsx)(t.code,{children:`FileAttachment`}),` to display a selected file and `,(0,p.jsx)(t.code,{children:`FileUpload`}),` for the composed workflow.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};