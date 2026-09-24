import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BudqKi8b.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,Description as u,Error as d,FreeText as f,Loading as p,n as m,t as h}from"./ComboBox.stories-Cbe2xJPa.js";function g(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{of:h,summary:`A filterable suggestion field with optional free text.`}),`
`,(0,v.jsx)(t.h1,{id:`combobox`,children:`ComboBox`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`ComboBox`}),` combines text entry with a React Aria popover listbox. Suggestions
filter while the user types, and the same closed descriptor contract is used for
every item.`]}),`
`,(0,v.jsx)(a,{of:l}),`
`,(0,v.jsx)(t.h2,{id:`descriptor-content`,children:`Descriptor content`}),`
`,(0,v.jsxs)(t.p,{children:[`Pass `,(0,v.jsx)(t.code,{children:`items`}),` and a `,(0,v.jsx)(t.code,{children:`getItem`}),` mapping function. The mapping returns only
`,(0,v.jsx)(t.code,{children:`ItemDescriptor`}),` data: `,(0,v.jsx)(t.code,{children:`id`}),`, `,(0,v.jsx)(t.code,{children:`label`}),`, optional `,(0,v.jsx)(t.code,{children:`description`}),`, `,(0,v.jsx)(t.code,{children:`icon`}),`, `,(0,v.jsx)(t.code,{children:`badge`}),` and
`,(0,v.jsx)(t.code,{children:`disabled`}),`. It cannot return JSX, classes, styles or slot props. A content gap is
a deliberate Breeze library change, not an application markup escape hatch.`]}),`
`,(0,v.jsx)(a,{of:u}),`
`,(0,v.jsx)(t.h2,{id:`filtering-and-free-text`,children:`Filtering and free text`}),`
`,(0,v.jsxs)(t.p,{children:[`Typing filters suggestions by their descriptor labels. Set `,(0,v.jsx)(t.code,{children:`allowsCustomValue`}),`
when the field should also accept text that is not one of the suggestions; the
semantic callback then receives either an item, the entered string or `,(0,v.jsx)(t.code,{children:`null`}),`.`]}),`
`,(0,v.jsx)(a,{of:f}),`
`,(0,v.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`required`}),`, `,(0,v.jsx)(t.code,{children:`disabled`}),` and `,(0,v.jsx)(t.code,{children:`readOnly`}),` map to the field's accessible semantics. A
non-empty `,(0,v.jsx)(t.code,{children:`error`}),` marks the field invalid; there is no separate `,(0,v.jsx)(t.code,{children:`invalid`}),` prop.
`,(0,v.jsx)(t.code,{children:`loading`}),` preserves the input shape and prevents interaction until the value is
available.`]}),`
`,(0,v.jsx)(a,{of:d}),`
`,(0,v.jsx)(a,{of:p}),`
`,(0,v.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,v.jsxs)(t.p,{children:[`Provide both `,(0,v.jsx)(t.code,{children:`value`}),` and `,(0,v.jsx)(t.code,{children:`onChange`}),` for controlled usage. The callback receives a
selected item, custom text or `,(0,v.jsx)(t.code,{children:`null`}),`, never a DOM event. Use `,(0,v.jsx)(t.code,{children:`defaultValue`}),` and
an optional `,(0,v.jsx)(t.code,{children:`onChange`}),` for uncontrolled usage; the two forms cannot be mixed.`]}),`
`,(0,v.jsx)(a,{of:c}),`
`,(0,v.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,v.jsx)(t.p,{children:`The visible label names the input, while descriptions and errors are announced
through React Aria's field relationships. React Aria supplies listbox keyboard
navigation and focus management.`}),`
`,(0,v.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,v.jsx)(i,{})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;e((()=>{v=t(),s(),r(),m()}))();export{_ as default};