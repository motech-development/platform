import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{ActionsAndBack as c,n as l,t as u}from"./PageHeader.stories-BdpTlHIz.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Responsive page-level header combining the unique page heading, concise context, optional back destination, and application actions.`}),`
`,(0,p.jsx)(t.h1,{id:`pageheader`,children:`PageHeader`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`PageHeader`}),` establishes page hierarchy with one `,(0,p.jsx)(t.code,{children:`h1`}),`, optional supporting context, back navigation, and responsive page actions.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  Button,
  ButtonGroup,
  Link,
  PageHeader,
} from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it once near the start of a page's main content. Use `,(0,p.jsx)(t.code,{children:`SectionHeader`}),` for an `,(0,p.jsx)(t.code,{children:`h2`}),` within the page, `,(0,p.jsx)(t.code,{children:`Typography`}),` for an ordinary heading without page-header composition, and `,(0,p.jsx)(t.code,{children:`Breadcrumbs`}),` instead of a single back destination when the full hierarchy matters.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  Button,
  ButtonGroup,
  Link,
  PageHeader,
} from '@motech-development/breeze-ui';

<PageHeader
  actions={
    <ButtonGroup
      aria-label="Project actions"
      orientation={{ base: 'verticalReverse', sm: 'horizontal' }}
    >
      <Button appearance="outline">View archived</Button>
      <Button>Create project</Button>
    </ButtonGroup>
  }
  back={<Link href="/projects">Back to projects</Link>}
  description="Review and manage active projects."
  title="Projects"
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-responsive-behaviour`,children:`Anatomy and responsive behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`The semantic `,(0,p.jsx)(t.code,{children:`header`}),` contains a title column and an optional actions region. `,(0,p.jsx)(t.code,{children:`back`}),` appears before the title and remains content-sized. `,(0,p.jsx)(t.code,{children:`title`}),` is always the page's `,(0,p.jsx)(t.code,{children:`h1`}),`; `,(0,p.jsx)(t.code,{children:`description`}),` sits directly beneath it. Actions stack below the title area until the wide `,(0,p.jsx)(t.code,{children:`lg`}),` two-column layout, stretch on compact screens, become content-sized from `,(0,p.jsx)(t.code,{children:`sm`}),`, and align to the end at `,(0,p.jsx)(t.code,{children:`lg`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The slot does not reorder action DOM nodes. Use `,(0,p.jsx)(t.code,{children:`ButtonGroup`}),` responsive orientation when primary action priority should change visually while DOM and keyboard order remain stable. Keep actions short and directly related to the page.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-state-and-routing`,children:`Accessibility, state, and routing`}),`
`,(0,p.jsxs)(t.p,{children:[`Use one `,(0,p.jsx)(t.code,{children:`PageHeader`}),` per page and avoid another `,(0,p.jsx)(t.code,{children:`h1`}),` unless the surrounding document genuinely requires it. The generated `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),` names the header from its visible title. Supply a real `,(0,p.jsx)(t.code,{children:`Link`}),` in `,(0,p.jsx)(t.code,{children:`back`}),`; local URLs use the provider router adapter, while external and native link behaviours stay native. Do not make a back control call `,(0,p.jsx)(t.code,{children:`history.back()`}),` when a stable parent destination is available.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The pattern itself is non-interactive and adds no keyboard behaviour. Back links and action controls retain their documented focus and activation behaviour. It has no controlled, uncontrolled, read-only, disabled, loading, invalid, empty, or error state: express those states in the slotted actions or page content. A loading action should use `,(0,p.jsx)(t.code,{children:`Button loading`}),`; a page-level failure usually belongs in `,(0,p.jsx)(t.code,{children:`StatePanel`}),` or `,(0,p.jsx)(t.code,{children:`Alert`}),`, not in `,(0,p.jsx)(t.code,{children:`description`}),` alone.`]}),`
`,(0,p.jsx)(t.p,{children:`Translate all slot content. Layout uses logical alignment and works in both directions; application-authored arrows should either use direction-aware copy/icons or be omitted in favour of a meaningful link label.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use it for every card or section, place unrelated global controls in `,(0,p.jsx)(t.code,{children:`actions`}),`, put a button where `,(0,p.jsx)(t.code,{children:`back`}),` should be a destination, or rely on a long description for essential error feedback. Related components: `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-page-structure-sectionheader--docs`,children:`SectionHeader`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-actions-buttongroup--docs`,children:`ButtonGroup`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/navigation-breadcrumbs--docs`,children:`Breadcrumbs`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-application-shell-applicationshell--docs`,children:`ApplicationShell`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};