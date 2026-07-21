import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Default as c,n as l,t as u}from"./Stack.stories-DfQ2dByq.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A vertical layout with responsive, token-based spacing and bounded alignment.`}),`
`,(0,p.jsx)(t.h1,{id:`stack`,children:`Stack`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Stack`}),` arranges related children vertically while preserving their authored reading order.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Stack } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Stack`}),` for forms, page sections, cards, and other vertical flows whose spacing should use Breeze tokens. Use `,(0,p.jsx)(t.code,{children:`Inline`}),` for a horizontal flow, `,(0,p.jsx)(t.code,{children:`Grid`}),` for columns, or ordinary semantic HTML when no layout abstraction is needed.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, Stack, Typography } from '@motech-development/breeze-ui';

export function EmptyMessage() {
  return (
    <Stack align="start" gap="md">
      <Typography as="h2" level="heading-md">
        No saved views
      </Typography>
      <Typography>Create a view to reuse these filters.</Typography>
      <Button>Create view</Button>
    </Stack>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`layout-and-responsive-spacing`,children:`Layout and responsive spacing`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`align`}),` controls the horizontal cross-axis; `,(0,p.jsx)(t.code,{children:`justify`}),` controls distribution on the vertical main axis. `,(0,p.jsx)(t.code,{children:`gap`}),` accepts `,(0,p.jsx)(t.code,{children:`none`}),`, `,(0,p.jsx)(t.code,{children:`xs`}),`, `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`control`}),`, `,(0,p.jsx)(t.code,{children:`compact`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, `,(0,p.jsx)(t.code,{children:`lg`}),`, `,(0,p.jsx)(t.code,{children:`xl`}),`, `,(0,p.jsx)(t.code,{children:`xxl`}),`, or `,(0,p.jsx)(t.code,{children:`page`}),`, either directly or as `,(0,p.jsx)(t.code,{children:`{ base, sm?, md?, lg? }`}),`. Breakpoints start at 681 px, 901 px, and 1181 px.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Stack gap={{ base: 'sm', md: 'xl' }}>
  <section>First</section>
  <section>Second</section>
</Stack>
`})}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-direction-and-content`,children:`Accessibility, direction, and content`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native `,(0,p.jsx)(t.code,{children:`div`}),` attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are supported; inline `,(0,p.jsx)(t.code,{children:`style`}),` is not. `,(0,p.jsx)(t.code,{children:`Stack`}),` has no selection, callback, loading, invalid, disabled, controlled, or read-only state.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Stack`}),` is a neutral `,(0,p.jsx)(t.code,{children:`div`}),` and adds no role, label, focus, or keyboard interaction. Use semantic children and preserve a logical DOM order. It remains vertical in both left-to-right and right-to-left layouts. Empty stacks render but usually indicate that conditional rendering belongs to the parent.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`justify="between"`}),` unless the stack has a meaningful available height.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`align="center"`}),` for long-form content that should remain easy to scan.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not add margins to every child; set `,(0,p.jsx)(t.code,{children:`gap`}),` on the stack.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Choose `,(0,p.jsx)(t.code,{children:`Inline`}),` for rows, `,(0,p.jsx)(t.code,{children:`Grid`}),` for two-dimensional layouts, `,(0,p.jsx)(t.code,{children:`Center`}),` for one centred composition, and `,(0,p.jsx)(t.code,{children:`Separator`}),` when a visible or semantic division is required.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};