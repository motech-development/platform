import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-Cc7JIfAL.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{FiguresAndInterfaceText as c,Formatting as l,Loading as u,Roles as d,n as f,t as p}from"./Typography.stories-CZKQT0_D.js";function m(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(o,{of:p,summary:`Applies Breeze text roles and locale-aware formatting.`}),`
`,(0,g.jsx)(t.h1,{id:`typography`,children:`Typography`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`Typography`}),` provides the money, heading, title, body, caption, label and micro roles. Money uses negative tracking and tabular numerals. Set `,(0,g.jsx)(t.code,{children:`numeric`}),` on other figure text; interface text retains normal tracking.`]}),`
`,(0,g.jsx)(a,{of:d}),`
`,(0,g.jsx)(t.h2,{id:`numeric-figures`,children:`Numeric figures`}),`
`,(0,g.jsxs)(t.p,{children:[`Set `,(0,g.jsx)(t.code,{children:`numeric`}),` on figures outside the money role. They gain tabular numerals, negative tracking and logical end alignment without tightening interface headings.`]}),`
`,(0,g.jsx)(a,{of:c}),`
`,(0,g.jsx)(t.h2,{id:`money-and-dates`,children:`Money and dates`}),`
`,(0,g.jsxs)(t.p,{children:[`Pass semantic values with `,(0,g.jsx)(t.code,{children:`format="currency"`}),` or `,(0,g.jsx)(t.code,{children:`format="date"`}),`. Dates use the exported `,(0,g.jsx)(t.code,{children:`IsoCalendarDate`}),` string contract. Formatting uses the nearest `,(0,g.jsx)(t.code,{children:`BreezeProvider`}),` locale. Currency signs retain that locale's placement and use a true minus character.`]}),`
`,(0,g.jsx)(a,{of:l}),`
`,(0,g.jsx)(t.p,{children:`No separate formatting components are exported.`}),`
`,(0,g.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,g.jsxs)(t.p,{children:[`Choose the `,(0,g.jsx)(t.code,{children:`element`}),` for document semantics; the visual role does not force a heading level. Do not use colour alone to communicate direction or status.`]}),`
`,(0,g.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,g.jsxs)(t.p,{children:[`Set `,(0,g.jsx)(t.code,{children:`loading`}),` to preserve the text's place while its value is unavailable.`]}),`
`,(0,g.jsx)(a,{of:u}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsx)(i,{})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;e((()=>{g=t(),s(),r(),f()}))();export{h as default};