import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{AccountPanel as c,Default as l,n as u,t as d}from"./Popover.stories-DplpOr6A.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Opens contextual content beside its trigger.`}),`
`,(0,m.jsx)(t.h1,{id:`popover`,children:`Popover`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`Popover`}),` for non-modal contextual content anchored to a trigger. The surrounding surface remains interactive and available to assistive technology; the popover has no dimmed scrim. Render it inside `,(0,m.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Choose `,(0,m.jsx)(t.code,{children:`Popover`}),` rather than `,(0,m.jsx)(t.code,{children:`Menu`}),` when the content mixes information with controls, such as a list of notifications with their own actions beside an `,(0,m.jsx)(t.code,{children:`AppearanceControl`}),`. A `,(0,m.jsx)(t.code,{children:`Menu`}),` holds only a list of actions.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`trigger`}),` supplies the label for the button Breeze renders. `,(0,m.jsx)(t.code,{children:`title`}),` supplies the surface's visible heading and accessible name; `,(0,m.jsx)(t.code,{children:`children`}),` supplies its content. Breeze also renders a close button with a label from the provider's messages.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Popover title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Popover>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`open-state`,children:`Open state`}),`
`,(0,m.jsxs)(t.p,{children:[`By default, the component manages its own open state. Set `,(0,m.jsx)(t.code,{children:`defaultOpen`}),` to start open, and optionally use `,(0,m.jsx)(t.code,{children:`onOpenChange`}),` to observe changes.`]}),`
`,(0,m.jsxs)(t.p,{children:[`To control the surface from application state, supply both `,(0,m.jsx)(t.code,{children:`open`}),` and `,(0,m.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,m.jsx)(t.code,{children:`open`}),` and `,(0,m.jsx)(t.code,{children:`defaultOpen`}),` are mutually exclusive.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Popover
  onOpenChange={setOpen}
  open={open}
  title="Delivery details"
  trigger="View delivery details"
>
  <Typography>Your delivery details appear here.</Typography>
</Popover>
`})}),`
`,(0,m.jsx)(t.h2,{id:`dismissal`,children:`Dismissal`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`dismissible`}),` defaults to `,(0,m.jsx)(t.code,{children:`true`}),`, allowing Escape and interaction outside the surface to dismiss it. Set it to `,(0,m.jsx)(t.code,{children:`false`}),` when those interactions should leave the surface open. The close button remains available, so a `,(0,m.jsx)(t.code,{children:`panel`}),` cannot set it to `,(0,m.jsx)(t.code,{children:`false`}),`.`]}),`
`,(0,m.jsx)(t.h2,{id:`placement`,children:`Placement`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`placement`}),` accepts `,(0,m.jsx)(t.code,{children:`top`}),`, `,(0,m.jsx)(t.code,{children:`bottom`}),` (default), `,(0,m.jsx)(t.code,{children:`start`}),`, `,(0,m.jsx)(t.code,{children:`end`}),` or `,(0,m.jsx)(t.code,{children:`bottom end`}),`. `,(0,m.jsx)(t.code,{children:`bottom end`}),` opens below the trigger with their end edges aligned, for a trigger at the end of a bar. Start and end follow the provider's text direction. The surface can adjust its position to fit the available space.`]}),`
`,(0,m.jsx)(t.h2,{id:`panels`,children:`Panels`}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`variant`}),` to `,(0,m.jsx)(t.code,{children:`panel`}),` for content that names its own purpose, such as an account panel of notifications and settings. A panel shows no title or close button; `,(0,m.jsx)(t.code,{children:`title`}),` still names it for assistive technology. Its content runs edge to edge with no padding, and it fits that content from a minimum of 336px, or spans the viewport less 12px on each side on narrow screens. A panel closes with Escape or a press outside it, so it cannot set `,(0,m.jsx)(t.code,{children:`dismissible`}),` to `,(0,m.jsx)(t.code,{children:`false`}),`.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`triggerInitials`}),` to open the popover from a circular button showing a person's initials. `,(0,m.jsx)(t.code,{children:`trigger`}),` then supplies only the button's accessible name, so describe what it opens. Set `,(0,m.jsx)(t.code,{children:`triggerIndicator`}),` to add an attention dot, such as for unread notifications. Breeze describes the dot to assistive technology with the provider's unread-items message; the dot itself is decorative. Applications that know the count can include it in `,(0,m.jsx)(t.code,{children:`trigger`}),`, for example "Account and notifications, 2 unread".`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Popover
  placement="bottom end"
  title="Account and notifications"
  trigger="Account and notifications, 2 unread"
  triggerIndicator
  triggerInitials="MG"
  variant="panel"
>
  {/* Notifications, AppearanceControl and account links */}
</Popover>
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-and-motion`,children:`Accessibility and motion`}),`
`,(0,m.jsx)(t.p,{children:`Breeze manages focus on opening and restores it on closing without trapping focus inside the popover. The provider's portal host keeps the surface's locale, direction and scoped styles intact.`}),`
`,(0,m.jsxs)(t.p,{children:[`Inside a drawer, a popover appears above the sheet while its content remains interactive and accessible. The sheet keeps its scrim. Escape closes the popover first and restores focus to its trigger; a subsequent Escape closes the sheet. The `,(0,m.jsx)(t.code,{children:`Foundations/Overlay stack`}),` stories exercise this composition.`]}),`
`,(0,m.jsx)(t.p,{children:`Enter and exit motion respects reduced-motion preferences. A closing surface immediately leaves the active stack while its exit animation completes.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};