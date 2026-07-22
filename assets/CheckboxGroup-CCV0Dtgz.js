import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{AnatomyAndUncontrolled as c,n as l,t as u}from"./CheckboxGroup.stories-BzCTdl89.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Labelled multiple selection over composed Checkbox items with string-array values, native form naming, orientation, and controlled, uncontrolled, read-only, disabled, required, and invalid states.`}),`
`,(0,p.jsx)(t.h1,{id:`checkboxgroup`,children:`CheckboxGroup`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` coordinates a labelled set of `,(0,p.jsx)(t.code,{children:`Checkbox`}),` items where zero, one, or several string values may be selected.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Checkbox, CheckboxGroup } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for related multiple-choice options that should all remain visible. Use a standalone `,(0,p.jsx)(t.code,{children:`Checkbox`}),` for one independent choice, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for exactly one value, or `,(0,p.jsx)(t.code,{children:`TagGroup`}),` for a compact interactive collection. Do not use it for a long or virtualised collection; consider `,(0,p.jsx)(t.code,{children:`ListBox`}),` with multiple selection.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Checkbox, CheckboxGroup } from '@motech-development/breeze-ui';

<CheckboxGroup.Root name="channels" defaultSelection={['email']}>
  <CheckboxGroup.Label>Notification channels</CheckboxGroup.Label>
  <Checkbox.Root value="email">
    <Checkbox.Control>
      <Checkbox.Indicator />
      <Checkbox.Label>Email</Checkbox.Label>
    </Checkbox.Control>
  </Checkbox.Root>
  <Checkbox.Root value="sms">
    <Checkbox.Control>
      <Checkbox.Indicator />
      <Checkbox.Label>Text message</Checkbox.Label>
    </Checkbox.Control>
  </Checkbox.Root>
</CheckboxGroup.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-composition`,children:`Anatomy and composition`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`CheckboxGroup.Root`})}),(0,p.jsx)(t.td,{children:`Owns group selection, validation, orientation, and shared native form name.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`CheckboxGroup.Label`})}),(0,p.jsx)(t.td,{children:`Persistent accessible name for the entire set.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Checkbox.Root`})}),(0,p.jsxs)(t.td,{children:[`One option; its `,(0,p.jsx)(t.code,{children:`value`}),` becomes the group’s string selection value.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`CheckboxGroup.Description`})}),(0,p.jsx)(t.td,{children:`Group-level supporting guidance.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`CheckboxGroup.Error`})}),(0,p.jsx)(t.td,{children:`Group-level validation feedback while invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`The group does not provide an item part: compose public `,(0,p.jsx)(t.code,{children:`Checkbox`}),` parts directly. Put selection state and `,(0,p.jsx)(t.code,{children:`name`}),` on `,(0,p.jsx)(t.code,{children:`CheckboxGroup.Root`}),`, and give each child `,(0,p.jsx)(t.code,{children:`Checkbox.Root`}),` a unique string `,(0,p.jsx)(t.code,{children:`value`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-and-state`,children:`Selection and state`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultSelection: string[]`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` receives the complete next `,(0,p.jsx)(t.code,{children:`string[]`}),`, not a delta or DOM event. The default is an empty array.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents all option interaction; an individual `,(0,p.jsx)(t.code,{children:`Checkbox.Root disabled`}),` disables only that option. `,(0,p.jsx)(t.code,{children:`readOnly`}),` preserves focusable values but prevents changes. `,(0,p.jsx)(t.code,{children:`required`}),` means at least one option is required. Set `,(0,p.jsx)(t.code,{children:`invalid`}),` and render `,(0,p.jsx)(t.code,{children:`Error`}),` after validation. Empty option sets and loading are application concerns; do not render an unlabelled empty group.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`orientation`}),` is `,(0,p.jsx)(t.code,{children:`vertical`}),` by default and may be `,(0,p.jsx)(t.code,{children:`horizontal`}),`. Horizontal layout wraps and keeps group label, description, and error on their own rows. Prefer vertical layout for long labels or more than a few choices.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility, and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab visits each enabled checkbox; Space toggles the focused option. Checkboxes do not use arrow-key roving focus.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`CheckboxGroup.Label`}),` names the set; every `,(0,p.jsx)(t.code,{children:`Checkbox.Label`}),` must still name its option.`]}),`
`,(0,p.jsx)(t.li,{children:`Keep option values stable and distinct from their translated visible labels.`}),`
`,(0,p.jsxs)(t.li,{children:[`In right-to-left contexts, layout and wrapping follow the surrounding `,(0,p.jsx)(t.code,{children:`dir`}),`; selection values remain the authored strings.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not control each checkbox separately while also controlling the group, use translated labels as persistent values, omit the group label, or expect arrow keys to move between checkboxes. Use `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for one value, `,(0,p.jsx)(t.code,{children:`ListBox multiple`}),` for a large selectable collection, and `,(0,p.jsx)(t.code,{children:`Fieldset`}),` for several different controls that form a native group.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};