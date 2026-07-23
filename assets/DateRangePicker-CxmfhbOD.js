import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{UncontrolledRange as c,n as l,t as u}from"./DateRangePicker.stories-X36pt5ts.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Compound labelled form control for selecting an inclusive date range as stable YYYY-MM-DD start and end strings, with segmented inputs, a range-calendar popover, paired native form values, constraints, and controlled, uncontrolled, or read-only state.`}),`
`,(0,p.jsx)(t.h1,{id:`daterangepicker`,children:`DateRangePicker`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`DateRangePicker`}),` combines start and end date segments with a calendar popover for selecting one inclusive date range.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DateRangePicker } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`DateRangePicker`}),` for a compact labelled period field where users benefit from both exact segment editing and calendar comparison.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`RangeCalendar`}),` when the grid should remain visible, `,(0,p.jsx)(t.code,{children:`DatePicker`}),` for one day, and separate `,(0,p.jsx)(t.code,{children:`DateField`}),` controls when the two dates are not one range.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DateRangePicker } from '@motech-development/breeze-ui';

<DateRangePicker.Root
  defaultValue={{ start: '2026-07-20', end: '2026-07-24' }}
  startName="periodStart"
  endName="periodEnd"
>
  <DateRangePicker.Label>Dates</DateRangePicker.Label>
  <DateRangePicker.Group>
    <DateRangePicker.StartInput />
    <DateRangePicker.Separator />
    <DateRangePicker.EndInput />
    <DateRangePicker.Trigger />
  </DateRangePicker.Group>
  <DateRangePicker.Popover>
    <DateRangePicker.Calendar />
  </DateRangePicker.Popover>
</DateRangePicker.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Root`})}),(0,p.jsx)(t.td,{children:`Owns inclusive range state, constraints, validation, form values and overlay coordination.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Label`})}),(0,p.jsx)(t.td,{children:`Visible accessible name for the complete range field.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Group`})}),(0,p.jsx)(t.td,{children:`Coherent start input, separator, end input and trigger control.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.StartInput`})}),(0,p.jsx)(t.td,{children:`Locale-aware segmented inclusive start date.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Separator`})}),(0,p.jsx)(t.td,{children:`Decorative logical-direction arrow between endpoints.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.EndInput`})}),(0,p.jsx)(t.td,{children:`Locale-aware segmented inclusive end date.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Trigger`})}),(0,p.jsx)(t.td,{children:`Opens the range-calendar popover.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Popover`})}),(0,p.jsx)(t.td,{children:`Positioned dismissible range-calendar overlay.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Calendar`})}),(0,p.jsx)(t.td,{children:`Complete range calendar with navigation and date cells.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Description`})}),(0,p.jsx)(t.td,{children:`Supporting guidance associated with the range.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DateRangePicker.Error`})}),(0,p.jsx)(t.td,{children:`Validation message associated with invalid state.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Preserve the part order shown above. The separator is hidden from assistive technology because start and end inputs already express endpoint meaning. Keep every part inside `,(0,p.jsx)(t.code,{children:`Root`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`range-callbacks-and-forms`,children:`Range, callbacks and forms`}),`
`,(0,p.jsxs)(t.p,{children:[`The value is `,(0,p.jsx)(t.code,{children:`{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }`}),`, with inclusive endpoints, or `,(0,p.jsx)(t.code,{children:`null`}),` when empty. Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the next complete stable range or `,(0,p.jsx)(t.code,{children:`null`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`startName`}),` and `,(0,p.jsx)(t.code,{children:`endName`}),` must be provided together. Breeze submits two hidden native values and resets uncontrolled state with its form. `,(0,p.jsx)(t.code,{children:`form`}),` can associate both with an external form. There is no single `,(0,p.jsx)(t.code,{children:`name`}),` because the endpoints are distinct values.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`minValue`}),` and `,(0,p.jsx)(t.code,{children:`maxValue`}),` are inclusive `,(0,p.jsx)(t.code,{children:`YYYY-MM-DD`}),` boundaries. `,(0,p.jsx)(t.code,{children:`isDateUnavailable(date, anchorDate)`}),` receives the candidate date and current selection anchor. By default an unavailable date blocks a range crossing it; set `,(0,p.jsx)(t.code,{children:`allowsNonContiguousRanges`}),` only when the domain explicitly permits that meaning. `,(0,p.jsx)(t.code,{children:`required`}),`, `,(0,p.jsx)(t.code,{children:`invalid`}),`, `,(0,p.jsx)(t.code,{children:`disabled`}),` and `,(0,p.jsx)(t.code,{children:`readOnly`}),` expose state; render `,(0,p.jsx)(t.code,{children:`Error`}),` for invalid data. Loading is application-owned.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility and direction`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Tab moves through the compound field and trigger. Arrow keys move between or increment start/end segments; numeric typing edits focused segments.`}),`
`,(0,p.jsxs)(t.li,{children:[`Enter or Space opens the popover from `,(0,p.jsx)(t.code,{children:`Trigger`}),`; Escape closes it and restores focus. Calendar arrow keys navigate and Enter or Space chooses range endpoints.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Always render `,(0,p.jsx)(t.code,{children:`Label`}),`. Start and end segments receive distinct accessible endpoint names; `,(0,p.jsx)(t.code,{children:`Description`}),` and `,(0,p.jsx)(t.code,{children:`Error`}),` apply to the complete field.`]}),`
`,(0,p.jsx)(t.li,{children:`Locale controls segment order, weekday names, week layout and announcements while stored values stay ISO ordered.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Separator`}),` mirrors in right-to-left direction without swapping semantic `,(0,p.jsx)(t.code,{children:`start`}),` and `,(0,p.jsx)(t.code,{children:`end`}),`. Popover placement uses logical direction.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not reverse start and end for right-to-left layouts, use exclusive-end semantics, provide only one form name, pass date objects or localised strings, or treat non-contiguous ranges as a validation shortcut. Use `,(0,p.jsx)(t.code,{children:`RangeCalendar`}),` for a persistent surface and `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` when selecting one instant rather than two calendar days.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};