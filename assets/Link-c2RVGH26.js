import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-YQyNu8lI.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,RouterNavigation as l,n as u,t as d}from"./Link.stories-B_ZzjOtP.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Navigates to a resource with native anchor behavior and optional router support.`}),`
`,(0,m.jsx)(t.h1,{id:`link`,children:`Link`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Link`}),` renders a native anchor with Breeze's link styling. Its `,(0,m.jsx)(t.code,{children:`href`}),` remains the destination, so browser navigation, keyboard access and open-in-new-tab behavior continue to work.`]}),`
`,(0,m.jsx)(t.p,{children:`Without a configured router, activating the link uses the browser's native navigation. With a router, Breeze intercepts only qualifying same-document navigations.`}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`router-navigation`,children:`Router navigation`}),`
`,(0,m.jsxs)(t.p,{children:[`Pass a same-document router to `,(0,m.jsx)(t.code,{children:`BreezeProvider`}),` when links should update application state without loading another document. `,(0,m.jsx)(t.code,{children:`Link`}),` sends the destination and its optional `,(0,m.jsx)(t.code,{children:`transitionTypes`}),` to the router. The router decides whether and when to use a browser view transition; see `,(0,m.jsx)(`a`,{href:`./?path=/docs/guides-04-motion--docs`,target:`_top`,children:`Motion`}),`.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB" router={router}>
  <Link href="/accounts/transactions" transitionTypes={['nav', 'list']}>
    Transactions
  </Link>
</BreezeProvider>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`transitionTypes`}),` defaults to an empty list. Breeze passes the option to `,(0,m.jsx)(t.code,{children:`router.navigate(href, { transitionTypes })`}),`; an existing one-argument `,(0,m.jsx)(t.code,{children:`navigate(href)`}),` adapter can ignore the extra argument.`]}),`
`,(0,m.jsx)(t.h2,{id:`native-anchor-behavior`,children:`Native anchor behavior`}),`
`,(0,m.jsx)(t.p,{children:`The router handles only an unmodified primary click on a same-origin HTTP or HTTPS link with no fragment, download, or alternate browsing target. External links, downloads, alternate targets, modified clicks and fragment links keep the browser's native behavior.`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`variant="subtle"`}),` for a lower-emphasis link. The default variant uses the Breeze brand treatment.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[`The link's visible content is its accessible name by default. Use `,(0,m.jsx)(t.code,{children:`aria-label`}),` or `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),` when that content does not describe the destination, and `,(0,m.jsx)(t.code,{children:`aria-current`}),` when the link represents the current page or location.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};