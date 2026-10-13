import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Disabled as l,n as u,t as d}from"./Calendar.stories-C2wqgGz_.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`A six-week, Monday-first calendar with ISO date values.`}),`
`,(0,m.jsx)(t.h1,{id:`calendar`,children:`Calendar`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Calendar`}),` renders a locale-aware calendar grid. The month heading sits at the
start of the header with the previous and next month controls together at the
end. Weeks begin on Monday, weekday columns use the provider locale's narrow
names, and each month uses six rows. Leading and trailing dates remain visible
in muted text. Selected dates use a brand fill; today uses a brand outline unless
it is selected.`]}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`states`,children:`States`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`disabled`}),` to prevent date changes.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,m.jsxs)(t.p,{children:[`Provide `,(0,m.jsx)(t.code,{children:`value`}),` and `,(0,m.jsx)(t.code,{children:`onChange`}),` for controlled usage. The callback receives an
ISO `,(0,m.jsx)(t.code,{children:`YYYY-MM-DD`}),` string, never a DOM event. Use `,(0,m.jsx)(t.code,{children:`defaultValue`}),` and an optional
`,(0,m.jsx)(t.code,{children:`onChange`}),` for uncontrolled usage; the two forms cannot be mixed.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[`The `,(0,m.jsx)(t.code,{children:`label`}),` names the calendar. React Aria provides keyboard navigation,
selection semantics and localized weekday and date names. Each date's accessible
name includes its full weekday, so the narrow column headings are not its only
cue. The selection fill keeps at least 3:1 contrast with the background in both
appearances, so the selected date needs no additional outline.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};