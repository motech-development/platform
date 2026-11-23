import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Fixed as c,MainAside as l,Responsive as u,n as d,t as f}from"./Grid.stories-D-ZZuGlp.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Arranges content in equal or main-and-aside responsive columns.`}),`
`,(0,h.jsx)(t.h1,{id:`grid`,children:`Grid`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Grid`}),` arranges content in one, two or three equal columns, or in a main column beside an aside. Set `,(0,h.jsx)(t.code,{children:`columns`}),` to choose the layout (it defaults to `,(0,h.jsx)(t.code,{children:`2`}),`) and `,(0,h.jsx)(t.code,{children:`gap`}),` to choose the spacing from the Breeze spacing scale.`]}),`
`,(0,h.jsxs)(t.p,{children:[`By default, a multi-column grid collapses to a single column below the `,(0,h.jsx)(t.code,{children:`md`}),` breakpoint. Use `,(0,h.jsx)(t.code,{children:`collapseBelow`}),` to change the breakpoint.`]}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`fixed-columns`,children:`Fixed columns`}),`
`,(0,h.jsxs)(t.p,{children:[`Set `,(0,h.jsx)(t.code,{children:`collapseBelow="none"`}),` to keep the columns at every width. Use this only for content that still reads well on narrow screens.`]}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(t.h2,{id:`main-and-aside`,children:`Main and aside`}),`
`,(0,h.jsxs)(t.p,{children:[`Set `,(0,h.jsx)(t.code,{children:`columns="mainAside"`}),` for a page with a primary column and a supporting aside, such as a dashboard overview. Pass exactly two children: the main content first, then the aside.`]}),`
`,(0,h.jsxs)(t.p,{children:[`The aside is 300px wide and the main column fills the remaining space. Each column keeps its own height, so a short aside does not stretch to match the main column. Below `,(0,h.jsx)(t.code,{children:`md`}),`, the aside stacks under the main content; `,(0,h.jsx)(t.code,{children:`collapseBelow`}),` changes this breakpoint as it does for equal columns.`]}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Grid`}),` has no loading state of its own. Show loading inside each item, using components with a `,(0,h.jsx)(t.code,{children:`loading`}),` prop or a `,(0,h.jsx)(t.code,{children:`Skeleton`}),` sized like the final content.`]}),`
`,(0,h.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Grid`}),` changes the visual layout, not the reading order. Write children in the order they should be read.`]}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};