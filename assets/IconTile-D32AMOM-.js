import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,n as i,r as a,s as o}from"./blocks-BKOn9Gx8.js";import{t as s}from"./mdx-react-shim-y1jXGhTh.js";import{SemanticTiles as c,n as l,t as u}from"./IconTile.stories-C7CKx2UU.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Non-interactive semantic presentation tile for curated icons and short visual markers.`}),`
`,(0,p.jsx)(t.h1,{id:`icontile`,children:`IconTile`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`IconTile`}),` places an icon or short marker in canonical geometry with constrained semantic colour emphasis.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { IconTile } from '@motech-development/breeze-ui';
import { CalendarIcon } from '@motech-development/breeze-ui/icons';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Use as a supporting visual marker in a header, state panel, summary, or record.`}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`variant`}),` to reinforce a meaning already expressed in text.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`decorative={false}`}),` only when the marker contributes information not available in nearby text.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconButton`}),` when the icon activates an action; IconTile is not interactive.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Avatar`}),` when the content represents a named person or entity.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Badge`}),` for compact visible status text.`]}),`
`,(0,p.jsx)(t.li,{children:`Use a curated icon directly when no enclosing geometry or semantic surface is needed.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-use`,children:`Basic use`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { IconTile, Inline, Typography } from '@motech-development/breeze-ui';
import { CalendarIcon } from '@motech-development/breeze-ui/icons';

export function ScheduleSummary() {
  return (
    <Inline align="center" gap="sm" wrap={false}>
      <IconTile variant="info">
        <CalendarIcon />
      </IconTile>
      <Typography>Next review date</Typography>
    </Inline>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-mode`,children:`Accessibility mode`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`decorative`}),` defaults to `,(0,p.jsx)(t.code,{children:`true`}),`, adding `,(0,p.jsx)(t.code,{children:`aria-hidden="true"`}),` to the whole tile. This is correct when adjacent visible text supplies the meaning. Any accessible label on a nested icon is also hidden by the tile.`]}),`
`,(0,p.jsx)(t.p,{children:`When the marker is the only source of information, expose it and name the meaningful child:`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { IconTile } from '@motech-development/breeze-ui';
import { WarningIcon } from '@motech-development/breeze-ui/icons';

export function WarningMarker() {
  return (
    <IconTile decorative={false} variant="warning">
      <WarningIcon aria-label="Needs attention" />
    </IconTile>
  );
}
`})}),`
`,(0,p.jsxs)(t.p,{children:[`For visible short text such as a status code, `,(0,p.jsx)(t.code,{children:`decorative={false}`}),` exposes that text naturally. Do not expose both a marker and adjacent text with the same wording if that creates repetitive announcements.`]}),`
`,(0,p.jsx)(t.h2,{id:`variants-geometry-and-size`,children:`Variants, geometry, and size`}),`
`,(0,p.jsxs)(t.p,{children:[`Variants are `,(0,p.jsx)(t.code,{children:`primary`}),`, `,(0,p.jsx)(t.code,{children:`secondary`}),`, `,(0,p.jsx)(t.code,{children:`success`}),`, `,(0,p.jsx)(t.code,{children:`danger`}),`, `,(0,p.jsx)(t.code,{children:`warning`}),`, `,(0,p.jsx)(t.code,{children:`info`}),`, `,(0,p.jsx)(t.code,{children:`light`}),`, `,(0,p.jsx)(t.code,{children:`dark`}),`, and `,(0,p.jsx)(t.code,{children:`neutral`}),`. They set the border, background, and foreground together. Semantic variants reinforce, but never replace, visible status language.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`square`}),` is the default geometry; `,(0,p.jsx)(t.code,{children:`circle`}),` is useful for directional or compact status markers. Sizes are `,(0,p.jsx)(t.code,{children:`sm`}),` (36 pixels), `,(0,p.jsx)(t.code,{children:`md`}),` (40 pixels, the default), and `,(0,p.jsx)(t.code,{children:`lg`}),` (56 pixels). Child icons sized in `,(0,p.jsx)(t.code,{children:`em`}),` inherit the tile's text scale.`]}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`bordered={false}`}),` removes the ordinary semantic border. Breeze may still expose a boundary in forced-colour mode so the marker remains perceivable.`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`state-and-behaviour`,children:`State and behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native span attributes such as `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-label`}),` when exposed, `,(0,p.jsx)(t.code,{children:`data-*`}),`, and relationship attributes are forwarded. `,(0,p.jsx)(t.code,{children:`aria-hidden`}),` is owned by `,(0,p.jsx)(t.code,{children:`decorative`}),`; arbitrary inline `,(0,p.jsx)(t.code,{children:`style`}),` is not a public styling contract.`]}),`
`,(0,p.jsx)(t.p,{children:`IconTile has no keyboard behaviour and no controlled, uncontrolled, disabled, loading, invalid, error, empty, or read-only state. It must not receive action semantics or click handling. State belongs to the surrounding component; the tile only presents a marker.`}),`
`,(0,p.jsx)(t.p,{children:`The geometry is direction-neutral. Directional icons retain their named glyph orientation; select the icon that describes the intended concept in the current interface. Child text follows provider direction but is not translated or formatted.`}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-limitations`,children:`Common mistakes and limitations`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsx)(t.li,{children:`Do not use colour or an icon alone to communicate critical state.`}),`
`,(0,p.jsxs)(t.li,{children:[`Do not set `,(0,p.jsx)(t.code,{children:`decorative={false}`}),` without accessible meaning in the child or wrapper.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Do not give a nested icon an `,(0,p.jsx)(t.code,{children:`aria-label`}),` while leaving the tile decorative.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not put long text, controls, or multiple competing icons inside the tile.`}),`
`,(0,p.jsx)(t.li,{children:`Use typed props rather than overriding canonical geometry or semantic colours with classes.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use the curated `,(0,p.jsx)(t.code,{children:`icons`}),` subpath for the marker glyph.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`IconButton`}),` for an icon-only action.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`Avatar`}),` for identity and `,(0,p.jsx)(t.code,{children:`Badge`}),` for status text.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`StatePanel`}),` when the marker belongs to a complete empty, loading, or error composition.`]}),`
`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};