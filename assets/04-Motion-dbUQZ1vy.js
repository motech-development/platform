import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,s as i}from"./blocks-BAOfLV0X.js";import{t as a}from"./mdx-react-shim-y1jXGhTh.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/04 Motion`,summary:`Opt in to typed browser view transitions around committed application updates.`}),`
`,(0,c.jsx)(t.h1,{id:`motion`,children:`Motion`}),`
`,(0,c.jsxs)(t.p,{children:[`Breeze provides a small opt-in adapter for the browser's same-document View Transition API. Use it when a transition explains a relationship between two states. A link does not start an animation by itself: the application router owns the route update and may opt into a transition with `,(0,c.jsx)(t.code,{children:`startViewTransition`}),`.`]}),`
`,(0,c.jsx)(t.p,{children:`These examples use stable React 19 and React DOM APIs. Breeze adds no runtime dependency for view transitions.`}),`
`,(0,c.jsx)(t.h2,{id:`transition-types`,children:`Transition types`}),`
`,(0,c.jsx)(t.p,{children:`Use the type that describes the change. Breeze accepts these five values:`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Type`}),(0,c.jsx)(t.th,{children:`Use it for`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`nav`})}),(0,c.jsx)(t.td,{children:`Moving between sibling routes in the same application.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`mode`})}),(0,c.jsx)(t.td,{children:`Replacing a loading skeleton with its content.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`list`})}),(0,c.jsx)(t.td,{children:`Rearranging or filtering a collection of items.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`item`})}),(0,c.jsx)(t.td,{children:`Changing one item while the surrounding page stays in place.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`expand`})}),(0,c.jsx)(t.td,{children:`Expanding one item into a larger view of that same item.`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`These types let the stylesheet choose which parts can move. `,(0,c.jsx)(t.code,{children:`nav`}),` and `,(0,c.jsx)(t.code,{children:`mode`}),` may transition the page root; `,(0,c.jsx)(t.code,{children:`list`}),`, `,(0,c.jsx)(t.code,{children:`item`}),` and `,(0,c.jsx)(t.code,{children:`expand`}),` keep the root live and animate only named participants. Breeze does not prescribe an animation for every use of a type.`]}),`
`,(0,c.jsx)(t.p,{children:`Keep appearance changes, segmented-control state, typing and in-place recalculation immediate; transitions add no useful relationship to those updates, and immediate input keeps the caret stable. Keep form steps inside a sheet immediate too: the sheet frame stays in place, a nested transition would separate its contents from the frame, and the step indicator already shows progress.`}),`
`,(0,c.jsx)(t.h2,{id:`declare-a-participant`,children:`Declare a participant`}),`
`,(0,c.jsxs)(t.p,{children:[`Call `,(0,c.jsx)(t.code,{children:`useViewTransitionParticipant`}),` below `,(0,c.jsx)(t.code,{children:`BreezeProvider`}),` and attach its ref to the element that represents the same thing before and after the update. Breeze grants its view-transition name only while one of the declared types is active.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useViewTransitionParticipant } from '@motech-development/breeze-ui';

function TransactionRow({ transaction }) {
  const rowRef = useViewTransitionParticipant({
    name: \`transaction-\${transaction.id}\`,
    types: ['list'],
  });

  return <li ref={rowRef}>{transaction.name}</li>;
}
`})}),`
`,(0,c.jsx)(t.p,{children:`Each participant name must be a valid CSS custom identifier and unique among visible participants in both snapshots. In development, Breeze reports duplicate eligible names. Names stay disabled for page participants while a visual overlay is on top; if an application-owned participant is inside an overlay, only the topmost visual overlay can enable it.`}),`
`,(0,c.jsxs)(t.p,{children:[`The application shell can use Breeze's reserved roles for its chrome and current-location marker. The `,(0,c.jsx)(t.code,{children:`topbar`}),`, `,(0,c.jsx)(t.code,{children:`topnav`}),` and `,(0,c.jsx)(t.code,{children:`botnav`}),` roles stay pinned during page transitions:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { useViewTransitionParticipant } from '@motech-development/breeze-ui';

function TopBar() {
  const topbarRef = useViewTransitionParticipant({ role: 'topbar' });

  return <header ref={topbarRef}>Account</header>;
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[`The fixed roles are `,(0,c.jsx)(t.code,{children:`topbar`}),`, `,(0,c.jsx)(t.code,{children:`topnav`}),`, `,(0,c.jsx)(t.code,{children:`botnav`}),` and `,(0,c.jsx)(t.code,{children:`navmark`}),`. The first three are enabled for `,(0,c.jsx)(t.code,{children:`nav`}),` and `,(0,c.jsx)(t.code,{children:`mode`}),`; `,(0,c.jsx)(t.code,{children:`navmark`}),` marks the current location and moves during `,(0,c.jsx)(t.code,{children:`nav`}),` only. These roles reserve Breeze's singleton names, so use each role on at most one visible element in a snapshot.`]}),`
`,(0,c.jsx)(t.h2,{id:`start-a-router-transition`,children:`Start a router transition`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`Link`}),` passes its `,(0,c.jsx)(t.code,{children:`transitionTypes`}),` to the configured `,(0,c.jsx)(t.code,{children:`router.navigate`}),` callback. The router can wrap its real route update with `,(0,c.jsx)(t.code,{children:`startViewTransition`}),`:`]}),`
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
`,(0,c.jsxs)(t.p,{children:[`The router must make the update callback cover the actual DOM commit. For a synchronous React state update, `,(0,c.jsx)(t.code,{children:`flushSync`}),` commits it before the callback returns. For asynchronous routing, await the router's commit-ready signal and resolve only after the intended DOM has committed; data-fetch completion or scheduling a state update is not enough. If the destination suspends, coordinate with the router so the callback does not settle while the UI is still showing a fallback instead of the intended route.`]}),`
`,(0,c.jsx)(t.p,{children:`An empty type list, an unsupported typed View Transition API, or a reduced-motion preference skips the animation and still runs the update. The helper returns a promise for update completion and propagates failures from the update. If a transition is already active, Breeze skips it before starting the next one.`}),`
`,(0,c.jsx)(t.h2,{id:`overlay-lifecycle`,children:`Overlay lifecycle`}),`
`,(0,c.jsxs)(t.p,{children:[`Dialogs, drawers, menus and popovers keep their React Aria Components lifecycle and existing overlay motion. Toast confirmations keep their own lifecycle and existing motion. Do not use `,(0,c.jsx)(t.code,{children:`startViewTransition`}),` for an overlay or confirmation opening or closing.`]}),`
`,(0,c.jsx)(t.h2,{id:`browser-reference`,children:`Browser reference`}),`
`,(0,c.jsxs)(t.p,{children:[`Read `,(0,c.jsx)(t.a,{href:`https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition`,rel:`nofollow`,children:`Document.startViewTransition()`}),` and `,(0,c.jsx)(t.a,{href:`https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using_types`,rel:`nofollow`,children:`Using view transition types`}),` for the browser API.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};