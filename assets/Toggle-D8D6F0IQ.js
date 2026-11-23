import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,Disabled as u,Loading as d,Pressed as f,Sizes as p,n as m,t as h}from"./Toggle.stories-DInrAkpo.js";function g(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{of:h,summary:`A binary choice with an accessible pressed state.`}),`
`,(0,v.jsx)(t.h1,{id:`toggle`,children:`Toggle`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`Toggle`}),` is a button that switches something on or off, such as a filter.
Use a `,(0,v.jsx)(t.code,{children:`Checkbox`}),` instead when the choice belongs in a form.`]}),`
`,(0,v.jsx)(a,{of:l}),`
`,(0,v.jsx)(t.h2,{id:`pressed-state`,children:`Pressed state`}),`
`,(0,v.jsxs)(t.p,{children:[`For an uncontrolled toggle, set `,(0,v.jsx)(t.code,{children:`defaultPressed`}),` to choose its starting state.
To control it from your own state, pass both `,(0,v.jsx)(t.code,{children:`pressed`}),` and `,(0,v.jsx)(t.code,{children:`onChange`}),`.
`,(0,v.jsx)(t.code,{children:`onChange`}),` receives the new pressed value. Controlled and uncontrolled props
cannot be combined.`]}),`
`,(0,v.jsx)(a,{of:f}),`
`,(0,v.jsx)(a,{of:c}),`
`,(0,v.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,v.jsxs)(t.p,{children:[`Set `,(0,v.jsx)(t.code,{children:`loading`}),` while saving a choice. A placeholder replaces the visible label,
and the button keeps its name and width. It cannot be pressed until loading
ends.`]}),`
`,(0,v.jsx)(a,{of:d}),`
`,(0,v.jsx)(t.h2,{id:`sizes`,children:`Sizes`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`size`}),` accepts `,(0,v.jsx)(t.code,{children:`sm`}),`, `,(0,v.jsx)(t.code,{children:`md`}),` (default) or `,(0,v.jsx)(t.code,{children:`lg`}),`, with minimum heights of 34, 38 and
52px. On touch devices, every size has a target of at least 44px.`]}),`
`,(0,v.jsx)(a,{of:p}),`
`,(0,v.jsx)(t.h2,{id:`disabled`,children:`Disabled`}),`
`,(0,v.jsxs)(t.p,{children:[`Set `,(0,v.jsx)(t.code,{children:`disabled`}),` to prevent the toggle from being pressed.`]}),`
`,(0,v.jsx)(a,{of:u}),`
`,(0,v.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,v.jsxs)(t.p,{children:[`The visible label names the button, and screen readers announce whether it is
pressed. Use `,(0,v.jsx)(t.code,{children:`aria-label`}),` or `,(0,v.jsx)(t.code,{children:`aria-labelledby`}),` to give it a different name, and
`,(0,v.jsx)(t.code,{children:`aria-describedby`}),` to add a description. Press Space or Enter to switch it.`]}),`
`,(0,v.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,v.jsx)(i,{})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;e((()=>{v=t(),s(),r(),m()}))();export{_ as default};