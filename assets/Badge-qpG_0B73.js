import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{VariantsAndAppearances as c,n as l,t as u}from"./Badge.stories-DnBVpHYP.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Compact non-interactive status or classification label with semantic colour and emphasis.`}),`
`,(0,p.jsx)(t.h1,{id:`badge`,children:`Badge`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Badge`}),` renders a compact, non-interactive status or classification label.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Badge } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Use for a short status, category, count label, or classification adjacent to primary content.`}),`
`,(0,p.jsxs)(t.li,{children:[`Choose `,(0,p.jsx)(t.code,{children:`variant`}),` for meaning and `,(0,p.jsx)(t.code,{children:`appearance`}),` for the amount of visual emphasis.`]}),`
`,(0,p.jsx)(t.li,{children:`Keep the label concise enough to scan as metadata.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Button`}),`, `,(0,p.jsx)(t.code,{children:`ToggleButton`}),`, or `,(0,p.jsx)(t.code,{children:`Tag`}),` when the element is interactive.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Alert`}),` for a message that needs explanatory content or announcement semantics.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Typography`}),` for sentences and supporting prose.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Meter`}),` or `,(0,p.jsx)(t.code,{children:`ProgressBar`}),` for a measurable value rather than encoding progress as badge colour.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Badge, Inline, Typography } from '@motech-development/breeze-ui';

export function ItemStatus() {
  return (
    <Inline align="center" gap="sm" wrap={false}>
      <Typography as="span">Quarterly report</Typography>
      <Badge variant="success">Complete</Badge>
    </Inline>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`variants`,children:`Variants`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Variant`}),(0,p.jsx)(t.th,{children:`Intended use`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`primary`})}),(0,p.jsx)(t.td,{children:`Current or product-primary classification.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`secondary`})}),(0,p.jsx)(t.td,{children:`Neutral metadata; the default.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`success`})}),(0,p.jsx)(t.td,{children:`Successful or complete state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`danger`})}),(0,p.jsx)(t.td,{children:`Failed, destructive, or high-severity state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`warning`})}),(0,p.jsx)(t.td,{children:`State needing attention or caution.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`info`})}),(0,p.jsx)(t.td,{children:`Informational state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`light`})}),(0,p.jsx)(t.td,{children:`Low-emphasis label on an ordinary or dark-enough contrasting context.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`dark`})}),(0,p.jsx)(t.td,{children:`Dark high-contrast label on a light context.`})]})]})]}),`
`,(0,p.jsx)(t.p,{children:`The visible text must state the meaning; never rely on colour alone. Use one variant consistently for the same state within a product flow.`}),`
`,(0,p.jsx)(t.h2,{id:`appearances`,children:`Appearances`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`subtle`}),` is the default and works for most metadata. `,(0,p.jsx)(t.code,{children:`solid`}),` has the highest filled emphasis. `,(0,p.jsx)(t.code,{children:`outline`}),` uses a transparent background with a semantic border. `,(0,p.jsx)(t.code,{children:`ghost`}),` removes the visible border and background for the lightest treatment. Appearance does not change semantics or announce content.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`state-accessibility-and-behaviour`,children:`State, accessibility, and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Badge forwards relevant native span attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, `,(0,p.jsx)(t.code,{children:`data-*`}),`, and event-independent text attributes. Arbitrary inline `,(0,p.jsx)(t.code,{children:`style`}),` is not a public styling contract.`]}),`
`,(0,p.jsx)(t.p,{children:`Badge is a plain non-interactive span. It has no keyboard behaviour and no controlled, uncontrolled, disabled, invalid, loading, empty, error, or read-only state. Empty badges provide no useful information and should not be rendered.`}),`
`,(0,p.jsxs)(t.p,{children:[`Dynamic Badge text is not automatically announced. If a change requires immediate assistive-technology attention, use the appropriate `,(0,p.jsx)(t.code,{children:`Alert`}),`, `,(0,p.jsx)(t.code,{children:`Toast`}),`, or application-owned live-region pattern rather than adding live semantics indiscriminately.`]}),`
`,(0,p.jsx)(t.p,{children:`Keep wording understandable when colours are unavailable or forced-colour mode changes presentation. Badge content follows provider direction but is not translated or formatted by the component.`}),`
`,(0,p.jsx)(t.h2,{id:`styling-and-composition`,children:`Styling and composition`}),`
`,(0,p.jsxs)(t.p,{children:[`Badge has a canonical compact height, rounded geometry, display font, and content padding. Use `,(0,p.jsx)(t.code,{children:`className`}),` for placement in a parent layout, not to invent new variants, sizes, or shapes. Long content wraps, but a label that becomes a sentence belongs in Typography or Alert.`]}),`
`,(0,p.jsx)(t.p,{children:`Icons may accompany text when they reinforce meaning, but keep them decorative and retain a visible label. An icon-only Badge is generally ambiguous.`}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not attach click handlers or present Badge as a control.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`danger`}),`, `,(0,p.jsx)(t.code,{children:`warning`}),`, or `,(0,p.jsx)(t.code,{children:`success`}),` without explicit wording.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not put lengthy explanations inside the compact label.`}),`
`,(0,p.jsx)(t.li,{children:`Do not use appearance as a state model; it controls emphasis only.`}),`
`,(0,p.jsx)(t.li,{children:`Badge does not own counts, status transitions, or announcements.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Tag`}),` for an individual interactive or removable item.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Alert`}),` for explanatory feedback.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconTile`}),` for a larger visual marker.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Typography`}),` for ordinary metadata and prose.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};