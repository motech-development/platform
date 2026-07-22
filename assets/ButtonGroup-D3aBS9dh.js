import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{Responsive as c,n as l,t as u}from"./ButtonGroup.stories-B_Is1SMB.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Responsive semantic grouping for related application actions, with logical alignment and a mobile-first visual flow that never changes DOM or keyboard order.`}),`
`,(0,p.jsx)(t.h1,{id:`buttongroup`,children:`ButtonGroup`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ButtonGroup`}),` arranges a small set of related actions with consistent spacing, alignment and responsive flow.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, ButtonGroup } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` when two or more `,(0,p.jsx)(t.code,{children:`Button`}),`, `,(0,p.jsx)(t.code,{children:`LinkButton`}),` or `,(0,p.jsx)(t.code,{children:`IconButton`}),` controls belong to the same local task. It provides visual layout and a semantic group without owning the actions.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use it for form submission ordering; use `,(0,p.jsx)(t.code,{children:`FormActions`}),`. Use `,(0,p.jsx)(t.code,{children:`Toolbar`}),` when arrow-key navigation should coordinate a collection of commands. Use `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` or `,(0,p.jsx)(t.code,{children:`SegmentedControl`}),` when the controls share selection state.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, ButtonGroup } from '@motech-development/breeze-ui';

<ButtonGroup
  aria-label="Item actions"
  orientation={{ base: 'verticalReverse', sm: 'horizontal' }}
>
  <Button appearance="outline" variant="secondary" onAction={cancelChanges}>
    Cancel
  </Button>
  <Button onAction={saveChanges}>Save changes</Button>
</ButtonGroup>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-responsive-behaviour`,children:`Anatomy and responsive behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ButtonGroup`}),` is a single `,(0,p.jsx)(t.code,{children:`div`}),` with `,(0,p.jsx)(t.code,{children:`role="group"`}),`. Its children remain ordinary Breeze actions and retain their own button, link, loading, disabled and callback semantics.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`orientation`}),` accepts a scalar value or a mobile-first responsive object. A responsive object requires `,(0,p.jsx)(t.code,{children:`base`}),` and may override it at `,(0,p.jsx)(t.code,{children:`sm`}),` (681px), `,(0,p.jsx)(t.code,{children:`md`}),` (901px) and `,(0,p.jsx)(t.code,{children:`lg`}),` (1181px).`]}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Orientation`}),(0,p.jsx)(t.th,{children:`Behaviour`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`horizontal`})}),(0,p.jsx)(t.td,{children:`Actions flow in DOM order and wrap when space is constrained.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`vertical`})}),(0,p.jsx)(t.td,{children:`Actions stack in DOM order and stretch across the available width.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`verticalReverse`})}),(0,p.jsxs)(t.td,{children:[`Actions stack in reverse `,(0,p.jsx)(t.strong,{children:`visual`}),` order and stretch; DOM, focus and screen-reader order do not change.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`The canonical compact form arrangement places a secondary action first in JSX, then uses `,(0,p.jsx)(t.code,{children:`{ base: 'verticalReverse', sm: 'horizontal' }`}),` so the primary action is visually first on compact screens and trailing on wider screens. Keep the source order meaningful because Tab navigation always follows the DOM.`]}),`
`,(0,p.jsx)(t.h2,{id:`alignment-state-and-callbacks`,children:`Alignment, state and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`align`}),` is scalar and defaults to `,(0,p.jsx)(t.code,{children:`start`}),`. Choose `,(0,p.jsx)(t.code,{children:`start`}),`, `,(0,p.jsx)(t.code,{children:`center`}),`, `,(0,p.jsx)(t.code,{children:`end`}),` or `,(0,p.jsx)(t.code,{children:`spaceBetween`}),`; start and end are logical directions and therefore adapt to right-to-left layouts.`]}),`
`,(0,p.jsxs)(t.p,{children:[`ButtonGroup has no controlled or uncontrolled value, read-only state, loading state, validation, error or empty presentation. Configure `,(0,p.jsx)(t.code,{children:`disabled`}),`, `,(0,p.jsx)(t.code,{children:`loading`}),`, `,(0,p.jsx)(t.code,{children:`onAction`}),`, `,(0,p.jsx)(t.code,{children:`href`}),` and routing behaviour on each child. Avoid rendering an empty group.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-internationalisation`,children:`Accessibility, keyboard and internationalisation`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Supply `,(0,p.jsx)(t.code,{children:`aria-label`}),` or `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),` when the relationship between the actions is not already clear from nearby content. The default group role does not create an accessible name by itself.`]}),`
`,(0,p.jsx)(t.li,{children:`ButtonGroup adds no arrow-key model. Tab and Shift+Tab move through children in DOM order; each child keeps its own Enter, Space or link behaviour.`}),`
`,(0,p.jsx)(t.li,{children:`Keep labels concise, translated and able to wrap. Provider direction controls logical alignment; do not reverse the child array for right-to-left content.`}),`
`,(0,p.jsx)(t.li,{children:`Icon-only children still require their own accessible names. Do not communicate the primary action through visual position alone.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not reorder JSX at each breakpoint, assume visual order changes keyboard order, place unrelated commands together, or use `,(0,p.jsx)(t.code,{children:`spaceBetween`}),` to create page layout. `,(0,p.jsx)(t.code,{children:`FormActions`}),` owns canonical form-action priority, `,(0,p.jsx)(t.code,{children:`Toolbar`}),` owns command navigation, and `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` owns shared selection.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};