import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Destinations as c,n as l,t as u}from"./NavigationSection.stories-cil-omgl.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Visible section heading and labelled navigation landmark for one related group of application destinations.`}),`
`,(0,p.jsx)(t.h1,{id:`navigationsection`,children:`NavigationSection`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`NavigationSection`}),` groups related destinations under a persistent visible heading that also names the navigation landmark.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  NavigationList,
  NavigationSection,
} from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it when a navigation area contains several meaningful groups, such as project and account destinations. Use `,(0,p.jsx)(t.code,{children:`NavigationList.Root`}),` alone for one already-labelled destination set, `,(0,p.jsx)(t.code,{children:`Breadcrumbs`}),` for hierarchy, `,(0,p.jsx)(t.code,{children:`Tabs`}),` for peer content views, or `,(0,p.jsx)(t.code,{children:`SectionHeader`}),` for a non-navigation content section.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  NavigationList,
  NavigationSection,
} from '@motech-development/breeze-ui';

<NavigationSection title="Projects">
  <NavigationList.Root aria-label="Project destinations">
    <NavigationList.Item current href="/overview" id="overview">
      Overview
    </NavigationList.Item>
    <NavigationList.Item href="/projects" id="projects">
      All projects
    </NavigationList.Item>
  </NavigationList.Root>
</NavigationSection>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`structure-state-and-routing`,children:`Structure, state, and routing`}),`
`,(0,p.jsxs)(t.p,{children:[`The pattern renders a `,(0,p.jsx)(t.code,{children:`nav`}),` landmark named by its visible fixed-level `,(0,p.jsx)(t.code,{children:`h2`}),`, followed by `,(0,p.jsx)(t.code,{children:`children`}),`. It adds no selection model: the application derives each destination's `,(0,p.jsx)(t.code,{children:`current`}),` state from its router. `,(0,p.jsx)(t.code,{children:`NavigationList.Item`}),` local links use the `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` router adapter when configured; external destinations and native browser link behaviour remain native.`]}),`
`,(0,p.jsx)(t.p,{children:`The section has no orientation, density, variant, disabled, loading, invalid, empty, or error state. Configure layout and item state on the child navigation primitive. When there are no destinations, omit the entire section instead of leaving an empty landmark; when loading fails, present feedback outside the navigation.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-internationalisation`,children:`Accessibility and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`title`}),` must be concise, visible, and distinct from other navigation landmark names. Translate the title and destination labels. If `,(0,p.jsx)(t.code,{children:`children`}),` contains another navigation landmark such as `,(0,p.jsx)(t.code,{children:`NavigationList.Root`}),`, give it a more specific accessible label so landmarks remain distinguishable.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The pattern itself adds no keyboard behaviour. Links in its children retain standard `,(0,p.jsx)(t.code,{children:`Tab`}),`, `,(0,p.jsx)(t.code,{children:`Enter`}),`, modified-click, and context-menu behaviour. Item callbacks use the semantics of the composed navigation component. Logical spacing follows provider direction; destination order remains application-owned in both left-to-right and right-to-left layouts.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use a section heading as a substitute for marking the current route, repeat the same title for every landmark, place commands among destinations, or render unrelated groups under one title. Related components: `,(0,p.jsx)(t.a,{href:`?path=/docs/navigation-navigationlist--docs`,children:`NavigationList`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-application-shell-applicationshell--docs`,children:`ApplicationShell`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/navigation-breadcrumbs--docs`,children:`Breadcrumbs`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-page-structure-sectionheader--docs`,children:`SectionHeader`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};