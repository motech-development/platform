import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-D60bq-E9.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{Default as c,Enqueued as l,Mobile as u,n as d,t as f}from"./Toast.stories-Z8bxvkGC.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Confirms a completed action.`}),`
`,(0,h.jsx)(t.h1,{id:`toast`,children:`Toast`}),`
`,(0,h.jsx)(t.p,{children:`A toast is a short confirmation that an action has completed, such as “Changes saved”. Screen readers announce it, and it never moves focus.`}),`
`,(0,h.jsxs)(t.p,{children:[`In most cases, show toasts with the `,(0,h.jsx)(t.code,{children:`useToast`}),` hook, which displays each message for 2.6 seconds. A `,(0,h.jsx)(t.code,{children:`Toast`}),` you render yourself stays on screen until you remove it.`]}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(t.h2,{id:`showing-a-toast`,children:`Showing a toast`}),`
`,(0,h.jsxs)(t.p,{children:[`Call `,(0,h.jsx)(t.code,{children:`useToast`}),` in a component below `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),`. It returns a function that shows a message; pass text already translated into the user's language.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { Button, useToast } from '@motech-development/breeze-ui';

function SaveAction() {
  const enqueue = useToast();

  return (
    <Button onAction={() => enqueue('Changes saved')}>Save changes</Button>
  );
}
`})}),`
`,(0,h.jsxs)(t.p,{children:[`Up to three toasts are shown at once. Further messages wait and appear in the order they were sent, as earlier ones expire. Set `,(0,h.jsx)(t.code,{children:`toastLimit`}),` on `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),` to change how many are shown at once.`]}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.h2,{id:`layout`,children:`Layout`}),`
`,(0,h.jsxs)(t.p,{children:[`A toast is 288px wide on both desktop and mobile, and appears below the top bar, aligned with the page content. Toasts shown with `,(0,h.jsx)(t.code,{children:`useToast`}),` have no action, dismiss or undo button.`]}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,h.jsx)(t.p,{children:`Screen readers announce each toast as a status message without interrupting the user. A toast cannot be focused or dismissed: Tab and Shift+Tab skip it, Escape does not close it, and focus stays where it was.`}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};