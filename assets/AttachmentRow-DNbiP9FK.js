import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Document as c,Loading as l,NarrowContainer as u,Photo as d,UploadFailed as f,n as p,t as m}from"./AttachmentRow.stories-CXHjjR1U.js";function h(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{of:m,summary:`Shows an attached document or photograph with its visible status and actions.`}),`
`,(0,_.jsx)(t.h1,{id:`attachmentrow`,children:`AttachmentRow`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`AttachmentRow`}),` shows one attached file in a compact row, with its name, type, size, status and actions. Use it to list the files attached to a record.`]}),`
`,(0,_.jsxs)(t.p,{children:[`Pass `,(0,_.jsx)(t.code,{children:`filename`}),`, `,(0,_.jsx)(t.code,{children:`fileType`}),` (`,(0,_.jsx)(t.code,{children:`document`}),` or `,(0,_.jsx)(t.code,{children:`photo`}),`), `,(0,_.jsx)(t.code,{children:`sizeBytes`}),` and a visible `,(0,_.jsx)(t.code,{children:`status`}),` such as `,(0,_.jsx)(t.code,{children:`Uploaded`}),` or `,(0,_.jsx)(t.code,{children:`Upload failed`}),`. The size is formatted for the `,(0,_.jsx)(t.code,{children:`BreezeProvider`}),` locale.`]}),`
`,(0,_.jsx)(t.h2,{id:`documents-and-photos`,children:`Documents and photos`}),`
`,(0,_.jsxs)(t.p,{children:[`Documents show a page preview. Photos show the image passed as `,(0,_.jsx)(t.code,{children:`thumbnailUrl`}),`, or a camera placeholder without one; only photos accept `,(0,_.jsx)(t.code,{children:`thumbnailUrl`}),`. The file type is also written as text, so the thumbnail is not the only way to tell them apart.`]}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(a,{of:d}),`
`,(0,_.jsx)(t.h2,{id:`actions`,children:`Actions`}),`
`,(0,_.jsxs)(t.p,{children:[`Pass `,(0,_.jsx)(t.code,{children:`onOpen`}),` to show an `,(0,_.jsx)(t.strong,{children:`Open`}),` button. To open the file in a `,(0,_.jsx)(t.code,{children:`DocumentViewer`}),` with a transition between the two, give both the same `,(0,_.jsx)(t.code,{children:`transitionName`}),`.`]}),`
`,(0,_.jsxs)(t.p,{children:[`To add an overflow menu, pass an `,(0,_.jsx)(t.code,{children:`actions`}),` array together with `,(0,_.jsx)(t.code,{children:`onAction`}),`. Each action has an `,(0,_.jsx)(t.code,{children:`id`}),` and a visible `,(0,_.jsx)(t.code,{children:`label`}),`, plus an optional `,(0,_.jsx)(t.code,{children:`icon`}),`, `,(0,_.jsx)(t.code,{children:`description`}),` and `,(0,_.jsx)(t.code,{children:`disabled`}),` flag. `,(0,_.jsx)(t.code,{children:`onAction`}),` receives the selected action. The menu opens from a `,(0,_.jsx)(t.strong,{children:`More actions`}),` button, aligned to its end edge.`]}),`
`,(0,_.jsxs)(t.p,{children:[`For a destructive action such as Remove, set `,(0,_.jsx)(t.code,{children:`tone: 'danger'`}),` and give it its own `,(0,_.jsx)(t.code,{children:`section`}),` so it appears in the danger colour below a divider.`]}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(t.h2,{id:`narrow-containers`,children:`Narrow containers`}),`
`,(0,_.jsx)(t.p,{children:`When horizontal space is limited, the actions wrap below the file details so the file information stays readable.`}),`
`,(0,_.jsx)(a,{of:u}),`
`,(0,_.jsx)(t.h2,{id:`status-and-loading`,children:`Status and loading`}),`
`,(0,_.jsxs)(t.p,{children:[`The `,(0,_.jsx)(t.code,{children:`status`}),` text is always visible. Set `,(0,_.jsx)(t.code,{children:`loading`}),` while the file details are unavailable to show a row-shaped placeholder with a labelled progress bar.`]}),`
`,(0,_.jsx)(a,{of:f}),`
`,(0,_.jsx)(a,{of:l}),`
`,(0,_.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,_.jsxs)(t.ul,{children:[`
`,(0,_.jsxs)(t.li,{children:[`The `,(0,_.jsx)(t.strong,{children:`Open`}),` and `,(0,_.jsx)(t.strong,{children:`More actions`}),` buttons include the file name in their accessible names.`]}),`
`,(0,_.jsxs)(t.li,{children:[`Changes to `,(0,_.jsx)(t.code,{children:`status`}),` are announced politely to screen readers.`]}),`
`,(0,_.jsx)(t.li,{children:`Action icons are decorative; each action is named by its label.`}),`
`]}),`
`,(0,_.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,_.jsx)(i,{of:c})]})}function g(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,_.jsx)(t,{...e,children:(0,_.jsx)(h,{...e})}):h(e)}var _;e((()=>{_=t(),s(),r(),p()}))();export{g as default};