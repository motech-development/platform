import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{LeftToRight as c,n as l,t as u}from"./BreezeProvider.stories-4J7eaqSV.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Required environment boundary for Breeze locale, direction, messages, routing, portals, and notifications.`}),`
`,(0,p.jsx)(t.h1,{id:`breezeprovider`,children:`BreezeProvider`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`BreezeProvider`}),` is the required environment boundary for every Breeze component. It establishes locale, reading direction, translated library messages, routing, portal placement, time-zone preferences, and the provider-scoped toast queue.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  BreezeProvider,
  type BreezeMessageOverrides,
  type BreezeRouterAdapter,
} from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.p,{children:`Import the compiled component styles once at the application entry point. A greenfield application may opt into the reset before the component styles.`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import '@motech-development/breeze-ui/reset.css';
import '@motech-development/breeze-ui/styles.css';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Wrap each independently rendered Breeze application root once.`}),`
`,(0,p.jsx)(t.li,{children:`Supply the user's BCP 47 locale and, where temporal values require it, their IANA time-zone name.`}),`
`,(0,p.jsx)(t.li,{children:`Add a router adapter when local Breeze links should use client-side navigation.`}),`
`,(0,p.jsxs)(t.li,{children:[`Override `,(0,p.jsx)(t.code,{children:`messages`}),` when an application localises Breeze-owned generic text and announcements.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not nest providers merely to style a subsection; Breeze has one canonical theme and typed component variants.`}),`
`,(0,p.jsx)(t.li,{children:`Do not use it as application state, authentication, data-fetching, or form context. Keep those concerns in application-owned providers.`}),`
`,(0,p.jsx)(t.li,{children:`Do not mount a separate provider around each overlay or toast. The nearest application provider already owns their shared environment.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { BreezeProvider, Typography } from '@motech-development/breeze-ui';
import '@motech-development/breeze-ui/styles.css';

export function Application() {
  return (
    <BreezeProvider locale="en-GB" timeZone="Europe/London">
      <Typography as="h1">Account settings</Typography>
    </BreezeProvider>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`environment-and-behaviour`,children:`Environment and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`The provider renders a `,(0,p.jsx)(t.code,{children:`data-breeze-root`}),` element with `,(0,p.jsx)(t.code,{children:`lang`}),` and `,(0,p.jsx)(t.code,{children:`dir`}),`. When `,(0,p.jsx)(t.code,{children:`direction`}),` is omitted, Breeze infers `,(0,p.jsx)(t.code,{children:`ltr`}),` or `,(0,p.jsx)(t.code,{children:`rtl`}),` from `,(0,p.jsx)(t.code,{children:`locale`}),`; an explicit direction always wins. Use a BCP 47 locale such as `,(0,p.jsx)(t.code,{children:`en-GB`}),`, `,(0,p.jsx)(t.code,{children:`fr-FR`}),`, or `,(0,p.jsx)(t.code,{children:`ar-SA`}),`, not an application-specific language key.`]}),`
`,(0,p.jsxs)(t.p,{children:[`When `,(0,p.jsx)(t.code,{children:`portalContainer`}),` is omitted, Breeze creates a provider-owned portal host in `,(0,p.jsx)(t.code,{children:`document.body`}),` and applies the same locale and direction to it. Pass a stable `,(0,p.jsx)(t.code,{children:`HTMLElement`}),` only when overlays must live in an application-owned host. Portal creation is guarded for server rendering.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The provider also owns the toast region. At most `,(0,p.jsx)(t.code,{children:`toastLimit`}),` toasts are visible; additional toasts queue. `,(0,p.jsx)(t.code,{children:`toastLimit`}),` must be a positive integer and throws a `,(0,p.jsx)(t.code,{children:`RangeError`}),` otherwise.`]}),`
`,(0,p.jsx)(t.h2,{id:`routing`,children:`Routing`}),`
`,(0,p.jsx)(t.p,{children:`The adapter is deliberately small:`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  BreezeProvider,
  Link,
  type BreezeRouterAdapter,
} from '@motech-development/breeze-ui';

const router: BreezeRouterAdapter = {
  navigate(href) {
    window.history.pushState(null, '', href);
  },
};

export function RoutedApplication() {
  return (
    <BreezeProvider locale="en-GB" router={router}>
      <Link href="/preferences">Preferences</Link>
    </BreezeProvider>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Link-capable components use `,(0,p.jsx)(t.code,{children:`router.navigate(href)`}),` for an unmodified primary activation of a local `,(0,p.jsx)(t.code,{children:`/path`}),`. External URLs, downloads, alternate targets, and modified clicks retain native browser behaviour. The application remains responsible for updating its rendered route after navigation.`]}),`
`,(0,p.jsx)(t.h2,{id:`messages`,children:`Messages`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`messages`}),` is a partial override. Unspecified entries retain the built-in domain-neutral `,(0,p.jsx)(t.code,{children:`en-GB`}),` text.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import type { ReactNode } from 'react';
import {
  BreezeProvider,
  type BreezeMessageOverrides,
} from '@motech-development/breeze-ui';

const messages: BreezeMessageOverrides = {
  clear: 'Effacer',
  close: 'Fermer',
  loading: 'Chargement',
  noResults: 'Aucun résultat',
  notifications: 'Notifications',
};

export function LocalisedApplication({ children }: { children: ReactNode }) {
  return (
    <BreezeProvider locale="fr-FR" messages={messages}>
      {children}
    </BreezeProvider>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[`The complete catalogue is `,(0,p.jsx)(t.code,{children:`clear`}),`, `,(0,p.jsx)(t.code,{children:`close`}),`, `,(0,p.jsx)(t.code,{children:`fileCountRejection`}),`, `,(0,p.jsx)(t.code,{children:`fileSizeRejection`}),`, `,(0,p.jsx)(t.code,{children:`fileTypeRejection`}),`, `,(0,p.jsx)(t.code,{children:`hidePassword`}),`, `,(0,p.jsx)(t.code,{children:`loading`}),`, `,(0,p.jsx)(t.code,{children:`nextPage`}),`, `,(0,p.jsx)(t.code,{children:`noResults`}),`, `,(0,p.jsx)(t.code,{children:`notifications`}),`, `,(0,p.jsx)(t.code,{children:`page`}),`, `,(0,p.jsx)(t.code,{children:`previousPage`}),`, `,(0,p.jsx)(t.code,{children:`selectDate`}),`, `,(0,p.jsx)(t.code,{children:`selectDateTime`}),`, `,(0,p.jsx)(t.code,{children:`selectFiles`}),`, `,(0,p.jsx)(t.code,{children:`selectTime`}),`, `,(0,p.jsx)(t.code,{children:`showPassword`}),`, and `,(0,p.jsx)(t.code,{children:`unreadNotifications`}),`. Translate meaning rather than control-specific wording, and keep accessible labels concise.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-keyboard-interaction`,children:`Accessibility and keyboard interaction`}),`
`,(0,p.jsx)(t.p,{children:`The provider itself adds no keyboard commands. Its locale and direction feed the keyboard, focus, and announcement behaviour of descendant controls. Keep one consistent locale and direction for a coherent subtree, translate the message catalogue, and do not remove the provider-owned portal root from the document while an overlay is open.`}),`
`,(0,p.jsxs)(t.p,{children:[`Setting `,(0,p.jsx)(t.code,{children:`direction="rtl"`}),` affects logical layout and interaction direction without changing the language. Use an explicit override for testing or exceptional mixed-language surfaces; otherwise prefer locale inference.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Rendering any Breeze component outside `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` throws an error.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`locale`}),` is required even when the application only uses visual primitives.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`timeZone`}),` must be an IANA name such as `,(0,p.jsx)(t.code,{children:`Europe/London`}),`, not an offset such as `,(0,p.jsx)(t.code,{children:`+01:00`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not recreate built-in toast or portal infrastructure in each feature.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not pass an element that is replaced on every render as `,(0,p.jsx)(t.code,{children:`portalContainer`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Message overrides localise Breeze-owned generic UI only; application copy remains application-owned.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Link`}),` and `,(0,p.jsx)(t.code,{children:`LinkButton`}),` with `,(0,p.jsx)(t.code,{children:`router`}),` for router-neutral navigation.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`FormattedDateTime`}),`, `,(0,p.jsx)(t.code,{children:`FormattedNumber`}),`, `,(0,p.jsx)(t.code,{children:`FormattedList`}),`, and `,(0,p.jsx)(t.code,{children:`RelativeTime`}),` for provider-locale display formatting.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Toast`}),` and `,(0,p.jsx)(t.code,{children:`ToastRegion`}),` for notifications owned by this provider boundary.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};