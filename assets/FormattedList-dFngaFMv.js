import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Disjunction as c,n as l,t as u}from"./FormattedList.stories-BSzGoNiK.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Locale-aware inline joining of ordered text values with Intl.ListFormat conjunction, disjunction, style and punctuation rules from BreezeProvider locale.`}),`
`,(0,p.jsx)(t.h1,{id:`formattedlist`,children:`FormattedList`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FormattedList`}),` joins an ordered set of text values using locale-appropriate punctuation and conjunction or disjunction wording.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FormattedList } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FormattedList`}),` for a short inline phrase such as “PDF, JPG and PNG”. Use semantic `,(0,p.jsx)(t.code,{children:`List`}),` for a structural list that users should navigate item by item, or collection components for selection and interaction. Do not use commas or a hard-coded English “and” to join translated values.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FormattedList } from '@motech-development/breeze-ui';

<FormattedList
  values={['Email', 'telephone', 'post']}
  options={{ type: 'disjunction' }}
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`behaviour-accessibility-and-internationalisation`,children:`Behaviour, accessibility, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`values`}),` is an ordered array of already translated strings. `,(0,p.jsx)(t.code,{children:`Intl.ListFormat`}),` supplies separators and the final conjunction from the provider BCP 47 locale. `,(0,p.jsx)(t.code,{children:`options.type`}),` is `,(0,p.jsx)(t.code,{children:`'conjunction'`}),` or `,(0,p.jsx)(t.code,{children:`'disjunction'`}),`; `,(0,p.jsx)(t.code,{children:`options.style`}),` is `,(0,p.jsx)(t.code,{children:`'long'`}),`, `,(0,p.jsx)(t.code,{children:`'short'`}),` or `,(0,p.jsx)(t.code,{children:`'narrow'`}),`. Runtime defaults are conjunction and long style.`]}),`
`,(0,p.jsxs)(t.p,{children:[`An empty array renders an empty `,(0,p.jsx)(t.code,{children:`<span>`}),` and one item renders that item without a separator. Decide an application fallback for empty data. This formatter is stateless: it has no controlled, loading, disabled, invalid, callback or keyboard behaviour.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The `,(0,p.jsx)(t.code,{children:`<span>`}),` is inline prose, not an HTML list. Assistive technology reads its localised text in context. Keep items concise, preserve meaningful source order, and use a semantic list when item boundaries matter. Direction is inherited and punctuation follows locale.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass React elements, translate the final joined string, split values on commas, or use this as a navigable list. Use `,(0,p.jsx)(t.code,{children:`List`}),` for semantic rows, `,(0,p.jsx)(t.code,{children:`FormattedNumber`}),` for locale-aware numeric values, and `,(0,p.jsx)(t.code,{children:`Typography`}),` to control surrounding prose hierarchy.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};