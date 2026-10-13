import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Loading as c,Overview as l,Phone as u,n as d,t as f}from"./StatStrip.stories-3LC8JyLD.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Presents a few headline currency figures side by side in one panel.`}),`
`,(0,h.jsx)(t.h1,{id:`statstrip`,children:`StatStrip`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`StatStrip`}),` presents headline currency figures, such as a balance and the VAT
owed, as labelled cells in one panel. It reads as a named group containing a
description list, so each label is announced with its figure.`]}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.h2,{id:`describe-each-figure`,children:`Describe each figure`}),`
`,(0,h.jsxs)(t.p,{children:[`Pass application values through `,(0,h.jsx)(t.code,{children:`items`}),` and return a closed
`,(0,h.jsx)(t.code,{children:`StatStripItemDescriptor`}),` from `,(0,h.jsx)(t.code,{children:`getItem`}),`. Each descriptor has a stable `,(0,h.jsx)(t.code,{children:`id`}),`, a
visible `,(0,h.jsx)(t.code,{children:`label`}),`, and a `,(0,h.jsx)(t.code,{children:`value`}),` with its `,(0,h.jsx)(t.code,{children:`currency`}),`. The value is formatted by
`,(0,h.jsx)(t.code,{children:`Typography`}),`'s `,(0,h.jsx)(t.code,{children:`money`}),` role for the provider locale, with a minus sign for
negative amounts; a non-finite value or a malformed currency code throws a
`,(0,h.jsx)(t.code,{children:`RangeError`}),`.`]}),`
`,(0,h.jsxs)(t.p,{children:[`An optional `,(0,h.jsx)(t.code,{children:`badge`}),` follows the label to show the figure's scope, such as the
VAT scheme. It takes the same `,(0,h.jsx)(t.code,{children:`children`}),`, `,(0,h.jsx)(t.code,{children:`variant`}),` and `,(0,h.jsx)(t.code,{children:`aria-label`}),` fields as a
collection item's badge.`]}),`
`,(0,h.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,h.jsxs)(t.p,{children:[`Set `,(0,h.jsx)(t.code,{children:`loading`}),` to replace the figures with three skeleton cells shaped like the
labels and figures they stand in for. `,(0,h.jsx)(t.code,{children:`items`}),` and `,(0,h.jsx)(t.code,{children:`getItem`}),` are optional while
loading.`]}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(t.h2,{id:`phone-layout`,children:`Phone layout`}),`
`,(0,h.jsx)(t.p,{children:`Below Breeze's medium breakpoint the cells stack in one column, with a divider
above each cell after the first.`}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{of:l})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};