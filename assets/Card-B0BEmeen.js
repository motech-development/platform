import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Complete as c,n as l,t as u}from"./Card.stories-CVno2WrA.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Semantic compound card for grouping one related content summary with optional heading, body, and footer regions.`}),`
`,(0,p.jsx)(t.h1,{id:`card`,children:`Card`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Card`}),` groups one self-contained content summary in a semantic article.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, Card } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsx)(t.p,{children:`Use a card when a heading, supporting details, and related actions should read as one article.`}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.a,{href:`?path=/docs/layout-surface--docs`,children:`Surface`}),` for visual containment without article semantics, `,(0,p.jsx)(t.a,{href:`?path=/docs/data-display-list--docs`,children:`List`}),` for a sequence, or `,(0,p.jsx)(t.a,{href:`?path=/docs/collections-gridlist--docs`,children:`GridList`}),` when items are selectable or actionable.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Do not turn an entire card into an improvised clickable container. Put a `,(0,p.jsx)(t.code,{children:`Link`}),`, `,(0,p.jsx)(t.code,{children:`LinkButton`}),`, or `,(0,p.jsx)(t.code,{children:`Button`}),` in the appropriate region, and preserve independent semantics for every action.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, Card, LinkButton } from '@motech-development/breeze-ui';

interface SummaryCardProps {
  onDismiss: () => void;
}

export function SummaryCard({ onDismiss }: SummaryCardProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Release summary</Card.Title>
        <Card.Description>Updated a few moments ago</Card.Description>
      </Card.Header>
      <Card.Body>Three changes are ready for review.</Card.Body>
      <Card.Footer>
        <LinkButton href="/releases/current">Open details</LinkButton>
        <Button variant="secondary" onAction={onDismiss}>
          Dismiss
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Card.Root`}),` renders the required semantic `,(0,p.jsx)(t.code,{children:`article`}),` container.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Card.Header`}),` renders a `,(0,p.jsx)(t.code,{children:`header`}),` for the title and optional description or controls.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Card.Title`}),` renders the canonical `,(0,p.jsx)(t.code,{children:`h3`}),` heading.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Card.Description`}),` renders supporting title context as a paragraph.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Card.Body`}),` renders the primary content `,(0,p.jsx)(t.code,{children:`div`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`Card.Footer`}),` renders a `,(0,p.jsx)(t.code,{children:`footer`}),` for actions or supporting metadata.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Header`}),`, `,(0,p.jsx)(t.code,{children:`Description`}),`, `,(0,p.jsx)(t.code,{children:`Body`}),`, and `,(0,p.jsx)(t.code,{children:`Footer`}),` are optional. Keep the remaining parts in the order above. A body-only card is valid.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-behaviour`,children:`Accessibility and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Cards add no keyboard interaction, selection, loading, disabled, invalid, or error state. Interactive descendants retain their own keyboard behaviour. Ensure heading levels remain logical in the surrounding page: `,(0,p.jsx)(t.code,{children:`Card.Title`}),` is always `,(0,p.jsx)(t.code,{children:`h3`}),`, so use a different semantic composition when that level is wrong. Translate all application-owned text; logical spacing supports left-to-right and right-to-left direction.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Every part supports the relevant native element attributes, including `,(0,p.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,p.jsx)(t.code,{children:`ref`}),`; inline `,(0,p.jsx)(t.code,{children:`style`}),` is intentionally excluded.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not omit a useful visible title merely to simplify the surface.`}),`
`,(0,p.jsx)(t.li,{children:`Do not nest unrelated subjects in one card.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not put footer actions outside `,(0,p.jsx)(t.code,{children:`Card.Footer`}),` when they belong to the article.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not rely on colour or the border alone to communicate state.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.a,{href:`?path=/docs/layout-surface--docs`,children:`Surface`}),` provides non-semantic containment. `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-data-metriccard--docs`,children:`MetricCard`}),` presents a named measurement. `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-alert--docs`,children:`Alert`}),` communicates persistent feedback.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};