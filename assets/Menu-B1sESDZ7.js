import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{StaticNestedKeyboardAndTouch as c,n as l,t as u}from"./Menu.stories-BlP3OTwK.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A transient keyboard-navigable menu for keyed actions, optional selection, destinations, and nested submenus.`}),`
`,(0,p.jsx)(t.h1,{id:`menu`,children:`Menu`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Menu`}),` reveals a compact collection of actions or destinations from a trigger.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Menu } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsx)(t.p,{children:`Use it for secondary actions that need not remain visible.`}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Select`}),` for choosing a form value, `,(0,p.jsx)(t.code,{children:`NavigationList`}),` for persistent routes, `,(0,p.jsx)(t.code,{children:`Popover`}),` for interactive form content, and visible buttons when an action is primary or time-critical.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Menu } from '@motech-development/breeze-ui';

<Menu.Root>
  <Menu.Trigger>Actions</Menu.Trigger>
  <Menu.Popover>
    <Menu.List aria-label="Actions">
      <Menu.Item id="rename" textValue="Rename" onAction={rename}>
        Rename
      </Menu.Item>
      <Menu.Item id="archive" textValue="Archive" onAction={archive}>
        Archive
      </Menu.Item>
    </Menu.List>
  </Menu.Popover>
</Menu.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Menu.Root`})}),(0,p.jsx)(t.td,{children:`Coordinates open state, trigger focus, and dismissal.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Menu.Trigger`})}),(0,p.jsx)(t.td,{children:`Button that opens the root menu.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Menu.Popover`})}),(0,p.jsx)(t.td,{children:`Positions and portals a root or nested menu.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Menu.List`})}),(0,p.jsx)(t.td,{children:`Keyboard-navigable static or generic item collection.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Menu.Item`})}),(0,p.jsx)(t.td,{children:`One keyed action, selectable item, or destination.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Menu.Submenu`})}),(0,p.jsxs)(t.td,{children:[`Pairs a trigger `,(0,p.jsx)(t.code,{children:`Item`}),` with a nested `,(0,p.jsx)(t.code,{children:`Popover`}),`.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Submenu`}),` requires exactly two children in order: its trigger `,(0,p.jsx)(t.code,{children:`Menu.Item`}),`, then a `,(0,p.jsx)(t.code,{children:`Menu.Popover`}),` containing another labelled `,(0,p.jsx)(t.code,{children:`Menu.List`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`collections-selection-and-callbacks`,children:`Collections, selection, and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[`Author `,(0,p.jsx)(t.code,{children:`Item`}),` children directly or pass `,(0,p.jsx)(t.code,{children:`items`}),`, where every item has `,(0,p.jsx)(t.code,{children:`id: string | number`}),`, and render an item from the child function. `,(0,p.jsx)(t.code,{children:`textValue`}),` is required for typeahead and accessible representation.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Menu.List items={actions} aria-label="Actions">
  {(action) => (
    <Menu.Item id={action.id} textValue={action.label} onAction={action.run}>
      {action.label}
    </Menu.Item>
  )}
</Menu.List>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Selection is off unless `,(0,p.jsx)(t.code,{children:`selection`}),` or `,(0,p.jsx)(t.code,{children:`defaultSelection`}),` is supplied. Use `,(0,p.jsx)(t.code,{children:`defaultSelection`}),` for uncontrolled state, `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` for controlled state, or `,(0,p.jsx)(t.code,{children:`selection`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),` for immutable state. Values are `,(0,p.jsx)(t.code,{children:`(string | number)[] | 'all'`}),`; `,(0,p.jsx)(t.code,{children:`onSelectionChange`}),` receives the complete next value. Set `,(0,p.jsx)(t.code,{children:`multiple`}),` for multiple selection. `,(0,p.jsx)(t.code,{children:`onAction`}),` receives the activated item's id even when it is also selectable.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Root open state follows the same pattern with `,(0,p.jsx)(t.code,{children:`defaultOpen`}),`, or `,(0,p.jsx)(t.code,{children:`open`}),` plus `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`; `,(0,p.jsx)(t.code,{children:`open`}),` plus `,(0,p.jsx)(t.code,{children:`readOnly`}),` is immutable. `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` receives the complete next Boolean. `,(0,p.jsx)(t.code,{children:`disabledKeys`}),` disables matching ids and `,(0,p.jsx)(t.code,{children:`Item.disabled`}),` disables one item. Empty content defaults to `,(0,p.jsx)(t.code,{children:`No actions`}),`. Loading and load errors are application-owned and should be expressed as deliberate non-action content or adjacent feedback.`]}),`
`,(0,p.jsx)(t.h2,{id:`routing-and-presentation`,children:`Routing and presentation`}),`
`,(0,p.jsxs)(t.p,{children:[`An item without `,(0,p.jsx)(t.code,{children:`href`}),` is an action. A local `,(0,p.jsx)(t.code,{children:`/path`}),` item uses the provider router; other URLs keep native navigation. Do not combine a destination with an unrelated action. `,(0,p.jsx)(t.code,{children:`Popover.placement`}),` is `,(0,p.jsx)(t.code,{children:`'bottom start'`}),` by default and also accepts `,(0,p.jsx)(t.code,{children:`'bottom end'`}),`, `,(0,p.jsx)(t.code,{children:`'top start'`}),`, or `,(0,p.jsx)(t.code,{children:`'top end'`}),`; `,(0,p.jsx)(t.code,{children:`nonModal`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-styling`,children:`Native attributes and styling`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant button, menu, and item `,(0,p.jsx)(t.code,{children:`aria-*`}),` and `,(0,p.jsx)(t.code,{children:`data-*`}),` attributes are supported. Breeze intentionally owns click, selection, disabled, and inline style behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-internationalisation`,children:`Keyboard, accessibility, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[`Enter, Space, or Arrow Down opens the menu. Arrow Up and Arrow Down move focus; Home and End reach boundaries; character keys use `,(0,p.jsx)(t.code,{children:`textValue`}),`; Enter or Space activates; Escape closes and restores focus. Arrow Right enters a submenu and Arrow Left returns in left-to-right contexts; React Aria mirrors directional behaviour for RTL. Disabled items are skipped.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Label every `,(0,p.jsx)(t.code,{children:`List`}),`, including nested lists. Keep items concise and non-interactive inside; do not place controls in an item. Translate labels, `,(0,p.jsx)(t.code,{children:`textValue`}),`, and `,(0,p.jsx)(t.code,{children:`emptyContent`}),` together while keeping stable ids. Common mistakes are using Menu as a select field, omitting `,(0,p.jsx)(t.code,{children:`textValue`}),`, mixing controlled and uncontrolled props, and nesting a submenu without its own label.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Related components: `,(0,p.jsx)(t.code,{children:`Popover`}),`, `,(0,p.jsx)(t.code,{children:`Select`}),`, `,(0,p.jsx)(t.code,{children:`NavigationList`}),`, `,(0,p.jsx)(t.code,{children:`Toolbar`}),`, and `,(0,p.jsx)(t.code,{children:`UserMenu`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};