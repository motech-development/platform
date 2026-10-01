import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./AttachmentRow-xE-lzZXq.js";var s=n({Document:()=>g,Loading:()=>b,NarrowContainer:()=>_,Photo:()=>v,UploadFailed:()=>y,__namedExportsOrder:()=>x,default:()=>h});function c(){let[e,t]=(0,l.useState)(`Uploaded`);return(0,u.jsx)(o,{actions:m,fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,onAction:e=>t(`${e.label} started`),onOpen:()=>t(`Opened`),sizeBytes:84e3,status:e})}var l,u,d,f,p,m,h,g,_,v,y,b,x,S=t((()=>{l=e(r(),1),a(),u=i(),{expect:d,userEvent:f,within:p}=__STORYBOOK_MODULE_TEST__,m=[{icon:`download`,id:`download`,label:`Download`},{description:`Choose a different attachment.`,icon:`upload`,id:`replace`,label:`Replace`},{icon:`delete`,id:`remove`,label:`Remove`}],h={component:o,title:`Files/AttachmentRow`},g={args:{fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,sizeBytes:84e3,status:`Uploaded`},play:async({canvasElement:e})=>{let t=p(e);await f.click(t.getByRole(`button`,{name:`More actions: fen-lane-garage-invoice.pdf`})),await f.click(await p(document.body).findByRole(`menuitem`,{name:`Download`})),await d(t.getByText(`Download started`)).toBeVisible(),await f.click(t.getByRole(`button`,{name:`Open: fen-lane-garage-invoice.pdf`})),await d(t.getByText(`Opened`)).toBeVisible()},render:()=>(0,u.jsx)(c,{})},_={args:{actions:m,fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,onAction:()=>{},onOpen:()=>{},sizeBytes:84e3,status:`Uploaded`},play:async({canvasElement:e})=>{await document.fonts.ready;let t=p(e),n=t.getByText(`fen-lane-garage-invoice.pdf`).parentElement,r=n?.parentElement;if(!n||!r)throw Error(`The attachment row content was not rendered.`);let i=r.getBoundingClientRect(),a=n.getBoundingClientRect(),o=t.getByRole(`button`,{name:`Open: fen-lane-garage-invoice.pdf`}).getBoundingClientRect(),s=t.getByRole(`button`,{name:`More actions: fen-lane-garage-invoice.pdf`}).getBoundingClientRect();await d(o.top).toBeGreaterThanOrEqual(a.bottom),await d(s.top).toBeGreaterThanOrEqual(a.bottom),await d(o.right).toBeLessThanOrEqual(i.right),await d(s.right).toBeLessThanOrEqual(i.right)},render:()=>(0,u.jsx)(`div`,{style:{inlineSize:320},children:(0,u.jsx)(c,{})})},v={args:{fileType:`photo`,filename:`IMG_4471.jpg`,sizeBytes:12e5,status:`Uploaded`,thumbnailUrl:`data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22440%22 viewBox=%220 0 320 440%22%3E%3Crect width=%22320%22 height=%22440%22 fill=%22%23b5d8cf%22/%3E%3Cpath d=%22M0 330 110 180l95 110 50-70 65 110v110H0z%22 fill=%22%23699586%22/%3E%3Ccircle cx=%22235%22 cy=%22105%22 r=%2234%22 fill=%22%23f6d998%22/%3E%3C/svg%3E`}},y={args:{fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,sizeBytes:84e3,status:`Upload failed`}},b={args:{loading:!0}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    fileType: 'document',
    filename: 'fen-lane-garage-invoice.pdf',
    sizeBytes: 84_000,
    status: 'Uploaded'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'More actions: fen-lane-garage-invoice.pdf'
    }));
    await userEvent.click(await within(document.body).findByRole('menuitem', {
      name: 'Download'
    }));
    await expect(canvas.getByText('Download started')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Open: fen-lane-garage-invoice.pdf'
    }));
    await expect(canvas.getByText('Opened')).toBeVisible();
  },
  render: () => <ActionableDocumentExample />
}`,...g.parameters?.docs?.source},description:{story:`A document attachment with readable metadata and working file actions.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    actions,
    fileType: 'document',
    filename: 'fen-lane-garage-invoice.pdf',
    onAction: () => {},
    onOpen: () => {},
    sizeBytes: 84_000,
    status: 'Uploaded'
  },
  play: async ({
    canvasElement
  }) => {
    await document.fonts.ready;
    const canvas = within(canvasElement);
    const filename = canvas.getByText('fen-lane-garage-invoice.pdf');
    const content = filename.parentElement;
    const row = content?.parentElement;
    if (!content || !row) {
      throw new Error('The attachment row content was not rendered.');
    }
    const rowBounds = row.getBoundingClientRect();
    const contentBounds = content.getBoundingClientRect();
    const openBounds = canvas.getByRole('button', {
      name: 'Open: fen-lane-garage-invoice.pdf'
    }).getBoundingClientRect();
    const menuBounds = canvas.getByRole('button', {
      name: 'More actions: fen-lane-garage-invoice.pdf'
    }).getBoundingClientRect();
    await expect(openBounds.top).toBeGreaterThanOrEqual(contentBounds.bottom);
    await expect(menuBounds.top).toBeGreaterThanOrEqual(contentBounds.bottom);
    await expect(openBounds.right).toBeLessThanOrEqual(rowBounds.right);
    await expect(menuBounds.right).toBeLessThanOrEqual(rowBounds.right);
  },
  render: () => <div style={{
    inlineSize: 320
  }}>
      <ActionableDocumentExample />
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Shows file actions wrapping below the details in a narrow container.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    fileType: 'photo',
    filename: 'IMG_4471.jpg',
    sizeBytes: 1_200_000,
    status: 'Uploaded',
    thumbnailUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22440%22 viewBox=%220 0 320 440%22%3E%3Crect width=%22320%22 height=%22440%22 fill=%22%23b5d8cf%22/%3E%3Cpath d=%22M0 330 110 180l95 110 50-70 65 110v110H0z%22 fill=%22%23699586%22/%3E%3Ccircle cx=%22235%22 cy=%22105%22 r=%2234%22 fill=%22%23f6d998%22/%3E%3C/svg%3E'
  }
}`,...v.parameters?.docs?.source},description:{story:`A photograph uses an image thumbnail when a URL is available.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    fileType: 'document',
    filename: 'fen-lane-garage-invoice.pdf',
    sizeBytes: 84_000,
    status: 'Upload failed'
  }
}`,...y.parameters?.docs?.source},description:{story:`A failed upload remains understandable through its visible status text.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...b.parameters?.docs?.source},description:{story:`Shows the row shape while attachment details are unavailable.`,...b.parameters?.docs?.description}}};try{h.displayName=`AttachmentRow`,h.__docgenInfo={description:`Presents an attached file with a type thumbnail, readable state and actions.`,displayName:`AttachmentRow`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{loading:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Omits file content while its shape is unavailable.
Attachment content is available and displayed.`,name:`loading`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},transitionName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Shared element name used once this row has content.
Shared element name for a DocumentViewer that opens from this row.`,name:`transitionName`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},required:!1,tags:{},type:{name:`string | undefined`}},filename:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Visible name of the attached file.`,name:`filename`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!0,tags:{},type:{name:`string`}},onOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Called when the direct Open action is activated.`,name:`onOpen`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},sizeBytes:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`File size in bytes, formatted for the Breeze provider locale.`,name:`sizeBytes`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!0,tags:{},type:{name:`number`}},status:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Visible attachment state, such as “Uploaded” or “Upload failed”.`,name:`status`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!0,tags:{},type:{name:`string`}},fileType:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`Distinguishes a document from a photograph.`,name:`fileType`,required:!0,tags:{},type:{name:`"document" | "photo"`}},thumbnailUrl:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`Only photographs can provide an image thumbnail.
Optional image rendered as the photograph thumbnail.`,name:`thumbnailUrl`,required:!1,tags:{},type:{name:`string | undefined`}},actions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`App-owned actions require an activation callback.`,name:`actions`,required:!1,tags:{},type:{name:`AttachmentRowAction[] | undefined`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`Called with the selected app-owned menu action.
A callback is only used when actions are provided.`,name:`onAction`,required:!1,tags:{},type:{name:`((action: AttachmentRowAction) => void) | undefined`}}},tags:{}}}catch{}try{g.displayName=`Document`,g.__docgenInfo={description:`A document attachment with readable metadata and working file actions.`,displayName:`Document`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{_.displayName=`NarrowContainer`,_.__docgenInfo={description:`Shows file actions wrapping below the details in a narrow container.`,displayName:`NarrowContainer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{v.displayName=`Photo`,v.__docgenInfo={description:`A photograph uses an image thumbnail when a URL is available.`,displayName:`Photo`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{y.displayName=`UploadFailed`,y.__docgenInfo={description:`A failed upload remains understandable through its visible status text.`,displayName:`UploadFailed`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{b.displayName=`Loading`,b.__docgenInfo={description:`Shows the row shape while attachment details are unavailable.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}x=[`Document`,`NarrowContainer`,`Photo`,`UploadFailed`,`Loading`]}));S();export{g as Document,b as Loading,_ as NarrowContainer,v as Photo,y as UploadFailed,x as __namedExportsOrder,h as default,S as n,s as t};