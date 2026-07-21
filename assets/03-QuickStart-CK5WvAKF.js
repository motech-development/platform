import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,s as i}from"./blocks-LnNkZCnz.js";import{t as a}from"./mdx-react-shim-CjMysPAJ.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Guides/03 Quick start`,summary:`Build a small accessible Breeze interface using the provider, layout, typography, fields and actions.`}),`
`,(0,c.jsx)(t.h1,{id:`quick-start`,children:`Quick start`}),`
`,(0,c.jsx)(t.p,{children:`This example uses only the public v3 API and domain-neutral copy. The field manages its own initial value, while form submission remains application-owned.`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import {
  BreezeProvider,
  Button,
  FormActions,
  Stack,
  Surface,
  TextField,
  Typography,
} from '@motech-development/breeze-ui';
import '@motech-development/breeze-ui/reset.css';
import '@motech-development/breeze-ui/styles.css';

export function App() {
  return (
    <BreezeProvider locale="en-GB" timeZone="Europe/London">
      <Surface padding="lg">
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <Stack gap="md">
            <Typography as="h1">Create an item</Typography>

            <TextField.Root name="title" defaultValue="Draft item" required>
              <TextField.Label>Title</TextField.Label>
              <TextField.Input />
              <TextField.Description>
                Use a short, recognisable title.
              </TextField.Description>
              <TextField.Error>Enter a title.</TextField.Error>
            </TextField.Root>

            <FormActions primary={<Button type="submit">Save item</Button>} />
          </Stack>
        </form>
      </Surface>
    </BreezeProvider>
  );
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`why-this-composition`,children:`Why this composition`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`BreezeProvider`}),` supplies locale, direction, messages, routing and overlay infrastructure.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`Surface`}),` provides a themed visual boundary; `,(0,c.jsx)(t.code,{children:`Stack`}),` owns vertical spacing.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`Typography`}),` separates semantic heading choice from visual styling.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`TextField`}),` keeps its label, control, description and error in one accessible compound field.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`FormActions`}),` provides the recurring form-action layout without taking ownership of submission.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`Button`}),` performs an action. Use `,(0,c.jsx)(t.code,{children:`Link`}),` or `,(0,c.jsx)(t.code,{children:`LinkButton`}),` when activation navigates.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`next-steps`,children:`Next steps`}),`
`,(0,c.jsxs)(t.p,{children:[`Read `,(0,c.jsx)(t.a,{href:`?path=/docs/guides-04-provider-and-styles--docs`,children:`Provider and styles`}),` before integrating routing or localisation. Use the individual component pages to choose variants, understand defaults and copy deliberately authored examples.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};