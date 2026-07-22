import{a as e,i as t}from"./preload-helper-CT_b8DTk.js";import{r as n}from"./iframe-q_a4TWX4.js";import{i as r,n as i,r as a,t as o}from"./NavigationList-DHVO9NFD.js";import{n as s,t as c}from"./Stack-CT7mlz7n.js";var l=e({StatesAndOrientations:()=>m,__namedExportsOrder:()=>h,default:()=>p}),u,d,f,p,m,h,g=t((()=>{s(),r(),u=n(),{expect:d,within:f}=__STORYBOOK_MODULE_TEST__,p={component:a,decorators:[e=>(Object.assign(i.Item,{displayName:`NavigationList.Item`}),Object.assign(i.Root,{displayName:`NavigationList.Root`}),(0,u.jsx)(e,{}))],subcomponents:{Item:o},title:`Primitives/Navigation/NavigationList`},m={args:{"aria-label":`Vertical navigation`,children:null},play:async({canvasElement:e})=>{let t=f(e);await d(t.getAllByRole(`navigation`)).toHaveLength(2),await Promise.all(t.getAllByRole(`link`,{name:`Overview`}).map(e=>d(e).toHaveAttribute(`aria-current`,`page`))),await Promise.all(t.getAllByText(`Admin`).map(e=>d(e).toHaveAttribute(`aria-disabled`,`true`)))},render:()=>(0,u.jsxs)(c,{gap:`xl`,children:[(0,u.jsxs)(i.Root,{"aria-label":`Vertical navigation`,children:[(0,u.jsx)(i.Item,{current:!0,href:`/overview`,id:`overview`,children:`Overview`}),(0,u.jsx)(i.Item,{href:`/team`,id:2,children:`Team`}),(0,u.jsx)(i.Item,{disabled:!0,href:`/admin`,id:`admin`,children:`Admin`})]}),(0,u.jsxs)(i.Root,{"aria-label":`Horizontal navigation`,orientation:`horizontal`,children:[(0,u.jsx)(i.Item,{current:!0,href:`/overview`,id:`overview`,children:`Overview`}),(0,u.jsx)(i.Item,{href:`/team`,id:2,children:`Team`}),(0,u.jsx)(i.Item,{disabled:!0,href:`/admin`,id:`admin`,children:`Admin`})]})]})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Vertical navigation',
    children: null
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('navigation')).toHaveLength(2);
    await Promise.all(canvas.getAllByRole('link', {
      name: 'Overview'
    }).map(link => expect(link).toHaveAttribute('aria-current', 'page')));
    await Promise.all(canvas.getAllByText('Admin').map(item => expect(item).toHaveAttribute('aria-disabled', 'true')));
  },
  render: () => <Stack gap="xl">
      <NavigationList.Root aria-label="Vertical navigation">
        <NavigationList.Item current href="/overview" id="overview">
          Overview
        </NavigationList.Item>
        <NavigationList.Item href="/team" id={2}>
          Team
        </NavigationList.Item>
        <NavigationList.Item disabled href="/admin" id="admin">
          Admin
        </NavigationList.Item>
      </NavigationList.Root>
      <NavigationList.Root aria-label="Horizontal navigation" orientation="horizontal">
        <NavigationList.Item current href="/overview" id="overview">
          Overview
        </NavigationList.Item>
        <NavigationList.Item href="/team" id={2}>
          Team
        </NavigationList.Item>
        <NavigationList.Item disabled href="/admin" id="admin">
          Admin
        </NavigationList.Item>
      </NavigationList.Root>
    </Stack>
}`,...m.parameters?.docs?.source},description:{story:`Compares vertical and horizontal labelled navigation landmarks while
preserving current-page and disabled destination semantics in each layout.

@summary navigation orientations with current and disabled destinations`,...m.parameters?.docs?.description}}};try{p.displayName=`Root`,p.__docgenInfo={description:`Renders a navigation landmark with horizontal or vertical list layout.`,displayName:`Root`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/NavigationList/NavigationList.stories.tsx`,methods:[],props:{children:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/NavigationList/NavigationList.tsx`,name:`NavigationListRootProps`}],description:`Navigation items.`,name:`children`,parent:{fileName:`breeze-ui/src/primitives/NavigationList/NavigationList.tsx`,name:`NavigationListRootProps`},required:!0,tags:{},type:{name:`ReactNode`}},orientation:{defaultValue:{value:`vertical`},declarations:[{fileName:`breeze-ui/src/primitives/NavigationList/NavigationList.tsx`,name:`NavigationListRootProps`}],description:"Layout direction. Defaults to `vertical`.",name:`orientation`,parent:{fileName:`breeze-ui/src/primitives/NavigationList/NavigationList.tsx`,name:`NavigationListRootProps`},required:!1,tags:{},type:{name:`"horizontal" | "vertical" | undefined`}},ref:{defaultValue:null,declarations:[{fileName:`breeze-ui/src/primitives/NavigationList/NavigationList.tsx`,name:`NavigationListRootProps`}],description:`Ref to the rendered navigation landmark.`,name:`ref`,parent:{fileName:`breeze-ui/src/primitives/NavigationList/NavigationList.tsx`,name:`NavigationListRootProps`},required:!1,tags:{},type:{name:`Ref<HTMLElement> | undefined`}}},tags:{}}}catch{}try{m.displayName=`StatesAndOrientations`,m.__docgenInfo={description:`Compares vertical and horizontal labelled navigation landmarks while
preserving current-page and disabled destination semantics in each layout.`,displayName:`StatesAndOrientations`,filePath:`/home/runner/work/platform/platform/packages/breeze-ui/src/primitives/NavigationList/NavigationList.stories.tsx`,methods:[],props:{},tags:{summary:`navigation orientations with current and disabled destinations`}}}catch{}h=[`StatesAndOrientations`]}));g();export{m as StatesAndOrientations,h as __namedExportsOrder,p as default,g as n,l as t};