import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Controlled as c,n as l,t as u}from"./Disclosure.stories-CNbE9iuR.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A single labelled disclosure for collapsible supporting content with controlled, uncontrolled, read-only, and disabled state.`}),`
`,(0,p.jsx)(t.h1,{id:`disclosure`,children:`Disclosure`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Disclosure`}),` reveals or hides one section of supporting content from a semantic heading button.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Disclosure } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsx)(t.p,{children:`Use it for optional details attached to one context.`}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Accordion`}),` for several coordinated sections, `,(0,p.jsx)(t.code,{children:`Dialog`}),` for a modal task, and permanently visible content when hiding it would impede completion or discovery.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Disclosure } from '@motech-development/breeze-ui';

<Disclosure.Root defaultOpen>
  <Disclosure.Trigger>Advanced details</Disclosure.Trigger>
  <Disclosure.Panel role="region">Additional information</Disclosure.Panel>
</Disclosure.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-state`,children:`Anatomy and state`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Disclosure.Root`})}),(0,p.jsx)(t.td,{children:`Coordinates expansion and disabled state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Disclosure.Trigger`})}),(0,p.jsx)(t.td,{children:`Heading button that toggles the panel.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Disclosure.Panel`})}),(0,p.jsx)(t.td,{children:`Collapsible content associated with the trigger.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultOpen`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` receives the complete next Boolean. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents the trigger changing state; an already open panel remains readable. There are no loading, invalid, empty, or error states.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`headingLevel`}),` defaults to `,(0,p.jsx)(t.code,{children:`3`}),` and should follow document hierarchy. Panel `,(0,p.jsx)(t.code,{children:`role`}),` defaults to `,(0,p.jsx)(t.code,{children:`'group'`}),`; use `,(0,p.jsx)(t.code,{children:`'region'`}),` sparingly for significant sections.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-styling`,children:`Native attributes and styling`}),`
`,(0,p.jsxs)(t.p,{children:[`Parts accept `,(0,p.jsx)(t.code,{children:`className`}),`, relevant HTML/ARIA attributes, and element refs. Inline styles and native click/change handlers are excluded where Breeze owns behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-common-mistakes`,children:`Accessibility and common mistakes`}),`
`,(0,p.jsx)(t.p,{children:`Tab focuses the trigger; Enter or Space toggles it. Keep the trigger meaningful independently and do not place another interactive control inside it. Expansion state and trigger/panel association are supplied automatically. Translate the trigger without changing application state; wrapping and logical alignment follow direction.`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not combine controlled and uncontrolled props, use a disclosure to conceal required form errors, or add a second panel under the same trigger. Related components: `,(0,p.jsx)(t.code,{children:`Accordion`}),`, `,(0,p.jsx)(t.code,{children:`Dialog`}),`, `,(0,p.jsx)(t.code,{children:`Popover`}),`, and `,(0,p.jsx)(t.code,{children:`Typography`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};