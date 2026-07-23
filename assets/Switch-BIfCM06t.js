import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{AnatomyAndKeyboard as c,n as l,t as u}from"./Switch.stories-BlFjik9o.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Accessible compound on/off setting with visible label, native checkbox form participation, and controlled, uncontrolled, read-only, disabled, required, and invalid states.`}),`
`,(0,p.jsx)(t.h1,{id:`switch`,children:`Switch`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Switch`}),` represents a Boolean setting whose on or off state usually takes effect immediately.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Switch } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for persistent settings such as enabling notifications or a display preference. Prefer `,(0,p.jsx)(t.code,{children:`Checkbox`}),` for selection, acknowledgement, or a value submitted as part of a larger form. Do not use a switch to trigger a one-off action; use `,(0,p.jsx)(t.code,{children:`Button`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Switch } from '@motech-development/breeze-ui';

<Switch.Root defaultSelected name="updates">
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
    <Switch.Label>Email updates</Switch.Label>
  </Switch.Control>
  <Switch.Description>Changes take effect immediately.</Switch.Description>
</Switch.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Switch.Root`})}),(0,p.jsx)(t.td,{children:`Owns Boolean state, validation, and hidden native checkbox form integration.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Switch.Control`})}),(0,p.jsx)(t.td,{children:`Native label and complete pointer, touch, and keyboard target.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Switch.Track`})}),(0,p.jsx)(t.td,{children:`Decorative on/off track.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Switch.Thumb`})}),(0,p.jsx)(t.td,{children:`Decorative moving thumb inside the track.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Switch.Label`})}),(0,p.jsx)(t.td,{children:`Persistent visible name inside the control.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Switch.Description`})}),(0,p.jsx)(t.td,{children:`Supporting guidance associated with the switch.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Switch.Error`})}),(0,p.jsx)(t.td,{children:`Validation feedback associated while invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep `,(0,p.jsx)(t.code,{children:`Thumb`}),` inside `,(0,p.jsx)(t.code,{children:`Track`}),`, and `,(0,p.jsx)(t.code,{children:`Track`}),` plus `,(0,p.jsx)(t.code,{children:`Label`}),` inside `,(0,p.jsx)(t.code,{children:`Control`}),`. Track and thumb are hidden from assistive technology; native switch state carries the meaning.`]}),`
`,(0,p.jsx)(t.h2,{id:`state-callbacks-and-forms`,children:`State, callbacks, and forms`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultSelected`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`selected`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`selected`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the complete next Boolean.`]}),`
`,(0,p.jsxs)(t.p,{children:[`When on, the hidden native checkbox submits `,(0,p.jsx)(t.code,{children:`name=value`}),`; `,(0,p.jsx)(t.code,{children:`value`}),` defaults to `,(0,p.jsx)(t.code,{children:`'on'`}),`. It submits nothing when off. `,(0,p.jsx)(t.code,{children:`form`}),` associates it with an external form. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and changes and removes normal submission. `,(0,p.jsx)(t.code,{children:`readOnly`}),` preserves controlled state without changes. `,(0,p.jsx)(t.code,{children:`required`}),` and `,(0,p.jsx)(t.code,{children:`invalid`}),` are available, though switches rarely make sense as required acknowledgements—prefer `,(0,p.jsx)(t.code,{children:`Checkbox`}),` for consent.`]}),`
`,(0,p.jsx)(t.p,{children:`Loading is application-owned. If a change is saved asynchronously, keep the switch’s state truthful, communicate progress separately, and handle failure without silently reverting.`}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility, and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab focuses the switch; Space toggles it. Clicking the visible label also toggles it.`}),`
`,(0,p.jsxs)(t.li,{children:[`The `,(0,p.jsx)(t.code,{children:`Label`}),` should describe the setting, not instruct “turn on”. State is announced separately.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not add “on/off” text that conflicts with the native announced state.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Track`}),` and `,(0,p.jsx)(t.code,{children:`Thumb`}),` each support `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),` (default), and `,(0,p.jsx)(t.code,{children:`lg`}),`; use the same size for both while retaining the control’s large hit target.`]}),`
`,(0,p.jsx)(t.li,{children:`Logical layout and thumb movement follow surrounding direction.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use Switch for submit-time choices, mismatch track and thumb sizes, put interactive content inside its label, or show stale optimistic state after a failed save. Use `,(0,p.jsx)(t.code,{children:`Checkbox`}),` for acknowledgement, `,(0,p.jsx)(t.code,{children:`ToggleButton`}),` for a pressed command, and `,(0,p.jsx)(t.code,{children:`SegmentedControl`}),` for mutually exclusive modes.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};