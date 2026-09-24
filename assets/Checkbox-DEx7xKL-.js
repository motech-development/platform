import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BudqKi8b.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,Description as u,Disabled as d,Error as f,Loading as p,ReadOnly as m,Required as h,n as g,t as _}from"./Checkbox.stories-BbU_i6dn.js";function v(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(o,{of:_,summary:`A flat labelled checkbox with semantic boolean changes.`}),`
`,(0,b.jsx)(t.h1,{id:`checkbox`,children:`Checkbox`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`Checkbox`}),` is a closed, labelled boolean control. Its label, optional
description and optional error are flat props, so applications do not need to
compose checkbox parts or provide an escape hatch.`]}),`
`,(0,b.jsx)(a,{of:l}),`
`,(0,b.jsx)(t.h2,{id:`supporting-text-and-errors`,children:`Supporting text and errors`}),`
`,(0,b.jsxs)(t.p,{children:[`Use `,(0,b.jsx)(t.code,{children:`description`}),` for guidance. A non-empty `,(0,b.jsx)(t.code,{children:`error`}),` marks the checkbox invalid
and associates the message with the native input. There is no separate invalid
prop.`]}),`
`,(0,b.jsx)(a,{of:u}),`
`,(0,b.jsx)(a,{of:f}),`
`,(0,b.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,b.jsxs)(t.p,{children:[(0,b.jsx)(t.code,{children:`required`}),`, `,(0,b.jsx)(t.code,{children:`disabled`}),` and `,(0,b.jsx)(t.code,{children:`readOnly`}),` map to the corresponding accessible input
semantics. `,(0,b.jsx)(t.code,{children:`loading`}),` keeps the checkbox's shape, announces the provider loading
message and prevents selection until it is removed.`]}),`
`,(0,b.jsx)(a,{of:h}),`
`,(0,b.jsx)(a,{of:d}),`
`,(0,b.jsx)(a,{of:m}),`
`,(0,b.jsx)(a,{of:p}),`
`,(0,b.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,b.jsxs)(t.p,{children:[`Provide both `,(0,b.jsx)(t.code,{children:`selected`}),` and `,(0,b.jsx)(t.code,{children:`onChange`}),` for controlled usage. The callback
receives the next boolean, never a DOM event. Use `,(0,b.jsx)(t.code,{children:`defaultSelected`}),` and an
optional `,(0,b.jsx)(t.code,{children:`onChange`}),` for uncontrolled usage; the two forms cannot be mixed.`]}),`
`,(0,b.jsx)(a,{of:c}),`
`,(0,b.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,b.jsxs)(t.p,{children:[`The visible label names the native checkbox. Descriptions and errors are
announced through React Aria's field relationships, and the field exposes its
native input through `,(0,b.jsx)(t.code,{children:`ref`}),`.`]}),`
`,(0,b.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,b.jsx)(i,{})]})}function y(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,b.jsx)(t,{...e,children:(0,b.jsx)(v,{...e})}):v(e)}var b;e((()=>{b=t(),s(),r(),g()}))();export{y as default};