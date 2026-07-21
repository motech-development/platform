import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{KeyboardSelection as c,n as l,t as u}from"./Calendar.stories-B78RimqP.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Always-visible locale-aware calendar for selecting one stable YYYY-MM-DD date, with compound navigation and grid parts, date constraints, and controlled, uncontrolled, or read-only state.`}),`
`,(0,p.jsx)(t.h1,{id:`calendar`,children:`Calendar`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Calendar`}),` presents an always-visible, keyboard-navigable month grid for selecting one calendar date.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Calendar } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Calendar`}),` when the month grid should remain visible or is central to the task.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`DatePicker`}),` for a compact labelled form control, `,(0,p.jsx)(t.code,{children:`DateField`}),` for direct segmented entry, and `,(0,p.jsx)(t.code,{children:`RangeCalendar`}),` for an inclusive start and end date. A calendar is not a replacement for a labelled form field when space or form conventions call for one.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Calendar } from '@motech-development/breeze-ui';

<Calendar.Root defaultValue="2026-07-20">
  <Calendar.Header>
    <Calendar.PreviousButton />
    <Calendar.Heading />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid />
</Calendar.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Calendar.Root`})}),(0,p.jsx)(t.td,{children:`Owns selection, visible month, constraints and calendar semantics.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Calendar.Header`})}),(0,p.jsx)(t.td,{children:`Lays out the navigation controls and current-month heading.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Calendar.PreviousButton`})}),(0,p.jsx)(t.td,{children:`Moves to the previous calendar page.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Calendar.Heading`})}),(0,p.jsx)(t.td,{children:`Supplies the locale-formatted visible month heading and grid label.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Calendar.NextButton`})}),(0,p.jsx)(t.td,{children:`Moves to the next calendar page.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Calendar.Grid`})}),(0,p.jsx)(t.td,{children:`Renders weekday headings and the complete date-cell grid.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Keep the navigation parts in `,(0,p.jsx)(t.code,{children:`Header`}),` and `,(0,p.jsx)(t.code,{children:`Grid`}),` inside `,(0,p.jsx)(t.code,{children:`Root`}),`. Breeze owns cells, selected styling and unavailable-date semantics; applications do not render individual days.`]}),`
`,(0,p.jsx)(t.h2,{id:`selection-and-constraints`,children:`Selection and constraints`}),`
`,(0,p.jsxs)(t.p,{children:[`The public value is a `,(0,p.jsx)(t.code,{children:`YYYY-MM-DD`}),` string such as `,(0,p.jsx)(t.code,{children:`'2026-07-20'`}),`, or `,(0,p.jsx)(t.code,{children:`null`}),` when empty. Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled selection, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled selection, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable selection. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives the newly selected stable date or `,(0,p.jsx)(t.code,{children:`null`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`minValue`}),` and `,(0,p.jsx)(t.code,{children:`maxValue`}),` bound selection. `,(0,p.jsx)(t.code,{children:`isDateUnavailable(date)`}),` receives the same stable format and disables a specific date when it returns `,(0,p.jsx)(t.code,{children:`true`}),`. `,(0,p.jsx)(t.code,{children:`invalid`}),` announces that the current selection is unacceptable but does not render an error message; place application-owned explanatory text next to the calendar. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and selection. `,(0,p.jsx)(t.code,{children:`visibleMonths`}),` displays adjacent months but does not change the single-date value model. There is no loading state.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-labelling-and-locale`,children:`Keyboard, labelling and locale`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Arrow keys move by day or week according to locale direction. Home and End move within a week; Page Up and Page Down move by month, with the platform modifier moving by a larger period.`}),`
`,(0,p.jsx)(t.li,{children:`Enter or Space selects the focused available date. The previous and next buttons are separately tabbable and operable with Enter or Space.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Heading`}),` gives the grid its accessible visible-period label. Keep it in the composition even if surrounding text also describes the calendar.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Weekday names, week boundaries, date announcements and month headings follow the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` locale. Logical navigation and arrow icons adapt to right-to-left direction.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`weekdayStyle="short"`}),` is the default; use `,(0,p.jsx)(t.code,{children:`narrow`}),` only when space is genuinely constrained because one-letter labels can be ambiguous.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass date objects or locale-formatted strings, render your own day buttons inside `,(0,p.jsx)(t.code,{children:`Grid`}),`, or hide unavailable dates instead of disabling them. Avoid large `,(0,p.jsx)(t.code,{children:`visibleMonths`}),` values in narrow layouts. Use `,(0,p.jsx)(t.code,{children:`RangeCalendar`}),` for a period, `,(0,p.jsx)(t.code,{children:`DatePicker`}),` for a compact popup, and `,(0,p.jsx)(t.code,{children:`FormattedDateTime`}),` for read-only prose.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};