import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{SingleUncontrolled as c,n as l,t as u}from"./Accordion.stories-BBBR9ByT.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A coordinated group of keyed disclosures with single or multiple expansion and controlled, uncontrolled, read-only, and disabled states.`}),`
`,(0,p.jsx)(t.h1,{id:`accordion`,children:`Accordion`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Accordion`}),` organises related sections into labelled panels whose expansion is coordinated by one root.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Accordion } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it to reduce the initial length of supporting content while keeping several related headings visible. Use `,(0,p.jsx)(t.code,{children:`Disclosure`}),` for one independent section, `,(0,p.jsx)(t.code,{children:`Tabs`}),` when exactly one peer view should be active, and ordinary headings when all content should remain visible or searchable at once.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Accordion } from '@motech-development/breeze-ui';

<Accordion.Root defaultValue={['delivery']}>
  <Accordion.Item id="delivery">
    <Accordion.Trigger>Delivery</Accordion.Trigger>
    <Accordion.Panel>Delivery details</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="returns">
    <Accordion.Trigger>Returns</Accordion.Trigger>
    <Accordion.Panel>Returns details</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Accordion.Root`})}),(0,p.jsx)(t.td,{children:`Owns expansion keys and the single/multiple expansion policy.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Accordion.Item`})}),(0,p.jsx)(t.td,{children:`One stable keyed disclosure.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Accordion.Trigger`})}),(0,p.jsx)(t.td,{children:`Heading button that toggles its item.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Accordion.Panel`})}),(0,p.jsx)(t.td,{children:`Collapsible content associated with the trigger.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Trigger`}),` must precede its associated `,(0,p.jsx)(t.code,{children:`Panel`}),` inside each item. `,(0,p.jsx)(t.code,{children:`headingLevel`}),` defaults to `,(0,p.jsx)(t.code,{children:`3`}),`; choose the level that preserves the page heading hierarchy. A panel defaults to group semantics and may use `,(0,p.jsx)(t.code,{children:`role="region"`}),` when it is important enough to be a landmark.`]}),`
`,(0,p.jsx)(t.h2,{id:`expansion-and-states`,children:`Expansion and states`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`value`}),` and `,(0,p.jsx)(t.code,{children:`defaultValue`}),` are arrays of complete `,(0,p.jsx)(t.code,{children:`string | number`}),` item ids. Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled expansion, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled expansion, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable expansion. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the complete next array. `,(0,p.jsx)(t.code,{children:`multiple`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`; when true, items expand independently.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Root `,(0,p.jsx)(t.code,{children:`disabled`}),` disables every trigger; item `,(0,p.jsx)(t.code,{children:`disabled`}),` disables only one. Disabled open content remains readable. Accordion has no loading, invalid, empty, or error state: render feedback inside a panel, or use `,(0,p.jsx)(t.code,{children:`StatePanel`}),` instead of an empty accordion.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-styling`,children:`Native attributes and styling`}),`
`,(0,p.jsxs)(t.p,{children:[`Parts accept `,(0,p.jsx)(t.code,{children:`className`}),`, relevant semantic attributes, and refs to their rendered elements. The Trigger supports relevant native button attributes; Breeze owns click, disabled, and inline style behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-internationalisation-and-mistakes`,children:`Keyboard, accessibility, internationalisation, and mistakes`}),`
`,(0,p.jsx)(t.p,{children:`Tab visits each enabled trigger; Enter or Space toggles it. Focus does not rove with arrow keys. The trigger exposes expanded state and its panel relationship. Keep trigger text meaningful when heard alone, avoid putting controls inside it, and let translated headings wrap. Logical text alignment follows direction; ids remain stable.`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use array positions as ids, combine `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`defaultValue`}),`, use `,(0,p.jsx)(t.code,{children:`multiple`}),` when content order implies a single choice, or hide essential primary content solely to shorten a page. Related components: `,(0,p.jsx)(t.code,{children:`Disclosure`}),`, `,(0,p.jsx)(t.code,{children:`Tabs`}),`, `,(0,p.jsx)(t.code,{children:`Stepper`}),`, and `,(0,p.jsx)(t.code,{children:`NavigationList`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};