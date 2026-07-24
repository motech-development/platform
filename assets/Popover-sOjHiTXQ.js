import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{NonmodalOutsideDismissal as c,n as l,t as u}from"./Popover.stories-6xYj74sy.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A trigger-anchored contextual dialog with required title and description, modal or nonmodal interaction, collision-aware placement, and controlled or uncontrolled open state.`}),`
`,(0,p.jsx)(t.h1,{id:`popover`,children:`Popover`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Popover`}),` places lightweight interactive content next to the control that requested it.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Popover } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for contextual filters, settings, or explanations containing interactive controls. Use `,(0,p.jsx)(t.code,{children:`Tooltip`}),` for concise non-interactive help, `,(0,p.jsx)(t.code,{children:`Menu`}),` for a list of actions, `,(0,p.jsx)(t.code,{children:`Dialog`}),` for a focused modal task, and inline content when it should remain continuously visible.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Popover } from '@motech-development/breeze-ui';

<Popover.Root>
  <Popover.Trigger>Show details</Popover.Trigger>
  <Popover.Content>
    <Popover.Title>Details</Popover.Title>
    <Popover.Description>
      Supporting information about this item.
    </Popover.Description>
    <Popover.Close>Done</Popover.Close>
  </Popover.Content>
</Popover.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-interaction-modes`,children:`Anatomy and interaction modes`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Part`}),(0,p.jsx)(t.th,{children:`Purpose`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Popover.Root`})}),(0,p.jsx)(t.td,{children:`Coordinates open state and trigger focus.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Popover.Trigger`})}),(0,p.jsx)(t.td,{children:`Opens the popover from a semantic button.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Popover.Content`})}),(0,p.jsx)(t.td,{children:`Positioned dialog surface and dismissal boundary.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Popover.Title`})}),(0,p.jsx)(t.td,{children:`Required accessible name.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Popover.Description`})}),(0,p.jsx)(t.td,{children:`Required accessible description.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`Popover.Close`})}),(0,p.jsx)(t.td,{children:`Explicit close action that restores trigger focus.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Content is nonmodal by default, so users may interact outside and outside activation dismisses it. Set `,(0,p.jsx)(t.code,{children:`modal`}),` when interaction must remain inside. `,(0,p.jsx)(t.code,{children:`dismissible`}),` defaults to `,(0,p.jsx)(t.code,{children:`true`}),`; `,(0,p.jsx)(t.code,{children:`keyboardDismissDisabled`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),`. Always retain a clear close path if either dismissal route is removed.`]}),`
`,(0,p.jsx)(t.h2,{id:`state-and-placement`,children:`State and placement`}),`
`,(0,p.jsxs)(t.p,{children:[`Use uncontrolled `,(0,p.jsx)(t.code,{children:`defaultOpen`}),`, controlled `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`onOpenChange`}),`, or immutable `,(0,p.jsx)(t.code,{children:`open`}),` with `,(0,p.jsx)(t.code,{children:`readOnly`}),`. `,(0,p.jsx)(t.code,{children:`onOpenChange`}),` receives the complete next Boolean.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Placement defaults to `,(0,p.jsx)(t.code,{children:`'bottom start'`}),` and supports `,(0,p.jsx)(t.code,{children:`top`}),`, `,(0,p.jsx)(t.code,{children:`bottom`}),`, `,(0,p.jsx)(t.code,{children:`left`}),`, `,(0,p.jsx)(t.code,{children:`right`}),`, and top/bottom start/end combinations. React Aria flips or shifts the surface when space is constrained. `,(0,p.jsx)(t.code,{children:`offset`}),` is the trigger gap in pixels and defaults to `,(0,p.jsx)(t.code,{children:`8`}),`. Start/end and collision behaviour follow provider direction.`]}),`
`,(0,p.jsx)(t.p,{children:`Loading, disabled, invalid, empty, and error states belong to controls or feedback within Content. A disabled Trigger cannot open the popover. Do not show an empty surface.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`native-attributes-and-callback-semantics`,children:`Native attributes and callback semantics`}),`
`,(0,p.jsxs)(t.p,{children:[`Content accepts relevant dialog HTML and ARIA attributes. Use `,(0,p.jsx)(t.code,{children:`onAction`}),` on Trigger and Close rather than native click handlers. Breeze owns portal, positioning, role, and inline style behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-accessibility-and-mistakes`,children:`Keyboard, accessibility, and mistakes`}),`
`,(0,p.jsx)(t.p,{children:`Trigger activation opens Content and moves focus appropriately. Tab follows modal or nonmodal focus rules, Escape closes unless disabled, and Close restores focus. Title and Description are required even when the trigger appears descriptive. Ensure the surface remains understandable when translated text wraps and test preferred placement in RTL.`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use a Popover as a tooltip, omit its accessible anatomy, place a long workflow inside it, or assume preferred placement is guaranteed. Related components: `,(0,p.jsx)(t.code,{children:`Tooltip`}),`, `,(0,p.jsx)(t.code,{children:`Menu`}),`, `,(0,p.jsx)(t.code,{children:`Dialog`}),`, `,(0,p.jsx)(t.code,{children:`Select`}),`, and `,(0,p.jsx)(t.code,{children:`ComboBox`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};