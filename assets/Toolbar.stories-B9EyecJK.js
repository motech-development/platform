import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{r as i,t as a}from"./filterDOMProps-ByZAOx5l.js";import{g as o,i as s,r as c,s as l,t as u,u as d}from"./filterDOMProps-CiLFKKHE.js";import{n as f,t as p}from"./dist-ByKaD744.js";import{a as m,i as h,n as g,r as _}from"./BreezeContext-BIB7r8Lx.js";import{t as v}from"./jsx-runtime-cM__dR4X.js";import{N as y,h as b,p as x}from"./icons-p-UCV5fK.js";import{n as S,t as C}from"./Button-BEpHfrRB.js";import{n as w,t as T}from"./IconButton-BjSSbUTx.js";import{n as E,t as D}from"./useToolbar-BMZH_o31.js";var O=t((()=>{E()})),k,A,j,M=t((()=>{d(),O(),u(),o(),k=e(r(),1),A=(0,k.createContext)({}),j=(0,k.forwardRef)(function(e,t){[e,t]=c(e,t,A);let{toolbarProps:n}=D(e,t),r=s({...e,values:{orientation:e.orientation||`horizontal`},defaultClassName:`react-aria-Toolbar`}),o=a(e,{global:!0});return delete o.id,k.createElement(l.div,{...i(o,r,n),ref:t,slot:e.slot||void 0,"data-orientation":e.orientation||`horizontal`},r.children)})})),N=t((()=>{M()}));function P({children:e,className:t,orientation:n,ref:r,...i}){_();let a=m(r);return(0,F.createElement)(j,{...i,className:I({class:t,orientation:n}),orientation:n,ref:a},e)}var F,I,L=t((()=>{F=e(r(),1),N(),p(),h(),g(),I=f({base:`flex gap-2`,defaultVariants:{orientation:`horizontal`},variants:{orientation:{horizontal:`flex-row items-center`,vertical:`flex-col items-stretch`}}});try{P.displayName=`Toolbar`,P.__docgenInfo={description:`Groups related controls under toolbar semantics and arrow-key navigation.`,displayName:`Toolbar`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:`Related interactive controls.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!0,tags:{},type:{name:`ReactNode`}},orientation:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:"Arrow-key navigation axis. Defaults to `horizontal`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`}],description:`Ref to the rendered toolbar.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Toolbar/Toolbar.tsx`,name:`ToolbarProps`},required:!1,tags:{},type:{name:`Ref<HTMLDivElement> | undefined`}}},tags:{summary:`related controls with orientation-aware arrow navigation`}}}catch{}})),R=n({Horizontal:()=>W,Vertical:()=>G,__namedExportsOrder:()=>K,default:()=>U}),z,B,V,H,U,W,G,K,q=t((()=>{y(),S(),w(),L(),z=v(),{expect:B,userEvent:V,within:H}=__STORYBOOK_MODULE_TEST__,U={component:P,title:`Actions/Toolbar`},W={args:{"aria-label":`Item actions`,children:(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(C,{children:`Edit details`}),(0,z.jsx)(T,{"aria-label":`Edit`,children:(0,z.jsx)(b,{})}),(0,z.jsx)(T,{"aria-label":`Delete`,variant:`danger`,children:(0,z.jsx)(x,{})})]})},play:async({canvasElement:e})=>{let t=H(e);t.getByRole(`button`,{name:`Edit details`}).focus(),await V.keyboard(`{ArrowRight}`),await B(t.getByRole(`button`,{name:`Edit`})).toHaveFocus()}},G={args:{"aria-label":`Vertical actions`,children:(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(C,{children:`Move up`}),(0,z.jsx)(C,{children:`Move down`})]}),orientation:`vertical`}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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