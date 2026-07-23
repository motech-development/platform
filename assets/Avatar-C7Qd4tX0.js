import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-CQHtwZcQ.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-COZjwJ0c.js";import{t as s}from"./mdx-react-shim-CpkRhXci.js";import{Initials as c,n as l,t as u}from"./Avatar.stories-BrP_Sg-N.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Accessible person or entity representation with a named image and deterministic initials fallback.`}),`
`,(0,p.jsx)(t.h1,{id:`avatar`,children:`Avatar`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Avatar`}),` represents a named person or entity with an optional image and a deterministic initials fallback.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Avatar } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Use a circular avatar for a person in account, participant, or authorship context.`}),`
`,(0,p.jsx)(t.li,{children:`Use a square avatar for a compact non-person entity marker.`}),`
`,(0,p.jsxs)(t.li,{children:[`Supply `,(0,p.jsx)(t.code,{children:`src`}),` only when an image is available; the same component handles loading failure by falling back to initials.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Logo`}),` for the canonical Motech Development brand mark.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconTile`}),` for a semantic icon or short status marker that does not represent identity.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use ordinary content and `,(0,p.jsx)(t.code,{children:`Typography`}),` when the full name is the primary information; an Avatar should not replace necessary visible identity text.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Avatar, Inline, Typography } from '@motech-development/breeze-ui';

export function PersonSummary() {
  return (
    <Inline align="center" gap="sm" wrap={false}>
      <Avatar name="Alex Morgan" />
      <Typography as="span">Alex Morgan</Typography>
    </Inline>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`image-and-fallback-behaviour`,children:`Image and fallback behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`When `,(0,p.jsx)(t.code,{children:`src`}),` is present, Avatar renders a cover-cropped image. The nested image has empty alternative text because the wrapper already exposes `,(0,p.jsx)(t.code,{children:`name`}),` once as a named image. If the resource fails to load, Avatar displays initials without changing its accessible name.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Without an `,(0,p.jsx)(t.code,{children:`initials`}),` override, Breeze trims `,(0,p.jsx)(t.code,{children:`name`}),`, takes the first character of the first two whitespace-separated words, uppercases them, and joins them. For example, “Alex Morgan” becomes “AM”. An explicit `,(0,p.jsx)(t.code,{children:`initials`}),` value is useful for an established short form or compact entity marker.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Avatar } from '@motech-development/breeze-ui';

export function EntityMarker() {
  return (
    <Avatar
      initials="EX"
      name="Example organisation"
      shape="square"
      tone="accent"
    />
  );
}
`})}),`
`,(0,p.jsx)(t.h2,{id:`shape-size-and-tone`,children:`Shape, size, and tone`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`circle`}),` is the default and is preferred for people.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`square`}),` has square corners and is preferred for non-person entity markers.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`sm`}),` and `,(0,p.jsx)(t.code,{children:`md`}),` both occupy a 36-pixel square; `,(0,p.jsx)(t.code,{children:`sm`}),` uses smaller initials. `,(0,p.jsx)(t.code,{children:`lg`}),` occupies a 56-pixel square.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`primary`}),` is the default semantic treatment. `,(0,p.jsx)(t.code,{children:`accent`}),` provides a distinct alternate entity-marker treatment.`]}),`
`]}),`
`,(0,p.jsx)(t.p,{children:`Tone applies to the initials fallback. A successfully loaded image fills the available geometry.`}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-state-and-internationalisation`,children:`Accessibility, state, and internationalisation`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native span attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-describedby`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are forwarded. `,(0,p.jsx)(t.code,{children:`children`}),` and arbitrary `,(0,p.jsx)(t.code,{children:`style`}),` are excluded so the image/fallback anatomy and canonical appearance remain stable.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Avatar exposes `,(0,p.jsx)(t.code,{children:`role="img"`}),` with `,(0,p.jsx)(t.code,{children:`name`}),` as its accessible name. Always provide the complete human-readable name even when visible initials are overridden. Place visible text beside the Avatar when users need to identify or distinguish similar people and entities; the accessible name alone is not visible context.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Avatar has no keyboard interaction and is not an action. Wrap the overall composition in an appropriate `,(0,p.jsx)(t.code,{children:`Link`}),` or `,(0,p.jsx)(t.code,{children:`Button`}),` only when it genuinely navigates or acts, and ensure that control has an unambiguous name.`]}),`
`,(0,p.jsx)(t.p,{children:`Image availability is internal fallback state, not an application-controlled value. There are no loading, disabled, invalid, error-callback, or read-only props. Breeze does not localise names. Initial derivation uppercases with JavaScript's standard Unicode behaviour and does not implement locale-specific name parsing.`}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not omit `,(0,p.jsx)(t.code,{children:`name`}),`, even when `,(0,p.jsx)(t.code,{children:`src`}),` is supplied.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not place a separate `,(0,p.jsx)(t.code,{children:`alt`}),` on the internal image; it is not public anatomy.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not use a tone to communicate status; use `,(0,p.jsx)(t.code,{children:`Badge`}),`, `,(0,p.jsx)(t.code,{children:`Alert`}),`, or visible text.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Keep explicit initials brief. Avatar does not truncate an arbitrary `,(0,p.jsx)(t.code,{children:`initials`}),` string.`]}),`
`,(0,p.jsx)(t.li,{children:`Avatar does not fetch profiles, upload images, indicate presence, or own account menus.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Logo`}),` for the Motech Development brand.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconTile`}),` for non-identity visual markers.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Badge`}),` beside identity content for a compact classification or status.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`UserMenu`}),` for the account-action pattern that may compose an Avatar.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};