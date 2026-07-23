import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{ResponsiveWorkspace as c,n as l,t as u}from"./Container.stories-D3ii8TQ0.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A bounded application workspace with responsive page gutters.`}),`
`,(0,p.jsx)(t.h1,{id:`container`,children:`Container`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Container`}),` centres application content in a full-width workspace, limits it to the Breeze maximum width, and applies mobile-first page gutters.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Container } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use one `,(0,p.jsx)(t.code,{children:`Container`}),` around page-level content that should share the standard maximum width and gutters. Use `,(0,p.jsx)(t.code,{children:`Stack`}),`, `,(0,p.jsx)(t.code,{children:`Inline`}),`, or `,(0,p.jsx)(t.code,{children:`Grid`}),` inside it to arrange content.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`Container`}),` for a visually bounded panel; use `,(0,p.jsx)(t.code,{children:`Surface`}),` or `,(0,p.jsx)(t.code,{children:`Card`}),` instead. Do not nest containers merely to add spacing, because their maximum width and automatic inline margins are page-level behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Container, Stack, Typography } from '@motech-development/breeze-ui';

export function AccountPage() {
  return (
    <Container>
      <Stack gap="xl">
        <Typography as="h1" level="heading-xl">
          Account
        </Typography>
        <Typography>Manage your account details.</Typography>
      </Stack>
    </Container>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`responsive-gutters`,children:`Responsive gutters`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`padding`}),` accepts one spacing value or an object with a required `,(0,p.jsx)(t.code,{children:`base`}),` value and optional `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, and `,(0,p.jsx)(t.code,{children:`lg`}),` overrides. Breakpoints are mobile-first: `,(0,p.jsx)(t.code,{children:`sm`}),` starts at 681 px, `,(0,p.jsx)(t.code,{children:`md`}),` at 901 px, and `,(0,p.jsx)(t.code,{children:`lg`}),` at 1181 px. The default is `,(0,p.jsx)(t.code,{children:`{ base: 'md', sm: 'xl', md: 'xxl', lg: 'page' }`}),`.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`<Container padding={{ base: 'sm', md: 'page' }}>Page content</Container>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Spacing values are `,(0,p.jsx)(t.code,{children:`none`}),`, `,(0,p.jsx)(t.code,{children:`xs`}),`, `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`control`}),`, `,(0,p.jsx)(t.code,{children:`compact`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, `,(0,p.jsx)(t.code,{children:`lg`}),`, `,(0,p.jsx)(t.code,{children:`xl`}),`, `,(0,p.jsx)(t.code,{children:`xxl`}),`, and `,(0,p.jsx)(t.code,{children:`page`}),`. Prefer the default gutters unless a documented page composition needs another token.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-behaviour`,children:`Accessibility and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Container`}),` also accepts relevant native `,(0,p.jsx)(t.code,{children:`div`}),` attributes, including `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),`; inline `,(0,p.jsx)(t.code,{children:`style`}),` is intentionally unavailable. It has no loading, disabled, invalid, empty, controlled, or read-only state.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Container`}),` is a neutral `,(0,p.jsx)(t.code,{children:`div`}),`: it adds no landmark, label, focus, or keyboard behaviour. Put semantic elements such as `,(0,p.jsx)(t.code,{children:`main`}),`, `,(0,p.jsx)(t.code,{children:`nav`}),`, and headings inside it. If the container itself is labelled, ensure the label communicates a real relationship rather than presentation. Content order remains the authored DOM order at every breakpoint and direction.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`className`}),` to recreate arbitrary page gutters when `,(0,p.jsx)(t.code,{children:`padding`}),` covers the requirement.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not assume `,(0,p.jsx)(t.code,{children:`Container`}),` supplies a `,(0,p.jsx)(t.code,{children:`main`}),` landmark.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not reorder children visually at breakpoints.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Stack`}),` for vertical flow, `,(0,p.jsx)(t.code,{children:`Grid`}),` for responsive columns, `,(0,p.jsx)(t.code,{children:`Center`}),` for two-axis centring, and `,(0,p.jsx)(t.code,{children:`Surface`}),` for a coloured or bordered inset region.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};