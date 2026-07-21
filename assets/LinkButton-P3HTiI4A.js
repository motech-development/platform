import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Internal as c,n as l,t as u}from"./LinkButton.stories-k5Z_byga.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Router-neutral navigation presented with canonical button emphasis.`}),`
`,(0,p.jsx)(t.h1,{id:`linkbutton`,children:`LinkButton`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`LinkButton`}),` navigates to a destination while using the visual hierarchy of a button.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { LinkButton } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`LinkButton`}),` when navigation is the outcome but the destination must be prominent, such as “Continue” or “Create item”. Use `,(0,p.jsx)(t.code,{children:`Button`}),` for application actions and form submission, and `,(0,p.jsx)(t.code,{children:`Link`}),` for inline or lower-emphasis navigation.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { LinkButton } from '@motech-development/breeze-ui';

export function ContinueLink() {
  return <LinkButton href="/next-step">Continue</LinkButton>;
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`routing-and-native-navigation`,children:`Routing and native navigation`}),`
`,(0,p.jsxs)(t.p,{children:[`Every `,(0,p.jsx)(t.code,{children:`LinkButton`}),` requires a real `,(0,p.jsx)(t.code,{children:`href`}),`, preserving native link semantics and fallback navigation. When `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` has a router adapter, an unmodified primary click on a root-relative URL such as `,(0,p.jsx)(t.code,{children:`/items`}),` calls `,(0,p.jsx)(t.code,{children:`router.navigate(href)`}),`. Protocol-relative URLs, external URLs, downloads, non-`,(0,p.jsx)(t.code,{children:`_self`}),` targets, and clicks with modifier keys retain native browser behaviour.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<LinkButton href="/reports/latest" download>
  Download report
</LinkButton>
`})}),`
`,(0,p.jsx)(t.h2,{id:`emphasis-and-state`,children:`Emphasis and state`}),`
`,(0,p.jsxs)(t.p,{children:[`Appearances are `,(0,p.jsx)(t.code,{children:`solid`}),`, `,(0,p.jsx)(t.code,{children:`subtle`}),`, `,(0,p.jsx)(t.code,{children:`outline`}),`, and `,(0,p.jsx)(t.code,{children:`ghost`}),`; semantic variants are `,(0,p.jsx)(t.code,{children:`primary`}),`, `,(0,p.jsx)(t.code,{children:`secondary`}),`, `,(0,p.jsx)(t.code,{children:`success`}),`, `,(0,p.jsx)(t.code,{children:`danger`}),`, `,(0,p.jsx)(t.code,{children:`warning`}),`, `,(0,p.jsx)(t.code,{children:`info`}),`, `,(0,p.jsx)(t.code,{children:`light`}),`, and `,(0,p.jsx)(t.code,{children:`dark`}),`; sizes are `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, and `,(0,p.jsx)(t.code,{children:`lg`}),`. Choose a danger variant only when the destination itself represents a destructive or high-risk path, not for an action that should be a `,(0,p.jsx)(t.code,{children:`Button`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents navigation, removes the `,(0,p.jsx)(t.code,{children:`href`}),`, and exposes `,(0,p.jsx)(t.code,{children:`aria-disabled`}),` while retaining the link’s accessible identity. Prefer removing unavailable navigation or explaining why it is unavailable. `,(0,p.jsx)(t.code,{children:`LinkButton`}),` has no loading, callback, controlled, read-only, invalid, error, or empty state.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-internationalisation`,children:`Accessibility, keyboard, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native anchor attributes such as `,(0,p.jsx)(t.code,{children:`rel`}),`, `,(0,p.jsx)(t.code,{children:`hreflang`}),`, `,(0,p.jsx)(t.code,{children:`referrerPolicy`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are supported. Breeze owns click interception, `,(0,p.jsx)(t.code,{children:`href`}),`, `,(0,p.jsx)(t.code,{children:`download`}),`, `,(0,p.jsx)(t.code,{children:`className`}),`, and inline styling.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Use destination-oriented text that makes sense out of context. `,(0,p.jsx)(t.code,{children:`Enter`}),` follows an enabled link; `,(0,p.jsx)(t.code,{children:`Space`}),` does not emulate a button. For a new browsing context, communicate that behaviour and use an appropriate `,(0,p.jsx)(t.code,{children:`rel`}),`. Decorative icons must not replace the visible link purpose. Allow translated labels to grow and ensure direction-sensitive icons are chosen or mirrored by the icon implementation where appropriate.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`LinkButton`}),` for mutations, modal triggers, or submit behaviour.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not omit `,(0,p.jsx)(t.code,{children:`href`}),` and simulate navigation in an action callback.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not intercept external, download, target, or modified-click behaviour in application code.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`disabled`}),` as a long-term substitute for clear navigation rules.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Link`}),` for ordinary navigation, `,(0,p.jsx)(t.code,{children:`Button`}),` for actions, `,(0,p.jsx)(t.code,{children:`IconButton`}),` for icon-only actions, and configure routing through `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};