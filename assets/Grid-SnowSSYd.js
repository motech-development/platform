import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{ResponsiveColumns as c,n as l,t as u}from"./Grid.stories-Bs_54GHw.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A bounded responsive grid with stable source order and canonical track templates.`}),`
`,(0,p.jsx)(t.h1,{id:`grid`,children:`Grid`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Grid`}),` arranges related content in equal responsive columns or the canonical field-control-action track template.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Grid } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Grid`}),` when content needs aligned rows and columns or a column count that changes at Breeze breakpoints. Use `,(0,p.jsx)(t.code,{children:`Stack`}),` for a single vertical flow, `,(0,p.jsx)(t.code,{children:`Inline`}),` for a wrapping row, and `,(0,p.jsx)(t.code,{children:`Table`}),` for genuinely tabular data.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Grid, Surface } from '@motech-development/breeze-ui';

export function SummaryGrid() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap={{ base: 'md', md: 'lg' }}>
      <Surface>First summary</Surface>
      <Surface>Second summary</Surface>
      <Surface>Third summary</Surface>
    </Grid>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`columns-templates-and-spacing`,children:`Columns, templates, and spacing`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`columns`}),` accepts `,(0,p.jsx)(t.code,{children:`1`}),`, `,(0,p.jsx)(t.code,{children:`2`}),`, `,(0,p.jsx)(t.code,{children:`3`}),`, `,(0,p.jsx)(t.code,{children:`4`}),`, `,(0,p.jsx)(t.code,{children:`6`}),`, or `,(0,p.jsx)(t.code,{children:`12`}),`, directly or as `,(0,p.jsx)(t.code,{children:`{ base, sm?, md?, lg? }`}),`. Breakpoints are mobile-first at 681 px, 901 px, and 1181 px. `,(0,p.jsx)(t.code,{children:`gap`}),` uses the Breeze spacing values `,(0,p.jsx)(t.code,{children:`none`}),`, `,(0,p.jsx)(t.code,{children:`xs`}),`, `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`control`}),`, `,(0,p.jsx)(t.code,{children:`compact`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, `,(0,p.jsx)(t.code,{children:`lg`}),`, `,(0,p.jsx)(t.code,{children:`xl`}),`, `,(0,p.jsx)(t.code,{children:`xxl`}),`, and `,(0,p.jsx)(t.code,{children:`page`}),` in the same scalar or responsive form.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`template="field-control-action"`}),` only for the established three-track form row: a flexible field, an automatic-width control, and a square final action. While a template is active, `,(0,p.jsx)(t.code,{children:`columns`}),` is ignored.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Grid template="field-control-action" align="end" gap="sm">
  <label>
    Reference <input />
  </label>
  <span>Status</span>
  <button type="button" aria-label="Remove">
    ×
  </button>
</Grid>
`})}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-direction`,children:`Accessibility and direction`}),`
`,(0,p.jsxs)(t.p,{children:[`Native `,(0,p.jsx)(t.code,{children:`div`}),` attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are supported; inline `,(0,p.jsx)(t.code,{children:`style`}),` is excluded. `,(0,p.jsx)(t.code,{children:`Grid`}),` has no interactive, controlled, loading, invalid, empty, or error state.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Grid`}),` is a CSS layout, not an ARIA grid, and supplies no role or keyboard interaction. Keep DOM order meaningful because responsive columns do not reorder content. Direction-aware CSS handles inline flow; avoid visual reordering that would diverge from reading and focus order.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`Grid`}),` for data requiring row/column headers, sorting, or selection; use `,(0,p.jsx)(t.code,{children:`Table`}),` or `,(0,p.jsx)(t.code,{children:`GridList`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not pass both a meaningful `,(0,p.jsx)(t.code,{children:`columns`}),` value and `,(0,p.jsx)(t.code,{children:`template`}),`; the template wins.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not assume every item spans one conceptual column in a 12-column layout; Breeze exposes no span API.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Container`}),` around page grids, `,(0,p.jsx)(t.code,{children:`Stack`}),` or `,(0,p.jsx)(t.code,{children:`Inline`}),` for one-dimensional flow, and `,(0,p.jsx)(t.code,{children:`Surface`}),` or `,(0,p.jsx)(t.code,{children:`Card`}),` for the items.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};