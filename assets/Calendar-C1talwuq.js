import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Disabled as l,n as u,t as d}from"./Calendar.stories-C2wqgGz_.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`A six-week, Monday-first calendar with ISO date values.`}),`
`,(0,m.jsx)(t.h1,{id:`calendar`,children:`Calendar`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Calendar`}),` shows a month grid for picking a single date. To pick a date from a form field, use `,(0,m.jsx)(t.code,{children:`DatePicker`}),`.`]}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.p,{children:`The header shows the month with previous and next month buttons. Weeks start on Monday, and each month shows six rows, with dates from the neighbouring months in muted text. Weekday names use the provider locale. The selected date has a brand fill, and today has a brand outline unless it is selected.`}),`
`,(0,m.jsx)(t.h2,{id:`disabled`,children:`Disabled`}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`disabled`}),` to prevent the date from being changed.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,m.jsxs)(t.p,{children:[`Pass `,(0,m.jsx)(t.code,{children:`value`}),` and `,(0,m.jsx)(t.code,{children:`onChange`}),` to control the selected date. `,(0,m.jsx)(t.code,{children:`onChange`}),` receives an ISO `,(0,m.jsx)(t.code,{children:`YYYY-MM-DD`}),` string.`]}),`
`,(0,m.jsxs)(t.p,{children:[`For an uncontrolled calendar, use `,(0,m.jsx)(t.code,{children:`defaultValue`}),` with an optional `,(0,m.jsx)(t.code,{children:`onChange`}),`. Controlled and uncontrolled props cannot be combined.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`label`}),` names the calendar.`]}),`
`,(0,m.jsx)(t.li,{children:`Use the arrow keys to move between dates and Enter or Space to select one.`}),`
`,(0,m.jsx)(t.li,{children:`Each date is announced with its full weekday and date name in the provider locale.`}),`
`,(0,m.jsx)(t.li,{children:`The selected date's fill has at least 3:1 contrast with the background in both light and dark appearances.`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};