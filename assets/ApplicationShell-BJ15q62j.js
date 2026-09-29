import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BAOfLV0X.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,TextActionFallback as l,n as u,t as d}from"./ApplicationShell.stories-CCswXfPU.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Provides responsive application chrome, section navigation and a fixed mobile action.`}),`
`,(0,m.jsx)(t.h1,{id:`applicationshell`,children:`ApplicationShell`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`ApplicationShell`}),` provides the shared frame around an application's page content: a top bar, section navigation, a skip link and the main landmark. It accepts application-owned values and slot content without depending on an account or product domain.`]}),`
`,(0,m.jsx)(a,{layout:`fullscreen`,of:c,story:{height:`844px`,inline:!1}}),`
`,(0,m.jsx)(t.h2,{id:`supply-navigation-values`,children:`Supply navigation values`}),`
`,(0,m.jsxs)(t.p,{children:[`Pass application values through `,(0,m.jsx)(t.code,{children:`items`}),` and map each value to the supported navigation fields with `,(0,m.jsx)(t.code,{children:`getItem`}),`. Every item needs a stable `,(0,m.jsx)(t.code,{children:`id`}),`, destination `,(0,m.jsx)(t.code,{children:`href`}),` and visible `,(0,m.jsx)(t.code,{children:`label`}),`; `,(0,m.jsx)(t.code,{children:`icon`}),` may use a curated Breeze `,(0,m.jsx)(t.code,{children:`IconName`}),`. Set `,(0,m.jsx)(t.code,{children:`currentItem`}),` to the ID of the current destination. The matching link receives `,(0,m.jsx)(t.code,{children:`aria-current="page"`}),` and the animated navigation marker.`]}),`
`,(0,m.jsx)(t.p,{children:`For example, an application can adapt its own route model while keeping the shell generic:`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`<ApplicationShell
  account={<AccountMenu />}
  action={{ label: 'Create item', onAction: createItem }}
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
`,(0,m.jsxs)(t.p,{children:[`The anchors keep native link behavior. When a same-document router is configured on `,(0,m.jsx)(t.code,{children:`BreezeProvider`}),`, section navigation sends `,(0,m.jsx)(t.code,{children:`transitionTypes: ['nav']`}),` to that router.`]}),`
`,(0,m.jsx)(t.h2,{id:`provide-the-application-slots`,children:`Provide the application slots`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`brand`}),`, `,(0,m.jsx)(t.code,{children:`context`}),`, `,(0,m.jsx)(t.code,{children:`notifications`}),` and `,(0,m.jsx)(t.code,{children:`account`}),` accept `,(0,m.jsx)(t.code,{children:`ReactNode`}),`. Their content and semantics belong to the application: label interactive controls, keep keyboard behavior usable and provide accessible names for icon-only controls. `,(0,m.jsx)(t.code,{children:`children`}),` is rendered inside the shell's main landmark.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`action`}),` is required. Its `,(0,m.jsx)(t.code,{children:`label`}),` names the action, and `,(0,m.jsx)(t.code,{children:`onAction`}),` performs the application-owned operation. An optional curated icon is displayed inside the mobile action button; without an icon, the label is shown in a bounded, wrapping fallback.`]}),`
`,(0,m.jsx)(t.h2,{id:`responsive-behavior-and-motion`,children:`Responsive behavior and motion`}),`
`,(0,m.jsxs)(t.p,{children:[`At Breeze's private `,(0,m.jsx)(t.code,{children:`lg`}),` breakpoint (1181px), navigation is horizontal beneath the top bar. Below that breakpoint, the navigation is fixed to the bottom edge and the required action stays in the centre slot. The centre slot keeps its position as the current page changes. The main content includes clearance for the fixed navigation and the device safe area.`]}),`
`,(0,m.jsxs)(t.p,{children:[`The shell renders one skip link before its chrome and gives its main landmark a generated unique ID and `,(0,m.jsx)(t.code,{children:`tabIndex={-1}`}),`. Its top bar, top navigation, bottom navigation and current marker participate in view transitions through Breeze's built-in singleton names. Mount one visible shell at a time so those names stay unique in the document.`]}),`
`,(0,m.jsx)(t.h2,{id:`text-action-fallback`,children:`Text action fallback`}),`
`,(0,m.jsx)(t.p,{children:`The action remains named and readable without a curated icon.`}),`
`,(0,m.jsx)(a,{layout:`fullscreen`,of:l,story:{height:`844px`,inline:!1}}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{of:c})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};