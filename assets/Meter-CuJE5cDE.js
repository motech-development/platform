import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{CustomRange as c,Usage as l,n as u,t as d}from"./Meter.stories-BycY5FoD.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Labelled scalar measurement within a known finite range, with clamped visual and accessible output.`}),`
`,(0,m.jsx)(t.h1,{id:`meter`,children:`Meter`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Meter`}),` displays one scalar measurement within a known range.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Meter } from '@motech-development/breeze-ui';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use a meter for a stable quantity such as storage use, signal quality, or capacity. Use `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),` for operation completion, `,(0,m.jsx)(t.a,{href:`?path=/docs/patterns-data-metriccard--docs`,children:`MetricCard`}),` for a prominent standalone metric, and `,(0,m.jsx)(t.a,{href:`?path=/docs/selection-slider--docs`,children:`Slider`}),` when the user changes the value.`]}),`
`,(0,m.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Meter } from '@motech-development/breeze-ui';

export function StorageUsage() {
  return (
    <Meter
      label="Storage used"
      value={72}
      valueText="72 gigabytes used"
      variant="warning"
    />
  );
}
`})}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`range-and-value-behaviour`,children:`Range and value behaviour`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`minimum`}),` defaults to `,(0,m.jsx)(t.code,{children:`0`}),` and `,(0,m.jsx)(t.code,{children:`maximum`}),` to `,(0,m.jsx)(t.code,{children:`100`}),`. Both bounds must be finite and `,(0,m.jsx)(t.code,{children:`maximum`}),` must be greater than or equal to `,(0,m.jsx)(t.code,{children:`minimum`}),`; invalid bounds throw `,(0,m.jsx)(t.code,{children:`RangeError`}),`. Finite values outside the range are clamped consistently for visual width, visible copy, and accessible value. Use `,(0,m.jsx)(t.code,{children:`valueText`}),` to provide translated units or qualitative meaning.`]}),`
`,(0,m.jsx)(t.p,{children:`Meter is always determinate and read-only. It has no callback, keyboard interaction, loading, disabled, invalid, empty, or error state.`}),`
`,(0,m.jsx)(t.h2,{id:`variants-and-accessibility`,children:`Variants and accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`variant`}),` defaults to `,(0,m.jsx)(t.code,{children:`primary`}),` and accepts `,(0,m.jsx)(t.code,{children:`primary`}),`, `,(0,m.jsx)(t.code,{children:`secondary`}),`, `,(0,m.jsx)(t.code,{children:`success`}),`, `,(0,m.jsx)(t.code,{children:`danger`}),`, `,(0,m.jsx)(t.code,{children:`warning`}),`, `,(0,m.jsx)(t.code,{children:`info`}),`, `,(0,m.jsx)(t.code,{children:`light`}),`, or `,(0,m.jsx)(t.code,{children:`dark`}),`. Choose a semantic colour only when it represents the measurement's meaning, and never depend on colour alone. The required visible `,(0,m.jsx)(t.code,{children:`label`}),` names the `,(0,m.jsx)(t.code,{children:`meter`}),`. Localise `,(0,m.jsx)(t.code,{children:`label`}),` and `,(0,m.jsx)(t.code,{children:`valueText`}),`; numeric formatting is application-owned. Logical layout follows the inherited direction.`]}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Meter`}),` supports relevant native `,(0,m.jsx)(t.code,{children:`div`}),` attributes, including `,(0,m.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,m.jsx)(t.code,{children:`ref`}),`; `,(0,m.jsx)(t.code,{children:`children`}),`, `,(0,m.jsx)(t.code,{children:`role`}),`, and inline `,(0,m.jsx)(t.code,{children:`style`}),` are intentionally owned or excluded.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[`Do not use `,(0,m.jsx)(t.code,{children:`Meter`}),` as an input or progress indicator.`]}),`
`,(0,m.jsx)(t.li,{children:`Do not pass non-finite bounds or reverse the range.`}),`
`,(0,m.jsx)(t.li,{children:`Do not rely on an unlocalised raw number when units matter.`}),`
`,(0,m.jsxs)(t.li,{children:[`Do not communicate warning or danger only through `,(0,m.jsx)(t.code,{children:`variant`}),`.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/selection-slider--docs`,children:`Slider`}),`, and `,(0,m.jsx)(t.a,{href:`?path=/docs/patterns-data-metriccard--docs`,children:`MetricCard`}),`.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};