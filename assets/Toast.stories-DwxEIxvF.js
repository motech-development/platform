import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{i as n,n as r,o as i,r as a,s as o,t as s}from"./iframe-q_a4TWX4.js";import{n as c,t as l}from"./Typography-AkcnmWkA.js";import{n as u,t as d}from"./Button-CGHDK7dV.js";var f=e({ProviderQueueAndAction:()=>C,QueueLimit:()=>T,StandaloneSemanticOwner:()=>E,Variants:()=>w,__namedExportsOrder:()=>D,default:()=>S});function p(){let e=o();return(0,g.jsx)(d,{onAction:()=>{e.show({action:{label:(0,g.jsx)(l,{as:`span`,children:`Undo upload`}),onAction:x},description:(0,g.jsx)(l,{as:`span`,children:`The document is now available.`}),lifetime:null,title:(0,g.jsx)(l,{as:`span`,children:`Upload complete`}),variant:`success`})},children:`Show notification`})}function m(){let e=o();return(0,g.jsx)(d,{onAction:()=>{e.show({lifetime:null,title:`Primary notification`,variant:`primary`}),e.show({lifetime:null,title:`Secondary notification`,variant:`secondary`}),e.show({lifetime:null,title:`Success notification`,variant:`success`}),e.show({lifetime:null,title:`Danger notification`,variant:`danger`}),e.show({lifetime:null,title:`Warning notification`,variant:`warning`}),e.show({lifetime:null,title:`Information notification`,variant:`info`}),e.show({lifetime:null,title:`Light notification`,variant:`light`}),e.show({lifetime:null,title:`Dark notification`,variant:`dark`})},children:`Show all variants`})}function h(){let e=o();return(0,g.jsx)(d,{onAction:()=>{e.show({lifetime:null,title:`First pending`}),e.show({lifetime:null,title:`Second visible`}),e.show({lifetime:null,title:`Third visible`})},children:`Fill queue`})}var g,_,v,y,b,x,S,C,w,T,E,D,O=t((()=>{r(),u(),c(),i(),g=a(),{expect:_,fn:v,userEvent:y,within:b}=__STORYBOOK_MODULE_TEST__,x=v(),S={args:{onDismiss:v(),title:`Notification`},component:n,title:`Feedback/Toast`},C={play:async()=>{let e=b(document.body);await y.click(e.getByRole(`button`,{name:`Show notification`})),await _(e.getByRole(`alertdialog`,{name:`Upload complete`})).toBeInTheDocument(),await y.click(e.getByRole(`button`,{name:`Undo upload`})),await _(x).toHaveBeenCalled()},render:p},w={decorators:[e=>(0,g.jsx)(s,{locale:`en-GB`,toastLimit:8,children:(0,g.jsx)(e,{})})],play:async()=>{let e=b(document.body);await y.click(e.getByRole(`button`,{name:`Show all variants`})),await _(e.getAllByRole(`alertdialog`)).toHaveLength(8)},render:m},T={play:async()=>{let e=b(document.body);await y.click(e.getByRole(`button`,{name:`Fill queue`})),await _(e.getAllByRole(`alertdialog`)).toHaveLength(2),await _(e.queryByText(`First pending`)).not.toBeInTheDocument()},render:()=>(0,g.jsx)(s,{locale:`en-GB`,toastLimit:2,children:(0,g.jsx)(h,{})})},E={args:{description:`One live interactive owner avoids duplicate announcements.`,title:`Controlled notification`,variant:`info`}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async () => {
    const body = within(document.body);
    await userEvent.click(body.getByRole('button', {
      name: 'Show notification'
    }));
    await expect(body.getByRole('alertdialog', {
      name: 'Upload complete'
    })).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', {
      name: 'Undo upload'
    }));
    await expect(onAction).toHaveBeenCalled();
  },
  render: ActionToastDemo
}`,...C.parameters?.docs?.source},description:{story:`Calls useToast below BreezeProvider, keeps the queued notification visible,
and verifies its application action is available from the live region.

@summary provider-queued persistent toast with an application action`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <BreezeProvider locale="en-GB" toastLimit={8}>
        <Story />
      </BreezeProvider>],
  play: async () => {
    const body = within(document.body);
    await userEvent.click(body.getByRole('button', {
      name: 'Show all variants'
    }));
    await expect(body.getAllByRole('alertdialog')).toHaveLength(8);
  },
  render: VariantToastDemo
}`,...w.parameters?.docs?.source},description:{story:`Queues every supported semantic variant under a provider whose visible limit
is large enough to compare the complete notification palette.

@summary complete semantic variant set in the provider queue`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async () => {
    const body = within(document.body);
    await userEvent.click(body.getByRole('button', {
      name: 'Fill queue'
    }));
    await expect(body.getAllByRole('alertdialog')).toHaveLength(2);
    await expect(body.queryByText('First pending')).not.toBeInTheDocument();
  },
  render: () => <BreezeProvider locale="en-GB" toastLimit={2}>
      <QueueLimitDemo />
    </BreezeProvider>
}`,...T.parameters?.docs?.source},description:{story:`Uses a provider limit of two and queues three persistent notifications to
demonstrate that the oldest visible toast is displaced by newer feedback.

@summary provider queue enforcing a two-toast visible limit`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    description: 'One live interactive owner avoids duplicate announcements.',
    title: 'Controlled notification',
    variant: 'info'
  }
}`,...E.parameters?.docs?.source},description:{story:`Renders one explicitly controlled standalone toast so an application-owned
notification source can avoid duplicating the provider queue announcement.

@summary standalone controlled toast with one semantic owner`,...E.parameters?.docs?.description}}};try{S.displayName=`Toast`,S.__docgenInfo={description:"Displays one explicitly controlled notification. Queued application\nnotifications should use `useToast`.",displayName:`Toast`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{action:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:`Optional application action.`,name:`action`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!1,tags:{},type:{name:`ToastAction | undefined`}},closeLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:`Accessible label for the dismiss button. Defaults to the provider close message.`,name:`closeLabel`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!1,tags:{},type:{name:`string | undefined`}},description:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:`Optional application-owned translated supporting content.`,name:`description`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!1,tags:{},type:{name:`ReactNode`}},onDismiss:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:`Called when the dismiss button or action closes the toast.`,name:`onDismiss`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!0,tags:{},type:{name:`() => void`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:`Ref to the rendered toast element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:`Application-owned translated primary content.`,name:`title`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!0,tags:{},type:{name:`ReactNode`}},variant:{defaultValue:{value:`info`},declarations:[{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`}],description:"Bootstrap-aligned semantic colour. Defaults to `info`.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Toast/Toast.tsx`,name:`ToastProps`},required:!1,tags:{},type:{name:`VisualVariant | undefined`}}},tags:{summary:`for explicitly controlled notifications outside the provider queue`}}}catch{}try{C.displayName=`ProviderQueueAndAction`,C.__docgenInfo={description:`Calls useToast below BreezeProvider, keeps the queued notification visible,
and verifies its application action is available from the live region.`,displayName:`ProviderQueueAndAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{summary:`provider-queued persistent toast with an application action`}}}catch{}try{w.displayName=`Variants`,w.__docgenInfo={description:`Queues every supported semantic variant under a provider whose visible limit
is large enough to compare the complete notification palette.`,displayName:`Variants`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{summary:`complete semantic variant set in the provider queue`}}}catch{}try{T.displayName=`QueueLimit`,T.__docgenInfo={description:`Uses a provider limit of two and queues three persistent notifications to
demonstrate that the oldest visible toast is displaced by newer feedback.`,displayName:`QueueLimit`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{summary:`provider queue enforcing a two-toast visible limit`}}}catch{}try{E.displayName=`StandaloneSemanticOwner`,E.__docgenInfo={description:`Renders one explicitly controlled standalone toast so an application-owned
notification source can avoid duplicating the provider queue announcement.`,displayName:`StandaloneSemanticOwner`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toast/Toast.stories.tsx`,methods:[],props:{},tags:{summary:`standalone controlled toast with one semantic owner`}}}catch{}D=[`ProviderQueueAndAction`,`Variants`,`QueueLimit`,`StandaloneSemanticOwner`]}));O();export{C as ProviderQueueAndAction,T as QueueLimit,E as StandaloneSemanticOwner,w as Variants,D as __namedExportsOrder,S as default,O as n,f as t};