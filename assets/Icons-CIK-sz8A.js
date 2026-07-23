import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,r as i,s as a}from"./blocks-COZjwJ0c.js";import{t as o}from"./mdx-react-shim-CpkRhXci.js";import{Catalogue as s,MeaningfulIcon as c,n as l,t as u}from"./index.stories-Y3VMK0j_.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{of:u,summary:`Curated catalogue of all 32 Breeze icon exports, with sizing and accessibility guidance.`}),`
`,(0,p.jsx)(t.h1,{id:`icons`,children:`Icons`}),`
`,(0,p.jsxs)(t.p,{children:[`Breeze exports a curated set of 32 interface icons through its dedicated `,(0,p.jsx)(t.code,{children:`/icons`}),` subpath. Each wrapper has a stable Breeze name, inherits the surrounding text colour, and is decorative by default.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  AddIcon,
  CheckIcon,
  SearchIcon,
  type IconProps,
} from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Do not import icon implementations from `,(0,p.jsx)(t.code,{children:`lucide-react`}),`, Breeze source paths, or the package root. Import only the named icons a module uses.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Choose the icon whose documented meaning most closely matches the interface concept.`}),`
`,(0,p.jsx)(t.li,{children:`Compose decorative icons beside visible labels in Breeze actions, links, fields, and markers.`}),`
`,(0,p.jsxs)(t.li,{children:[`Add `,(0,p.jsx)(t.code,{children:`aria-label`}),` only when the standalone glyph itself provides information not expressed in nearby text.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Logo`}),` for the Motech Development brand mark.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Avatar`}),` for a person or entity identity.`]}),`
`,(0,p.jsx)(t.li,{children:`Use text instead when no curated icon clearly communicates the concept.`}),`
`,(0,p.jsx)(t.li,{children:`Do not use icons as decoration without functional or information value, or rely on a glyph as the only cue for a complex or unfamiliar concept.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button } from '@motech-development/breeze-ui';
import { AddIcon } from '@motech-development/breeze-ui/icons';

export function AddItemButton() {
  return (
    <Button>
      <AddIcon />
      Add item
    </Button>
  );
}
`})}),`
`,(0,p.jsx)(i,{of:s}),`
`,(0,p.jsx)(t.h2,{id:`catalogue`,children:`Catalogue`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Export`}),(0,p.jsx)(t.th,{children:`Intended meaning`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`AddIcon`})}),(0,p.jsx)(t.td,{children:`Create or add an item.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ArrowLeftIcon`})}),(0,p.jsx)(t.td,{children:`Leftward movement or navigation.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ArrowRightIcon`})}),(0,p.jsx)(t.td,{children:`Rightward movement or navigation.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`BuildingIcon`})}),(0,p.jsx)(t.td,{children:`Organisation, workplace, or company details.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`CalendarIcon`})}),(0,p.jsx)(t.td,{children:`Date, schedule, or calendar surface.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ChartIcon`})}),(0,p.jsx)(t.td,{children:`Summary, dashboard, trend, or analytics.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`CheckIcon`})}),(0,p.jsx)(t.td,{children:`Completed, confirmed, or selected state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ChevronDownIcon`})}),(0,p.jsx)(t.td,{children:`Downward disclosure or movement.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ChevronLeftIcon`})}),(0,p.jsx)(t.td,{children:`Leftward disclosure or compact navigation.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ChevronRightIcon`})}),(0,p.jsx)(t.td,{children:`Rightward disclosure or compact navigation.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ChevronUpIcon`})}),(0,p.jsx)(t.td,{children:`Upward disclosure or movement.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`CloseIcon`})}),(0,p.jsx)(t.td,{children:`Close, dismiss, or clear.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DeleteIcon`})}),(0,p.jsx)(t.td,{children:`Destructive removal.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`DownloadIcon`})}),(0,p.jsx)(t.td,{children:`Download or obtain a resource.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`EditIcon`})}),(0,p.jsx)(t.td,{children:`Edit or modify content.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ExternalLinkIcon`})}),(0,p.jsx)(t.td,{children:`Destination outside the current application or browsing context.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`EyeIcon`})}),(0,p.jsx)(t.td,{children:`Show, reveal, or visible state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`EyeOffIcon`})}),(0,p.jsx)(t.td,{children:`Hide, conceal, or hidden state.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`FileTextIcon`})}),(0,p.jsx)(t.td,{children:`Document, report, or written record.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`HelpIcon`})}),(0,p.jsx)(t.td,{children:`Contextual help or guidance.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`InfoIcon`})}),(0,p.jsx)(t.td,{children:`Neutral information.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`MenuIcon`})}),(0,p.jsx)(t.td,{children:`Open compact navigation or a menu surface.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`MoreIcon`})}),(0,p.jsx)(t.td,{children:`Additional actions or options.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`PaperclipIcon`})}),(0,p.jsx)(t.td,{children:`File attachment.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`SearchIcon`})}),(0,p.jsx)(t.td,{children:`Search or query.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`SettingsIcon`})}),(0,p.jsx)(t.td,{children:`Settings or configuration.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`SignOutIcon`})}),(0,p.jsx)(t.td,{children:`End an authenticated session.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`UploadIcon`})}),(0,p.jsx)(t.td,{children:`Upload or supply a resource.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`UserIcon`})}),(0,p.jsx)(t.td,{children:`Person, account, or individual identity.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`UsersIcon`})}),(0,p.jsx)(t.td,{children:`Group, team, or collection of people.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`WalletIcon`})}),(0,p.jsx)(t.td,{children:`Money, wallet, or transaction context.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`WarningIcon`})}),(0,p.jsx)(t.td,{children:`Caution, risk, or warning state.`})]})]})]}),`
`,(0,p.jsx)(t.p,{children:`Names express the stable public contract; the underlying artwork may evolve. Directional meanings are literal. In a right-to-left interface, choose the arrow or chevron matching the intended physical or navigation direction rather than assuming automatic mirroring.`}),`
`,(0,p.jsx)(t.h2,{id:`decorative-and-meaningful-icons`,children:`Decorative and meaningful icons`}),`
`,(0,p.jsxs)(t.p,{children:[`Without an `,(0,p.jsx)(t.code,{children:`aria-label`}),`, every icon renders with `,(0,p.jsx)(t.code,{children:`aria-hidden="true"`}),` and `,(0,p.jsx)(t.code,{children:`focusable="false"`}),`. This is correct beside visible text:`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Link } from '@motech-development/breeze-ui';
import { ExternalLinkIcon } from '@motech-development/breeze-ui/icons';

export function ExternalLink() {
  return (
    <Link href="https://example.com" rel="noreferrer" target="_blank">
      External guidance <ExternalLinkIcon />
    </Link>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[`When the icon itself is meaningful, `,(0,p.jsx)(t.code,{children:`aria-label`}),` removes `,(0,p.jsx)(t.code,{children:`aria-hidden`}),` and adds `,(0,p.jsx)(t.code,{children:`role="img"`}),`. The label must name the information conveyed, not describe the artwork:`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { InfoIcon } from '@motech-development/breeze-ui/icons';

export function InformationStatus() {
  return <InfoIcon aria-label="Information" size={24} />;
}
`})}),`
`,(0,p.jsx)(i,{of:c}),`
`,(0,p.jsx)(t.p,{children:`For icon-only actions, prefer the action component's accessible-label API or visually hidden action text so the control is named as a verb. “Delete item” is a useful button name; “trash icon” is not. Icons never enter the tab order themselves.`}),`
`,(0,p.jsx)(t.h2,{id:`sizing-and-colour`,children:`Sizing and colour`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`size`}),` defaults to `,(0,p.jsx)(t.code,{children:`1em`}),` and accepts a CSS-pixel number or CSS length such as `,(0,p.jsx)(t.code,{children:`'1.25rem'`}),`. Both rendered width and height use that value. The default aligns naturally with surrounding text and responds to a parent's text size, including inside `,(0,p.jsx)(t.code,{children:`IconTile`}),`.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Icons use `,(0,p.jsx)(t.code,{children:`currentColor`}),`, so they inherit the text colour of the containing Breeze component. Use semantic component variants for colour whenever possible. All icons use Lucide strokes, including the warning triangle rendered by `,(0,p.jsx)(t.code,{children:`WarningIcon`}),`. `,(0,p.jsx)(t.code,{children:`strokeWidth`}),` defaults to `,(0,p.jsx)(t.code,{children:`2`}),` and adjusts stroke detail, but should normally retain the canonical value.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Inline } from '@motech-development/breeze-ui';
import { CheckIcon } from '@motech-development/breeze-ui/icons';

export function IconSizes() {
  return (
    <Inline align="center" gap="md" wrap={false}>
      <CheckIcon />
      <CheckIcon size={20} />
      <CheckIcon size="1.5rem" />
    </Inline>
  );
}
`})}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Prop`}),(0,p.jsx)(t.th,{children:`Type`}),(0,p.jsx)(t.th,{children:`Default`}),(0,p.jsx)(t.th,{children:`Description`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`size`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`number | string`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`'1em'`})}),(0,p.jsx)(t.td,{children:`CSS-pixel number or CSS length used for both width and height.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`strokeWidth`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`number`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`2`})}),(0,p.jsx)(t.td,{children:`Stroke thickness for line artwork and warning detail.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`aria-label`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`string`})}),(0,p.jsx)(t.td,{children:`—`}),(0,p.jsx)(t.td,{children:`Makes the icon a named semantic image; omission makes it decorative.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`className`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`string`})}),(0,p.jsx)(t.td,{children:`—`}),(0,p.jsx)(t.td,{children:`Placement and composition classes.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`color`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`string`})}),(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`currentColor`})}),(0,p.jsx)(t.td,{children:`Relevant native SVG colour attribute; inheriting from the parent is preferred.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`ref`})}),(0,p.jsx)(t.td,{children:`not exposed`}),(0,p.jsx)(t.td,{children:`—`}),(0,p.jsx)(t.td,{children:`Curated icons do not currently expose a ref prop.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`Other relevant native SVG attributes, including `,(0,p.jsx)(t.code,{children:`aria-describedby`}),`, `,(0,p.jsx)(t.code,{children:`data-*`}),`, `,(0,p.jsx)(t.code,{children:`id`}),`, and presentation attributes, are accepted. `,(0,p.jsx)(t.code,{children:`children`}),`, `,(0,p.jsx)(t.code,{children:`height`}),`, and `,(0,p.jsx)(t.code,{children:`width`}),` are excluded. A supplied `,(0,p.jsx)(t.code,{children:`style`}),` may provide relevant SVG presentation properties, but `,(0,p.jsx)(t.code,{children:`size`}),` remains the supported width and height API and semantic component variants remain the supported colour route.`]}),`
`,(0,p.jsx)(t.h2,{id:`state-internationalisation-and-limitations`,children:`State, internationalisation, and limitations`}),`
`,(0,p.jsx)(t.p,{children:`Icons have no controlled, uncontrolled, disabled, loading, invalid, empty, error, or read-only state. The owning component exposes and communicates those states. Icons do not announce changes; use visible text and the appropriate alert, toast, progress, or field semantics.`}),`
`,(0,p.jsxs)(t.p,{children:[`Accessible labels are application copy and must be translated. The artwork itself is not localised. Test directional icons in both `,(0,p.jsx)(t.code,{children:`ltr`}),` and `,(0,p.jsx)(t.code,{children:`rtl`}),` compositions because icons are not automatically mirrored.`]}),`
`,(0,p.jsx)(t.p,{children:`Do not infer availability of any Lucide glyph that is not listed in the catalogue. New icons require a Breeze public API decision. Do not inspect or target generated SVG paths, classes, or underlying library names.`}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconTile`}),` for a canonical semantic marker surface.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconButton`}),` for an icon-only action with an explicit accessible label.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Logo`}),` for the brand mark and `,(0,p.jsx)(t.code,{children:`Avatar`}),` for identity.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Badge`}),`, `,(0,p.jsx)(t.code,{children:`Alert`}),`, or `,(0,p.jsx)(t.code,{children:`Typography`}),` to state meaning in words.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),o(),r(),l()}))();export{f as default};