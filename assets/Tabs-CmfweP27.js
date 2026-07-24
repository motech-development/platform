import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{ControlledKeyboardAndDisabled as c,n as l,t as u}from"./Tabs.stories-DnGxCxvp.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Accessible keyed tab labels and associated panels with controlled, uncontrolled, read-only, disabled, and orientation-aware behaviour.`}),`
`,(0,p.jsx)(t.h1,{id:`tabs`,children:`Tabs`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Tabs`}),` switches between peer panels within the same page without changing the user's task context.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Tabs } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use tabs for a small, stable set of related views whose labels fit comfortably. Use `,(0,p.jsx)(t.code,{children:`NavigationList`}),` when each destination is a route, `,(0,p.jsx)(t.code,{children:`Accordion`}),` when users benefit from reading several sections together, and `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` for compact display-mode choices.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Tabs } from '@motech-development/breeze-ui';

<Tabs.Root defaultValue="summary">
  <Tabs.List aria-label="Record details">
    <Tabs.Tab id="summary">Summary</Tabs.Tab>
    <Tabs.Tab id="history">History</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel id="summary">Summary content</Tabs.Panel>
    <Tabs.Panel id="history">History content</Tabs.Panel>
  </Tabs.Panels>
</Tabs.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Tabs.Root`})}),(0,p.jsx)(t.td,{children:`Owns keyed selection, disabled state, and orientation.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Tabs.List`})}),(0,p.jsx)(t.td,{children:`Accessible list of tab labels.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Tabs.Tab`})}),(0,p.jsx)(t.td,{children:`One keyed selectable label.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Tabs.Panels`})}),(0,p.jsx)(t.td,{children:`Optional wrapper coordinating panel transitions.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Tabs.Panel`})}),(0,p.jsxs)(t.td,{children:[`Content whose `,(0,p.jsx)(t.code,{children:`id`}),` matches one `,(0,p.jsx)(t.code,{children:`Tab`}),`.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Every tab and panel pair must use the same stable `,(0,p.jsx)(t.code,{children:`string | number`}),` id. `,(0,p.jsx)(t.code,{children:`Panels`}),` is optional, but useful when panels are grouped; do not place unrelated content between a tab and its associated panel structure.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-states-and-orientation`,children:`Selection, states, and orientation`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled selection, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled selection, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable selection. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the complete next key, not an event. `,(0,p.jsx)(t.code,{children:`disabled`}),` on `,(0,p.jsx)(t.code,{children:`Root`}),` disables all tabs; `,(0,p.jsx)(t.code,{children:`Tab.disabled`}),` disables one and removes it from selection navigation. `,(0,p.jsx)(t.code,{children:`forceMount`}),` keeps an inactive panel mounted while React Aria preserves inactive semantics; use it only when local state or expensive setup must survive.`]}),`
`,(0,p.jsx)(t.p,{children:`Horizontal orientation is the default and uses Left/Right keys. Vertical orientation uses Up/Down keys and places labels alongside panels. Tabs have no built-in loading, invalid, empty, or error state; keep a stable labelled tab set and put relevant feedback inside its panel.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-styling`,children:`Native attributes and styling`}),`
`,(0,p.jsxs)(t.p,{children:[`All parts accept `,(0,p.jsx)(t.code,{children:`className`}),`, relevant `,(0,p.jsx)(t.code,{children:`aria-*`}),` and `,(0,p.jsx)(t.code,{children:`data-*`}),` attributes, and a ref to their rendered `,(0,p.jsx)(t.code,{children:`div`}),`. Inline styles and native click/change handlers are excluded where Breeze owns behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-direction-and-mistakes`,children:`Accessibility, direction, and mistakes`}),`
`,(0,p.jsxs)(t.p,{children:[`Label `,(0,p.jsx)(t.code,{children:`Tabs.List`}),`. Tab moves into the active tab; arrow keys move and activate selection, Home and End reach the first and last enabled tab, and Tab then moves into panel content. React Aria mirrors horizontal arrow behaviour for RTL. Translate visible labels without changing ids and allow labels to wrap only when the resulting layout remains understandable.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use tabs as route links, mismatch ids, hide critical errors in an inactive panel without an announcement, or create so many tabs that labels become an overflow menu. Related components: `,(0,p.jsx)(t.code,{children:`NavigationList`}),`, `,(0,p.jsx)(t.code,{children:`Accordion`}),`, `,(0,p.jsx)(t.code,{children:`Disclosure`}),`, and `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};