import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{StatesAndOrientations as c,n as l,t as u}from"./NavigationList.stories-DZs3Wi24.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A labelled persistent navigation landmark with keyed destinations, current-page state, and horizontal or vertical layout.`}),`
`,(0,p.jsx)(t.h1,{id:`navigationlist`,children:`NavigationList`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`NavigationList`}),` presents a persistent set of application destinations and identifies the current page.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { NavigationList } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for side navigation or a compact horizontal destination list. Use `,(0,p.jsx)(t.code,{children:`Menu`}),` for transient actions, `,(0,p.jsx)(t.code,{children:`Tabs`}),` for views of the same resource, and `,(0,p.jsx)(t.code,{children:`Breadcrumbs`}),` for hierarchical orientation.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { NavigationList } from '@motech-development/breeze-ui';

<NavigationList.Root aria-label="Settings">
  <NavigationList.Item current href="/settings" id="general">
    General
  </NavigationList.Item>
  <NavigationList.Item href="/settings/security" id="security">
    Security
  </NavigationList.Item>
</NavigationList.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-state-and-routing`,children:`Anatomy, state, and routing`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NavigationList.Root`})}),(0,p.jsx)(t.td,{children:`Renders a labelled navigation landmark containing the list.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NavigationList.Item`})}),(0,p.jsx)(t.td,{children:`Renders one keyed router-neutral destination.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Set `,(0,p.jsx)(t.code,{children:`current`}),` on exactly one destination for `,(0,p.jsx)(t.code,{children:`aria-current="page"`}),`. `,(0,p.jsx)(t.code,{children:`onAction`}),` receives that item's complete `,(0,p.jsx)(t.code,{children:`string | number`}),` id after semantic activation; it receives no DOM event. A disabled item neither navigates nor calls `,(0,p.jsx)(t.code,{children:`onAction`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Local `,(0,p.jsx)(t.code,{children:`/path`}),` destinations use the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` router adapter when present. Without an adapter, and for external URLs, normal anchors are used. There is no selection controller: route state owns `,(0,p.jsx)(t.code,{children:`current`}),`. The component has no loading, invalid, read-only, empty, or error presentation; render an appropriate loading or state component instead of an empty landmark.`]}),`
`,(0,p.jsx)(t.h2,{id:`orientation`,children:`Orientation`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`vertical`}),` is the default and suits side navigation. `,(0,p.jsx)(t.code,{children:`horizontal`}),` wraps at narrow widths and suits a short set. Layout follows logical direction, while destination ids and URLs do not change during localisation.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-styling`,children:`Native attributes and styling`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant `,(0,p.jsx)(t.code,{children:`nav`}),` and list-item `,(0,p.jsx)(t.code,{children:`aria-*`}),` and `,(0,p.jsx)(t.code,{children:`data-*`}),` attributes are supported. Inline styling and native click handlers are excluded from the public interaction contract.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-common-mistakes`,children:`Accessibility and common mistakes`}),`
`,(0,p.jsxs)(t.p,{children:[`Every root needs a distinct accessible name when a page has more than one navigation landmark. Tab visits enabled links and Enter activates them. Use visible, translated link text, allow it to wrap, and do not rely on the current background colour alone. Do not use `,(0,p.jsx)(t.code,{children:`onAction`}),` as a substitute for navigation, put buttons inside items, mark several pages current, or use unstable ids.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Related components: `,(0,p.jsx)(t.code,{children:`Breadcrumbs`}),` for hierarchy, `,(0,p.jsx)(t.code,{children:`Tabs`}),` for peer panels, `,(0,p.jsx)(t.code,{children:`Menu`}),` for transient commands, and `,(0,p.jsx)(t.code,{children:`NavigationSection`}),` for a composed navigation pattern.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};