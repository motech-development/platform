import{a as e,n as t,r as n}from"./rolldown-runtime-DaJ6WEGw.js";import{t as r}from"./react-DvlgmmzG.js";import{t as i}from"./jsx-runtime-cM__dR4X.js";import{n as a,t as o}from"./Typography-1Jx1YbNx.js";import{D as s,N as c}from"./icons-p-UCV5fK.js";import{n as l,t as u}from"./UserMenu-DM72eGWt.js";import{n as d,t as f}from"./StoryConstraint-DtKI6sgB.js";import{n as p,t as m}from"./Surface-BNgcQ4ww.js";import{n as h,t as g}from"./Stack-0pHCj1U7.js";var _=n({ControlledDismissal:()=>O,NotificationsAndActions:()=>D,__namedExportsOrder:()=>k,default:()=>E});function v(){let[e,t]=(0,y.useState)(!1),[n,r]=(0,y.useState)(3),i=n>0;return(0,b.jsx)(u,{"aria-label":`Notifications (${n} unread)`,actions:D.args.actions,hasUnread:i,notificationHeading:`Notifications`,notificationState:`${n} unread`,notifications:`Your background task is complete.`,onOpenChange:e=>{t(e),e||r(0)},open:e,unreadLabel:`Notifications (${n} unread)`,userName:`Taylor Reed`})}var y,b,x,S,C,w,T,E,D,O,k,A=t((()=>{y=e(r(),1),d(),c(),h(),p(),a(),l(),b=i(),{expect:x,fn:S,userEvent:C,waitFor:w,within:T}=__STORYBOOK_MODULE_TEST__,E={component:u,decorators:[e=>(0,b.jsx)(f,{size:`application-rail`,children:(0,b.jsx)(m,{border:`none`,padding:`compact`,tone:`inverse`,children:(0,b.jsx)(e,{})})})],title:`Patterns/Application Shell/UserMenu`,parameters:{docs:{description:{component:`Presents represented-user identity, optional notification content, and
application-owned account actions in a keyboard-complete menu.

@summary user identity menu with notifications and account actions`}}}},D={args:{actions:[{icon:(0,b.jsx)(s,{}),id:`sign-out`,label:`Sign out`,onAction:S(),variant:`danger`}],"aria-label":`User menu`,hasUnread:!0,notificationHeading:`Notifications`,notificationState:`1 new`,notifications:(0,b.jsxs)(g,{gap:`xs`,children:[(0,b.jsx)(o,{as:`strong`,children:`Background task complete`}),(0,b.jsx)(o,{as:`span`,children:`Completed 4 minutes ago`})]}),userName:`Taylor Reed`},play:async({canvasElement:e})=>{let t=T(e).getByRole(`button`,{name:`User menu, Unread notifications`}),n=T(t).getByRole(`img`,{name:`Taylor Reed`});await x(n.getBoundingClientRect().width).toBe(n.getBoundingClientRect().height),await x(n.getBoundingClientRect().width).toBeGreaterThan(0),await C.click(t),await x(T(document.body).getByText(`Background task complete`)).toBeVisible();let r=T(document.body).getByRole(`menuitem`,{name:`Sign out`});await C.hover(r),await x(r).toHaveAttribute(`data-hovered`,`true`),await C.unhover(r),await x(r).not.toHaveAttribute(`data-hovered`)}},O={...D,play:async({canvasElement:e})=>{let t=T(e),n=t.getByRole(`button`,{name:`Notifications (3 unread)`});await C.click(n),await C.keyboard(`{Escape}`),await w(()=>x(t.getByRole(`button`,{name:`Notifications (0 unread)`})).toHaveFocus())},render:v},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    actions: [{
      icon: <SignOutIcon />,
      id: 'sign-out',
      label: 'Sign out',
      onAction: fn(),
      variant: 'danger'
    }],
    'aria-label': 'User menu',
    hasUnread: true,
    notificationHeading: 'Notifications',
    notificationState: '1 new',
    notifications: <Stack gap="xs">
        <Typography as="strong">Background task complete</Typography>
        <Typography as="span">Completed 4 minutes ago</Typography>
      </Stack>,
    userName: 'Taylor Reed'
  },
  play: async ({
    canvasElement
  }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'User menu, Unread notifications'
    });
    const avatar = within(trigger).getByRole('img', {
      name: 'Taylor Reed'
    });
    await expect(avatar.getBoundingClientRect().width).toBe(avatar.getBoundingClientRect().height);
    await expect(avatar.getBoundingClientRect().width).toBeGreaterThan(0);
    await userEvent.click(trigger);
    await expect(within(document.body).getByText('Background task complete')).toBeVisible();
    const signOut = within(document.body).getByRole('menuitem', {
      name: 'Sign out'
    });
    await userEvent.hover(signOut);
    await expect(signOut).toHaveAttribute('data-hovered', 'true');
    await userEvent.unhover(signOut);
    await expect(signOut).not.toHaveAttribute('data-hovered');
  }
}`,...D.parameters?.docs?.source},description:{story:`Opens from a shell-compatible identity trigger, exposes unread state in its
accessible name, and presents notification content before a danger action.

@summary unread notification content and keyboard-complete account action`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  ...NotificationsAndActions,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Notifications (3 unread)'
    });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('button', {
      name: 'Notifications (0 unread)'
    })).toHaveFocus());
  },
  render: ControlledNotificationsMenu
}`,...O.parameters?.docs?.source},description:{story:`Reports dismissal to application state, which marks the displayed unread
content read and updates the complete localized trigger name.

@summary controlled dismissal with count-aware unread state`,...O.parameters?.docs?.description}}};try{E.displayName=`UserMenu`,E.__docgenInfo={description:`Presents user identity, notification content, and keyboard-complete account
actions.`,displayName:`UserMenu`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/UserMenu/UserMenu.stories.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Accessible name for the menu trigger.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!0,tags:{},type:{name:`string`}},actions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Ordered application-owned actions.`,name:`actions`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!0,tags:{},type:{name:`readonly UserMenuAction[]`}},hasUnread:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:"Indicates unread notification content. Defaults to `false`.",name:`hasUnread`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},notifications:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Optional notification or account content above the actions.`,name:`notifications`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!1,tags:{},type:{name:`ReactNode`}},notificationHeading:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Optional heading displayed above notification content.`,name:`notificationHeading`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!1,tags:{},type:{name:`ReactNode`}},notificationState:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Optional count or state displayed beside the notification heading.`,name:`notificationState`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!1,tags:{},type:{name:`ReactNode`}},src:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Optional avatar image URL.`,name:`src`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!1,tags:{},type:{name:`string | undefined`}},unreadLabel:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Complete accessible trigger name used when unread content is present.`,name:`unreadLabel`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!1,tags:{},type:{name:`string | undefined`}},userName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`}],description:`Visible represented user name.`,name:`userName`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuSharedProps`},required:!0,tags:{},type:{name:`string`}},defaultOpen:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`ControlledUserMenuProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UncontrolledUserMenuProps`}],description:"Initial menu state. Defaults to `false`.",name:`defaultOpen`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`ControlledUserMenuProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},onOpenChange:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`ControlledUserMenuProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UncontrolledUserMenuProps`}],description:`Called with the next menu state.`,name:`onOpenChange`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`ControlledUserMenuProps`},required:!1,tags:{},type:{name:`((open: boolean) => void) | ((open: boolean) => void) | undefined`}},open:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`ControlledUserMenuProps`},{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UncontrolledUserMenuProps`}],description:`Current menu state.`,name:`open`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`ControlledUserMenuProps`},required:!1,tags:{},type:{name:`boolean | undefined`}}},tags:{summary:`user identity menu with notifications and account actions`}}}catch{}try{D.displayName=`NotificationsAndActions`,D.__docgenInfo={description:`Opens from a shell-compatible identity trigger, exposes unread state in its
accessible name, and presents notification content before a danger action.`,displayName:`NotificationsAndActions`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/UserMenu/UserMenu.stories.tsx`,methods:[],props:{},tags:{summary:`unread notification content and keyboard-complete account action`}}}catch{}try{O.displayName=`ControlledDismissal`,O.__docgenInfo={description:`Reports dismissal to application state, which marks the displayed unread
content read and updates the complete localized trigger name.`,displayName:`ControlledDismissal`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/UserMenu/UserMenu.stories.tsx`,methods:[],props:{},tags:{summary:`controlled dismissal with count-aware unread state`}}}catch{}k=[`NotificationsAndActions`,`ControlledDismissal`]}));A();export{O as ControlledDismissal,D as NotificationsAndActions,k as __namedExportsOrder,E as default,A as n,_ as t};