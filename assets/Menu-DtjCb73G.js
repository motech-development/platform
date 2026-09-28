import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-P5tLIujU.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{a as c,i as l,n as u,r as d,t as f}from"./Menu.stories-DSlc4ziz.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:l,summary:`A compact list of actions opened from a button.`}),`
`,(0,h.jsx)(t.h1,{id:`menu`,children:`Menu`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Menu`}),` keeps related actions together under a labelled button. Use it for
secondary actions, such as account settings, that should stay out of the main
page until needed.`]}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`loading-the-menu`,children:`Loading the menu`}),`
`,(0,h.jsxs)(t.p,{children:[`Use `,(0,h.jsx)(t.code,{children:`loading`}),` when the trigger should wait before opening. It shows a loading
bar while keeping its size and accessible label. Actions in an already-open
menu remain available.`]}),`
`,(0,h.jsx)(a,{of:d}),`
`,(0,h.jsx)(t.h2,{id:`define-actions`,children:`Define actions`}),`
`,(0,h.jsxs)(t.p,{children:[`Pass your application values in `,(0,h.jsx)(t.code,{children:`items`}),`. Use `,(0,h.jsx)(t.code,{children:`getItem`}),` to provide each value's
`,(0,h.jsx)(t.code,{children:`ItemDescriptor`}),`: `,(0,h.jsx)(t.code,{children:`id`}),` and `,(0,h.jsx)(t.code,{children:`label`}),` are required, while `,(0,h.jsx)(t.code,{children:`description`}),`, `,(0,h.jsx)(t.code,{children:`icon`}),`,
`,(0,h.jsx)(t.code,{children:`badge`}),` and `,(0,h.jsx)(t.code,{children:`disabled`}),` are optional. Give each item a unique `,(0,h.jsx)(t.code,{children:`id`}),` within the
menu. Keep labels concise; use descriptions for a short explanation and icons
when they help people scan the choices.`]}),`
`,(0,h.jsx)(t.h2,{id:`respond-to-a-selection`,children:`Respond to a selection`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`onAction`}),` receives the selected item's `,(0,h.jsx)(t.code,{children:`ItemDescriptor`}),`. The menu closes when
an action is selected. Show that action's progress, confirmation or errors in
the page or dialog that follows.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Use `,(0,h.jsx)(t.code,{children:`defaultOpen`}),` when the menu manages its own visibility. To control
visibility, provide `,(0,h.jsx)(t.code,{children:`open`}),` and `,(0,h.jsx)(t.code,{children:`onOpenChange`}),` together.`]}),`
`,(0,h.jsx)(a,{of:f}),`
`,(0,h.jsx)(t.h2,{id:`keyboard-use`,children:`Keyboard use`}),`
`,(0,h.jsx)(t.p,{children:`Open the menu with the trigger button, Enter, Space or ArrowDown. Use the arrow
keys to move through enabled actions; type a label to jump to a matching action.
Enter or Space selects the focused action. Escape closes the menu and returns
focus to its trigger.`}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),c()}))();export{m as default};