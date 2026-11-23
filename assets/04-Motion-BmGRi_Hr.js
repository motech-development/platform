import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,s as i}from"./blocks-D60bq-E9.js";import{t as a}from"./mdx-react-shim-y1jXGhTh.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/04 Motion`,summary:`Opt in to typed browser view transitions around committed application updates.`}),`
`,(0,c.jsx)(t.h1,{id:`motion`,children:`Motion`}),`
`,(0,c.jsx)(t.p,{children:`Breeze UI provides an opt-in helper for the browser's same-document View Transition API. Use a transition when it helps people follow how one state relates to the next.`}),`
`,(0,c.jsxs)(t.p,{children:[`Links do not animate on their own. Your router performs the route update and can wrap it in `,(0,c.jsx)(t.code,{children:`startViewTransition`}),` to animate it. The examples use stable React 19 and React DOM APIs, and no extra dependency is needed.`]}),`
`,(0,c.jsx)(t.h2,{id:`transition-types`,children:`Transition types`}),`
`,(0,c.jsx)(t.p,{children:`Choose the type that describes the change:`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Type`}),(0,c.jsx)(t.th,{children:`Use it for`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`nav`})}),(0,c.jsx)(t.td,{children:`Moving between sibling routes in the same application.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`mode`})}),(0,c.jsx)(t.td,{children:`Replacing a loading skeleton with its content.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`list`})}),(0,c.jsx)(t.td,{children:`Rearranging or filtering a collection of items.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`item`})}),(0,c.jsx)(t.td,{children:`Changing one item while the surrounding page stays in place.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`expand`})}),(0,c.jsx)(t.td,{children:`Expanding one item into a larger view of that same item.`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`The type decides which parts of the page can move. `,(0,c.jsx)(t.code,{children:`nav`}),` and `,(0,c.jsx)(t.code,{children:`mode`}),` may transition the whole page; `,(0,c.jsx)(t.code,{children:`list`}),`, `,(0,c.jsx)(t.code,{children:`item`}),` and `,(0,c.jsx)(t.code,{children:`expand`}),` leave the page in place and animate only the named participants.`]}),`
`,(0,c.jsx)(t.p,{children:`Some updates should stay immediate:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`appearance changes, segmented-control state, typing and in-place recalculation, so input and the caret stay stable;`}),`
`,(0,c.jsx)(t.li,{children:`form steps inside a sheet, where the sheet stays in place and the step indicator already shows progress.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`declare-a-participant`,children:`Declare a participant`}),`
`,(0,c.jsxs)(t.p,{children:[`Call `,(0,c.jsx)(t.code,{children:`useViewTransitionParticipant`}),` below `,(0,c.jsx)(t.code,{children:`BreezeProvider`}),` and attach its ref to the element that represents the same thing before and after the update. The element takes part only while one of its `,(0,c.jsx)(t.code,{children:`types`}),` is active.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useViewTransitionParticipant } from '@motech-development/breeze-ui';

function TransactionRow({ transaction }) {
  const rowRef = useViewTransitionParticipant({
    name: \`transaction-\${transaction.id}\`,
    types: ['list'],
  });

  return <li ref={rowRef}>{transaction.name}</li>;
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Each `,(0,c.jsx)(t.code,{children:`name`}),` must start with a letter (A–Z or a–z) or an underscore, followed by letters, digits, underscores or hyphens. These names are reserved, in any letter case: `,(0,c.jsx)(t.code,{children:`auto`}),`, `,(0,c.jsx)(t.code,{children:`default`}),`, `,(0,c.jsx)(t.code,{children:`inherit`}),`, `,(0,c.jsx)(t.code,{children:`initial`}),`, `,(0,c.jsx)(t.code,{children:`none`}),`, `,(0,c.jsx)(t.code,{children:`revert`}),`, `,(0,c.jsx)(t.code,{children:`revert-layer`}),`, `,(0,c.jsx)(t.code,{children:`unset`}),`, `,(0,c.jsx)(t.code,{children:`root`}),`, `,(0,c.jsx)(t.code,{children:`match-element`}),`, `,(0,c.jsx)(t.code,{children:`breeze-botnav`}),`, `,(0,c.jsx)(t.code,{children:`breeze-navmark`}),`, `,(0,c.jsx)(t.code,{children:`breeze-topbar`}),` and `,(0,c.jsx)(t.code,{children:`breeze-topnav`}),`. An invalid or reserved name throws a `,(0,c.jsx)(t.code,{children:`TypeError`}),`.`]}),`
`,(0,c.jsxs)(t.p,{children:[`Each `,(0,c.jsx)(t.code,{children:`name`}),` must also be unique among the visible participants before and after the update. In development, Breeze UI logs a console error for duplicate names.`]}),`
`,(0,c.jsx)(t.p,{children:`While a dialog, drawer, menu or popover is open on top of the page, participants beneath it do not animate. A participant inside an overlay animates only when that overlay is the topmost one. A menu or popover stops counting as soon as it starts closing, so a navigation started from a menu item still animates the page; a closing dialog or drawer blocks transitions until its exit animation finishes.`}),`
`,(0,c.jsx)(t.h3,{id:`application-shell-roles`,children:`Application shell roles`}),`
`,(0,c.jsxs)(t.p,{children:[`Instead of a `,(0,c.jsx)(t.code,{children:`name`}),`, pass one of the reserved roles for your application's chrome:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useViewTransitionParticipant } from '@motech-development/breeze-ui';

function TopBar() {
  const topbarRef = useViewTransitionParticipant({ role: 'topbar' });

  return <header ref={topbarRef}>Account</header>;
}
`})}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Role`}),(0,c.jsx)(t.th,{children:`Behaviour`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`topbar`})}),(0,c.jsxs)(t.td,{children:[`Stays pinned during `,(0,c.jsx)(t.code,{children:`nav`}),` and `,(0,c.jsx)(t.code,{children:`mode`}),` transitions.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`topnav`})}),(0,c.jsxs)(t.td,{children:[`Stays pinned during `,(0,c.jsx)(t.code,{children:`nav`}),` and `,(0,c.jsx)(t.code,{children:`mode`}),` transitions.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`botnav`})}),(0,c.jsxs)(t.td,{children:[`Stays pinned during `,(0,c.jsx)(t.code,{children:`nav`}),` and `,(0,c.jsx)(t.code,{children:`mode`}),` transitions.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`navmark`})}),(0,c.jsxs)(t.td,{children:[`Marks the current location and moves during `,(0,c.jsx)(t.code,{children:`nav`}),` transitions.`]})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Use each role on at most one visible element at a time. `,(0,c.jsx)(t.code,{children:`ApplicationShell`}),` already uses all four.`]}),`
`,(0,c.jsx)(t.h2,{id:`start-a-router-transition`,children:`Start a router transition`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`Link`}),` passes its `,(0,c.jsx)(t.code,{children:`transitionTypes`}),` to the `,(0,c.jsx)(t.code,{children:`router.navigate`}),` callback configured on `,(0,c.jsx)(t.code,{children:`BreezeProvider`}),`. Wrap the router's route update in `,(0,c.jsx)(t.code,{children:`startViewTransition`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useState } from 'react';
import { flushSync } from 'react-dom';
import {
  BreezeProvider,
  Link,
  startViewTransition,
  type RouterNavigationOptions,
} from '@motech-development/breeze-ui';

function AppRouter() {
  const [path, setPath] = useState('/');
  const navigate = (
    href: string,
    { transitionTypes }: RouterNavigationOptions,
  ) =>
    startViewTransition(() => {
      flushSync(() => setPath(href));
    }, transitionTypes);

  return (
    <BreezeProvider locale="en-GB" router={{ navigate }}>
      <nav>
        <Link href="/" transitionTypes={['nav']}>
          Home
        </Link>
        <Link href="/transactions" transitionTypes={['nav', 'list']}>
          Transactions
        </Link>
      </nav>
      <main>{path === '/' ? <HomePage /> : <TransactionsPage />}</main>
    </BreezeProvider>
  );
}

function HomePage() {
  return <p>Home</p>;
}

function TransactionsPage() {
  return <p>Transactions</p>;
}
`})}),`
`,(0,c.jsx)(t.p,{children:`The update callback must not settle until the new page is in the DOM:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`For a synchronous React state update, wrap it in `,(0,c.jsx)(t.code,{children:`flushSync`}),`, as above.`]}),`
`,(0,c.jsx)(t.li,{children:`For asynchronous routing, wait for the router to signal that the new route has rendered. Finishing a data fetch or scheduling a state update is not enough.`}),`
`,(0,c.jsx)(t.li,{children:`If the destination suspends, make sure the callback does not settle while a fallback is still showing.`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`startViewTransition`}),` returns a promise that resolves when the update completes and rejects if the update fails. The update still runs, without animation, when the type list is empty, the browser does not support typed view transitions, or the person prefers reduced motion. If a transition is already running, it is skipped before the next one starts.`]}),`
`,(0,c.jsx)(t.h2,{id:`overlays-and-toasts`,children:`Overlays and toasts`}),`
`,(0,c.jsxs)(t.p,{children:[`Dialogs, drawers, menus, popovers and toasts have their own open and close animations. Do not wrap their opening or closing in `,(0,c.jsx)(t.code,{children:`startViewTransition`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`browser-reference`,children:`Browser reference`}),`
`,(0,c.jsxs)(t.p,{children:[`Read `,(0,c.jsx)(t.a,{href:`https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition`,rel:`nofollow`,children:`Document.startViewTransition()`}),` and `,(0,c.jsx)(t.a,{href:`https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using_types`,rel:`nofollow`,children:`Using view transition types`}),` for the browser API.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};