import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{AnatomyAndUncontrolled as c,n as l,t as u}from"./TextArea.stories-QD8vkJfe.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Labelled multiline text entry with controlled, uncontrolled, read-only, validation, sizing, and native textarea behaviour.`}),`
`,(0,p.jsx)(t.h1,{id:`textarea`,children:`TextArea`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`TextArea`}),` collects free-form content that can span several lines while keeping label, guidance, and validation explicitly composed.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { TextArea } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for notes, summaries, descriptions, and other paragraph-length content. Prefer `,(0,p.jsx)(t.code,{children:`TextField`}),` for a short single-line value. Do not use a textarea for structured rich text, code editing, or a choice from known values; use a purpose-built editor or selection control.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { TextArea } from '@motech-development/breeze-ui';

<TextArea.Root>
  <TextArea.Label>Notes</TextArea.Label>
  <TextArea.Control name="notes" rows={5} />
  <TextArea.Description>Use plain text.</TextArea.Description>
</TextArea.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextArea.Root`})}),(0,p.jsx)(t.td,{children:`Owns string value and shared field state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextArea.Label`})}),(0,p.jsx)(t.td,{children:`Persistently names the textarea.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextArea.Control`})}),(0,p.jsx)(t.td,{children:`Renders the native multiline textarea.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextArea.Description`})}),(0,p.jsx)(t.td,{children:`Associates supporting guidance with the control.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextArea.Error`})}),(0,p.jsx)(t.td,{children:`Associates validation feedback when the root is invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`All parts belong inside `,(0,p.jsx)(t.code,{children:`Root`}),`. `,(0,p.jsx)(t.code,{children:`TextArea`}),` intentionally shares its state and guidance contract with `,(0,p.jsx)(t.code,{children:`TextField`}),`; the editable part is named `,(0,p.jsx)(t.code,{children:`Control`}),` rather than `,(0,p.jsx)(t.code,{children:`Input`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`value-and-states`,children:`Value and states`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for an intentionally immutable value. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the complete next string. Empty content is `,(0,p.jsx)(t.code,{children:`''`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and edits. `,(0,p.jsx)(t.code,{children:`readOnly`}),` preserves focus, selection, copying, and form participation without allowing edits. `,(0,p.jsx)(t.code,{children:`invalid`}),` associates `,(0,p.jsx)(t.code,{children:`Error`}),`; `,(0,p.jsx)(t.code,{children:`required`}),` exposes native required semantics. Loading and character limits are application concerns: use native `,(0,p.jsx)(t.code,{children:`maxLength`}),` where it is a genuine constraint and keep any count in `,(0,p.jsx)(t.code,{children:`Description`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`size-and-resizing`,children:`Size and resizing`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Control`}),` supports `,(0,p.jsx)(t.code,{children:`size="sm" | "md" | "lg"`}),`; `,(0,p.jsx)(t.code,{children:`md`}),` is the default. Its minimum height changes with size and users may resize it vertically. Use `,(0,p.jsx)(t.code,{children:`rows`}),` to express the expected amount of content, but do not force a fixed height that prevents reviewing entered text.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility, and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab moves focus; Enter inserts a new line. Normal platform editing, selection, clipboard, and undo commands remain available.`}),`
`,(0,p.jsxs)(t.li,{children:[`Always provide a persistent `,(0,p.jsx)(t.code,{children:`Label`}),`. A placeholder is a hint, not an accessible name.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Put pre-entry guidance in `,(0,p.jsx)(t.code,{children:`Description`}),`; put a specific recovery instruction in `,(0,p.jsx)(t.code,{children:`Error`}),` and set `,(0,p.jsx)(t.code,{children:`invalid`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not intercept Enter to submit the surrounding form unless the product clearly provides another way to enter line breaks.`}),`
`,(0,p.jsxs)(t.li,{children:[`Unicode text and the surrounding `,(0,p.jsx)(t.code,{children:`dir`}),` are respected. Use `,(0,p.jsx)(t.code,{children:`dir="auto"`}),` for user-authored text whose direction is unknown.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not put state props on `,(0,p.jsx)(t.code,{children:`Control`}),`, remove resize access without an equivalent, or use the placeholder as the only label. Use `,(0,p.jsx)(t.code,{children:`TextField`}),` for a line, `,(0,p.jsx)(t.code,{children:`SearchField`}),` for a query, and `,(0,p.jsx)(t.code,{children:`FormSection`}),` or `,(0,p.jsx)(t.code,{children:`Fieldset`}),` to organise multiple related fields.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};