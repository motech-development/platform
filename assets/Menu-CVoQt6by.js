import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Controlled as c,Default as l,DestructiveAction as u,IconOnlyTrigger as d,Loading as f,NarrowWidth as p,Sections as m,n as h,t as g}from"./Menu.stories-GJYXdrm8.js";function _(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,ul:`ul`,...n(),...e.components};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(o,{of:g,summary:`A compact list of actions opened from a button.`}),`
`,(0,y.jsx)(t.h1,{id:`menu`,children:`Menu`}),`
`,(0,y.jsx)(t.p,{children:`A menu shows a list of actions when someone presses its button. Use it for
secondary actions, such as account settings, that should stay out of the way
until needed.`}),`
`,(0,y.jsx)(t.h2,{id:`basic-menu`,children:`Basic menu`}),`
`,(0,y.jsxs)(t.p,{children:[`Pass `,(0,y.jsx)(t.code,{children:`trigger`}),` as the button's visible label, your data as `,(0,y.jsx)(t.code,{children:`items`}),`, and a
`,(0,y.jsx)(t.code,{children:`getItem`}),` function that describes each item. `,(0,y.jsx)(t.code,{children:`onAction`}),` is called with the
selected item from `,(0,y.jsx)(t.code,{children:`items`}),`, as it is in `,(0,y.jsx)(t.code,{children:`Select`}),`, `,(0,y.jsx)(t.code,{children:`ComboBox`}),` and `,(0,y.jsx)(t.code,{children:`ToggleGroup`}),`.`]}),`
`,(0,y.jsx)(a,{of:l}),`
`,(0,y.jsxs)(t.p,{children:[`When several buttons on a page share the same visible label, set
`,(0,y.jsx)(t.code,{children:`triggerAriaLabel`}),` to give each one a distinct name for screen readers while
keeping the visible label short.`]}),`
`,(0,y.jsx)(t.h2,{id:`item-content`,children:`Item content`}),`
`,(0,y.jsxs)(t.p,{children:[(0,y.jsx)(t.code,{children:`getItem`}),` returns a `,(0,y.jsx)(t.code,{children:`MenuItemDescriptor`}),` for each item:`]}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`id`}),` and `,(0,y.jsx)(t.code,{children:`label`}),` are required. Each `,(0,y.jsx)(t.code,{children:`id`}),` must be unique within the menu.`]}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`description`}),`, `,(0,y.jsx)(t.code,{children:`icon`}),` or `,(0,y.jsx)(t.code,{children:`initials`}),`, `,(0,y.jsx)(t.code,{children:`badge`}),`, `,(0,y.jsx)(t.code,{children:`disabled`}),`, `,(0,y.jsx)(t.code,{children:`section`}),` and
`,(0,y.jsx)(t.code,{children:`tone`}),` are optional.`]}),`
`]}),`
`,(0,y.jsx)(t.p,{children:`Keep labels concise. Use a description for a short explanation, and icons when
they help people scan the choices.`}),`
`,(0,y.jsx)(t.p,{children:`When any item has an icon or initials, every label lines up: items without
either keep the space empty, and in a menu with initials, icons are centred in
the tile's width. In a menu with neither, labels start at the edge.`}),`
`,(0,y.jsx)(t.h2,{id:`icon-only-trigger`,children:`Icon-only trigger`}),`
`,(0,y.jsxs)(t.p,{children:[`For a compact button such as More actions, omit `,(0,y.jsx)(t.code,{children:`trigger`}),` and set `,(0,y.jsx)(t.code,{children:`triggerIcon`}),`
and `,(0,y.jsx)(t.code,{children:`triggerAriaLabel`}),`. `,(0,y.jsx)(t.code,{children:`triggerAriaLabel`}),` is required here, because it is the
button's only name.`]}),`
`,(0,y.jsx)(a,{of:d}),`
`,(0,y.jsx)(t.h2,{id:`sections`,children:`Sections`}),`
`,(0,y.jsxs)(t.p,{children:[`Give items a `,(0,y.jsx)(t.code,{children:`section`}),` to group them. Items that share a section `,(0,y.jsx)(t.code,{children:`id`}),` appear
together, where the first of them appears in `,(0,y.jsx)(t.code,{children:`items`}),`, with dividers between
sections. A section `,(0,y.jsx)(t.code,{children:`label`}),` is shown as a header and names the group for screen
readers. Without a label, the items are separated by dividers only.`]}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`initials`}),` instead of `,(0,y.jsx)(t.code,{children:`icon`}),` to show a short code, such as a company's
initials, in a tile before the label. The tile is decorative, so the label must
still identify the item.`]}),`
`,(0,y.jsx)(a,{of:m}),`
`,(0,y.jsx)(t.h2,{id:`destructive-actions`,children:`Destructive actions`}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`tone: 'danger'`}),` on an action that removes or discards something, such as
Remove, to show it in the danger colour. Place it last, in its own `,(0,y.jsx)(t.code,{children:`section`}),`,
so a divider separates it from the other actions.`]}),`
`,(0,y.jsx)(t.p,{children:`The action runs as soon as it is selected, like any other. If it needs
confirming, or its result needs showing, do that in the page or a dialog.`}),`
`,(0,y.jsx)(a,{of:u}),`
`,(0,y.jsx)(t.h2,{id:`width`,children:`Width`}),`
`,(0,y.jsxs)(t.p,{children:[`The open menu fits its items and is never narrower than its button. `,(0,y.jsx)(t.code,{children:`width`}),`
sets its minimum width:`]}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`md`}),` (default) is 256px and suits a list of names, such as a company switcher.`]}),`
`,(0,y.jsxs)(t.li,{children:[(0,y.jsx)(t.code,{children:`sm`}),` is 208px and suits a short list of actions, such as the file actions in
`,(0,y.jsx)(t.code,{children:`AttachmentRow`}),`.`]}),`
`]}),`
`,(0,y.jsx)(a,{of:p}),`
`,(0,y.jsx)(t.h2,{id:`placement`,children:`Placement`}),`
`,(0,y.jsxs)(t.p,{children:[`The menu opens below its button with their start edges aligned. Set
`,(0,y.jsx)(t.code,{children:`placement="bottom end"`}),` to align their end edges instead, for a button at the
end of a row. Start and end follow the provider's text direction, and the menu
moves if needed to fit on screen.`]}),`
`,(0,y.jsx)(t.h2,{id:`loading`,children:`Loading`}),`
`,(0,y.jsxs)(t.p,{children:[`Set `,(0,y.jsx)(t.code,{children:`loading`}),` while the menu is not ready to open. The button shows a loading
bar and keeps its size and accessible name; an icon-only button replaces its
icon with a placeholder, as `,(0,y.jsx)(t.code,{children:`IconButton`}),` does. Actions in a menu that is
already open remain available.`]}),`
`,(0,y.jsx)(a,{of:f}),`
`,(0,y.jsx)(t.h2,{id:`controlled-open-state`,children:`Controlled open state`}),`
`,(0,y.jsx)(t.p,{children:`The menu closes when an action is selected. Show the action's progress,
confirmation or errors in the page or dialog that follows.`}),`
`,(0,y.jsxs)(t.p,{children:[`By default, the menu manages whether it is open; set `,(0,y.jsx)(t.code,{children:`defaultOpen`}),` to start
open. To control it from your own state, pass both `,(0,y.jsx)(t.code,{children:`open`}),` and `,(0,y.jsx)(t.code,{children:`onOpenChange`}),`.`]}),`
`,(0,y.jsx)(a,{of:c}),`
`,(0,y.jsx)(t.h2,{id:`when-to-use-a-popover-instead`,children:`When to use a popover instead`}),`
`,(0,y.jsxs)(t.p,{children:[`A menu can contain only actions, optionally grouped into sections. Use a
`,(0,y.jsx)(t.code,{children:`Popover`}),` instead for a panel that also shows information, places controls
inside a row or header, or includes a toggle group. Screen readers present a
menu as its actions alone, so plain text is skipped, and the arrow keys cannot
reach a button placed inside an item or header.`]}),`
`,(0,y.jsxs)(t.p,{children:[`For example, an account panel that lists notifications with a Download action,
offers Mark all as read and an `,(0,y.jsx)(t.code,{children:`AppearanceControl`}),`, and links to settings
should be a `,(0,y.jsx)(t.code,{children:`Popover`}),`.`]}),`
`,(0,y.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,y.jsxs)(t.ul,{children:[`
`,(0,y.jsx)(t.li,{children:`Open the menu by pressing its button, or with Enter, Space or ArrowDown when
the button has focus.`}),`
`,(0,y.jsx)(t.li,{children:`Use the arrow keys to move between enabled actions, or type the start of a
label to jump to it.`}),`
`,(0,y.jsx)(t.li,{children:`Enter or Space selects the focused action.`}),`
`,(0,y.jsx)(t.li,{children:`Escape closes the menu and returns focus to its button.`}),`
`]}),`
`,(0,y.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,y.jsx)(i,{})]})}function v(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,y.jsx)(t,{...e,children:(0,y.jsx)(_,{...e})}):_(e)}var y;e((()=>{y=t(),s(),r(),h()}))();export{v as default};