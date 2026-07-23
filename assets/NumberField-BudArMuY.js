import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{AnatomyAndKeyboard as c,n as l,t as u}from"./NumberField.stories-A5jxC7pF.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Locale-aware numeric entry with optional increment and decrement controls, explicit constraints, and controlled, uncontrolled, read-only, and validation states.`}),`
`,(0,p.jsx)(t.h1,{id:`numberfield`,children:`NumberField`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`NumberField`}),` collects a numeric value with locale-aware display, keyboard stepping, and optional increment and decrement buttons.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { NumberField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsx)(t.p,{children:`Use it for quantities, percentages, rates, and other values that are mathematically numeric.`}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Prefer `,(0,p.jsx)(t.code,{children:`TextField`}),` with an appropriate `,(0,p.jsx)(t.code,{children:`inputMode`}),` for digit-shaped identifiers such as account numbers, telephone numbers, and postcodes. Prefer `,(0,p.jsx)(t.code,{children:`Slider`}),` when approximate adjustment within a bounded range is more important than exact entry.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { NumberField } from '@motech-development/breeze-ui';

<NumberField.Root defaultValue={2} min={1} max={20} step={1}>
  <NumberField.Label>Quantity</NumberField.Label>
  <NumberField.Group>
    <NumberField.DecrementButton aria-label="Decrease quantity">
      −
    </NumberField.DecrementButton>
    <NumberField.Input name="quantity" />
    <NumberField.IncrementButton aria-label="Increase quantity">
      +
    </NumberField.IncrementButton>
  </NumberField.Group>
  <NumberField.Description>Choose from 1 to 20.</NumberField.Description>
</NumberField.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.Root`})}),(0,p.jsx)(t.td,{children:`Owns numeric value, range, step, formatting, and field state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.Label`})}),(0,p.jsx)(t.td,{children:`Persistently names the spinbutton.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.Group`})}),(0,p.jsx)(t.td,{children:`Visually joins input and optional step controls.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.Input`})}),(0,p.jsx)(t.td,{children:`Editable locale-aware spinbutton.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.DecrementButton`})}),(0,p.jsx)(t.td,{children:`Subtracts one configured step.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.IncrementButton`})}),(0,p.jsx)(t.td,{children:`Adds one configured step.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.Description`})}),(0,p.jsx)(t.td,{children:`Associates range or format guidance.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`NumberField.Error`})}),(0,p.jsx)(t.td,{children:`Associates validation feedback while invalid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Stepper buttons are optional. When present, give each a literal accessible `,(0,p.jsx)(t.code,{children:`aria-label`}),` and match its `,(0,p.jsx)(t.code,{children:`size`}),` to the input.`]}),`
`,(0,p.jsx)(t.h2,{id:`numeric-value-and-callbacks`,children:`Numeric value and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[`The public value is `,(0,p.jsx)(t.code,{children:`number | null`}),`; `,(0,p.jsx)(t.code,{children:`null`}),` represents an empty input. Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the parsed next number or `,(0,p.jsx)(t.code,{children:`null`}),`, never a DOM event and never `,(0,p.jsx)(t.code,{children:`NaN`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`min`}),`, `,(0,p.jsx)(t.code,{children:`max`}),`, and `,(0,p.jsx)(t.code,{children:`step`}),` constrain stepping and validity; `,(0,p.jsx)(t.code,{children:`step`}),` defaults to `,(0,p.jsx)(t.code,{children:`1`}),`. `,(0,p.jsx)(t.code,{children:`formatOptions`}),` accepts `,(0,p.jsx)(t.code,{children:`Intl.NumberFormatOptions`}),`, for example `,(0,p.jsx)(t.code,{children:`{ style: 'percent' }`}),` or `,(0,p.jsx)(t.code,{children:`{ style: 'currency', currency: 'GBP' }`}),`. Store the numeric value, not the formatted display string.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus, editing, and stepping. `,(0,p.jsx)(t.code,{children:`readOnly`}),` keeps a controlled value immutable. Set `,(0,p.jsx)(t.code,{children:`invalid`}),` and render `,(0,p.jsx)(t.code,{children:`Error`}),` for application validation. Empty input is supported through `,(0,p.jsx)(t.code,{children:`null`}),`. The application owns loading and asynchronous validation.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility, and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Tab focuses the spinbutton. Up Arrow increments and Down Arrow decrements by `,(0,p.jsx)(t.code,{children:`step`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Page Up and Page Down perform larger steps where supported; Home and End move to finite bounds where supported.`}),`
`,(0,p.jsx)(t.li,{children:`Typing, deletion, and locale-appropriate decimal and grouping characters use platform and locale behaviour.`}),`
`,(0,p.jsxs)(t.li,{children:[`Always provide `,(0,p.jsx)(t.code,{children:`Label`}),`. Describe range, unit, or special formatting in `,(0,p.jsx)(t.code,{children:`Description`}),`; do not put essential unit information only in a visual addon.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`formatOptions`}),` for localisation rather than manually adding currency symbols to the stored value.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`Formatting follows the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` locale and the surrounding direction. Right-to-left layout reverses visual ordering appropriately while the number remains locale formatted.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not store the formatted text, use a number field for an identifier, pass numeric state to `,(0,p.jsx)(t.code,{children:`Input`}),`, or omit step-button names. Be careful with binary floating-point for money; convert to an appropriate minor-unit or decimal representation at the domain boundary. Use `,(0,p.jsx)(t.code,{children:`Slider`}),` for bounded direct manipulation, `,(0,p.jsx)(t.code,{children:`TextField`}),` for numeric-looking strings, and `,(0,p.jsx)(t.code,{children:`InputGroup`}),` for a purely visual unit when locale formatting is not appropriate.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};