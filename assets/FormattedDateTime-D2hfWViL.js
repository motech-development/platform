import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{DateAndTime as c,n as l,t as u}from"./FormattedDateTime.stories-D5iXykKf.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Semantic locale-aware date-time output for an ISO 8601 instant with an explicit offset, using BreezeProvider locale and optional display time zone while preserving the original machine-readable value.`}),`
`,(0,p.jsx)(t.h1,{id:`formatteddatetime`,children:`FormattedDateTime`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FormattedDateTime`}),` renders a locale-aware human-readable instant in a semantic HTML `,(0,p.jsx)(t.code,{children:`<time>`}),` element.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FormattedDateTime } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FormattedDateTime`}),` to display an instant consistently with `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` locale and time zone. Use `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` to edit an instant, `,(0,p.jsx)(t.code,{children:`DatePicker`}),` for a date without time, and `,(0,p.jsx)(t.code,{children:`RelativeTime`}),` for a deliberately relative phrase. Do not use it to parse user input or display a zone-free wall-clock value.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { FormattedDateTime } from '@motech-development/breeze-ui';

<FormattedDateTime
  value="2026-07-20T14:30:00+01:00"
  options={{ dateStyle: 'medium', timeStyle: 'short' }}
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`values-time-zones-and-behaviour`,children:`Values, time zones and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`value`}),` must be a valid ISO 8601 date-time with an explicit offset, such as `,(0,p.jsx)(t.code,{children:`'2026-07-20T14:30:00+01:00'`}),` or a `,(0,p.jsx)(t.code,{children:`Z`}),` suffix. The original string is preserved in the `,(0,p.jsx)(t.code,{children:`<time dateTime>`}),` attribute. Human-readable text is produced with `,(0,p.jsx)(t.code,{children:`Intl.DateTimeFormat`}),` and the provider’s BCP 47 locale.`]}),`
`,(0,p.jsxs)(t.p,{children:[`When `,(0,p.jsx)(t.code,{children:`BreezeProvider timeZone`}),` is set, that IANA zone is used for display and overrides `,(0,p.jsx)(t.code,{children:`options.timeZone`}),`. Without a provider zone, standard `,(0,p.jsx)(t.code,{children:`Intl.DateTimeFormatOptions`}),`, including `,(0,p.jsx)(t.code,{children:`timeZone`}),`, apply. The display zone never changes the underlying instant. Invalid or offset-free strings can produce incorrect or failing output; validate data before render.`]}),`
`,(0,p.jsx)(t.p,{children:`This is a stateless formatter: it has no controlled, loading, disabled, invalid, empty or callback behaviour. Choose an explicit application fallback rather than passing an empty string. It renders no interactive keyboard behaviour.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-internationalisation`,children:`Accessibility and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`The semantic `,(0,p.jsx)(t.code,{children:`<time>`}),` preserves a machine-readable value while assistive technology reads the visible localised text.`]}),`
`,(0,p.jsx)(t.li,{children:`Supply surrounding prose when the date’s meaning is not obvious. Do not rely on numeric order alone.`}),`
`,(0,p.jsx)(t.li,{children:`Locale controls ordering, names, punctuation and numbering. Provider direction is inherited from the surrounding document.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`options`}),` to make precision intentional; avoid showing seconds or zone names unless they help the task.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass a calendar-only date, offset-free local date-time, JavaScript `,(0,p.jsx)(t.code,{children:`Date`}),`, preformatted prose or children. Do not assume changing the display zone changes the instant. Use `,(0,p.jsx)(t.code,{children:`FormattedNumber`}),` for numbers, `,(0,p.jsx)(t.code,{children:`RelativeTime`}),` for application-calculated relative wording, and `,(0,p.jsx)(t.code,{children:`DateTimePicker`}),` for editing.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};