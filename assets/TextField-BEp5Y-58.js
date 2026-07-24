import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{AnatomyAndUncontrolled as c,n as l,t as u}from"./TextField.stories-DV2taYiV.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Labelled single-line text entry with controlled, uncontrolled, read-only, validation, and native form behaviour.`}),`
`,(0,p.jsx)(t.h1,{id:`textfield`,children:`TextField`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`TextField`}),` is the standard compound control for collecting one line of text with a persistent label and associated guidance.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { TextField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`TextField`}),` for names, references, email addresses, telephone numbers, URLs, passwords, and other short free-form values. Use `,(0,p.jsx)(t.code,{children:`TextArea`}),` for paragraphs, `,(0,p.jsx)(t.code,{children:`NumberField`}),` for quantities that need numeric stepping or locale-aware formatting, and `,(0,p.jsx)(t.code,{children:`SearchField`}),` for a query that can be submitted or cleared.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use a text field when the valid values form a known set. Prefer `,(0,p.jsx)(t.code,{children:`Select`}),` for compact selection, `,(0,p.jsx)(t.code,{children:`RadioGroup`}),` when all choices should remain visible, or `,(0,p.jsx)(t.code,{children:`ComboBox`}),` when users need to filter a large set.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { TextField } from '@motech-development/breeze-ui';

export function ContactField() {
  return (
    <TextField.Root>
      <TextField.Label>Email address</TextField.Label>
      <TextField.Input name="email" type="email" autoComplete="email" />
      <TextField.Description>Used for service updates.</TextField.Description>
    </TextField.Root>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextField.Root`})}),(0,p.jsx)(t.td,{children:`Owns value, disabled, read-only, required, and invalid state and associates the field parts.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextField.Label`})}),(0,p.jsx)(t.td,{children:`Persistently names the input. It renders a native label.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextField.Input`})}),(0,p.jsx)(t.td,{children:`Renders the native single-line input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextField.Description`})}),(0,p.jsx)(t.td,{children:`Provides supporting guidance associated with the input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TextField.Error`})}),(0,p.jsxs)(t.td,{children:[`Provides the accessible validation message when `,(0,p.jsx)(t.code,{children:`Root`}),` is invalid.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep all parts inside `,(0,p.jsx)(t.code,{children:`Root`}),`. A visible `,(0,p.jsx)(t.code,{children:`Label`}),` is the preferred accessible name; use `,(0,p.jsx)(t.code,{children:`aria-label`}),` or `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),` on `,(0,p.jsx)(t.code,{children:`Input`}),` only when a visible label is genuinely unsuitable.`]}),`
`,(0,p.jsx)(t.h2,{id:`value-and-state`,children:`Value and state`}),`
`,(0,p.jsxs)(t.p,{children:[`Uncontrolled fields use `,(0,p.jsx)(t.code,{children:`defaultValue`}),`; controlled fields pair `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),`; immutable controlled fields pair `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` and deliberately omit `,(0,p.jsx)(t.code,{children:`onChange`}),`.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { useState } from 'react';
import { TextField } from '@motech-development/breeze-ui';

export function ControlledReferenceField() {
  const [reference, setReference] = useState('BRZ-3');

  return (
    <TextField.Root value={reference} onChange={setReference}>
      <TextField.Label>Reference</TextField.Label>
      <TextField.Input name="reference" />
    </TextField.Root>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`onChange`}),` receives the complete next string, not a DOM change event. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and editing. `,(0,p.jsx)(t.code,{children:`readOnly`}),` keeps the value focusable and available to forms but prevents edits. `,(0,p.jsx)(t.code,{children:`required`}),` exposes required semantics; application validation remains responsible for setting `,(0,p.jsx)(t.code,{children:`invalid`}),` and rendering a helpful `,(0,p.jsx)(t.code,{children:`Error`}),`. An empty value is the empty string. Loading is application-owned; disable the field only when interaction must stop.`]}),`
`,(0,p.jsx)(t.h2,{id:`input-types-size-and-native-attributes`,children:`Input types, size, and native attributes`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Input`}),` supports `,(0,p.jsx)(t.code,{children:`type="text"`}),`, `,(0,p.jsx)(t.code,{children:`"email"`}),`, `,(0,p.jsx)(t.code,{children:`"password"`}),`, `,(0,p.jsx)(t.code,{children:`"tel"`}),`, and `,(0,p.jsx)(t.code,{children:`"url"`}),`, and sizes `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),` (default), and `,(0,p.jsx)(t.code,{children:`lg`}),`. It accepts relevant native input attributes such as `,(0,p.jsx)(t.code,{children:`name`}),`, `,(0,p.jsx)(t.code,{children:`placeholder`}),`, `,(0,p.jsx)(t.code,{children:`autoComplete`}),`, `,(0,p.jsx)(t.code,{children:`inputMode`}),`, `,(0,p.jsx)(t.code,{children:`pattern`}),`, `,(0,p.jsx)(t.code,{children:`minLength`}),`, `,(0,p.jsx)(t.code,{children:`maxLength`}),`, and `,(0,p.jsx)(t.code,{children:`aria-*`}),`. Put value and state props on `,(0,p.jsx)(t.code,{children:`Root`}),`, not `,(0,p.jsx)(t.code,{children:`Input`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-and-accessibility`,children:`Keyboard and accessibility`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab moves focus to and from the native input; normal platform text-editing, selection, clipboard, and undo commands are preserved.`}),`
`,(0,p.jsx)(t.li,{children:`The label must describe the expected value, not merely repeat the placeholder. Placeholders disappear and are not labels.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Description`}),` for format guidance before an error occurs. Use `,(0,p.jsx)(t.code,{children:`Error`}),` for a specific recovery instruction and set `,(0,p.jsx)(t.code,{children:`invalid`}),` on `,(0,p.jsx)(t.code,{children:`Root`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Keep `,(0,p.jsx)(t.code,{children:`required`}),` consistent with the application’s validation rules. Do not encode requiredness through an asterisk alone.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use an appropriate `,(0,p.jsx)(t.code,{children:`autoComplete`}),` token and `,(0,p.jsx)(t.code,{children:`type`}),`; browsers and assistive technology can then offer better input behaviour.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`Text values are Unicode strings and support left-to-right and right-to-left content. The component follows the surrounding `,(0,p.jsx)(t.code,{children:`dir`}),`; use `,(0,p.jsx)(t.code,{children:`dir="auto"`}),` on the input when user-authored content may have an unknown direction.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not pass `,(0,p.jsx)(t.code,{children:`value`}),`, `,(0,p.jsx)(t.code,{children:`defaultValue`}),`, `,(0,p.jsx)(t.code,{children:`disabled`}),`, `,(0,p.jsx)(t.code,{children:`readOnly`}),`, `,(0,p.jsx)(t.code,{children:`required`}),`, or `,(0,p.jsx)(t.code,{children:`onChange`}),` to `,(0,p.jsx)(t.code,{children:`Input`}),`; these belong to `,(0,p.jsx)(t.code,{children:`Root`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not switch between controlled and uncontrolled state during the component’s lifetime.`}),`
`,(0,p.jsx)(t.li,{children:`Do not hide a persistent label to save space; concise labels improve scanning and speech-input use.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`invalid`}),` merely to style a warning. It communicates a real validation failure.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`TextArea`}),` for multiline content, `,(0,p.jsx)(t.code,{children:`SearchField`}),` for submitted queries, `,(0,p.jsx)(t.code,{children:`NumberField`}),` for numeric values, `,(0,p.jsx)(t.code,{children:`PasswordField`}),` for a revealable password pattern, and `,(0,p.jsx)(t.code,{children:`InputGroup`}),` to visually combine an input with a unit or related action.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};