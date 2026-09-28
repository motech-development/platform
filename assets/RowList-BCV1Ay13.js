import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-FOXUBqUn.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Empty as l,InitialLoading as u,Loading as d,Merging as f,RetainedLoading as p,n as m,t as h}from"./RowList.stories-CLiM9yyl.js";function g(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(o,{of:h,summary:`A keyboard-accessible list of aligned, actionable rows.`}),`
`,(0,v.jsx)(t.h1,{id:`rowlist`,children:`RowList`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`RowList`}),` displays data as actionable rows with aligned leading, metadata and
trailing regions. It uses grid-list semantics and has no column headers.`]}),`
`,(0,v.jsx)(a,{of:c}),`
`,(0,v.jsx)(t.h2,{id:`describe-each-row`,children:`Describe each row`}),`
`,(0,v.jsxs)(t.p,{children:[`Pass application values through `,(0,v.jsx)(t.code,{children:`items`}),` and return a closed
`,(0,v.jsx)(t.code,{children:`RowListItemDescriptor`}),` from `,(0,v.jsx)(t.code,{children:`getItem`}),`. Each descriptor has a stable `,(0,v.jsx)(t.code,{children:`id`}),` and a
visible `,(0,v.jsx)(t.code,{children:`label`}),`. It may also include a `,(0,v.jsx)(t.code,{children:`description`}),`, `,(0,v.jsx)(t.code,{children:`icon`}),`, `,(0,v.jsx)(t.code,{children:`badge`}),`, or
`,(0,v.jsx)(t.code,{children:`disabled`}),` state. `,(0,v.jsx)(t.code,{children:`metadata`}),` accepts text or an ISO calendar date. `,(0,v.jsx)(t.code,{children:`value`}),`
accepts text or a currency amount, formatted with the provider locale.`]}),`
`,(0,v.jsxs)(t.p,{children:[`Use the optional `,(0,v.jsx)(t.code,{children:`section`}),` object to group rows under structural section
headers. Keep each section ID stable when rows are appended or merged. Keep row
IDs unique and stable so the focused row remains mounted as data changes.`]}),`
`,(0,v.jsx)(t.h2,{id:`activate-rows`,children:`Activate rows`}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`onAction`}),` receives the activated row's descriptor. React Aria supplies the
grid-list keyboard interaction; use the arrow keys to move between rows and
Enter or Space to activate the focused row.`]}),`
`,(0,v.jsx)(a,{of:f}),`
`,(0,v.jsx)(t.h2,{id:`loading-and-empty-results`,children:`Loading and empty results`}),`
`,(0,v.jsxs)(t.p,{children:[`Set the top-level `,(0,v.jsx)(t.code,{children:`loading`}),` flag while fetching initial data or refreshing. An
empty grid shows three quiet skeleton rows and one loading announcement. A
populated grid keeps its rows and focus while loading, with the announcement
outside the grid.`]}),`
`,(0,v.jsx)(a,{of:u}),`
`,(0,v.jsx)(a,{of:p}),`
`,(0,v.jsx)(t.p,{children:`Completed empty results display the provider-localized “No items to display.”
message inside the structural grid row and cell. The single persistent polite
status announces the same message.`}),`
`,(0,v.jsx)(a,{of:l}),`
`,(0,v.jsxs)(t.p,{children:[(0,v.jsx)(t.code,{children:`RowListItemDescriptor.loading`}),` only replaces a row's optional metadata and
value with quiet placeholders; its label, description, icon, badge, and action
remain. The Loading example shows this state alongside a separately busy named
pagination button.`]}),`
`,(0,v.jsx)(a,{of:d}),`
`,(0,v.jsxs)(t.p,{children:[`Pass a named `,(0,v.jsx)(t.code,{children:`loadMore`}),` action when another page is available. Its button keeps
its label while busy, and its status shares the single live loading message
without re-announcing existing rows.`]}),`
`,(0,v.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,v.jsx)(i,{})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;e((()=>{v=t(),s(),r(),m()}))();export{_ as default};