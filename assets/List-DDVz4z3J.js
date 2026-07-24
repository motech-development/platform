import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{OrderedAndUnordered as c,n as l,t as u}from"./List.stories-B1fINwSB.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Native ordered or unordered content list with deliberately non-interactive semantics.`}),`
`,(0,p.jsx)(t.h1,{id:`list`,children:`List`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`List`}),` presents related text or content using native ordered or unordered list semantics.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { List } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`List`}),` for prose-like groups where order either does or does not matter.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.a,{href:`?path=/docs/data-display-descriptionlist--docs`,children:`DescriptionList`}),` for term-value metadata, `,(0,p.jsx)(t.a,{href:`?path=/docs/collections-listbox--docs`,children:`ListBox`}),` for option selection, or `,(0,p.jsx)(t.a,{href:`?path=/docs/collections-gridlist--docs`,children:`GridList`}),` for selectable rows with richer content.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { List } from '@motech-development/breeze-ui';

export function ReviewSteps() {
  return (
    <List.Root ordered>
      <List.Item>Prepare the changes</List.Item>
      <List.Item>Review the summary</List.Item>
      <List.Item>Publish the release</List.Item>
    </List.Root>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-semantics`,children:`Anatomy and semantics`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`List.Root`}),` renders `,(0,p.jsx)(t.code,{children:`ul`}),` by default and `,(0,p.jsx)(t.code,{children:`ol`}),` when `,(0,p.jsx)(t.code,{children:`ordered`}),` is `,(0,p.jsx)(t.code,{children:`true`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`List.Item`}),` renders one native `,(0,p.jsx)(t.code,{children:`li`}),`.`]}),`
`]}),`
`,(0,p.jsx)(t.p,{children:`List owns no selection, action, focus-management, loading, disabled, invalid, empty, or error behaviour.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-keyboard-behaviour`,children:`Accessibility and keyboard behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`List.Item`}),` children directly inside `,(0,p.jsx)(t.code,{children:`List.Root`}),` so native list semantics remain intact. The component has no special keyboard interaction. Native list semantics work in both directions; translate visible content and choose `,(0,p.jsx)(t.code,{children:`ordered`}),` only when sequence is meaningful.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Both parts support the relevant native list attributes, including `,(0,p.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,p.jsx)(t.code,{children:`ref`}),`; inline `,(0,p.jsx)(t.code,{children:`style`}),` is intentionally excluded.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`ordered`}),` only to obtain number markers when order is irrelevant.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not use list items as buttons without rendering a real interactive control inside them.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`List`}),` as a selectable collection; it deliberately has no collection value format or callbacks.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.a,{href:`?path=/docs/data-display-descriptionlist--docs`,children:`DescriptionList`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/collections-gridlist--docs`,children:`GridList`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/primitives-navigation-navigationlist--docs`,children:`NavigationList`}),` cover metadata, interactive rows, and navigation respectively.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};