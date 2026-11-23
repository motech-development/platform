import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Loading as c,OtherFigures as l,Overview as u,Phone as d,n as f,t as p}from"./StatStrip.stories-CoFVRmIN.js";function m(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(o,{of:p,summary:`Presents a few headline figures side by side in one panel.`}),`
`,(0,g.jsx)(t.h1,{id:`statstrip`,children:`StatStrip`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`StatStrip`}),` shows a few headline figures, such as a balance and the VAT owed, as labelled cells in one panel.`]}),`
`,(0,g.jsx)(a,{of:u}),`
`,(0,g.jsx)(t.h2,{id:`figures`,children:`Figures`}),`
`,(0,g.jsxs)(t.p,{children:[`Pass your data as `,(0,g.jsx)(t.code,{children:`items`}),`, and use `,(0,g.jsx)(t.code,{children:`getItem`}),` to return a `,(0,g.jsx)(t.code,{children:`StatStripItemDescriptor`}),` for each one:`]}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`id`}),`: a stable identifier;`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`label`}),`: the visible name of the figure;`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`value`}),` and `,(0,g.jsx)(t.code,{children:`currency`}),`: the amount and its ISO 4217 currency code;`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`badge`}),` (optional): a badge after the label showing the figure's scope, such as the VAT scheme. It accepts `,(0,g.jsx)(t.code,{children:`children`}),`, `,(0,g.jsx)(t.code,{children:`variant`}),` and `,(0,g.jsx)(t.code,{children:`aria-label`}),`.`]}),`
`]}),`
`,(0,g.jsxs)(t.p,{children:[`Amounts are formatted as currency for the provider locale, with a minus sign for negative amounts. A non-finite `,(0,g.jsx)(t.code,{children:`value`}),` or a malformed currency code, one that is not three letters, throws a `,(0,g.jsx)(t.code,{children:`RangeError`}),`. Codes are not checked against ISO 4217, so an unknown well-formed code is displayed as written. If you need to limit the currencies shown, validate the codes before passing them in.`]}),`
`,(0,g.jsx)(t.h2,{id:`other-figures`,children:`Other figures`}),`
`,(0,g.jsxs)(t.p,{children:[`Set `,(0,g.jsx)(t.code,{children:`format`}),` to show a figure that is not currency, without a `,(0,g.jsx)(t.code,{children:`currency`}),`:`]}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`date`}),`: an ISO calendar date, formatted as a long date for the provider locale;`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`number`}),`: a number formatted for the provider locale, such as a count of days;`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`text`}),`: short text, such as a VAT scheme name.`]}),`
`]}),`
`,(0,g.jsx)(t.p,{children:`These figures use a smaller size than currency amounts. You can mix them with currency figures in one strip.`}),`
`,(0,g.jsx)(a,{of:l}),`
`,(0,g.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,g.jsxs)(t.p,{children:[`Set `,(0,g.jsx)(t.code,{children:`loading`}),` to show three placeholder cells shaped like labels and figures. `,(0,g.jsx)(t.code,{children:`items`}),` and `,(0,g.jsx)(t.code,{children:`getItem`}),` are optional while loading.`]}),`
`,(0,g.jsx)(a,{of:c}),`
`,(0,g.jsx)(t.h2,{id:`phone-layout`,children:`Phone layout`}),`
`,(0,g.jsx)(t.p,{children:`Below 901px, the cells stack in a single column with a divider between them.`}),`
`,(0,g.jsx)(a,{of:d}),`
`,(0,g.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,g.jsxs)(t.p,{children:[`The panel is a group named by the required `,(0,g.jsx)(t.code,{children:`aria-label`}),`. Its figures form a description list, so screen readers announce each label with its figure.`]}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsx)(i,{of:u})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;e((()=>{g=t(),s(),r(),f()}))();export{h as default};