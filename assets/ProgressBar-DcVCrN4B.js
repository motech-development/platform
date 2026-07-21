import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Determinate as c,Indeterminate as l,n as u,t as d}from"./ProgressBar.stories-Bp8HkzY1.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Labelled determinate or indeterminate indicator for the progress of an ongoing operation.`}),`
`,(0,m.jsx)(t.h1,{id:`progressbar`,children:`ProgressBar`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ProgressBar`}),` communicates how far an operation has progressed, or that its progress cannot yet be measured.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { ProgressBar } from '@motech-development/breeze-ui';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use it for time-based operation progress such as uploading or processing. Use `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-meter--docs`,children:`Meter`}),` for a stable measurement such as storage used, `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-spinner--docs`,children:`Spinner`}),` for a compact indeterminate activity mark, and `,(0,m.jsx)(t.a,{href:`?path=/docs/progression-stepper--docs`,children:`Stepper`}),` for named stages.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { ProgressBar } from '@motech-development/breeze-ui';

export function UploadProgress({ percentage }: { percentage: number }) {
  return (
    <ProgressBar
      label="Uploading files"
      value={percentage}
      valueText={\`\${percentage} percent complete\`}
    />
  );
}
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`determinate-and-indeterminate-state`,children:`Determinate and indeterminate state`}),`
`,(0,m.jsxs)(t.p,{children:[`Determinate progress requires `,(0,m.jsx)(t.code,{children:`value`}),`; `,(0,m.jsx)(t.code,{children:`minimum`}),` defaults to `,(0,m.jsx)(t.code,{children:`0`}),`, `,(0,m.jsx)(t.code,{children:`maximum`}),` to `,(0,m.jsx)(t.code,{children:`100`}),`, and `,(0,m.jsx)(t.code,{children:`indeterminate`}),` is `,(0,m.jsx)(t.code,{children:`false`}),`. Set `,(0,m.jsx)(t.code,{children:`indeterminate`}),` to `,(0,m.jsx)(t.code,{children:`true`}),` and omit both `,(0,m.jsx)(t.code,{children:`value`}),` and `,(0,m.jsx)(t.code,{children:`valueText`}),` when no defensible measurement exists. Switch to determinate only when a meaningful value is available.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`valueText`}),` replaces the numeric value announced by assistive technology. Author and translate it when units or range meaning are not obvious. Values are interpreted within the supplied numeric range.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`variants-and-accessibility`,children:`Variants and accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`variant`}),` is `,(0,m.jsx)(t.code,{children:`primary`}),` by default and accepts `,(0,m.jsx)(t.code,{children:`primary`}),`, `,(0,m.jsx)(t.code,{children:`secondary`}),`, `,(0,m.jsx)(t.code,{children:`success`}),`, `,(0,m.jsx)(t.code,{children:`danger`}),`, `,(0,m.jsx)(t.code,{children:`warning`}),`, `,(0,m.jsx)(t.code,{children:`info`}),`, `,(0,m.jsx)(t.code,{children:`light`}),`, or `,(0,m.jsx)(t.code,{children:`dark`}),`. Use semantic colour only as supporting information. The visible translated `,(0,m.jsx)(t.code,{children:`label`}),` is required and labels the progressbar. The component has no keyboard interaction, callback, disabled, invalid, empty, or error state; keep operation cancellation in a separate `,(0,m.jsx)(t.code,{children:`Button`}),`. Direction is inherited, and formatting application-specific values remains the consumer's responsibility.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ProgressBar`}),` supports relevant native `,(0,m.jsx)(t.code,{children:`div`}),` attributes, including `,(0,m.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,m.jsx)(t.code,{children:`ref`}),`; `,(0,m.jsx)(t.code,{children:`children`}),`, `,(0,m.jsx)(t.code,{children:`role`}),`, and inline `,(0,m.jsx)(t.code,{children:`style`}),` are intentionally owned or excluded.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`Do not use a progress bar for a static scalar measurement.`}),`
`,(0,m.jsx)(t.li,{children:`Do not invent percentages for an indeterminate operation.`}),`
`,(0,m.jsx)(t.li,{children:`Do not omit or visually hide the required operation label.`}),`
`,(0,m.jsx)(t.li,{children:`Do not announce frequent progress changes elsewhere as well.`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.a,{href:`?path=/docs/feedback-meter--docs`,children:`Meter`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-spinner--docs`,children:`Spinner`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/progression-stepper--docs`,children:`Stepper`}),`, and `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-skeleton--docs`,children:`Skeleton`}),`.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};