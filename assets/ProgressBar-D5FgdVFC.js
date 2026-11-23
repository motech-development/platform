import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Steps as l,n as u,t as d}from"./ProgressBar.stories-CfwJx1AJ.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Shows how far a task has progressed towards a known total.`}),`
`,(0,m.jsx)(t.h1,{id:`progressbar`,children:`ProgressBar`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ProgressBar`}),` shows progress towards a known total, such as the items done in a queue or the current step of a form. For content that is still loading, use `,(0,m.jsx)(t.code,{children:`Skeleton`}),` instead.`]}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`value`,children:`Value`}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`value`}),` to the progress so far and `,(0,m.jsx)(t.code,{children:`maxValue`}),` to the total, which defaults to `,(0,m.jsx)(t.code,{children:`100`}),`. The bar fills in proportion.`]}),`
`,(0,m.jsx)(t.h2,{id:`value-text`,children:`Value text`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`valueLabel`}),` is required. It is shown above the bar, such as “3 of 7 done” or “Step 2 of 3 — Opening position”, and screen readers announce it instead of a percentage.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[`Give the bar an `,(0,m.jsx)(t.code,{children:`aria-label`}),` that names the task, such as “Paperwork”. Screen readers announce it as a progress bar with that name and the value text.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};