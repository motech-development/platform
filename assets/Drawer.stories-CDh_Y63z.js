import{a as e,i as t,s as n}from"./preload-helper-CT_b8DTk.js";import{t as r}from"./react-B7Te67-h.js";import{r as i}from"./iframe-q_a4TWX4.js";import{n as a,t as o}from"./Typography-AkcnmWkA.js";import{a as s,i as c,o as l,r as u,s as d}from"./OverlayParts-DzkYkwmi.js";import{n as f,t as p}from"./Button-CGHDK7dV.js";import{i as m,n as h,r as g,t as _}from"./Drawer-CEpAGCZy.js";var v=e({ControlledTriggerless:()=>j,DirectionalMotion:()=>F,LongContent:()=>P,ResponsivePlacementAndNested:()=>M,ResponsivePlacementAndNestedCompact:()=>N,__namedExportsOrder:()=>I,default:()=>A});async function y(e,t=()=>document.querySelector(`.breeze-drawer-surface`)){let n=[],r=24,i=new Promise(e=>{let i=()=>{let a=t();if(a!==null){let e=a.getBoundingClientRect();n.push({left:e.left,opacity:Number.parseFloat(getComputedStyle(a).opacity),top:e.top})}--r,r===0?e():requestAnimationFrame(i)};requestAnimationFrame(i)});return await e(),await i,n}async function b(e,t,n){let r=e.filter(e=>t===`inlineEnd`?e.left>n+.5:e.top>n+.5);await E(r.length).toBeGreaterThan(0);let i=r.map(e=>t===`inlineEnd`?e.top:e.left);await E(Math.max(...i)-Math.min(...i)).toBeLessThan(1)}function x(e,t,n=!1){return k(e.ownerDocument.body).queryByRole(`dialog`,{hidden:n,name:t})}async function S(e,t){let n=k(e),r=k(e.ownerDocument.body),{documentElement:i}=e.ownerDocument,a=n.getByRole(`button`,{name:`Open drawer`});await E(r.queryByRole(`dialog`)).not.toBeInTheDocument(),await E(e.ownerDocument.querySelector(`.breeze-drawer-motion`)).toBeNull();let o=await y(()=>D.click(a),()=>x(e,`Responsive drawer`)),s=r.getByRole(`dialog`,{name:`Responsive drawer`}),c=s.getBoundingClientRect(),l=s.parentElement,u=l?.parentElement,d=s.querySelector(`header`),f=k(s).getByRole(`button`,{name:`Close`}),p=t?`bottom`:`inlineEnd`;if(!(d instanceof HTMLElement))throw Error(`Outer drawer header is missing.`);await E(f).toHaveFocus(),await E(getComputedStyle(d).backgroundColor).toBe(`rgb(21, 28, 43)`),await O(()=>E(l).not.toHaveAttribute(`data-entering`)),await E(s.scrollWidth).toBeLessThanOrEqual(s.clientWidth),await E(i.scrollWidth).toBeLessThanOrEqual(i.clientWidth),await E(getComputedStyle(s).getPropertyValue(`--breeze-drawer-x`).trim()).toBe(t?`0%`:`100%`),await E(getComputedStyle(s).getPropertyValue(`--breeze-drawer-y`).trim()).toBe(t?`100%`:`0%`),t?(await E(c.left).toBeCloseTo(0,1),await E(c.top).toBeCloseTo(0,1),await E(c.width).toBeCloseTo(i.clientWidth,1),await E(c.height).toBeCloseTo(i.clientHeight,1)):(await E(c.width).toBeLessThan(i.clientWidth),await E(c.right).toBeCloseTo(i.clientWidth,1),await E(c.top).toBeCloseTo(0,1),await E(c.height).toBeCloseTo(i.clientHeight,1)),await b(o,p,t?c.top:c.left);let m=k(s).getByRole(`button`,{name:`Open nested drawer`}),h=await y(()=>D.click(m),()=>x(e,`Nested drawer`)),g=r.getByRole(`dialog`,{name:`Nested drawer`}),_=g.getBoundingClientRect(),v=g.parentElement,S=v?.parentElement,C=g.querySelector(`header`),w=k(g).getByRole(`button`,{name:`Close`});if(!(u instanceof HTMLElement)||!(S instanceof HTMLElement)||!(C instanceof HTMLElement))throw Error(`Drawer overlay anatomy is missing.`);let T=e.ownerDocument.defaultView?.Node.DOCUMENT_POSITION_FOLLOWING??0;await E(r.getAllByRole(`dialog`,{hidden:!0})).toHaveLength(2),await O(()=>E(v).not.toHaveAttribute(`data-entering`)),await E(w).toHaveFocus(),await E(getComputedStyle(C).backgroundColor).toBe(`rgb(34, 44, 64)`),await E(g).toHaveClass(`breeze-drawer-adjacent-surface`),await E(v).toHaveClass(`breeze-drawer-adjacent-motion`),await E(S).toHaveClass(`breeze-drawer-adjacent-overlay`),await E(S).toHaveStyle(`--breeze-drawer-adjacent-inline-end: 768px`),await E(S).toHaveStyle(`--breeze-drawer-width: 38rem`),await E(u.compareDocumentPosition(S)).toBe(T),await E(getComputedStyle(S).zIndex).toBe(getComputedStyle(u).zIndex),await E(g.scrollWidth).toBeLessThanOrEqual(g.clientWidth),await E(getComputedStyle(g).getPropertyValue(`--breeze-drawer-x`).trim()).toBe(t?`0%`:`28px`),await E(getComputedStyle(g).getPropertyValue(`--breeze-drawer-y`).trim()).toBe(t?`100%`:`0%`),t?(await E(_.left).toBeCloseTo(0,1),await E(_.top).toBeCloseTo(0,1),await E(_.width).toBeCloseTo(i.clientWidth,1),await E(_.height).toBeCloseTo(i.clientHeight,1)):(await E(_.width).toBeLessThan(c.width),await E(_.right).toBeCloseTo(c.left,1),await E(_.left).toBeGreaterThanOrEqual(0)),await b(h,p,t?_.top:_.left);let A=await y(async()=>{await D.keyboard(`{Escape}`)},()=>x(e,`Nested drawer`));await O(()=>E(x(e,`Nested drawer`,!0)).not.toBeInTheDocument()),await E(r.getByRole(`dialog`,{name:`Responsive drawer`})).toBeVisible(),await E(m).toHaveFocus(),await b(A,p,t?_.top:_.left);let j=await y(()=>D.click(f),()=>x(e,`Responsive drawer`));await O(()=>E(x(e,`Responsive drawer`,!0)).not.toBeInTheDocument()),await E(a).toHaveFocus(),await b(j,p,t?c.top:c.left)}function C(){let[e,t]=(0,w.useState)(!1);return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(p,{onAction:()=>t(!0),children:`Edit selected item`}),(0,T.jsx)(h.Root,{onOpenChange:t,open:e,triggerless:!0,children:(0,T.jsxs)(h.Content,{size:`medium`,children:[(0,T.jsx)(h.Title,{children:`Edit item`}),(0,T.jsx)(h.Description,{children:`This drawer is opened by application-owned state.`}),(0,T.jsx)(h.Close,{children:`Save and close`})]})})]})}var w,T,E,D,O,k,A,j,M,N,P,F,I,L=t((()=>{w=n(r(),1),d(),f(),a(),m(),T=i(),{expect:E,userEvent:D,waitFor:O,within:k}=__STORYBOOK_MODULE_TEST__,A={component:g,decorators:[e=>(Object.assign(h.Close,{displayName:`Drawer.Close`}),Object.assign(h.Content,{displayName:`Drawer.Content`}),Object.assign(h.Description,{displayName:`Drawer.Description`}),Object.assign(h.Root,{displayName:`Drawer.Root`}),Object.assign(h.Title,{displayName:`Drawer.Title`}),Object.assign(h.Trigger,{displayName:`Drawer.Trigger`}),(0,T.jsx)(e,{}))],subcomponents:{Close:u,Content:_,Description:c,Title:s,Trigger:l},title:`Primitives/Overlays/Drawer`},j={args:{children:null},play:async({canvasElement:e})=>{await D.click(k(e).getByRole(`button`,{name:`Edit selected item`}));let t=k(document.body).getByRole(`dialog`,{name:`Edit item`}),n=t.querySelector(`header`),r=k(t).getByRole(`button`,{name:`Close`});await E(t.getBoundingClientRect().width).toBeGreaterThan(500),await E(getComputedStyle(t).overflow).toBe(`clip`),await E(t.scrollTop).toBe(0),await E(n?.getBoundingClientRect().height).toBeGreaterThanOrEqual(r.getBoundingClientRect().height),await E(r.getBoundingClientRect().width).toBe(r.getBoundingClientRect().height),await E(r.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)},render:()=>(0,T.jsx)(C,{})},M={args:{children:null},globals:{viewport:{value:`drawerDesktop`}},parameters:{viewport:{options:{drawerDesktop:{name:`Drawer desktop`,styles:{height:`900px`,width:`1600px`},type:`desktop`}}}},play:async({canvasElement:e})=>S(e,!1),render:()=>(0,T.jsxs)(h.Root,{children:[(0,T.jsx)(h.Trigger,{children:`Open drawer`}),(0,T.jsxs)(h.Content,{placement:{base:`bottom`,md:`end`},size:`wide`,children:[(0,T.jsx)(h.Title,{children:`Responsive drawer`}),(0,T.jsx)(h.Description,{children:`Bottom on compact screens and inline-end on wider screens, including RTL.`}),(0,T.jsxs)(h.Root,{children:[(0,T.jsx)(h.Trigger,{children:`Open nested drawer`}),(0,T.jsxs)(h.Content,{adjacent:{inlineEndOffset:768},chrome:`soft`,placement:{base:`bottom`,md:`end`},size:`medium`,children:[(0,T.jsx)(h.Title,{children:`Nested drawer`}),(0,T.jsx)(h.Description,{children:`Escape closes this layer first and restores focus.`}),(0,T.jsx)(h.Close,{children:`Close nested`})]})]}),(0,T.jsx)(h.Close,{children:`Close outer`})]})]})},N={...M,globals:{viewport:{value:`mobile1`}},parameters:{...M.parameters,chromatic:{viewports:[360]}},play:async({canvasElement:e})=>S(e,!0)},P={args:{children:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(h.Trigger,{children:`Open long drawer`}),(0,T.jsxs)(h.Content,{children:[(0,T.jsx)(h.Title,{children:`Long drawer`}),(0,T.jsx)(h.Description,{children:`The surface scrolls independently.`}),(0,T.jsx)(o,{children:`Drawer item 1`}),(0,T.jsx)(o,{children:`Drawer item 2`}),(0,T.jsx)(o,{children:`Drawer item 3`}),(0,T.jsx)(o,{children:`Drawer item 4`}),(0,T.jsx)(o,{children:`Drawer item 5`}),(0,T.jsx)(o,{children:`Drawer item 6`}),(0,T.jsx)(o,{children:`Drawer item 7`}),(0,T.jsx)(o,{children:`Drawer item 8`}),(0,T.jsx)(o,{children:`Drawer item 9`}),(0,T.jsx)(o,{children:`Drawer item 10`}),(0,T.jsx)(o,{children:`Drawer item 11`}),(0,T.jsx)(o,{children:`Drawer item 12`}),(0,T.jsx)(o,{children:`Drawer item 13`}),(0,T.jsx)(o,{children:`Drawer item 14`}),(0,T.jsx)(o,{children:`Drawer item 15`}),(0,T.jsx)(o,{children:`Drawer item 16`}),(0,T.jsx)(h.Close,{children:`Close`})]})]})}},F={args:{children:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(h.Trigger,{children:`Open directional drawer`}),(0,T.jsxs)(h.Content,{placement:`start`,children:[(0,T.jsx)(h.Title,{children:`Directional drawer`}),(0,T.jsx)(h.Description,{children:`Slides along the inline axis without vertical movement.`}),(0,T.jsx)(h.Close,{children:`Close directional drawer`})]})]})},play:async({canvasElement:e})=>{let t=await y(()=>D.click(k(e).getByRole(`button`,{name:`Open directional drawer`}))),n=k(document.body).getByRole(`dialog`,{name:`Directional drawer`}),r=t.filter(e=>e.left<-.5),i=r.map(e=>e.top),a=r.map(e=>e.opacity);await E(r.length).toBeGreaterThan(0),await E(Math.max(...i)-Math.min(...i)).toBeLessThan(1),await E(Math.min(...a)).toBeLessThan(1);let o=(await y(()=>D.click(k(n).getByRole(`button`,{name:`Close directional drawer`})))).filter(e=>e.left<-.5),s=o.map(e=>e.top),c=o.map(e=>e.opacity);await E(o.length).toBeGreaterThan(0),await E(Math.max(...s)-Math.min(...s)).toBeLessThan(1),await E(Math.min(...c)).toBeLessThan(1)}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    await userEvent.click(within(canvasElement).getByRole('button', {
      name: 'Edit selected item'
    }));
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Edit item'
    });
    const header = dialog.querySelector('header');
    const close = within(dialog).getByRole('button', {
      name: 'Close'
    });
    await expect(dialog.getBoundingClientRect().width).toBeGreaterThan(500);
    await expect(getComputedStyle(dialog).overflow).toBe('clip');
    await expect(dialog.scrollTop).toBe(0);
    await expect(header?.getBoundingClientRect().height).toBeGreaterThanOrEqual(close.getBoundingClientRect().height);
    await expect(close.getBoundingClientRect().width).toBe(close.getBoundingClientRect().height);
    await expect(close.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
  render: () => <ControlledTriggerlessExample />
}`,...j.parameters?.docs?.source},description:{story:`Opens a triggerless drawer from application-owned state and demonstrates the
framed medium surface, generated close action, and scroll boundary.

@summary externally triggered controlled drawer state`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  globals: {
    viewport: {
      value: 'drawerDesktop'
    }
  },
  parameters: {
    viewport: {
      options: {
        drawerDesktop: {
          name: 'Drawer desktop',
          styles: {
            height: '900px',
            width: '1600px'
          },
          type: 'desktop'
        }
      }
    }
  },
  play: async ({
    canvasElement
  }) => playResponsiveNestedDrawer(canvasElement, false),
  render: () => <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Content placement={{
      base: 'bottom',
      md: 'end'
    }} size="wide">
        <Drawer.Title>Responsive drawer</Drawer.Title>
        <Drawer.Description>
          Bottom on compact screens and inline-end on wider screens, including
          RTL.
        </Drawer.Description>
        <Drawer.Root>
          <Drawer.Trigger>Open nested drawer</Drawer.Trigger>
          <Drawer.Content adjacent={{
          inlineEndOffset: 768
        }} chrome="soft" placement={{
          base: 'bottom',
          md: 'end'
        }} size="medium">
            <Drawer.Title>Nested drawer</Drawer.Title>
            <Drawer.Description>
              Escape closes this layer first and restores focus.
            </Drawer.Description>
            <Drawer.Close>Close nested</Drawer.Close>
          </Drawer.Content>
        </Drawer.Root>
        <Drawer.Close>Close outer</Drawer.Close>
      </Drawer.Content>
    </Drawer.Root>
}`,...M.parameters?.docs?.source},description:{story:`Moves a wide drawer from bottom to inline-end at the medium breakpoint and
layers a softer adjacent drawer while preserving focus restoration.

@summary responsive desktop placement with an adjacent nested drawer`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  ...ResponsivePlacementAndNested,
  globals: {
    viewport: {
      value: 'mobile1'
    }
  },
  parameters: {
    ...ResponsivePlacementAndNested.parameters,
    chromatic: {
      viewports: [360]
    }
  },
  play: async ({
    canvasElement
  }) => playResponsiveNestedDrawer(canvasElement, true)
}`,...N.parameters?.docs?.source},description:{story:`Exercises the same nested drawer composition in a compact viewport where
both layers occupy the full screen and enter from the bottom edge.

@summary compact full-screen nested drawer placement`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <Drawer.Trigger>Open long drawer</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Long drawer</Drawer.Title>
          <Drawer.Description>
            The surface scrolls independently.
          </Drawer.Description>
          <Typography>Drawer item 1</Typography>
          <Typography>Drawer item 2</Typography>
          <Typography>Drawer item 3</Typography>
          <Typography>Drawer item 4</Typography>
          <Typography>Drawer item 5</Typography>
          <Typography>Drawer item 6</Typography>
          <Typography>Drawer item 7</Typography>
          <Typography>Drawer item 8</Typography>
          <Typography>Drawer item 9</Typography>
          <Typography>Drawer item 10</Typography>
          <Typography>Drawer item 11</Typography>
          <Typography>Drawer item 12</Typography>
          <Typography>Drawer item 13</Typography>
          <Typography>Drawer item 14</Typography>
          <Typography>Drawer item 15</Typography>
          <Typography>Drawer item 16</Typography>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Content>
      </>
  }
}`,...P.parameters?.docs?.source},description:{story:`Keeps the drawer frame fixed while a long application-owned body scrolls
independently within the viewport-height modal surface.

@summary independently scrolling long drawer content`,...P.parameters?.docs?.description}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <Drawer.Trigger>Open directional drawer</Drawer.Trigger>
        <Drawer.Content placement="start">
          <Drawer.Title>Directional drawer</Drawer.Title>
          <Drawer.Description>
            Slides along the inline axis without vertical movement.
          </Drawer.Description>
          <Drawer.Close>Close directional drawer</Drawer.Close>
        </Drawer.Content>
      </>
  },
  play: async ({
    canvasElement
  }) => {
    const entrySamples = await sampleMotion(() => userEvent.click(within(canvasElement).getByRole('button', {
      name: 'Open directional drawer'
    })));
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Directional drawer'
    });
    const movingEntrySamples = entrySamples.filter(sample => sample.left < -0.5);
    const entryTops = movingEntrySamples.map(sample => sample.top);
    const entryOpacities = movingEntrySamples.map(sample => sample.opacity);
    await expect(movingEntrySamples.length).toBeGreaterThan(0);
    await expect(Math.max(...entryTops) - Math.min(...entryTops)).toBeLessThan(1);
    await expect(Math.min(...entryOpacities)).toBeLessThan(1);
    const exitSamples = await sampleMotion(() => userEvent.click(within(dialog).getByRole('button', {
      name: 'Close directional drawer'
    })));
    const movingExitSamples = exitSamples.filter(sample => sample.left < -0.5);
    const exitTops = movingExitSamples.map(sample => sample.top);
    const exitOpacities = movingExitSamples.map(sample => sample.opacity);
    await expect(movingExitSamples.length).toBeGreaterThan(0);
    await expect(Math.max(...exitTops) - Math.min(...exitTops)).toBeLessThan(1);
    await expect(Math.min(...exitOpacities)).toBeLessThan(1);
  }
}`,...F.parameters?.docs?.source},description:{story:`Opens a start-placed drawer and verifies that entry and exit motion remains
on the logical inline axis without unintended vertical displacement.

@summary logical start-edge entry and exit motion`,...F.parameters?.docs?.description}}};try{A.displayName=`Root`,A.__docgenInfo={description:`Coordinates a modal panel that enters from a logical viewport edge.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`DrawerRootSharedProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`DrawerRootSharedProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`DrawerRootSharedProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`DrawerRootSharedProps`}],description:`Trigger and drawer content.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`DrawerRootSharedProps`},required:!0,tags:{},type:{name:`ReactNode`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ControlledDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ReadOnlyDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`UncontrolledDrawerRootProps`}],description:`Initial open state.`,name:`defaultOpen`,parent:{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ControlledDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ReadOnlyDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`UncontrolledDrawerRootProps`}],description:`Called with the next externally controlled open state.
Called with the next open state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ControlledDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ReadOnlyDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`UncontrolledDrawerRootProps`}],description:`Current externally controlled open state.
Current open state.
Current immutable open state.`,name:`open`,parent:{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},readOnly:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ControlledDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`ReadOnlyDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`UncontrolledDrawerRootProps`}],description:`Marks controlled state immutable.`,name:`readOnly`,parent:{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},triggerless:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggeredDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggeredDrawerRootProps`},{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggeredDrawerRootProps`}],description:`Omits a compound trigger for state controlled by an external action.
Uses a compound trigger to coordinate drawer state.`,name:`triggerless`,parent:{fileName:`breeze-ui/src/primitives/Drawer/Drawer.tsx`,name:`TriggerlessDrawerRootProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{}}}catch{}try{j.displayName=`ControlledTriggerless`,j.__docgenInfo={description:`Opens a triggerless drawer from application-owned state and demonstrates the
framed medium surface, generated close action, and scroll boundary.`,displayName:`ControlledTriggerless`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{summary:`externally triggered controlled drawer state`}}}catch{}try{M.displayName=`ResponsivePlacementAndNested`,M.__docgenInfo={description:`Moves a wide drawer from bottom to inline-end at the medium breakpoint and
layers a softer adjacent drawer while preserving focus restoration.`,displayName:`ResponsivePlacementAndNested`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{summary:`responsive desktop placement with an adjacent nested drawer`}}}catch{}try{N.displayName=`ResponsivePlacementAndNestedCompact`,N.__docgenInfo={description:`Exercises the same nested drawer composition in a compact viewport where
both layers occupy the full screen and enter from the bottom edge.`,displayName:`ResponsivePlacementAndNestedCompact`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{summary:`compact full-screen nested drawer placement`}}}catch{}try{P.displayName=`LongContent`,P.__docgenInfo={description:`Keeps the drawer frame fixed while a long application-owned body scrolls
independently within the viewport-height modal surface.`,displayName:`LongContent`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{summary:`independently scrolling long drawer content`}}}catch{}try{F.displayName=`DirectionalMotion`,F.__docgenInfo={description:`Opens a start-placed drawer and verifies that entry and exit motion remains
on the logical inline axis without unintended vertical displacement.`,displayName:`DirectionalMotion`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/Drawer/Drawer.stories.tsx`,methods:[],props:{},tags:{summary:`logical start-edge entry and exit motion`}}}catch{}I=[`ControlledTriggerless`,`ResponsivePlacementAndNested`,`ResponsivePlacementAndNestedCompact`,`LongContent`,`DirectionalMotion`]}));L();export{j as ControlledTriggerless,F as DirectionalMotion,P as LongContent,M as ResponsivePlacementAndNested,N as ResponsivePlacementAndNestedCompact,I as __namedExportsOrder,A as default,L as n,v as t};