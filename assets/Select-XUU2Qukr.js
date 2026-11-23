import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Blur as c,Controlled as l,Default as u,Description as d,Disabled as f,Error as p,Loading as m,ReadOnly as h,SelectedBadge as g,n as _,t as v}from"./Select.stories-BpTUovqg.js";function y(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o,{of:v,summary:`A fixed-choice field with a popover listbox.`}),`
`,(0,x.jsx)(t.h1,{id:`select`,children:`Select`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`Select`}),` lets people choose one option from a fixed list, shown in a popover
when they press the field. It works with browser forms and autofill.`]}),`
`,(0,x.jsx)(a,{of:u}),`
`,(0,x.jsx)(t.h2,{id:`options`,children:`Options`}),`
`,(0,x.jsxs)(t.p,{children:[`Pass your data as `,(0,x.jsx)(t.code,{children:`items`}),` and a `,(0,x.jsx)(t.code,{children:`getItem`}),` function that describes each item.
`,(0,x.jsx)(t.code,{children:`getItem`}),` returns an `,(0,x.jsx)(t.code,{children:`ItemDescriptor`}),`:`]}),`
`,(0,x.jsxs)(t.ul,{children:[`
`,(0,x.jsxs)(t.li,{children:[(0,x.jsx)(t.code,{children:`id`}),` and `,(0,x.jsx)(t.code,{children:`label`}),` are required.`]}),`
`,(0,x.jsxs)(t.li,{children:[(0,x.jsx)(t.code,{children:`description`}),`, `,(0,x.jsx)(t.code,{children:`icon`}),`, `,(0,x.jsx)(t.code,{children:`badge`}),` and `,(0,x.jsx)(t.code,{children:`disabled`}),` are optional.`]}),`
`]}),`
`,(0,x.jsx)(t.p,{children:`Options show only this content; you cannot pass custom JSX, class names or
styles.`}),`
`,(0,x.jsx)(a,{of:d}),`
`,(0,x.jsx)(t.h2,{id:`selected-badge`,children:`Selected badge`}),`
`,(0,x.jsx)(t.p,{children:`When the selected item has a badge, the field shows it after the label. Screen
readers announce the badge as part of the value, as they do for the option.`}),`
`,(0,x.jsx)(a,{of:g}),`
`,(0,x.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`required`}),` and `,(0,x.jsx)(t.code,{children:`disabled`}),` behave as they do on a native form control. Set
`,(0,x.jsx)(t.code,{children:`readOnly`}),` to prevent the choice from changing; the field stays focusable and
its value is still submitted with the form. Pass a non-empty `,(0,x.jsx)(t.code,{children:`error`}),` to mark
the field invalid and show the message; there is no separate `,(0,x.jsx)(t.code,{children:`invalid`}),` prop.`]}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`loading`}),` while the value is not yet available. The field keeps its shape
and cannot be changed until loading ends.`]}),`
`,(0,x.jsx)(a,{of:p}),`
`,(0,x.jsx)(a,{of:f}),`
`,(0,x.jsx)(a,{of:h}),`
`,(0,x.jsx)(a,{of:m}),`
`,(0,x.jsx)(t.h2,{id:`controlled`,children:`Controlled`}),`
`,(0,x.jsxs)(t.p,{children:[`To control the value, pass both `,(0,x.jsx)(t.code,{children:`value`}),` and `,(0,x.jsx)(t.code,{children:`onChange`}),`. `,(0,x.jsx)(t.code,{children:`onChange`}),` receives the
selected item from `,(0,x.jsx)(t.code,{children:`items`}),`, or `,(0,x.jsx)(t.code,{children:`null`}),`, not a DOM event. For an uncontrolled
field, pass `,(0,x.jsx)(t.code,{children:`defaultValue`}),` and optionally `,(0,x.jsx)(t.code,{children:`onChange`}),`. Controlled and
uncontrolled props cannot be combined.`]}),`
`,(0,x.jsx)(a,{of:l}),`
`,(0,x.jsx)(t.h2,{id:`blur`,children:`Blur`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`onBlur`}),` reports that focus has left the field, for example to show a
validation error only once the user has moved on. Like `,(0,x.jsx)(t.code,{children:`onChange`}),`, it receives
no DOM event. It reports once when focus leaves the whole field: opening the
listbox and choosing an option do not count.`]}),`
`,(0,x.jsx)(a,{of:c}),`
`,(0,x.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,x.jsx)(t.p,{children:`The visible label names the field, and screen readers announce the description
and any error with it. The list can be opened and an option chosen entirely
with the keyboard, and focus moves between the field and the list
automatically.`}),`
`,(0,x.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,x.jsx)(i,{})]})}function b(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,x.jsx)(t,{...e,children:(0,x.jsx)(y,{...e})}):y(e)}var x;e((()=>{x=t(),s(),r(),_()}))();export{b as default};