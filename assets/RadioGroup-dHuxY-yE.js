import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{AnatomyAndHorizontalKeyboard as c,n as l,t as u}from"./RadioGroup.stories-DyWglagi.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Labelled exclusive selection with native radio form semantics, per-option guidance, orientation-aware keyboard navigation, and controlled, uncontrolled, read-only, disabled, required, and invalid states.`}),`
`,(0,p.jsx)(t.h1,{id:`radiogroup`,children:`RadioGroup`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`RadioGroup`}),` presents a visible set of options from which one string value may be selected.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { RadioGroup } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it when choices are mutually exclusive, the set is short, and comparing all options helps the decision. Prefer `,(0,p.jsx)(t.code,{children:`Select`}),` when space is constrained or there are many options, `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` when several values may be selected, and `,(0,p.jsx)(t.code,{children:`SegmentedControl`}),` for a small view or mode switch. Do not use radio buttons for an action that takes effect without representing a persisted choice.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { RadioGroup } from '@motech-development/breeze-ui';

<RadioGroup.Root name="frequency" defaultSelection="weekly">
  <RadioGroup.Label>Report frequency</RadioGroup.Label>
  <RadioGroup.Item value="daily">
    <RadioGroup.Control>
      <RadioGroup.Indicator />
      <RadioGroup.ItemLabel>Daily</RadioGroup.ItemLabel>
    </RadioGroup.Control>
  </RadioGroup.Item>
  <RadioGroup.Item value="weekly">
    <RadioGroup.Control>
      <RadioGroup.Indicator />
      <RadioGroup.ItemLabel>Weekly</RadioGroup.ItemLabel>
    </RadioGroup.Control>
  </RadioGroup.Item>
</RadioGroup.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.Root`})}),(0,p.jsx)(t.td,{children:`Owns exclusive selection, shared form name, orientation, and group state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.Label`})}),(0,p.jsx)(t.td,{children:`Persistent accessible name for the set.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.Item`})}),(0,p.jsxs)(t.td,{children:[`One keyed option with its stable string `,(0,p.jsx)(t.code,{children:`value`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.Control`})}),(0,p.jsx)(t.td,{children:`Native label and interaction target for one option.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.Indicator`})}),(0,p.jsx)(t.td,{children:`Decorative selected-state mark.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.ItemLabel`})}),(0,p.jsx)(t.td,{children:`Persistent visible name inside the control.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.ItemDescription`})}),(0,p.jsx)(t.td,{children:`Guidance associated with one option.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.Description`})}),(0,p.jsx)(t.td,{children:`Guidance associated with the whole set.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RadioGroup.Error`})}),(0,p.jsx)(t.td,{children:`Group validation feedback while invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Put `,(0,p.jsx)(t.code,{children:`Control`}),` and optional `,(0,p.jsx)(t.code,{children:`ItemDescription`}),` inside `,(0,p.jsx)(t.code,{children:`Item`}),`; put `,(0,p.jsx)(t.code,{children:`Indicator`}),` and `,(0,p.jsx)(t.code,{children:`ItemLabel`}),` inside `,(0,p.jsx)(t.code,{children:`Control`}),`. Keep group-level guidance outside items.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-callbacks-and-states`,children:`Selection, callbacks, and states`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultSelection`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for an immutable choice. `,(0,p.jsx)(t.code,{children:`selection`}),` is `,(0,p.jsx)(t.code,{children:`string | null`}),`; `,(0,p.jsx)(t.code,{children:`null`}),` means no selection. `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` receives the newly selected string.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` on `,(0,p.jsx)(t.code,{children:`Root`}),` disables every option; `,(0,p.jsx)(t.code,{children:`disabled`}),` on `,(0,p.jsx)(t.code,{children:`Item`}),` disables one. `,(0,p.jsx)(t.code,{children:`readOnly`}),` prevents changes to a controlled selection. `,(0,p.jsx)(t.code,{children:`required`}),` means an option must be selected. Set `,(0,p.jsx)(t.code,{children:`invalid`}),` and render `,(0,p.jsx)(t.code,{children:`Error`}),` for a group validation failure. Loading and an empty option set are application-owned; avoid rendering an empty radio group.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`orientation`}),` is `,(0,p.jsx)(t.code,{children:`vertical`}),` by default. Use `,(0,p.jsx)(t.code,{children:`horizontal`}),` only for short labels and a small set; it also sets the expected arrow-key axis.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-and-accessibility`,children:`Keyboard and accessibility`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab enters the group at the selected option, or the first enabled option when none is selected.`}),`
`,(0,p.jsx)(t.li,{children:`Arrow keys move focus and selection through enabled options according to orientation; disabled items are skipped.`}),`
`,(0,p.jsx)(t.li,{children:`Space selects the focused option where platform behaviour requires it.`}),`
`,(0,p.jsxs)(t.li,{children:[`Provide both a group `,(0,p.jsx)(t.code,{children:`Label`}),` and an `,(0,p.jsx)(t.code,{children:`ItemLabel`}),` for every option. Do not rely on colour or the indicator alone.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Stable `,(0,p.jsx)(t.code,{children:`value`}),` strings should be domain identifiers, not translated visible labels.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`The component follows surrounding `,(0,p.jsx)(t.code,{children:`dir`}),`; horizontal arrow behaviour and layout adapt for right-to-left content.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not give options duplicate values, put `,(0,p.jsx)(t.code,{children:`value`}),` on `,(0,p.jsx)(t.code,{children:`Control`}),`, omit the group label, or use horizontal layout for content that wraps ambiguously. Use `,(0,p.jsx)(t.code,{children:`Select`}),` for a compact list, `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for multiple selection, and `,(0,p.jsx)(t.code,{children:`SegmentedControl`}),` for a compact mode choice.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};