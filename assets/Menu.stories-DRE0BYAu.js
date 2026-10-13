import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Button-C8wHUg7V.js";import{n as s,t as c}from"./Menu-DAxf5zZr.js";var l=n({Controlled:()=>k,Default:()=>x,DestructiveAction:()=>D,IconOnlyTrigger:()=>O,Loading:()=>A,NarrowWidth:()=>T,Sections:()=>C,__namedExportsOrder:()=>j,default:()=>b});function u(e){return e?{...e.id===`harbour`&&{badge:{children:`Selected`,variant:`brand`}},id:e.id,initials:e.initials,label:e.name,section:{id:`companies`,label:`Companies`}}:{icon:`settings`,id:`manage`,label:`Manage companies`}}function d(){let[e,t]=(0,p.useState)(!1),[n,r]=(0,p.useState)(`none`);return(0,m.jsxs)(`div`,{className:`breeze-story-action`,children:[(0,m.jsx)(c,{getItem:e=>e,items:y,onAction:e=>r(e.label),onOpenChange:t,open:e,trigger:`Account actions`,triggerIcon:`people`}),(0,m.jsxs)(`output`,{children:[`Menu is `,e?`open`:`closed`,`. Last action: `,n,`.`]})]})}function f(){let[e,t]=(0,p.useState)(!0);return(0,m.jsxs)(`div`,{className:`breeze-story-action`,children:[(0,m.jsx)(c,{getItem:e=>e,items:y,loading:e,trigger:`Account actions`,triggerIcon:`people`}),(0,m.jsx)(o,{onAction:()=>t(e=>!e),children:e?`Finish loading menu`:`Start loading menu`})]})}var p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M=t((()=>{p=e(r(),1),a(),s(),m=i(),{expect:h,userEvent:g,waitFor:_,within:v}=__STORYBOOK_MODULE_TEST__,y=[{badge:{children:`New`,variant:`brand`},icon:`settings`,id:`settings`,label:`Settings`},{description:`End the current session.`,icon:`signOut`,id:`sign-out`,label:`Sign out`},{disabled:!0,id:`unavailable`,label:`Unavailable action`}],b={args:{defaultOpen:!0,getItem:e=>e,items:y,trigger:`Account actions`,triggerIcon:`people`},component:c,title:`Overlays/Menu`},x={play:async({canvasElement:e})=>{let t=v(e).getByRole(`button`,{name:`Account actions`}),n=(await v(document.body).findByRole(`menu`,{name:`Account actions`})).closest(`.breeze-popover`);if(!n)throw Error(`The menu popover was not rendered.`);await h(n.offsetWidth).toBeGreaterThanOrEqual(Math.max(256,t.offsetWidth))}},S=[{id:`harbour`,initials:`HP`,name:`Harbour & Pine Ltd`},{id:`wold`,initials:`WF`,name:`Wold Farm Joinery Ltd`},null],C={play:async()=>{await document.fonts.ready;let e=await v(document.body).findByRole(`menu`,{name:`Harbour & Pine Ltd`}),t=e.closest(`.breeze-popover`);if(!t)throw Error(`The menu popover was not rendered.`);await Promise.all(t.getAnimations().map(({finished:e})=>e));let n=v(e).getByRole(`group`,{name:`Companies`}),[r,i]=v(n).getAllByRole(`menuitem`),a=v(e).getByRole(`menuitem`,{name:`Manage companies`});await h(r).toHaveAccessibleName(`Harbour & Pine Ltd, Selected`),await h(v(e).getAllByRole(`separator`)).toHaveLength(1),await h(r.getBoundingClientRect().height).toBeCloseTo(44,0),await h(i.getBoundingClientRect().height).toBeCloseTo(44,0),await h(a.getBoundingClientRect().height).toBeCloseTo(38.57,1),await h(v(a).getByText(`Manage companies`).getBoundingClientRect().left).toBeCloseTo(v(i).getByText(`Wold Farm Joinery Ltd`).getBoundingClientRect().left,1)},render:()=>(0,m.jsx)(c,{defaultOpen:!0,getItem:u,items:S,trigger:`Harbour & Pine Ltd`,triggerIcon:`building`})},w=[{icon:`document`,id:`open`,label:`Open full screen`},{icon:`download`,id:`download`,label:`Download`},{icon:`upload`,id:`replace`,label:`Replace`},{icon:`delete`,id:`remove`,label:`Remove`}],T={args:{items:w,trigger:void 0,triggerAriaLabel:`More actions`,triggerIcon:`more`,width:`sm`},play:async()=>{let e=(await v(document.body).findByRole(`menu`,{name:`More actions`})).closest(`.breeze-popover`);if(!e)throw Error(`The menu popover was not rendered.`);await h(e.offsetWidth).toBe(208)}},E=[{id:`download`,label:`Download`},{id:`replace`,label:`Replace`},{id:`remove`,label:`Remove`,section:{id:`remove`},tone:`danger`}],D={play:async({canvasElement:e})=>{let t=v(e).getByRole(`button`,{name:`More actions`}),n=await v(document.body).findByRole(`menu`,{name:`More actions`}),r=n.closest(`.breeze-popover`),i=v(n).getByRole(`menuitem`,{name:`Remove`}),a=v(n).getByRole(`menuitem`,{name:`Download`});if(!r)throw Error(`The menu popover was not rendered.`);await _(async()=>{await h(r.getBoundingClientRect().right).toBeCloseTo(t.getBoundingClientRect().right,0)}),await h(getComputedStyle(i).color).not.toBe(getComputedStyle(a).color),await h(a.firstElementChild).toHaveTextContent(`Download`)},render:()=>(0,m.jsx)(`div`,{style:{display:`flex`,inlineSize:320,justifyContent:`end`},children:(0,m.jsx)(c,{defaultOpen:!0,getItem:e=>e,items:E,placement:`bottom end`,triggerAriaLabel:`More actions`,triggerIcon:`more`,width:`sm`})})},O={args:{defaultOpen:!1,trigger:void 0,triggerAriaLabel:`More actions`,triggerIcon:`more`},play:async({canvasElement:e})=>{let t=v(e).getByRole(`button`,{name:`More actions`});await h(t).toHaveTextContent(``),await g.click(t);let n=await v(document.body).findByRole(`menu`,{name:`More actions`});await _(async()=>{await h(n).toBeVisible()}),await h(t).toHaveAttribute(`aria-expanded`,`true`),await h(v(n).getByRole(`menuitem`,{name:`Settings, New`})).toBeVisible()}},k={render:()=>(0,m.jsx)(d,{})},A={play:async({canvasElement:e})=>{await document.fonts.ready;let t=v(e),n=t.getByRole(`button`,{name:`Account actions`}),r=n.getBoundingClientRect();await h(n).toHaveAttribute(`aria-busy`,`true`),await h(n).toHaveAttribute(`aria-disabled`,`true`),await h(n).toHaveAccessibleName(`Account actions`),await h(t.getByRole(`status`)).toHaveTextContent(`Loading`),await h(t.getByRole(`progressbar`,{name:`Loading`})).toBeInTheDocument(),await h(n.querySelector(`[data-breeze-skeleton]`)).toBeTruthy(),await g.click(t.getByRole(`button`,{name:`Finish loading menu`})),await h(n).not.toHaveAttribute(`aria-busy`),await h(t.getByRole(`status`)).toBeEmptyDOMElement();let i=n.getBoundingClientRect();await h([i.width,i.height]).toEqual([r.width,r.height]),await g.click(t.getByRole(`button`,{name:`Start loading menu`})),await h(n).toHaveAttribute(`aria-busy`,`true`),await h(n).toHaveAttribute(`aria-disabled`,`true`),await h(t.getByRole(`status`)).toHaveTextContent(`Loading`);let a=n.getBoundingClientRect();await h([a.width,a.height]).toEqual([i.width,i.height]),n.focus(),await g.click(n),await g.keyboard(`{Enter}{Space}{ArrowDown}`),await h(v(document.body).queryByRole(`menu`)).not.toBeInTheDocument()},render:()=>(0,m.jsx)(f,{})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Account actions'
    });
    const menu = await within(document.body).findByRole('menu', {
      name: 'Account actions'
    });
    const popover = menu.closest<HTMLElement>('.breeze-popover');
    if (!popover) throw new Error('The menu popover was not rendered.');

    // Layout widths ignore the entry animation's scale.
    await expect(popover.offsetWidth).toBeGreaterThanOrEqual(Math.max(256, trigger.offsetWidth));
  }
}`,...x.parameters?.docs?.source},description:{story:`A compact set of account actions.`,...x.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async () => {
    await document.fonts.ready;
    const menu = await within(document.body).findByRole('menu', {
      name: 'Harbour & Pine Ltd'
    });
    const popover = menu.closest('.breeze-popover');
    if (!popover) throw new Error('The menu popover was not rendered.');

    // Measure after the entry animation's scale settles.
    await Promise.all(popover.getAnimations().map(({
      finished
    }) => finished));
    const section = within(menu).getByRole('group', {
      name: 'Companies'
    });
    const [selected, other] = within(section).getAllByRole('menuitem');
    const manage = within(menu).getByRole('menuitem', {
      name: 'Manage companies'
    });
    await expect(selected).toHaveAccessibleName('Harbour & Pine Ltd, Selected');
    await expect(within(menu).getAllByRole('separator')).toHaveLength(1);
    // Initials rows match the prototype's 44px; icon rows its 38.57px.
    await expect(selected.getBoundingClientRect().height).toBeCloseTo(44, 0);
    await expect(other.getBoundingClientRect().height).toBeCloseTo(44, 0);
    await expect(manage.getBoundingClientRect().height).toBeCloseTo(38.57, 1);
    // Every row shares the initials tile's indent.
    await expect(within(manage).getByText('Manage companies').getBoundingClientRect().left).toBeCloseTo(within(other).getByText('Wold Farm Joinery Ltd').getBoundingClientRect().left, 1);
  },
  render: () => <Menu defaultOpen getItem={getCompanyMenuItem} items={companyMenuItems} trigger="Harbour & Pine Ltd" triggerIcon="building" />
}`,...C.parameters?.docs?.source},description:{story:`A labelled section of companies shown by initials, divided from a trailing action.`,...C.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    items: fileActions,
    trigger: undefined,
    triggerAriaLabel: 'More actions',
    triggerIcon: 'more',
    width: 'sm'
  },
  play: async () => {
    const menu = await within(document.body).findByRole('menu', {
      name: 'More actions'
    });
    const popover = menu.closest<HTMLElement>('.breeze-popover');
    if (!popover) throw new Error('The menu popover was not rendered.');

    // Layout widths ignore the entry animation's scale.
    await expect(popover.offsetWidth).toBe(208);
  }
}`,...T.parameters?.docs?.source},description:{story:"A short list of file actions opened at the narrower `sm` width.",...T.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'More actions'
    });
    const menu = await within(document.body).findByRole('menu', {
      name: 'More actions'
    });
    const popover = menu.closest<HTMLElement>('.breeze-popover');
    const remove = within(menu).getByRole('menuitem', {
      name: 'Remove'
    });
    const download = within(menu).getByRole('menuitem', {
      name: 'Download'
    });
    if (!popover) throw new Error('The menu popover was not rendered.');

    // Wait out the entry animation's scale before comparing edges.
    await waitFor(async () => {
      await expect(popover.getBoundingClientRect().right).toBeCloseTo(trigger.getBoundingClientRect().right, 0);
    });
    await expect(getComputedStyle(remove).color).not.toBe(getComputedStyle(download).color);
    await expect(download.firstElementChild).toHaveTextContent('Download');
  },
  render: () => <div style={{
    display: 'flex',
    inlineSize: 320,
    justifyContent: 'end'
  }}>
      <Menu defaultOpen getItem={item => item} items={attachmentActions} placement="bottom end" triggerAriaLabel="More actions" triggerIcon="more" width="sm" />
    </div>
}`,...D.parameters?.docs?.source},description:{story:`A destructive action in the danger colour, in a menu without icons aligned to its trigger's end edge.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: false,
    trigger: undefined,
    triggerAriaLabel: 'More actions',
    triggerIcon: 'more'
  },
  play: async ({
    canvasElement
  }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'More actions'
    });
    await expect(trigger).toHaveTextContent('');
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole('menu', {
      name: 'More actions'
    });

    // Wait out the popover's fade-in from opacity 0.
    await waitFor(async () => {
      await expect(menu).toBeVisible();
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(within(menu).getByRole('menuitem', {
      name: 'Settings, New'
    })).toBeVisible();
  }
}`,...O.parameters?.docs?.source},description:{story:"An icon-only trigger, named by `triggerAriaLabel`.",...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledExample />
}`,...k.parameters?.docs?.source},description:{story:`Control visibility and receive the selected application item.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await document.fonts.ready;
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Account actions'
    });
    const initialLoadingBounds = trigger.getBoundingClientRect();
    await expect(trigger).toHaveAttribute('aria-busy', 'true');
    await expect(trigger).toHaveAttribute('aria-disabled', 'true');
    await expect(trigger).toHaveAccessibleName('Account actions');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading');
    await expect(canvas.getByRole('progressbar', {
      name: 'Loading'
    })).toBeInTheDocument();
    await expect(trigger.querySelector('[data-breeze-skeleton]')).toBeTruthy();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Finish loading menu'
    }));
    await expect(trigger).not.toHaveAttribute('aria-busy');
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
    const readyBounds = trigger.getBoundingClientRect();
    await expect([readyBounds.width, readyBounds.height]).toEqual([initialLoadingBounds.width, initialLoadingBounds.height]);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Start loading menu'
    }));
    await expect(trigger).toHaveAttribute('aria-busy', 'true');
    await expect(trigger).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading');
    const finalLoadingBounds = trigger.getBoundingClientRect();
    await expect([finalLoadingBounds.width, finalLoadingBounds.height]).toEqual([readyBounds.width, readyBounds.height]);
    trigger.focus();
    await userEvent.click(trigger);
    await userEvent.keyboard('{Enter}{Space}{ArrowDown}');
    await expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument();
  },
  render: () => <LoadingExample />
}`,...A.parameters?.docs?.source},description:{story:`The trigger shows a loading bar while keeping its size and accessible name.`,...A.parameters?.docs?.description}}};try{b.displayName=`Menu`,b.__docgenInfo={description:`Displays related actions from a labelled or icon-only trigger button.

Give items a \`section\` to group them under an optional header, with dividers
between groups. Set \`loading\` while the trigger should not open the menu.
The loading status is announced while the trigger keeps its accessible name
and dimensions.`,displayName:`Menu`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{getItem:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`}],description:`Returns the display details for an application item.`,name:`getItem`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},required:!0,tags:{},type:{name:`(item: T) => MenuItemDescriptor`}},items:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`}],description:`Application items displayed as actions.`,name:`items`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},required:!0,tags:{},type:{name:`T[]`}},onAction:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`}],description:`Called with the selected application item.`,name:`onAction`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},required:!1,tags:{},type:{name:`((item: T) => void) | undefined`}},loading:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`}],description:`Shows a loading state on the trigger and prevents opening the menu.`,name:`loading`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},width:{defaultValue:{value:`md`},declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`}],description:"Minimum width of the open menu, never narrower than its trigger. Defaults to `md`.",name:`width`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},required:!1,tags:{},type:{name:`"md" | "sm" | undefined`}},placement:{defaultValue:{value:`bottom start`},declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`}],description:"Aligns the menu's start or end edge with the trigger's. Defaults to `bottom start`.",name:`placement`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`MenuCommonProps`},required:!1,tags:{},type:{name:`"bottom end" | "bottom start" | undefined`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`LabelledTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`LabelledTriggerProps`}],description:`Omit for an icon-only trigger.
Visible label for the button that opens the menu.`,name:`trigger`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},required:!1,tags:{},type:{name:`string | undefined`}},triggerAriaLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`LabelledTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`LabelledTriggerProps`}],description:`Accessible name for the icon-only trigger.
Accessible name when it should differ from the visible trigger label.`,name:`triggerAriaLabel`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},required:!1,tags:{},type:{name:`string | undefined`}},triggerIcon:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`LabelledTriggerProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`LabelledTriggerProps`}],description:`Icon shown as the trigger's only content.
Icon shown beside the trigger label.`,name:`triggerIcon`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`IconTriggerProps`},required:!1,tags:{},type:{name:`"add" | "back" | "building" | "calendar" | "camera" | "check" | "clock" | "close" | "delete" | "document" | "download" | "expand" | "forward" | "incoming" | "list" | "lock" | "more" | ... 8 more ... | undefined`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuProps`}],description:"Only set when visibility is uncontrolled.\nInitial visibility. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuProps`}],description:`Called when the menu should open or close.
Called when the menu opens or closes.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`UncontrolledMenuProps`}],description:`Whether the menu is open.
Only set when visibility is controlled.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/Menu/Menu.tsx`,name:`ControlledMenuProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{summary:`A compact menu for secondary actions.`}}}catch{}try{x.displayName=`Default`,x.__docgenInfo={description:`A compact set of account actions.`,displayName:`Default`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{C.displayName=`Sections`,C.__docgenInfo={description:`A labelled section of companies shown by initials, divided from a trailing action.`,displayName:`Sections`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{T.displayName=`NarrowWidth`,T.__docgenInfo={description:"A short list of file actions opened at the narrower `sm` width.",displayName:`NarrowWidth`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{D.displayName=`DestructiveAction`,D.__docgenInfo={description:`A destructive action in the danger colour, in a menu without icons aligned to its trigger's end edge.`,displayName:`DestructiveAction`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{O.displayName=`IconOnlyTrigger`,O.__docgenInfo={description:"An icon-only trigger, named by `triggerAriaLabel`.",displayName:`IconOnlyTrigger`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{k.displayName=`Controlled`,k.__docgenInfo={description:`Control visibility and receive the selected application item.`,displayName:`Controlled`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{A.displayName=`Loading`,A.__docgenInfo={description:`The trigger shows a loading bar while keeping its size and accessible name.`,displayName:`Loading`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Menu/Menu.stories.tsx`,methods:[],props:{},tags:{}}}catch{}j=[`Default`,`Sections`,`NarrowWidth`,`DestructiveAction`,`IconOnlyTrigger`,`Controlled`,`Loading`]}));M();export{k as Controlled,x as Default,D as DestructiveAction,O as IconOnlyTrigger,A as Loading,T as NarrowWidth,C as Sections,j as __namedExportsOrder,b as default,M as n,l as t};