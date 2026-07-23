import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-CQHtwZcQ.js";import{n as r,t as i}from"./Typography-CB5sgMJ5.js";import{D as a,N as o}from"./icons-Cg1FNHcV.js";import{n as s,t as c}from"./UserMenu-i842PCZG.js";import{n as l,t as u}from"./StoryConstraint-yY2orZcv.js";import{n as d,t as f}from"./Surface-CQL1S66t.js";import{n as p,t as m}from"./Stack-CVdmyomW.js";var h=e({NotificationsAndActions:()=>S,__namedExportsOrder:()=>C,default:()=>x}),g,_,v,y,b,x,S,C,w=t((()=>{l(),o(),p(),d(),r(),s(),g=n(),{expect:_,fn:v,userEvent:y,within:b}=__STORYBOOK_MODULE_TEST__,x={component:c,decorators:[e=>(0,g.jsx)(u,{size:`application-rail`,children:(0,g.jsx)(f,{border:`none`,padding:`compact`,tone:`inverse`,children:(0,g.jsx)(e,{})})})],title:`Patterns/Application Shell/UserMenu`,parameters:{docs:{description:{component:`Presents represented-user identity, optional notification content, and
application-owned account actions in a keyboard-complete menu.

@summary user identity menu with notifications and account actions`}}}},S={args:{actions:[{icon:(0,g.jsx)(a,{}),id:`sign-out`,label:`Sign out`,onAction:v(),variant:`danger`}],"aria-label":`User menu`,hasUnread:!0,notificationHeading:`Notifications`,notificationState:`1 new`,notifications:(0,g.jsxs)(m,{gap:`xs`,children:[(0,g.jsx)(i,{as:`strong`,children:`Background task complete`}),(0,g.jsx)(i,{as:`span`,children:`Completed 4 minutes ago`})]}),userName:`Taylor Reed`},play:async({canvasElement:e})=>{let t=b(e).getByRole(`button`,{name:`User menu, Unread notifications`}),n=b(t).getByRole(`img`,{name:`Taylor Reed`});await _(n.getBoundingClientRect().width).toBe(n.getBoundingClientRect().height),await _(n.getBoundingClientRect().width).toBeGreaterThan(0),await y.click(t),await _(b(document.body).getByText(`Background task complete`)).toBeVisible();let r=b(document.body).getByRole(`menuitem`,{name:`Sign out`});await y.hover(r),await _(r).toHaveAttribute(`data-hovered`,`true`),await y.unhover(r),await _(r).not.toHaveAttribute(`data-hovered`)}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source},description:{story:`Opens from a shell-compatible identity trigger, exposes unread state in its
accessible name, and presents notification content before a danger action.

@summary unread notification content and keyboard-complete account action`,...S.parameters?.docs?.description}}};try{x.displayName=`UserMenu`,x.__docgenInfo={description:`Presents user identity, notification content, and keyboard-complete account
actions.`,displayName:`UserMenu`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/UserMenu/UserMenu.stories.tsx`,methods:[],props:{"aria-label":{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:`Accessible name for the menu trigger.`,name:`aria-label`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!0,tags:{},type:{name:`string`}},actions:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:`Ordered application-owned actions.`,name:`actions`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!0,tags:{},type:{name:`readonly UserMenuAction[]`}},hasUnread:{defaultValue:{value:`false`},declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:"Indicates unread notification content. Defaults to `false`.",name:`hasUnread`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!1,tags:{},type:{name:`boolean | undefined`}},notifications:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:`Optional notification or account content above the actions.`,name:`notifications`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!1,tags:{},type:{name:`ReactNode`}},notificationHeading:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:`Optional heading displayed above notification content.`,name:`notificationHeading`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!1,tags:{},type:{name:`ReactNode`}},notificationState:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:`Optional count or state displayed beside the notification heading.`,name:`notificationState`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!1,tags:{},type:{name:`ReactNode`}},src:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:`Optional avatar image URL.`,name:`src`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!1,tags:{},type:{name:`string | undefined`}},userName:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`}],description:`Visible represented user name.`,name:`userName`,parent:{fileName:`breeze-ui/src/patterns/UserMenu/UserMenu.tsx`,name:`UserMenuProps`},required:!0,tags:{},type:{name:`string`}}},tags:{summary:`user identity menu with notifications and account actions`}}}catch{}try{S.displayName=`NotificationsAndActions`,S.__docgenInfo={description:`Opens from a shell-compatible identity trigger, exposes unread state in its
accessible name, and presents notification content before a danger action.`,displayName:`NotificationsAndActions`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/patterns/UserMenu/UserMenu.stories.tsx`,methods:[],props:{},tags:{summary:`unread notification content and keyboard-complete account action`}}}catch{}C=[`NotificationsAndActions`]}));w();export{S as NotificationsAndActions,C as __namedExportsOrder,x as default,w as n,h as t};