import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./jsx-runtime-cM__dR4X.js";import{a as r,i,n as a,r as o,t as s}from"./FileTrigger-CEu9lsum.js";import{n as c,t as l}from"./Stack-0pHCj1U7.js";var u=t({KeyboardSelection:()=>y,MultipleFiles:()=>C,NativeAndValidationStates:()=>w,NativeFormSubmission:()=>x,RequiredValidation:()=>S,TypeAndSizeFeedback:()=>b,__namedExportsOrder:()=>T,default:()=>v}),d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E=e((()=>{c(),r(),d=n(),{expect:f,fireEvent:p,fn:m,userEvent:h,waitFor:g,within:_}=__STORYBOOK_MODULE_TEST__,v={component:o,decorators:[e=>(Object.assign(a.Feedback,{displayName:`FileTrigger.Feedback`}),Object.assign(a.Root,{displayName:`FileTrigger.Root`}),Object.assign(a.Trigger,{displayName:`FileTrigger.Trigger`}),(0,d.jsx)(e,{}))],subcomponents:{Feedback:s,Trigger:i},title:`Files/FileTrigger`},y={args:{children:null,onFiles:m()},play:async({args:e,canvasElement:t})=>{let n=_(t).getByRole(`button`,{name:`Choose document`}),r=t.querySelector(`input[type="file"]`);if(!r)throw Error(`Expected the native file input.`);n.focus(),await f(n).toHaveFocus(),await h.upload(r,new File([`guide`],`guide.pdf`,{type:`application/pdf`})),await f(e.onFiles).toHaveBeenCalledOnce()},render:e=>(0,d.jsxs)(a.Root,{acceptedFileTypes:[`application/pdf`],onFiles:e.onFiles,children:[(0,d.jsx)(a.Trigger,{children:`Choose document`}),(0,d.jsx)(a.Feedback,{})]})},b={args:{children:null,onFiles:m()},play:async({canvasElement:e})=>{let t=e.querySelector(`input[type="file"]`);if(!t)throw Error(`Expected the native file input.`);await p.change(t,{target:{files:[new File([`too large`],`notes.txt`,{type:`text/plain`})]}}),await f(_(e).getByRole(`alert`)).toHaveTextContent(`File type is not accepted. File exceeds the maximum size.`)},render:e=>(0,d.jsxs)(a.Root,{acceptedFileTypes:[`image/*`,`.jpg`],maxFileSize:4,onFiles:e.onFiles,children:[(0,d.jsx)(a.Trigger,{children:`Choose image`}),(0,d.jsx)(a.Feedback,{})]})},x={args:{children:null,onFiles:m()},play:async({canvasElement:e})=>{let t=e.querySelector(`input[type="file"]`),n=e.querySelector(`form`);if(!t||!n)throw Error(`Expected the native file input and form.`);let r=new File([`guide`],`guide.pdf`,{type:`application/pdf`}),i=new File([`notes`],`notes.txt`,{type:`text/plain`}),a=new DataTransfer;a.items.add(r),a.items.add(i),t.files=a.files,await p.change(t),await g(()=>f(t).toHaveAttribute(`name`,`documents`)),await f(t.files).toHaveLength(1),await f(n.elements.namedItem(`documents`)).toBe(t);let o=new FormData(n).getAll(`documents`);await f(o).toHaveLength(1),await f(o[0].name).toBe(`guide.pdf`)},render:e=>(0,d.jsx)(`form`,{"aria-label":`Document upload`,children:(0,d.jsxs)(a.Root,{acceptedFileTypes:[`application/pdf`],allowsMultiple:!0,name:`documents`,onFiles:e.onFiles,children:[(0,d.jsx)(a.Trigger,{children:`Choose documents`}),(0,d.jsx)(a.Feedback,{})]})})},S={args:{children:null,onFiles:m()},play:async({canvasElement:e})=>{let t=_(e),n=e.querySelector(`form`),r=e.querySelector(`input[type="file"]`),i=t.getByRole(`button`,{name:`Choose evidence`});if(!n||!r)throw Error(`Expected the required native file input and form.`);let a=m();n.addEventListener(`submit`,a),n.requestSubmit(),await f(a).not.toHaveBeenCalled(),await f(r).toBeInvalid(),await f(i).toHaveAttribute(`aria-invalid`,`true`),await f(i).toHaveFocus()},render:e=>(0,d.jsx)(`form`,{"aria-label":`Evidence upload`,children:(0,d.jsx)(a.Root,{name:`evidence`,onFiles:e.onFiles,required:!0,children:(0,d.jsx)(a.Trigger,{children:`Choose evidence`})})})},C={args:{children:null,onFiles:m()},render:e=>(0,d.jsxs)(a.Root,{allowsMultiple:!0,onFiles:e.onFiles,children:[(0,d.jsx)(a.Trigger,{children:`Choose documents`}),(0,d.jsx)(a.Feedback,{})]})},w={args:{children:null,onFiles:m()},render:e=>(0,d.jsxs)(l,{gap:`md`,children:[(0,d.jsx)(a.Root,{disabled:!0,onFiles:e.onFiles,children:(0,d.jsx)(a.Trigger,{children:`Disabled selection`})}),(0,d.jsxs)(a.Root,{acceptDirectory:!0,defaultCamera:`environment`,form:`upload-form`,invalid:!0,name:`files`,onFiles:e.onFiles,required:!0,children:[(0,d.jsx)(a.Trigger,{children:`Select a directory`}),(0,d.jsx)(a.Feedback,{})]})]})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Choose document'
    });
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) {
      throw new Error('Expected the native file input.');
    }
    trigger.focus();
    await expect(trigger).toHaveFocus();
    await userEvent.upload(input, new File(['guide'], 'guide.pdf', {
      type: 'application/pdf'
    }));
    await expect(args.onFiles).toHaveBeenCalledOnce();
  },
  render: args => <FileTrigger.Root acceptedFileTypes={['application/pdf']} onFiles={args.onFiles}>
      <FileTrigger.Trigger>Choose document</FileTrigger.Trigger>
      <FileTrigger.Feedback />
    </FileTrigger.Root>
}`,...y.parameters?.docs?.source},description:{story:`Focuses the pressable trigger and selects an accepted PDF through the hidden
native input so the application receives the validated file.

@summary keyboard-operable accepted file selection`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  play: async ({
    canvasElement
  }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) {
      throw new Error('Expected the native file input.');
    }
    await fireEvent.change(input, {
      target: {
        files: [new File(['too large'], 'notes.txt', {
          type: 'text/plain'
        })]
      }
    });
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('File type is not accepted. File exceeds the maximum size.');
  },
  render: args => <FileTrigger.Root acceptedFileTypes={['image/*', '.jpg']} maxFileSize={4} onFiles={args.onFiles}>
      <FileTrigger.Trigger>Choose image</FileTrigger.Trigger>
      <FileTrigger.Feedback />
    </FileTrigger.Root>
}`,...b.parameters?.docs?.source},description:{story:`Selects a file that violates both accepted-type and maximum-size constraints
and announces the combined Breeze-owned rejection message.

@summary file type and size rejection feedback`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  play: async ({
    canvasElement
  }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    const form = canvasElement.querySelector<HTMLFormElement>('form');
    if (!input || !form) {
      throw new Error('Expected the native file input and form.');
    }
    const accepted = new File(['guide'], 'guide.pdf', {
      type: 'application/pdf'
    });
    const rejected = new File(['notes'], 'notes.txt', {
      type: 'text/plain'
    });
    const selectedFiles = new DataTransfer();
    selectedFiles.items.add(accepted);
    selectedFiles.items.add(rejected);
    input.files = selectedFiles.files;
    await fireEvent.change(input);
    await waitFor(() => expect(input).toHaveAttribute('name', 'documents'));
    await expect(input.files).toHaveLength(1);
    await expect(form.elements.namedItem('documents')).toBe(input);
    const submittedFiles = new FormData(form).getAll('documents');
    await expect(submittedFiles).toHaveLength(1);
    await expect((submittedFiles[0] as File).name).toBe('guide.pdf');
  },
  render: args => <form aria-label="Document upload">
      <FileTrigger.Root acceptedFileTypes={['application/pdf']} allowsMultiple name="documents" onFiles={args.onFiles}>
        <FileTrigger.Trigger>Choose documents</FileTrigger.Trigger>
        <FileTrigger.Feedback />
      </FileTrigger.Root>
    </form>
}`,...x.parameters?.docs?.source},description:{story:`Submits a mixed native selection and verifies Breeze removes rejected files
from the browser-owned form value while retaining accepted files.

@summary validated native form submission`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector<HTMLFormElement>('form');
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    const trigger = canvas.getByRole('button', {
      name: 'Choose evidence'
    });
    if (!form || !input) {
      throw new Error('Expected the required native file input and form.');
    }
    const onSubmit = fn();
    form.addEventListener('submit', onSubmit);
    form.requestSubmit();
    await expect(onSubmit).not.toHaveBeenCalled();
    await expect(input).toBeInvalid();
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveFocus();
  },
  render: args => <form aria-label="Evidence upload">
      <FileTrigger.Root name="evidence" onFiles={args.onFiles} required>
        <FileTrigger.Trigger>Choose evidence</FileTrigger.Trigger>
      </FileTrigger.Root>
    </form>
}`,...S.parameters?.docs?.source},description:{story:`Submits an empty required picker and verifies native validation redirects
focus and invalid state to the visible keyboard-operable trigger.

@summary required native validation focus`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  render: args => <FileTrigger.Root allowsMultiple onFiles={args.onFiles}>
      <FileTrigger.Trigger>Choose documents</FileTrigger.Trigger>
      <FileTrigger.Feedback />
    </FileTrigger.Root>
}`,...C.parameters?.docs?.source},description:{story:`Enables native selection of more than one file while keeping accepted files,
upload transport, and subsequent processing application-owned.

@summary multiple native file selection`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    onFiles: fn()
  },
  render: args => <Stack gap="md">
      <FileTrigger.Root disabled onFiles={args.onFiles}>
        <FileTrigger.Trigger>Disabled selection</FileTrigger.Trigger>
      </FileTrigger.Root>
      <FileTrigger.Root acceptDirectory defaultCamera="environment" form="upload-form" invalid name="files" onFiles={args.onFiles} required>
        <FileTrigger.Trigger>Select a directory</FileTrigger.Trigger>
        <FileTrigger.Feedback />
      </FileTrigger.Root>
    </Stack>
}`,...w.parameters?.docs?.source},description:{story:`Compares a disabled picker with a required invalid directory and camera
configuration that participates in an external native form.

@summary disabled directory capture and validation states`,...w.parameters?.docs?.description}}};try{v.displayName=`Root`,v.__docgenInfo={description:`Coordinates native file selection with a React Aria pressable trigger.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/FileTrigger/FileTrigger.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Pressable trigger and file-selection feedback.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!0,tags:{},type:{name:`ReactNode`}},acceptedFileTypes:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Accepted MIME types, wildcard MIME groups, or extensions.`,name:`acceptedFileTypes`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`readonly string[] | undefined`}},acceptDirectory:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:"Enables native directory selection instead of individual files. Defaults to `false`.",name:`acceptDirectory`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},allowsMultiple:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:"Allows more than one file to be selected. Defaults to `false`.",name:`allowsMultiple`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:"Prevents opening the native file dialog. Defaults to `false`.",name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},defaultCamera:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Requests the user-facing or environment camera for media capture.`,name:`defaultCamera`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`"environment" | "user" | undefined`}},form:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`External native form id.`,name:`form`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`string | undefined`}},invalid:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:"Exposes invalid state to assistive technology. Defaults to `false`.",name:`invalid`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},maxFileSize:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Maximum accepted file size in bytes.`,name:`maxFileSize`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`number | undefined`}},name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Native form field name.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`string | undefined`}},onFiles:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Called with selected native files.`,name:`onFiles`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!0,tags:{},type:{name:`(files: File[]) => void`}},onReject:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Called with files rejected by Breeze constraints.`,name:`onReject`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`((rejections: FileRejection[]) => void) | undefined`}},required:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:"Marks file selection as required for assistive technology. Defaults to `false`.",name:`required`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`}],description:`Ref to the hidden native file input.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/FileTrigger/FileTrigger.tsx`,name:`FileTriggerRootProps`},required:!1,tags:{},type:{name:`Ref<HTMLInputElement> | undefined`}}},tags:{}}}catch{}try{y.displayName=`KeyboardSelection`,y.__docgenInfo={description:`Focuses the pressable trigger and selects an accepted PDF through the hidden
native input so the application receives the validated file.`,displayName:`KeyboardSelection`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/FileTrigger/FileTrigger.stories.tsx`,methods:[],props:{},tags:{summary:`keyboard-operable accepted file selection`}}}catch{}try{b.displayName=`TypeAndSizeFeedback`,b.__docgenInfo={description:`Selects a file that violates both accepted-type and maximum-size constraints
and announces the combined Breeze-owned rejection message.`,displayName:`TypeAndSizeFeedback`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/FileTrigger/FileTrigger.stories.tsx`,methods:[],props:{},tags:{summary:`file type and size rejection feedback`}}}catch{}try{x.displayName=`NativeFormSubmission`,x.__docgenInfo={description:`Submits a mixed native selection and verifies Breeze removes rejected files
from the browser-owned form value while retaining accepted files.`,displayName:`NativeFormSubmission`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/FileTrigger/FileTrigger.stories.tsx`,methods:[],props:{},tags:{summary:`validated native form submission`}}}catch{}try{S.displayName=`RequiredValidation`,S.__docgenInfo={description:`Submits an empty required picker and verifies native validation redirects
focus and invalid state to the visible keyboard-operable trigger.`,displayName:`RequiredValidation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/FileTrigger/FileTrigger.stories.tsx`,methods:[],props:{},tags:{summary:`required native validation focus`}}}catch{}try{C.displayName=`MultipleFiles`,C.__docgenInfo={description:`Enables native selection of more than one file while keeping accepted files,
upload transport, and subsequent processing application-owned.`,displayName:`MultipleFiles`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/FileTrigger/FileTrigger.stories.tsx`,methods:[],props:{},tags:{summary:`multiple native file selection`}}}catch{}try{w.displayName=`NativeAndValidationStates`,w.__docgenInfo={description:`Compares a disabled picker with a required invalid directory and camera
configuration that participates in an external native form.`,displayName:`NativeAndValidationStates`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/FileTrigger/FileTrigger.stories.tsx`,methods:[],props:{},tags:{summary:`disabled directory capture and validation states`}}}catch{}T=[`KeyboardSelection`,`TypeAndSizeFeedback`,`NativeFormSubmission`,`RequiredValidation`,`MultipleFiles`,`NativeAndValidationStates`]}));E();export{y as KeyboardSelection,C as MultipleFiles,w as NativeAndValidationStates,x as NativeFormSubmission,S as RequiredValidation,b as TypeAndSizeFeedback,T as __namedExportsOrder,v as default,E as n,u as t};