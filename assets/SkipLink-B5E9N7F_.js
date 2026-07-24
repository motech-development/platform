import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{KeyboardFocus as c,n as l,t as u}from"./SkipLink.stories-C1rWEod1.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A focus-revealed native fragment link that lets keyboard users bypass repeated page chrome.`}),`
`,(0,p.jsx)(t.h1,{id:`skiplink`,children:`SkipLink`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`SkipLink`}),` is the first keyboard destination on a page and moves users directly to its main content target.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { SkipLink } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use one near the beginning of every application shell with repeated navigation. It complements landmarks and headings; it is not a replacement for them. Use ordinary `,(0,p.jsx)(t.code,{children:`Link`}),` for visible navigation.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { SkipLink } from '@motech-development/breeze-ui';

<>
  <SkipLink targetId="main-content">Skip to main content</SkipLink>
  <header>{/* Repeated navigation */}</header>
  <main id="main-content" tabIndex={-1}>
    Page content
  </main>
</>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`behaviour`,children:`Behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`targetId`}),` is written without `,(0,p.jsx)(t.code,{children:`#`}),`; Breeze creates a native `,(0,p.jsx)(t.code,{children:`#fragment`}),` link. The matching target must exist and should be a meaningful landmark. Add `,(0,p.jsx)(t.code,{children:`tabIndex={-1}`}),` where the target is not naturally focusable so browsers can move focus consistently. The link is visually off-screen until focused and respects reduced-motion preferences.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-states`,children:`Native attributes and states`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native anchor attributes such as `,(0,p.jsx)(t.code,{children:`aria-*`}),`, `,(0,p.jsx)(t.code,{children:`data-*`}),`, and `,(0,p.jsx)(t.code,{children:`hreflang`}),` are supported. `,(0,p.jsx)(t.code,{children:`href`}),`, inline style, and click handlers are owned by Breeze. SkipLink has no disabled, loading, controlled, read-only, invalid, empty, or error state.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-internationalisation-and-mistakes`,children:`Accessibility, internationalisation, and mistakes`}),`
`,(0,p.jsx)(t.p,{children:`Place it before all repeated focusable chrome. Tab reveals and focuses it; Enter follows the fragment. Use a concise translated action such as “Skip to main content”, keep the target id stable across locales, and test that focus lands visibly at the intended heading or region in both directions.`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use a missing or duplicated target id, put the link after navigation, suppress its focus styling, or route fragment activation through application navigation. Related components: `,(0,p.jsx)(t.code,{children:`ApplicationShell`}),`, `,(0,p.jsx)(t.code,{children:`NavigationList`}),`, `,(0,p.jsx)(t.code,{children:`Link`}),`, and `,(0,p.jsx)(t.code,{children:`VisuallyHidden`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};