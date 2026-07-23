import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Horizontal as c,VerticalWithDescriptions as l,n as u,t as d}from"./Stepper.stories-DWgpzEf_.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Accessible ordered progression showing complete, current, and upcoming application-owned stages.`}),`
`,(0,m.jsx)(t.h1,{id:`stepper`,children:`Stepper`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Stepper`}),` describes named stages in a process as an ordered list with one current-step marker.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Stepper } from '@motech-development/breeze-ui';
import { CheckIcon } from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsx)(t.p,{children:`Use a stepper when people benefit from knowing their position in a small, stable multi-stage process.`}),`
`,(0,m.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),` for continuous task completion, `,(0,m.jsx)(t.a,{href:`?path=/docs/primitives-navigation-tabs--docs`,children:`Tabs`}),` for switching peer views, and `,(0,m.jsx)(t.a,{href:`?path=/docs/primitives-navigation-breadcrumbs--docs`,children:`Breadcrumbs`}),` for location in a hierarchy.`]}),`
`,(0,m.jsx)(t.p,{children:`Stepper is descriptive, not navigation: it does not change pages, validate data, or persist completion.`}),`
`,(0,m.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Stepper } from '@motech-development/breeze-ui';
import { CheckIcon } from '@motech-development/breeze-ui/icons';

export function SetupProgress() {
  return (
    <Stepper.Root aria-label="Account setup">
      <Stepper.Item
        indicator={<CheckIcon />}
        status="complete"
        title="Details"
      />
      <Stepper.Item indicator="2" status="current" title="Settings" />
      <Stepper.Item indicator="3" status="upcoming" title="Review" />
    </Stepper.Root>
  );
}
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`Stepper.Root`}),` renders the ordered-list container and controls visual orientation.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`Stepper.Item`}),` renders one list item, its decorative indicator, visible title, and optional description.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`status-and-orientation`,children:`Status and orientation`}),`
`,(0,m.jsxs)(t.p,{children:[`Every item requires `,(0,m.jsx)(t.code,{children:`status`}),`: `,(0,m.jsx)(t.code,{children:`complete`}),`, `,(0,m.jsx)(t.code,{children:`current`}),`, or `,(0,m.jsx)(t.code,{children:`upcoming`}),`. `,(0,m.jsx)(t.code,{children:`current`}),` adds `,(0,m.jsx)(t.code,{children:`aria-current="step"`}),`. Keep exactly one current item during an active flow; the indicator is intentionally hidden from assistive technology, so the visible translated `,(0,m.jsx)(t.code,{children:`title`}),` and status semantics must carry meaning. `,(0,m.jsx)(t.code,{children:`orientation`}),` is `,(0,m.jsx)(t.code,{children:`horizontal`}),` by default and may be `,(0,m.jsx)(t.code,{children:`vertical`}),`; it changes layout, not reading order or keyboard behaviour.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-state-and-direction`,children:`Accessibility, state, and direction`}),`
`,(0,m.jsxs)(t.p,{children:[`Give the root an accessible name with `,(0,m.jsx)(t.code,{children:`aria-label`}),` or `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),` when surrounding context does not name it. Use meaningful text titles, not icon-only titles. Stepper has no focus management, keyboard interaction, callbacks, controlled/uncontrolled value, loading, disabled, invalid, empty, or error state; the application derives statuses from its own state. Translate titles, descriptions, and the root name. Source order remains progression order in both directions.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`Do not make list items clickable without real links or buttons.`}),`
`,(0,m.jsx)(t.li,{children:`Do not mark multiple items current.`}),`
`,(0,m.jsx)(t.li,{children:`Do not communicate completion only with indicator colour or an icon.`}),`
`,(0,m.jsx)(t.li,{children:`Do not reorder items visually without changing their semantic source order.`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/primitives-navigation-tabs--docs`,children:`Tabs`}),`, and `,(0,m.jsx)(t.a,{href:`?path=/docs/primitives-navigation-breadcrumbs--docs`,children:`Breadcrumbs`}),`.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};