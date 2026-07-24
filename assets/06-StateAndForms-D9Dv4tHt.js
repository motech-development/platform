import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,s as i}from"./blocks-BKOn9Gx8.js";import{t as a}from"./mdx-react-shim-y1jXGhTh.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/06 State and forms`,summary:`Use Breeze controlled, uncontrolled, read-only, validation and native form contracts consistently.`}),`
`,(0,c.jsx)(t.h1,{id:`state-and-forms`,children:`State and forms`}),`
`,(0,c.jsx)(t.p,{children:`Breeze state callbacks receive semantic values rather than DOM events. Applications own form libraries, schemas, submission, cross-field rules, server errors and business validation.`}),`
`,(0,c.jsx)(t.h2,{id:`state-vocabulary`,children:`State vocabulary`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Behaviour`}),(0,c.jsx)(t.th,{children:`Controlled`}),(0,c.jsx)(t.th,{children:`Uncontrolled`}),(0,c.jsx)(t.th,{children:`Callback`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Field value`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`value`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`defaultValue`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`onChange(nextValue)`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Open state`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`open`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`defaultOpen`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`onOpenChange(nextOpen)`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Collection selection`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`selection`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`defaultSelection`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`onSelectionChange(nextSelection)`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Toggle state`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`selected`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`defaultSelected`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`onChange(nextSelected)`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Discrete activation`}),(0,c.jsx)(t.td,{children:`Application-owned state`}),(0,c.jsx)(t.td,{children:`—`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`onAction()`})})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Controlled and uncontrolled props are mutually exclusive TypeScript unions. A mutable controlled value requires its change callback. To display an intentionally immutable controlled value, use `,(0,c.jsx)(t.code,{children:`readOnly`}),` where the API supports it.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { TextField } from '@motech-development/breeze-ui';
import { useState } from 'react';

export function ControlledTitleField() {
  const [title, setTitle] = useState('Draft item');

  return (
    <TextField.Root value={title} onChange={setTitle} required>
      <TextField.Label>Title</TextField.Label>
      <TextField.Input name="title" />
      <TextField.Description>Use a concise title.</TextField.Description>
      <TextField.Error>Enter a title.</TextField.Error>
    </TextField.Root>
  );
}
`})}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`<TextField.Root value="Archived item" readOnly>
  <TextField.Label>Title</TextField.Label>
  <TextField.Input name="title" />
</TextField.Root>
`})}),`
`,(0,c.jsx)(t.h2,{id:`validation-and-errors`,children:`Validation and errors`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`required`}),` marks native and accessible required state; it does not invent application validation rules.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`invalid`}),` exposes invalid state and reveals the component's error part where applicable.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Place persistent guidance in `,(0,c.jsx)(t.code,{children:`Description`}),` and validation feedback in `,(0,c.jsx)(t.code,{children:`Error`}),`.`]}),`
`,(0,c.jsx)(t.li,{children:`Keep labels visible. Placeholder text is an example or hint, never the only accessible name.`}),`
`,(0,c.jsx)(t.li,{children:`Disabled controls do not accept interaction; explain why an unavailable action is disabled in nearby text when that reason is not evident.`}),`
`,(0,c.jsx)(t.li,{children:`Loading and option-loading errors are distinct from a selected value or field validation error. Use the dedicated parts provided by collection fields.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`native-forms`,children:`Native forms`}),`
`,(0,c.jsxs)(t.p,{children:[`Use documented `,(0,c.jsx)(t.code,{children:`name`}),`, `,(0,c.jsx)(t.code,{children:`type`}),`, `,(0,c.jsx)(t.code,{children:`value`}),`, `,(0,c.jsx)(t.code,{children:`required`}),`, `,(0,c.jsx)(t.code,{children:`autoComplete`}),` and submission attributes on the relevant control part. Native attributes that Breeze deliberately omits are not supported through an escape hatch. Breeze does not provide a `,(0,c.jsx)(t.code,{children:`Form`}),` component, schema adapter, field registration API, mask language or domain-specific field.`]}),`
`,(0,c.jsx)(t.h2,{id:`callback-semantics`,children:`Callback semantics`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`onAction`}),` means the user activated a discrete action; it does not expose a mouse or press event. `,(0,c.jsx)(t.code,{children:`onChange`}),` reports the next public value. Selection callbacks report `,(0,c.jsx)(t.code,{children:`CollectionSelection`}),`, which is a list of string or number keys or the literal `,(0,c.jsx)(t.code,{children:`'all'`}),`. Date and time callbacks report the ISO string contracts described in the internationalisation guide.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};