import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,PanelAction as l,RouterNavigation as u,n as d,t as f}from"./Link.stories-BqL91mp5.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,strong:`strong`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Navigates to a resource with native anchor behaviour and optional router support.`}),`
`,(0,h.jsx)(t.h1,{id:`link`,children:`Link`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Link`}),` is a standalone text link without an underline, such as a View all link in a panel header. It renders a native anchor, so `,(0,h.jsx)(t.code,{children:`href`}),` works as usual: keyboard access, opening in a new tab and copying the address all behave as people expect. For an action that does not navigate, use a quiet `,(0,h.jsx)(t.code,{children:`Button`}),` instead.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Without a router, the link uses the browser's normal navigation. With a router configured on `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),`, same-origin links navigate through the router instead.`]}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.h2,{id:`router-navigation`,children:`Router navigation`}),`
`,(0,h.jsxs)(t.p,{children:[`Pass a `,(0,h.jsx)(t.code,{children:`router`}),` to `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),` when links should change the page without a full reload. `,(0,h.jsx)(t.code,{children:`Link`}),` sends the destination and its optional `,(0,h.jsx)(t.code,{children:`transitionTypes`}),` to the router, which decides whether to use a browser view transition; see `,(0,h.jsx)(`a`,{href:`./?path=/docs/guides-04-motion--docs`,target:`_top`,children:`Motion`}),`.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB" router={router}>
  <Link href="/accounts/transactions" transitionTypes={['nav', 'list']}>
    Transactions
  </Link>
</BreezeProvider>
`})}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsxs)(t.p,{children:[`The link calls `,(0,h.jsx)(t.code,{children:`router.navigate(path, { transitionTypes })`}),`. `,(0,h.jsx)(t.code,{children:`transitionTypes`}),` defaults to an empty list, so an existing `,(0,h.jsx)(t.code,{children:`navigate(href)`}),` function that takes one argument works unchanged.`]}),`
`,(0,h.jsxs)(t.p,{children:[`The router receives the path the browser would navigate to, not the raw `,(0,h.jsx)(t.code,{children:`href`}),`: a root-relative path including any query string. Relative values such as `,(0,h.jsx)(t.code,{children:`accounts`}),`, `,(0,h.jsx)(t.code,{children:`../reports`}),` or `,(0,h.jsx)(t.code,{children:`?page=2`}),` are resolved against the current page first, so on `,(0,h.jsx)(t.code,{children:`/accounts/transactions/`}),`, `,(0,h.jsx)(t.code,{children:`href="?page=2"`}),` navigates to `,(0,h.jsx)(t.code,{children:`/accounts/transactions/?page=2`}),`.`]}),`
`,(0,h.jsxs)(t.p,{children:[`The path already includes any base path your application is served under. `,(0,h.jsxs)(t.strong,{children:[`If your router adds its own `,(0,h.jsx)(t.code,{children:`basename`}),`, remove the base from the path before navigating`]}),`, or it will appear twice.`]}),`
`,(0,h.jsx)(t.h3,{id:`when-the-browser-navigates-instead`,children:`When the browser navigates instead`}),`
`,(0,h.jsxs)(t.p,{children:[`The router handles only a plain primary click on a same-origin HTTP or HTTPS link. The browser navigates as normal for external links, downloads, links with a `,(0,h.jsx)(t.code,{children:`target`}),` other than `,(0,h.jsx)(t.code,{children:`_self`}),`, links containing a `,(0,h.jsx)(t.code,{children:`#`}),` fragment, and clicks with a modifier key, such as Ctrl or Cmd to open a new tab.`]}),`
`,(0,h.jsx)(t.h2,{id:`variants`,children:`Variants`}),`
`,(0,h.jsxs)(t.p,{children:[`The default link uses the brand text colour. Set `,(0,h.jsx)(t.code,{children:`variant="subtle"`}),` for a lower-emphasis link.`]}),`
`,(0,h.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,h.jsxs)(t.p,{children:[`A `,(0,h.jsx)(t.code,{children:`Link`}),` is distinguished from text by colour alone, so place it on its own rather than inside a sentence. On touch devices and below the `,(0,h.jsx)(t.code,{children:`md`}),` breakpoint, it has a minimum height of 44px.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Screen readers announce the link's text as its name. Use `,(0,h.jsx)(t.code,{children:`aria-label`}),` or `,(0,h.jsx)(t.code,{children:`aria-labelledby`}),` when the text does not describe the destination, and `,(0,h.jsx)(t.code,{children:`aria-current`}),` when the link points to the current page.`]}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};