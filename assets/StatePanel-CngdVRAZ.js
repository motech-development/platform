import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{Empty as c,n as l,t as u}from"./StatePanel.stories-Co0KNXA8.js";function d(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Complete contextual panel for an empty, error, success, warning, or informational region with guidance and optional recovery.`}),`
`,(0,p.jsx)(t.h1,{id:`statepanel`,children:`StatePanel`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`StatePanel`}),` replaces a substantial content region with a clear state, explanation, and optional next step.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, StatePanel } from '@motech-development/breeze-ui';
import { InfoIcon } from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use it for an empty view, failed region, completed setup, blocked state, or substantial informational state. Use `,(0,p.jsx)(t.code,{children:`Alert`}),` for inline feedback that should remain beside content, `,(0,p.jsx)(t.code,{children:`Toast`}),` for transient queued feedback, `,(0,p.jsx)(t.code,{children:`Skeleton`}),` or `,(0,p.jsx)(t.code,{children:`Spinner`}),` for pending work, and a field's `,(0,p.jsx)(t.code,{children:`Error`}),` part for validation.`]}),`
`,(0,p.jsx)(t.p,{children:`The application owns state detection, retries, permissions, analytics, and domain copy. The pattern does not infer state from data or perform recovery.`}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, StatePanel } from '@motech-development/breeze-ui';
import { InfoIcon } from '@motech-development/breeze-ui/icons';

<StatePanel
  action={<Button onAction={() => createItem()}>Create item</Button>}
  description="Create the first item to begin using this screen."
  icon={<InfoIcon />}
  title="No items yet"
  variant="info"
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-variants-and-state`,children:`Anatomy, variants, and state`}),`
`,(0,p.jsxs)(t.p,{children:[`The root is a `,(0,p.jsx)(t.code,{children:`section`}),` labelled by its generated `,(0,p.jsx)(t.code,{children:`h2`}),`. A large decorative `,(0,p.jsx)(t.code,{children:`IconTile`}),` sits beside the title and description; the optional action moves below the copy and stretches on compact screens. There are no public compound parts.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`variant`}),` controls semantic marker colour and defaults to `,(0,p.jsx)(t.code,{children:`info`}),`:`]}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Variant`}),(0,p.jsx)(t.th,{children:`Typical use`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`info`})}),(0,p.jsx)(t.td,{children:`Neutral guidance or an empty state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`primary`})}),(0,p.jsx)(t.td,{children:`A constructive product next step.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`success`})}),(0,p.jsx)(t.td,{children:`A completed outcome that deserves a full-region state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`warning`})}),(0,p.jsx)(t.td,{children:`A condition requiring care before proceeding.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`danger`})}),(0,p.jsx)(t.td,{children:`A failure or blocked condition requiring recovery.`})]})]})]}),`
`,(0,p.jsx)(t.p,{children:`Colour does not set announcement behaviour or application status. Use explicit title and description copy. The pattern has no controlled, uncontrolled, read-only, disabled, loading, or invalid props. Disable or load the slotted action itself. For pending content, prefer progress feedback rather than describing loading as an error state.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-keyboard-and-internationalisation`,children:`Accessibility, keyboard, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`title`}),` supplies the region's accessible name and must identify the actual state. The icon tile is decorative by default; do not rely on its shape, icon, or colour to communicate meaning. Keep guidance actionable and put one clear recovery or next-step control in `,(0,p.jsx)(t.code,{children:`action`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The panel is not a live region by default. For newly inserted urgent errors, choose `,(0,p.jsx)(t.code,{children:`Alert`}),` or deliberately add an appropriate native `,(0,p.jsx)(t.code,{children:`role`}),`/`,(0,p.jsx)(t.code,{children:`aria-live`}),` attribute only when immediate announcement is required; avoid repeated announcements during re-renders. The panel itself has no keyboard interaction, while the slotted action retains its own keyboard and callback semantics.`]}),`
`,(0,p.jsx)(t.p,{children:`Translate all visible copy. Logical grid placement and alignment follow provider direction. Choose direction-neutral icons where possible; application-authored directional icons must account for right-to-left presentation.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`danger`}),` colour as the only error signal, place several competing actions in the slot, show an empty-state panel while data is merely pending, or assume insertion is announced. Related components: `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-alert--docs`,children:`Alert`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-skeleton--docs`,children:`Skeleton`}),`, `,(0,p.jsx)(t.a,{href:`?path=/docs/feedback-spinner--docs`,children:`Spinner`}),`, and `,(0,p.jsx)(t.a,{href:`?path=/docs/foundation-icontile--docs`,children:`IconTile`}),`.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};