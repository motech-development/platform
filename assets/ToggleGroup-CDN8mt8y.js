import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{SingleSelection as c,n as l,t as u}from"./ToggleGroup.stories-y1vio-PK.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A labelled group that coordinates single or multiple toggle selection and arrow navigation.`}),`
`,(0,p.jsx)(t.h1,{id:`togglegroup`,children:`ToggleGroup`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ToggleGroup`}),` coordinates related valued `,(0,p.jsx)(t.code,{children:`ToggleButton`}),` children with single or multiple selection and orientation-aware keyboard navigation.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ToggleButton, ToggleGroup } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` for a compact set of closely related view or formatting choices. Use `,(0,p.jsx)(t.code,{children:`SegmentedControl`}),` for the opinionated pattern when its API fits, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` for a form question with one required answer, `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for a labelled form collection, or `,(0,p.jsx)(t.code,{children:`Toolbar`}),` for unrelated commands with no shared selection.`]}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ToggleGroup`}),` is the root selection and keyboard coordinator. Its direct interactive children are public `,(0,p.jsx)(t.code,{children:`ToggleButton`}),` components, each with a unique string `,(0,p.jsx)(t.code,{children:`value`}),`. There are no separate group label or item parts: label the root with `,(0,p.jsx)(t.code,{children:`aria-label`}),` or `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),`, and put visible text or icons in each toggle.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ToggleButton, ToggleGroup } from '@motech-development/breeze-ui';

export function ViewChoice() {
  return (
    <ToggleGroup aria-label="View mode" defaultSelection={['grid']}>
      <ToggleButton value="grid">Grid</ToggleButton>
      <ToggleButton value="list">List</ToggleButton>
    </ToggleGroup>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`selection-and-callback-semantics`,children:`Selection and callback semantics`}),`
`,(0,p.jsxs)(t.p,{children:[`Single selection is the default and reports zero or one selected value in a string array. Set `,(0,p.jsx)(t.code,{children:`multiple`}),` for independent values. `,(0,p.jsx)(t.code,{children:`defaultSelection`}),` sets uncontrolled initial state. For controlled mutable state, provide `,(0,p.jsx)(t.code,{children:`selection`}),` and `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),`; the callback receives the complete next `,(0,p.jsx)(t.code,{children:`string[]`}),`, not only the changed item. For immutable focusable state, provide `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),`.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ToggleButton, ToggleGroup } from '@motech-development/breeze-ui';
import { useState } from 'react';

export function ControlledViewChoice() {
  const [selection, setSelection] = useState(['grid']);

  return (
    <ToggleGroup
      aria-label="View mode"
      selection={selection}
      onSelectionChange={setSelection}
    >
      <ToggleButton value="grid">Grid</ToggleButton>
      <ToggleButton value="list">List</ToggleButton>
    </ToggleGroup>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents all contained toggles from changing. Empty selection is valid unless the application enforces another rule; the component has no `,(0,p.jsx)(t.code,{children:`required`}),`, invalid, loading, or error presentation.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-direction`,children:`Accessibility, keyboard, and direction`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native `,(0,p.jsx)(t.code,{children:`div`}),` attributes, notably `,(0,p.jsx)(t.code,{children:`aria-label`}),`, `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),`, `,(0,p.jsx)(t.code,{children:`id`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),`, are supported. Breeze owns selection changes, children, class, and inline style.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Always give the group an accessible label. Single-selection toggles expose radio-style checked state; multiple-selection toggles remain pressed buttons. `,(0,p.jsx)(t.code,{children:`Tab`}),` enters or leaves the group, `,(0,p.jsx)(t.code,{children:`Enter`}),` or `,(0,p.jsx)(t.code,{children:`Space`}),` selects the focused toggle, and arrow keys move focus on the configured axis. Horizontal navigation follows text direction; vertical navigation uses Up and Down. Keep DOM order logical and values locale-independent while translating visible labels.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not omit the group label or child values.`}),`
`,(0,p.jsx)(t.li,{children:`Do not reuse a value or derive values from translated labels.`}),`
`,(0,p.jsx)(t.li,{children:`Do not mix controlled root selection with controlled child state.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`multiple`}),` when the choices are mutually exclusive.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use the group for unrelated commands; use `,(0,p.jsx)(t.code,{children:`Toolbar`}),`.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`ToggleButton`}),` alone for one state, `,(0,p.jsx)(t.code,{children:`SegmentedControl`}),` for the canonical pattern, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` or `,(0,p.jsx)(t.code,{children:`CheckboxGroup`}),` for form values, and `,(0,p.jsx)(t.code,{children:`Toolbar`}),` for command collections.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};