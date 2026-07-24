import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Shapes as c,n as l,t as u}from"./Skeleton.stories-BWcZGWVv.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Non-announcing visual placeholder that reserves loading layout with text, circle, or rectangle geometry.`}),`
`,(0,p.jsx)(t.h1,{id:`skeleton`,children:`Skeleton`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Skeleton`}),` reserves the shape of content while that content is loading without adding placeholder noise to the accessibility tree.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Skeleton } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use skeletons when the eventual layout is predictable and preventing layout shift helps orientation. Use `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-spinner--docs`,children:`Spinner`}),` for a compact activity mark, `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),` for measurable work, or `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),` when the whole region has a meaningful loading or empty message.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Skeleton, Stack } from '@motech-development/breeze-ui';

export function LoadingSummary() {
  return (
    <section aria-busy="true" aria-label="Loading summary">
      <Stack gap="sm">
        <Skeleton className="w-2/3" />
        <Skeleton />
        <Skeleton className="min-h-32" shape="rectangle" />
      </Stack>
    </section>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`shapes-element-and-tone`,children:`Shapes, element, and tone`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`shape`}),` is `,(0,p.jsx)(t.code,{children:`text`}),` by default; `,(0,p.jsx)(t.code,{children:`circle`}),` provides a canonical avatar-sized placeholder and `,(0,p.jsx)(t.code,{children:`rectangle`}),` provides a minimum block height. Adjust width or height with `,(0,p.jsx)(t.code,{children:`className`}),` to mirror the real content. `,(0,p.jsx)(t.code,{children:`as`}),` defaults to `,(0,p.jsx)(t.code,{children:`div`}),`; use `,(0,p.jsx)(t.code,{children:`as="span"`}),` only when inline placement requires valid markup.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`tone`}),` accepts `,(0,p.jsx)(t.code,{children:`default`}),`, `,(0,p.jsx)(t.code,{children:`inverse`}),`, or `,(0,p.jsx)(t.code,{children:`danger`}),` and defaults to `,(0,p.jsx)(t.code,{children:`default`}),`. Match tone to the host surface rather than using it as a data status. Motion is suppressed for reduced-motion preferences.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-state`,children:`Accessibility and state`}),`
`,(0,p.jsxs)(t.p,{children:[`Every skeleton has `,(0,p.jsx)(t.code,{children:`aria-hidden="true"`}),`, has no role, and accepts no children. Put `,(0,p.jsx)(t.code,{children:`aria-busy="true"`}),` and a translated accessible label or status on the owning content region where users need loading context. Skeleton has no callback, keyboard interaction, controlled value, disabled, invalid, empty, or error behaviour. Remove placeholders when real content or an error appears. Geometry and logical placement work in both directions.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Skeleton`}),` supports relevant attributes for its selected `,(0,p.jsx)(t.code,{children:`div`}),` or `,(0,p.jsx)(t.code,{children:`span`}),`, including `,(0,p.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,p.jsx)(t.code,{children:`ref`}),`; `,(0,p.jsx)(t.code,{children:`children`}),`, `,(0,p.jsx)(t.code,{children:`role`}),`, and inline `,(0,p.jsx)(t.code,{children:`style`}),` are intentionally owned or excluded.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not expose fake placeholder text to assistive technology.`}),`
`,(0,p.jsx)(t.li,{children:`Do not use arbitrary shapes unrelated to the eventual layout.`}),`
`,(0,p.jsx)(t.li,{children:`Do not leave a loading region permanently busy after an error.`}),`
`,(0,p.jsx)(t.li,{children:`Do not use a skeleton as a disabled control or content-redaction treatment.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.a,{href:`?path=/docs/feedback-spinner--docs`,children:`Spinner`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};