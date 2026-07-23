import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{r as i,t as a}from"./filterDOMProps-D9_SpXhy.js";import{g as o,i as s,r as c,s as l,t as u,u as d}from"./filterDOMProps-BIPiKCCm.js";import{c as f,d as p,f as m,l as h,p as g,r as _,u as v}from"./iframe-CQHtwZcQ.js";import{N as y,h as b,p as x}from"./icons-Cg1FNHcV.js";import{n as S,t as C}from"./Button-BqpQ89mp.js";import{n as w,t as T}from"./IconButton-C0ctajJ6.js";import{n as E,t as D}from"./useToolbar-nVRcGLBx.js";var O=t((()=>{E()})),k,A,j,M=t((()=>{d(),O(),u(),o(),k=n(r(),1),A=(0,k.createContext)({}),j=(0,k.forwardRef)(function(e,t){[e,t]=c(e,t,A);let{toolbarProps:n}=D(e,t),r=s({...e,values:{orientation:e.orientation||`horizontal`},defaultClassName:`react-aria-Toolbar`}),o=a(e,{global:!0});return delete o.id,k.createElement(l.div,{...i(o,r,n),ref:t,slot:e.slot||void 0,"data-orientation":e.orientation||`horizontal`},r.children)})})),N=t((()=>{M()}));function P({children:e,className:t,orientation:n,ref:r,...i}){h();let a=p(r);return(0,F.createElement)(j,{...i,className:I({class:t,orientation:n}),orientation:n,ref:a},e)}var F,I,L=t((()=>{F=n(r(),1),N(),m(),v(),f(),I=g({base:`flex gap-2`,defaultVariants:{orientation:`horizontal`},variants:{orientation:{horizontal:`flex-row items-center`,vertical:`flex-col items-stretch`}}});try{P.displayName=`Toolbar`,P.__docgenInfo={description:`Groups related controls under toolbar semantics and arrow-key navigation.`,displayName:`Toolbar`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:`Related interactive controls.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!0,tags:{},type:{name:`ReactNode`}},orientation:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:"Arrow-key navigation axis. Defaults to `horizontal`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:`Ref to the rendered toolbar.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}}},tags:{summary:`related controls with orientation-aware arrow navigation`}}}catch{}})),R=e({Horizontal:()=>W,Vertical:()=>G,__namedExportsOrder:()=>K,default:()=>U}),z,B,V,H,U,W,G,K,q=t((()=>{y(),S(),w(),L(),z=_(),{expect:B,userEvent:V,within:H}=__STORYBOOK_MODULE_TEST__,U={component:P,title:`Actions/Toolbar`},W={args:{"aria-label":`Item actions`,children:(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(C,{children:`Edit details`}),(0,z.jsx)(T,{"aria-label":`Edit`,children:(0,z.jsx)(b,{})}),(0,z.jsx)(T,{"aria-label":`Delete`,variant:`danger`,children:(0,z.jsx)(x,{})})]})},play:async({canvasElement:e})=>{let t=H(e);t.getByRole(`button`,{name:`Edit details`}).focus(),await V.keyboard(`{ArrowRight}`),await B(t.getByRole(`button`,{name:`Edit`})).toHaveFocus()}},G={args:{"aria-label":`Vertical actions`,children:(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(C,{children:`Move up`}),(0,z.jsx)(C,{children:`Move down`})]}),orientation:`vertical`}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Item actions',
    children: <>
        <Button>Edit details</Button>
        <IconButton aria-label="Edit">
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Delete" variant="danger">
          <DeleteIcon />
        </IconButton>
      </>
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', {
      name: 'Edit details'
    });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', {
      name: 'Edit'
    })).toHaveFocus();
  }
}`,...W.parameters?.docs?.source},description:{story:`Groups text and icon actions beneath one toolbar label and verifies ArrowRight
moves focus between enabled controls on the horizontal axis.

@summary horizontal mixed-action toolbar with arrow navigation`,...W.parameters?.docs?.description}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Vertical actions',
    children: <>
        <Button>Move up</Button>
        <Button>Move down</Button>
      </>,
    orientation: 'vertical'
  }
}`,...G.parameters?.docs?.source},description:{story:`Stacks two related actions along the vertical navigation axis so ArrowUp and
ArrowDown behavior and full-width placement can be evaluated.

@summary vertical toolbar for related movement actions`,...G.parameters?.docs?.description}}};try{U.displayName=`Toolbar`,U.__docgenInfo={description:`Groups related controls under toolbar semantics and arrow-key navigation.`,displayName:`Toolbar`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toolbar/Toolbar.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:`Related interactive controls.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!0,tags:{},type:{name:`ReactNode`}},orientation:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:"Arrow-key navigation axis. Defaults to `horizontal`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:`Ref to the rendered toolbar.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}}},tags:{summary:`related controls with orientation-aware arrow navigation`}}}catch{}try{W.displayName=`Horizontal`,W.__docgenInfo={description:`Groups text and icon actions beneath one toolbar label and verifies ArrowRight
moves focus between enabled controls on the horizontal axis.`,displayName:`Horizontal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toolbar/Toolbar.stories.tsx`,methods:[],props:{},tags:{summary:`horizontal mixed-action toolbar with arrow navigation`}}}catch{}try{G.displayName=`Vertical`,G.__docgenInfo={description:`Stacks two related actions along the vertical navigation axis so ArrowUp and
ArrowDown behavior and full-width placement can be evaluated.`,displayName:`Vertical`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toolbar/Toolbar.stories.tsx`,methods:[],props:{},tags:{summary:`vertical toolbar for related movement actions`}}}catch{}K=[`Horizontal`,`Vertical`]}));q();export{W as Horizontal,G as Vertical,K as __namedExportsOrder,U as default,q as n,R as t};