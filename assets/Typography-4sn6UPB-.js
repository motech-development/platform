import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{SemanticIndependence as c,n as l,t as u}from"./Typography.stories-BPfzuVkT.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Semantic non-interactive text with an independent visual level and constrained presentation options.`}),`
`,(0,p.jsx)(t.h1,{id:`typography`,children:`Typography`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Typography`}),` renders non-interactive text while keeping the document element independent from its visual level.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Typography } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Use for headings, paragraphs, labels in non-form display content, summaries, metrics, and inline text.`}),`
`,(0,p.jsxs)(t.li,{children:[`Choose `,(0,p.jsx)(t.code,{children:`as`}),` for semantic document structure, then use `,(0,p.jsx)(t.code,{children:`level`}),` only when appearance must differ.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`tabularNumbers`}),` for changing values that should remain visually aligned.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Link`}),` for navigation and `,(0,p.jsx)(t.code,{children:`Button`}),` for actions; do not add click behaviour to Typography.`]}),`
`,(0,p.jsx)(t.li,{children:`Use the label, description, error, or legend part of a field component for form labelling so the accessible relationship is preserved.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use layout primitives such as `,(0,p.jsx)(t.code,{children:`Stack`}),`, `,(0,p.jsx)(t.code,{children:`Inline`}),`, and `,(0,p.jsx)(t.code,{children:`Container`}),` for spacing and positioning instead of treating Typography as a layout API.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Stack, Typography } from '@motech-development/breeze-ui';

export function Introduction() {
  return (
    <Stack gap="sm">
      <Typography as="h2">Project summary</Typography>
      <Typography colour="muted">
        Review the latest activity and outstanding actions.
      </Typography>
    </Stack>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`semantics-and-visual-levels`,children:`Semantics and visual levels`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`as`}),` controls the rendered HTML element. It defaults to `,(0,p.jsx)(t.code,{children:`p`}),`. Heading elements automatically use their matching visual level; `,(0,p.jsx)(t.code,{children:`strong`}),` and `,(0,p.jsx)(t.code,{children:`dt`}),` default to `,(0,p.jsx)(t.code,{children:`label`}),`; all other elements default to `,(0,p.jsx)(t.code,{children:`body`}),`. An explicit `,(0,p.jsx)(t.code,{children:`level`}),` overrides only the appearance, never the element.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Maintain a logical heading hierarchy. A visually smaller heading is still expressed with the correct `,(0,p.jsx)(t.code,{children:`h1`}),`–`,(0,p.jsx)(t.code,{children:`h6`}),` element:`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Typography } from '@motech-development/breeze-ui';

export function SubsectionHeading() {
  return (
    <Typography as="h3" level="h5">
      Contact preferences
    </Typography>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Visual levels are `,(0,p.jsx)(t.code,{children:`h1`}),`, `,(0,p.jsx)(t.code,{children:`h2`}),`, `,(0,p.jsx)(t.code,{children:`h3`}),`, `,(0,p.jsx)(t.code,{children:`h4`}),`, `,(0,p.jsx)(t.code,{children:`h5`}),`, `,(0,p.jsx)(t.code,{children:`h6`}),`, `,(0,p.jsx)(t.code,{children:`metric`}),`, `,(0,p.jsx)(t.code,{children:`summary`}),`, `,(0,p.jsx)(t.code,{children:`label`}),`, and `,(0,p.jsx)(t.code,{children:`body`}),`. `,(0,p.jsx)(t.code,{children:`metric`}),` uses tabular numerals by design; `,(0,p.jsx)(t.code,{children:`summary`}),` is a responsive display treatment; `,(0,p.jsx)(t.code,{children:`label`}),` is bold display text.`]}),`
`,(0,p.jsx)(t.h2,{id:`colour-weight-and-alignment`,children:`Colour, weight, and alignment`}),`
`,(0,p.jsxs)(t.p,{children:[`Colours are semantic tokens: `,(0,p.jsx)(t.code,{children:`default`}),`, `,(0,p.jsx)(t.code,{children:`muted`}),`, `,(0,p.jsx)(t.code,{children:`primary`}),`, `,(0,p.jsx)(t.code,{children:`inverse`}),`, `,(0,p.jsx)(t.code,{children:`inverse-muted`}),`, `,(0,p.jsx)(t.code,{children:`success`}),`, `,(0,p.jsx)(t.code,{children:`danger`}),`, `,(0,p.jsx)(t.code,{children:`warning`}),`, and `,(0,p.jsx)(t.code,{children:`info`}),`. Use inverse colours only on a sufficiently dark surface. Colour cannot be the only way information is conveyed.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Weights are `,(0,p.jsx)(t.code,{children:`regular`}),`, `,(0,p.jsx)(t.code,{children:`medium`}),`, `,(0,p.jsx)(t.code,{children:`semibold`}),`, and `,(0,p.jsx)(t.code,{children:`bold`}),`; omitting `,(0,p.jsx)(t.code,{children:`weight`}),` preserves the selected level's canonical weight. `,(0,p.jsx)(t.code,{children:`align="start"`}),` and `,(0,p.jsx)(t.code,{children:`align="end"`}),` are direction-aware. When `,(0,p.jsx)(t.code,{children:`align`}),` is omitted, ordinary CSS inheritance applies.`]}),`
`,(0,p.jsx)(t.h2,{id:`overflow-and-rhythm`,children:`Overflow and rhythm`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`truncate`}),` limits content to one line with an ellipsis. `,(0,p.jsx)(t.code,{children:`lineClamp`}),` limits it to 2, 3, or 4 lines. Both require a constrained available width and hide overflow; ensure the full information is available elsewhere when the omitted text matters.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`gutterBottom`}),` adds canonical level-appropriate bottom rhythm to block content. It is ignored for `,(0,p.jsx)(t.code,{children:`span`}),`, `,(0,p.jsx)(t.code,{children:`strong`}),`, `,(0,p.jsx)(t.code,{children:`em`}),`, and `,(0,p.jsx)(t.code,{children:`small`}),`. Prefer a `,(0,p.jsx)(t.code,{children:`Stack`}),` when spacing between several siblings because it expresses the relationship at the layout level.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`state-accessibility-and-internationalisation`,children:`State, accessibility, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native HTML attributes, including `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, `,(0,p.jsx)(t.code,{children:`data-*`}),`, and event-independent text attributes, are forwarded. The conflicting native `,(0,p.jsx)(t.code,{children:`align`}),`, `,(0,p.jsx)(t.code,{children:`color`}),`, and `,(0,p.jsx)(t.code,{children:`style`}),` attributes are intentionally not public styling contracts.`]}),`
`,(0,p.jsx)(t.p,{children:`Typography has no controlled, uncontrolled, disabled, loading, invalid, or read-only state. Express those states on the owning interactive component and use Typography only for associated explanatory content.`}),`
`,(0,p.jsxs)(t.p,{children:[`It adds no keyboard behaviour. Native semantics come from `,(0,p.jsx)(t.code,{children:`as`}),`, so headings appear in assistive-technology navigation and `,(0,p.jsx)(t.code,{children:`dt`}),`/`,(0,p.jsx)(t.code,{children:`dd`}),` retain description-list meaning. Logical alignment follows the provider direction. Breeze does not transform, translate, or format the children; use the formatting components for locale-aware values.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not select `,(0,p.jsx)(t.code,{children:`as`}),` for appearance. A `,(0,p.jsx)(t.code,{children:`div`}),` styled as `,(0,p.jsx)(t.code,{children:`h2`}),` is not a heading.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`level="label"`}),` as a substitute for a form control's label part.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`danger`}),` colour alone to communicate an error.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not clamp essential copy without another way to access it.`}),`
`,(0,p.jsx)(t.li,{children:`General margins, padding, width, positioning, and arbitrary inline styles are outside the API.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Link`}),` for inline destinations.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`FormattedDateTime`}),`, `,(0,p.jsx)(t.code,{children:`FormattedList`}),`, `,(0,p.jsx)(t.code,{children:`FormattedNumber`}),`, or `,(0,p.jsx)(t.code,{children:`RelativeTime`}),` for locale-aware text values.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Stack`}),` or `,(0,p.jsx)(t.code,{children:`Inline`}),` to arrange multiple text elements.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Badge`}),` for compact status or classification labels, not prose.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};