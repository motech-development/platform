import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{TonesAndBorders as c,n as l,t as u}from"./Surface.stories-8GMtwKU-.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A canonical background, border, and responsive inset for grouped content.`}),`
`,(0,p.jsx)(t.h1,{id:`surface`,children:`Surface`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Surface`}),` gives grouped content a canonical Breeze background, border treatment, and responsive inset.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Surface } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Surface`}),` as a low-level visual region when you need deliberate background, boundary, and padding choices.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Card`}),` when content has card anatomy and actions, or `,(0,p.jsx)(t.code,{children:`Container`}),` for page width and gutters. Avoid surfaces around every group: hierarchy should remain meaningful.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Stack, Surface, Typography } from '@motech-development/breeze-ui';

export function Summary() {
  return (
    <Surface as="section" aria-labelledby="summary-title" tone="subtle">
      <Stack gap="sm">
        <Typography id="summary-title" as="h2" level="heading-md">
          Summary
        </Typography>
        <Typography>Three items are ready.</Typography>
      </Stack>
    </Surface>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`tone-border-and-inset`,children:`Tone, border, and inset`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`default`}),` is the normal raised content surface, `,(0,p.jsx)(t.code,{children:`subtle`}),` creates quiet grouping, `,(0,p.jsx)(t.code,{children:`canvas`}),` matches the application canvas, and `,(0,p.jsx)(t.code,{children:`inverse`}),` is for content on the shell colour. Choose tone for hierarchy and contrast, not decoration. `,(0,p.jsx)(t.code,{children:`border="strong"`}),` increases boundary emphasis; `,(0,p.jsx)(t.code,{children:`none`}),` is appropriate only when surrounding contrast already defines the region.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`padding`}),` accepts `,(0,p.jsx)(t.code,{children:`none`}),`, `,(0,p.jsx)(t.code,{children:`xs`}),`, `,(0,p.jsx)(t.code,{children:`sm`}),`, `,(0,p.jsx)(t.code,{children:`control`}),`, `,(0,p.jsx)(t.code,{children:`compact`}),`, `,(0,p.jsx)(t.code,{children:`md`}),`, `,(0,p.jsx)(t.code,{children:`lg`}),`, `,(0,p.jsx)(t.code,{children:`xl`}),`, `,(0,p.jsx)(t.code,{children:`xxl`}),`, or `,(0,p.jsx)(t.code,{children:`page`}),`, directly or as `,(0,p.jsx)(t.code,{children:`{ base, sm?, md?, lg? }`}),` at 681 px, 901 px, and 1181 px.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-semantics`,children:`Accessibility and semantics`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native HTML attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are supported; inline `,(0,p.jsx)(t.code,{children:`style`}),` is excluded. There is no controlled, loading, disabled, invalid, empty, or error state.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Colour and borders add no accessible semantics. Choose `,(0,p.jsx)(t.code,{children:`section`}),` only for a labelled document section and `,(0,p.jsx)(t.code,{children:`article`}),` only for independently distributable content; otherwise retain `,(0,p.jsx)(t.code,{children:`div`}),`. Ensure custom content meets contrast requirements, particularly on `,(0,p.jsx)(t.code,{children:`inverse`}),`. `,(0,p.jsx)(t.code,{children:`Surface`}),` adds no keyboard or focus behaviour and works in both text directions.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not select `,(0,p.jsx)(t.code,{children:`section`}),` or `,(0,p.jsx)(t.code,{children:`article`}),` solely for styling.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not rely on tone alone to convey success, warning, or error state; use `,(0,p.jsx)(t.code,{children:`Alert`}),` where status semantics matter.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not apply arbitrary background and padding classes when a public tone or spacing token expresses the design.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Card`}),` for structured content, `,(0,p.jsx)(t.code,{children:`Alert`}),` for semantic feedback, `,(0,p.jsx)(t.code,{children:`Container`}),` for page bounds, and `,(0,p.jsx)(t.code,{children:`Stack`}),` or `,(0,p.jsx)(t.code,{children:`Grid`}),` for internal layout.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};