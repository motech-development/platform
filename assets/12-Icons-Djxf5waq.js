import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,s as i}from"./blocks-CZIpnuKF.js";import{t as a}from"./mdx-react-shim-B0kyhCPT.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/12 Icons`,summary:`Choose, import, size and label Breeze's curated icon exports without coupling applications to Lucide.`}),`
`,(0,c.jsx)(t.h1,{id:`icons`,children:`Icons`}),`
`,(0,c.jsxs)(t.p,{children:[`Breeze exposes a curated icon set through `,(0,c.jsx)(t.code,{children:`@motech-development/breeze-ui/icons`}),`. Import named icons from that entry point; do not import Lucide through Breeze or use internal icon paths.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import {
  AddIcon,
  ExternalLinkIcon,
  WarningIcon,
} from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,c.jsx)(t.h2,{id:`sizing-and-colour`,children:`Sizing and colour`}),`
`,(0,c.jsxs)(t.p,{children:[`Every icon accepts `,(0,c.jsx)(t.code,{children:`size?: number | string`}),` and `,(0,c.jsx)(t.code,{children:`strokeWidth?: number`}),`. `,(0,c.jsx)(t.code,{children:`size`}),` defaults to `,(0,c.jsx)(t.code,{children:`1em`}),`, so an icon follows the surrounding text scale. A number is interpreted as CSS pixels; a string may be any valid CSS length. Icons use `,(0,c.jsx)(t.code,{children:`currentColor`}),`, allowing the containing Breeze component or text colour to remain authoritative.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`<AddIcon />
<AddIcon size={20} />
<AddIcon size="1.5rem" strokeWidth={1.75} />
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Use component `,(0,c.jsx)(t.code,{children:`size`}),` props and the default `,(0,c.jsx)(t.code,{children:`1em`}),` behaviour before assigning isolated icon dimensions. Do not use an icon's geometry as a spacing system.`]}),`
`,(0,c.jsx)(t.h2,{id:`decorative-and-meaningful-icons`,children:`Decorative and meaningful icons`}),`
`,(0,c.jsxs)(t.p,{children:[`Icons without `,(0,c.jsx)(t.code,{children:`aria-label`}),` are decorative: Breeze applies `,(0,c.jsx)(t.code,{children:`aria-hidden="true"`}),` and `,(0,c.jsx)(t.code,{children:`focusable="false"`}),`. This is correct when visible text or the containing control already provides the accessible name.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { Button } from '@motech-development/breeze-ui';
import { AddIcon } from '@motech-development/breeze-ui/icons';

<Button>
  <AddIcon />
  Add item
</Button>;
`})}),`
`,(0,c.jsxs)(t.p,{children:[`When a standalone icon conveys information that is not present in adjacent text, provide a concise `,(0,c.jsx)(t.code,{children:`aria-label`}),`; Breeze then exposes it as an image. For icon-only actions, prefer `,(0,c.jsx)(t.code,{children:`IconButton`}),` and label the button rather than the icon.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`<WarningIcon aria-label="Warning" />
`})}),`
`,(0,c.jsx)(t.p,{children:`Do not use an icon as the only indication of status, error or selection. Pair meaning with text or an accessible control state.`}),`
`,(0,c.jsx)(t.h2,{id:`catalogue-and-selection`,children:`Catalogue and selection`}),`
`,(0,c.jsxs)(t.p,{children:[`The attached `,(0,c.jsx)(t.a,{href:`?path=/docs/foundation-icons--docs`,children:`Icons catalogue`}),` literally documents all 32 exports and the intended meaning of each. Reuse the closest curated semantic icon. If no icon fits, first reconsider whether text is clearer; expanding the public icon catalogue is a library decision rather than an application deep-import workaround.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};