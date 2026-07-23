import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,s as i}from"./blocks-COZjwJ0c.js";import{t as a}from"./mdx-react-shim-CpkRhXci.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/09 Routing`,summary:`Connect a router-neutral navigation adapter while preserving anchors, external URLs, downloads and modified clicks.`}),`
`,(0,c.jsx)(t.h1,{id:`routing`,children:`Routing`}),`
`,(0,c.jsxs)(t.p,{children:[`Breeze has no dependency on React Router, Next.js or another routing framework. Applications may supply one `,(0,c.jsx)(t.code,{children:`BreezeRouterAdapter`}),` with a `,(0,c.jsx)(t.code,{children:`navigate(href)`}),` function.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import {
  BreezeProvider,
  type BreezeRouterAdapter,
} from '@motech-development/breeze-ui';

const router: BreezeRouterAdapter = {
  navigate(href) {
    applicationRouter.navigate(href);
  },
};

<BreezeProvider locale="en-GB" router={router}>
  <App />
</BreezeProvider>;
`})}),`
`,(0,c.jsx)(t.h2,{id:`navigation-components`,children:`Navigation components`}),`
`,(0,c.jsxs)(t.p,{children:[`Use `,(0,c.jsx)(t.code,{children:`Link`}),` for inline navigation and `,(0,c.jsx)(t.code,{children:`LinkButton`}),` when navigation needs button emphasis. Use `,(0,c.jsx)(t.code,{children:`Button`}),` for an operation that does not change location.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { Link, LinkButton } from '@motech-development/breeze-ui';

<Link href="/items">View items</Link>
<LinkButton href="/items/new">Create an item</LinkButton>
`})}),`
`,(0,c.jsx)(t.p,{children:`Eligible root-relative URLs use the provider adapter on an ordinary unmodified primary activation. Native anchors remain authoritative for:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`external and protocol URLs;`}),`
`,(0,c.jsx)(t.li,{children:`protocol-relative URLs;`}),`
`,(0,c.jsx)(t.li,{children:`downloads;`}),`
`,(0,c.jsxs)(t.li,{children:[`alternate targets such as `,(0,c.jsx)(t.code,{children:`target="_blank"`}),`;`]}),`
`,(0,c.jsx)(t.li,{children:`modified clicks that open a new tab or window;`}),`
`,(0,c.jsx)(t.li,{children:`use without a router adapter.`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`This preserves browser affordances including link copying, open-in-new-tab and native history behaviour. Do not render a `,(0,c.jsx)(t.code,{children:`Button`}),` and call the router from `,(0,c.jsx)(t.code,{children:`onAction`}),` for normal navigation.`]}),`
`,(0,c.jsx)(t.h2,{id:`link-capable-compounds`,children:`Link-capable compounds`}),`
`,(0,c.jsxs)(t.p,{children:[`Navigation lists, breadcrumbs, pagination and application-shell patterns may render links through their own documented parts. Supply public `,(0,c.jsx)(t.code,{children:`href`}),` values and keep route definitions application-owned. Breeze does not choose routes, load data, determine authorisation or expose framework-specific link components.`]}),`
`,(0,c.jsx)(t.h2,{id:`accessible-route-changes`,children:`Accessible route changes`}),`
`,(0,c.jsx)(t.p,{children:`Use clear link text that describes the destination. Mark current navigation with the public current-state prop or supported native attribute documented by the component. After client-side navigation, the application owns page-title updates, main-heading changes, focus placement and any route announcement needed by the complete workflow.`})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};