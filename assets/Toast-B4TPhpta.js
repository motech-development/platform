import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{ProviderQueueAndAction as c,StandaloneSemanticOwner as l,Variants as u,n as d,t as f}from"./Toast.stories-DwxEIxvF.js";function p(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(o,{of:f,summary:`Provider-scoped notification queue controlled by useToast, plus an explicitly controlled standalone Toast for specialised semantic ownership.`}),`
`,(0,h.jsx)(t.h1,{id:`toast`,children:`Toast`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`Toast`}),` provides transient, interactive notifications. Prefer the `,(0,h.jsx)(t.code,{children:`useToast`}),` controller for the queue owned by the nearest `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),`; use standalone `,(0,h.jsx)(t.code,{children:`Toast`}),` only when the application must own placement and lifecycle itself.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { Toast, useToast } from '@motech-development/breeze-ui';
`})}),`
`,(0,h.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,h.jsxs)(t.p,{children:[`Use a toast for a brief update that does not need to remain in the page, such as confirmation after an action. Use `,(0,h.jsx)(t.a,{href:`?path=/docs/feedback-alert--docs`,children:`Alert`}),` for persistent inline feedback, field `,(0,h.jsx)(t.code,{children:`Error`}),` parts for validation, `,(0,h.jsx)(t.a,{href:`?path=/docs/primitives-overlays-alertdialog--docs`,children:`AlertDialog`}),` for a decision that blocks progress, and `,(0,h.jsx)(t.a,{href:`?path=/docs/patterns-feedback-statepanel--docs`,children:`StatePanel`}),` for a substantial page state.`]}),`
`,(0,h.jsx)(t.p,{children:`Do not put critical instructions, long-form content, or the only recovery path in an auto-dismissing toast.`}),`
`,(0,h.jsx)(t.h2,{id:`queued-notifications`,children:`Queued notifications`}),`
`,(0,h.jsxs)(t.p,{children:[`Call `,(0,h.jsx)(t.code,{children:`useToast`}),` beneath `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),`. `,(0,h.jsx)(t.code,{children:`show(options)`}),` adds a provider-scoped notification and returns its string queue identifier; `,(0,h.jsx)(t.code,{children:`dismiss(id)`}),` closes that notification. The provider renders the primary labelled `,(0,h.jsx)(t.code,{children:`ToastRegion`}),` automatically and shows at most `,(0,h.jsx)(t.code,{children:`toastLimit`}),` notifications, which defaults to `,(0,h.jsx)(t.code,{children:`3`}),`.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { Button, useToast } from '@motech-development/breeze-ui';

export function SaveButton() {
  const toast = useToast();

  return (
    <Button
      onAction={() => {
        toast.show({
          description: 'The revised record is now available.',
          lifetime: 5000,
          title: 'Changes saved',
          variant: 'success',
        });
      }}
    >
      Save changes
    </Button>
  );
}
`})}),`
`,(0,h.jsx)(a,{of:c}),`
`,(0,h.jsx)(t.h2,{id:`content-actions-and-lifecycle`,children:`Content, actions, and lifecycle`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`title`}),` is required and supplies the notification's primary accessible name. `,(0,h.jsx)(t.code,{children:`description`}),` is optional supporting content. Both are application-owned `,(0,h.jsx)(t.code,{children:`ReactNode`}),` and must be translated.`]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`action`}),` is `,(0,h.jsx)(t.code,{children:`{ label: ReactNode, onAction: () => void }`}),`. Activating it calls `,(0,h.jsx)(t.code,{children:`onAction`}),` once and dismisses the toast. Use one concise action; it must be safe after the initiating context changes. Every toast also has a Breeze-labelled close button.`]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`lifetime`}),` is milliseconds: the default is `,(0,h.jsx)(t.code,{children:`5000`}),`, `,(0,h.jsx)(t.code,{children:`null`}),` persists until dismissal, and `,(0,h.jsx)(t.code,{children:`0`}),` dismisses immediately. Other values must be finite and non-negative or `,(0,h.jsx)(t.code,{children:`show`}),` throws `,(0,h.jsx)(t.code,{children:`RangeError`}),`. `,(0,h.jsx)(t.code,{children:`onDismiss`}),` runs once when a queued toast is dismissed, including action, close, timeout, immediate close, or controller dismissal, but not during provider teardown. Do not use it as the only persistence mechanism.`]}),`
`,(0,h.jsx)(t.p,{children:`The queue identifier belongs to the current provider and should be treated as opaque. Controllers and identifiers must not be reused across provider boundaries.`}),`
`,(0,h.jsx)(t.h2,{id:`standalone-toast`,children:`Standalone Toast`}),`
`,(0,h.jsxs)(t.p,{children:[`Standalone `,(0,h.jsx)(t.code,{children:`Toast`}),` is an explicitly controlled `,(0,h.jsx)(t.code,{children:`role="alertdialog"`}),` with polite, atomic announcement semantics. Supply `,(0,h.jsx)(t.code,{children:`onDismiss`}),` and remove it from application state when called. Its action calls `,(0,h.jsx)(t.code,{children:`action.onAction`}),` and then `,(0,h.jsx)(t.code,{children:`onDismiss`}),`. `,(0,h.jsx)(t.code,{children:`closeLabel`}),` defaults to the provider's translated close message.`]}),`
`,(0,h.jsx)(t.pre,{children:(0,h.jsx)(t.code,{className:`language-tsx`,children:`import { Toast } from '@motech-development/breeze-ui';

export function ControlledNotification({ dismiss }: { dismiss: () => void }) {
  return (
    <Toast
      description="One live owner avoids duplicate announcements."
      onDismiss={dismiss}
      title="Controlled notification"
      variant="info"
    />
  );
}
`})}),`
`,(0,h.jsx)(a,{of:l}),`
`,(0,h.jsx)(t.h2,{id:`variants-and-state`,children:`Variants and state`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`variant`}),` accepts `,(0,h.jsx)(t.code,{children:`primary`}),`, `,(0,h.jsx)(t.code,{children:`secondary`}),`, `,(0,h.jsx)(t.code,{children:`success`}),`, `,(0,h.jsx)(t.code,{children:`danger`}),`, `,(0,h.jsx)(t.code,{children:`warning`}),`, `,(0,h.jsx)(t.code,{children:`info`}),`, `,(0,h.jsx)(t.code,{children:`light`}),`, or `,(0,h.jsx)(t.code,{children:`dark`}),` and defaults to `,(0,h.jsx)(t.code,{children:`info`}),`. Choose by message meaning, not decoration; colour is supplemental to the title and description.`]}),`
`,(0,h.jsx)(t.p,{children:`Toast has no loading, disabled, invalid, empty, or error prop. Express those situations in translated content and choose a semantic variant. Do not disable dismissal while work is pending. Repeated updates should normally update application state or use a persistent status rather than flooding the queue.`}),`
`,(0,h.jsx)(a,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`keyboard-accessibility-and-direction`,children:`Keyboard, accessibility, and direction`}),`
`,(0,h.jsxs)(t.p,{children:[`Queued toasts are placed in a labelled landmark region and exposed as interactive alert dialogs. React Aria's toast-region keyboard model lets keyboard users move to the region with F6, then use Tab and Shift+Tab among toast actions and close buttons; Escape dismisses the focused toast. Standalone `,(0,h.jsx)(t.code,{children:`Toast`}),` is focusable and its action and close controls use normal button keyboard activation. Never remove visible focus treatment or duplicate the same message in another live region.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Translate titles, descriptions, action labels, and any standalone `,(0,h.jsx)(t.code,{children:`closeLabel`}),`. Override the provider `,(0,h.jsx)(t.code,{children:`messages.close`}),` and `,(0,h.jsx)(t.code,{children:`messages.notifications`}),` for Breeze-owned queue labels. Logical inline placement follows the provider direction, and the provider-owned portal carries its locale and direction.`]}),`
`,(0,h.jsxs)(t.p,{children:[`Standalone `,(0,h.jsx)(t.code,{children:`Toast`}),` supports relevant native `,(0,h.jsx)(t.code,{children:`div`}),` attributes, including `,(0,h.jsx)(t.code,{children:`className`}),`, ARIA and data attributes, events, and a typed `,(0,h.jsx)(t.code,{children:`ref`}),`; `,(0,h.jsx)(t.code,{children:`children`}),`, `,(0,h.jsx)(t.code,{children:`role`}),`, inline `,(0,h.jsx)(t.code,{children:`style`}),`, and the native `,(0,h.jsx)(t.code,{children:`title`}),` attribute are intentionally owned or excluded.`]}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(i,{}),`
`,(0,h.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,h.jsxs)(t.ul,{children:[`
`,(0,h.jsxs)(t.li,{children:[`Do not call `,(0,h.jsx)(t.code,{children:`useToast`}),` outside `,(0,h.jsx)(t.code,{children:`BreezeProvider`}),`.`]}),`
`,(0,h.jsxs)(t.li,{children:[`Do not render another primary `,(0,h.jsx)(t.code,{children:`ToastRegion`}),`; the provider already owns one.`]}),`
`,(0,h.jsxs)(t.li,{children:[`Do not set `,(0,h.jsx)(t.code,{children:`lifetime={null}`}),` for routine confirmations that should clear themselves.`]}),`
`,(0,h.jsx)(t.li,{children:`Do not place multiple competing actions or long interactive workflows in a toast.`}),`
`,(0,h.jsxs)(t.li,{children:[`Do not retain a standalone toast after `,(0,h.jsx)(t.code,{children:`onDismiss`}),` fires.`]}),`
`,(0,h.jsxs)(t.li,{children:[`Do not duplicate one notification through both the queue and standalone `,(0,h.jsx)(t.code,{children:`Toast`}),`.`]}),`
`]}),`
`,(0,h.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.a,{href:`?path=/docs/feedback-toastregion--docs`,children:`ToastRegion`}),`, `,(0,h.jsx)(t.a,{href:`?path=/docs/feedback-alert--docs`,children:`Alert`}),`, `,(0,h.jsx)(t.a,{href:`?path=/docs/primitives-overlays-alertdialog--docs`,children:`AlertDialog`}),`, and `,(0,h.jsx)(t.a,{href:`?path=/docs/foundation-breezeprovider--docs`,children:`BreezeProvider`}),`.`]})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;e((()=>{h=t(),s(),r(),d()}))();export{m as default};