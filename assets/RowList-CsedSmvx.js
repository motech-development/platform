import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Activity as c,Default as l,Empty as u,InitialLoading as d,Loading as f,Merging as p,Money as m,Phone as h,RetainedLoading as g,n as _,t as v}from"./RowList.stories-CMWBh3JC.js";function y(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o,{of:v,summary:`A keyboard-accessible list of aligned, actionable rows.`}),`
`,(0,x.jsx)(t.h1,{id:`rowlist`,children:`RowList`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`RowList`}),` displays data as actionable rows with aligned leading, metadata and
trailing regions. It uses grid-list semantics and has no column headers.`]}),`
`,(0,x.jsx)(a,{of:l}),`
`,(0,x.jsx)(t.h2,{id:`describe-each-row`,children:`Describe each row`}),`
`,(0,x.jsxs)(t.p,{children:[`Pass application values through `,(0,x.jsx)(t.code,{children:`items`}),` and return a closed
`,(0,x.jsx)(t.code,{children:`RowListItemDescriptor`}),` from `,(0,x.jsx)(t.code,{children:`getItem`}),`. Each descriptor has a stable `,(0,x.jsx)(t.code,{children:`id`}),` and a
visible `,(0,x.jsx)(t.code,{children:`label`}),`. It may also include a `,(0,x.jsx)(t.code,{children:`description`}),`, `,(0,x.jsx)(t.code,{children:`icon`}),`, `,(0,x.jsx)(t.code,{children:`badge`}),`, or
`,(0,x.jsx)(t.code,{children:`disabled`}),` state. `,(0,x.jsx)(t.code,{children:`metadata`}),` accepts text or an ISO calendar date. `,(0,x.jsx)(t.code,{children:`value`}),`
accepts text or a currency amount, formatted with the provider locale. A
currency `,(0,x.jsx)(t.code,{children:`value`}),` is passed to `,(0,x.jsx)(t.code,{children:`Typography`}),`, so a non-finite amount or a
malformed currency code throws a `,(0,x.jsx)(t.code,{children:`RangeError`}),` when the row displays its value.`]}),`
`,(0,x.jsxs)(t.p,{children:[`Use the optional `,(0,x.jsx)(t.code,{children:`section`}),` object to group rows under structural section
headers. Keep each section ID stable when rows are appended or merged. Keep row
IDs unique and stable so the focused row remains mounted as data changes.`]}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`metadataAmount`}),` adds a second, muted currency cell, such as VAT, between the
metadata and the value. It formats like a currency `,(0,x.jsx)(t.code,{children:`value`}),` without a tone.
Each metadata column and the value column is reserved only when at least one
row in the list uses it; otherwise the leading region extends into that space.`]}),`
`,(0,x.jsx)(t.h2,{id:`summarise-a-section`,children:`Summarise a section`}),`
`,(0,x.jsxs)(t.p,{children:[`Set the section's optional `,(0,x.jsx)(t.code,{children:`summary`}),` to end its header with trailing content,
read from the first row in each section. A currency summary takes the same
fields as a currency `,(0,x.jsx)(t.code,{children:`value`}),`, shown at the header's 12px size, plus a `,(0,x.jsx)(t.code,{children:`label`}),`
that is visually hidden and read before the amount, such as “Confirmed daily
total”. Breeze does not add the amounts up; pass the total with its `,(0,x.jsx)(t.code,{children:`tone`}),` and
`,(0,x.jsx)(t.code,{children:`sign`}),`. A text summary shows a muted note instead, such as “Not in the balance
yet” for a section that has no total.`]}),`
`,(0,x.jsx)(a,{of:m}),`
`,(0,x.jsx)(t.h2,{id:`phone-layout`,children:`Phone layout`}),`
`,(0,x.jsx)(t.p,{children:`Below Breeze's medium breakpoint the value stays at the end of the row, the
metadata columns are hidden, and a row's badge moves under its description so
the label keeps the full width. Keep anything essential in the label,
description or value.`}),`
`,(0,x.jsx)(a,{of:h}),`
`,(0,x.jsx)(t.h2,{id:`show-money-in-and-out`,children:`Show money in and out`}),`
`,(0,x.jsxs)(t.p,{children:[`Currency values use the compact `,(0,x.jsx)(t.code,{children:`amount`}),` role in the default ink tone. Set
`,(0,x.jsx)(t.code,{children:`tone: 'positive'`}),` on money in and `,(0,x.jsx)(t.code,{children:`sign: 'always'`}),` to show an explicit `,(0,x.jsx)(t.code,{children:`+`}),` or
true minus; `,(0,x.jsx)(t.code,{children:`sign`}),` follows `,(0,x.jsx)(t.code,{children:`Typography`}),`. Set the row's `,(0,x.jsx)(t.code,{children:`direction`}),` to `,(0,x.jsx)(t.code,{children:`in`}),` or
`,(0,x.jsx)(t.code,{children:`out`}),` to give its icon tile the positive or strong wash, and pair it with the
`,(0,x.jsx)(t.code,{children:`incoming`}),` or `,(0,x.jsx)(t.code,{children:`outgoing`}),` icon. Without `,(0,x.jsx)(t.code,{children:`direction`}),` the tile is neutral. Colour
is never the only signal: the sign and icon also carry the direction.`]}),`
`,(0,x.jsx)(a,{of:c}),`
`,(0,x.jsx)(t.h2,{id:`activate-rows`,children:`Activate rows`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`onAction`}),` receives the activated row's application item from `,(0,x.jsx)(t.code,{children:`items`}),`, as
`,(0,x.jsx)(t.code,{children:`Select`}),`, `,(0,x.jsx)(t.code,{children:`ComboBox`}),` and `,(0,x.jsx)(t.code,{children:`ToggleGroup`}),` do. React Aria supplies the
grid-list keyboard interaction; use the arrow keys to move between rows and
Enter or Space to activate the focused row.`]}),`
`,(0,x.jsx)(a,{of:p}),`
`,(0,x.jsx)(t.h2,{id:`loading-and-empty-results`,children:`Loading and empty results`}),`
`,(0,x.jsxs)(t.p,{children:[`Set the top-level `,(0,x.jsx)(t.code,{children:`loading`}),` flag while fetching initial data or refreshing. An
empty grid shows three quiet skeleton rows and one loading announcement. A
populated grid keeps its rows and focus while loading, with the announcement
outside the grid.`]}),`
`,(0,x.jsx)(a,{of:d}),`
`,(0,x.jsx)(a,{of:g}),`
`,(0,x.jsx)(t.p,{children:`Completed empty results display the provider-localized “No items to display.”
message inside the structural grid row and cell. The single persistent polite
status announces the same message.`}),`
`,(0,x.jsx)(a,{of:u}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`RowListItemDescriptor.loading`}),` only replaces a row's optional metadata and
value with quiet placeholders; its label, description, icon, badge, and action
remain. The Loading example shows this state alongside a separately busy named
pagination button.`]}),`
`,(0,x.jsx)(a,{of:f}),`
`,(0,x.jsxs)(t.p,{children:[`Pass a named `,(0,x.jsx)(t.code,{children:`loadMore`}),` action when another page is available. Its button keeps
its label while busy, and its status shares the single live loading message
without re-announcing existing rows.`]}),`
`,(0,x.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,x.jsx)(i,{})]})}function b(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,x.jsx)(t,{...e,children:(0,x.jsx)(y,{...e})}):y(e)}var x;e((()=>{x=t(),s(),r(),_()}))();export{b as default};