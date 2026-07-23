import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{ResponsivePairs as c,n as l,t as u}from"./DescriptionList.stories-DLPvY2UM.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Responsive native description list for presenting labelled term-and-description metadata.`}),`
`,(0,p.jsx)(t.h1,{id:`descriptionlist`,children:`DescriptionList`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`DescriptionList`}),` pairs terms with their descriptions using native `,(0,p.jsx)(t.code,{children:`dl`}),`, `,(0,p.jsx)(t.code,{children:`dt`}),`, and `,(0,p.jsx)(t.code,{children:`dd`}),` semantics.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DescriptionList } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for read-only facts, attributes, or summary metadata. Use `,(0,p.jsx)(t.a,{href:`?path=/docs/data-display-list--docs`,children:`List`}),` for a sequence, `,(0,p.jsx)(t.a,{href:`?path=/docs/collections-table--docs`,children:`Table`}),` for multiple comparable records, or form components when values are editable.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { DescriptionList } from '@motech-development/breeze-ui';

export function RecordDetails() {
  return (
    <DescriptionList.Root>
      <DescriptionList.Item>
        <DescriptionList.Term>Status</DescriptionList.Term>
        <DescriptionList.Description>Ready</DescriptionList.Description>
      </DescriptionList.Item>
      <DescriptionList.Item>
        <DescriptionList.Term>Reference</DescriptionList.Term>
        <DescriptionList.Description>AB-123</DescriptionList.Description>
      </DescriptionList.Item>
    </DescriptionList.Root>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`DescriptionList.Root`}),` renders the native `,(0,p.jsx)(t.code,{children:`dl`}),` and stacks at narrow widths.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`DescriptionList.Item`}),` renders a visual grouping `,(0,p.jsx)(t.code,{children:`div`}),` for one or more pairs.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`DescriptionList.Term`}),` renders `,(0,p.jsx)(t.code,{children:`dt`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`DescriptionList.Description`}),` renders `,(0,p.jsx)(t.code,{children:`dd`}),` associated with the preceding term.`]}),`
`]}),`
`,(0,p.jsx)(t.p,{children:`Keep each term next to its description. Multiple descriptions may follow a term, and multiple terms may precede one description where that is genuinely the semantic relationship.`}),`
`,(0,p.jsx)(t.h2,{id:`behaviour-and-accessibility`,children:`Behaviour and accessibility`}),`
`,(0,p.jsx)(t.p,{children:`The component is read-only and non-interactive: it has no controlled state, callbacks, keyboard behaviour, loading, disabled, invalid, empty, or error state. Translate both terms and descriptions. Logical spacing and the responsive grid support both left-to-right and right-to-left layouts. Format dates and numbers before passing them as content.`}),`
`,(0,p.jsxs)(t.p,{children:[`Every part supports the relevant native semantic-element attributes, including `,(0,p.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,p.jsx)(t.code,{children:`ref`}),`; inline `,(0,p.jsx)(t.code,{children:`style`}),` is intentionally excluded.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not reproduce the relationship with generic `,(0,p.jsx)(t.code,{children:`div`}),` elements.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not use terms as visual headings for unrelated sections.`}),`
`,(0,p.jsx)(t.li,{children:`Do not place editable controls here when a labelled form is required.`}),`
`,(0,p.jsx)(t.li,{children:`Do not force columns with custom layout; the built-in layout adapts at the Breeze breakpoint.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.a,{href:`?path=/docs/data-display-list--docs`,children:`List`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/collections-table--docs`,children:`Table`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/data-display-card--docs`,children:`Card`}),` cover sequences, comparable records, and contained summaries.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};