import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{CompleteFrame as c,n as l,t as u}from"./ApplicationShell.stories-DqEQNxDA.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Responsive application frame that composes brand, navigation, context, account controls, skip navigation, and page content.`}),`
`,(0,p.jsx)(t.h1,{id:`applicationshell`,children:`ApplicationShell`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ApplicationShell`}),` provides the shared responsive frame for a product application without owning routes, account state, or page content.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  ApplicationShell,
  Button,
  Logo,
  NavigationList,
  Typography,
} from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it once around an authenticated application workspace that needs the canonical wide navigation rail and compact navigation drawer. Compose `,(0,p.jsx)(t.code,{children:`NavigationList`}),`, `,(0,p.jsx)(t.code,{children:`ContextSwitcher`}),`, and `,(0,p.jsx)(t.code,{children:`UserMenu`}),` into its slots.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use it as a marketing-site header, repeat it per page, or put routing and authentication logic inside the shell. Use page-level `,(0,p.jsx)(t.code,{children:`Container`}),`, `,(0,p.jsx)(t.code,{children:`PageHeader`}),`, and layout primitives inside `,(0,p.jsx)(t.code,{children:`children`}),`; use `,(0,p.jsx)(t.code,{children:`Drawer`}),` directly for a separate temporary panel.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  ApplicationShell,
  Button,
  Logo,
  NavigationList,
  Typography,
} from '@motech-development/breeze-ui';
import '@motech-development/breeze-ui/reset.css';
import '@motech-development/breeze-ui/styles.css';

export function Workspace() {
  return (
    <ApplicationShell
      account={
        <Button appearance="ghost" variant="light">
          Account
        </Button>
      }
      brand={<Logo size="lg" />}
      compactBrand={<Typography as="strong">Workspace</Typography>}
      navigation={
        <NavigationList.Root aria-label="Primary navigation">
          <NavigationList.Item current href="/overview" id="overview">
            Overview
          </NavigationList.Item>
          <NavigationList.Item href="/projects" id="projects">
            Projects
          </NavigationList.Item>
        </NavigationList.Root>
      }
      navigationLabel="Open navigation"
      skipLinkLabel="Skip to main content"
    >
      <Typography as="h1">Overview</Typography>
    </ApplicationShell>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-responsive-behaviour`,children:`Anatomy and responsive behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`The root contains a visible-on-focus skip link, a persistent rail from the `,(0,p.jsx)(t.code,{children:`md`}),` breakpoint, a compact header and start-edge drawer below `,(0,p.jsx)(t.code,{children:`md`}),`, and the labelled main-content target. `,(0,p.jsx)(t.code,{children:`brand`}),`, `,(0,p.jsx)(t.code,{children:`navigation`}),`, optional `,(0,p.jsx)(t.code,{children:`context`}),`, and `,(0,p.jsx)(t.code,{children:`account`}),` can be rendered in more than one responsive presentation, so their components must obtain changing state from the application and must not introduce a shared singleton DOM id. `,(0,p.jsx)(t.code,{children:`compactBrand`}),` defaults to `,(0,p.jsx)(t.code,{children:`brand`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The drawer uses logical `,(0,p.jsx)(t.code,{children:`start`}),`, so it opens from the left in left-to-right layouts and the right in right-to-left layouts. The shell supplies layout and landmarks; the application supplies destinations, the current route, translated product copy, context selection, account actions, loading/error content, and data fetching.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-routing`,children:`Accessibility, keyboard, and routing`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`skipLinkLabel`}),` must clearly describe bypassing repeated navigation. Its target is `,(0,p.jsx)(t.code,{children:`mainId`}),`, which defaults to `,(0,p.jsx)(t.code,{children:`main-content`}),`; keep that id unique on the page.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`navigationLabel`}),` names the compact drawer trigger and its dialog. It is application-owned, localised text.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use a labelled `,(0,p.jsx)(t.code,{children:`NavigationList.Root`}),` and set `,(0,p.jsx)(t.code,{children:`current`}),` from the active route. Local links use the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` router adapter when configured; native anchors handle external URLs and native link behaviours.`]}),`
`,(0,p.jsxs)(t.li,{children:[`The drawer trigger and close action use normal button keyboard activation. Focus, `,(0,p.jsx)(t.code,{children:`Escape`}),` dismissal, focus containment, scroll locking, and restoration are supplied by `,(0,p.jsx)(t.code,{children:`Drawer`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`The main target has `,(0,p.jsx)(t.code,{children:`tabIndex={-1}`}),` so the skip link can move focus to it. Keep the first page heading inside `,(0,p.jsx)(t.code,{children:`children`}),`.`]}),`
`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ApplicationShell`}),` has no disabled, read-only, invalid, loading, empty, or error mode. Render page feedback inside `,(0,p.jsx)(t.code,{children:`children`}),`, disable the relevant slotted controls themselves, and keep navigation and account recovery available whenever possible.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not put domain-specific page state in a shared shell slot.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not render another `,(0,p.jsx)(t.code,{children:`main`}),` landmark inside `,(0,p.jsx)(t.code,{children:`children`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not use physical left/right assumptions; direction is provider-controlled.`}),`
`,(0,p.jsx)(t.li,{children:`Do not hard-code the shell breakpoint or rail offset in application CSS.`}),`
`,(0,p.jsx)(t.li,{children:`Do not assume the frame performs route changes, signs users out, fetches contexts, or announces page loading.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-application-shell-contextswitcher--docs`,children:`ContextSwitcher`}),` and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-application-shell-usermenu--docs`,children:`UserMenu`}),` in the footer slots, `,(0,p.jsx)(t.a,{href:`?path=/docs/navigation-navigationlist--docs`,children:`NavigationList`}),` for destinations, `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-page-structure-pageheader--docs`,children:`PageHeader`}),` inside the page, and `,(0,p.jsx)(t.a,{href:`?path=/docs/navigation-skiplink--docs`,children:`SkipLink`}),` when building a different frame.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};