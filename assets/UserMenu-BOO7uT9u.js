import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{NotificationsAndActions as c,n as l,t as u}from"./UserMenu.stories-BKCt0dfH.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Application-shell account menu combining represented-user identity, optional notifications, and keyed actions or destinations.`}),`
`,(0,p.jsx)(t.h1,{id:`usermenu`,children:`UserMenu`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`UserMenu`}),` presents the represented user and a concise set of account actions in a keyboard-complete menu.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { UserMenu } from '@motech-development/breeze-ui';
import { SignOutIcon } from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it in `,(0,p.jsx)(t.code,{children:`ApplicationShell`}),` for identity, a short notification summary, account destinations, and actions such as signing out.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The application owns authentication, notification fetching and read state, confirmation, errors, analytics, and navigation. `,(0,p.jsx)(t.code,{children:`UserMenu`}),` only composes presentation and menu behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use it as a general command menu, primary navigation, or a substantial notification centre. Prefer `,(0,p.jsx)(t.code,{children:`Menu`}),` for unrelated commands, `,(0,p.jsx)(t.code,{children:`NavigationList`}),` for persistent destinations, and a dedicated page for a complete notification history.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { UserMenu } from '@motech-development/breeze-ui';
import { SignOutIcon } from '@motech-development/breeze-ui/icons';

<UserMenu
  aria-label="User menu"
  actions={[
    { href: '/profile', id: 'profile', label: 'Profile' },
    {
      icon: <SignOutIcon />,
      id: 'sign-out',
      label: 'Sign out',
      onAction: () => signOut(),
      variant: 'danger',
    },
  ]}
  hasUnread
  notificationHeading="Notifications"
  notificationState="1 new"
  notifications="Your export is ready."
  userName="Taylor Reed"
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`actions-routing-and-state`,children:`Actions, routing, and state`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`actions`}),` is an ordered collection. Every action requires a stable string `,(0,p.jsx)(t.code,{children:`id`}),` and plain-string `,(0,p.jsx)(t.code,{children:`label`}),`; `,(0,p.jsx)(t.code,{children:`label`}),` is visible and drives typeahead. `,(0,p.jsx)(t.code,{children:`onAction(id)`}),` receives that action's id after semantic activation, not a DOM event. `,(0,p.jsx)(t.code,{children:`href`}),` makes an item a destination: local `,(0,p.jsx)(t.code,{children:`/path`}),` values use the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` router adapter when available, while external URLs and native link behaviour remain native. An item may have an action, a destination, or both when activation intentionally performs both responsibilities.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents an action from receiving focus or activation. `,(0,p.jsx)(t.code,{children:`variant="danger"`}),` provides danger emphasis; `,(0,p.jsx)(t.code,{children:`default`}),` is the default. Use danger only for genuinely destructive or terminating actions and provide confirmation separately when needed.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`hasUnread`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`. When true, the trigger gets a visible decorative dot and its accessible name appends the provider's `,(0,p.jsx)(t.code,{children:`unreadNotifications`}),` message. The pattern does not mark notifications read. Notification content is rendered only when `,(0,p.jsx)(t.code,{children:`notifications`}),` is supplied; the heading and state are optional supporting content.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-internationalisation`,children:`Accessibility, keyboard, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`aria-label`}),` must identify the trigger without relying on the visible user name. `,(0,p.jsx)(t.code,{children:`userName`}),` names the avatar and is also visible in the full shell presentation. Provide a meaningful image in `,(0,p.jsx)(t.code,{children:`src`}),` or allow `,(0,p.jsx)(t.code,{children:`Avatar`}),` to derive a fallback. Action icons are decorative because their labels carry meaning.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The trigger opens with pointer activation, `,(0,p.jsx)(t.code,{children:`Enter`}),`, `,(0,p.jsx)(t.code,{children:`Space`}),`, or the platform menu shortcut. Arrow keys move between enabled actions, typing searches labels, `,(0,p.jsx)(t.code,{children:`Enter`}),` or `,(0,p.jsx)(t.code,{children:`Space`}),` activates, `,(0,p.jsx)(t.code,{children:`Home`}),` and `,(0,p.jsx)(t.code,{children:`End`}),` move to boundaries, and `,(0,p.jsx)(t.code,{children:`Escape`}),` closes and restores focus. Logical alignment and `,(0,p.jsx)(t.code,{children:`top start`}),` placement follow provider direction.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Translate the accessible label, notification copy, user-facing state, and action labels. `,(0,p.jsx)(t.code,{children:`Unread notifications`}),` comes from `,(0,p.jsx)(t.code,{children:`BreezeProvider.messages.unreadNotifications`}),`. Keep labels concise enough for narrow shell presentation.`]}),`
`,(0,p.jsx)(t.p,{children:`There is no root loading, invalid, empty, disabled, controlled-open, or error state. Avoid opening an empty menu; render account-loading feedback outside it, disable individual actions during in-flight work, and show any failure in an application-owned alert or page region.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass domain objects as ids, use a danger style for ordinary navigation, treat `,(0,p.jsx)(t.code,{children:`hasUnread`}),` as application state storage, or place a long notification feed in the popover. Related components: `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-application-shell-applicationshell--docs`,children:`ApplicationShell`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/foundation-avatar--docs`,children:`Avatar`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/navigation-menu--docs`,children:`Menu`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-actions-confirmationdialog--docs`,children:`ConfirmationDialog`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};