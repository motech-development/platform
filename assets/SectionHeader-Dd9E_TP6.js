import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{WithAction as c,n as l,t as u}from"./SectionHeader.stories-kt-QcBFP.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Compact content-section header with a fixed level-two heading, supporting description, and one directly related action.`}),`
`,(0,p.jsx)(t.h1,{id:`sectionheader`,children:`SectionHeader`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`SectionHeader`}),` aligns a section's `,(0,p.jsx)(t.code,{children:`h2`}),`, concise supporting context, and one related action.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, SectionHeader } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it at the start of a major region within a page when a visible boundary and one action clarify the section. Use `,(0,p.jsx)(t.code,{children:`PageHeader`}),` for the page's `,(0,p.jsx)(t.code,{children:`h1`}),` and page-level actions, `,(0,p.jsx)(t.code,{children:`Card.Header`}),` for content inside a card, or `,(0,p.jsx)(t.code,{children:`Typography`}),` when only a heading is needed.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, SectionHeader } from '@motech-development/breeze-ui';

<section aria-labelledby="recent-updates-heading">
  <SectionHeader
    action={<Button appearance="ghost">View all updates</Button>}
    description="Latest changes across the workspace"
    id="recent-updates-heading"
    title="Recent updates"
  />
  {/* Section content */}
</section>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`structure-and-composition`,children:`Structure and composition`}),`
`,(0,p.jsxs)(t.p,{children:[`The pattern renders a semantic `,(0,p.jsx)(t.code,{children:`header`}),`, a fixed `,(0,p.jsx)(t.code,{children:`h2`}),`, an optional paragraph, and an optional action wrapper. `,(0,p.jsx)(t.code,{children:`id`}),` is assigned to the `,(0,p.jsx)(t.code,{children:`h2`}),`, not to the root header, so a surrounding region can reference it with `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The action does not wrap and the title column shrinks. Prefer one concise low-emphasis control. Use `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` or a page-level action area when several controls are necessary, and test translated copy at compact widths.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-state-and-internationalisation`,children:`Accessibility, state, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[`Keep the document outline logical: because the title is always `,(0,p.jsx)(t.code,{children:`h2`}),`, use another composition when the region requires a deeper heading level. The visible title should identify the following region; provide a unique `,(0,p.jsx)(t.code,{children:`id`}),` when another element references it. The optional action must have its own accessible name and must make sense in relation to this section.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`SectionHeader`}),` adds no keyboard interaction. The slotted action retains its own focus, disabled, loading, and activation semantics. The pattern has no controlled, uncontrolled, read-only, invalid, empty, loading, or error state; present content states below it, or use `,(0,p.jsx)(t.code,{children:`StatePanel`}),` when the entire region is replaced.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Translate `,(0,p.jsx)(t.code,{children:`title`}),`, `,(0,p.jsx)(t.code,{children:`description`}),`, and action copy. Logical flex alignment supports left-to-right and right-to-left direction without reversing application-owned content order.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use it as the page `,(0,p.jsx)(t.code,{children:`h1`}),`, assign its `,(0,p.jsx)(t.code,{children:`id`}),` expecting the root header to receive it, fit a toolbar into the single-action slot, or let action text obscure the heading at narrow widths. Related components: `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-page-structure-pageheader--docs`,children:`PageHeader`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/data-display-card--docs`,children:`Card`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/foundation-typography--docs`,children:`Typography`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};