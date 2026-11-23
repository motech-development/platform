import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{ChooseAFile as c,Compact as l,CompactPhone as u,Default as d,Phone as f,TakePhoto as p,WithExistingFiles as m,n as h,t as g}from"./FileDropZone.stories-DHJWdryv.js";function _(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(o,{of:g,summary:`Accepts files by drag and drop or through an accessible picker button, with visible validation feedback.`}),`
`,(0,y.jsx)(t.h1,{id:`filedropzone`,children:`FileDropZone`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`FileDropZone`}),` lets people add files by dragging them onto the drop area or by using the `,(0,y.jsx)(t.strong,{children:`Choose files`}),` button. `,(0,y.jsx)(t.code,{children:`label`}),` is shown above the drop area and names it.`]}),`
`,(0,y.jsx)(a,{of:d}),`
`,(0,y.jsx)(t.h2,{id:`compact`,children:`Compact`}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`compact`}),` to show the drop area as a single row, the same height as an `,(0,y.jsx)(t.code,{children:`AttachmentRow`}),`. A single attachment then keeps its position whether or not a file is attached. The secondary text stays on one line and is truncated with an ellipsis.`]}),`
`,(0,y.jsx)(a,{of:l}),`
`,(0,y.jsx)(t.h2,{id:`take-photo`,children:`Take photo`}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`camera`}),` to add a `,(0,y.jsx)(t.strong,{children:`Take photo`}),` button before `,(0,y.jsx)(t.strong,{children:`Choose files`}),`. On phones it requests the rear camera, although the browser or device may use its own default; on other devices it opens an image picker.`]}),`
`,(0,y.jsxs)(t.p,{children:[`Cameras produce JPEG photos, so `,(0,y.jsx)(t.strong,{children:`Take photo`}),` appears only when `,(0,y.jsx)(t.code,{children:`accept`}),` is omitted or allows JPEG through `,(0,y.jsx)(t.code,{children:`image/*`}),`, `,(0,y.jsx)(t.code,{children:`image/jpeg`}),`, `,(0,y.jsx)(t.code,{children:`.jpg`}),`, `,(0,y.jsx)(t.code,{children:`.jpeg`}),` or `,(0,y.jsx)(t.code,{children:`*/*`}),`. Photos go through the same type, size and count checks as chosen files and are passed to `,(0,y.jsx)(t.code,{children:`onFilesAdded`}),` in the same way.`]}),`
`,(0,y.jsxs)(t.p,{children:[`On touch devices and narrow screens (below 901px), `,(0,y.jsx)(t.strong,{children:`Take photo`}),` is filled in the brand colour. On narrow screens:`]}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[`in the default layout, `,(0,y.jsx)(t.strong,{children:`Take photo`}),` fills the action row and the drag-and-drop instruction is hidden;`]}),`
`,(0,y.jsxs)(t.li,{children:[`in `,(0,y.jsx)(t.code,{children:`compact`}),` mode, both buttons show only their icons and keep their accessible names.`]}),`
`]}),`
`,(0,y.jsx)(a,{of:p}),`
`,(0,y.jsx)(a,{of:f}),`
`,(0,y.jsx)(a,{of:u}),`
`,(0,y.jsx)(t.h2,{id:`file-limits`,children:`File limits`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`accept`}),` takes a comma-separated list of file extensions and MIME types, such as `,(0,y.jsx)(t.code,{children:`.pdf,image/*`}),`. Dropped files are checked against the same list. `,(0,y.jsx)(t.code,{children:`.jpg`}),` and `,(0,y.jsx)(t.code,{children:`.jpeg`}),` each accept either extension, and an untyped file named `,(0,y.jsx)(t.code,{children:`.jpg`}),` or `,(0,y.jsx)(t.code,{children:`.jpeg`}),` is treated as `,(0,y.jsx)(t.code,{children:`image/jpeg`}),`.`]}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`maxSize`}),` sets the largest file size, in bytes.`]}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`maxFiles`}),` sets the total number of attachments allowed. When files are already attached, pass their number as `,(0,y.jsx)(t.code,{children:`currentFileCount`}),`.`]}),`
`]}),`
`,(0,y.jsxs)(t.p,{children:[`Accepted files are passed to `,(0,y.jsx)(t.code,{children:`onFilesAdded`}),` as a read-only array. Uploading and storing them is up to your application. Rejected files show their reason as visible text.`]}),`
`,(0,y.jsx)(a,{of:m}),`
`,(0,y.jsx)(a,{of:c}),`
`,(0,y.jsx)(t.h2,{id:`localisation`,children:`Localisation`}),`
`,(0,y.jsxs)(t.p,{children:[`The button text, instructions and feedback can be translated through the `,(0,y.jsx)(t.code,{children:`messages`}),` prop of `,(0,y.jsx)(t.code,{children:`BreezeProvider`}),`. Keep the placeholders listed in the BreezeProvider locale section. Each message is announced in its own language.`]}),`
`,(0,y.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.strong,{children:`Choose files`}),` opens the native file picker, so keyboard users can add files without dragging.`]}),`
`,(0,y.jsx)(t.li,{children:`Each rejection reason is also announced through a polite live region.`}),`
`]}),`
`,(0,y.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,y.jsx)(i,{of:d})]})}function v(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,y.jsx)(t,{...e,children:(0,y.jsx)(_,{...e})}):_(e)}var y;e((()=>{y=t(),s(),r(),h()}))();export{v as default};