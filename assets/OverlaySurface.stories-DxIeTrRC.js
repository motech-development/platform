import{a as e,n as t}from"./rolldown-runtime-DaJ6WEGw.js";import{t as n}from"./react-DvlgmmzG.js";import{t as r}from"./jsx-runtime-cM__dR4X.js";import{n as i,t as a}from"./Button-CRUvQN2-.js";import{n as o,t as s}from"./OverlaySurface-BVqNmZpR.js";import{n as c,t as l}from"./Drawer-Apjm5eWk.js";import{n as u,t as d}from"./Popover-BRKbKHDi.js";import{n as f,t as p}from"./Typography-3aC4EaZS.js";function m(){let[e,t]=(0,h.useState)(!1);return(0,g.jsx)(l,{open:e,onOpenChange:t,title:`Delivery`,trigger:`Open delivery`,children:(0,g.jsx)(s,{kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:(0,g.jsx)(a,{onAction:()=>t(!1),children:`Close sheet first`})})})}var h,g,_,v,y,b,x,S,C,w,T,E;t((()=>{h=e(n(),1),i(),c(),u(),f(),o(),g=r(),{expect:_,userEvent:v,waitFor:y,within:b}=__STORYBOOK_MODULE_TEST__,x={args:{children:`Overlay content`,kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`},component:s,title:`Foundations/Overlay stack`},S={play:async({canvasElement:e})=>{let t=b(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery`}),r=n.closest(`[data-breeze-overlay]`),i=b(n).getByRole(`button`,{name:`Open actions`});await v.click(i);let a=await t.findByRole(`dialog`,{name:`Actions`});await _(a).not.toHaveAttribute(`aria-modal`,`true`),await _(r).not.toHaveAttribute(`inert`),await _(t.getByRole(`dialog`,{name:`Delivery`})).toBe(n),await _(r).toHaveAttribute(`data-breeze-scrim`,`true`),await v.click(b(n).getByRole(`button`,{name:`Disabled sheet action`})),await y(async()=>{await _(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await _(n).toBeVisible(),await _(r).toHaveAttribute(`data-breeze-scrim`,`true`),await v.click(i);let o=await t.findByRole(`dialog`,{name:`Actions`});await y(async()=>{let{activeElement:t}=e.ownerDocument;await _(t===i||o.contains(t)).toBe(!0)}),await v.tab({shift:!0}),await y(async()=>{let{activeElement:r}=e.ownerDocument;await _(n.contains(r)).toBe(!0),await _(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await v.click(i);let s=await t.findByRole(`dialog`,{name:`Actions`});if(await v.keyboard(`{Escape}`),await _(s.closest(`[data-breeze-overlay]`)).toHaveAttribute(`data-breeze-topmost`,`false`),await v.click(i),await y(async()=>{await _(s).toBeVisible(),await _(s.contains(e.ownerDocument.activeElement)).toBe(!0)}),await v.keyboard(`{Escape}`),await y(async()=>{await _(i).toHaveFocus()}),await v.click(i),await v.click(b(n).getByRole(`button`,{name:`Sheet action`})),await y(async()=>{await _(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await _(n).toBeVisible(),await _(r).toHaveAttribute(`data-breeze-scrim`,`true`),await v.click(i),!r)throw Error(`Missing sheet layer`);await v.click(r),await y(async()=>{await _(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await _(n).toBeVisible(),await _(r).toHaveAttribute(`data-breeze-scrim`,`true`),await v.click(i),await t.findByRole(`dialog`,{name:`Actions`})},render:()=>(0,g.jsxs)(l,{defaultOpen:!0,title:`Delivery`,trigger:`Open delivery`,children:[(0,g.jsx)(a,{children:`Sheet action`}),(0,g.jsx)(a,{disabled:!0,children:`Disabled sheet action`}),(0,g.jsx)(d,{title:`Actions`,trigger:`Open actions`,children:(0,g.jsx)(p,{children:`Choose a delivery action.`})})]})},C={play:async({canvasElement:e})=>{let t=b(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery`}),r=n.closest(`[data-breeze-overlay]`),i=b(n).getByRole(`button`,{name:`Open viewer`});await v.click(i);let a=await t.findByRole(`dialog`,{name:`Viewer`}),o=a.closest(`[data-breeze-overlay]`);await y(async()=>{let t=o?.getBoundingClientRect(),n=e.ownerDocument.defaultView;await _(t?.x).toBe(0),await _(t?.y).toBe(0),await _(t?.width).toBe(n?.innerWidth),await _(t?.height).toBe(n?.innerHeight)}),await _(a).not.toHaveAttribute(`aria-modal`,`true`),await _(n).toBeInTheDocument(),await _(r).toHaveAttribute(`inert`),await _(r).toHaveAttribute(`data-breeze-scrim`,`true`),await _(o).not.toHaveAttribute(`data-breeze-scrim`,`true`),await _(e.ownerDocument.querySelectorAll(`[data-breeze-scrim="true"]`)).toHaveLength(1),await v.keyboard(`{Escape}`),await _(o).toHaveAttribute(`data-exiting`),await _(o).toHaveAttribute(`data-breeze-topmost`,`false`),await _(r).toHaveAttribute(`data-breeze-scrim`,`true`),await y(async()=>{await _(t.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument(),await _(i).toHaveFocus()}),await v.click(i),await t.findByRole(`dialog`,{name:`Viewer`})},render:()=>(0,g.jsx)(l,{defaultOpen:!0,title:`Delivery`,trigger:`Open delivery`,children:(0,g.jsx)(s,{kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:(0,g.jsx)(p,{children:`Delivery document`})})})},w={play:async({canvasElement:e})=>{let t=e.ownerDocument,n=b(t.body),r=n.getByRole(`button`,{name:`Open delivery`});await v.click(r),await v.click(await n.findByRole(`button`,{name:`Open viewer`})),await v.click(await n.findByRole(`button`,{name:`Close sheet first`})),await _(t.querySelector(`[data-breeze-topmost="true"]`)).toBeNull(),await _(t.querySelector(`[data-breeze-overlay][data-breeze-scrim="true"][data-breeze-topmost="true"]`)).toBeNull(),await _(t.querySelector(`[data-breeze-overlay="drawer"][data-exiting]`)).toHaveAttribute(`data-breeze-scrim`,`true`),await y(async()=>{await _(t.querySelector(`[data-breeze-overlay]`)).toBeNull(),await _(r).toHaveFocus()}),await v.click(r),await y(async()=>{await _(n.getByRole(`dialog`,{name:`Delivery`})).toBeVisible()}),await _(n.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument()},render:()=>(0,g.jsx)(m,{})},T={play:async({canvasElement:e})=>{let t=b(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Viewer`});await _(n.closest(`[data-breeze-overlay]`)).toHaveAttribute(`data-breeze-topmost`,`true`),await y(async()=>{await _(n.contains(e.ownerDocument.activeElement)).toBe(!0)}),await v.keyboard(`{Escape}`),await y(async()=>{await _(t.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument();let n=t.getByRole(`dialog`,{name:`Delivery`});await _(n).toBeVisible(),await _(n.contains(e.ownerDocument.activeElement)).toBe(!0)}),await v.click(t.getByRole(`button`,{name:`Open viewer`})),await t.findByRole(`dialog`,{name:`Viewer`})},render:()=>(0,g.jsx)(l,{defaultOpen:!0,title:`Delivery`,trigger:`Open delivery`,children:(0,g.jsx)(s,{defaultOpen:!0,kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:(0,g.jsx)(p,{children:`Delivery document`})})})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const sheet = await page.findByRole('dialog', {
      name: 'Delivery'
    });
    const sheetLayer = sheet.closest('[data-breeze-overlay]');
    const trigger = within(sheet).getByRole('button', {
      name: 'Open actions'
    });
    await userEvent.click(trigger);
    const initialPopover = await page.findByRole('dialog', {
      name: 'Actions'
    });
    await expect(initialPopover).not.toHaveAttribute('aria-modal', 'true');
    await expect(sheetLayer).not.toHaveAttribute('inert');
    await expect(page.getByRole('dialog', {
      name: 'Delivery'
    })).toBe(sheet);
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(within(sheet).getByRole('button', {
      name: 'Disabled sheet action'
    }));
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Actions'
      })).not.toBeInTheDocument();
    });
    await expect(sheet).toBeVisible();
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(trigger);
    const popover = await page.findByRole('dialog', {
      name: 'Actions'
    });
    await waitFor(async () => {
      const {
        activeElement
      } = canvasElement.ownerDocument;
      await expect(activeElement === trigger || popover.contains(activeElement)).toBe(true);
    });
    await userEvent.tab({
      shift: true
    });
    await waitFor(async () => {
      const {
        activeElement
      } = canvasElement.ownerDocument;
      await expect(sheet.contains(activeElement)).toBe(true);
      await expect(page.queryByRole('dialog', {
        name: 'Actions'
      })).not.toBeInTheDocument();
    });
    await userEvent.click(trigger);
    const reopenedPopover = await page.findByRole('dialog', {
      name: 'Actions'
    });
    await userEvent.keyboard('{Escape}');
    await expect(reopenedPopover.closest('[data-breeze-overlay]')).toHaveAttribute('data-breeze-topmost', 'false');
    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(reopenedPopover).toBeVisible();
      await expect(reopenedPopover.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(trigger).toHaveFocus();
    });
    await userEvent.click(trigger);
    await userEvent.click(within(sheet).getByRole('button', {
      name: 'Sheet action'
    }));
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Actions'
      })).not.toBeInTheDocument();
    });
    await expect(sheet).toBeVisible();
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(trigger);
    if (!sheetLayer) throw new Error('Missing sheet layer');
    await userEvent.click(sheetLayer);
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Actions'
      })).not.toBeInTheDocument();
    });
    await expect(sheet).toBeVisible();
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await userEvent.click(trigger);
    await page.findByRole('dialog', {
      name: 'Actions'
    });
  },
  render: () => <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <Button>Sheet action</Button>
      <Button disabled>Disabled sheet action</Button>
      <Popover title="Actions" trigger="Open actions">
        <Typography>Choose a delivery action.</Typography>
      </Popover>
    </Drawer>
}`,...S.parameters?.docs?.source},description:{story:`An action popover leaves its sheet available and preserves the sheet scrim.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const sheet = await page.findByRole('dialog', {
      name: 'Delivery'
    });
    const sheetLayer = sheet.closest('[data-breeze-overlay]');
    const trigger = within(sheet).getByRole('button', {
      name: 'Open viewer'
    });
    await userEvent.click(trigger);
    const viewer = await page.findByRole('dialog', {
      name: 'Viewer'
    });
    const viewerLayer = viewer.closest('[data-breeze-overlay]');
    await waitFor(async () => {
      const bounds = viewerLayer?.getBoundingClientRect();
      const window = canvasElement.ownerDocument.defaultView;
      await expect(bounds?.x).toBe(0);
      await expect(bounds?.y).toBe(0);
      await expect(bounds?.width).toBe(window?.innerWidth);
      await expect(bounds?.height).toBe(window?.innerHeight);
    });
    await expect(viewer).not.toHaveAttribute('aria-modal', 'true');
    await expect(sheet).toBeInTheDocument();
    await expect(sheetLayer).toHaveAttribute('inert');
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await expect(viewerLayer).not.toHaveAttribute('data-breeze-scrim', 'true');
    await expect(canvasElement.ownerDocument.querySelectorAll('[data-breeze-scrim="true"]')).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    await expect(viewerLayer).toHaveAttribute('data-exiting');
    await expect(viewerLayer).toHaveAttribute('data-breeze-topmost', 'false');
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Viewer'
      })).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
    await userEvent.click(trigger);
    await page.findByRole('dialog', {
      name: 'Viewer'
    });
  },
  render: () => <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
        <Typography>Delivery document</Typography>
      </OverlaySurface>
    </Drawer>
}`,...C.parameters?.docs?.source},description:{story:`Internal fullscreen content covers a mounted sheet without another scrim.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const document = canvasElement.ownerDocument;
    const page = within(document.body);
    const trigger = page.getByRole('button', {
      name: 'Open delivery'
    });
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole('button', {
      name: 'Open viewer'
    }));
    await userEvent.click(await page.findByRole('button', {
      name: 'Close sheet first'
    }));
    await expect(document.querySelector('[data-breeze-topmost="true"]')).toBeNull();
    await expect(document.querySelector('[data-breeze-overlay][data-breeze-scrim="true"][data-breeze-topmost="true"]')).toBeNull();
    await expect(document.querySelector('[data-breeze-overlay="drawer"][data-exiting]')).toHaveAttribute('data-breeze-scrim', 'true');
    await waitFor(async () => {
      await expect(document.querySelector('[data-breeze-overlay]')).toBeNull();
      await expect(trigger).toHaveFocus();
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(page.getByRole('dialog', {
        name: 'Delivery'
      })).toBeVisible();
    });
    await expect(page.queryByRole('dialog', {
      name: 'Viewer'
    })).not.toBeInTheDocument();
  },
  render: () => <OuterCloseExample />
}`,...w.parameters?.docs?.source},description:{story:`Closing the sheet retires the entire branch before its exit animations finish.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const viewer = await page.findByRole('dialog', {
      name: 'Viewer'
    });
    await expect(viewer.closest('[data-breeze-overlay]')).toHaveAttribute('data-breeze-topmost', 'true');
    await waitFor(async () => {
      await expect(viewer.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Viewer'
      })).not.toBeInTheDocument();
      const sheet = page.getByRole('dialog', {
        name: 'Delivery'
      });
      await expect(sheet).toBeVisible();
      await expect(sheet.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
    await userEvent.click(page.getByRole('button', {
      name: 'Open viewer'
    }));
    await page.findByRole('dialog', {
      name: 'Viewer'
    });
  },
  render: () => <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <OverlaySurface defaultOpen kind="fullscreen" title="Viewer" trigger="Open viewer">
        <Typography>Delivery document</Typography>
      </OverlaySurface>
    </Drawer>
}`,...T.parameters?.docs?.source},description:{story:`Initially open surfaces retain their ancestry and restore focus into the sheet.`,...T.parameters?.docs?.description}}};try{x.displayName=`OverlaySurface`,x.__docgenInfo={description:``,displayName:`OverlaySurface`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Content rendered inside the labelled surface, including any loading UI.`,name:`children`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`ReactNode`}},dismissible:{defaultValue:{value:`true`},declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Allows Escape and outside presses to close the surface. Defaults to true.`,name:`dismissible`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Visible and accessible surface title.`,name:`title`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`string`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Label for the library-owned trigger button.`,name:`trigger`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`string`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`open`,required:!1,tags:{},type:{name:`boolean | undefined`}},defaultOpen:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`defaultOpen`,required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`onOpenChange`,required:!1,tags:{},type:{name:`((open: boolean) => void) | undefined`}},kind:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`kind`,required:!0,tags:{},type:{name:`OverlayKind`}},placement:{defaultValue:{value:`bottom`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`placement`,required:!1,tags:{},type:{name:`"bottom" | "end" | "start" | "top" | undefined`}}},tags:{}}}catch{}try{S.displayName=`SheetPopover`,S.__docgenInfo={description:`An action popover leaves its sheet available and preserves the sheet scrim.`,displayName:`SheetPopover`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{C.displayName=`SheetFullscreen`,C.__docgenInfo={description:`Internal fullscreen content covers a mounted sheet without another scrim.`,displayName:`SheetFullscreen`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{w.displayName=`CloseOuterFirst`,w.__docgenInfo={description:`Closing the sheet retires the entire branch before its exit animations finish.`,displayName:`CloseOuterFirst`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{T.displayName=`InitiallyNested`,T.__docgenInfo={description:`Initially open surfaces retain their ancestry and restore focus into the sheet.`,displayName:`InitiallyNested`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}E=[`SheetPopover`,`SheetFullscreen`,`CloseOuterFirst`,`InitiallyNested`]}))();export{w as CloseOuterFirst,T as InitiallyNested,C as SheetFullscreen,S as SheetPopover,E as __namedExportsOrder,x as default};