import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,s as i}from"./blocks-BKOn9Gx8.js";import{t as a}from"./mdx-react-shim-y1jXGhTh.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/01 Overview`,summary:`What Breeze UI v3 provides, how its primitives and patterns fit together, and where to begin.`}),`
`,(0,c.jsx)(t.h1,{id:`breeze-ui`,children:`Breeze UI`}),`
`,(0,c.jsx)(t.p,{children:`Breeze UI is Motech's accessible, domain-neutral React interface system. Version 3 is a clean break from the legacy library: use only the components documented in this Storybook and import them from the public package entry points.`}),`
`,(0,c.jsx)(t.h2,{id:`choose-the-right-layer`,children:`Choose the right layer`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Layer`}),(0,c.jsx)(t.th,{children:`Responsibility`}),(0,c.jsx)(t.th,{children:`Examples`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Primitive`}),(0,c.jsx)(t.td,{children:`One focused, reusable interface responsibility`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`Button`}),`, `,(0,c.jsx)(t.code,{children:`TextField`}),`, `,(0,c.jsx)(t.code,{children:`Stack`}),`, `,(0,c.jsx)(t.code,{children:`Dialog`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Pattern`}),(0,c.jsx)(t.td,{children:`A Breeze-owned composition for a recurring, domain-neutral interface need`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`PageHeader`}),`, `,(0,c.jsx)(t.code,{children:`Pagination`}),`, `,(0,c.jsx)(t.code,{children:`FileUpload`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Domain component`}),(0,c.jsx)(t.td,{children:`An application-owned composition that represents a business concept`}),(0,c.jsx)(t.td,{children:`A project summary or account record built from Breeze primitives and patterns`})]})]})]}),`
`,(0,c.jsx)(t.p,{children:`Applications own domain components, business copy, data fetching, persistence, routing decisions and business validation. Breeze owns its visual language, accessible interaction behaviour and documented public contracts.`}),`
`,(0,c.jsx)(t.h2,{id:`public-entry-points`,children:`Public entry points`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import {
  BreezeProvider,
  Button,
  Stack,
  Typography,
} from '@motech-development/breeze-ui';
import { AddIcon } from '@motech-development/breeze-ui/icons';
import '@motech-development/breeze-ui/reset.css';
import '@motech-development/breeze-ui/styles.css';
`})}),`
`,(0,c.jsx)(t.p,{children:`Do not use internal deep imports. React Aria, Lucide and internal styling helpers are implementation details rather than public API.`}),`
`,(0,c.jsx)(t.h2,{id:`core-conventions`,children:`Core conventions`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Wrap every Breeze subtree in `,(0,c.jsx)(t.code,{children:`BreezeProvider`}),` and provide a BCP 47 `,(0,c.jsx)(t.code,{children:`locale`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Import `,(0,c.jsx)(t.code,{children:`styles.css`}),` once. Greenfield applications can import `,(0,c.jsx)(t.code,{children:`reset.css`}),` first.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Use `,(0,c.jsx)(t.code,{children:`onAction`}),` for discrete activation, `,(0,c.jsx)(t.code,{children:`onChange`}),` for semantic values, and `,(0,c.jsx)(t.code,{children:`onOpenChange`}),` for overlay state.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Use `,(0,c.jsx)(t.code,{children:`value`}),` with `,(0,c.jsx)(t.code,{children:`onChange`}),` for controlled state and `,(0,c.jsx)(t.code,{children:`defaultValue`}),` for uncontrolled state.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Multi-part controls expose one compound namespace, such as `,(0,c.jsx)(t.code,{children:`Dialog.Root`}),`, `,(0,c.jsx)(t.code,{children:`Dialog.Trigger`}),` and `,(0,c.jsx)(t.code,{children:`Dialog.Content`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Use typed variants and `,(0,c.jsx)(t.code,{children:`className`}),` for placement and composition; internal class names are not a stable contract.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`start-here`,children:`Start here`}),`
`,(0,c.jsxs)(t.p,{children:[`Read `,(0,c.jsx)(t.a,{href:`?path=/docs/guides-02-installation--docs`,children:`Installation`}),`, then `,(0,c.jsx)(t.a,{href:`?path=/docs/guides-03-quick-start--docs`,children:`Quick start`}),`. The remaining guides explain provider setup, composition, state, accessibility, internationalisation, routing, styling, collections and icons. Each component page contains a public import, deliberately authored examples, anatomy, API tables and selection guidance.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};