import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Static as c,n as l,t as u}from"./Tag.stories-fPjdo7Zh.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`One keyed focusable tag item for use in a TagGroup collection, with stable identity, text representation, disabled state, and optional semantic action.`}),`
`,(0,p.jsx)(t.h1,{id:`tag`,children:`Tag`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Tag`}),` is one keyed interactive item for a `,(0,p.jsx)(t.code,{children:`TagGroup`}),`; the containing group supplies selection and removal behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Tag, TagGroup } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Tag`}),` inside `,(0,p.jsx)(t.code,{children:`TagGroup.List`}),` for compact labels that may be focused, selected, acted on, or removed. Prefer `,(0,p.jsx)(t.code,{children:`Badge`}),` for passive status or metadata, `,(0,p.jsx)(t.code,{children:`Button`}),` for an action, and `,(0,p.jsx)(t.code,{children:`ListBox.Item`}),` for a conventional option collection. A standalone Tag story demonstrates the item, but production composition should provide TagGroup context and an accessible group label.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Tag, TagGroup } from '@motech-development/breeze-ui';

<TagGroup.Root>
  <TagGroup.Label>Topics</TagGroup.Label>
  <TagGroup.List>
    <Tag id="accessibility" textValue="Accessibility">
      Accessibility
    </Tag>
    <Tag id="design" textValue="Design systems">
      Design systems
    </Tag>
  </TagGroup.List>
</TagGroup.Root>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`identity-and-behaviour`,children:`Identity and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`id`}),` is a required stable `,(0,p.jsx)(t.code,{children:`string | number`}),` used for focus, selection, actions, and removal. `,(0,p.jsx)(t.code,{children:`textValue`}),` is required plain text for typeahead and accessibility. Visible `,(0,p.jsx)(t.code,{children:`children`}),` may contain richer presentation, but must preserve the same meaning.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`disabled`}),` prevents focus, selection, action, and removal. `,(0,p.jsx)(t.code,{children:`onAction`}),` receives this tag’s key when its semantic action is invoked. Selection and removal callbacks belong to `,(0,p.jsx)(t.code,{children:`TagGroup.Root`}),`; Tag has no controlled, uncontrolled, read-only, loading, invalid, or error state of its own.`]}),`
`,(0,p.jsx)(t.h2,{id:`keyboard-and-accessibility`,children:`Keyboard and accessibility`}),`
`,(0,p.jsxs)(t.p,{children:[`Keyboard behaviour is coordinated by `,(0,p.jsx)(t.code,{children:`TagGroup`}),`: arrow keys move between tags, and selection, action, or removal keys depend on enabled group behaviours. Do not put links, buttons, or other interactive descendants inside `,(0,p.jsx)(t.code,{children:`Tag`}),`; use the tag’s semantic action or a separate control. Keep `,(0,p.jsx)(t.code,{children:`id`}),` independent of translated content and provide an accurate `,(0,p.jsx)(t.code,{children:`textValue`}),` for every locale.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use array indexes as IDs, omit `,(0,p.jsx)(t.code,{children:`textValue`}),`, nest interactive controls, or treat a Tag as a passive badge. Use `,(0,p.jsx)(t.code,{children:`TagGroup`}),` for collection state, `,(0,p.jsx)(t.code,{children:`Badge`}),` for status, `,(0,p.jsx)(t.code,{children:`Button`}),` for a command, and `,(0,p.jsx)(t.code,{children:`ListBox`}),` for a larger option collection.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};