import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{InformationNotice as c,Variants as l,n as u,t as d}from"./Alert.stories-DAjD2jIq.js";function f(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d,summary:`Persistent inline feedback with an explicit assertive, polite, or non-live announcement policy.`}),`
`,(0,m.jsx)(t.h1,{id:`alert`,children:`Alert`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Alert`}),` displays persistent inline feedback and makes announcement urgency an explicit choice.`]}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Alert } from '@motech-development/breeze-ui';
`})}),`
`,(0,m.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,m.jsxs)(t.p,{children:[`Use an alert for feedback that should remain in the page near the affected context. Use `,(0,m.jsx)(t.a,{href:`?path=/docs/feedback-toast--docs`,children:`Toast`}),` for transient, provider-queued notifications, `,(0,m.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),` for a substantial empty or error state, and field `,(0,m.jsx)(t.code,{children:`Error`}),` parts for validation attached to a control.`]}),`
`,(0,m.jsx)(t.p,{children:`Do not use an assertive alert for ordinary guidance already present at page load.`}),`
`,(0,m.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import { Alert } from '@motech-development/breeze-ui';

export function SaveFeedback() {
  return (
    <Alert announcement="polite" variant="success">
      Your changes were saved.
    </Alert>
  );
}
`})}),`
`,(0,m.jsx)(a,{of:c}),`
`,(0,m.jsx)(t.h2,{id:`announcement-behaviour`,children:`Announcement behaviour`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`assertive`}),` is the default. It renders `,(0,m.jsx)(t.code,{children:`role="alert"`}),`, `,(0,m.jsx)(t.code,{children:`aria-live="assertive"`}),`, and `,(0,m.jsx)(t.code,{children:`aria-atomic="true"`}),` for urgent newly inserted feedback.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`polite`}),` renders `,(0,m.jsx)(t.code,{children:`role="status"`}),`, `,(0,m.jsx)(t.code,{children:`aria-live="polite"`}),`, and `,(0,m.jsx)(t.code,{children:`aria-atomic="true"`}),` for non-urgent updates.`]}),`
`,(0,m.jsxs)(t.li,{children:[(0,m.jsx)(t.code,{children:`off`}),` omits the live-region role and sets `,(0,m.jsx)(t.code,{children:`aria-live="off"`}),`; use it for persistent content already present when the page loads.`]}),`
`]}),`
`,(0,m.jsx)(t.p,{children:`The DOM change must occur after the live region exists for reliable announcements. Do not duplicate the same message in another live region.`}),`
`,(0,m.jsx)(t.h2,{id:`variants`,children:`Variants`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`variant`}),` accepts `,(0,m.jsx)(t.code,{children:`primary`}),`, `,(0,m.jsx)(t.code,{children:`secondary`}),`, `,(0,m.jsx)(t.code,{children:`success`}),`, `,(0,m.jsx)(t.code,{children:`danger`}),`, `,(0,m.jsx)(t.code,{children:`warning`}),`, `,(0,m.jsx)(t.code,{children:`info`}),`, `,(0,m.jsx)(t.code,{children:`light`}),`, or `,(0,m.jsx)(t.code,{children:`dark`}),`; the default is `,(0,m.jsx)(t.code,{children:`info`}),`. Choose by meaning, not decoration, and include text or an accessible icon so colour is never the only signal.`]}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`accessibility-state-and-direction`,children:`Accessibility, state, and direction`}),`
`,(0,m.jsxs)(t.p,{children:[`Alert has no keyboard interaction or internal controlled state. It does not own dismissal, loading, disabled, invalid, empty, or error logic; conditionally render it from application state and use `,(0,m.jsx)(t.code,{children:`danger`}),` for error meaning when appropriate. Translate its application-owned content. Its logical layout supports both directions; decorative icons should be hidden from assistive technology and meaningful icons need a text alternative without repeating the message.`]}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`Alert`}),` supports relevant native `,(0,m.jsx)(t.code,{children:`div`}),` attributes, including `,(0,m.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,m.jsx)(t.code,{children:`ref`}),`; `,(0,m.jsx)(t.code,{children:`role`}),` and inline `,(0,m.jsx)(t.code,{children:`style`}),` are intentionally owned or excluded.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(i,{}),`
`,(0,m.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,m.jsxs)(t.ul,{children:[`
`,(0,m.jsxs)(t.li,{children:[`Do not leave `,(0,m.jsx)(t.code,{children:`announcement="assertive"`}),` on static informational content.`]}),`
`,(0,m.jsxs)(t.li,{children:[`Do not announce a validation error both in `,(0,m.jsx)(t.code,{children:`Alert`}),` and a field error.`]}),`
`,(0,m.jsx)(t.li,{children:`Do not put the only dismiss or recovery action in non-interactive text.`}),`
`,(0,m.jsxs)(t.li,{children:[`Do not choose `,(0,m.jsx)(t.code,{children:`success`}),`, `,(0,m.jsx)(t.code,{children:`warning`}),`, or `,(0,m.jsx)(t.code,{children:`danger`}),` solely for visual emphasis.`]}),`
`]}),`
`,(0,m.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.a,{href:`?path=/docs/feedback-toast--docs`,children:`Toast`}),`, `,(0,m.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),`, and compound field error parts cover transient feedback, page states, and validation.`]})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;e((()=>{m=t(),s(),r(),u()}))();export{p as default};