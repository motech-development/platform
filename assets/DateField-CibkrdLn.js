import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{SegmentKeyboard as c,n as l,t as u}from"./DateField.stories-qg916rRG.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Locale-aware segmented entry for one calendar date, with stable YYYY-MM-DD values, native form participation, validation, constraints, and controlled, uncontrolled, or read-only state.`}),`
`,(0,p.jsx)(t.h1,{id:`datefield`,children:`DateField`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`DateField`}),` edits one calendar date through locale-ordered day, month and year segments while keeping the application value a stable `,(0,p.jsx)(t.code,{children:`YYYY-MM-DD`}),` string.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DateField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`DateField`}),` when users should type or precisely adjust a known date. Use `,(0,p.jsx)(t.code,{children:`DatePicker`}),` when a calendar is the primary way to choose one date, `,(0,p.jsx)(t.code,{children:`Calendar`}),` for an always-visible calendar, `,(0,p.jsx)(t.code,{children:`DateRangePicker`}),` for an inclusive period, and `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` for an instant that includes a time and offset. Do not use a date field for free-form date text or timestamps.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DateField } from '@motech-development/breeze-ui';

<DateField.Root
  defaultValue="2026-07-20"
  minValue="2026-07-20"
  name="reviewDate"
>
  <DateField.Label>Review date</DateField.Label>
  <DateField.Input />
  <DateField.Description>
    Enter a date on or after 20 July.
  </DateField.Description>
</DateField.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateField.Root`})}),(0,p.jsx)(t.td,{children:`Owns date state, constraints, validation and the hidden native date input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateField.Label`})}),(0,p.jsx)(t.td,{children:`Visible accessible name for the segmented input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateField.Input`})}),(0,p.jsx)(t.td,{children:`Locale-aware editable day, month and year segments.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateField.Description`})}),(0,p.jsx)(t.td,{children:`Supporting guidance associated with the field.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateField.Error`})}),(0,p.jsx)(t.td,{children:`Validation message associated with an invalid field.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep every part inside `,(0,p.jsx)(t.code,{children:`Root`}),`. Provide a visible `,(0,p.jsx)(t.code,{children:`Label`}),`; use `,(0,p.jsx)(t.code,{children:`Description`}),` for format-independent guidance and `,(0,p.jsx)(t.code,{children:`Error`}),` for a specific correction.`]}),`
`,(0,p.jsx)(t.h2,{id:`values-state-and-callbacks`,children:`Values, state and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[`Dates are literal Gregorian ISO calendar strings such as `,(0,p.jsx)(t.code,{children:`'2026-07-20'`}),`; an empty value is `,(0,p.jsx)(t.code,{children:`null`}),`. A date contains no time or time zone. Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the next complete `,(0,p.jsx)(t.code,{children:`YYYY-MM-DD`}),` string or `,(0,p.jsx)(t.code,{children:`null`}),` when the editable value is cleared.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`minValue`}),`, `,(0,p.jsx)(t.code,{children:`maxValue`}),` and the date passed to `,(0,p.jsx)(t.code,{children:`isDateUnavailable`}),` use the same format. The callback returning `,(0,p.jsx)(t.code,{children:`true`}),` prevents that date from being selected. Constraints do not replace application validation: set `,(0,p.jsx)(t.code,{children:`invalid`}),` and render `,(0,p.jsx)(t.code,{children:`Error`}),` when submitted data is unacceptable.`]}),`
`,(0,p.jsxs)(t.p,{children:[`With `,(0,p.jsx)(t.code,{children:`name`}),`, the hidden native date input participates in form submission; `,(0,p.jsx)(t.code,{children:`form`}),` associates it with an external form. `,(0,p.jsx)(t.code,{children:`required`}),` supplies required semantics. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and editing. `,(0,p.jsx)(t.code,{children:`readOnly`}),` preserves an inspectable controlled value without allowing changes. There is no loading state; disable an enclosing workflow or show adjacent progress without replacing the label.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab enters and leaves the segmented control. Arrow keys move between or increment the locale-ordered segments; numeric typing edits the focused segment, and Backspace or Delete clears editable content.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not put a literal format such as “DD/MM/YYYY” in the label: segment order and spoken instructions follow the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` BCP 47 locale.`]}),`
`,(0,p.jsx)(t.li,{children:`The visible label is required for understandable segment names. Description and error text are associated automatically.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`invalid`}),`, `,(0,p.jsx)(t.code,{children:`required`}),`, `,(0,p.jsx)(t.code,{children:`disabled`}),` and `,(0,p.jsx)(t.code,{children:`readOnly`}),` are exposed to assistive technology; do not communicate them only through colour.`]}),`
`,(0,p.jsxs)(t.li,{children:[`The input follows provider direction, including right-to-left layouts. Keep the public value in `,(0,p.jsx)(t.code,{children:`YYYY-MM-DD`}),` order regardless of visual order.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass JavaScript `,(0,p.jsx)(t.code,{children:`Date`}),`, `,(0,p.jsx)(t.code,{children:`CalendarDate`}),`, locale-formatted strings or offset date-times. Do not combine `,(0,p.jsx)(t.code,{children:`defaultValue`}),` with `,(0,p.jsx)(t.code,{children:`value`}),`, omit `,(0,p.jsx)(t.code,{children:`onChange`}),` from a mutable controlled field, or make an uncontrolled field read-only. Use `,(0,p.jsx)(t.code,{children:`TimeField`}),` beside this component only when the values are intentionally independent; use `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` when they represent one instant.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};