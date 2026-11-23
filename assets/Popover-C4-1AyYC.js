import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CPvx_gCG.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{AccountPanel as c,Default as l,n as u,t as d}from"./Popover.stories-yZlRWfuF.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Opens contextual content beside its trigger.`}),`
`,(0,m.jsx)(t.h1,{id:`popover`,children:`Popover`}),`
`,(0,m.jsx)(t.p,{children:`A popover shows contextual content next to the button that opens it. It is not modal: the rest of the page stays usable, and the page is not dimmed behind it.`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`Popover`}),` rather than `,(0,m.jsx)(t.code,{children:`Menu`}),` when the content mixes information with controls, such as a list of notifications with their own actions beside an `,(0,m.jsx)(t.code,{children:`AppearanceControl`}),`. A `,(0,m.jsx)(t.code,{children:`Menu`}),` holds only a list of actions.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-popover`,children:`Basic popover`}),`
`,(0,m.jsxs)(t.p,{children:[`Pass `,(0,m.jsx)(t.code,{children:`trigger`}),` as the label of the button that opens the popover, `,(0,m.jsx)(t.code,{children:`title`}),` as its heading and `,(0,m.jsx)(t.code,{children:`children`}),` as its content. The popover includes a close button, labelled with the provider's messages.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Popover title="Delivery details" trigger="View delivery details">
  <Typography>Your delivery details appear here.</Typography>
</Popover>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`open-state`,children:`Open state`}),`
`,(0,m.jsxs)(t.p,{children:[`By default, the popover manages its own open state. Set `,(0,m.jsx)(t.code,{children:`defaultOpen`}),` to start open, and use `,(0,m.jsx)(t.code,{children:`onOpenChange`}),` to respond to changes.`]}),`
`,(0,m.jsxs)(t.p,{children:[`To control the popover from your own state, pass both `,(0,m.jsx)(t.code,{children:`open`}),` and `,(0,m.jsx)(t.code,{children:`onOpenChange`}),`. `,(0,m.jsx)(t.code,{children:`open`}),` and `,(0,m.jsx)(t.code,{children:`defaultOpen`}),` cannot be combined.`]}),`
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
`,(0,m.jsxs)(t.p,{children:[`By default, pressing Escape or clicking outside the popover closes it. Set `,(0,m.jsx)(t.code,{children:`dismissible={false}`}),` to keep it open in those cases; the close button still works. A popover with `,(0,m.jsx)(t.code,{children:`variant="panel"`}),` has no close button, so it is always dismissible.`]}),`
`,(0,m.jsx)(t.h2,{id:`placement`,children:`Placement`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`placement`}),` accepts `,(0,m.jsx)(t.code,{children:`top`}),`, `,(0,m.jsx)(t.code,{children:`bottom`}),` (default), `,(0,m.jsx)(t.code,{children:`start`}),`, `,(0,m.jsx)(t.code,{children:`end`}),` or `,(0,m.jsx)(t.code,{children:`bottom end`}),`. Use `,(0,m.jsx)(t.code,{children:`bottom end`}),` to open below the button with their end edges aligned, for a button at the end of a bar. Start and end follow the provider's text direction, and the popover moves if needed to fit on screen.`]}),`
`,(0,m.jsx)(t.h2,{id:`panels`,children:`Panels`}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`variant="panel"`}),` for content that makes its own purpose clear, such as an account panel of notifications and settings. A panel has no visible title or close button, but `,(0,m.jsx)(t.code,{children:`title`}),` still names it for screen readers.`]}),`
`,(0,m.jsx)(t.p,{children:`A panel's content runs edge to edge with no padding. The panel is at least 336px wide and grows to fit its content; on narrow screens it spans the viewport, less 12px on each side. It closes with Escape or a click outside it.`}),`
`,(0,m.jsx)(t.h3,{id:`initials-and-unread-indicator`,children:`Initials and unread indicator`}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`triggerInitials`}),` to open the popover from a circular button showing a person's initials. `,(0,m.jsx)(t.code,{children:`trigger`}),` then becomes the button's accessible name only, so describe what it opens.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`triggerIndicator`}),` to add a dot to the button, for example for unread notifications. Screen readers announce the provider's unread-items message rather than the dot itself. If you know the count, include it in `,(0,m.jsx)(t.code,{children:`trigger`}),`, for example "Account and notifications, 2 unread".`]}),`
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
`,(0,m.jsx)(t.h2,{id:`inside-a-drawer`,children:`Inside a drawer`}),`
`,(0,m.jsxs)(t.p,{children:[`A popover opened inside a `,(0,m.jsx)(t.code,{children:`Drawer`}),` appears above it, and the drawer stays interactive and keeps its dimmed backdrop. Escape closes the popover first and returns focus to its button; pressing Escape again closes the drawer. See the `,(0,m.jsx)(t.code,{children:`Foundations/Overlay stack`}),` stories for examples.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsx)(t.p,{children:`Opening the popover moves focus into it, and closing it returns focus to the button. Focus is not trapped, so people can Tab out of the popover to the rest of the page. The popover's DOM is rendered in a portal, but it stays in your React tree and keeps the provider's locale and text direction.`}),`
`,(0,m.jsx)(t.p,{children:`The open and close animations respect the user's reduced-motion setting. As soon as a popover starts to close, the content beneath it becomes interactive again, without waiting for the animation to finish.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};