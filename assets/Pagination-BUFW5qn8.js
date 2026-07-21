import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{ManyPages as c,n as l,t as u}from"./Pagination.stories-7gS7qcGX.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Controlled, one-based pagination across a known page count with localised controls, boundaries, and compact ellipses.`}),`
`,(0,p.jsx)(t.h1,{id:`pagination`,children:`Pagination`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Pagination`}),` requests movement through a known, one-based page range while the application owns data and route state.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Pagination } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it when a result set has a stable, known `,(0,p.jsx)(t.code,{children:`pageCount`}),` and direct page access is useful.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use it for an unknown total, continuous scrolling, or collections where retaining nearby items is more useful than moving between discrete pages. Prefer an application-owned “Load more” action when the total is unknown, or the virtualisation support in `,(0,p.jsx)(t.code,{children:`Table`}),`, `,(0,p.jsx)(t.code,{children:`GridList`}),`, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` for large scrolling collections.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Pagination } from '@motech-development/breeze-ui';

<Pagination
  aria-label="Search result pages"
  currentPage={4}
  onChange={(page) => {
    setPage(page);
    loadResults({ page });
  }}
  pageCount={12}
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`state-values-and-callbacks`,children:`State, values, and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[`Pagination is controlled. `,(0,p.jsx)(t.code,{children:`currentPage`}),` and every value passed to `,(0,p.jsx)(t.code,{children:`onChange(page)`}),` are one-based positive integers. The callback reports the requested page and receives no DOM event; update route and data state, then pass the resulting `,(0,p.jsx)(t.code,{children:`currentPage`}),` back. There is no uncontrolled `,(0,p.jsx)(t.code,{children:`defaultCurrentPage`}),` or read-only state.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`pageCount`}),` must be a positive integer. `,(0,p.jsx)(t.code,{children:`currentPage`}),` must be an integer from `,(0,p.jsx)(t.code,{children:`1`}),` through `,(0,p.jsx)(t.code,{children:`pageCount`}),`, inclusive. Invalid values throw `,(0,p.jsx)(t.code,{children:`RangeError`}),` during rendering instead of being clamped. Long ranges always keep first, last, current, and adjacent pages available, with non-interactive ellipses for gaps. The current page is a non-interactive element with `,(0,p.jsx)(t.code,{children:`aria-current="page"`}),`, so selecting it cannot trigger a redundant request.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` defaults to `,(0,p.jsx)(t.code,{children:`false`}),` and prevents all page-change controls. Previous and next are also disabled at their respective boundaries. Disabling does not change or hide the current page.`]}),`
`,(0,p.jsx)(t.h2,{id:`data-errors-and-routing`,children:`Data, errors, and routing`}),`
`,(0,p.jsxs)(t.p,{children:[`The application owns fetching, cancellation, caching, URLs, scroll restoration, focus after navigation, loading, empty results, and errors. Keep the previous page visible while a request is pending and set `,(0,p.jsx)(t.code,{children:`disabled`}),`, or replace the results with suitable progress feedback. Do not change `,(0,p.jsx)(t.code,{children:`currentPage`}),` to an invalid value when a result count shrinks; resolve the valid page in application state first.`]}),`
`,(0,p.jsx)(t.p,{children:`Pagination renders buttons, not links, and does not call the router adapter. When every page needs a crawlable or open-in-new-tab URL, compose an application-specific navigation solution from public link primitives.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-internationalisation`,children:`Accessibility, keyboard, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[`The required `,(0,p.jsx)(t.code,{children:`aria-label`}),` distinguishes this `,(0,p.jsx)(t.code,{children:`nav`}),` landmark from primary navigation. The current page receives the provider's localised `,(0,p.jsx)(t.code,{children:`page`}),` label; directional buttons use `,(0,p.jsx)(t.code,{children:`previousPage`}),` and `,(0,p.jsx)(t.code,{children:`nextPage`}),`. Override those messages through `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` when localising the application.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Controls follow normal button keyboard behaviour: `,(0,p.jsx)(t.code,{children:`Tab`}),` visits enabled buttons and `,(0,p.jsx)(t.code,{children:`Enter`}),` or `,(0,p.jsx)(t.code,{children:`Space`}),` activates them. There is no roving focus or arrow-key page selection. Ellipses are hidden from assistive technology. In right-to-left direction, previous and next arrow icons reverse while callback values remain numerically unchanged.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass zero-based indexes, set `,(0,p.jsx)(t.code,{children:`pageCount`}),` to zero for empty results, treat the callback as a DOM event, use pagination for an unknown total, or announce every pending request by replacing the landmark. Related components: `,(0,p.jsx)(t.a,{href:`?path=/docs/data-display-table--docs`,children:`Table`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/collections-gridlist--docs`,children:`GridList`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-progressbar--docs`,children:`ProgressBar`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};