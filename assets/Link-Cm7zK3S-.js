import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{Internal as c,n as l,t as u}from"./Link.stories-B9uo1B2C.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Router-neutral inline navigation that preserves native link behaviour.`}),`
`,(0,p.jsx)(t.h1,{id:`link`,children:`Link`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Link`}),` navigates to a destination with a real `,(0,p.jsx)(t.code,{children:`href`}),`, using the optional Breeze router adapter for eligible local URLs and native browser behaviour everywhere else.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Link } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Use for inline navigation to another route, page, document, or location.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use a local `,(0,p.jsx)(t.code,{children:`/path`}),` with the provider router when the application supports client-side routing.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use external URLs, `,(0,p.jsx)(t.code,{children:`download`}),`, or `,(0,p.jsx)(t.code,{children:`target`}),` when native browser navigation is intended.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Button`}),` for an action that changes state without navigating.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`LinkButton`}),` when navigation needs button-like visual prominence.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`SkipLink`}),` for a keyboard-visible bypass link to main content.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use a clickable `,(0,p.jsx)(t.code,{children:`Typography`}),` or an anchor without an `,(0,p.jsx)(t.code,{children:`href`}),` as a substitute.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Link, Typography } from '@motech-development/breeze-ui';

export function HelpText() {
  return (
    <Typography>
      Read the <Link href="/guidance">usage guidance</Link> before continuing.
    </Typography>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`routing-behaviour`,children:`Routing behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`With a `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` router, a local URL beginning with a single `,(0,p.jsx)(t.code,{children:`/`}),` uses `,(0,p.jsx)(t.code,{children:`router.navigate(href)`}),` for an unmodified primary activation. The link still renders a real `,(0,p.jsx)(t.code,{children:`href`}),`, so copying the address, opening a context menu, and browser fallbacks continue to work.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The browser handles navigation when the URL is external or protocol-relative, `,(0,p.jsx)(t.code,{children:`download`}),` is present, `,(0,p.jsx)(t.code,{children:`target`}),` is not `,(0,p.jsx)(t.code,{children:`_self`}),`, the pointer activation is not the primary button, or Alt, Control, Meta, or Shift is held.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  BreezeProvider,
  Link,
  type BreezeRouterAdapter,
} from '@motech-development/breeze-ui';

const router: BreezeRouterAdapter = {
  navigate: (href) => window.history.pushState(null, '', href),
};

export function Navigation() {
  return (
    <BreezeProvider locale="en-GB" router={router}>
      <Link href="/preferences">Preferences</Link>
    </BreezeProvider>
  );
}
`})}),`
`,(0,p.jsx)(t.h2,{id:`variants-and-states`,children:`Variants and states`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`primary`}),` is the default navigation colour. Use `,(0,p.jsx)(t.code,{children:`muted`}),` for deliberately lower-emphasis supporting navigation, `,(0,p.jsx)(t.code,{children:`danger`}),` when following the link leads towards a destructive flow, and `,(0,p.jsx)(t.code,{children:`inverse`}),` on dark surfaces. Variant conveys visual meaning; the link text must still explain the destination.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents navigation and semantic activation and renders non-link content. Prefer removing unavailable navigation when that does not hide useful context. If a disabled link must remain visible, explain why it is unavailable nearby.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`onAction`}),` runs after semantic activation and receives no browser event. Put navigation in `,(0,p.jsx)(t.code,{children:`href`}),` or the provider adapter, not in `,(0,p.jsx)(t.code,{children:`onAction`}),`. Use the callback for application-side observation only and ensure repeated activation is safe.`]}),`
`,(0,p.jsx)(t.h2,{id:`external-and-download-links`,children:`External and download links`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Link } from '@motech-development/breeze-ui';
import { ExternalLinkIcon } from '@motech-development/breeze-ui/icons';

export function ExternalGuidanceLink() {
  return (
    <Link href="https://example.com/guidance" rel="noreferrer" target="_blank">
      External guidance <ExternalLinkIcon />
    </Link>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Visible wording should make an unexpected new browsing context or download clear. An adjacent icon is decorative by default and does not replace that wording. Supply an appropriate `,(0,p.jsx)(t.code,{children:`rel`}),` when using `,(0,p.jsx)(t.code,{children:`_blank`}),` according to application security policy.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-keyboard-interaction`,children:`Accessibility and keyboard interaction`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native anchor attributes such as `,(0,p.jsx)(t.code,{children:`aria-*`}),`, `,(0,p.jsx)(t.code,{children:`data-*`}),`, `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`hreflang`}),`, `,(0,p.jsx)(t.code,{children:`referrerPolicy`}),`, `,(0,p.jsx)(t.code,{children:`rel`}),`, and `,(0,p.jsx)(t.code,{children:`type`}),` are supported. `,(0,p.jsx)(t.code,{children:`onClick`}),`, `,(0,p.jsx)(t.code,{children:`style`}),`, and direct React Aria props are not part of the public interaction or styling API.`]}),`
`,(0,p.jsx)(t.p,{children:`Use concise text that describes the destination out of context. Avoid “click here”. The native link participates in the tab order, activates with Enter, exposes its destination, and retains browser focus indication. A disabled Link is not a link and is not keyboard focusable.`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not rely on colour alone to distinguish the link; Breeze includes an underline. When using `,(0,p.jsx)(t.code,{children:`variant="inverse"`}),`, provide a sufficiently dark background. The provider direction and locale apply to its text, but URLs and child content are not translated by Link.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not call a router from `,(0,p.jsx)(t.code,{children:`onAction`}),`; configure `,(0,p.jsx)(t.code,{children:`BreezeProvider.router`}),` and keep the real destination in `,(0,p.jsx)(t.code,{children:`href`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`disabled`}),` to represent a loading action; navigation links do not own loading state.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not omit visible context for downloads or links that open a new browsing context.`}),`
`,(0,p.jsx)(t.li,{children:`Links do not support controlled or uncontrolled value state, invalid state, or read-only state.`}),`
`,(0,p.jsxs)(t.li,{children:[`Application routers must update application state after `,(0,p.jsx)(t.code,{children:`navigate`}),`; Breeze only invokes the adapter.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`LinkButton`}),` for prominent navigation styled as an action control.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Button`}),` for non-navigation actions.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Breadcrumbs`}),`, `,(0,p.jsx)(t.code,{children:`NavigationList`}),`, or `,(0,p.jsx)(t.code,{children:`Tabs`}),` for structured navigation sets.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Configure local navigation through `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};