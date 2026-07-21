import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{SegmentKeyboard as c,n as l,t as u}from"./TimeField.stories-BtiXPK3H.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Locale-aware segmented entry for one wall-clock time, using stable HH:mm or HH:mm:ss values with native form participation and controlled, uncontrolled, or read-only state.`}),`
`,(0,p.jsx)(t.h1,{id:`timefield`,children:`TimeField`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`TimeField`}),` edits a wall-clock time through locale-aware segments without attaching it to a date or time zone.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { TimeField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`TimeField`}),` for a time of day whose date and zone are separate business concepts. Use `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` for a complete instant with an explicit offset, or `,(0,p.jsx)(t.code,{children:`FormattedDateTime`}),` to display rather than edit a date-time. Do not use it for elapsed durations, countdowns or free-form time text.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { TimeField } from '@motech-development/breeze-ui';

<TimeField.Root
  defaultValue="14:30"
  minValue="09:00"
  maxValue="17:00"
  name="startTime"
>
  <TimeField.Label>Start time</TimeField.Label>
  <TimeField.Input />
  <TimeField.Description>Between 09:00 and 17:00.</TimeField.Description>
</TimeField.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TimeField.Root`})}),(0,p.jsx)(t.td,{children:`Owns stable time state, boundaries, validation and native form integration.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TimeField.Label`})}),(0,p.jsx)(t.td,{children:`Visible accessible name for the segmented input.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TimeField.Input`})}),(0,p.jsx)(t.td,{children:`Locale-aware editable hour, minute and optional second segments.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TimeField.Description`})}),(0,p.jsx)(t.td,{children:`Supporting guidance associated with the field.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`TimeField.Error`})}),(0,p.jsx)(t.td,{children:`Validation message associated with an invalid field.`})]})]})]}),`
`,(0,p.jsx)(t.h2,{id:`values-precision-and-state`,children:`Values, precision and state`}),`
`,(0,p.jsxs)(t.p,{children:[`Use 24-hour stable strings: `,(0,p.jsx)(t.code,{children:`'14:30'`}),` for minute precision or `,(0,p.jsx)(t.code,{children:`'14:30:45'`}),` for second precision. An empty value is `,(0,p.jsx)(t.code,{children:`null`}),`. The visual control may present a locale-appropriate 12- or 24-hour cycle, but callbacks always use the stable 24-hour format. Seconds appear when any of `,(0,p.jsx)(t.code,{children:`value`}),`, `,(0,p.jsx)(t.code,{children:`defaultValue`}),`, `,(0,p.jsx)(t.code,{children:`minValue`}),` or `,(0,p.jsx)(t.code,{children:`maxValue`}),` contains three colon-separated segments; keep precision consistent across those props.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the next complete stable time or `,(0,p.jsx)(t.code,{children:`null`}),`. `,(0,p.jsx)(t.code,{children:`minValue`}),` and `,(0,p.jsx)(t.code,{children:`maxValue`}),` are inclusive. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and changes; `,(0,p.jsx)(t.code,{children:`readOnly`}),` preserves an inspectable controlled value; `,(0,p.jsx)(t.code,{children:`invalid`}),` and `,(0,p.jsx)(t.code,{children:`required`}),` expose validation state. Empty and loading behaviour remain application-owned.`]}),`
`,(0,p.jsxs)(t.p,{children:[`When `,(0,p.jsx)(t.code,{children:`name`}),` is supplied, the hidden native time input submits the stable value. Use `,(0,p.jsx)(t.code,{children:`form`}),` for an external form and `,(0,p.jsx)(t.code,{children:`inputRef`}),` only when direct access to that hidden input is necessary.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab enters and leaves the segmented control. Arrow keys move between or increment segments; numeric typing edits the focused segment, and Backspace or Delete clears editable content.`}),`
`,(0,p.jsxs)(t.li,{children:[`Always render `,(0,p.jsx)(t.code,{children:`Label`}),`. Use `,(0,p.jsx)(t.code,{children:`Description`}),` for constraints and `,(0,p.jsx)(t.code,{children:`Error`}),` for a correction when `,(0,p.jsx)(t.code,{children:`invalid`}),` is true.`]}),`
`,(0,p.jsx)(t.li,{children:`Locale controls visual segment order, hour cycle and spoken labels. Provider direction controls logical layout.`}),`
`,(0,p.jsx)(t.li,{children:`Do not localise the stored value or infer a time zone from the displayed hour. Daylight-saving rules do not apply because this component has no date or zone.`}),`
`,(0,p.jsx)(t.li,{children:`Do not communicate required, invalid or disabled state only through appearance.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass a JavaScript `,(0,p.jsx)(t.code,{children:`Date`}),`, an ISO date-time, a locale-formatted time or an offset such as `,(0,p.jsx)(t.code,{children:`+01:00`}),`. Do not mix minute and second precision accidentally. Use `,(0,p.jsx)(t.code,{children:`DateField`}),` for a separate calendar date, `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` for one date-time instant, and `,(0,p.jsx)(t.code,{children:`RelativeTime`}),` for phrases such as “in 2 hours”.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};