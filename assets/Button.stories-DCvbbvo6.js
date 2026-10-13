import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Button-C8wHUg7V.js";import{n as s,t as c}from"./Link-CaAYvnZG.js";import{n as l,t as u}from"./Typography-CEt3x14j.js";import{n as d,t as f}from"./Card-DssyqaHD.js";import{n as p,t as m}from"./Stack-_A66K6E3.js";import{n as h,t as g}from"./Inline-COgaq7ET.js";var _=n({Activation:()=>F,Danger:()=>A,Disabled:()=>N,Loading:()=>M,LongLabel:()=>P,Primary:()=>w,Quiet:()=>D,RowAction:()=>k,Secondary:()=>T,TreatmentsAndSizes:()=>j,WithIcon:()=>E,__namedExportsOrder:()=>I,default:()=>C});function v(){let[e,t]=(0,y.useState)(0);return(0,b.jsxs)(`div`,{className:`breeze-story-action`,children:[(0,b.jsx)(o,{onAction:()=>t(e=>e+1),children:`Save changes`}),(0,b.jsxs)(`p`,{role:`status`,children:[e,` actions completed`]})]})}var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L=t((()=>{y=e(r(),1),d(),h(),s(),p(),l(),a(),b=i(),{expect:x,within:S}=__STORYBOOK_MODULE_TEST__,C={args:{children:`Save changes`},component:o,title:`Actions/Button`},w={},T={args:{children:`Cancel`,variant:`secondary`}},E={args:{children:`Record transaction`,icon:`add`},play:async({canvasElement:e})=>{let t=S(e).getByRole(`button`,{name:`Record transaction`}),n=t.querySelector(`svg`).getBoundingClientRect(),r=S(t).getByText(`Record transaction`).getBoundingClientRect();await x(n.width).toBe(16),await x(r.left-n.right).toBe(8)}},D={args:{children:`Mark all as read`,variant:`quiet`}},O=[{created:`3 October 2026`,expires:`4 October 2026`,id:`october`},{created:`2 September 2026`,expires:`3 September 2026`,id:`september`}],k={play:async({canvasElement:e})=>{let[t]=S(e).getAllByRole(`button`,{name:`Download`}),n=getComputedStyle(t);await x({background:n.backgroundColor,fontSize:n.fontSize,fontWeight:n.fontWeight,height:t.getBoundingClientRect().height,paddingInline:n.paddingInlineStart}).toEqual({background:`rgba(0, 0, 0, 0)`,fontSize:`13px`,fontWeight:`400`,height:18.84375,paddingInline:`4px`})},render:()=>(0,b.jsx)(f,{action:(0,b.jsx)(c,{href:`#reports`,children:`All`}),element:`section`,title:`Recent reports`,children:(0,b.jsx)(m,{gap:3,children:O.map(e=>(0,b.jsxs)(g,{gap:3,justify:`between`,verticalAlign:`center`,children:[(0,b.jsxs)(m,{gap:0,children:[(0,b.jsx)(u,{id:`report-${e.id}`,children:e.created}),(0,b.jsx)(u,{tone:`muted`,variant:`caption`,children:`Expires ${e.expires}`})]}),(0,b.jsx)(o,{"aria-describedby":`report-${e.id}`,variant:`quiet`,children:`Download`})]},e.id))})})},A={args:{children:`Delete item`,variant:`danger`}},j={play:async({canvasElement:e})=>{let t=S(e),n=e=>{let n=t.getByRole(`button`,{name:e}),r=getComputedStyle(n);return{fontSize:r.fontSize,fontWeight:r.fontWeight,height:n.getBoundingClientRect().height,paddingInline:r.paddingInlineStart}};await x(n(`secondary · sm`)).toEqual({fontSize:`12px`,fontWeight:`600`,height:32,paddingInline:`12px`}),await x(n(`primary · md`)).toEqual({fontSize:`13px`,fontWeight:`600`,height:36,paddingInline:`14px`}),await x(n(`secondary · md`)).toEqual({fontSize:`13px`,fontWeight:`600`,height:36,paddingInline:`12px`})},render:()=>(0,b.jsx)(`div`,{className:`breeze-story-stack`,children:[`sm`,`md`,`lg`].map(e=>(0,b.jsx)(`div`,{className:`breeze-story-row`,children:[`primary`,`secondary`,`danger`].map(t=>(0,b.jsx)(o,{size:e,variant:t,children:`${t} · ${e}`},t))},e))})},M={render:()=>(0,b.jsxs)(`div`,{className:`breeze-story-stack`,children:[[`sm`,`md`,`lg`].map(e=>(0,b.jsx)(`div`,{className:`breeze-story-row`,children:[`primary`,`secondary`,`danger`].map(t=>(0,b.jsx)(o,{loading:!0,size:e,variant:t,children:`${t} · ${e}`},t))},e)),(0,b.jsx)(`div`,{className:`breeze-story-row`,children:(0,b.jsx)(o,{loading:!0,variant:`quiet`,children:`quiet`})})]})},N={args:{disabled:!0}},P={args:{children:`Save all changes and return to the previous screen`,variant:`secondary`}},F={render:()=>(0,b.jsx)(v,{})},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{}`,...w.parameters?.docs?.source},description:{story:`The default variant and size.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Cancel',
    variant: 'secondary'
  }
}`,...T.parameters?.docs?.source},description:{story:`A neutral alternative to the primary action.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Record transaction',
    icon: 'add'
  },
  play: async ({
    canvasElement
  }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Record transaction'
    });
    const icon = button.querySelector('svg')!.getBoundingClientRect();
    const label = within(button).getByText('Record transaction').getBoundingClientRect();
    await expect(icon.width).toBe(16);
    await expect(label.left - icon.right).toBe(8);
  }
}`,...E.parameters?.docs?.source},description:{story:`A decorative icon leads the label, as on a page's primary action.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Mark all as read',
    variant: 'quiet'
  }
}`,...D.parameters?.docs?.source},description:{story:`A text action without a control box.`,...D.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const [download] = within(canvasElement).getAllByRole('button', {
      name: 'Download'
    });
    const style = getComputedStyle(download);
    await expect({
      background: style.backgroundColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      height: download.getBoundingClientRect().height,
      paddingInline: style.paddingInlineStart
    }).toEqual({
      background: 'rgba(0, 0, 0, 0)',
      fontSize: '13px',
      fontWeight: '400',
      height: 18.84375,
      paddingInline: '4px'
    });
  },
  render: () => <Card action={<Link href="#reports">All</Link>} element="section" title="Recent reports">
      <Stack gap={3}>
        {reports.map(report => <Inline gap={3} justify="between" key={report.id} verticalAlign="center">
            <Stack gap={0}>
              <Typography id={\`report-\${report.id}\`}>
                {report.created}
              </Typography>
              <Typography tone="muted" variant="caption">
                {\`Expires \${report.expires}\`}
              </Typography>
            </Stack>
            <Button aria-describedby={\`report-\${report.id}\`} variant="quiet">
              Download
            </Button>
          </Inline>)}
      </Stack>
    </Card>
}`,...k.parameters?.docs?.source},description:{story:`Quiet text actions on rows inside a panel.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Delete item',
    variant: 'danger'
  }
}`,...A.parameters?.docs?.source},description:{story:`A destructive action.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const measure = (name: string) => {
      const button = canvas.getByRole('button', {
        name
      });
      const style = getComputedStyle(button);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        height: button.getBoundingClientRect().height,
        paddingInline: style.paddingInlineStart
      };
    };
    await expect(measure('secondary · sm')).toEqual({
      fontSize: '12px',
      fontWeight: '600',
      height: 32,
      paddingInline: '12px'
    });
    await expect(measure('primary · md')).toEqual({
      fontSize: '13px',
      fontWeight: '600',
      height: 36,
      paddingInline: '14px'
    });
    await expect(measure('secondary · md')).toEqual({
      fontSize: '13px',
      fontWeight: '600',
      height: 36,
      paddingInline: '12px'
    });
  },
  render: () => <div className="breeze-story-stack">
      {(['sm', 'md', 'lg'] satisfies ControlSize[]).map(size => <div className="breeze-story-row" key={size}>
          {(['primary', 'secondary', 'danger'] satisfies ButtonVariant[]).map(variant => <Button key={variant} size={size} variant={variant}>
                {\`\${variant} · \${size}\`}
              </Button>)}
        </div>)}
    </div>
}`,...j.parameters?.docs?.source},description:{story:`Every boxed treatment at each size.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <div className="breeze-story-stack">
      {(['sm', 'md', 'lg'] satisfies ControlSize[]).map(size => <div className="breeze-story-row" key={size}>
          {(['primary', 'secondary', 'danger'] satisfies ButtonVariant[]).map(variant => <Button key={variant} loading size={size} variant={variant}>
                {\`\${variant} · \${size}\`}
              </Button>)}
        </div>)}
      <div className="breeze-story-row">
        <Button loading variant="quiet">
          quiet
        </Button>
      </div>
    </div>
}`,...M.parameters?.docs?.source},description:{story:`Every boxed treatment and size, and the quiet text action, while loading.`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...N.parameters?.docs?.source},description:{story:`A button that cannot be activated.`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Save all changes and return to the previous screen',
    variant: 'secondary'
  }
}`,...P.parameters?.docs?.source},description:{story:`A label that wraps onto a second line.`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <ActionExample />
}`,...F.parameters?.docs?.source},description:{story:"`onAction` updating application state.",...F.parameters?.docs?.description}}};try{C.displayName=`Button`,C.__docgenInfo={description:`Performs a semantic action with a visible label and an optional loading skeleton.`,displayName:`Button`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{"aria-controls":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Identifies the element whose contents or presence this button controls.`,name:`aria-controls`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},"aria-describedby":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Identifies elements that provide additional information about the button.`,name:`aria-describedby`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},"aria-expanded":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Indicates whether the controlled element is currently expanded.`,name:`aria-expanded`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`Booleanish | undefined`}},"aria-haspopup":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Indicates the type of interactive popup opened by the button.`,name:`aria-haspopup`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`"dialog" | "false" | "grid" | "listbox" | "menu" | "tree" | "true" | boolean | undefined`}},"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Provides an accessible name when it should differ from the visible label.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},"aria-labelledby":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Identifies elements whose text provides the button's accessible name.`,name:`aria-labelledby`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Visible action label, retained as the accessible name while loading.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!0,tags:{},type:{name:`string`}},disabled:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Prevents activation and removes the button from the tab order.`,name:`disabled`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},icon:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Decorative icon shown before the label.`,name:`icon`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`"add" | "back" | "building" | "calendar" | "camera" | "check" | "clock" | "close" | "delete" | "document" | "download" | "expand" | "forward" | "incoming" | "list" | "lock" | "more" | ... 8 more ... | undefined`}},form:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:"Associates a submit button with a form by its HTML `id`.",name:`form`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},id:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:"Sets the rendered button's HTML `id`.",name:`id`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Shows the button's own skeleton and prevents repeat activation.`,name:`loading`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},name:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Sets the name submitted with the button's form value.`,name:`name`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Reports a semantic activation, without a DOM event.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`(() => void) | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Provides access to the rendered button element.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`Ref<HTMLButtonElement> | undefined`}},type:{defaultValue:{value:`button`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:"Selects ordinary or form-submission behaviour. Defaults to `button`.",name:`type`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`"button" | "submit" | undefined`}},value:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`}],description:`Sets the value submitted when this button submits a form.`,name:`value`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`ButtonCommonProps`},required:!1,tags:{},type:{name:`string | undefined`}},size:{defaultValue:{value:`md`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`BoxedButtonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`QuietButtonProps`}],description:"Selects the button's dimensions. Defaults to `md`.\nThe quiet text action has one size.",name:`size`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`BoxedButtonProps`},required:!1,tags:{},type:{name:`ControlSize | undefined`}},variant:{defaultValue:{value:`primary`},declarations:[{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`BoxedButtonProps`},{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`QuietButtonProps`}],description:"Selects the button's visual and semantic treatment. Defaults to `primary`.\nRenders a text action without a control box.",name:`variant`,parent:{fileName:`breeze-ui/src/primitives/Button/Button.tsx`,name:`BoxedButtonProps`},required:!1,tags:{},type:{name:`"danger" | "primary" | "quiet" | "secondary" | undefined`}}},tags:{summary:`A closed, labelled action in three boxed treatments and three sizes, or a quiet text action.`}}}catch{}try{w.displayName=`Primary`,w.__docgenInfo={description:`The default variant and size.`,displayName:`Primary`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{T.displayName=`Secondary`,T.__docgenInfo={description:`A neutral alternative to the primary action.`,displayName:`Secondary`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{E.displayName=`WithIcon`,E.__docgenInfo={description:`A decorative icon leads the label, as on a page's primary action.`,displayName:`WithIcon`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{D.displayName=`Quiet`,D.__docgenInfo={description:`A text action without a control box.`,displayName:`Quiet`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{k.displayName=`RowAction`,k.__docgenInfo={description:`Quiet text actions on rows inside a panel.`,displayName:`RowAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{A.displayName=`Danger`,A.__docgenInfo={description:`A destructive action.`,displayName:`Danger`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{j.displayName=`TreatmentsAndSizes`,j.__docgenInfo={description:`Every boxed treatment at each size.`,displayName:`TreatmentsAndSizes`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{M.displayName=`Loading`,M.__docgenInfo={description:`Every boxed treatment and size, and the quiet text action, while loading.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{N.displayName=`Disabled`,N.__docgenInfo={description:`A button that cannot be activated.`,displayName:`Disabled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{P.displayName=`LongLabel`,P.__docgenInfo={description:`A label that wraps onto a second line.`,displayName:`LongLabel`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{F.displayName=`Activation`,F.__docgenInfo={description:"`onAction` updating application state.",displayName:`Activation`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Button/Button.stories.tsx`,methods:[],props:{},tags:{}}}catch{}I=[`Primary`,`Secondary`,`WithIcon`,`Quiet`,`RowAction`,`Danger`,`TreatmentsAndSizes`,`Loading`,`Disabled`,`LongLabel`,`Activation`]}));L();export{F as Activation,A as Danger,N as Disabled,M as Loading,P as LongLabel,w as Primary,D as Quiet,k as RowAction,T as Secondary,j as TreatmentsAndSizes,E as WithIcon,I as __namedExportsOrder,C as default,L as n,_ as t};