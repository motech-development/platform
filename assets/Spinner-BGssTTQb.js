import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Decorative as c,SizesAndVariants as l,n as u,t as d}from"./Spinner.stories-DjQj2ZmZ.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Compact indeterminate activity indicator that is either explicitly labelled or deliberately decorative.`}),`
`,(0,m.jsx)(t.h1,{id:`spinner`,children:`Spinner`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Spinner`}),` indicates ongoing activity when the duration cannot be measured.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Spinner } from '@motech-development/breeze-ui';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use a spinner for compact indeterminate activity, especially inside an existing status layout. Use `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),` when progress is measurable, `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-skeleton--docs`,children:`Skeleton`}),` to reserve a loading layout, and a disabled/loading-capable control pattern when activity belongs to one action.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Inline, Spinner, Typography } from '@motech-development/breeze-ui';

export function SavingStatus() {
  return (
    <Inline gap="sm" wrap={false}>
      <Spinner />
      <Typography as="span">Saving changes</Typography>
    </Inline>
  );
}
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`labelling`,children:`Labelling`}),`
`,(0,m.jsxs)(t.p,{children:[`Omit `,(0,m.jsx)(t.code,{children:`label`}),` when adjacent visible text already communicates the activity. The spinner then has `,(0,m.jsx)(t.code,{children:`aria-hidden="true"`}),` and is purely decorative. Supply an application-owned translated `,(0,m.jsx)(t.code,{children:`label`}),` when it is the only status; Breeze renders `,(0,m.jsx)(t.code,{children:`role="status"`}),` and a visually hidden accessible name.`]}),`
`,(0,m.jsx)(t.p,{children:`Do not supply both a spinner label and duplicate live status text. The animation stops under reduced-motion preferences while the status semantics remain.`}),`
`,(0,m.jsx)(t.h2,{id:`sizes-and-variants`,children:`Sizes and variants`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`size`}),` accepts `,(0,m.jsx)(t.code,{children:`sm`}),`, `,(0,m.jsx)(t.code,{children:`md`}),`, or `,(0,m.jsx)(t.code,{children:`lg`}),` and defaults to `,(0,m.jsx)(t.code,{children:`md`}),`. `,(0,m.jsx)(t.code,{children:`variant`}),` accepts `,(0,m.jsx)(t.code,{children:`primary`}),`, `,(0,m.jsx)(t.code,{children:`secondary`}),`, `,(0,m.jsx)(t.code,{children:`success`}),`, `,(0,m.jsx)(t.code,{children:`danger`}),`, `,(0,m.jsx)(t.code,{children:`warning`}),`, `,(0,m.jsx)(t.code,{children:`info`}),`, `,(0,m.jsx)(t.code,{children:`light`}),`, or `,(0,m.jsx)(t.code,{children:`dark`}),` and defaults to `,(0,m.jsx)(t.code,{children:`primary`}),`. Select `,(0,m.jsx)(t.code,{children:`light`}),` only on a sufficiently dark surface and `,(0,m.jsx)(t.code,{children:`dark`}),` only on a light surface.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`state-keyboard-and-direction`,children:`State, keyboard, and direction`}),`
`,(0,m.jsxs)(t.p,{children:[`Spinner is indeterminate and read-only. It has no callback, keyboard interaction, disabled, invalid, empty, or error state. Render or remove it as application state changes. Its circular motion is direction-independent. Translate `,(0,m.jsx)(t.code,{children:`label`}),`; do not add directional copy to the decorative mark.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Spinner`}),` supports relevant native `,(0,m.jsx)(t.code,{children:`span`}),` attributes, including `,(0,m.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,m.jsx)(t.code,{children:`ref`}),`; `,(0,m.jsx)(t.code,{children:`children`}),`, `,(0,m.jsx)(t.code,{children:`role`}),`, and inline `,(0,m.jsx)(t.code,{children:`style`}),` are intentionally owned or excluded.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`Do not show an unlabelled standalone spinner with no visible status.`}),`
`,(0,m.jsx)(t.li,{children:`Do not announce the same status twice.`}),`
`,(0,m.jsx)(t.li,{children:`Do not use a spinner for measurable progress or as a permanent decoration.`}),`
`,(0,m.jsx)(t.li,{children:`Do not rely on animation alone to communicate loading.`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-skeleton--docs`,children:`Skeleton`}),`, and `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-alert--docs`,children:`Alert`}),`.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};