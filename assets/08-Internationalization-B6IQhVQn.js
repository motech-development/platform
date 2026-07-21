import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,s as i}from"./blocks-LnNkZCnz.js";import{t as a}from"./mdx-react-shim-CjMysPAJ.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/08 Internationalization, dates, time zones, and direction`,summary:`Configure locale, translations, ISO date and time values, IANA time zones and right-to-left direction.`}),`
`,(0,c.jsx)(t.h1,{id:`internationalization-dates-time-zones-and-direction`,children:`Internationalization, dates, time zones, and direction`}),`
`,(0,c.jsxs)(t.p,{children:[`Set a BCP 47 locale on `,(0,c.jsx)(t.code,{children:`BreezeProvider`}),`. Breeze uses it for `,(0,c.jsx)(t.code,{children:`Intl`}),` formatting, date and collection behaviour, accessible announcements and inferred reading direction.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { BreezeProvider } from '@motech-development/breeze-ui';

<BreezeProvider
  locale="en-GB"
  timeZone="Europe/London"
  messages={{
    clear: 'Clear value',
    noResults: 'No matching options',
  }}
>
  <App />
</BreezeProvider>;
`})}),`
`,(0,c.jsx)(t.h2,{id:`public-temporal-values`,children:`Public temporal values`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Value`}),(0,c.jsx)(t.th,{children:`Public format`}),(0,c.jsx)(t.th,{children:`Example`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Date`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`YYYY-MM-DD`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`'2026-07-20'`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Time`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`HH:mm`}),` or `,(0,c.jsx)(t.code,{children:`HH:mm:ss`})]}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`'14:30'`}),` or `,(0,c.jsx)(t.code,{children:`'14:30:45'`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Date range`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`{ start: string; end: string }`}),` with inclusive dates`]}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`{ start: '2026-07-20', end: '2026-07-24' }`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Date-time`}),(0,c.jsx)(t.td,{children:`ISO 8601 with an explicit offset`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`'2026-07-20T14:30:00+01:00'`})})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Empty field`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`null`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`null`})})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Use these strings at the application boundary. Do not import or pass `,(0,c.jsx)(t.code,{children:`@internationalized/date`}),` objects or React Aria value types; those are internal.`]}),`
`,(0,c.jsx)(t.h2,{id:`time-zones`,children:`Time zones`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`timeZone`}),` is an IANA name such as `,(0,c.jsx)(t.code,{children:`Europe/London`}),` or `,(0,c.jsx)(t.code,{children:`America/New_York`}),`. It supplies shared display context, but a date-time value still carries an explicit offset so it is unambiguous. A plain date has no instant or time zone. A plain time has no date or zone. Choose the component that matches the meaning of the value rather than converting everything to a timestamp.`]}),`
`,(0,c.jsx)(t.h2,{id:`messages-and-product-copy`,children:`Messages and product copy`}),`
`,(0,c.jsxs)(t.p,{children:[`The provider's partial `,(0,c.jsx)(t.code,{children:`messages`}),` catalogue replaces Breeze-owned generic labels and announcements. Map the application's translation system into this object. Visible domain or product copy belongs in component children and props; Breeze does not translate it automatically.`]}),`
`,(0,c.jsx)(t.h2,{id:`direction`,children:`Direction`}),`
`,(0,c.jsxs)(t.p,{children:[`Breeze infers `,(0,c.jsx)(t.code,{children:`ltr`}),` or `,(0,c.jsx)(t.code,{children:`rtl`}),` from the locale and applies `,(0,c.jsx)(t.code,{children:`dir`}),` and `,(0,c.jsx)(t.code,{children:`lang`}),` to both the component root and portal root. Use the explicit `,(0,c.jsx)(t.code,{children:`direction`}),` prop only for a real override or focused testing.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`<BreezeProvider locale="en-GB" direction="rtl">
  <App />
</BreezeProvider>
`})}),`
`,(0,c.jsx)(t.p,{children:`Layout primitives and directional controls use logical direction. Do not reverse child arrays, hard-code left/right margins or replace locale-specific arrow-key behaviour in application code. Test translated copy at realistic lengths and verify both main content and portalled overlays.`}),`
`,(0,c.jsx)(t.h2,{id:`formatting-components`,children:`Formatting components`}),`
`,(0,c.jsxs)(t.p,{children:[`Use `,(0,c.jsx)(t.code,{children:`FormattedDateTime`}),`, `,(0,c.jsx)(t.code,{children:`FormattedNumber`}),`, `,(0,c.jsx)(t.code,{children:`FormattedList`}),` and `,(0,c.jsx)(t.code,{children:`RelativeTime`}),` for locale-sensitive display. Use date/time fields, pickers and calendars for interaction. Formatting components display values; they do not edit, parse business input or own persistence.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};