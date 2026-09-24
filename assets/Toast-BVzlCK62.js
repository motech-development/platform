import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-C5xEMl4c.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Enqueued as l,Mobile as u,n as d,t as f}from"./Toast.stories-Bg8AGlTR.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Confirms a completed action.`}),`
`,(0,h.jsx)(t.h1,{id:`toast`,children:`Toast`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Toast`}),` is a presentational positive confirmation card. It announces a completed action with `,(0,h.jsx)(t.code,{children:`role="status"`}),` and never moves focus. A `,(0,h.jsx)(t.code,{children:`Toast`}),` rendered directly stays mounted until its owner removes it; `,(0,h.jsx)(t.code,{children:`useToast`}),` supplies the provider-owned queue that expires each visible confirmation after 2.6 seconds.`]}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsxs)(t.p,{children:[`Use `,(0,h.jsx)(t.code,{children:`useToast`}),` below `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),` to enqueue a translated message:`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { Button, useToast } from '@motech-development/breeze-ui';

function SaveAction() {
  const enqueue = useToast();

  return (
    <Button onAction={() => enqueue('Changes saved')}>Save changes</Button>
  );
}
`})}),`
`,(0,h.jsxs)(t.p,{children:[`The provider renders up to three confirmations at once and queues additional messages in FIFO order. Set `,(0,h.jsx)(t.code,{children:`toastLimit`}),` on `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),` when the application needs a different visible limit.`]}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.p,{children:`The card stays 288px wide on desktop and mobile, aligned to the content gutter below the top bar. Provider-enqueued confirmations have no action, dismiss or undo control.`}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Toast`}),` is a non-interactive status. It has no tab stop and handles no keyboard events: Tab and Shift+Tab continue normal document movement while skipping the card, Escape does not dismiss it, and provider-enqueued confirmations do not move focus.`]}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};