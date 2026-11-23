import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Blur as c,Controlled as l,Default as u,Description as d,Disabled as f,Error as p,Loading as m,ReadOnly as h,Required as g,n as _,t as v}from"./TextField.stories-DT9iQoJN.js";function y(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o,{of:v,summary:`A flat labelled text input with accessible validation.`}),`
`,(0,x.jsx)(t.h1,{id:`textfield`,children:`TextField`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`TextField`}),` is a single-line text input with a label. Pass `,(0,x.jsx)(t.code,{children:`label`}),`, and
optionally `,(0,x.jsx)(t.code,{children:`description`}),` and `,(0,x.jsx)(t.code,{children:`error`}),`, as props; there are no separate field
parts to assemble.`]}),`
`,(0,x.jsx)(a,{of:u}),`
`,(0,x.jsx)(t.h2,{id:`description-and-errors`,children:`Description and errors`}),`
`,(0,x.jsxs)(t.p,{children:[`Use `,(0,x.jsx)(t.code,{children:`description`}),` for guidance about what to enter. Pass a non-empty `,(0,x.jsx)(t.code,{children:`error`}),`
to mark the field invalid and show the message; there is no separate `,(0,x.jsx)(t.code,{children:`invalid`}),`
prop.`]}),`
`,(0,x.jsx)(a,{of:d}),`
`,(0,x.jsx)(a,{of:p}),`
`,(0,x.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`required`}),`, `,(0,x.jsx)(t.code,{children:`disabled`}),` and `,(0,x.jsx)(t.code,{children:`readOnly`}),` behave as they do on a native input.`]}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`loading`}),` while the value is not yet available. The field keeps its shape,
screen readers announce the provider's loading message, and the field cannot be
edited until loading ends.`]}),`
`,(0,x.jsx)(a,{of:g}),`
`,(0,x.jsx)(a,{of:f}),`
`,(0,x.jsx)(a,{of:h}),`
`,(0,x.jsx)(a,{of:m}),`
`,(0,x.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,x.jsxs)(t.p,{children:[`To control the value, pass both `,(0,x.jsx)(t.code,{children:`value`}),` and `,(0,x.jsx)(t.code,{children:`onChange`}),`. `,(0,x.jsx)(t.code,{children:`onChange`}),` receives the
new string, not a DOM event. For an uncontrolled field, pass `,(0,x.jsx)(t.code,{children:`defaultValue`}),` and
optionally `,(0,x.jsx)(t.code,{children:`onChange`}),`. Controlled and uncontrolled props cannot be combined.`]}),`
`,(0,x.jsx)(a,{of:l}),`
`,(0,x.jsx)(t.h2,{id:`blur`,children:`Blur`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`onBlur`}),` reports that focus has left the field, for example to show a
validation error only once the user has moved on. Like `,(0,x.jsx)(t.code,{children:`onChange`}),`, it receives
no DOM event.`]}),`
`,(0,x.jsx)(a,{of:c}),`
`,(0,x.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,x.jsxs)(t.p,{children:[`The visible label names the input, and screen readers announce the description
and any error with it. Use `,(0,x.jsx)(t.code,{children:`ref`}),` to reach the native input, for example to
focus it.`]}),`
`,(0,x.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,x.jsx)(i,{})]})}function b(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,x.jsx)(t,{...e,children:(0,x.jsx)(y,{...e})}):y(e)}var x;e((()=>{x=t(),s(),r(),_()}))();export{b as default};