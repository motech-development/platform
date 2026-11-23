import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CLBI5k0w.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Blur as c,Controlled as l,Default as u,Disabled as d,Error as f,Loading as p,Optional as m,ReadOnly as h,TodayAction as g,n as _,t as v}from"./DatePicker.stories-DK8NgH8_.js";function y(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o,{of:v,summary:`A date field, required by default, with an ISO value and localized trigger.`}),`
`,(0,x.jsx)(t.h1,{id:`datepicker`,children:`DatePicker`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`DatePicker`}),` is a form field for choosing a date from a calendar. The field shows the selected date in the provider locale's long format, and opens the calendar when activated. Values are ISO `,(0,x.jsx)(t.code,{children:`YYYY-MM-DD`}),` strings.`]}),`
`,(0,x.jsx)(a,{of:u}),`
`,(0,x.jsxs)(t.p,{children:[`When no date is selected, the field shows `,(0,x.jsx)(t.code,{children:`placeholder`}),`, or the provider's `,(0,x.jsx)(t.code,{children:`selectDate`}),` message if you omit it.`]}),`
`,(0,x.jsx)(t.h2,{id:`today`,children:`Today`}),`
`,(0,x.jsxs)(t.p,{children:[`The calendar has a `,(0,x.jsx)(t.strong,{children:`Today`}),` button that selects the current date, reports it through `,(0,x.jsx)(t.code,{children:`onChange`}),` and closes the calendar.`]}),`
`,(0,x.jsx)(a,{of:g}),`
`,(0,x.jsx)(t.h2,{id:`validation`,children:`Validation`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`error`}),` to a non-empty message to show it and mark the field invalid.`]}),`
`,(0,x.jsx)(a,{of:f}),`
`,(0,x.jsx)(t.h2,{id:`disabled`,children:`Disabled`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`disabled`}),` to prevent interaction. A disabled date is not included in form submission.`]}),`
`,(0,x.jsx)(a,{of:d}),`
`,(0,x.jsx)(t.h2,{id:`read-only`,children:`Read only`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`readOnly`}),` to show a recorded date that cannot be changed, for example in a view mode. The field stays focusable and the date is included in form submission, but the calendar does not open.`]}),`
`,(0,x.jsx)(a,{of:h}),`
`,(0,x.jsx)(t.h2,{id:`optional-dates`,children:`Optional dates`}),`
`,(0,x.jsxs)(t.p,{children:[`Unlike other fields, `,(0,x.jsx)(t.code,{children:`DatePicker`}),` is required by default, and a required date cannot be cleared.`]}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`required={false}`}),` to make the date optional. The calendar then shows a clear button beside `,(0,x.jsx)(t.strong,{children:`Today`}),`, which empties the field, closes the calendar and reports `,(0,x.jsx)(t.code,{children:`null`}),`. The clear button is unavailable while the field is empty.`]}),`
`,(0,x.jsxs)(t.p,{children:[`With an optional date, `,(0,x.jsx)(t.code,{children:`onChange`}),` must accept `,(0,x.jsx)(t.code,{children:`null`}),`, and an uncontrolled field can start from `,(0,x.jsx)(t.code,{children:`defaultValue={null}`}),`. On a required date, `,(0,x.jsx)(t.code,{children:`onChange`}),` only ever receives a date string, and TypeScript rejects `,(0,x.jsx)(t.code,{children:`defaultValue={null}`}),`. A controlled required field can still pass `,(0,x.jsx)(t.code,{children:`value={null}`}),` until a date is chosen.`]}),`
`,(0,x.jsx)(a,{of:m}),`
`,(0,x.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`loading`}),` while the date is unavailable. The label, field and supporting text are replaced by placeholders, the provider's loading message is announced, and the field cannot be used or submitted until loading ends. Errors are hidden and an open calendar closes; the selected value is kept.`]}),`
`,(0,x.jsx)(a,{of:p}),`
`,(0,x.jsx)(t.h2,{id:`controlled-values`,children:`Controlled values`}),`
`,(0,x.jsxs)(t.p,{children:[`Pass `,(0,x.jsx)(t.code,{children:`value`}),` and `,(0,x.jsx)(t.code,{children:`onChange`}),` to control the field. Set `,(0,x.jsx)(t.code,{children:`value`}),` to `,(0,x.jsx)(t.code,{children:`null`}),` for an empty field.`]}),`
`,(0,x.jsxs)(t.p,{children:[`For an uncontrolled field, use `,(0,x.jsx)(t.code,{children:`defaultValue`}),` with an optional `,(0,x.jsx)(t.code,{children:`onChange`}),`. Controlled and uncontrolled props cannot be combined. An uncontrolled field returns to `,(0,x.jsx)(t.code,{children:`defaultValue`}),` when its form is reset.`]}),`
`,(0,x.jsx)(a,{of:l}),`
`,(0,x.jsx)(t.h2,{id:`blur`,children:`Blur`}),`
`,(0,x.jsxs)(t.p,{children:[(0,x.jsx)(t.code,{children:`onBlur`}),` reports that focus has left the field, for example to show a
validation error only once the user has moved on. Like `,(0,x.jsx)(t.code,{children:`onChange`}),`, it receives
no DOM event. It reports once when focus leaves the whole field: moving into
the calendar and choosing a date do not count.`]}),`
`,(0,x.jsx)(a,{of:c}),`
`,(0,x.jsx)(t.h2,{id:`forms`,children:`Forms`}),`
`,(0,x.jsxs)(t.p,{children:[`Set `,(0,x.jsx)(t.code,{children:`name`}),` to include the date in form submission as an ISO string; an empty field submits an empty string. There is no `,(0,x.jsx)(t.code,{children:`autoComplete`}),` prop, as browser autofill does not apply to the date button.`]}),`
`,(0,x.jsx)(t.h2,{id:`localisation`,children:`Localisation`}),`
`,(0,x.jsxs)(t.p,{children:[`Override the provider's `,(0,x.jsx)(t.code,{children:`selectDate`}),`, `,(0,x.jsx)(t.code,{children:`today`}),`, `,(0,x.jsx)(t.code,{children:`clearDate`}),` and `,(0,x.jsx)(t.code,{children:`required`}),` messages to translate the placeholder, the `,(0,x.jsx)(t.strong,{children:`Today`}),` and clear buttons, and the required announcement. Untranslated messages are in English and marked as `,(0,x.jsx)(t.code,{children:`en-GB`}),` for screen readers.`]}),`
`,(0,x.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,x.jsxs)(t.ul,{children:[`
`,(0,x.jsx)(t.li,{children:`The visible label names the field, which announces whether it is required or invalid.`}),`
`,(0,x.jsx)(t.li,{children:`The calendar supports keyboard navigation and announces dates in the provider locale.`}),`
`,(0,x.jsx)(t.li,{children:`On touch devices, controls have a minimum 44px target.`}),`
`]}),`
`,(0,x.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,x.jsx)(i,{})]})}function b(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,x.jsx)(t,{...e,children:(0,x.jsx)(y,{...e})}):y(e)}var x;e((()=>{x=t(),s(),r(),_()}))();export{b as default};