import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-q_a4TWX4.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-CZIpnuKF.js";import{t as s}from"./mdx-react-shim-B0kyhCPT.js";import{WithAction as c,n as l,t as u}from"./FormSection.stories-DV28s2o7.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Accessible titled region for related controls, with generated heading association, split or stacked responsive layout, optional section action and canonical divider rhythm.`}),`
`,(0,p.jsx)(t.h1,{id:`formsection`,children:`FormSection`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FormSection`}),` groups related controls into a named section with a persistent heading, optional explanation and optional section action.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, FormSection, TextField } from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FormSection`}),` to divide a longer page or overlay form into understandable titled regions. It supplies page-level information architecture and layout; child fields retain their own labels, validation and state.`]}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`Fieldset`}),` when controls form one semantic question, especially radio buttons or checkboxes. Use `,(0,p.jsx)(t.code,{children:`SectionHeader`}),` for a non-form content section and `,(0,p.jsx)(t.code,{children:`FormActions`}),` for the form’s final action region. Do not wrap every individual field in FormSection.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import { Button, FormSection, TextField } from '@motech-development/breeze-ui';

<FormSection
  action={
    <Button appearance="text" onAction={addContact}>
      Add contact
    </Button>
  }
  description="Details used for service notifications."
  title="Contact details"
>
  <TextField.Root>
    <TextField.Label>Email address</TextField.Label>
    <TextField.Input name="email" type="email" />
  </TextField.Root>
</FormSection>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy`,children:`Anatomy`}),`
`,(0,p.jsx)(t.p,{children:`FormSection is a fixed semantic composition rather than a public compound namespace.`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Region`}),(0,p.jsx)(t.th,{children:`Responsibility`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Root section`}),(0,p.jsxs)(t.td,{children:[`A native `,(0,p.jsx)(t.code,{children:`section`}),` named by its generated heading id.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Header`}),(0,p.jsxs)(t.td,{children:[`Required `,(0,p.jsx)(t.code,{children:`title`}),` heading and optional `,(0,p.jsx)(t.code,{children:`description`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Section action`}),(0,p.jsx)(t.td,{children:`Optional action related to the section, not the entire form.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Fields`}),(0,p.jsxs)(t.td,{children:[`Required `,(0,p.jsx)(t.code,{children:`children`}),`, normally labelled Breeze field primitives.`]})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`The generated heading association makes the section discoverable as a named region. `,(0,p.jsx)(t.code,{children:`headingLevel`}),` changes semantic hierarchy, not visual prominence. Choose it from the surrounding page outline; levels 2 through 6 are supported and 2 is the default.`]}),`
`,(0,p.jsx)(t.h2,{id:`layout-and-dividers`,children:`Layout and dividers`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Layout`}),(0,p.jsx)(t.th,{children:`Default arrangement`}),(0,p.jsxs)(t.th,{children:[(0,p.jsx)(t.code,{children:`divided`}),` behaviour`]})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`split`})}),(0,p.jsxs)(t.td,{children:[`Header above fields on compact screens; header and fields form two columns from `,(0,p.jsx)(t.code,{children:`md`}),`.`]}),(0,p.jsx)(t.td,{children:`Adds a top divider and spacing, except on the first split section.`})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:(0,p.jsx)(t.code,{children:`stacked`})}),(0,p.jsx)(t.td,{children:`Header, action and fields form a single vertical composition suited to overlays.`}),(0,p.jsx)(t.td,{children:`Adds an outer bottom divider; the stacked header keeps its own separator.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`With an `,(0,p.jsx)(t.code,{children:`action`}),`, compact layout places fields before the action visually; from `,(0,p.jsx)(t.code,{children:`md`}),`, the action appears above the fields and aligns to the logical end. DOM order does not change, so keyboard and assistive-technology order remain stable.`]}),`
`,(0,p.jsx)(t.h2,{id:`field-state-and-application-responsibilities`,children:`Field state and application responsibilities`}),`
`,(0,p.jsxs)(t.p,{children:[`FormSection owns no field values, validation or submission. Configure controlled, uncontrolled, read-only, required, disabled, invalid, loading, empty and error behaviour on its child controls or surrounding application state. The `,(0,p.jsx)(t.code,{children:`action`}),` node owns its callback and state. Do not use the section description as a substitute for each field’s accessible label or associated error.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The section performs no routing. A slotted `,(0,p.jsx)(t.code,{children:`LinkButton`}),` or other public link component owns its destination and provider router behaviour.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-internationalisation-and-styling`,children:`Accessibility, internationalisation and styling`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`title`}),` is required and remains visible. Keep heading levels sequential; do not choose a level to obtain a visual size.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Use `,(0,p.jsx)(t.code,{children:`description`}),` for concise section-wide context. Field-specific instructions belong to each field’s Description part.`]}),`
`,(0,p.jsxs)(t.li,{children:[`Every child control still needs its own label. Use `,(0,p.jsx)(t.code,{children:`Fieldset`}),` inside the section when several controls answer one question.`]}),`
`,(0,p.jsx)(t.li,{children:`Translate title, description, action and field copy. Layout uses logical alignment and inherits provider direction.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`className`}),` is for placement and composition. Do not style generated internal wrappers or depend on internal `,(0,p.jsx)(t.code,{children:`data-*`}),` attributes.`]}),`
`,(0,p.jsx)(t.li,{children:`Do not render an empty section; omit it until its fields or meaningful state are available.`}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not skip heading levels, duplicate the same heading for adjacent regions, use `,(0,p.jsx)(t.code,{children:`action`}),` for the whole form’s submit button, put unrelated controls together, or reproduce split layout with application CSS. Use `,(0,p.jsx)(t.code,{children:`Fieldset`}),` for one grouped question, `,(0,p.jsx)(t.code,{children:`FormActions`}),` for final actions, and `,(0,p.jsx)(t.code,{children:`SectionHeader`}),` outside form structure.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};