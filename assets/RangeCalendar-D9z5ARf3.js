import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{UncontrolledRange as c,n as l,t as u}from"./RangeCalendar.stories-De9V6m76.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Always-visible locale-aware calendar for selecting an inclusive start and end date as stable YYYY-MM-DD strings, with compound navigation, constraints, and controlled, uncontrolled, or read-only state.`}),`
`,(0,p.jsx)(t.h1,{id:`rangecalendar`,children:`RangeCalendar`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`RangeCalendar`}),` presents one or more month grids for selecting an inclusive start and end date.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { RangeCalendar } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`RangeCalendar`}),` when comparing dates visually is central and the calendar should remain visible. Use `,(0,p.jsx)(t.code,{children:`DateRangePicker`}),` for a compact labelled form control, `,(0,p.jsx)(t.code,{children:`Calendar`}),` for one date, and two independent `,(0,p.jsx)(t.code,{children:`DateField`}),` instances only when the dates are not one coherent range.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { RangeCalendar } from '@motech-development/breeze-ui';

<RangeCalendar.Root defaultValue={{ start: '2026-07-20', end: '2026-07-24' }}>
  <RangeCalendar.Header>
    <RangeCalendar.PreviousButton />
    <RangeCalendar.Heading />
    <RangeCalendar.NextButton />
  </RangeCalendar.Header>
  <RangeCalendar.Grid />
</RangeCalendar.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RangeCalendar.Root`})}),(0,p.jsx)(t.td,{children:`Owns range selection, visible months and date constraints.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RangeCalendar.Header`})}),(0,p.jsx)(t.td,{children:`Lays out navigation and the visible-period heading.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RangeCalendar.PreviousButton`})}),(0,p.jsx)(t.td,{children:`Moves to the previous calendar page.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RangeCalendar.Heading`})}),(0,p.jsx)(t.td,{children:`Labels the current visible period.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RangeCalendar.NextButton`})}),(0,p.jsx)(t.td,{children:`Moves to the next calendar page.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`RangeCalendar.Grid`})}),(0,p.jsx)(t.td,{children:`Renders weekdays, days and range-selection semantics.`})]})]})]}),`
`,(0,p.jsx)(t.h2,{id:`range-behaviour-and-state`,children:`Range behaviour and state`}),`
`,(0,p.jsxs)(t.p,{children:[`A complete value is `,(0,p.jsx)(t.code,{children:`{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }`}),`; both endpoints are inclusive and `,(0,p.jsx)(t.code,{children:`start`}),` must not follow `,(0,p.jsx)(t.code,{children:`end`}),`. Empty state is `,(0,p.jsx)(t.code,{children:`null`}),`. Use `,(0,p.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`onChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`value`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,p.jsx)(t.code,{children:`onChange`}),` receives a complete stable range after selection.`]}),`
`,(0,p.jsxs)(t.p,{children:[`By default, an unavailable date blocks a range that crosses it. Set `,(0,p.jsx)(t.code,{children:`allowsNonContiguousRanges`}),` only when the domain explicitly permits a range containing unavailable days. `,(0,p.jsx)(t.code,{children:`isDateUnavailable(date, anchorDate)`}),` receives the candidate ISO date and the current range-selection anchor, or `,(0,p.jsx)(t.code,{children:`null`}),` before selection begins. `,(0,p.jsx)(t.code,{children:`minValue`}),` and `,(0,p.jsx)(t.code,{children:`maxValue`}),` are inclusive boundaries.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus and selection. `,(0,p.jsx)(t.code,{children:`invalid`}),` exposes an unacceptable selection but does not supply prose; render application-owned error text nearby. Read-only preserves navigation and inspection while preventing changes. Loading and persistence are application-owned.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Arrow keys move focus by day or week; Home and End move within a week; Page Up and Page Down change the visible month. Enter or Space sets the range start and then its inclusive end.`}),`
`,(0,p.jsxs)(t.li,{children:[`Keep `,(0,p.jsx)(t.code,{children:`Heading`}),` and navigation controls in the root so the grid has a clear visible period and operable paging.`]}),`
`,(0,p.jsx)(t.li,{children:`Week layout, weekday names, announcements and date formatting follow the provider locale. Directional navigation and icons follow provider direction.`}),`
`,(0,p.jsx)(t.li,{children:`Range meaning must not rely only on background colour. Breeze exposes selected range states to assistive technology.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`weekdayStyle="short"`}),` by default; `,(0,p.jsx)(t.code,{children:`long`}),` needs more width and `,(0,p.jsx)(t.code,{children:`narrow`}),` can be ambiguous.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use two unrelated scalar strings, exclusive-end semantics, date objects or locale-formatted values. Do not enable non-contiguous ranges merely to bypass an unavailable-date rule. Use `,(0,p.jsx)(t.code,{children:`DateRangePicker`}),` in forms, `,(0,p.jsx)(t.code,{children:`Calendar`}),` for one date, and `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` when each selection represents an instant rather than a calendar day.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};