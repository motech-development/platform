import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./AttachmentRow-DHl0Kqbq.js";var s=n({Document:()=>v,Loading:()=>S,LoadingDark:()=>C,NarrowContainer:()=>y,Photo:()=>b,UploadFailed:()=>x,__namedExportsOrder:()=>w,default:()=>_});function c(){let[e,t]=(0,d.useState)(`Uploaded`);return(0,f.jsx)(o,{actions:g,fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,onAction:e=>t(`${e.label} started`),onOpen:()=>t(`Opened`),sizeBytes:84e3,status:e})}function l(e){let t=e.parentElement;for(;t;){let{backgroundColor:e}=getComputedStyle(t);if(e!==`rgba(0, 0, 0, 0)`)return e;t=t.parentElement}}async function u(e){let t=Array.from(e.querySelectorAll(`progress`));await p(t).toHaveLength(3),await p(t.filter(e=>getComputedStyle(e).backgroundColor===l(e))).toEqual([])}var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T=t((()=>{d=e(r(),1),a(),f=i(),{expect:p,userEvent:m,within:h}=__STORYBOOK_MODULE_TEST__,g=[{icon:`document`,id:`open`,label:`Open full screen`},{id:`download`,label:`Download`},{id:`replace`,label:`Replace`},{id:`remove`,label:`Remove`,section:{id:`remove`},tone:`danger`}],_={component:o,title:`Files/AttachmentRow`},v={args:{fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,sizeBytes:84e3,status:`Uploaded`},play:async({canvasElement:e})=>{let t=h(e);await m.click(t.getByRole(`button`,{name:`More actions: fen-lane-garage-invoice.pdf`}));let n=(await h(document.body).findByRole(`menu`)).closest(`.breeze-popover`);if(!n)throw Error(`The menu popover was not rendered.`);await p(n.offsetWidth).toBeLessThan(256),await m.click(await h(document.body).findByRole(`menuitem`,{name:`Download`})),await p(t.getByText(`Download started`)).toBeVisible(),await m.click(t.getByRole(`button`,{name:`Open: fen-lane-garage-invoice.pdf`})),await p(t.getByText(`Opened`)).toBeVisible()},render:()=>(0,f.jsx)(c,{})},y={args:{actions:g,fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,onAction:()=>{},onOpen:()=>{},sizeBytes:84e3,status:`Uploaded`},play:async({canvasElement:e})=>{await document.fonts.ready;let t=h(e),n=t.getByText(`fen-lane-garage-invoice.pdf`).parentElement,r=n?.parentElement;if(!n||!r)throw Error(`The attachment row content was not rendered.`);let i=r.getBoundingClientRect(),a=n.getBoundingClientRect(),o=t.getByRole(`button`,{name:`Open: fen-lane-garage-invoice.pdf`}).getBoundingClientRect(),s=t.getByRole(`button`,{name:`More actions: fen-lane-garage-invoice.pdf`}).getBoundingClientRect();await p(o.top).toBeGreaterThanOrEqual(a.bottom),await p(s.top).toBeGreaterThanOrEqual(a.bottom),await p(o.right).toBeLessThanOrEqual(i.right),await p(s.right).toBeLessThanOrEqual(i.right)},render:()=>(0,f.jsx)(`div`,{style:{inlineSize:320},children:(0,f.jsx)(c,{})})},b={args:{fileType:`photo`,filename:`IMG_4471.jpg`,sizeBytes:12e5,status:`Uploaded`,thumbnailUrl:`data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22440%22 viewBox=%220 0 320 440%22%3E%3Crect width=%22320%22 height=%22440%22 fill=%22%23b5d8cf%22/%3E%3Cpath d=%22M0 330 110 180l95 110 50-70 65 110v110H0z%22 fill=%22%23699586%22/%3E%3Ccircle cx=%22235%22 cy=%22105%22 r=%2234%22 fill=%22%23f6d998%22/%3E%3C/svg%3E`}},x={args:{fileType:`document`,filename:`fen-lane-garage-invoice.pdf`,sizeBytes:84e3,status:`Upload failed`}},S={args:{loading:!0},play:async({canvasElement:e})=>{await u(e)}},C={args:{loading:!0},globals:{appearance:`dark`},play:async({canvasElement:e})=>{await p(e.ownerDocument.documentElement.dataset.theme).toBe(`dark`),await u(e)}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
    const menu = await within(document.body).findByRole('menu');
    const popover = menu.closest<HTMLElement>('.breeze-popover');
    if (!popover) throw new Error('The menu popover was not rendered.');

    // The narrower minimum lets these actions shrink-wrap below Menu's default 256px.
    await expect(popover.offsetWidth).toBeLessThan(256);
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
}`,...v.parameters?.docs?.source},description:{story:`A document attachment with readable metadata and working file actions.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source},description:{story:`Shows file actions wrapping below the details in a narrow container.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    fileType: 'photo',
    filename: 'IMG_4471.jpg',
    sizeBytes: 1_200_000,
    status: 'Uploaded',
    thumbnailUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22440%22 viewBox=%220 0 320 440%22%3E%3Crect width=%22320%22 height=%22440%22 fill=%22%23b5d8cf%22/%3E%3Cpath d=%22M0 330 110 180l95 110 50-70 65 110v110H0z%22 fill=%22%23699586%22/%3E%3Ccircle cx=%22235%22 cy=%22105%22 r=%2234%22 fill=%22%23f6d998%22/%3E%3C/svg%3E'
  }
}`,...b.parameters?.docs?.source},description:{story:`A photograph uses an image thumbnail when a URL is available.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    fileType: 'document',
    filename: 'fen-lane-garage-invoice.pdf',
    sizeBytes: 84_000,
    status: 'Upload failed'
  }
}`,...x.parameters?.docs?.source},description:{story:`A failed upload remains understandable through its visible status text.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  },
  play: async ({
    canvasElement
  }) => {
    await assertSkeletonsStandOut(canvasElement);
  }
}`,...S.parameters?.docs?.source},description:{story:`Shows the row shape while attachment details are unavailable.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  },
  globals: {
    appearance: 'dark'
  },
  play: async ({
    canvasElement
  }) => {
    await expect(canvasElement.ownerDocument.documentElement.dataset.theme).toBe('dark');
    await assertSkeletonsStandOut(canvasElement);
  }
}`,...C.parameters?.docs?.source},description:{story:`The loading placeholders stay visible against the row in the dark appearance.`,...C.parameters?.docs?.description}}};try{_.displayName=`AttachmentRow`,_.__docgenInfo={description:`Presents an attached file with a type thumbnail, readable state and actions.`,displayName:`AttachmentRow`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{loading:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Omits file content while its shape is unavailable.
Attachment content is available and displayed.`,name:`loading`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},transitionName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Shared element name used once this row has content.
Shared element name for a DocumentViewer that opens from this row.`,name:`transitionName`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowLoadingProps`},required:!1,tags:{},type:{name:`string | undefined`}},filename:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Visible name of the attached file.`,name:`filename`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!0,tags:{},type:{name:`string`}},onOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Called when the direct Open action is activated.`,name:`onOpen`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},sizeBytes:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`File size in bytes, formatted for the Breeze provider locale.`,name:`sizeBytes`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!0,tags:{},type:{name:`number`}},status:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`}],description:`Visible attachment state, such as “Uploaded” or “Upload failed”.`,name:`status`,parent:{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`AttachmentRowContentBaseProps`},required:!0,tags:{},type:{name:`string`}},fileType:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`Distinguishes a document from a photograph.`,name:`fileType`,required:!0,tags:{},type:{name:`"document" | "photo"`}},thumbnailUrl:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`Only photographs can provide an image thumbnail.
Optional image rendered as the photograph thumbnail.`,name:`thumbnailUrl`,required:!1,tags:{},type:{name:`string | undefined`}},actions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`App-owned actions require an activation callback.`,name:`actions`,required:!1,tags:{},type:{name:`AttachmentRowAction[] | undefined`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`},{fileName:`breeze-ui/src/patterns/AttachmentRow/AttachmentRow.tsx`,name:`TypeLiteral`}],description:`Called with the selected app-owned menu action.
A callback is only used when actions are provided.`,name:`onAction`,required:!1,tags:{},type:{name:`((action: AttachmentRowAction) => void) | undefined`}}},tags:{}}}catch{}try{v.displayName=`Document`,v.__docgenInfo={description:`A document attachment with readable metadata and working file actions.`,displayName:`Document`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{y.displayName=`NarrowContainer`,y.__docgenInfo={description:`Shows file actions wrapping below the details in a narrow container.`,displayName:`NarrowContainer`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{b.displayName=`Photo`,b.__docgenInfo={description:`A photograph uses an image thumbnail when a URL is available.`,displayName:`Photo`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{x.displayName=`UploadFailed`,x.__docgenInfo={description:`A failed upload remains understandable through its visible status text.`,displayName:`UploadFailed`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{S.displayName=`Loading`,S.__docgenInfo={description:`Shows the row shape while attachment details are unavailable.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{C.displayName=`LoadingDark`,C.__docgenInfo={description:`The loading placeholders stay visible against the row in the dark appearance.`,displayName:`LoadingDark`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/AttachmentRow/AttachmentRow.stories.tsx`,methods:[],props:{},tags:{}}}catch{}w=[`Document`,`NarrowContainer`,`Photo`,`UploadFailed`,`Loading`,`LoadingDark`]}));T();export{v as Document,S as Loading,C as LoadingDark,y as NarrowContainer,b as Photo,x as UploadFailed,w as __namedExportsOrder,_ as default,T as n,s as t};