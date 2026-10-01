import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-zJh2FNJ3.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Document as c,Loading as l,NarrowContainer as u,Photo as d,UploadFailed as f,n as p,t as m}from"./AttachmentRow.stories-BxuEr2pq.js";function h(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{of:m,summary:`Shows an attached document or photograph with its visible status and actions.`}),`
`,(0,_.jsx)(t.h1,{id:`attachmentrow`,children:`AttachmentRow`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`AttachmentRow`}),` presents one attached file in a compact row. The caller provides
the file name, whether it is a document or photograph, its size in bytes, and a
visible status such as `,(0,_.jsx)(t.code,{children:`Uploaded`}),` or `,(0,_.jsx)(t.code,{children:`Upload failed`}),`. Size formatting follows
the required Breeze provider locale.`]}),`
`,(0,_.jsx)(t.h2,{id:`document-and-photo-thumbnails`,children:`Document and photo thumbnails`}),`
`,(0,_.jsxs)(t.p,{children:[`Documents use a page preview and photographs use the supplied image thumbnail
or a camera placeholder. The file type is also written as visible text, so the
thumbnail is not the only way to tell them apart. Only a photograph accepts a
`,(0,_.jsx)(t.code,{children:`thumbnailUrl`}),`.`]}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(a,{of:d}),`
`,(0,_.jsx)(t.h2,{id:`open-and-menu-actions`,children:`Open and menu actions`}),`
`,(0,_.jsxs)(t.p,{children:[`Pass `,(0,_.jsx)(t.code,{children:`onOpen`}),` to show a direct Open button. Pass action descriptors and an
`,(0,_.jsx)(t.code,{children:`onAction`}),` callback together to show the overflow menu. Each action has a
visible label; icons only decorate those labels. Open and overflow buttons keep
their short visible labels and include the file name in their accessible names.`]}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(t.h2,{id:`narrow-containers`,children:`Narrow containers`}),`
`,(0,_.jsx)(t.p,{children:`When there is not enough horizontal room, the row wraps its actions below the
file details so the file information remains readable.`}),`
`,(0,_.jsx)(a,{of:u}),`
`,(0,_.jsx)(t.h2,{id:`visible-state-and-loading`,children:`Visible state and loading`}),`
`,(0,_.jsxs)(t.p,{children:[`The `,(0,_.jsx)(t.code,{children:`status`}),` text stays visible and updates are announced politely regardless
of the file type or thumbnail. While the file details are unavailable, set
`,(0,_.jsx)(t.code,{children:`loading`}),` to show the row-shaped loading placeholder and labelled progress bar.`]}),`
`,(0,_.jsx)(a,{of:f}),`
`,(0,_.jsx)(a,{of:l}),`
`,(0,_.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,_.jsx)(i,{of:c})]})}function g(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,_.jsx)(t,{...e,children:(0,_.jsx)(h,{...e})}):h(e)}var _;e((()=>{_=t(),s(),r(),p()}))();export{g as default};