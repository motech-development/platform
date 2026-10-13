import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{ChooseAFile as c,Compact as l,CompactPhone as u,Default as d,Phone as f,TakePhoto as p,WithExistingFiles as m,n as h,t as g}from"./FileDropZone.stories-DHJWdryv.js";function _(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,strong:`strong`,...n(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(o,{of:g,summary:`Accepts files by drag and drop or through an accessible picker button, with visible validation feedback.`}),`
`,(0,y.jsx)(t.h1,{id:`filedropzone`,children:`FileDropZone`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`FileDropZone`}),` accepts files through drag and drop or the `,(0,y.jsx)(t.strong,{children:`Choose files`}),`
button. The button opens a native file picker, so keyboard users can browse for
files without dragging. `,(0,y.jsx)(t.code,{children:`label`}),` is shown as a field label above the drop area
and names it.`]}),`
`,(0,y.jsx)(a,{of:d}),`
`,(0,y.jsx)(t.h2,{id:`compact`,children:`Compact`}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`compact`}),` to lay the drop area out as one row at the height of an
`,(0,y.jsx)(t.code,{children:`AttachmentRow`}),`, so a single attachment keeps its position whether or not a file
is attached. Its secondary line stays on one line and truncates with an
ellipsis.`]}),`
`,(0,y.jsx)(a,{of:l}),`
`,(0,y.jsx)(t.h2,{id:`take-photo`,children:`Take photo`}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`camera`}),` to offer `,(0,y.jsx)(t.strong,{children:`Take photo`}),` before `,(0,y.jsx)(t.strong,{children:`Choose files`}),`. It opens a native
file input with `,(0,y.jsx)(t.code,{children:`accept="image/*"`}),` and `,(0,y.jsx)(t.code,{children:`capture="environment"`}),`, so phones open
the rear camera and other devices fall back to an image picker. Cameras deliver
JPEG photos, so the action appears only when `,(0,y.jsx)(t.code,{children:`accept`}),` is omitted or allows JPEG
through `,(0,y.jsx)(t.code,{children:`image/*`}),`, `,(0,y.jsx)(t.code,{children:`image/jpeg`}),`, `,(0,y.jsx)(t.code,{children:`.jpg`}),`, `,(0,y.jsx)(t.code,{children:`.jpeg`}),` or `,(0,y.jsx)(t.code,{children:`*/*`}),`. Captured photos pass
the same type, size and count checks as chosen files and reach `,(0,y.jsx)(t.code,{children:`onFilesAdded`}),`
the same way. For JPEG files, `,(0,y.jsx)(t.code,{children:`.jpg`}),` and `,(0,y.jsx)(t.code,{children:`.jpeg`}),` accept either extension, and
an untyped file named `,(0,y.jsx)(t.code,{children:`.jpg`}),` or `,(0,y.jsx)(t.code,{children:`.jpeg`}),` counts as `,(0,y.jsx)(t.code,{children:`image/jpeg`}),`.`]}),`
`,(0,y.jsxs)(t.p,{children:[`On coarse pointers and below Breeze's `,(0,y.jsx)(t.code,{children:`md`}),` breakpoint, Take photo is filled in
the brand colour. Below `,(0,y.jsx)(t.code,{children:`md`}),` it also fills the stacked layout's action row, the
stacked layout hides its drag-and-drop line, and the compact layout reduces both
actions to icons that keep their accessible names.`]}),`
`,(0,y.jsx)(a,{of:p}),`
`,(0,y.jsx)(a,{of:f}),`
`,(0,y.jsx)(a,{of:u}),`
`,(0,y.jsx)(t.h2,{id:`file-limits`,children:`File limits`}),`
`,(0,y.jsxs)(t.p,{children:[`Pass `,(0,y.jsx)(t.code,{children:`accept`}),` as a comma-separated list of file extensions and MIME types, such
as `,(0,y.jsx)(t.code,{children:`.pdf,image/*`}),`. Dropped files are checked against the same rules. Set
`,(0,y.jsx)(t.code,{children:`maxSize`}),` in bytes and `,(0,y.jsx)(t.code,{children:`maxFiles`}),` for the total attachment limit. When existing
files are already attached, provide their number as `,(0,y.jsx)(t.code,{children:`currentFileCount`}),`.`]}),`
`,(0,y.jsxs)(t.p,{children:[`The component shows each rejection reason in visible text and announces the
same message through a polite live region. Supported files are passed to
`,(0,y.jsx)(t.code,{children:`onFilesAdded`}),` as a readonly array. The application owns the attachment state,
upload, and storage work.`]}),`
`,(0,y.jsxs)(t.p,{children:[`Picker text, instructions, and feedback use the BreezeProvider `,(0,y.jsx)(t.code,{children:`messages`}),`
override boundary. Translations retain the placeholders documented in the
BreezeProvider locale section, and each message announces with its matching
language.`]}),`
`,(0,y.jsx)(a,{of:m}),`
`,(0,y.jsx)(a,{of:c}),`
`,(0,y.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,y.jsx)(i,{of:d})]})}function v(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,y.jsx)(t,{...e,children:(0,y.jsx)(_,{...e})}):_(e)}var y;e((()=>{y=t(),s(),r(),h()}))();export{v as default};