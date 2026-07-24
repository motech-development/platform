import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Currency as c,n as l,t as u}from"./FormattedNumber.stories-D7SXFR2J.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Locale-aware number, currency, percentage, unit or notation output for number and bigint values using Intl.NumberFormat and the BreezeProvider locale.`}),`
`,(0,p.jsx)(t.h1,{id:`formattednumber`,children:`FormattedNumber`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FormattedNumber`}),` renders a numeric value with locale-aware grouping, decimal symbols, signs, currency, units or notation.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FormattedNumber } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FormattedNumber`}),` for display values whose formatting must follow the provider locale. Formatting does not add domain meaning: specify currency, unit or percentage semantics explicitly.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`NumberField`}),` for numeric entry, `,(0,p.jsx)(t.code,{children:`Meter`}),` or `,(0,p.jsx)(t.code,{children:`ProgressBar`}),` for visualised bounded values, and plain text when the string is a stable identifier rather than a number.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FormattedNumber } from '@motech-development/breeze-ui';

<FormattedNumber
  value={1042.16}
  options={{ style: 'currency', currency: 'GBP' }}
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`precision-and-behaviour`,children:`Precision and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`value`}),` accepts a `,(0,p.jsx)(t.code,{children:`number`}),` or `,(0,p.jsx)(t.code,{children:`bigint`}),`; the component does not validate exceptional numeric values. Native `,(0,p.jsx)(t.code,{children:`Intl.NumberFormat`}),` behaviour applies to `,(0,p.jsx)(t.code,{children:`NaN`}),`, positive infinity and negative infinity. `,(0,p.jsx)(t.code,{children:`options`}),` is the native formatter contract. Important choices include `,(0,p.jsx)(t.code,{children:`style`}),`, `,(0,p.jsx)(t.code,{children:`currency`}),`, `,(0,p.jsx)(t.code,{children:`unit`}),`, `,(0,p.jsx)(t.code,{children:`notation`}),`, `,(0,p.jsx)(t.code,{children:`minimumFractionDigits`}),`, `,(0,p.jsx)(t.code,{children:`maximumFractionDigits`}),`, `,(0,p.jsx)(t.code,{children:`signDisplay`}),` and `,(0,p.jsx)(t.code,{children:`useGrouping`}),`. Runtime defaults use decimal style and locale-defined precision.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Percentage style formats `,(0,p.jsx)(t.code,{children:`1`}),` as 100%, so convert application ratios deliberately. Currency style requires an ISO 4217 `,(0,p.jsx)(t.code,{children:`currency`}),` code such as `,(0,p.jsx)(t.code,{children:`'GBP'`}),`; do not infer it from locale. Precision options affect display and rounding, not the source value.`]}),`
`,(0,p.jsxs)(t.p,{children:[`This component renders a stateless `,(0,p.jsx)(t.code,{children:`<span>`}),` with no input, controlled state, callbacks, loading, invalid, disabled or keyboard behaviour. Choose an application fallback for missing data instead of coercing it to zero.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-internationalisation`,children:`Accessibility and internationalisation`}),`
`,(0,p.jsx)(t.p,{children:`Assistive technology reads the localised text in its surrounding context. Include a visible label or nearby prose when the number’s meaning is unclear; do not rely on currency symbols or colour alone. Locale controls digits, grouping, signs, separators and placement. Direction is inherited.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass a preformatted string, infer currency from locale, treat a percentage as an already multiplied value, or use displayed rounding for calculations. Use `,(0,p.jsx)(t.code,{children:`NumberField`}),` for editing, `,(0,p.jsx)(t.code,{children:`FormattedList`}),` for joined prose and `,(0,p.jsx)(t.code,{children:`Meter`}),` for a bounded measurement visualisation.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};