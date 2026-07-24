import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{KeyboardHoverAndTouch as c,SemanticIconTrigger as l,n as u,t as d}from"./Tooltip.stories-DKJ55Yy_.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Concise non-interactive descriptive help revealed from a button or named focusable icon by hover, focus, or touch.`}),`
`,(0,m.jsx)(t.h1,{id:`tooltip`,children:`Tooltip`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Tooltip`}),` gives an existing trigger concise, non-essential descriptive help without adding an action surface.`]}),`
`,(0,m.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Tooltip } from '@motech-development/breeze-ui';
import { WarningIcon } from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use it to clarify a control whose visible label cannot carry a short secondary explanation. Use persistent text for essential instructions, `,(0,m.jsx)(t.code,{children:`Popover`}),` for interactive content, and `,(0,m.jsx)(t.code,{children:`VisuallyHidden`}),` to supply an accessible label that does not need a visual popup. Tooltips never replace a control's accessible name.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Tooltip } from '@motech-development/breeze-ui';

<Tooltip.Root>
  <Tooltip.Trigger appearance="outline">Export</Tooltip.Trigger>
  <Tooltip.Content>Download the current results</Tooltip.Content>
</Tooltip.Root>;
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,m.jsxs)(t.table,{children:[(0,m.jsx)(t.thead,{children:(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.th,{children:`Part`}),(0,m.jsx)(t.th,{children:`Purpose`})]})}),(0,m.jsxs)(t.tbody,{children:[(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.td,{children:(0,m.jsx)(t.code,{children:`Tooltip.Root`})}),(0,m.jsx)(t.td,{children:`Coordinates delayed hover, focus, touch, and controlled open state.`})]}),(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.td,{children:(0,m.jsx)(t.code,{children:`Tooltip.Trigger`})}),(0,m.jsxs)(t.td,{children:[`Full public `,(0,m.jsx)(t.code,{children:`Button`}),` used as an action described by the tooltip.`]})]}),(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.td,{children:(0,m.jsx)(t.code,{children:`Tooltip.IconTrigger`})}),(0,m.jsx)(t.td,{children:`Compact focusable informational icon with a required accessible name.`})]}),(0,m.jsxs)(t.tr,{children:[(0,m.jsx)(t.td,{children:(0,m.jsx)(t.code,{children:`Tooltip.Content`})}),(0,m.jsx)(t.td,{children:`Concise, non-interactive descriptive popup.`})]})]})]}),`
`,(0,m.jsxs)(t.p,{children:[`Use exactly one trigger part. `,(0,m.jsx)(t.code,{children:`IconTrigger.children`}),` should be a decorative icon and `,(0,m.jsx)(t.code,{children:`aria-label`}),` names the icon itself. The tooltip adds description; it does not supply that name.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<Tooltip.Root>
  <Tooltip.IconTrigger aria-label="Warning information" variant="danger">
    <WarningIcon aria-hidden="true" />
  </Tooltip.IconTrigger>
  <Tooltip.Content variant="danger">
    This item requires attention
  </Tooltip.Content>
</Tooltip.Root>
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`state-timing-and-presentation`,children:`State, timing, and presentation`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`defaultOpen`}),` for uncontrolled state, `,(0,m.jsx)(t.code,{children:`open`}),` with `,(0,m.jsx)(t.code,{children:`onOpenChange`}),` for controlled state, or `,(0,m.jsx)(t.code,{children:`open`}),` with `,(0,m.jsx)(t.code,{children:`readOnly`}),` for immutable state. `,(0,m.jsx)(t.code,{children:`onOpenChange`}),` receives the complete next Boolean. Opening delay defaults to `,(0,m.jsx)(t.code,{children:`700`}),`ms and closing delay to `,(0,m.jsx)(t.code,{children:`0`}),`ms; use shorter delays only where repeated inspection warrants it.`]}),`
`,(0,m.jsxs)(t.p,{children:[`Content placement defaults to `,(0,m.jsx)(t.code,{children:`top`}),`; supported values are `,(0,m.jsx)(t.code,{children:`top`}),`, `,(0,m.jsx)(t.code,{children:`bottom`}),`, `,(0,m.jsx)(t.code,{children:`left`}),`, `,(0,m.jsx)(t.code,{children:`right`}),`, and top/bottom start/end. Collision handling may change the final position. `,(0,m.jsx)(t.code,{children:`offset`}),` defaults to `,(0,m.jsx)(t.code,{children:`6`}),` pixels. `,(0,m.jsx)(t.code,{children:`variant`}),` is `,(0,m.jsx)(t.code,{children:`secondary`}),` by default and may be `,(0,m.jsx)(t.code,{children:`primary`}),` or `,(0,m.jsx)(t.code,{children:`danger`}),`; keep icon and content variants aligned and never use colour as the only meaning.`]}),`
`,(0,m.jsx)(t.p,{children:`Trigger inherits Button disabled and loading behaviour. A disabled native button cannot receive focus or hover consistently, so essential disabled explanations should remain visible. Tooltip itself has no invalid, empty, error, or loading state and Content must not contain interactive elements.`}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`native-attributes-and-styling`,children:`Native attributes and styling`}),`
`,(0,m.jsxs)(t.p,{children:[`IconTrigger and Content accept relevant `,(0,m.jsx)(t.code,{children:`aria-*`}),`, `,(0,m.jsx)(t.code,{children:`data-*`}),`, className, and element refs. Inline styling and conflicting interaction handlers are excluded.`]}),`
`,(0,m.jsx)(t.h2,{id:`keyboard-touch-internationalisation-and-mistakes`,children:`Keyboard, touch, internationalisation, and mistakes`}),`
`,(0,m.jsx)(t.p,{children:`Keyboard focus and pointer hover reveal Content after the delay; Escape dismisses it. Touch behaviour is provided by React Aria without making Content interactive. Keep content to a short phrase, translate it independently of stable application state, and allow wrapping. Start/end placement follows direction.`}),`
`,(0,m.jsxs)(t.p,{children:[`Do not put links, buttons, form controls, rich errors, or essential instructions in Content; do not use an unnamed IconTrigger; do not repeat the visible trigger label without adding information. Related components: `,(0,m.jsx)(t.code,{children:`Popover`}),`, `,(0,m.jsx)(t.code,{children:`VisuallyHidden`}),`, `,(0,m.jsx)(t.code,{children:`IconButton`}),`, and `,(0,m.jsx)(t.code,{children:`Alert`}),`.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};