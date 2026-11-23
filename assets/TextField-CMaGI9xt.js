import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Blur as c,Controlled as l,Default as u,Description as d,Disabled as f,Error as p,HiddenLabel as m,Loading as h,ReadOnly as g,Required as _,n as v,t as y}from"./TextField.stories-otZhVD0a.js";function b(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(o,{of:y,summary:`A flat labelled text input with accessible validation.`}),`
`,(0,S.jsx)(t.h1,{id:`textfield`,children:`TextField`}),`
`,(0,S.jsxs)(t.p,{children:[(0,S.jsx)(t.code,{children:`TextField`}),` is a single-line text input with a label. Pass `,(0,S.jsx)(t.code,{children:`label`}),`, and
optionally `,(0,S.jsx)(t.code,{children:`description`}),` and `,(0,S.jsx)(t.code,{children:`error`}),`, as props; there are no separate field
parts to assemble.`]}),`
`,(0,S.jsx)(a,{of:u}),`
`,(0,S.jsx)(t.h2,{id:`description-and-errors`,children:`Description and errors`}),`
`,(0,S.jsxs)(t.p,{children:[`Use `,(0,S.jsx)(t.code,{children:`description`}),` for guidance about what to enter. Pass a non-empty `,(0,S.jsx)(t.code,{children:`error`}),`
to mark the field invalid and show the message; there is no separate `,(0,S.jsx)(t.code,{children:`invalid`}),`
prop.`]}),`
`,(0,S.jsx)(a,{of:d}),`
`,(0,S.jsx)(a,{of:p}),`
`,(0,S.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,S.jsxs)(t.p,{children:[(0,S.jsx)(t.code,{children:`required`}),`, `,(0,S.jsx)(t.code,{children:`disabled`}),` and `,(0,S.jsx)(t.code,{children:`readOnly`}),` behave as they do on a native input.`]}),`
`,(0,S.jsxs)(t.p,{children:[`Set `,(0,S.jsx)(t.code,{children:`loading`}),` while the value is not yet available. The field keeps its shape,
screen readers announce the provider's loading message, and the field cannot be
edited until loading ends.`]}),`
`,(0,S.jsx)(a,{of:_}),`
`,(0,S.jsx)(a,{of:f}),`
`,(0,S.jsx)(a,{of:g}),`
`,(0,S.jsx)(a,{of:h}),`
`,(0,S.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,S.jsxs)(t.p,{children:[`To control the value, pass both `,(0,S.jsx)(t.code,{children:`value`}),` and `,(0,S.jsx)(t.code,{children:`onChange`}),`. `,(0,S.jsx)(t.code,{children:`onChange`}),` receives the
new string, not a DOM event. For an uncontrolled field, pass `,(0,S.jsx)(t.code,{children:`defaultValue`}),` and
optionally `,(0,S.jsx)(t.code,{children:`onChange`}),`. Controlled and uncontrolled props cannot be combined.`]}),`
`,(0,S.jsx)(a,{of:l}),`
`,(0,S.jsx)(t.h2,{id:`blur`,children:`Blur`}),`
`,(0,S.jsxs)(t.p,{children:[(0,S.jsx)(t.code,{children:`onBlur`}),` reports that focus has left the field, for example to show a
validation error only once the user has moved on. Like `,(0,S.jsx)(t.code,{children:`onChange`}),`, it receives
no DOM event.`]}),`
`,(0,S.jsx)(a,{of:c}),`
`,(0,S.jsx)(t.h2,{id:`hidden-label`,children:`Hidden label`}),`
`,(0,S.jsxs)(t.p,{children:[`Set `,(0,S.jsx)(t.code,{children:`labelHidden`}),` when a column heading already labels a repeated row of
fields, such as a list of categories with their VAT rates. The label is hidden
visually but stays the field's accessible name, so make it specific to the row,
such as “VAT rate for Vehicle”. Descriptions and errors stay visible.`]}),`
`,(0,S.jsx)(a,{of:m}),`
`,(0,S.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,S.jsxs)(t.p,{children:[`The visible label names the input, and screen readers announce the description
and any error with it. Use `,(0,S.jsx)(t.code,{children:`ref`}),` to reach the native input, for example to
focus it.`]}),`
`,(0,S.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,S.jsx)(i,{})]})}function x(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,S.jsx)(t,{...e,children:(0,S.jsx)(b,{...e})}):b(e)}var S;e((()=>{S=t(),s(),r(),v()}))();export{x as default};