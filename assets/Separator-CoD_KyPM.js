import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Horizontal as c,n as l,t as u}from"./Separator.stories-Dx5m-Oaa.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A semantic or decorative divider with horizontal and vertical orientations.`}),`
`,(0,p.jsx)(t.h1,{id:`separator`,children:`Separator`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Separator`}),` draws a horizontal or vertical division and exposes separator semantics unless explicitly decorative.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Separator } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use a semantic separator when the division helps users understand neighbouring regions. Use `,(0,p.jsx)(t.code,{children:`decorative`}),` when the same relationship is already clear from structure and the line is visual only. Prefer `,(0,p.jsx)(t.code,{children:`gap`}),` on `,(0,p.jsx)(t.code,{children:`Stack`}),` or `,(0,p.jsx)(t.code,{children:`Inline`}),` when you only need spacing, and use headings or separate landmarks for stronger structural boundaries.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Separator, Stack, Typography } from '@motech-development/breeze-ui';

export function Sections() {
  return (
    <Stack>
      <Typography>Current details</Typography>
      <Separator />
      <Typography>Previous details</Typography>
    </Stack>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`orientation-and-semantics`,children:`Orientation and semantics`}),`
`,(0,p.jsxs)(t.p,{children:[`Horizontal separators render an `,(0,p.jsx)(t.code,{children:`hr`}),`; vertical separators render a `,(0,p.jsx)(t.code,{children:`div`}),` with `,(0,p.jsx)(t.code,{children:`role="separator"`}),` and `,(0,p.jsx)(t.code,{children:`aria-orientation="vertical"`}),`. A vertical separator must be placed in a parent with a meaningful height. `,(0,p.jsx)(t.code,{children:`decorative`}),` changes the role to `,(0,p.jsx)(t.code,{children:`presentation`}),` and adds `,(0,p.jsx)(t.code,{children:`aria-hidden="true"`}),`.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-keyboard-behaviour`,children:`Accessibility and keyboard behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are accepted. `,(0,p.jsx)(t.code,{children:`children`}),`, `,(0,p.jsx)(t.code,{children:`role`}),`, `,(0,p.jsx)(t.code,{children:`aria-orientation`}),`, and inline `,(0,p.jsx)(t.code,{children:`style`}),` are intentionally component-owned or unavailable. There are no callback, controlled, loading, disabled, invalid, empty, or error states.`]}),`
`,(0,p.jsx)(t.p,{children:`Meaningful separators are discoverable but not focusable and have no keyboard interaction. Do not add an accessible name unless it disambiguates a genuinely meaningful divider. Direction does not change the declared horizontal or vertical axis.`}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not expose repetitive visual rules as semantic separators.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not mark a meaningful structural division `,(0,p.jsx)(t.code,{children:`decorative`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not use a vertical separator without height-bearing surrounding layout.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Stack`}),` and `,(0,p.jsx)(t.code,{children:`Inline`}),` to place separators, `,(0,p.jsx)(t.code,{children:`Surface`}),` for a bounded region, and `,(0,p.jsx)(t.code,{children:`Accordion`}),` or `,(0,p.jsx)(t.code,{children:`Disclosure`}),` when the boundary also controls visibility.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};