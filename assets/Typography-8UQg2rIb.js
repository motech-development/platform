import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{FiguresAndInterfaceText as c,Formatting as l,Loading as u,Roles as d,n as f,t as p}from"./Typography.stories-BrET9lkd.js";function m(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(o,{of:p,summary:`Applies Breeze text roles and locale-aware formatting.`}),`
`,(0,g.jsx)(t.h1,{id:`typography`,children:`Typography`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`Typography`}),` displays text in one of the Breeze text styles, called roles: `,(0,g.jsx)(t.code,{children:`money`}),`, `,(0,g.jsx)(t.code,{children:`amount`}),`, `,(0,g.jsx)(t.code,{children:`heading`}),`, `,(0,g.jsx)(t.code,{children:`title`}),`, `,(0,g.jsx)(t.code,{children:`body`}),`, `,(0,g.jsx)(t.code,{children:`caption`}),`, `,(0,g.jsx)(t.code,{children:`label`}),` and `,(0,g.jsx)(t.code,{children:`micro`}),`. It also formats currency amounts and dates for the provider's locale.`]}),`
`,(0,g.jsx)(a,{of:d}),`
`,(0,g.jsx)(t.h2,{id:`numeric-figures`,children:`Numeric figures`}),`
`,(0,g.jsxs)(t.p,{children:[`The `,(0,g.jsx)(t.code,{children:`money`}),` role is designed for figures: digits line up in columns and are spaced slightly tighter. Set `,(0,g.jsx)(t.code,{children:`numeric`}),` to give figures in any other role the same treatment; they are also aligned to the end of the line. Text without `,(0,g.jsx)(t.code,{children:`numeric`}),` keeps its normal spacing.`]}),`
`,(0,g.jsx)(a,{of:c}),`
`,(0,g.jsx)(t.h2,{id:`money-and-dates`,children:`Money and dates`}),`
`,(0,g.jsxs)(t.p,{children:[`Set `,(0,g.jsx)(t.code,{children:`format="currency"`}),` or `,(0,g.jsx)(t.code,{children:`format="date"`}),` and pass the raw value; it is formatted for the nearest `,(0,g.jsx)(t.code,{children:`BreezeProvider`}),` locale.`]}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[`Currency uses the `,(0,g.jsx)(t.code,{children:`money`}),` role for headline figures, or the `,(0,g.jsx)(t.code,{children:`amount`}),` role, a semibold body-size figure, for amounts in rows. The sign follows the locale's placement and uses a true minus character.`]}),`
`,(0,g.jsxs)(t.li,{children:[`Dates take an ISO calendar date string, typed as `,(0,g.jsx)(t.code,{children:`IsoCalendarDate`}),`, such as `,(0,g.jsx)(t.code,{children:`2026-03-14`}),`.`]}),`
`]}),`
`,(0,g.jsx)(a,{of:l}),`
`,(0,g.jsx)(t.h3,{id:`signs`,children:`Signs`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`sign`}),` controls the sign of a currency amount:`]}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`auto`}),` (default) shows a sign on negative amounts only.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`always`}),` also shows `,(0,g.jsx)(t.code,{children:`+`}),` on positive amounts.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`never`}),` hides the sign, for content that shows direction another way.`]}),`
`]}),`
`,(0,g.jsxs)(t.p,{children:[`Zero is never signed, including negative zero and amounts that round to zero, so `,(0,g.jsx)(t.code,{children:`-0.004`}),` displays as `,(0,g.jsx)(t.code,{children:`£0.00`}),`.`]}),`
`,(0,g.jsx)(t.h3,{id:`dates-and-time-zones`,children:`Dates and time zones`}),`
`,(0,g.jsxs)(t.p,{children:[`Calendar dates always display the day you pass, whatever the user's time zone. The provider's `,(0,g.jsx)(t.code,{children:`timeZone`}),` is not applied to them.`]}),`
`,(0,g.jsx)(t.h3,{id:`invalid-values`,children:`Invalid values`}),`
`,(0,g.jsxs)(t.p,{children:[`An invalid currency value throws a `,(0,g.jsx)(t.code,{children:`RangeError`}),` naming the problem, rather than displaying a misleading figure:`]}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`currency`}),` must be a well-formed three-letter code, such as `,(0,g.jsx)(t.code,{children:`GBP`}),`. Codes are
not checked against ISO 4217, so an unknown well-formed code is displayed as
written.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`value`}),` must be a finite number. `,(0,g.jsx)(t.code,{children:`NaN`}),` and `,(0,g.jsx)(t.code,{children:`Infinity`}),` are rejected.`]}),`
`,(0,g.jsxs)(t.li,{children:[`An invalid `,(0,g.jsx)(t.code,{children:`locale`}),` is rejected by `,(0,g.jsx)(t.code,{children:`BreezeProvider`}),` before any value is formatted, so it is never reported as a currency error.`]}),`
`]}),`
`,(0,g.jsxs)(t.p,{children:[`Validate or convert untrusted amounts before rendering them. A date that does not exist, such as `,(0,g.jsx)(t.code,{children:`2026-02-30`}),`, is displayed as written.`]}),`
`,(0,g.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,g.jsxs)(t.p,{children:[`Set `,(0,g.jsx)(t.code,{children:`loading`}),` while the value is not yet available. A placeholder keeps the text's place.`]}),`
`,(0,g.jsx)(a,{of:u}),`
`,(0,g.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,g.jsxs)(t.p,{children:[`Each role renders a default element: `,(0,g.jsx)(t.code,{children:`heading`}),` renders an `,(0,g.jsx)(t.code,{children:`h2`}),`, `,(0,g.jsx)(t.code,{children:`title`}),` an `,(0,g.jsx)(t.code,{children:`h3`}),`, `,(0,g.jsx)(t.code,{children:`body`}),` a `,(0,g.jsx)(t.code,{children:`p`}),` and the other roles a `,(0,g.jsx)(t.code,{children:`span`}),`. Set `,(0,g.jsx)(t.code,{children:`element`}),` to match your page structure, for example `,(0,g.jsx)(t.code,{children:`element="h1"`}),` for the page heading. Do not use colour alone to show direction or status.`]}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsx)(i,{})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;e((()=>{g=t(),s(),r(),f()}))();export{h as default};