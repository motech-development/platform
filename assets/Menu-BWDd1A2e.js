import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-CDPbzUb0.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,DestructiveAction as u,IconOnlyTrigger as d,Loading as f,NarrowWidth as p,Sections as m,n as h,t as g}from"./Menu.stories-DRE0BYAu.js";function _(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(o,{of:g,summary:`A compact list of actions opened from a button.`}),`
`,(0,y.jsx)(t.h1,{id:`menu`,children:`Menu`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`Menu`}),` keeps related actions together under a labelled button. Use it for
secondary actions, such as account settings, that should stay out of the main
page until needed.`]}),`
`,(0,y.jsxs)(t.p,{children:[`When the visible trigger label is shared by several controls, set
`,(0,y.jsx)(t.code,{children:`triggerAriaLabel`}),` to give each button a distinct accessible name while keeping
the visible label concise.`]}),`
`,(0,y.jsx)(a,{of:l}),`
`,(0,y.jsx)(t.h2,{id:`icon-only-trigger`,children:`Icon-only trigger`}),`
`,(0,y.jsxs)(t.p,{children:[`Omit `,(0,y.jsx)(t.code,{children:`trigger`}),` and set `,(0,y.jsx)(t.code,{children:`triggerIcon`}),` and `,(0,y.jsx)(t.code,{children:`triggerAriaLabel`}),` together for a
compact icon-only trigger, such as a More actions button. `,(0,y.jsx)(t.code,{children:`triggerAriaLabel`}),`
is then required, because it is the trigger's only name.`]}),`
`,(0,y.jsx)(a,{of:d}),`
`,(0,y.jsx)(t.h2,{id:`loading-the-menu`,children:`Loading the menu`}),`
`,(0,y.jsxs)(t.p,{children:[`Use `,(0,y.jsx)(t.code,{children:`loading`}),` when the trigger should wait before opening. It shows a loading
bar while keeping its size and accessible label; an icon-only trigger replaces
its icon with a skeleton, as `,(0,y.jsx)(t.code,{children:`IconButton`}),` does. Actions in an already-open menu
remain available.`]}),`
`,(0,y.jsx)(a,{of:f}),`
`,(0,y.jsx)(t.h2,{id:`define-actions`,children:`Define actions`}),`
`,(0,y.jsxs)(t.p,{children:[`Pass your application values in `,(0,y.jsx)(t.code,{children:`items`}),`. Use `,(0,y.jsx)(t.code,{children:`getItem`}),` to provide each value's
`,(0,y.jsx)(t.code,{children:`MenuItemDescriptor`}),`: `,(0,y.jsx)(t.code,{children:`id`}),` and `,(0,y.jsx)(t.code,{children:`label`}),` are required, while `,(0,y.jsx)(t.code,{children:`description`}),`,
`,(0,y.jsx)(t.code,{children:`icon`}),` or `,(0,y.jsx)(t.code,{children:`initials`}),`, `,(0,y.jsx)(t.code,{children:`badge`}),`, `,(0,y.jsx)(t.code,{children:`disabled`}),`, `,(0,y.jsx)(t.code,{children:`section`}),` and `,(0,y.jsx)(t.code,{children:`tone`}),` are optional. Give each item a unique `,(0,y.jsx)(t.code,{children:`id`}),` within the
menu. Keep labels concise; use descriptions for a short explanation and icons
when they help people scan the choices. When any item has an icon or initials,
every label lines up: items without either keep that space, and in a menu with
initials, icons centre in the tile's width. A menu without either starts its
labels at the edge.`]}),`
`,(0,y.jsx)(t.h2,{id:`destructive-actions`,children:`Destructive actions`}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`tone: 'danger'`}),` on an action that removes or discards something, such as
Remove, to show it in the danger colour. Place it last, in its own `,(0,y.jsx)(t.code,{children:`section`}),`,
so a divider separates it from the other actions. The action runs when
selected; confirm its result in the page, as with any other action.`]}),`
`,(0,y.jsx)(a,{of:u}),`
`,(0,y.jsx)(t.h2,{id:`group-actions-into-sections`,children:`Group actions into sections`}),`
`,(0,y.jsxs)(t.p,{children:[`Give items a `,(0,y.jsx)(t.code,{children:`section`}),` to group them. Items sharing a section `,(0,y.jsx)(t.code,{children:`id`}),` are shown
together where the first of them appears, and dividers separate each section
from its neighbours. A section `,(0,y.jsx)(t.code,{children:`label`}),` shows as a header and names the group
for assistive technology; omit it to separate the items with dividers alone,
without a header or a group.`]}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`initials`}),` instead of `,(0,y.jsx)(t.code,{children:`icon`}),` to show a short code, such as a company's
initials, in a brand tile before the label. The tile is decorative, so the label
must still identify the item.`]}),`
`,(0,y.jsx)(a,{of:m}),`
`,(0,y.jsx)(t.h2,{id:`menu-width`,children:`Menu width`}),`
`,(0,y.jsxs)(t.p,{children:[`The open menu fits its items and is never narrower than its trigger. `,(0,y.jsx)(t.code,{children:`width`}),`
sets its minimum width: `,(0,y.jsx)(t.code,{children:`md`}),`, the default, is 256px and suits a list of names
such as a company switcher; `,(0,y.jsx)(t.code,{children:`sm`}),` is 208px and suits a short list of actions,
such as the file actions in `,(0,y.jsx)(t.code,{children:`AttachmentRow`}),`.`]}),`
`,(0,y.jsx)(a,{of:p}),`
`,(0,y.jsx)(t.h2,{id:`placement`,children:`Placement`}),`
`,(0,y.jsxs)(t.p,{children:[`The menu opens below its trigger with their start edges aligned. Set
`,(0,y.jsx)(t.code,{children:`placement`}),` to `,(0,y.jsx)(t.code,{children:`bottom end`}),` to align their end edges instead, for a trigger at
the end of a row. Start and end follow the provider's text direction, and the
menu can adjust its position to fit the available space.`]}),`
`,(0,y.jsx)(t.h2,{id:`panels-that-are-not-menus`,children:`Panels that are not menus`}),`
`,(0,y.jsxs)(t.p,{children:[`A menu contains only actions, optionally grouped into labelled sections. Do not
use `,(0,y.jsx)(t.code,{children:`Menu`}),` for a panel that also shows information people read but cannot act
on, places controls inside a row or header, or offers a toggle group. Assistive
technology presents a menu as its menu items alone, so plain-text rows are
skipped, and the menu's arrow keys cannot reach a button placed inside an item
or a section header.`]}),`
`,(0,y.jsxs)(t.p,{children:[`An account panel that lists notifications, gives one of them a Download action,
offers Mark all as read and an `,(0,y.jsx)(t.code,{children:`AppearanceControl`}),`, and then links to settings
is such a panel. Build it as a `,(0,y.jsx)(t.code,{children:`Popover`}),` with application content instead.`]}),`
`,(0,y.jsx)(t.h2,{id:`respond-to-a-selection`,children:`Respond to a selection`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`onAction`}),` receives the selected application item from `,(0,y.jsx)(t.code,{children:`items`}),`, as
`,(0,y.jsx)(t.code,{children:`Select`}),`, `,(0,y.jsx)(t.code,{children:`ComboBox`}),` and `,(0,y.jsx)(t.code,{children:`ToggleGroup`}),` do. The menu closes when an action is
selected. Show that action's progress, confirmation or errors in
the page or dialog that follows.`]}),`
`,(0,y.jsxs)(t.p,{children:[`Use `,(0,y.jsx)(t.code,{children:`defaultOpen`}),` when the menu manages its own visibility. To control
visibility, provide `,(0,y.jsx)(t.code,{children:`open`}),` and `,(0,y.jsx)(t.code,{children:`onOpenChange`}),` together.`]}),`
`,(0,y.jsx)(a,{of:c}),`
`,(0,y.jsx)(t.h2,{id:`keyboard-use`,children:`Keyboard use`}),`
`,(0,y.jsx)(t.p,{children:`Open the menu with the trigger button, Enter, Space or ArrowDown. Use the arrow
keys to move through enabled actions; type a label to jump to a matching action.
Enter or Space selects the focused action. Escape closes the menu and returns
focus to its trigger.`}),`
`,(0,y.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,y.jsx)(i,{})]})}function v(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,y.jsx)(t,{...e,children:(0,y.jsx)(_,{...e})}):_(e)}var y;e((()=>{y=t(),s(),r(),h()}))();export{v as default};