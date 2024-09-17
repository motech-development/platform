import{j as e,B as i}from"./BaseStyles-ba442780.js";import{d as o}from"./index-49721cb5.js";import{B as n}from"./Button-46c99480.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./index-633d3215.js";import"./BaseButton-7c7255d1.js";import"./polished.esm-8995ec32.js";import"./Loader-4ebfd022.js";const f={component:n,decorators:[o.withKnobs]},c={Danger:"danger",Primary:"primary",Secondary:"secondary",Success:"success"},l={Large:"lg",Medium:"md",Small:"sm"},s={name:"Basic button",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(i,{}),e.jsx(n,{block:o.boolean("Block display",!1),colour:o.select("Colour",c,"primary"),size:o.select("Size",l,"md"),loading:o.boolean("Loading",!1),children:o.text("Title","Button")})]})};var r,t,a;s.parameters={...s.parameters,docs:{...(r=s.parameters)==null?void 0:r.docs,source:{originalSource:`{
  name: 'Basic button',
  render: () => <>
      <BaseStyles />
      <Button block={boolean('Block display', false)} colour={select('Colour', colour, 'primary') as 'danger' | 'primary' | 'secondary' | 'success'} size={select('Size', size, 'md') as 'sm' | 'md' | 'lg'} loading={boolean('Loading', false)}>
        {text('Title', 'Button')}
      </Button>
    </>
}`,...(a=(t=s.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const S=["BasicButton"];export{s as BasicButton,S as __namedExportsOrder,f as default};
