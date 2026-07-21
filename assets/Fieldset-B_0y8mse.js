import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{AnatomyAndKeyboard as c,n as l,t as u}from"./Fieldset.stories-_ns5R_U9.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Native fieldset and legend composition for naming, describing, disabling, and validating a related group of form controls.`}),`
`,(0,p.jsx)(t.h1,{id:`fieldset`,children:`Fieldset`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Fieldset`}),` groups related form controls with native `,(0,p.jsx)(t.code,{children:`<fieldset>`}),` and `,(0,p.jsx)(t.code,{children:`<legend>`}),` semantics plus associated description and error text.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Fieldset, TextField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it when several controls answer one question or form one meaningful group, such as contact details or delivery preferences. Prefer `,(0,p.jsx)(t.code,{children:`FormSection`}),` for a visual form section that does not need native grouped-control semantics. `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` and `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` already provide their own accessible group naming, so do not add an extra `,(0,p.jsx)(t.code,{children:`Fieldset`}),` unless a larger set of distinct controls genuinely needs another group level.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Fieldset, TextField } from '@motech-development/breeze-ui';

<Fieldset.Root>
  <Fieldset.Legend>Contact details</Fieldset.Legend>
  <Fieldset.Description>
    Provide at least one contact route.
  </Fieldset.Description>
  <TextField.Root>
    <TextField.Label>Email address</TextField.Label>
    <TextField.Input name="email" type="email" />
  </TextField.Root>
</Fieldset.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Fieldset.Root`})}),(0,p.jsx)(t.td,{children:`Native fieldset that owns group-level disabled and invalid semantics.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Fieldset.Legend`})}),(0,p.jsx)(t.td,{children:`Native legend and persistent accessible group name.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Fieldset.Description`})}),(0,p.jsx)(t.td,{children:`Group-level guidance included in the fieldset’s accessible description.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Fieldset.Error`})}),(0,p.jsxs)(t.td,{children:[`Group-level validation feedback included while `,(0,p.jsx)(t.code,{children:`Root`}),` is invalid.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Every `,(0,p.jsx)(t.code,{children:`Description`}),` and `,(0,p.jsx)(t.code,{children:`Error`}),` must be inside its `,(0,p.jsx)(t.code,{children:`Root`}),`; the generated associations depend on that composition. Place `,(0,p.jsx)(t.code,{children:`Legend`}),` first so browser and assistive-technology behaviour is predictable.`]}),`
`,(0,p.jsx)(t.h2,{id:`state-and-behaviour`,children:`State and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Fieldset`}),` does not own values or callbacks. Descendant controls remain responsible for their individual state. Native `,(0,p.jsx)(t.code,{children:`disabled`}),` on `,(0,p.jsx)(t.code,{children:`Root`}),` disables all descendant form controls and prevents their normal form submission. `,(0,p.jsx)(t.code,{children:`invalid`}),` adds group-level invalid semantics and associates `,(0,p.jsx)(t.code,{children:`Error`}),`; it does not automatically mark each descendant invalid. Render `,(0,p.jsx)(t.code,{children:`Error`}),` with a recovery instruction when the group fails validation.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Loading, read-only, and required state are not group-level `,(0,p.jsx)(t.code,{children:`Fieldset`}),` APIs. Express them on the appropriate descendant controls, or disable the fieldset only if every control is unavailable. An empty fieldset is generally a content error, not an empty state.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Fieldset`}),` adds no keyboard interaction: Tab follows the descendant controls’ natural order. The `,(0,p.jsx)(t.code,{children:`Legend`}),` should be concise because some screen readers announce it with each control. Do not use a heading or styled paragraph instead of `,(0,p.jsx)(t.code,{children:`Legend`}),`. Keep `,(0,p.jsx)(t.code,{children:`Description`}),` useful at the group level and use each field’s own description for control-specific formats.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Native semantics, Unicode content, and surrounding `,(0,p.jsx)(t.code,{children:`dir`}),` are preserved. The fieldset layout follows writing direction without requiring reordered markup.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`Fieldset`}),` as a generic bordered container, omit its `,(0,p.jsx)(t.code,{children:`Legend`}),`, nest it merely for spacing, or rely on group `,(0,p.jsx)(t.code,{children:`invalid`}),` to explain which descendant needs correction. Use `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for related multiple choices, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for one-of-many choices, and `,(0,p.jsx)(t.code,{children:`FormSection`}),` for broader form organisation.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};