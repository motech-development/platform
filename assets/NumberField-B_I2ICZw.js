import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Blur as c,Controlled as l,Default as u,Description as d,Disabled as f,Error as p,Large as m,LargeLoading as h,Loading as g,ReadOnly as _,Required as v,n as y,t as b}from"./NumberField.stories-BrXBBWEb.js";function x(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(o,{of:b,summary:`Locale-aware numeric entry with semantic number changes.`}),`
`,(0,C.jsx)(t.h1,{id:`numberfield`,children:`NumberField`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`NumberField`}),` is a labelled input for entering numbers, such as an amount.
It reads and displays numbers using the provider's locale, and shows figures
with tabular numerals so digits line up.`]}),`
`,(0,C.jsxs)(t.p,{children:[`There are no stepper buttons. Up and Down arrow keys change the value by
`,(0,C.jsx)(t.code,{children:`step`}),`, which defaults to `,(0,C.jsx)(t.code,{children:`1`}),`. Beyond the locale's number conventions, values
are not formatted unless you pass `,(0,C.jsx)(t.code,{children:`formatOptions`}),`.`]}),`
`,(0,C.jsx)(a,{of:u}),`
`,(0,C.jsx)(t.h2,{id:`sizes`,children:`Sizes`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`size`}),` defaults to `,(0,C.jsx)(t.code,{children:`md`}),`, a 38px control with 13px figures. Use `,(0,C.jsx)(t.code,{children:`lg`}),` for a
form's main amount: a 52px control with 20px semibold figures. Fields in the
same row should use the same size.`]}),`
`,(0,C.jsx)(a,{of:m}),`
`,(0,C.jsx)(t.h2,{id:`description-and-errors`,children:`Description and errors`}),`
`,(0,C.jsxs)(t.p,{children:[`Use `,(0,C.jsx)(t.code,{children:`description`}),` for guidance about what to enter. Pass a non-empty `,(0,C.jsx)(t.code,{children:`error`}),`
to mark the field invalid and show the message; there is no separate `,(0,C.jsx)(t.code,{children:`invalid`}),`
prop.`]}),`
`,(0,C.jsx)(a,{of:d}),`
`,(0,C.jsx)(a,{of:p}),`
`,(0,C.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`required`}),`, `,(0,C.jsx)(t.code,{children:`disabled`}),` and `,(0,C.jsx)(t.code,{children:`readOnly`}),` behave as they do on a native input.`]}),`
`,(0,C.jsxs)(t.p,{children:[`Set `,(0,C.jsx)(t.code,{children:`loading`}),` while the value is not yet available. The field keeps its shape,
screen readers announce the provider's loading message, and the value cannot be
typed or stepped until loading ends.`]}),`
`,(0,C.jsx)(a,{of:v}),`
`,(0,C.jsx)(a,{of:f}),`
`,(0,C.jsx)(a,{of:_}),`
`,(0,C.jsx)(a,{of:g}),`
`,(0,C.jsx)(a,{of:h}),`
`,(0,C.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,C.jsxs)(t.p,{children:[`To control the value, pass both `,(0,C.jsx)(t.code,{children:`value`}),` and `,(0,C.jsx)(t.code,{children:`onChange`}),`. `,(0,C.jsx)(t.code,{children:`onChange`}),` receives the
new number, not a DOM event. While the input is empty, the value is `,(0,C.jsx)(t.code,{children:`NaN`}),`, so
you can tell an empty field from zero.`]}),`
`,(0,C.jsxs)(t.p,{children:[`For an uncontrolled field, pass `,(0,C.jsx)(t.code,{children:`defaultValue`}),` and optionally `,(0,C.jsx)(t.code,{children:`onChange`}),`.
Controlled and uncontrolled props cannot be combined.`]}),`
`,(0,C.jsx)(a,{of:l}),`
`,(0,C.jsx)(t.h2,{id:`blur`,children:`Blur`}),`
`,(0,C.jsxs)(t.p,{children:[(0,C.jsx)(t.code,{children:`onBlur`}),` reports that focus has left the field, for example to show a
validation error only once the user has moved on. Like `,(0,C.jsx)(t.code,{children:`onChange`}),`, it receives
no DOM event. The typed number is committed through `,(0,C.jsx)(t.code,{children:`onChange`}),` before `,(0,C.jsx)(t.code,{children:`onBlur`}),`
reports.`]}),`
`,(0,C.jsx)(a,{of:c}),`
`,(0,C.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,C.jsxs)(t.p,{children:[`The visible label names the input, and screen readers announce the description
and any error with it. Use `,(0,C.jsx)(t.code,{children:`ref`}),` to reach the native input, for example to
focus it.`]}),`
`,(0,C.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,C.jsx)(i,{})]})}function S(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,C.jsx)(t,{...e,children:(0,C.jsx)(x,{...e})}):x(e)}var C;e((()=>{C=t(),s(),r(),y()}))();export{S as default};