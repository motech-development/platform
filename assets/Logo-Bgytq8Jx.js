import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Sizes as c,n as l,t as u}from"./Logo.stories-8sxguPc_.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Canonical accessible Motech Development brand mark in three supported sizes.`}),`
`,(0,p.jsx)(t.h1,{id:`logo`,children:`Logo`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Logo`}),` renders the canonical Motech Development mark with a fixed accessible name and Breeze-owned brand colour.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Logo } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Use when the Motech Development brand mark is required in application chrome or an identity treatment.`}),`
`,(0,p.jsx)(t.li,{children:`Pair it with application-owned product text when a product name must appear beside the mark.`}),`
`,(0,p.jsx)(t.li,{children:`Choose the nearest canonical size and let the containing layout provide spacing.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Avatar`}),` for a person or entity identity; Logo is not a generic image placeholder.`]}),`
`,(0,p.jsx)(t.li,{children:`Use a curated icon for an action, status, or navigation affordance.`}),`
`,(0,p.jsx)(t.li,{children:`Do not use Logo to represent an application, organisation, or partner that has a different identity.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Inline, Logo, Typography } from '@motech-development/breeze-ui';

export function ProductIdentity() {
  return (
    <Inline align="center" gap="sm" wrap={false}>
      <Logo />
      <Typography as="span" level="label">
        Workspace
      </Typography>
    </Inline>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-sizing`,children:`Anatomy and sizing`}),`
`,(0,p.jsxs)(t.p,{children:[`Logo is one non-interactive `,(0,p.jsx)(t.code,{children:`span`}),` with `,(0,p.jsx)(t.code,{children:`role="img"`}),` and the accessible name “Motech Development”. Its inline SVG is hidden from assistive technology so the mark is announced once.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, and `,(0,p.jsx)(t.code,{children:`lg`}),` sizes set canonical surrounding text scales of 1rem, 1.25rem, and 1.5rem. The mark itself is sized in `,(0,p.jsx)(t.code,{children:`em`}),`, so it remains aligned with adjacent text. `,(0,p.jsx)(t.code,{children:`md`}),` is the default.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The mark uses the Breeze `,(0,p.jsx)(t.code,{children:`--breeze-brand-mark`}),` token. On an inverse Breeze surface that token supplies the approved contrasting treatment; applications should not recolour the internal SVG.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-behaviour`,children:`Accessibility and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native span attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`data-*`}),`, and relationship attributes are forwarded. `,(0,p.jsx)(t.code,{children:`children`}),`, `,(0,p.jsx)(t.code,{children:`aria-label`}),`, `,(0,p.jsx)(t.code,{children:`style`}),`, and colour overrides are intentionally excluded: the geometry, accessible brand name, and colour treatment are canonical.`]}),`
`,(0,p.jsx)(t.p,{children:`Logo has no keyboard interaction and no controlled, uncontrolled, disabled, loading, invalid, or read-only state. When Logo is the only content of a link, its fixed accessible name becomes the link name; ensure “Motech Development” accurately describes that destination. If a product-home link needs a different name, include visible or visually hidden product text in the link.`}),`
`,(0,p.jsxs)(t.p,{children:[`The mark is direction-neutral and its accessible name is not translated by `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),`. Product text beside it follows the provider locale and direction normally.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not copy the internal SVG or depend on its paths, view box, or classes.`}),`
`,(0,p.jsx)(t.li,{children:`Do not pass children or replace the accessible name.`}),`
`,(0,p.jsx)(t.li,{children:`Do not stretch the mark with arbitrary width and height styles.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use Logo as a clickable element; wrap it in `,(0,p.jsx)(t.code,{children:`Link`}),` when it is genuinely a destination.`]}),`
`,(0,p.jsx)(t.li,{children:`The component provides only the Motech Development mark, not product lock-ups or application-owned wording.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Avatar`}),` for people and entity markers.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconTile`}),` to place an icon or short marker in semantic geometry.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Link`}),` when the brand mark leads to a destination.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`ApplicationShell`}),` for the surrounding application identity and navigation structure.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};