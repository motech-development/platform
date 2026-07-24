import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{AccessibleIconAction as c,n as l,t as u}from"./VisuallyHidden.stories-CWcJtzhz.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Visually concealed span whose content remains available to assistive technology.`}),`
`,(0,p.jsx)(t.h1,{id:`visuallyhidden`,children:`VisuallyHidden`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`VisuallyHidden`}),` removes supporting content from visual layout while keeping it available to assistive technology.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { VisuallyHidden } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Add a concise accessible name when visible context and a decorative icon are sufficient for sighted users.`}),`
`,(0,p.jsx)(t.li,{children:`Add non-visual clarification to otherwise ambiguous visible text.`}),`
`,(0,p.jsx)(t.li,{children:`Supply an accessible table or collection label where a visible heading would be redundant in context.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Prefer a visible label whenever space and design allow; visible instructions benefit more users.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Tooltip`}),` for supplementary information that sighted pointer and keyboard users also need.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`SkipLink`}),` for a focusable bypass link; VisuallyHidden does not reveal content on focus.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use it to hide decorative content from assistive technology. Use `,(0,p.jsx)(t.code,{children:`aria-hidden="true"`}),` or the icon's decorative default instead.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, VisuallyHidden } from '@motech-development/breeze-ui';
import { MenuIcon } from '@motech-development/breeze-ui/icons';

export function NavigationButton() {
  return (
    <Button>
      <MenuIcon />
      <VisuallyHidden>Open navigation</VisuallyHidden>
    </Button>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-behaviour`,children:`Anatomy and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`VisuallyHidden renders one `,(0,p.jsx)(t.code,{children:`span`}),`. Its one-pixel clipped box remains in the accessibility tree but does not occupy ordinary visual layout. The component adds no roles, labels, relationships, live-region behaviour, or keyboard interaction of its own; those come from the parent semantic element and the hidden content.`]}),`
`,(0,p.jsx)(t.p,{children:`The text becomes part of the accessible name when composed inside controls that derive their name from children. Test the final control by role and accessible name rather than assuming the relationship.`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Link, VisuallyHidden } from '@motech-development/breeze-ui';

export function ReportLink() {
  return (
    <Link href="/reports/quarterly">
      Quarterly report
      <VisuallyHidden> (PDF, opens in the current tab)</VisuallyHidden>
    </Link>
  );
}
`})}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-internationalisation`,children:`Accessibility and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native span attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`lang`}),`, `,(0,p.jsx)(t.code,{children:`dir`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are forwarded. Arbitrary inline `,(0,p.jsx)(t.code,{children:`style`}),` is intentionally excluded.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Write hidden text in the same plain language and locale as the control it describes. It follows the provider's direction and language unless a native `,(0,p.jsx)(t.code,{children:`lang`}),` or `,(0,p.jsx)(t.code,{children:`dir`}),` override is supplied for genuinely mixed-language content.`]}),`
`,(0,p.jsx)(t.p,{children:`Do not place focusable controls inside VisuallyHidden. Keyboard users could focus an element they cannot see, and the component has no focus-reveal treatment. Do not hide essential instructions solely from sighted users or duplicate visible text word-for-word unless the duplicate is required for a specific semantic relationship.`}),`
`,(0,p.jsx)(t.p,{children:`VisuallyHidden has no controlled, uncontrolled, disabled, loading, invalid, error, empty, or read-only state. Empty hidden content has no effect and should be omitted.`}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not use it as a general-purpose CSS hiding utility.`}),`
`,(0,p.jsx)(t.li,{children:`Do not conceal validation errors or instructions that all users need.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not put `,(0,p.jsx)(t.code,{children:`Button`}),`, `,(0,p.jsx)(t.code,{children:`Link`}),`, inputs, or other focusable descendants inside it.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not override clipping, positioning, dimensions, or overflow through `,(0,p.jsx)(t.code,{children:`className`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Hidden text may affect speech output and voice-control names even though it is not visible; keep it concise and consistent with visible wording.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`SkipLink`}),` for a keyboard-visible bypass control.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Tooltip`}),` for supplementary information available visually on hover and focus.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use icon `,(0,p.jsx)(t.code,{children:`aria-label`}),` when a meaningful standalone icon is the semantic image, rather than merely naming a parent control.`]}),`
`,(0,p.jsx)(t.li,{children:`Use visible field label and description parts for form guidance.`}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};