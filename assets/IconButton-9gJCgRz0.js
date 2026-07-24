import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Activation as c,States as l,n as u,t as d}from"./IconButton.stories-CQFV9sdj.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`A compact icon-only action with a mandatory accessible label.`}),`
`,(0,m.jsx)(t.h1,{id:`iconbutton`,children:`IconButton`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`IconButton`}),` performs an application action in a square icon-only control whose required `,(0,m.jsx)(t.code,{children:`aria-label`}),` supplies its accessible name.`]}),`
`,(0,m.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { IconButton } from '@motech-development/breeze-ui';
import { SettingsIcon } from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`IconButton`}),` for a familiar, repeated action where space is constrained and a text label would add noise. Use `,(0,m.jsx)(t.code,{children:`Button`}),` when visible text improves recognition, `,(0,m.jsx)(t.code,{children:`Link`}),` for navigation, or `,(0,m.jsx)(t.code,{children:`Tooltip`}),` to provide supplementary explanation without replacing the accessible name.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { IconButton } from '@motech-development/breeze-ui';
import { SettingsIcon } from '@motech-development/breeze-ui/icons';

export function SettingsButton() {
  return (
    <IconButton aria-label="Open settings" onAction={() => openSettings()}>
      <SettingsIcon />
    </IconButton>
  );
}
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`label-icon-and-emphasis`,children:`Label, icon, and emphasis`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`aria-label`}),` is required and should name the action, not describe the glyph: use “Delete item”, not “Bin icon”. The child icon is always hidden from assistive technology because the button owns the name. Keep one clear icon as the child.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Appearances are `,(0,m.jsx)(t.code,{children:`solid`}),`, `,(0,m.jsx)(t.code,{children:`subtle`}),`, `,(0,m.jsx)(t.code,{children:`outline`}),`, and `,(0,m.jsx)(t.code,{children:`ghost`}),`; variants are `,(0,m.jsx)(t.code,{children:`primary`}),`, `,(0,m.jsx)(t.code,{children:`secondary`}),`, `,(0,m.jsx)(t.code,{children:`success`}),`, `,(0,m.jsx)(t.code,{children:`danger`}),`, `,(0,m.jsx)(t.code,{children:`warning`}),`, `,(0,m.jsx)(t.code,{children:`info`}),`, `,(0,m.jsx)(t.code,{children:`light`}),`, and `,(0,m.jsx)(t.code,{children:`dark`}),`; square sizes are `,(0,m.jsx)(t.code,{children:`sm`}),`, `,(0,m.jsx)(t.code,{children:`md`}),`, and `,(0,m.jsx)(t.code,{children:`lg`}),`. The defaults deliberately produce a medium, secondary ghost action.`]}),`
`,(0,m.jsx)(t.h2,{id:`activation-forms-and-state`,children:`Activation, forms, and state`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`onAction`}),` fires once for pointer, touch, or keyboard activation. `,(0,m.jsx)(t.code,{children:`type`}),` is limited to `,(0,m.jsx)(t.code,{children:`button`}),` and `,(0,m.jsx)(t.code,{children:`submit`}),` and defaults to `,(0,m.jsx)(t.code,{children:`button`}),`. `,(0,m.jsx)(t.code,{children:`disabled`}),` prevents interaction. `,(0,m.jsx)(t.code,{children:`loading`}),` prevents activation while preserving focusability, sets `,(0,m.jsx)(t.code,{children:`aria-busy`}),`, retains the accessible label, and temporarily displays a decorative spinner. Error reporting belongs to the surrounding workflow; there is no invalid, read-only, controlled, or empty state.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-and-keyboard-behaviour`,children:`Accessibility and keyboard behaviour`}),`
`,(0,m.jsxs)(t.p,{children:[`Relevant native button attributes such as `,(0,m.jsx)(t.code,{children:`name`}),`, `,(0,m.jsx)(t.code,{children:`value`}),`, `,(0,m.jsx)(t.code,{children:`form`}),`, `,(0,m.jsx)(t.code,{children:`autoFocus`}),`, `,(0,m.jsx)(t.code,{children:`aria-*`}),`, and `,(0,m.jsx)(t.code,{children:`data-*`}),` are supported. Breeze owns native click, disabled, pressed, busy, type, class, and style behaviour.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Enter`}),` and `,(0,m.jsx)(t.code,{children:`Space`}),` activate enabled icon buttons, and keyboard focus has a visible indicator. Do not depend on a tooltip as the only name, and do not repeat the icon name in the label. Translate `,(0,m.jsx)(t.code,{children:`aria-label`}),` with the rest of the interface. Verify that the chosen icon remains understandable in both directions; directional icon mirroring is icon-specific.`]}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[`Do not omit `,(0,m.jsx)(t.code,{children:`aria-label`}),` or use a vague label such as “Click here”.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Do not place visible text inside an `,(0,m.jsx)(t.code,{children:`IconButton`}),`; use `,(0,m.jsx)(t.code,{children:`Button`}),`.`]}),`
`,(0,m.jsx)(t.li,{children:`Do not use an icon-only control for an unfamiliar or high-consequence action without sufficient nearby context.`}),`
`,(0,m.jsxs)(t.li,{children:[`Do not add `,(0,m.jsx)(t.code,{children:`aria-label`}),` to the child icon; it is deliberately decorative here.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`Button`}),` for visible labels, `,(0,m.jsx)(t.code,{children:`ToggleButton`}),` for persistent on/off state, `,(0,m.jsx)(t.code,{children:`Tooltip`}),` for supplementary help, and the curated Breeze icon catalogue for supported icons.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};