import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Activity as c,Default as l,Empty as u,InitialLoading as d,Initials as f,Loading as p,Merging as m,Money as h,Phone as g,RetainedLoading as _,StaticRows as v,TextColumns as y,TextColumnsPhone as b,Unread as x,n as S,t as C}from"./RowList.stories-BvShs7Vq.js";function w(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(o,{of:C,summary:`A keyboard-accessible list of aligned rows that are actions or hold their own action.`}),`
`,(0,E.jsx)(t.h1,{id:`rowlist`,children:`RowList`}),`
`,(0,E.jsxs)(t.p,{children:[(0,E.jsx)(t.code,{children:`RowList`}),` displays data as a list of rows, such as transactions or reports.
Each row is either an action itself or a static row with its own trailing
action. Each row has a leading label, optional metadata and
a trailing value, aligned in columns across the list.`]}),`
`,(0,E.jsx)(a,{of:l}),`
`,(0,E.jsx)(t.h2,{id:`row-content`,children:`Row content`}),`
`,(0,E.jsxs)(t.p,{children:[`Pass your data as `,(0,E.jsx)(t.code,{children:`items`}),` and a `,(0,E.jsx)(t.code,{children:`getItem`}),` function that returns a
`,(0,E.jsx)(t.code,{children:`RowListItemDescriptor`}),` for each item:`]}),`
`,(0,E.jsxs)(t.ul,{children:[`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`id`}),` and `,(0,E.jsx)(t.code,{children:`label`}),` are required. Keep each `,(0,E.jsx)(t.code,{children:`id`}),` unique and stable, so the
focused row stays in place when the data changes.`]}),`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`description`}),`, `,(0,E.jsx)(t.code,{children:`icon`}),`, `,(0,E.jsx)(t.code,{children:`badge`}),` and `,(0,E.jsx)(t.code,{children:`disabled`}),` are optional. `,(0,E.jsx)(t.code,{children:`badge`}),` takes a
list to show several badges in order, such as “No receipt” and a scheduled
date. Badges never wrap or shrink; the label truncates instead.`]}),`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`initials`}),` shows short initials, such as a client's or company's, in a brand
tile in place of `,(0,E.jsx)(t.code,{children:`icon`}),`. Set one or the other.`]}),`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`metadata`}),` takes text or an ISO calendar date, or a list of them for several
columns. Each column is 120px wide; set an entry's `,(0,E.jsx)(t.code,{children:`width`}),` to `,(0,E.jsx)(t.code,{children:`md`}),` (176px)
or `,(0,E.jsx)(t.code,{children:`lg`}),` (240px) for longer text such as an email address. A column takes the
widest `,(0,E.jsx)(t.code,{children:`width`}),` any row gives it.`]}),`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`narrowDescription`}),` replaces `,(0,E.jsx)(t.code,{children:`description`}),` below the `,(0,E.jsx)(t.code,{children:`md`}),` breakpoint, where
the metadata columns are hidden, so you can keep their content on phones.`]}),`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`value`}),` takes text or a currency amount, formatted in the provider's locale.
A currency `,(0,E.jsx)(t.code,{children:`value`}),` is formatted by `,(0,E.jsx)(t.code,{children:`Typography`}),`, so a non-finite amount or a
malformed currency code throws a `,(0,E.jsx)(t.code,{children:`RangeError`}),` when the row is displayed.`]}),`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`metadataAmount`}),` adds a second, muted currency column, such as VAT, between
the metadata and the value. It is formatted like a currency `,(0,E.jsx)(t.code,{children:`value`}),`, without
`,(0,E.jsx)(t.code,{children:`tone`}),`.`]}),`
`]}),`
`,(0,E.jsx)(t.p,{children:`A metadata or value column takes up space only when at least one row in the
list uses it; otherwise the label extends into that space.`}),`
`,(0,E.jsx)(a,{of:f}),`
`,(0,E.jsx)(t.h2,{id:`sections`,children:`Sections`}),`
`,(0,E.jsxs)(t.p,{children:[`Give rows a `,(0,E.jsx)(t.code,{children:`section`}),` object to group them under section headers. Keep each
section `,(0,E.jsx)(t.code,{children:`id`}),` stable when rows are added or merged.`]}),`
`,(0,E.jsxs)(t.p,{children:[`Set the section's optional `,(0,E.jsx)(t.code,{children:`summary`}),` to show content at the end of its header.
The summary is read from the first row in each section:`]}),`
`,(0,E.jsxs)(t.ul,{children:[`
`,(0,E.jsxs)(t.li,{children:[`A currency summary takes the same fields as a currency `,(0,E.jsx)(t.code,{children:`value`}),`, shown at the
header's 12px size, plus a `,(0,E.jsx)(t.code,{children:`label`}),` that screen readers announce before the
amount, such as “Confirmed daily total”. The list does not add up the amounts
for you; pass the total with its `,(0,E.jsx)(t.code,{children:`tone`}),` and `,(0,E.jsx)(t.code,{children:`sign`}),`.`]}),`
`,(0,E.jsx)(t.li,{children:`A text summary shows a muted note instead, such as “Not in the balance yet”
for a section without a total.`}),`
`]}),`
`,(0,E.jsx)(a,{of:h}),`
`,(0,E.jsx)(t.h2,{id:`column-headings`,children:`Column headings`}),`
`,(0,E.jsxs)(t.p,{children:[`Pass `,(0,E.jsx)(t.code,{children:`headings`}),` to show a row of column headings above the list, as the
example above does. Give the leading column a `,(0,E.jsx)(t.code,{children:`label`}),`, and add `,(0,E.jsx)(t.code,{children:`metadata`}),`,
`,(0,E.jsx)(t.code,{children:`metadataAmount`}),`, `,(0,E.jsx)(t.code,{children:`value`}),` or `,(0,E.jsx)(t.code,{children:`action`}),` for the columns you want to name, with a
list for `,(0,E.jsx)(t.code,{children:`metadata`}),` when there are several metadata columns. Each heading uses
the same column as the rows, so it stays aligned at every width and hides below
the `,(0,E.jsx)(t.code,{children:`md`}),` breakpoint wherever its column does.`]}),`
`,(0,E.jsx)(t.p,{children:`A heading appears only above a column that at least one row uses. The
headings are hidden while the list has no rows. They are plain text, not table
headers.`}),`
`,(0,E.jsx)(t.h2,{id:`money-in-and-out`,children:`Money in and out`}),`
`,(0,E.jsxs)(t.p,{children:[`Currency values use the compact `,(0,E.jsx)(t.code,{children:`amount`}),` role from `,(0,E.jsx)(t.code,{children:`Typography`}),`, in the
default text colour. For money in, set `,(0,E.jsx)(t.code,{children:`tone: 'positive'`}),` and `,(0,E.jsx)(t.code,{children:`sign: 'always'`}),`
to show an explicit `,(0,E.jsx)(t.code,{children:`+`}),`; negative amounts use a true minus sign. `,(0,E.jsx)(t.code,{children:`sign`}),` works as
it does in `,(0,E.jsx)(t.code,{children:`Typography`}),`.`]}),`
`,(0,E.jsxs)(t.p,{children:[`Set a row's `,(0,E.jsx)(t.code,{children:`direction`}),` to `,(0,E.jsx)(t.code,{children:`in`}),` or `,(0,E.jsx)(t.code,{children:`out`}),` to colour its icon tile for money in
or out, and pair it with the `,(0,E.jsx)(t.code,{children:`incoming`}),` or `,(0,E.jsx)(t.code,{children:`outgoing`}),` icon. Without
`,(0,E.jsx)(t.code,{children:`direction`}),`, the tile is neutral. Colour is never the only signal: the sign and
icon also show the direction.`]}),`
`,(0,E.jsx)(a,{of:c}),`
`,(0,E.jsx)(t.h2,{id:`phone-layout`,children:`Phone layout`}),`
`,(0,E.jsxs)(t.p,{children:[`Below the `,(0,E.jsx)(t.code,{children:`md`}),` breakpoint, the value stays at the end of the row, the metadata
columns are hidden, and a row's badges move under its description so the label
keeps the full width. Keep anything essential in the label, description or
value, or repeat the hidden metadata in a `,(0,E.jsx)(t.code,{children:`narrowDescription`}),`.`]}),`
`,(0,E.jsx)(a,{of:g}),`
`,(0,E.jsx)(a,{of:y}),`
`,(0,E.jsx)(a,{of:b}),`
`,(0,E.jsx)(t.h2,{id:`row-actions`,children:`Row actions`}),`
`,(0,E.jsxs)(t.p,{children:[`With `,(0,E.jsx)(t.code,{children:`onAction`}),`, each row is an action, not a selection: the list keeps no
selection state. Activating a row calls `,(0,E.jsx)(t.code,{children:`onAction`}),` with that row's item from
`,(0,E.jsx)(t.code,{children:`items`}),`.`]}),`
`,(0,E.jsx)(a,{of:m}),`
`,(0,E.jsx)(t.h2,{id:`static-rows`,children:`Static rows`}),`
`,(0,E.jsxs)(t.p,{children:[`Omit `,(0,E.jsx)(t.code,{children:`onAction`}),` when the rows are not actions themselves, such as a list of
reports. `,(0,E.jsx)(t.code,{children:`getItem`}),` then returns a `,(0,E.jsx)(t.code,{children:`RowListStaticItemDescriptor`}),`, which has no
`,(0,E.jsx)(t.code,{children:`value`}),` or `,(0,E.jsx)(t.code,{children:`disabled`}),`, and can end in its own `,(0,E.jsx)(t.code,{children:`action`}),`:`]}),`
`,(0,E.jsxs)(t.ul,{children:[`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`{ label, onAction }`}),` renders a button.`]}),`
`,(0,E.jsxs)(t.li,{children:[(0,E.jsx)(t.code,{children:`{ label, href, download }`}),` renders a link, which can download a file. It
navigates through the provider's router like `,(0,E.jsx)(t.code,{children:`Link`}),`.`]}),`
`]}),`
`,(0,E.jsxs)(t.p,{children:[`Both use the small secondary button treatment, in a 120px column at the end
of the row. Name the column with `,(0,E.jsx)(t.code,{children:`headings.action`}),`. A static row's label wraps
instead of truncating.`]}),`
`,(0,E.jsx)(a,{of:v}),`
`,(0,E.jsx)(t.h3,{id:`unread-rows`,children:`Unread rows`}),`
`,(0,E.jsxs)(t.p,{children:[`Set `,(0,E.jsx)(t.code,{children:`unread`}),` on rows that have a read state, such as notifications. An unread
row shows a brand dot and a heavier label, and screen readers hear the
provider's “Unread” message before the label. A read row keeps the dot's
space, so labels stay aligned. Omit `,(0,E.jsx)(t.code,{children:`unread`}),` for rows without a read state.`]}),`
`,(0,E.jsx)(a,{of:x}),`
`,(0,E.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,E.jsxs)(t.p,{children:[`Set `,(0,E.jsx)(t.code,{children:`loading`}),` while fetching the first page of data or refreshing it:`]}),`
`,(0,E.jsxs)(t.ul,{children:[`
`,(0,E.jsx)(t.li,{children:`An empty list shows three placeholder rows, and screen readers hear a single
loading announcement.`}),`
`,(0,E.jsx)(t.li,{children:`A list that already has rows keeps them, along with the focused row, while
loading.`}),`
`]}),`
`,(0,E.jsx)(a,{of:d}),`
`,(0,E.jsx)(a,{of:_}),`
`,(0,E.jsxs)(t.p,{children:[`To show that a single row is still loading, set `,(0,E.jsx)(t.code,{children:`loading`}),` in its
`,(0,E.jsx)(t.code,{children:`RowListItemDescriptor`}),`. Its metadata and value are replaced with placeholders,
while its label, description, icon, badge and action stay available. This
example also shows a busy Load more button.`]}),`
`,(0,E.jsx)(a,{of:p}),`
`,(0,E.jsx)(t.h3,{id:`loading-more-rows`,children:`Loading more rows`}),`
`,(0,E.jsxs)(t.p,{children:[`Pass `,(0,E.jsx)(t.code,{children:`loadMore`}),` with a `,(0,E.jsx)(t.code,{children:`label`}),`, `,(0,E.jsx)(t.code,{children:`onAction`}),` and optional `,(0,E.jsx)(t.code,{children:`loading`}),` when another
page of data is available. Add a `,(0,E.jsx)(t.code,{children:`status`}),` to say what is loaded beside the
button, such as “Showing 11 transactions”, as the first example on this page
does. When your data has no total, count what is loaded rather than writing
“N of M”. The button keeps its label while busy, and screen
readers hear the same loading announcement as the list, without the existing
rows being read again.`]}),`
`,(0,E.jsx)(t.h2,{id:`empty-list`,children:`Empty list`}),`
`,(0,E.jsx)(t.p,{children:`When loading finishes with no rows, the list shows the provider's “No items to
display.” message, and screen readers announce it.`}),`
`,(0,E.jsx)(a,{of:u}),`
`,(0,E.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,E.jsxs)(t.p,{children:[`Give the list an `,(0,E.jsx)(t.code,{children:`aria-label`}),`, which is required. The list is a single Tab
stop: use the up and down arrow keys to move between rows, and Enter to
activate the focused row. In a static row, the right arrow key moves to the
row's action. Screen readers announce loading and empty states once,
through a single status message.`]}),`
`,(0,E.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,E.jsx)(i,{})]})}function T(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,E.jsx)(t,{...e,children:(0,E.jsx)(w,{...e})}):w(e)}var E;e((()=>{E=t(),s(),r(),S()}))();export{T as default};