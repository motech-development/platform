import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{t}from"./jsx-runtime-cM__dR4X.js";import{i as n}from"./react-XnqUzw--.js";import{c as r,s as i}from"./blocks-BKOn9Gx8.js";import{t as a}from"./mdx-react-shim-y1jXGhTh.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/05 Composition and compound components`,summary:`Compose Breeze primitives and use every public part of a compound component without depending on internal DOM.`}),`
`,(0,c.jsx)(t.h1,{id:`composition-and-compound-components`,children:`Composition and compound components`}),`
`,(0,c.jsxs)(t.p,{children:[`Simple primitives such as `,(0,c.jsx)(t.code,{children:`Button`}),` and `,(0,c.jsx)(t.code,{children:`Surface`}),` expose one component. Multi-part controls expose a Breeze-owned namespace so each semantic element can receive its own content, native attributes, ref and `,(0,c.jsx)(t.code,{children:`className`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`read-compound-anatomy-from-the-namespace`,children:`Read compound anatomy from the namespace`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { Button, Dialog } from '@motech-development/breeze-ui';

<Dialog.Root>
  <Dialog.Trigger>Open details</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Item details</Dialog.Title>
    <Dialog.Description>
      Review the information before continuing.
    </Dialog.Description>
    <Dialog.Close>Close</Dialog.Close>
    <Button onAction={() => saveItem()}>Save</Button>
  </Dialog.Content>
</Dialog.Root>;
`})}),`
`,(0,c.jsx)(t.p,{children:`The root coordinates shared state and behaviour. Triggers perform the opening action. Content owns the layered surface and focus scope. Title and description provide the accessible name and description. Close performs semantic dismissal. The exact rendered DOM is not a public composition contract.`}),`
`,(0,c.jsx)(t.h2,{id:`composition-rules`,children:`Composition rules`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`Keep all parts inside their matching root unless the component page explicitly says otherwise.`}),`
`,(0,c.jsx)(t.li,{children:`Include every required semantic part. A visual placeholder is not a label.`}),`
`,(0,c.jsx)(t.li,{children:`Pass interaction state to the root; pass presentation or native attributes to the part that renders them.`}),`
`,(0,c.jsx)(t.li,{children:`Use children for application copy and content. Breeze patterns never hard-code product language.`}),`
`,(0,c.jsxs)(t.li,{children:[`Use `,(0,c.jsx)(t.code,{children:`className`}),` for layout placement and application composition, not to replace supported variants.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Do not use an `,(0,c.jsx)(t.code,{children:`asChild`}),`, universal `,(0,c.jsx)(t.code,{children:`as`}),`, slot-class map or internal React Aria component. Breeze exposes constrained semantic choices only where they are supported.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`primitives-patterns-and-domain-components`,children:`Primitives, patterns and domain components`}),`
`,(0,c.jsx)(t.p,{children:`Use primitives for focused responsibilities and patterns for recurring, domain-neutral compositions. Build application-owned domain components from both:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import {
  Badge,
  Card,
  Inline,
  Stack,
  Typography,
} from '@motech-development/breeze-ui';

export function ItemSummary() {
  return (
    <Card.Root>
      <Card.Header>
        <Inline gap="sm">
          <Card.Title>Draft item</Card.Title>
          <Badge>Draft</Badge>
        </Inline>
        <Card.Description>Updated today</Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="sm">
          <Typography>Application-owned information.</Typography>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`ItemSummary`}),` is a domain component because its meaning belongs to the application. It should stay outside Breeze even though it is composed entirely from Breeze parts.`]}),`
`,(0,c.jsx)(t.h2,{id:`discoverability`,children:`Discoverability`}),`
`,(0,c.jsxs)(t.p,{children:[`Each compound component page documents its root and every public part in one anatomy and API reference. Story metadata lists public `,(0,c.jsx)(t.code,{children:`subcomponents`}),` so the component manifest carries the same structure.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};