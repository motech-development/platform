import{i as e}from"./preload-helper-CT_b8DTk.js";import{r as t}from"./iframe-i3W5vvo3.js";import{b as n,c as r,n as i,r as a,s as o}from"./blocks-LnNkZCnz.js";import{t as s}from"./mdx-react-shim-CjMysPAJ.js";import{WithActions as c,n as l,t as u}from"./FileAttachment.stories-BA0bOs7g.js";function d(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:u,summary:`Responsive selected-file row that keeps a visible file name beside application-owned view, download, replace or removal actions without owning file or upload state.`}),`
`,(0,p.jsx)(t.h1,{id:`fileattachment`,children:`FileAttachment`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`FileAttachment`}),` presents one selected file name with persistent application-owned actions.`]}),`
`,(0,p.jsx)(t.h2,{id:`import`,children:`Import`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  Button,
  FileAttachment,
  LinkButton,
} from '@motech-development/breeze-ui';
`})}),`
`,(0,p.jsx)(t.h2,{id:`when-to-use`,children:`When to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FileAttachment`}),` after selection or upload when a file must remain visible beside actions such as view, download, replace or remove. It is a presentation pattern for a native `,(0,p.jsx)(t.code,{children:`File`}),` or application record that your application already owns.`]}),`
`,(0,p.jsx)(t.h2,{id:`when-not-to-use`,children:`When not to use`}),`
`,(0,p.jsxs)(t.p,{children:[`Use `,(0,p.jsx)(t.code,{children:`FileUpload`}),` to select files, `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` for a compact native chooser, and `,(0,p.jsx)(t.code,{children:`DropZone`}),` when drag and drop is the primary affordance. Use a collection component when many files need selection, sorting or bulk actions. FileAttachment does not upload, preview, validate or remove anything.`]}),`
`,(0,p.jsx)(t.h2,{id:`basic-example`,children:`Basic example`}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-tsx`,children:`import {
  Button,
  FileAttachment,
  LinkButton,
} from '@motech-development/breeze-ui';

<FileAttachment
  name="project-brief.pdf"
  actions={
    <>
      <LinkButton appearance="outline" href="/files/project-brief.pdf">
        View file
      </LinkButton>
      <Button variant="danger" onAction={removeFile}>
        Remove file
      </Button>
    </>
  }
/>;
`})}),`
`,(0,p.jsx)(a,{of:c}),`
`,(0,p.jsx)(t.h2,{id:`anatomy-and-responsive-behaviour`,children:`Anatomy and responsive behaviour`}),`
`,(0,p.jsxs)(t.table,{children:[(0,p.jsx)(t.thead,{children:(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.th,{children:`Region`}),(0,p.jsx)(t.th,{children:`Responsibility`})]})}),(0,p.jsxs)(t.tbody,{children:[(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`File identity`}),(0,p.jsxs)(t.td,{children:[`A decorative paperclip and persistent, visually truncated `,(0,p.jsx)(t.code,{children:`name`}),`.`]})]}),(0,p.jsxs)(t.tr,{children:[(0,p.jsx)(t.td,{children:`Actions`}),(0,p.jsx)(t.td,{children:`One or more application-owned controls in logical source order.`})]})]})]}),`
`,(0,p.jsxs)(t.p,{children:[`On compact layouts the row stacks and each direct action stretches to the available width. From the `,(0,p.jsx)(t.code,{children:`sm`}),` breakpoint the file name and wrapping actions share a row. The name region can shrink without forcing page overflow; the full string remains in the DOM for assistive technology.`]}),`
`,(0,p.jsxs)(t.p,{children:[`The root has no role by default. If the row needs its own accessible grouping semantics, pass `,(0,p.jsx)(t.code,{children:`role="group"`}),` with `,(0,p.jsx)(t.code,{children:`aria-label`}),` or `,(0,p.jsx)(t.code,{children:`aria-labelledby`}),`. Give every action a specific accessible name, especially icon-only controls. The paperclip is decorative and must not supply meaning.`]}),`
`,(0,p.jsx)(t.h2,{id:`state-callbacks-and-routing`,children:`State, callbacks and routing`}),`
`,(0,p.jsxs)(t.p,{children:[`FileAttachment is stateless. `,(0,p.jsx)(t.code,{children:`name`}),` is display content rather than a path, URL or native `,(0,p.jsx)(t.code,{children:`File`}),`; `,(0,p.jsx)(t.code,{children:`actions`}),` is rendered without inspection. Configure `,(0,p.jsx)(t.code,{children:`onAction`}),`, `,(0,p.jsx)(t.code,{children:`href`}),`, downloads, loading, disabled state, confirmation and routing on the child controls.`]}),`
`,(0,p.jsxs)(t.p,{children:[`There is no empty, invalid, read-only, loading, error or progress mode. Omit the row when no file exists. Pair it with `,(0,p.jsx)(t.code,{children:`Alert`}),`, `,(0,p.jsx)(t.code,{children:`ProgressBar`}),` or other feedback when the application needs upload progress or failure recovery. Applications own file records, object URL lifecycle, authorisation, storage and deletion.`]}),`
`,(0,p.jsx)(t.h2,{id:`accessibility-internationalisation-and-styling`,children:`Accessibility, internationalisation and styling`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[`Use the recognisable file name or another concise visible identifier. Do not provide an unlabeled icon as `,(0,p.jsx)(t.code,{children:`name`}),`.`]}),`
`,(0,p.jsx)(t.li,{children:`Translate action labels and allow them to wrap. Filenames are user or system data and should not be translated.`}),`
`,(0,p.jsx)(t.li,{children:`Layout uses logical ordering and inherits provider direction. Keep actions in the intended keyboard order rather than reversing arrays for right-to-left presentation.`}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.code,{children:`className`}),` is for placement and width composition. Do not depend on internal `,(0,p.jsx)(t.code,{children:`data-*`}),` attributes or override the row’s responsive geometry.`]}),`
`,(0,p.jsxs)(t.li,{children:[`A `,(0,p.jsx)(t.code,{children:`LinkButton`}),` child uses the provider router adapter for eligible local navigation and preserves native external, download and modified-click behaviour. FileAttachment itself performs no routing.`]}),`
`]}),`
`,(0,p.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,p.jsx)(i,{}),`
`,(0,p.jsx)(t.h2,{id:`common-mistakes-and-related-components`,children:`Common mistakes and related components`}),`
`,(0,p.jsxs)(t.p,{children:[`Do not pass a `,(0,p.jsx)(t.code,{children:`File`}),` object directly as `,(0,p.jsx)(t.code,{children:`name`}),`, assume the pattern starts or retries uploads, hide destructive action meaning behind an icon, or render an empty actions region. Use `,(0,p.jsx)(t.code,{children:`FileUpload`}),`, `,(0,p.jsx)(t.code,{children:`FileTrigger`}),` or `,(0,p.jsx)(t.code,{children:`DropZone`}),` for selection, and require `,(0,p.jsx)(t.code,{children:`ConfirmationDialog`}),` when removal has a material consequence.`]})]})}function f(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(d,{...e})}):d(e)}var p;e((()=>{p=t(),s(),r(),l()}))();export{f as default};