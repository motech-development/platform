import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,s as i}from"./blocks-noU9Sgrf.js";import{t as a}from"./mdx-react-shim-y1jXGhTh.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/03 Usage`,summary:`Set up the provider and render your first component.`}),`
`,(0,c.jsx)(t.h1,{id:`usage`,children:`Usage`}),`
`,(0,c.jsxs)(t.p,{children:[`Breeze UI components must be rendered inside `,(0,c.jsx)(t.code,{children:`BreezeProvider`}),`. Add it once, at the root of your application:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { BreezeProvider } from '@motech-development/breeze-ui';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@motech-development/breeze-ui/styles.css';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <BreezeProvider locale="en-GB">
      <App />
    </BreezeProvider>,
  );
}
`})}),`
`,(0,c.jsx)(t.p,{children:`Components can then be used anywhere below the provider:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { Button } from '@motech-development/breeze-ui';

export function SaveAction() {
  return <Button onAction={() => saveChanges()}>Save changes</Button>;
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`locale`,children:`Locale`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`BreezeProvider`}),` takes a BCP 47 language tag, such as `,(0,c.jsx)(t.code,{children:`en-GB`}),` or `,(0,c.jsx)(t.code,{children:`fr-FR`}),`. Components use it for accessible interactions and text direction.`]}),`
`,(0,c.jsx)(t.h2,{id:`dark-mode`,children:`Dark mode`}),`
`,(0,c.jsxs)(t.p,{children:[`Components follow the operating system colour scheme. To set the scheme from your application, add `,(0,c.jsx)(t.code,{children:`data-theme`}),` to the `,(0,c.jsx)(t.code,{children:`html`}),` element:`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-html`,children:`<html data-theme="dark"></html>
`})}),`
`,(0,c.jsxs)(t.p,{children:[`The supported values are `,(0,c.jsx)(t.code,{children:`light`}),` and `,(0,c.jsx)(t.code,{children:`dark`}),`. Remove the attribute to follow the operating system.`]}),`
`,(0,c.jsx)(t.h2,{id:`customisation`,children:`Customisation`}),`
`,(0,c.jsxs)(t.p,{children:[`Component appearance is set through the props documented on each component page. `,(0,c.jsx)(t.code,{children:`className`}),`, `,(0,c.jsx)(t.code,{children:`style`}),` and theme overrides are not supported.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};