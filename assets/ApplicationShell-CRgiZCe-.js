import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,OverflowingNavigation as l,n as u,t as d}from"./ApplicationShell.stories-KaMjCcl1.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Provides responsive application chrome, section navigation and a fixed mobile action.`}),`
`,(0,m.jsx)(t.h1,{id:`applicationshell`,children:`ApplicationShell`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ApplicationShell`}),` is the frame around an application's pages. It renders a top bar, section navigation, a skip link and the main landmark, and adapts its navigation between desktop and mobile layouts.`]}),`
`,(0,m.jsx)(a,{layout:`fullscreen`,of:c,story:{height:`844px`,inline:!1}}),`
`,(0,m.jsx)(t.h2,{id:`navigation-items`,children:`Navigation items`}),`
`,(0,m.jsxs)(t.p,{children:[`Pass your navigation data as `,(0,m.jsx)(t.code,{children:`items`}),`, and use `,(0,m.jsx)(t.code,{children:`getItem`}),` to map each item to the fields the shell needs:`]}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`id`}),`: a stable identifier;`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`href`}),`: the destination;`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`label`}),`: the visible text;`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`icon`}),` (optional): a Breeze `,(0,m.jsx)(t.code,{children:`IconName`}),`.`]}),`
`]}),`
`,(0,m.jsxs)(t.p,{children:[`Set `,(0,m.jsx)(t.code,{children:`currentItem`}),` to the `,(0,m.jsx)(t.code,{children:`id`}),` of the current destination. That link is marked with `,(0,m.jsx)(t.code,{children:`aria-current="page"`}),`. In the top navigation it shows the navigation marker; in the bottom navigation its icon and label use the brand colour.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<ApplicationShell
  account={<AccountMenu />}
  action={{ icon: 'add', label: 'Create item', onAction: createItem }}
  brand={<Brand />}
  context={<WorkspaceSwitcher />}
  currentItem={currentRoute.key}
  getItem={(route) => ({
    href: route.href,
    id: route.key,
    label: route.title,
  })}
  items={routes}
  notifications={<NotificationButton />}
>
  {pageContent}
</ApplicationShell>
`})}),`
`,(0,m.jsxs)(t.p,{children:[`Navigation items are regular links. When a router is configured on `,(0,m.jsx)(t.code,{children:`BreezeProvider`}),`, they navigate through it with `,(0,m.jsx)(t.code,{children:`transitionTypes: ['nav']`}),`.`]}),`
`,(0,m.jsx)(t.h2,{id:`slots`,children:`Slots`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`brand`}),`, `,(0,m.jsx)(t.code,{children:`context`}),`, `,(0,m.jsx)(t.code,{children:`notifications`}),` and `,(0,m.jsx)(t.code,{children:`account`}),` accept any React content. Give interactive content accessible names, especially icon-only controls. From the 901px breakpoint, a divider separates `,(0,m.jsx)(t.code,{children:`brand`}),` from `,(0,m.jsx)(t.code,{children:`context`}),`.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`children`}),` is rendered inside the main landmark, stacked with a 16px gap.`]}),`
`,(0,m.jsx)(t.h2,{id:`primary-action`,children:`Primary action`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`action`}),` is required and renders as a circular, icon-only button:`]}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`icon`}),` selects a Breeze icon;`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`label`}),` is its accessible name;`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`onAction`}),` is called when it is activated.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`responsive-layout`,children:`Responsive layout`}),`
`,(0,m.jsx)(t.p,{children:`At 901px and wider, navigation sits horizontally beneath the top bar. When the links do not fit, the row scrolls horizontally and a focused link scrolls into view.`}),`
`,(0,m.jsx)(t.p,{children:`Below 901px, navigation becomes a 72px bar fixed to the bottom of the screen. The primary action is raised over the bar's top edge in a centre slot between the two halves of the items, and stays in place as the current page changes. The main content leaves room for the bar, the raised action and the device safe area.`}),`
`,(0,m.jsx)(a,{layout:`fullscreen`,of:l,story:{height:`844px`,inline:!1}}),`
`,(0,m.jsx)(t.h2,{id:`view-transitions`,children:`View transitions`}),`
`,(0,m.jsxs)(t.p,{children:[`The top bar, top navigation, bottom navigation and current-location marker take part in view transitions using Breeze UI's reserved shell roles. Render only one visible `,(0,m.jsx)(t.code,{children:`ApplicationShell`}),` at a time.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsx)(t.li,{children:`A skip link before the shell's chrome moves focus to the main landmark.`}),`
`,(0,m.jsx)(t.li,{children:`The current destination is announced as the current page.`}),`
`,(0,m.jsx)(t.li,{children:`On mobile, keyboard focus reaches the primary action between the two halves of the bottom navigation.`}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{of:c})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};