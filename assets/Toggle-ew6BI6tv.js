import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BAOfLV0X.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,Disabled as u,Loading as d,Pressed as f,Sizes as p,n as m,t as h}from"./Toggle.stories-kk13c5zA.js";function g(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{of:h,summary:`A binary choice with an accessible pressed state.`}),`
`,(0,v.jsx)(t.h1,{id:`toggle`,children:`Toggle`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`Toggle`}),` represents an on/off choice as a button. Its pressed state is exposed
with `,(0,v.jsx)(t.code,{children:`aria-pressed`}),`. Use a `,(0,v.jsx)(t.code,{children:`Checkbox`}),` when the choice belongs in a form.`]}),`
`,(0,v.jsx)(a,{of:l}),`
`,(0,v.jsx)(t.h2,{id:`pressed-state`,children:`Pressed state`}),`
`,(0,v.jsxs)(t.p,{children:[`Use `,(0,v.jsx)(t.code,{children:`defaultPressed`}),` for an uncontrolled toggle, or `,(0,v.jsx)(t.code,{children:`pressed`}),` and `,(0,v.jsx)(t.code,{children:`onChange`}),` when
the application owns the state. The callback receives the next pressed value.
Choose one of these state approaches for each toggle.`]}),`
`,(0,v.jsx)(a,{of:f}),`
`,(0,v.jsx)(a,{of:c}),`
`,(0,v.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,v.jsxs)(t.p,{children:[`Set `,(0,v.jsx)(t.code,{children:`loading`}),` while saving a choice. A skeleton replaces the visible label while
the button keeps its name and width. Activation resumes when loading clears.`]}),`
`,(0,v.jsx)(a,{of:d}),`
`,(0,v.jsx)(t.h2,{id:`sizes-and-disabled-state`,children:`Sizes and disabled state`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`size`}),` accepts `,(0,v.jsx)(t.code,{children:`sm`}),`, `,(0,v.jsx)(t.code,{children:`md`}),` (default) or `,(0,v.jsx)(t.code,{children:`lg`}),`, with minimum heights of 34, 38 and
52px. Touch targets are at least 44px. Disabled toggles cannot be
activated.`]}),`
`,(0,v.jsx)(a,{of:p}),`
`,(0,v.jsx)(a,{of:u}),`
`,(0,v.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,v.jsxs)(t.p,{children:[`The visible label names the button. `,(0,v.jsx)(t.code,{children:`aria-label`}),`, `,(0,v.jsx)(t.code,{children:`aria-labelledby`}),` and
`,(0,v.jsx)(t.code,{children:`aria-describedby`}),` support alternate and supplemental names. The button exposes
its pressed state and supports keyboard activation.`]}),`
`,(0,v.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,v.jsx)(i,{})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;e((()=>{v=t(),s(),r(),m()}))();export{_ as default};