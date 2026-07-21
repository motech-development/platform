import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Selection as c,n as l,t as u}from"./ContextSwitcher.stories-B44sxdzu.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Controlled, keyboard-complete menu for selecting one application-owned context by stable string id.`}),`
`,(0,p.jsx)(t.h1,{id:`contextswitcher`,children:`ContextSwitcher`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ContextSwitcher`}),` lets a person move between workspaces, organisations, or another application-defined context.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Avatar, ContextSwitcher } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it when most application content is scoped to exactly one current context and context changes deserve a persistent shell control. Use `,(0,p.jsx)(t.code,{children:`Select`}),` for a form value, `,(0,p.jsx)(t.code,{children:`Menu`}),` for unrelated commands, or `,(0,p.jsx)(t.code,{children:`NavigationList`}),` when every option is a destination rather than a global context change.`]}),`
`,(0,p.jsx)(t.p,{children:`The application owns the context collection, loading and error handling, authorisation, confirmation of destructive switches, persistence, and any route change after selection.`}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Avatar, ContextSwitcher } from '@motech-development/breeze-ui';

<ContextSwitcher
  aria-label="Switch workspace"
  currentId="design"
  items={[
    {
      description: 'Primary workspace',
      icon: <Avatar initials="D" name="Design team" shape="square" size="md" />,
      id: 'design',
      name: 'Design team',
    },
    { id: 'research', name: 'Research team' },
  ]}
  manageLabel="Manage workspaces"
  onChange={(id) => setCurrentWorkspaceId(id)}
  onManage={() => navigate('/workspaces')}
  triggerLabel="Current workspace"
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`state-items-and-callbacks`,children:`State, items, and callbacks`}),`
`,(0,p.jsxs)(t.p,{children:[`This is a controlled pattern. `,(0,p.jsx)(t.code,{children:`currentId`}),` is a string id from `,(0,p.jsx)(t.code,{children:`items`}),`, or `,(0,p.jsx)(t.code,{children:`null`}),` when a selection is required; `,(0,p.jsx)(t.code,{children:`onChange(id)`}),` reports the requested next id and receives no DOM event. Update `,(0,p.jsx)(t.code,{children:`currentId`}),` after application validation succeeds. There is no `,(0,p.jsx)(t.code,{children:`defaultCurrentId`}),` or read-only mode. Disable unavailable items individually; when switching is wholly unavailable, render a non-interactive context summary.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Each `,(0,p.jsx)(t.code,{children:`ContextSwitcherItem`}),` requires a stable `,(0,p.jsx)(t.code,{children:`id`}),` and plain-string `,(0,p.jsx)(t.code,{children:`name`}),`. `,(0,p.jsx)(t.code,{children:`name`}),` supplies visible text and menu typeahead. `,(0,p.jsx)(t.code,{children:`description`}),` and `,(0,p.jsx)(t.code,{children:`icon`}),` add supporting context. `,(0,p.jsx)(t.code,{children:`disabled`}),` prevents that item from receiving selection or action. Item order is preserved.`]}),`
`,(0,p.jsxs)(t.p,{children:[`When `,(0,p.jsx)(t.code,{children:`currentId`}),` is `,(0,p.jsx)(t.code,{children:`null`}),` or does not match an item, the trigger shows `,(0,p.jsx)(t.code,{children:`emptyIcon`}),` and `,(0,p.jsx)(t.code,{children:`emptyName`}),`, falling back to the `,(0,p.jsx)(t.code,{children:`aria-label`}),`. The optional management row appears only when both `,(0,p.jsx)(t.code,{children:`manageLabel`}),` and `,(0,p.jsx)(t.code,{children:`onManage`}),` are supplied. Its internal collision-safe key is not public and must not be referenced.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-internationalisation`,children:`Accessibility, keyboard, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`aria-label`}),` names both trigger and menu; provide a concise translated action such as “Switch workspace”. `,(0,p.jsx)(t.code,{children:`triggerLabel`}),`, names, descriptions, empty copy, and management copy are application-owned and must be localised. Names should remain distinguishable without relying on icons, which should be decorative unless they convey information absent from the text.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The trigger opens with pointer activation, `,(0,p.jsx)(t.code,{children:`Enter`}),`, `,(0,p.jsx)(t.code,{children:`Space`}),`, or the platform menu shortcut. Arrow keys move through enabled items, typing moves by `,(0,p.jsx)(t.code,{children:`name`}),`, `,(0,p.jsx)(t.code,{children:`Enter`}),` or `,(0,p.jsx)(t.code,{children:`Space`}),` selects, `,(0,p.jsx)(t.code,{children:`Home`}),` and `,(0,p.jsx)(t.code,{children:`End`}),` move to boundaries, and `,(0,p.jsx)(t.code,{children:`Escape`}),` closes and restores trigger focus. Behaviour comes from the composed `,(0,p.jsx)(t.code,{children:`Menu`}),`. Logical alignment and `,(0,p.jsx)(t.code,{children:`top start`}),` placement follow provider direction.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The pattern does not fetch items or display loading, invalid, or error feedback. Show an appropriate `,(0,p.jsx)(t.code,{children:`Skeleton`}),`, `,(0,p.jsx)(t.code,{children:`Spinner`}),`, `,(0,p.jsx)(t.code,{children:`Alert`}),`, or `,(0,p.jsx)(t.code,{children:`StatePanel`}),` outside it, and avoid presenting an unexplained empty menu.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use array position as an id, pass a stale `,(0,p.jsx)(t.code,{children:`currentId`}),` silently, place an essential distinction only in colour, or perform the context change without updating controlled state. Related components: `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-application-shell-applicationshell--docs`,children:`ApplicationShell`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/navigation-menu--docs`,children:`Menu`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/forms-select--docs`,children:`Select`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};