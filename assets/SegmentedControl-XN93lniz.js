import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Uncontrolled as c,n as l,t as u}from"./SegmentedControl.stories-rxDanngD.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Compact, labelled single-selection control for stable string options, with controlled, uncontrolled or read-only state, radio semantics and orientation-aware arrow-key navigation.`}),`
`,(0,p.jsx)(t.h1,{id:`segmentedcontrol`,children:`SegmentedControl`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`SegmentedControl`}),` presents a short, mutually exclusive choice as adjacent selectable segments.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  SegmentedControl,
  type SegmentedControlOption,
} from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`SegmentedControl`}),` for two or a few concise peer choices that immediately change a view or presentation mode. Every option is visible and selection is represented by a stable string value.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for a labelled form question, required answer, native form participation, descriptions or errors. Use `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` when you need multiple selection or compound child composition. Use `,(0,p.jsx)(t.code,{children:`Tabs`}),` when selection switches between labelled content panels, and `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` for momentary actions.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { SegmentedControl } from '@motech-development/breeze-ui';
import { useState } from 'react';

const displayOptions = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
];

export function DisplayMode() {
  const [mode, setMode] = useState('list');

  return (
    <SegmentedControl
      aria-label="Display mode"
      onChange={setMode}
      options={displayOptions}
      value={mode}
    />
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-options`,children:`Anatomy and options`}),`
`,(0,p.jsxs)(t.p,{children:[`SegmentedControl is a fixed pattern rather than a public compound namespace. The root coordinates one selection and keyboard focus. Each entry in `,(0,p.jsx)(t.code,{children:`options`}),` becomes one adjacent toggle with radio semantics in single-selection mode.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-ts`,children:`interface SegmentedControlOption {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Values must be unique, stable, locale-independent strings. Translate `,(0,p.jsx)(t.code,{children:`label`}),`, not `,(0,p.jsx)(t.code,{children:`value`}),`. `,(0,p.jsx)(t.code,{children:`disabled`}),` on an option prevents that option from being selected; root `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents all choices from changing.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep the set short and labels concise. The component has no loading, invalid, error or dedicated empty presentation. Avoid rendering an empty `,(0,p.jsx)(t.code,{children:`options`}),` array; render an application fallback instead. If options are loaded asynchronously, show separate loading and error feedback before rendering the control.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-state-and-callback-semantics`,children:`Selection state and callback semantics`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Uncontrolled:`}),` omit `,(0,p.jsx)(t.code,{children:`value`}),`; optional `,(0,p.jsx)(t.code,{children:`defaultValue`}),` selects the initial option. Optional `,(0,p.jsx)(t.code,{children:`onChange`}),` observes subsequent non-empty selections.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Controlled:`}),` provide `,(0,p.jsx)(t.code,{children:`value`}),` and `,(0,p.jsx)(t.code,{children:`onChange`}),`. The callback receives the next selected option’s string value, never an array or DOM event.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Read-only:`}),` provide `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),`; focus is preserved but selection cannot change.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`The public value is a single string. An initial empty selection is possible when neither `,(0,p.jsx)(t.code,{children:`defaultValue`}),` nor `,(0,p.jsx)(t.code,{children:`value`}),` is supplied. The underlying single-selection group can represent no selection, but `,(0,p.jsx)(t.code,{children:`onChange`}),` only reports a selected string and does not report an empty array. Use controlled state or `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` when the application must enforce and validate a required answer.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Controlled and uncontrolled props are mutually exclusive. Mutable controlled state requires `,(0,p.jsx)(t.code,{children:`onChange`}),`; SegmentedControl throws if JavaScript bypasses that TypeScript contract. Application state owns persistence, URL synchronisation, data loading and consequences of the selected mode.`]}),`
`,(0,p.jsx)(t.h2,{id:`orientation-keyboard-and-direction`,children:`Orientation, keyboard and direction`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`orientation`}),` defaults to `,(0,p.jsx)(t.code,{children:`'horizontal'`}),`. Horizontal segments form one row; vertical segments form one column. Orientation controls both layout and arrow-key axis.`]}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab enters or leaves the group. Enter or Space selects the focused segment.`}),`
`,(0,p.jsx)(t.li,{children:`Horizontal arrow keys move focus according to provider text direction. Vertical orientation uses Up and Down.`}),`
`,(0,p.jsxs)(t.li,{children:[`Selected options expose radio-style checked state. The required `,(0,p.jsx)(t.code,{children:`aria-label`}),` names the group; visible option labels name the choices.`]}),`
`,(0,p.jsx)(t.li,{children:`Keep DOM option order logical and do not reverse the array for right-to-left content.`}),`
`,(0,p.jsx)(t.li,{children:`Option labels are application-owned, translated copy and must tolerate expansion. Values are identifiers and are not localised.`}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`SegmentedControl performs no routing and is not a tab-panel coordinator. It has fixed default ToggleButton appearance and size; there are no pattern props for appearance, variant, size, density or tone. `,(0,p.jsx)(t.code,{children:`className`}),` is for placement, not internal segment styling.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use translated labels as values, include many or long options, use segments for unrelated actions, duplicate values, or treat the control as navigation tabs. Use `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for a form answer, `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` for configurable selection, and `,(0,p.jsx)(t.code,{children:`Tabs`}),` for content panels.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};