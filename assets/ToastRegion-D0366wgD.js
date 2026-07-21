import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{AdditionalRegion as c,n as l,t as u}from"./ToastRegion.stories-DdPg1Ywz.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Advanced additional presentation of the nearest BreezeProvider toast queue with a separately translated accessible label.`}),`
`,(0,p.jsx)(t.h1,{id:`toastregion`,children:`ToastRegion`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ToastRegion`}),` renders an additional labelled presentation of the nearest `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` toast queue. The provider already renders the primary region automatically.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ToastRegion } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Most applications should not render this component. Use it only when an advanced layout deliberately needs another presentation of the same provider-owned queue and the accessibility impact has been tested. Use `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-toast--docs`,children:(0,p.jsx)(t.code,{children:`useToast`})}),` to add and dismiss notifications; use standalone `,(0,p.jsx)(t.code,{children:`Toast`}),` when the application owns an independent notification source.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { ToastRegion } from '@motech-development/breeze-ui';

export function SecondaryNotificationRegion() {
  return <ToastRegion label="Secondary notifications" />;
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`queue-and-lifecycle-behaviour`,children:`Queue and lifecycle behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`The region reads the existing queue from the nearest provider; it does not create another controller, queue, limit, or notification lifecycle. `,(0,p.jsx)(t.code,{children:`BreezeProvider toastLimit`}),` still controls the maximum visible queued toasts. Rendering outside `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),` throws an error.`]}),`
`,(0,p.jsx)(t.p,{children:`Because an additional region presents the same queue, careless use can duplicate visible content, announcements, focus destinations, and actions. Do not add one merely to reposition the primary stack. Prefer configuring the provider portal host and application layout where possible.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-internationalization`,children:`Accessibility, keyboard, and internationalization`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`label`}),` names the region and must distinguish it from the provider-owned primary region; when omitted it uses the provider's translated `,(0,p.jsx)(t.code,{children:`messages.notifications`}),` value. Translate an explicit label. Queued toasts retain their alert-dialog semantics, F6 region navigation, Tab and Shift+Tab action navigation, Escape dismissal, timeout behaviour, and close/action labels.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The region is fixed at the logical block start and inline end, so it follows the provider's left-to-right or right-to-left direction. The provider-owned portal carries `,(0,p.jsx)(t.code,{children:`lang`}),` and `,(0,p.jsx)(t.code,{children:`dir`}),`. Test focus movement and announcements with every region present.`]}),`
`,(0,p.jsx)(t.p,{children:`ToastRegion has no controlled/uncontrolled value, callback, loading, disabled, invalid, empty, or error state. These belong to the shared queue and application notification content.`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`ToastRegion`}),` supports relevant native `,(0,p.jsx)(t.code,{children:`div`}),` attributes, including `,(0,p.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,p.jsx)(t.code,{children:`ref`}),`; `,(0,p.jsx)(t.code,{children:`children`}),`, `,(0,p.jsx)(t.code,{children:`role`}),`, and inline `,(0,p.jsx)(t.code,{children:`style`}),` are intentionally owned or excluded.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not render `,(0,p.jsx)(t.code,{children:`ToastRegion`}),` outside `,(0,p.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not render an additional region without a tested layout and accessibility reason.`}),`
`,(0,p.jsx)(t.li,{children:`Do not give two regions the same accessible label.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not expect a region to create an independent queue or change `,(0,p.jsx)(t.code,{children:`toastLimit`}),`.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use it as a replacement for `,(0,p.jsx)(t.code,{children:`useToast`}),`.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.a,{href:`?path=/docs/feedback-toast--docs`,children:`Toast and useToast`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-alert--docs`,children:`Alert`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/foundation-breezeprovider--docs`,children:`BreezeProvider`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};