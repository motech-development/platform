import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-zJh2FNJ3.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{ChooseAFile as c,Default as l,WithExistingFiles as u,n as d,t as f}from"./FileDropZone.stories-BaSLB4Lq.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,strong:`strong`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Accepts files by drag and drop or through an accessible picker button, with visible validation feedback.`}),`
`,(0,h.jsx)(t.h1,{id:`filedropzone`,children:`FileDropZone`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`FileDropZone`}),` accepts files through drag and drop or the `,(0,h.jsx)(t.strong,{children:`Choose files`}),`
button. The button opens a native file picker, so keyboard users can browse for
files without dragging.`]}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.h2,{id:`file-limits`,children:`File limits`}),`
`,(0,h.jsxs)(t.p,{children:[`Pass `,(0,h.jsx)(t.code,{children:`accept`}),` as a comma-separated list of file extensions and MIME types, such
as `,(0,h.jsx)(t.code,{children:`.pdf,image/*`}),`. Dropped files are checked against the same rules. Set
`,(0,h.jsx)(t.code,{children:`maxSize`}),` in bytes and `,(0,h.jsx)(t.code,{children:`maxFiles`}),` for the total attachment limit. When existing
files are already attached, provide their number as `,(0,h.jsx)(t.code,{children:`currentFileCount`}),`.`]}),`
`,(0,h.jsxs)(t.p,{children:[`The component shows each rejection reason in visible text and announces the
same message through a polite live region. Supported files are passed to
`,(0,h.jsx)(t.code,{children:`onFilesAdded`}),` as a readonly array. The application owns the attachment state,
upload, and storage work.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Picker text, instructions, and feedback use the BreezeProvider `,(0,h.jsx)(t.code,{children:`messages`}),`
override boundary. Translations retain the placeholders documented in the
BreezeProvider locale section, and each message announces with its matching
language.`]}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{of:l})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};