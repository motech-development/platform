import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Horizontal as c,n as l,t as u}from"./Toolbar.stories-DHwZ2ozf.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A labelled collection of related controls with orientation-aware arrow-key navigation.`}),`
`,(0,p.jsx)(t.h1,{id:`toolbar`,children:`Toolbar`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Toolbar`}),` groups related interactive controls under toolbar semantics and coordinates arrow-key navigation.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, IconButton, Toolbar } from '@motech-development/breeze-ui';
import { DeleteIcon } from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Toolbar`}),` for a compact collection of related commands, such as editor or item actions. Use `,(0,p.jsx)(t.code,{children:`Inline`}),` for layout without toolbar semantics, `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` for related selected values, `,(0,p.jsx)(t.code,{children:`Menu`}),` when actions should be collapsed, or `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` for a small canonical action arrangement.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, IconButton, Toolbar } from '@motech-development/breeze-ui';
import { DeleteIcon } from '@motech-development/breeze-ui/icons';

export function ItemToolbar() {
  return (
    <Toolbar aria-label="Item actions">
      <Button>Edit details</Button>
      <IconButton aria-label="Delete item" variant="danger">
        <DeleteIcon />
      </IconButton>
    </Toolbar>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`composition-and-orientation`,children:`Composition and orientation`}),`
`,(0,p.jsxs)(t.p,{children:[`The `,(0,p.jsx)(t.code,{children:`Toolbar`}),` root owns the toolbar role, label, layout, and focus coordination. Compose it from public interactive controls such as `,(0,p.jsx)(t.code,{children:`Button`}),`, `,(0,p.jsx)(t.code,{children:`IconButton`}),`, `,(0,p.jsx)(t.code,{children:`ToggleButton`}),`, or links. The root has no public compound parts. Use `,(0,p.jsx)(t.code,{children:`horizontal`}),` for ordinary action rows and `,(0,p.jsx)(t.code,{children:`vertical`}),` only when the visual arrangement and expected arrow axis are genuinely vertical.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Disabled state belongs to each child control; `,(0,p.jsx)(t.code,{children:`Toolbar`}),` has no group-wide disabled, loading, invalid, error, empty, selection, controlled, or read-only state. An empty toolbar provides no value and should not render.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-direction`,children:`Accessibility, keyboard, and direction`}),`
`,(0,p.jsxs)(t.p,{children:[`Other relevant native `,(0,p.jsx)(t.code,{children:`div`}),` attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are supported. Children, class, and inline style are constrained by the public API.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Every toolbar needs an accessible name, especially when more than one exists on a page. `,(0,p.jsx)(t.code,{children:`Tab`}),` enters and leaves the toolbar; the arrow keys for its orientation move focus between enabled controls. Horizontal arrow behaviour follows the interface direction, while vertical toolbars use Up and Down. `,(0,p.jsx)(t.code,{children:`Enter`}),` or `,(0,p.jsx)(t.code,{children:`Space`}),` activates the focused button according to that child’s semantics. Each icon-only child still requires its own `,(0,p.jsx)(t.code,{children:`aria-label`}),`.`]}),`
`,(0,p.jsx)(t.p,{children:`Keep related controls together, order them logically in the DOM, and translate both visible and accessible labels. Do not use toolbar semantics solely to obtain a flex row.`}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not omit the toolbar’s accessible label.`}),`
`,(0,p.jsx)(t.li,{children:`Do not place unrelated controls in one toolbar.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not add manual arrow-key handlers or roving `,(0,p.jsx)(t.code,{children:`tabIndex`}),` values to children.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`Inline`}),` when users need toolbar navigation, or `,(0,p.jsx)(t.code,{children:`Toolbar`}),` when layout alone is required.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not render an empty toolbar while actions are loading; render appropriate progress or omit the region.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Inline`}),` for neutral layout, `,(0,p.jsx)(t.code,{children:`ToggleGroup`}),` for selection, `,(0,p.jsx)(t.code,{children:`Menu`}),` for collapsed actions, `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` for an opinionated action pattern, and `,(0,p.jsx)(t.code,{children:`Separator`}),` to divide meaningful command clusters where needed.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};