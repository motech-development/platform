import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{Activation as c,States as l,n as u,t as d}from"./Button.stories-CqctnKs3.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`A semantic application action with canonical emphasis, sizing, and accessible progress states.`}),`
`,(0,m.jsx)(t.h1,{id:`button`,children:`Button`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Button`}),` performs an application action through pointer or keyboard activation.`]}),`
`,(0,m.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Button } from '@motech-development/breeze-ui';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`Button`}),` to submit a form or change application state. Use `,(0,m.jsx)(t.code,{children:`Link`}),` for ordinary navigation, `,(0,m.jsx)(t.code,{children:`LinkButton`}),` when a destination needs button emphasis, `,(0,m.jsx)(t.code,{children:`IconButton`}),` for a compact icon-only action, and `,(0,m.jsx)(t.code,{children:`ToggleButton`}),` for a persistent on/off choice.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Button } from '@motech-development/breeze-ui';

export function SaveButton() {
  return <Button onAction={() => saveChanges()}>Save changes</Button>;
}
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`emphasis-and-size`,children:`Emphasis and size`}),`
`,(0,m.jsxs)(t.p,{children:[`Choose `,(0,m.jsx)(t.code,{children:`appearance`}),` for emphasis and `,(0,m.jsx)(t.code,{children:`variant`}),` for meaning. `,(0,m.jsx)(t.code,{children:`solid`}),` is the default primary action; `,(0,m.jsx)(t.code,{children:`subtle`}),`, `,(0,m.jsx)(t.code,{children:`outline`}),`, and `,(0,m.jsx)(t.code,{children:`ghost`}),` progressively reduce emphasis. `,(0,m.jsx)(t.code,{children:`text`}),` is the lowest-emphasis button treatment and remains an action, never navigation. Semantic variants are `,(0,m.jsx)(t.code,{children:`primary`}),`, `,(0,m.jsx)(t.code,{children:`secondary`}),`, `,(0,m.jsx)(t.code,{children:`success`}),`, `,(0,m.jsx)(t.code,{children:`danger`}),`, `,(0,m.jsx)(t.code,{children:`warning`}),`, `,(0,m.jsx)(t.code,{children:`info`}),`, `,(0,m.jsx)(t.code,{children:`light`}),`, and `,(0,m.jsx)(t.code,{children:`dark`}),`. Avoid relying on colour alone; use clear action text.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Sizes are `,(0,m.jsx)(t.code,{children:`sm`}),`, `,(0,m.jsx)(t.code,{children:`md`}),`, and `,(0,m.jsx)(t.code,{children:`lg`}),`. Prefer `,(0,m.jsx)(t.code,{children:`md`}),`; use `,(0,m.jsx)(t.code,{children:`sm`}),` only in space-constrained contexts that retain an adequate target, and `,(0,m.jsx)(t.code,{children:`lg`}),` for deliberately prominent actions.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Button appearance="outline" variant="danger" onAction={removeItem}>
  Remove item
</Button>
`})}),`
`,(0,m.jsx)(t.h2,{id:`activation-forms-and-state`,children:`Activation, forms, and state`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`onAction`}),` runs once for a semantic activation, independent of whether the user clicked, touched, or used the keyboard. Use it instead of `,(0,m.jsx)(t.code,{children:`onClick`}),`. `,(0,m.jsx)(t.code,{children:`type`}),` is deliberately limited to `,(0,m.jsx)(t.code,{children:`button`}),` and `,(0,m.jsx)(t.code,{children:`submit`}),`, and defaults to the safe non-submitting `,(0,m.jsx)(t.code,{children:`button`}),`.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`disabled`}),` prevents interaction. `,(0,m.jsx)(t.code,{children:`loading`}),` prevents activation while preserving focusability, sets `,(0,m.jsx)(t.code,{children:`aria-busy`}),`, and adds an announced in-progress state while retaining the visible label. Keep the label stable, such as “Save changes”, or use a short progressive label such as “Saving”. Errors and validation remain owned by the surrounding form or feedback component; `,(0,m.jsx)(t.code,{children:`Button`}),` has no invalid, error, read-only, controlled, or empty state.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-and-keyboard-behaviour`,children:`Accessibility and keyboard behaviour`}),`
`,(0,m.jsxs)(t.p,{children:[`Relevant native button attributes such as `,(0,m.jsx)(t.code,{children:`name`}),`, `,(0,m.jsx)(t.code,{children:`value`}),`, `,(0,m.jsx)(t.code,{children:`form`}),`, `,(0,m.jsx)(t.code,{children:`autoFocus`}),`, `,(0,m.jsx)(t.code,{children:`aria-*`}),`, and `,(0,m.jsx)(t.code,{children:`data-*`}),` are supported. Breeze owns `,(0,m.jsx)(t.code,{children:`onClick`}),`, `,(0,m.jsx)(t.code,{children:`disabled`}),`, `,(0,m.jsx)(t.code,{children:`type`}),`, `,(0,m.jsx)(t.code,{children:`aria-busy`}),`, `,(0,m.jsx)(t.code,{children:`className`}),`, and inline styling through the API above.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Use a concise visible label; when an icon accompanies text, keep the icon decorative. `,(0,m.jsx)(t.code,{children:`Enter`}),` and `,(0,m.jsx)(t.code,{children:`Space`}),` activate the button when enabled, with browser and React Aria press semantics preventing duplicate callbacks. Focus remains visibly indicated. Do not remove focus styles or encode meaning using variant alone. Labels may expand after translation, so allow action layouts to wrap rather than truncating essential text.`]}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[`Do not use `,(0,m.jsx)(t.code,{children:`Button`}),` to navigate or pass an anchor destination; use `,(0,m.jsx)(t.code,{children:`Link`}),` or `,(0,m.jsx)(t.code,{children:`LinkButton`}),`.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Do not attach both `,(0,m.jsx)(t.code,{children:`onAction`}),` and a native click handler.`]}),`
`,(0,m.jsx)(t.li,{children:`Do not put more than one primary solid action in the same decision group without a clear hierarchy.`}),`
`,(0,m.jsxs)(t.li,{children:[`Do not replace a useful label with only an icon; use `,(0,m.jsx)(t.code,{children:`IconButton`}),` with `,(0,m.jsx)(t.code,{children:`aria-label`}),`.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`LinkButton`}),` for destinations, `,(0,m.jsx)(t.code,{children:`IconButton`}),` for icon-only actions, `,(0,m.jsx)(t.code,{children:`ToggleButton`}),` for persistent two-state actions, `,(0,m.jsx)(t.code,{children:`ButtonGroup`}),` for grouped actions, and `,(0,m.jsx)(t.code,{children:`FormActions`}),` for canonical form placement.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};