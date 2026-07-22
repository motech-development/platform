import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{Uncontrolled as c,n as l,t as u}from"./ToggleButton.stories-a-RsC3DG.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A controlled, uncontrolled, or read-only two-state action.`}),`
`,(0,p.jsx)(t.h1,{id:`togglebutton`,children:`ToggleButton`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ToggleButton`}),` lets a user select or deselect one persistent two-state action.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ToggleButton } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`ToggleButton`}),` for an action that remains on or off, such as showing a preview. Use `,(0,p.jsx)(t.code,{children:`Button`}),` for a momentary command, `,(0,p.jsx)(t.code,{children:`Switch`}),` for an immediately applied setting with a persistent label, `,(0,p.jsx)(t.code,{children:`Checkbox`}),` for form selection, or `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` for related valued toggles.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ToggleButton } from '@motech-development/breeze-ui';

export function PreviewToggle() {
  return <ToggleButton defaultSelected>Show preview</ToggleButton>;
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`state-ownership`,children:`State ownership`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultSelected`}),` for uncontrolled initial state. For controlled mutable state, provide both `,(0,p.jsx)(t.code,{children:`selected`}),` and `,(0,p.jsx)(t.code,{children:`onChange`}),`; the callback receives the next boolean selected state. For intentionally immutable but focusable state, provide `,(0,p.jsx)(t.code,{children:`selected`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),`. Do not mix `,(0,p.jsx)(t.code,{children:`defaultSelected`}),` with `,(0,p.jsx)(t.code,{children:`selected`}),`.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { useState } from 'react';
import { ToggleButton } from '@motech-development/breeze-ui';

export function PreviewToggle() {
  const [selected, setSelected] = useState(false);

  return (
    <ToggleButton selected={selected} onChange={setSelected}>
      Show preview
    </ToggleButton>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and changes. `,(0,p.jsx)(t.code,{children:`readOnly`}),` preserves focus and activation semantics but keeps the controlled selection unchanged. The selected treatment is always solid; the configured `,(0,p.jsx)(t.code,{children:`appearance`}),` controls the unselected treatment. ToggleButton has no loading, invalid, error, or empty state.`]}),`
`,(0,p.jsx)(t.h2,{id:`composition-with-togglegroup`,children:`Composition with ToggleGroup`}),`
`,(0,p.jsxs)(t.p,{children:[`Inside `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),`, give every `,(0,p.jsx)(t.code,{children:`ToggleButton`}),` a unique, stable string `,(0,p.jsx)(t.code,{children:`value`}),`. The group owns selection and keyboard coordination; do not also control each child’s `,(0,p.jsx)(t.code,{children:`selected`}),` state. Standalone toggles expose pressed-button semantics, while grouped toggles use selection semantics appropriate to the group mode.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-keyboard-behaviour`,children:`Accessibility and keyboard behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native button attributes such as `,(0,p.jsx)(t.code,{children:`aria-*`}),` and `,(0,p.jsx)(t.code,{children:`data-*`}),` are supported. Native `,(0,p.jsx)(t.code,{children:`value`}),`, `,(0,p.jsx)(t.code,{children:`onChange`}),`, pressed state, disabled state, class, and inline style are owned by the Breeze contract.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Use a stable label that describes the active state or feature rather than changing between contradictory verbs. Standalone `,(0,p.jsx)(t.code,{children:`ToggleButton`}),` exposes `,(0,p.jsx)(t.code,{children:`aria-pressed`}),`; `,(0,p.jsx)(t.code,{children:`Enter`}),` and `,(0,p.jsx)(t.code,{children:`Space`}),` request the next state. In a group, arrow-key behaviour comes from `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),`. Icons accompanying text should be decorative. Labels must be translated and allowed to grow.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not use a toggle for a one-off command.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not provide `,(0,p.jsx)(t.code,{children:`selected`}),` without `,(0,p.jsx)(t.code,{children:`onChange`}),` unless `,(0,p.jsx)(t.code,{children:`readOnly`}),` is explicitly true.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not change a controlled value in response to unrelated events without keeping the visible state consistent.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not omit `,(0,p.jsx)(t.code,{children:`value`}),` inside `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),`.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` for related choices, `,(0,p.jsx)(t.code,{children:`Switch`}),` for a setting, `,(0,p.jsx)(t.code,{children:`Checkbox`}),` for form selection, and `,(0,p.jsx)(t.code,{children:`Button`}),` for momentary actions.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};