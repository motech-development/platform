import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,s as i}from"./blocks-CZIpnuKF.js";import{t as a}from"./mdx-react-shim-B0kyhCPT.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/02 Installation`,summary:`Install Breeze UI v3, load its published CSS, and satisfy its React peer dependencies.`}),`
`,(0,c.jsx)(t.h1,{id:`installation`,children:`Installation`}),`
`,(0,c.jsx)(t.p,{children:`Install the package with your application's package manager. Breeze UI v3 requires React 19 and React DOM 19 as peer dependencies.`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-shell`,children:`yarn add @motech-development/breeze-ui react react-dom
`})}),`
`,(0,c.jsx)(t.h2,{id:`load-the-styles`,children:`Load the styles`}),`
`,(0,c.jsx)(t.p,{children:`Every application must load the compiled component stylesheet once:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import '@motech-development/breeze-ui/styles.css';
`})}),`
`,(0,c.jsx)(t.p,{children:`Greenfield applications may opt into the Breeze global baseline by importing the reset before the component stylesheet:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import '@motech-development/breeze-ui/reset.css';
import '@motech-development/breeze-ui/styles.css';
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`styles.css`}),` contains fonts, semantic tokens, component-scoped normalisation and component styles. `,(0,c.jsx)(t.code,{children:`reset.css`}),` contains the optional global document baseline. Existing applications should assess the global reset before enabling it.`]}),`
`,(0,c.jsx)(t.h2,{id:`add-the-provider`,children:`Add the provider`}),`
`,(0,c.jsxs)(t.p,{children:[`All Breeze components require `,(0,c.jsx)(t.code,{children:`BreezeProvider`}),`:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { BreezeProvider } from '@motech-development/breeze-ui';

export function App() {
  return <BreezeProvider locale="en-GB">Your application</BreezeProvider>;
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Use a valid BCP 47 locale. Add `,(0,c.jsx)(t.code,{children:`timeZone`}),`, `,(0,c.jsx)(t.code,{children:`router`}),`, `,(0,c.jsx)(t.code,{children:`messages`}),`, `,(0,c.jsx)(t.code,{children:`direction`}),` or a custom `,(0,c.jsx)(t.code,{children:`portalContainer`}),` only when the application needs those environment behaviours.`]}),`
`,(0,c.jsx)(t.h2,{id:`package-boundaries`,children:`Package boundaries`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Import`}),(0,c.jsx)(t.th,{children:`Purpose`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@motech-development/breeze-ui`})}),(0,c.jsx)(t.td,{children:`Components, patterns and public types`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@motech-development/breeze-ui/icons`})}),(0,c.jsxs)(t.td,{children:[`The 32 curated icon components and `,(0,c.jsx)(t.code,{children:`IconProps`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@motech-development/breeze-ui/styles.css`})}),(0,c.jsx)(t.td,{children:`Required compiled styles`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@motech-development/breeze-ui/reset.css`})}),(0,c.jsx)(t.td,{children:`Optional global reset`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Do not configure Tailwind to scan Breeze source, import unpublished CSS files or depend on `,(0,c.jsx)(t.code,{children:`react-aria-components`}),` through Breeze. The package's public entry points are the supported boundary.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};