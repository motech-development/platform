import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Visibility as c,n as l,t as u}from"./PasswordField.stories-C9PEqi4i.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Labelled password-entry pattern with controlled, uncontrolled or read-only string state, semantic change callbacks, validation anatomy and a provider-localised keyboard-operable visibility action.`}),`
`,(0,p.jsx)(t.h1,{id:`passwordfield`,children:`PasswordField`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`PasswordField`}),` provides labelled password entry with supporting guidance, validation feedback and a show-or-hide action.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { PasswordField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`PasswordField`}),` for a current or new password when the canonical label, input, description, error and visibility composition is sufficient.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use compound `,(0,p.jsx)(t.code,{children:`TextField`}),` with `,(0,p.jsx)(t.code,{children:`type="password"`}),` when you need native attributes or composition points that PasswordField does not expose. Use a normal `,(0,p.jsx)(t.code,{children:`TextField`}),` for non-secret text. PasswordField does not validate password strength, compare fields, generate passwords, store credentials or submit forms.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { PasswordField } from '@motech-development/breeze-ui';
import { useState } from 'react';

export function NewPasswordField() {
  const [password, setPassword] = useState('');

  return (
    <PasswordField
      autoComplete="new-password"
      description="Use at least 12 characters."
      label="New password"
      name="new-password"
      onChange={setPassword}
      required
      value={password}
    />
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsx)(t.p,{children:`PasswordField is a fixed pattern rather than a public compound namespace.`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Region`}),(0,p.jsx)(t.th,{children:`Responsibility`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Label`}),(0,p.jsx)(t.td,{children:`Required persistent accessible name for the native input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Input group`}),(0,p.jsx)(t.td,{children:`One visual surface containing the password input and visibility action.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Visibility action`}),(0,p.jsxs)(t.td,{children:[`Toggles the native input between `,(0,p.jsx)(t.code,{children:`type="password"`}),` and `,(0,p.jsx)(t.code,{children:`type="text"`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Description`}),(0,p.jsx)(t.td,{children:`Optional persistent requirements or guidance associated with the input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Error`}),(0,p.jsx)(t.td,{children:`Optional validation message associated while the field is invalid.`})]})]})]}),`
`,(0,p.jsx)(t.p,{children:`Visibility is internal presentation state and always starts hidden. It does not alter the password string. Read-only values may still be revealed; disabled fields disable both editing and the visibility action.`}),`
`,(0,p.jsx)(t.h2,{id:`value-state-and-callbacks`,children:`Value state and callbacks`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Uncontrolled:`}),` omit `,(0,p.jsx)(t.code,{children:`value`}),`; `,(0,p.jsx)(t.code,{children:`defaultValue`}),` defaults to an empty string. Optional `,(0,p.jsx)(t.code,{children:`onChange`}),` observes edits.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Controlled:`}),` provide `,(0,p.jsx)(t.code,{children:`value`}),` and `,(0,p.jsx)(t.code,{children:`onChange`}),`. The callback receives the complete next password string, never a DOM event.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:`Read-only:`}),` provide `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),`; omit `,(0,p.jsx)(t.code,{children:`onChange`}),` and `,(0,p.jsx)(t.code,{children:`defaultValue`}),`.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`Controlled and uncontrolled props are mutually exclusive. Mutable controlled state requires `,(0,p.jsx)(t.code,{children:`onChange`}),`; PasswordField throws if JavaScript bypasses that public TypeScript contract. The application owns password rules, strength calculations, matching, submission, server errors and security handling.`]}),`
`,(0,p.jsx)(t.h2,{id:`sizes-validation-and-browser-behaviour`,children:`Sizes, validation and browser behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`size`}),` accepts `,(0,p.jsx)(t.code,{children:`'sm'`}),`, `,(0,p.jsx)(t.code,{children:`'md'`}),` or `,(0,p.jsx)(t.code,{children:`'lg'`}),` and defaults to `,(0,p.jsx)(t.code,{children:`'md'`}),`; it sizes both the input and visibility action. Appearance and semantic colour are fixed.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Set `,(0,p.jsx)(t.code,{children:`invalid`}),` with meaningful `,(0,p.jsx)(t.code,{children:`error`}),` copy to expose invalid state and its associated message. `,(0,p.jsx)(t.code,{children:`required`}),` supplies native and accessible required state but does not invent a business rule. `,(0,p.jsx)(t.code,{children:`description`}),` remains visible for persistent requirements. `,(0,p.jsx)(t.code,{children:`placeholder`}),` is optional example text and never replaces `,(0,p.jsx)(t.code,{children:`label`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`autoComplete="current-password"`}),` for an existing credential and `,(0,p.jsx)(t.code,{children:`autoComplete="new-password"`}),` for creation or reset. `,(0,p.jsx)(t.code,{children:`'off'`}),` is supported but browsers and password managers may choose their own security behaviour. `,(0,p.jsx)(t.code,{children:`name`}),` participates in native submission. There is no loading or empty-content mode; use the empty string as the empty value and keep pending submission state on the form action.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`The native input supports ordinary text-entry, selection, copy and paste keyboard behaviour. Tab moves to the visibility button; Enter or Space toggles visibility.`}),`
`,(0,p.jsxs)(t.li,{children:[`The visibility icon is decorative. Its required accessible label switches between the provider messages `,(0,p.jsx)(t.code,{children:`showPassword`}),` and `,(0,p.jsx)(t.code,{children:`hidePassword`}),`; configure those messages for the application locale.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Keep `,(0,p.jsx)(t.code,{children:`label`}),` visible and translate label, guidance and validation copy. Password values are opaque strings and are never translated or reformatted.`]}),`
`,(0,p.jsx)(t.li,{children:`Provider direction is inherited by the field. Do not alter or reverse a password based on writing direction.`}),`
`,(0,p.jsx)(t.li,{children:`Disabling prevents focus and editing. Read-only preserves focus and copying; explain immutable state when it is not obvious.`}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[`PasswordField performs no routing. It exposes no custom class, ref, id, input mode, length constraints, pattern, ARIA attribute pass-through or custom visibility icon; compose `,(0,p.jsx)(t.code,{children:`TextField`}),`, `,(0,p.jsx)(t.code,{children:`InputGroup`}),` and `,(0,p.jsx)(t.code,{children:`IconButton`}),` directly when those deliberate public capabilities are needed.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not put strength instructions only in a placeholder, use `,(0,p.jsx)(t.code,{children:`invalid`}),` without useful error copy, log password values in callbacks, disable password-manager support without a concrete reason, or assume the visibility toggle changes value state. Use `,(0,p.jsx)(t.code,{children:`TextField`}),` for custom password anatomy and `,(0,p.jsx)(t.code,{children:`FormSection`}),` or `,(0,p.jsx)(t.code,{children:`FormActions`}),` for surrounding form structure.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};