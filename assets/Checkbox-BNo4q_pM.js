import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{AnatomyAndUncontrolled as c,n as l,t as u}from"./Checkbox.stories-Bvo-bVsM.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Accessible Boolean or indeterminate selection with a visible label, native checkbox form participation, and controlled, uncontrolled, read-only, disabled, required, and invalid states.`}),`
`,(0,p.jsx)(t.h1,{id:`checkbox`,children:`Checkbox`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Checkbox`}),` lets a user independently select or clear a Boolean choice and can present an application-owned indeterminate state.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Checkbox } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use a checkbox for an independent option or acknowledgement. Use `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for several related values, `,(0,p.jsx)(t.code,{children:`Switch`}),` for a setting that takes effect immediately, and `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` when exactly one option may be selected. Do not use a checkbox as a button or as a substitute for expanding content.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Checkbox } from '@motech-development/breeze-ui';

<Checkbox.Root name="updates" value="email">
  <Checkbox.Control>
    <Checkbox.Indicator />
    <Checkbox.Label>Email updates</Checkbox.Label>
  </Checkbox.Control>
  <Checkbox.Description>You can change this later.</Checkbox.Description>
</Checkbox.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Checkbox.Root`})}),(0,p.jsx)(t.td,{children:`Owns Boolean state, validation, and the hidden native checkbox used by forms.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Checkbox.Control`})}),(0,p.jsx)(t.td,{children:`Native label and pointer, touch, and keyboard target.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Checkbox.Indicator`})}),(0,p.jsx)(t.td,{children:`Decorative selected or indeterminate mark.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Checkbox.Label`})}),(0,p.jsxs)(t.td,{children:[`Persistent visible checkbox name inside `,(0,p.jsx)(t.code,{children:`Control`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Checkbox.Description`})}),(0,p.jsx)(t.td,{children:`Supporting guidance associated with the checkbox.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Checkbox.Error`})}),(0,p.jsx)(t.td,{children:`Validation message associated while invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep `,(0,p.jsx)(t.code,{children:`Indicator`}),` and `,(0,p.jsx)(t.code,{children:`Label`}),` inside `,(0,p.jsx)(t.code,{children:`Control`}),`; keep all parts inside `,(0,p.jsx)(t.code,{children:`Root`}),`. The indicator is automatically hidden from assistive technology because native checkbox state provides the meaning.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-and-form-behaviour`,children:`Selection and form behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultSelected`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`selected`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`selected`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the next `,(0,p.jsx)(t.code,{children:`boolean`}),`. `,(0,p.jsx)(t.code,{children:`indeterminate`}),` is a visual and semantic mixed state controlled by the application; it does not add a third submitted value and user activation resolves it to a Boolean selection.`]}),`
`,(0,p.jsxs)(t.p,{children:[`When selected, the hidden native checkbox submits `,(0,p.jsx)(t.code,{children:`name=value`}),`; `,(0,p.jsx)(t.code,{children:`value`}),` defaults to `,(0,p.jsx)(t.code,{children:`'on'`}),`. It submits nothing when unselected. `,(0,p.jsx)(t.code,{children:`form`}),` can associate it with an external form. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and selection and excludes native submission. `,(0,p.jsx)(t.code,{children:`readOnly`}),` prevents changes while preserving the controlled value. `,(0,p.jsx)(t.code,{children:`required`}),` and `,(0,p.jsx)(t.code,{children:`invalid`}),` expose validation semantics; render a specific `,(0,p.jsx)(t.code,{children:`Error`}),`. Loading is application-owned.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-and-accessibility`,children:`Keyboard and accessibility`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab focuses the checkbox; Space toggles it. Clicking the label toggles it.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use a short, affirmative `,(0,p.jsx)(t.code,{children:`Label`}),` that makes selected and unselected states understandable.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not communicate state only through the indicator colour or shape.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Description`}),` for consequences or additional context. For consent, avoid preselecting the checkbox.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),` (default), and `,(0,p.jsx)(t.code,{children:`lg`}),` apply to `,(0,p.jsx)(t.code,{children:`Indicator`}),`; preserve a sufficiently large `,(0,p.jsx)(t.code,{children:`Control`}),` target.`]}),`
`]}),`
`,(0,p.jsx)(t.p,{children:`The label and guidance accept Unicode and inherit surrounding direction. The visual indicator stays before the label in logical reading order.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not put the indicator outside `,(0,p.jsx)(t.code,{children:`Control`}),`, attach click handlers to the decorative indicator, treat indeterminate as stored selection, or use `,(0,p.jsx)(t.code,{children:`disabled`}),` to represent read-only information. Use `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for a named set, `,(0,p.jsx)(t.code,{children:`Switch`}),` for an immediate setting, and `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for exclusive selection.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};