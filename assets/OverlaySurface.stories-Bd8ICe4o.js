const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./context-BA1lSQW8.js","./rolldown-runtime-DaJ6WEGw.js"])))=>i.map(i=>d[i]);
import{a as e,n as t}from"./rolldown-runtime-DaJ6WEGw.js";import{n,t as r}from"./preload-helper-si3HNj2m.js";import{t as i}from"./react-DvlgmmzG.js";import{t as a}from"./jsx-runtime-cM__dR4X.js";import{n as o,t as s}from"./Button-C8wHUg7V.js";import{n as c,t as l}from"./OverlaySurface-Rjw46Xp8.js";import{n as u,t as d}from"./Drawer-C1XHsqZ6.js";import{n as f,t as p}from"./Dialog-HbmryhKv.js";import{n as m,t as h}from"./Popover-DF5oHpeQ.js";import{n as g,t as _}from"./Typography-CEt3x14j.js";async function v(){if(!(`__vitest_browser__`in globalThis))return null;let{userEvent:e}=await r(async()=>{let{userEvent:e}=await import(`./context-BA1lSQW8.js`);return{userEvent:e}},__vite__mapDeps([0,1]),import.meta.url);return e}async function y(e){await(await v()??D).keyboard(e)}function b(e){return e.some(e=>e.contains(e.ownerDocument.activeElement))}async function x(e,t,n){let r=Array.isArray(e)?e:[e];await Array.from({length:n}).reduce(async e=>{await e,await y(t),await E(b(r)).toBe(!0)},Promise.resolve())}function S(e){let t=e.closest(`[data-breeze-overlay]`);if(!t)throw Error(`Missing overlay layer`);return t}function C(){let[e,t]=(0,w.useState)(!1);return(0,T.jsx)(d,{open:e,onOpenChange:t,title:`Delivery`,trigger:`Open delivery`,children:(0,T.jsx)(l,{kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:(0,T.jsx)(s,{onAction:()=>t(!1),children:`Close sheet first`})})})}var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R;t((()=>{w=e(i(),1),o(),f(),u(),m(),g(),c(),T=a(),n(),{expect:E,userEvent:D,waitFor:O,within:k}=__STORYBOOK_MODULE_TEST__,A={args:{children:`Overlay content`,kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`},component:l,title:`Foundations/Overlay stack`},j={play:async({canvasElement:e})=>{let t=k(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery`}),r=n.closest(`[data-breeze-overlay]`),i=k(n).getByRole(`button`,{name:`Open actions`});await D.click(i);let a=await t.findByRole(`dialog`,{name:`Actions`});await E(a).not.toHaveAttribute(`aria-modal`,`true`),await E(r).not.toHaveAttribute(`inert`),await E(t.getByRole(`dialog`,{name:`Delivery`})).toBe(n),await E(r).toHaveAttribute(`data-breeze-scrim`,`true`),await D.click(k(n).getByRole(`button`,{name:`Disabled sheet action`})),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await E(n).toBeVisible(),await E(r).toHaveAttribute(`data-breeze-scrim`,`true`),await D.click(i);let o=await t.findByRole(`dialog`,{name:`Actions`});await O(async()=>{let{activeElement:t}=e.ownerDocument;await E(t===i||o.contains(t)).toBe(!0)}),await D.tab({shift:!0}),await O(async()=>{let{activeElement:r}=e.ownerDocument;await E(n.contains(r)).toBe(!0),await E(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await D.click(i);let s=await t.findByRole(`dialog`,{name:`Actions`});if(await D.keyboard(`{Escape}`),await E(s.closest(`[data-breeze-overlay]`)).toHaveAttribute(`data-breeze-topmost`,`false`),await D.click(i),await O(async()=>{await E(s).toBeVisible(),await E(s.contains(e.ownerDocument.activeElement)).toBe(!0)}),await D.keyboard(`{Escape}`),await O(async()=>{await E(i).toHaveFocus()}),await D.click(i),await D.click(k(n).getByRole(`button`,{name:`Sheet action`})),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await E(n).toBeVisible(),await E(r).toHaveAttribute(`data-breeze-scrim`,`true`),await D.click(i),!r)throw Error(`Missing sheet layer`);await D.click(r),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await E(n).toBeVisible(),await E(r).toHaveAttribute(`data-breeze-scrim`,`true`),await D.click(i),await t.findByRole(`dialog`,{name:`Actions`})},render:()=>(0,T.jsxs)(d,{defaultOpen:!0,title:`Delivery`,trigger:`Open delivery`,children:[(0,T.jsx)(s,{children:`Sheet action`}),(0,T.jsx)(s,{disabled:!0,children:`Disabled sheet action`}),(0,T.jsx)(h,{title:`Actions`,trigger:`Open actions`,children:(0,T.jsx)(_,{children:`Choose a delivery action.`})})]})},M={play:async({canvasElement:e})=>{let t=k(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery`}),r=n.closest(`[data-breeze-overlay]`),i=k(n).getByRole(`button`,{name:`Open viewer`});await D.click(i);let a=await t.findByRole(`dialog`,{name:`Viewer`}),o=a.closest(`[data-breeze-overlay]`);await O(async()=>{let t=o?.getBoundingClientRect(),n=e.ownerDocument.defaultView;await E(t?.x).toBe(0),await E(t?.y).toBe(0),await E(t?.width).toBe(n?.innerWidth),await E(t?.height).toBe(n?.innerHeight)}),await E(a).not.toHaveAttribute(`aria-modal`,`true`),await E(n).toBeInTheDocument(),await E(r).not.toHaveAttribute(`inert`),await E(t.getByRole(`dialog`,{name:`Delivery`})).toBe(n),await E(r).toHaveAttribute(`data-breeze-scrim`,`true`),await E(o).not.toHaveAttribute(`data-breeze-scrim`,`true`),await E(e.ownerDocument.querySelectorAll(`[data-breeze-scrim="true"]`)).toHaveLength(1),await O(async()=>{await E(a).toHaveFocus()}),await x(a,`{Tab}`,4),await x(a,`{Shift>}{Tab}{/Shift}`,4),i.focus(),await O(async()=>{await E(a.contains(e.ownerDocument.activeElement)).toBe(!0)}),await y(`{Escape}`),await E(o).toHaveAttribute(`data-exiting`),await E(o).toHaveAttribute(`data-breeze-topmost`,`false`),await E(r).toHaveAttribute(`data-breeze-scrim`,`true`),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument(),await E(i).toHaveFocus()}),await D.click(i),await t.findByRole(`dialog`,{name:`Viewer`})},render:()=>(0,T.jsx)(d,{defaultOpen:!0,title:`Delivery`,trigger:`Open delivery`,children:(0,T.jsxs)(l,{kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:[(0,T.jsx)(_,{children:`Delivery document`}),(0,T.jsx)(s,{children:`Viewer action`})]})})},N={play:async({canvasElement:e})=>{let t=e.ownerDocument,n=t.defaultView;if(!n)throw Error(`Missing overlay story window.`);let r=k(t.body),i=r.getByRole(`button`,{name:`Open viewer`});await D.click(i);let a=await r.findByRole(`dialog`,{name:`Viewer`}),o=a.closest(`[data-breeze-overlay]`);if(!o)throw Error(`Missing viewer layer`);await O(async()=>{await E(o).not.toHaveAttribute(`data-entering`),await E(a).toHaveFocus()}),await x(a,`{Tab}`,3),await x(a,`{Shift>}{Tab}{/Shift}`,3);let s=await v();if(s){let e=n.scrollY;await s.wheel(a,{delta:{y:400},times:20}),await O(async()=>{await E(o.scrollTop).toBeGreaterThan(0)}),await E(n.scrollY).toBe(e)}await y(`{Escape}`),await O(async()=>{await E(r.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument(),await E(i).toHaveFocus()})},render:()=>(0,T.jsx)(`div`,{style:{minBlockSize:`300vh`},children:(0,T.jsxs)(l,{kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:[(0,T.jsx)(`div`,{style:{minBlockSize:`200vh`},children:(0,T.jsx)(_,{children:`Long document`})}),(0,T.jsx)(s,{children:`Viewer action`})]})})},P={play:async({canvasElement:e})=>{let t=k(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Delivery`});await D.click(k(n).getByRole(`button`,{name:`Open viewer`}));let r=await t.findByRole(`dialog`,{name:`Viewer`}),i=S(r),a=k(r).getByRole(`button`,{name:`Open actions`}),o=async()=>{await D.click(a);let e=await t.findByRole(`dialog`,{name:`Actions`});return await O(async()=>{await E(b([e])).toBe(!0)}),e},s=await o();await E(S(s)).toHaveAttribute(`data-breeze-topmost`,`true`),await E(i).not.toHaveAttribute(`inert`),await y(`{Tab}`),await E(k(s).getAllByRole(`button`).includes(e.ownerDocument.activeElement)).toBe(!0),await y(`{Escape}`),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument(),await E(a).toHaveFocus()}),await E(t.getByRole(`dialog`,{name:`Viewer`})).toBe(r),await E(i).toHaveAttribute(`data-breeze-topmost`,`true`),await o(),await x([i,t.getByRole(`dialog`,{name:`Actions`})],`{Tab}`,5),await o(),await x([i,t.getByRole(`dialog`,{name:`Actions`})],`{Shift>}{Tab}{/Shift}`,5),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Actions`})).not.toBeInTheDocument()}),await x(i,`{Tab}`,4),await y(`{Escape}`),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument(),await E(n.contains(e.ownerDocument.activeElement)).toBe(!0)})},render:()=>(0,T.jsx)(d,{defaultOpen:!0,title:`Delivery`,trigger:`Open delivery`,children:(0,T.jsxs)(l,{kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:[(0,T.jsx)(_,{children:`Delivery document`}),(0,T.jsxs)(h,{title:`Actions`,trigger:`Open actions`,children:[(0,T.jsx)(s,{children:`Rotate`}),(0,T.jsx)(s,{children:`Download`})]}),(0,T.jsx)(s,{children:`Viewer action`})]})})},F={play:async({canvasElement:e})=>{let t=k(e.ownerDocument.body);await D.click(t.getByRole(`button`,{name:`Open viewer`}));let n=await t.findByRole(`dialog`,{name:`Viewer`}),r=S(n);await O(async()=>{await E(n).toHaveFocus()});let i=k(n).getByRole(`button`,{name:`Remove document`});await D.click(i);let a=await t.findByRole(`dialog`,{name:`Remove this document?`});await O(async()=>{await E(b([a])).toBe(!0),await E(r).toHaveAttribute(`inert`)}),await x(a,`{Tab}`,4),await x(a,`{Shift>}{Tab}{/Shift}`,4),await y(`{Escape}`),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Remove this document?`})).not.toBeInTheDocument(),await E(i).toHaveFocus()}),await E(r).not.toHaveAttribute(`inert`),await E(t.getByRole(`dialog`,{name:`Viewer`})).toBe(n),await x(n,`{Tab}`,4),await x(n,`{Shift>}{Tab}{/Shift}`,4)},render:()=>(0,T.jsxs)(l,{kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:[(0,T.jsx)(_,{children:`Delivery document`}),(0,T.jsx)(p,{title:`Remove this document?`,trigger:`Remove document`,children:(0,T.jsx)(s,{children:`Remove`})}),(0,T.jsx)(s,{children:`Viewer action`})]})},I={play:async({canvasElement:e})=>{let t=e.ownerDocument,n=k(t.body),r=n.getByRole(`button`,{name:`Open delivery`});await D.click(r),await D.click(await n.findByRole(`button`,{name:`Open viewer`})),await D.click(await n.findByRole(`button`,{name:`Close sheet first`})),await E(t.querySelector(`[data-breeze-topmost="true"]`)).toBeNull(),await E(t.querySelector(`[data-breeze-overlay][data-breeze-scrim="true"][data-breeze-topmost="true"]`)).toBeNull(),await E(t.querySelector(`[data-breeze-overlay="drawer"][data-exiting]`)).toHaveAttribute(`data-breeze-scrim`,`true`),await O(async()=>{await E(t.querySelector(`[data-breeze-overlay]`)).toBeNull(),await E(r).toHaveFocus()}),await D.click(r),await O(async()=>{await E(n.getByRole(`dialog`,{name:`Delivery`})).toBeVisible()}),await E(n.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument()},render:()=>(0,T.jsx)(C,{})},L={play:async({canvasElement:e})=>{let t=k(e.ownerDocument.body),n=await t.findByRole(`dialog`,{name:`Viewer`});await E(n.closest(`[data-breeze-overlay]`)).toHaveAttribute(`data-breeze-topmost`,`true`),await O(async()=>{await E(n.contains(e.ownerDocument.activeElement)).toBe(!0)}),await D.keyboard(`{Escape}`),await O(async()=>{await E(t.queryByRole(`dialog`,{name:`Viewer`})).not.toBeInTheDocument();let n=t.getByRole(`dialog`,{name:`Delivery`});await E(n).toBeVisible(),await E(n.contains(e.ownerDocument.activeElement)).toBe(!0)}),await D.click(t.getByRole(`button`,{name:`Open viewer`})),await t.findByRole(`dialog`,{name:`Viewer`})},render:()=>(0,T.jsx)(d,{defaultOpen:!0,title:`Delivery`,trigger:`Open delivery`,children:(0,T.jsx)(l,{defaultOpen:!0,kind:`fullscreen`,title:`Viewer`,trigger:`Open viewer`,children:(0,T.jsx)(_,{children:`Delivery document`})})})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source},description:{story:`An action popover leaves its sheet available and preserves the sheet scrim.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
    await expect(sheetLayer).not.toHaveAttribute('inert');
    await expect(page.getByRole('dialog', {
      name: 'Delivery'
    })).toBe(sheet);
    await expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    await expect(viewerLayer).not.toHaveAttribute('data-breeze-scrim', 'true');
    await expect(canvasElement.ownerDocument.querySelectorAll('[data-breeze-scrim="true"]')).toHaveLength(1);
    await waitFor(async () => {
      await expect(viewer).toHaveFocus();
    });
    await expectFocusKeptWithin(viewer, '{Tab}', 4);
    await expectFocusKeptWithin(viewer, '{Shift>}{Tab}{/Shift}', 4);
    // Assistive technology can move focus into the covered sheet.
    trigger.focus();
    await waitFor(async () => {
      await expect(viewer.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
    await pressKeys('{Escape}');
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
        <Button>Viewer action</Button>
      </OverlaySurface>
    </Drawer>
}`,...M.parameters?.docs?.source},description:{story:`Non-modal fullscreen content over a sheet: no second scrim, Tab stays inside (ADR 0002).`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const document = canvasElement.ownerDocument;
    const view = document.defaultView;
    if (!view) throw new Error('Missing overlay story window.');
    const page = within(document.body);
    const trigger = page.getByRole('button', {
      name: 'Open viewer'
    });
    await userEvent.click(trigger);
    const viewer = await page.findByRole('dialog', {
      name: 'Viewer'
    });
    const viewerLayer = viewer.closest<HTMLElement>('[data-breeze-overlay]');
    if (!viewerLayer) throw new Error('Missing viewer layer');
    await waitFor(async () => {
      await expect(viewerLayer).not.toHaveAttribute('data-entering');
      await expect(viewer).toHaveFocus();
    });
    await expectFocusKeptWithin(viewer, '{Tab}', 3);
    await expectFocusKeptWithin(viewer, '{Shift>}{Tab}{/Shift}', 3);
    const input = await browserInput();
    if (input) {
      const pageScroll = view.scrollY;
      await input.wheel(viewer, {
        delta: {
          y: 400
        },
        times: 20
      });
      await waitFor(async () => {
        await expect(viewerLayer.scrollTop).toBeGreaterThan(0);
      });
      await expect(view.scrollY).toBe(pageScroll);
    }
    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Viewer'
      })).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
  },
  render: () => <div style={{
    minBlockSize: '300vh'
  }}>
      <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
        <div style={{
        minBlockSize: '200vh'
      }}>
          <Typography>Long document</Typography>
        </div>
        <Button>Viewer action</Button>
      </OverlaySurface>
    </div>
}`,...N.parameters?.docs?.source},description:{story:`A fullscreen surface over a page keeps wheel scrolling and Tab inside it.`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    const sheet = await page.findByRole('dialog', {
      name: 'Delivery'
    });
    await userEvent.click(within(sheet).getByRole('button', {
      name: 'Open viewer'
    }));
    const viewer = await page.findByRole('dialog', {
      name: 'Viewer'
    });
    const viewerLayer = overlayLayer(viewer);
    const actionsTrigger = within(viewer).getByRole('button', {
      name: 'Open actions'
    });
    const openActions = async () => {
      await userEvent.click(actionsTrigger);
      const actions = await page.findByRole('dialog', {
        name: 'Actions'
      });
      await waitFor(async () => {
        await expect(focusIsWithin([actions])).toBe(true);
      });
      return actions;
    };
    const actions = await openActions();
    await expect(overlayLayer(actions)).toHaveAttribute('data-breeze-topmost', 'true');
    await expect(viewerLayer).not.toHaveAttribute('inert');
    await pressKeys('{Tab}');
    await expect(within(actions).getAllByRole('button').includes(canvasElement.ownerDocument.activeElement as HTMLButtonElement)).toBe(true);
    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Actions'
      })).not.toBeInTheDocument();
      await expect(actionsTrigger).toHaveFocus();
    });
    await expect(page.getByRole('dialog', {
      name: 'Viewer'
    })).toBe(viewer);
    await expect(viewerLayer).toHaveAttribute('data-breeze-topmost', 'true');
    await openActions();
    await expectFocusKeptWithin([viewerLayer, page.getByRole('dialog', {
      name: 'Actions'
    })], '{Tab}', 5);
    await openActions();
    await expectFocusKeptWithin([viewerLayer, page.getByRole('dialog', {
      name: 'Actions'
    })], '{Shift>}{Tab}{/Shift}', 5);
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Actions'
      })).not.toBeInTheDocument();
    });
    await expectFocusKeptWithin(viewerLayer, '{Tab}', 4);
    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Viewer'
      })).not.toBeInTheDocument();
      await expect(sheet.contains(canvasElement.ownerDocument.activeElement)).toBe(true);
    });
  },
  render: () => <Drawer defaultOpen title="Delivery" trigger="Open delivery">
      <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
        <Typography>Delivery document</Typography>
        <Popover title="Actions" trigger="Open actions">
          <Button>Rotate</Button>
          <Button>Download</Button>
        </Popover>
        <Button>Viewer action</Button>
      </OverlaySurface>
    </Drawer>
}`,...P.parameters?.docs?.source},description:{story:`A popover in a fullscreen surface takes focus and closes on Escape before the viewer.`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole('button', {
      name: 'Open viewer'
    }));
    const viewer = await page.findByRole('dialog', {
      name: 'Viewer'
    });
    const viewerLayer = overlayLayer(viewer);
    await waitFor(async () => {
      await expect(viewer).toHaveFocus();
    });
    const confirmTrigger = within(viewer).getByRole('button', {
      name: 'Remove document'
    });
    await userEvent.click(confirmTrigger);
    const confirmation = await page.findByRole('dialog', {
      name: 'Remove this document?'
    });
    await waitFor(async () => {
      await expect(focusIsWithin([confirmation])).toBe(true);
      await expect(viewerLayer).toHaveAttribute('inert');
    });
    await expectFocusKeptWithin(confirmation, '{Tab}', 4);
    await expectFocusKeptWithin(confirmation, '{Shift>}{Tab}{/Shift}', 4);
    await pressKeys('{Escape}');
    await waitFor(async () => {
      await expect(page.queryByRole('dialog', {
        name: 'Remove this document?'
      })).not.toBeInTheDocument();
      await expect(confirmTrigger).toHaveFocus();
    });
    await expect(viewerLayer).not.toHaveAttribute('inert');
    await expect(page.getByRole('dialog', {
      name: 'Viewer'
    })).toBe(viewer);
    await expectFocusKeptWithin(viewer, '{Tab}', 4);
    await expectFocusKeptWithin(viewer, '{Shift>}{Tab}{/Shift}', 4);
  },
  render: () => <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
      <Typography>Delivery document</Typography>
      <Dialog title="Remove this document?" trigger="Remove document">
        <Button>Remove</Button>
      </Dialog>
      <Button>Viewer action</Button>
    </OverlaySurface>
}`,...F.parameters?.docs?.source},description:{story:`A modal above a fullscreen surface takes over focus containment until it closes.`,...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source},description:{story:`Closing the sheet retires the entire branch before its exit animations finish.`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source},description:{story:`Initially open surfaces retain their ancestry and restore focus into the sheet.`,...L.parameters?.docs?.description}}};try{A.displayName=`OverlaySurface`,A.__docgenInfo={description:``,displayName:`OverlaySurface`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Content rendered inside the labelled surface, including any loading UI.`,name:`children`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`ReactNode`}},dismissible:{defaultValue:{value:`true`},declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Allows Escape and outside presses to close the surface. Defaults to true.`,name:`dismissible`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},title:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`}],description:`Visible and accessible surface title.`,name:`title`,parent:{fileName:`breeze-ui/src/overlays/overlay.types.ts`,name:`OverlayBaseProps`},required:!0,tags:{},type:{name:`string`}},footerActions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`footerActions`,required:!1,tags:{},type:{name:`ReactNode`}},footerStart:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`footerStart`,required:!1,tags:{},type:{name:`ReactNode`}},footerSummary:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`footerSummary`,required:!1,tags:{},type:{name:`string | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`open`,required:!1,tags:{},type:{name:`boolean | undefined`}},defaultOpen:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`defaultOpen`,required:!1,tags:{},type:{name:`boolean | undefined`}},closingTransition:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`closingTransition`,required:!1,tags:{},type:{name:`boolean | undefined`}},panel:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`panel`,required:!1,tags:{},type:{name:`boolean | undefined`}},showHeader:{defaultValue:{value:`true`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`showHeader`,required:!1,tags:{},type:{name:`boolean | undefined`}},viewerSurface:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`viewerSurface`,required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`onOpenChange`,required:!1,tags:{},type:{name:`((open: boolean) => void) | undefined`}},kind:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`kind`,required:!0,tags:{},type:{name:`OverlayKind`}},placement:{defaultValue:{value:`bottom`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`placement`,required:!1,tags:{},type:{name:`"bottom" | "bottom end" | "end" | "start" | "top" | undefined`}},trigger:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`trigger`,required:!1,tags:{},type:{name:`string | undefined`}},triggerIndicator:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`triggerIndicator`,required:!1,tags:{},type:{name:`boolean | undefined`}},triggerInitials:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/overlays/OverlaySurface.tsx`,name:`TypeLiteral`}],description:``,name:`triggerInitials`,required:!1,tags:{},type:{name:`string | undefined`}}},tags:{}}}catch{}try{j.displayName=`SheetPopover`,j.__docgenInfo={description:`An action popover leaves its sheet available and preserves the sheet scrim.`,displayName:`SheetPopover`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{M.displayName=`SheetFullscreen`,M.__docgenInfo={description:`Non-modal fullscreen content over a sheet: no second scrim, Tab stays inside (ADR 0002).`,displayName:`SheetFullscreen`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{N.displayName=`PageFullscreen`,N.__docgenInfo={description:`A fullscreen surface over a page keeps wheel scrolling and Tab inside it.`,displayName:`PageFullscreen`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{P.displayName=`FullscreenPopover`,P.__docgenInfo={description:`A popover in a fullscreen surface takes focus and closes on Escape before the viewer.`,displayName:`FullscreenPopover`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{F.displayName=`FullscreenModal`,F.__docgenInfo={description:`A modal above a fullscreen surface takes over focus containment until it closes.`,displayName:`FullscreenModal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{I.displayName=`CloseOuterFirst`,I.__docgenInfo={description:`Closing the sheet retires the entire branch before its exit animations finish.`,displayName:`CloseOuterFirst`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}try{L.displayName=`InitiallyNested`,L.__docgenInfo={description:`Initially open surfaces retain their ancestry and restore focus into the sheet.`,displayName:`InitiallyNested`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/overlays/OverlaySurface.stories.tsx`,methods:[],props:{},tags:{}}}catch{}R=[`SheetPopover`,`SheetFullscreen`,`PageFullscreen`,`FullscreenPopover`,`FullscreenModal`,`CloseOuterFirst`,`InitiallyNested`]}))();export{I as CloseOuterFirst,F as FullscreenModal,P as FullscreenPopover,L as InitiallyNested,N as PageFullscreen,M as SheetFullscreen,j as SheetPopover,R as __namedExportsOrder,A as default};