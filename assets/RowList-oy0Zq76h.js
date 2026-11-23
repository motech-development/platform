import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Activity as c,Default as l,Empty as u,InitialLoading as d,Loading as f,Merging as p,Money as m,Phone as h,RetainedLoading as g,n as _,t as v}from"./RowList.stories-CMWBh3JC.js";function y(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o,{of:v,summary:`A keyboard-accessible list of aligned, actionable rows.`}),`
`,(0,x.jsx)(t.h1,{id:`rowlist`,children:`RowList`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`RowList`}),` displays data as a list of rows that people can act on, such as
transactions or documents. Each row has a leading label, optional metadata and
a trailing value, aligned in columns across the list. The list has no column
headers.`]}),`
`,(0,x.jsx)(a,{of:l}),`
`,(0,x.jsx)(t.h2,{id:`row-content`,children:`Row content`}),`
`,(0,x.jsxs)(t.p,{children:[`Pass your data as `,(0,x.jsx)(t.code,{children:`items`}),` and a `,(0,x.jsx)(t.code,{children:`getItem`}),` function that returns a
`,(0,x.jsx)(t.code,{children:`RowListItemDescriptor`}),` for each item:`]}),`
`,(0,x.jsxs)(t.ul,{children:[`
`,(0,x.jsxs)(t.li,{children:[(0,x.jsx)(t.code,{children:`id`}),` and `,(0,x.jsx)(t.code,{children:`label`}),` are required. Keep each `,(0,x.jsx)(t.code,{children:`id`}),` unique and stable, so the
focused row stays in place when the data changes.`]}),`
`,(0,x.jsxs)(t.li,{children:[(0,x.jsx)(t.code,{children:`description`}),`, `,(0,x.jsx)(t.code,{children:`icon`}),`, `,(0,x.jsx)(t.code,{children:`badge`}),` and `,(0,x.jsx)(t.code,{children:`disabled`}),` are optional.`]}),`
`,(0,x.jsxs)(t.li,{children:[(0,x.jsx)(t.code,{children:`metadata`}),` takes text or an ISO calendar date.`]}),`
`,(0,x.jsxs)(t.li,{children:[(0,x.jsx)(t.code,{children:`value`}),` takes text or a currency amount, formatted in the provider's locale.
A currency `,(0,x.jsx)(t.code,{children:`value`}),` is formatted by `,(0,x.jsx)(t.code,{children:`Typography`}),`, so a non-finite amount or a
malformed currency code throws a `,(0,x.jsx)(t.code,{children:`RangeError`}),` when the row is displayed.`]}),`
`,(0,x.jsxs)(t.li,{children:[(0,x.jsx)(t.code,{children:`metadataAmount`}),` adds a second, muted currency column, such as VAT, between
the metadata and the value. It is formatted like a currency `,(0,x.jsx)(t.code,{children:`value`}),`, without
`,(0,x.jsx)(t.code,{children:`tone`}),`.`]}),`
`]}),`
`,(0,x.jsx)(t.p,{children:`A metadata or value column takes up space only when at least one row in the
list uses it; otherwise the label extends into that space.`}),`
`,(0,x.jsx)(t.h2,{id:`sections`,children:`Sections`}),`
`,(0,x.jsxs)(t.p,{children:[`Give rows a `,(0,x.jsx)(t.code,{children:`section`}),` object to group them under section headers. Keep each
section `,(0,x.jsx)(t.code,{children:`id`}),` stable when rows are added or merged.`]}),`
`,(0,x.jsxs)(t.p,{children:[`Set the section's optional `,(0,x.jsx)(t.code,{children:`summary`}),` to show content at the end of its header.
The summary is read from the first row in each section:`]}),`
`,(0,x.jsxs)(t.ul,{children:[`
`,(0,x.jsxs)(t.li,{children:[`A currency summary takes the same fields as a currency `,(0,x.jsx)(t.code,{children:`value`}),`, shown at the
header's 12px size, plus a `,(0,x.jsx)(t.code,{children:`label`}),` that screen readers announce before the
amount, such as “Confirmed daily total”. The list does not add up the amounts
for you; pass the total with its `,(0,x.jsx)(t.code,{children:`tone`}),` and `,(0,x.jsx)(t.code,{children:`sign`}),`.`]}),`
`,(0,x.jsx)(t.li,{children:`A text summary shows a muted note instead, such as “Not in the balance yet”
for a section without a total.`}),`
`]}),`
`,(0,x.jsx)(a,{of:m}),`
`,(0,x.jsx)(t.h2,{id:`money-in-and-out`,children:`Money in and out`}),`
`,(0,x.jsxs)(t.p,{children:[`Currency values use the compact `,(0,x.jsx)(t.code,{children:`amount`}),` role from `,(0,x.jsx)(t.code,{children:`Typography`}),`, in the
default text colour. For money in, set `,(0,x.jsx)(t.code,{children:`tone: 'positive'`}),` and `,(0,x.jsx)(t.code,{children:`sign: 'always'`}),`
to show an explicit `,(0,x.jsx)(t.code,{children:`+`}),`; negative amounts use a true minus sign. `,(0,x.jsx)(t.code,{children:`sign`}),` works as
it does in `,(0,x.jsx)(t.code,{children:`Typography`}),`.`]}),`
`,(0,x.jsxs)(t.p,{children:[`Set a row's `,(0,x.jsx)(t.code,{children:`direction`}),` to `,(0,x.jsx)(t.code,{children:`in`}),` or `,(0,x.jsx)(t.code,{children:`out`}),` to colour its icon tile for money in
or out, and pair it with the `,(0,x.jsx)(t.code,{children:`incoming`}),` or `,(0,x.jsx)(t.code,{children:`outgoing`}),` icon. Without
`,(0,x.jsx)(t.code,{children:`direction`}),`, the tile is neutral. Colour is never the only signal: the sign and
icon also show the direction.`]}),`
`,(0,x.jsx)(a,{of:c}),`
`,(0,x.jsx)(t.h2,{id:`phone-layout`,children:`Phone layout`}),`
`,(0,x.jsxs)(t.p,{children:[`Below the `,(0,x.jsx)(t.code,{children:`md`}),` breakpoint, the value stays at the end of the row, the metadata
columns are hidden, and a row's badge moves under its description so the label
keeps the full width. Keep anything essential in the label, description or
value.`]}),`
`,(0,x.jsx)(a,{of:h}),`
`,(0,x.jsx)(t.h2,{id:`row-actions`,children:`Row actions`}),`
`,(0,x.jsxs)(t.p,{children:[`Each row is an action, not a selection: the list keeps no selection state.
Activating a row calls `,(0,x.jsx)(t.code,{children:`onAction`}),` with that row's item from `,(0,x.jsx)(t.code,{children:`items`}),`.`]}),`
`,(0,x.jsx)(a,{of:p}),`
`,(0,x.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`loading`}),` while fetching the first page of data or refreshing it:`]}),`
`,(0,x.jsxs)(t.ul,{children:[`
`,(0,x.jsx)(t.li,{children:`An empty list shows three placeholder rows, and screen readers hear a single
loading announcement.`}),`
`,(0,x.jsx)(t.li,{children:`A list that already has rows keeps them, along with the focused row, while
loading.`}),`
`]}),`
`,(0,x.jsx)(a,{of:d}),`
`,(0,x.jsx)(a,{of:g}),`
`,(0,x.jsxs)(t.p,{children:[`To show that a single row is still loading, set `,(0,x.jsx)(t.code,{children:`loading`}),` in its
`,(0,x.jsx)(t.code,{children:`RowListItemDescriptor`}),`. Its metadata and value are replaced with placeholders,
while its label, description, icon, badge and action stay available. This
example also shows a busy Load more button.`]}),`
`,(0,x.jsx)(a,{of:f}),`
`,(0,x.jsx)(t.h3,{id:`loading-more-rows`,children:`Loading more rows`}),`
`,(0,x.jsxs)(t.p,{children:[`Pass `,(0,x.jsx)(t.code,{children:`loadMore`}),` with a `,(0,x.jsx)(t.code,{children:`label`}),`, `,(0,x.jsx)(t.code,{children:`onAction`}),` and optional `,(0,x.jsx)(t.code,{children:`loading`}),` when another
page of data is available. The button keeps its label while busy, and screen
readers hear the same loading announcement as the list, without the existing
rows being read again.`]}),`
`,(0,x.jsx)(t.h2,{id:`empty-list`,children:`Empty list`}),`
`,(0,x.jsx)(t.p,{children:`When loading finishes with no rows, the list shows the provider's “No items to
display.” message, and screen readers announce it.`}),`
`,(0,x.jsx)(a,{of:u}),`
`,(0,x.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,x.jsxs)(t.p,{children:[`Give the list an `,(0,x.jsx)(t.code,{children:`aria-label`}),`, which is required. The list is a single Tab
stop: use the arrow keys to move between rows, and Enter to activate the
focused row. Screen readers announce loading and empty states once,
through a single status message.`]}),`
`,(0,x.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,x.jsx)(i,{})]})}function b(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,x.jsx)(t,{...e,children:(0,x.jsx)(y,{...e})}):y(e)}var x;e((()=>{x=t(),s(),r(),_()}))();export{b as default};