import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Wrapping as c,n as l,t as u}from"./Inline.stories-ChoclVtv.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A horizontal layout with responsive spacing, alignment, distribution, and wrapping.`}),`
`,(0,p.jsx)(t.h1,{id:`inline`,children:`Inline`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Inline`}),` arranges related children along the inline axis and wraps them by default.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Inline } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Inline`}),` for button rows, metadata, badges, and controls that form one horizontal group. Use `,(0,p.jsx)(t.code,{children:`Toolbar`}),` when related controls need toolbar semantics and arrow-key navigation, `,(0,p.jsx)(t.code,{children:`Stack`}),` for vertical flow, or `,(0,p.jsx)(t.code,{children:`Grid`}),` for aligned columns.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, Inline } from '@motech-development/breeze-ui';

export function Actions() {
  return (
    <Inline gap="compact" justify="end">
      <Button appearance="outline">Cancel</Button>
      <Button>Save changes</Button>
    </Inline>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`layout-and-responsive-spacing`,children:`Layout and responsive spacing`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`align`}),` controls the cross-axis and includes `,(0,p.jsx)(t.code,{children:`baseline`}),` for text with different sizes. `,(0,p.jsx)(t.code,{children:`justify`}),` distributes items along the row. Leave `,(0,p.jsx)(t.code,{children:`wrap`}),` enabled unless the composition is guaranteed to fit at every supported viewport and zoom level.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`gap`}),` accepts `,(0,p.jsx)(t.code,{children:`none`}),`, `,(0,p.jsx)(t.code,{children:`xs`}),`, `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`control`}),`, `,(0,p.jsx)(t.code,{children:`compact`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, `,(0,p.jsx)(t.code,{children:`lg`}),`, `,(0,p.jsx)(t.code,{children:`xl`}),`, `,(0,p.jsx)(t.code,{children:`xxl`}),`, or `,(0,p.jsx)(t.code,{children:`page`}),`, directly or as `,(0,p.jsx)(t.code,{children:`{ base, sm?, md?, lg? }`}),`; breakpoints start at 681 px, 901 px, and 1181 px.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-direction`,children:`Accessibility and direction`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native `,(0,p.jsx)(t.code,{children:`div`}),` attributes are supported, including `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),`; inline `,(0,p.jsx)(t.code,{children:`style`}),` is excluded. There are no controlled, loading, disabled, invalid, empty, or error states.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Inline`}),` adds no role, label, focus management, or keyboard behaviour. Wrapping changes visual rows without changing reading or tab order. In right-to-left direction, the browser lays out the inline axis accordingly; do not hard-code left/right spacing or reverse DOM order.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not set `,(0,p.jsx)(t.code,{children:`wrap={false}`}),` for user-generated labels or action sets that may grow after translation.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use spacing characters or per-child margins instead of `,(0,p.jsx)(t.code,{children:`gap`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`Inline`}),` as a substitute for `,(0,p.jsx)(t.code,{children:`Toolbar`}),` semantics.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Stack`}),` for vertical flow, `,(0,p.jsx)(t.code,{children:`Grid`}),` for responsive columns, `,(0,p.jsx)(t.code,{children:`Toolbar`}),` for keyboard-navigable actions, and `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` for a canonical grouped-action pattern.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};