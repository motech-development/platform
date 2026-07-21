import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{Content as c,n as l,t as u}from"./Center.stories-DW4lag__.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`A neutral layout that centres one composition on both axes.`}),`
`,(0,p.jsx)(t.h1,{id:`center`,children:`Center`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`Center`}),` centres its content horizontally and vertically, optionally within at least the viewport height.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Center } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Center`}),` for a bounded empty, loading, sign-in, or status composition that should sit on both axes. Use `,(0,p.jsx)(t.code,{children:`Container`}),` to centre and bound page width without vertical centring, or `,(0,p.jsx)(t.code,{children:`Stack align="center"`}),` when only cross-axis alignment is needed.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  Center,
  Spinner,
  Stack,
  Typography,
} from '@motech-development/breeze-ui';

export function LoadingView() {
  return (
    <Center minHeight="screen">
      <Stack align="center" gap="sm">
        <Spinner label="Loading results" />
        <Typography>Loading results…</Typography>
      </Stack>
    </Center>
  );
}
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-and-responsive-behaviour`,children:`Accessibility and responsive behaviour`}),`
`,(0,p.jsxs)(t.p,{children:[`Relevant native `,(0,p.jsx)(t.code,{children:`div`}),` attributes including `,(0,p.jsx)(t.code,{children:`id`}),`, `,(0,p.jsx)(t.code,{children:`aria-*`}),`, and `,(0,p.jsx)(t.code,{children:`data-*`}),` are supported; inline `,(0,p.jsx)(t.code,{children:`style`}),` is not. `,(0,p.jsx)(t.code,{children:`Center`}),` has no callbacks or controlled, disabled, invalid, read-only, loading, empty, or error state of its own.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The wrapper is a neutral `,(0,p.jsx)(t.code,{children:`div`}),` with no role, focus, label, or keyboard behaviour. Give loading and status content its own accessible semantics. `,(0,p.jsx)(t.code,{children:`minHeight="screen"`}),` is a minimum rather than a fixed height, so zoomed, translated, or error content can grow and remain reachable. Centring is unchanged in right-to-left direction.`]}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes`,children:`Common mistakes`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Do not use `,(0,p.jsx)(t.code,{children:`Center`}),` to hide overflowing content or force a fixed viewport height.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not centre long prose, dense forms, or whole application pages when start alignment is easier to scan.`}),`
`,(0,p.jsx)(t.li,{children:`Do not assume it supplies live-region semantics for loading or errors.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`related-components`,children:`Related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`StatePanel`}),` for a standard empty/error composition, `,(0,p.jsx)(t.code,{children:`Spinner`}),` for announced progress, `,(0,p.jsx)(t.code,{children:`Stack`}),` inside the centred region, and `,(0,p.jsx)(t.code,{children:`Container`}),` for normal page gutters.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};