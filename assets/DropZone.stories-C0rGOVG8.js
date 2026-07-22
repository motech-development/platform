import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-q_a4TWX4.js";import{a as r,i,n as a,o,r as s,s as c,t as l}from"./DropZone-CVn9h3FB.js";import{a as u,n as d}from"./FileTrigger-DvhOa3Nz.js";var f=e({Disabled:()=>E,KeyboardFallbackAndInvalidState:()=>T,MultipleFiles:()=>w,RejectionFeedback:()=>C,SyntheticDrop:()=>S,__namedExportsOrder:()=>D,default:()=>x});function p(e){let t=new DataTransfer;return e.forEach(e=>t.items.add(e)),Object.defineProperty(t,"items",{value:e.map(e=>({getAsFile:()=>e,kind:`file`,type:e.type}))}),t}function m(e){let t=b(e).getByText(`Drop documents here`).parentElement;if(!(t instanceof HTMLDivElement))throw Error(`Expected the rendered drop-zone root.`);return t}var h,g,_,v,y,b,x,S,C,w,T,E,D,O=t((()=>{u(),c(),h=n(),{expect:g,fireEvent:_,fn:v,waitFor:y,within:b}=__STORYBOOK_MODULE_TEST__,x={component:o,decorators:[e=>(Object.assign(a.Description,{displayName:`DropZone.Description`}),Object.assign(a.Error,{displayName:`DropZone.Error`}),Object.assign(a.Feedback,{displayName:`DropZone.Feedback`}),Object.assign(a.Label,{displayName:`DropZone.Label`}),Object.assign(a.Root,{displayName:`DropZone.Root`}),(0,h.jsx)(e,{}))],subcomponents:{Description:l,Error:s,Feedback:i,Label:r},title:`Files/DropZone`},S={args:{children:null,onFileReadError:v(),onFiles:v()},play:async({args:e,canvasElement:t})=>{let n=m(t),r=p([new File([`guide`],`guide.pdf`,{type:`application/pdf`})]);await _.dragEnter(n,{dataTransfer:r}),await y(()=>g(n).toHaveAttribute(`data-drop-target`,`true`)),await _.drop(n,{dataTransfer:r}),await y(()=>g(e.onFiles).toHaveBeenCalledOnce()),await g(e.onFileReadError).not.toHaveBeenCalled()},render:e=>(0,h.jsxs)(a.Root,{acceptedFileTypes:[`application/pdf`],"aria-label":`Documents`,onFileReadError:e.onFileReadError,onFiles:e.onFiles,children:[(0,h.jsx)(a.Label,{children:`Drop documents here`}),(0,h.jsx)(a.Description,{children:`PDF documents only.`}),(0,h.jsx)(a.Feedback,{})]})},C={args:{children:null,onFiles:v()},play:async({canvasElement:e})=>{let t=m(e),n=p([new File([`large text`],`notes.txt`,{type:`text/plain`})]);await _.dragEnter(t,{dataTransfer:n}),await _.drop(t,{dataTransfer:n}),await y(()=>g(b(e).getByRole(`alert`)).toHaveTextContent(`File type is not accepted. File exceeds the maximum size.`))},render:e=>(0,h.jsxs)(a.Root,{acceptedFileTypes:[`image/*`],"aria-label":`Documents`,maxFileSize:4,onFiles:e.onFiles,children:[(0,h.jsx)(a.Label,{children:`Drop documents here`}),(0,h.jsx)(a.Feedback,{})]})},w={args:{children:null,onFiles:v()},render:e=>(0,h.jsxs)(a.Root,{allowsMultiple:!0,"aria-label":`Documents`,onFiles:e.onFiles,children:[(0,h.jsx)(a.Label,{children:`Drop documents here`}),(0,h.jsx)(a.Description,{children:`Multiple files are accepted.`}),(0,h.jsx)(a.Feedback,{})]})},T={args:{children:null,onFiles:v()},play:async({canvasElement:e})=>{let t=b(e).getByRole(`button`,{name:/Required file/});t.focus(),await g(t).toHaveFocus()},render:e=>(0,h.jsxs)(a.Root,{"aria-label":`Required file`,invalid:!0,onFiles:e.onFiles,required:!0,children:[(0,h.jsx)(a.Label,{children:`Drop documents here`}),(0,h.jsx)(a.Description,{children:`Drop a file, paste one, or use the file picker.`}),(0,h.jsx)(d.Root,{onFiles:e.onFiles,children:(0,h.jsx)(d.Trigger,{children:`Choose files`})}),(0,h.jsx)(a.Error,{children:`A file is required.`})]})},E={args:{children:null,onFiles:v()},render:e=>(0,h.jsxs)(a.Root,{"aria-label":`Documents`,disabled:!0,onFiles:e.onFiles,children:[(0,h.jsx)(a.Label,{children:`Drop documents here`}),(0,h.jsx)(a.Description,{children:`File dropping is unavailable.`})]})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFileReadError: fn(),
    onFiles: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const root = findDropZone(canvasElement);
    const dataTransfer = createDataTransfer([new File(['guide'], 'guide.pdf', {
      type: 'application/pdf'
    })]);
    await fireEvent.dragEnter(root, {
      dataTransfer
    });
    await waitFor(() => expect(root).toHaveAttribute('data-drop-target', 'true'));
    await fireEvent.drop(root, {
      dataTransfer
    });
    await waitFor(() => expect(args.onFiles).toHaveBeenCalledOnce());
    await expect(args.onFileReadError).not.toHaveBeenCalled();
  },
  render: args => <DropZone.Root acceptedFileTypes={['application/pdf']} aria-label="Documents" onFileReadError={args.onFileReadError} onFiles={args.onFiles}>
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>PDF documents only.</DropZone.Description>
      <DropZone.Feedback />
    </DropZone.Root>
}`,...S.parameters?.docs?.source},description:{story:`Accepts a PDF through a synthetic native drop, exposes the active target
state, and forwards the successfully read file to the application callback.

@summary accepted native drop and semantic file callback`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  play: async ({
    canvasElement
  }) => {
    const root = findDropZone(canvasElement);
    const dataTransfer = createDataTransfer([new File(['large text'], 'notes.txt', {
      type: 'text/plain'
    })]);
    await fireEvent.dragEnter(root, {
      dataTransfer
    });
    await fireEvent.drop(root, {
      dataTransfer
    });
    await waitFor(() => expect(within(canvasElement).getByRole('alert')).toHaveTextContent('File type is not accepted. File exceeds the maximum size.'));
  },
  render: args => <DropZone.Root acceptedFileTypes={['image/*']} aria-label="Documents" maxFileSize={4} onFiles={args.onFiles}>
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Feedback />
    </DropZone.Root>
}`,...C.parameters?.docs?.source},description:{story:`Rejects a file that violates both type and size constraints and announces
the combined Breeze-owned rejection message in an alert.

@summary combined file type and size rejection feedback`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  render: args => <DropZone.Root allowsMultiple aria-label="Documents" onFiles={args.onFiles}>
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>Multiple files are accepted.</DropZone.Description>
      <DropZone.Feedback />
    </DropZone.Root>
}`,...w.parameters?.docs?.source},description:{story:`Enables a multiple-file drop boundary and provides persistent guidance plus
built-in feedback for application-owned batch workflows.

@summary multiple-file drop configuration`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  play: async ({
    canvasElement
  }) => {
    const dropButton = within(canvasElement).getByRole('button', {
      name: /Required file/
    });
    dropButton.focus();
    await expect(dropButton).toHaveFocus();
  },
  render: args => <DropZone.Root aria-label="Required file" invalid onFiles={args.onFiles} required>
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>
        Drop a file, paste one, or use the file picker.
      </DropZone.Description>
      <FileTrigger.Root onFiles={args.onFiles}>
        <FileTrigger.Trigger>Choose files</FileTrigger.Trigger>
      </FileTrigger.Root>
      <DropZone.Error>A file is required.</DropZone.Error>
    </DropZone.Root>
}`,...T.parameters?.docs?.source},description:{story:`Combines the drop affordance with a keyboard-operable file picker and
associates required guidance and invalid-state feedback with the target.

@summary keyboard file-picker fallback with required invalid state`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  render: args => <DropZone.Root aria-label="Documents" disabled onFiles={args.onFiles}>
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>File dropping is unavailable.</DropZone.Description>
    </DropZone.Root>
}`,...E.parameters?.docs?.source},description:{story:`Prevents focus and file dropping while retaining a visible label and
explanation for why the file interaction is unavailable.

@summary disabled drop target with persistent guidance`,...E.parameters?.docs?.description}}};try{x.displayName=`Root`,x.__docgenInfo={description:`Receives file drops through React Aria's pointer and keyboard model.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DropZone/DropZone.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:`Drop-zone label, guidance, trigger, and feedback.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!0,tags:{},type:{name:`ReactNode`}},acceptedFileTypes:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:`Accepted MIME types, wildcard MIME groups, or extensions.`,name:`acceptedFileTypes`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`readonly string[] | undefined`}},allowsMultiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:"Allows more than one dropped file. Defaults to `false`.",name:`allowsMultiple`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:"Prevents focus and dropping. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:"Exposes invalid state to assistive technology. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},maxFileSize:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:`Maximum accepted file size in bytes.`,name:`maxFileSize`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`number | undefined`}},onFiles:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:`Called with dropped native files.`,name:`onFiles`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!0,tags:{},type:{name:`(files: File[]) => void`}},onReject:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:`Called with files rejected by Breeze constraints.`,name:`onReject`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`((rejections: FileRejection[]) => void) | undefined`}},onFileReadError:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:"Called once when native file reading fails. Mixed drops are atomic: `onFiles` and `onReject` are not called when any item fails to read.",name:`onFileReadError`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`((failures: DropZoneFileReadFailure[]) => void) | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:`Ref to the rendered drop-zone root.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`}],description:"Exposes required presentation and validation state. Defaults to `false`.",name:`required`,parent:{fileName:`breeze-ui/src/primitives/DropZone/DropZone.tsx`,name:`DropZoneRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{S.displayName=`SyntheticDrop`,S.__docgenInfo={description:`Accepts a PDF through a synthetic native drop, exposes the active target
state, and forwards the successfully read file to the application callback.`,displayName:`SyntheticDrop`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DropZone/DropZone.stories.tsx`,methods:[],props:{},tags:{summary:`accepted native drop and semantic file callback`}}}catch{}try{C.displayName=`RejectionFeedback`,C.__docgenInfo={description:`Rejects a file that violates both type and size constraints and announces
the combined Breeze-owned rejection message in an alert.`,displayName:`RejectionFeedback`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DropZone/DropZone.stories.tsx`,methods:[],props:{},tags:{summary:`combined file type and size rejection feedback`}}}catch{}try{w.displayName=`MultipleFiles`,w.__docgenInfo={description:`Enables a multiple-file drop boundary and provides persistent guidance plus
built-in feedback for application-owned batch workflows.`,displayName:`MultipleFiles`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DropZone/DropZone.stories.tsx`,methods:[],props:{},tags:{summary:`multiple-file drop configuration`}}}catch{}try{T.displayName=`KeyboardFallbackAndInvalidState`,T.__docgenInfo={description:`Combines the drop affordance with a keyboard-operable file picker and
associates required guidance and invalid-state feedback with the target.`,displayName:`KeyboardFallbackAndInvalidState`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DropZone/DropZone.stories.tsx`,methods:[],props:{},tags:{summary:`keyboard file-picker fallback with required invalid state`}}}catch{}try{E.displayName=`Disabled`,E.__docgenInfo={description:`Prevents focus and file dropping while retaining a visible label and
explanation for why the file interaction is unavailable.`,displayName:`Disabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/DropZone/DropZone.stories.tsx`,methods:[],props:{},tags:{summary:`disabled drop target with persistent guidance`}}}catch{}D=[`SyntheticDrop`,`RejectionFeedback`,`MultipleFiles`,`KeyboardFallbackAndInvalidState`,`Disabled`]}));O();export{E as Disabled,T as KeyboardFallbackAndInvalidState,w as MultipleFiles,C as RejectionFeedback,S as SyntheticDrop,D as __namedExportsOrder,x as default,O as n,f as t};