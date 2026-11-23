import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Blur as c,Controlled as l,Default as u,Description as d,Disabled as f,Error as p,HiddenLabel as m,Large as h,LargeLoading as g,Loading as _,ReadOnly as v,Required as y,n as b,t as x}from"./NumberField.stories-D8xrlHcd.js";function S(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(o,{of:x,summary:`Locale-aware numeric entry with semantic number changes.`}),`
`,(0,w.jsx)(t.h1,{id:`numberfield`,children:`NumberField`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`NumberField`}),` is a labelled input for entering numbers, such as an amount.
It reads and displays numbers using the provider's locale, and shows figures
with tabular numerals so digits line up.`]}),`
`,(0,w.jsxs)(t.p,{children:[`There are no stepper buttons. Up and Down arrow keys change the value by
`,(0,w.jsx)(t.code,{children:`step`}),`, which defaults to `,(0,w.jsx)(t.code,{children:`1`}),`. Beyond the locale's number conventions, values
are not formatted unless you pass `,(0,w.jsx)(t.code,{children:`formatOptions`}),`.`]}),`
`,(0,w.jsx)(a,{of:u}),`
`,(0,w.jsx)(t.h2,{id:`sizes`,children:`Sizes`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`size`}),` defaults to `,(0,w.jsx)(t.code,{children:`md`}),`, a 38px control with 13px figures. Use `,(0,w.jsx)(t.code,{children:`lg`}),` for a
form's main amount: a 52px control with 20px semibold figures. Fields in the
same row should use the same size.`]}),`
`,(0,w.jsx)(a,{of:h}),`
`,(0,w.jsx)(t.h2,{id:`description-and-errors`,children:`Description and errors`}),`
`,(0,w.jsxs)(t.p,{children:[`Use `,(0,w.jsx)(t.code,{children:`description`}),` for guidance about what to enter. Pass a non-empty `,(0,w.jsx)(t.code,{children:`error`}),`
to mark the field invalid and show the message; there is no separate `,(0,w.jsx)(t.code,{children:`invalid`}),`
prop.`]}),`
`,(0,w.jsx)(a,{of:d}),`
`,(0,w.jsx)(a,{of:p}),`
`,(0,w.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`required`}),`, `,(0,w.jsx)(t.code,{children:`disabled`}),` and `,(0,w.jsx)(t.code,{children:`readOnly`}),` behave as they do on a native input.`]}),`
`,(0,w.jsxs)(t.p,{children:[`Set `,(0,w.jsx)(t.code,{children:`loading`}),` while the value is not yet available. The field keeps its shape,
screen readers announce the provider's loading message, and the value cannot be
typed or stepped until loading ends.`]}),`
`,(0,w.jsx)(a,{of:y}),`
`,(0,w.jsx)(a,{of:f}),`
`,(0,w.jsx)(a,{of:v}),`
`,(0,w.jsx)(a,{of:_}),`
`,(0,w.jsx)(a,{of:g}),`
`,(0,w.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,w.jsxs)(t.p,{children:[`To control the value, pass both `,(0,w.jsx)(t.code,{children:`value`}),` and `,(0,w.jsx)(t.code,{children:`onChange`}),`. `,(0,w.jsx)(t.code,{children:`onChange`}),` receives the
new number, not a DOM event. While the input is empty, the value is `,(0,w.jsx)(t.code,{children:`NaN`}),`, so
you can tell an empty field from zero.`]}),`
`,(0,w.jsxs)(t.p,{children:[`For an uncontrolled field, pass `,(0,w.jsx)(t.code,{children:`defaultValue`}),` and optionally `,(0,w.jsx)(t.code,{children:`onChange`}),`.
Controlled and uncontrolled props cannot be combined.`]}),`
`,(0,w.jsx)(a,{of:l}),`
`,(0,w.jsx)(t.h2,{id:`blur`,children:`Blur`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`onBlur`}),` reports that focus has left the field, for example to show a
validation error only once the user has moved on. Like `,(0,w.jsx)(t.code,{children:`onChange`}),`, it receives
no DOM event. The typed number is committed through `,(0,w.jsx)(t.code,{children:`onChange`}),` before `,(0,w.jsx)(t.code,{children:`onBlur`}),`
reports.`]}),`
`,(0,w.jsx)(a,{of:c}),`
`,(0,w.jsx)(t.h2,{id:`hidden-label`,children:`Hidden label`}),`
`,(0,w.jsxs)(t.p,{children:[`Set `,(0,w.jsx)(t.code,{children:`labelHidden`}),` when a column heading already labels a repeated row of
fields, such as a list of categories with their VAT rates. The label is hidden
visually but stays the field's accessible name, so make it specific to the row,
such as “VAT rate for Vehicle”. Descriptions and errors stay visible.`]}),`
`,(0,w.jsx)(a,{of:m}),`
`,(0,w.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,w.jsxs)(t.p,{children:[`The visible label names the input, and screen readers announce the description
and any error with it. Use `,(0,w.jsx)(t.code,{children:`ref`}),` to reach the native input, for example to
focus it.`]}),`
`,(0,w.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,w.jsx)(i,{})]})}function C(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,w.jsx)(t,{...e,children:(0,w.jsx)(S,{...e})}):S(e)}var w;e((()=>{w=t(),s(),r(),b()}))();export{C as default};