import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{PrefixAndSuffix as c,n as l,t as u}from"./InputGroup.stories-D8f7fQ-X.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Visual single-surface composition for a Breeze field control with non-interactive prefixes, suffixes, units, or a closely related action.`}),`
`,(0,p.jsx)(t.h1,{id:`inputgroup`,children:`InputGroup`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`InputGroup`}),` visually joins a field control with non-interactive addons or a directly related action without taking ownership of field state.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { InputGroup, TextField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for a protocol prefix, unit suffix, currency marker, or a compact action that operates on the adjacent field. Prefer a field’s own group part (`,(0,p.jsx)(t.code,{children:`SearchField.Group`}),`, `,(0,p.jsx)(t.code,{children:`NumberField.Group`}),`, or `,(0,p.jsx)(t.code,{children:`ComboBox.Group`}),`) when that component supplies one. Do not use it merely to lay out unrelated controls; use `,(0,p.jsx)(t.code,{children:`Inline`}),`, `,(0,p.jsx)(t.code,{children:`Stack`}),`, or `,(0,p.jsx)(t.code,{children:`FormActions`}),` instead.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { InputGroup, TextField } from '@motech-development/breeze-ui';

<TextField.Root>
  <TextField.Label>Budget</TextField.Label>
  <InputGroup.Root>
    <InputGroup.Addon aria-hidden="true">£</InputGroup.Addon>
    <TextField.Input name="budget" inputMode="decimal" />
    <InputGroup.Addon>GBP</InputGroup.Addon>
  </InputGroup.Root>
</TextField.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`InputGroup.Root`})}),(0,p.jsx)(t.td,{children:`Creates one visual perimeter around ordered controls and addons.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`InputGroup.Addon`})}),(0,p.jsx)(t.td,{children:`Renders a non-interactive prefix or suffix such as a unit or protocol.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`InputGroup`}),` is visual composition, not field semantics. Keep it inside the owning field root so the field label, disabled state, and invalid state continue to reach the actual control. Author children in logical reading order; the component adapts its borders and spacing for right-to-left layouts.`]}),`
`,(0,p.jsx)(t.h2,{id:`semantics-and-state`,children:`Semantics and state`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Root`}),` defaults to `,(0,p.jsx)(t.code,{children:`role="presentation"`}),`. Use `,(0,p.jsx)(t.code,{children:`role="group"`}),` or `,(0,p.jsx)(t.code,{children:`role="region"`}),` only when the composition itself needs an accessible boundary, and then provide `,(0,p.jsx)(t.code,{children:`aria-label`}),` or `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),`. A visual currency symbol that repeats information available in the label or description should be `,(0,p.jsx)(t.code,{children:`aria-hidden`}),`; essential units should remain available to assistive technology.`]}),`
`,(0,p.jsxs)(t.p,{children:[`State comes from child controls and their owning field root. `,(0,p.jsx)(t.code,{children:`InputGroup`}),` has no value, callback, disabled, read-only, invalid, loading, empty, or error API. Breeze reflects descendant focus, disabled, and invalid data states on the shared perimeter where supported. Do not implement application state on the group.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Match `,(0,p.jsx)(t.code,{children:`Addon`}),` size to the adjacent control: `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),` (default), or `,(0,p.jsx)(t.code,{children:`lg`}),`. Mixed sizes create broken alignment and misleading hit areas.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-and-accessibility`,children:`Keyboard and accessibility`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`InputGroup`}),` adds no keyboard behaviour. Focus follows its interactive descendants in DOM order. `,(0,p.jsx)(t.code,{children:`Addon`}),` is not interactive and must not contain buttons or links; place a real Breeze button directly in `,(0,p.jsx)(t.code,{children:`Root`}),` for a related action. Ensure the field’s visible label names the editable control, and ensure an adjacent icon-only action has its own accessible name.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not add a second accessible label to a presentational group, put interactive content inside `,(0,p.jsx)(t.code,{children:`Addon`}),`, mix control sizes, or use CSS to rearrange the authored reading order. Use `,(0,p.jsx)(t.code,{children:`SearchField.Group`}),`, `,(0,p.jsx)(t.code,{children:`NumberField.Group`}),`, or `,(0,p.jsx)(t.code,{children:`ComboBox.Group`}),` for their native compound anatomy; use layout primitives for unrelated controls.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};