import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,Description as u,Disabled as d,Error as f,Large as p,LargeLoading as m,Loading as h,ReadOnly as g,Required as _,n as v,t as y}from"./NumberField.stories-I_-I0tmm.js";function b(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(o,{of:y,summary:`Locale-aware numeric entry with semantic number changes.`}),`
`,(0,S.jsx)(t.h1,{id:`numberfield`,children:`NumberField`}),`
`,(0,S.jsxs)(t.p,{children:[(0,S.jsx)(t.code,{children:`NumberField`}),` is a flat labelled numeric input backed by React Aria. It uses
the Breeze locale and displays figures with tabular numerals. There are no
stepper buttons: the Up and Down arrow keys change the value by `,(0,S.jsx)(t.code,{children:`step`}),`. Values
remain unformatted except for React Aria's locale-aware input behaviour.`]}),`
`,(0,S.jsx)(a,{of:l}),`
`,(0,S.jsx)(t.h2,{id:`sizes`,children:`Sizes`}),`
`,(0,S.jsxs)(t.p,{children:[(0,S.jsx)(t.code,{children:`size`}),` defaults to `,(0,S.jsx)(t.code,{children:`md`}),`, the standard 38px control with 13px figures. Use `,(0,S.jsx)(t.code,{children:`lg`}),`
for a form's primary amount: a 52px control with 20px semibold figures. Fields
that share a row should share a size.`]}),`
`,(0,S.jsx)(a,{of:p}),`
`,(0,S.jsx)(t.h2,{id:`supporting-text-and-errors`,children:`Supporting text and errors`}),`
`,(0,S.jsxs)(t.p,{children:[`Use `,(0,S.jsx)(t.code,{children:`description`}),` for guidance. A non-empty `,(0,S.jsx)(t.code,{children:`error`}),` marks the field invalid and
associates the message with the native input. There is no separate invalid prop.`]}),`
`,(0,S.jsx)(a,{of:u}),`
`,(0,S.jsx)(a,{of:f}),`
`,(0,S.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,S.jsxs)(t.p,{children:[(0,S.jsx)(t.code,{children:`required`}),`, `,(0,S.jsx)(t.code,{children:`disabled`}),` and `,(0,S.jsx)(t.code,{children:`readOnly`}),` map to the corresponding accessible input
semantics. `,(0,S.jsx)(t.code,{children:`loading`}),` keeps the field's shape, announces the provider loading
message and prevents typing or stepping until it is removed.`]}),`
`,(0,S.jsx)(a,{of:_}),`
`,(0,S.jsx)(a,{of:d}),`
`,(0,S.jsx)(a,{of:g}),`
`,(0,S.jsx)(a,{of:h}),`
`,(0,S.jsx)(a,{of:m}),`
`,(0,S.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,S.jsxs)(t.p,{children:[`Provide both `,(0,S.jsx)(t.code,{children:`value`}),` and `,(0,S.jsx)(t.code,{children:`onChange`}),` for controlled usage. The callback receives
the next number, never a DOM event. React Aria reports `,(0,S.jsx)(t.code,{children:`NaN`}),` while the input is
empty, which lets applications distinguish an empty value from zero. Use
`,(0,S.jsx)(t.code,{children:`defaultValue`}),` and an optional `,(0,S.jsx)(t.code,{children:`onChange`}),` for uncontrolled usage; the two forms
cannot be mixed.`]}),`
`,(0,S.jsx)(a,{of:c}),`
`,(0,S.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,S.jsxs)(t.p,{children:[`The visible label names the native input. Descriptions and errors are announced
through React Aria's field relationships, and the field exposes its native
input through `,(0,S.jsx)(t.code,{children:`ref`}),`.`]}),`
`,(0,S.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,S.jsx)(i,{})]})}function x(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,S.jsx)(t,{...e,children:(0,S.jsx)(b,{...e})}):b(e)}var S;e((()=>{S=t(),s(),r(),v()}))();export{x as default};